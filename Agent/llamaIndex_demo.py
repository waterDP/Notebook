from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# 1. 数据摄入(Loading)
# /data 从data文件夹读取
documents = SimpleDirectoryReader("data").load_data()

# 2. 索引构建(Indexing)
index = VectorStoreIndex.from_documents(documents)

# 3. 引擎配置(Querying Engine)
query_engine = index.as_query_engine()

# 4. 执行查询(Execution)
response = query_engine.query("每年的年假是多少")
