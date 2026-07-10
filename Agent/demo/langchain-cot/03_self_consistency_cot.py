"""
Self-consistency CoT — 多次采样取众数
======================================
原理：
  1. 对同一个问题跑 N 次 CoT（temperature > 0，带随机性）
  2. 收集 N 个推理结果和答案
  3. 取出现频率最高的答案（majority voting）

优势：比单次 CoT 更稳，减少随机采样带来的波动
代价：成本 ×N（但不需要额外标注数据）
"""

import re
from collections import Counter
from openai import OpenAI

client = OpenAI(
    api_key="sk-f9267351f70d400d8093668f03eb4ec1",
    base_url="https://api.deepseek.com/v1",
)
MODEL = "deepseek-chat"


def run_single_cot(question: str, temperature: float = 0.7) -> str:
    """单次 CoT 采样"""
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": f"{question}\n\n一步一步推理，最后用「答案：XXX」的格式给出最终答案。",
            }
        ],
        temperature=temperature,
        max_tokens=500,
    )
    return resp.choices[0].message.content.strip()


def extract_answer(text: str) -> str | None:
    """从 CoT 输出中提取最终答案"""
    # 匹配「答案：XXX」格式
    m = re.search(r"答案[：:]\s*(.+)", text)
    if m:
        return m.group(1).strip()
    # 如果没有指定格式，取最后一行
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    return lines[-1] if lines else None


def self_consistency_cot(question: str, n: int = 5) -> dict:
    """
    Self-consistency CoT
    - n: 采样次数（默认 5 次）
    - 返回：所有结果 + 众数答案
    """
    results = []
    for i in range(n):
        print(f"  采样 {i+1}/{n}...", end=" ")
        output = run_single_cot(question)
        answer = extract_answer(output)
        results.append({"output": output, "answer": answer})
        print(f"→ 答案: {answer}")

    # 众数投票
    answers = [r["answer"] for r in results if r["answer"]]
    vote = Counter(answers).most_common()

    return {
        "results": results,
        "vote": vote,
        "consensus": vote[0][0] if vote else None,
        "consensus_rate": f"{vote[0][1]}/{n}" if vote else "0",
    }


# ── 测试 ──
if __name__ == "__main__":
    question = "一个水池，甲管单独放需要 6 小时放满，乙管单独放需要 4 小时放满，两管同时开放，几小时放满？"

    print(f"📌 问题: {question}")
    print(f"{'='*60}")
    print(f"\n🔁 Self-consistency CoT（采样 5 次）:\n")

    result = self_consistency_cot(question, n=5)

    print(f"\n{'='*60}")
    print("📊 投票结果:")
    for answer, count in result["vote"]:
        print(f"  「{answer}」— {count} 票")
    print(f"\n🏆 最终答案: {result['consensus']}（{result['consensus_rate']} 一致）")
