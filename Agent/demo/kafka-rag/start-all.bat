@echo off

echo 🚀 正在启动 Kafka + 监听器 + CrewAI 示例...

cd /d "e:\Notebook\Agent\demo\kafka-rag"

echo 1️⃣ 启动 Kafka 集群...
docker-compose up -d

timeout /t 10 /nobreak >nul

echo 2️⃣ 启动 Kafka 监听器（新窗口）...
start "Kafka Consumer" cmd /k "python kafka_consumer.py"

echo 3️⃣ 启动 CrewAI 示例（新窗口）...
start "CrewAI with Kafka" cmd /k "python crewai_with_kafka.py"

echo ✅ 全部启动完成！
echo 👉 查看控制台输出，或打开 README.md 学习更多。
pause