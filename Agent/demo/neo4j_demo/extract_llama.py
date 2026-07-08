"""
LlamaIndex KnowledgeGraphIndex 替换手动 LLM 抽取
================================================
用法：
  from extract_llama import extract_with_llama
  triples = extract_with_llama("小明是腾讯的算法工程师")
  # 返回 [("小明", "工作于", "腾讯"), ...]

pip install llama-index-core llama-index-graph-stores-neo4j
"""
import os, sys, json

from config import LLM_MODEL, LLM_API_KEY, LLM_BASE_URL

# ============================================================
# 配置 LlamaIndex 使用 DeepSeek
# ============================================================
from llama_index.core import Settings
from llama_index.llms.openai_like import OpenAILike

Settings.llm = OpenAILike(
    model=LLM_MODEL,
    api_key=LLM_API_KEY,
    api_base=LLM_BASE_URL,
    is_chat_model=True,
    temperature=0.0,
)

# 关键：用本地 embedding，不走 OpenAI
Settings.embed_model = None


# ============================================================
# 用 KnowledgeGraphIndex 抽取三元组
# ============================================================
from llama_index.core import KnowledgeGraphIndex, Document


def extract_with_llama(text: str) -> list[tuple[str, str, str]]:
    """
    用 LlamaIndex 的 KnowledgeGraphIndex 自动抽取三元组。
    返回 [(头实体, 关系, 尾实体), ...]
    """

    # 每次调用重新建一个小索引（只对一段文档做抽取）
    doc = Document(text=text[:2000])
    
    # 用最小配置建索引，不存向量库，只做实体抽取
    try:
        index = KnowledgeGraphIndex.from_documents(
            [doc],
            max_triplets_per_chunk=10,
            include_embeddings=False,   # 不建向量，纯抽实体
            show_progress=False,
        )
        
        # 用 networkx 图取三元组
        triples = []
        nx_graph = index.get_networkx_graph()
        for h, t, data in nx_graph.edges(data=True):
            rel = data.get('label', '')
            triples.append((h, rel, t))
        
        return triples
    except Exception as e:
        print(f"    LlamaIndex 抽取失败：{e}")
        return []


# ============================================================
# 快速测试
# ============================================================
if __name__ == "__main__":
    test = "小明是腾讯的算法工程师，负责大模型训练。小红是阿里的产品经理，负责AI产品规划。"
    result = extract_with_llama(test)
    print(f"抽取结果：{result}")
