---
title: Git 命令速查
created: 2026-05-22
tags:
  - Git
  - 版本控制
  - 命令速查
type: 极简速记
related:
  - "[[Git-MOC]]"
  - "[[Git 基础]]"
  - "[[Git 反悔操作]]"
  - "[[Git 使用问题]]"
reference:
category: ["🛠️ 工程工具", "Git"]
---

## git

## 常用命令

- ```python
  master 默认开发分支
  origin 默认远程版本库
  Head   默认开发分支
  Head^  Head 的父提交
  ```

### 1 创建版本库

```python
git clone <url>    # 克隆远程版本库
git init           # 初始化本地版本库
```

### 3 修改

```Python
git mv <old> <new> # 文件改名
git rm <file>      # 删除文件
git rm --cached <file>  # 停止提交文件但不删除
git commit -m "commit message" # #提交所有更新过的文件
git commit --amend  # #修改最后一次提交
```

### 5 撤销

```PowerShell
git reset --hard HEAD    # 撇消工作目录中所有未提交文件的修改内容
git checkout HEAD <file> # 撤消指定的未提交文件的修改内容
git revert <commit>      # 撤消指定的提交
```

### 7 合并与衍合

```powershell
git merge <branch>   # 合并指定分支到当前分支
git rebase <branch>  # 衍合指定分支到当前分支
```

### 8 远程操作

```PowerShell
git remote -v                 # 查看远程版本库信息
git remote show <remote>      # 查看指定远程版本库信息
git remote add <remote> <url> # 添加远程版本库
git fetch <remote>            # 从远程库获取代码
git pull <remote> <branch>    # 下载代码及快速合井
git push <remote>             # 上传代码及快速合并
git push <remote> :<branch/tag-name> # 删除远程分支或标签
git push --tags               # 上传所有标签
```

拉取代码

```Shell
git pull origin dev
等价于
git fetch origin dev
git merge origin/dev
```

### 2 查看

```python
git status # 查看状态
git diff   # 查看变更内容

git log           # 查看提交历史
git log -p <file> # 查看指定文件的提交历史
git blame <file>  # 以列表方式查看指定文件的提交历史
```

### 4 提交

```PowerShell
git add .      # 提交所有改动过的文件
git add <file> # 跟踪指定的文件
```

### 6 分支与标签

```PowerShell
git branch                # 显示所有本地分支
git branch <new-branch>   # 创建新分支
git branch -d <branch>    # 删除本地分支
git   <branch/tag> # 切换到指定分支或标签

git tag                   # 列出所有本地标签
git tag <tagname>         # 基于最新提交创建标签
git tag -d <tagname>      # 删除标签
```

‍
