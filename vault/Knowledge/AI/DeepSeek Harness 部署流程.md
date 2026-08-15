---
title: DeepSeek Harness 部署流程
created: 2026-08-15
tags:
  - DeepSeek
  - Harness
  - 部署
  - Node.js
  - API Key
type: 步骤操作
related:
  - "[[模型部署-MOC]]"
  - "[[Ubuntu 部署 DeepSeek]]"
  - "[[DeepSeek]]"
category: ["🤖 AI大模型", "模型部署"]
---

# DeepSeek Harness 部署流程
## 前置条件

1. DeepSeek API Key
2. 本地电脑已安装 node.js

### 申请 DeepSeek API Key

进入 [DeepSeek官方开发平台](https://platform.deepseek.com/) -> 侧边栏选择 「API ksys」

![[Attachments/fc754f4f05071749cee057926dc0ffb3_MD5.jpg]]

点击 「创建 API key」
![[Attachments/57eb4f8f5d8afeb0ae70ed699d9af435_MD5.jpg]]

输入「新 API ksy 的名称」-> 点击「创建」
![[Attachments/5797a4d70a68a3297f87f7088d4ac2ec_MD5.jpg|248]]


【重点】点击创建后将出现 API key，这个key需要自行复制保存，关闭该弹窗后将无法再查看该key
![[Attachments/b4a4075f4e4cc4335658c301fcec2a37_MD5.jpg|253]]

### 安装 node.js

进入 [Node.js — 下载入口](https://nodejs.org/zh-cn/download) 选择适合自己电脑的下载并安装

![[Attachments/7bc75a7a3f975304c52c18d4622cb68b_MD5.jpg]]

## 部署 DeepSeek

只需在PowerShell输入一条命令行
```
npx @deepseek-ai/dsh web
```

出现以下界面即代表部署成功，在浏览器中输入 `http://127.0.0.1:3080/` 即可进入 Web 界面
![[Attachments/c153c71ca9b27483761ebe003f772474_MD5.jpg|678]]

打开界面输入前面复制好的 API Key 即可开始使用 DeepSeek Harness
![[Attachments/1415a03f1c8d4498f5b50a8b64a33d24_MD5.jpg]]

## DeepSeek 的四种模式

- **标准模式**：啥都能干的万能助手，与 openclaw、workbuddy 相似。
- **PTC模式**：相当于可以一次性进行多次标准模式下的操作，前提是逻辑清晰的任务。
- **极简模式**：速度快，但只能敲命令和改文件，别的干不了。
- **创造模式**：继承标准模式，并可用于开发插件和创建新工具，或定制模式预设。
