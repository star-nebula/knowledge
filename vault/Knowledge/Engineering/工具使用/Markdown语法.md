---
type: topic
tags:
  - Markdown
  - 标记语言
domain: 通用工具
description: Markdown基本语法详解，涵盖标题/列表/表格/代码/链接/图片
created: 2026-05-22
updated: 2026-05-22
status: raw
---

## Markdown基本语法

[Markdown 语法速查表](https://markdown.com.cn/cheat-sheet.html#%E6%80%BB%E8%A7%88)

[参考官方文档](https://markdown.com.cn/basic-syntax/)

## 1 标题

在文字最前面添加（ ## ），# 的数量代表标题的级别（符号和文字之间需要用一个空格分隔）

或在文本下面添加任意数量的（==）标识一级标题，（--）标识二级标题

## 2 段落

创建段落只需用空白行进行分隔

不要用空格（spaces）或制表符（ tabs）缩进段落。

## 3 换行

在一行的末尾添加两个或多个空格，然后按回车Enter，即可创建一个换行（
）

或在结尾使用HTML的 
标签

## 4 强调

1. 加粗（Bold）

   在文本前后添加 ** 或 _ _
2. 斜体（ltalic）

   在文本前后添加 * 或 _
3. 同时用粗体和斜体

   前后添加 *** 或 _ _ _

> 若是要突出显示单词的中间部分，要使用 * ，如 `A*cat*meow`

## 5 引用

1. 单个引用块

   在段落前添加一个 > 符号

   ```Plain
   > 单个引用块
   ```

   效果如下：

   > 单个引用块
   >
2. 多个段落

   ```Plain
   > 第一段
   >
   > 第二段
   ```

   效果如下：

   > 第一段
   >

   第二段
3. 嵌套块

   ```Plain
   > 第一段
   >
   >> 第二段
   ```

   > 第一段
   >

   > 第二段

块引用可以包含其他 Markdown 格式的元素，但并非所有元素都可以使用

## 6 列表

1. 有序列表

   在文本最前面添加数字并紧跟一个英文句点（以1为起始）
2. 无序列表

   在每个列表项前面添加破折号 - 、星号 * 或加号 +

   ```Plain
   - First item
   * Second item
   + Third item
   ```

   效果如下：

   - First item
   - Second item
   - Third item

   创建无序列表时，最好用同一个符号
3. 嵌套其它元素

   1) 段落

      ```Plain
      *   This is the first list item.
      *   Here's the second list item.

          I need to add another paragraph below the second list item.

      *   And here's the third list item.
      ```

      效果如下：

      - This is the first list item.
      - Here's the second list item.

        I need to add another paragraph below the second list item.
      - And here's the third list item.
   2) 引用块

      ```Plain
      *   This is the first list item.
      *   Here's the second list item.

          > A blockquote would look great below the second list item.

      *   And here's the third list item.
      ```

      效果如下：

      - This is the first list item.
      - Here's the second list item.

        > A blockquote would look great below the second list item.
        >
      - And here's the third list item.
   3) 代码块

      ```Plain
      1.  Open the file.
      2.  Find the following code block on line 21:

              <html>
                <head>
                  <title>Test</title>
                </head>

      3.  Update the title to match the name of your website.
      ```

      1. Open the file.
4. Find the following code block on line 21:

   `Plain Text <html> <head> <title>Test</title> </head> `

   3.  Update the title to match the name of your website.

   4) 图片

      ```Shell
      1.  Open the file containing the Linux mascot.
      2.  Marvel at its beauty.

          ! [Tux, the Linux mascot](/assets/images/tux.png)

      3.  Close the file.
      ```

      1. Open the file containing the Linux mascot.
      2. Marvel at its beauty.

      ![image.png](assets/image-20250107221634-i1v7cy3.png)

      3. Close the file.
   5) 列表

      ```Plain
      1. First item
      2. Second item
      3. Third item
          - Indented item
          - Indented item
      4. Fourth item
      ```

      1. First item
5. Second item
6. Third item

   - Indented item

   - Indented item

   4. Fourth item

## 7 代码

1. 将某个字或短句表示为代码，在其前后添加 反引号 `

2. 要表示为代码的短句中包含反引号( ` )  ，则在短句前后使用双反引号 （``)

3. 代码块，用`···`或`````,或者每行缩进至少四个空格或一个制表符（现在似乎很少编辑器支持）

## 8 分隔线

在单独一行上使用三个或多个星号 (`***`)、破折号 (`---`) 或下划线 (`___`) ，并且不能包含其他内容。

## 9 链接

1. 添加链接

   超链接Markdown语法代码：`[超链接显示名](超链接地址 "超链接title")`

   ```Shell
   这是一个链接 [Markdown语法](https://markdown.com.cn)
   ```

   效果如下：

   这是一个链接 [Markdown语法](https://markdown.com.cn/)
2. 给链接增加 Title

   当鼠标悬停在链接上时会出现的文字

   ```Shell
   这是一个链接 [Markdown语法](https://markdown.com.cn "最好的markdown教程")。
   ```

   效果如下：

   这是一个链接 [Markdown语法](https://markdown.com.cn)。
3. 网址和Email地址

   ```Plain
   <https://markdown.com.cn>
   <fake@example.com>
   ```

   效果如下：

   [https://markdown.com.cn](https://markdown.com.cn)
   [fake@example.com](mailto:fake@example.com)
4. 带格式化的链接

   ```Plain
   I love supporting the **[EFF](https://eff.org)**.
   This is the *[Markdown Guide](https://www.markdownguide.org)*.
   See the section on [`code`](#code).
   ```

   I love supporting the **[EFF](https://eff.org)**.
   This is the *[Markdown Guide](https://www.markdownguide.org)*.
   See the section on [[Markdown基本语法#code|`code`]].
5. 引用类型链接

   - 第一部分

     `[hobbit-hole][1]`

     第一个方括号包含显示为链接的文本，第二个括号为标签（不区分大小写，可以包含字母，数字，空格或标点符号）
   - 第二部分

     放在括号中的标签，紧跟一个冒号和至少一个空格（例如`[label]:`）

     `[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle`

     Title 可以将其括在双引号，单引号或括号中（效果一致）

     `[1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"`

URL中间的空格需要使用`%20`代替

## 10 图片

1. 添加图片

   插入图片Markdown语法代码：`![图片alt](图片链接 "图片title")`
2. 链接图片

   给图片增加链接

   - 将图像的Markdown 括在方括号中
   - 链接添加在圆括号中

     `[![沙漠中的岩石图片](/assets/img/shiprock.jpg "title")](链接)`

## 11 转义字符

显示原本用于格式化 Markdown 文档的字符，请在字符前面添加反斜杠字符 `\`

- 特殊字符自动转义

在 HTML 文件中，有两个字符需要特殊处理： `<` 和 `&` 。 `<` 符号用于起始标签，`&` 符号则用于标记 HTML 实体，如果你只是想要使用这些符号，你必须要使用实体的形式，像是 `&lt;` 和 `&amp;`。

## 12 内嵌 HTML 标签

使用 HTML，不需要额外标注这是 HTML 或是 Markdown，只需 HTML 标签添加到 Markdown 文本中即可。

1. 行级内联标签

`Plain Text This **word** is bold. This <em>word</em> is italic. `

This **word** is bold. This *word* is italic.

![image.png](assets/image%201-20250107221634-aqgwfu1.png)

1. 区块标签

```Shell
This is a regular paragraph.

<table>
<tr>
<td>Foo</td>
</tr>
</table>

This is another regular paragraph.
```

This is a regular paragraph.

<table>
<tr>
<td>Foo</td>
</tr>

<div>
</table>
</div>

This is another regular paragraph.

![image.png](assets/image%202-20250107221634-elq7cx3.png)
