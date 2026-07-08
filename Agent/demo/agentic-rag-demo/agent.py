import os, json, datetime, math
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

from retriever import Retriever


# ── 工具定义 ──

RETRIEVE_TOOL = {
    "type": "function",
    "function": {
        "name": "retrieve",
        "description": "从知识库中检索与问题相关的信息。当问题涉及特定技术、概念、知识时使用。",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "检索的关键词或问题，尽量清晰具体",
                }
            },
            "required": ["query"],
        },
    },
}

TIME_TOOL = {
    "type": "function",
    "function": {
        "name": "get_time",
        "description": "获取当前的日期和时间",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
}

CALC_TOOL = {
    "type": "function",
    "function": {
        "name": "calculator",
        "description": "执行数学计算。支持四则运算、平方根、幂运算、三角函数等",
        "parameters": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "要计算的数学表达式，如 '3.14 ** 2' 或 'sqrt(144)' 或 'sin(30)'",
                }
            },
            "required": ["expression"],
        },
    },
}

ALL_TOOLS = [RETRIEVE_TOOL, TIME_TOOL, CALC_TOOL]


class AgenticRAG:
    def __init__(self, retriever):
        self.retriever = retriever
        self.client = OpenAI(
            api_key=os.getenv("LLM_API_KEY"),
            base_url=os.getenv("LLM_BASE_URL", "https://api.deepseek.com/v1"),
        )
        self.model = os.getenv("LLM_MODEL", "deepseek-chat")
        self.max_steps = 5

    def _execute_tool(self, tool_call):
        """根据工具调用请求执行对应的工具，返回结果文本"""
        name = tool_call.function.name
        args = json.loads(tool_call.function.arguments)

        if name == "retrieve":
            query_text = args.get("query", "")
            docs = self.retriever.retrieve(query_text, k=3)
            result = "\n\n".join(
                [f"来源 [{d['title']}]：{d['content']}" for d in docs]
            )
            print(f"    🔍 retrieve(query='{query_text}') → {len(docs)} 篇")
            return result

        elif name == "get_time":
            now = datetime.datetime.now()
            result = now.strftime("%Y年%m月%d日 %H:%M:%S 星期%w")
            # 星期转换
            week_map = {"0": "日", "1": "一", "2": "二", "3": "三",
                        "4": "四", "5": "五", "6": "六"}
            for k, v in week_map.items():
                result = result.replace(f"星期{k}", f"星期{v}")
            print(f"    🕐 get_time() → {result}")
            return result

        elif name == "calculator":
            expr = args.get("expression", "")
            # 安全执行数学表达式
            allowed_names = {
                k: v for k, v in math.__dict__.items()
                if not k.startswith("_")
            }
            allowed_names.update({"abs": abs, "round": round, "int": int, "float": float})
            try:
                val = eval(expr, {"__builtins__": {}}, allowed_names)
                result = f"{expr} = {val}"
            except Exception as e:
                result = f"计算错误: {e}"
            print(f"    🧮 calculator({expr}) → {result}")
            return result

        return f"未知工具: {name}"

    def ask(self, query):
        messages = [
            {
                "role": "system",
                "content": (
                    "你是一个智能助手，可以调用工具来获取信息。\n\n"
                    "可用工具：\n"
                    "- retrieve：检索知识库中的文档信息，适合技术、概念类问题\n"
                    "- get_time：获取当前时间，适合时间日期类问题\n"
                    "- calculator：执行数学计算，适合数学类问题\n\n"
                    "规则：\n"
                    "1. 根据需要选择最合适的工具\n"
                    "2. 如果不需要任何工具（如写诗、闲聊），直接回答\n"
                    "3. 不确定是否需要检索时，优先检索\n"
                    "4. 一次可以调用多个工具"
                ),
            },
            {"role": "user", "content": query},
        ]

        last_content = ""
        for step in range(self.max_steps):
            print(f"\n  [Step {step + 1}]")
            print(f"    🤔 LLM 思考中...")

            resp = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=ALL_TOOLS,
                tool_choice="auto",
                temperature=0,
            )

            msg = resp.choices[0].message

            if msg.tool_calls:
                messages.append(msg)
                for tc in msg.tool_calls:
                    tool_result = self._execute_tool(tc) # 执行工具
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "content": tool_result,
                    })
            else:
                print(f"    💬 直接回答")
                return msg.content

        final_resp = self.client.chat.completions.create(
            model=self.model, messages=messages, temperature=0,
        )
        return final_resp.choices[0].message.content
