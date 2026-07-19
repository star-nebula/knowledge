---
title: Milvus 向量数据库
created: 2026-07-08
tags:
  - AI
  - 向量数据库
  - Milvus
type: 概念解释
related:
  - "[[框架与中间件-MOC]]"
reference: ""
category: ["🤖 AI大模型", "AI 应用核心范式"]
---



# Milvus 向量数据库

## 什么是 Milvus

Milvus（2019年开源）是专为存储、索引和管理大规模嵌入向量而设计的向量数据库。可处理万亿级向量索引，面向非结构化数据（文本、图像、音频）的嵌入向量。

### Milvus vs 传统数据库

| 特性 | Milvus | MySQL |
|------|--------|-------|
| 数据类型 | 嵌入向量（非结构化数据） | 结构化数据 |
| 应用场景 | 相似度搜索、推荐系统、RAG | 事务处理、关系查询 |
| 数据表示 | 浮点数/二进制数组 | 表格、行、列 |

## 核心概念

### 非结构化数据 → 嵌入向量

图像、视频、音频、自然语言等非结构化数据（占全球数据约 80%）通过 AI/ML 模型转换为向量表示。向量相似度搜索通过近似最近邻搜索（ANNS）加速。

### Milvus 与关系数据库的对应

| Milvus | 关系数据库 | 说明 |
|--------|----------|------|
| **Collection** | Table（表） | 最顶层数据容器 |
| **Entity** | Row（行） | 实际插入的数据记录 |
| **Field** | Column（列） | 数据字段定义 |
| **is_primary** | Primary Key | 唯一标识符，每个 Collection 必须有且仅有一个 |
| **dim** | — | 向量维度，决定嵌入数组长度（如 1024） |

### Field Schema 关键属性

| 属性 | 说明 |
|------|------|
| **name** | 字段名，如 `"vector"`、`"content"` |
| **dtype** | 数据类型：`INT64`、`FLOAT_VECTOR`、`VARCHAR` 等 |
| **is_primary** | 主键字段，一个 Collection 仅一个 |
| **auto_id** | 自动分配主键 ID，推荐开启 |
| **max_length** | VARCHAR 字段最大字符数，范围 1-65535 |
| **dim** | 向量维度，需与 Embedding 模型输出维度一致 |

### Collection Schema 关键属性

| 属性 | 说明 |
|------|------|
| **field** | 字段列表（必填） |
| **enable_dynamic_field** | 是否允许插入未定义字段（JSON 存储），**强烈建议设为 true** |

## 索引类型

| 索引 | 特点 | 适用 |
|------|------|------|
| **FLAT** | 暴力搜索，精度最高，效率低 | 小型数据集（百万级） |
| **IVF_FLAT** | 聚类+倒排索引，平衡精度和速度 | 大规模数据集 |
| **IVF_SQ8** | IVF_FLAT + 标量量化，压缩存储 | 大规模数据集 |
| **IVF_PQ** | 倒排文件 + 乘积量化，存储小速度快 | 超大规模高维数据 |
| **HNSW** | 基于图的索引，搜索效率极高 | 对速度要求高的场景 |

相似度度量：**L2**（欧氏距离）、**IP**（内积）、**COSINE**（余弦相似度）

## 安装

```bash
pip install pymilvus[milvus_lite]   # 轻量版（一个 .db 文件即数据库）
# 或
pip install pymilvus                # 连接 Milvus 服务端
```

## 基本操作

### 创建客户端和 Collection

```python
from pymilvus import MilvusClient, DataType

# 客户端
client = MilvusClient(uri="milvus_demo.db")

# 创建 Schema
schema = client.create_schema(auto_id=False, enable_dynamic_field=True)
schema.add_field(field_name='id', datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name='vector', datatype=DataType.FLOAT_VECTOR, dim=5)
schema.add_field(field_name='scalar1', datatype=DataType.VARCHAR, max_length=256)

# 创建 Collection
client.create_collection(collection_name='demo_v1', schema=schema)
```

### 索引操作

```python
index_params = client.prepare_index_params()
index_params.add_index(
    field_name='vector',
    metric_type='COSINE',
    index_type='IVF_FLAT',
    index_name='vector_index'
)
client.create_index(collection_name='demo_v1', index_params=index_params)

# 查看索引
client.list_indexes(collection_name='demo_v1')
client.describe_index(collection_name='demo_v1', index_name='vector')

# 删除索引（需先释放 Collection）
client.release_collection(collection_name='demo_v1')
client.drop_index(collection_name='demo_v1', index_name='vector')
```

### 数据操作

```python
# 插入
data = [{"id": 0, "vector": [0.1, 0.2, 0.3, 0.4, 0.5], "color": "pink_8682"}]
client.insert(collection_name='demo_v2', data=data)

# Upsert（主键存在则覆盖，不存在则插入）
client.upsert(collection_name='demo_v2', data=data)
```

### 向量搜索

```python
# 基础搜索
res = client.search(
    collection_name='demo_v2',
    data=[[0.1, 0.2, 0.3, 0.4, 0.5]],
    limit=2,
    search_params={"metric_type": "IP"},
    output_fields=["id", "vector"]
)

# 分区搜索
res = client.search(
    collection_name='demo_v2',
    data=[[0.1, 0.2, 0.3, 0.4, 0.5]],
    partition_names=["partitionA"]
)

# 过滤搜索
res = client.search(
    collection_name='demo_v2',
    data=[[...]],
    limit=5,
    search_params={"metric_type": "IP"},
    filter="color like 'red%'"
)

# 范围搜索
search_params = {
    "metric_type": "IP",
    "params": {"radius": 0.8, "range_filter": 1}
}
res = client.search(
    collection_name='demo_v2',
    data=[[...]],
    limit=5,
    search_params=search_params
)
```

### 混合检索（Hybrid Search）

对多个向量字段并行搜索，通过重排策略合并结果。

```python
from pymilvus import AnnSearchRequest, RRFRanker, WeightedRanker

# 构建两个搜索请求
request_1 = AnnSearchRequest(
    data=query_film_vector,
    anns_field="filmVector",
    param={"metric_type": "L2", "nprobe": 10},
    limit=2
)
request_2 = AnnSearchRequest(
    data=query_poster_vector,
    anns_field="posterVector",
    param={"metric_type": "COSINE"},
    limit=2
)

# 重排策略
ranker = RRFRanker(k=100)          # 倒数排序融合（推荐）
# ranker = WeightedRanker(0.8, 0.3) # 加权排名

res = client.hybrid_search(
    collection_name="demo_v3",
    reqs=[request_1, request_2],
    ranker=ranker,
    limit=2
)
```

| 重排策略 | 说明 |
|---------|------|
| **RRFRanker** | 倒数排序融合，自动平衡多字段，通用首选 |
| **WeightedRanker** | 加权排名，可强调某字段（权重越接近 1 越重要） |

### 删除 Collection

```python
client.drop_collection(collection_name="demo_collection")
```
*（内容由AI生成，仅供参考）*
