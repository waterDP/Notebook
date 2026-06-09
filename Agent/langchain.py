## 创建agent
from langchain.agents import create_agent

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[],
    system_prompt="你是一个专业的助手，能够回答用户的问题。",
)

# 调用agent
result = agent.invoke("我想知道迪士尼的退票政策")
print(result)

## 使用Model模块
from langchain.chat_models import init_chat_model
import os

model = init_chat_model(
    model="claude-sonnet-4-5-20250929",
    api_key=os.getenv("DASHSCOPE_API_KEY"),
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    timeout=30,
    max_retries=4,
    max_tokens=3000,
    temperature=0.7,
)

# 调用模型
# 1. 单条消息
response = model.invoke("我想知道迪士尼的退票政策")
print(response)

# 2. 多条消息（对话历史）调用
conversation = [
    {"role": "user", "content": "我想知道迪士尼的退票政策"},
    {"role": "assistant", "content": "迪士尼的：..."},
    {"role": "user", "content": "明天天气怎么样？"},
    {"role": "assistant", "content": "明天天气：..."},
]
response = model.invoke(conversation)
print(response)

# 3. 流式输出
response = model.stream(conversation)
for chunk in response:
    print(chunk.content, end="", flush=True)
print("")

# 4. 指调用
requests = ["什么是人工智能？", "langchain有什么优势", "如何使用模型？"]
response = model.batch(requests)
for i, response in enumerate(response):
    print(f"问题{i+1}: {requests[i]}")
    print(f"回答{i+1}: {response.content}")
    print("=" * 30)

## 使用Model Profiles

profile = model.profile

print("\n模型配置信息:")
print(f"最大输入token数：{profile.get('max_input_tokens')}")
print(f"最大输出token数：{profile.get('max_output_tokens')}")
print(f"支持图像输入：{profile.get("image_inputs")}")


## Message模块
