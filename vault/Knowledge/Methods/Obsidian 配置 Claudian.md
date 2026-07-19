---
title: Obsidian 配置 Claudian
created: 2026-05-22
tags:
  - Obsidian
  - AI插件
  - Claudian
  - 知识管理
type: 步骤操作
related:
  - "[[「Methods」MOC]]"
  - "[[Vercel 博客部署]]"
  - "[[Markdown 语法]]"
reference:
  - "[[Obsidian AI Agent 配置指南：Claudian + Obsidian-CSDN博客|CSDN]]"
category: ["📚 个人知识管理", "个人能力"]
---
参考：[Obsidian AI Agent 配置指南：Claudian + Obsidian-CSDN博客](https://blog.csdn.net/yinxing408033943/article/details/158386753?ops_request_misc=elastic_search_misc&request_id=f23909899dc15443d9ff5f5708587139&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~ElasticCommercialInsert~search_v2-2-158386753-null-null.142^v102^pc_search_result_base3&utm_term=obsidian接入claude&spm=1018.2226.3001.4187)

> 核心组件：
>
> | **组件**            | **说明**                                                     |
> | ------------------- | ------------------------------------------------------------ |
> | **Claudian**        | Obsidian 第三方插件，适配 Claude Code API，提供 AI 聊天界面  |
> | **Obsidian Skills** | 由 Obsidian CEO (Kepano) 发布的 Skill 包，赋予 AI 处理 Canvas、Markdown、Bases 等能力 |
>

### 安装 Claudian 插件

1. 下载配置文件

   - 地址：[YishenTu/claudian](https://github.com/YishenTu/claudian)
   - 下载3个文件：`main.js`、`manifest.json`、`styles.css`

2. 存放配置文件

   ```shell
   Obsidian 仓库根目录/
   └── .obsidian/
       └── plugins/
           └── claudian/
               ├── main.js
               ├── manifest.json
               └── styles.css
   ```

3. 启用插件

   - 重启 Obsidian
   - 进入「设置」→「第三方插件」
   - 找到「Claudian」并启用

### 配置 Claudian

1. 配置 AI 模型

  - 进入 Claudian 的设置页面（可选：将Language 设置为简体中文）

  - 找到环境-自定义变量，将环境变量复杂进去
	  ![[Pasted image 20260403164346.png]]

  - 环境变量示例：

	```shell
	# DeepSeek
	export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
	export ANTHROPIC_AUTH_TOKEN=your deepseek_api key
	export API_TIMEOUT_MS=600000
	export ANTHROPIC_MODEL=deepseek-chat
	export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-chat
	export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
	```

​	【注】替换使用模型的 API Key，需要自己去对应的官网获取

2. 打开对话框
   - 完成以上配置后，左侧功能区将出现 Claudian 的图标
   - 点击图标打开对话框

3. 验证

   - 在聊天界面输入「你好」


   - 收到正常回复即配置成功

### 部署 Obsidian Skills

1. 下载 skills 包

   - 下载地址：[kepano/obsidian-skills](https://github.com/kepano/obsidian-skills)
   - 下载 `obsidian-skills-main.zip` 并解压

2. 将其中skills文件夹中的文件复制到 claude/skills/ 目录

   ```shell
   Obsidian 仓库根目录/
   └── .claude/skills/
           ├── obsidian-markdown/
           ├── json-canvas/
           ├── obsidian-bases/
           └── (其他 skills)
   ```

3. 验证安装
   - 重启 Claude Code
   - 在聊天界面输入 `/` 显示已安装的 skills 列表
   - 若出现 obsidian-skills 则表示安装成功

