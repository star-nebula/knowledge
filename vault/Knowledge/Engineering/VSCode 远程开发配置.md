---
title: VSCode 远程开发配置
created: 2026-05-22
tags:
  - VSCode
  - Ubuntu
  - 远程开发
type: 步骤操作
related:
  - "[[Linux-MOC]]"
  - "[[Linux 基础]]"
  - "[[Ubuntu 远程桌面]]"
  - "[[IDE与环境-MOC]]"
reference:
category: ["🛠️ 工程工具", "Linux"]
---

## vs+conda+连接虚拟机 ubuntu

### Ubuntu设置安装

“Ctrl+Alt+T”打开终端工具，右击图标-添加到收藏夹可以避免每次用快捷打开，直接点击图标可以打开。

### 1.虚拟机（Ubuntu）配置–安装SSH服务器

（1）先更新一下Ubuntu的包

```Plain
sudo apt-get update
```

（2）获取[root权限](https://so.csdn.net/so/search?q=root%E6%9D%83%E9%99%90&spm=1001.2101.3001.7020)(不然可能会安装不了)

```Plain
sudo su
```

（3）安装ssh服务器

```Plain
sudo apt install openssh-server
```

- 服务器操作

  启动服务器 默认端口22

  ```Plain
  sudo /etc/init.d/ssh start
  ```

  [重启服务器](https://so.csdn.net/so/search?q=%E9%87%8D%E5%90%AF%E6%9C%8D%E5%8A%A1%E5%99%A8&spm=1001.2101.3001.7020) 默认端口22

  ```Plain
  sudo /etc/init.d/ssh restart
  ```

  关闭服务器 默认端口22

  ```Plain
  sudo /etc/init.d/ssh stop
  ```

  查看ssh服务是否在运行

  ```Plain
  ps -e | grep sshd
  ```

（4）配置ssh服务（打开文本编辑）

```Plain
sudo gedit /etc/ssh/sshd_config
```

第34行`#PermitRootLogin prohibit-password` 后改为 `PermitRootLogin yes`

![[../../AI应用开发/07_模型部署/assets/file-20250207174928-if6g3ml.png]]

保存退出，并重启服务器

```Plain
sudo /etc/init.d/ssh restart
```

7.查看ubuntu IP地址信息（192.168.44.132）

```Plain
ip addr show
```

## 2.本机（window10）配置

（1）win+r输入cmd，进入命令提示符

（2）输入ssh 查看是否有安装ssh，已安装情况如下图

![[../../AI应用开发/07_模型部署/assets/file 1-20250207174928-e7zdvjg.png]]

（3）ssh生成公钥

- windows

  ```Plain
  ssh-keygen -t rsa
  ```

  一路回车直到结束，.ssh目录默认路径为c:/user/xxx/.ssh，xxx为用户名，

  id_rsa 私钥

  id_rsa.pub 公钥

  钥要放在远端的linux服务器上，私钥要放在本机上，这两个都要保密。

  ![[../../AI应用开发/07_模型部署/assets/file 2-20250207174928-r2ukn9q.png]]
- Ubuntu

  ```Plain
  ssh-keygen
  ```

  一直回车确定

  ![[../../AI应用开发/07_模型部署/assets/file 3-20250207174928-j4iqp4h.png]]

  ```Plain
  cd /root   # 返回到root 文件夹下
  ls         # 查看是否已生成.ssh文件夹
  cd .ssh/   # 进入.ssh文件夹
  # 我的.ssh文件在/home/xxx下

  # 创建一个名为authorized_keys 的文件
  touch authorized_keys 
  ```

  ![[../../AI应用开发/07_模型部署/assets/file 4-20250207174928-ia2nfy6.png]]

  将windows中的`id_rsa.pub`复制到authorized_keys文件中

  ```Plain
  sudo /etc/init.d/ssh restart   # 重启ssh服务
  ```
- windows命令行尝试连接服务器（ubuntu）

  ```HTML
  输入ssh 用户名@ip地址

  ssh stars@192.168.44.132
  ```

  ![[../../AI应用开发/07_模型部署/assets/image-20250207174928-4y7kt2l.png]]

## 3.VS Code设置

### 1.安装扩展

Remote - SSH

### 2.配置config

按F1或者CTRL+SHIFT+P

输入`Remote.ssh:Connect to Host` 回车

点击Configure SSH Host

再点击c:/user/xxx/.ssh/config，就能打开config文件

![[../../AI应用开发/07_模型部署/assets/file 5-20250207174928-sbt2cqt.png]]

按上面给的注释填写好自己服务器端的信息，保存并退出

192.168.44.132

### 3.连接

点击VS code旁边的小电脑，展开SSH TARGETS选项卡，下面就是我们刚刚添加的远程服务器,点击旁边的小文件夹就可以添加文件夹连接了
输入密码

![[../../AI应用开发/07_模型部署/assets/file 6-20250207174928-p4fgkq6.png]]

成功连接
