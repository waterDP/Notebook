"""
Zero-shot CoT — 最简单的思维链
==============================
原理：在 prompt 末尾加一句 "Let's think step by step"
      模型就会把推理过程写出来再给出答案

对比：分别跑 直接回答 vs CoT，看效果差别
"""

from openai import OpenAI

# ── 配置 DeepSeek（兼容 OpenAI API） ──
client = OpenAI(
    api_key="sk-f9267351f70d400d8093668f03eb4ec1",
    base_url="https://api.deepseek.com/v1",
)
MODEL = "deepseek-chat"

# ── 测试问题（需要多步推理） ──
questions = [
    "一个工厂有 3 条生产线，每条每小时生产 120 个零件。如果每天开工 8 小时，一个月（22 个工作日）能生产多少个零件？",
    "小明和小红一共 36 岁，小明比小红大 4 岁，问两人各多少岁？",
    "如果 6 个工人 8 天能挖一条 240 米长的沟，那么 9 个工人 12 天能挖多长的沟？",
]


def ask_direct(question: str) -> str:
    """❌ 直接问（无 CoT）"""
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": question}],
        temperature=0,
        max_tokens=200,
    )
    return resp.choices[0].message.content.strip()


def ask_cot(question: str) -> str:
    """✅ Zero-shot CoT（加一句咒语）"""
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": f"{question}\n\n请一步一步推理，最后给出最终答案。",
            }
        ],
        temperature=0,
        max_tokens=500,
    )
    return resp.choices[0].message.content.strip()


# ── 对比测试 ──
if __name__ == "__main__":
    for i, q in enumerate(questions, 1):
        print(f"{'='*60}")
        print(f"📌 问题 {i}: {q}")
        print(f"{'='*60}")

        print("\n❌ 直接回答:")
        direct = ask_direct(q)
        print(direct)

        print("\n✅ Zero-shot CoT:")
        cot = ask_cot(q)
        print(cot)

        print()
