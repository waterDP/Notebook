"""
AutoGen 实战 Demo — 研究讨论小组
"""
import asyncio, os
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import SelectorGroupChat
from autogen_agentchat.conditions import TextMentionTermination

# 读key
api_key = ""
with open("E:\\Notebook\\Agent\\.env.local", "r", encoding="utf-8") as f:
    for line in f:
        if line.strip().startswith("deepseek"):
            api_key = line.strip().split()[-1]
            break

MODEL_INFO = {"vision":False,"function_calling":True,"json_output":True,"structured_output":True,"family":"unknown"}
model = OpenAIChatCompletionClient(
    model="deepseek-chat",
    base_url="https://api.deepseek.com/v1",
    api_key=api_key,
    model_info=MODEL_INFO,
)

# Agent
researcher = AssistantAgent(
    "researcher", model,
    system_message="你是技术研究员,负责收集和分析信息。用中文。讨论充分后回复 TERMINATE。",
)
analyst = AssistantAgent(
    "analyst", model,
    system_message="你是分析师,擅长发现信息中的规律。用中文。",
)
summarizer = AssistantAgent(
    "summarizer", model,
    system_message="你负责总结讨论结果,只输出最终结论。用中文。",
)

# 终止条件
termination = TextMentionTermination("TERMINATE")

# 团队(LLM自动选人)
team = SelectorGroupChat(
    [researcher, analyst, summarizer],
    model_client=model,
    max_turns=6,
    termination_condition=termination,
)

async def main():
    print("="*50)
    print("AutoGen Demo 启动")
    print("="*50)
    result = await team.run(task="讨论: CrewAI和AutoGen各有什么特点?开发者该怎么选?")
    print("\n" + "="*50)
    print("完整对话记录:")
    for msg in result.messages:
        src = msg.source
        content = msg.content[:150] if len(msg.content) > 150 else msg.content
        print(f"\n[{src}] {content}")

if __name__ == "__main__":
    asyncio.run(main())
