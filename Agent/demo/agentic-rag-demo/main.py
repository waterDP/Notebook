from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env")

from retriever import Retriever
from agent import AgenticRAG

def main():
    print("=" * 50)
    print("  Agentic RAG Demo")
    print("=" * 50)
    print("\nBuilding index...")
    retriever = Retriever()

    # 建立向量库
    retriever.index_docs()

    # 创建一个AgenticRAG
    agent = AgenticRAG(retriever)
    test_qs = [
        "What is Rerank? How is it different from Embedding?",
        "What types of RAG methods exist?",
        "Write a short poem about spring.",
    ]
    for q in test_qs:
        print("\n" + "=" * 50)
        print("Q: " + q)
        print("=" * 50)
        result = agent.ask(q)
        print("\nFinal answer:\n" + result)
    print("\n" + "=" * 50)
    print("Interactive mode (q to quit)")
    print("=" * 50)
    while True:
        q = input("\n> ").strip()
        if q.lower() in ("q", "quit", "exit"):
            break
        if not q:
            continue
        result = agent.ask(q)
        print("\n" + result)    

if __name__ == "__main__":
    main()