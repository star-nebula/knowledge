---
title: JavaScript
created: 2026-05-22
tags:
  - JavaScript
  - 前端
  - ES6
type: 概念解释
related:
  - "[[Frontend-MOC]]"
  - "[[Knowledge/Engineering/HTML]]"
  - "[[Knowledge/Engineering/CSS]]"
  - "[[JSON]]"
  - "[[jQuery]]"
  - "[[Vue3基础]]"
reference:
category: ["🛠️ 工程工具"]
---

## JavaScript

**简介**

1.1 简介 				1.2 JS 的引入方式

基础

2.1 基本语法			2.2 基本数据类型			2.3 运算符

2.4 流程控制语句		2.5

引用

[现代 JavaScript 教程](https://zh.javascript.info/) 	前端 开发

![[assets/JavaScript-0-20250923101811-yu8v9mq.png]]

### 简介

ECMAScript：

- 由 ECMA国际（European Computer Manufacturers Association International） 制定的语言标准
- 定义了 JavaScript 的语法、关键字、运算符、内置对象（如 `Array`​、`Promise`​、`class`​ 语法）等。

JavaScript：

- 基于 ECMAScript 标准的一种实现。
- 除了语法（来自 ECMAScript），还包括：

  - <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">浏览器环境</span>提供的 API（如 `document`​、`window`​、`fetch`​、`addEventListener`​ 等）；
  - <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">Node.js</span> 提供的 API（如 `fs`​、`http`​、`process`​ 等）
- js是一门 弱类型 的编程语言，属于基于对象和基于原型的脚本语言

### JS 的引入方式

```html
1 直接编写
    <script>
        console.log('hello yuan')
    </script>
2 导入文件
    <script src="hello.js"></script>
```

### 基本语法

- 变量

  ```js
  // 方式1 先声明再赋值
  var 变量名;   // 声明的变量如果没有进行赋值,或者没有被定义的变量,值默认是undefined
  变量名 = 变量值;

  // 方式2 声明并赋值
  var 变量名 = 变量值;

  // 方式3 一行可以声明多个变量.并且可以是不同类型
  var name="yuan", age=20, job="lecturer";
  ```

  【Tip】：

  - 声明变量时 不用`var`​则为全局变量
  - 变量命名首字符只能是 字母、下划线、$美元符

- 注释

  ​`// 单行注释`​

  ​`/* 多行注释 */`​
- 语句分隔符

  ```js
  var a = 1   // 分号和换行符作为语句分隔符号
  var b = 2;
  console.log(a,b)
  ```

### 基本数据类型

![[assets/JavaScript 基本数据类型-20250923102001-kmpaxyd.png]]

#### 1）数字类型

没有整型和浮点型，只有一种数字类型 `number`​

```js
var x = 10;
var y = 3.14;
console.log(x,typeof x);  // 10 "number"
console.log(y,typeof y);  // 3.14 "number"
```

#### 2）字符串

- 创建字符串

  ```js
  // 方式一
  var str = "hello world";
  // 方式二
  var str = new String("hello word");
  ```

- 计算字符串的长度

  ```js
  console.log( str.length );
  ```

- 字母大小写转换

  ```js
  console.log( str.toUpperCase() ); // 字母大写转换
  console.log( str.toLowerCase() ); // 字母小写转换
  ```

- 根据下标获取字符串的指定字符

  ```js
  console.log(str[1]); 
  ```
- 获取指定字符在字符串中第一次出现的索引位置

  ```js
  // index0f
  console.log( str.indexOf("e") );
  ```

- 切片

  ​`slice(开始下标)`​   从开始位置切到最后

  ​`slice(开始下标,结束下标)`​  从开始下标切到指定位置之前

  ```js
  var ret = str.slice(5);
  var ret = str.slice(3,6); 
  ```
- 正则分割，把字符串转换成数组

  ```js
  // split
  var str = "广东-深圳-南山";
  var ret = str.split("-");
  console.log(ret);
  ```

- 截取

  ```js
  // substr  截取
  var str = "hello world";
  var ret = str.substr(0,3);
  console.log(ret); // hel
  ```

- 移除字符串首尾空白

  ```js
  // trim    移除字符串首尾空白
  var password = "    ge llo   ";
  var ret = password.trim();
  console.log(password.length); // 13
  console.log(ret.length);  // 6
  ```

#### 3）布尔值

> 1、`Boolean`​类型仅有两个值：true和false，也代表1/0、on/off、yes/no  
> 3、Boolean值主要用于JavaScript的<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">控制语句</span>

```js
console.log(true);
console.log(false);
console.log(typeof true);
console.log(true === 1);
console.log(true == 1);
console.log(true + 1);
console.log(false + 1);
```

#### 4）空值

- ​`undefined`​类型，只有一个值 `undefined`​

  1. 当声明的变量未初始化时，其默认值是 `undefined`​
  2. 当函数无明确返回值时，返回值也是 `undefined`​

- ​`null`​类型，只有一个值 `null`​

  值 undefined 实际上是从值 null 派生来的，因此 ECMAScript 把它们定义为相等的

  - undefined 是声明了变量但未对其初始化时赋予该变量的值
  - null 用于表示尚未存在的对象

    如果函数或方法要返回的是对象，那么找不到该对象时，返回的通常是 null。

#### 5）类型转换

强制转换 和 自动转换

> 因为js是一门弱类型的脚本语言,所以变量会在运算符的运行要求,有时候根据运算符的要求,进行自动转换的.

- 强制转换

  1. 转为数值类型

  ```js
  parseInt     把数据转换成 整数
  parseFloat   把数据转换成 小数
  Number       把数据转换成 数值 // 使用Number转换的数据里面必须是纯数字
  							// NaN 属于number类型
  ```

  ```js
  var box1 = "一共100件"; // 转换会失败
  var box1 = "100件"    
  var ret = parseInt(box1); // 把数据转换成整数
  ```

  ```js
  var box2 = "3.1.4"; // 3.1
  console.log(parseFloat(box2) ); // 把数据转换成小数
  ```

  ```js
  var box3 = "3.14";   // 转换失败
  var box3 = "3.1.4";  // 转换失败
  console.log( Number(box3) ); 
  ```

  2. 转为字符串

  ```js
  变量.toString()
  String(数据)
  ```

  ```js
  // 方式一
  var box4 = 3.14;
  var ret1 = box4.toString();
  console.log(ret1);
  // 方式二
  ret2 = String(box4);
  console.log(ret2);
  // 方式三
  console.log(box4.toString(), typeof box4.toString())
  ```

  3. 转为布尔类型

  ```js
  Boolean()
  ```

  ```js
  // 零值 false
  // 字符串 "" 为空，布尔值为 false
  console.log(Boolean(""));       // false
  console.log(Boolean("0"));      // true
  console.log(Boolean("1"));      // true
  console.log(Boolean("abc"));    // true
  // 数值类型 为 0，布尔值为 false
  console.log(Boolean(0));        // false
  console.log(Boolean(1));        // true
  console.log(Boolean(-11));      // true
  ```

  ```js
  console.log(Boolean(null));     // false
  console.log(Boolean([]));       // true
  console.log(Boolean({}));       // true
  console.log(Boolean(undefined));// false
  ```

- 自动转换

  弱类型中的变量会根据当前代码的需要,进行类型的自动隐式转化

  ```js
  console.log(1 + true); // 2
  // js中运算符的优先级中, 字符串拼接的优先级要高于数值的加减乘除
  console.log(1 + "200"); // 1200
  console.log(1 - "200"); // -199
  ```

#### 6）原始值和引用值

根据数据类型不同，有的变量储存在栈（栈空间）中，有的储存在堆（堆空间）中。

- 原始变量及其值储存在栈中。当把一个原始变量传递给另一个原始变量时，是把一个栈房间的东西复制到另一个栈房间，且这两个原始变量互不影响。
- 引用值是把引用变量的名称储存在栈中，其实际对象储存在堆中，且存在一个指针由变量名指向储存在堆中的实际对象

  当把引用对象传递给另一个变量时，复制的是指向实际对象的指针， 此时 两者指向的 是同一个数据

  若通过方法改变其中一个变量的值，则访问另一个变量时，其值也会随之加以改变；

  若不是通过方法 而是通过 重新赋值 此时 相当于 重新开了一个房间 该值的原指针改变 ，则另外一个 值不会随他的改变而改变。

```js
// 初始值类型
var a = "yuan";
var b = a;
a = "alvin";
console.log(a); // alvin
console.log(b);	// yuan
```

```js
// 对象类型
var arr1=[1,2];
arr2 = arr1;
arr1.push(3);
console.log(arr1) 	// [1,2,3]
console.log(arr2);	// [1,2,3]

arr1=[4,5];
console.log(arr1);	//[4,5]
console.log(arr2);	//[1,2,3]
```

> var 可开辟空间，直接 = 的话只是引用

### 运算符

- 算术运算符

  ```js
  +   相加
  -   相减
  *   相乘
  /   相除
  %   求余
  **  求幂
  a++ 数值后自增1   a += 1	先赋值再计算
  ++a 数值前自增1   a=a+1	先计算再赋值
  b-- 数值后自减1   b=b-1
  --b 数值前自减1   b=b-1
  ```
- 赋值运算符

  ```js
  =
  +=
  -=
  *=
  /=
  %=
  **=
  ```

- 比较运算符，结果：`true`​ / `false`​

  ```js
  >   大于
  <   小于
  >=  大于或者等于
  <=  小于或者等于
  !=  不等于[计算数值]
  ==  等于[计算]
  !== 不全等[不仅判断数值,还会判断类型是否一致]
  === 全等[不仅判断数值,还会判断类型是否一致]
  ```

- 逻辑运算符

  ```js
  &&   并且  and    两边的运算结果为true,最终结果才是true
  ||   或者  or     两边的运算结果为false,最终结果才是false
  !    非    not    运算符的结果如果是true,则最终结果是false，反之亦然
  ```

  ```js
  // 逻辑运算符进阶用法:
  1. 实现短路
  var a = true && "hehe"  >>>  a = "hehe"
  var a = false || 2      >>> a = 2

  2. 快速布尔化[把数据快速转换成布尔类型]
  var a = 100
  !!a  >>> true
  ```

- 条件运算符（三目运算符）

  ```js
  条件?true:false
  ```

  ```js
  var age =2;
  var ret = age>=18?"成年":"未成年";
  console.log(ret)
  ```

### 流程控制语句

编程语言的流程控制分为三种：

- 顺序结构(从上向下顺序执行)

  例：

  ```js
  console.log("星期一");
  console.log("星期二");
  console.log("星期三");
  ```
- 分支结构
- 循环结构

#### 1）分支结构

- ​`if`​ 分支语句

  ```js
  if(条件){
      // 条件为true时,执行的代码
  	}
  ```

  ```js
  if(条件){
  	// 条件为true时,执行的代码
  	}else{
  	// 条件为false时,执行的代码
  }
  ```

  ```js
  if(条件1){
  // 条件1为true时,执行的代码
  }else if(条件2){
  // 条件2为true时,执行的代码
  }...
  }else{
  // 上述条件都不成立的时候,执行的代码
  }
  ```

- switch语句

  ```js
  switch(条件){
  	case 结果1:
  		满足条件执行的结果是结果1时,执行这里的代码.. ;
  		break;
  	case 结果2:
  		满足条件执行的结果是结果2时,执行这里的代码.. ;
  		break;
  	.....
  	default:
  		条件和上述所有结果都不相等时,则执行这里的代码;
  	}
  ```

- switch…case会生成一个跳转表来指示实际的case分支的地址，而这个跳转表的索引号与switch变量的值是相等的。

  从而，switch…case不用像if…else那样遍历条件分支直到命中条件，而只需访问对应索引号的表项从而到达定位分支的目的。

- 到底使用哪一个选择语句，代码环境有关，如果是范围取值，则使用if else语句更为快捷；如果是确定取值，则使用switch是更优方案。

#### 2）循环语句

- while循环

  ```js
  while(循环的条件){
  	// 循环条件为true的时候，执行这里的代码
  }
  ```

- for循环

  ```js
  // 循环三要素
  for(1.声明循环的开始; 2.条件; 4.循环的计数){
  	// 3.循环条件为true的时候,执行这里的代码
  }
  ```

  ```js
  for(循环的成员下标 in 被循环的数据){
  // 当被循环的数据一直没有执行到最后下标,都会不断执行这里的代码
  }   
  ```

- 遍历循环

  ```js
  for (var i in arr){
  	console.log(i)
  }
  ```
- 退出循环（`break`​和`continue`​）

  ```js
  for (var i = 0;i<100;i++){
  	if (i===88){
  		continue  // 退出当次循环
          // break  // 退出当前整个循环
  	}
  	console.log(i)
  }
  ```

### 数组对象

#### 1）创建数组

```js
var arrname = [元素0,元素1,….];
```

```js
var arrname = new Array(元素0,元素1,….);
```

#### 2）数组方法

- 内置属性

  ```js
  arr[3]
  arr.length
  arr[arr.length-1] // 最后一个成员
  ```

- ​`pop()`​ 出栈，删除最后一个成员作为返回值

- ​`push()`​ 入栈，给数组后面追加成员
- ​`shift()`​ 将数组的第一个元素删除
- ​`unshift()`​ 将值插入到数组的开头
- ​`reverse()`​ 反转排列
- ​`slice(,)`​  切片,开区间
- ​`sort()`​ 字符排序，非数值排序
- 数值升序

  ```js
  var arr = [3,4,1,2,5,10];
  arr.sort(function(a,b){
      return a-b;
  });
  console.log(arr);  // [1, 2, 3, 4, 5, 10]
  ```

- 数值降序

  ```js
  var arr = [3,4,1,2,5,10];
  arr.sort(function(a,b){
      return b-a;
  });
  console.log(arr); // [10, 5, 4, 3, 2, 1]
  ```

- ​`splice(start, deleteCount, item1, item2, ...)`​

  添加/删除/替换<span data-type="text" style="font-size: 16px;">指定</span>的成员   "万能函数"

  |参数|含义|
  | :-----| :-----------------------------------|
  |​`start`​|起始索引|
  |​`deleteCount`​|删除的元素个数，省略则删到数组末尾|
  |​`itemN`​|插入 / 替换 进来的元素|

- ​`concat()`​ 把2个或者多个数组合并

  ```js
  oldArr.concat(arr1, arr2, ...)
  ```
- ​`join()`​  把数组中的成员按照指定符号拼接成字符串
- ​`find()`​  返回符合条件的第一个成员

  ```js
  const users = [
    { id: 1, name: 'Tom' },
    { id: 2, name: 'Jerry' },
  ];

  const jerry = users.find(u => u.name === 'Jerry');
  console.log(jerry); // { id: 2, name: 'Jerry' }
  ```

- ​`filter()`​ 高阶函数, 对数组的每一个成员进行过滤,返回符合条件的结果
- ​`map()`​ 对数组的每一个成员进行处理,返回处理后的每一个成员\

  ```js
  var arr = [1,2,3,4,5];
  var ret = arr.map((num)=>{
  	return num**3;
  });
  console.log( ret  ); // [1, 8, 27, 64, 125]
  ```
- ​`includes`​   查询数据是否在数组中存在
- ​`indexOf()`​  查询数据在数组中第一次出现的位置
- ​`isArray()`​  判断变量的值是否是数组

#### 3）遍历数组

```js
 var arr = [12,23,34]
 for (var i in arr){
       console.log(i,arr[i])
 }
```

### Object 对象

#### 1）object 对象的基本操作

- 创建 Object

  1. 构造函数模式（一般不用）

  ```js
  var obj = new Object();   // 或 new Object(null)
  obj.name = 'yuyu';
  obj.age = 18;
  ```

  2. 对象字面量

  ```js
  var obj = {name: 'Tom', age: 18 };
  ```

- object 可以通过`.`​ 和 `[]`​来访问

  ```js
  console.log(obj["age"]);
  console.log(obj.age)
  ```

- object 可以通过`for`​循环遍历

  ```js
  for (var attr in obj){
  	console.log(attr,obj[attr]);
  }
  ```

#### 2）json 序列化 和 反序列化

​JSON​ 一种纯文本的数据交换格式，基于 ECMAScript 对象字面量语法

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script>
    // js对象,因为这种声明的对象格式很像json,所以也叫json对象
    var data = {
        name: "xiaoming",
        age: 22,
        say: function(){
            alert(123);
        }
    };

    // 把 json对象 转换成json字符串：序列化
    var ret = JSON.stringify(data);
    console.log(ret ); // {"name":"xiaoming","age":22}

    // 把 json字符串 转换成json对象：反序列化
    var str = `{"name":"xiaoming","age":22}`;
    var ret = JSON.parse(str);
    console.log(ret);
</script>
</body>
</html>
```

### Date对象

- 创建Date对象

  ```js
  // 方法1：不指定参数
  var nowd1 = new Date();
  console.log(nowd1.toLocaleString( ));
  ```

  ```js
  // 方法2：参数为 日期字符串
  var d2 = new Date("2004/3/20 11:12");
  console.log(d2.toLocaleString( ));
  var d3 = new Date("04/03/20 11:12");
  console.log(d3.toLocaleString( ));
  ```

  ```js
  // 方法3：参数为 毫秒数
  var d4 = new Date(5000);
  console.log(d4.toLocaleString( ));
  console.log(d4.toUTCString());
  ```

  ```js
  // 方法4：参数为 年月日小时分钟秒毫秒
  var d5 = new Date(2004,2,20,11,12,0,300);
  console.log(d5.toLocaleString( )); // 毫秒并不直接显示
  ```

- 获取时间信息（时间片）

  ```java
  getDate()                 获取 日
  getDay ()                 获取 星期
  getMonth ()               获取 月（0-11）
  getFullYear ()            获取 完整年份
  getYear ()                获取 年
  getHours ()               获取 小时
  getMinutes ()             获取 分钟
  getSeconds ()             获取 秒
  getMilliseconds ()        获取 毫秒
  getTime ()                返回累计毫秒数(从1970/1/1午夜)
  ```

- 日期和时间的转换

  ```java
  // 返回 国际标准 时间字符串
  toUTCString()
  // 返回 本地格式 时间字符串
  toLocalString()
  // 返回 累计毫秒数(从1970/1/1午夜到本地时间)
  Date.parse(x)
  // 返回 累计毫秒数(从1970/1/1午夜到国际时间)
  Date.UTC(x)
  ```

### Number 对象

- 内置方法

  - ​`toFixed(fractionDigits)`​ 保留小数位，返回**字符串**
  - ​`toPrecision(precision)`​ 指定有效数字位数
  - ​`toExponential(fractionDigits)`​ 科学计数法
  - ​`toString(radix)`​ 按给定进制转换

### Math对象

Math 是一个<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">静态内置对象</span>，所有方法都挂在 `Math.*`​ 上，<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">没有实例、不能 new</span>

- ​`abs(x)`​  返回绝对值
- ​`ceil(x)`​  向上取整
- ​`floor(x)`​ 向下取整
- ​`round(x)`​ 四舍五入
- ​`max(x,y,z,...,n)`​
- ​`min(x,y,z,...,n)`​
- ​`pow(x,y)`​  x 的 y 次幂
- ​`random()`​  生成 0~1随机数

### 4.12 Function 对象

#### 1）声明函数

```js
// 方式一
function 函数名 (参数){
    函数体;
    return 返回值;
}
// 可以使用变量、常量或表达式作为函数调用的参数
```

```js
// 方式二
var 函数名 = new Function("参数1","参数n","function_body");
// 例:
const sum = new Function('a', 'b', 'return a + b');
console.log(sum(1, 2)); // 3
```

#### 2）函数调用

```js
function f(){
	console.log("hello")
}
f()
```

js代码在运行时，会分为两大部分———预编译 和 执行阶段

- 预编译：会先检测代码的语法错误，进行变量、函数的声明。
- 执行阶段：变量的赋值、函数的调用等，都属于执行阶段。

#### 3）函数参数

1. 参数基本使用

    ```js
    function 函数(形参1，形参2，...){
    	函数体
    }
    函数名(实参1,实参2,...)
    ```

    ```js
    // 位置参数
    function foo(a,b){
        console.log(a);
        console.log(b);
    }
    foo(1,2,3); // x=1,y=2
    foo(1); // x=1,y=undefined

    // 默认参数
    function stu_info(name,gender="female"){
        console.log("姓名："+name+" 性别："+gender)
    }
    stu_info("yuyu") // 姓名：yuyu 性别：female
    ```

2. 函数中的 `arguments`​ 对象

    ​`arguments`​ 用来模拟可变参数，且 类数组

    ```js
    function add(a,b){
            console.log(a+b);//3
            console.log(arguments.length);//2
            console.log(arguments);//[1,2]
    }
    add(1,2)

    // arguments的应用1 
    function add2(){
        var result=0;
        for (var num in arguments){
            result += arguments[num]
        }
        console.log(result)
    }
    add2(1,2,3,4,5)

    // arguments的应用2
    function f(a,b,c){
        if (arguments.length! = 3){
            throw new Error("function f called with "+arguments.length+" arguments,but it just need 3 arguments")
        }
        else {
            alert("success!")
        }
    }
    f(1,2,3,4,5)
    ```

#### 4）函数返回值

在函数体内，使用 return 语句可以设置函数的返回值。

一旦执行 return 语句，将停止函数的运行，并运算和返回 return 后面的表达式的值。

如果函数不包含 return 语句，则执行完函数体内每条语句后，返回 undefined 值。

```js
function add(x,y) {
          return x+y
      }

var ret = add(2,5);
console.log(ret)
```

> 1. 在函数体内可以包含多条 return 语句，但是仅能执行一条 return 语句
>
> 2. 函数的参数没有限制，但是返回值只能是一个；
>
> 3. 如果要输出多个值，可以通过数组或对象进行设计。

#### 5）匿名函数

匿名函数，即没有变量名的函数。  
在实际开发中使用的频率非常高！也是学好JS的重点。

```js
// 匿名函数赋值变量
var func = function () {
    console.log("匿名函数...")
};
func();

// 匿名函数的自执行
(function (x,y) {
	console.log(x+y);
})(2,3)
```

```js
// 匿名函数作为一个高阶函数使用
function bar() {
    return function () {
        console.log("inner函数！")
    }
}
bar()();
```

> 使用匿名函数表达式时，函数的调用语句，必须放在函数声明语句之后！

#### 6）函数作用域

作用域是JavaScript最重要的概念之一，想要学好JavaScript就需要理解JavaScript作用域和作用域链的工作原理。

任何程序设计语言都有作用域的概念，简单的说，作用域就是变量可访问范围，即作用域控制着变量与函数的可见性和生命周期。

在JavaScript中，变量的作用域有<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">全局作用域</span>和<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">局部作用域</span>两种。

```js
// 局部变量,是在函数内部声明,它的生命周期在当前函数被调用的时候, 当函数调用完毕以后,则内存中自动销毁当前变量
// 全局变量,是在函数外部声明,它的生命周期在当前文件中被声明以后就保存在内存中,直到当前文件执行完毕以后,才会被内存销毁掉
```

- 首先熟悉下var

  ```js
  var name = "yuan"; 	// 声明一个全局变量name并赋值 ”yuan“
  name = "张三";  		// 对已经存在的变量name 重新赋值 ”张三“
  console.log(name);	// 张三

  age = 18 ;  // 之前不存在age变量，这里等同于var age = 19 即声明全局变量age并赋值为18
  console.log(age); 	// 18
  var  gender = "male";
  var  gender = "female"; // 原内存释放与新内存开辟，指针指向新开辟的内存
  console.log(gender);// female
  ```

- 作用域案例：

  ```js
  var num = 10; // 在函数外部声明的变量, 全局变量
  function func(){
      // num = 20;    // 函数内部直接使用变量,则默认调用了 全局变量
      var num = 20;   // 函数内部使用var 或者 let声明的变量则是 局部变量
      // 使用变量的时候,解释器会在当前花括号范围值搜索是否有关键字 var 或者 let 声明了变量
      // 如果没有,则一层一层往外查找最近的声明
      // 如果最终查找不到,则直接报错! 变量名 is not define!
      console.log("函数内部num：",num)
  }
  func();
  console.log("全局num：",num);
  ```

#### 7）JS的预编译

- js运行三个阶段：

  1. 语法分析
  2. 预编译
  3. 解释执行

语法分析就是JS引擎去检查你的代码是否有语法错误，解释执行就是执行你的代码。最重要最需要理解的就是第二个环节预编译，简单理解就是在内存中开辟一些空间，存放一些变量与函数 。

- 预编译可分为<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">全局预编译</span>和<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">局部预编译</span>

> 1. 在js脚本加载之后，会先通篇检查是否存在低级错误；
> 2. 在语法检测完之后，便进行<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">全局预编译</span>；
> 3. 在<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">全局预编译之后，就解释一行，执行一行</span>；
> 4. 当执行到函数调用那一行前一刻，会先进行<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">函数预编译</span>，再往下执行。

- <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">全局预编译</span>的3个步骤：

  1. 创建`GO`​​<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">对象</span>（Global Object）全局对象，即 window对象
  2. 找变量声明，将 <span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">变量名</span> 作为 `GO`​​<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">属性名</span>，值为 `undefined`​
  3. 查找<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">函数声明</span>，作为 `GO`​​<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">属性</span>，值赋予函数体

- <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">局部预编译</span>的4个步骤：

  1. 创建`AO`​​<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">对象</span>（Activation Object）执行期上下文
  2. 找 形参和变量声明，将 <span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">变量和形参名</span> 作为`AO`​​<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">属性名</span>，值为`undefined`​
  3. 将 实参值和形参统一
  4. 在<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">函数体里找函数声明</span>，值赋予函数体

> GO对象是全局预编译，所以它优先于AO对象所创建和执行

- 案例分析：

  ```html
  <script>
      console.log(a);
      var a = 10;
      console.log(a);

      function foo(a) {
          console.log("---",a);
          var a = 100;
          console.log(a);
          function a() {} // 若注释，则 console.log("---",a) 就不是函数体
          console.log(a);
          var b = function(){};
          console.log(b);
          function d() {}
      }
      var c = function (){
      	console.log("匿名函数C");
      };
      console.log(c);
      foo(20);
  <script>
  ```

  - 全局预编译

    ```js
    GO/window = {
    	a: undefined,
    	c: undefined，
    	foo: function(a) {
    		console.log(a);
    		var a = 123;
    		console.log(a);
    		function a() {}
    		console.log(a);
    		var b = function() {}
    		console.log(b);
    		function d() {}
    	}
    }
    ```
  - 解释执行代码（直到执行调用函数foo(20)语句）

    ```js
    GO/window = {
    	a: 10,
    	c: function (){
    		console.log("I am at C function");
    	}
    	test: function(a) {
    		console.log(a);
    		var a = 123;
    		console.log(a);
    		function a() {}
    		console.log(a);
    		var b = function() {}
    		console.log(b);
    		function d() {}
    	}
    }
    ```
  - 调用函数foo(20)前发生局部预编译

    ```js
    // 局部预编译前两步：
    AO = {
    	a:undefined, 	// 变量和形参名 作为AO属性名
    	b:undefined,
    }

    // 局部预编译第三步：
    AO = {
    	a:20,			// 实参值和形参统一
    	b:undefined,
    }

    // 局部预编译第四步：
    AO = {
    	a:function a() {}, // 函数体里找函数声明
    	b:undefined
    	d:function d() {}
    }
    ```

预编译总结：

1. 函数声明 整体提升

    无论函数调用和声明的位置是前是后，系统总会把函数声明移到调用前面
2. 变量 声明提升

    无论变量调用和声明的位置是前是后，系统总会把声明移到调用前，注意仅仅只是声明，所以值是undefined

- 面试题

  ```js
  var num3 = 10;
  function func3(){
      console.log("num3:::",num3); // undefined
      var num3 = 20;
  }
  func3();
  console.log("num3---",num3); // 10
  ```

  - 全局预编译

    ```js
    GO{
        num3: undefined, 
        func3: <ref>  // function 提升
    }
    ```
  - 全局执行

    ```js
    var num3 = 10;
    ```
  - 局部预编译

    ```js
    AO(func3){
    	arguments: {length:0}, // 函数自动生成
    	num3: undefined        // var 提升
    }
    ```
  - 局部执行

    ```js
    console.log("num3:::", AO.num3)	// undefined
    AO.num3 = 20 
    ```
  - 全局执行

    ```js
    console.log("num3---",num3);
    ```

### 4.13 BOM对象

BOM：Broswer object model（浏览器对象模型），即浏览器提供我们开发者在javascript用于<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">操作浏览器</span>的对象。

#### 1）`window`​ 对象

​`js`​中最大的一个对象，整个浏览器窗口出现的所有东西都是`window`​对象的内容

​`window`​ 是全局对象，调用时可省略

- 窗口方法

  ```js
  console.log(window);
  ```

  - ​`window`​ 对象中的<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">三个弹框</span>方法

    ```js
    window.alert("警告框");
    window.confirm("确认框"); // 点击确认,返回true；点击取消,返回false
    window.prompt("输入框"); // 点击确认，返回输入内容；点击取消。返回null
    ```
  - open 与 close 方法

    ```js
    window.close(); 
    window.open();
    ```

- 定时方法

  ​`setInterval()`​ 方法会不停地调用函数，直到 `clearInterval()`​ 被调用或窗口被关闭。而 `setTimeout()`​ 是在指定的毫秒数后调用code一次。

  由 `setInterval()`​ 和 `setTimeout()`​ 返回的 ID 值可用作 `clearInterval()`​ 方法的参数。

  ```js
  var ID = window.setInterval(code,millisec)  // 每millisec毫秒执行一次code
  var ID = window.setTimeout(code,millisec) 	// millisec毫秒后执行code一次
  window.clearTimeout(ID); // 取消循环定时器
  ```

  - 显示时间案例：

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <script>
            function show_time() {
                // 获取当前时间字符串
                var now = new Date();
                var now_str = now.toLocaleString();
                // console.log(now_str);
                // 将时间字符串赋值给input标签的value属性;
                var ele = document.getElementById("i1");
                // console.log(ele);
                ele.value = now_str; // 赋值给input标签的value属性
            }
            var ID;
            function start() {
                if (ID === undefined){  // 判断有定时器启动
                     show_time();
                     ID = setInterval(show_time,1000);
                }
            }
            function end() {
                clearInterval(ID);
                ID = undefined;
            }
        </script>
    </head>
    <body>
    	<input type="text" value="" id="i1"> 
    	<button onclick="start()">开始</button>
    	<button onclick="end()">结束</button>
    </body>
    </html>
    ```

#### 2）Location ( 地址栏）对象

location 方法：

```js
console.log(location); 
```

```js
location.href 		// URL的完整信息
location.host 		// 域名端口
location.hostname	// 域名
location.port		// 端口
location.pathname	// 路径
location.search		// get参数
location.assign()	// 跳转
location.reload()   // 刷新页面
```

#### 3）本地存储对象

使用存储对象的过程中, 对象数据会根据域名端口进行保存的，所以 js不能获取当前页面以外其他域名端口保存到本地的数据。

存储对象获取数据只能是自己当前端口或者域名下曾经设置过的数据，一旦端口或者域名改变，则无法获取原来的数据。

- ​`localStorage`​ 本地永久存储

  ```js
  localStorage.setItem("变量名","变量值");   保存一个数据到存储对象
  localStorage.变量名 = 变量值               

  localStorage.getItem("变量名")   获取存储对象中保存的指定变量对应的数据
  localStorage.变量名              

  localStorage.removeItem("变量名")   从存储对象中删除一个指定变量对应的数据
  localStorage.clear()               从存储对象中删除所有数据
  ```
- ​`sessionStorage`​ 本地会话存储

  ```js
  sessionStorage.setItem("变量名","变量值");   保存一个数据到存储对象
  sessionStorage.变量名 = 变量值              

  sessionStorage.getItem("变量名")   获取存储对象中保存的指定变量对应的数据
  sessionStorage.变量名              

  sessionStorage.removeItem("变量名")   从存储对象中删除一个指定变量对应的数据
  sessionStorage.clear()               从存储对象中删除所有数据
  ```

- ​`localStorage`​和`sessionStorage`​的区别：

  - 均只能存储字符串类型的对象
  - ​`localStorage`​生命周期是永久，这意味着除非用户显示在浏览器提供的UI上清除`localStorage`​信息，否则这些信息将永远存在。
  - ​`sessionStorage`​生命周期为当前窗口或标签页，一旦窗口或标签页被永久关闭了，那么所有通过`sessionStorage`​存储的数据也就被清空了。
  - 不同浏览器无法共享`localStorage`​或`sessionStorage`​中的信息。

    <span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">相同浏览器的不同页面</span>间可以共享相同的 `localStorage`​（页面属于相同域名和端口），但是<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">不同页面或标签页</span>间无法共享`sessionStorage`​的信息

    这里需要注意的是，页面及标签页仅指顶级窗口，如果一个标签页包含多个`iframe`​标签且他们属于同源页面，那么他们之间是可以共享`sessionStorage`​的。

### 4.14 DOM对象(JS核心)

DOM（document Object Model）文档对象模型

- 整个`html`​文档,会保存一个文档对象`document`​
- ​`console.log( document );`​ 获取当前文档的对象

#### 1）查找标签

- 直接查找标签

  ```js
  document.getElementsByTagName("标签名")	// 返回 数组
  document.getElementsByClassName("类名") 	// 返回 数组
  document.getElementById("id值") 		// 返回 dom对象
  ```

- 导航查找标签

  ```js
  elementNode.parentElement           // 父节点标签元素
  elementNode.children                // 所有子标签
  elementNode.firstElementChild       // 第一个子标签元素
  elementNode.lastElementChild        // 最后一个子标签元素
  elementNode.nextElementSibling     	// 下一个兄弟标签元素
  elementNode.previousElementSibling  // 上一个兄弟标签元素
  ```

- CSS选择器查找

  ```JS
  document.querySelector("css选择器")  	// 根据css选择符来获取查找到的 第一个元素，返回 标签对象（dom对象）
  document.querySelectorAll("css选择器"); 	// 根据css选择符来获取查找到的 所有元素，返回 数组
  ```

- 案例

  ```js
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>

  <body>
  	<div id="i1">DIV1</div>
  	<div class="c1">DIV</div>
  	<div class="c1">DIV</div>
  	<div class="c1">DIV</div>

  	<div class="outer">
  	    <div class="c1">item</div>
  	</div>

  	<div class="c2">
  	    <div class="c3">
  	        <ul class="c4">
  	            <li class="c5" id="i2">111</li>
  	            <li>222</li>
  	            <li>333</li>
  	        </ul>
  	    </div>
  	</div>

  	<script>
  	    // 直接查找
  	    var ele = document.getElementById("i1");  // ele就是一个dom对象
  	    console.log(ele);

  	    var eles = document.getElementsByClassName("c1"); // eles是一个数组 [dom1,dom2,...]
  	    console.log(eles);

  	    var eles2 = document.getElementsByTagName("div"); // eles2是一个数组 [dom1,dom2,...]
  	    console.log(eles2);

  	    var outer = document.getElementsByClassName("outer")[0];
  	    var te = outer.getElementsByClassName("c1");
  	    console.log(te);

  	    // 导航查找
  	    var c5 = document.getElementsByClassName("c5")[0];
  	    console.log(c5);  // c5是一个DOM对象
  	    console.log(c5.parentElement.lastElementChild);  // 返回值是dom对象
  	    console.log(c5.parentElement.children);  // 返回值是dom对象数组
  	    console.log(c5.nextElementSibling.nextElementSibling);
  	    console.log(c5.parentElement.children);

  	    // css选择器
  	    var dom = document.querySelector(".c2 .c3 .c5");
  	    console.log(":::",dom);

  	    var doms = document.querySelectorAll("ul li");
  	    console.log(":::",doms);

  	</script>
  </body>
  </html>
  ```

  【Tip】浏览器按照从上到下执行，查找前若没有dom对象，则返回 `null`​

#### 2）绑定事件

- 静态绑定 ：事件写进标签

  ```html
  <div id="div" onclick="foo(this)">click</div>
  <script>
      function foo(self){			// this 不能是形参
          console.log("foo函数");
          console.log(self);   
      }
  </script>
  ```

- 动态绑定：通过代码获取元素，再绑定事件

  ```js
  dom对象.on事件 = function(){
  	// 事件触发代码 
  }
  ```

  ```html
  <p id="i1">试一试!</p>
  <script>
      var ele=document.getElementById("i1");
      ele.onclick = function(){
          console.log("ok");
          console.log(this);		// this直接用
      };
  </script>
  ```

  > - ​`this`​ 代指触发事件的元素本身
  >
  > - 一个元素本身可以绑定多个不同的事件, 但是如果多次绑定同一个事件，则后面的事件代码会覆盖前面的事件代码
  >
  >   如：多个`onclick`​，后面的回覆盖前面的
  >

- 多个标签绑定事件

  ```html
  <ul>
      <li>111</li>
      <li>222</li>
      <li>333</li>
      <li>444</li>
      <li>555</li>
  </ul>
  <script>
      var eles = document.querySelectorAll("ul li");
  	// eles 是一个类数组对象，里面依次装着 5 个 <li> 节点
  	// eles.length === 5
      for(var i=0; i<eles.length; i++){
          eles[i].onclick = function (){
              console.log(this.innerHTML)
              // console.log(eles[i].innerHTML)  // 结果？
          }
      }
  </script>
  ```

  - 循环里用 `this`​ 才能拿到当前被点的 `<li>`​；
  - 循环体会立即绑定五次，每次将一个新的匿名函数赋值给当前的 `<li>`​ 的 `onclick`​
  - 而函数体中的代码并没有执行，当点击时才会执行
  - 用 `eles[i]`​ 会出错，因为循环结束后 `i`​ 已经变成 5，所有点击都会去找 `eles[5]`​（不存在）

#### 3）操作标签

```html
<标签名 属性1=“属性值1” 属性2=“属性值2”……>文本</标签名>
```

- 文本操作

  ```js
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <div class="name"><span>alvin</span></div>
      <script>

      // 查询文本
      var ele = document.querySelector(".name");
      console.log(ele.innerHTML); // <span>alvin</span>
      console.log(ele.innerText); // click

          // 设置文本
          ele.ondblclick = function () {
              // ele.innerHTML = "yuyu";
              // ele.innerText = "yuyu";
              ele.innerHTML = "<a href=''>yuyu</a>";
              // ele.innerText = "<a href=''>yuyu</a>" // 纯文本显示
          }

      </script>
  </body>
  </html>
  ```

- value 操作

  ​`input`​标签、`select`​标签、`textarea`​标签是没有文本的，显示内容由`value`​属性决定

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <input type="text" class="c1" value="hello world"><button class="btn">change</button>

      <select name="" id="i1">
          <option value="shandong">山东省</option>
          <option value="hebei" selected="selected">河北省</option>
          <option value="hunan">湖南省</option>
      </select>
      <button class="btn2">change2</button>

      <p><textarea name="" id="i2" cols="30" rows="10">yuan</textarea></p>

      <script>
          // input标签
          // var ele1 = document.querySelector(".c1");
          // console.log(ele1.value);
          // ele1.value = "hello JS!";
          var btn = document.getElementsByClassName("btn")[0]; // 获取第一个元素
          btn.onclick = function () {
              // ele1.value = "hello JS!";
              console.log(this.previousElementSibling); // 上一个兄弟标签元素
              this.previousElementSibling.value = "hello JS!";
          };

          // select标签
          var ele2 = document.querySelector("#i1");
          console.log(ele2.value);
          var btn2 = document.getElementsByClassName("btn2")[0];
          btn2.onclick = function () {
              ele2.value = "shandong"
          };

          // textarea标签
          var ele3 = document.querySelector("#i2");
          console.log(ele3.value);
          ele3.value = "welcome to JS world!"
      </script>
  </body>
  </html>
  ```

- css样式操作

  ```js
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <div class="c1">hello world!</div>
      <script>
          var ele = document.querySelector(".c1");
          ele.onclick = function () {
              this.style.color = "red";
          } 
      </script>
  </body>
  </html>
  ```

- 属性操作

  ```js
  elementNode.setAttribute("属性名","属性值")  	// 添加或修改属性
  elementNode.getAttribute("属性名")       	// 获取属性值
  elementNode.removeAttribute("属性名");		// 删除属性
  ```

  ```js
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <div class="c1" id="i1" k1="v1" value="xxx">hello world!</div>
      <script>
      var ele = document.querySelector(".c1");
      // console.log(this.value); // value属性不是其自带的
      console.log(ele.getAttribute("value")); 
      ele.setAttribute("k2","v2"); 
      console.log(ele.getAttribute("k2"));
      ele.removeAttribute("k1");
      console.log(ele.getAttribute("k1")); // null
  </script>
  </body>
  </html>
  ```

  - ​`class`​ 属性操作

    ```js
    elementNode.className
    elementNode.classList.add
    elementNode.classList.remove
    ```

    ```js
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            .c1{
                background-color: rebeccapurple;
            }

            .c2{
                color: red;
            }

            .hide{
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="c1">hello JS</div>
        <script>
            var ele = document.querySelector(".c1");
            ele.onclick = function () {
                // this.classList.add("c2");
                this.classList.add("hide");
            }
        </script>
    </body>
    </html>
    ```
  ##### 案例：tab 切换

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <style>
            *{
                margin: 0;
                padding: 0;
            }

            .tab{
                width: 800px;
                height: 300px;
                /*border: 1px solid red;*/
                margin: 200px auto;
            }

            .tab ul{
                list-style: none;
            }

            .tab-title{
                background-color: #f7f7f7;
                border: 1px solid #eee;
                border-bottom: 1px solid #e4393c;
            }

            .tab .tab-title li{
                display: inline-block;
                padding: 10px 25px;
                font-size: 14px;
            }

            li.current {
                background-color: #e4393c;
                color: #fff;
                cursor: default;
            }

            .hide{
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="tab">
            <ul class="tab-title">
                <li class="current" index="0">商品介绍</li>
                <li class="" index="1">规格与包装</li>
                <li class="" index="2">售后保障</li>
                <li class="" index="3">商品评价</li>
            </ul>

            <ul class="tab-content">
                <li>商品介绍...</li>
                <li class="hide">规格与包装...</li>
                <li class="hide">售后保障...</li>
                <li class="hide">商品评价...</li>
            </ul>
        </div>
        <script>
            var titles = document.querySelectorAll(".tab-title li");
            var contents = document.querySelectorAll(".tab-content li");
            for (var i = 0;i<titles.length;i++){
                titles[i].onclick = function () {
                    // (1) 触发事件标签拥有current样式
                    for (var j = 0;j<titles.length;j++){
                        titles[j].classList.remove("current")
                    }
                    console.log(this);
                    this.classList.add("current");

                    // (2) 显示点击title对应的详情内容
                    var index = this.getAttribute("index");
                    // console.log(this.getAttribute("index"));
                    // console.log(contents[index]);
                    for (var z = 0;z<contents.length;z++){
                        contents[z].classList.add("hide");
                    }
                    contents[index].classList.remove("hide");
                }
            } 
        </script>
    </body>
    </html>
    ```

- 节点操作

  ```js
  // 创建节点：
  document.createElement("标签名")
  // 插入节点
  somenode.appendChild(newnode)            // 追加一个子节点（作为最后的子节点）
  somenode.insertBefore(newnode,某个节点)   // 把增加的节点放到某个节点的前边
  // 删除节点
  somenode.removeChild()：// 获得要删除的元素，通过父元素调用删除
  //替换节点
  somenode.replaceChild(newnode, 某个节点);
  ```

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
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
          var add_btn = document.querySelector(".add_btn");
          var del_btn = document.querySelector(".del_btn");
          var replace_btn = document.querySelector(".replace_btn");

          var c1 = document.querySelector(".c1");
          var c2 = document.querySelector(".c2");

          add_btn.onclick = function () {
              // 创建节点
              var ele = document.createElement("img");  // <img>
              ele.src = "https://img2.baidu.com/it/u=1613029778,1507777131&fm=26&fmt=auto&gp=0.jpg"
              console.log(ele);

              // 添加节点
              c1.appendChild(ele);
              // c1.insertBefore(ele, c2)
          };
          del_btn.onclick = function () {
              // 删除子节点
              c1.removeChild(c2);
          };

          replace_btn.onclick = function () {
              // 创建替换节点
              var ele = document.createElement("img");  // <img>
              ele.src = "https://img2.baidu.com/it/u=1613029778,1507777131&fm=26&fmt=auto&gp=0.jpg"
              console.log(ele);

              // 替换节点
              c1.replaceChild(ele, c2);
          }
      </script>
  </body>
  </html>
  ```

#### 4）常用事件

- ​`onload`​ 事件

  浏览器把指定资源加载完后才会触发

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script>
         window.onload = function (){
              ele = document.getElementById("i1")
              console.log(ele.innerHTML);
         }
      </script>
  </head>
  <body>
  	<div id="i1">yuan</div>
  </body>
  </html>
  ```
- ​`onsubmit`​ 事件

  “<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">表单准备提交</span>” 的瞬间触发，常用来做<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">前置校验</span>或<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">阻止提交</span>

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
  	<form action="" id="i1">
  	     用户名：<input type="text">
  	     密码：  <input type="password">
  	    <input type="submit">
  	</form>
  	<script>
  	     var ele = document.getElementById("i1");
  	     var user = document.querySelector("#i1 [type=text]")
  	     var pwd = document.querySelector("#i1 [type=password]")
  	     ele.onsubmit = function (e){
  	           console.log(user.value);
  	           console.log(pwd.value);
  	           return false;    // 终止事件执行
  	           // e.preventDefault() // 阻止元素默认行为（默认提交）
  	     }
  	</script>
  </body>
  </html>
  ```

- ​`onchange`​ 事件

  “<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">值发生改变 且 元素失去焦点</span>”时触发  
  常见于输入框、下拉框、单/多选框、文件选择框等，适合做<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">最终校验</span>或<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">联动更新</span>

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
  	<select name="provonce" id="provice">
  	    <option value="hebei">请选择省份</option>
  	    <option value="hubei">湖北省</option>
  	    <option value="hunan">湖南省</option>
  	    <option value="hebei">河北省</option>
  	</select>
  	<select name="provonce" id="city">
  	    <option value="hebei">请选择城市</option>
  	</select>
  	<script>
  	   var data={"hunan":["长沙","岳阳","张家界"],"hubei":["武汉","襄阳","荆州"],"hebei":["石家庄","保定","张家口"]};
  	   console.log(data);
  	   var ele =  document.getElementById("provice");
  	   var ele2 =  document.getElementById("city");
  	   ele.onchange=function () {
  	       console.log(this.value);
  	       var citys = data[this.value]; // 获取城市数据
  	       console.log(citys);
  	       // 清空操作
  	       ele2.options.length=1;
  	       // 创建标签
  	       for (var i=0; i<citys.length; i++){ // 遍历城市数组，动态创建 <option> 并插入
  	           var option =  document.createElement("option"); // </option></option>
  	           option.innerHTML=citys[i];
  	           ele2.appendChild(option)
  	       }
  	   }
  	</script>
  </body>
  </html>
  ```

- ​`onmouse`​ 事件（鼠标事件）

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <style>
          #container{
              width: 300px;
          }
          #title{
              cursor: pointer;
              background: #ccc;
          }

          #list{
              display: none;
              background:#fff;
          }
          #list div{
              line-height: 50px;
          }
          #list  .item1{
              background-color: green;
          }
          #list  .item2{
              background-color: rebeccapurple;
          }
          #list  .item3{
              background-color: lemonchiffon;
          }

      </style>
  </head>
  <body>
  	<div id="container">
  	        <div id="title">使用了mouseout事件↓</div>
  	        <div id="list">
  	                <div class="item1">第一行</div>
  	                <div class="item2">第二行</div>
  	                <div class="item3">第三行</div>
  	        </div>
  	</div>
  	<script>
  	    var container=document.getElementById("container");
  	    var title=document.getElementById("title");
  	    var list=document.getElementById("list");
  	    // 鼠标移入
  	    title.onmouseover=function(){
  	        list.style.display="block";
  	    };
  	    // 鼠标移出  
  	    // container.onmouseout=function(){
  	    container.onmouseleave=function(){  
  	        list.style.display="none";
  	    };
  	</script>
  </body>
  </html>
  ```

  【Tip】

  1. 不论鼠标指针离开被选元素还是任何子元素，都会触发 `mouseout`​ 事件
  2. 只有在鼠标指针离开被选元素时，才会触发 `mouseleave`​ 事件

  - ​`mouseout`​会冒泡，也就是`onmouseout`​事件可能被同时绑定到了`container`​的子元素`title`​和`list`​上，所以鼠标移出每个子元素时也都会触发 `list.style.display="none";`​

- ​`onkey`​ 事件（键盘事件）

  - ​`keydown`​ 键盘上<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">任意键被按下</span>的瞬间触发（持续按住会连续触发）
  - ​`keyup`​ <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">松开按键</span>的瞬间触发

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <input type="text" id="t1"/>
      <script type="text/javascript">
          var ele=document.getElementById("t1");
           ele.onkeydown=function(e){
              console.log("onkeydown",e.key)
          };
           ele.onkeyup=function(e){
              console.log("onkeyup",e.key)
          };
      </script>
  </body>
  </html>
  ```

- ​`onblur`​和`onfocus`​事件

  - ​`onfocus`​ 当元素获得焦点（鼠标点进去、Tab 切进来、JS 调用 `focus()`​）时触发一次。
  - ​`onblur`​    当元素失去焦点（鼠标点出去、Tab 切走、JS 调用 `blur()`​）时触发一次。
  - 应用：

    - 输入框“选中高亮”或“失焦校验”
    - 下拉菜单、弹窗的显隐控制

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
  </head>
  <body>
      <input type="text" class="c1">
      <script>
          var ele = document.querySelector(".c1");
          // 获取焦点事件
          ele.onfocus = function () {
              console.log("in")
          };
          // 失去焦点事件
          ele.onblur = function () {
              console.log("out")
          }
      </script>
  </body>
  </html>
  ```

- 冒泡事件

  事件先在触发源元素上执行，然后沿着 DOM 树逐级向上（父 → 祖父 → … → document）传播，每一级祖先节点上如果也绑定了同类事件，都会被依次触发。

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <style>
          .c1{
              width: 300px;
              height: 300px;
              background-color: lightgray;
          }
          .c2{
              width: 100px;
              height: 100px;
              background-color: orange;
          }
      </style>
  </head>
  <body>
      <div class="c1">
          <div class="c2"></div>
      </div>
      <script>
          var ele1 = document.querySelector(".c1");
          ele1.onclick = function () {
              alert("c1区域")
          };
          var ele2 = document.querySelector(".c2");
          ele2.onclick = function (event) {
              alert("c2区域");
              event.stopPropagation(); // 阻止事件冒泡
          }
      </script>
  </body>
  </html>
  ```
