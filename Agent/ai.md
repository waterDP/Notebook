## 语言模型的训练范式

- pre- train 预训练 
- SFT (Supervised Fine-Tuning) 有监督的微调训练
- Instruction Tuning 指令微调
- Reward Model 奖励模型
- PPO (Proximal Policy Optimization) 无监督的强化学习
- RLHF (Reward Learning from Human Feedback) 基于人类反馈的强化学习


## RAG (Retrieval-Augmented Generation)
- 基于检索的增强生成 
- 将参考资料、样例放在Prompt中，就叫做In-Context-Learning
- 但模型能接收的提示词有字数限制，且提示词内容多了性能会严重下降

## Agent (智能体)
- Workflow Agent 工作流智能体
- ReAct Agent 响应智能体 Reasoning Acting
- Agent 平台
- 模型提供智能，Agent保证结果
- 思维链 （Chain of Thoughts）