# LangChain CoT 实战示例

所有示例都基于 DeepSeek API（兼容 OpenAI），可直接运行。

## 文件一览

| # | 文件 | 说明 | 耗时 |
|---|------|------|------|
| 1 | `01_zero_shot_cot.py` | Zero-shot CoT — 加一句"请一步一步推理" | ~30s |
| 2 | `02_few_shot_cot.py` | Few-shot CoT — 给 3 个带推理的例子，引导格式 | ~30s |
| 3 | `03_self_consistency_cot.py` | Self-consistency — 跑 5 次取众数投票 | ~60s |
| 4 | `04_agent_react_cot.py` | Agent + CoT — ReAct 模式：CoT 推理链 + Function Calling | ~40s |

## 运行顺序

```bash
cd "e:\Notebook\Agent\demo\07-09-langchain-cot"
python 01_zero_shot_cot.py
python 02_few_shot_cot.py
python 03_self_consistency_cot.py
python 04_agent_react_cot.py
```

## 核心收获

- **Zero-shot CoT**：最简单，一句咒语搞定（DeepSeek 已经内化了这个能力）
- **Few-shot CoT**：用例子稳定输出格式，适合需要规范化的场景
- **Self-consistency**：多次采样投票，容错率高（但成本 ×N）
- **Agent + CoT**：CoT + Tool Use = ReAct，这是 Agent 的通用骨架
