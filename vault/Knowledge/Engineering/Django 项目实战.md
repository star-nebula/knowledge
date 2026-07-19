---
title: Django 项目实战
created: 2026-05-22
tags:
  - Python
  - Django
  - 项目实战
  - 订单系统
  - Web开发
type: 步骤操作
related:
  - "[[Python-MOC]]"
  - "[[Python Django]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Django 项目实战：订单交易平台

> 来源：编程语言/Python/08-Web 框架/Django 项目实战：订单交易平台
> 更新：2026-05-22

> - redis安装启动   https://pythonav.com/wiki/detail/10/82/
>
>   - py连接
>   - django
> - 第三方平台发送短信（企业资质）
>
>   ```
>   企业认证
>   公众号
>   	https://pythonav.com/wiki/detail/10/81/
>   ```

![[../../../Python/Python Web框架/assets/image-20220710184409818-20250830193146-0fnc7c4.png]]

## 1 核心功能

- 认证模块，用户名密码 或 手机短信登录（60s有效）。

  登录成功后，保存用户的信息到session【文件、数据库、缓存中】
- 角色管理，不同角色具有不同权限 和 展示不同菜单。

  ```
  管理员	充值
  客户		下单
  ```
- 客户管理，除了基本的增删改查以外，支持对客户可以分级，不同级别后续下单折扣不同。
- 交易中心

  - 管理员可以给客户 余额充值 / 扣费
  - 客户可以 下单 / 撤单
  - 生成交易记录
  - 对订单进行多维度搜索，例如：客户姓名、订单号。
- worker，去执行订单并更新订单状态。

## 2 单点知识-1

### 2.1 发送短信

腾讯云短信服务，具体看官方文档

- API 接口

  ```python
  import requests
  # 处理签名和加密
  res = requests.get("......",params={"key":"xxx",'token':'...'})
  ```
- SDK 服务（优先使用）

  ```python
  pip install tencentcloud-sdk-python
  ```

  ```python
  import xxxx
  xxxxx.send(...)
  ```

- 示例，[短信 Python SDK_腾讯云](https://cloud.tencent.com/document/product/382/43196)

  ```python
  # -*- coding: utf-8 -*-
  from tencentcloud.common import credential
  from tencentcloud.sms.v20210111 import sms_client, models

  cred = credential.Credential("<TENCENT_CLOUD_SECRET_ID>", "<TENCENT_CLOUD_SECRET_KEY>")
  client = sms_client.SmsClient(cred, "ap-guangzhou")

  req = models.SendSmsRequest()

  req.SmsSdkAppId = "1400455481" # appID
  req.SignName = "Python之路" # 签名
  req.TemplateId = "548762" # 模板ID
  req.TemplateParamSet = ["449739"] # 占位符
  req.PhoneNumberSet = ["+8615131255000"] # 手机号

  resp = client.SendSms(req)
  print(resp)
  ```

### 2.1 权限和菜单管理

#### 1）菜单

要求：不同角色的用户登录，看到不同的菜单。

三种编写模式：

- 页面写死 HTML模板

  ```html
  <html>
      {% if 角色 "管理员"%}
      	<a href="/xxx/x">用户管理</a>
      	<a href="/xxx/x">级别管理</a>
      	<a href="/xxx/x">级别管理</a>
      	...
      {% else %}
      	<a href="/xxx/x">xxx管理</a>
      	<a href="/xxx/x">级别管理</a>
      {% endif %}
  </html>
  ```
- 将菜单放在配置文件中

  ```python
  # settings.py
  ADMIN = [
      {"title":"用户管理", "url":"...." },
      {"title":"用户管理", "url":"...." },
      {"title":"用户管理", "url":"...." },
      {"title":"用户管理", "url":"...." },
  ]
  USER = [
      {"title":"用户管理", "url":"...." },
      {"title":"用户管理", "url":"...." },
      {"title":"用户管理", "url":"...." },
      {"title":"用户管理", "url":"...." },
  ]
  ```

  ```html
  <html>
      {% if 角色 "管理员"%}
      	{% for item in ADMIN%}
  		    <a href="{{item.url}}">{{item.title}}</a>
  	    {%emdfor%}
      {% else %}
      	{% for item in USER%}
  		    <a href="{{item.url}}">{{item.title}}</a>
  	    {%emdfor%}
      {% endif %}
  </html>
  ```
- 将 菜单+角色 写入数据库

  |id|title|url|
  | ----| ----------| -----|
  |1|用户管理|...|
  |2|级别管理|...|
  |3|订单管理|...|

  |id|角色|
  | ----| --------|
  |1|管理员|
  |2|用户|

  |id|role_id|menu_id|
  | :--: | :-------: | :-------: |
  |1|1|1|
  |2|1|2|
  |3|2|2|

  ```python
  在页面展示数据库
  1.查询特定角色关联的所有的菜单
  2.在页面上进行展示
  ```

多级菜单（以配置文件为例）

- 菜单内容

  - 一级菜单

    ```python
    ADMIN = [
        {"title":"用户管理", "url":"...." },
        {"title":"用户管理", "url":"...." },
        {"title":"用户管理", "url":"...." },
        {"title":"用户管理", "url":"...." },
    ]
    ```

  - 二级菜单

    ```python
    ADMIN = [
        {
            "title":"用户管理", 
            "children":[
                {"title":"级别列表","url":"....", "name":"level_list",},
                {"title":"级别列表","url":"...."},
                {"title":"级别列表","url":"...."}
            ]
        },
        {
            "title":"订单管理", 
            "children":[
                {"title":"订单列表","url":"...."},
                {"title":"订单列表","url":"...."},
                {"title":"订单列表","url":"...."}
            ]
        },
    ]
    ```
  - 三级菜单

    ```python
    ADMIN = [
        {
            "title": "用户管理",
            "children": [
                {"title": "级别列表",
                 "url": "....",
                 "name": "level_list",
                 # "children":[ # 与权限写重了，建议菜单中只写菜单的内容
                 # {"title":"添加","url":"...."},
                 # {"title":"删除","url":"...."},
                 # ]
                 },
                {"title": "级别列表", "url": "...."},
                {"title": "级别列表", "url": "...."},
            ]
        }
    ]
    ```

- 菜单的选中和展开

  ```python
  1. 获取当前用户请求的 URL：pricepolicy/list/ 或 URL对应的 name
  2. URL匹配 配置ADMIN中的 URL -> 默认选中
  ```
- 路径导航

  ```python
  1. 获取当前用户请求的 URL：pricepolicy/list/ 或 URL对应的 name
  2. 获取上级，展示导航信息
  3. 设置菜单与下级关系
  ```

多级菜单（以数据库为例）

- 数据库中的菜单级别

  |id|title|url|parent\_id|
  | ----| ----------| ------| ---------------|
  |1|客户管理|null|null|
  |2|级别列表|...|1|
  |3|客户列表|...|1|
  |4|订单管理|null|null|
  |5|价格|...|4|
  |6|交易|...|4|
  |7|其他|...|6|

  【Tip】客户管理、订单管理 为一级菜单没有URL
- 平台的多级评论

  |id|content|root\_id|parent\_id|depth|
  | ----| ------------| -------------| ---------------| -------|
  |1|优秀|null|null|0|
  |2|不咋样|null|null|0|
  |3|确实|1|1|1|
  |4|哈哈|1|1|1|
  |5|你说的都对|1|3|2|

  ```
  - 优秀
  	确实
  		你说的都对
  	哈哈
  - 不咋样
  ```

#### 2）权限

对权限的判断时，要考虑：正常的点击、非法输入。

权限分类处理

- 列表

  ```python
  v1 = [11,22,33,44]
  if 33 in v1:
      pass
  ```

- 集合

  ```python
  v1 = {11,22,33,44}
  if 33 in v1:
      pass
  ```
- 字典

  ```python
  v1 = {
      11:123123,
      22:123123
      33:123123
      44:123123
  }

  if 33 in v1:
      pass
  ```

编写方式：

- 以配置文件的方式

  ```python
  # settings.py
  admin_permisions = {
      "level_list":{...},
      "level_edit":{..., 'parent':'level_list'},
      "level_add":{... ,'parent':'level_list'},
      "level_delete":{...,'parent':'level_list'},

      "user_list":{...},
      "user_edit":{...},
      "user_add":{...},
      "user_delete":{...},
  }

  user_permisions = {
      ...
  }
  ```

  ```
  admin访问某个 URL + 路由信息（name、namespace），获取当前的URL：/level/edit/4/ -> 是否存在URL
  【Tip】在中间件中根据URL中的 name 进行权限的校验。
  ```

- 以数据库的方式

  - 用户表

    |id|name|role|
    | ----| -------| ------|
    |1|user1|1|
    |2|user2|2|
    |3|user3|1|
    |4|user4|2|

    - 角色表

      |id|title|
      | ----| --------|
      |1|管理员|
      |2|用户|
  - 角色和权限表

    |id|role_id|permission_id|
    | ----| ---------| ---------------|
    |1|1|2|
    |2|1|3|
    |3|1|4|
    |4|1|1|
    |5|2|1|
    |6|2|2|

    - 权限表

      |id|name|url|parent|is_menu|
      | ----| ------------| -----| --------| ---------|
      |1|level_list|...||TRUE|
      |2|level_edit|...|1|FALSE|
      |3|level_add|...|1|FALSE|
      |4|...|...|1|FALSE|
  - 菜单表

    |id|title|url|parent|
    | ----| ----------| ------| --------|
    |1|客户管理|null|null|
    |2|级别|...|1|

### 2.3 队列

- `rabbitMQ`，Linux命令+服务构建+python代码。
- `kafka`，Linux命令+服务构建+python代码。
- `redis` 的列表

![[../../../Python/Python Web框架/assets/image-20220717114057232-20250830193214-gc7rbq1.png]]

基于`redis`实现上述的过程和代码示例：

- 安装redis
- 启动redis

  ```
  win：  https://pythonav.com/wiki/detail/10/82/
  ```

  ```
  mac：
  	1.去官方下载redis文件
  	2.解压编译
  	3.修改配置文件
  	4.启动
  ```
- Python操作redis

  ```
  pip install redis
  ```

  ```python
  import redis

  conn = redis.Redis(host='127.0.0.1', port=6379, password='qwe123', encoding='utf-8')

  # 短信验证码
  conn.set('15131255089', 9999, ex=10)
  value = conn.get('15131255089')
  print(value)
  ```

  ```python
  import redis

  conn = redis.Redis(host='127.0.0.1', port=6379, password='qwe123', encoding='utf-8')
  # 队列
  # 放值
  # conn.lpush('my_queue', "root")
  # conn.lpush('my_queue', "good")

  # 取值
  v1 = conn.brpop("my_queue", timeout=5)
  print(v1)
  ```

### 2.4 worker和线程池

```python
# 1.去redis中获取任务

# 2.再将此订单在数据库中的状态修改为 执行中

# 3.获取任务详细： 视频，刷播放量 10000

# 4.线程池或协程
from concurrent.futures import ThreadPoolExecutor

def task(video_url):
    # 根据视频地址实现刷播放
    # ..
    pass

pool = ThreadPoolExecutor(50)
for i in range(10000):
    pool.submit(task, "视频地址")

pool.shutdown()  # 卡主，等待所有的任务执行完毕。

# 5.更新订单状态，已完成
```

## 3 单点知识-2

### 3.1 ajax请求

提交数据：

- 传统 `form` 提交，会刷新页面打断用户操作并加载速度慢

  ```css
  <form method='get' action='xxx' >
      <input />
      <input type='submit' />
  </form>
  ```

  ```html
  <form method='POST'>
      {% csrf_token %} 
      ...
  </form>
  ```

  `POST` 请求需携带 `{% csrf_token %} `

- 使用 `Ajax` 可以实现“无刷新页面更新”，提升用户体验和交互效率

  ```javascript
  $.ajax({
      url: "/xxx/xx",
      type: "GET", // GET/HEAD/OPTIONS/TRACE 不需要 X-CSRFTOKEN
      data: {mobile: "1888888"},
  	dataType: "JSON",
      success: function (res) {
          console.log(res);
      }
  })
  ```

  ```javascript
  $.ajax({
      url: "/xxx/xx",
      type: "POST", 
      data: {mobile: "1888888"},
      headers:{
          "X-CSRFTOKEN":"...." // POST/PUT/DELETE 需有 headers:X-CSRFTOKEN
      },
      success: function (res) {
          console.log(res);
      }
  })
  ```

ajax 形式

- 本质：利用浏览器上 `XMLhttpRequest`

  ```html
  <html>
    <head>
    </head>
    <body>
      <script>
        const xhr = new XMLHttpRequest();
  	  // 定义回调函数
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            // 已经接收到全部响应数据，执行以下操作
            const data = xhr.responseText;
            console.log(data);
          }
        };
  	  // 指定连接方式和地址----文件方式
        xhr.open('POST', '/test/', true);
  	  // 设置请求头
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  	  // 发送请求
        xhr.send('n1=1&n2=2'); // 修正分隔符为 &，并去掉末尾分号
      </script>
    </body>
  </html>
  ```
- 利用 `jQuery` 类库，内部封装的 `ajax`

  ```css
  <html>
    …
    <body>
      <script src="jquery.js"></script>
      <script>
        	$.ajax({
  	        url: "....",
  	        type: "post",
  	        data: { n1: 123, n2: 456 },
  	        success: function (res) {
  	          console.log(res);
  	        }
        });
      </script>
    </body>
  </html>
  ```

### 3.2 csrf token

- `form` 表单形式提交

  ```html
  <form ...>
      {% csrf_token %}  
  	<input type='hidden' value='xxxxxxxx' />
      <input ... />
      <input type='submit' />
  </form>
  ```
- `ajax` 方式

  ```html
  <form>
      {% csrf_token %}
      <input ... />
      <input type='submit' />
  </form>
  ```

  ```
  浏览器打开网址时，django在cookie中也返回了一段值
  ```

  ```javascript
  $.ajax({
  	url: "...",
  	type: "get"
  	data: {user:"wupeiqi",pwd:"xxxx"}，
  	header:{
  		"X-HTTP...":"cookie中写的那段值"
  	},
  	success:function(arg){
  		...
  	}
  })
  ```
- `csrf` 认证

  - 请求体中

    ```
    - 传统的form
    - jQuery    $("#smsForm").serialize()  + Ajax
    ```
  - 请求头中

    ```javascript
    $.ajaxSetup({
    	beforeSend...
    })

    $.ajax({
    	url:"...",
    	type:"GET",
    	data:{},
    	dataType:"JSON",
    	headers:{
    		...
    	},
    	success:function(res){
    	}
    })
    ```
- Django 的自定义请求头
- ```
  - 自动化添加 HTTP_ 前缀
  - 自动化添加 HTTP_ 前缀，前端的-，转换成后端的_
  ```

### 3.3 form 组件

作用：

- 生成HTML标签 + 携带数据

  - 保留原来提交的数据，不再担心form表单提交时页面刷新。
  - 显示默认值，做编辑页面显示默认值。
- 数据校验，对用户提交的数据格式校验

  ```python
  form = LoginForm(data=request.POST)
  if form.is_valid():
      print(form.cleaned_data)
  else:
      print(form.errors)
  ```

```python
class LoginForm(forms.Form):
    role = forms.ChoiceField(
        required=True,
        choices=(("2", "客户"), ("1", "管理员")),
        widget=forms.Select(attrs={"class": "form-control"})
    )
    username = forms.CharField(
        initial="wupeiqi",
        required=True,
        正则表达式
        widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "用户名"})
    )
    
    # 自定义方法(钩子)
    def clean_username(self):
        raise 异常
		return 123
    
form = LoginForm(initial={"username":"xxx","password":"xx"}) # 显示默认值
```

## 4 单点知识-3

- ## 4.1 主动连表查询

  django 默认会为每个对象分别执行额外的数据库查询

  使用 `select_related("外键1", "外键")` 后，Django 会在一次 SQL 查询中通过 JOIN 操作获取所有需要的数据

  ```python
  def customer_list(request):
      queryset = models.Customer.objects.filter(active=1).select_related("level", "creator")
      context = {"queryset": queryset}
      return render(request, "customer_list.html", context)
  ```

- ## 4.2 obj转化为str（__str__）

  修复页面显示问题（`obj`=>`str`）

  ```python
  class Level(ActiveBaseModel):
      """ 级别表 """
      title = models.CharField(verbose_name="级别", max_length=32)
      percent = models.IntegerField(verbose_name="折扣", help_text="填入0-100整数表示百分比，例如：90，表示90%",)

      def __str__(self):
          return self.title
  ```

- ## 4.3 面向对象继承 & BootStrap 排除字段

  ```python
  class CustomerModelForm(BootStrapForm, forms.ModelForm):
      password = forms.CharField(label="密码", widget=forms.PasswordInput)
      class Meta:
          model = models.Customer
          fields = ["username", "password", "mobile", "level"]
  def customer_add(request):
      form = CustomerModelForm()
      return render(request, "form2.html", {"form": form})
  ```

- ## 4.4 ModelForm 关联数据

  展示管理级别 - 数据源

  - v1：在models中利用 `limit_choice_to` 筛选数据

    ```python
    level = models.ForeignKey(verbose_name="级别", to="Level", on_delete=models.CASCADE, limit_choices_to={'active':1})
    只显示 active=1 的数据
    ```
  - v2：自定义 `queryset`

    ```python
    class CustomerModelForm(BootStrapForm, forms.ModelForm):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields["level"].queryset = models.Level.objects.filter(active=1)
    ```

    ```
    queryset = models.Level.objects.filter(active=1).order_by("percent")
    ```

- ## 4.5 ModelForm 保存

  ```python
  form.instance.creator_id = request.nb_user.id
  form.save()
  ```

- ## 4.6 ModelForm 勾子方法 Meta 类

  ```python
  class Meta:
  model =	 models.Customer
  	fields = ["username", "password", "mobile", "confirm_password", "level"]
  ```

  `fields` 控制显示顺序

- ## 4.7 ModelForm定制页面的插件

  ```python
  forms.CharField
  forms.PasswordInput
  forms.Select
  forms.Textarea
  ```

  ```python
  class CustomerModelForm(BootStrapForm, forms.ModelForm):
      exclude_filed_list = ['level']
      password = forms.CharField(label="密码", widget=forms.PasswordInput(render_value=True))
      confirm_password = forms.CharField(label="确认密码", widget=forms.PasswordInput(render_value=True))

      class Meta:
          model = models.Customer
          fields = ["username", "password", "mobile", "confirm_password", "level"]
          widgets = {
              "level": forms.RadioSelect(attrs={'class': "form-radio"})
          }
  ```

- ## 4.8 ModelForm表单验证

  - models 中直接编写

    ```python
    models.CharField(verbose_name="手机号", max_length=11, db_index=True,
                                  validators=[RegexValidator(r'^1[3-9]\d{9}$', "手机号格式错误")])
    ```
  - 字段 `validators` & 勾子方法

    ```python
    class CustomerModelForm(BootStrapForm, forms.ModelForm):
    	# v1：正则 validators
        mobile = forms.CharField(label="手机号", validators=[RegexValidator(r'^1[3-9]\d{9}$', "手机号格式错误")])
    	# v2：自定义钩子
        def clean_mobile(self):
            mobile = self.cleaned_data["mobile"]
            if not re.match("^1[3-9]\d{9}$", mobile):
                raise forms.ValidationError("手机号格式错误")
            return mobile
    ```

## 5 单点知识-4

### message 组件

#### 适应场景

主要用于在**请求之间传递****临时的****用户反馈信息**，本质是基于会话（`session`）存储的短期消息，会在**下次请求时显示给用户，之后自动清除**。

![[../../../Python/Python Web框架/assets/image-20251104174352-mygc1f0.png]]

#### 快速使用

- 配置 `settings.py`

  ```python
  INSTALLED_APPS = [
      "django.contrib.messages", #
      "django.contrib.staticfiles",
      "web.apps.WebConfig",
  ]

  MIDDLEWARE = [
      "django.contrib.sessions.middleware.SessionMiddleware",
      "django.middleware.common.CommonMiddleware",
      "django.middleware.csrf.CsrfViewMiddleware",
      "django.contrib.messages.middleware.MessageMiddleware", #
      "django.middleware.clickjacking.XFrameOptionsMiddleware",
      "utils.md.AuthMiddleware"
  ]

  TEMPLATES = [
      {
          "BACKEND": "django.template.backends.django.DjangoTemplates",
          "DIRS": [],
          "APP_DIRS": True,
          "OPTIONS": {
              "context_processors": [
                  "django.template.context_processors.debug",
                  "django.template.context_processors.request",
                  "django.contrib.messages.context_processors.messages", #
              ],
          },
      },
  ]

  # MESSAGE_STORAGE = 'django.contrib.messages.storage.fallback.FallbackStorage'
  # MESSAGE_STORAGE = 'django.contrib.messages.storage.cookie.CookieStorage'
  MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'
  ```
- 设置值

  ```python
  from django.contrib import messages
  messages.add_message(reqeust, messages.SUCCESS, "成功")
  messages.add_message(reqeust, messages.ERROR, "失败")
  ```
- 读取值

  ```python
  # 后端处理
  from django.contrib.messages.api import get_messages
  messages = get_messages(request)
  for msg in messages:
      print(msg)
  ```

  ```html
  <!-- 前端展示 --> 
  <ul>
      {% for message in messages %}
  	    <li>{{ message.tags }} {{ message }}</li>
      {% endfor %}
  </ul>
  ```

### 源码分析

message 是一个对象（包裹）

```python
v1 = "wupeiqi"
v2 = ["武沛齐",123]

class Message(object):
    def __init__(self, level, message, extra_tags=None):
        self.level = int(level)
        self.message = message
        self.extra_tags = extra_tags

obj = Message(10,"哈哈哈哈","123")
```

- 添加信息

  ```python
  def add_message(request, level, message, extra_tags="", fail_silently=False):
      try:
  		# 对象，SessionStorage 对象
          messages = request._messages
      except AttributeError:
          ...
      else:
          return messages.add(level, message, extra_tags)

  from django.contrib import messages
  messages.add_message(reqeust, messages.ERROR, "删除成功1")
  messages.add_message(reqeust, messages.SUCCESS, "删除成功2", extra_tags="哈哈哈")
  ```

- 返回信息，不存在则返回空列表

  ```python
  def get_messages(request):
      return getattr(request, "_messages", [])

  from django.contrib.messages.api import get_messages
  messages = get_messages(request)
  for msg in messages:
  	print(msg)
  ```

```python
# settings.py
MIDDLEWARE = [
    "django.contrib.messages.middleware.MessageMiddleware", # 中间件
]

# middleware.py
from django.contrib.messages.storage import default_storage
class MessageMiddleware(MiddlewareMixin):
    def process_request(self, request):
		# 对象 = SessionStorage(request) / CookieStorage() / FallbackStorage()
        request._messages = default_storage(request)

    def process_response(self, request, response):
        if hasattr(request, "_messages"):
            unstored_messages = request._messages.update(response)
            if unstored_messages and settings.DEBUG:
                raise ValueError("Not all temporary messages could be stored.")
        return response

# django.contrib.messages.storage.__init__.py
def default_storage(request):
	# 1. settings.MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'
	# 2. import_string 根据字符串的形式找类 SessionStorage
	# 3. 实例化对象 = SessionStorage(request)
    return import_string(settings.MESSAGE_STORAGE)(request)

# django.contrib.messages.storage.session.py
class SessionStorage(BaseStorage):
    session_key = "_messages"
    def __init__(self, request, *args, **kwargs):
        if not hasattr(request, "session"):
            raise ImproperlyConfigured(
                "The session-based temporary message storage requires session "
                "middleware to be installed, and come before the message "
                "middleware in the MIDDLEWARE list."
            )
        super().__init__(request, *args, **kwargs)

    def _get(self, *args, **kwargs):
        return (
            self.deserialize_messages(self.request.session.get(self.session_key)),
            True,
        )

	def _store(self, messages, response, *args, **kwargs):
        if messages:
            self.request.session[self.session_key] = self.serialize_messages(messages)
        else:
            self.request.session.pop(self.session_key, None)
        return []

# django.contrib.messages.storage.base.py
class BaseStorage:
    def __init__(self, request, *args, **kwargs):
        self.request = request
        self._queued_messages = []
        self.used = False
        self.added_new = False
        super().__init__(*args, **kwargs)

    def __iter__(self):
        self.used = True
        if self._queued_messages:
            self._loaded_messages.extend(self._queued_messages)
            self._queued_messages = []
        return iter(self._loaded_messages)

    @property
    def _loaded_messages(self):
        if not hasattr(self, "_loaded_data"):
            messages, all_retrieved = self._get()
            self._loaded_data = messages or []
        return self._loaded_data

	def add(self, level, message, extra_tags=""):
	    if not message:
	        return
	    # Check that the message level is not less than the recording level.
	    level = int(level)
	    if level < self.level:
	        return
	    # Add the message.
	    self.added_new = True
	    message = Message(level, message, extra_tags=extra_tags)
	    self._queued_messages.append(message)

    def update(self, response):
        self._prepare_messages(self._queued_messages)
        if self.used:
            return self._store(self._queued_messages, response)
        elif self.added_new: # self.added_new = True
            messages = self._loaded_messages + self._queued_messages
            return self._store(messages, response)
```

- 【设置】中间件process_request加载
- 【设置】在视图函数中往message中写入值（内存）
- 【设置】中间件process_response，将内存中新增的数据写入到数据源
- 【新页面】中间件process_request加载
- 【新页面】在视图函数或模板中读取message中的信息（老的数据源加载的+新增的）
- 【设置】中间件process_response

  ```python
  used = True，则只保存新增部分。
  added_new = True，老的数据源加载的+新增的都重新保存到数据源。
  ```

![[../../../Python/Python Web框架/assets/whiteboard_exported_image-20251105205329-lcmja15.png]]

## 项目

### 1 项目雏形

- 创建django项目

  ```python
   django-admin startproject django_project<project_name>
  ```

- 纯净版django

  ```python
  INSTALLED_APPS = [
      # "django.contrib.admin",
      # "django.contrib.auth",
      # "django.contrib.contenttypes",
      # "django.contrib.sessions",
      # "django.contrib.messages",
      "django.contrib.staticfiles",
  ]

  MIDDLEWARE = [
      # "django.middleware.security.SecurityMiddleware",
      "django.contrib.sessions.middleware.SessionMiddleware",
      "django.middleware.common.CommonMiddleware",
      "django.middleware.csrf.CsrfViewMiddleware",
      # "django.contrib.auth.middleware.AuthenticationMiddleware",
      # "django.contrib.messages.middleware.MessageMiddleware",
      "django.middleware.clickjacking.XFrameOptionsMiddleware",
  ]

  ROOT_URLCONF = "django_project.urls"

  TEMPLATES = [
      {
          "BACKEND": "django.template.backends.django.DjangoTemplates",
          "DIRS": [],
          "APP_DIRS": True,
          "OPTIONS": {
              "context_processors": [
                  "django.template.context_processors.debug",
                  "django.template.context_processors.request",
                  # "django.contrib.auth.context_processors.auth",
                  # "django.contrib.messages.context_processors.messages",
              ],
          },
      },
  ]
  ```
- 创建和注册app

  ```python
  python manage.py startapp web<app_name>
  ```

  ```python
  # settings
  INSTALLED_APPS = [
      "web.apps.WebConfig",
  ]
  ```

- 连接数据库（需先创建数据库）

  ```python
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.mysql',
          'NAME': 'django_database',  # 数据库名字
          'USER': 'root',
          'PASSWORD': '123456',
          'HOST': '127.0.0.1',  # ID
          'PORT': 3306,
      }
  }
  ```

- 建表

  ```python
  from django.db import models

  class ActiveBaseModel(models.Model):

      active = models.SmallIntegerField(verbose_name="状态", default=1, choices=((1, "激活"), (0, "删除"),))
      class Meta:
          abstract = True

  class Administrator(ActiveBaseModel):
      """ 管理员表 """
      username = models.CharField(verbose_name="用户名", max_length=32, db_index=True)
      password = models.CharField(verbose_name="密码", max_length=64)
      mobile = models.CharField(verbose_name="手机号", max_length=11, db_index=True)
      create_date = models.DateTimeField(verbose_name="创建日期", auto_now_add=True)

  class Level(ActiveBaseModel):
      """ 级别表 """
      title = models.CharField(verbose_name="标题", max_length=32)
      percent = models.IntegerField(verbose_name="折扣")

  class Customer(ActiveBaseModel):
      """ 客户表 """
      username = models.CharField(verbose_name="用户名", max_length=32, db_index=True)
      password = models.CharField(verbose_name="密码", max_length=64)
      mobile = models.CharField(verbose_name="手机号", max_length=11, db_index=True)
      balance = models.DecimalField(verbose_name="账户余额", default=0, max_digits=10, decimal_places=2)
      level = models.ForeignKey(verbose_name="级别", to="Level", on_delete=models.CASCADE)
      create_date = models.DateTimeField(verbose_name="创建日期", auto_now_add=True)
      creator = models.ForeignKey(verbose_name="创建者", to="Administrator", on_delete=models.CASCADE)

  class PricePolicy(models.Model):
      """ 价格策略（原价，后续可以根据用级别不同做不同折扣）
      1  1000 10
      2  2000 18
      """
      count = models.IntegerField(verbose_name="数量")
      price = models.DecimalField(verbose_name="价格", default=0, max_digits=10, decimal_places=2)

  class Order(ActiveBaseModel):
      """ 订单表 """
      status_choices = (
          (1, "待执行"),
          (2, "正在执行"),
          (3, "已完成"),
          (4, "失败"),
      )
      status = models.SmallIntegerField(verbose_name="状态", choices=status_choices, default=1)

      # 202211022123123123
      oid = models.CharField(verbose_name="订单号", max_length=64, unique=True)
      url = models.URLField(verbose_name="视频地址", db_index=True)
      count = models.IntegerField(verbose_name="数量")
      price = models.DecimalField(verbose_name="原价格", default=0, max_digits=10, decimal_places=2)
      real_price = models.DecimalField(verbose_name="实际价格", default=0, max_digits=10, decimal_places=2)
      old_view_count = models.CharField(verbose_name="原播放量", max_length=32, default="0")
      create_datetime = models.DateTimeField(verbose_name="创建时间", auto_now_add=True)
      customer = models.ForeignKey(verbose_name="客户", to="Customer", on_delete=models.CASCADE)
      memo = models.TextField(verbose_name="备注", null=True, blank=True)

  class TransactionRecord(ActiveBaseModel):
      """ 交易记录 """
      charge_type_class_mapping = {
          1: "success",
          2: "danger",
          3: "default",
          4: "info",
          5: "primary",
      }
      charge_type_choices = ((1, "充值"), (2, "扣款"), (3, "创建订单"), (4, "删除订单"), (5, "撤单"),)
      charge_type = models.SmallIntegerField(verbose_name="类型", choices=charge_type_choices)
      customer = models.ForeignKey(verbose_name="客户", to="Customer", on_delete=models.CASCADE)
      amount = models.DecimalField(verbose_name="金额", default=0, max_digits=10, decimal_places=2)
      creator = models.ForeignKey(verbose_name="管理员", to="Administrator", on_delete=models.CASCADE, null=True, blank=True)
      order_oid = models.CharField(verbose_name="订单号", max_length=64, null=True, blank=True, db_index=True)
      create_datetime = models.DateTimeField(verbose_name="交易时间", auto_now_add=True)
      memo = models.TextField(verbose_name="备注", null=True, blank=True)
  ```

- 生成迁移文件 & 同步数据库

  使用简便方式：Tools（工具）→  run `manage.py` Task（运行 `manage.py` 任务）

  ```python
  makemigrations
  migrate
  ```

### 2 用户名和密码

> - 页面展示
> - 提交数据
> - 根据数据去数据库校验
>
>   - 通过，登录成功，引入session
>   - 失败，页面展示错误信息

- 登录页面

  ```python
  # url.py
  from django.urls import path
  from web.views import account

  urlpatterns = [
      path('login/', account.login, name='login'),
      path('sms/login/', account.sms_login, name='sms_login')
  ]
  ```

  ```python
  # web/views/account.py
  from django.shortcuts import render
  def login(request):
      if request.method == "GET":
          return render(request, "login.html")
      # 1. 接受并获取数据
      print(request.POST)
      # 2. 校验数据
      return render(request, "login.html")

  def sms_login(request):
      return render(request, "sms_login.html")
  ```

  ![[../../../Python/Python Web框架/assets/image-20250919170135-ls873j2.png]]

  ```html
  <!-- templates/login.html -->
  {% load static %}
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  {#    <link rel="stylesheet" href="/static/plugins/bootstrap/css/bootstrap.css"#}
      <link rel="stylesheet" href="{% static 'plugins/bootstrap/css/bootstrap.css' %}" >
  {#    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.4/css/bootstrap.min.css" >#}
      <style>
          .box{
              width: 480px;
              border: 1px solid #f0f0f0;
              {#margin-left: auto;#}
              {#margin-right: auto;#}
              {#margin-top: 100px;#}
              margin: 100px auto auto;
              padding: 10px 20px 20px;

              box-shadow: 5px 10px 10px rgb(0 0 0 / 5%); {# 阴影 #}
          }
      </style>
  </head>
  <body>
      <div class="box">
          <h2 style="text-align: center">用户登陆</h2>
          <foem method="post" action="URL:提交的位置，默认为本地址">
              {% csrf_token %}
  {#            <input type="text" name="username" placeholder="用户名" />#}
  {#            <input type="password" name="password" placeholder="密码" />#}
  {#            <input type="submit" value="登陆" />#}
              <div class="form-group">
                  <label for="exampleInputEmail1">用户名</label>
                  <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Username">
              </div>
              <div class="form-group">
                  <label for="exampleInputPassword1">密码</label>
                  <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
              </div>
              <button type="submit" class="btn btn-primary">登 陆</button>

      {#        <a href="/sms/login/">短信登录</a>#}
              <a href="{% url 'sms_login' %}" style="float: right">短信登录</a>
          </foem>
      </div>
  </body>
  </html>
  ```

  ![[../../../Python/Python Web框架/assets/image-20250919170109-x5lvscj.png]]

  ```html
  <!-- sms_login.html -->
  {% load static %}
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <link rel="stylesheet" href="{% static 'plugins/bootstrap/css/bootstrap.css' %}" >
  <!--    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.3.4/css/bootstrap.min.css" > -->
      <style>
          .box{
              width: 480px;
              border: 1px solid #f0f0f0;
              {#margin-left: auto;#}
              {#margin-right: auto;#}
              {#margin-top: 100px;#}
              margin: 100px auto auto;
              padding: 10px 20px 20px;

              box-shadow: 5px 10px 10px rgb(0 0 0 / 5%); {# 阴影 #}
          }
          .btn-full-width{
              width: 100%;
          }
      </style>
  </head>
  <body>
      <div class="box">
          <h2 style="text-align: center">短信登陆</h2>
          <foem method="post">
              {% csrf_token %}
      {#        <input type="text" name="mobile" placeholder="手机号" />#}
      {#        <input type="text" name="code" placeholder="短信验证码" />#}
      {#        <input type="button" value="发送验证码" />#}
      {#        <input type="submit" value="登陆" />#}
              <div class="form-group">
                  <label for="exampleInputEmail1">手机号</label>
                  <input type="text" class="form-control" id="exampleInputEmail1" placeholder="phone number">
              </div>
              <div class="form-group">
                  <label for="exampleInputPassword1">短信验证码</label>
                  <div class="row row-no-gutters">
                      <div class="col-xs-9">
                          <input type="text" class="form-control" id="exampleInputPassword1" placeholder="code"/>
                      </div>
                      <div class="col-xs-3">
                          <button type="button" class="btn btn-default btn-full-width">发送验证码</button>
                      </div>
                  </div>
              </div>
              <button type="submit" class="btn btn-primary">登 陆</button>

      {#        <a href="/login/">用户名登录</a>#}
              <a href="{% url 'login' %}" style="float: right">用户名登录</a>
          </foem>
      </div>
  </body>
  </html>
  ```

- 登录逻辑

  - 配置文件（权限管理 + 数据提交）

    ```python
    # settings.py
    MENU = {
        "ADMIN": [],
        "CUSTOMER": [],
    }
    PERMISSION = {
        "ADMIN": {},
        "CUSTOMER": {},
    }
    # cache缓存
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": "redis://127.0.0.1:6379",
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
                "CONNECTION_POOL_KWARGS": {"max_connections": 100},
                # "PASSWORD": "",
            }
        }
    }
    # session配置
    SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
    SESSION_CACHE_ALIAS = 'default'
    ```
  - 模板优化（角色选择 + 提交信息报错提示）

    ```html
    <!-- login.html -->
    <body>
        <div class="box">
            <h2 style="text-align: center">用户登陆</h2>
            <form method="post">
                {% csrf_token %}

                <div class="form-group">
                    <label>角色</label>
                    <select class="form-control" name="role">
                        <option value="1">管理员</option>
                        <option value="2">用户</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="exampleInputEmail1">用户名</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Username" name="username" />
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">密码</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" name="password" />
                </div>
                <button type="submit" class="btn btn-primary">登 陆</button>
                {{ error }}

                <a href="{% url 'sms_login' %}" style="float: right">短信登录</a>
            </form>
        </div>
    </body>
    ```

  - 添加数据（创建 管理员账号）

    1. 使用离线脚本

        ```python
        # scripts/init_admin.py
        import os, sys, django
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        sys.path.append(base_dir)
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')
        django.setup()  # 伪造让django启动

        from web import models
        from utils.encrypt import md5
        models.Administrator.objects.create(
            username='admin', password=md5('admin'), mobile="18888888888")
        ```

    2. 临时交互

        终端：`python manage.py shell`

        ```python
        from web import models
        from utils.encrypt import md5
        models.Administrator.objects.create(username='root', password=md5('root'), mobile='18888888880')
        ```
  - 添加数据（创建 级别+用户账户）

    ```python
    # scripts/init_customer.py
    import os, sys, django
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.append(base_dir)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')
    django.setup()  # 伪造让django启动

    from web import models
    from utils.encrypt import md5
    models.Level.objects.create(title="VIP", percent=90)
    models.Customer.objects.create(
        username="user1", password=md5("123456"), mobile='1999999998',
        level_id=1, creator_id=1
    )
    ```
  - 提交数据 + 验证数据

    ```python
    # utils/encrypt.py
    import hashlib
    from django.conf import settings

    def md5(data_string):
        # MD5 哈希对象，使用 Django 项目的 SECRET_KEY 作为盐值（salt）来初始化
        obj = hashlib.md5(settings.SECRET_KEY.encode('utf-8'))
        obj.update(data_string.encode('utf-8'))
        return obj.hexdigest()

    # web/views/account.py
    from django.shortcuts import render, redirect
    from web import models
    from utils.encrypt import md5
    def login(request):
        if request.method == "GET":
            return render(request, "login.html")

        # 1. 接受并获取数据
        username = request.POST.get("username")
        # password = request.POST.get("password")
        password = md5(request.POST.get("password"))
        role = request.POST.get("role")
        print(role, username, password)

        # 2. 校验数据
        mapping = {"1": "ADMIN", "2": "CUSTOMER"}
        if role not in mapping:
            return render(request, "login.html", {"error": "请选择正确的角色"})
        if role == 1:
            user_object = models.Administrator.objects.filter(active=1, username=username, password=password).first()
        else:
            user_object = models.Customer.objects.filter(active=1, username=username, password=password).first()
        # 2.1 检验失败
        if not user_object:
            return render(request, "login.html", {"error": "用户名或密码错误"})
        # 2.2 检验成功，用户信息写入 session + 进入项目后台
        request.session["user_info"] = {"role": mapping[role], "username": user_object.username, "id": user_object.id}
        return redirect("/home/")

    def sms_login(request):
        return render(request, "sms_login.html")
    ```
- 使用 `form` 组件

  目的：生成标签 + 校验

  - 生成标签

    - 循环`form` + 单独某个字段
    - `label` 显示文本信息
    - 自定义错误信息，`position`
  - 检验

    - 自定义：

      - 每个字段检验

        - 字段上定义检验规则，正则、空、长度
        - `clean_方法名`

        ```python
        校验成功：
        	self.cleaned_data["字段"] = 值
        校验失败
        	self.errors["字段"] = 错误
        ```
      - 所有字段检验

        - `clean()`

          ```python
          try:
              cleaned_data = self.clean()
          except ValidationError as e:
              self.add_error(None, e)
          else:
              if cleaned_data is not None:
                  self.cleaned_data = cleaned_data

          self.errors["__all__"] = 错误
          ```
        - `_post_clean()`
    - 检验源码

      - `form.is_valid`
      - `form.errors`
      - `form.full_clean()`
    - 业务校验

      ```python
      form = 对象

      if not form.is_valid():
          print(form.errors)
      	模板语言：
          form.errors.username.0
          form.errors.__all__.0   ->  模板语言中 form.errors.__ 不支持
          form.non_field_errors()  <==> form.errors.__all__
          在页面上去适合的位置显示错误信息
      else:
          print(form.cleaned_data)
          ...
      ```

- 逻辑优化：数据格式是否为空（`Form` 组件）

  ```html
  <!-- login.html -->
  <body>
      <div class="box">
          <h2 style="text-align: center">用户登陆</h2>
          <form method="post">
              {% csrf_token %}

              <div class="form-group">
                  <label>角色</label>
                  {{ form.role }}
              </div>
              <div class="form-group">
                  <label for="exampleInputEmail1">用户名</label>
                  {{ form.username }}
              </div>
              <div class="form-group">
                  <label for="exampleInputPassword1">密码</label>
                  {{ form.password }}
              </div>
              <button type="submit" class="btn btn-primary">登 陆</button>
              {{ error }}

              <a href="{% url 'sms_login' %}" style="float: right">短信登录</a>
          </form>
      </div>
  </body>
  ```

  ```python
  # web/views/account.py
  from django.shortcuts import render, redirect
  from web import models
  from utils.encrypt import md5
  from django import forms

  class LoginForm(forms.Form):
      """ 检验字段 """
      role = forms.ChoiceField(
          choices=((1, "管理员"), (2, "客户")),
          required=True,  # required=True 表示必填字段
          widget=forms.Select(attrs={"class": "form-control"})
      )
      username = forms.CharField(
          required=True,
          widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "username"})
      )
      password = forms.CharField(
          required=True,
          widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "password"}, render_value=True),
      )

  def login(request):
      if request.method == "GET":
          form = LoginForm()
          return render(request, "login.html", {"form": form})

      # 1. 接受并获取数据（使用Form组件，进行数据格式是否为空验证）
      form = LoginForm(data=request.POST)
      if not form.is_valid():
          print("验证失败")
          return render(request, "login.html", {"form": form})
      print(form.cleaned_data)
      role = form.cleaned_data.get("role")
      username = form.cleaned_data.get("username")
      password = md5(form.cleaned_data.get("password"))
      print(role, username, password)

      # 2. 校验数据
      mapping = {"1": "ADMIN", "2": "CUSTOMER"}
      if role not in mapping:
          return render(request, "login.html", {"form": form, "error": "请选择正确的角色"})
      if role == 1:
          user_object = models.Administrator.objects.filter(active=1, username=username, password=password).first()
      else:
          user_object = models.Customer.objects.filter(active=1, username=username, password=password).first()
      # 2.1 检验失败
      if not user_object:
          return render(request, "login.html", {"form": form, "error": "用户名或密码错误"})
      # 2.2 检验成功，用户信息写入 session + 进入项目后台
      request.session["user_info"] = {"role": mapping[role], "username": user_object.username, "id": user_object.id}
      return redirect("/home/")

  def sms_login(request):
      return render(request, "sms_login.html")

  ```

- 优化代码结构：循环 `form` 对象（简化代码）

  ```python
  # web/views/account.py
  class LoginForm(forms.Form):
      """ 检验字段 """
      role = forms.ChoiceField(
          label="角色",
          choices=((1, "管理员"), (2, "客户")),
          widget=forms.Select(attrs={"class": "form-control"})
      )
      username = forms.CharField(
          label="用户名",
          widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "username"})
      )
      password = forms.CharField(
          label="密码",
          widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "password"}, render_value=True),
      )
  ```

  ```html
  <!-- login.html -->
  {% load static %}
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <link rel="stylesheet" href="{% static 'plugins/bootstrap/css/bootstrap.css' %}" >
      <style>
          .box{
              width: 480px;
              border: 1px solid #f0f0f0;
              margin: 100px auto auto;
              padding: 10px 20px 20px;

              box-shadow: 5px 10px 10px rgb(0 0 0 / 5%); {# 阴影 #}
          }
      </style>
  </head>
  <body>
      <div class="box">
          <h2 style="text-align: center">用户登陆</h2>
          <form method="post">
              {% csrf_token %}
  {#            <div class="form-group">#}
  {#                <label>角色</label>#}
  {#                {{ form.role }}#}
  {#            </div>#}
  {#            <div class="form-group">#}
  {#                <label for="exampleInputEmail1">用户名</label>#}
  {#                {{ form.username }}#}
  {#            </div>#}
  {#            <div class="form-group">#}
  {#                <label for="exampleInputPassword1">密码</label>#}
  {#                {{ form.password }}#}
  {#            </div>#}
              {% for field in form %}
                  <div class="form-group">
                      <label>{{ field.label }}</label>
                      {{ field }}
                  </div>
              {% endfor %}

              <button type="submit" class="btn btn-primary">登 陆</button>
              {{ error }}

              <a href="{% url 'sms_login' %}" style="float: right">短信登录</a>
          </form>
      </div>
  </body>
  </html>
  ```

- 优化错误信息的显示

  ```html
  <!-- login.html -->
  {% load static %}
  <!DOCTYPE html>
  <html lang="en">
  <body>
      <div class="box">
          <h2 style="text-align: center">用户登陆</h2>
          <form method="post">
              {% csrf_token %}
              {% for field in form %}

                  <div class="form-group" style="position: relative; margin-bottom: 25px">
                      <label>{{ field.label }}</label>
                      {{ field }}
                      错误信息的位置
                  </div>

              {% endfor %}
              <button type="submit" class="btn btn-primary">登 陆</button>
              {{ error }}
              <a href="{% url 'sms_login' %}" style="float: right">短信登录</a>
          </form>
      </div>
  </body>
  </html>
  ```

- `form` 校验流程

  - 字段内部：`required` + `validators` + `min_length` + `max_length`

    ```python
    # web/views/account.py
    from django import forms
    from django.core.exceptions import ValidationError
    from django.core.validators import RegexValidator
    class LoginForm(forms.Form):
        """ 检验字段 """
        role = forms.ChoiceField(
            label="角色",
            required=True, # True 必填字段; False 非必填字段
            choices=((1, "管理员"), (2, "客户")),
            widget=forms.Select(attrs={"class": "form-control"})
        )
        username = forms.CharField(
            label="用户名",
            widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "username"})
        )
        password = forms.CharField(
            label="密码",
            min_length=6,
            max_length=16,
            validators=[RegexValidator(r'^[0-9]+$', "密码必须是数字")],  # 正则表达式
            widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "password"}, render_value=True),
        )
    ```
  - 字段钩子方法：`clean_username`、`clean_password` 等

    ```python
        def clean_username(self):
            user = self.cleaned_data['username']
            # 校验规则
            # 校验失败
            if len(user) < 3:
                raise ValidationError("用户名格式错误")
            return user

        def clean_password(self):
            return self.cleaned_data['password']
    ```
  - 空壳子：`clean`、`_post_clean` 等

    ```python
        def clean(self):
            # 对所有值进行校验
            # 1.不返回值，默认 self.cleaned_data
            # 2.返回值，      self.cleaned_data = 返回的值
            # 3.报错，        ValidationError ->  self.add_error(None, e)
            pass

        def _post_clean(self):
            print("_post_clean")
    ```

- 获取报错信息

  ```html
  {% for field in form %}
      <div class="form-group" style="position: relative; margin-bottom: 25px">
          <label>{{ field.label }}</label>
          {{ field }}
          {{ field.errors.0 }}
      </div>
  {% endfor %}
  {#{{ field.errors.username.0 }}#}
  {#{{ field.errors.password.0 }}#}
  ```

- 错误信息修改为中文显示

  ```python
  # settings.py
  # LANGUAGE_CODE = "en-us"
  LANGUAGE_CODE = "eh-hans"
  ```

- 让错误信息，显示在特定的字段旁

  ```python
  form.add_error("password", "用户名或密码错误")
  ```

### 3 短信登录

#### 1）页面逻辑优化

- 添加验证规则

  ```python
  from django.urls import path
  from web.views import account
  urlpatterns = [
      path('login/', account.login, name='login'),
      path('sms/login/', account.sms_login, name='sms_login'),
      path('sms/send/', account.sms_send, name='sms_send'),
  ]
  ```

  ```python
  class SmsLoginForm(forms.Form):
      """ 检验字段 """
      role = forms.ChoiceField(
          label="角色",
          required=True,  # True 必填字段; False 非必填字段
          choices=((1, "管理员"), (2, "客户")),
          widget=forms.Select(attrs={"class": "form-control"})
      )
      username = forms.CharField(
          label="手机号",
          widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "username"})
      )
      code = forms.CharField(
          label="短信验证码",
          validators=[RegexValidator(r'^[0-9]+$', "验证码必须是数字")],
          widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "code"})
      )

  def sms_login(request):
      if request.method == "GET":
          form = SmsLoginForm()
          return render(request, "sms_login.html", {"form": form})
      return render(request, "sms_login.html")

  def sms_send(requset):
      """发送短信"""
      print(requset.META.get("HTTP_X_FORWARDED_FOR"))
      print(requset.GET)
      print(requset.POST)
      return HttpResponse("发送成功")
  ```

- 使用 `form` 循环 + 报错信息

  ```html
  <!-- web/templates/sms_login.html -->
  <form method="post">
      {% csrf_token %}

      <div class="form-group">
          <label for="exampleInputEmail1">手机号</label>
          <input type="text" class="form-control" id="exampleInputEmail1" placeholder="phone number">
      </div>
      <div class="form-group">
          <label for="exampleInputPassword1">短信验证码</label>
          <div class="row row-no-gutters">
              <div class="col-xs-9">
                  <input type="text" class="form-control" id="exampleInputPassword1" placeholder="code"/>
              </div>
              <div class="col-xs-3">
                  <button type="button" class="btn btn-default btn-full-width">发送验证码</button>
              </div>
          </div>
      </div>

      <button type="submit" class="btn btn-primary">登 陆</button>
      <a href="{% url 'login' %}" style="float: right">用户名登录</a>
  </form>
  ```

  ```html
  <form method="post">
      {% csrf_token %}

      {% for field in form %}
          {% if field.name == 'code' %}
              <div class="form-group" style="position: relative; margin-bottom: 25px">
              <label>{{ field.label }}</label>
              <div class="row row-no-gutters">
                  <div class="col-xs-9">
                      <input type="text" class="form-control" id="exampleInputPassword1" placeholder="code"/>
                  </div>
                  <div class="col-xs-3">
                      <button type="button" class="btn btn-default btn-full-width">发送验证码</button>
                  </div>
              </div>
  			{{ field.errors.0 }}
              </div>
          {% else %}
              <div class="form-group" style="position: relative; margin-bottom: 25px">
                  <label>{{ field.label }}</label>
                  {{ field }}
                  {{ field.errors.0 }}
              </div>
          {% endif %}

      <div>{{ form.non_field_errors }}</div>
      {% endfor %}
      <button type="submit" class="btn btn-primary">登 陆</button>
      <a href="{% url 'login' %}" style="float: right">用户名登录</a>
  </form>
  ```

#### 2）发送短信

- 按钮倒计时 + ajax 请求

  ```html
  <!-- web/templates/sms_login.html -->
  {% load static %}
  <!DOCTYPE html>
  <html lang="en">
  <head>
  ...
  </head>
  <body>
      <div class="box">
          <h2 style="text-align: center">短信登陆</h2>
          <form method="post">
          ...
          </form>
      </div>

  <script src="{% static 'js/jquery-3.6.0.min.js' %}"></script>
  <script type="text/javascript">
      $(function () {
          // 当页面框架加载完成之后，自动执行里面的代码（不用等待页面完全加载）
          bindSendSmsEvent();
      })

      /* 判断：如果当前请求方法不是“安全方法” */
      function csrfSafeMethod(method) {
          // these HTTP methods do not require CSRF protection
          return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
      }

      // 根据 cookie 名称获取 cookie 值（django提供）
      function getCookie(name) {
          let cookieValue = null;
          if (document.cookie && document.cookie !== '') {
              const cookies = document.cookie.split(';');
              for (let i = 0; i < cookies.length; i++) {
                  const cookie = cookies[i].trim();
                  // Does this cookie string begin with the name we want?
                  if (cookie.substring(0, name.length + 1) === (name + '=')) {
                      cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                      break;
                  }
              }
          }
          return cookieValue;
      }

      /* 发送短信按钮倒计时效果 */
      function sendSmsRemind(){

              var $smsBtn = $('#sendBtn');
              // 2.1 禁用按钮
              $smsBtn.prop("disabled", true)
              // 2.2 改变内容 + 倒计时
              var time = 60;
              var remind = setInterval(function(){
                  $smsBtn.text(time + "秒重新发送");
                  time --;
                  if(time < 0){
                      clearInterval(remind);
                      // 重新启用按钮
                      $smsBtn.text("发送验证码");
                      $smsBtn.prop("disabled", false)
                  }
              }, 1000);
      }

      /* 发送短信按钮 */
      function bindSendSmsEvent() {
          // 在执行 ajax 请求之前，先执行 ajaxSetup 方法
          $.ajaxSetup({
              beforeSend: function(xhr, settings) {
                  if (!csrfSafeMethod(settings.type)){
                      // 添加自定义的请求头（不再需要每次重新编写）
                      xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                  }

              }
          })
          // 点击按钮事件绑定
          $("#sendBtn").click(function(){
              // 1. 获取手机号，向后台发送请求
              $.ajax({
                  url: "{% url 'sms_send' %}",
                  type: "POST",
                  data:{mobile:"18888888888"},
                  // headers:{ "X-CSRFToken": getCookie('csrftoken'),},
                  success:function (res){
                      console.log(res);
                  }
              })
              // 2. 动态效果
              sendSmsRemind()
          })
      }
      
  </script>
  </body>
  </html>
  ```
- 优化代码

  通过将 CSRF 防护逻辑（安全方法判断、Cookie 取 Token、AJAX 全局加请求头）封装到独立 `csrf.js` 中，实现了 CSRF 代码复用与解耦，同时保留模板 `{% csrf_token %}` 确保 Token 来源合法，且 AJAX 无需重复写 CSRF 头、倒计时逻辑独立，整体代码模块化、可维护性强。

  ```javascript
  // web/static/js/csrf.js
  /* 判断：如果当前请求方法不是“安全方法” */
  function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  // 根据 cookie 名称获取 cookie 值（django提供）
  function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }

  // 在执行 ajax 请求之前，先执行 ajaxSetup 方法
  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type)){
              // 添加自定义的请求头（不再需要每次重新编写）
              xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
          }

      }
  })
  ```

  ```html
  <!-- web/templates/sms_login.html -->
  {% load static %}
  <!DOCTYPE html>
  <html lang="en">
  <head>
  	...
  </head>
  <body>
      <div class="box">
          <h2 style="text-align: center">短信登陆</h2>
          <form method="post">
              {% csrf_token %}
  			<!-- 生成 CSRF Token 并写入 Cookie -->
              <!-- 在表单中插入隐藏的 Token 字段 -->
  			...
          </form>
      </div>

  <script src="{% static 'js/jquery-3.6.0.min.js' %}"></script>
  <script src="{% static 'js/csrf.js' %}"></script>
  <script type="text/javascript">

      /* 发送短信按钮倒计时效果 */
      function sendSmsRemind(){
          var $smsBtn = $('#sendBtn');
          // 2.1 禁用按钮
          $smsBtn.prop("disabled", true)
          // 2.2 改变内容 + 倒计时
          var time = 60;
          var remind = setInterval(function(){
              $smsBtn.text(time + "秒重新发送");
              time --;
              if(time < 0){
                  clearInterval(remind);
                  // 重新启用按钮
                  $smsBtn.text("发送验证码");
                  $smsBtn.prop("disabled", false)
              }
          }, 1000);
      }

      /* 发送短信按钮 */
      function bindSendSmsEvent() {
          // 点击按钮事件绑定
          $("#sendBtn").click(function(){
              // 1. 获取手机号，向后台发送请求
              $.ajax({
                  url: "{% url 'sms_send' %}",
                  type: "POST",
                  data:{mobile:"18888888888"},
                  // headers:{ "X-CSRFToken": getCookie('csrftoken'),},
                  success:function(res){
                      console.log(res);
                  }
              })
              // 2. 动态效果
              sendSmsRemind()
          })
      }

      $(function () {
          // 当页面框架加载完成之后，自动执行里面的代码（不用等待页面完全加载）
          bindSendSmsEvent();
      })

  </script>
  </body>
  </html>
  ```

- 发送消息

  ```python
  # utils/tencent.py
  from tencentcloud.common import credential
  from tencentcloud.sms.v20210111 import sms_client, models
  def send_sms(mobile, sms_code):
      mobile = "+86{}".format(mobile)
      try:
          cred = credential.Credential("<TENCENT_CLOUD_SECRET_ID>", "<TENCENT_CLOUD_SECRET_KEY>")
          client = sms_client.SmsClient(cred, "ap-guangzhou")

          req = models.SendSmsRequest()
          req.SmsSdkAppId = "1400455481"
          req.SignName = "Python之路"
          req.TemplateId = "548762"
          req.TemplateParamSet = [sms_code, ]
          req.PhoneNumberSet = [mobile, ]
          resp = client.SendSms(req)
          print(resp.SendStatusSet)
          data_object = resp.SendStatusSet[0]
          # print(data_dict,type(data_dict))
          print(data_object.Code)
          if data_object.Code == "Ok":
              return True
      except Exception as e:
          print(e)

  ```

  ```python
  # web/views/account.py
  from django.http import JsonResponse
  from django import forms
  from django.core.validators import RegexValidator
  from utils import tencent
  import random

  class Response(object):
      def __init__(self):
          self.status = True
          self.detail = None
          self.data = None

      @property
      def dict(self):
          return self.__dict__

  def sms_send(request):
      """发送短信"""
      res = Response()
      # 1. 检验手机号的格式
      request.POST.get("mobile")
      form = MobileForm(data=request.POST)
      if not form.is_valid():
          res.datail = form.errors
          return JsonResponse(res.dict, json_dumps_params={"ensure_ascii": False})
      # 2. 生成验证码 + 发送短信
      mobile = form.cleaned_data['mobile']
      sms_code = random.randint(1000, 9999)
      is_success = tencent.send_sms(mobile, sms_code)
      if not is_success:
          res.detail = {"mobile":["短信发送失败"]}
          return JsonResponse(res.dict, json_dumps_params={"ensure_ascii": False})

      # 3. 保存手机号和验证码（之后进行校验） redis --> 超时时间
      conn = get_redis_connection("default")
      conn.set(mobile, sms_code, ex=60)
      res.status = True
      return JsonResponse(res.dict)
  ```

  ```javascript
  /* 发送短信按钮 */
  function bindSendSmsEvent() {
      // 点击按钮事件绑定
      $("#sendBtn").click(function(){
          // 1. 获取手机号，向后台发送请求
          var mobileData = $("#id_mobile").val();
          $(".error-message").empty();// 清除所有错误信息的显示
          $.ajax({
              url: "{% url 'sms_send' %}",
              type: "POST",
              data:{mobile: mobileData},
              success:function(res){
                  console.log(res);
                  if (res.status){
                      // 2. 动态效果
                      sendSmsRemind()
                  }else{
                      $.each(res.detail, function(k, v){
                          $("#id_" + k).next().text(v[0]);
                      })
                  }
              }
          })

      })
  }
  ```

#### 3）登录

> - Form 提交
> - Ajax 提交，展示效果好
>
>   - 手写 data 对象
>
>     ```javascript
>     $.ajax({
>         url:"/sms/login/",
>         type:"POST",
>         data:{
>             mobile:'xxx',
>             code:'xxx'
>         }
>         
>     })
>     ```
>
>   - `$("selector").serialize()`
>
>     ```html
>     <form id='f1'>
>         <input ...
>     </form>
>     ```
>
>     ```javascript
>     $.ajax({
>         url:"/sms/login/",
>         type:"POST",
>         data:$("#f1").serialize()
>     })
>
>     # 好处，不需要加csrf header
>     # 只要 <form> 里写了 {% csrf_token %}，serialize() 会把隐藏域的 token 一起带过去，无需再写 JS
>     ```

- 短信验证码 登录验证

  ```javascript
  function bindLoginEvent() {
      $("#smsForm").submit(function (e) {
          e.preventDefault(); // 阻止表单默认提交行为
          $(".error-message").empty(); // 清除所有的错误
          $.ajax({
              url: "{% url 'sms_login' %}",
              type: "POST",
              data: $("#smsForm").serialize(),
              dataType: "JSON",
              success: function (res) {
                  console.log(res);
                  if (res.status) {
                      location.href = res.data;
                  } else {
                      $.each(res.detail, function (k, v) {
                          if (k === "__all__") {
                              // 处理非字段错误
                              $("form div:first").after('<div class="error-message">' + v[0] + '</div>');
                          } else {
                              $("#id_" + k).next().text(v[0]);
                          }
                      })
                  }
              }
          })
      });
  }
  ```

  ```python
  # utils/reponse.py
  class BaseResponse(object):
      def __init__(self):
          self.status = False
          self.detail = None
          self.data = None
      @property
      def dict(self):
          return self.__dict__

  class UserResponse(BaseResponse):
      def __init__(self):
          super(UserResponse, self).__init__() # 继承
          self.xxx = None
  ```

  ```python
  def sms_login(request):
      if request.method == "GET":
          form = SmsLoginForm()
          return render(request, "sms_login.html", {"form": form})
      res = BaseResponse()
      # 1. 手机格式校验
      form = SmsLoginForm(data=request.POST)
      if not form.is_valid():
          res.detail = form.errors
          return JsonResponse(res.dict)
      # 2. 短信验证码 + redis 中的验证码 -> 校验
      mobile = form.cleaned_data['mobile']
      code = form.cleaned_data['code']
      role = form.cleaned_data.get("role")

      conn = get_redis_connection("default")
      cache_code = conn.get(mobile)
      if not cache_code:
          res.detail = {"code": ["短信验证码已过期"]}
          return JsonResponse(res.dict)
      if code != cache_code.decode('utf-8'):
          res.detail = {"code": ["短信验证码错误"]}
          return JsonResponse(res.dict)
      # 3. 登录 + 注册 （检测手机号是否存在）
      #   - 未注册，自动注册
      #   - 已注册，直接登录
      mapping = {"1": "ADMIN", "2": "CUSTOMER"}
      if role == "1":
          user_object = models.Administrator.objects.filter(active=1, mobile=mobile).first()
      else:
          user_object = models.Customer.objects.filter(active=1, mobile=mobile).first()
          
      if not user_object:
          res.detail = {"mobile": ["手机号不存在"]}
          return JsonResponse(res.dict)
      # 检验成功，用户信息写入 session + 进入项目后台
      request.session["user_info"] = {"role": mapping[role], "username": user_object.username, "id": user_object.id}
      res.status = True
      res.data = settings.LOGIN_HOME
      return JsonResponse(res.dict)

  class MobileForm(forms.Form):
      mobile = forms.CharField(
          label="手机号",
          required=True,
          validators=[RegexValidator(r'^1[3589]\d{9}$','手机号格式错误')]
      )

  def sms_send(request):
      """发送短信"""
      res = BaseResponse()
      # 1. 检验手机号的格式
      form = MobileForm(data=request.POST)
      if not form.is_valid():
          res.detail = form.errors
          return JsonResponse(res.dict, json_dumps_params={"ensure_ascii": False})
      
      # 检查手机号是否存在于数据库
      mobile = form.cleaned_data['mobile']
      role = request.POST.get('role')
      if role == "1":
          exists = models.Administrator.objects.filter(active=1, mobile=mobile).exists()
      else:
          exists = models.Customer.objects.filter(active=1, mobile=mobile).exists()
      if not exists:
          res.detail = {"mobile": ["手机号不存在"]}
          return JsonResponse(res.dict, json_dumps_params={"ensure_ascii": False})

      # 2. 生成验证码 + 发送短信
      sms_code = random.randint(1000, 9999)
      is_success = tencent.send_sms(mobile, sms_code)
      if not is_success:
          res.detail = {"mobile":["短信发送失败"]}
          return JsonResponse(res.dict, json_dumps_params={"ensure_ascii": False})

      # 3. 保存手机号和验证码（之后进行校验） redis --> 超时时间
      conn = get_redis_connection("default")
      conn.set(mobile, sms_code, ex=60)
      res.status = True
      return JsonResponse(res.dict)
  ```

### 4 优化（登录、发送短信、短信登录）

- `web/views/account.py`

  ```python
  from django.shortcuts import render, redirect
  from django.http import JsonResponse
  from django_redis import get_redis_connection
  from django.conf import settings

  from utils.reponse import BaseResponse
  from web import models
  from web.forms.account import LoginForm, MobileForm, SmsLoginForm

  class Role:
      ADMIN = "1"
      CUSTOMER = "2"

  """ 账号登录 """

  def login(request):
      if request.method == "GET":
          form = LoginForm()
          return render(request, "login.html", {"form": form})

      # 1. 接受并获取数据（使用Form组件，进行数据格式是否为空验证）
      form = LoginForm(data=request.POST)
      if not form.is_valid():
          return render(request, "login.html", {"form": form})

      # 2. 校验数据
      data_dict = form.cleaned_data
      role = data_dict.pop("role")
      if role == Role.ADMIN:
          user_object = models.Administrator.objects.filter(active=1).filter().first()
      else:
          user_object = models.Customer.objects.filter(active=1).filter().first()
      # 2.1 检验失败
      if not user_object:
          form.add_error("password", "用户名或密码错误")
          return render(request, "login.html", {"form": form})
      # 2.2 检验成功，用户信息写入 session + 进入项目后台
      mapping = {"1": "ADMIN", "2": "CUSTOMER"}
      request.session["user_info"] = {"role": mapping[role], "username": user_object.username, "id": user_object.id}
      return redirect(settings.LOGIN_HOME)

  """ 短信发送 """

  def sms_send(request):
      res = BaseResponse()
      # 检验手机号的格式
      form = MobileForm(data=request.POST)
      if not form.is_valid():
          # 如果验证失败，将错误信息返回给前端
          res.detail = form.errors
          return JsonResponse(res.dict, json_dumps_params={"ensure_ascii": False})

      res.status = True  # 验证通过，设置响应状态为成功并返回
      return JsonResponse(res.dict)

  """ 短信登录"""

  def sms_login(request):
      if request.method == "GET":
          form = SmsLoginForm()
          return render(request, "sms_login.html", {"form": form})
      res = BaseResponse()
      form = SmsLoginForm(data=request.POST)  # 校验
      if not form.is_valid():
          res.detail = form.errors
          return JsonResponse(res.dict)

      # 登录 + 注册 （检测手机号是否存在）
      #   - 未注册，自动注册
      #   - 已注册，直接登录
      role = form.cleaned_data["role"]
      mobile = form.cleaned_data["mobile"]
      if role == "1":
          user_object = models.Administrator.objects.filter(active=1, mobile=mobile).first()
      else:
          user_object = models.Customer.objects.filter(active=1, mobile=mobile).first()
      if not user_object:
          res.detail = {"mobile": "手机号不存在"}
          return JsonResponse(res.dict)

      # 检验成功，用户信息写入 session + 进入项目后台
      mapping = {"1": "ADMIN", "2": "CUSTOMER"}
      request.session["user_info"] = {"role": mapping[role], "username": user_object.username, "id": user_object.id}
      res.status = True
      res.data = settings.LOGIN_HOME
      return JsonResponse(res.dict)

  ```
- `web/forms/account.py`

  ```python
  # 表单验证
  import random
  from django import forms
  from django.core.exceptions import ValidationError
  from django.core.validators import RegexValidator
  from django_redis import get_redis_connection

  from utils import tencent
  from utils.encrypt import md5
  from web import models

  class LoginForm(forms.Form):
      """ 检验字段 """
      role = forms.ChoiceField(
          label="角色",
          required=True,  # True 必填字段; False 非必填字段
          choices=((1, "管理员"), (2, "客户")),
          widget=forms.Select(attrs={"class": "form-control"})
      )
      username = forms.CharField(
          label="用户名",
          widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "username"})
      )
      password = forms.CharField(
          label="密码",
          min_length=6,
          max_length=16,
          validators=[RegexValidator(r'^[0-9]+$', "密码必须是数字")],  # 正则表达式
          widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "password"}, render_value=True),
      )

      def clean_username(self):
          user = self.cleaned_data['username']
          # 校验规则
          # 校验失败
          if len(user) < 3:
              raise ValidationError("用户名格式错误")
          return user

      def clean_password(self):
          return md5(self.cleaned_data['password'])

      def clean(self):
          # 对所有值进行校验
          # 1.不返回值，默认 self.cleaned_data
          # 2.返回值，      self.cleaned_data = 返回的值
          # 3.报错，        ValidationError ->  self.add_error(None, e)
          # pass
          user = self.cleaned_data.get("username")
          pwd = md5(self.cleaned_data.get("password"))
          if user and pwd:
              pass
          print(self.cleaned_data)
          # raise ValidationError("请输入正确的用户名或密码")

      def _post_clean(self):
          print("_post_clean")

  class MobileForm(forms.Form):
      role = forms.ChoiceField(
          label="角色",
          required=True,  # True 必填字段; False 非必填字段
          choices=((1, "管理员"), (2, "客户")),
          widget=forms.Select(attrs={"class": "form-control"})
      )

      mobile = forms.CharField(
          label="手机号",
          required=True,
          validators=[RegexValidator(r'^1[3589]\d{9}$', '手机号格式错误')]
      )

      """ 验证角色和手机号 + 发送短信 """
      def clean_mobile(self):
          role = self.cleaned_data.get['role']
          mobile = self.cleaned_data['mobile']
          if not role:
              return mobile
          if role == "1":
              exists = models.Administrator.objects.filter(active=1, mobile=mobile).exists()
          else:
              exists = models.Customer.objects.filter(active=1, mobile=mobile).exists()

          if not exists:
              raise ValidationError("手机号不存在")

          # 生成验证码 + 发送短信
          sms_code = str(random.randint(1000, 9999))
          is_success = tencent.send_sms(mobile, sms_code)
          if not is_success:
              return ValidationError("短信发送失败")
          # 保存手机号和验证码（之后进行校验） redis --> 超时时间
          conn = get_redis_connection("default")
          conn.set(mobile, sms_code, ex=60)
          return mobile

  class SmsLoginForm(forms.Form):
      role = forms.ChoiceField(
          label="角色",
          required=True,  # True 必填字段; False 非必填字段
          choices=((1, "管理员"), (2, "客户")),
          widget=forms.Select(attrs={"class": "form-control"})
      )
      mobile = forms.CharField(
          label="手机号",
          widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "mobile"})
      )
      code = forms.CharField(
          label="短信验证码",
          validators=[RegexValidator(r'^[0-9]+$', "验证码必须是数字")],
          widget=forms.TextInput(attrs={"class": "form-control", "placeholder": "code"})
      )

      def clean_code(self):
          # 短信验证码 + redis 中的验证码 -> 校验
          mobile = self.cleaned_data.get('mobile')
          code = self.cleaned_data.get('code')

          conn = get_redis_connection("default")
          cache_code = conn.get(mobile)
          if not cache_code:
              return ValidationError("短信验证码已过期")
          if code != cache_code.decode('utf-8'):
              return ValidationError("短信验证码错误")
          return code
  ```

### 5 菜单和权限

- 业务功能

  - 登录成功，用户信息写 `Session`
  - 中间件

    - 读取 `Session` 进行校验
    - 判断权限 & 路径导航 & 动态默认选中问题

    ```
    request.nb_user = 对象(.....)
    ```
  - 模板语法 + 自定义 `inclusion_tag` + 读取 `request.nb_user`

    ```
    页面菜单等展示
    ```

#### 1）中间件

- 主要的件

  ```
  process_request，基于他实现用户是否已登录，已登录继续，未登录则返回登录界面。
  	- return None	继续向后访问
  	- return 对象	直接返回
  	
  process_view，权限校验
  	- return None，继续向后访问
  	- return 对象，直接返回。
  	- 在他的request对象中有 resolver_match  ，包含当前请求的视图路由信息  .name -> sms_login
  		admin = ['sms_login',"xxx"]
  	
  process_response
  ```

- `settings.py`

  ```javascript
  MIDDLEWARE = [
      "utils.md.AuthMiddleware"
  ]

  # ====== 自定义配置 ======
  LOGIN_HOME = "/home/"
  NB_SESSION_KEY = "user_info"
  NB_LOGIN_URL = "/login/"
  NB_WHITE_URL = ["/login/", "/sms/login/", "/sms/send/", "/sms/(\d+)/"]
  ```
- `utils/md.py`

  ```javascript
  from django.utils.deprecation import MiddlewareMixin
  from django.conf import settings
  from django.shortcuts import redirect, HttpResponse, render

  class UserInfo:
      def __init__(self, id, username, role):
          self.id = id
          self.username = username
          self.role = role

  class AuthMiddleware(MiddlewareMixin):
      def is_white_url(self, request):
          if request.path_info in settings.NB_WHITE_URL:
              return True
      
      def process_request(self, request):
          """ 校验用户是否已登录 """
          """ 在 session 中获取用户信息，能获取到登录成功；否则未登录，跳转到登录页面 """
          # 1.不需要登录就能访问的URL
          if self.is_white_url(request):
              return

          user_dict = request.session.get(settings.NB_SESSION_KEY)
          # 未登录, 跳转到登录页面
          if not user_dict:
              return redirect(settings.LOGIN_URL)

          # 已登录，封装用户信息
          # request.nb_user = UserInfo(user_dict['id'], user_dict['name'], user_dict['role'])
          request.nb_user = UserInfo(**user_dict)
          # 若要获取用户信息：
          # request.nb_user.id
          # request.nb_user.name
          # request.nb_user.role

      def process_view(self, request, callback, callback_args, callback_kwargs):
          pass
  ```

#### 2）动态菜单

不同角色用户看到不同的菜单

- `settings.py`

  ```python
  NB_MENU = {
      "ADMIN": [
          {"title": "用户信息", "icon": "fa fa-bed",
           "children": [
               {"title": "用户列表", "url": "/user/", "name": "n1"},
               {"title": "用户组", "url": "/order/"},
               {"title": "权限", "url": "/permission/"},
           ]},
          {"title": "权限管理", "icon": "fa fa-keyboard-o", "name": "n2",
           "children": [
              {"title": "权限1", "url": "/level/", "name": "n2"},
              {"title": "权限2", "url": "/group/"},
              {"title": "权限3", "url": "/permission/"},
          ]},
          {"title": "任务管理", "url": "/task/"},
          {"title": "统计管理", "url": "/report/"},
      ],
      "CUSTOMER": [
          {"title": "任务管理", "icon": "fa fa-tasks", "url": "report/"},
          {"title": "用户信息", "icon": "fa fa-bed",
           "children": [
               {"title": "用户列表", "url": "/user/"},
               {"title": "用户组", "url": "/group/"},
               {"title": "权限", "url": "/permission/"},
           ]},
      ]
  ```

- `web/templates/tag/nb_menu.html`

  ```html
  <div>
      {% for item in menu_list %}
          <idv>{{ item.icon }} {{ item.title }}</idv>
          <div>
              {% for child in item.children %}
              <a href="{{ item.url }}">{{ item.title }}</a>
              {% endfor %}
          </div>
      {% endfor %}
  </div>
  ```
- `web/templatetags/menu.py`

  ```python
  from django.template import Library
  from django.conf import settings

  register = Library()

  @register.inclusion_tag("tag/nb_menu.html")
  def nb_menu(request):
      # 1. 读取当前用户的 角色信息

      # 2. 获取当前用户的 菜单信息
      user_menu_list = settings.NB_MENU.get(request.nb_user.role, [])

      return {'menu_list': user_menu_list}
  ```
- `web/templates/home.html`

  ```html
  {% load menu %}
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <div class="pg-1">
          {% nb_menu request %}
      </div>
      <div class="pg-2">
          <h3>欢迎登录</h3>
      </div>
  </body>
  </html>
  ```

---

- 简单美化

  > HTML+CSS+JavaScrip
  >

  - `url.py`

    ```javascript
    from django.urls import path
    from web.views import account

    urlpatterns = [
        path('home/', account.home, name='home'),
    ]
    ```
  - `web/views/account.py`

    ```python
    from django.shortcuts import render
    def home(request):
        return render(request, "home.html")
    ```
  - `web/templates/home.html`

    ```html
    {% extends 'layout.html' %}

    {% block content %}
    <div class="container-fluid">
        <h3>HOME</h3>
        <div class="row">
            <div class="col-md-12">
                <p>内容</p>
            </div>
        </div>
    </div>
    {% endblock %}
    ```
  - `web/templates/layout.html`

    ```html
    {% load static %}
    {% load menu %}
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <link rel="stylesheet" href="{% static 'plugins/bootstrap/css/bootstrap.css' %}">
        <link rel="stylesheet" href="{% static 'plugins/font-awesome/css/font-awesome.min.css' %}">
        <link rel="stylesheet" href="{% static 'css/commons.css' %}?v=1.1">
        <link rel="stylesheet" href="{% static 'css/menu.css' %}?v=1.1">
    </head>
    <body>
        <div class="pg-header"></div>
        <div class="pg-body">
            <div class="left-menu">
                {% nb_menu request %}
            </div>
            <div class="right-body">
                {% block content %}{% endblock %}
            </div>
        </div>

    <script src="{% static 'js/jquery-3.6.0.min.js' %}"></script>
    <script src="{% static 'plugins/bootstrap/js/bootstrap.min.js' %}"></script>
    <script src="{% static 'js/menu.js' %}"></script>
    </body>
    </html>
    ```

    - `web/static/css/commons.css`

      ```javascript
      .pg-header {
          height: 48px;
          background-color: #1b6d85;
      }

      .pg-body > .left-menu {
          background-color: #EAEDF1;
          position: absolute;
          left: 1px;
          top: 58px;
          bottom: 0;
          width: 220px;
          border: 1px solid #EAEDF1;
          overflow: auto;
      }

      .pg-body > .right-body {
          position: absolute;
          left: 225px;
          right: 0;
          top: 58px;
          bottom: 0;
          overflow: scroll;
          border: 1px solid #ddd;
          border-top: 0;
          font-size: 13px;
          min-width: 755px;
      }
      ```
    - `web/static/css/menu.css`

      ```javascript
      .multi-menu {
          margin: 0;
          padding: 0;
      }

      .multi-menu .item {
          background-color: white;
          margin-bottom: 5px;
          border: 1px solid #ddd;
      }

      .multi-menu .item > .title {
          padding: 10px 5px;
          border-bottom: 1px solid #dddddd;
          cursor: pointer;
          color: #333;
          display: block;
          background: #efefef;
          background: -webkit-gradient(linear, left bottom, left top, color-stop(0, #efefef), color-stop(1, #fafafa));
          background: -ms-linear-gradient(bottom, #efefef, #fafafa);
          background: -o-linear-gradient(bottom, #efefef, #fafafa);
          filter: progid:dximagetransform.microsoft.gradient(startColorStr='#e3e3e3', EndColorStr='#ffffff');
          -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorStr='#fafafa',EndColorStr='#efefef')";
          box-shadow: inset 0 1px 1px white;
          position: relative;
      }

      .multi-menu .item > .title:hover {
          background: #e0e0e0;
      }

      .multi-menu .item > .body {
          border-bottom: 1px solid #dddddd;
          display: none;
      }

      .multi-menu .item > .body a {
          display: block;
          padding: 5px 20px;
          text-decoration: none;
          border-left: 2px solid transparent;
          font-size: 13px;
          color: #333;
      }

      .multi-menu .item > .body a:hover {
          border-left: 2px solid #2F72AB;
          background-color: #f5f5f5;
      }

      .multi-menu .item > .body a.active {
          border-left: 2px solid #2F72AB;
          background-color: #f0f0f0;
      }

      .icon-wrap {
          margin-right: 5px;
      }
      ```
    - `web/templatetags/menu.py`

      ```python
      from django.template import Library
      from django.conf import settings

      register = Library()

      @register.inclusion_tag("tag/nb_menu.html")
      def nb_menu(request):
          # 1. 读取当前用户的 角色信息

          # 2. 获取当前用户的 菜单信息
          user_menu_list = settings.NB_MENU.get(request.nb_user.role, [])

          return {'menu_list': user_menu_list}
      ```

      - `web/templates/tag/nb_menu.html`

        ```javascript
        <div class="multi-menu">
            {% for item in menu_list %}
                <div class="item">
                    <div class="title">
                        
                            <i class="{{ item.icon }}"></i>
                         
                        {{ item.title }}
                    </div>
                    <div class="body">
                        {% for child in item.children %}
                            <a href="{{ child.url }}">{{ child.title }}</a>
                        {% endfor %}
                    </div>
                </div>
            {% endfor %}
        </div>
        ```
    - `web/static/js/menu.js`

      ```javascript
      $(function () {
          $('.multi-menu .title').click(function () {
              $(this).next().toggle();
          });
      });
      ```

- 默认选中

  ```
  获取当前请求的URL   /xxx/xx/
  菜单位置：
  	如果菜单中的URL = 获取当前请求的URL  ---> 选中样式
  ```

  - `web/templatetags/menu.py`

    ```python
    from django.template import Library
    from django.conf import settings
    import copy

    register = Library()

    @register.inclusion_tag("tag/nb_menu.html")
    def nb_menu(request):
        # 1. 读取当前用户的 角色信息

        # 2. 获取当前用户的 菜单信息
        user_menu_list = copy.deepcopy(settings.NB_MENU[request.nb_user.role])
        for item in user_menu_list:
            # 检查菜单项是否有children键
            if "children" in item:
                for child in item["children"]:
                    if child['url'] == request.path_info:
                        child["class"] = "active"
                        item["has_active"] = True

        return {'menu_list': user_menu_list}
        return {'menu_list': user_menu_list}
    ```
  - `web/templates/tag/nb_menu.html`

    ```python
    <div class="multi-menu">
        {% for item in menu_list %}
            <div class="item {% if item.has_active %}active{% endif %}">
                <div class="title">
                    
                        <i class="{{ item.icon }}"></i>
                     
                    {{ item.title }}
                </div>
                <div class="body {{ item.class }}">
                    {% for child in item.children %}
                        <a class="{{ child.class }}" href="{{ child.url }}">{{ child.title }}</a>
                    {% endfor %}
                </div>
            </div>
        {% endfor %}
    </div>
    ```
  - `web/static/css/menu.css`

    ```css
    .multi-menu .item {
        background-color: white;
    }

    .multi-menu .item > .title {
        padding: 10px 5px;
        border-bottom: 1px solid #dddddd;
        cursor: pointer;
        color: #333;
        display: block;
        background: #efefef;
        background: -webkit-gradient(linear, left bottom, left top, color-stop(0, #efefef), color-stop(1, #fafafa));
        background: -ms-linear-gradient(bottom, #efefef, #fafafa);
        background: -o-linear-gradient(bottom, #efefef, #fafafa);
        filter: progid:dximagetransform.microsoft.gradient(startColorStr='#e3e3e3', EndColorStr='#ffffff');
        -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorStr='#fafafa',EndColorStr='#efefef')";
        box-shadow: inset 0 1px 1px white;
    }

    .multi-menu .item > .body {
        border-bottom: 1px solid #dddddd;
        display: none; /* 默认隐藏所有子菜单 */
    }

    .multi-menu .item > .body a {
        display: block;
        padding: 5px 20px;
        text-decoration: none;
        border-left: 2px solid transparent;
        font-size: 13px;
    }

    .multi-menu .item > .body a:hover {
        border-left: 2px solid #2F72AB;
    }

    .multi-menu .item > .body a.active {
        border-left: 2px solid #2F72AB;
    }

    .multi-menu .item.active > .body {
        display: block; /* 只有活动菜单才显示子菜单 */
    }
    ```

- 顶部导航处理`web/templates/layout.html`

  ```html
  {% load static %}
  {% load menu %}
  <!DOCTYPE html>
  <html lang="en">
  <!-- 更新 -->
  <head>
      <link rel="stylesheet" href="{% static 'css/nav.css' %}">
  </head>
  <body>
      <div class="pg-header"></div>
          <div class="nav">

          <div class="logo-area left">
              <a href="{% url 'home' %}">
                  NB的管理平台 
              </a>
          </div>

          <div class="right-menu right clearfix">
              <div class="user-info right">
                  <a href="#" class="avatar" style="text-decoration: none;">
                      {{ request.nb_user.name }}
                      <img class="img-circle" style="width: 35px;height: 35px;" src="{% static 'images/default.png' %}">
                  </a>
                  <div class="more-info">
                      <a href="{% url 'logout' %}" class="more-item">注销</a>
                  </div>
              </div>
          </div>
      </div>

  </body>
  </html>
  ```

#### 3）权限校验

- 一个权限，就是一个 URL
- 用户具有的权限 => URL

  ```
  /user/list/            ->   n1
  /user/<int:id>/edit/   ->   n2
  ```
- 权限信息 `settings`

  在全局变量中定义自己的专属配置（名称必须大写）

  ```
  NB_PERMISSION = {
  	"ADMIN": {
  		"n1":"....",
  		"n2":"....",
  	},
  	"CUSTOMER":{
  		"n1":"....",
  	}
  }
  ```

  ```
  from django.conf import settings

  用户访问程序时，程序可以读取当前你访问的 URL 的 name
  ```
- 面向对象的

  ```
  class UserInfo(object):
      def __init__(self, role, name, id):
          self.id = id
          self.name = name
          self.role = role
          self.menu_name = None
          self.text_list = []
  ```
- 当前匹配成功URL的name属性

  ```
  如果项目大，拆分多app，用到路由分发，使用namespace
  ```

---

- 权限校验

  - `settings.py`

    ```python
    NB_PERMISSION = {
        "ADMIN": {
            "home": None,
            "level": None,
            # "order": None,
            "user": None,
        },
        "CUSTOMER": {
            "home": None,
            "user": None,
        }
    }
    ```
  - `utils/md.py`

    ```python
    from django.utils.deprecation import MiddlewareMixin
    from django.conf import settings
    from django.shortcuts import redirect, render

    class UserInfo:
        def __init__(self, id, username, role):
            self.id = id
            self.name = username
            self.role = role

    class AuthMiddleware(MiddlewareMixin):
        """ 更新 """
        def process_view(self, request, callback, callback_args, callback_kwargs):
            # 1. 根据用户角色获取相应的权限
            user_permission_dict = settings.NB_PERMISSION[request.nb_user.role]
            # 2. 获取当前访问的URL
            current_name = request.resolver_match.url_name
            # 3. 判断当前URL是否在权限列表中
            if current_name not in user_permission_dict:
                return render(request, 'permission.html')
    ```
  - `web/templates/permission.html`

    ```html
    {% extends 'layout.html' %}

    {% block content %}
        <h3>无权访问</h3>
    {% endblock %}
    ```

- 访问子页面时，关联菜单需要被选中。

  - `web/templates/order.html`

    ```html
    {% extends 'layout.html' %}

    {% block content %}
    <div class="container-fluid">
        <!-- “添加”按钮 -->
        <a class="btn btn-primary" href="{% url 'order_add' %}">添加</a>
        <h3>Order</h3>
        <div class="row">
            <div class="col-md-12">
                <p>内容</p>
            </div>
        </div>
    </div>
    {% endblock %}
    ```
  - `web/templates/order_add.html` 子页面

    ```html
    {% extends 'layout.html' %}

    {% block content %}
    <div class="container-fluid">
        <h3>Order_add</h3>
    </div>
    {% endblock %}
    ```
  - `settings.py`

    ```python
    NB_MENU = {
        "ADMIN": [
            {"title": "用户信息", "icon": "fa fa-bed",
             "children": [
                 {"title": "用户列表", "url": "/user/", "name": "user"},
                 {"title": "用户组", "url": "/order/", "name": "order"},
                 {"title": "权限", "url": "/permission/"},
             ]},
            {"title": "权限管理", "icon": "fa fa-keyboard-o",
             "children": [
                {"title": "权限1", "url": "/level/", "name": "level"},
                {"title": "权限2", "url": "/group/"},
                {"title": "权限3", "url": "/permission/"},
            ]},
            {"title": "任务管理", "url": "/task/"},
            {"title": "统计管理", "url": "/report/"},
        ],
        "CUSTOMER": [
            {"title": "任务管理", "icon": "fa fa-tasks", "url": "/report/"},
            {"title": "用户信息", "icon": "fa fa-bed",
             "children": [
                 {"title": "用户列表", "url": "/user/"},
                 {"title": "用户组", "url": "/group/"},
                 {"title": "权限", "url": "/permission/"},
             ]},
        ]
    }

    NB_PERMISSION = {
        "ADMIN": {
            "home": {"text": "首页", "parent": None},
            "level": {"text": "级别管理", "parent": None},
            "order": {"text": "订单列表", "parent": None},
            "order_add": {"text": "添加订单", "parent": "order"},
            "user": {"text": "用户管理", "parent": None},
        },
        "CUSTOMER": {
            "home": {"text": "首页", "parent": None},
            "user": {"text": "用户信息", "parent": None},
        }
    }
    ```
  - `utils/md.py`

    ```python
    class UserInfo:
        def __init__(self, id, username, role):
            self.id = id
            self.name = username
            self.role = role

    class AuthMiddleware(MiddlewareMixin):
        def process_view(self, request, callback, callback_args, callback_kwargs):
            # 1. 根据用户角色获取相应的权限
            user_permission_dict = settings.NB_PERMISSION[request.nb_user.role]
            # 2. 获取当前访问的URL
            current_name = request.resolver_match.url_name
            # 3. 判断当前URL是否在权限列表中
            if current_name not in user_permission_dict:
                return render(request, 'permission.html')
    		""" 更新 """
    		# 4. 有权限
            menu_name = current_name
            # 获取父级菜单
            while user_permission_dict[menu_name]['parent']:
                menu_name = user_permission_dict[menu_name]['parent']
            # 4.1 当前菜单的值
            request.nb_user.menu_name = menu_name
    ```
  - `web/templatetags/menu.py`

    ```python
    register = Library()

    @register.inclusion_tag("tag/nb_menu.html")
    def nb_menu(request):
        # 1. 读取当前用户的 角色信息

        # 2. 获取当前用户的 菜单信息
        user_menu_list = copy.deepcopy(settings.NB_MENU[request.nb_user.role])
        for item in user_menu_list:
            # 检查菜单项是否有children键
            if "children" in item:
                for child in item["children"]:
                    # if child['url'] == request.path_info:
                    """ 根据 name 获取当前菜单项 """
                    if child.get('name') == request.nb_user.menu_name:
                        child["class"] = "active"
                        item["has_active"] = True
        return {'menu_list': user_menu_list}
    ```
- 路径导航

  - `utils/md.py`

    ```python
    class UserInfo:
        def __init__(self, id, username, role):
            self.id = id
            self.name = username
            self.role = role
    		""" 更新 """
            self.menu_name = None
            self.text_list = []

    class AuthMiddleware(MiddlewareMixin):
        def process_view(self, request, callback, callback_args, callback_kwargs):
            # 1. 根据用户角色获取相应的权限
            user_permission_dict = settings.NB_PERMISSION[request.nb_user.role]
            # 2. 获取当前访问的URL
            current_name = request.resolver_match.url_name
            # 3. 判断当前URL是否在权限列表中
            if current_name not in user_permission_dict:
                return render(request, 'permission.html')
            # 4. 有权限
            text_list = [] # ['添加订单','订单列表']
            text_list.append(user_permission_dict[current_name]['text'])

            menu_name = current_name
            # 获取父级菜单
            while user_permission_dict[menu_name]['parent']:
                menu_name = user_permission_dict[menu_name]['parent']

                text = user_permission_dict[menu_name]['text']
                text_list.append(text)

    		""" 更新 """
            text_list.append("首页")
            text_list.reverse()
            # 4.1 当前菜单的值
            request.nb_user.menu_name = menu_name
            # 4.2 路径导航
            request.nb_user.text_list = text_list
            print(text_list)
    ```
  - `web/templates/layout.html`

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <body>

        <div class="pg-body">
            <div class="left-menu">
                {% nb_menu request %}
            </div>
            <div class="right-body">
    			<!-- 更新 -->
                <ol class="breadcrumb">
                    {% for text in request.nb_user.text_list %}
                        <li><a href="#">{{ text }}</a></li>
                    {% endfor %}
                </ol>
                {% block content %}{% endblock %}
            </div>
        </div>

    </body>
    </html>
    ```

- 权限优化 `utils/md.py`

  ```python
  class AuthMiddleware(MiddlewareMixin):

  	""" 更新 """
      def is_white_url(self, request):
          """ 判断当前URL是否在白名单中 """
          if request.path_info in settings.NB_WHITE_URL:
              return True
      
      def process_request(self, request):
          """ 校验用户是否已登录 """
          # 1.不需要登录就能访问的URL
          if self.is_white_url(request):
              return
  		...

      def process_view(self, request):
          """ 校验用户权限 """
          if self.is_white_url(request):
              return
  		...
  ```

### 6 级别管理

- `web/templates/level_list.html`

  ```html
  {% extends "layout.html" %}

  {% block content %}
      <div style="margin-bottom: 5px">
          <a href="{% url 'level_add' %}" class="btn btn-success">
               新建
          </a>
      </div>
      <table class="table table-bordered">
          <thead>
          <tr>
              <th>ID</th>
              <th>标题</th>
              <th>折扣</th>
              <th>操作</th>
          </tr>
          </thead>
          <tbody>
          {% for row in queryset %}
              <tr>
                  <th>{{ row.id }}</th>
                  <th>{{ row.title }}</th>
                  <th>{{ row.percent }} %</th>
                  <td>
                      <a href="{% url 'level_edit' pk=row.id %}" class="btn btn-primary btn-xs">编辑</a>
                      <a href="{% url 'level_delete' pk=row.id %}" class="btn btn-danger btn-xs">删除</a>
                  </td>
              </tr>
          {% endfor %}
          </tbody>
      </table>
  {% endblock %}
  ```
- 级别管理界面

  - `settings.py`

    ```python
    NB_MENU = {
        "ADMIN": [
            {"title": "管理", "icon": "fa fa-keyboard-o",
             "children": [
                {"title": "级别管理", "url": "/level/list/", "name": "level_list"},
            ]},
        ],
    }

    # 公共权限
    NB_PERMISSION_PUBLIC = {
        "home": {"text": "首页", "parent": None},
        "logout": {"text": "注销", "parent": None},
    }

    # 角色权限
    NB_PERMISSION = {
        "ADMIN": {
            "level_list": {"text": "级别管理", "parent": None},
            "level_add": {"text": "新建级别", "parent": "level_list"},
    		"level_edit": {"text": "编辑级别", "parent": "level_list"},
        },
    }
    ```
  - `url.py`

    ```python
    from django.urls import path
    from web.views import level

    urlpatterns = [
        path('level/list/', level.level_list, name='level_list'),
        path('level/add/', level.level_add, name='level_add'),
    	
    ]
    ```
  - `web/views/level.py`

    ```python
    from django.shortcuts import render, redirect
    from web import models
    from django import forms
    from django.urls import reverse

    class LevelForm(forms.Form):
        title = forms.CharField(
            label="标题",
            required=True,
            widget=forms.TextInput(attrs={"class": "form-control"})
        )
        percent = forms.CharField(
            label="折扣",
            required=True,
            widget=forms.NumberInput(attrs={"class": "form-control"}),
            help_text="填入0-100整数表示百分比，例如：90，表示90%"
        )

    def level_list(request):
        queryset = models.Level.objects.filter(active=1)
        return render(request, "level_list.html", {"queryset": queryset})
    ```

- 级别添加

  `web/models.py`

  ```python
  from django.db import models

  class ActiveBaseModel(models.Model):
      active = models.SmallIntegerField(verbose_name="状态", default=1, choices=((1, "激活"), (0, "删除"),))

      class Meta:
          abstract = True
          
  class Level(ActiveBaseModel):
      """ 级别表 """
      title = models.CharField(verbose_name="标题", max_length=32)
      percent = models.IntegerField(verbose_name="折扣")
  ```

  - `Form`，需要 请求校验 + 复杂SQL操作 时

    > 编写字段  
    > 生成HTML标签 + 插件 + 和参数的配置  
    > 表单的验证
    >

    ```python
    class LevelForm(forms.Form):
        title = forms.CharField(
            label="标题",
            required=True,
            widget=forms.TextInput(attrs={"class": "form-control"})
        )
        percent = forms.CharField(
            label="折扣",
            required=True,
            widget=forms.NumberInput(attrs={"class": "form-control"}),
            help_text="填入0-100整数表示百分比，例如：90，表示90%"
        )
    ```
  - `ModelForm`，表的增删改查方便

    > 不编写字段，直接引用 `Model` 字段【优秀】  
    > 生成HTML标签 + 插件 + 和 参数的配置  
    > 表单的验证  
    > 保存（新增、更新）
    >

    - 不编写字段，直接引用 `Model` 字段

      ```python
      class LevelModelForm(forms.ModelForm):
      	new = forms.CharField(label='new') # 扩增字段
      	title = forms.ChoiceField(label='new_title', choices=((1, "c1"), (2, "c2"))) # 重写字段
          class Meta:
              model = models.Level
      		# exclude = ['active'] # 排除指定字段
      		# fields = "__all__" # 显示所有字段
      		# fields = ['title', 'new', 'percent', ] # 扩增后
              fields = ["title", "percent"]
              widgets = {
                  "title": forms.TextInput(attrs={"class": "form-control", "placeholder": "级别名称"}),
                  "percent": forms.NumberInput(attrs={"class": "form-control", "placeholder": "折扣百分比"}),
              }
      ```
    - 生成HTML标签 + 插件 + 参数的配置

      ```python
      class LevelModelForm(BootStrapForm, forms.ModelForm):
          class Meta:
              model = models.Level
              fields = ['title', 'percent', ]
              widgets = {
                  'name': forms.PasswordInput(render_value=True) # 插件
              }
      ```
    - 表单验证

      ```python
      class LevelModelForm(BootStrapForm, forms.ModelForm):
          title = forms.CharField(validators=[])
          class Meta:
              model = models.Level
              fields = ['title', 'percent', ]

          def clean_percent(self):
              value = self.cleaned_data['percent']
              return value
      ```
    - 保存（新增、更新）

      ```python
      form = LevelModelForm(data=request.POST) # 新增
      form = LevelModelForm(data=request.POST, instance=对象) # 更新
      form.save()
      ```

      ```python
      class LevelModelForm(BootStrapForm, forms.ModelForm):
          class Meta:
              model = models.Level
              fields = ["title"]

      form = LevelModelForm(data=request.POST)
      form.instance.percent = 10 # 添加或修改默认值（用户只需输入：title）
      form.save()
      ```

      ```python
      class LevelModelForm(BootStrapForm, forms.ModelForm):
          confirm_percent = forms.CharField(label="确认") # 添加字段
          class Meta:
              model = models.Level
              fields = ['title', 'percent']

      form = LevelModelForm(data=request.POST) 
      print(form.cleaned_data)
      # {'title': '1', 'percent': 2, 'confirm_percent': '3'}
      form.save()
      ```

  【Tip】Form和ModelForm，美化页面，都需要将每个字段的插件中设置 `form-control` 样式

  - 改进

    ```python
    class LevelModelForm(forms.ModelForm):
        class Meta:
            model = models.Level
            fields = ['title', 'percent']
        ''' 改进 '''
        def __init__(self,*args,**kwargs):
            super().__init__(*args,**kwargs)
            
            # {'title':对象,"percent":对象}
            for name,field in self.fields.items():
                field.widget.attrs['class'] = "form-control"
                field.widget.attrs['placeholder'] = "请输入{}".format(field.label)

    def level_list(request):
        queryset = models.Level.objects.filter(active=1)
        return render(request, "level_list.html", {"queryset": queryset})

    def level_add(request):
        if request.method == "GET":
            form = LevelModelForm()
            return render(request, "form.html", {"form": form})
        form = LevelModelForm(data=request.POST)
        if form.is_valid():
            return render(request, "form.html", {"form": form})
        form.save()
        return redirect(reverse('level_list'))
    ```

- BootStrap 样式优化

  - `utils/bootstrap.py`

    ```python
    class BootStrapForm:
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            for name, field in self.fields.items():
                field.widget.attrs['class'] = "form-control"
                field.widget.attrs['placeholder'] = "请输入{}".format(field.label)
    ```
  - `web/views/level.py`

    ```python
    from utils.bootstrap import BootStrapForm

    class LevelModelForm(BootStrapForm, forms.ModelForm):
        class Meta:
            model = models.Level
            fields = ["title", "percent"]
    ```

- 编辑

  - `urls & settings`

    ```python
    # urls.py
    urlpatterns = [
        path('level/edit/<int:pk>/', level.level_edit, name='level_edit'),
    ]

    # settings.py
    # 角色权限
    NB_PERMISSION = {
        "ADMIN": {
            "level_edit": {"text": "编辑级别", "parent": "level_list"},
        },
    }
    ```
  - `web/views/level.py`

    ```python
    def level_edit(request, pk):
        level_object = models.Level.objects.filter(id=pk, active=1).first()  # 获取对象
        if request.method == "GET":
            # form = LevelModelForm(initial={"title": "123", "percent": 90}) # 显示默认值（ModelForm和Form通用）
            form = LevelModelForm(instance=level_object) # instance: 指定ModelForm的初始化对象
            return render(request, "form.html", {"form": form})
        form = LevelModelForm(data=request.POST, instance=level_object)
        if not form.is_valid():
            return render(request, 'form.html', {"form": form})
        form.save()
        return redirect(reverse('level_list'))
    ```

- 删除

  - `urls & settings`

    ```python
    # urls.py
    urlpatterns = [
        path('level/delete/<int:pk>/', level.level_delete, name='level_delete'),
    ]

    # settings.py
    # 角色权限
    NB_PERMISSION = {
        "ADMIN": {
            "level_delete": {"text": "删除级别", "parent": "level_delete"},
        },
    }
    ```

  - `web/views/level.py`

    ```python
    def level_delete(request, pk):
        models.Level.objects.filter(id=pk).update(active=0)
        return redirect(reverse('level_list'))
    ```

### 7 客户管理

- 客户列表

  - 关联数据

    - 问题：如果关联的级别被删除呢？

      ```
      - 删除级别时，判断下属如果还有数据，则不允许被删除。
      - 自动将级别设置为某个级别。
      - 将级别设置为空。
      ```
    - `urls & settings`

      ```python
      from django.urls import path
      from web.views import customer

      urlpatterns = [
          path('customer/list/',customer.customer_list, name='customer_list')
      ]

      NB_MENU = {
          "ADMIN": [
              {"title": "管理", "icon": "fa fa-keyboard-o",
               "children": [
                  {"title": "级别管理", "url": "/level/list/", "name": "level_list"},
                  {"title": "客户管理", "url": "/customer/list/", "name": "customer_list"},
              ]},
          ],
      }

      # 角色权限
      NB_PERMISSION = {
          "ADMIN": {
              "customer_list": {"text": "客户管理", "parent": None},
          },
      }
      ```
    - `web/views/customer.py`

      ```python
      from django.shortcuts import render
      from web import models

      def customer_list(request):
          # 1. 获取客户列表 # queryset = [obj1, obj2, obj3]
          # 1.1 客户可以被删除（逻辑删除） -> active=1
          # 1.2 级别被删除了，下属有客户，怎么办？ 【逻辑删除】
          #       - 修改级别删除的逻辑，查询是否有关联数据，有关联数据，则不允许删除 （*）
          #       - 将下属客户设置默认值，例如: None
          #       - 不做任何行为，后续客户查询则需 -> level__active=1
          queryset = models.Customer.objects.filter(active=1)

          return render(request, "customer_list.html")
      ```
    - `web/views/level.py`

      ```python
      from web import models
      def level_delete(request, pk):
          # v1
          exists = models.Level.objects.filter(level_id=pk).exists()
          if not exists:
              return models.Level.objects.filter(id=pk).update(active=0)
          # # v2
          # models.Level.objects.filter(level_id=pk).update(levle=None).exists()
          # # v3
          # models.Level.objects.filter(id=pk).update(active=0)
          return redirect(reverse('level_list'))
      ```
  - 页面展示

    - `web/views/customer.py`

      ```python
      from django.shortcuts import render
      from web import models

      def customer_list(request):
          # 1. 获取客户列表 # queryset = [obj1, obj2, obj3]
          # 1.1 客户可以被删除（逻辑删除） -> active=1
          # 1.2 级别被删除了，下属有客户，怎么办？ 【逻辑删除】
          #       - 修改级别删除的逻辑，查询是否有关联数据，有关联数据，则不允许删除 （*）
          #       - 将下属客户设置默认值，例如: None
          #       - 不做任何行为，后续客户查询则需 -> level__active=1
          queryset = models.Customer.objects.filter(active=1, level__active=1)
          context = {"queryset": queryset}
          return render(request, "customer_list.html", context)
      ```
    - `web/templates/customer_list.html`

      ```python
      {% extends "layout.html" %}

      {% block content %}
          <div style="margin-bottom: 5px">
              <a href="#" class="btn btn-success">
                   新建
              </a>
          </div>
          <table class="table table-bordered">
              <thead>
              <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>手机号</th>
                  <th>账户余额</th>
                  <th>级别</th>
                  <th>注册时间</th>
                  <th>创建者</th>
              </tr>
              </thead>
              <tbody>
              {% for row in queryset %}
                  <tr>
                      <td>{{ row.id }}</td>
                      <td>{{ row.username }}</td>
                      <td>{{ row.mobile }}</td>
                      <td>{{ row.balance }}</td>
                      <td>{{ row.level }}</td>
                      <td>{{ row.create_date }}</td>
                      <td>{{ row.creator }}</td>
                      <td>
                          <a href="#" class="btn btn-primary btn-xs">编辑</a>
                          <a href="#" class="btn btn-danger btn-xs">删除</a>
                      </td>
                  </tr>
              {% endfor %}
              </tbody>
          </table>
      {% endblock %}
      ```
    - 修复页面显示问题（`obj`=>`str`）

      - v1：`models.py`

        ```python
        # 级别
        class Level(ActiveBaseModel):
            """ 级别表 """
            title = models.CharField(verbose_name="级别", max_length=32)
            percent = models.IntegerField(verbose_name="折扣", help_text="填入0-100整数表示百分比，例如：90，表示90%",)

            def __str__(self):
                return self.title

        # 创建者
        class Administrator(ActiveBaseModel):
            """ 管理员表 """
            username = models.CharField(verbose_name="用户名", max_length=32, db_index=True)
            password = models.CharField(verbose_name="密码", max_length=64)
            mobile = models.CharField(verbose_name="手机号", max_length=11, db_index=True)
            create_date = models.DateTimeField(verbose_name="创建日期", auto_now_add=True)
            
            def __str__(self):
                return self.username
        ```
      - v2：`web/templates/customer_list.html`

        ```html
        {% for row in queryset %}
            <tr>
                <td>{{ row.id }}</td>
                <td>{{ row.username }}</td>
                <td>{{ row.mobile }}</td>
                <td>{{ row.balance }}</td>
                <td>{{ row.level.title }}（{{ row.level.percent }}%）</td>
                <td>{{ row.create_date }}</td>
                <td>{{ row.creator.username }}</td>
                <td>
                    <a href="#" class="btn btn-primary btn-xs">编辑</a>
                    <a href="#" class="btn btn-danger btn-xs">删除</a>
                </td>
            </tr>
        {% endfor %}
        ```
  - 主动连表查询

    django 默认会为每个对象分别执行额外的数据库查询

    使用 `select_related("level", "creator") `后，Django 会在一次 SQL 查询中通过 JOIN 操作获取所有需要的数据

    ```python
    def customer_list(request):
        queryset = models.Customer.objects.filter(active=1).select_related("level", "creator")
        context = {"queryset": queryset}
        return render(request, "customer_list.html", context)
    ```
  - 模板的时间格式

    ```html
    <td>{{ row.create_date|date:"Y-m-d H:i:s" }}</td>
    ```
- 新建客户

  - 页面展示

    - `urls & settings`

      ```python
      urlpatterns = [
          path('customer/add/',customer.customer_add, name='customer_add'),
      ]

      NB_PERMISSION = {
          "ADMIN": {
              "customer_list": {"text": "客户管理", "parent": None},
              "customer_add": {"text": "客户管理", "parent": "customer_list"},
          },
      }
      ```
    - `web/views/customer.py`

      ```python
      class CustomerModelForm(BootStrapForm, forms.ModelForm):
          password = forms.CharField(label="密码", widget=forms.PasswordInput)
          class Meta:
              model = models.Customer
              fields = ["username", "password", "mobile", "level"]
      def customer_add(request):
          form = CustomerModelForm()
          return render(request, "form2.html", {"form": form})
      ```
    - `web/templates/customer_list.html`

      ```html
      <div style="margin-bottom: 5px">
          <a href="{% url 'customer_add' %}" class="btn btn-success">
               新建
          </a>
      </div>
      ```
    - `web/templates/form2.html`

      ```python
      {% extends "layout.html" %}
      {% block content %}
          <form method="post" novalidate>
              <div class="row clearfix">
                  {% for field in form %}
                      {% csrf_token %}
                      <div class="col-sm-6">
                          <div class="form-group" style="position: relative; margin-bottom: 25px">
                              <label for="{{ field.id_for_label }}">
                                  {{ field.label }}
                                  {% if field.help_text %}
                                      （{{ field.help_text }}）
                                  {% endif %}
                              </label>
                              {{ field }}
                              {{ field.errors.0 }}
                          </div>
                      </div>
                  {% endfor %}
              </div>
          <button type="submit" class="btn btn-primary">保 存</button>
          </form>
      {% endblock %}
      ```
  - 新增重复密码字段

    ```python
    class CustomerModelForm(BootStrapForm, forms.ModelForm):
        password = forms.CharField(label="密码", widget=forms.PasswordInput)
        confirm_password = forms.CharField(label="确认密码", widget=forms.PasswordInput)
        class Meta:
            model = models.Customer
            fields = ["username", "password", "mobile", "confirm_password", "level"]
    ```
  - 展示管理级别 - 数据源

    - v1：在models中利用 `limit_choice_to` 筛选数据

      ```python
      level = models.ForeignKey(verbose_name="级别", to="Level", on_delete=models.CASCADE, limit_choices_to={'active':1})
      只显示 active=1 的数据
      ```
    - v2：自定义 `queryset`

      ```python
      class CustomerModelForm(BootStrapForm, forms.ModelForm):
          def __init__(self, *args, **kwargs):
              super().__init__(*args, **kwargs)
              self.fields["level"].queryset = models.Level.objects.filter(active=1)
      ```

      ```
      queryset = models.Level.objects.filter(active=1).order_by("percent")
      ```
  - 展示管理级别 - 页面`form`插件 `select -> radio`

    `utils/bootstrap.py`

    ```python
    class BootStrapForm:
        exclude_filed_list = [] # 
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            for name, field in self.fields.items():
                if name in self.exclude_filed_list: # 
                    continue
                field.widget.attrs['class'] = "form-control"
                field.widget.attrs['placeholder'] = "请输入{}".format(field.label)
    ```

    `web/views/customer.py`

    ```python
    class CustomerModelForm(BootStrapForm, forms.ModelForm):
        exclude_filed_list = ['level'] # 
        password = forms.CharField(label="密码", widget=forms.PasswordInput)
        confirm_password = forms.CharField(label="确认密码", widget=forms.PasswordInput)
        class Meta:
            model = models.Customer
            fields = ["username", "password", "mobile", "confirm_password", "level"]
            widgets = {
                "level": forms.RadioSelect(attrs={'class': "form-radio"}) # 
            }
    ```

    `web/static/css/commons.css`

    ```css
    /* 自定义 form-radio 样式 */
    .form-radio {
        padding-left: 0;
        list-style-type: none;
    }

    .form-radio div {
        display: inline-block;
        padding-right: 20px;
        padding-top: 7px;
    }

    .form-radio div label {
        font-weight: normal;
        font-size: 13px;
    }
    ```
  - 手机号格式验证

    ```python
    # web/views/customer.py
    class CustomerModelForm(BootStrapForm, forms.ModelForm):
    	# v1：正则 validators
        mobile = forms.CharField(label="手机号", validators=[RegexValidator(r'^1[3-9]\d{9}$', "手机号格式错误")])
    	# v2：自定义钩子
        def clean_mobile(self):
            mobile = self.cleaned_data["mobile"]
            if not re.match("^1[3-9]\d{9}$", mobile):
                raise forms.ValidationError("手机号格式错误")
            return mobile

    # models.py
    # v3：
    class Customer(ActiveBaseModel):
        mobile = models.CharField(verbose_name="手机号", max_length=11, db_index=True,
                                  validators=[RegexValidator(r'^1[3-9]\d{9}$', "手机号格式错误")])
    ```
  - 密码一致性验证

    ```python
    def clean_confirm_password(self):
        password = self.cleaned_data.get("password")
        confirm_password = self.cleaned_data.get("confirm_password")
        if password != confirm_password:
            raise ValidationError("密码不一致")
        return confirm_password
    ```
  - 密码加密传入数据库

    ```python
    from utils.encrypt import md5
    # v1：
    def customer_add(request):
        form.instance.password = md5(pwd)
        form.instance.creator_id = request.nb_user.id
    # v2：
    class CustomerModelForm(BootStrapForm, forms.ModelForm):
        def clean_password(self): # 
            password = self.cleaned_data["password"]
            return md5(password)
    	def clean_confirm_password(self):
            password = self.cleaned_data.get("password")
            confirm_password = md5(self.cleaned_data.get("confirm_password")) #
            if password != confirm_password:
                raise ValidationError("密码不一致")
            return confirm_password
    ```
  - 提交保存，跳转回页面

    `web/views/customer.py`

    ```python
    def customer_add(request):
        if request.method == "GET":
            form = CustomerModelForm()
            return render(request, "form2.html", {"form": form})
        form = CustomerModelForm(data=request.POST)
        if not form.is_valid():
            return render(request, "form2.html", {"form": form})
        form.instance.creator_id = request.nb_user.id
        form.save()
        return redirect("/customer/list/")
    ```
- 编辑客户（部分信息）

  不希望所有都能进行编辑，故单独再创建一个ModelForm

  - `urls & settings`

    ```python
    urlpatterns = [
        path('customer/list/',customer.customer_list, name='customer_list'),
        path('customer/add/',customer.customer_add, name='customer_add'),
        path('customer/edit/<int:pk>/',customer.customer_edit, name='customer_edit'),
    ]

    NB_PERMISSION = {
        "ADMIN": {
            "customer_list": {"text": "客户管理", "parent": None},
            "customer_add": {"text": "新建客户", "parent": "customer_list"},
            "customer_edit": {"text": "编辑客户", "parent": "customer_list"},
        },
    }
    ```
  - `web/views/customer.py`

    ```python
    class CustomerEditModelForm(BootStrapForm, forms.ModelForm):
        class Meta:
            model = models.Customer
            fields = ["username", "mobile", "level"]

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields["level"].queryset = models.Level.objects.filter(active=1)

    def customer_edit(request, pk):
        instance = models.Customer.objects.filter(id=pk, active=1).first()
        if request.method == "GET":
            form = CustomerEditModelForm(instance=instance)
            return render(request, "form2.html", {"form": form})
        form = CustomerEditModelForm(data=request.POST, instance=instance)
        if not form.is_valid():
            return render(request, "form2.html", {"form": form})
        form.save()
        return redirect("/customer/list/")
    ```
  - `web/templates/customer_list.html`

    ```html
    <a href="{% url "customer_edit" pk=row.id %}" class="btn btn-primary btn-xs">编辑</a>
    ```
- 重置密码

  - `urls & settings`

    ```python
    urlpatterns = [
        path('customer/list/',customer.customer_list, name='customer_list'),
        path('customer/add/',customer.customer_add, name='customer_add'),
        path('customer/edit/<int:pk>/', customer.customer_edit, name='customer_edit'),
        path('customer/reset/<int:pk>/', customer.customer_reset_password, name='customer_reset_password'),
    ]

    NB_PERMISSION = {
        "ADMIN": {
            "customer_list": {"text": "客户管理", "parent": None},
            "customer_add": {"text": "新建客户", "parent": "customer_list"},
            "customer_edit": {"text": "编辑客户", "parent": "customer_list"},
            "customer_reset_password": {"text": "重置密码", "parent": "customer_list"},
        },
    }
    ```
  - `web/templates/customer_list.html`

    ```html
    <td>
        <a href="{% url "customer_reset_password" pk=row.id %}" class="btn btn-primary btn-xs">重置密码</a>
    </td>
    ```
  - `web/views/customer.py`

    ```python
    class CustomerResetModelForm(BootStrapForm, forms.ModelForm):
        password = forms.CharField(label="密码", widget=forms.PasswordInput(render_value=True))
        confirm_password = forms.CharField(label="确认密码", widget=forms.PasswordInput(render_value=True))

        class Meta:
            model = models.Customer
            fields = ["password", "confirm_password"]

        def clean_password(self):
            password = self.cleaned_data["password"]
            return md5(password)

        def clean_confirm_password(self):
            password = self.cleaned_data.get("password")
            confirm_password = md5(self.cleaned_data.get("confirm_password"))
            if password != confirm_password:
                raise ValidationError("密码不一致")
            return confirm_password

    def customer_reset_password(request, pk):
        if request.method == "GET":
            form = CustomerResetModelForm()
            return render(request, "form2.html", {"form": form})
        instance =  models.Customer.objects.filter(id=pk, active=1).first()
        form = CustomerResetModelForm(data=request.POST, instance=instance)
        if not form.is_valid():
            return render(request, "form2.html", {"form": form})
        form.save()
        return redirect("/customer/list/")
    ```
- 删除客户（对话框和Ajax）

  - `urls & settings`

    ```python
    urlpatterns = [
        path('customer/list/',customer.customer_list, name='customer_list'),
        path('customer/add/',customer.customer_add, name='customer_add'),
        path('customer/edit/<int:pk>/', customer.customer_edit, name='customer_edit'),
        path('customer/reset/<int:pk>/', customer.customer_reset_password, name='customer_reset_password'),
    	path('customer/delete/', customer.customer_delete, name='customer_delete'),
    ]

    NB_PERMISSION = {
        "ADMIN": {
            "customer_list": {"text": "客户管理", "parent": None},
            "customer_add": {"text": "新建客户", "parent": "customer_list"},
            "customer_edit": {"text": "编辑客户", "parent": "customer_list"},
            "customer_reset_password": {"text": "重置密码", "parent": "customer_list"},
    		"customer_delete": {"text": "删除客户", "parent": "customer_list"},
        },
    }
    ```
  - `web/templates/layout.html` 继承模板

    ```html
    {% load static %}
    {% load menu %}
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <link rel="stylesheet" href="{% static 'plugins/bootstrap/css/bootstrap.css' %}">
        <link rel="stylesheet" href="{% static 'plugins/font-awesome/css/font-awesome.min.css' %}">
        <link rel="stylesheet" href="{% static 'css/commons.css' %}">
        <link rel="stylesheet" href="{% static 'css/menu.css' %}">
        <link rel="stylesheet" href="{% static 'css/nav.css' %}">
        {% block css %}{% endblock %}<!-- 引入 css -->
    </head>
    <body>
    <script src="{% static 'js/jquery-3.6.0.min.js' %}"></script>
    <script src="{% static 'plugins/bootstrap/js/bootstrap.min.js' %}"></script>
    <script src="{% static 'js/menu.js' %}"></script>
    {% block js %}{% endblock %}<!-- 引入 js -->
    </body>
    </html>
    ```
  - `web/templates/customer_list.html`

    ```html
    {% extends "layout.html" %}

    {% block content %}
        <div style="margin-bottom: 5px">
            <a href="{% url 'customer_add' %}" class="btn btn-success">
                 新建
            </a>
        </div>
        <table class="table table-bordered">
            <tbody>
            {% for row in queryset %}
                <tr row-id="{{ row.id }}">
                    <td>
                        <a href="{% url "customer_reset_password" pk=row.id %}" class="btn btn-primary btn-xs">重置密码</a>
                    </td>
                    <td>
                        <a href="{% url "customer_edit" pk=row.id %}" class="btn btn-primary btn-xs">编辑</a>
                        <a delete_id="{{ row.id }}" href="#" class="btn btn-danger btn-xs btn-delete">删除</a>
                    </td>
                </tr>
            {% endfor %}
            </tbody>
        </table>

        <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="alert alert-danger alert-dismissible fade in" role="alert">
                <h4>是否确定要删除？</h4>
                <p>
                    <button type="button" class="btn btn-danger" id="btnConfirmDelete">确 定</button>
                    <button type="button" class="btn btn-default" id="btnCancelDelete">取 消</button>
                    
                </p>
            </div>
        </div>

    </div>
    {% endblock %}
    {% block js %}
        <script>
            $(function () {
                bindDeleteEvent()
                btnConfirmDeleteEvent()
            });
            function bindDeleteEvent() {
                $(".btn-delete").click(function () {
                    $("#deleteError").empty();
                    $("#deleteModal").modal("show");
                    var deleteId = $(this).attr("delete_id");
                    DELETE_ID = deleteId;
                });
                $("#btnCancelDelete").click(function () {
                    $("#deleteModal").modal("hide");
                });
            }
            function btnConfirmDeleteEvent() {
                $("#btnConfirmDelete").click(function () {
                    // console.log("确认删除", DELETE_ID);
                    // Ajax 发送请求
                    $.ajax({
                        url: "{% url "customer_delete" %}",
                        type: "GET",
                        data: {delete_id: DELETE_ID},
                        success: function (res) {
                            if(res.status){
                                // 删除成功
                                // 方式一: 刷新页面
                                // window.location.reload();
                                // 方式二: 在当前页面中删除
                                $("tr[row-id='" + DELETE_ID + "']").remove();
                                $("#deleteModal").modal("hide");
                            }
                            else{
                                // 删除失败，显示错误信息
                                $("#deleteError").text(res.detail);
                            }
                        },
                    })
                })
            }
        </script>
    {% endblock %}
    ```
  - `web/views/customer.py`

    ```python
    from django.http import JsonResponse
    from utils.reponse import BaseResponse

    def customer_delete(request):
        delete_id = request.GET.get("delete_id")
        if not delete_id:
            res = BaseResponse(status=False, detail="无效的删除ID")
            return JsonResponse(res.dict)
        exists = models.Customer.objects.filter(id=delete_id, active=1).exists()
        if not exists:
            res = BaseResponse(status=False, detail="要删除的数据不存在")
            return JsonResponse(res.dict)
        models.Customer.objects.filter(id=delete_id, active=1).update(active=0)
        res = BaseResponse(status=True)
        return JsonResponse(res.dict)
    ```
  - `utils/reponse.py`

    ```python
    class BaseResponse(object):
        def __init__(self, status=False, detail=None, data=None):
            self.status = status
            self.detail = detail
            self.data = data

        @property
        def dict(self):
            return self.__dict__

    class UserResponse(BaseResponse):
        def __init__(self):
            super(UserResponse, self).__init__() # 继承
            self.xxx = None
    ```

  判断 Form 和 Ajax 请求

  - `utils/md.py`

    ```python
        def process_view(self, request, callback, callback_args, callback_kwargs):
            """ 校验用户权限 """
            if self.is_white_url(request):
                return

            current_name = request.resolver_match.url_name
            # 0. 是否是公共权限
            if current_name in settings.NB_PERMISSION_PUBLIC:
                return
            # 1. 根据用户角色获取相应的权限
            user_permission_dict = settings.NB_PERMISSION[request.nb_user.role]
            # 2. 获取当前访问的URL
            current_name = request.resolver_match.url_name
            # 3. 判断当前URL是否在权限列表中
            if current_name not in user_permission_dict:
    			""" 判断 """
                if request.is_ajax():
                    return JsonResponse({'status': False, 'detail': '无权访问'})
                else:
                    return render(request, 'permission.html')
    ```
- 分页

  - 分页 & 页码显示

    - `web/views/customer.py`

      ```python
      def customer_list(request):
          # 1. 获取客户列表 # queryset = [obj1, obj2, obj3]
          # 1.1 客户可以被删除（逻辑删除） -> active=1
          # 1.2 级别被删除了，下属有客户，怎么办？ 【逻辑删除】
          #       - 修改级别删除的逻辑，查询是否有关联数据，有关联数据，则不允许删除 （*）
          #       - 将下属客户设置默认值，例如: None
          #       - 不做任何行为，后续客户查询则需 -> level__active=1
          # selected_related("level", "creator") 主动跨表查询
          page = int(request.GET.get("page"))
          per_page_count = 20
          start = (page - 1) * per_page_count
          end = page * per_page_count
          queryset = models.Customer.objects.filter(active=1).select_related("level", "creator") # 获取所有客户
          total_count = queryset.count() # 总数据量
          total_page, div = divmod(total_count, per_page_count) # 计算总页数
          if div:
              total_page += 1
          page_list = []
          start_page, end_page = 1, total_page + 1
          for i in range(start_page, end_page):
              item = '<li><a href="?page={}">{}</a></li>'.format(i, i)
              page_list.append(item)
          pager_string = mark_safe("".join(page_list))
          context = {"queryset": queryset[start:end], "pager_string": pager_string}
          return render(request, "customer_list.html", context)
      ```
    - `web/templates/customer_list.html`

      ```html
      <ul class="pagination">
          {{ pager_string }}
      </ul>
      ```
  - 动态页码

    `web/views/customer.py`

    ```python
    def customer_list(request):
        page = int(request.GET.get("page"))
        per_page_count = 20
        start = (page - 1) * per_page_count
        end = page * per_page_count
        queryset = models.Customer.objects.filter(active=1).select_related("level", "creator") # 获取所有客户
        total_count = queryset.count() # 总数据量
        # 计算总页数
        total_page, div = divmod(total_count, per_page_count)
        if div:
            total_page += 1
        page_list = []

        if total_page <= 9:
            # 总页码数小于 10 时:
            start_page = 1
            end_page = total_page
        else:
            # 总页码数大于 10 时:
            if page <= 5:
                # 当前页数小于 5 时:
                start_page = 1
                end_page = 9
            else:
                start_page = page - 4
                end_page = page + 4
                if (page + 5) > total_page:
                    start_page = total_page - 8
                    end_page = total_page

        for i in range(start_page, end_page + 1):
            if i == page:
                item = '<li class="active"><a href="?page={}">{}</a></li>'.format(i, i)
            else:
                item = '<li><a href="?page={}">{}</a></li>'.format(i, i)
            page_list.append(item)
        pager_string = mark_safe("".join(page_list))
        context = {"queryset": queryset[start:end], "pager_string": pager_string}
        return render(request, "customer_list.html", context)
    ```
  - 封装

    - `utils/page.py`

      ```python
      """
      如果想要以后使用分页，需要以下两个步骤：
      在视图函数：
          def customer_list(request):
              # 所有数据
              queryset = models.Customer.objects.filter(active=1).select_related('level')

              pager = Pagination(request, queryset)
              context = {
                  "queryset": queryset[pager.start:pager.end],
                  "pager_string": obj.html()
              }
              return render(request, 'customer_list.html', context)

      在页面上：
          {% for row in queryset %}
              {{row.id}}
          {% endfor %}

          <ul class="pagination">
              {{ pager_string }}
          </ul>
      """
      from django.utils.safestring import mark_safe

      class Pagination(object):
          """ 分页 """

          def __init__(self, request, queryset, per_page_count=15):
              total_count = queryset.count()  # 总数据量
              self.total_count = total_count
              # 计算总页数
              self.total_page, div = divmod(total_count, per_page_count)
              if div:
                  self.total_page += 1
              page = request.GET.get('page')
              print("page:", page)
              if not page:
                  page = 1
              else:
                  if not page.isdecimal():
                      page = 1
                  else:
                      page = int(page)
                      if page > self.total_page:
                          page = self.total_page
                      if page <= 0:
                          page = 1

              self.page = page
              self.per_page_count = per_page_count
              self.start = (page - 1) * per_page_count
              self.end = page * per_page_count

          def page_html(self):
              page_list = []
              if self.total_page <= 9:
                  # 总页码数小于 10 时:
                  start_page = 1
                  end_page = self.total_page
              else:
                  # 总页码数大于 10 时:
                  if self.page <= 5:
                      # 当前页数小于 5 时:
                      start_page = 1
                      end_page = 9
                  else:
                      start_page = self.page - 4
                      end_page = self.page + 4
                      if (self.page + 5) > self.total_page:
                          start_page = self.total_page - 8
                          end_page = self.total_page

              for i in range(start_page, end_page + 1):
                  if i == self.page:
                      item = '<li class="active"><a href="?page={}">{}</a></li>'.format(i, i)
                  else:
                      item = '<li><a href="?page={}">{}</a></li>'.format(i, i)
                  page_list.append(item)
              pager_string = mark_safe("".join(page_list))
              return pager_string
      ```
    - `web/views/customer.py`

      ```python
      from django.shortcuts import render
      from web import models
      from utils.page import Pagination

      def customer_list(request):
          queryset = models.Customer.objects.filter(active=1).select_related("level", "creator") # 获取所有客户
          obj = Pagination(request, queryset)
          context = {
              "queryset": queryset[obj.start:obj.end],
              "pager_string": obj.page_html()
          }
          return render(request, "customer_list.html", context)
      ```
  - 优化

    ```python
    page_list.append('<li><a href="?page=1">首页</a></li>')
    if self.page > 1:
        page_list.append('<li><a href="?page={}">上一页</a></li>'.format(self.page - 1))
    for i in range(start_page, end_page + 1):
        if i == self.page:
            item = '<li class="active"><a href="?page={}">{}</a></li>'.format(i, i)
        else:
            item = '<li><a href="?page={}">{}</a></li>'.format(i, i)
        page_list.append(item)
    if self.page < self.total_page:
        page_list.append('<li><a href="?page={}">下一页</a></li>'.format(self.page + 1))
    page_list.append('<li><a href="?page={}">尾页</a></li>'.format(self.total_page))
    page_list.append('<li class="disabled"><a>{}页，共{}条数据</a></li>'.format(self.total_page, self.total_count))
    pager_string = mark_safe("".join(page_list))
    ```
  - QueryDict类型 和 保留原参数

    ```python
    # 知识点
    http://localhost:8000/customer/list/?filter=yuyu&age=20

    request.GET 对象		--> QueryDict 类型

    1. 默认QueryDict 不允许被修改		_mutable = False
    					request.GET._mutable = True  # 允许被修改
    2. 设置值
    	request.GET.setlist("name",[123]) # filter=yuyu&age=20&name=123
    	request.GET.setlist("name",[123,4]) # filter=yuyu&age=20&name=123&name=4

    3. 调用 urlencode 方法，可以拼接
    	paramString = request.GET.urlencode()
    	print(paramString) # filter=yuyu&age=20&name=123&name=4
    ```

    ```python
    import copy
    query_dict = copy.deepcopy(request.GET)
    query_dict._mutable = True
    query_dict.setlist("page",[1])
    paramString = query_dict.urlencode() # filter=yuyu&age=20&page=1
    ```

    `utils/page.py`

    ```python
    import copy
    from django.utils.safestring import mark_safe

    class Pagination(object):
        def __init__(self, request, queryset, per_page_count=15):
    		""" 更新 """
            self.query_dict = copy.deepcopy(request.GET)
            self.query_dict._mutable = True

            total_count = queryset.count()  # 总数据量
            self.total_count = total_count
            # 计算总页数
            self.total_page, div = divmod(total_count, per_page_count)
            if div:
                self.total_page += 1
            page = request.GET.get('page')
            print("page:", page)
            if not page:
                page = 1
            else:
                if not page.isdecimal():
                    page = 1
                else:
                    page = int(page)
                    if page > self.total_page:
                        page = self.total_page
                    if page <= 0:
                        page = 1

            self.page = page
            self.per_page_count = per_page_count
            self.start = (page - 1) * per_page_count
            self.end = page * per_page_count

        def page_html(self):
            pager_list = []
            if self.total_page <= 9:
                # 总页码数小于 10 时:
                start_page = 1
                end_page = self.total_page
            else:
                # 总页码数大于 10 时:
                if self.page <= 5:
                    # 当前页数小于 5 时:
                    start_page = 1
                    end_page = 9
                else:
                    start_page = self.page - 4
                    end_page = self.page + 4
                    if (self.page + 5) > self.total_page:
                        start_page = self.total_page - 8
                        end_page = self.total_page
    		""" 更新 """
            self.query_dict.setlist('page', [1])
            pager_list.append('<li><a href="?{}">首页</a></li>'.format(self.query_dict.urlencode()))
            if self.page > 1:
                self.query_dict.setlist('page', [self.page - 1])
                pager_list.append('<li><a href="?{}">上一页</a></li>'.format(self.query_dict.urlencode()))
            for i in range(start_page, end_page + 1):
                self.query_dict.setlist('page', [i])
                if i == self.page:
                    item = '<li class="active"><a href="?{}">{}</a></li>'.format(self.query_dict.urlencode(), i)
                else:
                    item = '<li><a href="?{}">{}</a></li>'.format(self.query_dict.urlencode(), i)
                pager_list.append(item)
            if self.page < self.total_page:
                self.query_dict.setlist('page', [self.page + 1])
                pager_list.append('<li><a href="?{}">下一页</a></li>'.format(self.query_dict.urlencode()))

            self.query_dict.setlist('page', [self.total_page])
            pager_list.append('<li><a href="?{}">尾页</a></li>'.format(self.query_dict.urlencode()))

            pager_list.append('<li class="disabled"><a>{}页，共{}条数据</a></li>'.format(self.total_page, self.total_count))
            pager_string = mark_safe("".join(pager_list))
            return pager_string
    ```
- Q对象搜索

  ```python
  # 方式一
  models.XX.objects.filter(Q(id=1))
  models.XX.objects.filter(Q(id=1)&Q(age=20))
  models.XX.objects.filter(Q(id=1)|Q(age=20))
  models.XX.objects.filter(Q(id__gt=1)|Q(age__lte=20))
  models.XX.objects.filter(Q(Q(id__gt=1)|Q(age__lte=20)) & Q(name=n))

  # 方式二
  q1 = Q()
  q1.connector = 'OR'
  q1.children.append(('id', 1))
  q1.children.append(('age', 10)) # id=1 or age=10

  q2 = Q()
  q2.connector = 'AND'
  q2.children.append(('size__gt', 10))
  q2.children.append(('name', 'n')) # size>10 and name=n

  con = Q()
  con.add(q1, 'AND')
  con.add(q2, 'AND') # (id=1 or age=10) AND (size>10 and name=n)
  ```

  `web/views/customer.py`

  ```python
  from django.db.models import Q
  def customer_list(request):
      keyword = request.GET.get("keyword", "").strip()
      con = Q()
      if keyword:
          con.connector = 'OR'
          con.children.append(('username__contains', keyword))
          con.children.append(('mobile__contains', keyword))
          con.children.append(('level__title__contains', keyword))
      queryset = models.Customer.objects.filter(con).filter(active=1).select_related("level", "creator") # 获取所有客户
      obj = Pagination(request, queryset)
      context = {
          "queryset": queryset[obj.start:obj.end],
          "pager_string": obj.page_html(),
          "keyword": keyword
      }
      return render(request, "customer_list.html", context)
  ```

  `web/templates/customer_list.html`

  ```python
  <div class="right">
      <form class="form-inline" method="get">
          <div class="form-group">
              <input name="keyword" type="text" class="form-control" placeholder="请输入关键字" value="{{ keyword }}">
          </div>
          <button type="submit" class="btn btn-default">
              
          </button>
      </form>
  </div>
  ```

### 8 价格策略管理

- `urls & settings`

  ```python
  from django.urls import path
  from web.views import policy

  urlpatterns = [
      path('policy/list/', policy.policy_list, name='policy_list'),
      path('policy/add/', policy.policy_add, name='policy_add'),
      path('policy/edit/<int:pk>/', policy.policy_edit, name='policy_edit'),
      path('policy/delete/', policy.policy_delete, name='policy_delete'),
  ]

  # 角色权限
  NB_PERMISSION = {
      "ADMIN": {
          "policy_list": {"text": "价格策略", "parent": None},
          "policy_add": {"text": "新建价格策略", "parent": "policy_list"},
          "policy_edit": {"text": "编辑价格策略", "parent": "policy_list"},
          "policy_delete": {"text": "删除价格策略", "parent": "policy_list"},
      },
  }
  ```
- `web/views/policy.py`

  ```python
  from django.shortcuts import render, redirect
  from web import models
  from utils.pager import Pagination
  from django import forms
  from utils.bootstrap import BootStrapForm
  from utils.reponse import BaseResponse
  from django.http import JsonResponse

  def policy_list(request):
      queryset = models.PricePolicy.objects.all().order_by('count')
      pager = Pagination(request, queryset)
      return render(request, 'policy_list.html', {'pager': pager})

  class PolicyModelForm(BootStrapForm, forms.ModelForm):
      class Meta:
          model = models.PricePolicy
          fields = "__all__"

  def policy_add(request):
      if request.method == 'GET':
          form = PolicyModelForm()
          return render(request, 'form2.html', {"form": form})
      form = PolicyModelForm(data=request.POST)
      if not form.is_valid():
          return render(request, 'form2.html', {"form": form})
      form.save()
      return redirect('/policy/list/')

  def policy_edit(request, pk):
      instance = models.PricePolicy.objects.filter(id=pk).first()
      if request.method == 'GET':
          form = PolicyModelForm(instance=instance)
          return render(request, 'form2.html', {"form": form})
      form = PolicyModelForm(data=request.POST, instance=instance)
      if not form.is_valid():
          return render(request, "form2.html", {"form": form})
      form.save()
      return redirect('/policy/list/')

  def policy_delete(request):
      res = BaseResponse(status=True)
      delete_id = request.GET.get("delete_id")
      models.PricePolicy.objects.filter(id=delete_id).delete()
      return JsonResponse(res.dict)
  ```
- `utils/pager.py`

  ```python
  import copy
  from django.utils.safestring import mark_safe

  class Pagination(object):
      """ 分页 """

      def __init__(self, request, query_set, per_page_count=15):
          self.query_dict = copy.deepcopy(request.GET)
          self.query_dict._mutable = True
          self.query_set = query_set
          total_count = query_set.count()  # 总数据量
          self.total_count = total_count
          # 计算总页数
          self.total_page, div = divmod(total_count, per_page_count)
          if div:
              self.total_page += 1
          page = request.GET.get('page')
          print("page:", page)
          if not page:
              page = 1
          else:
              if not page.isdecimal():
                  page = 1
              else:
                  page = int(page)
                  if page > self.total_page:
                      page = self.total_page
                  if page <= 0:
                      page = 1

          self.page = page
          self.per_page_count = per_page_count
          self.start = (page - 1) * per_page_count
          self.end = page * per_page_count

      def page_html(self):
          pager_list = []

          if self.total_page <= 9:
              # 总页码数小于 10 时:
              start_page = 1
              end_page = self.total_page
          else:
              # 总页码数大于 10 时:
              if self.page <= 5:
                  # 当前页数小于 5 时:
                  start_page = 1
                  end_page = 9
              else:
                  start_page = self.page - 4
                  end_page = self.page + 4
                  if (self.page + 5) > self.total_page:
                      start_page = self.total_page - 8
                      end_page = self.total_page

          self.query_dict.setlist('page', [1])
          pager_list.append('<li><a href="?{}">首页</a></li>'.format(self.query_dict.urlencode()))
          if self.page > 1:
              self.query_dict.setlist('page', [self.page - 1])
              pager_list.append('<li><a href="?{}">上一页</a></li>'.format(self.query_dict.urlencode()))
          for i in range(start_page, end_page + 1):
              self.query_dict.setlist('page', [i])
              if i == self.page:
                  item = '<li class="active"><a href="?{}">{}</a></li>'.format(self.query_dict.urlencode(), i)
              else:
                  item = '<li><a href="?{}">{}</a></li>'.format(self.query_dict.urlencode(), i)
              pager_list.append(item)
          if self.page < self.total_page:
              self.query_dict.setlist('page', [self.page + 1])
              pager_list.append('<li><a href="?{}">下一页</a></li>'.format(self.query_dict.urlencode()))

          self.query_dict.setlist('page', [self.total_page])
          pager_list.append('<li><a href="?{}">尾页</a></li>'.format(self.query_dict.urlencode()))
          pager_list.append('<li class="disabled"><a>{}页，共{}条数据</a></li>'.format(self.total_page, self.total_count))

          if not self.total_page or self.total_page == 1:
              # 没有数据 或 只有 1 页 时：
              pager_list=['<li class="disabled"><a>共{}条数据</a></li>'.format(self.total_count)]

          pager_string = mark_safe("".join(pager_list))
          return pager_string

      def queryset(self):
          if not self.total_count:
              return self.query_set
          return self.query_set[self.start:self.end]

  ```
- `web/templates/policy_list.html`

  ```html
  {% extends "layout.html" %}
  {% load static %}

  {% block content %}
      <div style="margin-bottom: 5px">
          <a href="{% url 'policy_add' %}" class="btn btn-success">
               新建
          </a>
          <div class="right">
              <form class="form-inline" method="get">
                  <div class="form-group">
                      <input name="keyword" type="text" class="form-control" placeholder="请输入关键字" value="{{ keyword }}">
                  </div>
                  <button type="submit" class="btn btn-default">
                      
                  </button>
              </form>
          </div>
      </div>
      <table class="table table-bordered">
          <thead>
          <tr>
              <th>ID</th>
              <th>数量</th>
              <th>价格</th>
              <th>操作</th>
          </tr>
          </thead>
          <tbody>
          {% for row in pager.queryset %}
              <tr row-id="{{ row.id }}">
                  <td>{{ row.id }}</td>
                  <td>{{ row.count }}</td>
                  <td>{{ row.price }}</td>
                  <td>
                      <a href="{% url "policy_edit" pk=row.id %}" class="btn btn-primary btn-xs">编辑</a>
                      <a delete_id="{{ row.id }}" href="#" class="btn btn-danger btn-xs btn-delete">删除</a>
                  </td>
              </tr>
          {% endfor %}
          </tbody>
      </table>
      <div class="right">
          <ul class="pagination">
              {{ pager.page_html }}
          </ul>
      </div>

      {% include 'include/delete_modal.html' %}

  {% endblock %}
  {% block js %}
      <script src="{% static 'js/delete_modal.js' %}"></script>
      <script>
          var DELETE_ID;
          var DELETE_URL = "{% url "policy_delete" %}";
      </script>
  {% endblock %}
  ```
- `web/templates/include/delete_modal.html`

  ```html
  <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
          <div class="alert alert-danger alert-dismissible fade in" role="alert">
              <h4>是否确定要删除？</h4>
              <p>
                  <button type="button" class="btn btn-danger" id="btnConfirmDelete">确 定</button>
                  <button type="button" class="btn btn-default" id="btnCancelDelete">取 消</button>
                  
              </p>
          </div>
      </div>
  </div>
  ```
- `web/static/js/delete_modal.js`

  ```javascript
  $(function () {
      bindDeleteEvent()
      btnConfirmDeleteEvent()
  });
  function bindDeleteEvent() {
      $(".btn-delete").click(function () {
          $("#deleteError").empty();
          $("#deleteModal").modal("show");
          var deleteId = $(this).attr("delete_id");
          DELETE_ID = deleteId;
      });
      $("#btnCancelDelete").click(function () {
          $("#deleteModal").modal("hide");
      });
  }
  function btnConfirmDeleteEvent() {
      $("#btnConfirmDelete").click(function () {
          // Ajax 发送请求
          $.ajax({
              url: DELETE_URL,
              type: "GET",
              data: {delete_id: DELETE_ID},
              success: function (res) {
                  if(res.status){
                      // 删除成功
                      // 方式一: 刷新页面
                      // window.location.reload();
                      // 方式二: 在当前页面中删除
                      $("tr[row-id='" + DELETE_ID + "']").remove();
                      $("#deleteModal").modal("hide");
                  }
                  else{
                      // 删除失败，显示错误信息
                      $("#deleteError").text(res.detail);
                  }
              },
          })
      })
  }
  ```

### 9 权限-按钮

- 在模板中自定义方法：

  - `filter`

    ```
    "xxxx"|upper
    ```
  - `sample_tag`

    ```
    {% xxxx x1 x2 x3 %}
    ```

    ```
    def xxx():
    	return ""
    ```
  - `inlusion_tag`

    ```python
    def xxx():
    	return {'v1':xx,'v2':xx}
    ```

    ```html
    <h1>{{ v1 }}</h1>
    ```

- 权限控制

  - 示例：

    ```python
    from django.template import Library
    from django.conf import settings
    from django.urls import reverse
    from django.utils.safestring import mark_safe

    register = Library()

    @register.simple_tag
    def permission(request, name, *args, **kwargs):
        # 1. 读取当前用户的 角色信息
        role = request.nb_user.role
        # 2. 根据角色获取其所有的权限字典
        permission_dict = settings.NB_PERMISSION[role]
        # 3. 判断是否有权限 name -> "customer_add"
        # 4. 无权限，返回 空
        if name not in permission_dict:
            return ""
        # 5. 有权限，通过 name 反向生成 url
        url = reverse(name, args=args, kwargs=kwargs)
        tpl = """
        <a href="{}" class="btn btn-success">
                 新建
        </a>
        """.format(url)
        return mark_safe(tpl)
    ```

    ```html
    {% extends "layout.html" %}
    {% load permission %}

    {% block content %}
        {% permission 'customer_add' as url %}
        ...
    {% endblock %}
    ```
  - 新建、编辑、删除 客户权限（不显示）

    ```python
    from django.template import Library
    from django.conf import settings
    from django.urls import reverse
    from django.utils.safestring import mark_safe

    register = Library()

    def check_permission(request, name):
        # 1. 读取当前用户的 角色信息
        role = request.nb_user.role
        # 2. 根据角色获取其所有的权限字典
        permission_dict = settings.NB_PERMISSION[role]
        # 3. 判断是否在权限字典中
        if name in permission_dict:
            return True
    	if name in settings.NB_PERMISSION_PUBLIC: # 公共权限
            return True

    @register.simple_tag
    def add_permission(request, name, *args, **kwargs):
        # 4. 无权限，返回 空
        if not check_permission(request, name):
            return ""
        # 5. 有权限，通过 name 反向生成 url
        url = reverse(name, args=args, kwargs=kwargs)
        tpl = """
        <a href="{}" class="btn btn-success">
                 新建
        </a>
        """.format(url)
        return mark_safe(tpl)

    @register.simple_tag
    def edit_permission(request, name, *args, **kwargs):
        # 4. 无权限，返回 空
        if not check_permission(request, name):
            return ""

        # 5. 有权限，通过 name 反向生成 url
        url = reverse(name, args=args, kwargs=kwargs)
        tpl = """
        <a href="{}" class="btn btn-primary btn-xs">编辑</a>
        """.format(url)
        return mark_safe(tpl)

    @register.simple_tag
    def delete_permission(request, name, *args, **kwargs):
        # 4. 无权限，返回 空
        if not check_permission(request, name):
            return ""
        # 5. 有权限，通过 name 反向生成 url
        pk = kwargs.get('pk')
        tpl = """
        <a delete_id="{}" class="btn btn-danger btn-xs btn-delete">删除</a>
        """.format(pk)
        return mark_safe(tpl)
    ```

    ```html
    {% extends "layout.html" %}
    {% load static %}
    {% load permission %}

    {% block content %}
        <div style="margin-bottom: 5px">
            {% add_permission request 'customer_add' %}
    		...
        </div>
        <table class="table table-bordered">
            ...
            <tbody>
            {% for row in queryset %}
                <tr row-id="{{ row.id }}">
                    ...
                    <td>
                        <a href="{% url "customer_reset_password" pk=row.id %}" class="btn btn-primary btn-xs">重置密码</a>
                    </td>
                    <td>
                        {% edit_permission request 'customer_edit' pk=row.id %}
                        {% delete_permission request 'customer_delete' pk=row.id %}
                    </td>
                </tr>
            {% endfor %}
            </tbody>
        </table>
    	...
    </div>
    {% endblock %}
    {% block js %}
    	...
    {% endblock %}
    ```

- 权限应用（无权限不显示对应列表）

  ```python
  from django.template import Library
  from django.conf import settings
  from django.urls import reverse
  from django.utils.safestring import mark_safe

  register = Library()

  def check_permission(request, name):
      # 1. 读取当前用户的 角色信息
      role = request.nb_user.role
      # 2. 根据角色获取其所有的权限字典
      permission_dict = settings.NB_PERMISSION[role]
      # 3. 判断是否在权限字典中
      if name in permission_dict:
          return True
      if name in settings.NB_PERMISSION_PUBLIC: # 公共权限
          return True

  @register.simple_tag
  def add_permission(request, name, *args, **kwargs):
      # 4. 无权限，返回 空
      if not check_permission(request, name):
          return ""

      # 5. 有权限，通过 name 反向生成 url
      url = reverse(name, args=args, kwargs=kwargs)
      tpl = """
      <a href="{}" class="btn btn-success">
               新建
      </a>
      """.format(url)
      return mark_safe(tpl)

  @register.simple_tag
  def edit_permission(request, name, *args, **kwargs):
      # 4. 无权限，返回 空
      if not check_permission(request, name):
          return ""

      # 5. 有权限，通过 name 反向生成 url
      url = reverse(name, args=args, kwargs=kwargs)
      tpl = """
      <a href="{}" class="btn btn-primary btn-xs">编辑</a>
      """.format(url)
      return mark_safe(tpl)

  @register.simple_tag
  def delete_permission(request, name, *args, **kwargs):
      # 4. 无权限，返回 空
      if not check_permission(request, name):
          return ""

      # 5. 有权限，通过 name 反向生成 url
      pk = kwargs.get('pk')
      tpl = """
      <a delete_id="{}" class="btn btn-danger btn-xs btn-delete">删除</a>
      """.format(pk) # 通过 Ajax 删除
      return mark_safe(tpl)

  @register.simple_tag
  def delete_url_permission(request, name, *args, **kwargs):
      # 4. 无权限，返回 空
      if not check_permission(request, name):
          return ""

      # 5. 有权限，通过 name 反向生成 url
      url = reverse(name, args=args, kwargs=kwargs)
      tpl = """
      <a href="{}" class="btn btn-danger btn-xs btn-delete">删除</a>
      """.format(url) # 通过 url 删除
      return mark_safe(tpl)

  @register.filter
  def has_permission(request, others):
      name_list = others.split(',')
      for name in name_list:
          status = check_permission(request, name)
          if status:
              return True
      return False

  ```

  ```html
  {% extends "layout.html" %}
  {% load static %}
  {% load permission %}

  {% block content %}
      <div style="margin-bottom: 5px">
          {% add_permission request 'policy_add' %}
          ...
      </div>
      <table class="table table-bordered">
          <thead>
          <tr>
              ...
              {% if request|has_permission:"policy_edit,policy_delete" %}
                  <th>操作</th>
              {% endif %}
          </tr>
          </thead>
          <tbody>
          {% for row in pager.queryset %}
              <tr row-id="{{ row.id }}">
                  ...
                  {% if request|has_permission:"policy_edit, policy_delete" %}
                      <td>
                          {% edit_permission request 'policy_edit' pk=row.id %}
                          {% delete_permission request 'policy_delete' pk=row.id %}
                      </td>
                  {% endif %}
              </tr>
          {% endfor %}
          </tbody>
      </table>
      ...
  {% endblock %}
  	...
  {% endblock %}
  ```
- 权限展望（stark 组件）

  问题：代码编写重复率高

  优化：

  1. 自动生成 URL，根据 level、customer、policy
  2. level、customer、policy 对应数据库中的表

      `queryset = models,xxx.object.all()`
  3. 自定义列，根据 level、customer、policy
  4. 列表（表格页面），根据自定义列
  5. 自动拼接

### 10 链接跳转

参考：django-admin 源码

`QueryDict` + `_filter`

- 逻辑：在生成URL时，需要读取当前URL中的参数并构造URL。例如：

  - 当前URL

    ```
    http://localhost:8000/customer/list/?keyword=user&page=9
    ```
  - 构造编辑页面URL

    ```
    http://localhost:8000/customer/edit/139/?_filter=keyword%3Duser%26page%3D9
    ```

    ```python
    param = request.GET.urlencode() # 'keyword=user&page=9'
    new_query_dict = QueryDict(mutable=True)
    new_query_dict['_filter'] = param
    new_query_dict.urlencode()  # '_filter=keyword%3Duser%26page%3D9'
    ```
  - 跳转回来时

    ```
    http://localhost:8000/customer/list/?keyword=user&page=9
    ```

    ```python
    filter_string = request.GET.get("_filter")
    if filter_string:
    	return redirect("/customer/list/?{}".format(filter_string))
    return redirect("/customer/list/")
    ```

- 保存跳转

  ```python
  # web/templatetags/permission.py
  @register.simple_tag
  def edit_permission(request, name, *args, **kwargs):
      # 4. 无权限，返回 空
      if not check_permission(request, name):
          return ""
      # 5. 有权限，通过 name 反向生成 url
      url = reverse(name, args=args, kwargs=kwargs)
      # 跳转返回原页码:构造编辑页面URL
      param = request.GET.urlencode()
      if param:
          new_query_dict = QueryDict(mutable=True)
          new_query_dict['_filter'] = param
          filter_string = new_query_dict.urlencode()
          tpl = """<a href="{}?{}" class="btn btn-primary btn-xs">编辑</a>""".format(url, filter_string)
          return mark_safe(tpl)
      tpl = """<a href="{}" class="btn btn-primary btn-xs">编辑</a>""".format(url)
      return mark_safe(tpl)
  ```

  编辑客户

  ```python
  # utils/link.py
  def filter_reverse(request, url):
      filter_string = request.GET.get("_filter")
      if not filter_string:
          return url
      return "{}?{}".format(url, filter_string)
  ```

  ```python
  # web/views/customer.py
  from utils.link import filter_reverse
  def customer_edit(request, pk):
      instance = models.Customer.objects.filter(id=pk, active=1).first()
      if request.method == "GET":
          form = CustomerEditModelForm(instance=instance)
          return render(request, "form2.html", {"form": form})
      form = CustomerEditModelForm(data=request.POST, instance=instance)
      if not form.is_valid():
          return render(request, "form2.html", {"form": form})
      form.save()
      # 跳转返回原页码
      # filter_string = request.GET.get("_filter")
      # if filter_string:
      #     return redirect("/customer/list/?{}".format(filter_string))
      # return redirect("/customer/list/")
      return redirect(filter_reverse(request, "/customer/list/"))
  ```

  

### 11 充值

> 逻辑
>
> 1. 页面链接
> 2. 查看用户的所有交易记录
> 3. 点击，弹出框：充值\扣费 <kbd>-&gt;</kbd> 增加记录
>
>     - 用户表，修改账户余额
>     - 交易记录

- 交易记录列表

  - `urls & settings`

    ```python
    urlpatterns = [
        path('customer/charge/<int:pk>/', customer.customer_charge, name='customer_charge'),
    ]

    NB_PERMISSION = {
        "ADMIN": {
            "customer_charge": {"text": "交易记录", "parent": "customer_list"},
            
    }
    ```
  - `web/templates/customer_list.html`

    ```html
    <table class="table table-bordered">
            <thead>
            <tr>
                <th>交易记录</th>
            </tr>
            </thead>
            <tbody>
            {% for row in queryset %}
                <tr row-id="{{ row.id }}">
                    <td>
                        <a href="{% url "customer_charge" pk=row.id %}">交易记录</a>
                    </td>
                </tr>
            {% endfor %}
            </tbody>
        </table>
    ```
  - `web/views/customer.py`

    ```python
    class ChargeModelForm(BootStrapForm, forms.ModelForm):
        # 修改数据源：方式一，适合固定的数据，不适合去数据表中获取数据
        charge_type = forms.ChoiceField(
            label="交易类型",
            choices=[(1, "充值"), (2, "扣款")]
        )
        class Meta:
            model = models.TransactionRecord
            fields = ["amount", "charge_type"]

        # def __init__(self, *args, **kwargs):
        #     # 修改数据源：方式二，重新获取数据源
        #     super().__init__(*args, **kwargs)
        #     self.fields["charge_type"].choices = [(1, "充值"), (2, "扣款")]

    def customer_charge(request, pk):
        """交易记录"""
        queryset = models.TransactionRecord.objects.filter(customer_id=pk, customer__active=1, active=1).order_by("-id")
        pager = Pagination(request, queryset)
        form = ChargeModelForm()
        return render(request, "customer_charge.html", {"pager": pager, "form": form})
    ```
  - `web/templates/customer_charge.html`

    ```html
    {% extends "layout.html" %}
    {% load static %}
    {% load permission %}

    {% block content %}
        <div style="margin-bottom: 5px">
            <div style="margin-bottom: 5px" class="clearfix left">
                <button class="btn btn-success" id="btnAdd">
                     新建
                </button>
            </div>
            <div class="right">
                <form class="form-inline" method="get">
                    <div class="form-group">
                        <input name="keyword" type="text" class="form-control" placeholder="请输入关键字" value="{{ keyword }}">
                    </div>
                    <button type="submit" class="btn btn-default">
                        
                    </button>
                </form>
            </div>
        </div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th>ID</th>
                <th>类型</th>
                <th>金额</th>
                <th>订单号</th>
                <th>时间</th>
                <th>其他</th>
            </tr>
            </thead>
            <tbody>
            {% for row in pager.queryset %}
                <tr>
                    <td>{{ row.id }}</td>
                    <td>{{ row.get_charge_type_display }}</td>
                    <td>{{ row.amount }}</td>
                    <td>{{ row.order_id }}</td>
                    <td>{{ row.create_datetime|date:"Y-m-d H:i:s" }}</td>
                    <td>备注</td>
                </tr>
            {% endfor %}
            </tbody>
        </table>

        <ul class="pagination">
            {{ pager.page_html }}
        </ul>
        <div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">&times;</button>
                        <h4 class="modal-title" id="myModalLabel">新建记录</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal" id="addForm">
                            {% csrf_token %}
                            {% for field in form %}
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">{{ field.label }}</label>
                                    <div class="col-sm-10" style="position: relative;margin-bottom: 25px">
                                        {{ field }}
                                        {{ field.errors.0 }}
                                    </div>
                                </div>
                            {% endfor %}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">关 闭</button>
                        <button type="button" class="btn btn-primary" id="btnAddSubmit">提 交</button>
                    </div>
                </div>
            </div>
        </div>

    {% endblock %}
    {% block js %}
        <script>
            $(function () {
                $("#btnAdd").click(function () {
                    $("#addModal").modal("show");
                });
            })
        </script>
    {% endblock %}

    ```
- 充值 & 扣款（对话框）

  - `urls & settings`

    ```python
    urlpatterns = [
        path('customer/charge/<int:pk>/add/', customer.customer_charge_add, name='customer_charge_add'),
    ]

    NB_PERMISSION = {
        "ADMIN": {
            "customer_charge_add": {"text": "添加交易记录", "parent": "customer_list"},
        },
    }
    ```
  - `web/templates/customer_charge.html` ajax 提交

    ```html
    {% block css %}
        <style>
            .error-message {
                color: red;
                position: absolute;
            }
        </style>
    {% endblock %}

    {% block js %}
        <script>
            $(function () {
                $("#btnAdd").click(function () {
                    $("#addModal").modal("show");
                });
                $("#btnAddSubmit").click(function () {
                    $(".error-message").empty();
                    $.ajax({
                        url: "{% url 'customer_charge_add' pk=pk %}",
                        type: "POST",
                        data: $("#addForm").serialize(),
                        success: function (res) {
                            if (res.status) {
                                window.location.reload();
                            } else {
                                $.each(res.detail, function (k, v) {
                                    $("#id_" + k).next().text(v[0]);
                                })
                            }
                        }
                    })
                });
            })
        </script>
    {% endblock %}
    ```
  - `web/views/customer.py`

    ```python
    class ChargeModelForm(BootStrapForm, forms.ModelForm):
        # 修改数据源：方式一，适合固定的数据，不适合去数据表中获取数据
        charge_type = forms.TypedChoiceField(
            label="交易类型",
            choices=[(1, "充值"), (2, "扣款")],
            coerce=int # 输入的字符串转换成数字
        )

        class Meta:
            model = models.TransactionRecord
            fields = ["charge_type", "amount"]

    def customer_charge_add(request, pk):
        form = ChargeModelForm(data=request.POST)
        if not form.is_valid():
            return JsonResponse({"status": False, "detail": form.errors})
        # 如果校验成功
        # 1. 对当前操作的客户进行更新操作，账户余额：增加、减少
        cus_object = models.Customer.objects.filter(id=pk, active=1).first()
        amount = form.cleaned_data["amount"]
        charge_type = form.cleaned_data["charge_type"]
        if charge_type == 1:
            cus_object.balance = cus_object.balance + amount
        else:
            cus_object.balance = cus_object.balance - amount
        cus_object.save()
        # 2. 交易记录
        form.instance.customer = cus_object
        form.instance.creator_id = request.nb_user.id
        form.save()
        return JsonResponse({"status": True})
    ```

    - 客户余额增加或减少
    - 创建交易记录
  - 扣款余额不足检查

    ```python
    if charge_type == 2 and amount > cus_object.balance:
        return JsonResponse({
            "status": False,
            "detail": {"amount": ["余额不足，账户余额{}".format(cus_object.balance)]}
        })
    ```

- 事务（原子性操作）+ 锁

  - 事务：当其中的代码都运行成功时，程序才会被执行

    锁：`select_for_update` 数据库的行级锁定，防止并发操作导致的数据不一致问题

    ```python
    # 多个数据库操作，要成功都成功，要失败都失败
    from django.db import transaction
    with transaction.atomic():
    	models.Customer.objects.filter(id=1).first()
    	models.Customer.objects.filter(id=1).select_for_update().first() # + 数据库锁
    	# 数据库操作A
        # 数据库操作B
    ```

  - `web/views/customer.py`

    ```python
    def customer_charge_add(request, pk):
        form = ChargeModelForm(data=request.POST)
        if not form.is_valid():
            return JsonResponse({"status": False, "detail": form.errors})
        # 如果校验成功
        amount = form.cleaned_data["amount"]
        charge_type = form.cleaned_data["charge_type"]
        from django.db import transaction
        try:
            # 开启事务
            with transaction.atomic():
                # 1. 对当前操作的客户进行更新操作，账户余额：增加、减少
                # cus_object = models.Customer.objects.filter(id=pk, active=1).first()
                cus_object = models.Customer.objects.filter(id=pk, active=1).select_for_update().first() # 锁表
                if charge_type == 2 and amount > cus_object.balance:
                    return JsonResponse({
                        "status": False,
                        "detail": {"amount": ["余额不足，账户余额{}".format(cus_object.balance)]}
                    })
                if charge_type == 1:
                    cus_object.balance = cus_object.balance + amount
                else:
                    cus_object.balance = cus_object.balance - amount
                cus_object.save()
                # 2. 交易记录
                form.instance.customer = cus_object
                form.instance.creator_id = request.nb_user.id
                form.save()
        except Exception:
            return JsonResponse({"status": False, "detail": {"amount": ["操作失败"]}})
        return JsonResponse({"status": True})
    ```

- 页面优化

  - `web/templates/customer_charge.html`

    ```html
    {% load color %}
    <tbody>
    {% for row in pager.queryset %}
        <tr>
            <td>{{ row.id }}</td>
            <td>
                {{ row.get_charge_type_display }}
            </td>
            <td>{{ row.amount }}</td>
            <td>
                {% if row.order_oid %}
                    {{ row.order_oid }}
                {% else %}
                    - - - - - - - - -
                {% endif %}
            </td>
            <td>{{ row.create_datetime|date:"Y-m-d H:i:s" }}</td>
            <td>
                {% if row.order %}
                    {{ row.order }}
                {% else %}
                    - - -
                {% endif %}
        </tr>
    {% endfor %}
    </tbody>
    ```
  - `web/templatetags/color.py`

    ```python
    from django.template import Library
    from web import models

    register = Library()

    @register.filter
    def color(num):
        return models.TransactionRecord.charge_type_class_mapping[num]
    ```

### 12 客户下单

- 我的订单列表
- 基础页面

  - `urls & settings`

    ```python
    from web.views import my_order
    urlpatterns = [
        path('my/order/list/', my_order.my_order_list, name='my_order_list'),
    ]

    NB_MENU = {
        "CUSTOMER": [
            {"title": "订单管理", "icon": "fa fa-tasks",
             "children":[
                 {"title": "我的订单", "url": "/my/order/list/", "name": "my_order_list"}
             ]},
        ]
    }

    NB_PERMISSION = {
        "CUSTOMER": {
            "my_order_list": {"text": "我的订单", "parent": None},
        }
    }
    ```
  - `web/views/my_order.py`

    ```python
    from django.shortcuts import render
    from web import models
    from utils.pager import Pagination

    def my_order_list(request):
        queryset = models.Order.objects.filter(customer_id=request.nb_user.id, active=1).order_by("-id")
        pager = Pagination(request, queryset)
        return render(request, 'my_order_list.html', {"pager": pager})
    ```
  - `web/templates/my_order_list.html`

    ```html
    {% extends "layout.html" %}
    {% load static %}

    {% block content %}
        <table class="table table-bordered">
            <thead>
            <tr>
                <th>订单号</th>
                <th>视频地址</th>
                <th>数量</th>
                <th>价格</th>
                <th>原播放量</th>
                <th>创建时间</th>
                <th>状态</th>
                <th>备注</th>
            </tr>
            </thead>
            <tbody>
            {% for row in pager.queryset %}
                <tr>
                    <td>{{ row.oid }}</td>
                    <td>{{ row.url }}</td>
                    <td>{{ row.count }}</td>
                    <td>{{ row.price }} ({{ row.real_price }})</td>
                    <td>{{ row.old_view_count }}</td>
                    <td>{{ row.create_datetime }}</td>
                    <td>{{ row.get_status_display }}</td>
                    <td>{{ row.memo }}</td>
                </tr>
            {% endfor %}
            </tbody>
        </table>

        <ul class="pagination">
            {{ pager.page_html }}
        </ul>

    {% endblock %}
    ```
- 创建订单

  - 输入：视频地址、数量（提示价格策略）
  - 数据库操作（事务 + 锁）

    - 创建订单记录
    - 创建交易记录
    - 扣款
  - 写入 redis 队列（等待执行）

  - `urls & settings`

    ```python
    from web.views import my_order
    urlpatterns = [
    	path('my/order/list/', my_order.my_order_list, name='my_order_list'),
        path('my/order/add/', my_order.my_order_add, name='my_order_add'),
    ]

    NB_PERMISSION = {
        "CUSTOMER": {
            "my_order_list": {"text": "我的订单", "parent": None},
            "my_order_add": {"text": "新建订单", "parent": "my_order_list"},
        }
    }

    QUEUE_TASK_NAME = "YANG_TASK_QUEUE"
    ```
  - `web/templates/my_order_list.html`

    ```html
    {% extends "layout.html" %}
    {% load static %}

    {% block content %}
        <div style="margin-bottom: 5px">
            <a href="{% url 'my_order_add' %}" class="btn btn-success">
                 创建订单
            </a>
        </div>
        <table class="table table-bordered">
            ...
        </table>
    	...
    {% endblock %}
    ```
  - `web/views/my_order.py`

    ```python
    class MyOrderModelForm(BootStrapForm, forms.ModelForm):
        class Meta:
            model = models.Order
            fields = ["url", "count"]

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            price_count_list = []
            text_count_list = []
            queryset = models.PricePolicy.objects.all().order_by('count')
            for item in queryset:
                unit_price = item.price / item.count
                price_count_list.append([item.count, ">={} ¥{}/条".format(item.count, unit_price), unit_price])
                text_count_list.append(">={} ¥{}/条".format(item.count, unit_price))
            if text_count_list:
                self.fields['count'].help_text = "、".join(text_count_list)
            else:
                self.fields['count'].help_text = "请联系管理员设置价格"
            self.price_count_list = price_count_list

        def clean_count(self):
            count = self.cleaned_data["count"]
            if not self.price_count_list:
                raise ValidationError("请联系管理员设置价格")
            min_count_limit = self.price_count_list[0][0]
            if count < min_count_limit:
                raise forms.ValidationError("数量不能小于{}".format(min_count_limit))
            return count

    def my_order_add(request):
        if request.method == "GET":
            form = MyOrderModelForm()
            return render(request, 'form.html', {"form": form})
        form = MyOrderModelForm(data=request.POST)
        if not form.is_valid():
            return render(request, 'form.html', {"form": form})
        # 获取到 url 和 count
        video_url = form.cleaned_data['url']
        count = form.cleaned_data['count']

        # 4.2 爬虫，发送网络请求获取原播放
        from utils.video import get_old_view_count
        status, old_view_count = get_old_view_count(video_url)
        if not status:
            form.add_error('url', "视频原来播放获取失败")
            return render(request, 'form.html', {"form": form})

        # 1. 根据数量获取单价，计算出原价
        unit_price = 0
        for idx in range(len(form.price_count_list)-1,-1,-1):
            limit_count,_,unit_price = form.price_count_list[idx]
            if count >= limit_count:
                break
        total_price = count * unit_price  # Decimal 类型
        # 事务+数据库锁
        from django.db import transaction
        try:
            with transaction.atomic():

                # 2.当前客户的级别，根据级别计算折扣后的价格
                cus_object = models.Customer.objects.filter(id=request.nb_user.id).select_for_update().first()
                real_price = total_price * cus_object.level.percent / 100

                # 3. 判断账户余额是否充足
                if cus_object.balance < real_price:
                    form.add_error("count", "余额不足")
                    return render(request, 'form.html', {"form": form})

                # 4. 创建订单
                # 4.1 生成订单号
                while True:
                    rand_number = random.randint(10000000, 99999999)  # 随机生成 8位 数
                    ctime = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")  # 时间戳
                    oid = "{}{}".format(ctime, rand_number)  # 订单号
                    exists = models.Order.objects.filter(oid=oid).exists()  # exists() 判断结果集是否为空
                    if exists:
                        continue
                    break
                print("订单号:", oid)
                # 4.2 获取原播放量
                print("原播放量:", old_view_count)
                # 4.3 客户ID=当前登录用客户的ID
                form.instance.oid = oid
                form.instance.price = total_price
                form.instance.real_price = real_price
                form.instance.old_view_count = old_view_count
                form.instance.customer_id = request.nb_user.id
                form.save()

                # 5. 账户扣款
                # cus_object.balance = cus_object.balance - real_price
                # cus_object.save()
                models.Customer.objects.filter(id=request.nb_user.id).update(balance=F("balance") - real_price)

                # 6. 生成交易记录
                models.TransactionRecord.objects.create(
                    charge_type=3,
                    customer_id=request.nb_user.id,
                    amount=real_price,
                    order_oid=oid
                )

                # 7. 写入队列 redis（redis启动，django连接redis）
                conn = get_redis_connection("default")
                conn.lpush(settings.QUEUE_TASK_NAME, oid)

        except Exception as e:
            form.add_error('count', "创建订单失败")
            return render(request, 'form.html', {"form": form})

        return redirect('/my/order/list/')
    ```

### 13 撤销订单（待执行）

> - 业务流程：数据库操作（事务+锁）
>
>   - 更新订单状态
>   - 生成交易记录
>   - 归还扣款
>
> - url 提交
>
>   - 跳转连接
>   - 错误提示
>
>     ```
>     def xxx(request):
>     	return render(request,"xxx.html",{"xx":"xxx"})
>     ```
>
>     ```python
>     # message组件 -> session -> ViewData TempView TempData
>     def xxx(request):
>     	return redirect('/my/order/list/')
>     ```
> - ajax 提交（推荐）
>
>   - ajax 发送后台
>   - 页面刷新
>   - 错误信息
>   - 加载框

- `urls & settings`

  ```python
  from web.views import my_order
  urlpatterns = [
  	path('my/order/list/', my_order.my_order_list, name='my_order_list'),
      path('my/order/add/', my_order.my_order_add, name='my_order_add'),
  	path('my/order/cancel/<int:pk>/', my_order.my_order_cancel, name='my_order_cancel'),
  ]

  NB_PERMISSION = {
      "CUSTOMER": {
          "my_order_list": {"text": "我的订单", "parent": None},
          "my_order_add": {"text": "新建订单", "parent": "my_order_list"},
  		"my_order_cancel": {"text": "撤销订单", "parent": "my_order_list"},
      }
  }

  QUEUE_TASK_NAME = "YANG_TASK_QUEUE"

  # MESSAGE_STORAGE = 'django.contrib.messages.storage.fallback.FallbackStorage'
  # MESSAGE_STORAGE = 'django.contrib.messages.storage.cookie.CookieStorage'
  MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'

  MESSAGE_DANDER_TAG = 50
  MESSAGE_TAGS = {
      MESSAGE_DANDER_TAG: "danger"
  }
  ```
- `web/templates/my_order_list.html`

  ```html
  {% extends "layout.html" %}
  {% load static %}

  {% block css %}
      <style>
          .top-message-error{
              position: fixed;
              top: 95px;
              left: 0;
              right: 0;
              width: 200px;
              margin-left: auto;
              margin-right: auto;
              color: red;
          }
      </style>
  {% endblock %}

  {% block content %}
      {% if messages %}
          <div class="top-message-error">
              {% for obj in messages %}
                  <div class="alert alert-{{ obj.level_tag }}">
                      {{ obj.message }}
                  </div>
              {% endfor %}
          </div>
      {% endif %}

      <div style="margin-bottom: 5px">
          <a href="{% url 'my_order_add' %}" class="btn btn-success">
               创建订单
          </a>
      </div>
      <table class="table table-bordered">
          <thead>
          <tr>
              <th>订单号</th>
              <th>视频地址</th>
              <th>数量</th>
              <th>价格</th>
              <th>原播放量</th>
              <th>创建时间</th>
              <th>状态</th>
              <th>操作</th>
              <th>备注</th>
          </tr>
          </thead>
          <tbody>
          {% for row in pager.queryset %}
              <tr>
                  <td>{{ row.oid }}</td>
                  <td>{{ row.url }}</td>
                  <td>{{ row.count }}</td>
                  <td>{{ row.price }} ({{ row.real_price }})</td>
                  <td>{{ row.old_view_count }}</td>
                  <td>{{ row.create_datetime }}</td>
                  <td>{{ row.get_status_display }}</td>
                  <td>
                      {% if row.status == 1 %}
                          <a href="{% url 'my_order_cancel' pk=row.id %}" class="btn btn-danger btn-xs">撤单</a>
                      {% endif %}
                  </td>
                  <td>{{ row.memo }}</td>
              </tr>
          {% endfor %}
          </tbody>
      </table>

      <ul class="pagination">
          {{ pager.page_html }}
      </ul>
  {% endblock %}

  {% block js %}
      <script>
          setTimeout(function () {
              $(".top-message-error").addClass('hide');
          }, 2000);
      </script>
  {% endblock %}
  ```
- `web/views/my_order.py`

  ```python
  def my_order_cancel(request, pk):
      """ 撤单"""
      # 订单信息
      order_object = models.Order.objects.filter(id=pk, active=1, status=1, customer=request.nb_user.id).first()
      if not order_object:
          messages.add_message(request, settings.MESSAGE_DANDER_TAG, "订单不存在")
          return redirect('/my/order/list/')

      try:
          with transaction.atomic():
              cus_object = models.Customer.objects.filter(id=request.nb_user.id).select_for_update().first()
              # 1. 订单状态：(5, "已撤单")
              # order_object.status = 5
              # order_object.save()
              models.Order.objects.filter(id=pk, active=1, status=1, customer=request.nb_user.id).update(status=5)
              # 2. 归还余额
              models.Customer.objects.filter(id=request.nb_user.id).update(balance=F("balance") + order_object.real_price)
              # 3. 交易记录
              models.TransactionRecord.objects.create(
                  charge_type=5,
                  customer_id=request.nb_user.id,
                  amount=order_object.real_price,
                  order_oid=order_object.oid
              )
              # 撤单成功
              messages.add_message(request, messages.SUCCESS, "撤单成功")
              return redirect('/my/order/list/')

      except Exception as e:
          messages.add_message(request, settings.MESSAGE_DANDER_TAG, "撤单失败:{}".format(str(e)))
          return redirect('/my/order/list/')

  ```

注意：ajax方式撤单，不要用message组件，只有跳转操作时才使用。

### 14 我的交易记录

> - 我的交易列表
> - 关键字搜索
>
>   ```python
>   # 从请求中获取关键字参数
>   keyword = request.GET.get("keyword", "").strip()
>
>   # 构建搜索条件（多字段OR匹配）
>   con = Q()
>   if keyword:
>       con.connector = 'OR'  # 多个条件之间用OR连接
>   	# 匹配关键字：
>       # 匹配订单号包含关键字
>       con.children.append(('order_oid__contains', keyword))
>       # 匹配客户用户名包含关键字
>       con.children.append(('customer__username__contains', keyword))
>
>   # 在查询集中应用搜索条件（结合其他业务条件）
>   queryset = models.TransactionRecord.objects.filter(con).filter(
>       customer_id=request.nb_user.id, 
>       active=1
>   ).order_by("-id")
>
>   # 模板上下文传递关键字（用于回显）
>   context = {"pager": pager, "keyword": keyword}
>   ```
>
>   ```html
>   <!-- 关键字搜索表单 -->
>   <div class="clearfix" style="margin-bottom: 5px;">
>       <div class="right">
>           <form class="form-inline" method="get">  <!-- get方法提交搜索参数 -->
>               <div class="form-group">
>                   <!-- 输入框绑定关键字变量（用于搜索后回显输入内容） -->
>                   <input name="keyword" type="text" class="form-control" 
>                          placeholder="请输入关键字" value="{{ keyword }}">
>               </div>
>               <button type="submit" class="btn btn-default">
>                     <!-- 搜索按钮 -->
>               </button>
>           </form>
>       </div>
>   </div>
>   ```
> - 组合搜索
>
>   ![[../../../Python/Python Web框架/assets/image-20220821080329441-20250830193451-in42ooq.png]]
>
>   - 组件源码 `utils/group.py`
>
>     ```python
>     #!/usr/bin/env python
>     # -*- coding:utf-8 -*-
>     from django.db.models import ForeignKey, ManyToManyField
>
>
>     class SearchGroupRow(object):
>         def __init__(self, title, queryset_or_tuple, option, query_dict):
>             """
>             :param title: 组合搜索的列名称
>             :param queryset_or_tuple: 组合搜索关联获取到的数据
>             :param option: 配置
>             :param query_dict: request.GET
>             """
>             self.title = title
>             self.queryset_or_tuple = queryset_or_tuple
>             self.option = option
>             self.query_dict = query_dict
>
>         def __iter__(self):
>             yield '<div class="whole">'
>             yield self.title
>             yield '</div>'
>             yield '<div class="others">'
>             total_query_dict = self.query_dict.copy()
>             total_query_dict._mutable = True
>
>             origin_value_list = self.query_dict.getlist(self.option.field)
>             if not origin_value_list:
>                 yield "<a class='active' href='?%s'>全部</a>" % total_query_dict.urlencode()
>             else:
>                 total_query_dict.pop(self.option.field)
>                 yield "<a href='?%s'>全部</a>" % total_query_dict.urlencode()
>
>             for item in self.queryset_or_tuple:
>                 text = self.option.get_text(item)
>                 value = str(self.option.get_value(item))
>                 query_dict = self.query_dict.copy()
>                 query_dict._mutable = True
>
>                 if not self.option.is_multi:
>                     query_dict[self.option.field] = value
>                     if value in origin_value_list:
>                         query_dict.pop(self.option.field)
>                         yield "<a class='active' href='?%s'>%s</a>" % (query_dict.urlencode(), text)
>                     else:
>                         yield "<a href='?%s'>%s</a>" % (query_dict.urlencode(), text)
>                 else:
>                     # {'gender':['1','2']}
>                     multi_value_list = query_dict.getlist(self.option.field)
>                     if value in multi_value_list:
>                         multi_value_list.remove(value)
>                         query_dict.setlist(self.option.field, multi_value_list)
>                         yield "<a class='active' href='?%s'>%s</a>" % (query_dict.urlencode(), text)
>                     else:
>                         multi_value_list.append(value)
>                         query_dict.setlist(self.option.field, multi_value_list)
>                         yield "<a href='?%s'>%s</a>" % (query_dict.urlencode(), text)
>
>             yield '</div>'
>
>
>     # 用于存储相关配置
>     class Option(object):
>         def __init__(self, field, is_condition=True, is_multi=False, db_condition=None, text_func=None, value_func=None):
>             """
>             :param field: 组合搜索关联的字段
>             :param is_condition: 是否作为搜索条件
>             :param is_multi: 是否支持多选
>             :param db_condition: 数据库关联查询时的条件
>             :param text_func: 此函数用于显示组合搜索按钮页面文本
>             :param value_func: 此函数用于显示组合搜索按钮值
>             """
>             self.field = field
>             self.is_condition = is_condition
>             self.is_multi = is_multi
>             if not db_condition:
>                 db_condition = {}
>             self.db_condition = db_condition
>             self.text_func = text_func
>             self.value_func = value_func
>
>             self.is_choice = False
>
>         def get_db_condition(self, request, *args, **kwargs):
>             return self.db_condition
>
>         def get_queryset_or_tuple(self, model_class, request, *args, **kwargs):
>             """
>             根据字段去获取数据库关联的数据
>             :return:
>             """
>             # 根据gender或depart字符串，去自己对应的Model类中找到 字段对象
>             field_object = model_class._meta.get_field(self.field)
>             title = field_object.verbose_name
>             # 获取关联数据
>             if isinstance(field_object, ForeignKey) or isinstance(field_object, ManyToManyField):
>                 # FK和M2M,应该去获取其关联表中的数据： QuerySet
>                 db_condition = self.get_db_condition(request, *args, **kwargs)
>                 return SearchGroupRow(
>                     title,
>                     field_object.remote_field.model.objects.filter(**db_condition),
>                     self,
>                     request.GET)
>             else:
>                 # 获取 choice 中的数据：元组
>                 self.is_choice = True
>                 return SearchGroupRow(title, field_object.choices, self, request.GET)
>
>         def get_text(self, field_object):
>             """
>             获取文本函数
>             :param field_object:
>             :return:
>             """
>             if self.text_func:
>                 return self.text_func(field_object)
>
>             if self.is_choice:
>                 return field_object[1]
>
>             return str(field_object)
>
>         def get_value(self, field_object):
>             if self.value_func:
>                 return self.value_func(field_object)
>
>             if self.is_choice:
>                 return field_object[0]
>
>             return field_object.pk
>
>         def get_search_condition(self, request):
>             if not self.is_condition:
>                 return None
>             if self.is_multi:
>                 values_list = request.GET.getlist(self.field)  # tags=[1,2]
>                 if not values_list:
>                     return None
>                 return '%s__in' % self.field, values_list
>             else:
>                 value = request.GET.get(self.field)  # tags=[1,2]
>                 if not value:
>                     return None
>                 return self.field, value
>
>
>     class SearchGroup(object):
>         def __init__(self, request, model_class, *options):
>             self.request = request
>             self.model_class = model_class
>             self.options = options
>
>         def get_row_list(self):
>             row_list = []
>             for option_object in self.options:
>                 row = option_object.get_queryset_or_tuple(self.model_class, self.request)
>                 row_list.append(row)
>             return row_list
>
>         @property
>         def get_condition(self):
>             """
>             获取组合搜索的条件
>             :param request:
>             :return:
>             """
>             condition = {}
>             # ?depart=1&gender=2&page=123&q=999
>             for option in self.options:
>                 key_and_value = option.get_search_condition(self.request)
>                 if not key_and_value:
>                     continue
>                 key, value = key_and_value
>                 condition[key] = value
>
>             return condition
>
>     ```
>   - `母版`
>
>     ```html
>     {% if search_group.get_row_list %}
>         <div class="panel panel-default">
>             <div class="panel-heading">
>                 <i class="fa fa-filter" aria-hidden="true"></i> 快速筛选
>             </div>
>             <div class="panel-body">
>                 <div class="search-group">
>                     {% for row in search_group.get_row_list %}
>                         <div class="row">
>                             {% for obj in row %}
>                                 {{ obj|safe }}
>                             {% endfor %}
>                         </div>
>                     {% endfor %}
>                 </div>
>             </div>
>         </div>
>     {% endif %}
>     ```
>   - `css`
>
>     ```css
>     .search-group {
>         padding: 5px 10px;
>     }
>
>     .search-group .row .whole {
>         width: 60px;
>         float: left;
>         display: inline-block;
>         padding: 5px 0 5px 8px;
>         margin: 3px;
>         font-weight: bold;
>         text-align: right;
>
>     }
>
>     .search-group .row .others {
>         padding-left: 80px;
>     }
>
>     .search-group .row a {
>         display: inline-block;
>         padding: 5px 8px;
>         margin: 3px;
>         border: 1px solid #d4d4d4;
>
>     }
>
>     .search-group .row a {
>         display: inline-block;
>         padding: 5px 8px;
>         margin: 3px;
>         border: 1px solid #d4d4d4;
>     }
>
>     .search-group a.active {
>         color: #fff;
>         background-color: #337ab7;
>         border-color: #2e6da4;
>     }
>     ```
>   - 源码大致流程
>
>     ```python
>     class SearchGroupRow(object):
>         def __init__(self, queryset_or_tuple, option):
>             self.queryset_or_tuple = queryset_or_tuple
>             self.option = option
>
>     	def __iter__(self):
>             yield "全部"
>     		for item in self.queryset_or_tuple:
>                 self.option.is_multi:
>                     ...
>                 else:
>                     ...
>                 yield "<a>{}</a>".format(item)   # 注意，保留原来的URL条件 request.GET ->拷贝>可变
>             
>     # 用于存储相关配置
>     class Option(object):
>         def __init__(self, field, is_multi):
>             self.field = field
>             self.is_multi = is_multi
>     	
>         def get_queryset_or_tuple(self, model_class, request, *args, **kwargs):
>     		field_object = model_class._meta.get_field(self.field)
>         	# 获取关联数据
>             if isinstance(field_object, ForeignKey) :
>                 # FK和M2M,应该去获取其关联表中的数据： QuerySet 类型
>                 return SearchGroupRow(
>                     field_object.remote_field.model.objects.all(),
>                     self
>                 )
>     		else:
>                 # tuple
>                 return SearchGroupRow(
>                     field_object.choices
>                     self
>                 )
>                 
>            
>     option_list = [
>         Option("charge_type"),
>         Option("customer"),
>     ]
>
>     search_group_row_list = []
>     for opt in option_list:
>         res = opt.get_queryset_or_tuple(modes.TransactionRecord,request)
>         search_group_row_list.append(res)
>     ```
>
>     ```html
>     # row = SearchGroupRow 对象（数据源+配置）
>     {% for row in search_group_row_list %}
>         <div class="row">
>             {% for obj in row %}
>             	{{ obj|safe }}
>             {% endfor %}
>         </div>
>     {% endfor %}
>     ```
>   - 组件使用方法
>
>     - `视图函数`
>
>       ```python
>       from web import models
>       from utils.group import Option, SearchGroup
>
>       # 配置和传参
>       search_group = SearchGroup(
>               request,
>               models.TransactionRecord,
>               Option('charge_type', 
>                      is_multi=True, # 多选
>                      text_func=lambda x: x[1],
>                      value_func=lambda x:x[0]
>                     ),  # choice
>               Option(),
>           )
>
>       queryset = models.TransactionRecord.objects.filter(**search_group.get_condition) # 获取条件
>       pager = Pagination(request, queryset)
>       context = {"pager": pager, "search_group": search_group,} # 模板上下文传递关键字（用于回显）
>       ```
>     - `模板`
>
>       ```html
>       {% block css %}
>           <link rel="stylesheet" href="{% static 'css/search-group.css' %}">
>       {% endblock %}
>       {% block content %}
>       	{% include 'include/search_group.html' %}
>           <ul class="pagination">
>               {{ pager.page_html }}
>           </ul>
>       {% endblock %}
>       ```

- `urls & settings`

  ```python
  from web.views import my_transaction
  urlpatterns = [
      path('my/transaction/list/', my_transaction.my_transaction_list, name='my_transaction_list'),
  ]

  # 菜单
  NB_MENU = {
      "CUSTOMER": [
          {"title": "订单管理", "icon": "fa fa-tasks",
           "children":[
               {"title": "我的订单", "url": "/my/order/list/", "name": "my_order_list"},
               {"title": "我的交易记录", "url": "/my/transaction/list/", "name": "my_transaction_list"}
           ]},
      ]
  }

  # 角色权限
  NB_PERMISSION = {
      "CUSTOMER": {
          "my_transaction_list": {"text": "我的交易记录", "parent": None},
      }
  }
  ```
- `web/templates/my_transaction_list.html`

  ```html
  {% extends 'layout.html' %}
  {% load static %}
  {% load permission %}
  {% load color %}

  {% block css %}
      <link rel="stylesheet" href="{% static 'css/search-group.css' %}">
  {% endblock %}

  {% block content %}
      {% include 'include/search_group.html' %}

      <div class="clearfix" style="margin-bottom: 5px;">
          <div class="right">
              <form class="form-inline" method="get">
                  <div class="form-group">
                      <input name="keyword" type="text" class="form-control" placeholder="请输入关键字" value="{{ keyword }}">
                  </div>
                  <button type="submit" class="btn btn-default">
                      
                  </button>
              </form>
          </div>
      </div>

      <table class="table table-bordered">
          <thead>
          <tr>
              <th>ID</th>
              <th>类型</th>
              <th>金额</th>
              <th>订单号</th>
              <th>时间</th>
              <th>其他</th>
          </tr>
          </thead
          >
          <tbody>
          {% for row in pager.queryset %}
              <tr>
                  <td>{{ row.id }}</td>
                  <td>
                      {{ row.get_charge_type_display }}
                  </td>
                  <td>
                      {{ row.amount }}
                  </td>
                  <td>
                      {% if row.order_oid %}
                          {{ row.order_oid }}
                      {% else %}
                          - - - - - -
                      {% endif %}
                  </td>
                  <td>{{ row.create_datetime|date:"Y-m-d H:i:s" }}</td>
                  <td>
                      {% if row.memo %}
                          {{ row.memo }}
                      {% else %}
                          - - -
                      {% endif %}
                  </td>
              </tr>
          {% endfor %}

          </tbody>
      </table>

      <ul class="pagination">
          {{ pager.page_html }}
      </ul>
  {% endblock %}

  ```
- `web/views/my_transaction.py`

  ```python
  from django.shortcuts import render
  from django.db.models import Q

  from web import models
  from utils.pager import Pagination
  from utils.group import Option, SearchGroup

  def my_transaction_list(request):
      """ 我的交易记录 """
      search_group = SearchGroup(
          request,
          models.TransactionRecord,
          Option('charge_type'),  # choice
      )

      keyword = request.GET.get("keyword", "").strip()
      con = Q()
      if keyword:
          con.connector = 'OR'
          con.children.append(('order_oid__contains', keyword))
          con.children.append(('customer__username__contains', keyword))

      queryset = models.TransactionRecord.objects.filter(con).filter(**search_group.get_condition).filter(
          customer_id=request.nb_user.id,
          active=1
      ).order_by("-id")
      pager = Pagination(request, queryset)

      context = {
          "pager": pager,
          "keyword": keyword,
          "search_group": search_group,
      }

      return render(request, "my_transaction_list.html", context)

  ```

### 15 客户列表（添加 组合搜索）

- `web/views/customer.py`

  ```python
  from utils.group import Option, SearchGroup

  def customer_list(request):
      search_group = SearchGroup(
          request,
          models.Customer,
          Option('level', db_condition={"active": 1}),  # ForeignKey
          Option('creator'),
      )
      keyword = request.GET.get("keyword", "").strip()
      con = Q()
      if keyword:
          con.connector = 'OR'
          con.children.append(('username__contains', keyword))
          con.children.append(('mobile__contains', keyword))
          con.children.append(('level__title__contains', keyword))
      queryset = models.Customer.objects.filter(**search_group.get_condition).filter(con).filter(active=1).select_related("level", "creator") # 获取所有客户
      obj = Pagination(request, queryset)
      context = {
          "queryset": queryset[obj.start:obj.end],
          "pager_string": obj.page_html(),
          "keyword": keyword,
          "search_group": search_group
      }
      return render(request, "customer_list.html", context)

  ```

- `web/templates/customer_list.html`

  ```html
  {% block css %}
      <link rel="stylesheet" href="{% static 'css/search-group.css' %}">
  {% endblock %}

  {% block content %}
      {% include 'include/search_group.html' %}
  {% endblock %}
  ```

### 16 交易记录（管理员）

- `urls & settings`

  ```python
  from web.views import my_transaction
  urlpatterns = [
      path('transaction/list/', my_transaction.transaction_list, name='transaction_list'),
  ]

  NB_MENU = {
      "ADMIN": [
          {"title": "交易管理", "icon": "fa fa-tasks",
           "children": [
              {"title": "交易记录", "url": "/transaction/list/", "name": "transaction_list"},
          ]},
      ],
  }

  NB_PERMISSION = {
      "ADMIN": {
          "transaction_list": {"text": "交易记录", "parent": None},
      },
  }
  ```
- `web/views/my_transaction.py`

  ```python
  from django.shortcuts import render
  from django.db.models import Q

  from web import models
  from utils.pager import Pagination
  from utils.group import Option, SearchGroup

  def transaction_list(request):
      search_group = SearchGroup(
          request,
          models.TransactionRecord,
          Option('charge_type'),  # choice
          Option('creator', text_func=lambda obj: obj.username),
      )

      keyword = request.GET.get("keyword", "").strip()
      con = Q()
      if keyword:
          con.connector = 'OR'
          con.children.append(('order_oid__contains', keyword))
          con.children.append(('customer__username__contains', keyword))

      queryset = models.TransactionRecord.objects.filter(con).filter(**search_group.get_condition).filter(
          active=1
      ).select_related('creator', 'customer').order_by("-id")
      pager = Pagination(request, queryset)

      context = {
          "pager": pager,
          "keyword": keyword,
          "search_group": search_group,
      }
      return render(request, "transaction_list.html", context)
  ```
- `web/templates/transaction_list.html`

  ```html
  {% extends 'layout.html' %}
  {% load static %}
  {% load permission %}
  {% load color %}

  {% block css %}
      <link rel="stylesheet" href="{% static 'css/search-group.css' %}">
  {% endblock %}

  {% block content %}
      {% include 'include/search_group.html' %}

      <div class="clearfix" style="margin-bottom: 5px;">
          <div class="right">
              <form class="form-inline" method="get">
                  <div class="form-group">
                      <input name="keyword" type="text" class="form-control" placeholder="请输入关键字" value="{{ keyword }}">
                  </div>
                  <button type="submit" class="btn btn-default">
                      
                  </button>
              </form>
          </div>
      </div>

      <table class="table table-bordered">
          <thead>
          <tr>
              <th>ID</th>
              <th>用户</th>
              <th>类型</th>
              <th>金额</th>
              <th>订单号</th>
              <th>时间</th>
              <th>其他</th>
          </tr>
          </thead
          >
          <tbody>
          {% for row in pager.queryset %}
              <tr>
                  <td>{{ row.id }}</td>
                  <td>{{ row.customer.username }}</td>
                  <td>
                      {{ row.get_charge_type_display }}
                  </td>
                  <td>{{ row.amount }} </td>
                  <td>
                      {% if row.order_oid %}
                          {{ row.order_oid }}
                      {% else %}
                          - - - - - -
                      {% endif %}
                  </td>
                  <td>{{ row.create_datetime|date:"Y-m-d H:i:s" }}</td>
                  <td>
                      {% if row.memo %}
                          {{ row.memo }}
                      {% else %}
                          - - -
                      {% endif %}
                  </td>
              </tr>
          {% endfor %}

          </tbody>
      </table>

      <ul class="pagination">
          {{ pager.page_html }}
      </ul>
  {% endblock %}

  ```

### 17 Worker

![[../../../Python/Python Web框架/assets/image-20220710184409818-20250830193450-in8boe4.png]]

执行worker去执行订单的执行。

**业务功能**：

- redis队列 获取订单号
- 数据库 获取订单信息和状态（撤单，则不执行）
- 执行订单

  ```
  更新状态	- 执行中
  线程池   - 执行订单
  执行完成	- 更新状态
  ```

**相关知识点**：

- 线程池
- 数据库操作 + 上下文管理

  - `app.py`

    ```python
    import settings

    import threading
    import requests
    import time, random, datetime
    import json
    import pymysql, redis
    from pymysql.cursors import DictCursor
    from concurrent.futures import ThreadPoolExecutor
    from urllib.parse import parse_qs, urlparse, urlencode
    import ctypes
    import binascii

    # Python调用 JavaScript 代码
    #   - 安装nodejs + 配置环境变量
    #   - 安装pyexecjs模块  pip install pyexecjs
    import execjs

    from Crypto.Cipher import AES  # pip install pycryptodome

    ERROR_COUNT = 0
    ERROR_LOCK = threading.RLock()

    javascript_file = execjs.compile("""
    function createGUID(e) {
        e = e || 32;
        for (var t = "", r = 1; r <= e; r++) {
            t += Math.floor(16 * Math.random()).toString(16);
        }
        return t;
    }
    """)

    class Connect(object):
        def __init__(self):
            self.conn = conn = pymysql.connect(**settings.MYSQL_CONN_PARAMS)
            self.cursor = conn.cursor(pymysql.cursors.DictCursor)

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc_val, exc_tb):
            self.cursor.close()
            self.conn.close()

        def exec(self, sql, **kwargs):
            self.cursor.execute(sql, kwargs)
            self.conn.commit()

        def fetch_one(self, sql, **kwargs):
            self.cursor.execute(sql, kwargs)
            result = self.cursor.fetchone()
            return result

        def fetch_all(self, sql, **kwargs):
            self.cursor.execute(sql, kwargs)
            result = self.cursor.fetchall()
            return result

    class DbRow(object):
        def __init__(self, id, oid, status, url, count):
            self.id = id
            self.oid = oid
            self.status = status
            self.url = url
            self.count = count

    def get_redis_task():
        # 连接redis
        conn = redis.Redis(**settings.REDIS_PARAMS)
        print("连接redis成功")
        oid = conn.brpop(settings.QUEUE_TASK_NAME, timeout=5)
        if not oid:
            return
        # # (b'YANG_TASK_QUEUE', b'2022081409424192778452289117')
        return oid[1].decode('utf-8')

    def get_order_info_by_id(oid):
        with Connect() as conn:
            row_dict = conn.fetch_one(
                "select id,oid,status,url,count from web_order where oid=%(oid)s and status=1",
                oid=oid
            )
        print("成功获取数据库的订单号")
        if not row_dict:
            return
        row_object = DbRow(**row_dict)
        return row_object

    def update_order_status(oid, status):
        with Connect() as conn:
            conn.exec("update web_order set status=%(status)s where oid=%(oid)s", status=status, oid=oid)

    def create_qa(data_string):
        """
        string = "|d000035rirv|1622526980|mg3c3b04ba|1.3.2|df553a055bb06eda3653173ee5a010bf|4330701|https://w.yangshipin.cn/|mozilla/5.0 (macintosh; ||Mozilla|Netscape|MacIntel|"
        原算法
            Aa = "|d000035rirv|1622526980|mg3c3b04ba|1.3.2|df553a055bb06eda3653173ee5a010bf|4330701|https://w.yangshipin.cn/|mozilla/5.0 (macintosh; ||Mozilla|Netscape|MacIntel|"
            wl = -5516
            $a=0
            for (Se = 0; Se < Aa[St]; Se++)
                    Ma = Aa[bt](Se), Ae["charCodeAt"]()
                    $a = ($a << wl + 1360 + 9081 - 4920) - $a + Ma,
                    $a &= $a;
                qa = $a
        """

        a = 0
        for i in data_string:
            _char = ord(i)
            a = (a << 5) - a + _char
            a &= a & 0xffffffff
        return ctypes.c_int32(a).value

    def aes_encrypt(text):
        """
        AES加密
        """
        # "4E2918885FD98109869D14E0231A0BF4"
        # "16B17E519DDD0CE5B79D7A63A4DD801C"

        key = binascii.a2b_hex('4E2918885FD98109869D14E0231A0BF4')
        iv = binascii.a2b_hex('16B17E519DDD0CE5B79D7A63A4DD801C')
        pad = 16 - len(text) % 16
        text = text + pad * chr(pad)
        text = text.encode()
        cipher = AES.new(key, AES.MODE_CBC, iv)
        encrypt_bytes = cipher.encrypt(text)
        return binascii.b2a_hex(encrypt_bytes).decode()

    def create_wt():
        """
        h5_plugins.js文件
        for (Wt = "",
            Kt = xc + yc + -7598 + 4607,
            zt = cs + "৮঺৪঺৫হঽ৫২"; Kt < zt.length; Kt++)
                Wt += String["f" + ls + "de"](-1746 + Hc + 14157 ^ zt[ps + us + "CodeAt"](Kt));
        """
        return "mg3c3b04ba"

    def create_ckey(vid, tt, version, platform, guid):
        wt = create_wt()
        ending = "https://w.yangshipin.cn/|mozilla/5.0 (macintosh; ||Mozilla|Netscape|MacIntel|"

        data_list = ["", vid, tt, wt, version, guid, platform, ending]
        string = "|".join(data_list)
        qa = create_qa(string)
        encrypt_string = "|{}{}".format(qa, string)
        ckey = "--01" + aes_encrypt(encrypt_string).upper()
        return ckey

    def fetch_vkey(session, vid, rnd, app_ver, platform, flow_id, guid, ckey):
        params = {
            "callback": "txplayerJsonpCallBack_getinfo_711482",
            "charge": "0",
            "defaultfmt": "auto",
            "otype": "json",
            "guid": guid,
            "flowid": flow_id,
            "platform": platform,
            "sdtfrom": "v7007",
            "defnpayver": "0",
            "appVer": app_ver,
            "host": "w.yangshipin.cn",
            "ehost": "https://w.yangshipin.cn/video",
            "refer": "w.yangshipin.cn",
            "sphttps": "1",
            "_rnd": rnd,  # _rnd: x.getTimeStampStr(),
            "spwm": "4",
            "vid": vid,
            "defn": "auto",
            "show1080p": "false",
            "dtype": "1",
            "clip": "4",
            "fmt": "auto",
            "defnsrc": "",
            "fhdswitch": "",
            "defsrc": "1",
            "sphls": "",
            "encryptVer": "8.1",
            "cKey": ckey,
        }

        headers = {
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, '
                          'like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            'referer': 'https://m.yangshipin.cn/',
        }
        url = "https://playvv.yangshipin.cn/playvinfo"

        res = session.get(url=url, params=params, headers=headers)
        text = res.text.strip("txplayerJsonpCallBack_getinfo_711482")[1:-1]
        res_dict = json.loads(text)
        return res_dict

    def txplayerJsonpCallBack_getinfo_711482(session, response, video_url, vid, guid, pid):
        download_params = {
            "sdtfrom": "v7007",
            "guid": guid,
            "vkey": response["vl"]['vi'][0]['fvkey'],
            "platform": "2",
        }
        # 视频下载连接视频 # FlOO10002
        download_url = "https://mp4playcloud-cdn.ysp.cctv.cn/{}.iHMg10002.mp4?{}".format(vid, urlencode(download_params))

        # 播放视频
        params = {
            "BossId": 2865,
            "Pwd": 1698957057,
            "_dc": random.random()  # "&_dc=".concat(Math.random()))
        }
        data = {
            "uin": "",
            "vid": vid,
            "coverid": "",
            "pid": pid,
            "guid": guid,
            "unid": "",
            "vt": "0",
            "type": "3",
            # "url": "https://w.yangshipin.cn/video?type=0&vid=d000035rirv",
            "url": video_url,
            "bi": "0",
            "bt": "0",
            "version": "1.3.2",
            "platform": "4330701",
            "defn": "0",
            # "ctime": "2021-06-02 09:30:01",
            "ctime": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ptag": "",
            "isvip": "-1",
            "tpid": "13",
            "pversion": "h5",
            "hc_uin": "",
            "hc_vuserid": "",
            "hc_openid": "",
            "hc_appid": "",
            "hc_pvid": "0",
            "hc_ssid": "",
            "hc_qq": "",
            "hh_ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML  like Gecko) Chrome/90.0.4430.212 Safari/537.36",
            "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML  like Gecko) Chrome/90.0.4430.212 Safari/537.36",
            "ckey": "",
            "iformat": "0",
            "hh_ref": video_url,
            "vuid": "",
            "vsession": "",
            "format_ua": "other",
            "common_rcd_info": "",
            "common_ext_info": "",
            "v_idx": "0",
            "rcd_info": "",
            "extrainfo": "",
            "c_channel": "",
            "vurl": download_url,
            "step": "6",
            "val": "164",
            "val1": "1",
            "val2": "1",
            "idx": "0",
            "c_info": "",
            "isfocustab": "0",
            "isvisible": "0",
            "fact1": "",
            "fact2": "",
            "fact3": "",
            "fact4": "",
            "fact5": "",
            "cpay": "0",
            "tpay": "0",
            "dltype": "1"
        }
        url = "https://btrace.yangshipin.cn/kvcollect"
        session.post(
            url=url,
            params=params,
            data=data,
            headers={
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, '
                              'like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                'referer': 'https://m.yangshipin.cn/',
            }
        )

    def task(video_url):
        """ 爬虫 + 逆向 """
        # video_url = "https://yangshipin.cn/video/home?vid=k000094nwrl"
        for i in range(5):
            try:
                session = requests.Session()
                platform = "4330701"
                app_ver = "1.3.2"
                rnd = str(int(time.time()))
                vid = parse_qs(urlparse(video_url).query)['vid'][0]
                guid = javascript_file.call('createGUID')
                pid = javascript_file.call('createGUID')
                flow_id = "{}_{}".format(pid, platform)

                ckey = create_ckey(vid, rnd, app_ver, platform, guid)
                vkey_info = fetch_vkey(session, vid, rnd, app_ver, platform, flow_id, guid, ckey)
                txplayerJsonpCallBack_getinfo_711482(session, vkey_info, video_url, vid, guid, pid)
                session.close()
                return
            except Exception as e:
                pass

        with ERROR_LOCK:
            global ERROR_COUNT
            ERROR_COUNT += 1

    def run():
        while True:
            # 1.去redis的队列中获取待执行的订单号
            oid = get_redis_task()
            print("订单号：", oid)
            if not oid:
                continue

            # 2.连接数据库获取订单信息
            order_object = get_order_info_by_id(oid)
            print("连接数据库")
            if not order_object:
                continue

            # 3.更新订单状态-正在执行
            print("开始执行：", oid)
            update_order_status(oid, 2)

            # 4.执行订单-线程池 20
            pool = ThreadPoolExecutor(20)
            for i in range(order_object.count):  # 100
                pool.submit(task, order_object.url)
                print(order_object.url)
            pool.shutdown()  # 等待20线程把100个人任务执行完成

            # 5.如果有错误，就继续执行
            global ERROR_COUNT
            while ERROR_COUNT:
                print("有错误：", ERROR_COUNT)
                run_count = ERROR_COUNT
                ERROR_COUNT = 0
                pool = ThreadPoolExecutor(20)
                for i in range(run_count):
                    pool.submit(task, order_object.url)
                pool.shutdown()  # 等待20线程把100个人任务执行完成

            # 6.更新订单状态-已完成
            update_order_status(oid, 3)

            print("执行完毕：", oid)

    if __name__ == '__main__':
        run()

    ```
  - `settings.py`

    ```python
    REDIS_PARAMS = {
        "host": '127.0.0.1',
        "port": "6379",
        "password": None,
        "encoding": 'utf-8'
    }

    QUEUE_TASK_NAME = "YANG_TASK_QUEUE"

    MYSQL_CONN_PARAMS = {
        'host': "127.0.0.1",
        'port': 3306,
        'user': 'root',
        'passwd': "123456",
        'charset': "utf8",
        'db': "django_database",
    }
    ```
- 打包 - 可执行文件

  ```
  pip install pyinstaller
  ```

  ```
  - windows -> windows包
  - mac     -> windows包
  ```

  ```python
  pip install pyinstaller
  pyinstaller -D app.py  # 生成一个文件夹 dist\app\
  pyinstaller -F app.py  # 只生成单个文件 dist\app.exe
  ```

**一些问题：**

- 出现错误的话重新循环任务吗？

  - 错误重试，已经完成。
  - 程序突然关闭

    - 正常运行时，500次后，在数据库更新一次，已刷多少。
    - 崩溃

      ```
      - 状态，正在执行
      - 已刷，500
      ```
    - 重新打开时，先去找到所有的 正在执行 的订单，重新加入队列去执行（所有 - 已刷 = 未刷的）
  - 订单，已刷多少播放量
- 如果要把各执行状态写入到日志文件，应该怎么搞？

  - 日志

    - logging 模块，内置模块 + 线程安全
    - 第三方模块 日志模块
    - sentry日志（探针）

### 18 Web 项目部署

将项目部署到服务器上：

- 将代码从 本地 上传到 服务器
- 在服务器上 安装服务、配置环境、获取代码
- 启动服务

上传代码的方式有很多种，例如：FTP工具、scp命令、rsync服务、svn等，不过目前公司主流的都是使用 `git + 代码托管平台`

![[../assets/image-20251112165136-6rbs4wn.png]]

- 本地电脑，安装git + git命令 上传代码
- git 代码托管仓库，创建仓库
- 远端服务器，安装git + git命令 获取代码

通过 ssh 工具连接服务器 + 秘钥![[../../Python Web框架/assets/image-20251116205645-41x9rvc.png]]

#### 本地-上传代码

##### 首次提交代码

- 电脑上安装git

  ```
  https://git-scm.com/downloads
  ```
- 注册 gitee / github

  ```
  https://gitee.com/xxx
  ```
- 创建项目  
  ![[../../../Python/Python Web框架/assets/image-20220821182939134-20250830193451-vlys98p.png]]

  ```
  https://gitee.com/xxx/project.git
  ```
- 本地git配置 - 全局

  ```
  git config --global user.name "xxx"
  git config --global user.email "xxx@xxx.com"
  ```
- 进入项目目录
- 初始化（首次提交代码时需要）

  ```
  git init 
  git remote add origin https://gitee.com/xxx/project.git
  ```
- 提交代码 （以后代码更新后，只需进行之后的操作）

  ```
  git add .
  git commit -m '第一次提交，项目初始化'
  ```

  【注】需要忽略一些代码，通过 `.gitignore` 实现

  【注】区分 本地配置和线上配置（数据库连接），通过 `local_settings.py` 实现
- 提交到远程仓库

  ```
  git push origin master
  ```

##### gitignore

`.gitignore` 文件，写入文件名或文件夹，可以git忽略一些文件，不要进行版本控制

> GitHub 的 [`.gitignore`](https://git-scm.com/docs/gitignore) 文件模板集合：[https://github.com/github/gitignore](https://github.com/github/gitignore)

- python 中需要忽略的

  ```python
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

##### local_settings

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
编写 特有的配置
```

#### 服务器-拉取代码

操作方式：

- 使用的云服务器的 web 版本，直接通过命令操作

- 在本地电脑上利用 SSH 连接到远程服务器

  ```
  - mac，自带SSH、iTerm2
  - win，git集成的ssh、xshell、SecureCRT、FinalShell

  - 使用 ssh 连接
  	>>> ssh 用户名@IP
  	>>> 输入密码
  - 秘钥免密登录
  	- 公钥上传到服务器
  		>>> 本地电脑中（可用git bash）
  		>>> ssh-copy-id -i ~/.ssh/id_rsa.pub 用户名@ID
  		>>> 输入密码
  	- 之后再连接服务器，不用再输入密码
  ```

步骤：

- 安装 git（centos系统）

  ```python
  yum install git
  ```

- 克隆（第一次）

  ```powershell
  mkdir -p /data/project 	# 新建目录
  cd /data/project  		# 存放项目的位置
  git clone https://gitee.com/xxx/django_project.git # 克隆代码
  ```
- 获取更新

  ```
  cd /data/project/django_project
  git pull origin master
  ```

#### 密码或秘钥

本地提交 & 服务器拉取 代码，每次都需要输入密码

- 原方式

  ```powershell
  git remote add origin https://gitee.com/xxx/project.git
  git push origin master
  git clone https://gitee.com/xxx/project.git
  git pull origin master
  ```

- 改进（将密码写入 `remote`）

  ```powershell
  git remote remove origin  # 删除原来的 remote
  git remote add origin https://用户名:密码@github.com/xxx/project.git
  ```

- 密钥（利用工具生成：公钥、私钥）

  公钥（本地、服务器）拷贝到 代码托管仓库

  - 生成密钥

    ```powershell
    ssh-keygen -t rsa  # 一直按回车直到出现密钥
    ```
  - 读取公钥 

    ```powershell
    cat ~/.ssh/id_rsa.pub
    ```

    在代码托管平台的设置找到 <kbd>SSH公钥</kbd> 将公钥粘贴上去
  - 代码管理

    ```powershell
    # 提交代码
    git remote add origin git@github.com:xxx/project.git
    git add.
    git commit -m "commit message"
    git push origin master

    git clone https://gitee.com/用户名/仓库名.git
    git clone git@github.com:xxx/project.git
    git pull origin master
    ```

#### 关于版本

在本地的 git 每次执行 `commit` 命令时，都会生成一个提交记录，如果执行`git push`也会将记录提交到代码仓库。

各个版本之间进行切换：

- 查看目前的提交记录（当前的提交链）

  ```
  git log
  ```
- 查看所有分支的提交记录（包括分支切换、提交、合并、重置等操作）

  ```
  git reflog
  ```
- 跳转至指定版本

  ```
  git reset --hard xxx
  ```

【注】此命令可以在本地、线上执行

#### 配置服务器

基于腾讯云服务器 + CentOS 7.6

##### MySQL

- 服务器平台防火墙（安全组），添加 `3306` 端口的外部访问权限

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

    ```sql
    -- 创建用户
    CREATE USER 'stars'@'localhost'	IDENTIFIED BY '123456';  -- 只能被本机访问
    CREATE USER 'stars'@'119.126.%' IDENTIFIED BY '123456';  -- 可被外部访问
    -- 通过往授权表插记录创建（生产环境中不建议）
    insert into mysql.user(user,host,password) values('stars','127.0.0.1',password('123456'));  
    insert into mysql.user(user,host,password) values('stars','192.168.28.%',password('123456'));  
    flush privileges; -- 更新授权表（ INSERT / UPDATE / DELETE ）

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

    -- 删除匿名用户
    delete from mysql.user where host='localhost' and user='';
    delete from mysql.user where host='vm-0-11-centos' and user='';
    flush privileges;
    /*
    mysql 默认配置，在本机中可直接登录数据库无需账户和密码
    */

    -- 删除用户
    DROP USER 'stars'@'127.0.0.1';

    -- 登录新创建的用户
    mysql -u stars -p -- 默认登录的是 localhost，推荐重新创建一个 'stars'@'localhost'
    mysql -u stars -p -h 127.0.0.1 -- 强制使用 TCP/IP
    ```
  - 创建数据库

    ```sql
    CREATE DATABASE 数据库名 DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
    SHOW DATABASES;  -- 列出当前用户有权限看到的所有数据库
    ```
  - 为用户授权

    ```sql
    GRANT ALL PRIVILEGES ON 数据库.* TO stars@'localhost';
    GRANT ALL PRIVILEGES ON 数据库.* TO 'stars'@'119.126.%';
    GRANT SELECT, SHOW VIEW ON 数据库.* TO 'read'@'10.0.0.100'; --低权用户

    flush privileges;
    ```

##### Redis

- 安装

  ```
  yum install redis -y
  ```
- 配置

  ```powershell
  # 打开配置文件
  vim /etc/redis.conf  
  # 查找 ?内容
  ?requirepass
  # 'n' -- 下一个
  # 'i' -- 编辑
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

##### Python3

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

##### 虚拟环境

- 安装虚拟环境工具 `virtualenv` （Python官方社区）

  ```
  pip3.9 install virtualenv
  ```
- 创建虚拟环境目录 & 创建虚拟环境

  ```
  cd /root
  mkdir /envs
  virtualenv /envs/env_name --python=python3.9
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

  - `requirements.txt`

    ```python
    altgraph==0.17.4
    asgiref==3.9.1
    async-timeout==5.0.1
    certifi==2025.8.3
    cffi==2.0.0
    charset-normalizer==3.4.3
    cryptography==45.0.7
    Django==4.2.24
    django-db-connection-pool==1.2.6
    django-redis==6.0.0
    greenlet==3.2.4
    idna==3.10
    importlib_metadata==8.7.0
    packaging==25.0
    pefile==2023.2.7
    pycparser==2.23
    pycryptodome==3.23.0
    PyExecJS==1.5.1
    pyinstaller==6.16.0
    pyinstaller-hooks-contrib==2025.9
    PyMySQL==1.0.2
    pytz==2025.2
    pywin32-ctypes==0.2.3
    redis==6.4.0
    requests==2.32.5
    six==1.17.0
    SQLAlchemy==1.4.24
    sqlparams==6.2.0
    sqlparse==0.5.3
    tencentcloud-sdk-python==3.0.1466
    typing_extensions==4.15.0
    tzdata==2025.2
    urllib3==2.5.0
    zipp==3.23.0
    ```

##### local_settings 设置线上配置

- 创建 `local_settings`

  ```powershell
  cd /data/project/project_name/project_name
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
          'PASSWORD': '123456',
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
              "PASSWORD": "123456",
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

##### Nginx + uWSGI

![[../../Python Web框架/assets/image-20251118111016-99zsdcj.png]]

```
# 激活虚拟环境并安装 uwsgi + nginx
source /envs/env_name/bin/activate
yum install uwsgi -y
yum install nginx -y
```

- uWSGI

  uWSGI 作为 Python 应用的进程管理器 + WSGI 协议翻译器

  - 命令参数

    ```
    # 测试是否可运行，若没问题 ctrl-c 关闭
    uwsgi --http :80 --chdir /data/project/project_name --wsgi-file project_name/wsgi.py --master --processes 4 --static-map /static=/data/project/project_name/allstatic
    ```
  - 文件参数

    ```powershell
    cd /data/project/django_lufei<project_name>/shell
    vim django_project<project_name>_uwsgi.ini
    ```

    ```ini
    [uwsgi]
    socket = 127.0.0.1:8001  # Nginx + uWSGI 在同一台服务器
    chdir = /data/project/django_lufei<project_name>/
    wsgi-file = project_name/wsgi.py
    processes = 4
    static-map = /static=/data/project/django_project<project_name>/allstatic
    virtualenv = /envs/env_name/
    ```

    ```powershell
    uwsgi --ini  django_project<project_name>_uwsgi.ini & # 运行
    ```

- nginx

  利用 nginx 做反向代理和处理静态文件

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
              alias  /data/project/project_name/allstatic/; # *
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

##### shell 脚本

- ```powershell
  /data/project/django_lufei<project_name>/shell
  	└── reboot.sh
  	└── stop.sh
  	└── django_project<project_name>_uwsgi.ini
  ```

- `reboot.sh`

  ```bash
  #!/usr/bin/env bash

  echo -e "\033[34m--------------------wsgi process--------------------\033[0m"

  ps -ef|grep django_project<project_name>_uwsgi.ini | grep -v grep

  sleep 0.5

  echo -e '\n--------------------going to close--------------------'

  ps -ef |grep django_project<project_name>_uwsgi.ini | grep -v grep | awk '{print $2}' | xargs kill -9

  sleep 0.5

  echo -e '\n----------check if the kill action is correct----------'

  /envs/Django-LuFei<env_name>/bin/uwsgi  --ini django_project<project_name>_uwsgi.ini &  >/dev/null

  echo -e '\n\033[42;1m----------------------started...----------------------\033[0m'
  sleep 1

  ps -ef |grep django_project<project_name>_uwsgi.ini | grep -v grep
  ```

- `stop.sh`

  ```bash
  #!/usr/bin/env bash

  echo -e "\033[34m--------------------wsgi process--------------------\033[0m"

  ps -ef |grep django_project<project_name>_uwsgi.ini | grep -v grep

  sleep 0.5

  echo -e '\n--------------------going to close--------------------'

  ps -ef |grep django_project<project_name>_uwsgi.ini | grep -v grep | awk '{print $2}' | xargs kill -9

  sleep 0.5
  ```
- 添加权限

  ```powershell
  chmod 755 reboot.sh stop.sh
  ./reboot.sh
  ```

#### 域名和解析

- 申请域名 -> 备案
- 解析：将域名与服务器 ip 绑定

#### https

- SSL证书 -> 免费证书 -> 创建证书
- 填写申请：绑定域名、验证 。。。
- 添加 DNS解析记录
- 下载证书文件 - Nginx -> 上传到服务器 `/data/ssl`
- 修改 nginx 配置（增加对https的支持）

  ```powershell
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
          server_name  server_name.com; # 域名
  		rewrite ^(.*) https://$server_name$1 redirect

      server {
          listen       443 ssl;
          server_name  server_name.com; # 域名
  		
          ssl_certificate      /data/ssl/xxx.com.pem; # 证书文件
          ssl_certificate_key  /data/ssl/xxx.com.key; # 私钥文件

          ssl_session_cache    shared:SSL:1m;
          ssl_session_timeout  5m;
          ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
          ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
          ssl_prefer_server_ciphers  on;

  		# 静态文件 
  		location /static {
              alias  /data/project/project_name/allstatic/;
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
  systemctl restart nginx
  ./reboot.sh
  ```

#### 遇到的问题

1. 安装 mysqlclient 包时出现的问题

    已安装了相关的依赖但是仍无法安装成功

    解决办法：使用 PyMySQL 作为替代 `pip install PyMySQL`

    ```powershell
    # init.py (与 settings.py 同级)
    import pymysql
    pymysql.install_as_MySQLdb()
    ```

2. 运行 uWSGI 出现报错：ImportError: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'OpenSSL 1.0.2k-fips'

    urllib3 版本太高，不兼容系统的 OpenSSL 1.0.2

    解决办法：降级 urllib3

    ```powershell
    source /envs/Django-LuFei<env_name>/bin/activate
    pip install "urllib3<2" 
    pkill -9 uwsgi
    uwsgi --ini django_project<project_name>_uwsgi.ini &
    ```

---

## 项目功能梳理

- 权限和菜单

  - 动态菜单，不同用户角色【配置文件】

    ```
    - 配置文件，写配置用户级别配置 + 默认配置
    - 构造属于自己的结构：权限、菜单字典。
    - 数据库获取用户角色
    ```
  - 默认选中和展开

    ```
    - inclusion_tag
    ```
  - 权限校验

    ```
    - 中间件
    - request.nb_user 赋值
    ```
  - 控制按钮是否显示

    ```
    - filter，模板语言中的 if-else 的条件
    ```
- 基于 `Form` 和 `ModelForm` 实现 增删改查
- 构建的了 `BootStrapForm类` 实现 BootStrap 样式 + 免除 BootStrap 样式
- 删除 / 撤单

  - 直接超链接删除，跳转
  - 对话框 + ajax 删除（推荐）
  - 直接超链接删除，跳转 + message => 成功和失败的提醒。（推荐）
- 添加 和 编辑

  - 跳转到 添加和编辑页面，成功后跳转回来
  - 对话框 + ajax
- 原条件保留

  - 删除
  - 编辑
- 分页
- 关键字搜索
- 组合搜索

