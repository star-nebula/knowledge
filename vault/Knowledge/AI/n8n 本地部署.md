---
title: n8n 本地部署
tags: [n8n, 工作流, 自动化, 本地部署, docker]
type: 步骤操作
created: 2026-07-08
related:
  - "[[框架与中间件-MOC]]"
category: ["🧩 AI框架与Agent", "框架与中间件"]
---

# n8n 本地部署

## 一、为什么选择本地部署

- **数据安全**：所有工作流和数据保存在本地
- **完全控制**：不受云服务条款限制
- **成本效益**：一次部署，长期使用成本更低

## 二、部署前准备

| 要求 | 最低配置 |
|------|----------|
| 内存 | 2GB（建议 4GB 以上） |
| 存储 | 1GB 可用空间 |
| Node.js | ≥ 18 |
| Docker | 推荐（可选） |

## 三、两种安装方法

### 方法一：npm 安装（快速上手）

```bash
npm install n8n -g
n8n
# 或
n8n start
```

访问 `http://localhost:5678`，按指引创建管理员账户。

### 方法二：Docker 安装（生产环境推荐）

**基础部署（docker-compose.yml）**：

```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=<your_secure_password>
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

启动：`docker-compose up -d`

**集成 PostgreSQL（高级部署）**：

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: <n8n_password>
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: <n8n_password>
      N8N_BASIC_AUTH_ACTIVE: 'true'
      N8N_BASIC_AUTH_USER: admin
      N8N_BASIC_AUTH_PASSWORD: <your_secure_password>
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

volumes:
  n8n_data:
  postgres_data:
```

## 四、界面汉化（可选）

> 注意：汉化可能导致界面组件加载不稳定，节点名称仍为英文。建议使用浏览器翻译插件。

如需汉化：

1. 从 [GitHub Releases](https://github.com/other-blowsnow/n8n-i18n-chinese/releases) 下载对应版本 `editor-ui.tar.gz`
2. 解压到指定目录，启动后不要更改
3. Docker 配置中挂载汉化文件并添加 `N8N_DEFAULT_LOCALE=zh-CN`

## 五、配置与优化

### 关键环境变量

```bash
# 基础
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678/

# 调试
N8N_LOG_LEVEL=debug
N8N_DIAGNOSTICS_ENABLED=true
```

### 性能优化

```bash
EXECUTIONS_PROCESS=main          # 单进程减少内存
EXECUTIONS_TIMEOUT=3600          # 长工作流超时 1 小时
EXECUTIONS_DATA_SAVE_ON_ERROR=none  # 开发环境减少存储
```

### 安全配置

- 必须启用身份验证（`N8N_BASIC_AUTH_ACTIVE=true`）
- 将 n8n 容器置于独立 Docker 网络
- API 密钥存储在凭证系统内或通过环境变量传入
- 生产环境建议通过 Nginx 配置反向代理和 HTTPS

### Webhook 开发

使用 `ngrok` 为本地 n8n 实例创建公共 URL：`ngrok http 5678`

## 六、常见问题

| 问题 | 解决方法 |
|------|----------|
| 端口占用（5678） | 查找占用进程 `lsof -i :5678` 并终止；或 `export N8N_PORT=5679` |
| Node.js 版本问题 | n8n 要求 Node.js ≥ 18。用 nvm 切换：`nvm install 18 && nvm use 18` |
| 权限问题 | 不要用 root 运行；为 n8n 创建专用用户并赋予数据目录权限 |
| 数据库连接失败 | 检查 docker-compose.yml 中数据库参数、确认 PostgreSQL 运行中 |

## 七、维护与更新

- **npm**：`npm update -g n8n`
- **Docker**：`docker-compose pull && docker-compose down && docker-compose up -d`
