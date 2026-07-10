"""
🛠️  MCP Server 实战 —— FastMCP 版
====================================
使用 FastMCP 库快速构建一个 MCP 服务器。
演示 Tool、Resource、Prompt 三大核心能力。

运行方式：
  1. 启动 Server：python mcp_weather_server.py
  2. 或在另一个终端用 MCP Client 连接测试
"""

import os
import json
from datetime import datetime
import fastmcp
from fastmcp import FastMCP

# ============================================================
# 创建 MCP Server
# ============================================================
# FastMCP 会自动处理好 JSON-RPC、Transport 等底层细节
mcp = FastMCP("水哥工具箱")


# ============================================================
# 一、Tools（工具）—— 可调用函数
# ============================================================

@mcp.tool()
def get_weather(city: str) -> str:
    """查询指定城市的当前天气"""
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


@mcp.tool()
def calculate(expr: str) -> str:
    """计算数学表达式，支持 +-*/() 和乘方"""
    allowed = set("0123456789+-*/(). ")
    if not all(c in allowed for c in expr):
        return "错误：表达式包含不允许的字符"
    try:
        result = eval(expr, {"__builtins__": {}}, {})
        return f"计算结果：{result}"
    except Exception as e:
        return f"计算错误：{e}"


@mcp.tool()
def current_time() -> str:
    """获取当前时间"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@mcp.tool()
def file_list(path: str = ".") -> list:
    """列出指定目录的文件（仅文件名）"""
    try:
        entries = os.listdir(path)
        return [{"name": e, "is_dir": os.path.isdir(os.path.join(path, e))} for e in entries[:30]]
    except Exception as e:
        return [{"error": str(e)}]


# ============================================================
# 二、Resources（资源）—— 可读取的数据
# ============================================================

@mcp.resource("config://app")
def get_app_config() -> str:
    """获取应用配置信息"""
    return json.dumps({
        "name": "水哥工具箱",
        "version": "1.0.0",
        "author": "水哥",
        "created": "2026-07-10",
    }, ensure_ascii=False)


@mcp.resource("help://weather")
def get_weather_help() -> str:
    """天气工具使用说明"""
    return """## 天气查询工具
支持城市：重庆、成都、北京、上海、深圳
使用方法：get_weather(city="城市名")"""


# ============================================================
# 三、Prompts（提示模板）—— 预定义的对话模板
# ============================================================

@mcp.prompt()
def weather_report(city: str) -> str:
    """生成城市天气报告的提示模板"""
    return f"请帮我生成一份关于{city}的详细天气报告，包括当前天气状况、温度、湿度以及出行建议。"


@mcp.prompt()
def code_review(code: str) -> str:
    """代码审查提示模板"""
    return f"""请审查以下代码，指出潜在问题：

```python
{code}
```

请从以下方面评估：
1. 代码正确性
2. 性能问题
3. 安全风险
4. 可读性/风格"""


# ============================================================
# 启动
# ============================================================
if __name__ == "__main__":
    print("🛠️  水哥工具箱 MCP Server 启动")
    print(f"   FastMCP 版本: {fastmcp.__version__}")
    print(f"   注册了 4 个工具：get_weather, calculate, current_time, file_list")
    print(f"   注册了 2 个资源：config://app, help://weather")
    print(f"   注册了 2 个提示模板：weather_report, code_review")
    print("\n使用 stdio 传输（默认）...")
    print("提示：用另一个终端运行 mcp_client_test.py 来测试")
    mcp.run()
