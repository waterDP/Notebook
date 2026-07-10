"""Quick test of MCP server registration"""
import sys
sys.path.insert(0, "e:/Notebook/Agent/demo/mcp_demo")
from mcp_weather_server import mcp

tools = mcp.list_tools()
resources = mcp.list_resources()
prompts = mcp.list_prompts()

print(f"Tools ({len(tools)}):")
for t in tools:
    print(f"  - {t.name}: {t.description}")

print(f"\nResources ({len(resources)}):")
for r in resources:
    print(f"  - {r.uri}")

print(f"\nPrompts ({len(prompts)}):")
for p in prompts:
    print(f"  - {p.name}: {p.description}")
