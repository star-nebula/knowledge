---
type: topic
tags:
  - Linux
  - 系统管理
domain: 通用工具
description: Linux系统基础详解，涵盖文件系统/权限/进程/网络/Shell脚本
created: 2026-05-22
updated: 2026-05-22
status: raw
---

## Linux

## Linux 基础

#### Linux的目录结构

- 对比

  - windows系统: <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">森林结构（森系,）</span>，有盘符的概念.
  - Linux系统: <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">树形结构</span>，没有盘符的概念, 取而代之的是 根目录, 用 `/`​ 来表示
- Linux的目录结构图解

  ![1734055038079](assets/1734055038079-20251228202842-zospmqf.png)
- 关于Linux的目录, 我们常用的是:

  ```sh
  /bin 目录: 存储Linux基础命令的, 例如: cd, mv, cp...
  /sbin目录: 存储Linux进阶命令, 例如: ifconfig, ...
  /etc 目录: 存储的是Linux系统的配置信息. 
  /root目录: 超管(超级管理员)目录, 也是 root账号所在的目录. 
  /home目录: 普通账号的家目录, 我们创建的账号, 默认会存储在这里. 
  ```

#### 命令通用格式

```sh
command [-options] [parameter]
#   command: 命令本身（必写）
#   options: 命令的选项，控制命令的行为细节
# parameter: 命令的参数，控制命令的指向目标
```

#### 目录操作

- ​`ls`​ 查看当前目录下的内容

  > ls（list）：显示所有
  >

  ```sh
  ls [-a -l -h] [文件夹路径]
  # a(all): 列出全部文件（包含隐藏的文件/文件夹）
  # l(line): 以行（竖向排列）的形式展示，显示详细信息
  # h(human): 以人形化的形式展示内容（需与 -l 共用）
  ```

  ```sh
  【示例】
  ls			查看当前目录下的内容(不包括隐藏)
  ls ./ 		查看当前目录下的内容(不包括隐藏)
  ls -a		查看当前目录下的内容(包括隐藏)
  ls -l		以行的方式查看当前目录下的内容(不包括隐藏)
  ls -al		以行的方式查看当前目录下的内容(包括隐藏)
  ls -lh		以行, 人性化的方式查看当前目录下的内容(不包括隐藏)
  ls -alh		以行, 人性化的方式查看当前目录下的内容(包括隐藏)
  ls -lh /etc 以行, 人性化的方式查看指定目录下的内容(不包括隐藏)
  ll			等价于 ls -l   
  ```

- ​`pwd`​ 查看当前目录

  > pwd（print work directory）： 打印工作目录, 即: 当前所在的目录
  >

  ```sh
  pwd
  ```
- ​`cd`​ 目录切换

  > cd（change directory）：改变目录
  >

  ```sh
  cd 目录路径
  ```

  ```sh
  【示例】
  cd 要切换到的目录		# 切换路径.
  cd ./				# 切换到当前目录, 相当于: 啥都没做.
  cd /				# 切换到根目录
  cd ~				# 切换到家目录（等同于直接 cd）

  # 特殊路径
  ./			# 代表当前目录
  ..			# 代表上级路径
  ../..		# 代表上上级路径
  ~			# 代表当前账号的家目录（root账号 -> /root,  其它账号 -> /home）
  -			# 在最近操作过的两个目录之间做 切换
  ```
- ​`mkdir`​ 创建目录

  > mkdir（make directory）：制作目录
  >

  ```sh
  mkdir [-p] 目录路径  # 如果是创建多级目录需要加 -p
  ```

#### 文件操作

- ​`touch`​ 创建文件

  ```sh
  touch 文件路径
  ```
- ​`cat`​ 翻页查看文件内容（默认为最后一页）

  ```sh
  cat 文件路径
  ```
- ​`more`​ 分页查看文件内容

  ```sh
  more 文件路径
  # b -> back: 返回上一页
  # d -> down: 下一页
  # q -> quit: 退出
  # enter: 下一行
  ```
- ​`cp`​ 拷贝文件

  > cp（copy）：拷贝
  >

  ```sh
  cp [-r] 源文件(夹)路径 目的地文件(夹)路径
  # 拷贝文件夹 -r
  ```
- ​`mv`​ 移动文件

  > mv（move）：移动，剪切
  >

  ```sh
  mv 源位置 目的地
  # 可用于“重命名”
  ```
- ​`rm`​ 删除文件

  > rm（remove）：删除
  >

  ```sh
  rm [-r -f] 文件夹（文件路径）
  # -f : force 强制删除，不提示
  # -r : recursive 递归删除
  rm -rf 文件（夹）  # 直接删除无提示（文件/文件夹）
  rm -rf /*  # 相当于删盘符，慎重
  ```

#### 查找相关

- ​`which`​ 查找Linux 命令所在的目录

  ```sh
  which Linux的命令名
  ```
- ​`find`​ 根据文件名 或者 文件大小，查找对应的文件

  ```sh
  find 要查找的路径 -name '*文件名'		# *代表 通配符.
  find 要查找的路径 -size +10M			# 查找大小在10M以上的文件
  ```

#### 管道命令和过滤

- ​`grep`​ 过滤，显示过滤内容的所在行

  ```sh
  grep [-n] 关键字 文件路径
  # -n : 在结果中显示匹配关键字的行号
  ```

- ​`|`​ 管道命令，将前边命令的执行结果，作为后边命令的数据源来处理（即：将前边的输出作为后边的输入）

  ```sh
  命令 | 命令
  # 例：
  cat 1.txt | grep python | grep pandas
  # 从1.txt文件中过滤出python, 在其基础上再过滤出pandas
  ```

#### echo、重定向、tail

- ​`echo`​ 在命令行内输出指定内容

  ```sh
  echo "输出的内容"
  ```

- ​`` ` ``​ 反引号，将字符串当成linux命令执行

  ```sh
  echo `pwd`  # 将pwd作为命令执行并将其结果输出
  ```
- 重定向符

  - ​`>`​ 将左侧命令的结果，<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">覆盖</span>写入到符号右侧指定的文件中
  - ​`>>`​ 将左侧命令的结果，<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">追加</span>写入到符号右侧指定的文件中

  ```sh
  echo 'hello' > 1.txt  # 将"hello"覆盖写入1.txt
  echo ' world' >> 1.txt  # 将" world"追加写入1.txt
  ls / >> 2.txt  # 将ls /的返回结果，写入2.txt
  ```

- ​`tail`​ 查看文件尾部内容，跟踪文件的最新更改

  > 使用场景：查看日志文件
  >

  ```sh
  tail [-f -num] 文件路径
  # -f : 持续跟踪
  # -num : 查看尾部行数（默认10行）

  # 例：持续跟踪日志文件
  tail -100f python.log
  ```

- ​`head`​ 查看文件头部内容

  ```sh
  head [-num] 文件路径
  # -num : 查看头部行数（默认10行）
  ```

#### 查看命令的帮助手册

```sh
# --help 属性
命令名 --help		# 例如:   ls --help

# 格式：man 命令名
man ls			  	# 查看ls命令的使用手册
man ls >> ls.txt   	# 把ls命令的使用方式保存到文件中.
```

## vi、vim 编辑器

> vi（visual interface），Linux中的文本编辑器
>
> vim 为 vi 的加强版，兼容 vi 的所有指令，且具有 shell 程序编辑的功能，可以通过字体颜色辨别语法的正确性

![image](assets/image-20251229114422-ale1tu2.png)

三种工作模式

- 命令模式（command mode）：此模式以命令驱动执行不同的功能（不能自由进行文本编辑）
- 输入模式（insert mode）：即编辑模式，可对文件内容自由编辑
- 底线命令模式（last line mode）：以 `:`​ 为前缀，通常用于文件的保存、退出

```sh
【简单示例】
vim 1.txt   # 进入文件
---------- 文件内部 ----------
按下键盘 i，进入编辑模式
编辑完成
按下 Esc，退出编辑模式
输入 :wq，保存并退出文件
---------- "1.txt" ----------
```

```vim
【命令模式】
i		在当前位置插入
o		向下插入一行
O		向上插入一行
gg		回到文件头部（首行）
G		回到文件末尾（尾行）
dd		删除当前行
ndd		连续向下删除n行（包括当前行）
yy		复制当前行
nyy		连续向下复制n行（包括当前行）
p		粘贴
u		侧销
ctrl + r  		反撤销
shift + z + z	等同于 :wq
/内容			查找内容，找到后高亮显示
```

```vim
【底线（底行）模式】
:wq		保存并退出
:wq!	强制保存并退出
:q		退出
:q!		强制退出
:set nu		设置行号
:set nonu 	取消行号
:nohl		取消高亮
:行数		跳转到指定行
```

## Linux 中的用户

- root 用户（超级管理员）拥有最大的系统操作权限，而普通用户在许多地方的权限是受限的
- 创建用户

  ```sh
  useradd -m 用户名	# 创建用户
  passwd 用户名		# 为用户指定密码

  su 用户名			# 切换用户
  sudo 其它命令		# 借用root权限
  ```

- 为创建的用户赋予权限

  ```sh
  vim /etc/sudoers
  visudo /etc/sudoers		# 保存时会自动检测，报错则拒绝写入
  # 找到“root    ALL=(ALL)       ALL”这一行，照着模样在下面加
  用户名    ALL=(ALL)       ALL
  ```

## 权限控制：chmod 命令

> 更改权限：修改文件、文件夹的权限信息

```sh
chmod [-R] 权限 文件(文件夹)
# -R : 对文件夹内的全部内容应用同样的操作
```

```sh
# 例：传统写法
chmod u=rwx, g=rx, o=x text.txt # 将文件权限修改为：rwxr-x--x
chmod -R u=rwx, g=rx, o=x text  # 将文件夹test及其内全部内容的权限设置为：rwxr-x--x 
# u： user所属用户权限
# g：group组权限
# o：other其它用户权限
chmod -R +r text	# 为所有用户添加 r权限
chmod -R g-w text	# 将group组的 w权限 删除
```

```sh
# 例：引入数字权限（常用）
chmod 777 text.txt  	# 将文件权限修改为：rwxrwxrwx
chmod -R 751 text		# 将文件夹test及其内全部内容的权限设置为：rwxr-x--x 
```

- 权限符号

  ```sh
  r	只读
  w	只写
  x	可执行
  -	无权限
  ```
- 权限的数字序号：用3位数字分别代表，<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">用户权限、用户组权限、其它用户权限</span>

  ```sh
  0 	无任何权限	即 ---
  1	仅有x权限	即 --x
  2	仅有w权限	即 -w-
  3 	有w和x权限	即 -wx
  4	仅有r权限	即 r--
  5 	有r和x权限	即 r-x
  6	有r和w权限	即 rw-
  7	有全部权限	即 rwx
  ```

> 修改用户和用户组

```sh
# 格式
chown [-R] [用户][:][用户组] 文件或者文件夹路径

# 例子
chown zhangsan 1.txt		 # 改变 用户
chown :zhangsan 1.txt        # 改变 用户组
```

## 快捷键

- ​<kbd>ctrl + c</kbd>​ 强制停止
- ​<kbd>ctrl + d</kbd>​ 退出或登出

历史命令搜索

- ​`history`​ 查看历史命令
- ​`!命令前缀`​ 自动执行匹配前缀的上一次命令 并执行
- ​<kbd>ctrl + r</kbd>​ 输入内容去匹配历史命令

  键盘 <kbd>←</kbd>​ <kbd>→</kbd>​ 键 选择命令

  若命令是需要的，按<kbd>enter</kbd>​回车直接执行

光标移动快捷键

- ​<kbd>ctrl + a</kbd>​ 跳到命令开头
- ​<kbd>ctrl + e</kbd>​ 跳到命令结尾
- ​<kbd>ctrl + ←</kbd>​ 向左跳一个单词
- ​<kbd>ctrl + →</kbd>​ 向右跳一个单词

清屏

- ​<kbd>ctrl + l</kbd>​
- ​`clear`​

## Linux的服务控制命令

```sh
# 命令格式
systemctl start | stop | restart | status | enable | disable 服务名

# 如果你的虚拟机的IP突然变成了127.0.0.1这种情况, 解决方案如下:
systemctl stop NetworkManager			# 关闭主网络服务
systemctl disable NetworkManager		# 禁用主网络服务开机自启动
systemctl restart network			    # 重启副网络服务
ifconfig							   	# 重新查看IP
```

## Linux 软件安装

- 方式一：手动下载安装包，并手动安装
- 方式二：RPM包管理器（RedHat Packet Management, 小红帽的包管理器），会自动下载包，但是不会解决依赖

- 方式三：`yum`​ 命令安装，自动去Linux的应用商店中搜索并安装，并自动解决依赖问题

  ```sh
  yum [-y] [install | remove | search] 软件名称

  # -y  自动确认，无需手动确认或卸载过程
  # install 安装
  # search  搜索
  #【注】需要root权限
  ```

## 软连接

在系统中创建软链接，可以将文件、文件夹链接到其它位置（类似win中的快捷方式）

```sh
ln -s 参数1 参数2
# -s 	创建软连接
# 参数1	被链接的文件或文件夹
# 参数2	链接的目的地
```

```sh
【硬链接】
ln 要被链接的文件路径 硬链接名
# 作用: 动态备份.
ln 1.txt 3.txt		# 无论是修改1.txt 还是 3.txt, 另一个都会同步改变.
# 删除源文件，链接仍可用
```

```sh
ln -s /etc/sysconfig/network-scripts/ifcfg-ens33 ip
vim ip	# 修改IP，不再需要找要修改的文件
```

【扩展】修改IP

- 打开并编辑文件 /etc/sysconfig/network-scripts/ifcfg-ens33

  ```sh
  TYPE="Ethernet"
  PROXY_METHOD="none"
  BROWSER_ONLY="no"
  BOOTPROTO="none"				# ip分配方式, none, static, dhcp
  DEFROUTE="yes"
  IPV4_FAILURE_FATAL="no"
  IPV6INIT="yes"
  IPV6_AUTOCONF="yes"
  IPV6_DEFROUTE="yes"
  IPV6_FAILURE_FATAL="no"
  IPV6_ADDR_GEN_MODE="stable-privacy"
  NAME="ens33"
  UUID="df73d9da-f16b-4a80-beac-e4e5602703f7"
  DEVICE="ens33"
  ONBOOT="yes"
  IPV6_PRIVACY="no"

  IPADDR="192.168.88.77"			# ip地址，修改ip地址
  PREFIX="24"					   	# 子网掩码, 或者写为 NETMASK="255.255.255.0"
  GATEWAY="192.168.88.1"			# 网关, 要和: Vmware软件的虚拟网络编辑器 和 本地VMNet8网卡保持一致.
  DNS1="8.8.8.8"				   	# DNS服务器1
  DOMAIN="114.114.114.114"		# DNS服务器2
  ```

- 重启副网络服务

  ```sh
  systemctl restart network		# 重启副网络服务
  ifconfig						# 查看IP
  ```

## Linux 网络相关

- 查看本机 IP地址

  ```sh
  ifconfig
  ```

- 查看本机的主机名

  ```sh
  hostname
  ```

- 修改本机的主机名

  ```sh
  hostnamectl set-hostname 修改后的主机名
  ```

- 配置域名解析（主机名映射）

  > 好处：可以通过主机名找到对应计算机的IP地址
  >
  > 先通过系统本地的记录去查找，如果找不到就联网去公开DNS服务器去查找
  >

  ```sh
  # 配置域名映射
  vim /etc/hosts
  # ---------- hosts ----------
  IP地址 域名 [域名2 ...] # 在末尾追加一行
  # ---------------------------
  # :wq 保存退出即可生效
  # 修改windows系统的域名映射（使用虚拟机Linux的情况下）
  打开文件 c:/Windows/System32/drivers/etc/hosts
  IP地址 域名 [域名2 ...]  # 添加域名映射
  ```

- ​`wget`​ 下载网络资源

  ```sh
  wget url地址
  ```

- ​`curl`​ Linux向url地址发起请求, 获取响应信息, 模拟爬虫.

  ```sh
  curl url地址
  ```

- 查看端口号

  ```sh
  netstat -anp		# anp: all network port
  # 结合管道符 和 过滤命令一起用
  netstat -anp | grep 3306	
  netstat -anp | grep ssh
  ```

## Linux的进程相关

```sh
# 查看本机所有的进程
ps -ef 

# 过滤出指定的进程
ps -ef | grep 进程名
ps -ef | grep 进程id

# 强制杀死(关闭)进程.
kill -9 pid值		# 进程id(pid)
```

## Linux的压缩和解压缩

- 方式一：tarball 归档方式

  > ​`.tar`​ （tarball）归档文件，简单的将文件组装到一个 `.tar`​ 的文件内，仅仅是简单的封装
  >
  > ​`.gz`​ （`.tar.gz`​\\`gzip`​）使用gzip压缩算法将文件压缩到一个文件内，可以极大的减少压缩后的体积
  >

  ```sh
  tar [-c -v -x -f -z -C] 参数1 参数2 ...
  # -c	创建压缩文件，用于压缩模式
  # -v	显示压缩、解压过程，用于查看进度
  # -x	解压模式
  # -f	要解压的文件（-f需要在所有选项中处于最后）
  # -z	gzip模式（默认为普通 tarball模式）
  # -C	选择解压的目的地，用于解压模式
  ```
  ```sh
  # 压缩
  tar -zcvf 压缩包名.tar.gz 要被压缩的文件
  # 解压缩
  tar -zxvf 压缩包名.tar.gz -C 要解压到的路径
  ```
- 方式二：`zip`​ 和 `unzip`​

  ```sh
  # 压缩
  zip -r 压缩包名.zip 文件 目录的路径
  # 解压
  unzip 压缩包名.zip -d 解压到的目录
  ```
