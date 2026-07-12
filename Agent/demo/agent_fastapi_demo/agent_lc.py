"""
Agent 核心逻辑 — LangChain 版本
"""
import os
from langchain_openai import ChatOpenAI
from langchain.agents import create_react_agent, AgentExecutor
from langchain.agents import Tool
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory

# 读 API key
api_key = ""
with open("E:\\Notebook\\Agent\\.env.local", "r", encoding="utf-8") as f:
    for line in f:
        if line.strip().startswith("deepseek"):
            api_key = line.strip().split()[-1]
            break
if not api_key:
    api_key = os.environ.get("DEEPSEEK_API_KEY", "")

# ===== LLM =====
llm = ChatOpenAI(
    model="deepseek-chat",
    api_key=api_key,
    base_url="https://api.deepseek.com",
    temperature=0.3
)

# ===== 知识库 =====
KB = {
    "Chroma默认距离": "Chroma默认使用L2距离,文本检索推荐改成Cosine。metadata里设置hnsw:space='cosine'即可。",
    "FAISS索引类型": "FAISS支持Flat(暴力)、IVF(分桶)、HNSW(图索引)、PQ(量化)。HNSW是精度和速度的平衡之王。",
    "ReAct是什么": "ReAct = Reasoning + Acting。LLM在思考(Thought)和行动(Action)之间循环,直到能回答。",
    "水哥": "水哥是四川人,坐标重庆,前端技术背景,正在自学Agent开发转型,目标2026年9月前找到Agent开发工作。",
    "LangGraph": "LangGraph是LangChain推出的图状态编排框架,支持条件分支、循环、并行。",
}

def search_knowledge(query: str) -> str:
    """检索知识库"""
    for k, v in KB.items():
        if any(c in k for c in query):
            return v
    return "没有找到相关信息。"

# ===== 工具 =====
tools = [
    Tool(
        name="search_knowledge",
        func=search_knowledge,
        description="检索知识库,参数query是搜索关键词。当你需要查找知识时使用。"
    )
]

# ===== Agent =====
PROMPT_TEMPLATE = """你是一个知识问答助手。用中文回答。

你有以下工具可以使用:
{tools}

使用格式:
Question: 用户的输入
Thought: 思考是否需要工具
Action: 工具名称
Action Input: 工具的输入
Observation: 系统返回的结果
...（可以重复多轮）...
Thought: 我现在知道答案了
Final Answer: 最终回答

{agent_scratchpad}"""

prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)

agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)

def chat(question: str, history: list | None = None) -> str:
    """LangChain Agent 对话"""
    # 使用 ConversationBufferMemory 处理历史
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    if history:
        for msg in history:
            if msg["role"] == "user":
                memory.chat_memory.add_user_message(msg["content"])
            else:
                memory.chat_memory.add_ai_message(msg["content"])

    executor = AgentExecutor(
        agent=agent,
        memory=memory,
        verbose=False,
        max_iterations=3,
        handle_parsing_errors=True,
    )

    result = executor.invoke({"input": question})
    return result["output"]
 