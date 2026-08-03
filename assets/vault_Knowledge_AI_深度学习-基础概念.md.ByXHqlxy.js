import{_ as p,a8 as a,o as e,c as t,ah as r,K as l}from"./chunks/framework.CdNVSOxJ.js";import"./chunks/theme.BBWCvTyn.js";const o="",h="",c="",k="",f=JSON.parse('{"title":"深度学习-基础概念","description":"","frontmatter":{"title":"深度学习-基础概念","created":"2026-07-08T00:00:00.000Z","tags":["深度学习","基础概念"],"type":"概念解释","related":[],"reference":[],"category":["🤖 AI大模型","深度学习基础"]},"headers":[],"relativePath":"vault/Knowledge/AI/深度学习-基础概念.md","filePath":"vault/Knowledge/AI/深度学习-基础概念.md","lastUpdated":1785140936000}'),d={name:"vault/Knowledge/AI/深度学习-基础概念.md"};function g(u,s,B,y,A,b){const n=a("NolebaseGitContributors"),i=a("NolebaseGitChangelog");return e(),t("div",null,[s[0]||(s[0]=r('<h1 id="基础概念" tabindex="-1">基础概念 <a class="header-anchor" href="#基础概念" aria-label="Permalink to “基础概念”">​</a></h1><h3 id="什么是深度学习" tabindex="-1">什么是深度学习 <a class="header-anchor" href="#什么是深度学习" aria-label="Permalink to “什么是深度学习”">​</a></h3><p>深度学习是<strong>基于多层神经网络的机器学习分支</strong>，通过多层非线性变换自动从数据中提取复杂特征。</p><p><img src="'+o+'" alt=""></p><ul><li><p>深度学习（Deep Learning）是机器学习的分支</p></li><li><p>是一种以人工神经网络为架构，对数据进行特征学习的算法。</p></li><li><p>深度学习中的形容词“<span data-type="text" style="background-color:var(--b3-card-error-background);color:var(--b3-card-error-color);">深度</span>”是指<span data-type="text" style="background-color:var(--b3-card-info-background);color:var(--b3-card-info-color);">在网络中使用多层</span>，每层都通过非线性变换处理数据，并逐渐提取出更复杂、更抽象的特征。</p></li></ul><p><img src="'+h+'" alt=""></p><h6 id="核心思想" tabindex="-1">核心思想 <a class="header-anchor" href="#核心思想" aria-label="Permalink to “核心思想”">​</a></h6><p>通过模仿人脑的神经网络来处理和分析复杂的数据，从大量数据中<span data-type="text" style="background-color:var(--b3-card-error-background);color:var(--b3-card-error-color);">自动提取复杂特征</span>，擅长处理高维数据，如图像、语音和文本。</p><h6 id="深度-的含义" tabindex="-1">&quot;深度&quot;的含义 <a class="header-anchor" href="#深度-的含义" aria-label="Permalink to “&quot;深度&quot;的含义”">​</a></h6><ul><li><p>网络包含<strong>多个隐藏层</strong></p></li><li><p>逐层提取从<strong>简单到抽象</strong>的特征</p></li><li><p>示例：图像识别</p><ul><li><p>第 1 层：边缘/角点</p></li><li><p>第 2 层：纹理/形状</p></li><li><p>第 3 层：部件（眼睛、轮子）</p></li><li><p>第 4 层+：完整对象（人脸、汽车）</p></li></ul></li></ul><h6 id="深度学习-vs-传统机器学习" tabindex="-1">深度学习 VS 传统机器学习 <a class="header-anchor" href="#深度学习-vs-传统机器学习" aria-label="Permalink to “深度学习 VS 传统机器学习”">​</a></h6><ul><li>机器学习，其特征工程需要人工进行，而深度学习自动由算法处理</li></ul><p>|对比维度|传统机器学习|深度学习|</p><p>| ----------| --------------| --------------|</p><p>|特征工程|人工设计特征|<strong>自动特征提取</strong>|</p><p>|模型结构|浅层模型为主|多层神经网络|</p><p>|数据需求|中小数据集|大数据集|</p><p>|计算需求|CPU 可胜任|需要 GPU|</p><h3 id="深度学习特点" tabindex="-1">深度学习特点 <a class="header-anchor" href="#深度学习特点" aria-label="Permalink to “深度学习特点”">​</a></h3><ul><li><p><strong>多层非线性变换</strong>：深度学习模型由<u>多个层次组成，每一层都应用非线性激活函数</u>对输入数据进行变换。较低的层级通常捕捉到简单的特征（如边缘、颜色等），而更高的层级则可以识别更复杂的模式（如物体或面部识别）。</p></li><li><p><strong>自动特征提取</strong>：与传统机器学习算法不同，深度学习能够自动从原始数据中学习到有用的特征，而不需要人工特征工程。这使得深度学习在许多领域中表现出色。</p></li><li><p><strong>大数据和计算能力</strong>：深度学习模型通常需要大量的标注数据和强大的计算资源（如GPU）来进行训练。大数据和高性能计算使得深度学习在图像识别、自然语言处理等领域取得了显著突破。</p></li><li><p><strong>可解释性差</strong>：深度学习模<u>型内部的运作机制相对不透明</u>，被称为“黑箱”，这意味着理解模型为什么做出特定决策可能会比较困难。这对某些应用场景来说是一个挑战。</p></li></ul><h3 id="常见的深度学习模型" tabindex="-1">常见的深度学习模型 <a class="header-anchor" href="#常见的深度学习模型" aria-label="Permalink to “常见的深度学习模型”">​</a></h3><ul><li><p>卷积神经网络 (Convolutional Neural Networks，CNN)：</p><ul><li><p>主要用于图像处理任务，如图像分类、目标检测、图像分割等。</p></li><li><p>特点是使用卷积层来自动提取图像中的局部特征，并通过池化层减少参数数量，提高计算效率。</p></li></ul></li><li><p>循环神经网络 (Recurrent Neural Networks，RNN)：</p><ul><li><p>适用于处理序列数据，例如自然语言处理（NLP）、语音识别等。</p></li><li><p>RNN具有记忆功能，可以处理输入数据的时间依赖性，但标准RNN难以捕捉长期依赖关系。</p></li></ul></li><li><p>自编码器 (Autoencoders)：</p><ul><li><p>一种无监督学习模型，通常用于降维、特征学习或者异常检测。</p></li><li><p>自编码器由编码器和解码器两部分组成，前者将输入压缩成一个较低维度的表示，后者尝试从这个低维表示重建原始输入。</p></li></ul></li><li><p>生成对抗网络 (Generative Adversarial Networks，GAN)：</p><ul><li><p>包含两个子网络：生成器和判别器。生成器负责创建看起来真实的假样本，而判别器则试图区分真假样本。</p></li><li><p>GAN广泛应用于图像生成、视频合成等领域。</p></li></ul></li><li><p>Transformer：</p><ul><li><p>主要用于自然语言处理（NLP）任务，尤其是机器翻译、文本生成等。</p></li><li><p>Transformer摒弃了传统的递归结构，采用<u>自注意力机制</u>（self-attention），使得它能够并行处理整个句子的信息，在机器翻译、文本摘要等任务中表现出色。</p></li></ul></li><li><p>深度强化学习（Deep Reinforcement Learning，DRL）</p></li><li><p>图神经网络（GNN，Graph Neural Network ）</p></li></ul><p>|模型|核心应用|关键特性|</p><p>| -------------| -----------------------| ---------------------------------|</p><p>|CNN|图像处理|卷积层提取局部特征，池化降维|</p><p>|RNN|序列数据（NLP、语音）|有记忆功能，但难捕捉长期依赖|</p><p>|Autoencoder|降维、异常检测|编码器压缩+解码器重建|</p><p>|GAN|图像/视频生成|生成器 vs 判别器对抗训练|</p><p>|Transformer|NLP、多模态|自注意力机制，并行处理，取代RNN|</p><p>|GNN|图结构数据|处理社交网络、分子结构等|</p><h3 id="深度学习-应用场景" tabindex="-1">深度学习 应用场景 <a class="header-anchor" href="#深度学习-应用场景" aria-label="Permalink to “深度学习 应用场景”">​</a></h3><p><img src="'+c+'" alt="">​</p><ul><li><p><span data-type="text" style="background-color:var(--b3-card-info-background);color:var(--b3-card-info-color);">计算机视觉（Computer Vision）</span></p><ul><li><p>图像分类：将图像分为不同的类别。常用于人脸识别、物体检测等。</p><ul><li>自动标注社交媒体照片、医疗影像中的病变检测。</li></ul></li><li><p>目标检测（Object Detection）：在图像或视频中定位并分类多个对象。</p><ul><li>自动驾驶中的行人检测、监控视频中的入侵检测。</li></ul></li><li><p>面部识别：通过分析面部特征进行身份验证或分类。</p><ul><li>手机解锁、安防监控系统。</li></ul></li><li><p>图像生成：基于输入生成新的图像，如风格转换、图像超分辨率等。</p><ul><li>艺术风格迁移、老旧照片修复。</li></ul></li></ul></li><li><p><span data-type="text" style="background-color:var(--b3-card-info-background);color:var(--b3-card-info-color);">自然语言处理（Natural Language Processing，NLP）</span></p><ul><li><p>机器翻译：使用深度学习模型将一种语言的文本自动翻译成另一种语言。</p><ul><li>Google翻译、实时语音翻译。</li></ul></li><li><p>情感分析：分析文本中的情感倾向，如正面、负面或中性。</p><ul><li>社交媒体监控、产品评论分析。</li></ul></li><li><p>文本生成：生成符合语法和语义的自然语言文本。</p><ul><li>自动写作助手、新闻生成。</li></ul></li><li><p>语音识别：将语音转化为文字。</p><ul><li>智能助手（如Siri、Alexa）、自动字幕生成。</li></ul></li><li><p>聊天机器人（Chatbot）：通过深度学习理解用户输入并生成合理的回应。</p><ul><li>客服机器人、虚拟助手（如GPT类模型）。</li></ul></li></ul></li><li><p><span data-type="text" style="background-color:var(--b3-card-info-background);color:var(--b3-card-info-color);">推荐系统（Recommendation Systems）</span></p><ul><li><p>电影、音乐推荐：根据用户历史的评分和行为，推荐相关的电影、音乐或电视剧。</p><ul><li>Netflix、Spotify的个性化推荐。</li></ul></li><li><p>电商推荐：根据用户的购买历史和浏览习惯推荐商品。</p><ul><li>亚马逊、淘宝的商品推荐系统。</li></ul></li><li><p>社交媒体推荐：分析用户的社交行为，推荐相关内容或朋友。</p><ul><li>Facebook、Instagram的内容推荐。</li></ul></li></ul></li><li><p><span data-type="text" style="background-color:var(--b3-card-info-background);color:var(--b3-card-info-color);">多模态大模型（Multimodal Large Model）</span></p></li></ul><p>|方向|核心任务|典型应用|</p><p>| --------------| --------------------------------------------------| -----------------------------------------------|</p><p>|计算机视觉|图像分类、目标检测、人脸识别、图像生成|自动驾驶、医疗影像、安防监控、风格迁移|</p><p>|自然语言处理|机器翻译、情感分析、文本生成、语音识别、对话系统|智能助手、自动字幕、客服机器人、ChatGPT|</p><p>|推荐系统|个性化推荐|电商购物、流媒体（Netflix/Spotify）、社交内容|</p><p>|多模态大模型|融合文本/图像/语音的联合理解与生成|GPT-4V、Sora、文生图/视频|</p><h3 id="深度学习-发展史" tabindex="-1">深度学习 发展史 <a class="header-anchor" href="#深度学习-发展史" aria-label="Permalink to “深度学习 发展史”">​</a></h3><p><img src="'+k+`" alt=""></p><ul><li><p><strong>早期探索</strong></p><ul><li><p>20世纪40年代：沃尔特·皮茨（Walter Pitts）和沃伦·麦卡洛克（Warren McCulloch）等开始模仿生物神经系统来构建计算模型，如McCulloch-Pitts神经元</p></li><li><p>1958年：弗兰克·罗森布拉特（Frank Rosenblatt）提出感知器概念，能够进行简单的二分类任务</p></li><li><p>1960年代末：出现了多层感知器（MLP），但当时由于计算能力和数据量的限制，这些模型的应用受到很大限制</p></li></ul></li><li><p><strong>挑战与瓶颈</strong></p><ul><li><p>1986年：<span data-type="text" style="background-color:var(--b3-card-error-background);color:var(--b3-card-error-color);">反向传播算法</span>（Backpropagation）的提出标志着神经网络研究的一个重要突破。杰弗里·辛顿（Geoffrey Hinton）和大卫·鲁梅尔哈特（David Rumelhart）等人提出了反向传播算法，使得多层神经网络（即深层网络）能够通过梯度下降优化参数，解决复杂的非线性问题。</p></li><li><p>虽然神经网络方法在一些领域表现不错，但由于计算资源的限制以及对复杂数据（如图像和语音）的处理能力较弱，深度学习未能广泛应用。此时，支持向量机（SVM）、决策树等传统机器学习方法成为主流。</p></li></ul></li><li><p><strong>复兴与突破</strong></p><ul><li><p>2006年：杰弗里·辛顿和其团队提出了深度信念网络（DBN），标志着深度学习的复兴。他们引入了无监督预训练的技术，使得深层网络能够有效训练。这为深度学习的发展奠定了基础。</p></li><li><p>2012年：深度学习的一个重要突破是AlexNet的出现。亚历克斯·克里泽夫斯基（Alex Krizhevsky）在ImageNet图像分类竞赛中使用了一个深度卷积神经网络，显著提升了图像分类的精度，比传统方法提高了20%以上。AlexNet的成功标志着深度学习在计算机视觉领域的成功应用。</p></li><li><p>2014年：生成对抗网络（GANs）由伊恩·古德费洛（Ian Goodfellow）等人提出，开启了生成模型的新时代，能够生成非常逼真的图像、音频和视频。</p></li><li><p>2015年：ResNet（残差网络）由何凯明（Kaiming He）等提出，解决了深度网络中的梯度消失和梯度爆炸问题，允许训练极深的网络（如50层、152层），极大推动了深度学习在图像识别任务中的应用。</p></li></ul></li><li><p><strong>爆发期</strong></p><ul><li><p>2016年：Google AlphaGo 战胜李世石（人工智能第三次浪潮），AlphaGo 展现了深度强化学习（Deep Reinforcement Learning）在解决复杂问题上的巨大潜力，将其推向了公众视野。</p></li><li><p>2017年：自然语言处理NLP的Transformer框架出现，奠定了后续预训练语言模型（如 BERT 和 GPT）的基础。</p></li><li><p>2018年：BERT和GPT的出现，基于Transformer架构的预训练语言模型的代表。</p></li><li><p>2022年：ChatGPT的出现，进入到大模型AIGC发展的阶段，开启了 AI 与人交互的新模式，使人们可以更容易地使用 AI 并从中受益。</p></li></ul></li></ul><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light one-dark-pro" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;" tabindex="0" dir="ltr"><code><span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1943</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── MP神经元模型 ── 理论起源</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1958</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── 感知机（Perceptron）── 第一次浪潮</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">1986</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── 反向传播算法（Hinton）── 关键突破 ⭐</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2006</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── 深度信念网络（</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">DBN</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">）── 深度学习复兴</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2012</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── AlexNet ── 深度学习爆发 ⭐（ImageNet夺冠，</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">GPU</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">大数据）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2014</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">GAN</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── 生成模型新纪元</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2015</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── ResNet ── 可训练152层超深网络</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2016</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── AlphaGo ── 强化学习破圈 ⭐</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2017</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── Transformer ── NLP革命 ⭐（</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;">&quot;Attention is All You Need&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">）</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2018</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── </span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">BERT</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">GPT</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── 预训练模型时代</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">  │</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;">2022</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;"> ── ChatGPT ── 大模型</span><span style="--shiki-light:#D73A49;--shiki-dark:#56B6C2;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#ABB2BF;">AIGC元年 ⭐</span></span></code></pre></div><p>阶段特征</p><p>|阶段|时间|核心特征|</p><p>| ------------| -------------| -------------------------------------|</p><p>|早期探索|1940s-1960s|生物启发，理论奠基，算力不足|</p><p>|挑战与瓶颈|1970s-1990s|反向传播提出，但SVM等传统方法主导|</p><p>|复兴与突破|2006-2015|深度网络可训练，CNN在视觉领域突破|</p><p>|爆发期|2016-至今|强化学习、Transformer、大模型、AIGC|</p><p>关键人物</p><ul><li><p><strong>Geoffrey Hinton</strong>：反向传播、DBN、深度学习教父</p></li><li><p><strong>Yann LeCun</strong>：CNN（LeNet）</p></li><li><p><strong>Yoshua Bengio</strong>：神经网络与深度学习基础</p></li><li><p><strong>Kaiming He</strong>：ResNet</p></li></ul><hr>`,53)),l(n),l(i)])}const m=p(d,[["render",g]]);export{f as __pageData,m as default};
