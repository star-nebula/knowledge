---
title: Git 基础
created: 2026-05-22
tags:
  - Git
  - 版本控制
type: 概念解释
related:
  - "[[Git-MOC]]"
  - "[[Git 命令速查]]"
  - "[[Git 反悔操作]]"
  - "[[Git 使用问题]]"
reference:
category: ["🛠️ 工程工具", "Git"]
---

## 基础

## 一 Git的核心概念

*一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。*

*它的核心是一个数据库，保存了项目的每一次更改，并且可以通过这些更改来创建分支、合并代码、查看历史记录等。*

1. **仓库（Repository）**

   - Git仓库是存储项目所有版本历史记录的地方。
   - 它包含了项目的所有文件、目录、提交信息、分支、标签等。
   - 仓库可以位于本地计算机上，也可以托管在远程服务器上。
2. **工作区（Working Directory）**

   - 工作区是开发者进行日常开发的地方，包含了项目的实际文件。
   - 当从Git仓库中检出（checkout）一个分支时，该分支上的文件会被复制到工作区。
   - 开发者在工作区中对文件进行编辑、添加或删除等操作。
3. **暂存区（Staging Area 或 Index）**

   - 暂存区是Git用来准备提交的一个区域。
   - 开发者将工作区的文件通过`git add`命令添加到暂存区，以便在后续的提交中包含这些更改。
4. **提交（Commit）**

   - 提交是Git中的基本操作，代表了一次版本的保存记录。
   - 每次提交会生成一个唯一的SHA-1哈希值作为标识符。
   - 提交包含了项目的当前状态、代码、元数据（如提交者、提交时间、提交信息等）。
   - 通过`git commit`命令，开发者可以将暂存区的更改提交到Git仓库中。
5. **分支（Branch）**

   - 分支用于同时进行多个任务、多个版本的开发。
   - 主分支一般是`master`或`main`，用于保存最终的稳定版本。
   - 开发者可以创建新的分支来开发新功能或修复bug，而不会干扰到其他分支的开发工作。
   - 通过`git branch`、`git checkout`等命令，开发者可以查看、创建、切换和删除分支。
6. **合并（Merge）**

   - 合并是将一个分支的修改内容合并到另一个分支的过程。
   - 当一个分支的开发完成或需要与其他分支（如主分支）同步时，可以通过合并操作将其修改内容合并到目标分支中。
   - Git使用三方合并算法来自动合并代码冲突。
   - 通过`git merge`命令，开发者可以将一个分支的更改合并到当前分支中。
7. **分布式版本控制**

   - Git是一个分布式版本控制系统，意味着每个开发者都有自己的本地仓库。
   - 本地仓库包含了项目的所有历史记录、分支、标签等。
   - 开发者可以在本地仓库上进行开发工作，并与其他开发者的本地仓库进行同步。
   - 通过`git clone`、`git push`、`git pull`等命令，开发者可以克隆远程仓库、推送本地更改到远程仓库、从远程仓库拉取最新更改。
8. **SHA-1散列算法**

   - Git使用SHA-1散列算法来识别和组织存档的文件内容。
   - 这确保了代码库中的数据不被篡改且保持一致性。
   - 每个提交、文件或目录都有一个唯一的SHA-1哈希值作为其标识符。

![[assets/image-20250102172017-gtv9hpg.png]]

## 二 基本情况

### 1 建立新仓库并提交代码

以下都是先建立远程仓库

```PowerShell
1. 初始化仓库
git init
2. 提交代码
git add .
3. 提交信息
git commit -m '信息'
4. 添加远程仓库
git remote add origin https://gitee.com/账号名/仓库名.git
5. 推送代码
git push origin master
```

```PowerShell
1. 远程仓库建立分支
2. 克隆远程仓库
git clone https://gitee.com/用户名/仓库名.git
3. 将要提交的代码复制到本地仓库，再去本地仓库打开Bash
4. 提交代码
git add .
5. 提交信息
git commit -m '信息'
6. 推送代码
git push origin master
```

### 2 克隆新代码并进行开发

```PowerShell
1. 克隆远程仓库代码
git clone 远程仓库地址
2. 切换到develop分支进行开发
git checkout develop
3. 把master分支合并到本分支 [仅此一次]
git merge master
4. 修改代码
5. 提交代码
git add .
git commit -m '注释'
git push origin develop
```

### 3 开发代码被团队成员修改

```powershell
1. 切换到develop分支
git checkout develop
2. 拉取代码
git pull origin develop
3. 继续开发
4. 提交代码
git add.
git commit -m ''
git push origin develop
```

### 4 完成开发

```powershell
1. 将develop合并到master上
git checkout master
git merge develop
git push origin master
2. develop也推送到远程
git checkout develop
git merge master
git push origin develop
```

### 5 快速解决冲突

```powershell
1. 安装 beyond compare
2. 在git中配置
git config --local merge.tool bc3
git config --local mergetool.path '/usr/local/bin/bcomp'
git config --local mergetool.keepBackup false
3. 应用beyond compare解决冲突
git mergetool
```

### 6 创建项目

```powershell
git tag -a v1.0 -m '版本介绍'    创建本地并添加tag信息
git tag -d v1.0                 删除tag
git push origin --tags          将本地tag信息推送到远程仓库
git pull origin --tags          更新本地tag版本信息

git checkout v.10               切换tag
git clone -b v0.1 地址          指定tag下载代码
```

### 7 开发项目的部分代码

```powershell
git clone https://github.com/用户名/仓库名.git
cd 仓库
git checkout dev
git checkout -b dzz   # 创建 dzz分支
写代码
git add .
git commit -m '部分功能'
git push origin ddz
```

### 8 测试开发代码

```powershell
1. 基于dev分支创建release分支
git checkout dev
git checkout -b release
2. 测试
3. 合并到master
git pull origin requset
或
git checkout master
git merge release
4. 在master分支打tag
git tag -a v2 -m '版本信息'
git push origin --tags
5. 运维人员下载代码
git clone -b v2 地址
```

### 9 配置

```powershell
git config --local user.name‘武沛齐’
git config - -local user.email 'wupeiqi@xx.com'
```

```powershell
git config --global user.name 'wupeig' 
git config --global user.name 'wupeiqi@xx.com'
```

```powershell
git config --system user.name 'wupeiq'
git config --system user.name 'wupeiqi@ xx. com'
注意：需要有root权限
```

### 10 免密码登录

具体看相应官方文档

```powershell
git remote add origin https://用户名:密码@github.ccom/用户名/仓库名.git
```

[SSH 公钥设置 - Gitee.com](https://gitee.com/help/articles/4191#article-header0)

```powershell
1. 生成密钥
ssh-keygen  # 默认放在 ~/.shh 目录下，id_rsa.pub 公钥， id_rsa 私钥
2. 将密钥设置到gitee或gitee
3. 在git本地配置
git remote add orgin git@github.com:用户名/仓库名.git
```

```PowerShell
7. 新建远程仓库分支
8. 新建本地分支
git branch <new-branch>
9. 切换到新分支
git checkout <new-branch>
10. 拉去新分支
git pull origin <new-branch>
11. 衍合master分支
git rebase <branch>
12. 推送新分支
git push -u origin new-branch-name  # -u 设为上游分支
```
