from pymilvus import MilvusClient, DataType

client = MilvusClient(uri="http://localhost:19530", token="root:root")

schema = MilvusClient.create_schema(
    description="description", enable_dynamic_field=True
)

schema.add_field(name="content_vector", dtype=DataType.FLOAT_VECTOR, dim=1024)


# 配置索引
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="content_vector",
    index_type="HNSW",
    metric_typ="CONSIN",
    params={"M": 128, "efConstruction": 4096},
)

# 创建集合
client.create_collection(
    collection_name="articles", schema=schema, index_params=index_params
)

# 集合别名
client.create_alias(collection_name="articles", alias="production_articles")

# 集合加载与释放
client.load_collection(collection_name="articles")
client.release_collection(collection_name="articles")


# 数据库：顶层命名空间
client.create_database("my_project")
client.use_database("my_project")
client.drop_database("my_project")

# 修改字段
client.alter_collection_field(
    collection_name="articles", field_name="title", field_params={"max_length": 256}
)

# 添加字段
client.add_collection_field(
    collection_name="articles",
    field_name="priority_level",
    data_type=DataType.VARCHAR,
    max_length=20,
    nullable=True,
    default_value="standard",
)

# 查询
result = client.query(
    collection_name="articles",
    filter="id == 1",
    output_fields=["title", "content", "priority_level", "$meta['extra_info]"],
)


# 插入实体
data = []
client.insert(collection_name="articles", data=data)

# 插入实体指定分区
client.insert(collection_name="articles", data=data, partition_name="p1")

# 覆盖模式下的Upsert
"""默认模式，用新实体完全替换旧实例。请求中必须包含所有字段的值，未提供的字段将被设为Null或默认值"""
data = [
    {
        "id": 1,
        "title": "New Title",
        "content": "New Content",
        "priority_level": "high",
        "extra_info": {"key": "value"},
        "content_vector": [
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            00.0,
            0.0,
        ],
    }
]
client.upsert(collection_name="articles", data=data)

# 合并模式下的Upsert
"""只更新请求中指定的字段，其它字段保持不变。请求只需包含主键和要更新的字段"""
data = [
    {
        "id": 1,
        "title": "New Title",
        "content": "New Content",
        "priority_level": "high",
        "extra_info": {"key": "value"},
        "content_vector": [
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            00.0,
            0.0,
        ],
    }
]
client.upsert(collection_name="articles", data=data, partial_update=True)

# 通过过滤条件批量删除
client.delete(
    collection_name="quick_setup", filter="color in ['red_3023', 'purple_4974]"
)

# 通过主键删除
client.delete(collection_name="articles", ids=[19, 20])

# 从指定分区删除
client.delete(collection_name="articles", ids=[19, 20], partition_name="p1")

# 单向量搜索
query_vector = [0.33, -1.229, 0.321, 0, 0.3949]

res = client.search(
    collection_name="articles",
    data=[query_vector],  # 查询向量（列表形式，可包括多个）
    anns_field="vector",  # 要搜索的向量名称
    limit=3,  # 返回最相似的前3个结果
    search_params={"metric_type": "COSINE"},
)

for hits in res:
    for hit in hits:
        print(f"id:{hit['id']}, distance: {hit['distance']:.4f}")  # 保留4位小数

# 带输出字段的搜索
res = client.search(
    collection_name="articles",
    data=[query_vector],  # 查询向量（列表形式，可包括多个）
    anns_field="vector",  # 要搜索的向量名称
    limit=3,  # 返回最相似的前3个结果
    search_params={"metric_type": "COSINE"},
    ## 输出字段
    output_fields=["id", "title", "content", "priority_level", "$meta['extra_info]"],
)

# 分区里搜索
res = client.search(
    collection_name="articles",
    data=[query_vector],  # 查询向量（列表形式，可包括多个）
    anns_field="vector",  # 要搜索的向量名称
    limit=3,  # 返回最相似的前3个结果
    search_params={"metric_type": "COSINE"},
    ## 分区名称
    partition_name="p1",
)


# 使用分页搜索
res = client.search(
    collection_name="articles",
    data=[query_vector],  # 查询向量（列表形式，可包括多个）
    anns_field="vector",  # 要搜索的向量名称
    search_params={"metric_type": "COSINE"},
    ## 分页参数 返回第11~13个结果
    limit=3,
    offset=10,
)

# 可以多字段排序
res = client.search(
    collection_name="articles",
    data=[query_vector],  # 查询向量（列表形式，可包括多个）
    anns_field="vector",  # 要搜索的向量名称
    limit=20,
    output_fields=["id", "title", "price", "rating"],
    ## 排序字段
    order_by_fields=[
        {"field": "price", "order": "asc"},
        {"field": "rating", "order": "desc"},
    ],
)

# 创建索引
index_params = client.prepare_index_params()

index_params.add_index(
    field_name="tags", index_type="AUTOINDEX", index_name="tags_index"
)

# 创建集合后，你可以通过‘describe_collection’ 方法查看集合的详细信息，确认数组字段是否已正确配置
description = client.describe_collection(collection_name="articles")
print("Collection schema:", description)

# 数组的高级查询
# ! => 数组中包含指定值
filter_expr = "ARRAY_CONTAINS(tags, 'rock')"

# ! => 数组元素个数大于2
filter_expr = "ARRAY_LENGTH(tags) > 2"

# ! => 数组中包含 'rock' 或 'pop'
filter_expr = "ARRAY_CONTAINS_ANY(tags, ['rock', 'pop'])"

result = client.query(collection_name="articles", filter=filter_expr, output_fields=['pk', 'tags'])

# # 也可以组合使用这些查询条件
filter_expr = "ARRAY_CONTAINS(tags, 'rock') AND ARRAY_LENGTH(tags) > 2"

result = client.search(
    collection_name="articles",
    data=[[0.3, -0.4, 0.1]]
    filter=filter_expr,
    limit=5,
    search_params={"params": {'nprobe': 10}},
    output_fields=['tags', "ratings"]
)


# # -------- TTL -------------------------------------------------------

# 集合级TTL 创建集合时 通过properties参数传入
client.create_collection(
    collection_name="articles",
    schema=schema,
    index_params=index_params,
    properties={
        "collection.ttl.seconds": 1209600 # 14天
    }
)

# 给已有集合添加TTL
client.alter_collection_properties(
    collection_name="articles",
    properties={
        "collection.ttl.seconds": 1209600 # 14天
    }
)

# 取消TTL
client.drop_collection_properties(
    collection_name="articles",
    property_keys=["collection.ttl.seconds"]
)


# 实体级TTL
schema = client.create_schema(enable_dynamic_field=False)

schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)
schema.add_field("title", DataType.VARCHAR, max_length=256)
schema.add_field("expire_at", DataType.TIMESTAMPTZ, nullable=True) # ! 过期时间，关键字段
schema.add_field("vector", DataType.FLOAT_VECTOR, dim=128)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name="vector", index_type="AUTOINDEX", index_name="vector_index"
)

client.create_collection(
    collection_name="articles",
    schema=schema,
    index_params=index_params,
    properties={"ttl_field": "expire_at"} # ! 标记为ttl字段
)

# 灵活控制每条数据的生命周期
import random

rows = [
    # 永不过期
    {"id": 1, "expire_at": None, "vector": [random.random() for _ in range(128)]},
    # 在 2025-12-31 UTC 午夜过期
    {"id": 1, "expire_at": "2025-12-31T00:00:00Z", "vector": [random.random() for _ in range(128)]},
    # 上海时间 2027-01-01 零点过期（内部自动转为 UTC 时间）
    {"id": 1, "expire_at": "2027-01-01T00:00:00+08:00", "vector": [random.random() for _ in range(128)]},
]
client.insert("articles", rows)

# 延长某条数据的生命（如果还没有被物理删除）
client.upsert("articles", [
    {"id": 1, "vector": [random.random() for _ in range(128)], "expire_at": "2028-01-01T00:00:00Z"},
])

## 给已有集合添加TTL

# step 1 添加TIMESTAMPTZ列
client.add_collection_field(
    collection_name="articles",
    field_name="expire_at",
    field_type=DataType.TIMESTAMPTZ,
    nullable=True, # # 允许NULL值
)

# step 2 标记为ttl字段
client.alter_collection_properties(
    collection_name="articles",
    properties={
        "ttl_field": "expire_at" # 标记为ttl字段
    }
)

# step 3 (可选)为历史数据回填过期时间
client.upsert("articles", [
    {"id": 1, "vector": [random.random() for _ in range(128)], "expire_at": "2028-01-01T00:00:00Z"}
])


# 从集合级TTL -> 实体级TTL
def convert_to_entity_ttl(collection_name: str, ttl_field: str):
    # step1 删除集合级TTL
    client.drop_collection_properties(
        collection_name=collection_name,
        property_keys=["collection.ttl.seconds"]
    )
    # step2 添加TIMESTAMPTZ列
    client.add_collection_field(
        collection_name=collection_name,
        field_name=ttl_field,
        field_type=DataType.TIMESTAMPTZ,
        nullable=True, # # 允许NULL值
    )
    # step3 标记为ttl字段
    client.alter_collection_properties(
        collection_name=collection_name,
        properties={
            "ttl_field": ttl_field # 标记为ttl字段
        }
    )

# 从实体级ttl -> 集合级ttl
def convert_to_collection_ttl(collection_name: str, seconds: int = 1209600):
    # step 1 删除实体级ttl字段
    client.drop_collection_properties(
        collection_name=collection_name,
        property_keys=["ttl_field"]
    )
    # step 2 添加集合级ttl
    client.alter_collection_properties(
        collection_name=collection_name,
        properties={
            "collection.ttl.seconds": seconds
        }
    )


# # IVF_FLAT 示例
# step1 定义索引参数（未触发训练）
index_params = client.prepare_index_params()
index_params.add_index(
    field_name="vector",
    index_type="IVF_FLAT",
    index_name="vector_index",
    params={"nlist": 1000000},
)

# step2 创建集合 （仅保存索引参数）
client.create_collection(
    collection_name="articles",
    schema=schema,
    index_params=index_params
)

# ! step3 必须显示调用create_index() 才能真正创建索引
collection = client.get_collection("articles")
collection.create_index("vector_index")

# 搜索
search_params = {"metric_type": "L2", "params": {"nprobe": 15}} # 搜索时考虑的聚类中心数据
results = collection.search([query_vector], "embedding", search_params, limit=10)


# # IVF_PQ的代码展示
# 创建IVF_PQ索引
index_params = {
    "index_type": "IVF_PQ",
    "metric_type": "L2",
    "params": {
        "nlist": 1000000, # 聚类中心数量
        "nprobe": 15, # 搜索时考虑的聚类中心数量
        "m": 16, # 子空间数量  # ?
        "nbit": 8, # 每个子空间的bit数  # ?
    }
}

collection.create_index("vector_index", index_params)
# 搜索 
search_params = {"metric_type": "L2", "params": {"nprobe": 32}} # 搜索时考虑的聚类中心数据
results = collection.search([query_vector], "vector", search_params, limit=10)


# 在非JSON字段上创建索引
index_params.add_index(
    field_name="category",
    index_type="INVERTED",
    index_name="category_index",
)

# 你还可以在JSON字段内的特定路径上创建INVERTED索引。这需要额外的参数来指定JSON路径和数据类型
index_params.add_index(
    field_name="metadata",
    index_type="INVERTED",
    index_name="json_category_index",
    params={
        "json_path": "metadata[\"category\"]",
        "json_cast_type": "varchar"
    }
)

client.create_collection("my-collection", schema=schema, index_params=index_params)

# 删除索引
client.drop_collection_index("my-collection", index_name="category_index")

# # 主要向量索引： FLAT IVF_FLAT IVF_PQ IVF_SQ8 IVF_RABITQ HNSW ANNOY DiskANN SCANN 
# # 主要标量索引： 倒排标量索引 

