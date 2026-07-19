---
title: Python 爬虫
created: 2026-05-22
tags:
  - Python
  - 爬虫
  - requests
  - BeautifulSoup
  - xpath
  - 正则表达式
  - Selenium
type: 步骤操作
related:
  - "[[Python-MOC]]"
  - "[[Python Socket 编程]]"
  - "[[Python 标准库]]"
reference:
category: ["🛠️ 工程工具", "Python"]
---

# Python 爬虫：requests 请求与数据解析

> **学习目标**：掌握 HTTP 请求原理、requests 模块用法、四种数据解析方式（正则/bs4/xpath/pyquery）、Selenium 自动化。

---

## 1 HTTP 协议基础

### 1.1 请求与响应结构

**请求（Request）**：
```
请求行：请求方式(GET/POST) + URL + 协议版本
请求头：User-Agent、Referer、Cookie 等附加信息
请求体：POST 请求的参数数据
```

**响应（Response）**：
```
状态行：协议版本 + 状态码（200/404/500）
响应头：Content-Type、Set-Cookie 等
响应体：HTML/JSON 等实际内容
```

### 1.2 爬虫重点关注的请求头

| 请求头 | 说明 |
|--------|------|
| `User-Agent` | 请求载体身份标识（浏览器类型） |
| `Referer` | 请求来源页面（反爬防盗链） |
| `Cookie` | 用户登录信息、反爬 token |

### 1.3 请求方式

| 方式 | 说明 | 数据位置 |
|------|------|---------|
| `GET` | 明文请求，参数在 URL 中 | URL 查询字符串 |
| `POST` | 隐式请求，参数在请求体中 | Request Body |

---

## 2 requests 模块

安装：`pip install requests`

### 2.1 基本 GET 请求

```python
import requests

url = "http://www.baidu.com"
resp = requests.get(url)
resp.encoding = "utf-8"
print(resp.text)  # 页面源代码
```

### 2.2 带参数的 GET 请求

```python
import requests

url = "https://movie.douban.com/j/chart/top_list"
params = {
    "type": "13",
    "interval_id": "100:90",
    "start": "0",
    "limit": "20"
}
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
resp = requests.get(url, params=params, headers=headers)
print(resp.json())  # JSON 响应直接解析
```

### 2.3 POST 请求

```python
import requests

url = "https://fanyi.baidu.com/sug"
data = {"kw": "hello"}
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}
resp = requests.post(url, data=data, headers=headers)
print(resp.json())
```

### 2.4 响应对象属性

| 属性/方法 | 说明 |
|-----------|------|
| `resp.text` | 响应文本（字符串） |
| `resp.content` | 响应字节（二进制，用于图片/文件） |
| `resp.json()` | 解析 JSON 响应 |
| `resp.status_code` | 状态码 |
| `resp.headers` | 响应头 |
| `resp.url` | 最终 URL（含重定向） |
| `resp.encoding` | 编码方式 |

---

## 3 数据解析

### 3.1 正则表达式（re 模块）

Python 内置模块，速度快、准确性高，但上手难度较高。

**常用元字符**：

| 元字符 | 含义 |
|--------|------|
| `.` | 匹配除换行符外的任意字符 |
| `\w` | 匹配字母/数字/下划线 |
| `\d` | 匹配数字 |
| `\s` | 匹配空白符 |
| `^` / `$` | 字符串开始/结束 |
| `*` / `+` / `?` | 零次或多次 / 一次或多次 / 零次或一次 |
| `{n,m}` | n 到 m 次 |
| `.*` | 贪婪匹配（尽可能多） |
| `.*?` | 惰性匹配（尽可能少） |

**re 模块核心方法**：

```python
import re

# findall：查找全部，返回列表
re.findall(r"\d+", "今年18岁，有100万")  # ['18', '100']

# finditer：返回迭代器（大数据量推荐）
for m in re.finditer(r"\d+", "今年18岁"):
    print(m.group())  # '18'

# search：只匹配第一个
m = re.search(r"\d+", "我是21级1班")
print(m.group())  # '21'

# compile：预加载正则（重复使用推荐）
pattern = re.compile(r"(.*?)")
result = pattern.findall(html_str)
```

**分组提取**：

```python
html = "<div class='info'>中国联通</div>"

# 命名分组
pattern = re.compile(r"\d+)'>(?P<name>.*?)")
for m in pattern.finditer(html):
    print(m.group("id"))    # 10010
    print(m.group("name"))  # 中国联通
```

### 3.2 BeautifulSoup（bs4）

安装：`pip install bs4`

```python
from bs4 import BeautifulSoup

html = """
<ul>
    <li id="abc"><a href="/0/">剧情片</a></li>
    <li id="abc"><a href="/3/">爱情片</a></li>
    <li><a href="/14/">战争片</a></li>
</ul>
"""

page = BeautifulSoup(html, "html.parser")

# find：匹配第一个
li = page.find("li", attrs={"id": "abc"})
print(li.find("a").text)        # 文本
print(li.find("a").get("href")) # 属性值

# find_all：匹配所有
for li in page.find_all("li"):
    a = li.find("a")
    print(a.text, a.get("href"))
```

**实战：爬取表格数据**

```python
import requests
from bs4 import BeautifulSoup

resp = requests.get("https://example.com/data")
page = BeautifulSoup(resp.text, "html.parser")
table = page.find("table", attrs={"class": "data-table"})

for tr in table.find_all("tr")[1:]:  # 跳过表头
    tds = tr.find_all("td")
    print(tds[0].text, tds[1].text, tds[2].text)
```

### 3.3 XPath（lxml）

安装：`pip install lxml`

XPath 在 XML/HTML 文档中查找信息的语言。

**核心语法**：

| 表达式 | 含义 |
|--------|------|
| `/` | 从根节点定位，表示一个层级 |
| `//` | 任意位置，表示多个层级 |
| `*` | 通配符 |
| `text()` | 获取节点文本 |
| `@属性名` | 获取属性值 |
| `[n]` | 选择第 n 个 |
| `[@attr='value']` | 属性筛选 |

```python
from lxml import etree

html = """
<ul>
    <li><a href="https://baidu.com">百度</a></li>
    <li><a href="https://google.com">谷歌</a></li>
</ul>
"""

et = etree.HTML(html)

# 获取所有链接文本
texts = et.xpath("//li/a/text()")  # ['百度', '谷歌']

# 获取所有 href
hrefs = et.xpath("//li/a/@href")  # ['https://baidu.com', ...]

# 遍历节点提取多属性
for li in et.xpath("//li"):
    text = li.xpath("./a/text()")[0]
    href = li.xpath("./a/@href")[0]
    print(text, href)
```

### 3.4 pyquery

安装：`pip install pyquery`

```python
from pyquery import PyQuery as pq

html = '<div class="aaa">哒哒哒</div><div class="bbb">嘟嘟嘟</div>'
doc = pq(html)

# 选择元素
print(doc(".aaa").text())  # 哒哒哒

# 修改 HTML
doc(".aaa").after('<div class="ccc">嘿嘿</div>')
doc(".aaa").html("新内容")
doc(".aaa").attr("data-id", "123")
print(doc)
```

### 3.5 解析方式对比

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **正则** | 速度快、灵活 | 语法复杂 | 结构不规则的文本 |
| **bs4** | API 友好、容错性好 | 速度一般 | 快速开发 |
| **xpath** | 语法简洁、速度快 | 需学 xpath 语法 | 结构化 HTML/XML |
| **pyquery** | jQuery 风格、易上手 | 依赖较多 | 前端开发者友好 |

---

## 4 Selenium 自动化

安装：`pip install selenium`

用于处理 JavaScript 渲染的页面、需要模拟用户操作的场景。

### 4.1 浏览器驱动配置

| 浏览器 | 驱动下载地址 |
|--------|-------------|
| Chrome | [ChromeDriver](https://sites.google.com/chromium.org/driver/) |
| Firefox | [geckodriver](https://github.com/mozilla/geckodriver/releases) |
| Edge | [Edge WebDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/) |

驱动版本需与浏览器版本对应。

### 4.2 基本使用

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

options = webdriver.ChromeOptions()
options.add_experimental_option("useAutomationExtension", False)
options.add_experimental_option("excludeSwitches", ["enable-automation"])

driver = webdriver.Chrome(options=options)
driver.get("https://www.baidu.com")

# 查找元素
input_box = driver.find_element(By.ID, "kw")
input_box.send_keys("Python")
driver.find_element(By.ID, "su").click()

# 获取页面源码
print(driver.page_source)
driver.quit()
```

---

## 5 定时爬虫

使用 `apscheduler` 实现定时任务：

```bash
pip install apscheduler
```

```python
from apscheduler.schedulers.blocking import BlockingScheduler

def run_spider():
    print("启动爬虫...")
    # 爬虫逻辑

sched = BlockingScheduler()
# 每天 10:15 执行
sched.add_job(run_spider, "cron", hour=10, minute=15)
# 或每 3 分钟执行
# sched.add_job(run_spider, "interval", minutes=3)
sched.start()
```

---

## 相关链接

- [[Python Socket 编程]] — TCP/UDP 底层通信
- [[Python 标准库]] — re/json 模块参考
