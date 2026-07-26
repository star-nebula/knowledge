---
type: topic
tags:
  - Jupyter
  - 配置
domain: 通用工具
description: Jupyter Notebook保存路径更改步骤
created: 2026-05-22
updated: 2026-05-22
status: raw
---

## 更改Jupyter保存位置、路径详细步骤

### 修改[Jupyter](https://so.csdn.net/so/search?q=Jupyter&spm=1001.2101.3001.7020)保存位置、路径具体步骤

我安装的是：Anaconda3(64-bit)中的jupyter notebook
问题：在使用Jupyter时，发现它的自动保存路径是在系统盘，由于自己C盘快满了，而且我习惯把软件和文件保存到F盘，所以我就打算把Jupyter的保存位置更改到F盘，于是写这篇文章记录一下哈哈哈哈！

**具体步骤**

**第一步 ：找到配置文件**
1、 菜单中找到Anaconda3(64-bit)文件夹，打开[Anaconda](https://so.csdn.net/so/search?q=Anaconda&spm=1001.2101.3001.7020) Prompt

![](https://img-blog.csdnimg.cn/20201008225936873.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1OTQ3OTY5,size_16,color_FFFFFF,t_70#pic_center)

2、在窗口输入命令jupyter notebook --generate-config

![](https://img-blog.csdnimg.cn/20201008230025428.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1OTQ3OTY5,size_16,color_FFFFFF,t_70#pic_center)

3、根据上面运行处的路径打开C:\Users\TL\.jupyter\jupyter_notebook_config.py文件，用记事本方式打开

![](https://img-blog.csdnimg.cn/20201008230143617.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1OTQ3OTY5,size_16,color_FFFFFF,t_70#pic_center)

**第二步：更改相关配置**
4、先在打算存放文件的位置先新建一个文件夹（很重要，最好是英文的），然后找到 `#c.NotebookApp.notebook_dir = ‘’`，去掉该行前面的 `#` ；再将新的路径设置在单引号中，保存配置文件。我改的路径是`c.NotebookApp.notebook_dir = ‘F:\JupyterFile’`

![](https://img-blog.csdnimg.cn/20201008230647774.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1OTQ3OTY5,size_16,color_FFFFFF,t_70#pic_center)

5、在开始菜单找到“Jupyte Notebook”快捷键，鼠标右击 – 更多 – 打开文件位置

![](https://img-blog.csdnimg.cn/20201008230823421.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1OTQ3OTY5,size_16,color_FFFFFF,t_70#pic_center)

6、找到对应的“Jupyte Notebook”快捷图标，鼠标右击 – 属性 – 目标，去掉后面的 “%USERPROFILE%/”（很重要），然后点击“应用”，“确定”

![](https://img-blog.csdnimg.cn/202010082310321.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1OTQ3OTY5,size_16,color_FFFFFF,t_70#pic_center)

![](https://img-blog.csdnimg.cn/20201008231131611.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1OTQ3OTY5,size_16,color_FFFFFF,t_70#pic_center)

7、重新启动Jupyte Notebook即可！

![](https://img-blog.csdnimg.cn/20201008231904922.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1OTQ3OTY5,size_16,color_FFFFFF,t_70#pic_center)
