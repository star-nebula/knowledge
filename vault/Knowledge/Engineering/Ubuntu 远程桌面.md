---
title: Ubuntu 远程桌面
created: 2026-05-22
tags:
  - Ubuntu
  - 远程桌面
  - VNC
type: 步骤操作
related:
  - "[[Linux-MOC]]"
  - "[[Ubuntu 配置]]"
  - "[[VSCode 远程开发配置]]"
reference:
category: ["🛠️ 工程工具", "Linux"]
---

## ubuntu 远程桌面

## tigervnc

### 安装

```Shell
sudo apt install tigervnc-common
sudo apt install tigervnc-standalone-server
```

### 初始化

```Shell
vncpasswd
```

Password：输入密码

Verify：再次输入

Would you like to enter a view-only password (y/n)? 选：n

### 配置

```Shell
vi ~/.vnc/xstartup
```

```Shell
#!/bin/sh
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
vncconfig -iconic &
dbus-launch --exit-with-session gnome-session &
```

### 修改权限

查看权限并修改权限

```Shell
ls -l ~/.vnc/xstartup
chmod +x ~/.vnc/xstartup
```

z-rwxr-xr-x 1 stars stars 123 Mar  7 10:27 /home/stars/.vnc/xstartup

```Shell
ls -ld ~/.vnc
chmod 755 ~/.vnc
```

drwxr-xr-x 2 stars stars 4096 Mar  7 10:27 /home/stars/.vnc

### 启动

```Shell
vncserver -localhost no -geometry 1920x1080 :2
```

-localhost no 需要加上才能支持远程访问  
-geometry 设置远程分辨率  
:2 远程绘话号

vncserver -list 可以列出当前的会话列表  
vncserver -kill id 可以关掉对应的远程会话  

【笔记本】不想屏幕一直亮着，进行以下配置

```Shell
sudo vi /etc/systemd/logind.conf
HandleLidSwitch=ignore
```

### 远程访问

使用VNC viewer 进行连接

‍

### 问题

VNC 服务器启动失败

1. 安装 `dbus-x11 `​

    ```Shell
    sudo apt install dbus-x11
    which dbus-launch      // 验证安装
    ```

    输出：`/usr/bin/dbus-launch`​
2. 安装 `gnome-session`​

    ```Shell
    sudo apt install gnome-session  
    ```
3. 重启VNC服务器

## sunshine

1、安装需要的包：

sudo apt install cmake gcc-10 g++-10 libssl-dev libavdevice-dev libboost-thread-dev libboost-filesystem-dev libboost-log-dev libpulse-dev libopus-dev libevdev-dev

sudo apt install libxtst-dev libx11-dev libxrandr-dev libxfixes-dev libxcb1-dev libxcb-shm0-dev libxcb-xfixes0-dev

sudo apt install libdrm-dev libcap-dev

sudo apt install libwayland-dev

sudo apt install nvidia-cuda-dev  nvidia-cuda-toolkit

sudo apt install ffmpeg   (22.04默认是mmpeg4.4.2)

2、安装N卡显卡驱动,命令或者附加驱动中添加  
sudo apt install  nvidia-driver-510

3、最后的配置
sudo usermod -a -G input $USER    （添加当前用户到“输入”组）  
sudo  gedit   /etc/udev/rules.d/85-sunshine-input.rules      （创建 udev规则）  
加入： KERNEL=="uinput", GROUP="input", MODE="0660"

具体参见：
https://github.com/loki-47-6F-64/sunshine/blob/master/README.md#linux
