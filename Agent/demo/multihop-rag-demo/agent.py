import os, json
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

from retriever import Retriever
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage


class MultiHopRAG:
    def __init__(self, retriever):
        self.retriever = retriever
        self.llm = ChatOpenAI(
            model=os.getenv("LLM_MODEL", "deepseek-chat"),
            api_key=os.getenv("LLM_API_KEY"),
            base_url=os.getenv("LLM_BASE_URL", "https://api.deepseek.com/v1"),
            temperature=0,
        )
        self.max_steps = 5

    def _get_tools(self):
        return [
            {
                "type": "function",
                "function": {
                    "name": "retrieve",
                    "description": "从知识库中检索相关信息。如果信息不够详细，可以再次检索，每次用不同的关键词。",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "这次要检索的关键词或问题"
                            }
                        },
                        "required": ["query"]
                    }
                }
            }
        ]

    def ask(self, query):
        llm_with_tools = self.llm.bind_tools(self._get_tools())

        messages = [
            SystemMessage(content=(
                "你是多步检索助手。工作流程：\n"
                "1. 收到问题后先判断是否需要检索\n"
                "2. 如果需要就调 retrieve 工具获取信息\n"
                "3. 信息够了就直接回答（不需要调任何工具）\n"
                "规则：不确定是否需要检索时，优先检索。回答要完整，基于检索结果。"
            )),
            HumanMessage(content=query),
        ]

        for step in range(self.max_steps):
            print(f"\n  [Step {step + 1}]")
            resp = llm_with_tools.invoke(messages)
            messages.append(resp)

            if not resp.tool_calls:
                print(f"  [Step {step + 1}] 信息足够，生成回答")
                return resp.content

            for tc in resp.tool_calls:
                if tc["name"] == "retrieve":
                    args = json.loads(tc["args"])
                    q = args.get("query", query)
                    docs = self.retriever.retrieve(q, k=3)
                    result = "\n\n".join(
                        [f"[来源 {d['title']}] {d['content']}" for d in docs]
                    )
                    print(f"  [Step {step + 1}] 检索: {q} -> {len(docs)} 条")

                    messages.append(ToolMessage(
                        content=result if result else "没有找到相关信息",
                        tool_call_id=tc["id"],
                    ))

        final = llm_with_tools.invoke(messages + [
            HumanMessage(content="基于所有检索结果给出完整回答")
        ])
        return final.content
