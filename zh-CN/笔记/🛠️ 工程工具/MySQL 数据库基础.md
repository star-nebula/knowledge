---
title: MySQL 数据库基础
date: 2026-05-25
tags:
  - MySQL
  - 数据库
  - SQL
type: 概念解释
related:
  - "[[MySQL-MOC]]"
  - "[[MySQL 开窗函数]]"
  - "[[MySQL 内置函数]]"
  - "[[MySQL 事务]]"
  - "[[MySQL 锁机制]]"
  - "[[MySQL 电商案例]]"
reference:
status: raw
---

# MySQL 数据库基础

> 数据库操作的基础语法和核心概念，包括SQL语句分类、数据定义/操作/查询语言、约束、表关联关系、多表查询等。

## SQL语句概述

SQL（Structured Query Language，结构化查询语言）是专为数据库建立的操作命令集，用于存取数据以及查询、更新和管理关系数据库系统。

不同的数据库生产厂商都支持SQL语句，但都有自己特有内容。

### SQL语句分类

1. **数据定义语言，DDL（Data Definition Language）**
   - 用来定义数据库对象：数据库、表、列等
   - 关键字：create、alter、drop等

2. **数据操作语言，DML（Data Manipution Language）**
   - 用来对数据库中表的记录进行更新
   - 关键字：insert、delete、update

3. **数据查询语言，DQL（Data Query Language）**
   - 用来查询数据库中表的记录
   - 关键字：select、from、where等

4. **数据控制语言，DCL（Data Control Language）**
   - 用来定义数据库的访问权限和安全级别，及创建用户

### SQL 通用语法

1. SQL语句可以单行或多行书写，以分号`;`结尾
2. 可使用空格和缩进来增强语法的可读性
3. MySQL数据库的SQL语句不区分大小写，关键字建议使用大写
4. 可以使用 `/**/`，`--`，`#` 的方式完成注释

```sql
/* 多行注释 */	
-- 单行注释
ctrl+/	注释快捷键
```

## SQL 常用数据类型

### 数值类型

| 类型 | 大小（字节） | 有符号数取值范围 | 无符号数取值范围 | 说明 |
|------|-------------|-----------------|-----------------|------|
| TINYINT | 1 | (-128,127) | (0,255) | 超小整数 |
| SMALLINT | 2 | (-32 768,32 767) | (0,65 535) | 小整数 |
| MEDIUMINT | 3 | (-8 388 608,8 388 607) | (0, 16 777 215) | 中等整数 |
| INT / INTEGER | 4 | (-2 147 48 648,2 147 48 647) | (0, 4 294 967 295) | 整数 |
| BIGINT | 8 | (-263,263-1) | (0,264-1) | 大整数 |
| FLOAT | 4 | (-3.402 823 466 E+38, -1.175 494 351 E-38), 0, (1.175 494 351 E-38, 3.402823 466 E+38) | 0, (1.175 494 351 E-38, 3.402823 466 E+38) | 单精度浮点数值 |
| DOUBLE | 8 | (-1.797 693 134 862 315 7E+308, -2.225 073 858 507 201 4 E-308), 0, (2.255 073 858 507 201 4 E-308, 1.797 693 134 862 315 7E+308) | 0, (2.255 073 858 507 201 4 E-308, 1.797 693 134 862 315 7E+308) | 双精度浮点数值 |
| DECIMAL | M>D, 为M+2, 否则为D+2 | 依赖于 M和D 的值 | 依赖于 M和D 的值 | 小数值 |

### 日期/时间类型

| 类型 | 大小（bytes） | 范围 | 格式 | 用途 |
|------|--------------|------|------|------|
| DATE | 3 | 1000-01-01 / 9999-12-31 | YYYY-MM-DD | 日期值 |
| TIME | 3 | '-838:59:59' / '838:59:59' | HH:MM:SS | 时间值或持续时间 |
| YEAR | 1 | 1901 / 2155 | YYYY | 年份值 |
| DATETIME | 8 | '1000-01-01 00:00:00' 到 '9999-12-31 23:59:59' | YYYY-MM-DD hh:mm:ss | 混合日期和时间值 |
| TIMESTAMP | 4 | '1970-01-01 00:00:01' UTC 到 '2038-01-19 03:14:07' UTC | YYYY-MM-DD hh:mm:ss | 混合日期和时间值，时间戳 |

### 字符串类型

| 类型 | 大小 | 用途 |
|------|------|------|
| CHAR | 0–255 bytes | 定长 字符串 |
| VARCHAR | 0–65 535 bytes | 变长 字符串 |
| TINYBLOB | 0–255 bytes | 不超过 255 个字符的二进制字符串 |
| TINYTEXT | 0–255 bytes | 短文本字符串 |
| BLOB | 0–65 535 bytes | 二进制形式的长文本数据 |
| TEXT | 0–65 535 bytes | 长文本数据 |
| MEDIUMBLOB | 0–16 777 215 bytes | 二进制形式的中等长度文本数据 |
| MEDIUMTEXT | 0–16 777 215 bytes | 中等长度文本数据 |
| LONGBLOB | 0–4 294 967 295 bytes | 二进制形式的极大文本数据 |
| LONGTEXT | 0–4 294 967 295 bytes | 极大文本数据 |

## DDL之 数据库操作

### 创建数据库

```sql
create database [if not exists] 数据库名 [character set xxx]

# 直接创建数据库，若已存在则报错
create database 数据库名;
# 如果数据库不存在则创建
create database if not exists 数据库名;
# 创建数据库时设置字符集
create database db_name charset 'utf-8';  -- character set 简写为：charset
```

### 查看数据库

```sql
show databases;  -- 查看数据库列表
SHOW DATABASES LIKE '%test%';  -- 查看名字中包含 test 的数据库
show create database if not exists db_name;  -- 查看数据库的详细信息（码表信息）
```

### 修改数据库

```sql
alter database db_name [character set xxx]
```

### 删除数据库

```sql
drop database 数据库名
```

### 使用数据库

```sql
use 数据库名;  -- 切换数据库
select database(); --  查看当前使用的数据库
```

### 数据库备份

```sql
mysqldump -u username -p password database_name > backup.sql
```

## DDL之 表操作

### 创建表

```sql
CREATE TABLE [if not exists] 表名(
            字段名1 类型 [约束],
            字段名2 类型 [约束],
            ...
            字段名n 类型 [约束]   -- 一定不要加逗号，否则报错！
        )[character set utf8];
```

### 删除表

```sql
DROP TABLE [IF EXISTS] 表名1 [ ,表名2, 表名3 ...]  -- 若表不存在，则报错
```

### 修改表结构

```sql
alter table 旧表名 rename 新表名;	-- 修改表名
rename table 旧表名 to 新表名;    -- 修改表名
ALTER TABLE 表名 [DEFAULT] CHARACTER SET <字符集名>   -- 修改表所用的字符集
```

### 查看表

```sql
show tables		-- 查看当前数据库中的 所有的表
desc employee;  -- 查看表结构（字段名、数据类型、约定等）, 等同于show columns from tab_name  
show create table tab_name   -- 查看当前数据库表建表语句 
```

## DDL之 字段操作

### 给表新增字段

```sql
alter table 表名 add 字段名 数据类型 [约束] [after 字段]; --after:在某字段后添加新列
-- 增加多个字段
alter table users2 
      add addr varchar(20),
      add age  int first,
      add birth varchar(20) after name;
```

### 删除表的字段

```sql
alter table 表名 drop column 字段名;  -- column 可省略
```

### 修改表的字段信息

```sql
# modify 修改字段定义：数据类型、约束、默认值等
alter table 表名 modify 字段名 新的数据类型 [新的约束];
# change 修改字段名和字段定义
alter table 表名 change 旧字段名 新字段名 新的数据类型 [新的约束];
```

## DML 之表记录操作

主要操作表数据：对表数据进行 增、删、改

### 插入表记录

```sql
# 向表中插入数据
insert into 表名 (字段1, 字段2, ...) values(值1, 值2, ...);

# 向表中插入所有字段且字段顺序为创建表时的顺序
insert into 表名 values(值1, 值2, ...);

# 有主键约束，首个值为 null
insert into 表名 values(null, 值1, 值2, ...)
```

```sql
/* 一次性添加多条数据 */
insert into 表名(字段1, 字段2, ...) values(值1, 值2, ...),(值1, 值2, ...),...;

insert into 表名 values(值1, 值2, ...),(值1, 值2, ...),...;
```

### 删除表记录

```sql
truncate table 表名;  -- 清空表记录
delete from 表名 [where 条件]  -- 按条件删除记录
# 【注】不加 where 条件，一次删除表的所有数据
```

使用 `truncate`和`delete` 的区别：

- 使用 `truncate` 删除表记录时，主键自增序列清零
- 使用 `delete` 删除表记录时，主键自增序列不清零

truncate table 和 delete from的区别：

- `delete from` 属于: DML语句, 可以结合事务一起用, 相同点是: 都会删除所有数据, id不会重置.
- `truncate table` 属于DDL语句, 一般不能结合事务一起用, 相同点是: 都会删除所有数据, id会重置.

### 更新表记录

```sql
update 表名 set 字段1=值1 [,字段2=值2 ...] where 条件;
# 【注】必须要加 where 条件，否则会一次性更改所有行
```

## SQL约束

作用：保证数据的完整性和一致性，在数据类型的基础上，对某类数据值做限定

```sql
# 单表约束
primary key		# 主键约束，特点：非空，唯一
                # 一般结合 auto_increment（自动增长） 一起使用
				# 主键列为 int类型时，每次主键都会在最大主键值的基础上 + 1, 重新存
not null        # 非空约束, 该列值不能为空
unique          # 唯一约束, 该列值不能重复
default         # 默认约束，若无值，则使用默认值

# 多表约束
foreign key		# 主外键约束
```

```sql
ALTER TABLE 表名 MODIFY 主键列 数据类型; # 先移除 AUTO_INCREMENT 属性（如果有）
alter table 表名 drop primary key;  # 删除主键约束
```

### 主键约束

- primary key 约束，唯一标识数据库表中的每条记录
- 主键必须包含唯一的值
- 主键列不能包含 NULL 值
- 每个表都应该有一个主键，并且每个表只能有一个主键

遵循原则：

- 主键应当是对用户没有意义的
- 永远也不要更新主键
- 主键不应包含动态变化的数据，如时间戳、创建时间列、修改时间列等
- 主键应当由计算机自动生成

### 外键约束

- 外键约束就是在子表中声明"某一列的值必须等于父表主键的某个值"
- 从而强制保持两个表之间数据的一致性和完整性

#### 1）创建表时设置外键约束

```sql
[CONSTRAINT <外键名>]
FOREIGN KEY 字段名 [，字段名2，…]
	REFERENCES <主表名> 主键列1 [，主键列2，…]
```

> 定义外键时，需要遵守下列规则：
>
> 1. 先有主表，再有子表。
> 2. 必须为'主表'定义主键。
> 3. 主键不能包含空值，但允许在外键中出现空值。
> 4. 外键中列和主表主键中对应列的 数据类型必须相同。

#### 2）添加和删除 外键约束

```sql
-- （1）添加外键约束
ALTER TABLE <数据表名> ADD CONSTRAINT <外键名>
FOREIGN KEY(<列名>) REFERENCES <主表名> (<列名>);

-- （2）删除外键约束
ALTER TABLE <表名> DROP FOREIGN KEY <外键名>;
DROP index 外键名 ON <表名>; -- 同时将索引删除 
```

#### 3）`INNODB` 支持的 `ON` 语句

- InnoDB：一种常用的存储引擎，它提供了一些 ON 语句来定义 外键约束 和 触发器。

  > 【Tip】这些 ON 语句只适用于 InnoDB 存储引擎。

  - 这些 ON 语句可以在创建或修改外键约束时使用
  - 定义在不同操作（更新或删除）发生时，从表中的数据应该如何处理。

| ON 语句 | 说明（如果关联的主表中的数据） |
|---------|--------------------------------|
| `ON DELETE RESTRICT` | 被删除，且从表中存在对应的数据，则禁止删除操作。 |
| `ON DELETE CASCADE` | 被删除，自动删除从表中对应的数据。 |
| `ON DELETE SET NULL` | 被删除，从表中对应的数据将被设置为 NULL。 |
| `ON DELETE SET DEFAULT` | 被删除，从表中对应的数据将被设置为默认值。 |
| `ON UPDATE RESTRICT` | 更新，且从表中存在对应的数据，则禁止更新操作。 |
| `ON UPDATE CASCADE` | 更新，自动更新从表中的对应数据。 |
| `ON UPDATE SET NULL` | 更新，从表中对应的数据将被设置为 NULL。 |
| `ON UPDATE SET DEFAULT` | 更新，从表中对应的数据将被设置为默认值。 |

## DQL操作

```sql
【单表查询，完整查询格式】
select 
	[distinct] 字段名1, 字段名2 [as 别名] 
from 
	表名 
where 
	组前筛选
group by
	分组字段
having
	组后筛选
order by
	排序字段 [asc|desc]  -- asc升序（默认），desc降序
limit 
	起始索引, 数据条数;  -- 偏移量从0开始，可省略（默认0）
```

### 简单查询

```sql
# 查询表中的 所有数据
select * from 表名 [as 别名];
# 查询表中 特定字段 的数据
select 字段名1 [as 别名][, 字段名2, ...] from 表名;
-- as 可省略不写
# 查询结果是 表达式（运算查询）
select 表达式 [as 别名] from 表名;
```

### 条件查询

```sql
select * from 表名 where 字段查询条件;
```

| 名称 | 符号 | 说明 |
|------|------|------|
| 比较查询 | > < <= >= = <br />不等于：<> 和 !=<br /> | 大于、小于、大于(小于)等于、不等于 |
| 范围查询<br /> | BETWEEN ...AND... | 显示在某一区间的值（含头含尾） |
| | IN(set) | 显示在 in 列表中的值，例：in(100,200, ...) |
| 模糊查询 | LIKE | Like 语句中，<br />"`%`"：代表零个或多个任意字符，<br />"`_`"：代表一个字符，例：first\_name like '\_a%'；<br /> |
| 非空查询 | IS NULL<br />IS NOT NULL | 判断是否为空 |
| 逻辑查询<br /> | and | 多个条件同时成立 |
| | or | 多个条件任一成立 |
| | not | 不成立，例：where not(salary>100); |

### 排序查询

```sql
select * from 表名 order by 排序字段1 [asc|desc], 排序字段2 [asc|desc];
# 多字段排序，优先参考前面的字段
```

### 聚合查询

前面的查询都是横向查询，根据条件一行一行地进行判断，而聚合函数查询是纵向查询，是对一列的值进行计算，然后返回一个单一的值。另外聚合函数会忽略空值

聚合查询（多进一出）：对表中的某列数据做操作

```sql
select count(字段名) [as 别名] from 表名 [where 条件]
```

| 聚合函数 | 作用 |
|----------|------|
| count() | 统计指定列不为 NULL 的记录行数。 |
| sum() | 计算指定列的数值和；若列类型非数值，结果为 0。 |
| max() | 计算指定列的最大值；若列为字符串，则按字符串排序运算。 |
| min() | 计算指定列的最小值；若列为字符串，则按字符串排序运算。 |
| avg() | 计算指定列的平均值；若列类型非数值，结果为 0。 |

- `count(*)`，`count(1)`，`count(列)` 的区别？

  区别1：是否统计空值

  - `count(列)`：只统计该列的非空值
  - `count(1)`，`count(*)`：统计所有数据，包括空值

  区别2：效率问题

  - `count(主键列) > count(1) > count(*) > count(列)`

### 分组查询

```sql
select 字段1, 字段2 from 表名 group by 分组字段 having 分组条件;

# 结合聚合函数使用，根据分组字段进行查询，分组字段中的值可代表每个组
select 分组字段, count(字段) as 别名1 from 表名 group by 分组字段 having 别名1>1;
```

- having 子语句：用于在分组后对数据进行过滤的，作用类似于 where条件
- 分组查询一般要结合聚合函数一起使用
- 组前筛选 where，组后筛选 having
- 分组查询的查询列，只能有 分组字段和聚合函数
- 问：having 与 where 的区别？：

  - having 实在分组后对数据进行过滤，where 是在分组前对数据进行过滤
  - having 后面可以使用分组函数（统计函数），where 后面不可以使用分组函数

- 基于分组字段，进行去重查询

  ```sql
  select 分组字段 from 表名 group by 分组字段;  -- 只有分组字段，没有聚合函数
  select distinct 字段 from 表名  -- 通过 distinct 去重

  # 多个字段去重，效果一致
  select 分组字段1, 分组字段2 from 表名 group by 分组字段1, 分组字段2;
  select distinct 字段1, 字段2 from 表名
  ```

### 分页查询

作用：每次从数据表中查询固定条数的数据

好处：一方面可以降低服务器的压力，一方面可以降低浏览器端的压力，且可以提高用户体验

```sql
select 字段1, 字段2, ... from 表名 limit m,n
# m：表示从第几条索引开始（从0开始），计算方式：（当前页码 -1）* 每页显示条数
# n：表示查询多少条数据

select * from 表名 limit （当前页码 -1）* 10, 10  -- 每页显示10条数据
```

【补充】从索引0开始，0可省略不写，直接编写为 `limit 数据条数`

分页计算规则：

```sql
数据总条数：count()
每页的数据条数：由人规定
每页的起始索引：(当前页码 -1)*每页的数据条数
总页数：(数据总条数 + 每页的说条数 -1) // 每页的数据条数
```

## 表的关联关系

多个表之间的关系，通过共享相同的列或键来建立连接

### 一对多

一个表的记录可以与另一个表中的多个记录相关联

目的：减少冗余数据，增加数据的不一致性和更新的复杂性

```sql
-- 学生表
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

-- 课程表
CREATE TABLE courses (
    id INT PRIMARY KEY,
    title VARCHAR(100)
);

-- 选课表（关联表）
CREATE TABLE enrollments (
    student_id INT, -- 关联字段
    course_id  INT, -- 关联字段
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

- 子查询：实现多表关联查询

  ```sql
  -- 找出所有选了"Math"这门课的学生姓名
  SELECT name
  FROM students
  WHERE id IN (
      SELECT student_id
      FROM enrollments
      WHERE course_id = (
          SELECT id
          FROM courses
          WHERE title = 'Math'
      )
  );
  ```

- 数据

  ```sql
  -- 插入学生
  INSERT INTO students VALUES (1, 'Alice');
  INSERT INTO students VALUES (2, 'Bob');

  -- 插入课程
  INSERT INTO courses VALUES (101, 'Math');
  INSERT INTO courses VALUES (102, 'English');

  -- 插入选课记录
  INSERT INTO enrollments VALUES (1, 101); -- Alice 选了 Math
  INSERT INTO enrollments VALUES (1, 102); -- Alice 选了 English
  INSERT INTO enrollments VALUES (2, 101); -- Bob 选了 Math
  ```

### 多对多

可以理解为是 一对多 和 多对一 的组合

```sql
-- 学生表
CREATE TABLE student (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

-- 课程表
CREATE TABLE course (
    id INT PRIMARY KEY,
    title VARCHAR(100)
);

-- 教师表
CREATE TABLE teacher (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

-- 选课记录（三方关联表）
CREATE TABLE enrollment (
    student_id INT,
    course_id INT,
    teacher_id INT,
    PRIMARY KEY (student_id, course_id, teacher_id),  -- 联合主键确保唯一
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (course_id)  REFERENCES course(id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(id)
);
```

- 子查询

  ```sql
  SELECT name
  FROM student
  WHERE id IN (
      SELECT student_id
      FROM enrollment
      WHERE teacher_id = (
          SELECT id FROM teacher WHERE name = 'Ms. Johnson'
      )
  );
  ```

- 数据

  ```sql
  -- 学生
  INSERT INTO student VALUES (1, 'Alice'), (2, 'Bob');

  -- 课程
  INSERT INTO course VALUES (101, 'Math'), (102, 'English');

  -- 教师
  INSERT INTO teacher VALUES (201, 'Mr. Smith'), (202, 'Ms. Johnson');

  -- 选课记录（Alice选了Math由Mr. Smith教，Bob选了English由Ms. Johnson教）
  INSERT INTO enrollment VALUES
  (1, 101, 201),  -- Alice → Math → Mr. Smith
  (1, 102, 202),  -- Alice → English → Ms. Johnson
  (2, 101, 201),  -- Bob   → Math → Mr. Smith
  (2, 102, 202);  -- Bob   → English → Ms. Johnson
  ```

### 一对一

一对一关系（One-to-One Relationship）指的是两个实体之间存在一种对应关系

其中一个实体的每个记录只能对应另一个实体的一条记录，

而另一个实体的每个记录也只能对应一个实体的记录。

在一对一关系中，关联字段在每个表中都加上了唯一约束，以确保关联的唯一性。

一对一是将数据表"垂直切分"。也就是 A 表的一条记录对应 B 表的一条记录。

一对一创建表的优点：

- 将两个实体分开存储在不同的表中，可以更好地保持数据的规范性和完整性。每个表都可以有自己的约束和验证规则，确保数据的一致性和有效性。
- 使用一对一关系表，可以更容易地扩展和修改数据模型。
- 数据隐私和安全性

通过唯一约束的关联字段建立一对一

- 建表

  ```sql
  CREATE TABLE Students
  (
      StudentID    INT PRIMARY KEY AUTO_INCREMENT,
      StudentName  VARCHAR(255) NOT NULL,
      gender       ENUM ('男','女','保密'),
      Age          INT,
      ClassID INT
  );

  -- 创建学生联系信息表
  CREATE TABLE StudentDetails
  (
      ID          INT PRIMARY KEY,
      PhoneNumber VARCHAR(255),
      Email       VARCHAR(255),
      Address     VARCHAR(255),
      StudentID   INT UNIQUE -- 区别于一对多，关联字段加唯一约束！ 
  );
  ```

- 一对一子查询：

  ```sql
  -- 查询张三的手机号和邮箱
  select Email, PhoneNumber
  from StudentDetails
  where StudentID = (select StudentID from Students where StudentName = '张三')

  -- 查询手机号为5678901234的学生姓名和年龄
  SELECT StudentName, Age
  FROM Students
  WHERE StudentID = (SELECT StudentID
                     FROM StudentDetails
                     WHERE PhoneNumber = '5678901234')
  ```

- 插入记录：

  ```sql
  INSERT INTO StudentDetails (ID, PhoneNumber, Email, Address, StudentID)
  VALUES (1, '1234567890', '张三@example.com', '北京市朝阳区建国门外大街123号', 1),
         (2, '2345678901', '李思琪@example.com', '上海市黄浦区南京东路456号', 2),
         (3, '3456789012', '王伟@example.com', '广东省深圳市福田区华强北路789号', 3),
         (4, '4567890123', '赵雅芝@example.com', '四川省成都市武侯区锦江宾馆321号', 4),
         (5, '5678901234', '刘德华@example.com', '湖北省武汉市江汉区解放大道654号', 5);
  ```

## 多表查询

### 连接查询

根据关联条件和组合方式，把多张表组成一张表，然后进行单表查询（JOIN关联查询）

组合方式：

- 内连接：交集
- 左外连接：左表全集 + 交集
- 右外连接：右表全集 + 交集

```sql
【基本语法】
# 交集运算：内连接查询（inner join）-- inner 可以省略
select * from A inner join B on 关联条件;  -- 内连接
# 差集运算：外连接查询（outer join）-- outer 可以省略
select * from A left outer join B on 条件;  -- 左外连接
select * from A right outer join B on 条件;  -- 右外连接

# 【了解】交叉连接查询，开发中一般不用
select * from A,B;  -- 两表的所有数据都进行一次组合（笛卡尔集）
```

```sql
【补充】内连接
# 显式内连接（推荐）
select * from A join B on A.a_id=B.b_id;  -- 若两表没有重名字段，则条件可省略 表名.
# 隐式内连接
select * from A, B where 关联条件;  
```

问：开发过程中使用显式内连接还是隐式内连接好？

> 使用显式内连接更好，隐式内连接需要先拼接所有数据，效率相对较低，并且直接拼接组合还可在后面添加where条件再次进行筛选。
>
> ```sql
> select * from A join B on 条件 where 条件; 
> ```

```sql
【补充】外连接，若交换表的顺序，左外连接和右外连接，其查询结果可以是一样的
select * from B left join A on 条件;
select * from A right join B on 条件;
```

### 子查询

定义：子查询是指在一个SQL查询语句中嵌套另一个 `select` 语句，其中内层查询（子查询）的结果作为外层查询（主查询/父查询）的条件或数据来源

内部的查询叫：子查询，外部的查询叫：父查询（主查询）

```sql
select * from 表名 where 列 操作符 (select * from 表名);
-- 常用操作符：=, >, <, IN, EXISTS, ANY, ALL 等
```

- 子查询必须用括号 `()` 括起来
- 子查询通常出现在 `where`、`from`、`select` 子句中
- 子查询返回结果类型需与主查询的比较操作符兼容：单值比较符，子查询应返回单值

### 自查询

定义：表自己和自己做关联查询，一张表当作两张（或更多）逻辑表来使用

```sql
SELECT a.列, b.列, c.列
FROM 表 AS a
JOIN 表 AS b ON a.列 = b.列
JOIN 表 AS c ON a.列 = c.列;  -- 或 b.列 = c.列，根据逻辑定
```

## 相关笔记

- [[MySQL 开窗函数]] - 窗口函数语法与高级查询
- [[MySQL 内置函数]] - 字符串/数值/日期/聚合函数速查
- [[MySQL 事务]] - 事务ACID特性与操作
- [[MySQL 锁机制]] - 表锁与行锁机制
- [[MySQL 电商案例]] - 多表查询综合实战
