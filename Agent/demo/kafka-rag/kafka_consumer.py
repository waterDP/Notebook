from confluent_kafka import Consumer, KafkaException
import json
import time
import sys

# 本地 Kafka 配置
KAFKA_CONFIG = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'crewai-monitor-v1',  # 固定组名
    'auto.offset.reset': 'latest',     # 只消费新消息（启动后的新事件）
    'enable.auto.offset.store': False,
    'isolation.level': 'read_committed'
}

consumer = Consumer(KAFKA_CONFIG)
consumer.subscribe(['topic.crewai-status'])

print("\033[1;36m👂 监听 topic.crewai-status 中... (Ctrl+C 停止)\033[0m")

try:
    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        if msg.error():
            raise KafkaException(msg.error())
        
        event = json.loads(msg.value().decode())
        ts = event["timestamp_iso"]
        et = event["event_type"]
        tn = event["task_name"]
        
        if et == "task_started":
            print(f"\033[1;33m🚀 [{ts}] {tn}\033[0m")
        elif et == "task_completed":
            dur = event.get("duration_ms", "?")
            print(f"\033[1;32m✅ [{ts}] {tn} → {dur}ms\033[0m")
        
        # 手动 commit（Exactly-Once）
        consumer.commit(message=msg)

except KeyboardInterrupt:
    print("\n\033[1;35m👋 已停止监听\033[0m")
finally:
    consumer.close()