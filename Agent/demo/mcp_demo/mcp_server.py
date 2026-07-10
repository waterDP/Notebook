"""
🛠️  MCP Server —— 使用官方 MCP SDK
=====================================
直接用 MCP SDK 实现，无 FastMCP 封装，
可以清晰看到 MCP 协议的底层交互。

运行：python mcp_server.py
（启动后 waiting for stdio...）
测试：另开终端运行 python mcp_client.py
"""

import sys
import os
import json
from datetime import datetime

sys.path.insert(0, "e:/Notebook/Agent/demo/mcp_demo")

from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
from mcp.types import (
    Tool,
    TextContent,
    Resource,
    ResourceContents,
    Prompt,
    PromptArgument,
    PromptMessage,
    TextContent as PromptTextContent,
)
import mcp.server.stdio


# ============================================================
# 工具实现
# ============================================================

def get_weather(city: str) -> str:
    """查询城市天气"""
    data = {
        "重庆": {"weather": "阴天", "temp": 28, "humidity": 75},
        "成都": {"weather": "多云", "temp": 26, "humidity": 65},
        "北京": {"weather": "晴", "temp": 32, "humidity": 40},
        "上海": {"weather": "小雨", "temp": 27, "humidity": 80},
        "深圳": {"weather": "雷阵雨", "temp": 30, "humidity": 85},
    }
    info = data.get(city)
    if info:
        return f"{city}：{info['weather']}，{info['temp']}°C，湿度{info['humidity']}%"
    return f"暂无 {city} 的天气数据"


def calculate(expr: str) -> str:
    """计算数学表达式"""
    allowed = set("0123456789+-*/(). ")
    if not all(c in allowed for c in expr):
        return "错误：表达式包含不允许的字符"
    try:
        return f"计算结果：{eval(expr, {'__builtins__': {}}, {})}"
    except Exception as e:
        return f"计算错误：{e}"


def current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def file_list(path: str = ".") -> str:
    """列出目录文件"""
    try:
        entries = os.listdir(path)
        return json.dumps([
            {"name": e, "is_dir": os.path.isdir(os.path.join(path, e))}
            for e in entries[:30]
        ], ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": str(e)})


TOOL_HANDLERS = {
    "get_weather": get_weather,
    "calculate": calculate,
    "current_time": current_time,
    "file_list": file_list,
}


# ============================================================
# 创建 MCP Server
# ============================================================
app = Server("水哥工具箱")


# ── 工具列表 —— 告诉客户端你可以调什么 ──
@app.list_tools()
async def list_tools():
    return [
        Tool(
            name="get_weather",
            description="查询指定城市的当前天气",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "城市名称，如 重庆、成都"}
                },
                "required": ["city"],
            },
        ),
        Tool(
            name="calculate",
            description="计算数学表达式，支持 +-*/()",
            inputSchema={
                "type": "object",
                "properties": {
                    "expr": {"type": "string", "description": "数学表达式，如 12345*6789"}
                },
                "required": ["expr"],
            },
        ),
        Tool(
            name="current_time",
            description="获取当前时间",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        Tool(
            name="file_list",
            description="列出指定目录的文件",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "目录路径，默认当前目录"}
                },
            },
        ),
    ]


# ── 工具调用 —— 收到调用请求后执行 ──
@app.call_tool()
async def call_tool(name: str, arguments: dict):
    handler = TOOL_HANDLERS.get(name)
    if not handler:
        raise ValueError(f"未知工具：{name}")

    result = handler(**arguments)
    return [TextContent(type="text", text=str(result))]


# ── 资源列表 —— 客户端可以读取的数据 ──
@app.list_resources()
async def list_resources():
    return [
        Resource(
            uri="config://app",
            name="应用配置",
            description="水哥工具箱的应用配置信息",
            mimeType="application/json",
        ),
        Resource(
            uri="help://weather",
            name="天气帮助",
            description="天气工具的使用说明",
            mimeType="text/markdown",
        ),
    ]


@app.read_resource()
async def read_resource(uri: str):
    # 日志（写入 stderr 避免干扰 JSON-RPC 通信）
    import sys
    resources_map = {
        "config://app": {
            "name": "水哥工具箱",
            "version": "1.0.0",
            "tools": list(TOOL_HANDLERS.keys()),
        },
        "help://weather": "## 天气查询工具\n\n支持城市：重庆、成都、北京、上海、深圳",
    }

    data = resources_map.get(uri)
    if data is None:
        raise ValueError(f"unknown resource: {uri}")

    text = json.dumps(data, ensure_ascii=False) if isinstance(data, dict) else data
    mime = "application/json" if isinstance(data, dict) else "text/markdown"

    return [ResourceContents(
        uri=uri,
        mimeType=mime,
        text=text,
    )]


# ── 提示模板列表 ──
@app.list_prompts()
async def list_prompts():
    return [
        Prompt(
            name="weather_report",
            description="生成城市天气报告的提示模板",
            arguments=[
                PromptArgument(name="city", description="城市名称", required=True),
            ],
        ),
        Prompt(
            name="code_review",
            description="代码审查提示模板",
            arguments=[
                PromptArgument(name="code", description="需要审查的代码", required=True),
            ],
        ),
    ]


@app.get_prompt()
async def get_prompt(name: str, arguments: dict):
    if name == "weather_report":
        city = arguments.get("city", "重庆")
        text = f"请帮我生成一份关于{city}的详细天气报告，包括当前天气状况、温度、湿度以及出行建议。"
    elif name == "code_review":
        code = arguments.get("code", "")
        text = f"""请审查以下代码，指出潜在问题：

```python
{code}
```

请从以下方面评估：
1. 代码正确性
2. 性能问题
3. 安全风险
4. 可读性/风格"""
    else:
        raise ValueError(f"未知提示模板：{name}")

    return PromptMessage(
        role="user",
        content=PromptTextContent(type="text", text=text),
    )


# ============================================================
# 启动
# ============================================================
async def main():
    from mcp.types import ServerCapabilities
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="水哥工具箱",
                server_version="1.0.0",
                capabilities=ServerCapabilities(),
            ),
        )

if __name__ == "__main__":
    import asyncio
    sys.stdout.reconfigure(encoding='utf-8')
    print("[MCP Server] 水哥工具箱启动")
    print("[MCP Server] 等待客户端连接...")
    asyncio.run(main())
