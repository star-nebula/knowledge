---
type: topic
tags:
  - Ubuntu
  - Linux
domain: 通用工具
description: Ubuntu系统配置与使用指南
created: 2026-05-22
updated: 2026-05-22
status: raw
---

## UBUNTU

- # 连接远程服务器

  - ## 服务器设置

    1. 开启ssh服务

        - ```
            sudo apt-get install openssh-server # 安装ssh服务
            sudo ps -e |grep ssh                # 查询是否开启
               948 ?        00:00:00 sshd       # 已开启
            sudo service ssh start      		# 开启ssh服务
          ```

    2. 查询IP地址

        - ```
            sudo apt install net-tools  # 安装net工具
            ifconfig    				# 查询IP地址
          ```

          - 192.168.28.16

    3. 修改`ssh_config`​文件

        - ```
            sudo vim /etc/ssh/sshd_config   #进入此文件修改配置权限

            将该行注释掉：PermitRootLogin prohibit-password    # 如果没有修改原本就是注释掉的
            并添加：PermitRootLogin yes
          ```

          - 按Esc 键输入`:set nu`​显示行数

    4. 给用户授权

        - 登录要远程的用户账号

          - ```
            su - xxx
            ```
        - 生成密钥

          - ```
            ssh-keygen 
            cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
            ```
        - 添加权限

          - ```
              chmod go-w ~/
              chmod 700 ~/.ssh
              chomod 600 ~/.ssh/authorized_keys
            ```
          - 若显示需要安装，则执行下面的命令
          - ```
            sudo apt install coreutils
            ```

    5. 重启ssh服务

        - ```
          sudo service ssh restart
          ```

    6. 测试ssh，连接到本地

        - ```
          ssh localhost
          ```
  - ## 本地电脑设置

    - 打开putty（若没有先安装）
    - 在Host输入服务器的IP地址
    - Saved Sessions填写服务器上的用户名，Save保存
    - Open，即可进入服务器的登录界面，输入用户名和密码即可登录

- # 更换镜像源

  - 查看当前镜像源

    - ```
      	  less /etc/apt/sources.list
      	  sudo cat /etc/apt/sources.list
      ```
  - 备份当前镜像源

    - ```
      	  cp /etc/apt/sources.list /etc/apt/sources.list.bak
      ```
  - 修改当前镜像源

    - ```
      	  vim /etc/apt/sources.list

      	  # 打开文件输入 ggdG 清空文件
      	  ggdG
      ```
    - 写入镜像源

      - 常用的Ubuntu版本代号如下：  
        Ubuntu 22.04：jammy  
        Ubuntu 20.04：focal  
        Ubuntu 18.04：bionic  
        Ubuntu 16.04：xenia
    - ```
      	  deb https://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
      	  deb-src https://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse

      	  deb https://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
      	  deb-src https://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse

      	  deb https://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
      	  deb-src https://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse

      	  # deb https://mirrors.aliyun.com/ubuntu/ jammy-proposed main restricted universe multiverse
      	  # deb-src https://mirrors.aliyun.com/ubuntu/ jammy-proposed main restricted universe multiverse

      	  deb https://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
      	  deb-src https://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
      ```
  - 更新镜像源

    - ```
      	  sudo apt-get update
      ```

- # 基于Hadoop 3.1.3安装Spark

  - 在Ubuntu下基于Hadoop 3.1.3安装Spark涉及几个关键步骤。以下是一个简化的安装指南：

    ### 1. 安装Java

    首先，你需要安装Java开发工具包（JDK），因为Spark和Hadoop都是Java编写的。确保安装的是与Hadoop 3.1.3兼容的JDK版本。

    使用apt包管理器安装OpenJDK（例如OpenJDK 8）：

    ```Shell
    sudo apt update  
    sudo apt install openjdk-8-jdk
    ```
    ### 2. 安装Scala

    Spark是用Scala编写的，因此你需要安装Scala。使用apt包管理器安装Scala：

    ```Shell
    sudo apt install scala
    ```
    ### 3. 安装Hadoop 3.1.3

    如果你还没有安装Hadoop 3.1.3，你可以从Apache Hadoop的官方网站下载并解压它，或者使用apt包管理器（如果Ubuntu的官方仓库中有可用的版本）。

    以下是一个简化的Hadoop安装示例（从Apache网站下载并解压）：

    ```Shell
    # 下载Hadoop 3.1.3（确保下载正确的版本和格式）  
    wget https://archive.apache.org/dist/hadoop/common/hadoop-3.1.3/hadoop-3.1.3.tar.gz  

    # 解压Hadoop到/usr/local/hadoop  
    sudo tar -xzf hadoop-3.1.3.tar.gz -C /usr/local/  
    sudo ln -s /usr/local/hadoop-3.1.3 /usr/local/hadoop  

    # 配置Hadoop环境变量（编辑~/.bashrc或~/.bash_profile）  
    export HADOOP_HOME=/usr/local/hadoop  
    export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin  
    source ~/.bashrc  # 或重新登录shell
    ```
    ### 4. 安装Spark

    从Apache Spark的官方网站下载与你的Hadoop版本兼容的Spark版本。例如，下载Spark 3.x版本，它应该与Hadoop 3.1.3兼容。

    以下是一个简化的Spark安装示例：

    ```Shell
    # 下载Spark（确保下载正确的版本和格式）  
    wget https://archive.apache.org/dist/spark/spark-3.x.x/spark-3.x.x-bin-hadoop3.1.tgz  

    # 解压Spark到/usr/local/spark  
    sudo tar -xzf spark-3.x.x-bin-hadoop3.1.tgz -C /usr/local/  
    sudo ln -s /usr/local/spark-3.x.x-bin-hadoop3.1 /usr/local/spark  

    # 配置Spark环境变量（编辑~/.bashrc或~/.bash_profile）  
    export SPARK_HOME=/usr/local/spark  
    export PATH=$PATH:$SPARK_HOME/bin  
    source ~/.bashrc  # 或重新登录shell
    ```
    ### 5. 配置Spark以使用Hadoop

    编辑Spark的配置文件`spark-env.sh`​（通常位于`$SPARK_HOME/conf/`​目录下），并设置以下环境变量：

    ```Shell
    export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop  
    export SPARK_DIST_CLASSPATH=$(hadoop classpath)
    ```
    ### 6. 验证安装

    启动Hadoop和Spark，并运行一个简单的Spark作业来验证安装是否成功。例如，你可以使用Spark的`SparkPi`​示例：

    ```Shell
    $SPARK_HOME/bin/spark-submit --class org.apache.spark.examples.SparkPi --master local[*] 
    $SPARK_HOME/examples/jars/spark-examples_2.12-3.x.x.jar 10
    ```
    如果一切顺利，你应该会看到Spark计算π的近似值的输出。

    注意：以上步骤中的版本号（如3.1.3、3.x.x等）应根据你的实际需求和可用版本进行替换。同时，根据你的具体环境和需求，可能还需要进行其他配置和设置。

    ```Python
    spark-submit --master yarn /usr/local/spark/examples/src/main/python/pi.py 10
    ```
- ‍

  #
