"""
CrewAI 实战 Demo — 技术调研→写作流水线
"""
import os

# 先设环境变量（CrewAI 从这里读）
with open("E:\\Notebook\\Agent\\.env.local", "r", encoding="utf-8") as f:
    for line in f:
        if line.strip().startswith("deepseek"):
            key = line.strip().split()[-1]
            os.environ["DEEPSEEK_API_KEY"] = key
            os.environ["OPENAI_API_BASE"] = "https://api.deepseek.com"
            break

from crewai import Agent, Task, Crew, Process
from crewai.tools import tool

# ===== 工具 =====
@tool("search_knowledge")
def search_knowledge(query: str) -> str:
    """搜索知识库获取信息"""
    kb = {
        "LangGraph": "LangGraph是LangChain的图状态编排框架,支持条件分支、循环、并行。当前版本1.2.4。",
        "CrewAI": "CrewAI是多Agent协作框架,Agent/Task/Crew三个核心概念,版本1.15.2。",
    }
    for k, v in kb.items():
        if k in query or query in k:
            return v
    return f"没有找到相关信息。"

# ===== Agent =====
searcher = Agent(
    role="技术调研员",
    goal="收集准确的技术信息",
    backstory="你有10年技术调研经验,擅长快速找到核心信息。",
    tools=[search_knowledge],
    verbose=True,
    llm="deepseek/deepseek-chat",
)

writer = Agent(
    role="技术作者",
    goal="写出清晰易懂的技术文章",
    backstory="你擅长把复杂技术讲简单。",
    verbose=True,
    llm="deepseek/deepseek-chat",
)

# ===== Task =====
t1 = Task(
    description="调研 CrewAI 和 LangGraph 的核心区别",
    expected_output="一份300字以内的对比分析,包含3个核心差异点",
    agent=searcher,
)

t2 = Task(
    description="基于调研结果写一篇对比短文",
    expected_output="200字左右的对比文章",
    agent=writer,
    context=[t1],
)

# ===== Crew =====
crew = Crew(
    agents=[searcher, writer],
    tasks=[t1, t2],
    process=Process.sequential,
    verbose=True,
)

if __name__ == "__main__":
    print("\n" + "="*50)
    print("CrewAI Demo 启动")
    print("="*50 + "\n")
    result = crew.kickoff()
    print("\n" + "="*50)
    print("最终结果:")
    print("-"*50)
    print(result.raw)
