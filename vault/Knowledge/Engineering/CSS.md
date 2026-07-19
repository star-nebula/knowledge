---
title: CSS
created: 2026-05-22
tags:
  - CSS
  - 前端
  - 样式
type: 概念解释
related:
  - "[[Frontend-MOC]]"
  - "[[Knowledge/Engineering/HTML]]"
  - "[[Knowledge/Engineering/JavaScript]]"
  - "[[Bootstrap]]"
reference:
category: ["🛠️ 工程工具"]
---

## CSS

![[assets/CSS-20250921115606-amb6jnm.png]]

### 3 种引入方式

1. 行内样式

    写在元素的 `style`​​<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">属性</span>中

    ```html
    <div style="color: white; background-color: #369; text-align: center">行内设置</div>
    ```

2. 嵌入式

    写在 `head`​ 中的 `style`​​<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">标签</span>中

    ```html
    <style>
    	div{
    	color: white;
    	background-color: #369;
    	text-align: center
    }
    </style>
    ```

3. 链接式

    将 css 写在 后缀为 `.css`​ 的外部样式表

    在 `head`​ 中使用 `link`​ 标签的 `href`​​<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">属性</span> 引入文件

    ```html
    <link rel="stylesheet" href="common.css">
    ```

### 选择器

- 基本选择器

  |选择器类型|语法|描述|
  | --------------------------------------------------------------------------------------------------------| ---------------------------------| ------------------------------------------------|
  |<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">标签</span>选择器|​`标签名{...}`​|选中页面中所有指定类型的 HTML 标签|
  |<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">class</span> 选择器|​`.class_name{...}`​|选中所有拥有指定`class`​属性值的元素，可复用|
  |<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">ID</span> 选择器|​`#id_name{...}`​|选中页面中唯一拥有指定`id`​属性值的元素，不可复用|
  |<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">通配</span>选择器|​`*{...}`​|选中页面中所有 HTML 元素，常用于统一初始化样式|

- 组合选择器

  |选择器类型|语法格式|作用描述|
  | ----------------| ----------| ----------------------------------------------|
  |后代选择器|​`选择器1 选择器2 选择器3{ ... }`​|选中 “选择器 1” 包含的所有后代元素<br />|
  |子选择器|​`选择器1 > 选择器2 { ... }`​|仅选中 “选择器 1” 的直接子元素<br />|
  |相邻兄弟选择器|​`选择器1 + 选择器2 { ... }`​|选中 “选择器 1” 紧接在后的第一个兄弟元素<br />|
  |通用兄弟选择器|​`选择器1 ~ 选择器2 { ... }`​|选中 “选择器 1” 之后所有同级的兄弟元素<br />|
  |并集选择器|​`选择器1, 选择器2, 选择器3 { ... }`​|同时选中多个选择器各自匹配的所有元素<br />|
- 属性选择器

  |选择器类型|语法格式|作用描述||
  | :-----------| :---------| :---------------------------------------------------| --|
  |**存在**属性选择器|​`[attr] { ... }`​|选中所有包含指定属性的元素，无论属性值是什么||
  |**精确值**属性选择器|​`[attr="value"] { ... }`​|选中所有指定属性的值**完全等于**目标值的元素||
  |**包含词**属性选择器|​`[attr~="value"] { ... }`​|选中指定属性的值中**包含目标值作为独立单词**的元素（值之间用空格分隔）||
  |**前缀**属性选择器|​`[attr^="value"] { ... }`​|选中指定属性的值**以目标值为开头**的元素（无论是否为独立单词）||
  |**后缀**属性选择器|​`[attr$="value"] { ... }`​|选中指定属性的值**以目标值为结尾**的元素（无论是否为独立单词）||
  |**包含子串**属性选择器|​`[attr*="value"] { ... }`​|选中指定属性的值中**包含目标值作为子串**的元素（目标值可出现在任意位置）||
- 伪类选择器

  |伪类类别|伪类语法|作用描述|
  | :---------| :---------| :-----------------------------------|
  |**链接伪类**|​`:link`​|选中所有**未被访问过**的链接元素|
  ||​`:visited`​|选中所有**已被访问过**的链接元素|
  |**用户行为伪类**|​`:hover`​|选中鼠标**指针悬停**在上面的元素|
  ||​`:active`​|选中**被用户激活**（如点击过程中）的元素|
  ||​`:focus`​|选中**获得焦点**的元素（如表单输入框被选中时）|
  |**结构伪类**|​`:first-child`​|选中父元素的第一个子元素|
  ||​`:last-child`​|选中父元素的最后一个子元素|

  - anchor 伪类（链接伪类）：控制链接的显示效果

    - 书写顺序：`:link → :visited → :hover → :active`​
  - 【示例】链接伪类

    ```html
    <style>
            a:link{
                color: red;
            }
            a:visited{
                color: coral;
            }
            a:hover{
                color: blue;
            }
            a:active{
                color: rebeccapurple;
            }
    </style>
    ```

  - 【示例】

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            .c1 p{
                color: green;
            }
            .c1 p:first-child{
                color: red;
            }
            .c1 div:last-child{
                color: red;
            }
            p#i1:after{
                content:"hello";
                color:red;
                display: block;
            }
        </style>
    </head>
    <body>

    <div class="c1">
        <p>item</p>
        <p>item</p>
        <div>item</div>
        <p>item</p>
    </div>
    <a class="c1">
        <div>item</div>
        <p>item</p>
        <div>item</div>
    </a>
    <p id="i1">p标签</p>
    </body>
    </html>
    ```
- before / after 伪元素：在元素内插入额外的虚拟子元素

  - ​[`::before`](https://www.w3school.com.cn/cssref/selector_before.asp)​：在元素**内容的前面**插入虚拟内容（作为元素的第一个子节点）
  - ​[`::after`](https://www.w3school.com.cn/cssref/selector_after.asp)​：在元素**内容的后面**插入虚拟内容（作为元素的最后一个子节点）

### 样式继承

|类别|可继承的属性|
| :-----| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|**文本相关**|color、<br />font-family、font-size、font-style、font-variant、font-weight、font、<br />letter-spacing、line-height、<br />text-align、text-indent、text-transform、<br />white-space、word-spacing<br />|
|**字体相关**|font-family、font-size、font-style、font-variant、font-weight、font（字体复合属性）|
|**列表相关**|list-style、list-style-image、list-style-position、list-style-type|
|**表格相关**|border-collapse（部分场景）、caption-side|
|**其他**|visibility、cursor、quotes|

- 【Tip】

  - css 的继承权重比普通元素的权重还低
  - 一些布局相关的属性不能被继承，如：border, margin, padding, background 等

### 选择器优先级 （Specificity）

- css 优先级

  - 同一来源（选择器权重）：`!important > 行内样式 > ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性`​
  - 跨来源

    - 用户 `!important`​（User !important）
    - 开发者 `!important`​（Author !important）
    - 开发者普通样式（Author Normal）
    - 用户自定义样式（User）
    - 浏览器 UA 样式（User-Agent）
  - 同一权重，后者居上
- 选择器（从高到低）

  |权重等级（从高到低）|对应选择器类型|权重值（a, b, c, d）|说明|
  | ------------------------| -------------------| ----------------------| ----------------------------------------------------|
  |内联样式（行内样式）|元素的 `style`​ 属性|(1, 0, 0, 0)|直接写在 HTML 元素标签内的样式，权重最高（如 `<div style="color: red">`​）|
  |ID 选择器|​`#id`​ 形式的选择器|(0, 1, 0, 0)|每个 ID 选择器贡献 1 个 “b 级权重”|
  |类 / 伪类 / 属性选择器|​`.class`​、`:hover`​、`[attr]`​|(0, 0, 1, 0)|每个类、伪类或属性选择器，各贡献 1 个 “c 级权重”|
  |元素 / 伪元素选择器|​`div`​、`p`​、`::before`​ 等|(0, 0, 0, 1)|每个元素或伪元素选择器，各贡献 1 个 “d 级权重”|

### 属性操作

#### 1）font 字体属性

- [font-style（定义字体风格）](https://www.w3school.com.cn/cssref/pr_font_font-style.asp)

  |值|描述|
  | ---------| ------------------------------------------|
  |normal|**默认值**。显示一个标准的字体样式|
  |italic|设置字体样式为**斜体**，是选择字体库中的斜体字|
  |oblique|设置字体样式为**斜体**，不是去使用字体库的斜体字|
  |inherit|规定应该从父元素**继承**字体样式|
- [font-weight](https://www.w3school.com.cn/cssref/pr_font-weight.asp)（设置文本的粗细）

  |值|描述|
  | ---------| ---------------------------------------------------------|
  |normal|**默认值**。定义标准的字符，相当于数字值400|
  |bold|定义**粗体**字符，相当于数字值700|
  |bolder|定义比父级元素字体**更粗**的字符。|
  |lighter|定义比父级元素字体**更细**的字符。|
  |number|取值范围：100、200、300、400、500、600、700、800、900。|
  |inherit|规定应该从父元素**继承**字体的粗细|
- [font-size](https://www.w3school.com.cn/cssref/pr_font_font-size.asp)（字体大小）

  |值|描述|
  | --------------------------------------------------------------------------| -------------------------------------------------------------------------------------------------|
  |- xx-small<br />- x-small<br />- small<br />- medium<br />- large<br />- x-large<br />- xx-large|把字体的尺寸设置为不同的尺寸，从 xx-small 到 xx-large<br />**默认值**：medium<br />主流浏览器默认是15像素到16像素|
  |smaller|把 font-size 设置为比父元素**更小**的尺寸|
  |larger|把 font-size 设置为比父元素**更大**的尺寸|
  |*length*|把 font-size 设置为一个**固定的值**|
  | *%*|把 font-size 设置为基于父元素的一个**百分比值**|
  |inherit|规定应该从父元素**继承**字体尺寸|
- [font-family](https://www.w3school.com.cn/cssref/pr_font_font-family.asp)（字体族）：指定元素使用的 字体系列或字体族
- ​`font`​ 文本属性

  - [color](https://www.w3school.com.cn/cssref/pr_text_color.asp)（字体颜色）

    - 常用：英文单词，十六进制，RGB 十进制
  - [text-align](https://www.w3school.com.cn/cssref/pr_text_text-align.asp)（文本对齐方式）

    |值|描述|
    | ---------| ------------|
    |left|左对齐    |
    |right|右对齐|
    |center|居中|
    |justify|两端对齐|
    |inherit|继承|

    【住】默认值：由浏览器决定
  - [line-height](https://www.w3school.com.cn/cssref/pr_dim_line-height.asp)（字体行高）

    字体最底端与字体内部顶端之间的距离

    行高 = 字体大小 + 上半行距 + 下半行距

    |值|描述|
    | ---------| ------------------------------------------------------|
    |normal|**默认**。设置合理的行间距。|
    |number|设置数字，此数字会与当前的字体尺寸相乘来设置行间距。|
    |length|设置固定的**行间距**。|
    |%|基于当前字体尺寸的百分比行间距。|
    |inherit|继承|
  - [vertical-align](https://www.w3school.com.cn/cssref/pr_pos_vertical-align.asp)（设置元素的垂直对齐方式）
  - [text-decoration](https://www.w3school.com.cn/cssref/pr_text_text-decoration.asp)（设置文本内容的装饰线条）

    |属性值|描述|
    | --------| ------------------------------------------------------------|
    |[text-decoration-line](https://www.w3school.com.cn/cssref/pr_text-decoration-line.asp "CSS text-decoration-line 属性")|设置要使用的文本装饰类型（如下划线、上划线、划线）|
    |[text-decoration-color](https://www.w3school.com.cn/cssref/pr_text-decoration-color.asp "CSS text-decoration-color 属性")|设置文字装饰线条的颜色。|
    |[text-decoration-style](https://www.w3school.com.cn/cssref/pr_text-decoration-style.asp "CSS text-decoration-style 属性")|设置文本装饰线条的样式（如实心、波浪形、点线、虚线、双线）|
    |[text-decoration-thickness](https://www.w3school.com.cn/cssref/pr_text_text-decoration-thickness.asp "CSS text-decoration-thickness 属性")|设置装饰线的粗细。|

    常用的值有 `none`​，`underline`​，`overline`​，`line-through`​

#### 2）`background`​ 背景属性

- ​`background-color`​（背景颜色）

  ```html
  background-color: transparent / rgb(255,0,0) / #ff0000 / red;  
  					透明				RGB			十六进制	颜色单词
  ```

- ​`background-image`​（背景图片）

  ```html
  background-image: url('图片地址');
  ```

  【Tip】同时定义了背景颜色和背景图像时，背景图像覆盖在背景颜色之上

- ​`background-repeat`​（背景平铺方式）

  ```html
  background-repeat: repeat/no-repeat/repeat-x/repeat-y;
  					平铺 / 不平铺 / x 轴平铺 / y 轴平铺
  ```

- ​`background-position`​（背景定位）

  ```html
  background-position: [水平位置] [垂直位置];
  x轴坐标 y轴坐标 / left / center / right

  【混合使用】：
  background-position: right 10px center; （靠右，向右偏移 10px，垂直居中）
  ```

  【Tip】若只指定一个值，第二个值默认为 `center`​

  【Tip】元素背景左上角为原点（0，0）

  - ​`left`​ `center`​ `right`​

- <span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">background 背景样式缩写</span>

  ```css
  background: 背景颜色  背景图片  背景平铺方式  背景定位;
  ```

  【Tip】<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">属性的书写顺序不固定</span>

#### 3）border 边框属性

- ​`border-style`​（边框风格）

  ```html
  border-style：none / hidden / dotted / dashed / solid / double;
  		没有边框 / 隐藏边框 / 点状边框 / 虚线边框 / 实线边框 / 双实线边框
  ```

  【Tip】

  - none（没有边框）系统会忽略 border-color
  - hidden（隐藏边框）低版本浏览器不支持
  - double（双实线边框）两条单线与其间隔的和等于 border-width 值
- ​`border-width`​（边框厚度）

  ```html
  border-width: medium / thin / thick / length;
  			默认 / 细的边框 / 粗的边框 / 自定义边框的宽度
  ```
- ​`border-color`​（边框颜色）

  ```html
  border-color: red / #ff0000 / rgb(255, 0, 0) / transparent;
  ```

- <span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">border 边框样式缩写</span>：

  ```css
  border: 边框宽度 边框样式 边框颜色;
  ```

  【Tip】不需按照顺序进行书写

> 【Tip】单独指定不同方向：
>
> - 值：`top`​、`bottom`​、`left`​、`right`​
>
>   ```html
>   border-style: dotted double;  	(上、下边框)为点状线、(左、右边框)为双线
>   border-top-width: 50px;			上边框的宽度为 50px
>   border-left-color: red;			左边框的颜色为红
>   border-color: red green;		上下边框为红色、右边框为绿色、（左边框本为绿色，但被覆盖为红色）
>   ```
>
> 【Tip】缩写时：
>
> - 只有一个值：同时控制上下左右的边框样式
> - 只有两个值：分别控制上下、左右的边框样式
> - 有三个值：分别控制上、左右、下的边框样式
> - 有四个值：分别控制上、右、下、左的边框样式

#### 4）list 列表属性

- ​[`list-style-type`](https://www.w3school.com.cn/cssref/pr_list-style-type.asp)​（系统提供的列表项目符号）

  ```css
  list-style-type: none / disc / circle / square / decimal;
  			无标记 / 实心圆(默认) / 空心圆 / 实心方块 / 数字
  【示例】ul {list-style-type:circle;}
  ```
- ​[`list-style-image`](https://www.w3school.com.cn/cssref/pr_list-style-image.asp)​（自定义的列表项目符号）

  ```css
  list-style-image: none / url / initial / inherit;
  				默认值 / 图像 / 恢复初始样式 / 继承
  【示例】ul { list-style-image:url("/i/arrow.gif"); }
  ```

- ​[`list-style-position`](https://www.w3school.com.cn/cssref/pr_list-style-position.asp)​（设置在何处放置列表项标记）

  ```css
  list-style-position: inside / outside / inherit;
  		标记放置在文本以内 / 标记在文本以外(默认值) / 继承
  【示例】ul { list-style-position:inside; }
  ```

#### 5）dispaly属性

​[`display`](https://www.w3school.com.cn/cssref/pr_class_display.asp)​ 指定元素的显示模式

```css
display: block / inline / inline-block / none;
		块状元素 / 行内元素 / 行内块状元素 / 隐藏
```

- 块状元素：独占一行，可设置宽高，支持所有边距
- 行内元素：同行排列，不可设置宽高，垂直边距受限
- 行内块状元素：兼具行内元素的排列特性和块状元素的尺寸可控性（html原本没有）

#### <span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">6）盒子模型</span>

- 把HTML页面上的每个元素看成一个个方盒子，这些盒子由元素的四部分组成

  ![[assets/image-20250815103645-pawfek1.png]]
-  content（内容）、padding（内边距）、border（边框）、margin（外边距）

- ​`padding`​​​ <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">内边距（内补白）</span>，页面中<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">元素的边框与内容的距离</span>

  可设置多个值，也可单独设置
- ​`margin`​​​ <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">外边距（外补白）</span>，页面中<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">元素与元素之间的距离</span>

  默认为 0，可以是负值

  若要让元素居中：`margin: 0 auto;`​
- 【示例】

  ![[assets/image-20250923094531-b9m3st2.png]]​

  ```css
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          /* 盒子模型演示容器 */
          .box {
              /* 内容区：设置宽高 */
              width: 200px;
              height: 150px;
              
              /* 内边距：内容与边框之间的距离 */
              padding: 20px;
              
              /* 边框：围绕内边距和内容的线条 */
              border: 5px solid #333;
              
              /* 外边距：盒子与其他元素之间的距离 */
              margin: 30px;
              
              /* 背景色仅作用于内容区和内边距 */
              background-color: #f0f0f0;
              
              /* 文本样式 */
              font-family: Arial, sans-serif;
          }
          
          /* 辅助说明样式 */
          .container {
              border: 1px dashed #999;
              padding: 10px;
          }
          
          .label {
              font-size: 12px;
              color: #666;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="box">
              内容区 (200px × 150px)
              <div class="label">padding: 20px（内边距）</div>
          </div>
          <div class="label">border: 5px 实线（边框）</div>
          <div class="label">margin: 30px（外边距）</div>
      </div>
  </body>
  </html>

  ```

#### <span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">7）float 属性</span>

- 浮动模型：元素脱离文档流、文字环绕的机制

  > - 流动模型：<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">文档流</span>，浏览器默认把元素按从左到右、从上到下的顺序排布
  > - 流动布局：让页面随着视口或容器宽度“流动”伸缩，而不是写死 px 值
  >

- 浮动属性

  - 用于<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">指定元素脱离常规文档流</span>
  - 向左或向右移动，直到其<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">外边缘碰到包含块或另一个浮动元素的边缘</span>。

  ```css
  float: left / right / none;
  	向右浮动 / 向左浮动 / 不浮动
  ```

- 浮动后的<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">特性</span>

  - 自动被设置为一个行内块状元素
  - 一个浮动元素脱离了文档流，则其之后的元素将占据其原本的位置
  - 一行放不下的浮动元素，将被挤到下一行
  - 字围效果：文字内容会围绕在浮动元素周围。

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            .c1{
                width: 500px;
                height:500px;
                border: 1px solid red;
            }
            img{
                float: left;
            }
        </style>
    </head>
    <body>

    <div class="c1">
        <img src="https://img0.baidu.com/it/u=1379270897,1242083026&fm=26&fmt=auto&gp=0.jpg" alt="">
        <span>  道可道，非常道；名可名，非常名。
                无名，天地之始，有名，万物之母。
                故常无欲，以观其妙，常有欲，以观其徼。


                此两者，同出而异名，同谓之玄，玄之又玄，众妙之门。
                道可道，非常道；名可名，非常名。
                无名，天地之始，有名，万物之母。
                故常无欲，以观其妙，常有欲，以观其徼。
        </span>
    </div>
    </body>
    </html>
    ```
  - 只能浮动至左侧或者右侧
  - 浮动元素只能影响排在其后面元素的布局

- <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">清除浮动</span>

  ```css
  clser: left / right / both / none;
  ```

  |值|描述|
  | -------| ----------------------------------|
  |left|在左侧不允许浮动元素。|
  |right|在右侧不允许浮动元素。|
  |both|左右两侧均不允许浮动元素|
  |none|默认值。允许浮动元素出现在两侧。|

  【Tip】清除浮动解决父级塌陷问题

#### 8）position 属性

- 层布局模型：把网页中的每一个元素看成是一层一层的，然后通过<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">定位属性</span>`position`​​ 和 <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">方位属性</span> 对元素进行定位摆放
- <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">定位属性</span>

  ```css
  position: static / fixed / relative / absolute;
  	静态定位(默认) / 固定定位 / 相对定位 / 绝对定位
  ```

  - 固定定位：相对于整个**浏览器的窗口**
  - 相对定位：相对于元素本身**原来的位置**
  - 绝对定位：相对于其**最接近的具有定位属性的父级元素**（脱离文档流）

- <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">方位属性</span>

  |属性|描述|
  | ------| ----------------------------|
  |​`top：...px`​|相对于指定目标的 顶部 偏移|
  |​`right：...px`​|相对于指定目标的 右边 偏移|
  |​`bottom：...px`​|相对于指定目标的 底部 偏移|
  |​`left：...px`​|相对于指定目标的 左边 偏移|

- 【示例】

  ```css
  h2
    {
    position:absolute;
    left:100px;
    top:150px;
    }
  ```

‍
