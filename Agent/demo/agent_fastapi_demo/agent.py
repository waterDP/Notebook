"""
Agent 核心逻辑
"""
import os
import re
from openai import OpenAI

# 读 API key
api_key = ""
with open("E:\\Notebook\\Agent\\.env.local", "r", encoding="utf-8") as f:
    for line in f:
        if line.strip().startswith("deepseek"):
            api_key = line.strip().split()[-1]
            break
if not api_key:
    api_key = os.environ.get("DEEPSEEK_API_KEY", "")

llm = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

# 知识库
KB = {
    "Chroma默认距离": "Chroma默认使用L2距离,文本检索推荐改成Cosine。metadata里设置hnsw:space='cosine'即可。",
    "FAISS索引类型": "FAISS支持Flat(暴力)、IVF(分桶)、HNSW(图索引)、PQ(量化)。HNSW是精度和速度的平衡之王。",
    "ReAct是什么": "ReAct = Reasoning + Acting。LLM在思考(Thought)和行动(Action)之间循环,直到能回答。",
    "水哥": "水哥是四川人,坐标重庆,前端技术背景,正在自学Agent开发转型,目标2026年9月前找到Agent开发工作。",
    "LangGraph": "LangGraph是LangChain推出的图状态编排框架,支持条件分支、循环、并行。",
}

REACT_PROMPT = """你是知识助手。可用工具:

search_knowledge(query) — 检索知识库

格式:
Question: 问题
Thought: 思考
Action: search_knowledge 或 Final Answer
Action Input: 搜索词
Observation: 结果（系统填充）

最多2轮检索。用中文。

Question: {question}
Thought:"""

def search(q: str) -> str:
    for k, v in KB.items():
        if any(c in k for c in q):
            return v
    return "没找到相关信息。"

def chat(question: str, history: list | None = None) -> str:
    messages = [{"role": "system", "content": "你是一个知识问答助手。"}]
    if history:
        for h in history:
            messages.append(h)
    messages.append({"role": "user", "content": REACT_PROMPT.format(question=question)})

    for _ in range(3):
        resp = llm.chat.completions.create(model="deepseek-chat", messages=messages, temperature=0.3)
        out = resp.choices[0].message.content
        if "Final Answer:" in out:
            return out.split("Final Answer:")[-1].strip()
        m = re.search(r"Action:\s*(.+)\nAction Input:\s*(.+)", out)
        if m:
            obs = search(m.group(2).strip())
            messages.append({"role": "assistant", "content": out})
            messages.append({"role": "user", "content": f"Observation: {obs}\n\n继续。"})
    return "抱歉,无法回答。"
