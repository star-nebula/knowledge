---
title: Python Matplotlib
created: 2026-05-22
tags:
  - Python
  - Matplotlib
  - 数据可视化
  - 图表
type: 概念解释
related:
  - "[[DataAnalysis-MOC]]"
  - "[[Python Pandas]]"
  - "[[Python NumPy]]"
  - "[[数据分析概览]]"
reference:
category: ["🛠️ 工程工具", "DataAnalysis"]
---

# Python Matplotlib

> Matplotlib 是 Python 最常用的数据可视化库，支持创建静态、动态和交互式图表。

## matplotlib.pyplot 模块

```python
import matplotlib.pyplot as plt
```

#### 图形绘制流程

1. 创建画布 `figure()`

    ```python
    plt.figure(
        figsize=(6.4, 4.8),  # 图像尺寸（宽, 高），单位：英寸；默认 (6.4, 4.8)
        dpi=100,             # 分辨率（dots per inch），默认 100
        facecolor='white',   # 画布背景色（如 'white', 'lightgray'）
        edgecolor='black',   # 画布边框颜色（通常不显式设置）
        frameon=True         # 是否显示画布边框（True/False）
    )
    # 返回 Figure 对象（可选接收，多数基础绘图可省略）
    ```

2. 绘制图像

    ```python
    # 以折线图为例：
    plt.plot(x, y)
    # 若不调用 plt.figure()，plt.plot() 会自动创建一个默认画布
    ```

3. 显示图像 `show()`

    ```python
    plt.show()
    ```

#### matplotlib 图像结构

![[assets/image-20240902053935190-20260102181503-ci4n5kl.png]]

#### 折线图

```python
plot(x,y,color,label,linstyle)
```

#### 辅助功能

- 添加x、y刻度

  ```python
  plt.xticks(ticks, labels, **kwargs)   # x刻度值
  plt.yticks(ticks, labels, **kwargs)   # y刻度值
  # ticks 刻度范围
  # labels 刻度标签
  ```
- 添加标题

  ```python
  title(label, fontsize)
  ```
- 添加 x、y轴的标签

  ```python
  plt.xlabel()
  plt.ylabel()
  ```
- 添加网格显示

  ```python
  plt.grid(
      True,  # 是否显示网格 
      linestyle='--', # 网格样式
      				# - 实线	-- 虚线	: 点线	-. 虚点线
      alpha=0.3  # 透明度
  )
  ```

#### 图片保存

```python
plt.savefig('图片名称.png')
【注】plt.show() 会释放figure资源，在show之后再savefig的是空图片
```

#### 同一坐标系绘制多个图像

多次plot

#### 多个坐标系显示

- 面向过程，所有的函数都是通过 `plt.函数名`  调用

  ```python
  plt.figure(figsize=, dpi=)
  ```
- 面向对象

  ```python
  # fig 画布（大小为10*5），ax 坐标系（1行2列）
  fig, ax = plt.subplots(figsize=(10,5), nrows=1, ncols=2)  # 创建一个带有多个axes（坐标系/绘图区）的图
  ```

  ```python
  ax[0]  # 0行0列的坐标系
  ax[1]  # 0行1列的坐标系

  ax[0].set_xticks(ticks, labels)  # x轴
  ax[0].set_yticks(ticks, labels)  # y轴

  # 设置x、y轴的值
  ax[0].set_xtickslabels(ticks, labels)
  ax[0].set_ytickslabels(ticks, labels)

  # 设置x、y轴的标签
  ax[0].set_xlabel(label)
  ax[0].set_ylabel(label)

  # 设置标题
  ax[0].set_title(label, fontsize)  
  ```

  ```python
  '''绘制黑白两图'''
  # HWC, Height, Width, Channel
  img1 = np.zeros((200, 200, 3))  # 黑色图像
  img2 = np.ones((200, 200, 3))   # 白色图像

  fig, axes = plt.subplots(1, 2, figsize=(10, 5))  # 1行2列

  axes[0].imshow(img1)
  axes[0].set_title('Image 1')
  axes[0].axis('off')

  axes[1].imshow(img2)
  axes[1].set_title('Image 2')
  axes[1].axis('off')

  plt.show()
  ```


## 相关笔记

- [[Python Pandas]] - Pandas 数据可视化常结合 Matplotlib
- [[Python NumPy]] - NumPy 数组是 Matplotlib 绘图数据的常见来源
- [[数据分析概览]] - 数据分析技术栈全景


