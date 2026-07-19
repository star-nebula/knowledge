---
title: Jupyter 保存路径
created: 2026-05-22
tags:
  - Jupyter
  - Notebook
  - 配置
type: 步骤操作
related:
  - "[[IDE与环境-MOC]]"
  - "[[Jupyter 使用问题]]"
  - "[[Anaconda 环境管理]]"
reference:
category: ["🛠️ 工程工具", "IDE与环境"]
---

## 更改Jupyter保存位置、路径详细步骤

### 修改[Jupyter](https://so.csdn.net/so/search?q=Jupyter&spm=1001.2101.3001.7020)保存位置、路径具体步骤

我安装的是：Anaconda3(64-bit)中的jupyter notebook
问题：在使用Jupyter时，发现它的自动保存路径是在系统盘，由于自己C盘快满了，而且我习惯把软件和文件保存到F盘，所以我就打算把Jupyter的保存位置更改到F盘，于是写这篇文章记录一下哈哈哈哈！

**具体步骤**

**第一步 ：找到配置文件**
1、 菜单中找到Anaconda3(64-bit)文件夹，打开[Anaconda](https://so.csdn.net/so/search?q=Anaconda&spm=1001.2101.3001.7020) Prompt

![[0e6260a46117ed2a234a33c1eeda7fc8_MD5.png]]

2、在窗口输入命令jupyter notebook --generate-config

![[769885efb1d7a3a4877270c1f6f73241_MD5.png]]

3、根据上面运行处的路径打开C:\Users\TL\.jupyter\jupyter_notebook_config.py文件，用记事本方式打开

![[e679f464221883d73dac86458ac1c4af_MD5.png]]

**第二步：更改相关配置**
4、先在打算存放文件的位置先新建一个文件夹（很重要，最好是英文的），然后找到 `#c.NotebookApp.notebook_dir = ‘’`，去掉该行前面的 `#` ；再将新的路径设置在单引号中，保存配置文件。我改的路径是`c.NotebookApp.notebook_dir = ‘F:\JupyterFile’`

![[ec9d3d8a7355b8716c693a65937683aa_MD5.png]]

5、在开始菜单找到“Jupyte Notebook”快捷键，鼠标右击 – 更多 – 打开文件位置

![[17a412942267aef8c060205ce1d718f2_MD5.png]]

6、找到对应的“Jupyte Notebook”快捷图标，鼠标右击 – 属性 – 目标，去掉后面的 “%USERPROFILE%/”（很重要），然后点击“应用”，“确定”

![[e819cfd5070cbce4f67d583451a65bf4_MD5.png]]

![[26b75a94e7635851a5522354ae6fa5ed_MD5.png]]

7、重新启动Jupyte Notebook即可！

![[3394edbb3fa83b05f72ddf7088963430_MD5.png]]
