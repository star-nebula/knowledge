---
title: Anaconda 环境管理
created: 2026-05-22
tags:
  - Anaconda
  - Python
  - 环境管理
  - conda
type: 步骤操作
related:
  - "[[IDE与环境-MOC]]"
  - "[[PyCharm 配置与使用]]"
  - "[[Jupyter 保存路径]]"
reference:
category: ["🛠️ 工程工具", "IDE与环境"]
---

## Anaconda

在Anaconda环境中进行相关操作

```Python
1. 创建一个虚拟环境： 
conda  create -n EnvName python=x.x
2. 查看现有的虚拟环境: 
conda env list
3. 激活某个虚拟环境：
activate EnvName
4. 去激活某个虚拟环境：
deactivate EnvName
5. 查看该虚拟环境下各软件的版本号
conda list
6. 删除虚拟环境
conda remove -n your_env_name --all
```

## 创建环境

```Python
conda create --name 环境名字 python==3.7   #创建虚拟环境
conda activate 环境名字    #激活虚拟环境
```

## 备份环境

```Shell
# 备份虚拟环境
activate your_environment   # 激活环境
conda env export > environment.yaml   # environment.yaml默认名，包含了虚拟环境的所有配置信息。
conda env export --from-history > environment.yaml  # 只导出显式安装的包（手动安装）
conda list --explicit > packages.txt  # 备份环境的依赖包（包含下载url）
pip freeze > requirements.txt

pip install pip-chill  # 安装 pip-chill
pip-chill > requirements.txt  # 只导出手动安装的包

# 创建新的虚拟环境
conda create --name new_env_name
conda env update --name new_env_name --file environment.yaml  # 恢复创建备份好的环境
conda install --name new_env_name --file packages.txt

pip install -r requirements.txt
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## 压缩conda环境

```Shell
1、安装conda-pack工具：
conda install conda-pack
2、激活虚拟环境：
conda activate virtual_env
3、使用conda-pack压缩虚拟环境：
conda-pack -n your_virtual_env -o target_directory/packed_env.tar.gz

4、解压压缩文件：
tar -xzf packed_env.tar.gz
5.激活解压后的虚拟环境：
source bin/activate
```

## 克隆虚拟环境

```shell
# 克隆环境到新名称
conda create --name new_env_name --clone existing_env_name

# 或者克隆到指定路径
conda create --prefix /path/to/new_env --clone /path/to/existing_env
```
