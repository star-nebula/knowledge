---
title: MySQL 开窗函数
created: 2026-05-25
tags:
  - MySQL
  - SQL
  - 窗口函数
type: 概念解释
related:
  - "[[MySQL-MOC]]"
  - "[[MySQL 数据库基础]]"
  - "[[MySQL 内置函数]]"
  - "[[MySQL 电商案例]]"
reference:
category: ["🛠️ 工程工具", "MySQL"]
---

# MySQL 开窗函数

> 开窗函数（Window Function）在不改变原始行数的前提下，对每行计算"上下文相关的聚合或排名信息"，是高级SQL查询的核心技术。

## 基础语法

```sql
<开窗函数> over([partition by <分组用列清单>] order by <排序用列清单>)
```

> `PARTITION BY` 可选（不写则对整个结果集排序）
>
> 排名类开窗函数必须指定 ORDER BY，否则无意义；聚合类函数可省略 ORDER BY

常用的可以结合 `over()` 一起使用的窗口函数：

- **排序类**：`row_number()` `rank()` `dense_rank()` `ntile(n)`
- **聚合类**：`count()` `sum()` `avg()` `max()` `min()`
- **其他**：`lag()` `lead()` `first_value()` `last_value()`

## 行内排名

排名开窗函数：在分组内对行进行排名

- `row_number()`：不管排名是否有相同的，都按照顺序 1,2,3，...，n
- `rank()`：排名相同的名次一样，后面排名会跳过已重复的行数
- `dense_rank()`：排名相同的名次一样，且后面的名次不跳跃
- **`NTILE(n)`** ：将分组内的行按排序后均匀划分为 `n` 个桶，并为每行分配桶号（1 到 n）；若不能整除，前面的桶优先多分配一行。

```sql
SELECT 
  列,
  ROW_NUMBER() OVER (PARTITION BY 分组列 ORDER BY 排序列) AS rn,
  RANK()       OVER (PARTITION BY 分组列 ORDER BY 排序列) AS rnk,
  DENSE_RANK() OVER (PARTITION BY 分组列 ORDER BY 排序列) AS drnk,
  NTILE(4)     OVER (PARTITION BY 分组列 ORDER BY 排序列) AS quartile  -- 示例：四分位
FROM 表;
```

> - `NTILE(n)` 常用于**分位分析**（如四分位 `NTILE(4)`、十分位 `NTILE(10)`）或**用户分层**
> - 所有排名函数都必须配合 ORDER BY 使用，PARTITION BY 可选（用于分组内排名）

## 案例

准备数据：

```sql
# 1.建库, 切库, 查表.
create database day03;
use day03;
show tables;

# 2. 创建数据表.
create table employee (
    id int,                 # 员工id
    ename varchar(20),      # 员工名
    deptid int,             # 部门id
    salary decimal(10,2)    # 工资
);
# 3. 添加表数据.
insert into employee values(1,'刘备',10,5500.00);
insert into employee values(2,'赵云',10,4500.00);
insert into employee values(2,'张飞',10,3500.00);
insert into employee values(2,'关羽',10,4500.00);

insert into employee values(3,'曹操',20,1900.00);
insert into employee values(4,'许褚',20,4800.00);
insert into employee values(5,'张辽',20,6500.00);
insert into employee values(6,'徐晃',20,14500.00);

insert into employee values(7,'孙权',30,44500.00);
insert into employee values(8,'周瑜',30,6500.00);
insert into employee values(9,'陆逊',30,7500.00);
# 4. 查看表数据.
select * from employee;
```

### 案例1：分组排名, 按照部门分组, 部门内部按照工资降序进行排名

```sql
# 案例1: 分组排名, 按照部门分组, 部门内部按照工资降序进行排名.
# 如下格式是针对于 全表数据做排名的, 不行.
select * from employee order by salary desc;

# 需要结合窗口函数, 针对于数据做排名.
select
    *,
    # 按照部门分组, 组内按照工资 降序 排序（三种排序）
    row_number() over(partition by deptid order by salary desc) as rn,
    rank() over(partition by deptid order by salary desc) as rk,
    dense_rank() over(partition by deptid order by salary desc) as dr
from employee;
```

### 案例2：分组排名求TopN, 获取每组工资最高的两人信息

```sql
# 案例2: 分组排名求TopN, 获取每组工资最高的两人信息.
# 直接加where条件不可行, 因为 where后边的字段, 必须是表中已有的字段.
select
    *,
    rank() over(partition by deptid order by salary desc) as rk
from employee
where rk <= 2;  -- ❌ 不可行
```

**解决方案1: 套表**

```sql
select * from (
    select
        *,
        rank() over(partition by deptid order by salary desc) as rk
    from employee
) t1 where rk <= 2;
```

**解决方案2: CTE表达式(公共表表达式), with语句**

把查询结果临时的封装成一张表, 然后去该表中做查询.

```
格式:
    with 临时表名1 as (查询的SQL语句),
         临时表名2 as (查询的SQL语句)
    select * from 临时表名1...;
```

```sql
with t1 as (select *, rank() over(partition by deptid order by salary desc) as rk from employee)
select * from t1 where rk <= 2;

# 上述格式的变形写法.
with t1 as (select *, rank() over(partition by deptid order by salary desc) as rk from employee),
     t2 as (select * from t1 where rk <= 2)
select * from t2;
```

## 聚合函数 + over()

```sql
# 根据部门id进行分组
select *, sum(salary) over(partition by deptid) total_salary from employee;
# 根据部门id进行分组    按照工资升序排列
select *, sum(salary) over(partition by deptid order by salary) as total_salary from employee;

select
    *,
    max(salary) over(partition by deptid) as max_salary
from employee;
```

### 案例3：计算每个员工工资占比 — 总工资占比, 部门工资占比

```sql
with t1 as (
    select
        *,
        sum(salary) over(partition by deptid) dept_salary,
        sum(salary) over() total_salary
    from employee
)
select
    *,
    round(salary / dept_salary, 2) dept_ratio,
    round(salary / total_salary, 2) total_ratio
from t1;
```

## 其他函数 + over()

### ntile(n) + over()

假设数据有7条, 分组后结果为: 1,1,1  2,2,  3,3

应用场景: 数据抽样.

```sql
select *, ntile(3) over(partition by deptid) nt from employee;
```

### lag(字段, n) + over()

获取组内当前数据的前n个数据

```sql
select
    *,
    lag(salary, 2) over(partition by deptid order by salary) lag_salary
from employee;
```

**应用场景示例**：用户登录日志表，计算连续登录天数

```sql
-- 用户登录日志表 user_login_log
-- 用户名     登录日期
-- admin01   2024-12-18
-- admin01   2024-12-19
-- admin01   2024-12-21
-- admin01   2024-12-22
-- admin01   2024-12-23
-- admin01   2024-12-24            lag(登陆日期, 6)
-- admin01   2024-12-25            lag(登陆日期, 6)
select datediff('2024-12-25', '2024-12-18');
```

## CASE WHEN

类似于Python中的if判断，实现条件分支。

**需求**: 根据部门编号, 转成对应的部门名, 例如: 10 -> 蜀国, 20 -> 魏国, 30 -> 吴国

```
case when语法:
    case
        when 字段名=值 then 结果1
        when 字段名=值 then 结果2
        ......
        else 结果n
    end [as 别名]

语法糖写法（操作同1个字段, 且都是等于的判断）:
    case 字段名
        when 值1 then 结果1
        when 值2 then 结果2
        ......
        else 结果n
    end [as 别名]
```

```sql
-- 标准写法
select
    *,
    case
        when deptid=10 then '蜀国'
        when deptid=20 then '魏国'
        when deptid=30 then '吴国'
        else '灭国'
    end as dept_name
from employee;

-- 语法糖写法.
select
    *,
    case deptid
        when 10 then '蜀国'
        when 20 then '魏国'
        when 30 then '吴国'
        else '灭国'
    end as dept_name
from employee;
```

## 相关笔记

- [[MySQL 数据库基础]] - SQL基础语法与DDL/DML/DQL
- [[MySQL 内置函数]] - 字符串/数值/日期/聚合函数速查
- [[MySQL 电商案例]] - 开窗函数实战应用场景
