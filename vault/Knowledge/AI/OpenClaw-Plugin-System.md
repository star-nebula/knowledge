---
type: concept
tags:
  - AI
  - OpenClaw
  - Plugin
  - 插件系统
domain: AI
description: Plugin System——插件发现/加载/生命周期管理，70+ API 方法，OpenClaw 的扩展中枢
created: 2026-09-07
updated: 2026-09-07
status: integrated
source: "[[Resources/OpenClaw/核心模块/05-plugin-system]]、[[Resources/OpenClaw/核心组件/03-PluginLoader]]"
related:
  - "[[🦀 OpenClaw-MOC]]"
  - "[[OpenClaw-Channels]]"
  - "[[OpenClaw-Tools-System]]"
  - "[[OpenClaw-Hook-System]]"
  - "[[OpenClaw-Config-System]]"
category: ["🦀 OpenClaw", "扩展层"]
---

# Plugin System 插件系统

**源码路径**：`src/plugins/` + `src/plugin-sdk/`（~300 文件）
**核心文件**：`loader.ts`（121KB）

Plugin System 是 OpenClaw 的扩展中枢。30+ 消息渠道、40+ 模型提供商均以插件形式集成。

## 通俗类比：PluginLoader 是「App Store」

PluginLoader 负责：
1. **发现插件** — 扫描文件系统，找到所有已安装插件
2. **验证插件** — 检查插件清单是否合法
3. **加载插件** — 执行插件默认导出，拿到 `OpenClawPluginDefinition`
4. **激活插件** — 调用注册方法，把工具/频道/钩子注册到系统
5. **生命周期管理** — 启用/禁用/重载

## 核心职责

| 职责 | 说明 |
|------|------|
| 插件发现 | 扫描文件系统、npm 包、远程源 |
| 插件加载 | 加载模块、解析 SDK 别名、构建 API |
| 注册管理 | 管理插件注册的命令、渠道、工具、钩子 |
| 生命周期 | 安装、激活、停用、卸载 |
| 配置管理 | 插件配置验证、策略控制 |
| SDK 暴露 | 提供 70+ API 方法 |

## 插件 API（OpenClawPluginApi）

```typescript
interface OpenClawPluginApi {
  registerTool();           // 注册工具
  registerHook();           // 注册钩子
  registerChannel();        // 注册渠道
  registerGatewayMethod();  // 注册网关方法
  registerCli();            // 注册CLI命令
  registerHttpRoute();      // 注册HTTP路由
  registerAgentHarness();         // Agent 执行器
  registerEmbeddingProvider();    // 嵌入提供者
  registerSpeechProvider();       // 语音提供者
  registerModelCatalogProvider(); // 模型目录
  registerMemoryCapability();     // 内存能力
  // ... 60+ 更多
}
```

## 插件生命周期（10 步加载流程）

```
discoverOpenClawPlugins()          // 1. 发现候选
  → loadPluginManifestRegistry()   // 2. 加载清单
  → resolvePluginSdkAlias...()     // 3. 解析SDK别名
  → resolveActivationSource()      // 4. 确定激活状态
  → createPluginModuleLoader()     // 5. 创建模块加载器
  → buildPluginApi()               // 6. 构建API对象
  → 加载插件模块(Jiti)             // 7. TypeScript运行时编译
  → 获取 default export            // 8. 拿到 PluginDefinition
  → plugin.register(api)           // 9. 执行注册
  → 缓存加载结果                   // 10. 避免重复加载
```

## 三种插件来源

| 来源 | 目录 | 安全性 |
|------|------|--------|
| bundled | 内置打包 | 可信 |
| managed | 插件/包管理 | 可信（来源可控） |
| workspace | 用户工作区 | 受信任的本地代码 |

## SDK 架构

`plugin-sdk/` 提供插件开发者所有类型和接口：

| 子模块 | 内容 |
|--------|------|
| `agent-runtime.ts` | Agent 运行时接口 |
| `channel-core.ts` | 渠道核心类型 |
| `channel-contract.ts` | 渠道契约接口 |
| `browser-bridge.ts` | 浏览器自动化接口 |
| `approval-runtime.ts` | 审批流程接口 |

## 设计模式

| 模式 | 应用 |
|------|------|
| 注册表模式 | 插件通过 register*() 注册能力 |
| 生命周期管理 | 发现→加载→激活→停用→卸载 |
| API 构建器 | buildPluginApi() 按需构建 |
| SDK 别名解析 | 自动解析 @openclaw/sdk 路径 |
| 懒加载 | 插件模块延迟加载 |

## 依赖关系

- **被依赖**：Gateway Server（初始化加载）、CLI（命令注册）
- **依赖**：Config System（插件配置）、SDK 包
