"""
🔌 MCP Client 测试 —— 连接 MCP Server 验证功能
=================================================
模拟 MCP Host 的行为：
1. 初始化连接
2. 发现能力（工具、资源、提示）
3. 调用工具
4. 读取资源
5. 获取提示模板

运行前提：先启动 mcp_weather_server.py（另一个终端）
"""

import asyncio
import json

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def test_server():
    print("=" * 60)
    print("  🔌 MCP Client 测试")
    print("=" * 60)

    # 连接到本地 MCP Server（stdio 方式）
    server_params = StdioServerParameters(
        command="python",
        args=["e:/Notebook/Agent/demo/mcp_weather_server.py"],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # ── 1. 初始化握手 ──
            print("\n📡 初始化连接...")
            await session.initialize()
            print("  ✅ 连接成功！")

            # ── 2. 发现工具 ──
            print("\n🔍 发现工具...")
            tools = await session.list_tools()
            print(f"  ✅ 发现 {len(tools.tools)} 个工具：")
            for t in tools.tools:
                params_desc = ", ".join(t.inputSchema.get("properties", {}).keys())
                print(f"     - {t.name}({params_desc}): {t.description}")

            # ── 3. 调用工具 ──
            print("\n🛠️  测试工具调用...")

            # 3a. 天气查询
            print("\n  📍 测试：get_weather('重庆')")
            result = await session.call_tool("get_weather", {"city": "重庆"})
            for content in result.content:
                if content.type == "text":
                    print(f"     → {content.text}")

            # 3b. 时间查询
            print("\n  📍 测试：current_time()")
            result = await session.call_tool("current_time", {})
            for content in result.content:
                if content.type == "text":
                    print(f"     → {content.text}")

            # 3c. 计算
            print("\n  📍 测试：calculate('12345 * 6789')")
            result = await session.call_tool("calculate", {"expr": "12345 * 6789"})
            for content in result.content:
                if content.type == "text":
                    print(f"     → {content.text}")

            # 3d. 文件列表
            print("\n  📍 测试：file_list('.')")
            result = await session.call_tool("file_list", {"path": "."})
            files = json.loads(result.content[0].text)
            print(f"     → 当前目录共 {len(files)} 个条目")
            for f in files[:5]:
                icon = "📁" if f.get("is_dir") else "📄"
                print(f"       {icon} {f['name']}")

            # ── 4. 读取资源 ──
            print("\n📖 测试资源读取...")

            print("\n  📍 读取：config://app")
            result = await session.read_resource("config://app")
            for content in result.contents:
                print(f"     → {content.text}")

            print("\n  📍 读取：help://weather")
            result = await session.read_resource("help://weather")
            for content in result.contents:
                print(f"     → {content.text}")

            # ── 5. 获取提示模板 ──
            print("\n💡 测试提示模板...")
            prompts = await session.list_prompts()
            print(f"  ✅ 发现 {len(prompts.prompts)} 个提示模板：")
            for p in prompts.prompts:
                print(f"     - {p.name}: {p.description}")

    print("\n" + "=" * 60)
    print("  ✅ MCP 全流程测试完成！")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_server())
