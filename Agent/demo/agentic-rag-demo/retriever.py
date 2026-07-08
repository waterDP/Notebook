import os
from pathlib import Path

DEMO_DIR = Path(__file__).parent
DATA_DIR = DEMO_DIR / "data"
INDEX_DIR = DEMO_DIR / "chroma_db"


class Retriever:
    def __init__(self, model_name="BAAI/bge-small-zh-v1.5"):
        self.model_name = model_name
        self._model = None
        self._db = None

    def _get_model(self):
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name, local_files_only=True)
        return self._model

    def _get_db(self):
        if self._db is None:
            import chromadb
            client = chromadb.PersistentClient(str(INDEX_DIR))
            self._db = client.get_or_create_collection("agentic_rag")
        return self._db

    def index_docs(self, filepaths=None):
        if filepaths is None:
            filepaths = sorted(DATA_DIR.glob("*.txt"))
        if not filepaths:
            print("No data files found")
            return
        all_chunks, all_ids, all_metas = [], [], []
        for fp in filepaths:
            text = fp.read_text(encoding="utf-8")
            title = fp.stem
            for pi, para in enumerate(text.split("\n\n")):
                para = para.strip()
                if not para or len(para) < 10:
                    continue
                if len(para) > 500:  # 大于500做切版处理
                    chunks = [para[i:i+500] for i in range(0, len(para), 500)]
                else:
                    chunks = [para]
                for ci, chunk in enumerate(chunks):
                    chunk = chunk.strip()
                    if len(chunk) < 10:
                        continue
                    all_chunks.append(chunk)
                    all_ids.append(f"{title}_{pi}_{ci}")
                    all_metas.append({"title": title})

        model = self._get_model()
        print("Vectorizing {} chunks...".format(len(all_chunks)))
        embeddings = model.encode(all_chunks, normalize_embeddings=True).tolist()
        db = self._get_db()
        try:
            db.delete(where={})
        except Exception:
            pass
        db.add(documents=all_chunks, embeddings=embeddings, ids=all_ids, metadatas=all_metas)
        print("Index done: {} entries".format(db.count()))

    def retrieve(self, query, k=3):
        model = self._get_model()
        # 查询问题向量处理
        # normalize_embeddings=True: 向量标准化，让向量长度变成 1。
        q_vec = model.encode([query], normalize_embeddings=True)[0].tolist()
        db = self._get_db()
        results = db.query(query_embeddings=[q_vec], n_results=k)

        docs = []
        for i in range(len(results["documents"][0])):
            score = results["distances"][0][i] if results.get("distances") else 0
            docs.append({"title": results["metadatas"][0][i]["title"], "content": results["documents"][0][i], "score": score})
        return docs
