# -*- coding: utf-8 -*-
"""
Neo4j Graph RAG Demo — 企业级图数据库方案
===========================================
前置条件：Docker 中已运行 Neo4j

  docker run -d --name neo4j \
    -p 7474:7474 -p 7687:7687 \
    -e NEO4J_AUTH=neo4j/password \
    neo4j:latest

pip install neo4j sentence-transformers python-dotenv openai
"""

import os, sys, glob, asyncio

from config import LLM_MODEL, LLM_API_KEY, LLM_BASE_URL, EMBEDDING_MODEL
from dotenv import load_dotenv

# Neo4j demo 用自己的 data 目录
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# ============================================================
# 0. Neo4j 连接配置（从 .env 读取，不硬编码）
# ============================================================
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
os.makedirs(CACHE_DIR, exist_ok=True)

# ============================================================
# 1. LLM 调用（复用 graph_rag_demo 方式）
# ============================================================
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)

async def ask_llm(prompt: str, system: str = "") -> str:
    resp = await client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        temperature=0.0,
    )
    return resp.choices[0].message.content


# ============================================================
# 2. 实体抽取
# ============================================================
def extract_triplets(text: str) -> list[tuple[str, str, str]]:
    """用 LlamaIndex KnowledgeGraphIndex 抽取三元组"""
    from extract_llama import extract_with_llama
    return extract_with_llama(text)


# ============================================================
# 3. 存入 Neo4j
# ============================================================
from neo4j import GraphDatabase

class Neo4jGraph:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def clear(self):
        """清空所有节点和关系（重新建图前调用）"""
        with self.driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
        print("  已清空旧图谱")

    def insert_triplet(self, head, tail, relation, head_type="实体", tail_type="实体"):
        """插入一个三元组：(实体A) --[关系]--> (实体B)"""
        with self.driver.session() as session:
            session.run(
                f"MERGE (h:{head_type} {{name: $head}})"
                f"MERGE (t:{tail_type} {{name: $tail}})"
                f"MERGE (h)-[r:{relation.replace(' ', '_')}]->(t)"
                "ON CREATE SET r.description = $relation",
                head=head, tail=tail, relation=relation,
            )

    def query_neighbors(self, entity_name: str, max_depth: int = 1) -> list:
        """查询实体的 N 跳邻居"""
        with self.driver.session() as session:
            result = session.run(
                f"MATCH path = (s {{name: $name}})-[*1..{max_depth}]-(n) "
                "RETURN path LIMIT 30",
                name=entity_name,
            )
            paths = []
            for record in result:
                nodes = []
                for node in record["path"].nodes:
                    nodes.append(node["name"])
                for rel in record["path"].relationships:
                    paths.append(f"{rel.start_node['name']} --[{rel['description']}]--> {rel.end_node['name']}")
            return list(set(paths))

    def query_shortest_path(self, a: str, b: str) -> list:
        """查询两个实体之间的最短路径"""
        with self.driver.session() as session:
            result = session.run(
                "MATCH p = shortestPath((a {name: $a})-[*]-(b {name: $b})) "
                "RETURN [node IN nodes(p) | node.name] AS nodes, "
                "[rel IN relationships(p) | rel.description] AS rels",
                a=a, b=b,
            )
            rows = []
            for record in result:
                nodes = record["nodes"]
                rels = record["rels"]
                path_str = []
                for i in range(len(rels)):
                    path_str.append(f"{nodes[i]} --[{rels[i]}]--> {nodes[i+1]}")
                rows.append("\n".join(path_str))
            return rows

    def get_all_entities(self) -> list:
        """获取所有实体名称"""
        with self.driver.session() as session:
            result = session.run("MATCH (n) RETURN n.name AS name LIMIT 200")
            return [record["name"] for record in result]

    def get_communities(self) -> dict:
        """用 Cypher 模拟社区发现：按节点度分组"""
        with self.driver.session() as session:
            result = session.run(
                "MATCH (n) OPTIONAL MATCH (n)-[r]-() "
                "RETURN n.name AS name, n.type AS type, count(r) AS degree "
                "ORDER BY degree DESC"
            )
            communities = {"高关联 (度>=3)": [], "中关联 (度1-2)": [], "孤立节点 (度=0)": []}
            for record in result:
                d = record["degree"]
                if d >= 3:
                    communities["高关联 (度>=3)"].append(record["name"])
                elif d >= 1:
                    communities["中关联 (度1-2)"].append(record["name"])
                else:
                    communities["孤立节点 (度=0)"].append(record["name"])
            return communities


# ============================================================
# 4. 构建索引
# ============================================================
from sentence_transformers import SentenceTransformer
import numpy as np

def build_index():
    """从 Neo4j 读取所有实体，做 embedding"""
    model = SentenceTransformer(EMBEDDING_MODEL)
    entities = graph.get_all_entities()
    if not entities:
        return model, [], np.array([])
    print(f"  对 {len(entities)} 个实体做 embedding...")
    vectors = model.encode(entities, show_progress_bar=True)
    return model, entities, vectors


# ============================================================
# 5. 查询
# ============================================================
def local_search_db(question: str, model, entities, vectors, top_k=3):
    """向量检索找到实体 → 用 Cypher 查邻居"""
    q_vec = model.encode([question])
    sims = np.dot(vectors, q_vec.T).flatten()
    top_idx = np.argsort(sims)[-top_k:][::-1]

    context_parts = []
    for idx in top_idx:
        entity = entities[idx]
        paths = graph.query_neighbors(entity, max_depth=1)
        if paths:
            context_parts.append(f"• {entity}\n" + "\n".join(paths[:5]))
        else:
            context_parts.append(f"• {entity}（无关联实体）")

    return "\n\n".join(context_parts)


def global_search_db(question: str):
    """全局：查社区分组"""
    communities = graph.get_communities()
    parts = []
    for label, members in communities.items():
        if members:
            parts.append(f"【{label}】\n" + ", ".join(members[:10]))

    return "\n\n".join(parts)


# ============================================================
# 6. 主流程
# ============================================================
async def main():
    print("=" * 50)
    print("  Neo4j Graph RAG Demo")
    print("=" * 50)

    if not LLM_API_KEY:
        print("❌ 请先在 .env 中填入 API Key！")
        return

    global graph
    graph = Neo4jGraph(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)

    # 6a. 清空旧数据 + 读取文档
    graph.clear()
    files = glob.glob(os.path.join(DATA_DIR, "*.txt"))
    docs = []
    for f in files[:5]:
        with open(f, "r", encoding="utf-8") as fh:
            text = fh.read()
        if text.strip():
            docs.append(text.strip()[:2000])

    print(f"\n📄 读取 {len(docs)} 篇文档")

    # 6b. 抽取实体 → 写入 Neo4j
    print("\n  开始写入 Neo4j...")
    for i, doc in enumerate(docs):
        print(f"    文档 {i+1}/{len(docs)}：抽取中...", end="")
        triples = extract_triplets(doc)
        print(f" {len(triples)} 条三元组")

        # 先收集所有实体去重创建节点
        seen = set()
        for head, rel, tail in triples:
            if head not in seen:
                seen.add(head)
                graph.driver.execute_query(
                    "MERGE (n:实体 {name: $name})", name=head,
                )
            if tail not in seen:
                seen.add(tail)
                graph.driver.execute_query(
                    "MERGE (n:实体 {name: $name})", name=tail,
                )
            graph.insert_triplet(head, tail, rel)

    print("\n  ✅ 数据已写入 Neo4j")
    print(f"     浏览器访问 http://localhost:7474 查看图谱")

    # 6c. 建向量索引
    model, entities, vectors = build_index()

    # 6d. 查询演示
    questions = [
        ("local", "什么是 Simple RAG？有哪些 RAG 方案？"),
        ("global", "这些 RAG 方案主要探讨了哪些主题？"),
        ("path", "Rerank 和 Simple RAG 之间有什么关系？"),
    ]

    for mode, question in questions:
        print(f"\n{'='*50}")
        print(f"  [{mode.upper()}] {question}")
        print(f"{'='*50}")

        if mode == "local":
            context = local_search_db(question, model, entities, vectors)
        elif mode == "global":
            context = global_search_db(question)
        elif mode == "path":
            # 找最短路径示例
            context = ""
            names = await ask_llm(
                f"从以下问题中提取两个关键实体名（逗号分隔，不要多余文字）：{question}"
            )
            names = names.strip().split(",")
            if len(names) >= 2:
                a, b = names[0].strip(), names[1].strip()
                paths = graph.query_shortest_path(a, b)
                if paths:
                    context = f"{a} 到 {b} 的路径：\n" + "\n".join(paths[:3])
                else:
                    context = f"未找到 {a} 和 {b} 之间的直接路径"

        if not context:
            print("  ⚠️ 空结果")
            continue

        print(f"\n  上下文：\n  {context[:400]}\n")
        prompt = f"基于以下知识回答问题：\n\n{context}\n\n问题：{question}"
        answer = await ask_llm(prompt)
        print(f"  回答：{answer[:400]}")

    graph.close()
    print("\n✅ 完成！")


if __name__ == "__main__":
    asyncio.run(main())
