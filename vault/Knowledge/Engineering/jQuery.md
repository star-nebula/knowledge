---
title: jQuery
created: 2026-05-22
tags:
  - jQuery
  - 前端
  - DOM
type: 概念解释
related:
  - "[[Frontend-MOC]]"
  - "[[Knowledge/Engineering/JavaScript]]"
  - "[[Bootstrap]]"
reference:
category: ["🛠️ 工程工具", "Frontend"]
---

## jQuery

### 5.1 jQuery介绍和引入

- jQuery是什么

  jQuery是一个快速、简洁的`JavaScript`​框架，是继`Prototype`​之后又一个优秀的`JavaScript`​代码库（或`JavaScript`​框架）。`jQuery`​设计的宗旨是“write Less，Do More”，即倡导写更少的代码，做更多的事情。它封装`JavaScript`​常用的功能代码，提供一种简便的`JavaScript`​设计模式，优化`HTML`​文档操作、事件处理、动画设计和`Ajax`​交互。

  ​`jQuery`​的<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">核心特性</span>可以总结为：

  - 具有独特的链式语法和短小清晰的多功能接口；
  - 具有高效灵活的`css`​选择器，并且可对`CSS`​选择器进行扩展；
  - 拥有便捷的插件扩展机制和丰富的插件。

  ​`jQuery`​兼容各种主流浏览器，如IE 6.0+、FF 1.5+、Safari 2.0+、Opera 9.0+等

- jQuery的版本

  目前在市场上, 1.x , 2.x, 3.x 功能的完善在1.x, 2.x的时候是属于删除旧代码,去除对于旧的浏览器兼容代码。3.x的时候增加`es`​的新特性以及调整核心代码的结构

- <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">jQuery的引入</span>

  根本上，jquery就是一个写好的`js`​文件，所以想要使用jQuery的语法必须先引入到本地

  - 远程导入

    ```html
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js"></script>
    ```

  - 本地导入

    ```html
    <script src="jquery3.6.js"></script>
    ```

- 基本语法

  ```html
  $().方法()
  ```
- ​`jQuery`​对象和`dom`​对象的关系

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <!--远程导入-->
      <!-- <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script> -->
      <!--本地导入-->
      <script src="jquery3.6.js"></script>
  </head>
  <body>

  <ul class="c1">
      <li>123</li>
      <li>234</li>
      <li>345</li>
  </ul>

  <script>
      // $(".c1 li").css("color","red");
      console.log($(".c1 li"));   // dom集合对象  [dom1,dom2,...]

      // 将jQury对象 转换为 Dom对象
      console.log($(".c1 li")[1].innerHTML);

      // 将Dom对象 转换为 jQuery对象
      var ele = document.querySelector(".c1 li");
      // ele.style.color = "red";
      $(ele).css("color", "red")  // [ele]
  </script>

  </body>
  </html>
  ```

### 5.2 jQuery 的选择器 和 筛选器

#### 1）直接查找

- 基本选择器

  ```js
  $("#id")   			// id 选择符 
  $(".class")  		// class 选择符
  $("element")  		// 元素 选择符
  $(".class,p,div")	// 同时获取多个元素的选择符 
  ```

- 组合选择器

  ```js
  $(".ancestor descendant")  	// 包含选择符
  $(".parent > child")  		// 父子选择符
  $(".prev + next")  			// 下一个兄弟选择符
  $(".prev ~ siblings")		// 兄弟选择符
  ```

- 属性选择器

  ```js
  $('[attr="value"]')
  $('button[type!="submit"]') 
  $('a[href^="https://"]') 	// 前缀匹配
  $('img[src$=".png"]')		// 后缀匹配
  $('[class*="btn"]')			// 通配符
  ```

- 表单选择器

  |选择器|选中哪些元素|
  | -----------| -----------------------------------------------|
  |:input|所有 input、textarea、select、button|
  |:text|type\="text" 或 input 无 type（默认 text）|
  |:password|type\="password"|

  ```js
  // 1. 获取表单里所有可输入元素
  $('#myForm :input').addClass('form-ctrl');

  // 2. 仅选中文本框
  $('#myForm :text').val('');
  ```

  - 表单状态属性

    |选择器|选中状态|
    | -----------| --------------------------------|
    |:enabled|未被 disabled 的元素|
    |:disabled|被设置 disabled 的元素|
    |:checked|被选中的 radio / checkbox|
    |:selected|被选中的 option（select 内部）|
    |:focus|当前获得焦点的元素|

    ```javascript
    // 1. 收集所有勾选的 checkbox 的值
    $('input[name="id[]"]:checked').map((i, el) => el.value).get();

    // 2. 把禁用的输入框变灰
    $('#myForm :disabled').css('opacity', 0.5);

    // 3. 获取下拉框选中的文本
    $('#city :selected').text();	
    ```

- 筛选器

  在 jQuery 里，大家口语里说的“筛选器”通常指两类东西：

  1. <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">选择器</span>（Selector）——写在 `$()`​ 里的字符串，用来一次性“选”出元素；
  2. <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">筛选方法</span>（Filtering Methods）——链式调用时<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">对已选集合再“筛”一遍</span>。

  ```js
  // 筛选器
  :first               //  集合第一个元素
  :last                //  集合最后一个元素
  :even                //  下标为偶数的元素 
  :odd                 //  下标为奇数的元素
  :eq(index)           //  指定索引
  :gt(index)           //  大于索引
  :lt(index)           //  小于索引
  :first-child         //  第一个子元素
  :last-child          //  最后一个子元素
  :nth-child           //  指定下标的子元素
  // 方法级筛选器
  $().first()          //  集合中提取第一个元素
  $().last()           //  集合中提取最后一个元素
  $().eq()             //  集合中提取指定下标index对应的元素
  ```

  方法性能更好、逻辑更清晰

#### 2）导航查找

```js
$("div").children(".test")	// 查找 子代标签
$("div").find(".test")  	// 查找 后代标签
                               
// 向下 查找兄弟标签 
$(".test").next()               
$(".test").nextAll()   
$(".test").nextUntil("#id") // 直到指定元素
                           
// 向上 查找兄弟标签  
$("div").prev()                  
$("div").prevAll()       
$("div").prevUntil() // 直到指定元素

// 查找所有兄弟标签  
$("div").siblings()  
              
// 查找父标签：         
$(".test").parent()              
$(".test").parents()     
$(".test").parentUntil() 
```

### 5.3 jQuery 的 绑定事件

- 绑定事件的方法

  ```js
  1. on 和 off
  	$().on("事件名",匿名函数)	// 绑定事件
  	$("元素").on("事件名","子元素",匿名函数)
  	$().off("事件名") 		// 解绑事件

  2. 直接通过事件名来进行调用
  	$().事件名(匿名函数)

  3. 
  	$().bind("事件名",匿名函数) // 给对象中的所有元素绑定一个事件
  	$().ready(匿名函数)   // 入口函数，等DOM加载完后再执行其中的代码

  4. 组合事件,模拟事件
  	$().hover(mouseover, mouseout) // onmouseover和onmouseout的组合
  	$().trigger(事件名)  // 用于让js 自动触发 指定元素身上已经绑定的事件
  ```

- 案例1：绑定取消事件

  ```html
  <p>限制每次一个按钮只能投票3次</p>
  <button id="zan">点下赞(<span>10</span>)</button>
  <script>
      let zan = 0;
      $("#zan").click(function(){
          $("#zan span").text(function(){
              zan++;
              let ret = parseInt($(this).text())+1;
              if(zan >= 3){
                  $("#zan").off("click"); // 事件解绑
              }
              return ret;
          });
      })
  </script>
  ```

- 案例2：模拟事件触发

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script src="js/jquery-1.11.0.js"></script>
      <style>
      input[type=file]{
          display: none;
      }
      .upload{
          width: 180px;
          height: 44px;
          border-radius: 5px;
          color: #fff;
          text-align: center;
          line-height: 44px;
          background-color: #000000;
          border: none;
          outline: none;
          cursor: pointer;
      }
      </style>
  </head>
  <body>
      <input type="file" name="avatar">
      <button class="upload">上传文件</button>
      <script>
      $(".upload").on("click", function(){
         $("input[type=file]").trigger("click"); // 模拟事件的触发
      });
      </script>
  </body>
  </html>
  ```

### 5.4 jQuery的 操作标签

- 文本操作

  ```js
  $("选择符").html()     	// 读取指定元素的内容,如果$()函数获取了有多个元素,则提取第一个元素
  $("选择符").html(内容) 	// 修改内容,如果$()函数获取了多个元素, 则批量修改内容

  $("选择符").text()     	// 效果同上,但是获取的内容是纯文本,不包含html代码
  $("选择符").text(内容)	// 效果同上,但是修改的内容中如果有html文本,在直接转成实体字符,而不是html代码
  ```

  ```js
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script src="jquery3.6.js"></script>

      <script>
          $(function () {
              $(".c1").click(function () {
                  // 获取文本
                  console.log($(this).html());
                  console.log($(this).text());
                  // 设置文本
                  $(this).html("<a href=''>hello world</a>");
                  $(this).text("<a href=''>hello world</a>");
              })
          })
      </script>
  </head>
  <body>
      <p class="c1"><span>PPP</span></p>
  </body>
  </html>
  ```

- ​`value`​ 操作

  ```
  $().val()
  ```

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script src="jquery3.6.js"></script>
      <script>
          $(function () {
              $("#i1").blur(function () {
                  console.log(this.value);    // 获取 dom  对象的value属性值
                  console.log($(this).val()); // 获取jquery对象的value属性值
                  $(this).val("hello world")  // 设置value属性值
              });
              $("#i3").change(function () {
                  console.log(this.value);
                  console.log($(this).val());
                  $(this).val("guangdong");
              });
              console.log($("#i2").val());
              console.log($("#i2").val("hello pig!"))
          })
      </script>
  </head>
  <body>
      <input type="text" id="i1">
      <select id="i3">
          <option value="hebei">河北省</option>
          <option value="hubei">湖北省</option>
          <option value="guangdong">广东省</option>
      </select>
      <p><textarea name="" id="i2" cols="30" rows="10">123</textarea></p>
  </body>
  </html>
  ```

- 属性操作

  ```java
  //获取属性值
  $("选择符").attr("属性名");   // 获取非表单元素的属性值,只会提取第一个元素的属性值
  $("选择符").prop("属性名");   // 表单元素的属性,只会提取第一个元素的属性值

  //操作属性
  $("选择符").attr("属性名","属性值");  // 修改非表单元素的属性值,如果元素有多个,则全部修改
  $("选择符").prop("属性名","属性值");  // 修改表单元素的属性值,如果元素有多个,则全部修改

  $("选择符").attr({'属性名1':'属性值1','属性名2':'属性值2',.....})
  $("选择符").prop({'属性名1':'属性值1','属性名2':'属性值2',.....})
  ```

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script src="jquery3.6.js"></script>
  </head>
  <body>
  	<button class="select_all">全选</button>
  	<button class="cancel">取消</button>
  	<button class="reverse">反选</button>
  	<hr>
  	<table border="1">
  	    <tr>
  	        <td>选择</td>
  	        <td>姓名</td>
  	        <td>年龄</td>
  	    </tr>
  	    <tr>
  	        <td><input type="checkbox"></td>
  	        <td>张三</td>
  	        <td>23</td>
  	    </tr>
  	    <tr>
  	        <td><input type="checkbox"></td>
  	        <td>李四</td>
  	        <td>23</td>
  	    </tr>
  	    <tr>
  	        <td><input type="checkbox"></td>
  	        <td>王五</td>
  	        <td>23</td>
  	    </tr>
  	</table>
  	<script>
  	    $(".select_all").click(function () {
  	        $("table input:checkbox").prop("checked",true);
  	    });
  	    $(".cancel").click(function () {
  	       $("table input:checkbox").prop("checked",false);
  	    });
  	    $(".reverse").click(function () {
  	       $("table input:checkbox").each(function () { // each() 遍历元素
  	           $(this).prop("checked",!$(this).prop("checked")) // !$ 取反
  	       })
  	   });
  	</script>
  </body>
  </html>
  ```

- css样式操作

  ```js
  // 获取样式
  $().css("样式属性");   // 获取元素的指定样式属性的值,如果有多个元素,只得到第一个元素的值

  // 操作样式
  $().css("样式属性","样式值").css("样式属性","样式值");
  $().css({"样式属性1":"样式值1","样式属性2":"样式值2",....})

  $().css("样式属性":function(){
    // 其他代码操作 
    return "样式值";
  });
  ```

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script src="jquery3.6.js"></script>
  </head>
  <body>
      <div class="c1">hello JS</div>
      <script>
          $(".c1").css({"backgroundColor": "#369", "color": "white"})
      </script>
  </body>
  </html>
  ```

- class 属性操作

  ```js
  $().addClass()   // 加指定class样式
  $().removeClass() // 删除指定class样式
  $().toggleClass() // 给获取到的所有元素进行判断,如果拥有指定class样式的则删除,如果没有指定样式则添加
  ```

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script src="jquery3.6.js"></script>
      <style>
          .c1 {
              color: red;
          }

          .c2 {
              background-color: lightseagreen;
          }

          .c3 {
              font-style: italic;
          }
      </style>
  </head>
  <body>
      <div class="c1 c3">hello JS</div>
      <script>
          $(".c1").click(function () {
              $(this).addClass("c2").removeClass("c3");
          });
          $(".c1").mouseover(function () {
              $(this).removeClass("c2");
          })
      </script>
  </body>
  </html>
  ```

  ##### 案例：tab切换（jQuery版本）

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <script src="jquery3.6.js"></script>
        <style>
            * {
                margin: 0;
                padding: 0;
            }

            .tab {
                width: 800px;
                height: 300px;
                /*border: 1px solid red;*/
                margin: 200px auto;
            }
            .tab ul {
                list-style: none;
            }
            .tab-title {
                background-color: #f7f7f7;
                border: 1px solid #eee;
                border-bottom: 1px solid #e4393c;
            }
            .tab .tab-title li {
                display: inline-block;
                padding: 10px 25px;
                font-size: 14px;
            }

            li.current {
                background-color: #e4393c;
                color: #fff;
                cursor: default;
            }
            .hide {
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="tab">
            <ul class="tab-title">
                <li class="current">商品介绍</li>
                <li class="">规格与包装</li>
                <li class="">售后保障</li>
                <li class="">商品评价</li>
            </ul>
            <ul class="tab-content">
                <li>商品介绍...</li>
                <li class="hide">规格与包装...</li>
                <li class="hide">售后保障...</li>
                <li class="hide">商品评价...</li>
            </ul>
        </div>
        <script>
            //  事件函数
            $(".tab-title li").click(function () {
                // 点击标签获取current样式
                $(this).addClass("current").siblings().removeClass("current");
                // 详情内容的显示与隐藏
                console.log($(this).index());
                var index = $(this).index();
                $(".tab-content li").eq(index).removeClass("hide").siblings().addClass("hide");
            })
        </script>
    </body>
    </html>
    ```

- 节点操作

  ```js
  //创建一个jquery标签对象
  $("<p>")

  //内部插入
  $("").append(content|fn)      // $("p").append("<b>Hello</b>");
  $("").appendTo(content)       // $("p").appendTo("div");
  $("").prepend(content|fn)     // $("p").prepend("<b>Hello</b>");
  $("").prependTo(content)      // $("p").prependTo("#foo");

  //外部插入
  $("").after(content|fn)       // ("p").after("<b>Hello</b>");
  $("").before(content|fn)      // $("p").before("<b>Hello</b>");
  $("").insertAfter(content)    // $("p").insertAfter("#foo");
  $("").insertBefore(content)   // $("p").insertBefore("#foo");

  //替换
  $("").replaceWith(content|fn) // $("p").replaceWith("<b>Paragraph. </b>");

  //删除
  $("").empty()			// 删除内容
  $("").remove([expr]) 	// 删除元素

  //复制
  $("").clone([Even[,deepEven]])
  ```

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script src="jquery3.6.js"></script>
  </head>
  <body>
  <button class="add_btn">添加节点</button>
  <button class="del_btn">删除节点</button>
  <button class="replace_btn">替换节点</button>
  <div class="c1">
      <h3>hello JS!</h3>
      <h3 class="c2">hello world</h3>
  </div>
  <script>

      $(".add_btn").click(function () {
          // 创建jquery对象
          // var $img = $("<img>");
          // $img.attr("src","https://img1.baidu.com/it/u=3210260546,3888404253&fm=26&fmt=auto&gp=0.jpg")

          // 节点添加
          // $(".c1").append($img);
          // $img.appendTo(".c1")
          // $(".c1").prepend($img);
          // $(".c2").before($img);

          // 支持字符串操作
          $(".c1").append("<img src ='https://img1.baidu.com/it/u=3210260546,3888404253&fm=26&fmt=auto&gp=0.jpg'>")
      });

      $(".del_btn").click(function () {
          $(".c2").remove();
          // $(".c2").empty();
      });

      $(".replace_btn").click(function () {
          // var $img = $("<img>");
          // $img.attr("src","https://img1.baidu.com/it/u=3210260546,3888404253&fm=26&fmt=auto&gp=0.jpg")
          // $(".c2").replaceWith($img);
          $(".c2").replaceWith("<img src ='https://img1.baidu.com/it/u=3210260546,3888404253&fm=26&fmt=auto&gp=0.jpg'>");

      })
  </script>
  </body>
  </html>
  ```

  ##### 案例：clone 案例

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <script src="jquery3.6.js"></script>
    </head>
    <body>
        <div class="outer">
            <div class="item">
                <input type="button" value="+" class="add_btn">
                <input type="text">
            </div>
        </div>
        <script>
            $(".add_btn").click(function () {
                var $clone = $(this).parent().clone();
                $clone.children(".add_btn").val("-").attr("class","remove_btn");
                $(".outer").append($clone);

            });

            $(".outer").on("click",".remove_btn",function () {
                $(this).parent().remove();
            })
        </script>
    </body>
    </html>
    ```

- ​`css`​尺寸和位置

  ```js
  $("").height([val|fn])
  $("").width([val|fn])
  $("").innerHeight() 	// 内边距
  $("").innerWidth()		
  $("").outerHeight([soptions]) // 外边距
  $("").outerWidth([options])
  ```

  ```js
  $("").offset([coordinates])  // 元素在当前窗口的相对偏移
  $("").position()             // 元素相对已定位父元素的偏移，无法用于设置操作
  $("").scrollTop([val])       // 元素相对滚动条顶部的偏移
  ```

  ##### 案例：返回顶部

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            *{
                margin: 0;
            }
            .content{
                height: 2000px;
                background-color: lightgray;
            }

            .return_top{
                width: 120px;
                height: 50px;
                background-color: lightseagreen;
                color: white;
                text-align: center;
                line-height: 50px;

                position: fixed;
                bottom: 20px;
                right: 20px;
            }

            .hide{
                display: none;
            }
        </style>
        <script src="jquery3.6.js"></script>
    </head>
    <body>
        <div class="content">
            <h3>文章...</h3>
        </div>
        <div class="return_top hide">返回顶部</div>
        <script>
            console.log($(window).scrollTop());
            // 滚动条返回顶部
            $(".return_top").click(function () {
                $(window).scrollTop(0)
            });

            $(window).scroll(function () { // 绑定滚动条事件
                console.log($(this).scrollTop());
                var v =$(this).scrollTop(); // 获取滚动条的位置
                if (v > 100){
                    $(".return_top").removeClass("hide");
                }else {
                    $(".return_top").addClass("hide");
                }
            })
        </script>
    </body>
    </html>
    ```
  ##### 案例：位置偏移

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            .c1{
                width: 800px;
                height: 500px;
                background-color: lightpink;
                margin: 100px auto;

                position: relative;
            }

            .c2{
                width: 200px;
                height: 200px;
                background-color: orange;
            }
        </style>

        <script src="jquery3.6.js"></script>
    </head>
    <body>
        <div class="c1">
            <div class="c2"></div>
        </div>
        <script>
            // 获取位置信息
            var $offset = $(".c2").offset(); // offset:相对于窗口偏移
            var $position = $(".c2").position(); // position：相对于已经定位的父标签偏移量
            console.log("$offset top:",$offset.top);
            console.log("$offset left:",$offset.left);
            console.log("$position top:",$position.top);
            console.log("$position left:",$position.left);

            // 设置偏移量  offset
            $(".c2").click(function () {
                $(this).offset({top:500,left:500})
            })
    </script>
    </body>
    </html>
    ```

### 5.5 jQuery的动画

#### 1）基本方法

```js
// 基本
show([s,[e],[fn]])   	显示元素
hide([s,[e],[fn]])   	隐藏元素

// 滑动
slideDown([s],[e],[fn]) 向下滑动 
slideUp([s,[e],[fn]])   向上滑动

// 淡入淡出
fadeIn([s],[e],[fn])    淡入
fadeOut([s],[e],[fn])   淡出
fadeTo([[s],opacity,[e],[fn]])  让元素的透明度调整到指定数值

// 暂停
stop([c],[j])			暂停上一个动画效果,开始当前触发的动画效果
```

#### 2）自定义动画

```js
animate(p,[s],[e],[fn])   自定义动画 
$(".box").animate(动画最终效果,动画完成的时间,动画完成以后的回调函数)
```

- 示例：

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <style>
          .c1{
              width: 250px;
              height: 250px;
              background-color: black;
              position: absolute;
              top: 240px;
              left: 120px;
          }

          .hide{
              display: none;
          }
      </style>
      <script src="jquery3.6.js"></script>
  </head>
  <body>
      <p>
          <button class="show01">添加class显示</button>
          <button class="hide01">删除class隐藏</button>
      </p>
      <p>
          <button class="show02">show()显示</button>
          <button class="hide02">hide()隐藏</button>
      </p>
      <p>
          <button class="show03">slideDown()显示</button>
          <button class="hide03">slideUp()隐藏</button>
      </p>
      <p>
          <button class="show04">fadeIn()显示</button>
          <button class="hide04">fadeOut()隐藏</button>
      </p>
      <p>
          <button class="animate">animate</button>
      </p>

      <hr>
      <div class="c1"></div>
      <script>
          // 删除和添加样式实现的隐藏与显示
          $(".show01").click(function () {
              $(".c1").removeClass("hide")
          });
          $(".hide01").click(function () {
              $(".c1").addClass("hide")
          });

          // (1) show与hide方法
          $(".show02").click(function () {
              $(".c1").show(1000,function () {
                  alert("显示成功")
              });
          });
          $(".hide02").click(function () {
              $(".c1").hide(1000,function () {
                  alert("隐藏成功")
              })
          });

          // (2) slideDown与slideUp
          $(".show03").click(function () {
              $(".c1").slideDown(1000,function () {
                  alert("显示成功")
              });
          });
          $(".hide03").click(function () {
              $(".c1").slideUp(1000,function () {
                  alert("隐藏成功")
              })
          });

          // (3) fadeIn与fadeOut
          $(".show04").click(function () {
              $(".c1").fadeIn(1000,function () {
                  alert("显示成功")
              });
          });
          $(".hide04").click(function () {
              $(".c1").fadeOut(1000,function () {
                  alert("隐藏成功")
              })
          });

          // 自定义动画
          $(".animate").click(function () {
              $(".c1").animate({
                  "border-radius":"50%", // 圆角
                  "top":340,
                  "left":200
              },1000,function () {
                  $(".c1").animate({
                      "border-radius":"0", 
                      "top":240,
                      "left":120
                  },1000,function () {
                      // 自动触发click事件，实现循环动画
                      $(".animate").trigger("click") 
                  })
              })
          })
      </script>
  </body>
  </html>
  ```

### 5.6 扩展方法 (插件机制)

- ​`jQuery.extend(object)`​：扩展jQuery对象本身，用来在jQuery命名空间上增加新函数

- ​`jQuery.fn.extend(object)`​：扩展 jQuery 元素集来提供新的方法（通常用来制作插件）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="jquery3.6.js"></script>
</head>
<body>
<div class="c1">
    <input type="checkbox">
    <input type="checkbox">
    <input type="checkbox">
</div>
    <script>
        // 在jQuery命名空间上增加两个函数:
        jQuery.extend({
            min:function (a,b) {
                    return a < b ? a:b
            },
            max:function (a,b) {
                    return  a > b ? a:b
            }
        });
        jQuery.min(2,3); // => 2
        jQuery.max(4,5); // => 5
        console.log($.min(3,5));
        console.log($.max(3,5));

        // 增加两个插件方法：
        jQuery.fn.extend({
            check:function () {
                console.log($(this));
                $(this).prop("checked",true)
            },
            cancel:function () {
                console.log($(this));
                $(this).prop("checked",false)
            },
        });
        $(".c1 :checkbox").cancel();
    </script>
</body>
</html>
```
