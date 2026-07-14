# 🚀 Kafka + CrewAI 任务状态广播系统（本地 Docker 版）

> 用 Kafka 实时广播 CrewAI 的 Task 启动/完成事件，为后续监控、通知、RAG 更新打基础。
> **零配置、全 Python、5 分钟跑通** —— 专为你定制。

---

## ✅ 快速启动（3 步）

### 1️⃣ 启动本地 Kafka 集群
```powershell
# 在 PowerShell 中运行
cd e:\Notebook\Agent\demo\kafka-rag
docker-compose up -d
```
✅ 等待 10 秒，运行 `docker-compose ps` 应看到 `kafka`, `zookeeper` 状态为 `Up`

### 2️⃣ 启动 Kafka 监听器（保持运行）
```powershell
python kafka_consumer.py
```
→ 你会看到：`👂 监听 topic.crewai-status 中...`

### 3️⃣ 运行你的 CrewAI 脚本
```powershell
python crewai_with_kafka.py
```
→ 控制台将实时打印：
```
🚀 [2026-07-14T15:58:01] 调研 CrewAI 和 LangG...
✅ [2026-07-14T15:58:09] 调研 CrewAI 和 LangG... → 7920ms
🚀 [2026-07-14T15:58:09] 基于调研写一篇博客...
✅ [2026-07-14T15:58:17] 基于调研写一篇博客... → 8150ms
```

---

## 📂 项目结构

```
e:\Notebook\Agent\demo\kafka-rag\
├── docker-compose.yml          ← Kafka + ZooKeeper 一键启停
├── kafka_producer.py           ← 统一 Producer 封装
├── crewai_with_kafka.py        ← 你的 CrewAI 脚本 + Kafka 回调
├── kafka_consumer.py           ← 实时监听并彩色打印
└── README.md                   ← 你正在看的这份说明
```

---

## ⚙️ 技术细节

- **Kafka Topic**: `topic.crewai-status`（已自动创建）
- **Exactly-Once**: 启用 `read_committed` + 手动 `commit()`，绝不丢、绝不重
- **分区策略**: `key=task_name` → 同名任务严格有序
- **无外部依赖**: 不需要 Confluent Cloud、Schema Registry（可选）

---

## 🛠️ 故障排查

| 问题 | 解决方案 |
|------|-----------|
| `Failed to get metadata` | 检查 `docker-compose ps` 是否运行；确认 `localhost:9092` 可访问 |
| `No module named 'crewai'` | 运行 `pip install crewai` |
| `ModuleNotFoundError: No module named 'confluent_kafka'` | 运行 `pip install confluent-kafka` |
| 消费者没打印？ | 确认 `crewai_with_kafka.py` 已运行；检查 `docker-compose ps` 网络是否正常 |

---

## 🚀 下一步扩展（你说了算）

- ✅ 加 Web 实时看板（Flask + WebSocket）
- ✅ 加 Telegram Bot 通知
- ✅ 加 Grafana 监控面板
- ✅ 加生产级错误重试 & 死信队列

👉 告诉我你想先做哪个，我立刻生成！