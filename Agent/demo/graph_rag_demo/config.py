# -*- coding: utf-8 -*-
"""
Graph RAG 实战 — 配置文件
=======================
环境变量从上级目录的 .env 文件读取。
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# 读取共享 .env（在 demo/ 根目录）
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

LLM_TYPE = os.getenv("LLM_TYPE", "deepseek")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.deepseek.com/v1")

EMBEDDING_MODEL = "shibing624/text2vec-base-chinese"

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
