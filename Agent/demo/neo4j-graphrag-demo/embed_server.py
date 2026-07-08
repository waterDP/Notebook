#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
本地 Embedding 服务 — OpenAI 兼容接口
=====================================
为 GraphRAG 提供本地 embedding 能力（因为 DeepSeek 没有 embedding API）

用法：
  1. 启动服务：
     python embed_server.py

  2. GraphRAG settings.yaml 里配：
     embedding_models:
       default_embedding_model:
         model_provider: openai
         model: BAAI/bge-small-zh-v1.5
         api_base: http://localhost:8001/v1
         api_key: not-needed

  3. 然后正常跑 graphrag index / query

首次启动会自动下载模型（BAAI/bge-small-zh-v1.5 ~ 133MB），之后秒起。
"""

import os, sys, time
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import uvicorn

# ── 配置 ──
MODEL_NAME = os.getenv("EMBED_MODEL", "BAAI/bge-small-zh-v1.5")
HOST = os.getenv("EMBED_HOST", "0.0.0.0")
PORT = int(os.getenv("EMBED_PORT", "8001"))
BATCH_SIZE = 32

app = FastAPI(title="Local Embedding Server")

# ── 请求/响应模型 ──
class EmbedRequest(BaseModel):
    model: str
    input: str | list[str]

class Embedding(BaseModel):
    object: str = "embedding"
    index: int
    embedding: list[float]

class Usage(BaseModel):
    prompt_tokens: int
    total_tokens: int

class EmbedResponse(BaseModel):
    object: str = "list"
    data: list[Embedding]
    model: str
    usage: Usage

# ── 加载模型 ──
print(f"🚀 加载模型: {MODEL_NAME}...")
t0 = time.time()
model = SentenceTransformer(MODEL_NAME)
print(f"✅ 模型加载完成 ({time.time()-t0:.1f}s)")
DIM = model.get_sentence_embedding_dimension()
print(f"  维度: {DIM}")

@app.get("/v1/models")
async def list_models():
    return {
        "object": "list",
        "data": [{"id": MODEL_NAME, "object": "model"}]
    }

@app.post("/v1/embeddings")
async def embed(req: EmbedRequest):
    texts = [req.input] if isinstance(req.input, str) else req.input
    n = len(texts)

    # 分批处理，避免 OOM
    all_embeddings = []
    for i in range(0, n, BATCH_SIZE):
        batch = texts[i:i+BATCH_SIZE]
        emb = model.encode(batch, normalize_embeddings=True, show_progress_bar=False)
        all_embeddings.extend(emb.tolist())

    data = [
        Embedding(index=i, embedding=emb)
        for i, emb in enumerate(all_embeddings)
    ]

    # 粗略 token 计数（中文字符算 1 token）
    total_chars = sum(len(t) for t in texts)

    return EmbedResponse(
        data=data,
        model=req.model,
        usage=Usage(prompt_tokens=total_chars, total_tokens=total_chars),
    )

if __name__ == "__main__":
    print(f"\n🌐 Embedding 服务已启动: http://{HOST}:{PORT}")
    print(f"   API: POST http://localhost:{PORT}/v1/embeddings")
    print(f"   模型: {MODEL_NAME}")
    print(f"   维度: {DIM}")
    print(f"\n按 Ctrl+C 停止\n")
    uvicorn.run(app, host=HOST, port=PORT, log_level="warning")
