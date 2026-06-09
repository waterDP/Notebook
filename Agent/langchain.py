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


## 标准内容块 Content Blocks

# 创建使用content_blocks属性的消息
from langchain.messages import HumanMessage

message = HumanMessage(
    content_blocks=[{"type": "text", "text": "我想知道迪士尼的退票政策"}]
)

# 主要内容块类型
# 1.文本内容块
text_block = {"type": "text", "text": "我想知道迪士尼的退票政策"}

# 2.图像内容块
image_block = {"type": "image_url", "image_url": "https://example.com/image.jpg"}

# 3.音频内容块
audio_block = {"type": "audio_url", "audio_url": "https://example.com/audio.mp3"}

# 4.工具使用内容块
tool_block = {
    "type": "tool_use",
    "id": "tool_call_123",
    "name": "get_weather",
    "params": {"city": "北京"},
}

# 5.工具结果内容块
tool_result_block = {
    "type": "tool_result",
    "tool_call_id": "tool_call_123",
    "content": {"temperature": 25, "condition": "sunny"},
}

## 工具定义
from langchain.tools import tool


@tool
def search_database(query: str, limit: int = 10) -> str:
    """Search the customer database for records matching the query.
    Args:
        query (str): The query to search for.
        limit (int, optional): The maximum number of records to return. Defaults to 10.
    """
    return f"Found {limit} results for {query}"


# 工具运行时上下文
# 使用ToolRuntime访问会话状态
from langchain.tools import ToolRuntime, tool


@tool
def summarize(runtime: ToolRuntime) -> str:
    """总结当前对话历史"""
    messages = runtime.state["messages"]

    human_msgs = sum(1 for m in messages if m.__class__.__name__ == "HumanMessage")
    ai_msgs = sum(1 for m in messages if m.__class__.__name__ == "AIMessage")
    tool_msgs = sum(1 for m in messages if m.__class__.__name__ == "ToolMessage")

    return f"对话历史中，用户有{human_msgs}条消息，助手有{ai_msgs}条消息，工具调用了{tool_msgs}次。"


# 更新会话状态
from langchain.tools import tool
from langgraph.types import Command


@tool
def clear_conversation() -> Command:
    """清除当前对话历史"""
    from langchain.messages import RemoveMessages
    from langgraph.graph.message import REMOVE_ALL_MESSAGES

    return Command(update={"messages": [RemoveMessages(id=REMOVE_ALL_MESSAGES)]})


## 使用自定义上下文
from dataclasses import dataclass
from langchain.tools import tool, ToolRuntime


# 定义用户上下文结构
@dataclass
class UserContext:
    user_id: str


# 使用泛型参数声明所需的上下文类型
@tool
def get_account_info(runtime: ToolRuntime[UserContext]) -> str:
    """获取用户账户信息"""
    user_id = runtime.context["user_id"]
    return f"用户{user_id}的账户信息：..."


agent = create_agent(tools=[get_account_info])


## 复杂输入模式
# 使用pydantic数据类定义复杂的输入结构
from pydantic import BaseModel, Field
from langchain.tools import tool


class SearchParams(BaseModel):
    query: str = Field(description="The query to search for.")
    filters: dict = Field(
        fault_factory=dict, description="Additional filters to apply to the search."
    )
    limit: int = Field(
        description="The maximum number of records to return. Defaults to 10."
    )


@tool
def advanced_search(params: SearchParams) -> str:
    """执行高级搜索"""
    print("我被调用啦~~~~")
    print(
        f"关键词：{params.query}, 过滤条件：{params.filters},  返回数量：{params.limit}"
    )


## 短期记忆
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

# 创建带记忆功能的智能体
agent = create_agent(
    model="gpt-5",
    tools=[get_account_info, advanced_search],
    checkpointer=InMemorySaver(),
)

# 使用thread_id标识不同会话
agent.invoke(
    {"messages": [{"role": "user", "content": "你好，我叫小明"}]},
    {"configurable": {"thread_id": "1"}},
)

## 自定义记忆内容
from langchain.tools import tool, ToolRuntime
from langchain.agents import create_agent, AgentState
from langgraph.checkpoint.memory import InMemorySaver
from langchain.chat_models import init_chat_model


# 创建扩展的状态类，添加额外字段
class CustomState(AgentState):
    user_name: str


# 定义工作 通过runtime访问自定义状态
@tool
def greet(runtime: ToolRuntime[CustomState]) -> str:
    """问候用户"""
    user_name = runtime.state["user_name"]
    return f"你好，{user_name}！很高兴为你服务。"


# 初始化聊天模型
model = init_chat_model("gpt-5")

# 使用自定义状态创建智能体
agent = create_agent(
    model=model, tool=[greet], state_schema=CustomState, checkpointer=InMemorySaver()
)

# 在调用时自定义信息
result = agent.invoke(
    {"messages": [{"role": "user", "content": "向用户问好"}], "user_name": "小明"},
    {"configurable": {"thread_id": "user_session_1"}},
)
print(result)

## 结构化输出

#! Pydantic Models （最强）
from pydantic import BaseModel, Field
from langchain.agents.structured_output import ProviderStrategy


class MeetingAction(BaseModel):
    topic: str = Field(description="会议主题")
    participants: list = Field(description="会议参与人员")
    action_items: list = Field(description="会议中需要执行的操作项")
    deadline: str = Field(description="截止时间")


# 创建智能体
meeting_agent = create_agent(
    model=model,
    response_format=ProviderStrategy(MeetingAction),
)

# 调用获取结果
result = meeting_agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "请创建一个会议，主题为项目A，参与人员为张三、李四，操作项为项目A的进度报告，截止时间为2024-01-01",
            }
        ]
    }
)

meeting_data = result["structured_response"]
print(f"会议主题：{meeting_data.topic}")
print(f"参与人员：{meeting_data.participants}")

#! Dataclasses  轻量级结构 原生数据类
from dataclasses import dataclass
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy


@dataclass
class BookInfo:
    title: str
    author: str
    isbn: str
    year: int


book_agent = create_agent(model=model, response_format=ProviderStrategy(BookInfo))

#! TypedDict
# 字典结构-类型安全的字典
from typing import TypedDict
from langchain.agents.structured_output import ProviderStrategy


class MovieInfo(TypedDict):
    title: str
    director: str
    year: int
    genre: str


movie_agent = create_agent(model=model, response_format=ProviderStrategy(MovieInfo))

result = movie_agent.invoke(
    {"messages": [{"role": "user", "content": "请推荐一部2023年上映的科幻电影"}]}
)

movie_data = result["structured_response"]
print(f"推荐的电影：{movie_data['title']}")
print(f"导演：{movie_data['director']}")

#! JSON schema
from langchain.agents.structured_output import ToolStrategy

contact_info_schema = {
    "type": "object",
    "description": "Contact information for a person",
    "properties": {
        "name": {"type": "string", "description": "用户名"},
        "email": {"type": "string", "description": "用户邮箱"},
        "phone": {"type": "string", "description": "用户手机号"},
    },
    "required": ["name", "email", "phone"],
}

contact_agent = create_agent(
    model=model, response_format=ProviderStrategy(contact_info_schema)
)

## 智能错误处理
agent = create_agent(
    handle_errors=True,  # 捕获所有错误并重试
    response_format=ToolStrategy(
        schema=contact_info_schema,
        handle_errors=True,  # 捕获所有错误并重试
        # handle_errors="请确保提供有效的联系信息" # 自定义错误提示
        # handle_errors=ValueError # 仅捕获特定异常
    ),
)