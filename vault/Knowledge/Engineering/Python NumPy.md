---
title: Python NumPy
created: 2026-05-22
tags:
  - Python
  - NumPy
  - 数值计算
  - 数组
type: 概念解释
related:
  - "[[DataAnalysis-MOC]]"
  - "[[Python Pandas]]"
  - "[[Python Matplotlib]]"
  - "[[数据分析概览]]"
reference:
category: ["🛠️ 工程工具", "DataAnalysis"]
---

# Python NumPy

## Numpy 简介

> **核心定位**：Python 科学计算的基础库，由 C 实现，专为**高性能数值计算**设计。

关键特性

- **`ndarray`**：同构多维数组对象，内存连续，支持**矢量化运算**（无 Python 循环）。
- 定义了**精确的数值数据类型**（如 `int32`、`float64`），便于内存控制和复杂数据结构构建。
- 核心计算机制：

  - **`ufuncs`**：通用函数（如 `np.add`），自动逐元素操作，速度提升 10-100 倍。
  - **广播机制**：自动扩展低维数组形状，实现跨维度运算（如 `3x3 矩阵 + 1D 向量`）。
- **基础科学计算**：集成线性代数（`linalg`）、傅里叶变换（`fft`）、随机数（`random`）。

  是 SciPy、Pandas、Scikit-learn、Matplotlib 等库的**底层基础**。

## ndarray

- NumPy数组是一个多维的数组对象（矩阵），称为ndarray(N-Dimensional Array)
- 具有矢量算术运算能力和复杂的广播能力，并具有执行速度快和节省空间的特点
- 注意：ndarray的下标从0开始，且数组里的所有元素必须是相同类型。

#### `ndarray` 常用属性

> NumPy的数组类被称作 `ndarray`，通常被称作数组。

|属性|说明|示例|
| ------| ----------------------| ------------------|
|`.ndim`|维度数（秩）|标量→0, 向量→1|
|`.shape`|各维度大小|`(2,3)`\=2行3列|
|`.size`|总元素个数|`shape`乘积|
|`.dtype`|元素的数据类型|`float64`|
|`.itemsize`|单元素大小（字节数）|`float64`→8|

【演示】Numpy常用属性

#### 创建 ndarray 数组

- `array()`
- `arange()`
- `random()`
- `integers()`
- `uniform()`
- `zeros()`

```python
import numpy as np
'''Python序列创建创建数组'''
np.array(object [, dtype=None])  # object: 列表、元组等嵌套结构，自动推断维度

'''创建有序数组(等差序列)'''
np.arange(start, stop, step [, dtype=None])  # stop 不包含！

'''创建随机数矩阵'''
rng = np.random.default_rng()  # 先创建生成器（只需一次）
# random(): 指定区间[0, 1) 均匀分布浮点数
rng.random(size [, dtype=None])
# integers(): 指定区间整数（左闭右开：[low, high)）   
rng.integers(low, high, size) # dtype=int64
# uniform(): 指定区间浮点数（左闭右开：[low, high)）
rng.uniform(low, high, size)  # dtype=float64
# standard_normal(): 标准正态分布
rng.standard_normal(size)
# normal(): 自定义正态分布
rng.normal(loc, scale, size)  # loc=均值, scale=标准差

'''全零的浮点型数组'''
np.zeros(shape) # dtype=float64
```

【演示】创建 ndarray 数组对象

#### ndarray 类型转换

```python
np.astype(np.类型)
```

#### 创建等比、等差数列

```python
# 等比数列：start和stop 默认是10的幂，可通过base修改
np.logspace(start, stop, num, [, dtype, base])
# start 到 stop 的等差数列
np.linspace(start, stop, num [, endpoint, dtype]) # endpoint=False 包左不包右
```

## Numpy 内置函数

> `参数x: number 或 array`

```python
np.ceil(x)          # 向上取整
np.floor(x)         # 向下取整
np.rint(x)          # 四舍五入
np.isnan(x)         # 判断是否为 NaN(Not a Number)
np.multiply(x1, x2) # 元素级乘法
np.divide(x1, x2)   # 元素级除法
np.abs(x)           # 元素级绝对值
np.where(condition, x, y)   # 三元运算符：x if condition else y

np.mean() 			# 计算均值
np.std()  			# 计算标准差
np.var() 			# 计算方差
np.sum() 			# 求和
```

- `unique()`

  ```python
  np.unique(x)  # 去重函数: 多维数组 -> 一维数组
  ```

- `sort()`

  ```python
  np.sort(array, kind)  # 排序函数 -> 排序后的数组（副本）
  np.sort(arr)[::-1]    # 降序排序
  array.sort()  # 排序：在原数据上进行修改
  # kind
  # - quicksort: 快速排序
  # - mergesort: 合并排序
  # - heapsort:  堆排序
  # - stable: 稳定排序
  ```

## Numpy 运算

```python
# 两矩阵行列一致
arr1 * arr2  
# A的列数=B的行数 -> A行B列
arr1 @ arr2  
np.dot(arr1, arr2)  
arr1.dot(arr2)
```

## Numpy 基础代码演示

##### 【演示】Numpy常用属性

```sh
# 1. 导包
import numpy as np
#%%
# 2. 创建Numpy的核心对象 -> ndarray(n维数组)
arr = np.arange(15).reshape(3, 5)   # 3行5列
# 3. 打印数组
print(arr)
#%%
# 4.演示Numpy的常用属性
print(f'数组的维度(轴): {arr.ndim}')      # 数组的维度(轴): 2
print(f'数组的形状: {arr.shape}')        	# 数组的形状: (3, 5)
print(f'数组的元素类型: {arr.dtype}')    	# 数组的元素类型: int32
print(f'数组中每个元素占的字节数: {arr.itemsize}')  # 数组中每个元素占的字节数: 4
print(f'数组中元素的个数: {arr.size}')     # 数组中元素的个数: 15
print(f'数组的类型: {type(arr)}')         # <class 'numpy.ndarray'>
```

##### 【演示】创建 ndarray 数组对象

```python
import numpy as np
'''array(): Python序列创建创建数组'''
# np.array(object [, dtype=None])  # object: 列表、元组等嵌套结构，自动推断维度
arr1 = np.array([1,2,3,4])  # dtype默认为 int32
arr2 = np.array([[1,2,3,4],[1,2,3,4]], dtype=float)  # 二维数组
print(arr1, arr1.dtype)
print(arr2, arr2.dtype)  # float64
'''arange(): 创建有序数组(等差序列)'''
# np.arange(start, stop, step [, dtype=None])  # stop 不包含！
arr3 = np.arange(2,20,2)  # [ 2  4  6  8 10 12 14 16 18]
print(arr3)
'''创建随机数矩阵'''
rng = np.random.default_rng()  # 先创建生成器（只需一次）
# 指定区间[0, 1) 均匀分布浮点数
# 语法：rng.random((size) [, dtype=None])
arr4 = rng.random((3,5))  # size: 元组，指定任意维度形状
print(arr4)
# 指定区间整数（左闭右开：[low, high)）   
# 语法：rng.integers(low, high, size) # dtype=int64
arr5 = rng.integers(3, 7, [2,2])  
print(arr5, arr5.dtype)
# 指定区间浮点数（左闭右开：[low, high)）
# 语法：rng.uniform(low, high, size) # dtype=float64
arr6 = rng.uniform(3 ,7, [2,2])
print(arr6, arr6.dtype)
'''全零的浮点型数组'''
# 语法：np.zeros(shape) # dtype=float64
arr7 = np.zeros([3,4])
print(arr7, arr7.dtype)
```

## 相关笔记

- [[Python Pandas]] - Pandas 底层基于 NumPy，结构化数据分析进阶
- [[Python Matplotlib]] - NumPy 数组是 Matplotlib 绘图的常用数据源
- [[数据分析概览]] - 数据分析技术栈全景
