import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env")

from retriever import Retriever
from agent import MultiHopRAG


def main():
    print("=" * 50)
    print("  🔄 LangChain 多步检索 Demo")
    print("=" * 50)

    print("\n📚 建索引中...")
    retriever = Retriever()
    retriever.index_docs()

    agent = MultiHopRAG(retriever)

    test_questions = [
        "Rerank 和 Embedding 有什么区别？它们在 RAG 中分别起什么作用？",
    ]

    for q in test_questions:
        print(f"\n{'=' * 50}")
        print(f"❓ {q}")
        print(f"{'=' * 50}")
        result = agent.ask(q)
        print(f"\n📝 最终回答:\n{result}")

    print(f"\n{'=' * 50}")
    print("💬 交互模式（输入 q 退出）")
    print(f"{'=' * 50}")
    while True:
        q = input("\n> ").strip()
        if q.lower() in ("q", "quit", "exit"):
            break
        if not q:
            continue
        result = agent.ask(q)
        print(f"\n{result}")

if __name__ == "__main__":
    main()
