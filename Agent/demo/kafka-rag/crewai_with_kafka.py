from crewai import Agent, Task, Crew, Process
from kafka_producer import send_status_event

# ===== 1. 定义 Agent & Task（你的原逻辑）=====
researcher = Agent(
    role="研究员",
    goal="调研最新 AI 框架",
    backstory="你擅长快速获取技术信息。",
    verbose=True,
)

writer = Agent(
    role="作者",
    goal="写出通俗易懂的技术对比",
    backstory="你擅长把复杂技术讲简单。",
    verbose=True,
)

task_research = Task(
    description="调研 CrewAI 和 LangGraph 的核心区别",
    expected_output="300字对比报告",
    agent=researcher,
)

task_write = Task(
    description="基于调研写一篇博客",
    expected_output="500字博客",
    agent=writer,
)

# ===== 2. Kafka Callback（关键！插入这里）=====
def on_task_start(task):
    send_status_event(
        topic="topic.crewai-status",
        event_type="task_started",
        task_name=task.description[:30].replace("\n", " ") + "..."
    )

def on_task_end(task, output):
    # 计算耗时（简单版）
    import time
    duration_ms = int((time.time() - task._start_time) * 1000) if hasattr(task, '_start_time') else 0
    
    send_status_event(
        topic="topic.crewai-status",
        event_type="task_completed",
        task_name=task.description[:30].replace("\n", " ") + "...",
        duration_ms=duration_ms,
        output_length=len(output) if output else 0
    )

# ===== 3. 组建 Crew 并启用 Callback =====
crew = Crew(
    agents=[researcher, writer],
    tasks=[task_research, task_write],
    process=Process.sequential,
    verbose=True,
    # 👇 关键：注册 Callback
    task_callback=on_task_end,
    step_callback=on_task_start,  # 注意：CrewAI 的 step_callback 是每步 Thought/Action，task_callback 是每个 Task 结束
)

# 运行！
if __name__ == "__main__":
    result = crew.kickoff()
    print("🎯 Crew 完成:", result.raw[:100] + "...")