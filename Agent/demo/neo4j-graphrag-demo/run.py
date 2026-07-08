#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GraphRAG 运行包装器
====================
加载 .env 中的 API Key 到环境变量后，再执行 graphrag 命令。
这样 settings.yaml 里的 ${GRAPHRAG_API_KEY} 就能正确解析，
同时 API Key 不会明文暴露在配置文件中。

用法：
  python run.py index                 # 等同 graphrag index
  python run.py query "问题" --method local
  python run.py init --force
  python run.py --help
"""

import os, sys, subprocess
from pathlib import Path

# 加载 .env（上级目录 demo/.env）
from dotenv import load_dotenv
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# 注入 GraphRAG 需要的环境变量
os.environ.setdefault("GRAPHRAG_API_KEY", os.getenv("LLM_API_KEY", ""))

if not os.environ["GRAPHRAG_API_KEY"]:
    print("⚠️  警告: GRAPHRAG_API_KEY 未设置，请在 demo/.env 中配置 LLM_API_KEY")
    sys.exit(1)

# 转发到 graphrag CLI
sys.argv[0] = "graphrag"
result = subprocess.run(
    [sys.executable, "-m", "graphrag"] + sys.argv[1:],
    cwd=Path(__file__).parent,
)
sys.exit(result.returncode)
