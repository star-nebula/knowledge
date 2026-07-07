---
tags:
  - 作坊
  - AI生图
  - AI视频
  - ComfyUI
  - 阿里云
  - Python
  - 电商
---

# AI电商换装视频生成系统

> 面向电商内容创作场景的 AI 自动化 Demo：「产品平铺图 + 模特图 → AI换装 → 分镜视频复刻」，全云端方案，无需本地 GPU。

## 项目定位

这是一个面试 Demo 项目，针对 **AI自动化开发工程师** 岗位（月薪 8K-20K）的 JD 逐条设计。项目模拟真实电商场景：一件 BOTU 黑色 T 恤的平铺图，通过 AI 换装穿到模特身上，再用参考视频的运镜/动作驱动生成动态展示视频。

**一句话**：产品图进去，商品展示视频出来，全程 AI 自动化。

---

## 流水线架构

```
产品图(T恤平铺) + 模特图         模板视频.mp4
        │                            │
        ▼                            │
┌──────────────────────┐              │
│  Stage 1: AI虚拟换装  │              │
│  阿里云 OutfitAnyone  │              │
│  输出: tryon_result   │              │
└──────────┬───────────┘              │
           │                          │
           ▼                          ▼
┌──────────────────────────────────────────┐
│  Stage 2: 分镜视频生成                    │
│  万相 animate-mix（视频换人）              │
│  FFmpeg 场景检测 → 分段 → 逐段换人 → 拼接  │
│  失败自动回退: videoedit 指令式编辑        │
│  输出: final_showcase.mp4                 │
└──────────────────────────────────────────┘
```

**和传统 I2V（图生视频）的区别**：不是「首帧图片 + 文本 prompt 生成视频」，而是「直接把模板视频中的人物替换为换装模特」——运镜、动作、背景、光影全部 1:1 复刻，比文本描述精准得多。

---

## 技术选型

| 技术决策 | 方案 | 为什么选这个 |
|---------|------|-------------|
| AI换装 | 阿里云 OutfitAnyone (aitryon-plus) | 云端 API，即开即用；Plus 版画质优于基础版 |
| 视频换人（主） | 万相 wan2.2-animate-mix | 图片人物替换视频主角，保留原运镜/动作/背景，无需 prompt |
| 视频换人（回退） | 万相 wan2.7-videoedit | 指令式编辑，不限视角（仰视/倒置/侧脸），主方案崩溃时自动切换 |
| 场景检测 | FFmpeg select/scene 滤镜 | 纯命令行，无需依赖深度学习模型 |
| 分镜拼接 | FFmpeg concat demuxer | stream copy 无损拼接，失败回退重新编码 |
| 临时存储 | 阿里云 OSS + 签名 URL | 万相 API 需要公网可访问的 URL，OSS 签名 URL 1 小时有效期，任务结束自动清理 |
| CLI 入口 | Python argparse | 六种运行模式统一调度 |

---

## 6 种运行模式

```powershell
# 完整链路（一口气跑完）
python main.py --mode full `
  --model-image input/AI模特.jpg `
  --garment-image input/产品图.jpg `
  --template-video input/模板视频.mp4

# 仅换装
python main.py --mode tryon `
  --model-image input/AI模特.jpg `
  --garment-image input/产品图.jpg

# 分镜视频生成（需先有换装图）
python main.py --mode shotwise `
  --image output/tryon_result.jpg `
  --template-video input/模板视频.mp4

# 单分镜逐步确认（生成一个→看效果→满意→生成下一个）
python main.py --mode shotwise --shot-index 0 ...
python main.py --mode shotwise --shot-index 1 ...

# 合并已生成的分镜
python main.py --mode compose

# 调试：列出分镜结构
python main.py --mode list-shots --template-video input/模板视频.mp4
```

---

## 核心亮点

### 1. 双引擎故障回退

animate-mix 适合正脸/常规视角，但遇到仰视、倒置、侧脸等极端镜头会崩溃。系统检测到失败后自动切换到 videoedit，保证流水线不中断：

```
animate-mix 提交
  ├── 成功 → 下载结果 ✓
  └── 失败 → 自动回退 videoedit → 下载结果 ✓
```

可以通过 `--videoedit-shots "0,3"` 手动指定哪些分镜直接走 videoedit，跳过无意义的失败等待。

### 2. 短分镜自适应处理

万相要求视频片段 ≥2 秒，但模板视频的分镜可能只有 0.8 秒。系统自动检测短片段，用 FFmpeg `setpts` 慢放补足到 2.5 秒 → 提交万相 → 结果用 `setpts` 加速还原，保留原始时长和节奏：

```
0.8s 分镜 → 慢放至 2.5s → 万相换人 → 加速回 0.8s → 拼入最终视频
```

### 3. 模块化引擎设计

代码从两个独立脚本（`tryon_demo.py` 1300+ 行 + `wan_r2v_demo.py` 1300+ 行）重构为四个独立引擎：

| 引擎 | 职责 | 接口 |
|------|------|------|
| `tryon_engine.py` | OutfitAnyone 换装 | `tryon(model, garment, output)` |
| `wan_engine.py` | 万相视频 + FFmpeg | `shotwise()`, `process_single_shot()` |
| `oss_uploader.py` | OSS 上传/签名/清理 | `upload(path) → (url, key)` |
| `shot_composer.py` | FFmpeg concat 拼接 | `compose(clips, output)` |

消除了两个 demo 脚本中 80+ 行重复的 OSS/retry/env 代码。

### 4. 逐步确认工作流

不是「一把梭等 30 分钟看结果」，而是支持逐镜生成→确认→迭代：

```
1. list-shots → 看分镜结构（6 个镜头，各 1-3 秒）
2. shotwise --shot-index 0 → 生成第 1 个分镜 → 播放查看
3. 满意 → shotwise --shot-index 1 → 下一个
4. 全部确认 → compose → 拼接成最终视频
```

---

## 值得讲的「坑」

### 坑 1：animate-mix 在非正面视角崩溃

模板视频中有仰拍女模特倒立、背身回头等镜头，animate-mix 的人脸检测把这些判定为异常，直接拒绝生成。

**解法**：引入 videoedit 作为回退引擎。videoedit 是纯指令式编辑（"把视频中的人换成参考图的人"），不做人脸姿态检测，天然支持任意视角。策略是 animate-mix 优先（质量更好），失败自动降级。

### 坑 2：万相要求视频 ≥2 秒

模板视频切镜后，部分分镜只有 0.5-1 秒，直接提交万相会报参数错误。

**解法**：两条路——①合并短分镜（`--min-duration 2`），把 0.5s + 1.2s 合并成一个提交；②慢放补足（`--min-duration 0`），用 FFmpeg `setpts` 把 0.8s 慢放到 2.5s，生成后再加速还原。方案②保留原始切镜节奏，但有轻微画质损失。

### 坑 3：OSS 签名 URL 有效期

万相任务提交后需要从 OSS 拉取素材，如果签名 URL 过期（默认 1 小时），任务会卡在 PENDING 状态。

**解法**：将 URL 有效期设为 3600 秒，轮询超时设为 1800 秒（30 分钟），留足余量。同时保存 `task_id`，支持 `--mode resume` 中断续跑。

---

## 项目信息

- **类型**：Demo / 面试作品
- **源码**：[GitHub](https://github.com/star-nebula/job-demo/tree/main/video-generation-demo)
- **目标岗位**：AI自动化开发工程师（AI生图/生视频/ComfyUI/Python自动化）
- **技术栈**：Python / 阿里云 OutfitAnyone / 万相 animate-mix / FFmpeg / OSS
- **版本**：v3.0.0（阿里云全链路）
- **分支说明**：
  - `main` — 阿里云 OutfitAnyone + 万相链路（本文档对应版本）
  - `pipeline-comfyui-seedance` — ComfyUI IDM-VTON + 火山方舟 Seedance 链路（v2 版本，保留备查）
