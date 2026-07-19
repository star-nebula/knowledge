---
title: Bootstrap
created: 2026-05-22
tags:
  - Bootstrap
  - 前端
  - CSS框架
type: 概念解释
related:
  - "[[Frontend-MOC]]"
  - "[[Knowledge/Engineering/CSS]]"
  - "[[Knowledge/Engineering/HTML]]"
  - "[[jQuery]]"
reference:
category: ["🛠️ 工程工具", "Frontend"]
---

## BootStrap

Bootstrap是Twitter推出的一个用于前端开发的开源工具包。它由Twitter的设计师Mark Otto和Jacob Thornton合作开发，是一个CSS/HTML框架。

使用Bootstrap的好处：

Bootstrap简单灵活，可用于架构流行的用户界面，具有 友好的学习曲线，卓越的兼容性，响应式设计，12列栅格系统，样式向导文档，自定义JQuery插件，完整的类库，基于Less等特性。

- bootstap英文官方: [https://getbootstrap.com/](https://getbootstrap.com/)
- bootstrap中文官网：[http://www.bootcss.com/](http://www.bootcss.com/)

### 6.1 [栅格系统](https://v3.bootcss.com/css/#grid:~:text=...%0A%3C/div%3E-,%E6%A0%85%E6%A0%BC%E7%B3%BB%E7%BB%9F,-Bootstrap%20%E6%8F%90%E4%BE%9B%E4%BA%86)

响应式布局方案

把一行(`row`​)平均切成 12 列(`col-*`​)，再用断点前缀(`xs/sm/md/lg/xl/xxl`​) 控制不同屏幕宽度下每份占几格

![[assets/image-20250829110606-9eurufz.png]]​

- [列偏移](https://v3.bootcss.com/css/#grid-offsetting:~:text=div%3E%0A%3C/div%3E-,%E5%88%97%E5%81%8F%E7%A7%BB,-%E4%BD%BF%E7%94%A8%20.col%2Dmd)：`.col-md-offset-*`​ 类可以将列向右侧偏移

  ​`.col-md-offset-4`​ ：将 `.col-md-4`​ 元素向右侧偏移了4个列的宽度

- [嵌套列](https://v3.bootcss.com/css/#grid-nesting:~:text=div%3E%0A%3C/div%3E-,%E5%B5%8C%E5%A5%97%E5%88%97,-%E4%B8%BA%E4%BA%86%E4%BD%BF%E7%94%A8%E5%86%85)：在已经存在的 `.col-sm-*`​ 元素内，添加一个新的 `.row`​ 元素和一系列 `.col-sm-*`​ 元素

  【Tip】内嵌的 `row`​ 同样包含12 个列

- [列排序](https://v3.bootcss.com/css/#grid-column-ordering:~:text=div%3E%0A%3C/div%3E-,%E5%88%97%E6%8E%92%E5%BA%8F,-%E9%80%9A%E8%BF%87%E4%BD%BF%E7%94%A8%20.col)：使用 `.col-md-push-*`​（向右）和 `.col-md-pull-*`​（向左）类改变列的顺序

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        .row [class*= 'col-md-'] {
            border: 1px solid rebeccapurple;
        }
    </style>
    <link rel="stylesheet" href="dist/css/bootstrap.css">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
            <div class="col-md-1">col-md-1</div>
        </div>
        <div class="row">
            <div class="col-md-6">col-md-1</div>
            <div class="col-md-6">col-md-1</div>
        </div>
        <div class="row">
            <div class="col-md-9">col-md-1</div>
            <div class="col-md-3">col-md-1</div>
        </div>
        <div class="row">
            <div class="col-md-6 col-sm-9">col-md-6</div>
            <div class="col-md-6 col-sm-3">col-md-6</div>
        </div>

        <h3>列偏移</h3>
        <div class="row">
            <div class="col-md-4 col-md-offset-3">col-md-4</div>
        </div>
        <h3>列嵌套</h3>
        <div class="row">
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-6">col-md-6</div>
                    <div class="col-md-6">col-md-6</div>
                </div>
            </div>
        </div>
        <h3>列排序</h3>
        <div class="row">
            <div class="col-md-4 col-md-push-2">col-md-4</div>
        </div>
        <div class="row">
            <div class="col-md-4 col-md-push-4">col-md-4</div>
            <div class="col-md-4 col-md-pull-4">col-md-4(2)</div>
        </div>
        <div class="row">
            <div class="col-md-4 pull-right col-md-pull-2">col-md-4</div>
        </div>
    </div>
</body>
</html>
```

### 6.2 [样式](https://v3.bootcss.com/css/#:~:text=Bootstrap%20%E4%B8%AD%E6%96%87%E7%BD%91-,%E5%85%A8%E5%B1%80%20CSS%20%E6%A0%B7%E5%BC%8F,-Bootstrap%20%E5%B0%86%E8%AE%BE%E7%BD%AE)

- [表格](https://v3.bootcss.com/css/#tables:~:text=program.%3C/samp%3E-,%E8%A1%A8%E6%A0%BC,-%E5%9F%BA%E6%9C%AC%E5%AE%9E%E4%BE%8B)

  ![[assets/image-20250829162640-l1qg4a7.png]]​

  - ​`.table`​ 类：基本的样式 — 少量的内补（padding）和水平方向的分隔线
  - ​`.table-striped`​ 类：给 `<tbody>`​ 之内的每一行增加斑马条纹样式
  - ​`.table-bordered`​ 类：为表格和其中的每个单元格增加边框
  - ​`.table-hover`​ 类：让 `<tbody>`​ 中的每一行对 鼠标悬停 状态作出响应
  - 状态类：为行或单元格设置颜色

    |Class|描述|
    | -------| --------------------------------------|
    |​`.active`​|鼠标悬停在行或单元格上时所设置的颜色|
    |​`.success`​|标识成功或积极的动作|
    |​`.info`​|标识普通的提示信息或动作|
    |​`.warning`​|标识警告或需要用户注意|
    |​`.danger`​|标识危险或潜在的带来负面影响的动作|

  ```html
  <div class="row">
      <div class="col-md-8 col-md-offset-2">
          <table border="1" class="table table-striped table-hover table-bordered">
              <tr>
                  <th>序号</th>
                  <th>姓名</th>
                  <th>年龄</th>
                  <th>部门</th>
              </tr>
              <tr class="success">
                  <td>1</td>
                  <td>张三</td>
                  <td>23</td>
                  <td>销售</td>
              </tr>
              <tr>
                  <td>2</td>
                  <td>李四</td>
                  <td>23</td>
                  <td>销售</td>
              </tr>
              <tr class="danger">
                  <td>3</td>
                  <td>王五</td>
                  <td>23</td>
                  <td>销售</td>
              </tr>
          </table>
      </div>
  </div>
  ```

- [表单](https://v3.bootcss.com/css/#forms:~:text=table%3E%0A%3C/div%3E-,%E8%A1%A8%E5%8D%95,-%E5%9F%BA%E6%9C%AC%E5%AE%9E%E4%BE%8B)

  - [基本实例](https://v3.bootcss.com/css/#forms:~:text=%E8%A1%A8%E5%8D%95-,%E5%9F%BA%E6%9C%AC%E5%AE%9E%E4%BE%8B,-%E5%8D%95%E7%8B%AC%E7%9A%84%E8%A1%A8)

    ​`.form-control`​ 类的 `<input>`​、`<textarea>`​ 和 `<select>`​ 元素默认设置宽度属性为 `width: 100%;`​

    ![[assets/image-20250829170333-lt9bxv2.png]]​

    ```html
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <form>
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
                </div>
                <div class="form-group">
                    <label for="exampleInputFile">File input</label>
                    <input type="file" id="exampleInputFile">
                    <p class="help-block">Example block-level help text here.</p>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-md-6">
                            <select class="form-control">
                                <option>销售</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="checkbox">
                    <label>
                        <input type="checkbox"> Check me out
                    </label>
                </div>
                <button type="submit" class="btn btn-default">Submit</button>
            </form>
        </div>
    </div>
    ```

- [按钮](https://v3.bootcss.com/css/#buttons:~:text=div%3E%0A%3C/div%3E-,%E6%8C%89%E9%92%AE,-%E5%8F%AF%E4%BD%9C%E4%B8%BA%E6%8C%89%E9%92%AE)

  ​`<a>`​、`<button>`​ 或 `<input>`​ 元素可以添加按钮类 btn

  ![[assets/image-20250829214044-k5nebf6.png]]​

  ```html
  <a class="btn btn-default" href="#" role="button">Link</a>
  <button class="btn btn-default" type="submit">Button</button>
  <input class="btn btn-default" type="button" value="Input">
  <input class="btn btn-default" type="submit" value="Submit">
  ```

  ![[assets/image-20250829214335-y6fi7tq.png]]

  预定义样式

  - ​`btn-default`​ 默认样式
  - ​`btn-primary`​ 首选项
  - ​`btn-success`​ 成功
  - ​`btn-info`​ 一般信息
  - ​`btn-warning`​ 警告
  - ​`btn-danger`​ 危险
  - ​`btn-link`​ 链接

### 6.3 [组件](https://v3.bootcss.com/components/#:~:text=Bootstrap%20%E4%B8%AD%E6%96%87%E7%BD%91-,%E7%BB%84%E4%BB%B6,-Bootstrap%20%E8%87%AA%E5%B8%A6)

#### 1）图标

![[assets/image-20250829215223-0lzh0s7.png]]

```html
<button type="button" class="btn btn-default" aria-label="Left Align">
  <span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
</button>

<button type="button" class="btn btn-default btn-lg">
  <span class="glyphicon glyphicon-star" aria-hidden="true"></span> Star
</button>
```

【Tip】

- 图标类不能和其它组件直接联合使用
- 只对内容为空的元素起作用，不包含任何文本内容或子元素的元素

#### 2）[导航条](https://v3.bootcss.com/components/#navbar:~:text=...%0A%3C/ul%3E-,%E5%AF%BC%E8%88%AA%E6%9D%A1,-%E9%BB%98%E8%AE%A4%E6%A0%B7%E5%BC%8F%E7%9A%84)

### 6.4 [JavaScript 插件](https://v3.bootcss.com/javascript/#:~:text=Bootstrap%20%E4%B8%AD%E6%96%87%E7%BD%91-,JavaScript%20%E6%8F%92%E4%BB%B6,-jQuery%20%E6%8F%92%E4%BB%B6)

#### [模态框 modal.js](https://v3.bootcss.com/javascript/#modals:~:text=transition%20%3D%20false-,%E6%A8%A1%E6%80%81%E6%A1%86%20modal.js,-%E6%A8%A1%E6%80%81%E6%A1%86)

- [方法](https://v3.bootcss.com/javascript/#modals-methods:~:text=me%3C/a%3E-,%E6%96%B9%E6%B3%95,-.modal(options)) `.modal(options)`​

  ```js
  $('#myModal').modal('show') // 手动打开模态框
  $('#myModal').modal('hide') // 手动隐藏模态框
  ```

- [模态框事件](https://v3.bootcss.com/javascript/#modals-methods:~:text=handleUpdate%27)-,%E4%BA%8B%E4%BB%B6,-Bootstrap%20%E7%9A%84%E6%A8%A1)

‍
