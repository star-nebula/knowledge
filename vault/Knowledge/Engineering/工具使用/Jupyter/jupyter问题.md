---
type: topic
tags:
  - Jupyter
  - Notebook
  - 问题排查
domain: 通用工具
description: Jupyter Notebook常见问题与解决方案
created: 2026-05-22
updated: 2026-05-22
status: raw
---

## jupyter+notebook中的问题

## 1、改变主题背景颜色

安装jupter notebook的自定义主题

`pip install --upgrade jupyterthemes`

上面一步执行完后继续输入下面代码，可以看到安装的这几个自定义主题的名称

`jt -l`

如图所示：

![stickPicture.png](assets/stickPicture-20250107203222-qcp01de.png)

现在可以选择一个主题名执行以下代码换皮肤了,例如：

`jt -t chesterish -T -N`

这就表示选择了chesterish这个主题，-T表示打开顶部的工具栏，-N显示笔记本的名字，当然不想要这两个的话可以吧-T -N删掉

若要恢复原默认主题，则输入代码：`jt -r`

- 这样就可以改变自己的主题背景了，主要是改变颜色！

下面几个比较不错的主题界面（本人感觉 chesterish 最好）

- oceans16

![stickPicture.png](assets/stickPicture%201-20250107203222-77f81kx.png)

- grade3

![stickPicture.png](assets/stickPicture%202-20250107203222-327d26j.png)

- onedork

![stickPicture.png](assets/stickPicture%203-20250107203222-h6vqcaa.png)

出现问题

ERROR: Cannot unpack file C:\Users\star\AppData\Local\Temp\pip-unpack-qqnswmhk\simple.html (downloaded from C:\Users\star\AppData\Local\Temp\pip-req-build-e28mai9a, content-type: text/html); cannot detect archive format

ERROR: Cannot determine archive format of C:\Users\star\AppData\Local\Temp\pip-req-build-e28mai9a

输入

pip install -i [https://pypi.tuna.tsinghua.edu.cn/simple](https://pypi.tuna.tsinghua.edu.cn/simple) --trusted-host pypi.tuna.tsinghua.edu.cn --upgrade jupyterthemes

## 2、更改文件存放位置

⑴ 创建文件夹/目录

- Windows用户在想要存放Jupyter Notebook文件的磁盘中新建文件夹并为该文件夹命名；双击进入该文件夹，然后复制地址栏中的路径。
- Linux/macOS用户在想要存放Jupyter Notebook文件的位置创建目录并为目录命名，命令为：

mkdir ；进入目录，命令为：

cd ；查看目录的路径，命令为：

pwd；复制该路径。

- 注意：“”是自定义的目录名。目录名两边不加尖括号“<>”。

⑵ 配置文件路径

- 一个便捷获取配置文件所在路径的命令：

jupyter notebook --generate-config

- 注意： 这条命令虽然可以用于查看配置文件所在的路径，但主要用途是是否将这个路径下的配置文件替换为默认配置文件。 如果你是第一次查询，那么或许不会出现下图的提示；若文件已经存在或被修改，使用这个命令之后会出现询问“Overwrite /Users/raxxie/.jupyter/jupyter_notebook_config.py with default config? [y/N]”，即“用默认配置文件覆盖此路径下的文件吗？”，如果按“y”，则完成覆盖，那么之前所做的修改都将失效；如果只是为了查询路径，那么一定要输入“N”。

  - 配置文件所在路径

  ![stickPicture.png](assets/stickPicture%204-20250107203222-7h3rz8s.png)

常规的情况下，Windows和Linux/macOS的配置文件所在路径和配置文件名如下所述：

- Windows系统的配置文件路径：C:\Users\\.jupyter\
- Linux/macOS系统的配置文件路径：/Users//.jupyter/ 或 ~/.jupyter/
- 配置文件名：jupyter_notebook_config.py

注意：

① “”为你的用户名。用户名两边不加尖括号“<>”。

② Windows和Linux/macOS系统的配置文件存放路径其实是相同的，只是系统不同，表现形式有所不同而已。

③ Windows和Linux/macOS系统的配置文件也是相同的。文件名以“.py”结尾，是Python的可执行文件。

④ 如果你不是通过一步到位的方式前往配置文件所在位置，而是一层一层进入文件夹/目录的，那么当你进入家目录后，用ls命令会发现找不到“.jupyter”文件夹/目录。这是因为凡是以“.”开头的目录都是隐藏文件，你可以通过ls -a命令查看当前位置下所有的隐藏文件。

⑶ 修改配置文件

- Windows系统的用户可以使用文档编辑工具或IDE打开“jupyter_notebook_config.py”文件并进行编辑。常用的文档编辑工具和IDE有记事本、Notepad++、vim、Sublime

Text、PyCharm等。其中，vim是没有图形界面的，是一款学习曲线较为陡峭的编辑器，其他工具在此不做使用说明，因为上手相对简单。通过vim修改配置文件的方法请继续往下阅读。

- Linux/macOS系统的用户建议直接通过终端调用vim来对配置文件进行修改。具体操作步骤如下：

⒜ 打开配置文件

打开终端，输入命令：

vim ~/.jupyter/jupyter_notebook_config.py

命令详解

![stickPicture.png](assets/stickPicture%205-20250107203222-dexjkku.png)

执行上述命令后便进入到配置文件当中了。

⒝ 查找关键词

进入配置文件后查找关键词“c.NotebookApp.notebook_dir”。查找方法如下：

进入配置文件后不要按其他键，用英文半角直接输入/c.NotebookApp.notebook_dir，这时搜索的关键词已在文档中高亮显示了，按回车，光标从底部切换到文档正文中被查找关键词的首字母。

⒞ 编辑配置文件

按小写i进入编辑模式，底部出现“--INSERT--”说明成功进入编辑模式。使用方向键把光标定位在第二个单引号上（光标定位在哪个字符，就在这个字符前开始输入），把“⑴ 创建文件夹/目录”步骤中复制的路径粘贴在此处。

⒟ 取消注释

把该行行首的井号（#）删除。因为配置文件是Python的可执行文件，在Python中，井号（#）表示注释，即在编译过程中不会执行该行命令，所以为了使修改生效，需要删除井号（#）。

⒠ 保存配置文件

先按esc键，从编辑模式退出，回到命令模式。

再用英文半角直接输入:wq，回车即成功保存且退出了配置文件。

注意：

- 冒号（:） 一定要有，且也是英文半角。
- w：保存。
- q：退出。

⒡ 验证

在终端中输入命令jupyter notebook打开Jupyter Notebook
