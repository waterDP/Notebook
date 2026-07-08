# -*- coding: utf-8 -*-
"""GraphRAG Demo 配置 — 从上级 .env 读取"""
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

LLM_TYPE = os.getenv("LLM_TYPE", "deepseek")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.deepseek.com/v1")

# 注入 GraphRAG 需要的环境变量（避免 settings.yaml 明文写 key）
os.environ.setdefault("GRAPHRAG_API_KEY", LLM_API_KEY)
