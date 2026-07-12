"""
ReAct RAG Demo —— 带思考-行动闭环的检索问答
"""
import os
import re
from openai import OpenAI

# 从 .env.local 读 API key（不提交到 git）
def get_deepseek_key():
    with open(os.path.expanduser("E:\\Notebook\\Agent\\.env.local"), "r", encoding="utf-8") as f:
        for line in f:
            if line.strip().startswith("deepseek"):
                return line.strip().split()[-1]
    return os.environ.get("DEEPSEEK_API_KEY", "")

DEEPSEEK_KEY = get_deepseek_key()

# ===== 1. 知识库 =====
KNOWLEDGE_BASE = {
    "重庆火锅底料配方": "重庆火锅底料以牛油为主,配以花椒、干辣椒、豆瓣、豆豉、冰糖、醪糟等。",
    "水哥是谁": "水哥是四川人,坐标重庆,前端技术背景,正在自学Agent开发转型,2026年9月前目标找到Agent开发工作。",
    "LangGraph是什么": "LangGraph是LangChain推出的图状态编排框架,支持条件分支、循环、并行。",
    "FAISS索引类型": "FAISS支持Flat(暴力)、IVF(分桶)、HNSW(图索引)、PQ(量化压缩)等。HNSW是精度和速度的平衡之王。",
    "Chroma默认距离": "Chroma默认使用L2距离,文本检索推荐改为Cosine。metadata设置hnsw:space='cosine'即可。",
}

# ===== 2. 初始化 LLM =====
llm = OpenAI(
    api_key=DEEPSEEK_KEY,
    base_url="https://api.deepseek.com"
)

def search_knowledge(query: str) -> str:
    """检索知识库——关键词匹配"""
    results = []
    for key, val in KNOWLEDGE_BASE.items():
        if any(char in key for char in query):
            results.append(f"[{key}] {val}")
    return "\n".join(results[:2]) if results else "没有找到相关信息。"

# ===== 3. ReAct Prompt =====
REACT_PROMPT = """你是一个知识问答助手。你可以使用以下工具来查找信息：

工具: search_knowledge(query) — 检索知识库,参数query是搜索关键词

请按照以下格式回答：

Question: 用户的问题
Thought: 思考当前情况,判断是否需要检索
Action: search_knowledge 或 如果已经知道答案就写 Final Answer
Action Input: 搜索关键词（如果是Final Answer就填空）
Observation: 检索结果（系统填充）

...（可以重复 Thought/Action/Observation 多轮）...
Thought: 我现在知道答案了
Final Answer: 最终回答

注意：
- 每次只能做一个 Action
- 如果检索结果不够,可以重新搜索
- 最多尝试 3 次检索
- 用中文回复

Question: {question}
Thought:"""

def extract_action(response: str) -> dict:
    """从 LLM 输出中解析 action"""
    if "Final Answer:" in response:
        answer = response.split("Final Answer:")[-1].strip()
        return {"type": "answer", "content": answer}

    action_match = re.search(r"Action:\s*(.+)", response)
    input_match = re.search(r"Action Input:\s*(.+)", response)

    if action_match:
        action = action_match.group(1).strip()
        action_input = input_match.group(1).strip() if input_match else ""
        return {"type": "tool", "name": action, "input": action_input}

    return {"type": "unknown", "content": response}

# ===== 4. ReAct 循环 =====
def react_rag(question: str, max_iterations: int = 5) -> str:
    messages = [
        {"role": "system", "content": "你是一个知识问答助手,使用中文回答。"},
        {"role": "user", "content": REACT_PROMPT.format(question=question)}
    ]

    print(f"\n{'='*50}")
    print(f"问题: {question}")
    print(f"{'='*50}\n")

    for i in range(max_iterations):
        response = llm.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=0.3,
            max_tokens=500
        )
        llm_output = response.choices[0].message.content
        print(f"--- 第 {i+1} 轮 LLM ---")
        print(llm_output)

        decision = extract_action(llm_output)

        if decision["type"] == "answer":
            print(f"\n答案: {decision['content']}")
            return decision["content"]

        elif decision["type"] == "tool":
            print(f"\n执行工具: {decision['name']}({decision['input']})")
            observation = search_knowledge(decision["input"])
            print(f"观察: {observation[:100]}...")

            messages.append({"role": "assistant", "content": llm_output})
            messages.append({"role": "user", "content": f"Observation: {observation}\n\n继续。如果信息足够就写 Final Answer。"})
        else:
            messages.append({"role": "assistant", "content": llm_output})
            messages.append({"role": "user", "content": "请严格按照格式重新回答。"})

    print("达到最大迭代次数")
    return "抱歉,无法回答该问题。"

# ===== 5. 演示 =====
if __name__ == "__main__":
    for q in ["水哥是什么背景？", "重庆火锅底料怎么配？"]:
        react_rag(q)
        print("\n" + "="*50)
