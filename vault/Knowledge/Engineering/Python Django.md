---
title: Python Django
created: 2026-05-22
tags:
  - Python
  - Django
  - Web框架
  - MVC
  - ORM
type: 概念解释
related:
  - "[[Python-MOC]]"
  - "[[Django 项目实战]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python Django

> 合并自：Web框架导论.md、Django快速上手.md、Django项目规范.md、Django项目部署.md
> 更新：2026-05-22

# Web框架基础

## 1 web框架底层

### 1.1 网络通信

![[../../Python/assets/image-20220619092142226-20250830192832-76gnflg.png]]

![[../../Python/assets/image-20220619092432693-20250830192832-4o9sy70.png]]

- 服务端

  ```python
  import socket

  # 1.监听本机的IP和端口
  sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
  sock.bind(("127.0.0.1", 8899))  

  # 2.最大连接数
  sock.listen(5)

  while True:
      # 3.等待客户端连接，阻塞函数
      conn, addr = sock.accept()

      # 4.连接成功后立即发送
      conn.sendall("欢迎使用xx系统".encode("utf-8"))

      # 5.断开连接
      conn.close()

  # 6.停止服务端程序
  sock.close()
  ```

- 客户端

  ```python
  import socket

  # 1. 向指定IP发送连接请求
  client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  client.connect(("127.0.0.1", 8899))

  # 2. 接收服务端的消息
  message = client.recv(1024)
  print(message.decode("utf-8"))

  # 3.断开连接
  client.close()
  ```

### 1.2 常见软件架构

- bs架构：服务器-浏览器
- cs架构：服务端-客户端

  开发应用程序，例如：QQ、Pycharm、网易云音乐（安装在电脑上的软件）

开发区别：

- 网站，只需要写服务端程序

  ```
  基于django开发的本质就是网站（web应用）
  电脑上浏览器本质上是socket实现网络通信
  ```
- 软件，客户端 + 服务端

### 1.3 手撸web框架

```python
import socket

# 1.监听本机的IP和端口
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(('192.168.0.6', 9000))  # 我自己的电脑IP，端口8001

# 2.让多少人等待
sock.listen(5)

while True:
    # 3.等待连接请求的申请，有人来连接（阻塞） -> 登录浏览器来连接我
    conn, addr = sock.accept()

    # 4.收到浏览器发送的消息
    buf = conn.recv(2048)
    print(buf)

    # 5.给浏览器返回数据
    conn.send(b"HTTP/1.1 200 OK\r\n\r\n")
    conn.send(b"Hello, World")

    # 6.断开连接
    conn.close()

# 6.停止服务端程序
sock.close()
```

浏览器与服务端的网站进行通信

- 服务端：网站
- 客户端：浏览器

  - 创建连接
  - 发送数据，固定格式

    GET 请求

    ```
    # 请求头首行
    GET /xxx/xxx/?name=xxx&age=111 HTTP/1.1\r\n

    # 请求头
    Host: 192.168.0.6:9000\r\n
    Connection: keep-alive\r\n
    Upgrade-Insecure-Requests: 1\r\n
    User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36\r\n
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\n
    Accept-Encoding: gzip, deflate\r\n
    Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7\r\n\r\n'
    ```

    POST 请求

    ```
    # 请求头首行
    POST /xxx/xxx/ HTTP/1.1\r\n

    # 请求头
    Host: 192.168.0.6:9000\r\n
    Connection: keep-alive\r\n
    Upgrade-Insecure-Requests: 1\r\n
    User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36\r\n
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\n
    Accept-Encoding: gzip, deflate\r\n
    Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7\r\n\r\n

    # 请求体
    username=wupeiqi&password=123
    ```

    浏览器本质上发送请求时，包含请求头和请求体

    ```
    - GET请求
    	- 只有请求头 + 没有请求体
    	- 请求头之间用 \r\n

    - POST请求
    	- 只有请求头 + 有请求体
    	- 请求头之间用 \r\n
    	- 请求头和请求体之间用 \r\n\r\n
    ```
  - 一次请求和一次响应后，断开连接

两个关键点：

- http协议

  - 特点：无状态的短连接

  - http的应用：浏览器向服务端发送请求，需用通过http协议来实现

  ```python
  - 请求头+请求体 ；请求头和请求体之间用 \r\n\r\n ；请求头之间用 \r\n
  - 一次请求和一次响应后，断开连接。  -> 短连接  ->无状态如何体现？
  - 后期： 请求头+cookie
  ```

- GET请求和POST请求的区别

  GET 用于无副作用地获取资源，参数放 URL、有限且暴露；POST 用于提交数据，参数放 body、长度大且不暴露，但需防止重复提交。

## 2 web框架

常见的web框架：django、flask、tornado、sanic、fastapi等等

![[../../Python/assets/image-20220619111206007-20250830192832-dmdqma1.png]]

web应用程序：

- socket
- web框架
- 业务开发

以`django`为例：

- `wsgiref`模块、`uWSGI`、`daphne`    `->` 本质上都是`socket`实现。
- 原来实现了框架

以`flask`为例：

- `werkzurg`、`uwsgi`、...
- `flask`框架

以`tornado`为例：

- `tornado`、`werkzurg`、`uwsgi`、...
- 框架

### 2.1 wsgiref

```python
from wsgiref.simple_server import make_server

def run_server(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/html')])
    return [bytes('<h1>Hello, web!</h1>', encoding='utf-8'), ]

if __name__ == '__main__':
    httpd = make_server('127.0.0.1', 8000, run_server)
    httpd.serve_forever()
```

### 2.2 werkzeug

```
pip install werkzeug
```

```python
from werkzeug.wrappers import Response

def application(environ, start_response):
    response = Response('Hello World!', mimetype='text/plain')
    return response(environ, start_response)

if __name__ == '__main__':
    from werkzeug.serving import run_simple
    run_simple('localhost', 4000, application)
```

### 2.3 各框架的区别

```
django、flask、tornado、sanic、fastapi..
```

- 以内部集成功能的多少进行划分

  - django，内部提供了很多组件 【相对大】
  - flask、tornado、sanic、fastapi...  本身功能很少 + 第三方组件【相对小】
- 同步框架 vs 异步非阻塞

  - 异步非阻塞：tornado、sanic、fastapi、django
  - 同步：django、flask、bottle、webpy

    ```
    1.django、flask
    2.tornado，异步非阻塞，特别NB。
    	- 同步：常见应用。
    	- 异步：IO应用 + conroutine装饰器 + redis/MySQL/...
    3.sanic，路飞小猿圈平台
    4.fastapi
    	- 参考flask
    	- py最新注解
    	- restfulAPI
    	- 异步
      目前不看好：
    	- 增加编程的难度，功能&效率
    	- 项目中不会有那么IO操作 ---> 100功能/2-IO ---> celery
    ```

- 异步非阻塞框架是如何实现的？

  - socket & 多线程 & 多进程
  - IO多路复用

  参考：[https://www.cnblogs.com/wupeiqi/p/6536518.html](https://www.cnblogs.com/wupeiqi/p/6536518.html)

  ![[../../Python/assets/image-20220619120944641-20250830192832-0xbm34u.png]]

  ![[../../Python/assets/image-20220619122238391-20250830192832-evuhsjc.png]]

## 小结

1. django项目开发，在局域网部署访问。所有人访问云服务器。
2. bs架构、cs架构。
3. 基于socket实现web框架（所有web框架的祖宗）
4. 常见web框架的区别。

    - 功能
    - 异步非阻塞

# Django 快速上手

## 1 基础

### 1.1 快速上手django框架

#### 1）安装

```
pip install django==3.2
```

```
C:\Python39
	- python.exe
	- Scripts
		- pip.exe
		- django-admin.exe
	- Lib
		- re.py
		- random.py
		- site-pakages
			- django==3.2
			  ...
```

#### 2）命令行创建django项目

- 创建项目

  ```
  cd 指定目录
  django-admin startproject 项目名
  ```

  ![[../../Python/Python Web框架/assets/image-20220619144658273-20250830192832-nwldykf.png]]  
  ![[../../Python/Python Web框架/assets/image-20220619144642767-20250830192832-ueyqaom.png]]

  创建项目自动生成的文件

  ```
  mysite
  ├── manage.py			[项目的管理工具]  
  └── mysite
      ├── __init__.py
      ├── settings.py		【配置文件，只有一部分。程序启动时，先读取django内部配置，再读settings.py】
      ├── urls.py			【主路由，在里面编写  /xxx/xxx/xxx ---> index】
      ├── asgi.py			【异步】
      └── wsgi.py			【同步，主】
  ```
- 编写 `urls.py`

  ```python
  from django.contrib import admin
  from django.urls import path

  from django.shortcuts import HttpResponse

  def info(request):
      print("请求来执行了")
      return HttpResponse("xxxx")

  def xxxx(request):
      print("请求来执行了")
      return HttpResponse("。。。。。。")

  urlpatterns = [
      # path('admin/', admin.site.urls),
      path('api/index/', info),
      path('api/show/', xxxx),
  ]
  ```
- 运行

  ```python
  cd 项目
  python manage.py runserver
  python3.9 manage.py runserver
  python3.9 manage.py runserver 127.0.0.1:8000
  python3.9 manage.py runserver 127.0.0.1:9000
  ```
- app概念

  ```python
  cd 项目
  python manage.py startapp 名称
  ```

  ```
  mysite
  ├── manage.py              [项目的管理工具]  
  ├── web
      ├── __init__.py
      ├── views.py           [视图函数]
      ├── models.py          [ORM，基于models可以对数据库进行简便的操作]
      ...
  └── mysite
      ├── __init__.py
      ├── settings.py        【配置文件，只有一部分。程序启动时，先读取django内部配置，再读settings.py】
      ├── urls.py			   【主路由，在里面编写  /xxx/xxx/xxx ---> index 】
      ├── asgi.py            【异步】
      └── wsgi.py            【同步，主】
  ```

  示例：

  ```python
  python manage.py startapp web
  将自动生成web文件
  ```

  ```
  mysite
  ├── manage.py
  ├── mysite
  │   ├── __init__.py
  │   ├── asgi.py
  │   ├── settings.py
  │   ├── urls.py
  │   └── wsgi.py
  └── web
      ├── __init__.py
      ├── admin.py		【管理】
      ├── apps.py			【基础配置】
      ├── migrations		【其中内容自动生成不需要动】
      │   └── __init__.py
      ├── models.py
      ├── tests.py		【单元测试】
      └── views.py
  ```

  【Tip】主要对 `models.py` 和 `views.py` 进行编写

  `urls.py`

  ```python
  from django.contrib import admin
  from django.urls import path

  from web import views

  urlpatterns = [
      # path('admin/', admin.site.urls),
      path('api/index/', info),
      path('api/show/', xxxx),
  ]
  ```

#### 3）虚拟环境 - 命令行

- venv，Python官方用于创建虚拟环境的工具（python3开始支持）

  ```
  python3.9 -m venv name
  python3.9 -m venv path
  ```
- virtualenv 【推荐】

  ```
  pip install virtualenv
  ```

  ```
  cd /xxx/xx/
  virtualenv name --python=python3.9
  virtualenv path --python=python3.7
  ```

- 激活虚拟环境

  - win：`activate`
  - mac：`source /虚拟环境目录/bin/activate`

- 退出虚拟环境：`deactivate`

创建django项目

```python
django-admin startproject xxxx
python manage.py startapp xxxx
python manage.py runserver 
```

#### 4）Pycharm

- 专业版

  新建项目 - Django - 项目路径（名称）- 选择已经安装Django 的Python
- 社区版（仅支持使用虚拟环境）

  - 新建普通Python项目
  - 安装Django

    ```python
    pip install django
    pip install django==3.2 # 指定版本
    ```

  - 打开终端

    ```python
    django-admin startproject 项目名
    ```

  此时在当前项目下，将创建好一个django项目

- 运行项目

  ```python
  python manage.py runserver
  ```
- 创建app

  ```python
  python manage.py startapp app名称
  ```

- 项目示例：

  - 创建app：`python manage.py startapp web`
  - `url.py`

    ```python
    from django.contrib import admin
    from django.urls import path

    from web import views

    urlpatterns = [
        # path('admin/', admin.site.urls),
        path('admin/', admin.site.urls),
        path('xxxx/', views.site.urls),
    ]
    ```
  - `views.py`

    ```python
    from django.shortcuts import render
    from django.shortcuts import HttpResponse

    def xxxx(request):
    	return HttpResponse("stars")

    ```
  - 运行项目：`python manage.py runserver`

- 配置

  专业版：

  `add configuration` → `Add New Configuration（左上角 + ）` → `Django Server`

  - name：配置名称 → 点击右下角 `Fix`

  - 进入 `Preferences`

    - 勾选 Enable Django Support
    - Django project root：项目根目录
    - Settings：项目中的 `settings.py`
    - Manage script：项目中的 `manage.py`

  社区版：

  - 点击运行按钮右边的 按钮（三个点）→ 编辑
  - `Add New Configuration（左上角 + ）` → Python

    - name：配置名称
    - 选择运行环境
    - Script path：`manage.py`
    - Parameters（脚本形参）: 输入 `runserver`
    - Working directory（工作目录）：项目根目录

### 1.2 关于创建 App

- 项目只需要一个app，目录结构的建议

  ```python
  project
  	.venv
      project
      	...
          ...
      manage.py
      app1
  ```

- 项目有多个app

  ```python
  project
  	.venv
      project
      	...
          ...
      manage.py
      apps
      	web
          backend
          api
  ```

  创建方式：

  ```python
  # 在 project 下创建 apps/api 文件夹
  python manage.py startapp api apps/api	# 创建app（终端）
  # 打开 api 中自动生成的apps.py
  name = "apps.api"
  ```

- 注册安装app

  ```python
  # settings
  INSTALLED_APPS = [
      'apps.appname.apps.AppnameConfig'
  ]
  整体路径为app中的apps.py的类名称
  ```

### 1.3 纯净版 Django

- 先建一个纯 Python 工程，再手动 `pip install django==x.x`，然后用 `django-admin startproject xxx .` 创建项目骨架。
- 接着把 settings.py 中“暂时用不到”的 APP、中间件、模板 context\_processors 统统注释或删除，只留下 `django.contrib.staticfiles`（有时也删）和你真正需要的第三方 APP（如 rest\_framework）。
- 典型裁剪结果：  
  INSTALLED\_APPS 只剩 2\~3 项；MIDDLEWARE 去掉 Session、Message、Authentication 相关；TEMPLATES 去掉 auth、messages 的 processor；数据库默认配置可先留空。
- 需要时再自行安装/配置：MySQL、Redis、JWT、CORS 等。
- 目标是把 Django 退化成“一个轻量 WSGI 框架”，更适合：

  - 纯 `RESTful API` 服务
  - 微服务中的一个独立服务
  - Serverless 或容器镜像要求最小化的场景

## 2 路由系统

本质上：URL和函数的对应关系。

### 2.1 传统的路由

- `urls.py`

  ```python
  from django.contrib import admin
  from django.urls import path
  from apps.web import views

  urlpatterns = [
      # path('admin/', admin.site.urls),
      path('home/', views.home),
      path('news/<int:nid>/edit/', views.news),
      path('login/', views.login),
  ]

  ```

- `web\views.py`

  ```python
  from django.shortcuts import render,HttpResponse

  def home(request):
      return HttpResponse("HOME")

  def news(request, nid):
      print(nid)
      page = request.GET.get("page")
      return HttpResponse("News")

  def login(request):
      nid = request.GET.get("nid")
      print(nid)
      return HttpResponse("login")
  ```

- 【Tip】

  - `int`，整数
  - `str`，字符串   排除 `/`
  - `slug`，`字母` `数字` `下滑线` `-`
  - `uuid`，uuid格式
  - `path`，路径，可以包含 `/`

### 2.2 正则表达式 路由

- 在django1 版本用的多，在django2+ 版本用的少

- `urls.py`

  ```python
  from django.contrib import admin
  from django.urls import path,re_path
  from apps.web import views

  urlpatterns = [
      # path('admin/', admin.site.urls),
      # re_path(r'users/(\d+)/', views.users),
      # re_path(r'users/(\w+-\d+)/(\d+)/', views.users),
      re_path(r'users/(?P<xxid>\w+-\d+)/(?P<yid>\d+)/', views.users),
  ]
  ```

  要在 `django.urls` 中导入：`re_path`

  `?P<parameter name>`：传递对应的参数

- `web\views.py`

  ```python
  from django.shortcuts import render,HttpResponse

  def users(request, xxid, yid):
      print(xxid, yid)
      return HttpResponse("Users")
  ```

### 2.3 路由分发

#### 1）inlucde

`inlucde + app` 将功能拆分不到不同的app中

- `urls.py`

  ```python
  from django.contrib import admin
  from django.urls import path,include
  from apps.web import views

  urlpatterns = [
      path('api/', include("apps.api.urls")),
      path('web/', include("apps.web.urls")),
  ]
  ```

  要在 `django.urls` 中导入：`include`

- `api\urls.py`

  ```python
  from django.urls import path
  from apps.api import views

  urlpatterns = [
      # api/auth/
      path('auth/', views.auth),
      # api/login/
      path('login/', views.login),
  ]
  ```

- `api\views.py`

  ```python
  from django.shortcuts import HttpResponse

  def auth(request):
      return HttpResponse("Auth")

  def login(request):
      return HttpResponse("Login")
  ```

- `web\urls.py`

  ```python
  from django.urls import path,re_path
  from apps.web import views

  urlpatterns = [
      # web/home/
      path('home/', views.home),
      # web/article/
      path('article/', views.article),
      # web/users/1xxx
      re_path(r'users/(\w+)/', views.users),
  ]
  ```

- `web\views.py`

  ```python
  from django.shortcuts import HttpResponse

  # Create your views here.
  def home(request):
      return HttpResponse("HOME")

  def article(request):
      nid = request.GET.get("nid")
      print(nid)
      return HttpResponse("Article")

  def users(request, xxid, yid):
      print(xxid, yid)
      return HttpResponse("Users")
  ```

#### 2）手动分发

手动路由分发，可以与 app 无关

- `urls.py`

  ```python
  from django.urls import path
  from apps.api import views

  urlpatterns = [
      # path('user/add/', views.login),
      # path('user/delete/', views.login),
      # path('user/edit/', views.login),
      # path('user/list/', views.login),

      path('user/', ([
          path('add/', views.login),
          path('delete/', views.login),
          path('edit/', views.login),
          path('list/', views.login),
                         ], None, None)),
  ]
  ```

  这种写法能够，将功能提取，有助于开发的管理

#### 3）路由分发的本质

- include 和 手动分发（手动元组列表），本质相同

- URL对应函数

  ```python
  path('user/add/', views.login) 
  ```
- URL对应元组

  ```
  path('user/add/', (元素,appname元素,namespance元素)),
  ```

  ```python
  path('user/add/', include("apps.api.urls")), # include 返回元组
  path('user/add/', ([],None,None)), # 这个元组等同于include的return
  ```

- 元组三元组

  ```python
  path('user/', ([
  					path('add/', views.login),
  					path('delete/', views.login),   # /user/delete/
  					path('edit/', views.login),
  					path('list/', views.login),
                 ], None, None)),
  ```

- 标准`include`写法（内联方式）

  ```python
  path('user/', include(([
                             path('add/', views.login),
                             path('delete/', views.login),  # /user/delete/
                             path('edit/', views.login),
                             path('list/', views.login),
                         ], None))),
  ```

  等价于 `path('user/', include('add.urls'))  # 更常见的写法`

- 特殊写法

  ```python
  project
  └──project
  	└──urls.py
  └──apps
  	└──api
  		└──urls
  			└──v1.py
  			└──v2.py
  		└──views.py
  ```

  - `urls.py`

    ```python
    from django.url import path, include
    urlpatterns = [
    	path('api/' include("apps.api.urls.v1"))
    	path('api/' include("apps.api.urls.v2"))
    ]
    ```
  - `views.py` 也同样可以如上，在api中创建`view`目录 存放多个文件

### 2.4 name

给一个路由起个名字 + 根据名字反向生成URL

```python
urlpatterns = [
    path('login/', views.login, name="v1"),
    path('auth/', views.auth, name="v2"),
]
```

- 在视图函数中生成URL

  ```Python
  from django.urls import reverse
  url = reverse("v2")   # /auth/
  url = reverse("v1")   # /login/
  ```
- HTML模板，页面上有一个a标签，添加xx。

  ```html
  <a href="/xxx/xxx/xx/">添加</a>
  ```

  ```html
  <a href="{% url 'v1' %}">添加</a>
  <a href="{% url 'v2' %}">添加</a>
  ```
- 扩展

  ```
  以后做权限管理，让name属性配合
  ```

- 基于 name和正则 的反向生成（反向解析）

  ```python
  # urls.py
  from django.urls import path,re_path
  from apps.api import views
  urlpatterns = [
      re_path(r'xxx/(?P<nid>\d+)/(?P<tpl>\w+)/', views.auth, name='v3'),
      re_path(r'auth/(\d+)/(\w+)/', views.auth, name='v2'),
      path('login/<str:role>/', views.login, name='v1'),
  ]
  ```

  - 视图函数中

  ```python
  # apps/api/views.py
  from django.shortcuts import HttpResponse
  from django.urls import reverse
  # name
  def auth(request, nid, tpl):
      return HttpResponse("auth")

  def login(request, role):
      # /login/hhh
      url = reverse("v1", kwargs={"role": "hhh"}) # 反向生成 URL
      print(url)
      # /auth/666/ppp
      url = reverse("v2", arge=(666,"ppp"))  # 没有参数名，用 args
      print(url)
      # /xxx/666/ddd
      url = reverse("v3", kwargs={'nid':666, 'tpl':"ddd"})  # 反向生成 URL
      print(url)
      return HttpResponse("login")
  ```

  - html

  ```python
  from django.shortcuts import HttpResponse,render
  # name
  def auth(request, nid, tpl):
      return HttpResponse("auth")

  def login(request, role):
      return render(request, 'login,html')
  ```

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <h1>登录页面</h1>
      <a href="/xxx/xxxx/">调换</a>
      <a href="{% url 'v1' role='x1213123x' %}">跳转</a>
      <a href="{% url 'v2' 666 'x1213123x' %}">跳转</a>
      <a href="{% url 'v3' nid=666 tpl='x1213123x' %}">跳转</a>
  </body>
  </html>
  ```

### 2.5 namespace（命名空间）

作用：给一组 URL 取一个姓，也可以让 `reverse()` / 模板 `{% url %}` 永远能唯一定位到一条路由

> 主路由中加入`namespace`，防止不同app中同名 `name` 撞车

- 主路由 `urls.py`

  ```python
  from django.urls import path, include

  urlpatterns = [
      path('api/', include("apps.api.urls", namespace='x1')),
      path('web/', include("apps.web.urls", namespace='x2')),
  ]
  ```
- `api/urls.py`

  ```python
  from django.urls import path
  from . import views
  urlpatterns = [
      path('login/', views.login, name="login"),
      path('auth/', views.auth, name='auth'),
  ]
  ```
- `web/urls.py`

  ```python
  from django.urls import path
  from . import views
  urlpatterns = [
      path('home/', views.home, name='home'),
      path('order/', views.order, name='order'),
      path('auth/', views.order, name='auth'),
  ]
  ```

- 在某个URL或者视图中反向生成：

  ```python
  from django.urls import reverse
  url = reverse("x1:auth")    # /api/login/
  url = reverse("x2:auth")    # /web/login/
  ```

- `app_name` 应用名

  加入`namespace`还需要设置`app_name`

  ```Python
  # api/urls/py
  from django.urls import path
  from apps.api import views
  urlpatterns = [
      path('login/', views.login, name="login"),
      path('auth/', views.auth, name='auth'),
  ]

  app_name = "api" # 应用名

  # urls.py
  from django.urls import path, include
  urlpatterns = [
      path('api/', include("apps.api.urls", namespace='x1')),
  ]

  # api/views.py
  from django.http import HttpResponse
  from django.shortcuts import render
  from django.urls import reverse

  def login(request):
      url = reverse("x1: login") # 反向生成 URL
      print(url)
      return render(request, 'api/login.html')

  def auth(request):
      return HttpResponse("auth")
  ```

【扩展】

- 手动分发

  ```Python
  # urls.py
  from django.urls import path
  from apps.api import views
  urlpatterns = [
      path('api/', ([
          path('auth/', views.auth, name='auth'),
          path('login/', views.login, name='login'),
                    ], 'x1', 'x1')), # path(url, [urls], app_name, namespace)
  ]

  # api/views.py
  from django.http import HttpResponse
  from django.urls import reverse
  def login(request):
      url = reverse("x1:login") # 反向生成 URL
      print(url)
      return HttpResponse("login")

  def auth(request):
      return HttpResponse("auth")
  ```

- 多层嵌套

  ```Python
  from django.urls import path
  from apps.api import views
  urlpatterns = [
      path('api/', ([
          path('auth/', views.auth, name='auth'),
          path('login/', views.login, name='login'),
          path('x/', ([
              path('xx/', views.login, name='xx'), # /api/x/xx/     x1:yy:xx
              path('xxx/', views.login, name='xxx'), # /api/x/xxx/
          ], 'yy', 'yy')),
                    ], 'x1', 'x1')), # path(url, [urls], app_name, namespace)
  ]
  ```

### 2.6 URL 最后的 `/`（slash）

`APPEND_SLASH = True` 

```python
path('login/', views.login),
	http://127.0.0.1:8000/login/   成功
	http://127.0.0.1:8000/login    django，重定向301（自动加 / ）
```

`APPEND_SLASH = False` 关闭后，则不会自动加 `/` 

```python
path('login/', views.login),
	http://127.0.0.1:8000/login/   成功
	http://127.0.0.1:8000/login    失败
```

若不加 `/` 

```python
path('login', views.login),
	http://127.0.0.1:8000/login    成功
	http://127.0.0.1:8000/login/   失败
```

### 2.7 当前匹配对象

```Python
# url.py
from django.urls import path
from apps.api import views
urlpatterns = [
    path('login/', views.login, name='xx')
]

# apps/api/views.py
from django.http import HttpResponse

def login(request):
    print(request.resolver_match)
    # ResolverMatch(func=apps.api.views.login, args=(), kwargs={}, url_name=xx, app_names=[], namespaces=[], route=login/)
    return HttpResponse("login")

def auth(request):
    return HttpResponse("auth")
```

作用：

- 某用户，具有一些权限。   `permissions = ["xx","login",'account']`
- 某用户，具有一些权限。   `permissions = ["login",'account']`

```Python
# apps/api/views.py
from django.http import HttpResponse

def login(request):
    # 1. 当前用户具备的所有权限
    permissins = ["xx", "login", "account"]
    # 2. 判断是否具有权限
    current_name = request.resolver_match.url_name # 获取当前name值
    if current_name not in permissins:
        return HttpResponse("No permission")
    return HttpResponse("login")

def auth(request):
    return HttpResponse("auth")
```

### 小结

- 常用 & 必须掌握

  - 传统路由
  - 路由分发
  - name
- 少用的

  - 正则
  - namespace
  - 当前对象

【补充】关于 `partial` （在django路由中源码使用）

`partial`：俗称 偏函数，冻结函数的部分参数，返回参数更少的新函数

```Python
from functools import partial

def _xx(a1, a2):
    return a1 + a2
yy = partial(_xx, a2=100)
data = yy(2)
```

## 3 视图

### 3.1 文件or文件夹

正常一个app中只有一个 `views.py` 文件

当功能较复杂的时候，一个文件不够用，此时就需要 `views` 文件夹

```Python
apps/api
	└──views
		└──account
		└──order
		└──auth
	└──urls.py
```

```Python
api/urls.py
from django.urls import path
from apps.api.views import account, order

urlpatterns = [
    path('login/', account.login, name="login"),
    path('auth/', order.auth, name='auth'),
]

app_name = 'api'
```

### 3.2 相对和绝对导入 urls

```Python
# api/urls.py
from django.urls import path
from apps.api.views import account # 绝对导入
from .views import order # 相对导入

urlpatterns = [
    path('login/', account.login, name="login"),
    path('auth/', order.auth, name='auth'),
]

app_name = "api"
```

【Tip】不建议在根目录进行相对导入，Python开发时优先使用绝对导入

### 3.3 视图参数

```Python
urlpatterns = [
    path('login/', account.login, name="login"),
    path('auth/', order.auth, name='auth'),
]
```

```Python
from django.http import HttpResponse

def login(request):
    return HttpResponse("Login")
```

- `request` 是一个对象，存放了浏览器发过来的所有内容，包含有：

  - 请求相关所有的数据： 当前访问的 url、请求方式、...
  - django 额外添加的数据

```Python
request.path_info # 获取当前 URL
request.method # 获取请求方式：GET/POST
```

```Python
request.GET # 获取 URL 传递的参数
request.GET.get("parameter") # 获取 URL 传递的指定字段的参数

request.POST # 获取 POST 请求的全部字段
# request.POST 中被填充的前提，请求头为：
# 1. Content-Type：application/x-www-form-urlencoded
# 2. Content-Type：multipart/form-data
request.POST.get("parameter") # 获取 POST 请求的对应字段的值
request.body # 请求体（原始数据），前提是POST请求
# 若请求体为 b'v1=123&v2=456'，可自动填写成字典
request.headers # 获取请求头，返回 HttpHeaders 对象（字典）
# 请求头中的 cookies
request.COOKIES # 返回（字典）客户端发送的所有 Cookie
```

```Python
# 前提
# 请求方法为 POST/PUT/PATCH 且 enctype="multipart/form-data
request.FILES # 上传文件集合
request.FILES.get("parameter") # 取单个文件对象，键不存在返回 None
```

```Python
request.resolver_match # Django 路由解析后的“匹配结果”对象
```

### 3.4 返回值

- `HttpResponse` 返回任意字符串（HTML/JSON/文本）+ 状态码/头信息
- `JsonResponse` 自动把 Python 对象序列化成 JSON 并带 `Content-Type: application/json`
- `redirect` 返回 **302/301** 重定向，让浏览器再去访问别的 URL
- `render` 加载模板 → 传参渲染 → 返回 HTML 一步到位

```python
from django.shortcuts import HttpResponse, redirect, render
from django.http import JsonResponse

def auth(request):
    pass

def login(request):
    # 1.获取请求数据
    print(request)

    # 2.根据请求数据进行条件的判断 GET/POST   GET.get("xx")    POST.get("xx")

    # 3.返回数据

    # 3.1 字符串/字节/文本数据（图片验证码）
    return HttpResponse("login")

    # 3.2 JSON格式（前后端分离、app小程序后端、ajax请求）
    data_dict = {"status": True, 'data': [11, 22, 33]}
    return JsonResponse(data_dict)

    # 3.3 重定向，不经过路由系统
    return redirect("https://www.baidu.com")
    return redirect("http://127.0.0.1:8000/api/auth/")
    return redirect("/api/auth/") # http://127.0.0.1:8000/api/auth/
	# 反向生成 URL（一般不建议）
    return redirect("auth")  # 根据 name 生成 URL
	# 使用 reverse
    from django.urls import reverse
    url = reverse("auth") # 根据 name 生成 URL
    return redirect(url)  

    # 3.4 渲染
    # - a.找到 'login.html' 并读取的内容，问题：去哪里找？
    # -   默认 先去settings.TEMPLATES.DIRS指定的路径找。（公共）
    # -   按注册顺序在每个已注册的app中找templates目录，寻找'login.html'
	# -   所以建议在app中的templates中在添加一层目录如：api/templates/api/login.html
    # -   一般情况下，原则，哪个app中的的模板，去哪个那个app中寻找。
    # - b.渲染（替换）得到替换后的字符串
    # - c.返回浏览器
    return render(request, 'api/login.html')
```

### 3.5 响应头

```Python
from django.shortcuts import HttpResponse
def login(request):
    res = HttpResponse("login") # 响应体
    # 设置响应头
    res['xx1'] = "hahaha" 
    res['xx2'] = "hahaha"
    res['xx3'] = "hahaha"
    # 设置响应头的 cookie
    res.set_cookie('k1',"aaaaaaaa") 
    res.set_cookie('k2',"bbbbbb")
    return res
```

### 3.6 FBV & CBV

写视图的两种方式：

- FBV，用函数编写（目前主流）
- CBV，用类编写

```Python
# apps/api/urls.py
from django.urls import path
from apps.api.views import account

urlpatterns = [
    path('login/', account.login, name='login'),
    path('users/', account.UserView.as_view(), name='aaaa'),
]
```

```Python
# apps/api/views/account.py
# 函数
from django.shortcuts import HttpResponse
def login(request):
    if request.method == "GET":
        res = HttpResponse("login")
        return res
    else:
        res = HttpResponse("login POST")
        return res

# 类
from django.views import View
class UserView(View):
    def get(self, request): # get请求
        return HttpResponse("get")
    def post(self, request): # post请求
        return HttpResponse("post")
```

- 一个是函数一个是类，但是本质上是一样的，其URL 是一个函数
- 都是“接收请求对象并返回响应对象”的可调用体

## 4 静态资源

- 开发需要：css、js、图片

  ```
  - 根目录的 		/static/
  - app目录下的	/static/ 文件夹下
  ```
- 媒体文件：用户上传的数据（excel / pdf / video）

  ```
  - 根目录的 		/media/
  ```

### 4.1 静态文件

```python
# /sttings.py
import os
INSTALLED_APPS = [
    # 'django.contrib.admin',
    # 'django.contrib.auth',
    # 'django.contrib.contenttypes',
    # 'django.contrib.sessions',
    # 'django.contrib.messages',
    'django.contrib.staticfiles',
    "apps.api.apps.ApiConfig",
    "apps.web.apps.WebConfig",
]
...

STATIC_URL = '/static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'), # 添加静态文件目录
)
```

```Python
urls.py
from django.urls import path, include
urlpatterns = [
    path('', include('apps.api.urls')),
]
# apps/api/urls.py
from django.urls import path
from apps.api.views import account
urlpatterns = [
    path('login/', account.login),
]
# apps\api\views\account.py
from django.shortcuts import render
def login(request):
    return render(request, 'api/login.html')
```

【Tip】需要收集文件时，要在根目录或者app的目录下手动创建 `static` 文件夹

- 查找文件顺序：根目录`static` → app中的`static`

  【问题】在删除根目录的文件后，不显示app 中的图片，浏览器200状态

  解决方法：清理浏览器缓存
- 多app开发：文件放在各自同名的文件夹中  `appname/static/appname/...`

```html
{% load static %}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>Login</h1>
        <!-- <img src="/static/api/1.png" width="400" height="225">-->
        <!-- 不建议以上写法-->
		<img src="{% static 'api/1.png' %}" width="400" height="225"></img>
</body>
</html>
```

- `/static/api/file` 写死 `/static/`，换前缀要全项目改
- `{% load static %}` + `{% static 'file' %}` 好处：

  - 无需 `STATICFILES_DIRS`
  - 自动读取 `STATIC_URL`
- 若静态文件在app之外再使用 `STATICFILES_DIRS`

### 4.2 媒体文件

需手动在根目录创建 `media` 文件夹

```html
{% load static %}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>Login</h1>
        <!-- <img src="/static/1.png" width="400" height="225">-->
        <img src="{% static '1.png' %}" width="400" height="225"></img>
        <img src="/media/123.jpg">
</body>
</html>
```

```python
# urls.py
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('api/', include('apps.api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## 小结

- 请求周期

  - 路由系统

    - 最基本路由关系
    - 动态路由（含正则）
    - 路由分发不同的app中 + include + 本质 + name + namespace
  - 视图

    - 类和函数（FBV和CBV）
    - 参数 request

      - 请求数据
      - 自定义数据
    - 响应

      ```
      HttpResponse/JsonResponse/render/redirect
      return HttpResponse("...")

      响应头
      obj = HttpResponse("...")
      obj['xxxxx'] = "值"
      return obj
      ```
- 其他知识

  - 虚拟环境
  - 纯净版项目，内置app功能去掉。
  - 多app，嵌套到apps目录。
  - pycharm创建django项目 + 虚拟环境

    - 最新的django项目
    - 低版本（环境+项目+django文件模板）
  - settings配置

    ```
    django默认settings [先加载] 500
    项目目录settings    [后加载] 20
    ```
  - 静态资源

    - 静态文件，项目必备【项目根目录，每个app目录下static - app注册顺序】
    - 媒体文件，用户上传

## 5 模板

### 5.1 寻找html模板

```python
# settings.py
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')], # 设置模板目录，在根目录中的 templates 寻找模板
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

寻找模板的顺序：优先去项目根目录  → 每个app的 `templates` 中找

【Tip】如果 **`DIRS`** 不设置格外的路径，则只会在每个app中的 `templates` 中找

如何选择：

- 简单的项目，模板都放在根目录，在`templates`创建多个 app 文件夹
- 复杂的项目，模板放在各自的app中，公共部分放在根目录的 `templates`

【建议】模板路径：`appname/templates/appname/file` 可以避免因重名的问题

【扩展】

```python
project
└──apps
	└──app01
		└──templates
			└──app01
				└──file
└──templates
	└──admin    # 修改内置模块
		└──file
	└──app01
		└──file # 顶替apps中的文件
	└──app01
```

### 5.2 模板处理的本质

```python
# urls.py
from django.urls import path
from apps.app01 import views
urlpatterns = [
    path('index/', views.index)
]
```

```python
# app01/views.py
from django.shortcuts import render
def index(request):
    return render(request, 'app01/index.html', {'n1': '仙人掌', 'n2': '玫瑰'})
```

```html
{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>首页app01{{n1}}</h1>
    <script src="{% static 'app01/v1.js' %}"></script><!-- {{ n2 }} -->
    <!--这里只能读取到 js 的静态文件，无法进行其它任何操作-->
    <script>alert("{{ n2 }}")</script><!-- 玫瑰 -->
</body>
</html>
```

步骤：

1. 读取模板文件：`render(request, '模板.html', context)`
2. 模板引擎（渲染）：变量替换、标签执行、过滤器/注释/继承
3. 得到纯字符串（HTML/CSS/JS 源码）
4. 打包成 `HttpResponse` 对象，返回给浏览器

### 5.3 常用语法

```python
# app01/views.py
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def get_data(self):
        return "def"

def fetch_data():
    return "Fetch"

def gen_data():
    yield 123
    yield 456
    yield 789

def index(request):
    context = {
        "n1": "仙人掌",
        "n2": [11, 22, 33, 44],
        "n3": {
            "name": "武沛齐",
            "age": 19,
        },
        'n4': [
            {"id": 1, "name": "新晨1", "age": 18},
            {"id": 2, "name": "新晨2", "age": 28},
            {"id": 3, "name": "新晨3", "age": 38},
            {"id": 4, "name": "新晨4", "age": 48},
        ],
        'n5': [
            Person('xinchen1', 18),
            Person('xinchen2', 28),
        ],
        'n6': fetch_data,
        'n7': gen_data,
    }
    return render(request, 'app01/index.html', context)
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>首页app01{{n1}}</h1>
    <p>{{ n2.0 }}</p>
    <p>{{ n2.2 }}</p>
    <ul>
        {% for item in n2 %}
        <li>{{ item }}</li>
        {% endfor %}
    </ul>
    <hr/>
    <p>{{ n3.name }}</p>
    <p>{{ n3.age }}</p>
    <ul>
        {% for k,v in n3.items %}
        <li>{{ k }} = {{ v }}</li>
        {% endfor %}
    </ul>
    <hr/>
    <table border="1">
        {% for item in n4 %}
        <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.age }}</td>
        </tr>
        {% endfor %}
    </table>
    <hr/>
    <p>{{ n5.0.name}}</p>
    <p>{{ n5.1.age}}</p>
    <p>{{ n5.1.get_data}}</p>
    <hr/>
    <p>{{ n6 }}</p>
    <hr/>
    <p>{{ n7 }}</p>
    <ul>
        {% for item in n7 %}
        <li>{{ item }}</li>
        {% endfor %}
    </ul>
</body>
</html>
```

![[../../Python/Python Web框架/assets/image-20250908221640-q9x73da.png]]

### 5.4 内置函数

```python
# app01/views.py
from django.shortcuts import render
import datetime as datatime
def index(request):
    context = {
        "n1" : "仙人掌",
        "n8" : "ZhangKai",
        "n9" : datatime.datetime.now(),
        "n10" : datatime.datetime.now().strftime("%Y-%m-%d"),
    }
    return render(request, 'app01/index.html', context)
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>首页app01{{n1}}</h1>
    <h2>{{ n8 }}</h2>
    <h2>{{ n8|upper }}</h2><!--转成大写-->
    <h2>{{ n8|lower }}</h2><!--转成小写-->
    <h2>{{ n9 }}</h2>
    <h2>{{ n9|date:"Y-m-d H:i:s" }}</h2>
    <h2>{{ n10 }}</h2>
</body>
</html>
```

### 5.5 自定义模板功能

1. 确保app已在注册（settings）
2. 在app中创建 `templatetags` 文件夹
3. `templatetags/my_tag.py` 编写自定义模板功能

    - 自定义过滤器：`@register.filter`
    - 自定义简单标签：`@register.simple_tag` 返回字符串
    - 自定义包含标签：`@register.inclusion_tag('my_form.html')` 返回渲染好的小段模板
4. 模板里加载并使用

    ```html
    {% load my_tags %}   <!-- 加载模板 -->

    {{ con|my_filter }}			<!-- 过滤器 -->
    {% if my_filter "参数" %}<!-- 过滤器 -->
    {% con "参数1" "参数2" %}	<!-- 简单标签 -->
    {% my_form "默认值" %}		<!-- 包含标签 -->
    ```

- 【示例】编写自定义功能

  ```python
  # my_tag,py
  from django import template
  register = template.Library()

  @register.filter
  def myfunc(value):
      return value.upper()

  @register.simple_tag
  def mytag1():
      return 'hello world'

  @register.simple_tag
  def mytag2(a1, a2):
      return a1 + 'hello world' + a2

  @register.inclusion_tag('app01/my_form.html')
  def my_form():
      # <h1>{{name}}--{{age}}</h1>
      return {'name': 'form', 'age':100} # form--100
  ```

  ```python
  # app01/views.py
  from django.shortcuts import render
  def index(request):
      context = {
          "n8": "ZhangKai",
          'n11': [
                      {"id": 1, "name": "XinChen1", "age": 18},
                      {"id": 2, "name": "XinChen2", "age": 28},
                      {"id": 3, "name": "XinChen3", "age": 38},
                      {"id": 4, "name": "XinChen4", "age": 48},
                  ],
      }
      return render(request, 'app01/index.html', context)
  ```

  ```html
  {% load my_tag %}
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <h1>首页app01{{n1}}</h1>
      <h2>{{ n8 }}</h2>
      <h2>{{ n8|upper }}</h2><!--转成大写-->
      <h2>{{ n8|lower }}</h2><!--转成小写-->
      <h2>{{ n8|myfunc }}</h2><!--转成小写-->
      <hr/>
      <table border="1">
          {% for item in n11 %}
          <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.name|myfunc }}</td><!--只需在这循环一次，视图函数中不需循环-->
              <td>{{ item.age }}</td>
          </tr>
          {% endfor %}
      </table>
      <hr/>
      <p>{% mytag1 %}</p>
      <p>{% mytag2 "my " " !" %}</p>
      <hr/>
      <p>{% my_form %}</p>
  </body>
  </html>
  ```

- 【案例】根据用户权限不同显示不同的菜单

  ```python
  # my_tag,py
  from django import template
  register = template.Library()

  @register.inclusion_tag('app01/menu.html')
  def menu(role):
      if role == "user":
          return {
              'data': [
                  {"title":"用户管理", "url":"/xxxx/xxx"},
                  {"title":"账户管理", "url":"/xxxx/xxx"}
              ]
          }
      if role == "admin":
          return {
              'data': [
                  {"title":"用户管理", "url":"/xxxx/xxx"},
                  {"title":"订单管理", "url":"/xxxx/xxx"},
                  {"title":"财务管理", "url":"/xxxx/xxx"},
                  {"title":"订单管理", "url":"/xxx/xxx"}
              ]
          }
  ```

  ```python
  # app01/views.py
  from django.shortcuts import render
  def index(request):
      context = {
          "n12": 18,
      }
      return render(request, 'app01/index.html', context)
  ```

  ```html
  <!-- menu.html -->
  <ul>
      {% for item in data %}
          <li><a href="{{ item.url  }}">{{ item.title }}</a></li>
      {% endfor %}
  </ul>
  ```

  ```html
  <!-- index.html -->
  {% load my_tag %}
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <h1>首页app01{{n1}}</h1>
      {% if n12 >= 18 %}
          <h4>成年人</h4>
      {% else %}
          <h4>未成年人</h4>
      {% endif %}
      <hr/>
      {% menu 'user' %}
      {% menu 'admin' %}
  </body>
  </html>
  ```

### 5.6 继承和母版

一般作为母版的模板，作用于多个app，故建议放在根目录的 `templates`

- 母版基础结构

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <link rel="stylesheet" href="公共CSS文件">
      {% block css %} {% endblock %}
  </head>
  <body>
      <div>头部</div>
      {% block body %} {% endblock %}
      <div>尾部</div>

  <link rel="stylesheet" href="公共JS文件">
  {% block js %} {% endblock %}
  </body>
  </html>
  ```

- 子模板结构

  ```html
  {% extends '母版.html' %}<!--继承-->
  {% block css %} {% endblock %}
  {% block body %}{% endblock %}
  {% block js %}	{% endblock %}
  ```

- 【示例】

  ```python
  # url.py
  from django.urls import path
  from apps.app01 import views
  urlpatterns = [
      path('index/', views.index),
      path('home/', views.home),
      path('user/', views.user)
  ]
  ```

  ```python
  # app01/views.py
  from django.shortcuts import render
  def index(request):
      return render(request, 'app01/index.html')
  def home(request):
      return render(request, 'app01/home.html', {'title': '首页', 'info' : '这是首页'})

  def user(request):
      return render(request, 'app01/user.html', {'title': 'user'})
  ```

  ```html
  <!--layout.html-->
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <link rel="stylesheet" href="公共CSS文件">
      {% block css %} {% endblock %}
  </head>
  <body>
      <div>头部</div>
      {% block body %} {% endblock %}
      <div>尾部</div>

  <link rel="stylesheet" href="公共JS文件">
  {% block js %} {% endblock %}
  </body>
  </html>
  ```

  ```html
  <!--home.html-->
  {% extends 'layout.html' %}<!--继承-->
  {% block body %}
      <h1>HOME</h1>
      <p>{{ info }}</p>
  {% endblock %}
  ```

  ```html
  <!--user.html-->
  {% extends 'layout.html' %}<!--继承-->
  {% block body %}
      <h1>User</h1>
  {% endblock %}
  ```

### 5.7 模板的导入

- 【示例】

  ```html
  <!--要导入的模板-->
  <h1>头部:{{ title }}</h1>
  <h2>头部下方</h2>
  ```

  ```html
  {% extends 'layout.html' %}<!--继承-->
  {% block body %}
      <h1>HOME</h1>
      {% include 'app01/header.html' %}<!--导入模板-->
  	<!--把模板的内容直接插入并替换变量-->
      <p>{{ info }}</p><!--替换变量-->
  {% endblock %}
  ```

  渲染步骤：将母版整体替换 → 替换上下文变量 → 把模板的内容直接插入并替换变量 → HTML 字符串

## 6 中间件

![[../../Python/Python Web框架/assets/屏幕截图 2025-09-09 182234 - 副本-20250909182901-lena2rv.png]]

- 类

  在根目录创建 `middleware` 文件夹，将中间件文件放入，再编写 `class`
- 定义方法
- 注册

  ```python
  # settings
  MIDDLEWARE = [
      'middleware.md.MyMd'
  ]
  # 路径：中间件文件中类的路径
  ```

### 6.1 原始方式

- 最原始的编写方式

```python
# middleware/md.py
class MyMd(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print("开始执行视图函数之前")
        response = self.get_response(request)
        print("执行完毕视图函数之后")
        return response
```

### 6.2 MiddlewareMixin

- 正常编写

  ```python
  from django.utils.deprecation import MiddlewareMixin
  class MyMd(MiddlewareMixin):
      def process_request(self, request):
          print("开始执行视图函数之前")

      def process_response(self, request, response):
          print("执行完毕视图函数之后")
  # django内部默认执行 call 方法，传入参数
  ```

- 参考源码（面向对象、反射）

  ```python
  from django.http import HttpResponse
  class MyMd(object):
      def __init__(self, get_response):
          self.get_response = get_response

      def __call__(self, request):
          if hasattr(self, 'process_request'):
              response =  self.process_request(request)
          response = response or self.get_response(request)
          if hasattr(self, 'process_response'):
              self.process_response(request, response)
          return response

      def process_request(self, request):
          print("开始执行视图函数之前")
          request.xxx = 123
          return HttpResponse("终止")

      def process_response(self, request, response):
          print("执行完毕视图函数之后")
          return HttpResponse("都不用")
  ```

【问题】`prcess_request` 执行时，是否已执行了路由匹配？

- 在完成所有 `process_request` 之后，才会执行路由匹配
- 然后在回到最开始的中间件，再执行每一个 `process_view`
- 再执行视图函数

```python
from django.utils.deprecation import MiddlewareMixin
class MyMd(MiddlewareMixin):
    def process_request(self, request):
        print("开始执行视图函数之前")
        print(request.resolver_match)# None

    def process_view(self, request, view_func, view_args, view_kwargs):
        print(request, view_func, view_args, view_kwargs)
        # <WSGIRequest: GET '/user/'> <function user at 0x0000020BAE340670> () {}

    def process_response(self, request, response):
        print("执行完毕视图函数之后")
        print(request.resolver_match)
        # ResolverMatch(func=apps.app01.views.user, args=(), kwargs={}, url_name=None, app_names=[], namespaces=[], route=user/)
        return response

    def process_exception(self, request, exception): # 捕获异常，处理异常(自定义异常界面)
        print("出现异常", exception)

    def process_template_response(self, request, response):
		# 触发条件：视图函数返回TemplateResponse对象  or  对象中含有.render方法
        return response # 拦截并修改「模板响应对象」（即 TemplateResponse）
```

【Tip】`process_view` 在django源码中写死

## 7 ORM

- orm，关系对象映射
- 通过编写 class 生成数据库中的表，以及操作类中的对象（表数据）

- 本质：翻译（装换）的过程
- 特点：开发效率高、执行效率低

![[../../Python/Python Web框架/assets/image-20220703155844071-20250830193045-9x681vm.png]]

### 7.1 编写ORM操作的步骤

- 连接数据库

  ```python
  # settings.py
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.sqlite3',
  		# 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
          'NAME': BASE_DIR / 'db.sqlite3',
      }
  }
  ```

- 注册app

  ```python
  # settings.py
  INSTALLED_APPS = [
      ...
      'app_name.apps.AppNameConfig',   # 配置类
  ]
  ```

- 编写 `models.` 类

  ```python
  # models.py（app中）
  from django.db import models
  class TableName(models.Model):
      ....
      ....
  ```

- 生成 & 执行迁移

  根据 `models.py` 在 `appname/migrations` 中生成一个 `对数据库操作的配置文件`

  ```python
  python manage.py makemigrations   # 生成迁移文件
  ```

  读取已注册app中的 `migrations` 目录，将配置文件转换成 `SQL`（生成表、修改表），并连接数据库运行

  ```python
  python manage.py migrate           # 真正建表
  ```

### 7.2 表结构

- 实现：创建表、修改表、删除表
- 在app中的 `models.py` 中按照规则编写 `class`    ===> 表结构
- 编写类

  ```python
  from django.db import models
  class UserInfo(models.Model):
      name = models.CharField(max_length=16)
      age = models.IntegerField()
  ```

  - 生成表名：`appname_classname` （类名小写，如 `app01_userinfo`）

- 【Tip】不要再手动去修改数据的表结构 + 时刻保证 ORM 和 数据表是对应

#### 1）常见字段和参数

- 字段

  ```python
  CharField		（字符串）
  TextField		（长文本） 如果字符很多最好存储在文件中
  IntegerField			（整型）
  BigIntegerField			（长整型）
  SmallIntegerField		（短整型）
  PositiveIntegerField	（正整型）
  PositiveBigIntegerField	（正长整型）
  DateField		（日期）
  DateTimeField	（时间）
  BooleanField	（布尔值） MySQL没有Bool，借助SmallIntegerField创造出来：0/1
  DecimalField	（小数）
  ```

- 参数

  ```python
  name = models.CharField(verbose_name="姓名", max_length=16, default="默认值",
                          null=True, blank=True,
                          db_index=True, unique=True,
                          choices=(("sh", "上海"), ("bj", "北京"))
                          )
  # max_length 	容纳字符数量

  age = models.IntegerField(verbose_name="年龄", default=1,
                            db_index=True, unique=True,
                            null=True, blank=True,
                            choices=((1, "小于18"), (2, "18-25"), (3, "25-30")) )
  # IntegerField、BigIntegerField、SmallIntegerField、PositiveIntegerField、PositiveSmallIntegerField 都是整型参数一致
  # CharField 与 IntegerField 参数的区别: IntegerField 没有 max_length, choices 存储整型

  create_data = models.DateField(verbose_name="日期", auto_now=True)
  xcreate_data = models.DateTimeField(verbose_name="时间")
  # auto_now=True 调用 .save() 时自动添加当前时间

  active = models.BooleanField(verbose_name="是否激活")
  price = models.DecimalField(verbose_name="价格", max_digits=5, decimal_places=2)
  # max_digits        最大位数
  # decimal_places 	小数位数

  ''' 
  verbose_name 	备注名    
  default 		默认值
  null 			数据库能否为空，官方建议尽量避免 null=True 在 CharField/TextField/BooleanField 使用
  blank			用户填写的数据（页面）能否为空
  db_index		添加索引，查询方便
  unique		    创建唯一索引
  choices		    添加选项（数据库存储 sh、bj，页面显示 上海、北京）
  '''
  ```

- 【案例】用户表、商品表

  ```python
  from django.db import models
  class UserInfo(models.Model):
      name = models.CharField(verbose_name="姓名", max_length=16, db_index=True)
      age = models.PositiveIntegerField(verbose_name="年龄")
      email = models.CharField(verbose_name="邮箱", max_length=128, unique=True)
      amount = models.DecimalField(verbose_name="余额", max_digits=10, decimal_places=2, default=0)
      register_date = models.DateField(verbose_name="注册时间", auto_now=True)

  class Goods(models.Model):
      title = models.CharField(verbose_name="标题", max_length=32)
      # detail = models.CharField(verbose_name="详细信息", max_length=255)
      detail = models.TextField(verbose_name="详细信息")
      price = models.PositiveIntegerField(verbose_name="价格")
      count = models.PositiveBigIntegerField(verbose_name="库存", default=0)
  ```

#### 2）表关系

- 单表：不与其它表存在关系
- 一对多
- 多对多
- 一对一

```python
# ForeignKey
models.ForeignKey(
    to=Department,				# 必填：模型类名（关联表）或 'app.Model' 字符串  
    on_delete=models.CASCADE,	# 必填：关联对象被删时
				# 1. CASCADE     级联删除
			    # 2. SET_NULL    设置为 null
			    # 3. SET_DEFAULT 设置为 默认值	
    related_name='employees',	# 反向查询名（默认 模型_set）
    null=True, blank=True,		# on_delete=models.SET_NULL 必写
    db_index=True, 				# 添加索引
    verbose_name='可读字段名',   	# 可读字段名
)
```

- 【案例1】一对多

  |部门表||
  | --------| --------|
  |id|title|
  |1|销售|
  |2|运营|
  |3|新媒体|

  |用户表|||
  | --------| ------| -----------|
  |id|name|depart_id|
  |1|张弛|1|
  |2|周叶|1|
  |3|张三|2|
  |4|李四|3|

  ```python
  from django.db import models
  class Department(models.Model):
      """部门表"""
  	# id = models.BigAutoField(primary_key=True)
  	# 默认添加 id
      title = models.CharField(verbose_name="标题", max_length=32)
  	class Meta:
  		db_table = "department" # 自定义表名，默认为 appname_department

  class UserInfo(models.Model):
      """用户表"""
  	# id,name,depart_id
      name = models.CharField(verbose_name="用户名", max_length=16)
  	# depart_id -> type:bigint
      depart = models.ForeignKey(verbose_name="部门ID",
                                 to="Department", # 关联的表
                                 to_field="id", 	# 指定关联的表字段
                                 on_delete=models.SET_NULL, null=True, blank=True
                                 # on_delete 删除关联的表数据时，本表数据如何处理
                                 # 1. CASCADE     级联删除
                                 # 2. SET_NULL    设置为 null
                                 # 3. SET_DEFAULT 设置为 默认值
                                 )
  # 建表默认添加 id ，不写 to_field 的话就会默认匹配 主键id
  # 若 on_delete=models.SET_NULL 基本都要设置 null=True, blank=True
  ```

- 【案例2】多对多

  |男生表||
  | --------| --------|
  |id|name|
  |1|石军|
  |2|老张|
  |3|乔布斯|

  |女生表||
  | --------| --------|
  |id|name|
  |1|凤姐|
  |2|奶茶妹|
  |3|吉娃|

  |关系表|||
  | --------| -----| -----|
  |id|bid|gid|
  |1|1|1|
  |2|1|2|
  |3|1|3|
  |4|2|1|
  |5|3|1|
  |6|||

  ```python
  from django.db import models
  class Boy(models.Model):
      """男孩表"""
      name = models.CharField(verbose_name="姓名", max_length=16)

  class Girl(models.Model):
      """女孩表"""
      name = models.CharField(verbose_name="姓名", max_length=16)

  class B_G(models.Model):
      """男孩女孩关系表"""
      boyID = models.ForeignKey(verbose_name="男孩ID", to="Boy", to_field="id", on_delete=models.CASCADE)
      girlID = models.ForeignKey(verbose_name="女孩ID", to="Girl", to_field="id", on_delete=models.CASCADE)
  ```

  - django 中的特殊写法

  ```python
  class Boy(models.Model):
      """男孩表"""
      name = models.CharField(verbose_name="姓名", max_length=16)

  class Girl(models.Model):
      """女孩表"""
      name = models.CharField(verbose_name="姓名", max_length=16)
      relation = models.ManyToManyField(verbose_name="男女关系", to="Boy")
      # ManyToManyField 多对多, 自动生成关联表
      # 只能生成 id、bid、gid
  ```

  【Tip】实际开发中使用 `ManyToManyField` 生成表，没有自己编写表直观
- 一对一

  ```python
  表，100列     ->  50A表      50B表

  博客园为例：
  	- 注册，用户名、密码，无法创建博客
  	- 开通博客  地址/
  ```

  ```python
  from django.db import models
  class UserInfo(models.Model):
      name = models.CharField(verbose_name="用户名", max_length=32, db_index=True)
  	pwd = models.CharField(verbose_name="密码", max_length=32)
  class Blog(models.Model):
  	# user = models.ForeignKey(to="UserInfo", on_delete=models.CASCADE, unique=True)
  	user = models.OneToOneField(to="UserInfo", on_delete=models.CASCADE)
  	blog = models.CharField(verbose_name="博客地址", max_length=255)
  	summary = models.CharField(verbose_name="简介", max_length=128)
  ```

【Tip】设计项目表结构：表名和字段都不要拼音

### 7.3 连接数据库

- 连接 SQL 类

  ```python
  # 默认
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.sqlite3',
          'NAME': BASE_DIR / 'db.sqlite3',
      }
  }
  ```

- 连接 MySQL

  需先在 MySQL 创建数据库

  ```python
  # settings
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.mysql',
          'NAME': 'database_name',  # 数据库名字
          'USER': 'root',
          'PASSWORD': 'root123',
          'HOST': '127.0.0.1',  # ID
          'PORT': 3306,
      }
  }
  ```

  安装第三方组件

  - pymysql（建议使用）

    ```python
    pip install pymysql
    ```

    ```python
    # project/project/__init__.py
    import pymysql
    pymysql.install_as_MySQLdb()
    ```
  - mysqlclient（mysqlclient的分支）需要提前安装 mysql 或 mysql-client

    ```python
    pip install mysqlclient
    ```

- 连接其它数据库

  ```python
  # pip install psycopg2
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.postgresql',
          'NAME': 'mydatabase',
          'USER': 'mydatabaseuser',
          'PASSWORD': 'mypassword',
          'HOST': '127.0.0.1',
          'PORT': 5432,
      }
  }
  ```

  ```python
  # pip install cx-Oracle
  DATABASES = {
  	'default': {
          'ENGINE': 'django.db.backends.oracle',
          'NAME': "xxxx",  		# 库名
          "USER": "xxxxx",  		# 用户名
          "PASSWORD": "xxxxx",  	# 密码
          "HOST": "127.0.0.1",  	# ip
          "PORT": 1521,  			# 端口
      }
  }
  ```

### 7.4 连接池

django默认内置没有数据库连接池

```python
pymysql --> 操作数据库
DBUtils --> 连接池
```

- 连接池组件

[https://pypi.org/project/django-db-connection-pool/](https://pypi.org/project/django-db-connection-pool/)

```python
pip install django-db-connection-pool
```

```python
DATABASES = {
    "default": {
        'ENGINE': 'dj_db_conn_pool.backends.mysql',
        'NAME': 'database_name',# 数据库名字
        'USER': 'root',
        'PASSWORD': 'root123',
        'HOST': '127.0.0.1',  	# ip
        'PORT': 3306,
        'POOL_OPTIONS': {
            'POOL_SIZE': 10,  	# 最少
            'MAX_OVERFLOW': 10, # 最多增加10个，即：最多20个
            'RECYCLE': 24 * 60 * 60,  # 连接可以被重复用多久，超过会重新创建，-1表示永久。
            'TIMEOUT':30, 		# 池中没有连接，最多等待的时间
        }
    }
}
```

【Tip】该组件基于 [SQLAlchemy](https://github.com/sqlalchemy/sqlalchemy) 

### 7.5 多数据库

django支持项目连接多个数据库

```python
DATABASES = {
    "default": {
        'ENGINE': 'dj_db_conn_pool.backends.mysql',
        'NAME': 'day05_database',# 数据库名字
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': '127.0.0.1',  	# ip
        'PORT': 3306,
        'POOL_OPTIONS': {
            'POOL_SIZE': 10,  	# 最少
            'MAX_OVERFLOW': 10, # 最多增加10个，即：最多20个
            'RECYCLE': 24 * 60 * 60,  # 连接可以被重复用多久，超过会重新创建，-1表示永久。
            'TIMEOUT':30, 		# 池中没有连接，最多等待的时间
        }
    },
    "db_day05": {
        'ENGINE': 'dj_db_conn_pool.backends.mysql',
        'NAME': 'day05_database_1',# 数据库名字
        'USER': 'root',
        'PASSWORD': '123456',
        'HOST': '127.0.0.1',  	# ip
        'PORT': 3306,
        'POOL_OPTIONS': {
            'POOL_SIZE': 10,  	# 最少
            'MAX_OVERFLOW': 10, # 最多增加10个，即：最多20个
        }
    }
}
```

#### 1）读写分离

```python
192.168.1.2		default 	master	[写]
            	组件
192.168.2.12	db_day05 	slave	[读]
```

- 生成数据库表

  ```bash
  python manage.py makemigrations

  python manage.py migrate # 只连接默认数据库 default
  python manage.py migrate --database=default
  python manage.py migrate --database=db_day05 # 非默认数据库需手动连
  ```
- 后续开发

  ```python
  # app01.views.py
  from app01 import models
  def index(request):
      models.UserInfo.objects.using("default").create(title='yuyu') # 创建（写）数据
      # using() 指定数据库
      models.UserInfo.objects.using("db_day05").all() # 查询（读）数据
  ```
- 编写 `router` 类，简化【后续开发】

  ```python
  class DemoRouter(object):
      def db_for_read(...):
          return "db_day05"
      def db_for_write(...):
          return "default"
  ```

  ```
  router = ["DemoRouter"]
  ```

  - 【示例】

    ```bash
    # settings.py
    DATABASE_ROUTERS = ['utils.router.DemoRouter']
    ```

    ```python
    # app01/views.py
    from django.shortcuts import HttpResponse
    from app01 import models
    def index(request):
        models.UserInfo.objects.create(title='yuyu')# 创建（写）数据
        res = models.UserInfo.objects.all() 		# 查询（读）数据
        print(res)
        return HttpResponse("OK")
    ```

    ```python
    # root/utils/router.py
    class DemoRouter(object):
        def db_for_read(self, model, **hints):
            print("read:")
            print(model._meta.app_label) # app01
            print(model._meta.model_name) # userinfo
            print(hints) # {}
            if model._meta.app_label == "userinfo":
                return "db_day05"
            return "default"

        def db_for_write(self, model, **hints):
            print("write:")
            print(model._meta.app_label)  # app01
            print(model._meta.model_name)  # userinfo
            print(hints)  # {}
            return "default"
    ```

#### 2）分库（多个app `->` 多数据库）

100张表，50表-A数据库【app01】；50表-B数据库【app02】

```python
# app01/models.py
from django.db import models
class UserInfo(models.Model):
    title = models.CharField(verbose_name="标题", max_length=32)
```

```python
# app02/models.py
from django.db import models
class UserInfo(models.Model):
    title = models.CharField(verbose_name="标题2", max_length=32)
```

```python
python manage.py makemigrations
python manage.py migrate app01 --database=default
python manage.py migrate app02 --database=db_day05
```

![[../../Python/Python Web框架/assets/image-20250912155827-5i066n4.png]]![[../../Python/Python Web框架/assets/image-20250912155838-630f06g.png]]

- 读写操作

  ```python
  # app01/models.py
  from django.db import models
  class UserInfo(models.Model):
      title = models.CharField(verbose_name="标题", max_length=32)
  # app02/models.py
  from django.db import models
  class Role(models.Model):
      title = models.CharField(verbose_name="标题2", max_length=32)
  ```

  ```python
  # app01/views.py
  from django.shortcuts import HttpResponse
  from app01 import models as m1
  from app02 import models as m2

  def index(request):
      # app01中的操作 -> default
      v1 = m1.UserInfo.objects.all()
      print(v1)
      # app02中的操作 -> db_day05
      v2 = m2.Role.objects.using('db_day05').all()
      print(v2)
      return HttpResponse("返回")
  ```

  - `router`

    ```python
    # app01/views.py
    from django.shortcuts import HttpResponse
    from app01 import models as m1
    from app02 import models as m2

    def index(request):
        # app01中的操作 -> default
        v1 = m1.UserInfo.objects.all()
        print(v1)
        # app02中的操作 -> db_day05
        v2 = m2.Role.objects.all()
        print(v2)
        return HttpResponse("返回")
    ```

    ```python
    # root/utils/router.py
    class DemoRouter(object):
        def db_for_read(self, model, **hints):
            if model._meta.app_label == "app01":
                return "default"
            if model._meta.app_label == "app02":
                return "db_day05"

        def db_for_write(self, model, **hints):
            if model._meta.app_label == "app01":
                return "default"
            if model._meta.app_label == "app02":
                return "db_day05"
    ```

    ```python
    python manage.py makemigrations
    python manage.py migrate app01 --database=default
    python manage.py migrate app02 --database=db_day05
    ```

#### 3）分库（单app）

100张表，50表-A数据库；50表-B数据库

【Tip】必须借助 `router`

```python
# app01/models.py
from django.db import models
# defult
class UserInfo(models.Model):
    title = models.CharField(verbose_name="标题1", max_length=32)
# db_day05
class Role(models.Model):
    title = models.CharField(verbose_name="标题2", max_length=32)
# db_day05
class Depart(models.Model):
    title = models.CharField(verbose_name="标题3", max_length=32)
```

```python
# app01/views.py
from django.shortcuts import HttpResponse
from app01 import models as m1

def index(request):
    res = m1.UserInfo.objects.all()
    print(res)
    return HttpResponse("返回")
```

```python
# router.py
class DemoRouter(object):
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if db == "db_day05":
            if model_name in ["role", "depart"]:
                return True
            else:
                return False
        if db == "default":
            if model_name in ["userinfo"]:
                return True
            else:
                return False
        # return: True  - 迁移到该数据库(python manage.py migrate)
        # return: False - 不迁移
```

```python
python manage.py makemigrations
python manage.py migrate app01 --database=default
python manage.py migrate app01 --database=db_day05
```

- 读写操作

  ```python
  # app01/models.py
  from django.db import models
  # defult
  class UserInfo(models.Model):
      title = models.CharField(verbose_name="标题1", max_length=32)
  # db_day05
  class Role(models.Model):
      title = models.CharField(verbose_name="标题2", max_length=32)
  # db_day05
  class Depart(models.Model):
      title = models.CharField(verbose_name="标题3", max_length=32)
  ```

  ```python
  # app01/views.py
  from django.shortcuts import HttpResponse
  from app01 import models as m1

  def index(request):
      # app01中的操作 -> default
      v1 = m1.UserInfo.objects.all()
      print(v1)
      # app02中的操作 -> db_day05
      v2 = m1.Role.objects.all()
      print(v2)
      return HttpResponse("返回")
  ```

  ```python
  # router.py
  class DemoRouter(object):
      def db_for_read(self, model, **hints):
          if model._meta.model_name == ["role", "depart"]:
              return "db_day05"
          if model._meta.model_name == ["userinfo"]:
              return "default"

      def db_for_write(self, model, **hints):
          if model._meta.model_name == ["role", "depart"]:
              return "db_day05"
          if model._meta.model_name == ["userinfo"]:
              return "default"

      def allow_migrate(self, db, app_label, model_name=None, **hints):
          if db == "db_day05":
              if model_name in ["role", "depart"]:
                  return True
              else:
                  return False
          if db == "default":
              if model_name in ["userinfo"]:
                  return True
              else:
                  return False
          # return: True  - 迁移到该数据库(python manage.py migrate)
          # return: False - 不迁移
  ```

#### 4）注意事项

- 分库，表拆分到不同数据库

  ```
  不要跨数据库做关联  -> django不支持

  怎么办？
  尽可能的将有关联的表放在一个库中
  ```

  [Django doesn’t currently provide any support for foreign key or many-to-many relationships spanning multiple databases.](https://docs.djangoproject.com/en/5.2/topics/db/multi-db/#cross-database-relations:~:text=Django%20doesn%E2%80%99t%20currently%20provide%20any%20support%20for%20foreign%20key%20or%20many%2Dto%2Dmany%20relationships%20spanning%20multiple%20databases.)
- 为什么表拆分到不同的库？

  用户量大时，可以将数据拆分到不同数据库（服务器）中，减轻服务端的压力

### 7.6 数据操作

实现：增删改查

#### 1）单表

```python
# models.py
from django.db import models
class Role(models.Model):
    title = models.CharField(verbose_name="姓名", max_length=32)
    od = models.IntegerField(verbose_name="排序", default=0)
    def __str__(self):
        return "{}-{}".format(self.id, self.title)
```

```python
# views.py
# 创建
from django.shortcuts import HttpResponse
from app01 import models
def index(request):
	obj1 = models.Role.objects.create(title='管理员', od=1)
	obj2 = models.Role.objects.create(title='普通用户', od=2)
	obj3 = models.Role.objects.create(**{'title' : '普通用户', 'od' : 1})
	print(obj1)
	print(obj1.id, obj1.title, obj1.pk)
	print(obj2, obj3)
	# 内存 -> 数据库
	obj4 = models.Role(title="用户1", od=1)
	obj4.od = 7
	obj4.save() # 保存到数据库

	obj5 = models.Role(**{'title': '普通用户', 'od': 1})
	obj5.save()
	return HttpResponse("返回")

# 删除
from django.shortcuts import HttpResponse
from app01 import models
def index(request):
	data1 = models.Role.objects.all()
	data1.delete()
	data2 = models.Role.objects.all().delete()
	data3 = models.Role.objects.filter(title='管理员')
	data3.delete()
	data4 = models.Role.objects.filter(id=1).delete()
	return HttpResponse("返回")

# 修改
from django.shortcuts import HttpResponse
from app01 import models
def index(request):
    models.Role.objects.update(od=100)
    models.Role.objects.filter(title='管理员').update(od=10, id=1)
    models.Role.objects.filter(title='管理员').update(**{'od': 10, 'id': 1})
    return HttpResponse("返回")

# 查询
from django.shortcuts import HttpResponse
from app01 import models
def index(request):
    al = models.Role.objects.all() # 返回QuerySet对象，里面存储的是模型对象
    for obj in al:
        print(obj, obj.id, obj.title, obj.od)
    fil = models.Role.objects.filter(od=100, id=1) # QuerySet=[obj, obj, ...]
    fil = models.Role.objects.filter(**{'od': 100, 'id': 1})
    for obj in fil:
        print(obj, obj.id, obj.title, obj.od)

    models.Role.objects.filter(id=1)        # where id=1
    models.Role.objects.filter(id__gt=1)    # where id>1
    models.Role.objects.filter(id__gte=1)   # where id>=1
    models.Role.objects.filter(id__lt=1)    # where id<1
    models.Role.objects.filter(id__lte=1)   # where id<=1
    models.Role.objects.filter(id__in=[1, 2, 3]) # where id in [1, 2, 3]
    models.Role.objects.filter(id__range=[1, 3]) # where id between 1 and 3
    models.Role.objects.filter(title__contains='管')   # where title like '%管%'
    models.Role.objects.filter(title__startswith='管') # where title like '管%'
    models.Role.objects.filter(title__isnull=True) # where title is null

    models.Role.objects.exclude(id=1) # where id!=1
    models.Role.objects.exclude(id=1).filter(od=100)  # where id!=1 and od=100

    models.Role.objects.filter(id__gt=1)                            # QuerySet=[obj, obj, ...]
    models.Role.objects.filter(id__gt=1).values('title', 'od')      # QuerySet=[{}, {}]
    models.Role.objects.filter(id__gt=1).values_list('title', 'od') # QuerySet=[(), ()]
    models.Role.objects.filter(id__gt=1).first() # QuerySet=[obj]
    models.Role.objects.filter(id__gt=1).last()
    models.Role.objects.filter(id__gt=1).exists() # exists: bool
    models.Role.objects.filter(id__gt=1).order_by("id")  # asc
    models.Role.objects.filter(id__gt=1).order_by("-id") # desc
    models.Role.objects.filter(id__gt=1).order_by("id", "-od")
    return HttpResponse("返回")
```

#### 2）一对多

```python
# models.py
class Depart(models.Model):
    title = models.CharField(verbose_name="部门", max_length=32)

class Admin(models.Model):
    name = models.CharField(verbose_name="姓名", max_length=32)
    pwd = models.CharField(verbose_name="密码", max_length=32)
    depart = models.ForeignKey(verbose_name="部门", to="Depart", on_delete=models.CASCADE, related_name="d1")
    new_depart = models.ForeignKey(verbose_name="部门", to="Depart", on_delete=models.CASCADE, related_name="d2")
```

```python
# views.py
# 创建
from django.shortcuts import HttpResponse
from app01 import models
def index(request):
    models.Depart.objects.create(title='部门1')
    models.Admin.objects.create(name='yuyu1', pwd='123456', depart_id=1)
    models.Admin.objects.create(**{'name': 'yuyu1', 'pwd': '123456', 'depart_id': 1})
    obj = models.Depart.objects.filter(id=1).first()
    models.Admin.objects.create(name='yuyu2', pwd='123456', depart=obj)
    return HttpResponse("返回")

# 删除
from django.shortcuts import HttpResponse
from app01 import models
def index(request):
    models.Admin.objects.filter(id=1).delete()
    # 删除 部门ID为 1 的所有成员
    models.Admin.objects.filter(depart_id=1).delete()
    # 删除 部门1 中的所有成员
    obj = models.Depart.objects.filter(title='部门1').first()
    models.Admin.objects.filter(depart=obj).delete()
    # 跨表查询 删除 部门1 中的所有成员
    models.Admin.objects.filter(depart__title='部门1').delete()
    return HttpResponse("返回")

# 查询
from django.shortcuts import HttpResponse
from app01 import models
def index(request):
    models.Admin.objects.all() # QuerySet=[obj, obj, ...]
	# 跨表查询
	models.Admin.objects.all().values('name', 'depart__title')
    models.Depart.objects.all().values('title', 'd1__name', 'd2__name')
    # select * from admin
    v1 = models.Admin.objects.filter(id__gt=2)
    for obj in v1:
        print(obj, obj.name, obj.depart_id)
    # select * from admin inner join depart
    v2= models.Admin.objects.filter(id__gt=2).select_related('depart') # select_related() 优化查询
    for obj in v2:
        print(obj, obj.name, obj.depart_id, obj.depart.title)
    # queryset=[{},{}]
    models.Admin.objects.filter(id__gt=2).values('name', 'depart__title')
    # queryset=[(),()]
    models.Admin.objects.filter(id__gt=2).values_list('name', 'depart__title')
    return HttpResponse("返回")

# 更新
from django.shortcuts import HttpResponse
from app01 import models
def index(request):
    models.Admin.objects.filter(id=1).update(name='yuyu10', pwd='123123')
    models.Admin.objects.filter(id=1).update(**{'name': 'yuyu10', 'pwd': '123123'})
    # models.Admin.objects.filter(id=1).update(depart__title='部门10') # 不能跨表更新
    return HttpResponse("返回")
```

#### 3）多对多

```python
# models.py
class Boy(models.Model):
    name = models.CharField(verbose_name="姓名", max_length=16, db_index=True)

class Girl(models.Model):
    name = models.CharField(verbose_name="姓名", max_length=16, db_index=True)

class B_G(models.Model):
    boyID = models.ForeignKey(to="Boy", on_delete=models.CASCADE)
    girlID = models.ForeignKey(to="Girl", on_delete=models.CASCADE)
    address = models.CharField(verbose_name="地址", max_length=32)
```

```python
# views.py
from django.shortcuts import HttpResponse
from app01 import models
def index(request):
    # 创建
    models.Boy.objects.bulk_create(
        objs=[models.Boy(name='gg1'), models.Boy(name='gg2'), models.Boy(name='gg3')]
    )
    models.Girl.objects.bulk_create(
        objs=[models.Girl(name='mm1'), models.Girl(name='mm2'), models.Girl(name='mm3')]
    )
    models.B2G.objects.bulk_create(
        objs=[models.B2G(address='地址1', boyID_id=1, girlID_id=3),
              models.B2G(address='地址2', boyID_id=2, girlID_id=2),
        ]
    )
    g_obj  = models.Girl.objects.filter(id=1).first()
    b_obj = models.Boy.objects.filter(id=1).first()
    models.B2G.objects.create(address='地址1', boyID=b_obj, girlID=g_obj)

    # 查询
    v1 = models.B2G.objects.filter(boyID__name='gg1').select_related('girlID') # queryset=[obj, obj, ...]
    for obj in v1:
        print(obj.address, obj.boyID.name, obj.girlID.name)
    v2 = models.B2G.objects.filter(boyID__name='gg1').values('id', 'boyID__name', 'girlID__name') # queryset=[{}, {}, ...]
    for obj in v2:
        print(obj['id'], obj['boyID__name'], obj['girlID__name'])
    
    # 删除
    models.B2G.objects.filter(id=1).delete()
    models.Boy.objects.filter(id=1).delete()
    return HttpResponse("返回")
```

#### 4）一对一

```python
# models.py
class UserInfo(models.Model):
    name = models.CharField(verbose_name="姓名", max_length=32, db_index=True)
    pwd = models.CharField(verbose_name="密码", max_length=32)
    
class Blog(models.Model):
    user = models.OneToOneField(to="UserInfo", on_delete=models.CASCADE)
    blog = models.CharField(verbose_name="博客地址", max_length=255)
    summary = models.CharField(verbose_name="简介", max_length=128)
```

```python
# views.py
rom django.shortcuts import HttpResponse
from app01 import models
def index(request):
    models.UserInfo.objects.create(name='yuyu1', pwd='123456')
    models.UserInfo.objects.bulk_create(
        objs=[models.UserInfo(name='yuyu3', pwd='123456'),
              models.UserInfo(name='yuyu4', pwd='123456')
              ]
    )
    models.Blog.objects.create(blog='www.xxx.com', summary='xxxxx', user_id=2)
    user_object = models.UserInfo.objects.filter(name='yuyu1').first()
    models.Blog.objects.create(blog='www.yyy.com', summary='yyyyy', user=user_object)
    
    user_object = models.UserInfo.objects.filter(name='yuyu1').first()
    print(user_object.name, user_object.pwd, user_object.blog)
    print(user_object.blog.blog, user_object.blog.summary)
    
    blog_object = models.Blog.objects.filter(id=1).select_related("user").first()
    print(blog_object.blog, blog_object.summary, blog_object.user.name, blog_object.user.pwd)
    
    models.UserInfo.objects.filter(name="yuyu2").values("name", 'pwd', 'blog__blog', "blog__summary")
    return HttpResponse("返回")
```

## 8 cookie 和 session

### 8.1 cookie

```python
from django.shortcuts import HttpResponse
def login(request):
    res = HttpResponse("...")
    res.set_cookie("v1","123123",
                   max_age=100, # 有效期: 100秒
                   path='/',    # 路径: 该路径下的所有请求中都携带cookie
                   domain='.baidu.com', # 域名: 该域名下的所有请求中都携带cookie
                   secure=False, # Ture，https传输时才携带cookie
                   httponly=False) # True，只允许通过http协议访问cookie，其它方式无法访问cookie（如 js）
    return res

def home(request):
    print(request.COOKIES) # {'v1': '123123'}
    return HttpResponse("Home")
```

### 8.2 配置session

- 文件版

  ```python
  # settings
  MIDDLEWARE = [
      'django.middleware.security.SecurityMiddleware',
      'django.contrib.sessions.middleware.SessionMiddleware',
      'django.middleware.common.CommonMiddleware',
      'django.middleware.csrf.CsrfViewMiddleware',
      'django.middleware.clickjacking.XFrameOptionsMiddleware',
  ]
  # session
  SESSION_ENGINE = 'django.contrib.sessions.backends.file'
  SESSION_FILE_PATH = 'xxxx' # 缓存文件路径，如果为None，则使用tempfile模块获取一个临时地址 temofile.gettempdir()

  SESSION_COOKIE_NAME = "sid"  # Session的cookie保存在浏览器上时的key，即：sessionid＝随机字符串
  SESSION_COOKIE_PATH = "/"  # Session的cookie保存的路径
  SESSION_COOKIE_DOMAIN = None  # Session的cookie保存的域名
  SESSION_COOKIE_SECURE = False  # 是否Https传输cookie
  SESSION_COOKIE_HTTPONLY = True  # 是否Session的cookie只支持http传输
  SESSION_COOKIE_AGE = 1209600  # Session的cookie失效日期（2周）

  SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # 是否关闭浏览器使得Session过期
  SESSION_SAVE_EVERY_REQUEST = True  # 是否每次请求都保存Session，默认修改之后才保存
  ```

  ```python
  from django.shortcuts import HttpResponse
  def login(request):
      # 设置 session + cookie
      request.session['user_info'] = 'yuyu'
      return HttpResponse("登录")

  def home(request):
      print(request.session.get('user_info'))
      return HttpResponse("Home")
  ```

- 数据库版

  ```python
  # settings
  INSTALLED_APPS = [
      'django.contrib.sessions',
      'django.contrib.staticfiles',
      'app01.apps.App01Config',
  ]
  MIDDLEWARE = [
      'django.middleware.security.SecurityMiddleware',
      'django.contrib.sessions.middleware.SessionMiddleware',
      'django.middleware.common.CommonMiddleware',
      'django.middleware.csrf.CsrfViewMiddleware',
      'django.middleware.clickjacking.XFrameOptionsMiddleware',
  ]
  # session
  SESSION_ENGINE = 'django.contrib.sessions.backends.db'
  # SESSION_FILE_PATH = '/' # 缓存文件路径，如果为None，则使用tempfile模块获取一个临时地址 temofile.gettempdir()

  SESSION_COOKIE_NAME = "sid"  # Session的cookie保存在浏览器上时的key，即：sessionid＝随机字符串
  SESSION_COOKIE_PATH = "/"  # Session的cookie保存的路径
  SESSION_COOKIE_DOMAIN = None  # Session的cookie保存的域名
  SESSION_COOKIE_SECURE = False  # 是否Https传输cookie
  SESSION_COOKIE_HTTPONLY = True  # 是否Session的cookie只支持http传输
  SESSION_COOKIE_AGE = 1209600  # Session的cookie失效日期（2周）

  SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # 是否关闭浏览器使得Session过期
  SESSION_SAVE_EVERY_REQUEST = True  # 是否每次请求都保存Session，默认修改之后才保存
  ```

  ```python
  python manage.py makemigrations
  python manage.py migrate
  ```

- 缓存

  ```python
  # settings
  INSTALLED_APPS = [
      'django.contrib.staticfiles',
      "app01.apps.App01Config",
  ]

  MIDDLEWARE = [
      'django.middleware.security.SecurityMiddleware',
      'django.contrib.sessions.middleware.SessionMiddleware',
      'django.middleware.common.CommonMiddleware',
      'django.middleware.csrf.CsrfViewMiddleware',
      'django.middleware.clickjacking.XFrameOptionsMiddleware',
  ]
  # session
  SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
  SESSION_CACHE_ALIAS = 'default' 

  SESSION_COOKIE_NAME = "sid"  # Session的cookie保存在浏览器上时的key，即：sessionid＝随机字符串
  SESSION_COOKIE_PATH = "/"  # Session的cookie保存的路径
  SESSION_COOKIE_DOMAIN = None  # Session的cookie保存的域名
  SESSION_COOKIE_SECURE = False  # 是否Https传输cookie
  SESSION_COOKIE_HTTPONLY = True  # 是否Session的cookie只支持http传输
  SESSION_COOKIE_AGE = 1209600  # Session的cookie失效日期（2周）

  SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # 是否关闭浏览器使得Session过期
  SESSION_SAVE_EVERY_REQUEST = True  # 是否每次请求都保存Session，默认修改之后才保存
  ```

## 9 缓存

- 服务器 + `redis`
- django

  - 安装连接 `redis`

    ```python
    pip install django-redis
    ```
  - `settings.py`

    ```python
    # redis 缓存
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": "redis://127.0.0.1:6379",
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
                "CONNECTION_POOL_KWARGS": {"max_connections": 100}
                # "PASSWORD": "密码",
            }
        }
    }
    ```
  - 手动操作 `redis`

    ```python
    from django_redis import get_redis_connection

    conn = get_redis_connection("default")
    conn.set("xx","123123")
    conn.get("xx")
    ```

## 引用：

- 模块6：Django 实战开发

# Django 项目规范

## Django 框架

### **原型级**

```bash
my_project/                 # 项目根目录
├── manage.py               # 项目管理脚本
├── my_project/             # 主项目配置目录
│   ├── __init__.py
│   ├── settings.py         # 全局配置文件
│   ├── urls.py             # 全局路由配置
│   ├── wsgi.py             # WSGI部署接口
│   └── asgi.py             # ASGI异步部署接口
├── app1/                   # 应用1
│   ├── migrations/         # 数据库迁移文件
│   ├── __init__.py
│   ├── admin.py            # 后台管理配置
│   ├── apps.py             # 应用配置
│   ├── models.py           # 数据模型
│   ├── tests.py            # 单元测试
│   ├── views.py            # 视图函数/类
│   └── urls.py             # 子路由（需手动创建）
├── app2/ 					# 应用2（（结构同app1）
│   ├── ...					
├── templates/              # HTML模板目录
│   └── base.html           # 基础模板
├── static/                 # 静态文件（CSS/JS/图片）
├── media/                  # 媒体文件
├── venv/                   # 虚拟环境
├── .gitignore              # 忽略venv, *.pyc, __pycache__等
└── requirements.txt        # 单文件依赖
```

### **团队级**

> 需要区分开发/生产环境，应用数3-5个
>
> 环境隔离，初步解耦，支持并行开发

```bash
my_project/
├── manage.py
│
├── my_project/                      # 主配置目录
│   ├── __init__.py
│   ├── settings.py                  # 主配置文件（基础配置）
│   ├── local_settings.py            # 本地配置（**不提交Git**，逐步淘汰方案）
│   ├── urls.py                      # 全局路由
│   ├── wsgi.py
│   └── asgi.py
│
├── app1/                            # 应用结构增强
│   ├── migrations/
│   ├── templates/app1/              # ✅ 应用专属模板（命名空间防冲突）
│   │   └── example.html
│   ├── static/app1/                 # ✅ 应用专属静态文件（可选）
│   │   └── css/style.css
│   ├── tests.py                     # 测试仍集中，但开始考虑拆分
│   ├── signals.py                   # ✅ 新增：信号处理器（按需）
│   └── urls.py                      # 子路由
├── app2/                            # 结构同app1
│   └── ...
│
├── templates/                       # 全局公共模板
│   ├── base.html
│   └── includes/                    # ✅ 新增：模板片段（可复用组件）
│       ├── header.html
│       └── footer.html
│
├── static/                          # 全局静态文件
│   ├── css/
│   ├── js/
│   └── images/
├── media/                           # 媒体文件
│
├── common/                          # ✅ 新增：公共组件
│   ├── __init__.py
│   ├── utils.py                     # 通用工具函数
│   └── middleware.py                # 自定义中间件
│
├── requirements/                    # ✅ 新增：依赖拆分
│   ├── base.txt                     # 基础依赖（Django, Pillow）
│   └── local.txt                    # 开发环境额外依赖（django-debug-toolbar）
│
├── logs/                            # ✅ 新增：日志目录（建议.gitignore）
│   └── django.log
│
├── .gitignore                       # 增强：忽略local_settings.py, logs/等
└── README.md                        # 项目说明
```

### **生产级结构**

> 应用数>5个，需要CI/CD、自动化测试、长期维护
>
> 完全解耦、可测试、可监控、可扩展

```bash
my_project/
├── manage.py
│
├── my_project/                      # 主配置包
│   ├── __init__.py
│   ├── settings/                    # ✅ 配置目录化（环境完全隔离）
│   │   ├── __init__.py
│   │   ├── base.py                  # 公共配置（继承基类）
│   │   ├── development.py           # 开发环境（SQLite, DEBUG=True）
│   │   └── production.py            # 生产环境（PostgreSQL, Sentry）
│   │
│   ├── urls/                        # ✅ 路由目录化
│   │   ├── __init__.py
│   │   ├── base.py                  # 主路由（admin, home）
│   │   ├── api.py                   # API路由（DRF）
│   │   └── debug.py                 # 调试路由（debug-toolbar）
│   │
│   ├── wsgi.py
│   ├── asgi.py
│   ├── celery.py                    # ✅ Celery异步任务配置（预留）
│   └── routing.py                   # ✅ Channels WebSocket路由（预留）
│
├── apps/                            # ✅ 应用统一目录（关键解耦）
│   ├── __init__.py
│   │
│   ├── users/                       # 用户应用（带命名空间）
│   │   ├── migrations/
│   │   ├── management/              # ✅ 自定义命令
│   │   │   └── commands/
│   │   │       └── seed_users.py
│   │   ├── templates/users/         # App专属模板
│   │   ├── static/users/            # App专属静态文件
│   │   ├── fixtures/                # ✅ 测试/初始数据
│   │   │   └── test_users.json
│   │   ├── tests/                   # ✅ 测试拆分（按职责）
│   │   │   ├── __init__.py
│   │   │   ├── test_models.py       # 模型测试
│   │   │   ├── test_views.py        # 视图测试
│   │   │   └── test_api.py          # API测试
│   │   │
│   │   ├── apps.py                  # name='apps.users'（关键）
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py                  # 子路由
│   │   ├── api.py                   # ✅ DRF视图集
│   │   ├── serializers.py           # ✅ DRF序列化器
│   │   ├── permissions.py           # ✅ 自定义权限
│   │   └── signals.py               # 信号处理器
│   │
│   └── blog/                        # 博客应用（结构同users）
│       └── ...
│
├── common/                          # 公共组件（模块化）
│   ├── __init__.py
│   ├── middleware/                  # ✅ 按功能拆分
│   │   ├── __init__.py
│   │   ├── logging.py               # 请求日志
│   │   └── auth.py                  # 认证中间件
│   │
│   ├── utils/                       # ✅ 按用途拆分
│   │   ├── __init__.py
│   │   ├── validators.py            # 表单验证
│   │   └── paginator.py             # 分页封装
│   │
│   ├── exceptions/                  # ✅ 自定义异常
│   │   └── custom.py
│   └── constants.py                 # 常量定义
│
├── templates/                       # 全局模板
│   ├── base.html
│   ├── includes/                    # 模板片段
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── pagination.html
│   └── errors/                      # ✅ 错误页面（400/403/404/500）
│       ├── 404.html
│       └── 500.html
│
├── static/                          # 全局静态文件
│   ├── css/
│   ├── js/
│   ├── images/
│   └── vendor/                      # ✅ 第三方库（jQuery, Bootstrap）
│       └── bootstrap.min.css
│
├── media/                           # 用户上传文件
│   ├── avatars/                     # 分类存储
│   └── uploads/
│
├── logs/                            # 日志目录（必须.gitignore）
│   ├── django.log
│   ├── celery.log
│   └── debug.log
│
├── tests/                           # ✅ 全局集成测试
│   ├── __init__.py
│   ├── conftest.py                  # pytest配置
│   └── test_integration.py          # 端到端测试
│
├── requirements/                    # 依赖管理
│   ├── base.txt
│   ├── development.txt
│   └── production.txt               # 生产依赖（gunicorn, psycopg2）
│
├── .gitignore                       # 完整配置
├── README.md                        # 项目说明
└── pyproject.toml                   # ✅ 代码规范（Black/isort）
```

# Django 项目部署

以下步骤基于 window + CentOS 7.6（云服务器）+ gitee

## 主要流程
![[file-20260403202046664.png]]

将项目部署到服务器上的大致流程：

- 将代码从 本地 上传到 服务器
- 在服务器上 安装服务、配置环境、获取代码
- 启动服务

上传代码的方式有很多种，例如：FTP工具、scp命令、rsync服务、svn等，不过目前公司主流的都是使用 `git + 代码托管平台`

![[image-20251112165136-6rbs4wn.png]]

- 本地电脑，安装git + git命令 上传代码
- git 代码托管仓库，创建仓库
- 远端服务器，安装git + git命令 获取代码

## 代码管理

- 代码结构

  ```bash
  # 服务器(部分)
  /data/project/<project_name>/
  	└── <project_name>
  		└── settings.py
  		└── local_settings.py
  		└── wsgi.py
  	└── shell
  		└── <project_name>_uwsgi.ini
  		└── reboot.sh
  		└── stop.sh
  	.gitignore
  	manage.py
  	requirements.txt
  ```

- 代码托管仓库

  - 注册 [gitee](https://gitee.com/) / [github](https://github.com/)
  - 创建仓库（项目）

    只需填写必要信息，不需要勾选其它选项

    ```powershell
    # 仓库链接
    https://gitee.com/用户名/仓库名.git
    ```
- 本地电脑

  - 安装 [git](https://git-scm.com/downloads)
  - 本地git配置 - 全局

    ```
    git config --global user.name "xxx"
    git config --global user.email "xxx@xxx.com"
    ```
  - gitignore

    `.gitignore` 文件，写入文件名或文件夹，可以git忽略一些文件，不进行版本控制

    > GitHub 的 [`.gitignore`](https://git-scm.com/docs/gitignore) 文件模板集合：[https://github.com/github/gitignore](https://github.com/github/gitignore)
    >

    python 中需要忽略的

    ```powershell
    # Byte-compiled / optimized / DLL files
    __pycache__/
    *.py[codz]
    *$py.class

    # C extensions
    *.so

    # Distribution / packaging
    .Python
    build/
    develop-eggs/
    dist/
    downloads/
    eggs/
    .eggs/
    lib/
    lib64/
    parts/
    sdist/
    var/
    wheels/
    share/python-wheels/
    *.egg-info/
    .installed.cfg
    *.egg
    MANIFEST

    # PyInstaller
    #   Usually these files are written by a python script from a template
    #   before PyInstaller builds the exe, so as to inject date/other infos into it.
    *.manifest
    *.spec

    # Installer logs
    pip-log.txt
    pip-delete-this-directory.txt

    # Unit test / coverage reports
    htmlcov/
    .tox/
    .nox/
    .coverage
    .coverage.*
    .cache
    nosetests.xml
    coverage.xml
    *.cover
    *.py.cover
    .hypothesis/
    .pytest_cache/
    cover/

    # Translations
    *.mo
    *.pot

    # Django stuff:
    *.log
    local_settings.py
    db.sqlite3
    db.sqlite3-journal

    # Flask stuff:
    instance/
    .webassets-cache

    # Scrapy stuff:
    .scrapy

    # Sphinx documentation
    docs/_build/

    # PyBuilder
    .pybuilder/
    target/

    # Jupyter Notebook
    .ipynb_checkpoints

    # IPython
    profile_default/
    ipython_config.py

    # pyenv
    #   For a library or package, you might want to ignore these files since the code is
    #   intended to run in multiple environments; otherwise, check them in:
    # .python-version

    # pipenv
    #   According to pypa/pipenv#598, it is recommended to include Pipfile.lock in version control.
    #   However, in case of collaboration, if having platform-specific dependencies or dependencies
    #   having no cross-platform support, pipenv may install dependencies that don't work, or not
    #   install all needed dependencies.
    # Pipfile.lock

    # UV
    #   Similar to Pipfile.lock, it is generally recommended to include uv.lock in version control.
    #   This is especially recommended for binary packages to ensure reproducibility, and is more
    #   commonly ignored for libraries.
    # uv.lock

    # poetry
    #   Similar to Pipfile.lock, it is generally recommended to include poetry.lock in version control.
    #   This is especially recommended for binary packages to ensure reproducibility, and is more
    #   commonly ignored for libraries.
    #   https://python-poetry.org/docs/basic-usage/#commit-your-poetrylock-file-to-version-control
    # poetry.lock
    # poetry.toml

    # pdm
    #   Similar to Pipfile.lock, it is generally recommended to include pdm.lock in version control.
    #   pdm recommends including project-wide configuration in pdm.toml, but excluding .pdm-python.
    #   https://pdm-project.org/en/latest/usage/project/#working-with-version-control
    # pdm.lock
    # pdm.toml
    .pdm-python
    .pdm-build/

    # pixi
    #   Similar to Pipfile.lock, it is generally recommended to include pixi.lock in version control.
    # pixi.lock
    #   Pixi creates a virtual environment in the .pixi directory, just like venv module creates one
    #   in the .venv directory. It is recommended not to include this directory in version control.
    .pixi

    # PEP 582; used by e.g. github.com/David-OConnor/pyflow and github.com/pdm-project/pdm
    __pypackages__/

    # Celery stuff
    celerybeat-schedule
    celerybeat.pid

    # Redis
    *.rdb
    *.aof
    *.pid

    # RabbitMQ
    mnesia/
    rabbitmq/
    rabbitmq-data/

    # ActiveMQ
    activemq-data/

    # SageMath parsed files
    *.sage.py

    # Environments
    .env
    .envrc
    .venv
    env/
    venv/
    ENV/
    env.bak/
    venv.bak/

    # Spyder project settings
    .spyderproject
    .spyproject

    # Rope project settings
    .ropeproject

    # mkdocs documentation
    /site

    # mypy
    .mypy_cache/
    .dmypy.json
    dmypy.json

    # Pyre type checker
    .pyre/

    # pytype static type analyzer
    .pytype/

    # Cython debug symbols
    cython_debug/

    # PyCharm
    #   JetBrains specific template is maintained in a separate JetBrains.gitignore that can
    #   be found at https://github.com/github/gitignore/blob/main/Global/JetBrains.gitignore
    #   and can be added to the global gitignore or merged into this file.  For a more nuclear
    #   option (not recommended) you can uncomment the following to ignore the entire idea folder.
    # .idea/

    # Abstra
    #   Abstra is an AI-powered process automation framework.
    #   Ignore directories containing user credentials, local state, and settings.
    #   Learn more at https://abstra.io/docs
    .abstra/

    # Visual Studio Code
    #   Visual Studio Code specific template is maintained in a separate VisualStudioCode.gitignore 
    #   that can be found at https://github.com/github/gitignore/blob/main/Global/VisualStudioCode.gitignore
    #   and can be added to the global gitignore or merged into this file. However, if you prefer, 
    #   you could uncomment the following to ignore the entire vscode folder
    # .vscode/

    # Ruff stuff:
    .ruff_cache/

    # PyPI configuration file
    .pypirc

    # Marimo
    marimo/_static/
    marimo/_lsp/
    __marimo__/

    # Streamlit
    .streamlit/secrets.toml
    ```
  - local_settings

    本地：`local_settings.py` 编写本地特有配置

    线上：`local_settings.py` 编写线上特有配置（代码上传后需要自行创建）

    在 `.gitignore` 中 Django 项目的 `local_settings.py` 会被忽略

    ```python
    # Django stuff:
    *.log
    local_settings.py
    db.sqlite3
    db.sqlite3-journal
    ```

    ```python
    # settings.py
    编写共同的配置
    try:
    	from .local_settings import *
    except Exception:
    	pass

    # local_settings.py
    编写特有的配置（数据库、redis。。。）
    ```
  - 代码上传

    ```powershell
    git remote add origin git@github.com:用户名/仓库名.git  # 添加仓库
    输入密码

    # 将密码写入 remote
    git remote remove origin  # 删除原来的 remote
    git remote add origin https://用户名:密码@github.com/xxx/project.git
    ```

    ```powershell
    git add.
    git commit -m "commit message"
    git push origin master
    ```
- 服务器

  ```powershell
  # 安装 git
  yum install git
  mkdir -p /data/project 	# 新建目录
  cd /data/project  # 进入存放项目的位置
  # 克隆代码（首次）
  git clone https://gitee.com/用户名/仓库名.git
  git clone git@gitee.com:用户名/仓库名.git # 需要SSH密钥
  # 更新代码
  git pull origin master
  ```
- 代码版本（补充）

  在本地的 git 每次执行 `commit` 命令时，都会生成一个提交记录，如果执行`git push`也会将记录提交到代码仓库。

  各个版本之间进行切换：

  ```powershell
  git log 	# 查看目前的提交记录（当前的提交链）
  git reflog 	# 查看所有分支的提交记录（包括分支切换、提交、合并、重置等操作）
  git reset --hard xxx  # 跳转至指定版本
  ```

  【注】此命令可以在本地、线上执行

## 密钥

为省去每次 `push/pull` 代码 都要输入密码，我们将通过密钥简化操作流程，同时为方便操作服务器通过 ssh 工具 + 秘钥 连接服务器
![[file-20260403202112347.png]]

在本地电脑上利用 SSH + 密钥 连接到远程服务器

```powershell
ssh 工具
- mac，自带SSH、iTerm2
- win，git集成的ssh、xshell、SecureCRT、FinalShell
```

- 本地电脑

  ```powershell
  # ssh 工具（Git Bash）
  ssh-keygen -t rsa # 一直按回车直到出现密钥
  cat ~/.ssh/id_rsa.pub # 读取公钥（检验是否已生成）
  ssh-copy-id -i ~/.ssh/id_rsa.pub 用户名@ID # 服务器：用户名@ID
  输入密码登录服务器
  ```

  ```powershell
  # ssh 工具
  >>> ssh 用户名@IP
  >>> 无需密码登录
  # 使用如 FinalShell 等ssh工具，在配置好后不需要输入命令也能直接进行登录
  ```

- 服务器

  ```powershell
  ssh-keygen -t rsa
  cat ~/.ssh/id_rsa.pub
  ```

- 代码托管平台

  ```powershell
  设置 -> SSH 公钥
  settings -> SSH and GPG key
  将本地电脑和服务器的公钥分别拷贝进去
  ```

## 配置服务器

### MySQL

- 安装服务端 和 客户端

  MariaDB 与 MySQL 同源，但是在云服务上 mysql 可能不好安装上

  ```powershell
  yum install mariadb-server -y
  yum install mariadb -y  # 安装 mariadb-server 时，mariadb 被作为依赖安装
  ```

- 配置 数据库

  ```powershell
  systemctl start mariadb  # 启动
  systemctl stop mariadb   # 停止
  systemctl enable mariadb # 开机启动
  ```

- 账号初始化

  - 登录 root

    ```powershell
    mysql -u root -p
    ```
  - root 设置密码（可不设置）

    ```sql
    UPDATE USER SET password=password('123456') WHERE USER='root'; 
    flush privileges;
    ```
  - 创建用户

    若想要在外部访问服务器，则需要在服务器平台防火墙（安全组），添加 `3306` 端口的外部访问权限

    ```sql
    -- 创建用户
    CREATE USER 'stars'@'localhost'	IDENTIFIED BY '123456';  -- 只能被本机访问
    CREATE USER 'stars'@'100.100.%' IDENTIFIED BY '123456';  -- 可被外部访问
    flush privileges; -- 更新授权表（ INSERT / UPDATE / DELETE ）
    ```
  - 创建数据库

    ```sql
    CREATE DATABASE 数据库名 DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
    SHOW DATABASES;  -- 列出当前用户有权限看到的所有数据库
    ```
  - 为用户授权

    ```sql
    GRANT ALL PRIVILEGES ON 数据库.* TO stars@'localhost';
    GRANT SELECT, SHOW VIEW ON 数据库.* TO 'read'@'10.0.0.100'; --低权用户
    GRANT CREATE ON *.* TO 'user'@'localhost'; -- 全局级，想建任何库都行
    flush privileges;
    ```
  - 【补充】

    ```sql
    -- 登录新创建的用户
    mysql -u stars -p -- 默认登录的是 localhost，推荐重新创建一个 'stars'@'localhost'
    mysql -u stars -p -h 127.0.0.1 -- 强制使用 TCP/IP

    -- 更新密码
    UPDATE user SET password=password('123456') WHERE user='stars'; 
    flush privileges;

    -- 查看所有用户
    select user,host,password from mysql.user;
    +-------+----------------+-------------------------------------------+
    | user  | host           | password                                  |
    +-------+----------------+-------------------------------------------+
    | root  | localhost      |                                           |
    | root  | vm-0-11-centos |                                           |
    | root  | 127.0.0.1      |                                           |
    | root  | ::1            |                                           |
    |       | localhost      |                                           |
    |       | vm-0-11-centos |                                           |
    | stars | 127.0.0.1      | *6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9 |
    +-------+----------------+-------------------------------------------+
    /*
    mysql 默认配置，在本机中可直接登录数据库无需账户和密码
    若不想数据库可被任意账号登录，则删除匿名用户
    */

    -- 删除匿名用户
    DROP USER ''@'localhost';
    DROP USER ''@'vm-0-11-centos';
    flush privileges;
    ```

### Redis

- 安装

  ```
  yum install redis -y
  ```
- 配置

  ```powershell
  # 打开配置文件
  vim /etc/redis.conf
  # ?查找内容  --  查找
  ?requirepass
  # 'n' --  下一个
  # 'i' --  编辑
  requirepass 123456 # 修改密码
  # 'Esc' -- 退出编辑状态
  # ':wq' -- 保存并退出
  ```

  目前只能在本机连接，若要外部也能进行连接（MySQL 同理）

  ```powershell
  配置文件 -> bind 0.0.0.0
  云服务器 -> 安全组配置 -> 6378端口
  ```
- 启动

  ```powershell
  systemctl start redis   # 启动
  systemctl restart redis # 重启
  systemctl enable redis	# 开机启动
  ```

### Python3

- 安装 gcc，用于后续安装Python时编译源码

  ```python
  yum install gcc -y
  yum groupinstall -y "Development Tools"
  ```
- 安装Python3相关依赖

  ```
  yum install zlib zlib-devel -y
  yum install bzip2 bzip2-devel  -y
  yum install ncurses ncurses-devel  -y
  yum install readline readline-devel  -y
  yum install openssl openssl-devel  -y
  yum install xz lzma xz-devel  -y
  yum install sqlite sqlite-devel  -y
  yum install gdbm gdbm-devel  -y
  yum install tk tk-devel  -y
  yum install mysql-devel -y
  yum install mariadb-devel -y
  yum install python39-devel -y
  yum install libffi-devel -y
  ```
- 下载Python源码，[https://www.python.org/ftp/python/](https://www.python.org/ftp/python/)

  ```
  cd /data/
  wget https://www.python.org/ftp/python/3.9.23/Python-3.9.23.tgz
  ```

  【注】如果没有wget，则先安装 `yum install wget`

  【注】直接在官网下载可能会很慢，此时可以选择切换成其它源
- 编译安装

  - 解压

    ```
    tar -xvf Python-3.9.23.tgz
    ```
  - 进入目录并编译安装

    ```
    cd Python-3.9.23
    ./configure
    make all
    make install
    ```
  - 测试

    ```
    python3 --version

    /usr/local/bin/python3
    /usr/local/bin/pip3
    /usr/local/bin/pip3.9
    ```

### 虚拟环境

- 安装虚拟环境工具 `virtualenv` （Python官方社区的工具）

  ```
  pip3.9 install virtualenv
  ```
- 创建虚拟环境目录 & 创建虚拟环境

  ```
  cd /root
  mkdir /envs
  virtualenv /envs/<>env_name> --python=python3.9
  ```
- 安装项目依赖的 pip包

  ```powershell
  pip freeze > requirements.txt  # 创建项目依赖文件
  git clone https://gitee.com/用户名/仓库.git  # 克隆代码
  ```

  ```powershell
  source /envs/env_name/bin/activate  # 激活虚拟环境
  deactivate  # 退出虚拟环境
  rm -rf /envs/env_name  # 删除虚拟环境
  cd 仓库
  pip install -r requirements.txt # 安装相关的第三方包
  ```

### local_settings 设置线上配置

- 创建 `local_settings`

  ```powershell
  cd /data/project/<project_name>/<project_name>
  vim local_settings.py
  ```
- `local_settings.py`

  ```python
  # 指定收集静态文件的位置
  import os
  from pathlib import Path
  BASE_DIR = Path(__file__).resolve().parent.parent
  STATIC_ROOT = os.path.join(BASE_DIR, "allstatic")

  DEBUG = False
  ALLOWED_HOSTS = ['*']

  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.mysql',
  		'NAME': 'db',  # 数据库名字
          'USER': 'stars',
          'PASSWORD': '123456', # *
          'HOST': '127.0.0.1',  # ip
          'PORT': 3306,
      }
  }

  CACHES = {
      "default": {
          "BACKEND": "django_redis.cache.RedisCache",
          "LOCATION": "redis://127.0.0.1:6379",
          "OPTIONS": {
              "CLIENT_CLASS": "django_redis.client.DefaultClient",
              "CONNECTION_POOL_KWARGS": {"max_connections": 100},
              "PASSWORD": "123456", # *
          }
      }
  }

  # Esc -> :wq
  ```

- 收集静态文件

  ```
  python manage.py collectstatic --noinput
  ```

  【注】若静态文件有变动，则需要重新收集

## Nginx + uWSGI

为实现 **高性能、高并发、稳定部署** 的Web服务架构，使用 Nginx + uWSGI

- **Nginx** 作为反向代理服务器，负责处理静态资源、负载均衡和SSL终端，提升响应速度和安全性；
- **uWSGI** 作为应用服务器，负责运行Python Web应用（如Django、Flask），与Nginx配合实现动态请求的高效处理。
![[file-20260403202139418.png]]

```
# 激活虚拟环境并安装 uwsgi + nginx
source /envs/<env_name>/bin/activate
yum install uwsgi -y
yum install nginx -y
```

### shell 脚本

```powershell
# 先本地操作，之后再上传代码，便于代码管理
/data/project/<project_name>/shell
	└── reboot.sh
	└── stop.sh
	└── django_project<project_name>_uwsgi.ini
```

### uWSGI

- 命令参数

  ```
  # 测试是否可运行，若没问题 ctrl-c 关闭
  uwsgi --http :80 --chdir /data/project/<project_name> --wsgi-file <project_name>/wsgi.py --master --processes 4 --static-map /static=/data/project/<project_name>/allstatic
  ```
- 文件参数

  ```ini
  # django_project<project_name>_uwsgi.ini
  [uwsgi]
  socket     = 127.0.0.1:8001  # Nginx + uWSGI 在同一台服务器
  chdir      = /data/project/<project_name>
  home       = /envs/<env_name>/
  module     = <project_name>.wsgi:application
  master     = true
  processes  = 4
  chmod-socket = 666
  vacuum     = true
  enable-threads = true
  static-map = /static=/data/project/<project_name>/allstatic
  ```

- `reboot.sh`

  ```bash
  #!/usr/bin/env bash

  echo -e "\033[34m--------------------wsgi process--------------------\033[0m"

  ps -ef|grep <project_name>_uwsgi.ini | grep -v grep

  sleep 0.5

  echo -e '\n--------------------going to close--------------------'

  ps -ef |grep <project_name>_uwsgi.ini | grep -v grep | awk '{print $2}' | xargs kill -9

  sleep 0.5

  echo -e '\n----------check if the kill action is correct----------'

  /envs/<env_name>/bin/uwsgi  --ini <project_name>_uwsgi.ini &  >/dev/null

  echo -e '\n\033[42;1m----------------------started...----------------------\033[0m'
  sleep 1

  ps -ef |grep <project_name>_uwsgi.ini | grep -v grep
  ```
- `stop.sh`

  ```bash
  #!/usr/bin/env bash

  echo -e "\033[34m--------------------wsgi process--------------------\033[0m"

  ps -ef |grep <project_name>_uwsgi.ini | grep -v grep

  sleep 0.5

  echo -e '\n--------------------going to close--------------------'

  ps -ef |grep <project_name>_uwsgi.ini | grep -v grep | awk '{print $2}' | xargs kill -9

  sleep 0.5
  ```
- 代码管理

  ```bash
  # 本地
  git add.
  git commit -m "commit message"
  git push origin master

  # 服务器
  cd /data/project/<project_name>
  git pull origin master
  ```
- 添加权限（在服务器中执行）

  ```powershell
  chmod 755 reboot.sh stop.sh
  source /envs/<env_name>/bin/activate
  ./reboot.sh
  ```

### nginx

```powershell
cd /etc/nginx/
mv nginx.conf nginx.conf.bak  # 备份原本的配置文件
vim nginx.conf
```

```roboconf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    # include /etc/nginx/conf.d/*.conf;

	# 反向代理本机端口
    upstream django {
        server 127.0.0.1:8001;  # * 
    }

    server {
        listen       80;
        listen       [::]:80;
        server_name  _; # 域名（server_name.com;）

        # Load configuration files for the default server block.
        # include /etc/nginx/default.d/*.conf;

		# 静态文件 
		location /static {
            alias  /data/project/<project_name>/allstatic/; # *
        }

		# 动态请求
        location / {
            uwsgi_pass  django;
            include     uwsgi_params;
        }

    }
}
```

```
systemctl start nginx  # 启动
systemctl enable nginx # 开机启动
```

## 域名和解析

- 申请域名 -> 备案
- 解析：将域名与服务器 ip 绑定

## https

- SSL证书 -> 免费证书 -> 创建证书
- 填写申请：绑定域名、验证 。。。
- 添加 DNS解析记录
- 下载证书文件 - Nginx

  ```bash
  域名_nginx
  	└── 域名_bundle.pem # 证书文件
  	└── 域名.key # 私钥文件
  ```
- 将证书上传到服务器 `/data/ssl`
- 修改 nginx 配置（增加对https的支持）

  ```powershell
  cd /etc/nginx/
  mv nginx.conf nginx.conf.http.bak  # 备份原本的配置文件
  vim nginx.conf
  ```

  ```roboconf
  user nginx;
  worker_processes auto;
  error_log /var/log/nginx/error.log;
  pid /run/nginx.pid;

  # Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
  include /usr/share/nginx/modules/*.conf;

  events {
      worker_connections 1024;
  }

  http {
      log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

      access_log  /var/log/nginx/access.log  main;

      sendfile            on;
      tcp_nopush          on;
      tcp_nodelay         on;
      keepalive_timeout   65;
      types_hash_max_size 4096;

      include             /etc/nginx/mime.types;
      default_type        application/octet-stream;

      # Load modular configuration files from the /etc/nginx/conf.d directory.
      # See http://nginx.org/en/docs/ngx_core_module.html#include
      # for more information.
      # include /etc/nginx/conf.d/*.conf;

  	# 反向代理本机端口
      upstream django {
          server 127.0.0.1:8001; 
      }

      server {
          listen       80;
          listen       [::]:80;
          server_name  <域名>; # 域名
  		rewrite ^(.*) https://$server_name$1 redirect;
  	}

      server {
          listen       443 ssl;
          server_name  <域名>; # 域名

          ssl_certificate      /data/ssl/<域名>_bundle.pem; # 证书文件
          ssl_certificate_key  /data/ssl/<域名>.key; # 私钥文件

          ssl_session_cache    shared:SSL:1m;
          ssl_session_timeout  5m;
          ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
          ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
          ssl_prefer_server_ciphers  on;

  		# 静态文件 
  		location /static {
              alias  /data/project/<project_name>/allstatic/;
          }

  		# 动态请求
          location / {
              uwsgi_pass  django;
              include     uwsgi_params;
          }

      }
  }
  ```

- 重启

  ```powershell
  systemctl restart redis
  systemctl restart nginx
  cd /data/project/django-lufei/shell
  ./reboot.sh
  ```

## 数据库创建数据表

```python
# 生成迁移文件（如果模型有变化）
python manage.py makemigrations

# 执行迁移，创建数据表
python manage.py migrate

# 创建测试数据
python scripts/init_admin.py
python scripts/init_customer.py
```

## 遇到的问题

1. 安装 `mysqlclient` 包时出现的问题

    已安装了相关的依赖但是仍无法安装成功

    解决办法：使用 `PyMySQL` 作为替代 `pip install PyMySQL`

    ```powershell
    # init.py (与 settings.py 同级)
    import pymysql
    pymysql.install_as_MySQLdb()
    ```

2. 运行 `uWSGI` 出现报错：`ImportError: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'OpenSSL 1.0.2k-fips'`

    `urllib3` 版本太高，不兼容系统的 `OpenSSL 1.0.2`

    解决办法：降级 `urllib3`

    ```powershell
    source /envs/Django-LuFei<env_name>/bin/activate
    pip install "urllib3<2" 
    pkill -9 uwsgi
    uwsgi --ini django_project<project_name>_uwsgi.ini &
    ```

3. `django.db.utils.NotSupportedError: MariaDB 10.4 or later is required (found 5.5.68).`

    Django 4.x（以及你当前虚拟环境里装的版本）**只支持 MariaDB ≥10.4**，而系统里现在是 **5.5.68**，太老了，直接拒绝连接

    解决办法：升级 MariaDB 到 10.4+

    ```python
    # 0. 备份旧数据（可选）
    mysqldump --all-databases > /root/all.sql

    # 1. 卸掉旧版
    sudo systemctl stop mysqld
    sudo yum remove -y mariadb*

    # 2. 写新 repo
    sudo tee /etc/yum.repos.d/mariadb.repo <<'EOF'
    [mariadb]
    name = MariaDB
    baseurl = https://mirrors.aliyun.com/mariadb/yum/10.6/centos7-amd64
    gpgkey = https://mirrors.aliyun.com/mariadb/yum/RPM-GPG-KEY-MariaDB
    gpgcheck = 1
    EOF

    # 3. 安装并启服务
    sudo yum install -y MariaDB-server MariaDB-client
    sudo systemctl enable --now mariadb

    # 4. 安全初始化（设 root 密码等）
    sudo mysql_secure_installation

    # 5. 验证版本
    mysql -uroot -p -e "SELECT VERSION();"   # 应显示 10.6.x

    # 6. 回到项目
    pip install mysqlclient  # 或 pymysql 并加 django-pymysql 驱动
    python manage.py makemigrations
    ```

