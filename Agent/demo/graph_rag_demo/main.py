# -*- coding: utf-8 -*-
r"""
Graph RAG 实战 Demo — 纯手搓（不用 LightRAG）
=================================================
pip install sentence-transformers python-dotenv networkx scikit-learn
cd e:\Notebook\Agent\demo\graph_rag_demo
python main.py

流程：
  1. 用 LLM 从文档中抽取实体和关系，构建知识图谱
  2. 实体做 embedding，建向量索引
  3. Local Search：查实体 + 邻居 + 关系
  4. Global Search：查社区摘要（Leiden 算法自动分组）
  5. 对比 Naive RAG 的效果差异
"""

import os, sys, json, glob, asyncio, pickle
sys.path.insert(0, os.path.dirname(__file__))

from config import LLM_MODEL, LLM_API_KEY, LLM_BASE_URL, EMBEDDING_MODEL, DATA_DIR, CACHE_DIR

# ============================================================
# 1. LLM 调用
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
# 2. 实体抽取（LLM 从文档中抽）
# ============================================================
async def extract_entities(text: str) -> dict:
    """从文本中抽取实体和关系，返回 {'entities': [...], 'relations': [...]}"""
    prompt = f"""从以下文本中提取实体和关系。

要求：
- 实体包括：人名、技术概念、框架名、方法论等
- 关系描述实体间的关联（如"是""包含""改进""提出"等）
- 只提取明确出现的，不要脑补

文本：
{text[:1500]}

以 JSON 格式输出（不要加任何说明）：
{{"entities": [{{"name": "实体名", "type": "类型"}}], "relations": [{{"source": "实体A", "target": "实体B", "relation": "关系"}}]}}"""
    try:
        result = await ask_llm(prompt)
        # 清理可能的多余标记
        result = result.strip()
        if result.startswith("```"):
            result = result.split("\n", 1)[1]
            result = result.rsplit("```", 1)[0]
        return json.loads(result)
    except Exception as e:
        print(f"    ⚠️ 实体抽取失败：{e}")
        return {"entities": [], "relations": []}


# ============================================================
# 3. 构建知识图谱（NetworkX）
# ============================================================
import networkx as nx

async def build_graph(docs: list[str]) -> nx.Graph:
    """对每篇文档抽取实体关系，构建知识图谱"""
    import time

    G = nx.Graph()
    print(f"\n  开始构建知识图谱（{len(docs)} 篇文档）...")

    for i, doc in enumerate(docs):
        if not doc.strip():
            continue
        print(f"    文档 {i+1}/{len(docs)}：抽取实体中...", end="")
        sys.stdout.flush()
        data = await extract_entities(doc)
        print(f" {len(data['entities'])} 实体, {len(data['relations'])} 关系")

        for ent in data.get("entities", []):
            G.add_node(ent["name"], type=ent.get("type", "未知"))

        for rel in data.get("relations", []):
            G.add_edge(
                rel["source"], rel["target"],
                relation=rel["relation"],
            )

    print(f"\n  图谱构建完成：{G.number_of_nodes()} 节点, {G.number_of_edges()} 条边")

    # 缓存图谱（供 --visualize 使用）
    os.makedirs(CACHE_DIR, exist_ok=True)
    with open(os.path.join(CACHE_DIR, "graph.pkl"), "wb") as f:
        pickle.dump(G, f)
    print(f"  图谱已缓存到 {CACHE_DIR}")

    return G


# ============================================================
# 4. Embedding + 向量索引
# ============================================================
from sentence_transformers import SentenceTransformer
import numpy as np

def build_vector_index(G: nx.Graph):
    """对所有实体做 embedding，建向量索引"""
    model = SentenceTransformer(EMBEDDING_MODEL)
    nodes = list(G.nodes())
    if not nodes:
        return model, nodes, np.array([])

    print(f"  对 {len(nodes)} 个实体做 embedding...")
    vectors = model.encode(nodes, show_progress_bar=True)
    return model, nodes, vectors


# ============================================================
# 5. Local Search — 查实体 + 邻居 + 关系
# ============================================================
def local_search(question: str, G: nx.Graph, model, nodes, vectors, top_k=3):
    """找问题关联的实体，返回实体 + 邻居 + 关系描述"""
    q_vec = model.encode([question])
    sims = np.dot(vectors, q_vec.T).flatten()
    top_idx = np.argsort(sims)[-top_k:][::-1]

    context_parts = []
    for idx in top_idx:
        entity = nodes[idx]
        neighbors = list(G.neighbors(entity))
        if not neighbors:
            context_parts.append(f"• {entity}")
        else:
            rels = []
            for nb in neighbors:
                edge = G[entity][nb]
                rels.append(f"  → {edge['relation']} → {nb}")
            context_parts.append(f"• {entity}\n" + "\n".join(rels))

    return "\n\n".join(context_parts)


# ============================================================
# 6. Global Search — 社区摘要检索
# ============================================================
from collections import defaultdict
from community import community_louvain  # pip install python-louvain


# ============================================================
# 6b. 可视化
# ============================================================
def visualize(G: nx.Graph):
    """用 Pyvis 生成交互式图谱 HTML"""
    try:
        from pyvis.network import Network
        import webbrowser
    except ImportError:
        print("需要安装 pyvis：pip install pyvis")
        return

    net = Network(height="700px", width="100%", directed=False, notebook=False)
    net.set_options('''
{
  "nodes": {"font": {"size": 14}},
  "edges": {"font": {"size": 10, "align": "middle"},
             "arrows": {"to": {"enabled": true}}},
  "physics": {"stabilization": {"iterations": 100}},
  "interaction": {"hover": true}
}
''')

    # 按类型分颜色
    type_colors = {
        "方法": "#4CAF50", "概念": "#2196F3", "框架": "#FF9800",
        "技术": "#9C27B0", "工具": "#E91E63", "策略": "#00BCD4",
        "未知": "#BDBDBD",
    }

    for node, attrs in G.nodes(data=True):
        t = attrs.get("type", "未知")
        net.add_node(node, label=node, title=f"类型: {t}",
                     color=type_colors.get(t, "#BDBDBD"), size=20)

    for u, v, attrs in G.edges(data=True):
        label = attrs.get("relation", "")
        net.add_edge(u, v, title=label, label=label, arrows="to")

    out_path = os.path.join(os.path.dirname(__file__), "graph.html")
    net.save_graph(out_path)
    print(f"\n✅ 可视化已保存：{out_path}")
    webbrowser.open(out_path)



def global_search(question: str, G: nx.Graph, model, nodes, vectors):
    """用社区发现分组，每个社区 LLM 生成摘要，检索摘要"""
    if G.number_of_nodes() < 3:
        return "图谱太小，无法做社区划分"

    # 6a. 社区发现
    print("\n  社区发现中...")
    try:
        # 需要将图转为无向加权图
        G_undirected = G.to_undirected()
        for u, v in G_undirected.edges():
            if "weight" not in G_undirected[u][v]:
                G_undirected[u][v]["weight"] = 1.0
        partition = community_louvain.best_partition(G_undirected)
    except Exception as e:
        print(f"  社区发现失败：{e}")
        return ""

    # 按社区分组
    communities = defaultdict(list)
    for node, cid in partition.items():
        communities[cid].append(node)

    print(f"  发现 {len(communities)} 个社区")

    # 6b. 为每个社区生成摘要
    summaries = {}
    for cid, members in communities.items():
        # 收集社区内所有关系
        rels = []
        for m in members:
            for nb in G.neighbors(m):
                if nb in members:  # 只取社区内部的关系
                    edge = G[m][nb]
                    rels.append(f"{m} --[{edge['relation']}]--> {nb}")
        summary_text = "\n".join(rels[:20])  # 限制长度
        summaries[cid] = summary_text

    # 6c. 向量检索社区摘要
    summary_texts = [summaries[cid] for cid in sorted(communities.keys())]
    if not summary_texts:
        return ""

    s_vecs = model.encode(summary_texts)
    q_vec = model.encode([question])
    sims = np.dot(s_vecs, q_vec.T).flatten()
    top_idx = np.argsort(sims)[-2:][::-1]

    result_parts = []
    for idx in top_idx:
        cid = sorted(communities.keys())[idx]
        members = communities[cid]
        result_parts.append(
            f"[社区 {cid}] 包含实体：{', '.join(members[:10])}\n"
            f"关系摘要：\n{summaries[cid][:500]}"
        )

    return "\n\n".join(result_parts)


# ============================================================
# 7. 主流程
# ============================================================
async def main():
    print("=" * 50)
    print("  Graph RAG 实战 Demo（纯手搓版）")
    print("=" * 50)

    if not LLM_API_KEY:
        print("❌ 请先在 demo/.env 中填入 API Key！")
        return

    # 7a. 读取文档
    files = glob.glob(os.path.join(DATA_DIR, "*.txt"))
    docs = []
    for f in files[:10]:  # 先跑 10 篇
        with open(f, "r", encoding="utf-8") as fh:
            text = fh.read()
        if text.strip():
            docs.append(text.strip()[:2000])

    print(f"\n📄 读取 {len(docs)} 篇文档完成")

    # 7b. 构建知识图谱
    G = await build_graph(docs)

    if G.number_of_nodes() == 0:
        print("❌ 图谱为空，请检查 LLM API 是否正常")
        return

    # 7c. 构建向量索引
    model, nodes, vectors = build_vector_index(G)

    # 7d. 查询演示
    questions = [
        ("local", "什么是 Simple RAG？有哪些 RAG 方案？"),
        ("global", "这些 RAG 方案主要探讨了哪些主题？"),
    ]

    for mode, question in questions:
        print(f"\n{'='*50}")
        print(f"  [{mode.upper()}] 问题：{question}")
        print(f"{'='*50}")

        if mode == "local":
            context = local_search(question, G, model, nodes, vectors)
        else:
            context = global_search(question, G, model, nodes, vectors)

        if not context:
            print("  ⚠️ 检索结果为空")
            continue

        print(f"\n  检索到上下文（{len(context)} chars）：")
        print(f"  {context[:300]}...\n")

        prompt = f"基于以下知识图谱信息回答问题：\n\n{context}\n\n问题：{question}"
        answer = await ask_llm(prompt, "你是一个知识库助手，基于给定的信息回答问题。")
        print(f"  回答：{answer[:400]}")

    print("\n✅ 完成！")


if __name__ == "__main__":
    import sys
    if "--visualize" in sys.argv:
        # 单独跑可视化模式：加载已有图并展示
        import glob, pickle
        cache_file = os.path.join(CACHE_DIR, "graph.pkl")
        if os.path.exists(cache_file):
            with open(cache_file, "rb") as f:
                G = pickle.load(f)
            print(f"加载图谱：{G.number_of_nodes()} 节点, {G.number_of_edges()} 条边")
            visualize(G)
        else:
            print("未找到缓存的图谱，先执行 python main.py 建图")
        sys.exit(0)
    asyncio.run(main())
