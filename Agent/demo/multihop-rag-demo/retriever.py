import os
from pathlib import Path

DEMO_DIR = Path(__file__).parent
DATA_DIR = DEMO_DIR / "data"
INDEX_DIR = str(DEMO_DIR / "chroma_db")


class Retriever:
    """基于 LangChain 的向量检索器"""

    def __init__(self):
        from langchain_openai import OpenAIEmbeddings
        from langchain_chroma import Chroma

        self.embeddings = OpenAIEmbeddings(
            model="BAAI/bge-small-zh-v1.5",
            openai_api_key="not-needed",
            openai_api_base="http://localhost:8001/v1",
            check_embedding_ctx_length=False,
        )
        self.vectorstore = Chroma(
            collection_name="multihop_rag",
            embedding_function=self.embeddings,
            persist_directory=INDEX_DIR,
        )

    def index_docs(self, filepaths=None):
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        from langchain_core.documents import Document

        if filepaths is None:
            filepaths = sorted(DATA_DIR.glob("*.txt"))
        if not filepaths:
            print("没有找到数据文件")
            return

        docs = []
        for fp in filepaths:
            text = fp.read_text(encoding="utf-8")
            docs.append(Document(
                page_content=text,
                metadata={"source": fp.name, "title": fp.stem},
            ))

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=400,
            chunk_overlap=50,
            separators=["\n\n", "\n", "。", "！", "？", " ", ""],
        )
        chunks = splitter.split_documents(docs)
        print(f"切分为 {len(chunks)} 个文本块")
        self.vectorstore.add_documents(chunks)
        print(f"索引完成")

    def retrieve(self, query, k=3):
        docs = self.vectorstore.similarity_search_with_score(query, k=k)
        results = []
        for doc, score in docs:
            results.append({
                "title": doc.metadata.get("title", "未知"),
                "content": doc.page_content,
                "score": score,
            })
        return results
