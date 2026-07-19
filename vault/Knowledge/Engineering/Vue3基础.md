---
title: Vue3基础
created: 2026-05-22
tags:
  - Vue3
  - 前端
  - 框架
type: 概念解释
related:
  - "[[Frontend-MOC]]"
  - "[[Knowledge/Engineering/JavaScript]]"
  - "[[Knowledge/Engineering/HTML]]"
  - "[[Knowledge/Engineering/CSS]]"
reference:
category: ["🛠️ 工程工具", "Frontend"]
---

## Vue3基础

## 认识Vue3

### 什么是Vue.js

​`Vue.js`​（读音类似于"view"）是一款流行的渐进式 `JavaScript`​ 前端框架，用于构建用户界面和单页应用程序。

> 渐进式框架：可根据项目需求逐步采用的框架，不强制性使用所用功能

​`Vue`​ 的核心特点是声明式渲染和组件系统：

- **声明式渲染**：`Vue`​ 使用模板语法，允许我们以声明式的方式描述 `HTML`​ 输出应该基于 `JavaScript`​ 状态如何变化。
- **响应式系统**：当数据变化时，视图会自动更新，无需手动操作DOM。
- **组件化开发**：应用被拆分为独立可复用的组件，使代码更易于组织和维护。

### Vue3的新特性与优势

Vue3（默认版本）于2020年9月正式发布，相比Vue2带来了许多重大改进和新特性：

- **性能提升**

  - <u>更小的包体积</u>：Vue3核心代码体积比Vue2小约41%。
  - 虚拟DOM重写：更高效的DOM diff算法，<u>渲染性能提升</u>约1.3~2倍。
  - 树摇优化：更好的Tree-shaking支持，<u>只打包用到的功能</u>。

- **Composition API（组合式API）**

  Vue3最显著的变化是引入了Composition API，它提供了一种更灵活的代码组织方式：

  - 更好的逻辑复用：通过可复用的组合式函数来提取和重用逻辑。
  - 更好的类型推导：对TypeScript的支持更为友好。
  - 更好的代码组织：相关联的代码可以放在一起，而不是分散在不同的选项中。

- **更好的TypeScript支持**

  Vue3是用TypeScript重写的，为TypeScript用户提供了改进的类型检查和类型推断。

- **Teleport组件**

  允许将组件的内容传送到DOM的其他部分，解决了模态框、通知等UI元素的定位问题。

- **Fragments（片段）**

  Vue3组件现在可以有多个根节点，不再需要一个单一的包装元素。

- **更好的响应式系统**

  基于Proxy的响应式系统，解决了Vue2中基于Object.defineProperty的一些限制：

  - 可以直接检测对象属性的添加和删除
  - 可以直接检测数组索引和长度的变更
  - 可以支持Map、Set、WeakMap和WeakSet

### 前端框架的发展历程

了解前端框架的发展有助于理解Vue在前端生态中的位置。

- 原始时代：`jQuery`​ 时代

  在2006年之前，前端开发主要依赖原生JavaScript和DOM操作，代码冗长且难以维护。jQuery的出现（2006年）简化了DOM操作和事件处理，但随着应用复杂度增加，仍面临代码组织和状态管理的挑战。

- MVC框架时代：`Backbone.js`​

  为解决代码组织问题，Backbone.js（2010年）等MVC框架引入了模型-视图-控制器模式，但仍需手动更新DOM，且代码复杂度随应用规模增长。 9b1ZE6MWUiiBNpptFEap+fzSadaXpX7S96EV7SHQPoE=

- 第一代现代框架：`Angular.js`​

  Angular.js（2010年）引入了双向数据绑定和依赖注入，极大简化了DOM操作，但随着应用规模增长，性能问题逐渐显现。

- 第二代现代框架：`React`​、`Vue`​、`Angular`​

  - React（2013年）：引入Virtual DOM和单向数据流，采用组件化思想，强调"UI即函数"。
  - Vue（2014年）：结合Angular的模板和双向绑定，及React的Virtual DOM和组件化，提供了渐进式框架的概念。
  - Angular（2016年，Angular 2+）：完全重写的框架，更现代化，但学习曲线较陡峭。

- 现代前端开发

  现代前端框架普遍采用组件化开发、虚拟DOM、状态管理、路由等概念，关注性能优化、开发体验和构建工具链。Vue3就是在这一背景下，汲取了行业最佳实践而诞生的。

### Vue3生态系统概览

Vue3不仅仅是一个UI框架，而是一个完整的生态系统，包括多个核心和社区工具：

- **核心库**

  - ​`Vue Core`​：Vue的<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">核心库</span>，提供组件系统、模板编译器和响应式系统。
  - ​`Vue Router`​：Vue官方的<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">路由管理器</span>，用于构建单页应用。
  - ​`Pinia`​：Vue官方推荐的<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">状态管理库</span>，替代了Vuex，专为Vue3设计。

- **开发工具**

  - ​`Vue CLI`​：命令行工具，用于快速搭建Vue项目。
  - ​`Vite`​：现代前端构建工具，由Vue团队开发，提供极快的开发服务器和优化的构建过程。
  - ​`Vue DevTools`​：浏览器扩展，用于调试Vue应用。

- **UI框架**

  基于Vue3的多个UI组件库：

  - ​`Element Plus`​：基于Vue3的桌面端组件库
  - ​`Naive UI`​：支持TypeScript的Vue3组件库
  - ​`Vuetify`​：Material Design风格的Vue组件库
  - ​`Quasar`​：一套Vue组件，支持同时开发网页、移动应用和桌面应用

- **开发模式**

  Vue3支持多种开发方式：

  - 单文件组件（SFC）：在`.vue`​文件中组合`HTML`​、`CSS`​和`JavaScript`​
  - 选项式API：<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">通过对象选项组织代码</span>（Vue2的主要方式）
  - 组合式API：<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">通过函数组合实现更灵活的代码组织</span>（Vue3的新特性）

- **生态系统优势**

  Vue3生态系统的主要<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">优势</span>在于：

  - 官方维护的<span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">核心库确保一致性和兼容性</span>
  - <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">灵活的开发模式</span>适应不同项目需求和团队习惯
  - <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">强大的工具链</span>提升开发效率
  - <span data-type="text" style="background-color: var(--b3-card-info-background); color: var(--b3-card-info-color);">活跃的社区</span>提供大量插件和支持

  随着Vue3的普及，其生态系统正变得越来越丰富，为开发者提供了全方位的支持。

‍

‍

[第2章：开发环境搭建 - Vue3 教程 - 编程导航教程](https://www.codefather.cn/course/1952312573633679361/section/1952312573772091394)

‍
