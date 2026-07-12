"""
Query Decomposition Demo —— 查询分解
复杂问题拆成子问题分别检索,再综合回答
"""
import os
import re
from openai import OpenAI

# 从 .env.local 读 API key
def get_deepseek_key():
    with open(os.path.expanduser("E:\\Notebook\\Agent\\.env.local"), "r", encoding="utf-8") as f:
        for line in f:
            if line.strip().startswith("deepseek"):
                return line.strip().split()[-1]
    return os.environ.get("DEEPSEEK_API_KEY", "")

# ===== 1. 知识库 =====
KNOWLEDGE = {
    "LangGraph是什么": "LangGraph是LangChain推出的图状态编排框架,支持条件分支、循环、并行。",
    "CrewAI是什么": "CrewAI是多Agent协作框架,每个Agent有独立角色和工具,通过任务编排协作。",
    "AutoGen是什么": "AutoGen是微软推出的多Agent对话框架,支持Agent间自动对话和任务分配。",
    "CrewAI特点": "CrewAI特点:角色分工明确,任务编排清晰,易于理解和上手。",
    "LangGraph特点": "LangGraph特点:状态图驱动,适合复杂workflow,与LangChain生态无缝集成。",
    "AutoGen特点": "AutoGen特点:多Agent对话为核心,支持人机协作,灵活性强。",
}

# ===== 2. LLM =====
llm = OpenAI(
    api_key=get_deepseek_key(),
    base_url="https://api.deepseek.com"
)

def search(query: str) -> list[str]:
    """简单关键词检索"""
    results = []
    for key, val in KNOWLEDGE.items():
        if all(w in key for w in query.split()):
            results.append(val)
    return results if results else ["没有找到相关信息。"]

# ===== 3. Query Decomposition =====
DECOMPOSE_PROMPT = """你是一个问题分析专家。请将用户的问题拆解成多个独立的子问题,每个子问题可以直接检索知识库。

要求:
- 每个子问题只问一个具体方面
- 子问题之间不要重叠
- 用数字列表输出,每行一个

问题: {question}
子问题:"""

SYNTHESIS_PROMPT = """你是一个回答综合专家。基于以下检索到的信息,综合回答用户的问题。

用户问题: {question}

检索到的信息:
{search_results}

请综合所有信息,给出一个完整的回答:"""

def query_decomposition(question: str) -> str:
    # Step 1: LLM 拆解问题
    resp = llm.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": DECOMPOSE_PROMPT.format(question=question)}],
        temperature=0.3
    )
    sub_queries = resp.choices[0].message.content.strip()
    print(f"\n📌 原问题: {question}")
    print(f"🔨 LLM 拆解:\n{sub_queries}\n")

    # Step 2: 分别检索
    sub_lines = [l for l in sub_queries.split("\n") if l.strip() and not l.strip().startswith("子问题")]
    all_results = []
    for line in sub_lines:
        q = re.sub(r"^\d+[\.、]\s*", "", line).strip()
        if not q:
            continue
        results = search(q)  # 检索
        all_results.append(f"【{q}】\n" + "\n".join(results))
        print(f"🔍 检索: {q}")
        for r in results:
            print(f"   → {r[:50]}...")

    # Step 3: 综合回答
    combined = "\n\n".join(all_results)
    resp = llm.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": SYNTHESIS_PROMPT.format(
            question=question, search_results=combined
        )}],
        temperature=0.3
    )
    answer = resp.choices[0].message.content
    print(f"\n💡 综合回答:\n{answer}")
    return answer

if __name__ == "__main__":
    query_decomposition("LangGraph、CrewAI、AutoGen 三者的区别？")
