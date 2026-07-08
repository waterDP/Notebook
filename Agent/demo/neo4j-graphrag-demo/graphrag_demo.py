#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GraphRAG (Microsoft v3.1.0) 可运行测试用例
==========================================
两种测试模式：

  python graphrag_demo.py cli          # 方式一：CLI 命令行方式
  python graphrag_demo.py api --init   # 方式二：Python API 方式（含建索引）
  python graphrag_demo.py api          # 方式二：Python API 方式（仅查询，复用已有索引）
  python graphrag_demo.py list         # 列出当前 GrafRAG 项目信息

环境说明：
  - LLM：DeepSeek（从上级 .env 加载）
  - Embedding：BAAI/bge-small-zh-v1.5（本地）
  - 测试数据：./data/ 下的 .txt 文件（RAG 17 种方案文档）
"""

import os, sys, json, uuid, asyncio
import subprocess
import shutil
from pathlib import Path
from datetime import datetime

# ── 项目路径 ──
DEMO_DIR = Path(__file__).parent
DATA_DIR = DEMO_DIR / "data"
PROJECT_DIR = DEMO_DIR / "graphrag_project"
CACHE_DIR = DEMO_DIR / "cache"
os.makedirs(CACHE_DIR, exist_ok=True)

# ── 配置加载 ──
from config import LLM_MODEL, LLM_API_KEY, LLM_BASE_URL

# ============================================================
# 第一部分：CLI 方式（最稳定）
# ============================================================

def test_cli_init():
    """测试用例 1：初始化 GraphRAG 项目"""
    print("\n" + "=" * 60)
    print("🧪 [用例 1] 初始化 GraphRAG 项目")
    print("=" * 60)

    if PROJECT_DIR.exists():
        print(f"  ⚠️  项目已存在: {PROJECT_DIR}")
        overwrite = input("  是否重新初始化？(y/N): ").strip().lower()
        if overwrite != "y":
            print("  ✅ 跳过初始化，复用现有项目")
            return True

        shutil.rmtree(PROJECT_DIR)

    PROJECT_DIR.mkdir(parents=True)

    # 初始化（指定模型名，后续手动改 settings.yaml）
    result = subprocess.run(
        ["graphrag", "init", "--root", str(PROJECT_DIR),
         "--model", "deepseek-chat",
         "--embedding", "BAAI/bge-small-zh-v1.5"],
        capture_output=True, text=True, timeout=30,
    )

    if result.returncode != 0:
        print(f"  ❌ 初始化失败: {result.stderr[:200]}")
        return False

    print("  ✅ 项目初始化成功")

    # ── 修改 settings.yaml 适配 DeepSeek ──
    settings_path = PROJECT_DIR / "settings.yaml"
    if settings_path.exists():
        content = settings_path.read_text(encoding="utf-8")

        # 替换 API key
        content = content.replace(
            "api_key: ${GRAPHRAG_API_KEY}",
            f"api_key: {LLM_API_KEY}"
        )
        # 替换 base URL
        content = content.replace(
            "api_base: https://api.openai.com/v1",
            f"api_base: {LLM_BASE_URL}"
        )
        # 替换 encoding model（deepseek 不需要，设为空或注释掉）
        content = content.replace(
            "encoding_name: o200k_base",
            "# encoding_name: o200k_base  # DeepSeek 不需要"
        )
        # embedding 也改成本地模型
        content = content.replace(
            "api_key: ${GRAPHRAG_EMBEDDING_API_KEY}",
            "api_key: ''  # 本地模型不需要 key"
        )

        settings_path.write_text(content, encoding="utf-8")
        print("  ✅ settings.yaml 已配置 DeepSeek")

    # 复制测试数据
    input_dir = PROJECT_DIR / "input"
    input_dir.mkdir(exist_ok=True)
    for f in sorted(DATA_DIR.glob("*.txt")):
        shutil.copy2(f, input_dir / f.name)
    print(f"  ✅ 已复制 {len(list(DATA_DIR.glob('*.txt')))} 个测试文档")

    return True


def test_cli_index():
    """测试用例 2：建知识图谱索引"""
    print("\n" + "=" * 60)
    print("🧪 [用例 2] 建知识图谱索引（耗时较长）")
    print("=" * 60)

    if not PROJECT_DIR.exists():
        print("  ❌ 项目未初始化，请先运行 python graphrag_demo.py cli --init")
        return False

    print("  🚀 正在建索引，请耐心等待...")
    print("  💡 首次运行需要下载模型，后续会快很多")

    result = subprocess.run(
        ["graphrag", "index", "--root", str(PROJECT_DIR)],
        capture_output=True, text=True, timeout=600,
    )

    if result.returncode == 0:
        print("  ✅ 索引构建成功！")
        return True
    else:
        print(f"  ❌ 索引构建失败")
        print(f"  STDERR: {result.stderr[:500]}")
        return False


def test_cli_local_search(query: str = "什么是 Rerank？它和 Embedding 有什么关系？"):
    """测试用例 3：局部搜索（Local Search）"""
    print("\n" + "=" * 60)
    print(f"🧪 [用例 3] Local Search（局部搜索）")
    print(f"   Query: {query}")
    print("=" * 60)

    if not PROJECT_DIR.exists():
        print("  ❌ 项目未初始化")
        return None

    # 先检查 index 有没有建好
    output_dir = PROJECT_DIR / "output"
    if not output_dir.exists() or not any(output_dir.iterdir()):
        print("  ❌ 未检测到索引输出，请先建索引")
        return None

    result = subprocess.run(
        ["graphrag", "query", "--root", str(PROJECT_DIR),
         "--method", "local", "--query", query],
        capture_output=True, text=True, timeout=120,
    )

    if result.returncode == 0:
        print(f"\n  📝 回答：")
        print(f"  {'─' * 50}")
        print(f"  {result.stdout.strip()[:1000]}")
        print(f"  {'─' * 50}")
        return result.stdout
    else:
        print(f"  ❌ 查询失败: {result.stderr[:300]}")
        return None


def test_cli_global_search(query: str = "这些 RAG 方案主要探讨了哪些技术主题？"):
    """测试用例 4：全局搜索（Global Search）"""
    print("\n" + "=" * 60)
    print(f"🧪 [用例 4] Global Search（全局搜索）")
    print(f"   Query: {query}")
    print("=" * 60)

    if not PROJECT_DIR.exists():
        print("  ❌ 项目未初始化")
        return None

    output_dir = PROJECT_DIR / "output"
    if not output_dir.exists() or not any(output_dir.iterdir()):
        print("  ❌ 未检测到索引输出，请先建索引")
        return None

    result = subprocess.run(
        ["graphrag", "query", "--root", str(PROJECT_DIR),
         "--method", "global", "--query", query],
        capture_output=True, text=True, timeout=120,
    )

    if result.returncode == 0:
        print(f"\n  📝 回答：")
        print(f"  {'─' * 50}")
        print(f"  {result.stdout.strip()[:1000]}")
        print(f"  {'─' * 50}")
        return result.stdout
    else:
        print(f"  ❌ 查询失败: {result.stderr[:300]}")
        return None


def test_cli_drift_search(query: str = "有哪些方法可以改进 RAG 的准确率？"):
    """测试用例 5：漂移搜索（Drift Search - 迭代探索）"""
    print("\n" + "=" * 60)
    print(f"🧪 [用例 5] Drift Search（漂移搜索 - 迭代探索）")
    print(f"   Query: {query}")
    print("=" * 60)

    if not PROJECT_DIR.exists():
        print("  ❌ 项目未初始化")
        return None

    output_dir = PROJECT_DIR / "output"
    if not output_dir.exists() or not any(output_dir.iterdir()):
        print("  ❌ 未检测到索引输出，请先建索引")
        return None

    result = subprocess.run(
        ["graphrag", "query", "--root", str(PROJECT_DIR),
         "--method", "drift", "--query", query],
        capture_output=True, text=True, timeout=120,
    )

    if result.returncode == 0:
        print(f"\n  📝 回答：")
        print(f"  {'─' * 50}")
        print(f"  {result.stdout.strip()[:1000]}")
        print(f"  {'─' * 50}")
        return result.stdout
    else:
        print(f"  ❌ 查询失败: {result.stderr[:300]}")
        return None


def run_cli_workflow():
    """完整的 CLI 测试流程"""
    print("=" * 60)
    print("  🎯 GraphRAG CLI 完整测试流程")
    print("=" * 60)

    # Step 1: 初始化
    if not test_cli_init():
        return

    # Step 2: 建索引
    if not test_cli_index():
        return

    # Step 3-5: 三种搜索方式
    test_cli_local_search()
    test_cli_global_search()
    test_cli_drift_search()

    print("\n" + "=" * 60)
    print("  🎉 CLI 测试完成！")
    print("=" * 60)


# ============================================================
# 第二部分：Python API 方式（更灵活，可集成）
# ============================================================

async def test_api_build_index():
    """测试用例 A：Python API 建索引"""
    print("\n" + "=" * 60)
    print("🧪 [用例 A] Python API 建索引")
    print("=" * 60)

    # 需要先有 settings.yaml（用 CLI init 生成）
    settings_path = PROJECT_DIR / "settings.yaml"
    if not settings_path.exists():
        print("  ❌ 项目未初始化，请先运行 python graphrag_demo.py cli --init-only")
        return None

    try:
        import pandas as pd

        # 读取 settings.yaml 构建 config
        import yaml
        from graphrag.config.models.graph_rag_config import GraphRagConfig
        from graphrag.config.enums import IndexingMethod
        from graphrag.api import build_index

        # 加载配置
        with open(settings_path, "r", encoding="utf-8") as f:
            raw_config = yaml.safe_load(f)

        config = GraphRagConfig(**raw_config)

        # 准备文档 DataFrame
        texts = []
        for f in sorted(DATA_DIR.glob("*.txt")):
            texts.append({
                "id": f.stem,
                "text": f.read_text(encoding="utf-8"),
            })

        df = pd.DataFrame(texts)

        print(f"  📄 准备 {len(df)} 个文档")

        # 建索引
        print("  🚀 建索引中...")
        results = await build_index(
            config=config,
            method=IndexingMethod.Standard,
            input_documents=df,
            verbose=True,
        )

        for r in results:
            status = "✅" if r.error is None else "❌"
            print(f"    {status} {r.workflow}")

        return config

    except Exception as e:
        print(f"  ❌ 建索引失败: {e}")
        return None


async def test_api_query(config=None):
    """测试用例 B：Python API 查询（local + global + drift）"""
    print("\n" + "=" * 60)
    print("🧪 [用例 B] Python API 查询（三种搜索方式）")
    print("=" * 60)

    try:
        import pandas as pd

        settings_path = PROJECT_DIR / "settings.yaml"
        if not settings_path.exists():
            print("  ❌ 项目未初始化")
            return

        # 加载 output 目录下的 parquet 文件
        output_dir = PROJECT_DIR / "output"
        if not output_dir.exists():
            print("  ❌ 未检测到 output 目录，请先建索引")
            return

        # 查找最新的索引输出目录
        index_dirs = sorted(output_dir.iterdir()) if output_dir.exists() else []
        if not index_dirs:
            print("  ❌ 索引输出为空")
            return

        latest_output = index_dirs[-1]
        print(f"  📂 使用索引输出: {latest_output.name}")

        # 加载 parquet 文件
        artifacts = latest_output / "artifacts"
        if not artifacts.exists():
            print("  ❌ 未找到 artifacts 目录")
            return

        # 用 glob 加载全部 parquet
        parquet_files = {}
        for pf in artifacts.glob("*.parquet"):
            key = pf.stem.replace("final_", "")
            parquet_files[key] = pd.read_parquet(pf)
            print(f"  📊 加载: {pf.name} ({len(parquet_files[key])} 行)")

        # 必要的 DataFrame
        entities_df = parquet_files.get("entities")
        communities_df = parquet_files.get("communities")
        community_reports_df = parquet_files.get("community_reports")
        text_units_df = parquet_files.get("text_units")
        relationships_df = parquet_files.get("relationships")
        covariates_df = parquet_files.get("covariates")

        # 从 settings.yaml 加载配置
        import yaml
        from graphrag.config.models.graph_rag_config import GraphRagConfig
        from graphrag.api.query import local_search, global_search, drift_search

        with open(settings_path, "r", encoding="utf-8") as f:
            raw_config = yaml.safe_load(f)

        config = GraphRagConfig(**raw_config)

        community_level = 2

        # ── Local Search ──
        if all(x is not None for x in [entities_df, communities_df, community_reports_df,
                                        text_units_df, relationships_df]):
            print("\n  🔍 [Local Search]")
            print(f"  {'─' * 50}")
            answer, _ = await local_search(
                config=config,
                entities=entities_df,
                communities=communities_df,
                community_reports=community_reports_df,
                text_units=text_units_df,
                relationships=relationships_df,
                covariates=covariates_df,
                community_level=community_level,
                response_type="multiple paragraphs",
                query="什么是 Rerank？在 RAG 中起什么作用？",
                verbose=True,
            )
            print(f"  回答：{answer[:500]}")
        else:
            print("  ⚠️  缺少 Local Search 所需数据")

        # ── Global Search ──
        if all(x is not None for x in [entities_df, communities_df, community_reports_df]):
            print("\n  🔍 [Global Search]")
            print(f"  {'─' * 50}")
            answer, _ = await global_search(
                config=config,
                entities=entities_df,
                communities=communities_df,
                community_reports=community_reports_df,
                community_level=community_level,
                dynamic_community_selection=True,
                response_type="multiple paragraphs",
                query="这些 RAG 方案主要有哪些技术流派？",
                verbose=True,
            )
            print(f"  回答：{answer[:500]}")
        else:
            print("  ⚠️  缺少 Global Search 所需数据")

    except ImportError as e:
        print(f"  ❌ 缺少 Python 依赖: {e}")
        print("  💡 建议使用 CLI 方式（更稳定）")
    except Exception as e:
        print(f"  ❌ 查询失败: {e}")
        import traceback
        traceback.print_exc()


# ============================================================
# 第三部分：项目信息
# ============================================================

def show_project_info():
    """显示当前 GraphRAG 项目状态"""
    print("\n" + "=" * 60)
    print("  📋 GraphRAG 项目信息")
    print("=" * 60)

    print(f"\n  📁 项目目录: {PROJECT_DIR}")
    print(f"  📁 数据目录: {DATA_DIR}")
    print(f"  🤖 LLM 模型: {LLM_MODEL}")

    if PROJECT_DIR.exists():
        settings_path = PROJECT_DIR / "settings.yaml"
        if settings_path.exists():
            print(f"  ✅ settings.yaml: 存在")
            size = os.path.getsize(settings_path)
            print(f"     ({size} bytes)")
        else:
            print(f"  ❌ settings.yaml: 不存在")

        input_dir = PROJECT_DIR / "input"
        if input_dir.exists():
            files = list(input_dir.glob("*"))
            print(f"  📄 input 文档: {len(files)} 个")
        else:
            print(f"  📄 input 目录: 不存在")

        output_dir = PROJECT_DIR / "output"
        if output_dir.exists():
            index_dirs = sorted(output_dir.iterdir())
            print(f"  🏗️  索引输出: {len(index_dirs)} 次")
            for d in index_dirs:
                artifacts = d / "artifacts"
                pf_count = len(list(artifacts.glob("*.parquet"))) if artifacts.exists() else 0
                print(f"     - {d.name} ({pf_count} 个 parquet 文件)")
        else:
            print(f"  🏗️  索引输出: 无（尚未建索引）")
    else:
        print(f"  ❌ 项目目录不存在（尚未初始化）")

    print(f"\n  💡 快速命令：")
    print(f"    初始化:    python graphrag_demo.py cli --init-only")
    print(f"    建索引:    python graphrag_demo.py cli --index-only")
    print(f"    完整流程:  python graphrag_demo.py cli")
    print(f"    API 查询:  python graphrag_demo.py api")


# ============================================================
# 主入口
# ============================================================

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Microsoft GraphRAG v3.1.0 测试用例",
    )
    parser.add_argument(
        "mode", nargs="?", default="list",
        choices=["cli", "api", "list"],
        help="测试模式",
    )
    parser.add_argument(
        "--init-only", action="store_true",
        help="仅初始化（CLI 模式）",
    )
    parser.add_argument(
        "--index-only", action="store_true",
        help="仅建索引（CLI 模式）",
    )
    parser.add_argument(
        "--query", type=str, default=None,
        help="自定义查询（CLI 模式）",
    )

    args = parser.parse_args()

    if args.mode == "cli":
        if args.init_only:
            test_cli_init()
        elif args.index_only:
            test_cli_index()
        else:
            # 选择单步执行
            print("=" * 60)
            print("  🎭 GraphRAG CLI 测试")
            print("=" * 60)
            print("\n  请选择要执行的步骤：")
            print("    1. 仅初始化 + 建索引 + 查询（完整流程）")
            print("    2. 仅查询（Local Search）")
            print("    3. 仅查询（Global Search）")
            print("    4. 仅查询（Drift Search）")
            print("    0. 退出")

            choice = input("\n  请选择 (0-4): ").strip()

            if choice == "1":
                run_cli_workflow()
            elif choice == "2":
                q = args.query or input("  输入查询内容 (Enter 使用默认): ").strip() or None
                test_cli_local_search(q)
            elif choice == "3":
                q = args.query or input("  输入查询内容 (Enter 使用默认): ").strip() or None
                test_cli_global_search(q)
            elif choice == "4":
                q = args.query or input("  输入查询内容 (Enter 使用默认): ").strip() or None
                test_cli_drift_search(q)
            else:
                print("  退出")

    elif args.mode == "api":
        async def run_api():
            # 先看索引是否存在
            output_dir = PROJECT_DIR / "output"
            if not output_dir.exists() or not any(output_dir.iterdir()):
                print("  ❌ 未检测到索引，请先建索引")
                print("  💡 运行: python graphrag_demo.py cli")
                return

            if args.init_only:
                await test_api_build_index()
            else:
                await test_api_query()

        asyncio.run(run_api())

    else:  # list
        show_project_info()
