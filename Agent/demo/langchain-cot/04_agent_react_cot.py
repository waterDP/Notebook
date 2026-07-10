"""
Agent + CoT（ReAct 模式）— 思维链 × 工具调用
============================================
核心思路：CoT 的推理链 + Tool Use 的动手能力 = ReAct Agent

流程：
  Thought（推理）→ Action（工具）→ Observation（观察）→ Thought（再推理）→ Final Answer

这就是 LangChain Agent 的默认工作方式。
"""

import json
from datetime import datetime
from openai import OpenAI

client = OpenAI(
    api_key="sk-f9267351f70d400d8093668f03eb4ec1",
    base_url="https://api.deepseek.com/v1",
)
MODEL = "deepseek-chat"

# ═══════════════════════════════════════
# 1. 定义工具（Tool）
# ═══════════════════════════════════════

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "查询指定城市的当前天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如 北京、上海、重庆",
                    }
                },
                "required": ["city"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "执行数学计算",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "数学表达式，如 25 * 4 + 10",
                    }
                },
                "required": ["expression"],
            },
        },
    },
]


def get_weather(city: str) -> str:
    """模拟天气查询（真实场景接入 API）"""
    data = {
        "北京": {"temp": 35, "weather": "晴", "humidity": "40%"},
        "上海": {"temp": 32, "weather": "多云", "humidity": "65%"},
        "重庆": {"temp": 38, "weather": "晴", "humidity": "55%"},
        "深圳": {"temp": 33, "weather": "阵雨", "humidity": "80%"},
    }
    info = data.get(city, {"temp": "?", "weather": "未知", "humidity": "?"})
    return json.dumps(info, ensure_ascii=False)


def calculate(expression: str) -> str:
    """执行数学计算"""
    try:
        # 安全计算
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except Exception as e:
        return f"计算错误: {e}"


TOOL_MAP = {"get_weather": get_weather, "calculate": calculate}


# ═══════════════════════════════════════
# 2. ReAct 循环（Agent 核心）
# ═══════════════════════════════════════

SYSTEM_PROMPT = """你是我的智能助手，拥有以下工具：
- get_weather(city): 查询城市天气
- calculate(expression): 数学计算

请按以下格式回应：

【思考】解释你要做什么以及为什么
【行动】{
    "tool": "工具名",
    "params": {参数}
}
【观察】工具返回的结果
【思考】分析观察结果
【行动】...（如果需要更多信息，继续工具调用）
【最终回答】给用户的最终答案

注意：只有当你需要最终回答时才输出「最终回答」。
如果你需要调用工具，就用「思考 + 行动」格式。
"""


def run_agent(user_query: str, max_steps: int = 5) -> str:
    """ReAct Agent 主循环"""
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_query},
    ]

    step_count = 0
    final_answer = None

    while step_count < max_steps and final_answer is None:
        step_count += 1
        print(f"\n{'─'*50}")
        print(f"🔄 Step {step_count}")

        # 调用 LLM（启用 Function Calling）
        resp = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            temperature=0.3,
            max_tokens=1000,
        )

        msg = resp.choices[0].message

        # ── 情况 1：LLM 选择调用工具 ──
        if msg.tool_calls:
            for tc in msg.tool_calls:
                func = tc.function
                name = func.name
                args = json.loads(func.arguments)
                print(f"  🤔 Thought → 调用 {name}({args})")

                # 执行工具
                result = TOOL_MAP[name](**args)
                print(f"  👁️  Observation ← {result}")

                # 把 tool_call \和 tool_result 加入对话历史
                messages.append(msg)  # assistant 的 tool_calls 消息
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "content": result,
                    }
                )

        # ── 情况 2：LLM 直接回复（推理完成） ──
        else:
            content = msg.content or ""
            print(f"  💬 LLM回复:\n{content}")
            # 提取最终答案
            if "最终回答" in content:
                # 取「最终回答」后面的内容
                parts = content.split("最终回答")
                final_answer = parts[-1].strip().lstrip("：:").strip()
            else:
                # 没有最终回答标记，可能是推理过程
                messages.append(msg)

    # 如果达到最大步数还没出答案，强制总结
    if final_answer is None:
        final_answer = "❌ 达到最大推理步数，无法完成。"

    print(f"\n{'='*60}")
    print(f"🏁 最终答案: {final_answer}")
    return final_answer


# ═══════════════════════════════════════
# 3. 测试
# ═══════════════════════════════════════

if __name__ == "__main__":
    print("🌤️ Agent Demo：ReAct = CoT + Tool Use\n")

    # 测试 1：需要多个工具协作
    q1 = "重庆今天天气怎么样？如果体感温度是气温加湿度系数，计算体感温度（假设湿度每10%加1度）"
    print(f"\n📌 任务 1: {q1}")
    run_agent(q1)

    print("\n\n")

    # 测试 2：纯推理
    q2 = "一个三角形三边分别是 3cm、4cm、5cm，求面积（用海伦公式）"
    print(f"📌 任务 2: {q2}")
    run_agent(q2)
