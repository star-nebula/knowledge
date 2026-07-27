---



title: KNN算法



created: 2026-03-28



tags:



  - 机器学习



  - KNN



  - 算法



type: 概念解释



related:



  - "[[机器学习-MOC]]"



reference: ""



category: ["🤖 AI大模型", "机器学习"]



---







# KNN算法







# KNN算法 简介







- <span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">K-近邻算法</span>（K Nearest Neighbor，简称KNN）







- **KNN算法思想**：如果一个样本在特征空间中的 <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">k 个最相似的样本</span>中的大多数属于某一个类别，则该样本也属于这个类别







  > 思考：如何确定样本的相似性？



  >



  > 样本相似性：样本都是属于一个任务**数据集**的。<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">样本距离越近则越相似</span>。



  >



- 相似性：`欧式距离 = 对应维度差值平方和，开平方根`​



- 【案例】利用K近邻算法预测电影类型



- 解决问题：分类问题（classification）、回归问题（Regression）







  标签不连续（分类，投票）、标签连续（回归，均值）







#### 分类流程 & 回归流程







1. 计算未知样本到每一个训练样本的距离



2. 将训练样本根据距离大小升序排列



3. 取出距离最近的 K 个训练样本



4. 【分类】进行<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">多数表决</span>，统计 K 个样本中哪个类别的样本个数最多







    【回归】把这个 K 个样本的目标值<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">计算其平均值</span>



5. 【分类】将未知的样本归属到<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">出现次数最多的类别</span>







    【回归】将作为未知的样本预测的值







### K值的选择







- 为何<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">K值过小</span>容易发生<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">过拟合</span>，而<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">K值过大</span>容易发生<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">欠拟合</span>？



- <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">K值过小</span>：相当于用<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">较小领域</span>中的训练实例进行预测







  - 容易受到<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">异常点</span>的影响



  - K值的减小就意味着整体模型变得<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">复杂</span>，容易发生<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">过拟合</span>



- <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">K值过大</span>：相当于用<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">较大领域</span>中的训练实例进行预测







  - 容易受到<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">样本均衡</span>的问题



  - K值的增大就意味着整体的模型变得<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">简单</span>，容易发生<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">欠拟合</span>



- 举例：K\=N（N为训练样本个数）







  - 无论输入实例是什么，只会按训练集中最多的类别进行预测，<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">受到样本均衡的影响</span>



- 如何对**K超参数**进行调优？







  - 需要一些方法来寻找这个最合适的K值



  - 交叉验证、网格搜索







# 距离度量







##### 欧式距离（Euclidean Distance）







​`欧式距离 = 对应维度差值平方和，开平方根`​







![[assets/image-20260116090826-u6yeujc.png]]







##### 曼哈顿距离（Manhattan Distance）







曼哈顿距离也称为“城市街区距离”（City Block distance）







> 曼哈顿城市特点：横平竖直







​`曼哈顿距离 = 对应维度差值的绝对值之和`​







![[assets/image-20260116090628-2grw5ro.png]]​







##### 切比雪夫距离（Chebyshev Distance）







​`切比雪夫距离 = 对应维度差值绝对值的最大值`​







![[assets/image-20260116091030-d79u5j8.png]]







##### 闵氏距离（Minkowski Distance）







- 闵可夫斯基距离，简称为：闵式距离







- 不是一种新的距离的度量方式。



- 而是距离的组合 是对多个距离度量公式的概括性的表述







两个 $n$维变量 $a(x_{11},x_{12},⋯,x_{1n})$  与 $b(x_{21},x_{22},⋯,x_{2n})$  间的闵可夫斯基距离定义为 $d_{12}=p\sqrt{∑_{k=1}^n∣x1k−x2k∣^p}$







其中 $p$  是一个变参数：







- 当 $p$​$=$​$1$  时，就是<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">曼哈顿距离</span>；



- 当 $p$​$=$​$2$  时，就是<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">欧氏距离</span>；



- 当 $p→∞$  时，就是<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">切比雪夫距离</span>。







<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">根据 </span>$p$<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">  的不同，闵氏距离可表示某一类种的距离</span>







‍





---
