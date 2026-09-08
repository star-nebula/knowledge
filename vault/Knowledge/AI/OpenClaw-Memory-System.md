---
type: concept
tags:
  - AI
  - OpenClaw
  - Memory
  - 记忆系统
  - 向量搜索
  - SQLite
domain: AI
description: OpenClaw 记忆系统——Memory Flush 门控、混合搜索（BM25+向量+MMR+时间衰减）、SQLite 8 表 schema、Session Memory Hook
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/OpenClaw 记忆模块详解]]"
related:
  - "[[🦀 OpenClaw-MOC]]"
  - "[[OpenClaw-Agent-Engine]]"
  - "[[OpenClaw-Context-Engine]]"
  - "[[OpenClaw-Plugin-System]]"
  - "[[OpenClaw-Memory-对比分析]]"
  - "[[OpenClaw-Security]]"
category: ["🦀 OpenClaw", "支撑层"]
---

# OpenClaw 记忆系统

> 基于 OpenClaw 源码 65+ 文件的精确分析。Memory 模块是 OpenClaw 中最大的跨层系统。

## 模块总览

两个核心职责通过**内存门控（Memory Flush Gate）**衔接：

| 职责 | 说明 |
|------|------|
| **Memory Flush** | 会话上下文超过模型预算时，将对话持久化到工作区 memory 文件 |
| **Memory Search** | 基于嵌入向量 + FTS5 全文搜索的工作区文件语义索引与检索 |

## 架构分层

```
Hook 层 (session-memory hook)          — /new /reset 自动保存会话摘要
Flush 引擎 (agent-runner-memory.ts)     — 预检查、门控、嵌入式 agent 调用、失败重试
插件注册表 (memory-state.ts)            — 单例状态、能力注册、flush plan 解析
嵌入提供者 (memory-embedding-providers) — 全局 Map 注册表
搜索配置 (memory-search.ts)             — defaults + overrides 合并
Memory Host SDK (packages/)             — SQLite 索引、FTS5、sqlite-vec、混合搜索
根文件层 (root-memory-files.ts)         — MEMORY.md 定位与管理
```

## Memory Flush（会话持久化）

### 触发链路

两个入口在 agent runner 的 reply 管线中：

1. **`runPreflightCompactionIfNeeded`** — 回复前：超预算时先 compact（软保存到新 session）
2. **`runMemoryFlushIfNeeded`** — 回复后：将已 compact 的内容持久化为 memory 文件

### 门控逻辑

```
threshold = contextWindowTokens - reserveTokensFloor - softThresholdTokens
触发条件: totalTokens >= threshold && 未在本次 compaction 周期内 flush 过
```

双触发路径：
- **Token 路径**：`totalTokens >= threshold`
- **Transcript 字节路径**：`transcriptByteSize >= forceFlushTranscriptBytes`

防重复门控：`hasAlreadyFlushedForCurrentCompaction` 比较 `compactionCount` 和 `memoryFlushCompactionCount`。

### Flush 执行引擎（9 步）

```
1. resolveMemoryFlushPlan()              解析插件提供的 flush 计划
2. 可写性检查（sandbox 需 workspaceAccess === "rw"）
3. 读取 session transcript 快照（反向扫描 64KB 块）
4. 门控判断 shouldRunMemoryFlush()
5. 设置 reply phase → "memory_flushing"
6. ensureMemoryFlushTargetFile()
7. 调用嵌入式 agent (runEmbeddedAgent)
8. 成功后更新 session entry（memoryFlushAt, memoryFlushCompactionCount）
9. 失败处理（计数+1，上限3次，达上限发 memory_flush_exhausted）
```

关键常量：`MAX_FLUSH_FAILURES = 3`

### Flush Plan

```typescript
type MemoryFlushPlan = {
  softThresholdTokens: number;
  forceFlushTranscriptBytes: number;
  reserveTokensFloor: number;
  model?: string;           // 可选廉价模型
  prompt: string;
  systemPrompt: string;
  relativePath: string;     // 工作区目标文件路径
};
```

## Memory Search（语义搜索与索引）

### 配置解析

`resolveMemorySearchConfig` 使用 defaults + overrides 合并模式：

| 子块 | 默认值 | 说明 |
|------|--------|------|
| `sources` | `["memory"]` | 搜索数据源 |
| `provider` | `"openai"` | 嵌入模型提供者 |
| `store` | SQLite | 存储驱动 + FTS 分词器 |
| `chunking` | `tokens=400, overlap=80` | 文本分块策略 |
| `sync` | `onSessionStart=true, watch=true` | 同步触发策略 |
| `query` | `maxResults=6, minScore=0.35` | 搜索参数 |
| `hybrid` | `enabled=true, vectorWeight=0.7` | 混合搜索权重 |
| `mmr` | `enabled=false, lambda=0.7` | 最大边际相关性重排 |
| `temporalDecay` | `enabled=false, halfLifeDays=30` | 时间衰减 |
| `cache` | `enabled=true` | 嵌入缓存 |

### 四层混合搜索管道

```
用户查询
  ├── BM25 文本评分（textWeight: 0.3）       ← 关键词精确匹配
  ├── 向量语义评分（vectorWeight: 0.7）      ← 语义理解
  ├── MMR 重排序（可选，lambda: 0.7）        ← 多样性保障
  └── 时间衰减（可选，halfLifeDays: 30）     ← 时效性偏好
```

候选池扩大 4 倍再融合排序。权重自动归一化：`vectorWeight + textWeight = 1.0`

### SQLite Schema（8 张表）

```sql
memory_index_meta          -- 键值元数据
memory_index_sources       -- 索引文件源（path + source 联合主键）
memory_index_chunks        -- 文本分块 + 嵌入向量
memory_embedding_cache     -- 嵌入缓存（去重 + 加速）
memory_index_state         -- 修订追踪（增量同步）
memory_index_chunks_fts    -- FTS5 全文搜索虚拟表
memory_index_chunks_vec    -- sqlite-vec 向量表
```

触发器机制：sources 和 chunks 表上的 INSERT/UPDATE/DELETE 触发器自动递增 `revision`。

### 同步策略

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `onSessionStart` | true | session 启动时触发同步 |
| `onSearch` | true | 搜索前检查并同步 |
| `watch` | true | 文件监控（debounce 1.5s） |
| `sessions.deltaBytes` | 100000 | session 文件增长阈值 |
| `sessions.deltaMessages` | 50 | session 消息数增长阈值 |
| `sessions.postCompactionForce` | true | compaction 后强制同步 |

### 嵌入提供者系统

全局 `Symbol.for("openclaw.memoryEmbeddingProviders")` 注册表。

```typescript
type MemoryEmbeddingProviderAdapter = {
  id: string;
  transport?: "local" | "remote";
  supportsMultimodalEmbeddings?: (params) => boolean;
  create: (options) => Promise<CreateResult>;
};
```

生命周期：adapter → register → create → embedQuery/embedBatch → close

## 插件系统集成

### Memory 插件 State

```typescript
type MemoryPluginState = {
  capability?: MemoryPluginCapabilityRegistration;    // 主 memory 插件
  corpusSupplements: MemoryCorpusSupplementRegistration[];   // 语料补充
  promptSupplements: MemoryPromptSupplementRegistration[];   // 提示词补充
};
```

可替换组件：刷新计划、搜索运行时、提示构建、公共制品、嵌入提供者——插件可仅替换刷新逻辑而保留搜索运行时。

### Memory Runtime 解析

`getActiveMemorySearchManager` 按优先级尝试加载 runtime 插件 → 解析配置 → 获取 pluginId → 从 registry 获取。

## Session Memory Hook

位于 `src/hooks/bundled/session-memory/handler.ts`，在 `/new` 或 `/reset` 命令时自动执行。

执行流程：监听命令 → 读取最近 15 条消息 → 生成文件名 slug（LLM 或时间） → 写入 `memory/YYYY-MM-DD-<slug>.md` → 异步执行不阻塞。

## 根 Memory 文件

```typescript
const CANONICAL_ROOT_MEMORY_FILENAME = "MEMORY.md";
const LEGACY_ROOT_MEMORY_FILENAME = "memory.md";
```

`resolveCanonicalRootMemoryFile(workspaceDir)` 返回真实文件路径（排除符号链接）。

## 运行时监控

进程级内存压力检测，三级告警：threshold → growth → critical，带 5 分钟去重窗口。

- RSS 警告：1.5GB / 临界：3.0GB
- Heap 警告：1.0GB / 临界：2.0GB

## 关键设计约束

1. **存储默认 SQLite**：所有 memory 索引/缓存均为 SQLite
2. **Plugin SDK 隔离**：core 不直接引用 plugin 内部实现
3. **单次写入防重复**：同一 compaction 周期仅 flush 一次
4. **失败上限**：连续 3 次失败后跳过，等下次 compaction 重试
5. **Sandbox 写保护**：sandbox 环境仅在 `workspaceAccess === "rw"` 时可写入
6. **向后兼容**：旧版 `memory.md` 文件名保持识别但不在扫描中包含
