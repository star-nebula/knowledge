---
title: FVM 管理 Flutter
created: 2026-05-22
tags:
  - FVM
  - Flutter
  - 版本管理
type: 步骤操作
related:
  - "[[IDE与环境-MOC]]"
  - "[[Anaconda 环境管理]]"
  - "[[「Engineering」MOC]]"
reference:
category: ["🛠️ 工程工具", "IDE与环境"]
---

# FVM管理 Flutter

### 安装 FVM

```python
dart pub global activate fvm
```

> 确保 `~/.pub-cache/bin`​（Linux/macOS）或 `%APPDATA%\Pub\Cache\bin`​（Windows）已添加到你的系统 PATH 中，否则无法在终端中直接使用 `fvm`​ 命令。

### 查看可用的 Flutter 版本

```python
fvm releases
```

### 为当前项目安装指定版本的 Flutter

```python
fvm use <version>
```

首次使用该版本时，FVM 会自动从 Flutter 官方仓库下载对应版本的 SDK，并在项目目录下创建一个 `.fvm`​ 文件夹。

> 该命令还会在项目根目录生成 `fvm_config.json`​（或更新 `.fvm/fvm_config.json`​），记录当前项目使用的 Flutter 版本。

### 使用 FVM 提供的 Flutter 命令

一旦项目配置了 FVM，所有 Flutter 命令都应通过 fvm 代理执行，以确保使用的是项目指定的版本：

```python
fvm flutter run   	 # 运行
fvm flutter run -d windows  # 指定平台运行
fvm flutter build    # 构建
fvm flutter pub get  # 安装 Flutter 依赖（读取pubspec.yaml）
```

### 全局设置默认 Flutter 版本（可选）

```python
fvm global <version>
```

然后可以将全局 FVM 的 Flutter 路径加入系统 PATH（通常为 `~/.fvm/default/bin`​），这样在非项目目录中运行 `flutter`​ 命令时也会使用该版本。

> 但建议始终通过 `fvm flutter`​ 显式调用，避免混淆。

### 查看当前项目使用的版本

```bash
fvm flutter --version
或
fvm list
```

### 卸载某个版本（可选）

```bash
fvm remove <version>
```

### IDE 配置（如 VS Code / Android Studio）

- **VS Code**：在项目根目录创建 `.vscode/settings.json`​，添加：

  ```bash
  {
    "dart.flutterSdkPath": ".fvm/flutter_sdk"
  }
  ```

- **Android Studio**：在项目设置中手动指定 Flutter SDK 路径为 `.fvm/flutter_sdk`​。

‍
