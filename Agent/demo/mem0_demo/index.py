"""
🧠 Mem0 记忆管理 —— 可测试 Demo
================================
展示 Mem0 的核心机制：
1. 记忆添加（从对话中自动提取）
2. 记忆检索（根据新输入召回相关记忆）
3. 记忆更新
4. 记忆删除
5. 追踪每条记忆的变更历史

运行前提：DASHSCOPE_API_KEY 环境变量
"""

import os
import json
from mem0 import Memory

# ============================================================
# 配置 Mem0（使用通义千问 + 本地 Chroma）
# ============================================================
config = {
    "llm": {
        "provider": "openai",
        "config": {
            "model": "qwen3.7-max",
            "api_key": os.environ["DASHSCOPE_API_KEY"],
            "openai_base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
            "temperature": 0.1,
            "max_tokens": 2000,
        },
    },
    "embedder": {
        "provider": "openai",
        "config": {
            "model": "text-embedding-v3",
            "api_key": os.environ["DASHSCOPE_API_KEY"],
            "openai_base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
            "embedding_dims": 1024,
        },
    },
    "vector_store": {
        "provider": "chroma",
        "config": {
            "path": "./mem0_demo_db",
        },
    },
}

m = Memory.from_config(config)


def sep(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")


def show_memories(data, label="记忆列表"):
    """统一打印记忆。兼容 get_all/search 的 dict 格式和单条记忆。"""
    print(f"\n  📌 {label}:")
    if not data:
        print("    (暂无记忆)")
        return
    # dict 格式：{results: [...]} 或单条记忆
    if isinstance(data, dict):
        if "results" in data:
            items = data["results"]
        else:
            items = [data]
    else:
        items = data
    if not items:
        print("    (暂无记忆)")
        return
    for i, mem in enumerate(items):
        text = mem.get("memory", str(mem))
        mem_id = mem.get("id", "")
        score = mem.get("score", None)
        print(f"    [{i+1}] {text}")
        details = f"id: {mem_id}" if mem_id else ""
        if score is not None:
            details += f" | 相似度: {score:.3f}" if details else f"相似度: {score:.3f}"
        if details:
            print(f"        └─ {details}")


# ============================================================
# 第一步：添加记忆（模拟多轮对话）
# ============================================================
sep("第一步：添加记忆 —— 模拟对话自动提取")

messages = [
    {"role": "user", "content": "你好，我叫水哥，四川人，现在在重庆工作。"},
    {"role": "assistant", "content": "你好水哥！很高兴认识你。"},
]

result = m.add(messages, user_id="水哥")
print("  📝 添加记忆结果:", json.dumps(result, ensure_ascii=False, indent=2))

# 继续积累更多记忆
sep("🔁 继续对话 —— 积累更多记忆")

m.add([
    {"role": "user", "content": "我喜欢吃火锅，尤其是重庆老火锅。"},
    {"role": "assistant", "content": "重庆老火锅确实巴适！"},
], user_id="水哥")

m.add([
    {"role": "user", "content": "我最近在自学 Agent 开发，目标是转型做 AI Agent 工程师。"},
    {"role": "assistant", "content": "加油！Agent 开发前景很好。"},
], user_id="水哥")

m.add([
    {"role": "user", "content": "我是前端出身，Vue 和 React 都用过。"},
    {"role": "assistant", "content": "那你有很好的基础，Agent 的 UI 层优势很大。"},
], user_id="水哥")


# ============================================================
# 第二步：查看已存储的所有记忆
# ============================================================
sep("第二步：查看所有已存储的记忆")
all_memories = m.get_all(filters={"user_id": "水哥"})
show_memories(all_memories, "水哥 的全部记忆")

print(f"\n  💡 看到了吗？Mem0 自动从对话中提取了 4 条结构化记忆：")
print(f"     个人信息、口味偏好、学习目标、技术背景")


# ============================================================
# 第三步：语义检索 —— 测试记忆召回
# ============================================================
sep("第三步：语义检索 —— 测试记忆召回")

test_queries = [
    "水哥是哪的人？",
    "水哥喜欢吃什么？",
    "水哥在学什么技术？",
    "水哥之前做什么工作的？",
]

for query in test_queries:
    print(f"\n  🔍 查询：「{query}」")
    related = m.search(query, filters={"user_id": "水哥"})
    show_memories(related, "相关记忆")


# ============================================================
# 第四步：更新记忆
# ============================================================
sep("第四步：更新记忆 —— 信息变了怎么办？")

memories = m.search("水哥 四川 重庆", filters={"user_id": "水哥"})
results = memories.get("results", [])
if results:
    mem_id = results[0].get("id")
    if mem_id:
        print(f"  📝 找到记忆 ID: {mem_id}")
        old_text = results[0].get("text", results[0].get("memory", ""))
        print(f"  📝 旧内容: {old_text}")
        print(f"  📝 更新为: 水哥已经从重庆搬到成都了")
        m.update(memory_id=mem_id, data="水哥已经搬到成都了，现在在成都发展。")
        print("  ✅ 更新成功！")

        updated = m.get(memory_id=mem_id)
        print(f"  📌 更新后内容: {updated}")


# ============================================================
# 第五步：查看记忆变更历史
# ============================================================
sep("第五步：查看记忆的变更历史")
memories = m.search("水哥 成都 搬到", filters={"user_id": "水哥"})
results = memories.get("results", [])
if results:
    mem_id = results[0].get("id")
    if mem_id:
        history = m.history(memory_id=mem_id)
        print(f"  记忆 ID: {mem_id}")
        for h in history:
            old = h.get("old_memory", "")
            new = h.get("new_memory", "")
            event = h.get("event", "")
            ts = h.get("created_at", "")
            print(f"    {event}: {old} → {new} ({ts})")


# ============================================================
# 第六步：删除一条记忆
# ============================================================
sep("第六步：删除记忆")

memories_for_del = m.search("前端", filters={"user_id": "水哥"})
results_del = memories_for_del.get("results", [])
if results_del:
    del_id = results_del[0].get("id")
    if del_id:
        print(f"  🗑️ 删除记忆 ID: {del_id}")
        m.delete(memory_id=del_id)
        print("  ✅ 删除成功！")

        # 验证删除
        remaining = m.get_all(filters={"user_id": "水哥"})
        show_memories(remaining, "删除后的剩余记忆")


# ============================================================
# 清理说明
# ============================================================
sep("清理说明")
import shutil
if os.path.exists("./mem0_demo_db"):
    print("  📌 本地向量数据库保留在 ./mem0_demo_db/")
    print("  📌 如需完全清理，删除该目录即可：")
    print("      Remove-Item -Recurse -Force ./mem0_demo_db")
print(f"\n{'='*60}")
print("  ✅ Mem0 Demo 运行完成！")
print(f"{'='*60}")
