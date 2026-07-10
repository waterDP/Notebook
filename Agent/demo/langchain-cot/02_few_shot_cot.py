"""
Few-shot CoT — 给推理范例引导模型
===================================
原理：在 prompt 里放 2-3 个带完整推理过程的例子
      模型会模仿这种"推理 → 答案"的模式

优势：比 Zero-shot 更稳，适合特定领域的推理任务
"""

from openai import OpenAI

client = OpenAI(
    api_key="sk-f9267351f70d400d8093668f03eb4ec1",
    base_url="https://api.deepseek.com/v1",
)
MODEL = "deepseek-chat"


def build_fewshot_prompt(question: str) -> str:
    """组装 Few-shot CoT prompt"""

    examples = """
【例 1】
问：小明有 5 个苹果，又买了 3 个，吃掉 2 个，还剩几个？
推理：小明开始有 5 个苹果。买了 3 个后，5 + 3 = 8 个。吃掉 2 个后，8 - 2 = 6 个。
答：6 个。

【例 2】
问：一个长方形长 12 米，宽 8 米，周长和面积各是多少？
推理：长方形周长 = 2 × (长 + 宽) = 2 × (12 + 8) = 2 × 20 = 40 米。
长方形面积 = 长 × 宽 = 12 × 8 = 96 平方米。
答：周长 40 米，面积 96 平方米。

【例 3】
问：一本书 240 页，第一天看了 1/4，第二天看了剩下的 1/3，第三天看完，第三天看了多少页？
推理：第一天看了 240 × 1/4 = 60 页，剩下 240 - 60 = 180 页。
第二天看了 180 × 1/3 = 60 页，剩下 180 - 60 = 120 页。
所以第三天看了 120 页。
答：120 页。

--- 下面是你要回答的问题 ---
"""

    return f"{examples}\n问：{question}\n推理："


def ask_fewshot_cot(question: str) -> str:
    prompt = build_fewshot_prompt(question)
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=500,
    )
    return resp.choices[0].message.content.strip()


# ── 测试：Few-shot vs Zero-shot ──
def ask_zeroshot_cot(question: str) -> str:
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


if __name__ == "__main__":
    questions = [
        "小明期末考试语文 85 分，数学比语文高 10 分，英语比数学低 5 分，三门平均分是多少？",
        "一根绳子对折 3 次后，每段长 15 厘米，绳子原来多长？",
    ]

    for i, q in enumerate(questions, 1):
        print(f"{'='*60}")
        print(f"📌 问题 {i}: {q}")
        print(f"{'='*60}")

        print("\n🔄 Zero-shot CoT:")
        print(ask_zeroshot_cot(q))

        print("\n📚 Few-shot CoT:")
        print(ask_fewshot_cot(q))

        print()
