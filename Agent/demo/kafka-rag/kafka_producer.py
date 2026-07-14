from confluent_kafka import Producer
import json
import time

# 本地 Kafka 配置（无需 SASL/SSL）
KAFKA_CONFIG = {
    'bootstrap.servers': 'localhost:9092',
    'client.id': 'crewai-producer'
}

producer = Producer(KAFKA_CONFIG)

def send_status_event(topic: str, event_type: str, task_name: str, **kwargs):
    """发送结构化状态事件"""
    event = {
        "event_type": event_type,
        "task_name": task_name,
        "timestamp": int(time.time()),
        "timestamp_iso": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "source": "crewai-agent",
        **kwargs  # 允许传额外字段，如 duration_ms, output_length 等
    }
    
    producer.produce(
        topic=topic,
        key=task_name.encode(),  # 按 task_name 分区，同名任务总进同一 Partition
        value=json.dumps(event, ensure_ascii=False).encode()
    )
    producer.flush()  # 立即发送（生产环境建议 batch + callback）
    print(f"📤 {event_type.upper()}: {task_name}")
 
# 供其他模块 import 使用
__all__ = ['send_status_event']