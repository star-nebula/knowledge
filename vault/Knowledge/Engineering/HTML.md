---
title: HTML
created: 2026-05-22
tags:
  - HTML
  - 前端
type: 概念解释
related:
  - "[[Frontend-MOC]]"
  - "[[Knowledge/Engineering/CSS]]"
  - "[[Knowledge/Engineering/JavaScript]]"
  - "[[JSON]]"
  - "[[Bootstrap]]"
reference:
category: ["🛠️ 工程工具"]
---

## HTML

![[assets/image-20250820102641-8ccnbat.png]]

- 标签语法

  ```python
  <标签名 属性1=“属性值1” 属性2=“属性值2”……>内容部分</标签名>
  <标签名 属性1=“属性值1” 属性2=“属性值2”…… />
  ```
- 基本标签

  - 标题标签：`<h1>一级标题</h1>`​ ... `<h6>六级标题</h6>`​
  - 段落标签：`<p>段落</p>`​
  - 换行标签

    ```html
    <!-- 普通换行 -->
    <p>第一段</p>自动添加的空行
    <p>第二段</p>

    <!-- 强制换行 -->
    第一行<br>第二行

    <!-- 保留文本中的全部内容包括前面的间距 -->
    <pre>
    	第一行
    	第二行
    </pre>
    ```
  - 文本格式化标签

    ```html
    <b>粗体1</b>
    <strong>粗体2</strong>
    <em>斜体1</em>
    <i>斜体2</i>
    <del>删除文本</del>
    ```
  - 特殊符号

    ```html
    &reg;  显示注册商标符号
    &nbsp; 显示一个“不换行空格”
    &copy; 显示版权符号
    ```
  - 块级标签：`<div>`​ 独占一行，划分块
  - 内联标签：`<span>`​ 共享一行，对行内元素渲染
- 超链接 标签

  - 锚点（命名锚记）：用于实现页面的跳转
  - 语法：

    ```html
    <a href="网络链接/本地链接" target="_blanks / _self / _parent / _top" title="链接提示信息">链接名</a>

    <!-- 网站跳转 -->
    <a href="https://www.baidu.com">百度</a>
    <!-- 页面内跳转 -->
    <a href="#i1">第一章</a>
    <div id="i1">
    	<p>第一章内容</p>
    </div>
    ```
  - target

    - ​`_blank`​ [ 在新建窗口中打开网页 ]
    - ​`_self`​  [ 默认值，覆盖自身窗口打开网页 ]
    - ​`_parent`​ [ 在父级框架中打开网页 ]
    - ​`_top`​  [ 在顶级框架中打开网页 ]
    - ​`framename`​ [  在指定的框架中打开网页] 非固定值
- ​`img`​标签

  - 属性

    - ​`src`​ 指定图像的URL地址
    - ​`alt`​ 图像无法显示时的替换文本
    - ​`width`​ 高度
    - ​`height`​ 宽度
    - ​`border`​ 边框宽度，默认为0
    - ​`title`​ 悬浮提示文字
  - 点击图片跳转 `<a><img src="" alt=""></a>`​
- 列表标签

  - 无序列表

    ```html
    <ul type = "disc / circle / square"> 
    	<li>张三</li> 
    	<li>李四</li> 
    	<li>王五</li> 
    </ul>
    ```

    - ​`disc`​ 默认实心圆
    - ​`circle`​ 空心圆
    - ​`square`​ 实心方块
  - 有序列表

    ```html
    <ol start = "1000"> 
    	<li>张三</li> 
    	<li>李四</li> 
    	<li>王五</li> 
    </ol>
    ```

    - ​`start`​  从第几个数字开始计数
- 表格标签

  - table 结构

    ```html
    <table border="1"> 
    	<tr> 	
    		<th>表头1</th>
    		<th>表头2</th>
    		…… 	
    	</tr> 
    	<tr> 	
    		<td>单元格的内容</td> 	
    		<td>单元格的内容</td> 
    		…… 	
    	</tr> 	
    	…… 
    </table>
    ```

    - ​`border`​ 表格的边框宽度，默认为0（不显示边框）
  - 属性

    ||属性|值|描述|
    | :-----------------------------------------------------: | ------| --------------| ------------------------------|
    |table 属性<br />和 <br />td 属性<br />|​`width`​|px、%|宽度|
    ||​`height`​|px、%|高度|
    ||​`align`​|​`left`​、`center`​、`right`​|对齐方式|
    ||​`bgcolor`​|​`rgb(x,x,x)`​、`#xxxxxx`​、`colorname`​|背景颜色|
    ||​`background`​|​`url`​|背景图片|
    |table 属性<br />|​`border`​|px|边框宽度|
    ||​`cellpadding`​|px、%|单元格边框与其内容之间的空白|
    ||​`cellspacing`​|px、%|单元格之间的空隙|
    |td属性<br />|​`valign`​|​`top`​、`middle`​、`bottom`​|单元格内容的垂直对齐方式|
    ||​`rowspan`​|number|单元格合并的列数|
    ||​`colspan`​|number|单元格合并的列数|
- 表单标签

  - ​`form`​ 用于创建表单，每个表单都可以包含一到多个表单域或按钮。

    ```html
    <form action="http://127.0.0.1:8888" method="post" enctype="application/x-www-form-urlencoded">

        <p>
            <label for="user">姓名：</label>
            <input type="text" name="user" placeholder="用户名" id="user"></p>
        <p>密码：<input type="password" name="pwd"></p>
        <p>爱好：
            篮球<input checked="checked" type="checkbox" name="hobby" value="basketball">
            足球<input type="checkbox" name="hobby" value="football">
            双色球<input type="checkbox" name="hobby" value="shuangseqiu">
        </p>
        <p>
            性别：
            男<input type="radio" name="gender" value="1">
            女<input type="radio" name="gender" value="2">
            其它<input type="radio" name="gender" value="3">
        </p>
            
        <p>
            生日： <input type="date" name="birth">
        </p>

        <p>
            籍贯：
            <select name="province" multiple="multiple" size="3">
                <option value="hubei">湖北省</option>
                <option value="hebei">河北省</option>
                <option value="dongbei" selected="selected">东北省</option>
            </select>
        </p>

        <p>
            <textarea name="info" cols="50" rows="10" placeholder="个人简介"></textarea>
        </p>

        <p>
            <input type="button" value="按钮">
            <input type="reset" value="reset">
            <input type="submit">
            <button>提交数据</button>
        </p>

    </form>
    ```

  - 属性

    |属性|值|描述|
    | ---------| ----------------------------------------------------------------------------------------------------------------| -------------------------------|
    |action|访问服务器地址|服务器端表单处理程序的URL地址|
    |method|​`post`​、`get[默认值]`​|表单数据的提交方法|
    |target|参考超链接的`target`​属性|表单数据提交时URL的打开方式|
    |enctype|application/x-www-form-urlencoded[默认值]<br />multipart/form-data [用于文件上传]<br />text/plain [用于纯文本数据发送]|表单提交数据时的编码方式|

    - target URL的打开方式

      - ​`framename`​ [  在指定的框架中打开网页] 非固定值
      - ​`_top`​  [ 在顶级框架中打开网页 ]
      - ​`_parent`​ [ 在父级框架中打开网页 ]
      - ​`_self`​  [ 默认值，覆盖自身窗口打开网页 ]
      - ​`_blank`​ [ 在新建窗口中打开网页 ]

‍
