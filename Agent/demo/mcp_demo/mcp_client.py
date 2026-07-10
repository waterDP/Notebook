"""
🔌 MCP Client 测试 —— 连接 Server 验证全流程
=================================================
使用官方 MCP SDK 的 Client 连接刚刚启动的 MCP Server。

使用步骤：
  1. 终端1：python mcp_server.py            （启动服务）
  2. 终端2：python mcp_client.py            （运行测试）
"""

import asyncio
import json
import sys
sys.path.insert(0, "e:/Notebook/Agent/demo")

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def test():
    print("=" * 60)
    print("  🔌 MCP Client 全流程测试")
    print("=" * 60)

    # 连接到本地 MCP Server
    # StdioServerParameters 会自动启动 python mcp_server.py 作为子进程
    server_params = StdioServerParameters(
        command="python",
        args=["e:/Notebook/Agent/demo/mcp_server.py"],
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:

            # ── 1. 初始化 ──
            print("\n📡 1. 初始化连接...")
            await session.initialize()
            print("    ✅ 连接成功！")

            # ── 2. 发现工具 ──
            print("\n🔍 2. 发现工具...")
            tools = await session.list_tools()
            print(f"    ✅ 发现 {len(tools.tools)} 个工具：")
            for t in tools.tools:
                params = list(t.inputSchema.get("properties", {}).keys())
                print(f"       - {t.name}({', '.join(params)})")
                print(f"         {t.description}")

            # ── 3. 调用工具 ──
            print("\n🛠️  3. 测试工具调用...")

            # 3a. 天气
            print("\n    📍 get_weather('重庆')")
            result = await session.call_tool("get_weather", {"city": "重庆"})
            print(f"       → {result.content[0].text}")

            # 3b. 时间
            print("\n    📍 current_time()")
            result = await session.call_tool("current_time", {})
            print(f"       → {result.content[0].text}")

            # 3c. 计算
            print("\n    📍 calculate('12345 * 6789')")
            result = await session.call_tool("calculate", {"expr": "12345 * 6789"})
            print(f"       → {result.content[0].text}")

            # 3d. 文件列表
            print("\n    📍 file_list('.')")
            result = await session.call_tool("file_list", {"path": "."})
            files = json.loads(result.content[0].text)
            print(f"       → {len(files)} 个条目")
            for f in files[:5]:
                icon = "📁" if f.get("is_dir") else "📄"
                print(f"         {icon} {f['name']}")

            # ── 4. 资源 ──
            print("\n📖 4. 读取资源...")

            print("\n    📍 config://app")
            result = await session.read_resource("config://app")
            print(f"       → {result.contents[0].text}")

            print("\n    📍 help://weather")
            result = await session.read_resource("help://weather")
            print(f"       → {result.contents[0].text}")

            # ── 5. 提示模板 ──
            print("\n💡 5. 获取提示模板...")
            prompts = await session.list_prompts()
            print(f"    ✅ 发现 {len(prompts.prompts)} 个模板：")
            for p in prompts.prompts:
                args = [a.name for a in (p.arguments or [])]
                print(f"       - {p.name}({', '.join(args)})")

            # ── 测试总结 ──
            print(f"\n{'='*60}")
            print("  ✅ 全流程测试通过！")
            print(f"  ✅ 验证了 MCP 三大核心能力：")
            print(f"     工具(Tools)  |  资源(Resources)  |  提示(Prompts)")
            print(f"{'='*60}")


if __name__ == "__main__":
    asyncio.run(test())
