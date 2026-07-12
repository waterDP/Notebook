# 🔢 Embedding（文本向量化）
# ====================================================================================================================================
    # 📖 什么是 Embedding？
        # Embedding = 把文本（词、句、段落）映射到高维向量空间的过程。
        # 说白了就是：让计算机理解"苹果"和"香蕉"是差不多的东西，
        #             而"苹果"和"操作系统"是两码事。

        # 向量空间里的距离衡量语义相似度：
        #   "猫" → [0.12, 0.87, -0.34, ...] → 和"狗"靠得近
        #   "猫" → [0.12, 0.87, -0.34, ...] → 和"微积分"离得远
        # 维度通常 256-3072，OpenAI text-embedding-3-small 是 1536 维。

        # ⚡ Embedding 的两个关键特性：
        # 1. 维度固定——不管输入是"你好"还是整本《三体》，输出维度都一样（如 1536 维）
        #    这是能批量检索的前提
        # 2. 向量空间有结构——语义相近的文本在空间中靠得近
        #    "苹果"和"香蕉"近，"苹果"和"微积分"远

        # 一句话：Embedding 把人类语言转成 LLM 能算距离的数学对象。

    # 🚀 Embedding 模型怎么选？
        # ┌──────────────────────┬───────────┬──────────┬──────────────────┐
        # │ 模型                 │ 维度       │ 价格      │ 推荐场景          │
        # ├──────────────────────┼───────────┼──────────┼──────────────────┤
        # │ OpenAI text-emb-3-small │ 1536    │ $0.02/1M │ 通用首选，质量稳   │
        # │ OpenAI text-emb-3-large │ 3072    │ $0.13/1M │ 高精度场景         │
        # │ BGE-small-zh-v1.5     │ 512       │ 免费本地  │ 中文场景离线       │
        # │ BGE-large-zh-v1.5     │ 1024      │ 免费本地  │ 中文高精度离线     │
        # │ 通义 text-embedding-v4│ 1024      │ 免费额度  │ 阿里云生态        │
        # │ DeepSeek emb          │ 1024      │ 需申请    │ DeepSeek 全家桶   │
        # └──────────────────────┴───────────┴──────────┴──────────────────┘

        # ■ 选型原则：
        # 1. 开发阶段用 OpenAI text-emb-3-small（最稳，生态好）
        # 2. 中文场景上线可以用 BGE（免费、维度低、速度快）
        # 3. 维度不是越高越好——维度越高检索越慢，1536 对大部分场景够用
        # 4. 同一个系统的 Embedding 模型必须统一（不同模型向量不可比较）
        # 5. 注意领域适配——通用场景 OpenAI 够用；纯中文场景 BGE 性价比更高，可本地离线

    # 🚀 基础用法（OpenAI SDK）
        from openai import OpenAI
        import numpy as np

        client = OpenAI(api_key="sk-xxx")  # 换成你的 key

        def get_embedding(text: str, model: str = "text-embedding-3-small") -> list[float]:
            """
            单条文本向量化
            Args:
                text: 输入文本，OpenAI 限制 ~8192 tokens
                model: Embedding 模型名
            Returns:
                list[float]: 1536 维向量
            """
            text = text.replace("\n", " ")
            response = client.embeddings.create(input=[text], model=model)
            return response.data[0].embedding

        vec = get_embedding("今天天气真好")
        print(f"向量维度: {len(vec)}")   # 1536
        print(f"前 5 个值: {vec[:5]}")

        # ■ 批量向量化（OpenAI 原生支持 batch，推荐）
        def get_embeddings_batch(texts: list[str], model: str = "text-embedding-3-small") -> list[list[float]]:
            texts = [t.replace("\n", " ") for t in texts]
            response = client.embeddings.create(input=texts, model=model)
            return [d.embedding for d in response.data]

        texts = ["苹果很好吃", "香蕉也不错", "微积分太难了"]
        vecs = get_embeddings_batch(texts)
        print(f"批量返回 {len(vecs)} 条向量，维度 {len(vecs[0])}")

    # 🚀 相似度计算
        # 向量化之后最核心的操作：算距离。三种主流距离度量：

        # ■ 1. 余弦相似度（Cosine Similarity）—— 最常用
        #    只看方向不看长度，适合比较语义相似度
        def cosine_similarity(a: list[float], b: list[float]) -> float:
            a, b = np.array(a), np.array(b)
            dot = np.dot(a, b)
            norm = np.linalg.norm(a) * np.linalg.norm(b)
            return dot / norm if norm != 0 else 0.0

        # ■ 2. 点积（Dot Product）—— 归一化后和余弦等价
        def dot_product(a: list[float], b: list[float]) -> float:
            return float(np.dot(a, b))

        # ■ 3. 欧氏距离（Euclidean Distance）—— 看绝对距离
        def euclidean_distance(a: list[float], b: list[float]) -> float:
            return float(np.linalg.norm(np.array(a) - np.array(b)))

        # ---- 演示 ----
        vec_apple = get_embedding("苹果很好吃")
        vec_banana = get_embedding("香蕉也不错")
        vec_calc = get_embedding("微积分太难了")

        print(f"苹果 vs 香蕉: cosine={cosine_similarity(vec_apple, vec_banana):.4f}")
        print(f"苹果 vs 微积分: cosine={cosine_similarity(vec_apple, vec_calc):.4f}")

        # ⚡ 向量数据库（Chroma / FAISS）内部自动算距离
        # 具体用法见后方独立章节

    # 🚀 Embedding 在 Agent 中的四大应用场景
        # ┌─────────────────────────────────────────────────────────────┐
        # │ 场景                      │ 作用                             │
        # ├─────────────────────────────────────────────────────────────┤
        # │ ① 工具预筛选               │ 30 个工具 → 检索 top-5 传给 LLM  │
        # │ ② 长期记忆检索             │ 从 mem0/Qdrant 中找回历史记忆    │
        # │ ③ RAG 知识库               │ 文档拆块 → 向量化 → 语义检索     │
        # │ ④ 意图路由                 │ 用户 query 向量化 → 分类 → 路由  │
        # └─────────────────────────────────────────────────────────────┘

    # 🚀 Embedding 质量评估——怎么知道自己的向量好不好？
        # 定量评估的三个核心指标：

        # ■ 1. Hit Rate（命中率）
        #    查 100 次，正确文档出现在 top-5 里的次数。
        #    例：85 次命中 → Hit Rate@5 = 85%。
        #    简单说就是："我要的东西你有没有给我"

        # ■ 2. MRR（Mean Reciprocal Rank）
        #    不光看有没有命中，还看排在第几位。
        #    排第 1 → 得 1 分；排第 3 → 得 1/3 分。
        #    适合对排序敏感的场景（如 QA：正确答案永远希望排最前面）

        # ■ 3. 正反例分离度
        #    "苹果 vs 香蕉"的相似度 vs "苹果 vs 微积分"的相似度。
        #    差距越大，说明 Embedding 区分能力越强。

    # 🚀 实用技巧合集

        # ■ 技巧 1：dimensions 参数裁剪维度
        #    OpenAI text-embedding-3-small 支持裁剪维度，减少存储和计算。
        #    原理：OpenAI 在模型输出层加了一个 projection matrix，
        #    可安全截断到任意长度（256 / 512 / 1024）。
        #    效果：维度降 6 倍，检索快 6 倍，精度只掉 2-5%。
        #    ⚠️ 必须在 API 调用时通过 dimensions 参数裁剪，不能手动截断！
        get_embedding("test", dimensions=256)  # 返回 256 维而非 1536

        # ■ 技巧 2：缓存避免重复调 API
        #    Embedding API 有延迟和费用，缓存能省 90%+ 调用
        import hashlib
        EMBEDDING_CACHE = {}
        def get_embedding_cached(text: str) -> list[float]:
            key = hashlib.md5(text.encode()).hexdigest()
            if key in EMBEDDING_CACHE:
                return EMBEDDING_CACHE[key]
            vec = get_embedding(text)
            EMBEDDING_CACHE[key] = vec
            return vec

        # ■ 技巧 3：Query 预处理
        #    检索时用户查询和文档库文本分布不同（查询短且口语化，文档长且书面）
        #    常见做法：用 LLM 改写查询为检索友好的格式（Query Rewriting）

        # ■ 技巧 4：Batch 大小推荐 32-64 条
        #    OpenAI API 最多 2048 条/批，但超过 100 条时尾部延迟显著增加

        # ■ 技巧 5：中英文选型
        #    OpenAI text-emb-3-small 对中英混合不错，纯中文推荐 BGE-large-zh-v1.5

        # 📌 向量数据库（Chroma / FAISS / Milvus）的具体用法见后方独立章节


# 🧰 Function Calling
# ====================================================================================================================================
    # 🔍 工具检索（Tool Retrieval） 
        # 向量化预筛选解决的就是这些问题——先把无关工具过滤掉，只让 LLM 在几个候选里选。
   
        import chromadb
        from openai import OpenAI

        # 准备阶段：所有工具的描述向量化
        tools = [
            {"name": "get_weather", "description": "查询指定城市的天气情况，包括温度、湿度、风力"},
            {"name": "calculate_expression", "description": "计算数学表达式的结果，支持加减乘除和括号"},
            {"name": "send_email", "description": "发送电子邮件给指定收件人"},
            {"name": "book_flight", "description": "预订航班机票，需要出发地、目的地、日期"},
            {"name": "search_flights", "description": "搜索可用的航班信息，返回航班列表和价格"},
            {"name": "cancel_flight", "description": "取消已预订的航班订单"},
            # ... 一共 30 个工具
        ]

        # 1. 把所有工具描述向量法，存入数量库
        # 可以用embedding model或者LLM自带的embedding
        def build_tool_index(tools)
            collection = chromadb.Collection("tools")
            for tool in tools
                collection.add(
                    ids=[tool['name']],
                    embeddings=[get_embedding(tool['description'])],
                    metadatas=[{"name": tool['name'], "desc": tool["description"]}]
                )
            return collection
            
        # 2. 用户查询来时，先检索最相关的工具
        def retrieve_relevant_tools(query, collection, top_k=5):
            query_embedding = get_embedding(query)
            results = collection.query(
                query_embedding=[query_embedding],
                n_results=top_k
            )
            return result['metadatas'][0] # 返回最相关的几个工具元数据 

        # 3. 只把几个工具的schema传给LLM
        def agent_with_retrieval(query, all_tools, tool_index):
            # 检索阶段
            candidate_tools = retrieval_relevant_tools(query, all_tools)

            # 准备函数调用的schema
            function_schemas = [
                build_function_schema(tool) 
                for tool in candidate_tools
            ]

            # LLM 决策阶段（现在选项很少，准确率大幅提升）
            response = llm.chat(
                messages=[{"role": "user", "content": query}],
                tools=function_schemas  # 只传 3-5 个候选
            )
            
            return response

        """
        这个方案的关键工程细节
        1. 不是光用 description 就行 最佳实践是给工具加一个单独的 search_keywords 字段，专门用来做向量化： search_text
        2. 混合检索（Hybrid Search）比纯向量更好 这样既捡得到语义相似的，又捡得到关键词匹配的。
        3. Top-K 的选择要动态  
            # 简单查询（"今天天气怎么样"）→ 1-2 个候选就够了
            # 复杂查询（"帮我买机票然后把行程发邮件给李总"）→ 可能需要 5-7 个
        4. 加上 Fallback 机制  万一向量检索漏掉了正确工具，LLM 应该能"自愈"：    
        """    
     
    # 🚀 并行 Function Calling（Parallel Tool Calls）
        # 用户：帮我查北京和上海的天气，然后把结果存到数据库
        response = llm.chat([
            {"role": "user", "content": "帮我查北京和上海的天气并存入数据库"}
        ])

        # LLM 可能一口气返回两个 tool call：
        [
            {"name": "get_weather", "args": {"city": "北京"}},
            {"name": "get_weather", "args": {"city": "上海"}},
        ]            

        # 核心执行器：处理单个工具调用，带超时、重试、参数校验
        import json
        import asyncio
        from typing import Any

        # 工具注册表：name → handler 函数
        TOOL_REGISTRY = {}

        def register_tool(name: str, handler):
            """注册一个可调用的工具处理器"""
            TOOL_REGISTRY[name] = handler

        async def execute_tool(tool_call) -> str:
            """
            执行单个工具调用
            
            参数:
                tool_call: LLM 返回的 tool call 对象
                    - .name: 工具名
                    - .arguments: JSON 字符串参数字典
                    - .id: 调用 ID
            
            返回:
                工具执行结果的 JSON 字符串
            """
            tool_name = tool_call.name
            
            # 1. 参数解析
            try:
                if isinstance(tool_call.arguments, str):
                    args = json.loads(tool_call.arguments)
                else:
                    args = dict(tool_call.arguments)  # 已是 dict
            except json.JSONDecodeError as e:
                return json.dumps({
                    "error": f"参数解析失败: {e}",
                    "raw_args": str(tool_call.arguments)
                }, ensure_ascii=False)
            
            # 2. 查找工具
            handler = TOOL_REGISTRY.get(tool_name)
            if not handler:
                return json.dumps({
                    "error": f"未找到工具: {tool_name}",
                    "available_tools": list(TOOL_REGISTRY.keys())
                }, ensure_ascii=False)
            
            # 3. 执行（带超时保护）
            try:
                result = await asyncio.wait_for(
                    handler(**args),
                    timeout=30.0
                )
                return json.dumps({
                    "success": True,
                    "data": result
                }, ensure_ascii=False)
            except asyncio.TimeoutError:
                return json.dumps({
                    "error": f"工具 {tool_name} 执行超时 (30s)",
                    "args": args
                }, ensure_ascii=False)
            except TypeError as e:
                # 参数不匹配（缺参或多参）
                return json.dumps({
                    "error": f"参数错误: {e}",
                    "args": args
                }, ensure_ascii=False)
            except Exception as e:
                return json.dumps({
                    "error": f"执行异常: {type(e).__name__}: {e}",
                    "args": args
                }, ensure_ascii=False)

        # 并行执行器：多个工具一起跑，全部完成后合并返回
        async def execute_parallel(tool_calls):
            tasks = [execute_tool(tc) for tc in tool_calls]
            results = await asyncio.gather(*tasks)
            
            # 告诉 LLM 哪条结果是哪个调用的
            return [
                {"role": "tool", "tool_call_id": tc.id, "content": r}
                for tc, r in zip(tool_calls, results)
            ]

        """
        拉链函数
        a = ["北京", "上海", "广州"]
        b = [25, 28, 30]

        list(zip(a, b))
        # → [("北京", 25), ("上海", 28), ("广州", 30)]
        """
 
    # 🚀 Function Calling 做结构化输出（比 JSON Mode 强）
        # 很多场景你需要的不是调工具，而是让 LLM 输出格式固定的结构化数据。JSON Mode 只能约束最外层结构，
        # 但 Function Calling 能给你嵌套的、带验证的结构化输出。  
        # 定义一个"虚拟工具"，它不执行任何操作，只是用来约束输出格式
        # Function Calling 的 JSON Schema 支持嵌套结构、枚举、正则验证
        # LLM 对 FC 的 adherence 率远高于 JSON Mode
        tools = [
            {
                "name": "extract_invoice_info",
                "description": "从文本中提取发票信息",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "invoice_number": {"type": "string"},
                        "date": {"type": "string", "format": "date"},
                        "items": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "quantity": {"type": "integer"},
                                    "unit_price": {"type": "number"},
                                    "total": {"type": "number"},
                                },
                                "required": ["name", "quantity", "unit_price", "total"]
                            }
                        },
                        "total_amount": {"type": "number"}
                    },
                    "required": ["invoice_number", "date", "items", "total_amount"]
                }
            }
        ]

        response = llm.chat("把这段发票信息提取出来：...", tools=tools, tool_choice="any")

        # 返回值一定是符合 JSON Schema 的结构
        invoice = response.tool_calls[0].args  # 直接解结构化数据     

        """
        工程价值：
        JSON Schema 比自由格式的 output 约束强得多
        支持嵌套、枚举、正则验证
        LLM 对 Function Calling 的 adherence 率远高于 JSON Mode    
        """

    # 🚀 Function Calling 做路由（Intent Router）
        # 不给 LLM 真正的工具，而是用 Function Calling 做意图分发
        router_tools = [
            {
                "name": "query_weather",
                "description": "用户想查询天气",
                "parameters": {"type": "object", "properties": {"city": {"type": "string"}}}
            },
            {
                "name": "book_ticket",
                "description": "用户想预订票务",
                "parameters": {"type": "object", "properties": {"type": {"type": "string"}, "date": {"type": "string"}}}
            },
            {
                "name": "chitchat",
                "description": "日常闲聊，非功能性请求",
                "parameters": {"type": "object", "properties": {}}
            }
        ]

        # 先走路由，再走具体业务逻辑
        intent = llm.chat(user_input, tools=router_tools, tool_choice="auto")
        route_to_handler(intent.name, intent.args)

        # token 消耗方面： FC 路由的 tool schema 比纯文本描述更 verbose（JSON Schema 格式更啰嗦），所以实际上可能还多耗几个 token。

        # Function Calling 路由真正的优势是三点：

            # -输出稳定 — LLM 对 FC 的 adherence 率远高于文本输出，不会出现你叫它输出"天气查询"它给你输出"查询天气"
            # -天然带参数 — 路由的同时可以顺带提取参数（如上例的 city），一箭双雕
            # -不用二次解析 — 文本输出你还要 string match，FC 直接拿 tool_call.name 就完事了

    # 🚀 工具调用链 & 结果传递（Multi-hop Tool Use）
        # 一个工具的输出直接作为下一个工具的输入，LLM 自己决定链路。    

        # 用户：帮我查张三的身份证号，然后用他的身份证号订一张明天去北京的机票

        ① get_user_info("张三") → {"id": "510...", "name": "张三"}
        ② LLM 看到结果后，决定：
        ③ book_flight(id="510...", destination="北京", date="2026-07-11")

        # 工程关键点： 同一种数据（身份证号）在不同的工具间流动，LLM 需要能自主建立"上一步输出 = 下一步输入"的映射关系。
        # 更高级一点：让工具返回半结构化数据，LLM 解析后传给下一步。
        
        # 工具返回：{"flights": [{"id": "CA1234", "price": 800}, {"id": "CZ5678", "price": 650}]}
        # LLM 理解后：
        book_flight(flight_id="CZ5678", price=650)  # 选了便宜的

    # 🏗️ Multi-hop Tool Use 完整可运行 Demo
        """
        场景：查张三最近一笔订单的物流信息
        
        流程链：
        search_user("张三") → get_orders("U001") → get_logistics("ORD123") → 回答
        
        LLM 每一步自己决定下一步调什么工具、用什么参数
        """
        # pip install openai  (需要配置 OPENAI_API_KEY / DEEPSEEK_API_KEY)
        import json
        from openai import OpenAI

        api_key = "sk-your-api-key"      # ← 换成你的 key
        base_url = "https://api.deepseek.com/v1"  # 或 OpenAI
        model = "deepseek-chat"          # 或 gpt-4o

        # ===== 1. 定义三个关联的工具 =====
        user_db = {
            "张三": {"id": "U001", "name": "张三", "phone": "13800138000"},
            "李四": {"id": "U002", "name": "李四", "phone": "13900139000"},
        }
        order_db = {
            "U001": [
                {"id": "ORD123", "amount": 299, "date": "2026-07-08", "product": "无线耳机"},
                {"id": "ORD124", "amount": 599, "date": "2026-07-05", "product": "键盘"},
            ],
            "U002": [
                {"id": "ORD125", "amount": 199, "date": "2026-07-01", "product": "鼠标"},
            ]
        }
        logistics_db = {
            "ORD123": {"status": "配送中", "carrier": "顺丰", "tracking": "SF1234567890",
                        "eta": "2026-07-11 18:00", "history": ["已揽收", "运输中", "到达上海分拣中心"]},
            "ORD124": {"status": "已签收", "carrier": "中通", "sign_time": "2026-07-07 14:30"},
            "ORD125": {"status": "已发货", "carrier": "圆通", "tracking": "YT9876543210"},
        }

        # ===== 2. 注册工具（真正的 handler） =====
        def search_user(name: str) -> dict:
            """根据用户名查找用户信息，返回用户ID、姓名、手机号"""
            user = user_db.get(name)
            if not user:
                return {"error": f"未找到用户: {name}"}
            return user

        def get_orders(user_id: str) -> list:
            """根据用户ID查询该用户的所有订单，按时间倒序"""
            orders = order_db.get(user_id, [])
            if not orders:
                return {"error": f"用户 {user_id} 没有订单"}
            # 按日期倒序，最新的排最前
            return sorted(orders, key=lambda o: o["date"], reverse=True)

        def get_logistics(order_id: str) -> dict:
            """根据订单ID查询物流信息，返回物流状态、承运商、预计送达时间"""
            info = logistics_db.get(order_id)
            if not info:
                return {"error": f"未找到订单 {order_id} 的物流信息"}
            return info

        # ===== 3. 工具的 JSON Schema（给 LLM 的调用定义） =====
        TOOLS = [
            {
                "type": "function",
                "function": {
                    "name": "search_user",
                    "description": "根据用户名查找用户信息，返回用户ID、姓名、手机号",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {"type": "string", "description": "用户名"}
                        },
                        "required": ["name"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_orders",
                    "description": "根据用户ID查询该用户的所有订单，按时间倒序返回，最新的排最前",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "string", "description": "用户ID"}
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_logistics",
                    "description": "根据订单ID查询物流信息，返回物流状态、承运商、预计送达时间",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "order_id": {"type": "string", "description": "订单ID"}
                        },
                        "required": ["order_id"]
                    }
                }
            }
        ]

        # ===== 4. 工具名称 → 实际函数的映射表 =====
        HANDLERS = {
            "search_user": search_user,
            "get_orders": get_orders,
            "get_logistics": get_logistics,
        }

        # ===== 5. 核心 Agent 循环（Multi-hop） =====
        def run_agent(user_query: str, max_steps: int = 10) -> str:
            """
            多步工具调用 Agent
            LLM 自主决定每一步调用什么工具，直到给出最终答案
            """
            client = OpenAI(api_key=api_key, base_url=base_url)
            messages = [{"role": "user", "content": user_query}]

            for step in range(1, max_steps + 1):
                print(f"\n=== Step {step} ===")

                response = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    tools=TOOLS,
                    temperature=0.1
                )

                msg = response.choices[0].message

                # LLM 想调用工具
                if msg.tool_calls:
                    messages.append(msg)

                    for tc in msg.tool_calls:
                        tool_name = tc.function.name
                        args = json.loads(tc.function.arguments)

                        print(f"  🛠️ 调用工具: {tool_name}({json.dumps(args, ensure_ascii=False)})")

                        # 执行真正的工具函数
                        handler = HANDLERS.get(tool_name)
                        if handler:
                            result = handler(**args)
                        else:
                            result = {"error": f"未知工具: {tool_name}"}

                        print(f"  📦 返回结果: {json.dumps(result, ensure_ascii=False)}")

                        # 把结果塞回对话（关键！下一步 LLM 就能看到）
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tc.id,
                            "content": json.dumps(result, ensure_ascii=False)
                        })

                # LLM 直接回答了（信息收集够了）
                else:
                    print(f"  💬 最终回答: {msg.content}")
                    return msg.content

            return "⚠️ 达到最大步数限制，未完成"

        # ===== 6. 运行！ =====
        if __name__ == "__main__":
            result = run_agent("查一下张三最近一笔订单的物流送到哪了")
            # 预期输出：
            # Step 1: LLM 调用 search_user(name="张三") → 拿到 U001
            # Step 2: LLM 调用 get_orders(user_id="U001") → 拿到 ORD123
            # Step 3: LLM 调用 get_logistics(order_id="ORD123") → 拿到物流状态
            # Step 4: LLM 综合回答："张三最近购买的无线耳机（订单 ORD123）
            #          正在通过顺丰配送，预计 2026-07-11 18:00 前送达，
            #          当前状态：到达上海分拣中心"


# 📝 Prompt Engineering
# ====================================================================================================================================
    # 🚀 Chain of Thought 思维链
        # CoT = 让 LLM 在给出答案之前，先把推理过程一步一步写出来
        # 🔬 原理层面 
            # 1. 分担计算负担——步步推理的每步复杂度远低于一步到到
            # 2. 中间校验点——每步结果可以作为查检点，错在哪步能定位
            # 3. 激活符号推理——纯文本模型+显式推理≈模拟了符号系统的效果
            # 4. 注意力引导 — 把 attention 导向了推理路径，而不是直接跳到输出

        # 🧠 COT的几种变体
            # 🍋 1. Zero-shot CoT — 全靠一句咒语
                # 在 prompt 末尾加一句："Let's think step by step."（让我们一步一步思考）

                f"""
                    Q: 一箱牛奶 12 瓶，喝了 1/3，还剩几瓶？
                    A: Let's think step by step.
                """
                # 这就是最经典的 Zero-shot CoT，来自 Kojima et al. (2022)，零样本就能激活推理能力。

                # 中文等效："请一步一步推理"或"让我们一步步分析"

                # 优点： 零成本，啥都能用
                # 缺点： 没有示例引导，质量取决于模型本身

            # 🍋 2. Few-shot CoT — 给几个推理范例
                # 在 prompt 里给 2-3 个带推理过程的例子，最后抛真实问题：

                f"""
                    Q: 小明有 3 本书，又买了 5 本，送给朋友 2 本，还剩几本？
                    A: 小明有 3 本。买了 5 本后，3+5=8 本。送了 2 本后，8-2=6 本。所以剩 6 本。

                    Q: 一个长方形长 8cm，宽 5cm，面积是多少？
                    A: 长方形面积=长×宽。8×5=40。所以面积是 40 平方厘米。

                    Q: 温度从 -5°C 上升了 12°C，现在是几度？
                    A:
                """

                # 优点： 引导质量高，适合复杂推理
                # 缺点： 需要找好例子，消耗更多 token

            # 🍋 3. Self-consistency Cot - 多次采样求众数
                # 同一条 prompt 跑 N 次（通常 5-10 次），取出现频率最高的答案：

                f"""
                Run 1: 小明有5个苹果... 所以剩6个
                Run 2: 小明有5个苹果... 所以剩6个  
                Run 3: 小明有5个苹果... 所以剩4个（算错了）
                Run 4: 小明有5个苹果... 所以剩6个
                Run 5: 小明有5个苹果... 所以剩6个

                → 众数答案：6个（4/5 一致）    
                """

                # 代价： 推理成本 ×N，但不需要额外标注数据

            # 🍋 4. Tree of Thoughts(ToT)——思维树
                # 不满足于一条推理链，而是构建一棵搜索树，每步生成多个可能的下一步，然后用 BFS/DFS 搜索：

                f"""
                Step 1: ① 先买票 → ② 先订酒店 → ③ 先查攻略
                         │              │
                Step 2: ①→查航班     ②→比较价格
                         │              │
                Step 3: ①→选座位     ②→看评价
                """

                # 每次用 LLM 评估每条路径的价值（"这条思路对吗？"），剪枝保留最有希望的。

                # 适用场景： 需要探索和规划的复杂问题（写代码、下棋、旅行规划）

            # 🍋 5. Chain of Thought with Self-Correction
                # 在 CoT 输出的后面加一轮自纠错

                f"""
                Step 1: 推理过程
                Step 2: 答案
                Step 3: "看看上面的推理有没有错误？检查计算过程"
                Step 4: 修正后的答案
                """

                # 缺点是 token 开销大，优点是能减少低级错误。

        # ⚡ 参数建议
            # 参数              建议值                 理由
            # temperature      0.3-0.5           Self-consistency 时 0.7
            # max_tokens       给足推理空间       数学题至少 500+
            # top_p            0.9-1.0           同上

        # 📌 什么时候用/不用

            # ✅ 适合用 CoT：
            # 数学题、逻辑题
            # 多步推理（法律分析、代码 Debug）
            # 需要"解释为什么"的业务场景
            # 答案需要可审计的场合

            # ❌ 不适合或用处不大：
            # 简单事实问答（"北京是哪个国家的首都？"）
            # 情感分析、分类任务（直接出结果更快）
            # 创意写作（CoT 反而束缚了发散性）
            # 极短上下文、token 预算紧张                    

    # 🚀 Role Prompting 角色设定
        # 让 LLM 扮演特定角色，激活对应领域的知识和表达方式

        # ■ 基础角色设定
        # "你是一个资深律师"
        # "你是一个小学老师"
        # "你是一个 Python 高级工程师"

        # ■ 进阶：角色 + 约束组合
        f"""你是一个小学三年级数学老师。
        规则：
        - 只能用加减乘除解释
        - 每句话不超过 20 个字
        - 多举生活中的例子
        - 不要使用分数或小数

        学生问：为什么 1/3 比 1/5 大？
        """

        # ■ 效果原理
        # 角色设定 → 激活模型在预训练中对应领域的分布
        # 约束条件 → 剪枝输出空间，减少幻觉

    # 🚀 Few-shot Prompting（无 CoT 版）
        # 给例子，但不给推理过程。模型从例子中推断模式

        f"""将中文句子翻译为情绪标签：

        今天太开心了 → happy
        这件事让我很生气 → angry
        他走了，有点难过 → sad

        明天的考试让我紧张 →
        """

        # ■ 什么时候用
        # 分类任务、情感分析、格式转换
        # CoT 反而多余的时候

    # 🚀 System Prompt 结构化

        # ■ 结构化模板（推荐）
        SYSTEM_PROMPT_TEMPLATE = """# 角色
        你是一个{role}。

        # 能力
        - {capability_1}
        - {capability_2}

        # 约束
        - {constraint_1}
        - {constraint_2}

        # 输出格式
        {output_format}

        # 示例
        {examples}
        """

        # 比一大段纯文字效果好，原因：
        # 1. 结构化指令降低注意力分散
        # 2. 显式区分角色/能力/约束，避免冲突
        # 3. 输出格式固定，下游好解析

    # 🚀 Output Format Control 输出控制

        # ■ 方法一：用 JSON Schema 限制
        f"""请以 JSON 格式回答，严格遵循以下 schema：
        {{
            "sentiment": "positive | negative | neutral",
            "confidence": 0.0-1.0,
            "reason": "简短理由"
        }}

        文本：今天天气真好
        """

        # ■ 方法二：用 markdown 模板
        f"""请按以下格式回答：

        ## 分析
        [你的分析内容]

        ## 结论
        [最终结论]

        ## 置信度
        [高/中/低]
        """

    # 🚀 Negative Prompting 反向提示
        # 明确告诉模型不该做什么，比只告诉它该做什么更有效

        f"""分析以下代码的问题：

        规则：
        - 不要解释代码的作用
        - 不要说"这段代码有问题"之类的废话
        - 只输出具体的 bug 列表
        - 如果没有 bug，输出"无问题"
        """

    # 🚀 Emotion Prompt 情绪注入
        # 给 prompt 加情绪压力词，能显著提升效果（有论文验证）

        # ■ 常见情绪注入方式
        # "这个任务对我的职业发展至关重要"
        # "请仔细思考，这关系到一个用户的体验"
        # "请深呼吸，一步一步来"

        # ■ 效果原理
        # 情绪词激活了模型在训练数据中"被强调的内容更重要"的分布

    # 🚀 结构化小结
        # | 技术 | 作用 | 使用频率 |
        # | Role Prompting | 激活领域知识 | ⭐⭐⭐⭐⭐ |
        # | Few-shot | 示例引导模式 | ⭐⭐⭐⭐ |
        # | System Prompt 结构化 | 降低指令歧义 | ⭐⭐⭐⭐⭐ |
        # | Output Format Control | 下游解析友好 | ⭐⭐⭐⭐ |
        # | Negative Prompting | 减少幻觉和废话 | ⭐⭐⭐ |
        # | Emotion Prompt | 提升回答质量 | ⭐⭐（玄学） |


# 📜 Context Engineering
# ====================================================================================================================================

    # 🔹 六大模块: 系统提示层,对话历史层,记忆注入层,工具上下文层,任务状态层,外部知识层

    # 🔹 五大策略框架:Write写入持久化/Select运行时检索/Compress上下文压缩/Isolate下上文隔离/Cache提示缓存


     # 环境准备
        from langchain_deepseek import ChatDeepSeek
        from transformers import AutoTokenizer
        from dotenv import load_dotenv
        import os, time

        # 加载环境变量(从 .env 文件读取 API 配置)
        load_dotenv()

        def create_llm(temperature: float = 0.7) -> ChatDeepSeek:
            """
            统一 LLM 初始化工厂函数,避免每个演示重复配置

            Args:
                temperature: 控制输出随机性,0=确定性,1=高随机性,默认0.7

            Returns:
                ChatDeepSeek: 配置好的 LLM 实例
            """
            return ChatDeepSeek(
                model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),  # 从环境变量读取模型名
                api_key=os.getenv("DEEPSEEK_API_KEY"),  # API 密钥
                base_url=os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com"),  # API 端点
                temperature=temperature,  # 输出随机性控制
            )

        # 加载 DeepSeek 官方 tokenizer(首次运行需下载 ~几MB,后续自动缓存)
        # trust_remote_code=True 允许执行模型仓库中的自定义代码(DeepSeek tokenizer 需要)
        tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-V3", trust_remote_code=True)

        def count_tokens(text: str) -> int:
            """
            用 DeepSeek 官方 tokenizer 精确计算 token 数

            Args:
                text: 待计算的文本字符串

            Returns:
                int: token 数量(与 API 实际消耗一致)
            """
            return len(tokenizer.encode(text))

        # 初始化全局 LLM 实例,temperature=0.3 确保演示结果稳定可复现
        llm = create_llm(0.3)
        print(f"LLM 初始化完成,Tokenizer 加载完成")

    # 🎯 Write写入持久化
    # 对话历史层 | 记忆注入层 | 任务状态层
    # ----------------------------------------------------------------------------------------------------------------
        # 🚀 === 短期记忆层的 Write:LLM 压缩摘要 + 持久化到 sessions/ ===
            import json, os, time

            SESSIONS_DIR = "./sessions"
            os.makedirs(SESSIONS_DIR, exist_ok=True)

            # 核心参数(与 SessionManager 一致:消息数达到阈值时,压缩前半部分,只保留后半部分)
            COMPRESS_TRIGGER = 8   # 演示用小阈值(生产环境 SessionManager 用 20)
            KEEP_RECENT = 4        # 压缩后保留最近 4 条消息

            # ---- 步骤 1:创建 session,写入 8 条多轮对话 ----
            session_id = "write_demo"

            session = {
                "title": "新项目技术选型讨论",
                "created_at": time.strftime("%Y-%m-%d %H:%M"),
                "updated_at": time.strftime("%Y-%m-%d %H:%M"),
                "compressed_context": "",   # 压缩前为空
                "messages": [
                    {"role": "user", "content": "新项目的数据库用什么?"},
                    {"role": "assistant", "content": "推荐 PostgreSQL。理由:项目有大量关联查询,团队熟悉度高,配合 SQLAlchemy 2.0 的 async 支持性能优秀。"},
                    {"role": "user", "content": "缓存方案呢?"},
                    {"role": "assistant", "content": "Redis,Cache-Aside 模式。热点数据 TTL=300s,写操作先更新 DB 再删缓存。"},
                    {"role": "user", "content": "部署方案定了吗?"},
                    {"role": "assistant", "content": "Docker Compose 本地开发,AWS ECS 生产。CI/CD 用 GitHub Actions,自动化金丝雀发布。"},
                    {"role": "user", "content": "预算上限是多少?"},
                    {"role": "assistant", "content": "初期 15 万以内。服务器 3 万/年,API 调用预留 2 万/月。"},
                ]
            }

            # 写入 JSON(压缩前:8 条消息,compressed_context 为空)
            session_path = os.path.join(SESSIONS_DIR, f"{session_id}.json")
            with open(session_path, "w", encoding="utf-8") as f:
                json.dump(session, f, ensure_ascii=False, indent=2)

            print(f"=== 压缩前:{session_path} ===")
            print(f"messages: {len(session['messages'])} 条(达到 COMPRESS_TRIGGER={COMPRESS_TRIGGER})")
            print(f"compressed_context: (空)")

            # ---- 步骤 2:达到阈值,压缩前 4 条为摘要,只保留后 4 条 ----
            if len(session["messages"]) >= COMPRESS_TRIGGER:
                early_messages = session["messages"][:-KEEP_RECENT]   # 前 4 条:将被压缩
                recent_messages = session["messages"][-KEEP_RECENT:]  # 后 4 条:保留原文

                # LLM 压缩早期对话(一句话回复,控制运行时间)
                early_text = "\n".join(f'{m["role"]}: {m["content"]}' for m in early_messages)
                compress_prompt = f"""
                请将以下对话历史压缩为一段简洁的摘要,保留所有关键技术决策和数字:
                \n\n{early_text}\n\n
                输出要求:一段话,不超过 80 字。
                """

                summary = llm.invoke(compress_prompt).content # 送入模型进行压缩

                # 写回 session:compressed_context 存摘要,messages 只留最近的
                session["compressed_context"] = summary
                session["messages"] = recent_messages
                session["updated_at"] = time.strftime("%Y-%m-%d %H:%M")

                # 处理后,重新写回文件
                with open(session_path, "w", encoding="utf-8") as f:
                    json.dump(session, f, ensure_ascii=False, indent=2)

            # ---- 步骤 3:展示压缩结果 ----
            original_tokens = count_tokens(early_text)
            summary_tokens = count_tokens(summary)

            print(f"\n=== 压缩后:{session_path} ===")
            print(f"compressed_context ({summary_tokens} tokens,原始 {original_tokens} tokens,压缩率 {(1 - summary_tokens/original_tokens)*100:.0f}%):")
            print(f"  {summary}")
            print(f"messages: {len(session['messages'])} 条(只保留最近 {KEEP_RECENT} 条)")
            for m in session["messages"]:
                print(f"  [{m['role']}] {m['content'][:50]}")

            # 从文件读回验证
            print(f"\n=== 验证:从文件读回 ===")
            with open(session_path, "r", encoding="utf-8") as f:
                saved = json.load(f)
            print(f"compressed_context 长度: {len(saved['compressed_context'])} 字符")
            print(f"messages 数量: {len(saved['messages'])} 条")

        # 🚀 === 长期记忆层的 Write:mem0.add() 选择性提取 ===
            """
            长期记忆的 Write 目标完全不同:**从对话中识别出值得跨会话保留的关键事实,结构化后写入向量数据库**。前课的 `mem0.add()`
            内部会调用 LLM 裁判(`_extract_facts()`)判断哪些信息值得记住,然后执行 ADD/UPDATE/NONE 三分类。

            这里有一个关键细节:`mem0` 默认从 user 角色的消息中提取事实。因此,如果用户只是在提问(「数据库用什么?」),
            `mem0` 提取不到有价值的决策信息。真实场景中,用户会在对话中确认决策(「数据库我们决定用 PostgreSQL」),这些确认性表述才是长期记忆的提取目标。
            下面我们模拟这个场景:
            """
            import os, shutil
            from mem0 import Memory

            QDRANT_PATH = "./qdrant_write_demo"

            # 清理残留锁(Notebook 重复运行时文件锁不会自动释放)
            for p in [QDRANT_PATH, os.path.expanduser("~/.mem0/migrations_qdrant")]:
                if os.path.exists(p):
                    shutil.rmtree(p)

            # mem0 配置(与进阶课件一致:DeepSeek 做 LLM,OpenAI 做 Embedding)
            config = {
                "llm": {
                    "provider": "openai",
                    "config": {
                        "model": "deepseek-chat",
                        "api_key": os.getenv("DEEPSEEK_API_KEY"),
                        "openai_base_url": "https://api.deepseek.com/v1",
                        "temperature": 0.1,
                    }
                },
                "embedder": {
                    "provider": "openai",
                    "config": {
                        "model": "text-embedding-3-small",
                        "api_key": os.getenv("OPENAI_API_KEY"),
                    }
                },
                "vector_store": {
                    "provider": "qdrant",
                    "config": {
                        "collection_name": "write_demo",
                        "path": QDRANT_PATH,
                    }
                },
                "version": "v1.1"
            }

            memory = Memory.from_config(config)

            # 关键:mem0 默认从 user 消息中提取事实
            # 因此对话需要反映真实场景--用户确认技术决策,而非只是提问
            decisions_conversation = [
                {"role": "user", "content": "数据库我们决定用 PostgreSQL,项目有大量关联查询,团队熟悉度高,配合 SQLAlchemy 2.0 做 async"},
                {"role": "assistant", "content": "好的,PostgreSQL + SQLAlchemy 2.0 async 已记录。"},
                {"role": "user", "content": "缓存方案定了,用 Redis Cache-Aside 模式,热点数据 TTL 设 300 秒,写操作先更新 DB 再删缓存"},
                {"role": "assistant", "content": "了解,Redis Cache-Aside + write-through 策略。"},
                {"role": "user", "content": "部署方案:本地用 Docker Compose,生产上 AWS ECS,CI/CD 走 GitHub Actions 自动金丝雀发布"},
                {"role": "assistant", "content": "部署流水线已记录。"},
                {"role": "user", "content": "预算上限 15 万,服务器 3 万一年,API 调用预留 2 万每月"},
                {"role": "assistant", "content": "预算约束已记录。"},
            ]

            # 一行代码完成「提取 + 去重 + 向量化 + 存储」
            add_result = memory.add(decisions_conversation, user_id="dev_team_lead")

            print("=== 长期 Write:mem0.add() 提取的记忆条目 ===")
            for item in add_result.get("results", []):
                event = item.get("event", "UNKNOWN")
                mem_text = item.get("memory", "")
                print(f"  [{event}] {mem_text}")

            # === 长期 Write:mem0.add() 提取的记忆条目 ===
              # [ADD] 数据库决定用 PostgreSQL,项目有大量关联查询,团队熟悉度高,配合 SQLAlchemy 2.0 做 async
              # [ADD] 缓存方案定了,用 Redis Cache-Aside 模式,热点数据 TTL 设 300 秒,写操作先更新 DB 再删缓存
              # [ADD] 部署方案:本地用 Docker Compose,生产上 AWS ECS,CI/CD 走 GitHub Actions 自动金丝雀发布
              # [ADD] 预算上限 15 万,服务器 3 万一年,API 调用预留 2 万每月


            # 验证:search 能检索到刚才写入的记忆
            search_result = memory.search("项目用什么数据库", user_id="dev_team_lead")
            print(f'\n=== 验证:search("项目用什么数据库") ===')
            for item in search_result.get("results", []):
                print(f"  [score={item['score']:.2f}] {item['memory']}")

            # === 验证:search("项目用什么数据库") ===
              # [score=0.54] 数据库决定用 PostgreSQL,项目有大量关联查询,团队熟悉度高,配合 SQLAlchemy 2.0 做 async
              # [score=0.51] 缓存方案定了,用 Redis Cache-Aside 模式,热点数据 TTL 设 300 秒,写操作先更新 DB 再删缓存
              # [score=0.49] 预算上限 15 万,服务器 3 万一年,API 调用预留 2 万每月
              # [score=0.45] 部署方案:本地用 Docker Compose,生产上 AWS ECS,CI/CD 走 GitHub Actions 自动金丝雀发布


            # Token 对比
            mem_texts = [item.get("memory", "") for item in add_result.get("results", [])]
            mem_tokens = sum(count_tokens(t) for t in mem_texts)
            print(f"\n=== 三层 Write 的 Token 经济学对比 ===")
            print(f"原始对话:     {original_tokens} tokens(完整历史)")
            print(f"短期 Write:   {summary_tokens} tokens(压缩摘要,保留在 session 内)")
            print(f"长期 Write:   {mem_tokens} tokens({len(mem_texts)} 条结构化记忆,永久存入向量库)")
            # === 三层 Write 的 Token 经济学对比 ===
            # 原始对话:     79 tokens(完整历史)
            # 短期 Write:   53 tokens(压缩摘要,保留在 session 内)
            # 长期 Write:   108 tokens(4 条结构化记忆,永久存入向量库)

        # 🚀 === 任务状态层的 Write:Scratchpad / todo.md
            """
            除了记忆层的两种 Write,还有一种在生产 Agent 中极为常见的 Write 形态:把任务执行进度写入结构化文件(如 `todo.md`、`CLAUDE.md`),
            让 Agent 在上下文窗口被重置后能恢复执行状态。这对应我们在 2.6 节介绍的「任务状态层」--Scratchpad 就是 Agent 的「草稿纸」。

            与前两种 Write 的关键区别:短期压缩保留的是对话语义,mem0 提取的是用户知识,而 todo.md 记录的是任务进度--哪些步骤做完了、当前卡在哪、下一步是什么。
            下面模拟一个多步骤项目任务,展示 Agent 如何通过 Write to Scratchpad 实现「断点续传」:
            """

            import json, os

            TODO_FILE = "./todo_demo.md"

            # ---- 第一阶段:Agent 执行任务并实时写入进度 ----
            task_plan = [
                {"step": 1, "task": "初始化 PostgreSQL 连接池", "status": "done", "result": "pool_size=20, max_overflow=10"},
                {"step": 2, "task": "创建 users 表迁移脚本", "status": "done", "result": "alembic revision --autogenerate 完成"},
                {"step": 3, "task": "实现 JWT 认证中间件", "status": "in_progress", "result": "refresh token 逻辑未完成"},
                {"step": 4, "task": "配置 Redis 缓存层", "status": "pending", "result": ""},
                {"step": 5, "task": "编写 API 集成测试", "status": "pending", "result": ""},
            ]

            # Agent 将当前进度写入 todo.md(Write to Scratchpad)
            def write_todo(tasks, filepath):
                lines = ["# 项目任务进度\n\n"]
                status_icon = {"done": "[x]", "in_progress": "[-]", "pending": "[ ]"}
                for t in tasks:
                    icon = status_icon[t["status"]]
                    line = f"{icon} Step {t['step']}: {t['task']}"
                    if t["result"]:
                        line += f" → {t['result']}"
                    lines.append(line + "\n")
                with open(filepath, "w") as f:
                    f.writelines(lines)

            write_todo(task_plan, TODO_FILE)
            print("=== Agent 写入 todo.md(模拟执行到 Step 3 中断)===")
            print(open(TODO_FILE).read())

            # === Agent 写入 todo.md(模拟执行到 Step 3 中断)===
            ## 项目任务进度

            # [x] Step 1: 初始化 PostgreSQL 连接池 → pool_size=20, max_overflow=10
            # [x] Step 2: 创建 users 表迁移脚本 → alembic revision --autogenerate 完成
            # [-] Step 3: 实现 JWT 认证中间件 → refresh token 逻辑未完成
            # [ ] Step 4: 配置 Redis 缓存层
            # [ ] Step 5: 编写 API 集成测试


            # ---- 第二阶段:模拟上下文重置(新会话/auto-compact 后)----
            # Agent 读回 todo.md,恢复执行状态
            def read_todo(filepath):
                with open(filepath) as f:
                    content = f.read()
                # 解析出当前进度
                done = content.count("[x]")
                in_progress = content.count("[-]")
                pending = content.count("[ ]")
                return content, done, in_progress, pending

            content, done, in_prog, pending = read_todo(TODO_FILE)
            print("=== 新会话:Agent 读取 todo.md 恢复状态 ===")
            print(f"已完成: {done} | 进行中: {in_prog} | 待开始: {pending}")
            print(f"→ Agent 决策:继续 Step 3(JWT refresh token),无需从头开始")

            # === 新会话:Agent 读取 todo.md 恢复状态 ===
            # 已完成: 2 | 进行中: 1 | 待开始: 2
            # → Agent 决策:继续 Step 3(JWT refresh token),无需从头开始

            # Token 对比:todo.md vs 完整对话历史
            todo_tokens = count_tokens(content)
            # 假设完成前 3 步产生了约 20 轮对话
            estimated_history = "user: ...\nassistant: ...\n" * 20
            history_tokens = count_tokens(estimated_history) * 5  # 真实对话每轮约 200 tokens
            print(f"\n=== Scratchpad Write 的 Token 经济学 ===")
            print(f"todo.md:        {todo_tokens} tokens(结构化进度)")
            print(f"完整对话历史:   ~{history_tokens} tokens(20 轮对话估算)")
            print(f"恢复执行所需上下文:只需 todo.md + 当前步骤描述,不需要回放全部历史")

            # === Scratchpad Write 的 Token 经济学 ===
            # todo.md:        103 tokens(结构化进度)
            # 完整对话历史:   ~700 tokens(20 轮对话估算)
            # 恢复执行所需上下文:只需 todo.md + 当前步骤描述,不需要回放全部历史

            # 清理
            os.remove(TODO_FILE)


    # 🎯 Select运行时检索
    # 记忆注入层 | 外部知识层
    # ----------------------------------------------------------------------------------------------------------------
        # 🚀 === memo0 memory.search 向量语义搜索  向量招回与本次任务相关的记忆，而不是memory中的所有记忆
            # 场景:Agent 收到新任务--"帮我配置数据库连接池"
            # Select 策略:先搜索长期记忆,看项目之前做过什么技术决策
            task_query = "服务器预算"
            results = memory.search(query=task_query, user_id="dev_team_lead", limit=2)

            print(f'=== memory.search("{task_query}") ===')
            print(f"召回 {len(results.get('results', []))} 条相关记忆:\n")
            for item in results.get("results", []):
                score = item.get("score", 0)
                mem = item.get("memory", "")
                print(f"  [相关度 {score:.2f}] {mem}")

            # === memory.search("服务器预算") ===
            # 召回 2 条相关记忆:

              # [相关度 0.65] 预算上限 15 万,服务器 3 万一年,API 调用预留 2 万每月
              # [相关度 0.42] 缓存方案定了,用 Redis Cache-Aside 模式,热点数据 TTL 设 300 秒,写操作先更新 DB 再删缓存


            # 对比:换一个与已有记忆无关的查询
            irrelevant_query = "本地部署方案"
            irr_results = memory.search(query=irrelevant_query, user_id="dev_team_lead", limit=2)
            print(f'\n=== memory.search("{irrelevant_query}") ===')
            print(f"召回 {len(irr_results.get('results', []))} 条记忆:\n")
            for item in irr_results.get("results", []):
                score = item.get("score", 0)
                mem = item.get("memory", "")
                print(f"  [相关度 {score:.2f}] {mem}")

            # === memory.search("本地部署方案") ===
            # 召回 2 条记忆:

              # [相关度 0.52] 部署方案:本地用 Docker Compose,生产上 AWS ECS,CI/CD 走 GitHub Actions 自动金丝雀发布
              # [相关度 0.37] 缓存方案定了,用 Redis Cache-Aside 模式,热点数据 TTL 设 300 秒,写操作先更新 DB 再删缓存

            # Token 节省分析:全量 vs Select
            all_mems = memory.get_all(user_id="dev_team_lead")
            all_text = "\n".join(m.get("memory", "") for m in all_mems.get("results", []))
            selected_text = "\n".join(
                item.get("memory", "") for item in results.get("results", [])
                if item.get("score", 0) > 0.3  # 只保留相关度 > 0.3 的记忆
            )
            print(f"\n=== Select 效果:语义过滤的 Token 节省 ===")
            print(f"记忆库全量注入: {count_tokens(all_text)} tokens({len(all_mems.get('results', []))} 条)")
            print(f"Select 后注入:  {count_tokens(selected_text)} tokens(仅高相关度条目)")
            if count_tokens(all_text) > 0:
                print(f"节省:           {(1 - count_tokens(selected_text)/count_tokens(all_text))*100:.0f}%")

            # === Select 效果:语义过滤的 Token 节省 ===
            # 记忆库全量注入: 111 tokens(4 条)
            # Select 后注入:  56 tokens(仅高相关度条目)
            # 节省:           50%

        # 🚀 === Glob + Grep 文件精确检索
            """
            前一种 Select 操作的是结构化数据(向量数据库),而 Glob + Grep 操作的是**非结构化的文件系统**。
            这是 Coding Agent(如 Claude Code、Cursor)最核心的 Select 能力:面对一个几万文件的代码仓库,Agent 不可能把所有文件都读进上下文,
            必须先用 Glob 按文件名模式缩小范围,再用 Grep 按关键词精确定位。
            """
            # === Select 策略:Glob + Grep 文件精确检索 ===
            import glob, os, shutil

            # 构建模拟项目目录(实际 Agent 操作真实代码仓库)
            PROJECT = "./select_demo_project"
            os.makedirs(f"{PROJECT}/backend/api", exist_ok=True)
            os.makedirs(f"{PROJECT}/backend/graph", exist_ok=True)
            os.makedirs(f"{PROJECT}/backend/models", exist_ok=True)
            os.makedirs(f"{PROJECT}/frontend/src", exist_ok=True)

            mock_files = {
                f"{PROJECT}/backend/api/chat.py": (
                    "from fastapi import APIRouter\n"
                    "# SSE 流式端点,处理用户消息\n"
                    "async def chat_stream(request):\n"
                    "    session = SessionManager()\n"
                    "    response = await agent.invoke(request.message)\n"
                ),
                f"{PROJECT}/backend/graph/agent.py": (
                    "from langchain_deepseek import ChatDeepSeek\n"
                    "from mem0 import Memory\n"
                    "MAX_HISTORY = 20\n"
                    "class AgentManager:\n"
                    "    def __init__(self):\n"
                    "        self.memory = Memory.from_config(config)\n"
                ),
                f"{PROJECT}/backend/graph/session_manager.py": (
                    "import json\n"
                    "class SessionManager:\n"
                    "    def compress_history(self, messages):\n"
                    "        # LLM 摘要压缩,保留决策链\n"
                    "        summary = llm.invoke(compress_prompt)\n"
                ),
                f"{PROJECT}/backend/graph/mem0_manager.py": (
                    "from mem0 import Memory\n"
                    "def get_typed_context(user_id, query):\n"
                    "    results = memory.search(query, user_id=user_id)\n"
                    "    return group_by_type(results)\n"
                ),
                f"{PROJECT}/backend/models/database.py": (
                    "from sqlalchemy import create_engine\n"
                    "DATABASE_URL = os.getenv('DATABASE_URL')\n"
                    "engine = create_engine(DATABASE_URL, pool_size=10)\n"
                ),
                f"{PROJECT}/frontend/src/App.tsx": (
                    "import React from 'react'\n"
                    "function App() { return <ChatWindow /> }\n"
                ),
            }

            for path, content in mock_files.items():
                with open(path, "w") as f:
                    f.write(content)

            # ✈ Step 1: Glob - 按文件名模式快速圈定范围
            pattern = f"{PROJECT}/backend/**/*.py"
            py_files = glob.glob(pattern, recursive=True) # 检索出项目中的所有后端项目中的py文件
            print(f"=== Step 1: Glob(\"{pattern}\") ===")
            print(f"匹配 {len(py_files)} 个 Python 文件:")
            for f in py_files:
                print(f"  {f}")

            # ✈ Step 2: Grep - 按关键词从候选文件中精确筛选
            keyword = "Memory"
            print(f'\n=== Step 2: Grep(\"{keyword}\") - 在 Glob 结果中搜索 ===')
            matched = []
            for filepath in py_files:
                with open(filepath) as f:
                    content = f.read()
                hits = [(i+1, line.strip()) for i, line in enumerate(content.split("\n")) if keyword in line]
                if hits:
                    matched.append(filepath)
                    for lineno, line in hits:
                        print(f"  {os.path.basename(filepath)}:{lineno}  {line}")

            # Token 节省分析
            all_content = "\n".join(open(f).read() for f in py_files)
            sel_content = "\n".join(open(f).read() for f in matched)
            print(f"\n=== Select 效果:两阶段过滤的 Token 节省 ===")
            print(f"项目全部文件:  6 个(含前端)")
            print(f"Glob 过滤后:   {len(py_files)} 个 Python 文件 → {count_tokens(all_content)} tokens")
            print(f"Grep 精筛后:   {len(matched)} 个含 Memory 的文件 → {count_tokens(sel_content)} tokens")
            print(f"两阶段节省:    {(1 - count_tokens(sel_content)/max(count_tokens(all_content),1))*100:.0f}%")

            # 清理
            shutil.rmtree(PROJECT)

            # === Step 1: Glob("./select_demo_project/backend/**/*.py") ===
            # 匹配 5 个 Python 文件:
            #   ./select_demo_project/backend/api/chat.py
            #   ./select_demo_project/backend/graph/agent.py
            #   ./select_demo_project/backend/graph/mem0_manager.py
            #   ./select_demo_project/backend/graph/session_manager.py
            #   ./select_demo_project/backend/models/database.py

            # === Step 2: Grep("Memory") - 在 Glob 结果中搜索 ===
            #   agent.py:2  from mem0 import Memory
            #   agent.py:6  self.memory = Memory.from_config(config)
            #   mem0_manager.py:1  from mem0 import Memory

            # === Select 效果:两阶段过滤的 Token 节省 ===
            # 项目全部文件:  6 个(含前端)
            # Glob 过滤后:   5 个 Python 文件 → 199 tokens
            # Grep 精筛后:   2 个含 Memory 的文件 → 83 tokens
            # 两阶段节省:    58%

        # 🚀 ===  LlamaIndex Embedding + BM25混合召回
            from llama_index.core import VectorStoreIndex, Document
            from llama_index.core.node_parser import SentenceSplitter
            from llama_index.embeddings.openai import OpenAIEmbedding
            from llama_index.retrievers.bm25 import BM25Retriever
            from llama_index.core.retrievers import QueryFusionRetriever
            from llama_index.embeddings.dashscope import DashScopeEmbedding

            # 构造知识库文档(模拟 Agent 的外部知识源--技术运维手册)
            knowledge_docs = [
                Document(text="PostgreSQL 连接池推荐 pgbouncer,transaction 模式下单连接可复用,"
                               "默认 max_connections 设为 CPU 核心数 × 2 + 1,超过此值性能反而下降。"),
                Document(text="Redis Cache-Aside 标准流程:读请求先查缓存,miss 则查 DB 并回填;"
                               "写请求先更新 DB 再删缓存键,TTL 推荐 300 秒。"),
                Document(text="Docker Compose 适合本地开发,volumes 挂载实现热重载;"
                               "生产环境推荐 AWS ECS 或 Kubernetes,配合 ALB 做负载均衡。"),
                Document(text="LangChain Agent 工具定义需包含 name、description、func 三字段。"
                               "description 质量直接影响工具选择准确率,建议包含使用场景和输入格式说明。"),
                Document(text="向量数据库选型:Qdrant 适合中小规模(百万级),Milvus 适合大规模(亿级),"
                               "Chroma 适合原型验证,Pinecone 适合免运维的云端场景。"),
                Document(text="金丝雀发布策略:先切 5% 流量到新版本,监控 P99 延迟和错误率 15 分钟,"
                               "无异常后按 5→25→50→100% 逐步扩大。回滚阈值:错误率 >1% 或 P99 >500ms。"),
            ]

            # ---- 通道 A:Embedding 向量语义召回 ----
            embed_model = OpenAIEmbedding(
                model_name="text-embedding-3-small",
                api_key=os.getenv("OPENAI_API_KEY"),
            )

            # 设置 Qwen Embedding模型
            # embed_model = DashScopeEmbedding(
            #     model_name="text-embedding-v4",
            #     api_key=os.getenv("DASHSCOPE_API_KEY"),
            #     api_base=os.getenv("DASHSCOPE_BASE_URL", "https://api.dashscope.aliyuncs.com")
            # )

            splitter = SentenceSplitter(chunk_size=256, chunk_overlap=20)
            nodes = splitter.get_nodes_from_documents(knowledge_docs)
            index = VectorStoreIndex(nodes, embed_model=embed_model)
            vector_retriever = index.as_retriever(similarity_top_k=3)

            query = "数据库连接池怎么配置"
            vector_results = vector_retriever.retrieve(query)

            print(f'=== 通道 A:Embedding 语义召回(query="{query}")===')
            for r in vector_results:
                print(f"  [score={r.score:.3f}] {r.text[:80]}...")

            # ---- 通道 B:BM25 关键词召回(LlamaIndex 内置)----
            # skip_stemming=True:跳过英文词干提取(中文无此需求)
            # token_pattern:中文按字切分 + 英文按词切分(BM25 中文场景标准配置)
            bm25_retriever = BM25Retriever.from_defaults(
                nodes= ,
                similarity_top_k=3,
                skip_stemming=True,
                token_pattern=r"[\u4e00-\u9fff]|[a-zA-Z0-9]+",
            )

            bm25_results = bm25_retriever.retrieve(query)
            print(f'\n=== 通道 B:BM25 关键词召回 ===')
            for r in bm25_results:
                print(f"  [score={r.score:.3f}] {r.text[:80]}...")

            # ---- QueryFusionRetriever:内置 RRF 合并两路结果 ----
            # mode="reciprocal_rerank":Reciprocal Rank Fusion,按排名倒数加权合并
            fusion_retriever = QueryFusionRetriever(
                retrievers=[vector_retriever, bm25_retriever],
                similarity_top_k=3,
                num_queries=1,             # 不做查询扩展,直接用原始 query
                mode="reciprocal_rerank",  # RRF 合并策略
                use_async=False,
            )

            fusion_results = fusion_retriever.retrieve(query)
            print(f'\n=== QueryFusionRetriever 混合召回(RRF 合并)===')
            for r in fusion_results:
                print(f"  [rrf={r.score:.4f}] {r.text[:80]}...")

        # 🚀 ===  Skills路由:意图分类驱动的上下文切换
            from langchain_core.tools import tool
            # ---- Skill A:代码调试(3 个工具)----
            @tool
            def read_file(path: str) -> str:
                """读取指定路径的源代码文件,返回文件内容和行号"""
                return f"[模拟] 文件内容: {path}"

            @tool
            def search_codebase(query: str) -> str:
                """在代码仓库中搜索关键词,返回匹配的文件路径和行号"""
                return f"[模拟] 搜索结果: {query}"

            @tool
            def run_tests(test_path: str) -> str:
                """运行指定路径的测试文件,返回通过/失败结果"""
                return f"[模拟] 测试通过: {test_path}"

            # ---- Skill B:部署运维(3 个工具)----
            @tool
            def deploy_staging(version: str) -> str:
                """将指定版本部署到 staging 环境,返回部署状态"""
                return f"[模拟] staging 部署完成: {version}"

            @tool
            def check_health(env: str) -> str:
                """检查指定环境的服务健康状态,返回 HTTP 状态码"""
                return f"[模拟] {env} 健康: 200 OK"

            @tool
            def rollback_deploy(env: str) -> str:
                """回滚指定环境到上一个稳定版本"""
                return f"[模拟] {env} 已回滚"

            # ---- Skill C:记忆管理(2 个工具)----
            @tool
            def save_memory(content: str) -> str:
                """将用户偏好或项目决策保存到长期记忆库"""
                return f"[模拟] 已保存记忆: {content}"

            @tool
            def search_memories(query: str) -> str:
                """在长期记忆库中搜索相关记忆条目"""
                return f"[模拟] 记忆检索: {query}"

            from pydantic import BaseModel, Field

            # Skill 注册表:description 供 LLM 分类器阅读,tools 和 system_prompt 在分类后加载
            skill_registry = {
                "code_debug": {
                    "description": "代码调试与错误排查:处理报错信息、定位 bug 根因、运行测试验证修复",
                    "tools": [read_file, search_codebase, run_tests],
                    "system_prompt": "你是代码调试专家。先复现问题,再定位根因,最后验证修复。",
                },
                "deploy_ops": {
                    "description": "部署与运维操作:发布新版本到各环境、健康检查、回滚、金丝雀发布流程",
                    "tools": [deploy_staging, check_health, rollback_deploy],
                    "system_prompt": "你是部署运维专家。严格执行金丝雀发布流程,每步都要健康检查。",
                },
                "memory_manage": {
                    "description": "记忆管理:保存用户偏好和项目决策到长期记忆、检索历史记忆",
                    "tools": [save_memory, search_memories],
                    "system_prompt": "你是记忆管理助手。帮用户管理长期偏好和项目上下文。",
                },
            }

            class SkillIntent(BaseModel):
                """用户意图分类结果"""
                skill_id: str = Field(description="匹配的 Skill ID,必须是 code_debug / deploy_ops / memory_manage 之一")
                confidence: float = Field(description="分类置信度 0.0-1.0")

            # 分类 prompt:列出所有 Skill 的 description,让 LLM 选择
            skill_descriptions = "\n".join(
                f"- {sid}: {s['description']}" for sid, s in skill_registry.items()
            )



            classify_prompt = f"""根据用户消息,从以下 Skills 中选择最匹配的一个:

            {skill_descriptions}

            返回 skill_id 和 confidence。"""

            classifier = llm.with_structured_output(SkillIntent)
            print("Skill 注册表和 LLM 分类器已构建")
            print(f"分类器输入的 Skill 描述:\n{skill_descriptions}")
            # Skill 注册表和 LLM 分类器已构建
            # 分类器输入的 Skill 描述:
            # - code_debug: 代码调试与错误排查:处理报错信息、定位 bug 根因、运行测试验证修复
            # - deploy_ops: 部署与运维操作:发布新版本到各环境、健康检查、回滚、金丝雀发布流程
            # - memory_manage: 记忆管理:保存用户偏好和项目决策到长期记忆、检索历史记忆


            # === Skills 路由--步骤 3:端到端演示(分类 → 装配 → Token 对比)===

            test_messages = [
                "代码报错了,AgentManager 初始化失败",
                "把新版本部署到 staging 环境",
                "帮我记住:以后 code review 要检查 token 消耗",
            ]

            # 基线:如果不做 Skills 路由,Agent 需要加载全部 8 个工具的描述
            all_tools = [t for s in skill_registry.values() for t in s["tools"]]

            all_tools_desc = "\n".join(f"{t.name}: {t.description}" for t in all_tools)

            all_tokens = count_tokens(all_tools_desc)

            for msg in test_messages:
                # Stage 1:LLM 意图分类
                intent = classifier.invoke(f"{classify_prompt}\n\n用户消息: {msg}")
                skill = skill_registry[intent.skill_id]

                # Stage 2:只装配选中 Skill 的工具(Select 的核心价值)
                skill_tools_desc = "\n".join(f"{t.name}: {t.description}" for t in skill["tools"])
                skill_tokens = count_tokens(skill_tools_desc)

                print(f'用户: "{msg}"')
                print(f'  → LLM 分类: {intent.skill_id} (confidence={intent.confidence})')
                print(f'    装配工具: {[t.name for t in skill["tools"]]}')
                print(f'    系统提示: "{skill["system_prompt"][:40]}..."')
                print(f'    Token: 全量 {all_tokens} → Skill {skill_tokens}(节省 {(1-skill_tokens/all_tokens)*100:.0f}%)')
                print()

            # ---- 真正的 Agent 构造:用最后一条消息演示上下文装配 ----
            from langchain.agents import create_agent
            from langchain_core.prompts import ChatPromptTemplate

            last_msg = test_messages[-1]  # "帮我记住:以后 code review 要检查 token 消耗"
            intent = classifier.invoke(f"{classify_prompt}\n\n用户消息: {last_msg}")
            selected_skill = skill_registry[intent.skill_id]

            # 构造 Agent:只传入选中 Skill 的工具和系统提示
            prompt = ChatPromptTemplate.from_messages([
                ("system", selected_skill["system_prompt"]),  # ← system_prompt 真正传入
                ("placeholder", "{chat_history}"),
                ("human", "{input}"),
                ("placeholder", "{agent_scratchpad}"),
            ])

            agent = create_agent(
                llm,
                tools=selected_skill["tools"],  # ← tools 真正传入上下文
                prompt=prompt,
            )

            print(f"\n=== 真正的 Agent 调用(用户: \"{last_msg}\")===")
            print(f"选中 Skill: {intent.skill_id}")
            print(f"Agent 可见工具: {[t.name for t in selected_skill['tools']]}")
            print(f"Agent 系统提示: {selected_skill['system_prompt']}")

            # 调用 Agent
            # from langchain.agents import AgentExecutor (removed in 1.3.4+, use LangGraph)
            # agent_executor = AgentExecutor(nt=agent, tools=selected_skill["tools"], verbose=False)
            result = agent_executor.invoke({"input": last_msg})

            print(f"\nAgent 响应: {result['output']}")
            print(f"\n✓ 验证:Agent 只能调用 {intent.skill_id} Skill 的 {len(selected_skill['tools'])} 个工具")
            print(f"  (而非全部 {len(all_tools)} 个工具)")
            # 用户: "代码报错了,AgentManager 初始化失败"
            #   → LLM 分类: code_debug (confidence=0.95)
            #     装配工具: ['read_file', 'search_codebase', 'run_tests']
            #     系统提示: "你是代码调试专家。先复现问题,再定位根因,最后验证修复。..."
            #     Token: 全量 139 → Skill 54(节省 61%)

            # 用户: "把新版本部署到 staging 环境"
            #   → LLM 分类: deploy_ops (confidence=0.95)
            #     装配工具: ['deploy_staging', 'check_health', 'rollback_deploy']
            #     系统提示: "你是部署运维专家。严格执行金丝雀发布流程,每步都要健康检查。..."
            #     Token: 全量 139 → Skill 51(节省 63%)

            # 用户: "帮我记住:以后 code review 要检查 token 消耗"
            #   → LLM 分类: memory_manage (confidence=0.95)
            #     装配工具: ['save_memory', 'search_memories']
            #     系统提示: "你是记忆管理助手。帮用户管理长期偏好和项目上下文。..."
            #     Token: 全量 139 → Skill 32(节省 77%)

            # === 分类后的 Agent 构造(伪代码)===
            # # 只加载 2 个工具,而非全部 8 个


    # 🎯 Compress上下文压缩
    # 对话历史层 | 工具上下文层
    # ----------------------------------------------------------------------------------------------------------------
        # 🚀 === compaction 压缩重启
            """
            注意它和前面短期记忆压缩的关键区别:短期记忆是「压缩早期 + 保留最近」,
            而 Compaction 是全量压缩将**整个对话历史**(包括工具调用、代码修改、测试结果)
            压缩为一条结构化的 `SystemMessage`,然后用这条摘要**替换**全部原始消息,开启新的上下文窗口继续工作:
            """
            from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
            # ---- 步骤 1:构造一段工具密集型的 Agent 对话(模拟 Claude Code 场景)----
            # 注意:Compaction 场景包含 user / assistant / tool 三种角色,
            # 而短期记忆场景只有 user / assistant 两种
            messages = [
                HumanMessage(content="帮我重构 auth 模块,支持 OAuth2 认证流程"),
                AIMessage(content="好的,先读取当前代码结构。\n[调用 read_file('auth.py')]"),
                AIMessage(content="[tool result] auth.py: 340行,含 BasicAuth 类,使用 session-based 认证"),
                AIMessage(content="分析完成。当前使用 BasicAuth,需新增 OAuth2Provider。\n"
                         "决策:采用 refresh_token 流程,token 存储于 Redis,增加速率限制。\n"
                         "[调用 edit_file('auth.py')]"),
                AIMessage(content="[tool result] auth.py 已修改:+OAuth2Provider 类,+token 刷新逻辑,共新增 180 行"),
                HumanMessage(content="再加上单元测试"),
                AIMessage(content="编写 12 个测试用例覆盖 OAuth2 核心流程。\n[调用 write_file('test_auth.py')]"),
                AIMessage(content="[tool result] test_auth.py 创建成功,含 12 个测试用例"),
                HumanMessage(content="运行测试看看结果"),
                AIMessage(content="[调用 run_tests('test_auth.py')]"),
                AIMessage(content="[tool result] 11/12 通过,1 个 token 过期边界用例不稳定(偶发 timing issue)"),
                AIMessage(content="测试结果:11/12 通过。不稳定用例是 test_token_expiry_boundary,"
                         "原因是 timing 精度问题,下一步需要用 mock time 修复。"),
            ]

            total_tokens = sum(count_tokens(m.content) for m in messages)
            print(f"=== Compaction 前 ===")
            print(f"消息数: {len(messages)} 条(含 user/assistant/tool 三种角色)")
            print(f"总 tokens: {total_tokens}")
            # ---- 步骤 2:检测是否达到阈值,触发全量 Compaction ----
            MAX_CONTEXT_TOKENS = 150   # 演示用小阈值(生产环境 Claude Code 用 200K * 95%)

            # ---- 步骤 2:检测是否达到阈值,触发全量 Compaction ----
            if total_tokens > MAX_CONTEXT_TOKENS * 0.95:
                # 关键区别:Compaction 压缩 **全部** 消息,不保留最近消息原文
                full_text = "\n".join(f"[{m.type}] {m.content}" for m in messages)

                # 结构化压缩提示词:要求 LLM 输出 Claude Code 风格的 Compaction Summary
                compress_prompt = f"""请将以下 Agent 对话历史压缩为结构化摘要。

                对话内容:
                {full_text}

                输出要求(严格按以下五个字段输出,每个字段一行):
                Task: 一句话描述用户的核心任务
                Files modified: 列出所有被修改或创建的文件及关键变更
                Decisions: 列出做出的关键技术决策
                Status: 当前进度和测试结果
                Next: 下一步待做的事项"""

                summary = llm.invoke(compress_prompt).content # 调用大模型进行压缩

                # 关键操作:用 SystemMessage(结构化摘要) 替换 **整个** 消息列表
                compacted = [SystemMessage(content=f"[Compaction Summary]\n{summary}")]
            else:
                compacted = messages
                summary = ""
                print("未达阈值,无需 Compaction")

            # ---- 步骤 3:展示压缩结果 ----
            compacted_tokens = sum(count_tokens(m.content) for m in compacted)
            print(f"\n=== Compaction 后 ===")
            print(f"消息数: {len(messages)} → {len(compacted)}"
                  f"(全部 {len(messages)} 条被压缩为 1 条 SystemMessage)")
            print(f"Tokens: {total_tokens} → {compacted_tokens}"
                  f"(压缩率 {(1 - compacted_tokens/total_tokens)*100:.0f}%)")
            print(f"\n--- Compaction Summary ---")
            print(compacted[0].content)

            # ---- 步骤 4:验证--压缩后 LLM 仍能回答早期问题 ----
            verify_msgs = compacted + [HumanMessage(content="我们之前定的认证方案是什么?一句话回复")]
            answer = llm.invoke(verify_msgs).content
            print(f"\n=== 验证:压缩后仍能回答早期决策 ===")
            print(f"  Q: 我们之前定的认证方案是什么?")
            print(f"  A: {answer}")

        # 🚀 === 硬截断 trim_messages
            """
            trim_messages 是最直接的压缩方式--不调用 LLM,直接按 token 上限从后往前保留消息。优点是零成本零延迟,缺点是早期信息直接丢弃:
            """
            from langchain_core.messages import HumanMessage, AIMessage, trim_messages

            # 1. 构造 12 轮对话历史(包含关键技术决策)
            messages = []
            decisions = ["选 PostgreSQL", "用 Redis 缓存", "JWT 认证", "Docker 部署",
                         "pool_size=50", "GitHub Actions CI", "ELK 日志", "Sentry 监控",
                         "slowapi 限流", "React 前端", "Zustand 状态管理", "pytest 测试"]
            for i, decision in enumerate(decisions):
                messages.append(HumanMessage(content=f"第{i+1}个技术决策是什么?"))
                messages.append(AIMessage(content=f"决策{i+1}:{decision}。理由是团队熟悉度高、社区生态成熟、与现有架构兼容。"))

            original_tokens = sum(count_tokens(m.content) for m in messages)
            print(f"原始消息: {len(messages)} 条({len(messages)//2} 轮),约 {original_tokens} tokens")

            # 2. 硬截断:只保留最近 N 条消息
            # token_counter=len 让 max_tokens 以「消息条数」为单位(LangChain 设计)
            trimmed = trim_messages(
                messages,
                strategy="last",       # 从后往前保留
                max_tokens=8,          # 保留最近 8 条消息(4 轮)
                token_counter=len,     # len = 按消息条数计(非 token 数)
                start_on="human",      # 确保从 human 消息开始
            )

            trimmed_tokens = sum(count_tokens(m.content) for m in trimmed)
            kept_rounds = len(trimmed) // 2
            lost_rounds = len(decisions) - kept_rounds

            lost_list = ", ".join(decisions[:lost_rounds])
            kept_list = ", ".join(decisions[lost_rounds:])
            print(f"\n丢失的早期决策({lost_rounds}个): {lost_list}")
            print(f"保留的近期决策({kept_rounds}个): {kept_list}")
            print(f"\n 硬截断的代价:前 {lost_rounds} 个关键决策(PostgreSQL、Redis 等)被直接丢弃,不可恢复")

        # 🚀 === LLM 摘要压缩:SummarizatoinMiddleware
            from langchain.agents import create_agent
            # from langchain.agents.middleware import SummarizationMiddleware (removed in 1.3.4+)
            from langchain_core.messages import HumanMessage
            from langgraph.checkpoint.memory import InMemorySaver

            checkpointer = InMemorySaver()

            # 创建带摘要中间件的 Agent
            agent = create_agent(
                model=llm,               # 复用前面初始化的 DeepSeek 模型
                tools=[],                # 纯对话演示,不需要工具
                middleware=[
                    SummarizationMiddleware(
                        model=llm,                   # 同模型做摘要(生产环境可用更便宜的小模型)
                        trigger=("tokens", 300),     # 触发阈值(演示用小值,生产通常 4000-8000)
                        keep=("messages", 6),        # 保留最近 6 条原文不压缩
                    )
                ],
                checkpointer=checkpointer,          # 状态持久化(摘要需要跨轮次保存)
            )

            # 用相同的 12 轮技术决策对话测试
            config = {"configurable": {"thread_id": "compress-demo"}}
            decisions = ["选 PostgreSQL", "用 Redis 缓存", "JWT 认证", "Docker 部署",
                        "pool_size=50", "GitHub Actions CI", "ELK 日志", "Sentry 监控",
                        "slowapi 限流", "React 前端", "Zustand 状态管理", "pytest 测试"]

            print("=== 逐轮发送技术决策,观察 SummarizationMiddleware 压缩过程 ===\n")
            for i, decision in enumerate(decisions):
                response = agent.invoke(
                    {"messages": [HumanMessage(content=f"记住第{i+1}个技术决策:{decision}。理由:团队熟悉度高、社区成熟。")]},
                    config
                )
                msgs = response["messages"]
                msg_count = len(msgs)
                expected = (i + 1) * 2  # 无压缩时的预期消息数

                if msg_count < expected:
                    # 压缩已触发,第一条消息是摘要
                    summary_preview = msgs[0].content[:200].replace('\n', ' ')
                    latest_reply = msgs[-1].content[:100].replace('\n', ' ')
                    print(f"轮次 {i+1:2d} | 消息数: {msg_count:3d}(无压缩应为 {expected:2d})← 压缩中")
                    print(f"         [摘要] {summary_preview}...")
                    print(f"         [最新] {latest_reply}...")
                    print()
                else:
                    print(f"轮次 {i+1:2d} | 消息数: {msg_count:3d}(无压缩应为 {expected:2d})")

            # 最终验证
            print("=== 验证:早期决策是否被摘要保留 ===")
            final = agent.invoke({"messages": [HumanMessage(content="请列出之前所有的技术决策")]}, config)
            print(final["messages"][-1].content[:500])

        # 🚀 === 工具结果清除 Tool Result Clearing
            # 核心机制:工具调用完成后,将 ToolMessage 的原始返回值替换为占位符,
            # 仅保留"调用了什么工具"的事实,依赖 Agent 的 AIMessage 携带关键结论。
            from langchain_core.messages import HumanMessage, AIMessage, ToolMessage
            import time

            # 模拟 Agent 分析项目依赖的完整消息链(2 次工具调用)
            original_messages = [
                HumanMessage(content="这个项目用了哪些核心依赖?各自什么版本?有没有已知的兼容性问题?"),

                # Step 1: Agent 决定查看 requirements.txt
                AIMessage(
                    content="我先查看项目的依赖配置文件,确认核心依赖和版本信息。",
                    tool_calls=[{"name": "read_file", "args": {"path": "requirements.txt"}, "id": "call_1"}]
                ),
                # 工具返回完整文件内容(大量 token)
                ToolMessage(content="""# Core dependencies
                fastapi==0.104.1
                uvicorn[standard]==0.24.0
                pydantic==2.5.0
                sqlalchemy==2.0.23
                alembic==1.13.0
                asyncpg==0.29.0

                # Cache & Message Queue
                redis==5.0.1
                celery==5.3.6
                kombu==5.3.4

                # AI/ML
                langchain==0.1.0
                langchain-openai==0.0.2
                openai==1.6.1
                tiktoken==0.5.2
                chromadb==0.4.22
                sentence-transformers==2.2.2

                # Monitoring
                prometheus-client==0.19.0
                sentry-sdk[fastapi]==1.39.1
                structlog==23.2.0

                # Testing
                pytest==7.4.3
                pytest-asyncio==0.23.2
                httpx==0.25.2
                factory-boy==3.3.0""", tool_call_id="call_1"),

                # Step 2: Agent 进一步检查 docker-compose
                AIMessage(
                    content="requirements.txt 显示核心依赖为 FastAPI 0.104 + SQLAlchemy 2.0 + Redis 5.0 + LangChain 0.1.0。"
                            "接下来检查 docker-compose 确认基础设施版本。",
                    tool_calls=[{"name": "read_file", "args": {"path": "docker-compose.yml"}, "id": "call_2"}]
                ),
                ToolMessage(content="""version: '3.8'
                services:
                  app:
                    build: .
                    ports: ["8000:8000"]
                    depends_on: [db, redis, chromadb]
                    environment:
                      - DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/app
                      - REDIS_URL=redis://redis:6379/0
                      - CHROMADB_HOST=chromadb
                  db:
                    image: postgres:16.1
                    volumes: [pgdata:/var/lib/postgresql/data]
                    environment:
                      POSTGRES_DB: app
                      POSTGRES_USER: user
                      POSTGRES_PASSWORD: pass
                  redis:
                    image: redis:7.2-alpine
                    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
                  chromadb:
                    image: chromadb/chroma:0.4.22
                    volumes: [chromadata:/chroma/chroma]
                volumes:
                  pgdata:
                  chromadata:""", tool_call_id="call_2"),

                # Agent 最终结论(已浓缩所有关键信息)
                AIMessage(content=(
                    "项目核心依赖分析完成:\n"
                    "1. **Web 框架**:FastAPI 0.104.1 + Uvicorn 0.24.0 + Pydantic 2.5.0\n"
                    "2. **数据库**:PostgreSQL 16.1 + SQLAlchemy 2.0.23 + asyncpg 0.29.0\n"
                    "3. **缓存/队列**:Redis 7.2 + Celery 5.3.6\n"
                    "4. **AI/ML**:LangChain 0.1.0 + OpenAI 1.6.1 + ChromaDB 0.4.22\n\n"
                    "兼容性风险:LangChain 0.1.0 是早期版本,与 langchain-openai 0.0.2 "
                    "的 API 可能在后续升级中出现 breaking change。建议锁定版本或关注 changelog。"
                )),
            ]

            print(f"消息链构造完成:{len(original_messages)} 条消息({len(original_messages)//2} 轮工具调用 + 最终结论)")

            # --- 展示原始消息链中各类型的 token 占比 ---
            print("=== 原始消息链:各消息类型 token 占比 ===\n")
            type_tokens = {"HumanMessage": 0, "AIMessage": 0, "ToolMessage": 0}
            for msg in original_messages:
                t = type(msg).__name__
                tokens = count_tokens(str(msg.content))
                type_tokens[t] += tokens

            total = sum(type_tokens.values())
            for t, tok in type_tokens.items():
                bar = "█" * int(tok / total * 30)
                print(f"  {t:15s} {tok:4d} tokens ({tok/total*100:4.1f}%) {bar}")
            print(f"  {'总计':15s} {total:4d} tokens")


            # --- 定义工具结果清除函数并执行 ---
            def clear_tool_results(messages):
                """工具调用完成后,将冗长的原始返回值压缩为一行结论性摘要"""
                cleared = []
                for msg in messages:
                    if isinstance(msg, ToolMessage):
                        # 用 LLM 将工具输出压缩为一行摘要(只压缩单条输出,比整段对话压缩便宜得多)
                        summary_resp = llm.invoke(
                            f"用一句话(不超过80字)总结以下工具输出的关键发现:\n\n{msg.content}"
                        )
                        cleared.append(ToolMessage(
                            content=f"[摘要] {summary_resp.content.strip()}",
                            tool_call_id=msg.tool_call_id
                        ))
                    else:
                        cleared.append(msg)
                return cleared

            cleared_messages = clear_tool_results(original_messages)

            # 展示摘要效果
            print("=== 工具结果清除:原始输出 → 一行摘要 ===\n")
            tool_idx = 0
            for orig, clr in zip(original_messages, cleared_messages):
                if isinstance(orig, ToolMessage):
                    tool_idx += 1
                    orig_tokens = count_tokens(orig.content)
                    clr_tokens = count_tokens(clr.content)
                    print(f"ToolMessage #{tool_idx}:")
                    print(f"  原始: {orig_tokens} tokens | {orig.content[:80]}...")
                    print(f"  摘要: {clr_tokens} tokens | {clr.content}")
                    print(f"  压缩率: {(1 - clr_tokens/orig_tokens)*100:.0f}%\n")

            # Token 对比
            cleared_tokens = sum(count_tokens(str(m.content)) for m in cleared_messages)
            saved_pct = (1 - cleared_tokens / total) * 100
            print(f"=== 整体 Token 对比 ===")
            print(f"清除前: {total} tokens")
            print(f"清除后: {cleared_tokens} tokens(节省 {saved_pct:.0f}%)")

        # 🚀 === 观察遮蔽 Observation Masking
            # 核心原理(JetBrains, NeurIPS 2025):
            # Agent 每步的 Reasoning 已自然浓缩了上一步 Observation 的关键发现,
            # 因此遮蔽冗长的原始 Observation 不会丢失决策信息。

            # 模拟 3 步工具调用链(Agent 调试数据库连接超时问题)
            tool_chain = [
                {
                    "action": "search_codebase('database timeout config')",
                    "reasoning": "用户报告数据库连接超时,先搜索超时相关配置定位问题范围",
                    "observation": """找到 6 处匹配:
                    db/pool.py:15 → pool_size=20, pool_timeout=30
                    db/pool.py:28 → pool_recycle=3600, pool_pre_ping=True
                    config/prod.yaml:8 → max_overflow=10, pool_timeout=30
                    config/dev.yaml:8 → max_overflow=5, pool_timeout=60
                    utils/health.py:42 → timeout=10 (健康检查专用)
                    scripts/migrate.py:8 → timeout=300 (迁移脚本专用)""",
                },
                {
                    "action": "read_file('db/pool.py')",
                    # ↓ reasoning 浓缩了 step1 的发现:pool_timeout=30, max_overflow=10
                    "reasoning": "搜索发现生产环境 pool_timeout=30 且 max_overflow=10,读取源码确认完整配置",
                    "observation": """import sqlalchemy
                    from sqlalchemy import create_engine
                    engine = create_engine(
                        DATABASE_URL,
                        pool_size=20,        # 常驻连接数
                        max_overflow=10,     # 溢出连接上限
                        pool_timeout=30,     # 获取连接的等待超时
                        pool_recycle=3600,   # 每小时回收连接
                        pool_pre_ping=True,  # 使用前 ping 检测
                        echo=False, echo_pool=False,
                        # 注意:没有设置 connect_timeout(数据库建连超时)
                    )
                    # 连接池监控
                    from sqlalchemy import event
                    @event.listens_for(engine, 'checkout')
                    def receive_checkout(dbapi_conn, conn_record, conn_proxy):
                        logging.info(f'Connection checked out: {conn_record}')""",
                },
                {
                    "action": "run_tests('pytest tests/db/test_pool.py -v')",
                    # ↓ reasoning 浓缩了 step2 的发现:缺少 connect_timeout
                    "reasoning": "源码确认 max_overflow=10 且缺少 connect_timeout,跑测试验证高并发表现",
                    "observation": """test_basic_connection PASSED       [20%]
                    test_pool_size PASSED              [40%]
                    test_timeout_handling PASSED       [60%]
                    test_recycle PASSED                [80%]
                    test_concurrent_overflow FAILED    [100%]
                    FAILED - sqlalchemy.exc.TimeoutError: QueuePool limit of
                    size 20 overflow 10 reached, connection timed out, timeout 30.
                    ========================= 4 passed, 1 failed in 3.2s ==========================""",
                },
            ]

            # --- 1. 展示核心机制:Reasoning 如何浓缩上一步 Observation ---
            print("=== 信息传递链:每步 Reasoning 浓缩了上一步 Observation 的关键发现 ===\n")
            for i, step in enumerate(tool_chain):
                if i > 0:
                    prev = tool_chain[i-1]
                    print(f"Step {i} Observation({count_tokens(prev['observation'])} tokens 原始输出)")
                    print(f"  ↓ 浓缩为")
                    print(f"Step {i+1} Reasoning:「{step['reasoning']}」\n")

            # --- 2. 构建完整 vs 遮蔽上下文 ---
            full_context = ""
            masked_context = ""
            for step in tool_chain:
                full_context += f"Action: {step['action']}\nReasoning: {step['reasoning']}\nObservation:\n{step['observation']}\n\n"
                masked_context += f"Action: {step['action']}\nReasoning: {step['reasoning']}\nObservation: [已遮蔽]\n\n"

            full_tokens = count_tokens(full_context)
            masked_tokens = count_tokens(masked_context)
            saved_pct = (1 - masked_tokens / full_tokens) * 100

            print(f"=== Token 对比 ===")
            print(f"完整上下文: {full_tokens} tokens")
            print(f"遮蔽后:     {masked_tokens} tokens(节省 {saved_pct:.0f}%)")

            # --- 3. LLM 对比:遮蔽后能否依靠 Reasoning 链定位根因 ---
            question = "根据以上调试过程,数据库连接超时的根因是什么?建议怎么修复?"

            import time
            for label, ctx in [("完整上下文", full_context), ("遮蔽 Observation", masked_context)]:
                prompt = f"以下是 Agent 的调试过程:\n{ctx}\n{question}"
                start = time.time()
                resp = llm.invoke(prompt)
                elapsed = time.time() - start
                print(f"\n=== {label}({elapsed:.1f}s)===")
                print(resp.content[:300])

            print(f"\n关键发现:遮蔽 Observation 节省了 {saved_pct:.0f}% token,")
            print(f"   但 Reasoning 链已携带关键信息(pool_timeout=30 → 缺少 connect_timeout → overflow FAILED),")
            print(f"   LLM 仍能正确定位根因。这就是 Observation Masking 的核心原理。")




            # 用真实的 Agent 工具调用链演示观察遮蔽原理
            from langchain_core.tools import tool
            from langchain_core.messages import ToolMessage, AIMessage, HumanMessage
            from langchain.agents import create_agent
            import time

            # --- 1. 定义三个调试工具(模拟返回真实格式数据)---
            @tool
            def search_codebase(query: str) -> str:
                """搜索代码库中与查询相关的代码片段和配置"""
                return """找到 6 处匹配:
              db/pool.py:15 → pool_size=20, pool_timeout=30
              db/pool.py:28 → pool_recycle=3600, pool_pre_ping=True
              config/prod.yaml:8 → max_overflow=10, pool_timeout=30
              config/dev.yaml:8 → max_overflow=5, pool_timeout=60
              utils/health.py:42 → timeout=10 (健康检查专用)
              scripts/migrate.py:8 → timeout=300 (迁移脚本专用)"""

            @tool
            def read_file(file_path: str) -> str:
                """读取指定路径的文件内容"""
                return """import sqlalchemy
            from sqlalchemy import create_engine
            engine = create_engine(
                DATABASE_URL,
                pool_size=20,        # 常驻连接数
                max_overflow=10,     # 溢出连接上限
                pool_timeout=30,     # 获取连接的等待超时
                pool_recycle=3600,   # 每小时回收连接
                pool_pre_ping=True,  # 使用前 ping 检测
                echo=False, echo_pool=False,
                # 注意:没有设置 connect_timeout(数据库建连超时)
            )
            from sqlalchemy import event
            @event.listens_for(engine, 'checkout')
            def receive_checkout(dbapi_conn, conn_record, conn_proxy):
                logging.info(f'Connection checked out: {conn_record}')"""

            @tool
            def run_tests(command: str) -> str:
                """运行 pytest 测试并返回结果"""
                return """test_basic_connection PASSED       [20%]
            test_pool_size PASSED              [40%]
            test_timeout_handling PASSED       [60%]
            test_recycle PASSED                [80%]
            test_concurrent_overflow FAILED    [100%]
            FAILED - sqlalchemy.exc.TimeoutError: QueuePool limit of
              size 20 overflow 10 reached, connection timed out, timeout 30.
            ========================= 4 passed, 1 failed in 3.2s =========================="""

            # --- 2. 创建 ReAct Agent 并执行调试任务 ---
            debug_agent = create_agent(
                llm,
                [search_codebase, read_file, run_tests],
                system_prompt="请你作为数据库运维人员,仔细梳理数据库保存问题,并将tool工具返回的结果内容进行Reasoning链思考,需要在思考中加入tool里面核心重要的内容"
            )

            print("=== Agent 自主调试:观察完整的 Action → Observation → Reasoning 链 ===\n")
            result = debug_agent.invoke({"messages": [HumanMessage(content=(
                "数据库连接频繁超时,请调试定位根因。"
                "建议:先用 search_codebase 搜索 timeout 配置,"
                "再用 read_file 读取 db/pool.py,最后用 run_tests 跑 pytest tests/db/test_pool.py -v"
            ))]})

            # --- 3. 展示 Agent 真实轨迹(标注每条消息类型)---
            messages = result["messages"]
            step = 0
            for msg in messages:
                if isinstance(msg, AIMessage) and getattr(msg, "tool_calls", None):
                    step += 1
                    for tc in msg.tool_calls:
                        args_preview = list(tc['args'].values())[0][:60] if tc['args'] else ''
                        print(f"  Step {step} [Action]      {tc['name']}({args_preview})")
                    if msg.content:
                        print(f"  Step {step} [Reasoning]   {msg.content[:150]}")
                elif isinstance(msg, ToolMessage):
                    obs_tokens = count_tokens(msg.content)
                    print(f"  Step {step} [Observation] ({obs_tokens} tokens) {msg.content[:80]}...")
                    print()
                elif isinstance(msg, AIMessage):
                    print(f"  [Final Answer] {msg.content[:200]}...")
                    print()

            # --- 4. 核心操作:Observation Masking(基于信息传播链判断)---
            # 核心逻辑:只有当 Observation[N] 后面存在 AIMessage(即 Reasoning[N+1] 已吸收其关键信息),
            #           才能安全遮蔽。最近一轮的 Observation 尚未被后续推理吸收,必须保留。
            print("=== 执行 Observation Masking:遮蔽已被后续推理吸收的历史 Observation ===\n")
            masked_messages = []
            for i, msg in enumerate(messages):
                if isinstance(msg, ToolMessage):
                    # 检查这个 Observation 之后是否有 AIMessage 吸收了它
                    has_subsequent_reasoning = any(
                        isinstance(messages[j], AIMessage) for j in range(i + 1, len(messages))
                    )
                    if has_subsequent_reasoning:
                        # 信息已传播到后续 Reasoning,安全遮蔽
                        masked_messages.append(ToolMessage(
                            content="[Observation 已被后续推理吸收]",
                            tool_call_id=msg.tool_call_id
                        ))
                    else:
                        # 最近一轮,信息尚未传播,保留完整内容
                        masked_messages.append(msg)
                else:
                    masked_messages.append(msg)

            # Token 对比
            full_tokens = sum(count_tokens(str(m.content)) for m in messages)
            masked_tokens = sum(count_tokens(str(m.content)) for m in masked_messages)
            saved_pct = (1 - masked_tokens / full_tokens) * 100
            print(f"完整轨迹: {full_tokens} tokens")
            print(f"遮蔽后:   {masked_tokens} tokens(节省 {saved_pct:.0f}%)")

            # --- 5. 验证:用两种上下文分别提问,对比回答质量 ---
            question = "根据以上调试过程,数据库连接超时的根因是什么?建议怎么修复?"

            for label, msgs in [("完整上下文", messages), ("遮蔽 Observation", masked_messages)]:
                ctx = "\n".join(
                    f"[{type(m).__name__}] {str(m.content)[:300]}" for m in msgs
                )
                start = time.time()
                resp = llm.invoke(f"以下是 Agent 的调试轨迹:\n{ctx}\n\n{question}")
                elapsed = time.time() - start
                print(f"\n--- {label}({elapsed:.1f}s)---")
                print(resp.content[:300])

            print(f"\nObservation Masking 验证完成:")
            print(f"   历史 ToolMessage 遮蔽后节省 {saved_pct:.0f}% tokens,")
            print(f"   关键:只遮蔽已被后续 Reasoning 吸收的 Observation,保留最近一轮完整内容。")
            print(f"   AIMessage 中的 Reasoning 已浓缩历史 Observation 的关键发现,信息无损。")


    # 🎯 Isolate下上文隔离
    # 工具上下文层 | 任务状态层
    # ----------------------------------------------------------------------------------------------------------------
        # 🚀 === Isolate 策略:子 Agent 的上下文隔离
            # 模拟主 Agent 的完整上下文(3000 tokens 的累积历史)
            main_agent_history = """[系统提示] 你是 DevAssist,后端工程 AI 助手...(800 tokens)
            [轮次1] 用户讨论了数据库选型,最终选择 PostgreSQL...
            [轮次2] 用户要求设计 API 路由结构,生成了 15 个端点...
            [轮次3] 用户报告了认证模块的 JWT 刷新 bug,已修复...
            [轮次4] 用户要求添加 Redis 缓存层,完成了 Cache-Aside 实现...
            [轮次5] 用户讨论了部署方案,选择 Docker + ECS...
            [轮次6] 用户要求优化慢查询,分析了 3 个问题 SQL...
            [轮次7] 用户讨论了日志方案,选择 ELK Stack...
            [轮次8] 用户要求写单元测试,覆盖了 auth 和 db 模块..."""

            # 当前子任务:生成数据库迁移脚本(只需要知道数据库相关信息)
            subtask = "生成从 users 表添加 email_verified 字段的数据库迁移脚本(PostgreSQL, SQLAlchemy 2.0, alembic)"

            # 方式A:继承全部历史(不隔离)
            context_no_isolate = f"{main_agent_history}\n\n当前任务:{subtask}"

            # 方式B:只传任务描述(隔离)
            context_isolated = f"你是数据库迁移专家。请完成以下任务:\n{subtask}"

            tokens_full = count_tokens(context_no_isolate)
            tokens_isolated = count_tokens(context_isolated)

            print(f"不隔离(继承全部历史): {tokens_full} tokens")
            print(f"隔离(只传任务描述):   {tokens_isolated} tokens")
            print(f"上下文缩减: {(1-tokens_isolated/tokens_full)*100:.0f}%\n")

            # 对比回答质量
            for label, ctx in [("不隔离", context_no_isolate), ("隔离", context_isolated)]:
                resp = llm.invoke(ctx)
                print(f"=== {label} ===")
                print(resp.content[:250])
                print()

            print("两种方式都能正确生成迁移脚本--但隔离版本不携带 JWT bug、Redis 缓存等无关历史")



            from langchain.agents import create_agent
            # from deepagents.middleware.subagents import SubAgentMiddleware (check version)
            from deepagents.backends import StateBackend
            from langchain_core.messages import HumanMessage
            from langgraph.checkpoint.memory import InMemorySaver

            # 主 Agent + 子 Agent 一体化配置
            isolate_agent = create_agent(
                model=llm,
                tools=[],                    # 主 Agent 自身无额外工具
                system_prompt="你是 DevAssist 后端工程助手。数据库迁移任务请使用 task 工具委派给 db_expert。",
                middleware=[
                    SubAgentMiddleware(
                        backend=StateBackend(),  # 轻量级内存后端,无需文件系统
                        subagents=[
                            {
                                "name": "db_expert",
                                "description": "数据库迁移专家,处理 PostgreSQL + Alembic 相关任务",
                                "system_prompt": "你是数据库迁移专家,精通 PostgreSQL、SQLAlchemy 2.0、Alembic。只处理数据库相关任务,输出完整可用的迁移脚本。",
                                "model": "deepseek:deepseek-chat",  # 子 Agent 使用的模型
                                "tools": [],
                            }
                        ],
                    )
                ],
                checkpointer=InMemorySaver(),  # 跨轮次保存主 Agent 历史
            )

            print("主 Agent 创建完成")
            print("  中间件自动注入了 task 工具,可委派任务给 db_expert 子 Agent")
            print("  子 Agent 每次被调用时上下文完全隔离,不继承主 Agent 历史")


            # Isolate 策略实战(2/3):积累主 Agent 对话历史 ===
            config = {"configurable": {"thread_id": "isolate-demo"}}

            # 模拟 3 轮无关任务(限制回复长度以加速演示),让主 Agent 积累上下文
            history = [
                "帮我选择数据库,PostgreSQL 还是 MySQL?一句话给结论",
                "JWT 刷新 token 过期后没有自动续签,一句话说修复思路",
                "Redis 缓存穿透怎么防?一句话总结方案",
            ]

            print("=== 积累主 Agent 对话历史(3 轮简短任务)===\n")
            for i, msg in enumerate(history):
                result = isolate_agent.invoke(
                    {"messages": [HumanMessage(content=msg)]}, config
                )
                msg_count = len(result["messages"])
                print(f"轮次 {i+1} | 消息数: {msg_count:3d} | {msg[:35]}...")

            parent_tokens = sum(count_tokens(str(m.content)) for m in result["messages"])
            print(f"\n主 Agent 累积上下文: {parent_tokens} tokens, {len(result['messages'])} 条消息")
            print("包含:数据库选型、JWT 修复思路、Redis 缓存方案")


    # 🎯 Cache提示缓存
    # 系统提示层 | 工具上下文层 | 外部知识层
    # ----------------------------------------------------------------------------------------------------------------
        # 缓存匹配从请求头部开始,系统提示 + 工具描述必须在消息列表的最前面,动态内容(用户消息、对话历史)放后面。顺序颠倒会导致缓存完全失效

        response = llm.invoke(msgs)

        # 提取 API 返回的缓存命中数据
        usage = response.response_metadata.get("token_usage", {})
        hit = usage.get("prompt_cache_hit_tokens", 0)  # 命中缓存数
        miss = usage.get("prompt_cache_miss_tokens", 0) # 未命中缓存数
        prompt = usage.get("prompt_tokens", 0) # 总token

        status = "缓存命中" if hit > 0 else "缓存未命中"


# 🔗 Langchain
# ====================================================================================================================================

    # 1. 定义带速率限制的load_chat_model函数
    from langchain.chat_models import init_chat_model
    from langchain_core.rate_limiters import InMemoryRateLimiter

    # 2. 配置速率限制器
    rate_limiter = InMemoryRateLimiter(
        requests_per_second=5,       # 每秒最多5个请求
        check_every_n_seconds=1.0    # 每1秒检查一次是否超过速率限制
    )

    # 3. 对模型调用进行封装,后续直接调用传参数就行
    def load_chat_model(
        model: str,
        provider: str,
        temperature: float = 0.7,
        max_tokens: int | None = None,
        base_url: str | None = None,
    ):
        return init_chat_model(
            model=model,               # 模型名称
            model_provider=provider,   # 模型供应商
            temperature=temperature,   # 温度参数,用于控制模型的随机性,值越小则随机性越小
            max_tokens=max_tokens,     # 最大生成token数
            base_url=base_url,         # 专用于自定义 API Server 或代理
            rate_limiter=rate_limiter  # 自动限速
        )

    # 🔥 创建agent
        from langchain.agents import create_agent

        agent = create_agent(
            model="claude-sonnet-4-5-20250929",
            tools=[],
            system_prompt="你是一个专业的助手,能够回答用户的问题。",
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

    # ❌ 为模型添加指数退避重试策略

        model = model.with_retry(
            stop_after_attemp = 3, # 最多重试3次
            wait_exponential_jitter=True # 指数退避 + 随机抖动
        )

    # 🖥 使用langchain中的向量模型
        from langchain.embeddings import init_embeddings

        embedding = init_embeddings(mode="text-embedding-3-small", provider="openai")

        # 将文本转化为向量
        res = embedding.embed_query("hello world")

    # 👉 提示词模板
        from langchain_core.prompts import PromptTemplate

        template = PromptTemplate(
            input_variables=['product', 'feature'],
            template="请为{product}的{feature}功能写一段文案。",
            partial_variables={product: '笔记本电脑'} # 相当于默认值
        )

        prompt = template.format(
            product="智能手机",
            feature="AI摄影"
        )

        print(prompt)

    # 👉 动态提示词
        from langgraph.graph import StateGraph, MessagesState, START
        from langchain_core.messages import SystemMessage, HumanMessage
        from langchain_core.tools import tool

        # 1. 工具
        @tool
        def get_weather(city: str) -> str:
            """查询城市天气"""
            return f"{city}: 25°C, 晴"

        tools = [get_weather]

        # 2. 定义一个 Node，根据 context 注入不同的 system prompt
        async def dynamic_prompt_node(state: MessagesState) -> dict:
            """根据 user_role 动态生成 system prompt"""
            role = state.get("user_role", "user")  # context 存到 state 里
            
            prompts = {
                "expert": "你是一个专业气象分析师，提供详细数据",
                "beginner": "你是一个友善的导游，用简单语言解释",
            }
            system_msg = SystemMessage(prompts.get(role, "你是一个简洁的天气助手"))
            
            return {"messages": [system_msg] + state["messages"]}

        # 3. 构建图
        from langgraph.prebuilt import create_react_agent

        # create_react_agent 会自动处理 llm + tools 循环
        # 我们只需在它前面加一个 system prompt 节点
        graph = StateGraph(MessagesState)
        graph.add_node("inject_prompt", dynamic_prompt_node)
        graph.add_node("agent", create_react_agent(llm, tools))  # 标准 ReAct Agent

        graph.add_edge(START, "inject_prompt")
        graph.add_edge("inject_prompt", "agent")

        app = graph.compile()

        # 4. 调用
        result = app.invoke({
            "messages": [HumanMessage("北京天气")],
            "user_role": "expert"  # 动态控制角色
        })


    # 🎬 调用模型
        # 1. 单条消息
        response = model.invoke("我想知道迪士尼的退票政策")
        print(response)

        # 2. 多条消息(对话历史)调用
        conversation = [
            {"role": "user", "content": "我想知道迪士尼的退票政策"},
            {"role": "assistant", "content": "迪士尼的:..."},
            {"role": "user", "content": "明天天气怎么样?"},
            {"role": "assistant", "content": "明天天气:..."},
        ]
        response = model.invoke(conversation)
        print(response)

        # 3. 流式输出
        response = model.stream(conversation)
        for chunk in response:
            print(chunk.content, end="", flush=True)
        print("")

        # 4. 批量调用
        requests = ["什么是人工智能?", "langchain有什么优势", "如何使用模型?"]
        response = model.batch(requests)
        for i, response in enumerate(response):
            print(f"问题{i+1}: {requests[i]}")
            print(f"回答{i+1}: {response.content}")
            print("=" * 30)


        # 5. 异步批量并发
        from langchain_core.runnables import RunnableConfig
        import asyncio

        config = RunnableConfig(
            max_concurrency=2, # 最大并发数
            abstimeout=8.0, # 单个任务超时时间 秒 超过此时间的任务奖被强制终止
            metadata={"request_id": "abs123", "task": "query"} # 元数据
        )


        prompt_template = PromptTemplate.from_template(
            "为正常{product}的公司起一个好名字"
        )

        inputs = ["彩色袜子", "环保咖啡杯", "智能水杯"]
        formatted_prompts = [prompt_template.format(product=product) for product in inputs]

        results = asyncio.run(await model.abatch(formatted_prompts, config=config))

    # 🚀 使用Model Profiles

        profile = model.profile

        print("\n模型配置信息:")
        print(f"最大输入token数:{profile.get('max_input_tokens')}")
        print(f"最大输出token数:{profile.get('max_output_tokens')}")
        print(f"支持图像输入:{profile.get("image_inputs")}")

    # 🚀 标准内容块 Content Blocks

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

    # ⚙ 工具定义
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

            return f"对话历史中,用户有{human_msgs}条消息,助手有{ai_msgs}条消息,工具调用了{tool_msgs}次。"


        # 更新会话状态
        from langchain.tools import tool
        from langgraph.types import Command


        @tool
        def clear_conversation() -> Command:
            """清除当前对话历史"""
            from langchain_core.messages import RemoveMessages
            from langgraph.graph.message import REMOVE_ALL_MESSAGES

            return Command(update={"messages": [RemoveMessages(id=REMOVE_ALL_MESSAGES)]})


        from langgraph.prebuilt import create_react_agent

        agent = create_react_agent(llm, tools=[get_weather, clear_conversation])    


    # 🚀 mcp接入LangChain
        """
        **检查 Node.js**
        * node --version

        **检查 npm/npx**
        * npx --version

        **手动安装 MCP 服务器包**
        * npm install -g @amap/amap-maps-mcp-server
        pip install langchain-mcp-adapters
        """

        # ==================mcp_server.py===================================
        # pip install mcp

        from mcp.server.fastmcp import FastMCP

        mcp = FastMCP('MathServer')

        @mcp.tool
        def add(a: float, b: float) -> float:
            """计算两个数的和"""
            return a + b

        @mcp.tool()
        def multiply(a: float, b: float) -> float:
            """计算两个数的乘积"""
            return a * b

        if __name__ == "__main__":
            # 启动服务器,使用stdio传输
            mcp.run(transport="stdio")
        # ==================================================================

        import os
        from langchain_mcp_adapters.client import MultiServerMCPClient   # 导入 MCP 客户端
        from langchain_core.tools import tool
        from langchain.agents import create_agent

        # 1. 初始化 MCP 客户端,只连接本地 MCP 服务器
        # 获取当前文件所在目录的绝对路径
        mcp_server_path = os.path.join("mcp_server.py")
        print(mcp_server_path)

        # 2. 初始化 MCP 客户端,只连接本地 MCP 服务器
        mcp_client = MultiServerMCPClient(
            {
                # 本地 Python MCP 服务器(stdio 传输)
                "math": {
                    "transport": "stdio",
                    "command": "python",
                    "args": [mcp_server_path],  # 使用绝对路径
                },
                # 如果需要其他服务器,可以在这里添加
                # 注意:只添加确实在运行的服务器!否则会导致连接失败,需要先运行mcp_server.py文件!!!
                # 高德地图 MCP 服务器
                "amap-maps": {
                    "transport": "stdio",
                    "command": "npx",
                    "args": ["-y", "@amap/amap-maps-mcp-server"],
                    "env": {
                        "AMAP_MAPS_API_KEY": os.getenv("AMAP_MAPS_API_KEY"),
                    }
                }
            }
        )

        # 3. 加载 MCP 工具
        try:
            mcp_tools = await mcp_client.get_tools()
            print(f"✅ 成功加载 {len(mcp_tools)} 个 MCP 工具: {[t.name for t in mcp_tools]}")
        except Exception as e:
            print(f"❌ 加载 MCP 工具失败: {e}")
            print("将只使用本地工具")
            mcp_tools = []

        # 4. 定义天气查询工具
        @tool
        def get_weather(city: str) -> str:
            """获取指定城市的天气信息。"""
            weather_data = {
                "北京": "晴朗,气温25°C",
                "上海": "多云,气温28°C",
                "广州": "小雨,气温30°C"
            }
            return f"{city}的天气是:{weather_data.get(city, '未知')}"

        # 5. 合并所有工具
        all_tools = [get_weather] + mcp_tools

        # 6. 加载 ChatOpenAI 模型
        llm = load_chat_model(model="gpt-4o-mini",provider="openai")

        # 7. 创建Agent
        agent = create_agent(
            model=llm,
            tools=all_tools,
            system_prompt="你是一个多功能的助手,可以查询天气和进行数学计算。"
        )

    # 🚣‍ 使用自定义上下文
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
            return f"用户{user_id}的账户信息:..."


        agent = create_agent(tools=[get_account_info])

    # 💳 复杂输入模式
        # 使用pydantic数据类定义复杂的输入结构
        from pydantic import BaseModel, Field
        from langchain.tools import tool

        class SearchParams(BaseModel):
            query: str = Field(description="The query to search for.")
            filters: dict = Field(
                default_factory=dict, description="Additional filters to apply to the search."
            )
            limit: int = Field(
                description="The maximum number of records to return. Defaults to 10."
            )

        @tool
        def advanced_search(params: SearchParams) -> str:
            """执行高级搜索"""
            print("我被调用啦~~~~")
            print(
                f"关键词:{params.query}, 过滤条件:{params.filters},  返回数量:{params.limit}"
            )

    # 💾 短期记忆 InMemorySaver
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
            {"messages": [{"role": "user", "content": "你好,我叫小明"}]},
            {"configurable": {"thread_id": "1"}},
        )

    # 💾 短期记忆 PostgresSaver
        # ! pip install langgraph-checkpoint-postgres
        from langgraph.checkpoint.postgres import PostgresSaver
        from langchain.agents import create_agent

        """
        生产环境使用数据库存储,支持:
        - 持久化(重启不丢失)
        - 多实例共享(分布式部署)
        - 大规模并发
        """

        # 创建模型
        model = load_chat_model(model="gpt-4o-mini",provider="openai")

        # 数据库连接字符串
        DB_URI = "postgresql://myuser:123456@localhost:5432/mydatabase"

        with PostgresSaver.from_conn_string(DB_URL) as checkpointer:
            # 自动创建表结构(仅首次运行)
            checkpointer.setup()

            agent = create_agent(
                model=model,
                tools=[],
                checkpointer=checkpointer
            )

            config = {"configurable": {"thread_id": "user_id_001"}}

            # 模拟用户注册流程
            agent.invoke(
                {"messages": [{"role": "user", "content": "我是新用户张三,请记录我的信息"}]},
                config=config
            )

            response = agent.invoke(
                {"messages": [{"role": "user", "content": "我是谁?"}]},
                config=config
            )
            print(f"AI: {response['messages'][-1].content}")

    # 💾 自定义记忆内容
        from langchain.tools import tool, ToolRuntime
        from langchain.agents import create_agent, AgentState
        from langgraph.checkpoint.memory import InMemorySaver
        from langchain.chat_models import init_chat_model


        # 创建扩展的状态类,添加额外字段
        class CustomState(AgentState):
            user_name: str


        # 定义工具 通过runtime访问自定义状态
        @tool
        def greet(runtime: ToolRuntime[CustomState]) -> str:
            """问候用户"""
            user_name = runtime.state["user_name"]
            return f"你好,{user_name}!很高兴为你服务。"


        # 初始化聊天模型
        model = init_chat_model("gpt-5")

        # 使用自定义状态创建智能体
        agent = create_agent(
            model=model,
            tool=[greet],
            state_schema=CustomState,
            checkpointer=InMemorySaver()
        )

        # 在调用时自定义信息
        result = agent.invoke(
            {"messages": [{"role": "user", "content": "向用户问好"}], "user_name": "小明"},
            {"configurable": {"thread_id": "user_session_1"}},
        )
        print(result)

    # ✍ 结构化输出
        # 🌰 Pydantic Models (最强)
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
                            "content": "请创建一个会议,主题为项目A,参与人员为张三、李四,操作项为项目A的进度报告,截止时间为2024-01-01",
                        }
                    ]
                }
            )

            meeting_data = result["structured_response"]
            print(f"会议主题:{meeting_data.topic}")
            print(f"参与人员:{meeting_data.participants}")

        # 🌰 Dataclasses  轻量级结构 原生数据类
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

        # 🌰 TypedDict
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
            print(f"推荐的电影:{movie_data['title']}")
            print(f"导演:{movie_data['director']}")

        # 🌰 JSON schema

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
                model=model, 
                response_format=ProviderStrategy(contact_info_schema)
            )

            # ❌ 智能错误处理
            from langchain.agents.structured_output import ToolStrategy

            agent = create_agent(
                handle_errors=True,  # 捕获所有错误并重试
                response_format=ToolStrategy(
                    schema=contact_info_schema,
                    handle_errors=True,  # 捕获所有错误并重试
                    # handle_errors="请确保提供有效的联系信息" # 自定义错误提示
                    # handle_errors=ValueError # 仅捕获特定异常
                ),
            )

    # ⏳ === 内置中间件（LangGraph 版本）===
        # ⚠️ LangChain 1.3.4 已移除 langchain.agents.middleware
        # 以下全部为 LangGraph 等价实现
        from langgraph.graph import StateGraph, MessagesState, START
        from langgraph.prebuilt import ToolNode, tools_condition
        from langgraph.checkpoint.memory import MemorySaver
        from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, RemoveMessage, ToolMessage
        from langchain_core.tools import tool
        from typing import Literal

        # ⏳ 1 Summarization → summarize node

            THRESHOLD, KEEP = 20, 6

            def should_summarize(s: MessagesState) -> Literal["summarize", "__end__"]:
                return "summarize" if len(s["messages"]) > THRESHOLD else "__end__"

            async def summarize_node(s: MessagesState) -> dict:
                early, recent = s["messages"][:-KEEP], s["messages"][-KEEP:]
                summary = await llm.ainvoke(f"压缩(80字):\n{"".join(str(m.content)[:100] for m in early)}")
                return {"messages": [SystemMessage(f"[摘要]{summary.content}")] + recent}

            from langgrap.prebuilt import create_react_agent
            
            tools = [get_weather]
            agent = create_react_agent(llm, tools)

            graph = StateGraph(MessagesState)

            # 先加 agent 节点
            graph.add_node("agent", agent)
            # 再加 summarize 节点
            graph.add_node("summarize", summarize_node)

            # agent 结束后，走 should_summarize 判断
            graph.add_conditional_edges(
                "agent",
                should_summarize,          # 判断函数
                {"summarize": "summarize", "__end__": "__end__"}  # 路由表
            )

            # summarize 完了回 agent
            graph.add_edge("summarize", "agent")

            graph.set_entry_point("agent")

            app = graph.compile()    

        # ⏳ 2 ContextEditing → clean_tool node

            def clean_tool_msgs(s: MessagesState) -> dict:
                return {"messages": s["messages"][-6:]} if len(s["messages"]) >= 8 else s

        # ⏳ 3 FileSearch → Tool
            @tool
            def glob_search(p: str) -> str:
                import glob; return "\n".join(glob.glob(p, recursive=True))
                
            @tool
            def grep_search(p: str, inc: str = "*.py") -> str:
                import glob; r = []
                for f in glob.glob(f"**/{inc}", recursive=True):
                    try:
                        for i, l in enumerate(open(f, errors='ignore'), 1):
                            if p in l: r.append(f"{f}:{i}:{l.rstrip()[:80]}")
                    except: pass
                return "\n".join(r[:20]) or "无匹配"

        # ⏳ 4 HumanInTheLoop → interrupt_before
            # graph.compile(checkpointer=MemorySaver(), interrupt_before=["tools"])
            # app.invoke({"messages": [HumanMessage("北京天气")]}, {"configurable":{"thread_id":"s1"}})
            # app.invoke(None, {"configurable":{"thread_id":"s1"}})  # 继续

        # ⏳ 5 ToolEmulator → wrapper
            from functools import wraps

            def emulate_tool(model):
                def deco(func):
                    @wraps(func)
                    async def wrapper(**kw):
                        r = await model.ainvoke(f"模拟{func.__name__}({kw}):")
                        return r.content
                    return wrapper
                return deco

        # ⏳ 6 ToolSelector → select node
            async def select_tool_node(s: MessagesState) -> dict:
                names = [t.name for t in tools]
                r = await llm.ainvoke(f"从{names}中选工具: {s['messages'][-1].content}")
                return {"selected_tool": r.content.strip()}

        # ⏳ 7 ModelCallLimit → state count
            class LimitState(MessagesState):
                call_count: int = 0

            def check_limit(s: LimitState) -> Literal["llm", "__end__"]:
                return "__end__" if s["call_count"] >= 5 else "llm"

        # ⏳ 8 ModelFallback → try in node
            async def fallback_node(s: MessagesState) -> dict:
                for n in ["deepseek-chat", "gpt-4o-mini"]:
                    try:
                        from langchain_deepseek import ChatDeepSeek
                        m = ChatDeepSeek(model=n)
                        return {"messages": [await m.ainvoke(s["messages"])]}
                    except: continue
                return {"messages": [AIMessage("服务暂不可用")]}

        # ⏳ 9 PII → sanitize node
            import re

            def pii_mask(t: str) -> str:
                t = re.sub(r'[\w.-]+@[\w.-]+\.\w+', '[EMAIL]', t)
                t = re.sub(r'\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}', '[CARD]', t)
                t = re.sub(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', '[IP]', t)
                return t

            async def pii_node(s: MessagesState) -> dict:
                if hasattr(s["messages"][-1], 'content'):
                    s["messages"][-1].content = pii_mask(str(s["messages"][-1].content))
                return s

        # ⏳ 10 TodoList → state field
            class TodoState(MessagesState):
                todo_list: list = []

            def todo_node(s: TodoState) -> dict:
                return {"todo_list": s.get("todo_list", [])}

        # ⏳ 11 ToolCallLimit → state count
            class ToolLimitState(MessagesState):
                tool_counts: dict = {}

            def check_tool_limit(s: ToolLimitState) -> Literal["tools", "__end__"]:
                return "__end__" if sum(s["tool_counts"].values()) > 10 else "tools"

        # ⏳ 12 ToolRetry → wrapper
            import asyncio
            async def retry_call(func, retries=3, **kw):
                for i in range(retries):
                    try: return await func(**kw)
                    except Exception as e:
                        if i == retries-1: return f"失败: {e}"
                        await asyncio.sleep(2**i)

    # ⏳ === 自定义中间件 → Node 写法 ===

        # ⏳ @before_agent → 入口 Node
            async def init_node(s: MessagesState) -> dict:
                if not s.get("user_id"): return {"messages": [AIMessage("请先登录")]}
                return s

        # ⏳ @after_agent → 出口 Node
            async def cleanup_node(s: MessagesState) -> dict:
                print(f"对话轮次: {len(s['messages'])}")
                return s

        # ⏳ @before_model → 预处理 Node
            async def pre_node(s: MessagesState) -> dict:
                last = s["messages"][-1]
                if hasattr(last, 'content') and len(str(last.content)) > 4000:
                    last.content = str(last.content)[:4000] + "..."
                return s

        # ⏳ @after_model → 后处理 Node
            async def post_node(s: MessagesState) -> dict:
                last = s["messages"][-1]
                if hasattr(last, 'content') and "```" in str(last.content):
                    return {"messages": [AIMessage(str(last.content) + "\n💡 代码已复制")]}
                return s

        # ⏳ @wrap_model_call → cache node
            _cache = {}
            async def cached_llm(s: MessagesState) -> dict:
                key = str(s["messages"][-1].content)[:100]
                if key in _cache: return {"messages": [_cache[key]]}
                r = await llm.ainvoke(s["messages"])
                _cache[key] = r
                return {"messages": [r]}

        # ⏳ @wrap_tool_call → wrapper node
            async def tool_wrapper(s: MessagesState) -> dict:
                last = s["messages"][-1]
                if not hasattr(last, 'tool_calls'): return s
                allowed = {"get_weather", "search_db"}
                for tc in last.tool_calls:
                    n = tc.get("name", tc.name) if hasattr(tc, 'name') else tc["name"]
                    if n not in allowed:
                        return {"messages": [ToolMessage(f"无权限: {n}", tool_call_id=tc.id)]}
                return s

        # ⏳ @dynamic_prompt → prompt node
            async def dynamic_prompt(s: MessagesState) -> dict:
                msg = str(s["messages"][-1].content)
                for kw, r in {"代码":"Python工程师", "数据库":"DB架构师", "部署":"DevOps专家"}.items():
                    if kw in msg: return {"messages": [SystemMessage(f"你是{r}")] + s["messages"]}
                return {"messages": [SystemMessage("你是有帮助的助手")] + s["messages"]}

        # ⏳ 通用 Graph 构建模板
            # graph = StateGraph(MessagesState)
            # graph.add_node("llm", call_model)
            # graph.add_node("tools", ToolNode(tools))
            # graph.add_conditional_edges("llm", tools_condition)
            # graph.add_edge("tools", "llm")
            # graph.set_entry_point("llm")
            # app = graph.compile()

    # ⚙ AgentExecutor 参数详解
        from langchain.agents import create_react_agent, AgentExecutor
        from langchain.prompts import PromptTemplate
        from langchain.memory import ConversationBufferMemory

        PROMPT_TEMPLATE = """你是一个知识问答助手。

        历史对话:
        {chat_history}

        你有以下工具:
        {tools}

        Question: {input}
        {agent_scratchpad}"""

        prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)
        agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)
        memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        executor = AgentExecutor(
            agent=agent,
            memory=memory,
            verbose=True,           # 调试时开
            max_iterations=3,       # 防死循环
            handle_parsing_errors=True,  # LLM 乱输出自动重试
        )
        #   AgentExecutor = 封装了 ReAct 循环的执行器,替你做以下工作:
        #     ① 填变量({input}/{tools}/{chat_history}/{agent_scratchpad})
        #     ② 调 LLM
        #     ③ 解析 LLM 输出(调工具还是回答)
        #     ④ 执行工具并结果填回上下文
        #     ⑤ 循环直到 Final Answer 或达到上限

        #   agent （必需）→ Agent 对象,由 create_react_agent() 创建
        #   tools （建议不传）→ 工具列表,能从 agent.tools 推断
        #   memory（可选）→ 对话记忆,如 ConversationBufferMemory
        #   verbose（默认 False）→ 打印每轮 Thought/Action/Observation

        #   max_iterations（默认 15,建议 3~5）→ 最大 LLM 调用轮数
        #     LLM 每输出一次(不管调工具还是直接回答)都算 1 轮
        #     典型消耗: 简单问题1轮搜+1轮答=2轮,复杂3~4轮,死循环防御
        #     超过后执行 early_stopping_method

        #   max_execution_time（默认 None）→ 最大执行秒数
        #     墙上时钟,不按轮数算。30 秒超时直接停,生产环境双保险

        #   early_stopping_method（默认 "force"）→ 到上限了怎么办
        #     "force" → 强行要求 LLM 输出 Final Answer(兜底总结)
        #     "generate" → 基于已有信息自行生成回答(不再调工具)

        #   handle_parsing_errors（默认 False,建议 True）→ 解析失败自动重试
        #     True → 自动把错误消息喂回 LLM 要求重试
        #     也可以传自定义错误消息字符串

        #   return_intermediate_steps（默认 False）→ 返回中间步骤
        #     开的话 result 里会多一个 intermediate_steps 字段
        #     包含每一步的工具调用和结果,调试好用

        #   callbacks（默认 None）→ 高级监听回调,生产日志用

        #   ⚡ 实战推荐:
        #     executor = AgentExecutor(
        #         agent=agent,
        #         verbose=True,              # 调试时开
        #         max_iterations=3,           # 防死循环
        #         handle_parsing_errors=True, # LLM 乱输出自动重试
        #     )


# 🌐 MCP
# ====================================================================================================================================
    # 🍉 MCP 客户端
        import asyncio
        import os
        from typing import Optional
        from openai import OpenAI
        from dotenv import load_dotenv
        from contextlib import AsyncExitStack

        from mcp import ClientSession, StdioServerParamters
        from mcp.client.stdio import stdio_client

        load_dotenv()

        class MCPClient:
            def __init__(self):
                """初始化 MCP 客户端"""
                self.openai_api_key = os.getenv("OPENAI_API_KEY")  # 读取 OpenAI API Key
                self.base_url = os.getenv("BASE_URL")  # 读取 BASE YRL
                self.model = os.getenv("MODEL")  # 读取model
                self.client = OpenAI(api_key=self.openai_api_key, base_url=self.base_url)

                self.session: Optional[ClientSession] = None
                self.exit_stack = AsyncExitStack()

            async def connect_to_server(self, server_script_path: str):
                """链接到MCP服务器并列出可用工具"""
                is_python = server_script_path.endswith(".py")
                is_js = server_script_path.endswith('.js')

                if not (is_python or is_js):
                    raise ValueError("服务器脚本必须是.py或.js文件")

                command = "python" if is_python else "node"
                server_params = StdioServerParamters(
                    command=command,
                    args=[server_script_path],
                    env=None
                )

                # 启动服务器并建立通信
                stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server_params))

                # read 读通道  write 写通道
                self.read, self.write = stdio_transport

                # 创建mcp会话
                self.session = await self.exit_stack.enter_async_context(ClientSession(self.read, self.write))

                # 初始化握手
                await self.session.initialize()

                # 列出MCP服务器上的工具
                response = await self.session.list_tools()
                tools = response.tools
                print("\n已连接到服务器,支持以下工具", [tool.name for tool in tools])


            async def process_query(self, query: str) -> str:
                """
                使用大模型处理查询并可以调用MCP工具 (Function Calling)
                """
                messages = [
                    {"role": "system", "content": "你是一个智能助手,帮助用户回答问题"},
                    {"role": "user", "content": query}
                ]

                response = await self.session.list_tools()
                available_tools = [{
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description,
                        "parameters": tool.inputSchema
                    }
                } for tool in response.tools]

                try:
                    response = self.client.completions.create(
                        model=self.model,
                        messages = messages,
                        tools=available_tools
                    )

                    # 处理返回的内容
                    content = response.choice[0]
                    if content.finish_reason == "tool_calls":
                        # 如果是需要使用工具,就解析工具
                        tool_call = content.message.tool_calls[0]
                        tool_name = tool_call.function.name
                        tool_args = json.loads(tool_call.function.arguments)
                        # 执行工具
                        result = await self.session.call_tool(tool_name, tool_args)
                        print(f"\n\n[Calling tool {tool_name} with args {tool_args}]\n\n")

                        # 将模型返回的调用哪个工具数据和工具执行完成后的数据都存入messages中
                        messages.append(content.model.model_dump())
                        messages.append({
                            "role": "tool",
                            "content": result.content[0].text,
                            "tool_call_id": tool_call.id
                        })
                        # 将上面的结果再返回给大模型生产最终的结果
                        response = self.client.chat.completions.create(
                            model=model,
                            messages=messages
                        )
                        return response.choices[0].message.content

                    return content.message.content

                except Exception as e:
                    return f"⚠ 调用 OpenAI API 时出错: {str(e)}"

            async def chat_loop(self):
                """运行交互式聊天循环"""
                print("\nMCP 客户端已启动!输入 'quit' 退出")
                while True:
                    try:
                        query = input("\nQuery: ").strip()
                        if query.lower() == 'quit':
                            break
                        response = await self.process_query(query)
                        print(f"\n🤖 OpenAI: {response}")
                    except Exception as e:
                        print(f"\n⚠ 发生错误: {str(e)}")

            async def cleanup(self):
                """清理资源"""
                await self.exit_stack.aclose()

        async def main():
            if len(sys.argv < 2):
                print("Usage: python client.py <path_to_server_script>")
                sys.exit(1)

            client = MCPClient()
            try:
                await client.connect_to_server(sys.argv[1])
                await client.chat_loop()
            finally:
                await client.cleanup()

        if __name__ == "__main__":
            import sys
            asyncio.run(main())

    # 🍉 MCP 服务器
        import json
        import httpx
        from typing import Any
        from mcp.server.fastmcp import FastMCP

        mcp = FastMCP("weatherserver") # 💡 初始化mcp服务器

        # OpenWeather API 配置
        OPENWEATHER_API_BASE = "https://api.openweathermap.org/data/2.5/weather"
        API_KEY = "YOUR_API_KEY"  # 请替换为你自己的 OpenWeather API Key
        USER_AGENT = "weather-app/1.0"

        async def fetch_weather(city: str) -> dict[str, Any] | None:
            """
            从 OpenWeather API 获取天气信息。
            :param city: 城市名称(需使用英文,如 Beijing)
            :return: 天气数据字典;若出错返回包含 error 信息的字典
            """
            params = {
                "q": city,
                "appid": API_KEY,
                "units": "metric",
                "lang": "zh_cn"
            }
            headers = {"User-Agent": USER_AGENT}
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.get(
                        OPENWEATHER_API_BASE,
                        params=params,
                        headers=headers,
                        timeout=30.0
                    )
                    response.raise_for_status()
                    return response.json() # 返回字典类型
                except httpx.HTTPStatusErrors as e:
                    return {"error": f"HTTP错误:{e.response.status_code}"}
                except Exception as e
                    return {"error": f"请求失败: {str(e)}"}


        def format_weather(data: dict[str, Any] | str) -> str:
            """
            将天气数据格式化为易读文本
            :param data: 天气数据(可以是字典或json字符串)
            :return: 格式化的天气信息字符串
            """
            # 如果传入的是字符串,则先转换成字典
            if isinstance(data, str):
                try:
                    data = json.loads(data)
                except Exception as e:
                    return f"无法解析天气数据: {e}"

            # 如果数据中包含错误信息,直接返回错误信息
             if "error" in data:
                return f"⚠ {data['error']}"

            # 提取数据时做容错处理
            city = data.get("name", "未知")
            country = data.get("sys", {}).get("country", "未知")
            temp = data.get("main", {}).get("temp", "N/A")
            humidity = data.get("main", {}).get("humidity", "N/A")
            wind_speed = data.get("wind", {}).get("speed", "N/A")
            # weather 可能为空列表,因此用 [0] 前先提供默认字典
            weather_list = data.get("weather", [{}])
            description = weather_list[0].get("description", "未知")

            return (
                f"🌍 {city}, {country}\n"
                f"🌡 温度: {temp}°C\n"
                f"💧 湿度: {humidity}%\n"
                f"🌬 风速: {wind_speed} m/s\n"
                f"⛅ 天气: {description}\n"
            )

        # 💡 装饰器
        @mcp.tool(
            name="get_weatch",
            description="查询城市天气",
            parameters={
                "city": {"type": "string", "description": "城市名称"}
            }
        )
        async def query_weather(city: str) -> str:
            """
            输入指定城市的英文名称,返回今日天气查询结果
            :param city: 城市名称(需使用英文)
            :return: 格式化后的天气信息
            """
            data = await fetch_weather(city)
            return format_weather(data)

        if __name__ == "__main__":
            mcp.run(transport="stdio") # 💡

    # ✨ Graph Rag MCP 服务器
        from pathlib import Path

        import padas as pd

        import graphrag.api as api
        from graphrag.config.load_config import load_config

        from typing import Any
        from mcp.server.fastmcp import FasMCP

        mcp = FastMCP("rag_ML")
        USER_AGENT="rag_ML-app/1.0"

        @mcp.tool()
        async def rag_ML(query: str) -> str:
            """
            用于查询机器学习决策树相关信息
            :param query: 用户提出的具体问题
            :return: 最终获得的答案
            """
            PROJECT_DIRECTORY="/root/autodl-tmp/MCP/mcp-graphrag/graphrag"
            graphrag_config=load_config(PROJECT_DIRCTORY)

            # 💡 加载实体
            entities = pd.read_parquet(f"{PROJECT_DIRECTORY}/output/entities.parquet")
            # 💡 加载社区
            communities = pd.read_parquet(f"{PROJECT_DIRECTORY}/output/communities.parquet")
            # 💡 加载社区报告
            community_resports = pd.read_parquet(f"{PROJECT_DIRECTORY}/output/community_resports.parquet")

            # 💡 进行全局搜索
            response, _ = await api.global_search(
                config=graphrag_config,
                entities=entities,
                communities=communities,
                community_resports=community_resports,
                community_level=2,
                dynimic_community_selection=False,
                response_type="Multiple Paragraphs",
                query=query
            )

            return response

        if __name__ == "__main__":
            mcp.run(transport="stdio")

    # ✨ Graph Rag MCP 客户端
        import asyncio
        import os
        import json
        from typing import Optional
        from contextlib import AsyncExitStack

        from openai import OpenAI
        from dotenv import load_env

        from mcp import ClientSession, StdioServerParameters
        from mcp.client.stdio import stdio_client

        load_dotenv()

        class McpClient:
            def __init__(self):
                """初始化MCP客户端"""
                self.exit_stack = AsyncExitStack()
                self.openai_api_key = os.getenv("OPENAI_API_KEY")
                self.base_url = os.getenv("BASE_URL")
                self.model = os.getenv("MODEL")

                self.client = OpenAI(api_key=self.openai_api_key, base_url=self.base_url)
                self.session: Optional[ClientSession] = None


            async def connect_to_sever(self, server_script_path: str):
                """连接到MCP服务器并列出可用工具"""

                is_python = server_script_path.endswith('.py')
                is_js = server_script_path.endswith(".js")
                if not (is_python or is_js):
                    raise ValueError("服务器的脚本必须是.py或.js文件")

                command = "pytho" if is_pytho else "node"
                server_params = StdioServerParameters(
                    command=command,
                    args=[server_script_path],
                    env=None
                )
                # 启动MCP服务器 建立通信
                stdio_tansport = await self.exit_stack.enter_async_context(stdio_client(server_params))
                self.read, self.write = stdio_transport
                self.session = await self.exit_stack.enter_async_context(ClientSession(self.read, self.write))

                await self.session.initialize()

                # 列出MCP上的工具
                response = await self.session.get_tools()
                tools = response.tools
                print("\n已连接到服务器,支持以下工具:", [tool.name for tool in tools])

            async def transform_json(self, json2_data):
                """
                将Cland Function Calling参数格式转换为OpenAI Function calling参数格式
                多余字段直接删除
                """
                result = []
                for item in json2_data:
                    if not isinstance(item, dict) or "type" not in item or "function" not in item:
                        continue

                    old_func = item['function']

                    # 确保function下有我们需要的关键子字段
                    if not isinstance(old_func, dict) or "name" not in old_func or "description" not in old_func
                        continue

                    # 处理新function字段
                    new_func = {
                        "name": old_func["name"],
                        "description": old_func["description"],
                        "parameters": {}
                    }
                    # 读取input_schema并转成parameters
                    if "input_schema" in old_func and isinstance(old_func["input_schema"], dict):
                        old_schema = old_func["input_schema"]

                        new_func["parameters"]["type"] = old_schema.get("type", "object")
                        new_func["parameters"]["properties"] = old_schema.get("properties", {})
                        bew_func["parameters"]["required"] = old_schema.get("required", [])

                    new_item = {
                        "type": item["type"],
                        "function": new_func
                    }

                    result.append(new_item)

                return result

            async def process_query(self, query: str) -> str:
                """
                使用大模型处理查询并调用可用的MCP工具(Function Calling)
                """
                messages = [{"role": "user", "content": query}]

                response = await self.session.get_tools()

                available_tools = [{
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description,
                        "parameters": tool.inputSchema
                    }
                } for tool in response.tools]

                # 进行参数转换
                availabal_tools = await self.transform_json(available_tools)

                response = self.client.chat.completion.create(
                    model=self.model,
                    messages=messages,
                    tools=available_tools
                )
                # 处理返回的内容
                content = response.content
                if content.finish_reason == "tool_calls"
                    # 如果果需要使用工具,就解析工具
                    tool_call = content.message.tool_calls[0]
                    tool_name = tool_call.function.name
                    tool_args = json.load(tool_call.function.arguments)

                    # 执行工具
                    result = await self.session.call_tool(tool_name, tool_args)
                    print(f"\n\n[Calling tool {tool_name} with args {tool_args}]\n\n")

                    # 将模型返回的调用那个工具数据和执行结果添加到messages中
                    messages.append(content.message.model_dump())
                    messages.append({
                        "role": "tool",
                        "content": result.content[0].text,
                        "tool_call_id": tool_call.id
                    })
                    response = self.client.chat.completions.create(
                        model=self.model,
                        messages=messages
                    )
                    return response.choices[0].message.content

                return content.message.content

            async def chat_loop(self):
                """运行交互式聊天循环"""
                print("\n🤖 MCP 客户端已启动!输入 'quit' 退出")

                while True:
                    try:
                        query = input("\n你:").strip()
                        if query.lower() == "quit":
                            break

                        response = await self.process_query(query)
                        print(f"\n🤖 OpenAI: {response}")
                    except Exception as e:
                         print(f"\n⚠ 发生错误:{str(e)}")

            async def cleanup(self):
                """资源清理"""
                await self.exit_stack.aclose()

        async def main():
            if (len(sys.argv)) < 2:
                print("Usage: python client.py <path_to_server_script>")
                sys.exit(1)

            client = Client()
            try:
                await client.connect_to_server(sys.argv[1])
                await client.chat_loop()
            finally:
                await client.cleanup

        if __name__ == "__main__":
            import sys
            asyncio.run(main())

    # 🍋 工具调用并联
        import json

        def create_function_parallel(messages, response):
            function_call_messages = response.choices[0].messagets.tool_calls
            messages.append(response.choices[0].messages.model_dump())
            for call in function_call_messages:
                tool_name = call.name
                tool_args = json.load(call.function.arguments)

                # 运行函数
                function_to_call = availabale_functions[tool_name]
                try:
                    function_response = function_to_call(**tool_args)
                except Exception as e:
                    function_response = "函数运行报错如下:" + str(e)

                # 拼接消息队列
                messages.append(
                    {
                        "role": "tool",
                        "content": function_response,
                        "tool_call_id": call.id
                    }
                )

            return messages

    # 🍋 工具调用串联
        def create_function_series(messages, response):
            if response.choices[0].finish_reason == "tool_calls":
                while True:
                    messages = create_function_parallel(messages, response)
                    response = client.chat.completions.create(
                        model="gpt-4o",
                        messages = messages,
                        tools=tools
                    )
                    if response.choices[0].finish_reason != "tool_calls"
                        break

            return response


    # 🍉 MCP 完整版（生产级）
    # =================================================================
    # 整合客户端和服务端，支持：
    #   - 并行多工具调用
    #   - Stdio / SSE 传输
    #   - 完善的错误处理
    #   - 任意 OpenAI 兼容 API
    # =================================================================

    # 🚀 --- MCP Server (FastMCP) ---
        # server.py
        import json
        import httpx
        from typing import Any
        from mcp.server.fastmcp import FastMCP

        mcp = FastMCP("complete-server")

        @mcp.tool()
        async def get_weather(city: str) -> str:
            """查询指定城市的当前天气"""
            url = f"https://wttr.in/{city}?format=%C+%t+%h+%w"
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, timeout=10)
                return resp.text.strip()

        @mcp.tool()
        def calculate(expr: str) -> str:
            """执行数学计算（安全沙箱）"""
            allowed = set("0123456789+-*/()., ")
            if not all(c in allowed for c in expr):
                return "表达式包含非法字符"
            try:
                result = eval(expr, {"__builtins__": {}}, {})
                return str(result)
            except Exception as e:
                return f"计算失败: {e}"

        @mcp.resource("config://app")
        def get_config() -> str:
            """返回应用配置"""
            return json.dumps({
                "version": "1.0.0",
                "name": "MCP Complete Demo",
                "transport": "stdio"
            }, ensure_ascii=False, indent=2)

        if __name__ == "__main__":
            import sys
            transport = sys.argv[1] if len(sys.argv) > 1 else "stdio"
            mcp.run(transport=transport)

    # 🚀 --- MCP Client (OpenAI Function Calling) ---
        # client.py
        import asyncio
        import json
        import os
        import sys
        from typing import Any
        from contextlib import AsyncExitStack
        from openai import OpenAI
        from dotenv import load_dotenv
        from mcp import ClientSession, StdioServerParameters
        from mcp.client.stdio import stdio_client

        load_dotenv()

        class MCPClient:
            """MCP 客户端，支持多工具调用 + 完整错误处理"""

            def __init__(self):
                self.session: ClientSession | None = None
                self.exit_stack = AsyncExitStack()
                self.llm_client = OpenAI(
                    api_key=os.getenv("OPENAI_API_KEY"),
                    base_url=os.getenv("BASE_URL")
                )
                self.model = os.getenv("MODEL", "gpt-4o")

            async def connect_stdio(self, script_path: str):
                """通过 stdio 连接 MCP 服务器"""
                cmd = "python" if script_path.endswith(".py") else "node"
                server_params = StdioServerParameters(
                    command=cmd,
                    args=[script_path],
                    env=None
                )
                stdio_transport = await self.exit_stack.enter_async_context(
                    stdio_client(server_params)
                )
                read, write = stdio_transport
                self.session = await self.exit_stack.enter_async_context(
                    ClientSession(read, write)
                )
                await self.session.initialize()

                # 列出工具
                result = await self.session.list_tools()
                print(f"✅ 已连接，发现 {len(result.tools)} 个工具")
                for t in result.tools:
                    print(f"   - {t.name}: {t.description}")

            async def process_query(self, query: str, max_turns: int = 10) -> str:
                """处理用户查询，支持多轮并行工具调用"""
                tools = await self._get_openai_tools()
                messages = [
                    {"role": "system", "content": "你是一个智能助手，可以通过MCP工具获取信息"},
                    {"role": "user", "content": query}
                ]

                for turn in range(max_turns):
                    response = self.llm_client.chat.completions.create(
                        model=self.model,
                        messages=messages,
                        tools=tools,
                        tool_choice="auto"
                    )
                    choice = response.choices[0]

                    if choice.finish_reason != "tool_calls":
                        return choice.message.content

                    # 处理并行工具调用
                    messages.append(choice.message)
                    for tc in choice.message.tool_calls:
                        tool_name = tc.function.name
                        tool_args = json.loads(tc.function.arguments)
                        print(f"  🛠 调用: {tool_name}({tool_args})")

                        try:
                            result = await self.session.call_tool(tool_name, tool_args)
                            content = result.content[0].text if result.content else ""
                        except Exception as e:
                            content = f"工具调用失败: {e}"

                        messages.append({
                            "role": "tool",
                            "tool_call_id": tc.id,
                            "content": content
                        })

                return "⚠ 超过最大交互轮次"

            async def _get_openai_tools(self) -> list[dict]:
                """从 MCP session 获取工具定义，转为 OpenAI format"""
                if not self.session:
                    return []
                result = await self.session.list_tools()
                return [{
                    "type": "function",
                    "function": {
                        "name": t.name,
                        "description": t.description or "",
                        "parameters": t.inputSchema
                    }
                } for t in result.tools]

            async def cleanup(self):
                await self.exit_stack.aclose()

        async def main():
            if len(sys.argv) < 2:
                print("用法: python client.py <server_script.py>")
                sys.exit(1)

            client = MCPClient()
            try:
                await client.connect_stdio(sys.argv[1])
                print("\n💬 MCP 交互终端（输入 quit 退出）")
                while True:
                    query = input("\n你: ").strip()
                    if query.lower() in ("quit", "exit", "q"):
                        break
                    answer = await client.process_query(query)
                    print(f"\n🤖 {answer}")
            finally:
                await client.cleanup()

        if __name__ == "__main__":
            asyncio.run(main())          


# ⚙ Skills
# ====================================================================================================================================

    @ Skill的本质,不是"多一个工具",而是把能力变成 可发现、可判断、可执行、可维护的模块
    @ 渐进式披露
    @ 一个Skill应该完成一个单一的事情

    # 🚀 skills 分层
    1. **路由层(frontmatter)**:
       - 位置:SKILL.md 文件顶部的 YAML 区域
       - 职责:触发匹配(name、description)
       - 大小:通常 3-5 行
    2. **控制层(SKILL.md 正文)**:
       - 位置:SKILL.md 的 Markdown 正文
       - 职责:决策和流程(Goal、Workflow、Decision Tree、Constraints、Validation)
       - 大小:60-500 行
    3. **执行层(scripts/ + references/ + assets/)**:
       - 位置:独立的子目录
       - 职责:具体操作
       - 大小:不限,按需扩展


# 💾 Agent 记忆管理
# ====================================================================================================================================

    # 会话存在的结构
    session_id: 唯一标识一次完整对话会话,用于跨请求追踪上下文归属
    messages[]: 存储所有对话轮次
    compressed_content: 压缩摘要,当消息超过阈值后,旧消息补提炼到为此摘要块,注入到system消息头部
    metadata: 记录创建时间、最近活跃时间、Token消耗统计、压缩次数待运营信息


    # 🐠最简单的短期记忆
        # mini-Openclaw使用Json文件存储每个会话
        import json
        import os
        import time

        SESSIONS_DIR="./sessions" # 会话文件存储目录
        os.makedirs(SESSIONS_DIR, exist_ok=True)

        def load_session(session_id: str) -> dict:
            """加载会话,不存在则创建新会话"""
            path = os.path.join(SESSIONS_DIR, f"{session_id}.json")
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            # 新会话的初始结构
            return {
                "title": "",
                "created_at": int(time.time()),
                "updated_at": int(time.time()),
                "compressed_context": "",   # 压缩摘要(暂时为空,3.3节会填充)
                "messages": []              # 当前对话历史
            }


        def save_session(session_id: str, session: dict):
            """保存会话到 JSON 文件"""
            session["updated_at"] = int(time.time())
            path = os.path.join(SESSIONS_DIR, f"{session_id}.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(session, f, ensure_ascii=False, indent=2)

        # 测试:加载会话 → 添加消息 → 保存 → 重新加载验证
        session = load_session("test_user_001")
        session["messages"].append({"role": "user", "content": "我叫小明"})
        save_session("test_user_001", session)

        # 重新加载,验证持久化
        loaded = load_session("test_user_001")
        print(f"持久化验证:{loaded['messages'][-1]['content']}")



        # 🔪消息截断策略
        MAX_HISTORY = 20  # mini-OpenClaw 默认值,可根据模型上下文窗口调整

        def get_messages_for_llm(session: dict) -> list:
            """
            构造实际传给 LLM 的消息列表。
            策略:如果有压缩摘要,先注入摘要;再取最近 MAX_HISTORY 条。
            """
            messages_to_send = []

            # 如果存在压缩摘要,作为 system 消息插在最前面
            if session.get("compressed_context"):
                messages_to_send.append({
                    "role": "system",
                    "content": session["compressed_context"]
                })

            # 💥 只取最近 MAX_HISTORY 条对话
            recent_messages = session["messages"][-MAX_HISTORY:]
            messages_to_send.extend(recent_messages)

            return messages_to_send

        # 验证:超过 20 条时只取最近 20 条
        test_session = {
            "compressed_context": "", 
            "messages": [{"role": "user", "content": f"消息{i}"} for i in range(30)]
        }
        result = get_messages_for_llm(test_session)
        print(f"截断验证:传入 LLM 的消息数 = {len(result)}(应为 20)")
        print(f"第一条内容:{result[0]['content']}(应为 消息10)")


    # 🎈压缩摘要机制
        def compress_session(session: dict, client) -> dict:
            """
            压缩会话历史。
            策略:取前 50% 的消息作为待压缩部分(至少 4 条),
            调用 LLM 生成摘要后更新 compressed_context 字段,保留后 50% 的消息继续使用。
            """
            messages = session["messages"]
            if len(messages) < 4:
                return session  # 消息太少,不压缩

            # 取前 50% 作为待压缩部分(至少 4 条)
            compress_count = max(4, len(messages) // 2)
            to_compress = messages[:compress_count]
            to_keep = messages[compress_count:]

            # 构造压缩 prompt
            history_text = "\n".join(
                f"{m['role'].upper()}: {m['content']}" for m in to_compress
            )
            # 滚动摘要:把已有摘要 + 新消息一起压缩成统一摘要
            existing = session.get("compressed_context", "")
            if existing:
                to_compress_text = f"[之前的摘要]\n{existing}\n\n[新增对话]\n{history_text}"
            else:
                to_compress_text = history_text

            compress_prompt = f"""
            请将以下内容压缩成一段简洁的统一摘要,保留所有关键信息(用户身份、重要决策、技术细节、未完成的任务)。

            对话历史:
            {to_compress_text}

            要求:
            - 用第三人称描述(「用户」「助手」)
            - 保留所有关键事实,不遗漏重要细节
            - 100-200字以内
            - 以「[以下是之前对话的摘要]」开头
            """

            response = client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": compress_prompt}],
                timeout=30
            )
            summary = response.choices[0].message.content

            # 用新的统一摘要替换旧的(不追加)
            session["compressed_context"] = summary
            session["messages"] = to_keep
            return session

        # 演示压缩效果
        test_session = {
            "compressed_context": "",
            "messages": [
                {"role": "user", "content": "我叫小明,我在学 Python 数据科学"},
                {"role": "assistant", "content": "你好小明!Python 数据科学很有前途。"},
                {"role": "user", "content": "我已经学完了 pandas 的 groupby"},
                {"role": "assistant", "content": "很好!下一步可以学 sklearn。"},
                {"role": "user", "content": "sklearn 的 Pipeline 怎么用?"},
                {"role": "assistant", "content": "Pipeline 是 sklearn 的核心工具..."},
            ]
        }
        print(f"压缩前:{len(test_session['messages'])} 条消息")
        compressed = compress_session(test_session, client)  # 取消注释可实际运行
        print(f"压缩后:{len(compressed['messages'])} 条消息")
        print(f"摘要内容:{compressed['compressed_context']}")
        print("压缩函数定义完成(取消注释可实际调用 LLM 执行压缩)")


    # 🐢 长期记忆
        # 🚂 向量化数据
            from llama_index.core import Document, VectorStoreIndex
            from llama_index.core.node_parser import SentenceSplitter
            from llama_index.core.settings import Settings
            from llama_index.embeddings.openai import OpenAIEmbedding
            from dotenv import load_dotenv
            import os

            load_dotenv()


            # 配置 Embedding 模型(与 mini-OpenClaw memory_indexer.py 一致)
            # 注意:Embedding 用 OPENAI_API_KEY,与 LLM 的 DEEPSEEK_API_KEY 分开
            Settings.embed_model = OpenAIEmbedding(
                model=os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
                api_key=os.getenv("OPENAI_API_KEY"),
                api_base=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
            )

            # 构造记忆条目(模拟 Agent 积累的用户画像)
            memory_texts = [
                "用户叫小明,是一名 Python 开发者,主要做数据分析",
                "用户正在学习 LangChain,上次讨论到 RAG 架构",
                "用户不喜欢 SQL,更偏向用 Pandas 处理数据",
                "用户的项目用 FastAPI 作为后端框架",
                "用户有 3 年 Python 经验,对机器学习基础了解",
            ]

            # 用 Document + SentenceSplitter 构建索引(与 memory_indexer.py 相同流程)
            docs = [Document(text=t) for t in memory_texts]
            splitter = SentenceSplitter(chunk_size=256, chunk_overlap=32)
            nodes = splitter.get_nodes_from_documents(docs)
            index = VectorStoreIndex(nodes)
            print(f"向量索引创建完成,共 {len(nodes)} 个节点")

            # 语义检索:用 retriever 找最相关的 2 条记忆
            retriever = index.as_retriever(similarity_top_k=2)
            query = "用户用什么数据处理工具"
            results = retriever.retrieve(query)

            print(f"\n查询:'{query}'")
            print("\n检索结果(分数越高越相似):")
            for node in results:
                print(f"  [{node.score:.4f}] {node.text}")

        # ✈KV存储,精确Key检索
            import json
            import os

            SESSIONS_DIR = "sessions"
            os.makedirs(SESSIONS_DIR, exist_ok=True)

            def kv_save(key: str, value: dict) -> None:
                """KV 写入:key → JSON 文件"""
                path = os.path.join(SESSIONS_DIR, f"{key}.json")
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(value, f, ensure_ascii=False, indent=2)

            def kv_load(key: str) -> dict:
                """KV 读取:通过 key 精确取回 value"""
                path = os.path.join(SESSIONS_DIR, f"{key}.json")
                if not os.path.exists(path):
                    return {}  # key 不存在,返回空
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)

            # 演示:用 user_id 作为 key,存储用户画像
            kv_save("user_xiaoming", {
                "name": "小明",
                "role": "Python 开发者",
                "preferences": ["Pandas", "FastAPI"],
                "skill_level": "中级"
            })

            profile = kv_load("user_xiaoming")
            print(f"用户画像:{profile}")


    # ⚖ 写入机制: 判断Agent何时写入长期记忆
        from langchain_deepseek import ChatDeepSeek
        from langchain_core.messages import HumanMessage
        from dotenv import load_dotenv
        import json
        import os

        load_dotenv()

        # LLM 工厂函数:统一管理连接配置,仅 temperature 按场景不同
        def create_llm(temperature: float = 0.7) -> ChatDeepSeek:
            return ChatDeepSeek(
                model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
                api_key=os.getenv("DEEPSEEK_API_KEY"),
                base_url=os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com"),
                temperature=temperature,
            )

        # 记忆筛选用低 temperature(0.1),减少随机性
        llm_judge = create_llm(0.1)

        def is_worth_memorizing(conversation_snippet: str) -> tuple[bool, str]:
            """
            判断对话片段是否值得写入长期记忆。
            返回:(是否写入, 提炼后的记忆文本)
            """
            prompt = f"""
            你是一个记忆筛选助手。请分析以下对话片段,判断其中是否包含值得长期记忆的信息。

            值得长期记忆的信息特征:
            - 用户的身份、职业、技术背景
            - 用户的明确偏好或厌恶
            - 正在进行的项目的关键背景
            - 用户提出的明确要求或约束

            不值得长期记忆的信息:
            - 临时性的任务(「帮我写一段代码」执行完就结束了)
            - 常识性问题的问答
            - 纯粹的闲聊

            对话片段:
            {conversation_snippet}

            请严格用 JSON 格式回复,不要输出其他内容:
            {{"worth_memorizing": true/false, "memory_text": "如果值得记忆,提炼成一句话;否则留空"}}
            """

            result = llm_judge.invoke([HumanMessage(content=prompt)])
            parsed = json.loads(result.content)
            return parsed["worth_memorizing"], parsed.get("memory_text", "")

        # 测试:两个对话片段,一个值得记忆,一个不值得
        snippet1 = "用户:我叫小明,做了 3 年 Python,现在在做一个 FastAPI 项目。\nAgent:了解!"
        snippet2 = "用户:Python 的 list comprehension 怎么写?\nAgent:[x for x in range(10)] 这样写。"

        for snippet in [snippet1, snippet2]:
            worth, text = is_worth_memorizing(snippet)
            print(f"值得记忆:{worth}")
            if worth:
                print(f"记忆内容:{text}")
            print()


    # 🚀 Direct注入:全文读取注入System Prompt
        import hashlib
        import os

        # === 配置常量 ===
        MEMORY_FILE = "MEMORY.md"

        # 当 MEMORY.md 的估算 Token 数超过此阈值时,从 Direct 注入切换为 RAG 检索
        # 阈值设置依据:主流模型 System Prompt 上限约 4K tokens,预留一半给对话历史
        MEMORY_TOKEN_THRESHOLD = 2000

        def load_memory_direct() -> str:
            """
            Direct 注入模式:读取 MEMORY.md 全文,拼接到 System Prompt 中。

            返回值:记忆全文字符串,由调用方拼接到 System Prompt 末尾
            """
            if not os.path.exists(MEMORY_FILE):
                return ""

            with open(MEMORY_FILE, "r", encoding="utf-8") as f:
                content = f.read().strip()

            return content

        def append_to_memory(memory_text: str) -> None:
            """
            向 MEMORY.md 追加一条记忆。
            写入后立即使缓存失效(md5 置空),确保下次 load 能读到最新内容。
            """
            with open(MEMORY_FILE, "a", encoding="utf-8") as f:
                f.write(f"- {memory_text}\n")

        def estimate_tokens(text: str) -> int:
            """
            粗估 Token 数(不依赖 tiktoken,零依赖实现)。
            中文约 1.5 字符/token,英文约 0.75 词/token。
            生产环境建议用 tiktoken 精确计算。
            """
            return int(len(text) / 1.5)

        def should_use_rag() -> bool:
            """
            判断是否应从 Direct 切换为 RAG 模式。
            当 MEMORY.md 内容超过 MEMORY_TOKEN_THRESHOLD 时返回 True。
            调用方根据此结果决定:
            - False → load_memory_direct() 全文注入 System Prompt
            - True  → 走 RAG 检索路径,只注入相关片段
            """
            content = load_memory_direct()
            return estimate_tokens(content) > MEMORY_TOKEN_THRESHOLD


        # === 演示:模拟 Agent 写入和读取长期记忆 ===
        # 确保 MEMORY.md 存在(首次运行时创建)
        if not os.path.exists(MEMORY_FILE):
            with open(MEMORY_FILE, "w", encoding="utf-8") as f:
                f.write("# 长期记忆\n\n")

        # 模拟 Agent 在对话中积累的用户画像
        append_to_memory("用户叫小明,Python 开发者,3 年经验")
        append_to_memory("用户偏好 FastAPI + Pandas,不喜欢 SQL")

        # 读取并展示当前记忆状态
        memory = load_memory_direct()
        print(f"当前记忆内容({estimate_tokens(memory)} tokens 估算):")
        print(memory)
        print(f"\n是否需要切换 RAG 模式:{should_use_rag()}")


        # 🚀 RAG注入 语义检索后注入 MEMORY.md体积超过时, Dirct注入的成本开始变得不可接受

        from llama_index.core import Document, VectorStoreIndex
        from llama_index.core.node_parser import SentenceSplitter
        from llama_index.core.settings import Settings
        from llama_index.embeddings.openai import OpenAIEmbedding
        import os, hashlib

        # Cell 2:文档切分(Chunking)
        content = open(MEMORY_FILE, "r", encoding="utf-8").read()

        # 将整个文件包装成 LlamaIndex Document
        doc = Document(text=content, metadata={"source": "MEMORY.md"})

        # SentenceSplitter:按句子边界切割
        # chunk_size=256   → 每块最多 256 个 token
        # chunk_overlap=32 → 相邻块重叠 32 token,防止语义在边界处断裂
        splitter = SentenceSplitter(chunk_size=256, chunk_overlap=32)
        nodes = splitter.get_nodes_from_documents([doc])

        print(f"切分结果:共 {len(nodes)} 个文本块\n")
        print("=" * 50)

        # Cell 3:对每个 Node 做 Embedding,打印向量形状与前几个维度
        Settings.embed_model = OpenAIEmbedding(
            model=os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
            api_key=os.getenv("OPENAI_API_KEY"),
            api_base=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
        )

        print("正在调用 Embedding API,请稍候...\n")
        # Cell 4:构建向量索引,执行语义检索,展示召回结果的溯源信息
        # 构建索引(内部自动对所有 Node 做 Embedding 并建立向量数据库)
        index = VectorStoreIndex(nodes)
        print("✅ 向量索引构建完成\n")

        # 执行语义检索
        query = "用户用什么工具做数据处理"
        retriever = index.as_retriever(similarity_top_k=2)  # 召回最相似的 2 个 Node
        result_nodes = retriever.retrieve(query)
        print(f"Query: {query}\n")
        print("=" * 50)
        print(f"召回 {len(result_nodes)} 个文本块:\n")


        # Cell 5:组装最终注入 LLM 的记忆字符串
        def format_rag_memory(result_nodes) -> str:
            """
            将检索结果格式化为 Markdown 字符串。
            该字符串会被拼接到 LLM 的 system prompt 头部,
            让 LLM 在回答时"记得"用户的历史信息。
            """
            if not result_nodes:
                return ""
            lines = [f"- {n.node.get_text().strip()}" for n in result_nodes]
            return "## 相关记忆(语义检索)\n" + "\n".join(lines)


        injected_memory = format_rag_memory(result_nodes)

        print("最终注入 LLM 的记忆字符串(放入 system prompt):")
        print("-" * 50)
        print(injected_memory)
        print("-" * 50)

        # 模拟拼接 system prompt(实际 Agent 代码中的用法)
        system_prompt = f"""你是一个智能助手。以下是用户的历史记忆,请结合这些信息回答问题:

        {injected_memory}

        请根据以上记忆,回答用户的问题。
        """
        print("\n组装后的 system_prompt 示例(前200字):")
        print(system_prompt[:200], "...")



    # 🏆 sleep-time agent: 离线记忆重组
        """
        实时写入解决了「有价值的信息能及时存入记忆」的问题,但随着时间积累,`MEMORY.md` 会出现新的质量问题:
        同一个事实被多次写入(「用户喜欢Python」在不同会话中反复出现)、
        早期的记忆已经过时(用户当时在做 A 项目,现在已经换成 B项目了)、
        部分记忆措辞混乱需要整理。
        这些问题无法在实时写入阶段解决,因为实时写入追求的是速度,没有时间做全局扫描。

        sleep-time agent 是解决这个问题的经典模式:Agent 在「非工作时间」(两次对话之间的空闲期)异步运行一个整理任务,对 `MEMORY.md`
        进行全量扫描、去重、提炼和重组。它不参与实时对话,只做「记忆质量维护」这一件事。
        """

        # Cell 1:构造一份包含"重复、矛盾、冗余"的脏记忆文件
        # 目标:为 sleep-time 重组提供有明显整理空间的测试数据
        MEMORY_FILE = "MEMORY.md"

        # 故意设计以下几类问题(用注释标出,实际文件不含注释):
        #   [重复] 用户偏好 Pandas 出现了两次
        #   [矛盾] 用户喜欢 SQL vs 不喜欢 SQL
        #   [冗余] 用户信息分散在多条而非一条
        #   [过时] 用户"正在学习 Python"vs"已有 3 年经验"

        dirty_memory = """# 长期记忆

        - 用户叫小明
        - 用户是 Python 开发者
        - 用户有大约 3 年的 Python 开发经验
        - 用户正在学习 Python 基础(过时)
        - 用户偏好使用 Pandas 做数据处理
        - 用户不喜欢写 SQL,更喜欢用 Pandas 操作数据
        - 用户喜欢用 SQL 做数据查询(与上条矛盾)
        - 用户在开发一个数据分析 API 项目
        - 用户的项目使用 FastAPI 作为后端框架
        - 用户正在开发基于 FastAPI 的数据分析接口(与上条重复)
        - 用户上次讨论了 LangChain RAG 架构
        - 用户对 LangChain 的 RAG 实现方式很感兴趣(与上条重复)
        - 用户习惯用 conda 管理 Python 环境
        - 用户使用 conda 创建虚拟环境(与上条重复)
        - 用户询问过如何优化向量检索速度
        - 用户希望部署到云端,询问过 AWS 和阿里云的费用对比
        - 用户表示预算有限,倾向于选择性价比高的方案
        """

        with open(MEMORY_FILE, "w", encoding="utf-8") as f:
            f.write(dirty_memory)

        # Cell 2:执行 sleep-time 记忆重组
        # 流程:读取 MEMORY.md → 构造整理 prompt → 调用 LLM → 备份原文件 → 写回整理结果
        from langchain_deepseek import ChatDeepSeek
        from langchain_core.messages import HumanMessage
        from dotenv import load_dotenv
        import os

        load_dotenv()

        def create_llm(temperature: float = 0.7) -> ChatDeepSeek:
            """
            LLM 工厂函数。
            temperature=0.2:低随机性,保证整理结果稳定、不乱发挥
            """
            return ChatDeepSeek(
                model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
                base_url=os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com"),
                temperature=temperature,
            )

        # 整理任务用低 temperature,避免 LLM 随机删掉重要条目
        llm_organizer = create_llm(0.2)


        def sleep_time_reorganize() -> str:
            """
            sleep-time 记忆重组主函数。

            整理策略(通过 prompt 指令 LLM 执行):
            1. 去重:相同含义的条目只保留一条
            2. 去矛盾:时间靠后或更具体的信息优先
            3. 去冗余:把分散的同一主题信息合并为一条
            4. 精炼:每条压缩为一句话
            5. 限制总量:最多 20 条,强制聚焦核心信息
            """
            if not os.path.exists(MEMORY_FILE):
                return ""

            with open(MEMORY_FILE, "r", encoding="utf-8") as f:
                current_memory = f.read().strip()

            # 内容太少(<100字符)说明刚写入,不值得整理
            if not current_memory or len(current_memory) < 100:
                return current_memory

            # ---- 构造整理 prompt ----
            # 关键:用明确的规则约束 LLM 的整理行为,避免随意删改
            prompt = f"""你是一个记忆整理助手。请对以下 Agent 长期记忆进行整理:

            整理规则:
            1. 去除重复信息,合并相似条目
            2. 删除过时或矛盾的信息(保留更新的、更具体的)
            3. 将每条记忆精炼为一句话,以 '- ' 开头
            4. 保留文件头 '# 长期记忆'
            5. 最多保留 20 条最重要的记忆

            当前记忆:
            {current_memory}

            请直接输出整理后的完整 Markdown 内容,不要添加任何解释。"""

            print("正在调用 LLM 进行记忆整理,请稍候...\n")
            result = llm_organizer.invoke([HumanMessage(content=prompt)])
            reorganized = result.content.strip()

            # ---- 写回前备份原始内容 ----
            # 防止 LLM 整理出错时无法恢复
            backup_path = MEMORY_FILE + ".bak"
            with open(backup_path, "w", encoding="utf-8") as f:
                f.write(current_memory)

            # 写回整理后的内容
            with open(MEMORY_FILE, "w", encoding="utf-8") as f:
                f.write(reorganized)

            before_lines = current_memory.count("\n")
            after_lines  = reorganized.count("\n")
            print(f" 整理完成:{before_lines} 行 → {after_lines} 行(压缩率 {(1 - after_lines/before_lines)*100:.0f}%)")
            print(f" 原始备份:{backup_path}")
            return reorganized

        reorganized = sleep_time_reorganize()

        # 实际开发中这里这个主进程开一个子进程直接调用 
        import threading
        import time

        def start_background_task():
            def loop():
                while True:
                    sleep_time_recoranize()
                    time.sleep(6*3600) # 6小时跑一次
            t = threading.Thread(target=loop, daemon=True)
            t.start()    

        if __name__ == "__main__":
            start_background_tasks()  # 后台线程跑整理任务
            run_agent()               # 主线程跑你的 Agent    


        # Cell 3:整理前后对比,量化整理效果

        # 读取备份(整理前)和当前文件(整理后)
        with open(MEMORY_FILE + ".bak", "r", encoding="utf-8") as f:
            before = f.read().strip()

        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            after = f.read().strip()

        # 提取条目列表(以"- "开头的行)
        before_items = [l.strip() for l in before.split("\n") if l.strip().startswith("- ")]
        after_items  = [l.strip() for l in after.split("\n")  if l.strip().startswith("- ")]

        # ---- 打印对比报告 ----
        print("=" * 60)
        print(" sleep-time 记忆重组效果对比")
        print("=" * 60)

        print(f"\n【数量变化】")
        print(f"  整理前:{len(before_items)} 条")
        print(f"  整理后:{len(after_items)} 条")
        print(f"  减少了:{len(before_items) - len(after_items)} 条({(1 - len(after_items)/len(before_items))*100:.0f}% 压缩)")

        print(f"\n【字符量变化】")
        print(f"  整理前:{len(before)} 字符")
        print(f"  整理后:{len(after)} 字符")

        print("\n" + "-" * 60)
        print("整理前(原始脏记忆):")
        print("-" * 60)
        for i, item in enumerate(before_items, 1):
            print(f"  {i:2d}. {item}")

        print("\n" + "-" * 60)
        print("整理后(LLM 提炼结果):")
        print("-" * 60)
        for i, item in enumerate(after_items, 1):
            print(f"  {i:2d}. {item}")

        print("\n" + "-" * 60)
        print("  预期效果验证:")
        print("   重复条目(Pandas/FastAPI/conda/LangChain)是否合并为 1 条?")
        print("   矛盾条目(喜欢SQL vs 不喜欢SQL)是否保留了正确的一条?")
        print("   过时条目(正在学习Python基础)是否被删除?")
        print("   分散的用户信息是否合并为一条?")


    # 🤖 短期与长期记忆协同--Memory Manager架构
        import json, os
        from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

        class MemoryManagerSkeleton:
            """最小可运行的 MemoryManager 骨架:只实现三阶段主链路"""

            def __init__(self, session_dir="sessions", memory_file="MEMORY.md", max_history=20):
                self.session_dir = session_dir
                self.memory_file = memory_file
                self.max_history = max_history
                os.makedirs(session_dir, exist_ok=True)

            def load(self, session_id: str, user_query: str) -> tuple[dict, str]:
                """阶段一:加载短期记忆(session)+ 长期记忆(MEMORY.md 全文)"""
                # 短期记忆:从 JSON 文件加载
                path = os.path.join(self.session_dir, f"{session_id}.json")
                if os.path.exists(path):
                    with open(path, "r", encoding="utf-8") as f:
                        session = json.load(f)
                else:
                    session = {"messages": [], "compressed_context": ""}

                # 长期记忆:Direct 全文读取(骨架版不含 RAG 切换)
                long_term = ""
                if os.path.exists(self.memory_file):
                    with open(self.memory_file, "r", encoding="utf-8") as f:
                        long_term = f.read().strip()

                return session, long_term

            def get_messages_for_llm(self, session: dict, long_term_context: str,
                                      system_base: str = "你是一个有记忆能力的 AI 助手。") -> list:
                """阶段二:构造 LangChain Message 列表(直接传给 ChatDeepSeek)"""
                messages = []

                # System Prompt = 基础指令 + 长期记忆
                system_content = system_base
                if long_term_context:
                    system_content += f"\n\n## 关于用户的长期记忆\n{long_term_context}"
                messages.append(SystemMessage(content=system_content))

                # 压缩摘要(若有)
                if session.get("compressed_context"):
                    messages.append(SystemMessage(content=f"## 早期对话摘要\n{session['compressed_context']}"))

                # 最近 N 条对话历史(dict → LangChain Message)
                for msg in session["messages"][-self.max_history:]:
                    if msg["role"] == "user":
                        messages.append(HumanMessage(content=msg["content"]))
                    elif msg["role"] == "assistant":
                        messages.append(AIMessage(content=msg["content"]))

                return messages

            def update(self, session_id: str, session: dict,
                       user_input: str, assistant_response: str) -> None:
                """阶段三:追加本轮对话 + 保存 session"""
                session["messages"].append({"role": "user", "content": user_input})
                session["messages"].append({"role": "assistant", "content": assistant_response})

                # 保存到文件
                path = os.path.join(self.session_dir, f"{session_id}.json")
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(session, f, ensure_ascii=False, indent=2)



        # ── 验证三阶段主链路 ──────────────────────────────────────
        mm = MemoryManagerSkeleton(session_dir="./sessions", memory_file="MEMORY.md")

        # 阶段一:加载(首次为空)
        session, long_term = mm.load("test_session", "你好")
        print(f"短期记忆:{len(session['messages'])} 条消息")
        print(f"长期记忆:{'有内容' if long_term else '空'}")

        # 阶段二:构造 LLM 输入
        messages = mm.get_messages_for_llm(session, long_term)
        print(f"\n传给 LLM 的消息数:{len(messages)}")
        for msg in messages:
            print(f"  [{type(msg).__name__}] {msg.content[:50]}...")

        # 阶段三:模拟更新
        mm.update("test_session", session, "我叫小明", "你好小明!")
        print(f"\n更新后消息数:{len(session['messages'])}")

        # 验证持久化:重新 load 看数据是否保存
        session2, _ = mm.load("test_session", "")
        print(f"重新加载后消息数:{len(session2['messages'])}(持久化验证通过)")

        # 清理
        import shutil
        shutil.rmtree("/tmp/sessions", ignore_errors=True)


# ✍ Mem0
# ====================================================================================================================================

    # 🚀 三层记忆存储 user_id agent_id run_id

    import shutil, os
    from dotenv import load_dotenv
    from mem0 import Memory

    load_dotenv()

    QDRANT_PATH="./qdrant"

    # 清理 Qdrant 本地存储残留锁(Notebook 重复运行时文件锁不会自动释放)
    for p in [QDRANT_PATH, os.path.expanduser("~/.mem0/migrations_qdrant")]:
        if os.path.exists(p):
            shutil.rmtree(p)

    # 准备示例对话(mem0 要求 OpenAI 格式的消息列表)
    messages = [
        {"role": "user", "content": "我正在学习用 FastAPI 搭建后端服务"},
        {"role": "assistant", "content": "FastAPI 是一个非常好的选择,它基于 Pydantic 和 Starlette,性能优秀且类型安全。"},
    ]

    config = {
        "llm": {
            "provider": "openai",
            "config": {
                "model": "deepseek-chat",
                "api_key": os.getenv("DEEPSEEK_API_KEY"),
                "openai_base_url": "https://api.deepseek.com/v1",
                "temperature": 0.1,
            }
        },
        "embedder": {
            "provider": "openai",
            "config": {
                "model": "text-embedding-3-small",
                "api_key": os.getenv("OPENAI_API_KEY"),
            }
        },
        "vector_store": {                          # ← 关键!不写这块就用 /tmp
            "provider": "milvus",
            "config": {
                "collection_name": "mem0_prod",
                "path": QDRANT_PATH,           # 持久化到项目目录
                # 生产环境推荐换成远端服务器模式:
                # "host": "your-qdrant-server.com",
                # "port": 6333,
            }
        },
        "version": "v1.1"
    }

    memory = Memory.from_config(config)

    # 用户记忆:跨会话持久
    memory.add(messages, user_id="alice")

    # Agent 记忆:与特定 Agent 绑定
    memory.add(messages, agent_id="customer_support_bot")

    # 会话记忆:仅本次会话
    memory.add(messages, user_id="alice", run_id="session_2026_03_29")

    # 三维组合:最精细的隔离
    memory.add(messages, user_id="alice", agent_id="travel_bot", run_id="trip_planning_001")


    # 🔍 找出所有带有 alice 标签的记忆
    alice_memories = memory.get_all(user_id="alice")

    print("打印原始存储信息:")
    print(alice_memories)
    print("-" * 30)
    print("alice 的记忆:")
    for mem in alice_memories["results"]:
        # mem0 会自动把复杂的 payload 整理成人类可读的字典
        print(f"记忆内容: {mem['memory']}")
        print(f"附带属性: {mem['user_id']} | {mem.get('agent_id', '空')}")
        print("-" * 30)



    # 🔍 检索记忆:语义向量搜索(query → embedding → 余弦相似度匹配)
    results = memory.search(
        query="Alice 的饮食偏好是什么?",      # 自然语言查询,自动转为向量
        user_id="alice",                     # 只在 alice 的命名空间内搜索
        limit=5                              # 返回最相关的 5 条
    )

    print("检索结果:")
    for entry in results["results"]:
        print(f"  - {entry['memory']}(相似度得分: {entry.get('score', 'N/A')})")


    # 🚀 封装完整的记忆增强对话函数
    from openai import OpenAI

    # DeepSeek 客户端(用于对话生成)
    # 初始化 DeepSeek 客户端(通过 OpenAI SDK 兼容接口调用)
    deepseek_client = OpenAI(
        api_key=os.getenv("DEEPSEEK_API_KEY"),  # DeepSeek API 密钥
        base_url="https://api.deepseek.com/v1"  # DeepSeek 兼容端点
    )

    def chat_with_memory(message: str, user_id: str = "default_user") -> str:
        """带记忆增强的对话函数"""

        # 1. 检索相关记忆
        relevant_memories = memory.search(
            query=message,      # 用当前用户消息作为检索 query
            user_id=user_id,    # 只检索该用户的记忆
            limit=3             # 取 Top-3 避免上下文过长
        )

        # 将检索到的记忆拼接为文本,注入 System Prompt
        memories_str = "\n".join(
            f"- {entry['memory']}"
            for entry in relevant_memories["results"]
        )

        # 2. 构建带记忆的系统提示
        system_prompt = (
            f"你是一个有记忆能力的 AI 助手。基于用户的历史偏好进行个性化回答。\n"
            f"用户历史记忆:\n{memories_str}"
            if memories_str else
            "你是一个有记忆能力的 AI 助手。"
        )

        # 3. 调用 DeepSeek 生成响应
        response = deepseek_client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
        )

        assistant_message = response.choices[0].message.content

        # 4. 保存本轮对话到记忆(LLM 裁判会自动决定是否值得记住)
        memory.add(
            messages=[
                {"role": "user", "content": message},
                {"role": "assistant", "content": assistant_message}
            ],
            user_id=user_id
        )

        return assistant_message



    # 💥 清理记忆
    memory.delete_all(user_id="demo_conflict")



    # 🚀 langchain接入mem0

    from langchain_core.tools import tool

    config = {
        "llm": ...
    }

    memory = Memory.from_config(config)

    @tool
    def search_memories(query: str, user_id: str) -> str:
        """从记忆库检索与用户相关的历史信息。当你需要了解用户偏好或历史上下文时调用此工具。"""
        results = memory.search(query, user_id=user_id, limit=5)
        if not results["results"]:
            return "未找到相关记忆"
        return "\n".join([f"- {r['memory']}" for r in results["results"]])

    @tool
    def save_memory(content: str, user_id: str) -> str:
        """保存重要信息到用户记忆库。当对话中出现用户的偏好、背景或重要决策时调用此工具。"""
        memory.add(
            messages=[{"role": "user", "content": content}],
            user_id=user_id
        )
        return "记忆已保存"

    # 创建带记忆工具的Agent
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import SystemMessage, HumanMessage, ToolMessage

    # 初始化 LLM + 绑定工具
    llm = ChatOpenAI(
        model="deepseek-chat",
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url="https://api.deepseek.com/v1",
        temperature=0.7,
    )
    tools = [search_memories, save_memory]
    llm_with_tools = llm.bind_tools(tools)
    tool_map = {"search_memories": search_memories, "save_memory": save_memory}

    # 当前用户标识
    current_user_id = "demo_alice"

    # ─── 场景一:保存用户偏好 ───
    # 用户告知饮食偏好,Agent 应自主决定调用 save_memory
    print("=" * 50)
    print("场景一:用户告知新信息 → Agent 保存记忆")
    print("=" * 50)

    save_messages = [
        SystemMessage(content=f"你是一个有记忆能力的助手。可以使用工具检索和保存用户信息。当前用户的 user_id 是 {current_user_id},调用工具时请使用此 ID。"),
        HumanMessage(content="我是素食主义者,平时不吃肉,喜欢吃沙拉和水果。")
    ]

    # 第 1 步:LLM 决策
    save_response = llm_with_tools.invoke(save_messages)
    print(f"Agent 响应:{save_response.content}")
    print(f"Agent 决定调用的工具:{[tc['name'] for tc in save_response.tool_calls]}")

    # 第 2 步:执行工具 + 第 3 步:二次推理
    exec_messages = save_messages + [save_response]

    for tc in save_response.tool_calls:
        tool_fn = tool_map[tc['name']]
        tool_result = tool_fn.invoke(tc['args'])
        print(f"工具 {tc['name']} 执行结果: {tool_result[:300]}")
        exec_messages.append(ToolMessage(content=tool_result, tool_call_id=tc['id']))

    # LLM 看到工具执行结果后,生成最终确认回复
    final_save = llm_with_tools.invoke(exec_messages)
    print(f"\nAgent 最终回复:{final_save.content}")


    # ─── 场景二:检索用户偏好 ───
    # 用户询问之前说过的信息,Agent 应自主调用 search_memories
    print("=" * 50)
    print("场景二:用户提问 → Agent 检索记忆 → 个性化回复")
    print("=" * 50)

    search_messages = [
        SystemMessage(content=f"你是一个有记忆能力的助手。可以使用工具检索和保存用户信息。当前用户的 user_id 是 {current_user_id},调用工具时请使用此 ID。"),
        HumanMessage(content="我之前跟你说过我的饮食偏好,还记得吗?")
    ]

    # 第 1 步:LLM 决策
    search_response = llm_with_tools.invoke(search_messages)
    print(f"Agent 决定调用:{[tc['name'] for tc in search_response.tool_calls]}")

    # 第 2 步:执行检索工具
    exec_messages = search_messages + [search_response]
    for tc in search_response.tool_calls:
        tool_fn = tool_map[tc['name']]
        tool_result = tool_fn.invoke(tc['args'])
        print(f"\n记忆检索结果: {tool_result[:300]}")
        exec_messages.append(ToolMessage(content=tool_result, tool_call_id=tc['id']))

    # 第 3 步:二次推理 将工具调用结果添加到messages,再发送至llm
    final_search = llm_with_tools.invoke(exec_messages)
    print(f"\nAgent 最终回复:{final_search.content}")


    """
    🔥
    手动写执行循环需要十几行代码(构建 messages、遍历 tool_calls、封装 ToolMessage......)。
    在生产项目中不会这么写。LangChain 的 `create_agent()` 把整个循环封装成了一行调用,
    **LLM 决策 → 执行工具 → 喂回结果 → 再次决策**全部自动完成:
    """

    from langchain.agents import create_agent

    # 一行代码创建自动执行工具的 Agent(LangChain 1.2+ API)
    # create_agent 内部自动完成:LLM 决策 → 执行工具 → 喂回结果 → 循环直到完成
    agent = create_agent(
        model=llm,
        tools=[search_memories, save_memory],
        system_prompt=f"你是一个有记忆能力的助手。可以使用工具检索和保存用户信息。当前用户的 user_id 是 {current_user_id},调用工具时请使用此 ID。"
    )

    # 直接对话,Agent 自动决定是否调用工具、自动执行、自动生成最终回复
    result = agent.invoke({"messages": [{"role": "user", "content": "我之前的饮食偏好是什么?"}]})

    # 打印完整的消息流(可以看到 Agent 内部的决策过程)
    for msg in result["messages"]:
        role = msg.__class__.__name__
        content = msg.content[:200] if msg.content else "(tool_call)"
        print(f"[{role}] {content}")



    # 💥 双检索注入(meo0+RAG并行)
    import asyncio
    async def build_context(user_input: str, user_id: str) -> str:
        """并行执行 mem0 记忆检索 + RAG 知识库检索,拼接为完整上下文"""

        # 定义两个并行任务
        async def mem0_search():
            results = await async_memory.search(
                user_input, user_id=user_id, limit=5
            )
            return "\n".join([r["memory"] for r in results["results"]])

        async def rag_search():
            # 此处用模拟数据替代真实 RAG 检索
            # 实际项目中替换为你的 RAG retriever
            return "(RAG 检索结果:相关文档片段...)"

        # asyncio.gather 并行执行两路检索
        mem0_result, rag_result = await asyncio.gather(
            mem0_search(),
            rag_search()
        )

        # 拼接上下文
        context = f"""用户历史偏好(来自 mem0):
        {mem0_result}

        相关知识(来自 RAG):
        {rag_result}"""

        return context

    # 测试并行检索
    async def demo_dual_retrieval():
        context = await build_context(
            "推荐一种适合我的编程语言",
            user_id="demo_alice"
        )
        print("拼接后的完整上下文:")
        print(context)

    # 在 Notebook 中运行 async 函数
    await demo_dual_retrieval()


# 🍆 Chroma 向量数据库
# ====================================================================================================================================

    from chromadb import chromadb

    client = chromadb.client()

    collection = client.get_or_create_collection(
        name="my-collection",
        metadata={"hnsw:space": "cosine"} # l2, ip, consine
    )

    # 添加文档到集合
    collection.add(
        documents=["这是一篇关于AI的文案", "这是一篇关于机器学习的文章"],
        metadatas=[{"category": "AI"}, {"category": "ML"}],
        ids=["id1", "id2"]
    )

    # 向量检索
    results = collection.query(
        query_texts=["什么是人工智能"],
        n_results=2
    )


    # 🚀 Chroma 默认用的是 all-MiniLM-L6-v2（英文模型），中文稀烂。你要换中文 embedding 还得自己配：
        from chromadb.utils import embedding_functions

        # 如果你不配，Chroma 就用默认的，中文语义一塌糊涂
        collection = client.create_collection(
            name="my_collection"
        )  # ❌ 默认英文 embedding

        # 正确的做法：
        ef = embedding_functions.OpenAIEmbeddingFunction(
            api_key="sk-xxx",
            model_name="text-embedding-3-small"
        )
        collection = client.create_collection(
            name="my_collection",
            embedding_function=ef
        )  # ✅ 指定中文友好的 embedding

    # 🚀 三种模式
        # 1. 临时客户端
        import chromadb
        client = chromadb.EphemeralClient()

        # 2. 持久客户端
        client = chromadb.PersistentClient(path="/path/to/save/to")

        # 3. 客户端服务器模式
        client = chromadb.HttpClient(host="localhost", port=8000)

    # 🚀 多模态数据添加示例
        collection.add(
            ids=['img1', 'img2', 'img3'],
            uris=['/path/to/img1.jpg', '/path/to/image2.png', None], # 图像通过URI引用
            documents=[None, None, "纯文本数据"],
            metadatas={
                {"type": "image", "format": "jpg"},
                {"type": "image", "format": "png"},
                {"type": "text", "format": "内部文档"}
            }
        )

    # 🚀 复杂数据查询
        result = collection.query(
            query_texts=["尝试学习的最新进展"],
            n_results=5,
            where={
                "$and": [
                    {"content_type": "article"},
                    {"publish_date": {"$gte": "2024-01-01"}},
                    {"word_content": {"$lte": 2000}},
                    {"language": "zh"},
                    {"topic": {"$in": ["机器学习", "人工智能"]}}
                ]
            }
        )


    # 🚀 删除数据
    # 按ID直接删除数据
        collection.delete(ids=["id1", "id2"])

        # 按元数据条件删除
        collection.delete(where={"cotegory": {"$eq": "临时"}})

        # 按文档内容删除
        collection.delete(where_document={"$contains": "草稿"})

        # 组合条件删除
        collection.delete(
            where={"timestamp": {"$lt": "2023-01-01"}},
            where_document={"$contains": "过期内容"}
        )

    # 🔍 精确查询 get
        # 获取所有文档
        all_docs = collection.get()

        # 根据ID查询特定文档
        docs_by_id = collection.get(ids=["id1", "id2"])

        # 使用条件过滤
        filter_docs = collection.get(
            where={"category": {"$in": ["科技", "旅游"]}},
            where_document={"$contains": "介绍"}
        )

    # 🔍 相似性搜索 query
        results = collection.query(
            query_texts=["查询文本"], # ChromaDB会自动转为向量
            n_results=5,
            where={"status": "已发布"}, # 元数据过滤
            where_document={"$not_contains": "内部"} # 文档内部过滤
        )


    # ✒ 修改数据
        collection.update(
            ids=["id1", 'id2'],
            documents=["id1的更新内容", "id2的更新内容"],
            metadata=[{"status": "更新"}, {"status": "更新"}]
        )

    # 🔍 控制查询返回字段
        # 只返回文档与元数据
            results = collection.query(
                #......
                include=["documents", "metadata", "distances"]
            )

        # 返回所有信息(包含嵌入向量)
        results = collection.query(
            #....
            include=['embedding', "documents", "metadata", "distances"]
        )


# ⚡ FAISS 高性能检索
# ====================================================================================================================================
    # 🚀 Flat 暴力搜索——最基础，小数据集首选
        import faiss
        import numpy as np

        dimension = 1536  # 和 Embedding 模型维度一致

        # IndexFlatIP：内积距离（配合归一化向量 = 余弦相似度）
        index_ip = faiss.IndexFlatIP(dimension)

    # 🚀 预处理归一化——提升精度的小技巧
        # FAISS 的 METRIC_INNER_PRODUCT(内积)配合归一化向量 = 余弦相似度
        # 不归一化的话,长向量的内积天然偏大,搜索结果会偏好长文本
        faiss.normalize_L2(vecs)  # 原地修改,每条向量归一化为单位长度
        # 查询向量也要归一化:
        faiss.normalize_L2(query)
        # 归一化后,内积和余弦相似度等价,精度提升明显
        # 注意:如果用的是 L2 距离(Euclidean),不需要归一化
        # IndexFlatL2：欧氏距离（适合聚类场景）
        index_l2 = faiss.IndexFlatL2(dimension)

        # Flat demo
        texts = ["苹果很好吃", "香蕉很不错", "微积分太难", "梨子水分多"]
        vecs = np.array(get_embeddings_batch(texts)).astype("float32")

        index_ip.add(vecs)
        print(f"FlatIP 索引中向量数量: {index_ip.ntotal}")  # 4

        query = np.array([get_embedding("什么水果好吃")]).astype("float32")
        distances, indices = index_ip.search(query, k=3)
        print("\n=== FlatIP 检索结果 ===")
        for i, (idx, dist) in enumerate(zip(indices[0], distances[0])):
            print(f"  #{i+1}: {texts[idx]} (dist={dist:.4f})")

        # Flat 代价：数据量越大越慢，100 万条约 50ms，1000 万条 500ms+

    # 🚀 IVF 倒排索引——分桶加速
        nlist = 100
        quantizer = faiss.IndexFlatIP(dimension)
        index_ivf = faiss.IndexIVFFlat(quantizer, dimension, nlist, faiss.METRIC_INNER_PRODUCT)
        index_ivf.train(vecs) # 先设计装安装数据的架子
        index_ivf.add(vecs) # 来把，装上来
        index_ivf.nprobe = 10
        distances, indices = index_ivf.search(query, k=3)
        print("\n=== IVF 检索结果 ===")
        for i, (idx, dist) in enumerate(zip(indices[0], distances[0])):
            print(f"  #{i+1}: {texts[idx]} (dist={dist:.4f})")
        # nprobe 调优：越大越准但越慢，100 万条推荐 nlist=4000, nprobe=50

    # 🚀 PQ 乘积量化——压缩向量，省内存
        m = 32
        nbits = 8
        index_pq = faiss.IndexPQ(dimension, m, nbits)
        index_pq.train(vecs) # 先设计装安装数据的架子
        index_pq.add(vecs) # 来把，装上来
        distances, indices = index_pq.search(query, k=3)
        print("\n=== PQ 检索结果 ===")
        for i, (idx, dist) in enumerate(zip(indices[0], distances[0])):
            print(f"  #{i+1}: {texts[idx]} (dist={dist:.4f})")

        # 组合拳：IVF + PQ = IndexIVFPQ（工业级标配）

    # 🚀 HNSW 分层可导航小图——精度速度王者 无训练w
        M = 32
        ef_construction = 200
        index_hnsw = faiss.IndexHNSWFlat(dimension, M, faiss.METRIC_INNER_PRODUCT)
        index_hnsw.hnsw.efConstruction = ef_construction
        index_hnsw.add(vecs)
        index_hnsw.hnsw.efSearch = 64
        distances, indices = index_hnsw.search(query, k=3)
        print("\n=== HNSW 检索结果 ===")
        for i, (idx, dist) in enumerate(zip(indices[0], distances[0])):
            print(f"  #{i+1}: {texts[idx]} (dist={dist:.4f})")

    # 🚀 IDMap——带业务 ID 的索引（生产必备）
        ids = np.array([1001, 1002, 1003, 1004])
        index_with_ids = faiss.IndexIDMap(index_ip)
        index_with_ids.add_with_ids(vecs, ids)
        distances, result_ids = index_with_ids.search(query, k=3)
        print("\n=== IDMap 结果 ===")
        for i, (rid, dist) in enumerate(zip(result_ids[0], distances[0])):
            print(f"  #{i+1}: ID={rid} (dist={dist:.4f})")

    # 🚀 IndexFactory——一行字符串建索引（生产最爱）
        # 不用手写各种 Index 类,一条字符串搞定
        # 格式: "算法名参数,量化方式参数"
        index = faiss.index_factory(dim, "Flat", faiss.METRIC_INNER_PRODUCT)
        index = faiss.index_factory(dim, "IVF100,PQ32", faiss.METRIC_INNER_PRODUCT)
        index = faiss.index_factory(dim, "HNSW32", faiss.METRIC_INNER_PRODUCT)
        # IVF+SQ8 省内存: "IVF256,SQ8"
        # IVF+PQ 极致压缩: "IVF100,PQ32"
        # HNSW 最高精度: "HNSW32"
        # 注意:用 index_factory 后需手动 train(如果是 IVF/PQ 等需要训练的索引)

    # 🚀 索引保存与加载
        import os
        index_path = "./faiss_index.bin"
        faiss.write_index(index_ip, index_path)
        loaded = faiss.read_index(index_path)
        os.remove(index_path)

    # 🚀 四种索引类型选型指南
        # ┌──────────┬──────────┬──────────┬──────────────┬─────────────────────┐
        # │ 类型     │ 速度      │ 内存     │ 精度         │ 适合场景             │
        # ├──────────┼──────────┼──────────┼──────────────┼─────────────────────┤
        # │ Flat     │ 慢(全量)  │ 高(原样)  │ ⭐⭐⭐⭐⭐     │ <10万条              │
        # │ IVF      │ 快(10x)  │ 中       │ ⭐⭐⭐⭐       │ 10万-500万条，通用首选 │
        # │ HNSW     │ 极快      │ 高(图)   │ ⭐⭐⭐⭐⭐     │ <500万，速度+精度都要  │
        # │ IVF+PQ   │ 快        │ 极低     │ ⭐⭐⭐        │ 500万+，内存受限      │
        # └──────────┴──────────┴──────────┴──────────────┴─────────────────────┘

        # ■ 选型三步法：
        # 1. 看数据量：<10万 → Flat；10万-500万 → IVF 或 HNSW；>500万 → IVF+PQ
        # 2. 看硬件：内存够+要精度 → HNSW；内存吃紧 → IVF+PQ
        # 3. 看场景：离线 batch → IVF；在线实时 → HNSW

        # ■ Chroma vs FAISS：
        #   Chroma：开发友好，自带持久化，适合原型和 <100万条
        #   FAISS：性能优先，无状态（需自己管存储 + 原始文本），适合百万到亿级


# 🍅 Milvus — 生产级向量数据库
# ====================================================================================================================================

    # 📌 Milvus 定位
    #    vs Chroma/FAISS:
    #      Chroma → 原型玩具,开箱即用,<100万条
    #      FAISS  → 算法库(无状态),需自己管存储,百万到亿级
    #      Milvus → 完整分布式向量数据库,自带 CRUD/权限/高可用,百万到亿级生产首选

    # 🚀 索引算法全景
    #    决定了检索速度和精度的取舍。Milvus 支持以下几大类:

    # ─── 一、暴力遍历:不建索引,逐条算距离 ───
    #   FLAT
    #     唯一不建索引的"索引"。数据量小(<1万)时反而最快。
    #     适合:原型验证、小数据集、数据量不确定时兜底

    # ─── 二、基于量化的:省内存用精度换速度 ───
    #   IVF_FLAT  (倒排文件)
    #     把向量聚类成 N 个桶,搜时先找最近的几个桶,再暴力搜。
    #     参数: nlist=桶数量,  nprobe=搜几个桶(越大越准越慢)
    #     适合:1万~50万条,精度和速度的平衡选择

    #   IVF_SQ8   (量化版)
    #     浮点数压缩成 8bit 整数,内存省 4 倍,精度略降。
    #     适合:50万~500万条,内存有限但精度不能太差

    #   IVF_PQ    (乘积量化)
    #     向量切段分别压缩,内存省 N 倍(取决于 m 参数),精度降更多。
    #     参数: m=切几段, nbit=每段几个bit
    #     适合:500万+,内存极度紧张的大规模场景
    #     压缩率: IVF_PQ > IVF_SQ8 > IVF_FLAT

    # ─── 三、基于图的:精度最高的王者 ───
    #   HNSW (分层小世界图)
    #     多层图结构:顶层粗搜定位,底层精搜。精度+速度的王者。
    #     参数: M=每个节点邻居数(越大越准越慢,默认16)
    #           efConstruction=建图搜索范围(越大图越好但建图慢,默认200)
    #           ef=搜索候选数(越大越准越慢,默认10)
    #     适合:追求最高精度,内存够用(相比量化类索引更耗内存)

    #   HNSW_SQ8  (量化版 HNSW)
    #     HNSW + SQ8 量化,省内存的同时保留不错的精度。

    # ─── 四、其他(特定场景) ───
    #   GPU_IVF_FLAT   → IVF_FLAT 的 GPU 版,几百万级别飞一般
    #   BIN_FLAT/BIN_IVF_FLAT → 二进制向量专用(人脸匹配等)
    #   DISKANN        → 基于 SSD 的索引,内存不够时把索引放磁盘
    #   AUTOINDEX      → Milvus Cloud 自动选,省心但不灵活

    # 🚀 选型速查表
    #   ┌────────────────┬────────────────┬─────────────────────────────┐
    #   │ 数据量          │ 推荐索引        │ 理由                        │
    #   ├────────────────┼────────────────┼─────────────────────────────┤
    #   │ < 1万           │ FLAT           │ 不建索引最省事               │
    #   │ 1万 ~ 50万      │ IVF_FLAT       │ 快,精度还行                 │
    #   │ 50万 ~ 500万    │ IVF_SQ8        │ 省内存,精度可接受            │
    #   │ 500万+          │ IVF_PQ / HNSW  │ HNSW精度最高,PQ最省内存      │
    #   │ 追求最高精度     │ HNSW           │ 稳稳的王者                  │
    #   │ 内存很紧张       │ IVF_PQ / IVF_SQ8 │ 量化压缩省几倍内存         │
    #   │ 有 GPU          │ GPU_IVF_FLAT   │ 飞一般的感觉                │
    #   └────────────────┴────────────────┴─────────────────────────────┘

    # 🎯 标准使用流程(创建 → 索引 → 写入 → 搜索)
    #   示例:搜索新闻文章
    from pymilvus import MilvusClient, DataType
    client = MilvusClient(uri="http://localhost:19530", token="root:root")

    # ── Step 1: 定义 Schema ──
    schema = MilvusClient.create_schema(description="文章集合", enable_dynamic_field=True)
    schema.add_field(name="id", datatype=DataType.INT64, is_primary=True, auto_id=True)
    schema.add_field(name="title", datatype=DataType.VARCHAR, max_length=256)
    schema.add_field(name="content", datatype=DataType.VARCHAR, max_length=65535)
    schema.add_field(name="content_vector", datatype=DataType.FLOAT_VECTOR, dim=1024)
    # 标量数据类型: VARCHAR(短文本) TEXT(长文本) INT64/FLOAT(数值)
    # BOOL(布尔) JSON(半结构化) ARRAY(数组) BLOB(二进制) GEOMETRY(地理位置)

    # ── Step 2: 配置索引(以 HNSW 为例) ──
    index_params = client.prepare_index_params()
    index_params.add_index(
        field_name="content_vector",
        index_type="HNSW",           # 索引算法
        metric_type="COSINE",        # 距离度量: COSINE / L2 / IP(内积)
        params={"M": 128, "efConstruction": 4096},
    )

    # ── Step 3: 创建集合 ──
    client.create_collection(
        collection_name="articles",
        schema=schema,
        index_params=index_params,
    )
    client.load_collection("articles")

    # ── Step 4: 写入 ──
    data = [
        {"title": "AI 入门", "content": "人工智能基础概念...", "content_vector": [0.1]*1024},
        {"title": "Python 教程", "content": "Python 入门指南...", "content_vector": [0.2]*1024},
    ]
    client.insert(collection_name="articles", data=data)

    # ── Step 5: 搜索 ──
    query_vector = [0.15]*1024
    res = client.search(
        collection_name="articles",
        data=[query_vector],
        anns_field="content_vector",
        limit=3,
        search_params={"metric_type": "COSINE"},
        output_fields=["title", "content"],
    )
    for hits in res:
        for hit in hits:
            print(f"id:{hit['id']}, distance: {hit['distance']:.4f}")


    # 🚀 高级功能速查
    # ── 搜索变体 ──
        # 分区搜索  : client.search(..., partition_names=["p1"])
        # 分页搜索  : client.search(..., limit=3, offset=10)
        # 排序搜索  : client.search(..., order_by_fields=[{"field":"price","order":"asc"}])
        # 过滤搜索  : client.search(..., filter='price > 100')
        # 批量搜索  : client.search(data=[vec1, vec2, ...], ...)

    # ── 增删改 ──
        # 更新: client.upsert("articles", data=[...])
        # 合并更新: client.upsert("articles", data=[...], partial_update=True)
        # 批量删除: client.delete("articles", filter='color in ["red","blue"]')
        # 主键删除: client.delete("articles", ids=[19, 20])
        # 分区删除: client.delete("articles", ids=[19, 20], partition_name="p1")

    # ── 管理 ──
        # 别名: client.create_alias("articles", alias="production_articles")
        # 数据库: client.create_database("my_project") / .use_database() / .drop_database()
        # 修改字段: client.alter_collection_field("articles", "title", {"max_length":256})
        # 新增字段: client.add_collection_field("articles", "priority_level", ...)
        # 查看: client.describe_collection("articles")

    # ── 数组/JSON 高级过滤 ──
        # ARRAY_CONTAINS(tags, 'rock')
        # ARRAY_LENGTH(tags) > 2
        # ARRAY_CONTAINS_ANY(tags, ['rock', 'pop'])

    # ── TTL(自动过期) ──
        # 集合级: create_collection(..., properties={"collection.ttl.seconds": 1209600})
        # 实体级: 加 TIMESTAMPTZ 字段,设置 properties={"ttl_field": "expire_at"}
        # 取消:   client.drop_collection_properties(..., ["collection.ttl.seconds"])

    # 🎯 标量索引与 Filter 过滤（详解）

        # 为什么需要标量索引？
        #   filter="doc_id in [1,2,3]" 这个条件,没有索引的话 Milvus 要全量扫描所有
        #    segment 找符合条件的行。有了倒排索引后,直接查索引表,速度差几个数量级。

        # ‼️ filter 在索引层生效,不是先搜后滤
        #   Milvus 在 HNSW 图搜索过程中用 bitmask 标记被过滤的节点:
        #     搜到节点 → 查 bitmask → 被过滤则跳过 → 否则算距离
        #   不需要先搜一堆再手动过滤,整个过程是原子操作。

        # ── Step 1: 定义 Schema（标量字段也要定义）──
        from pymilvus import MilvusClient, DataType
        client = MilvusClient(uri="http://localhost:19530", token="root:root")

        schema = MilvusClient.create_schema(description="文章集合", enable_dynamic_field=True)
        schema.add_field(name="id", datatype=DataType.INT64, is_primary=True, auto_id=True)
        schema.add_field(name="doc_id", datatype=DataType.INT64)        # ← 标量字段,要用来filter
        schema.add_field(name="category", datatype=DataType.VARCHAR, max_length=64)  # ← 另一个标量字段
        schema.add_field(name="content", datatype=DataType.VARCHAR, max_length=65535)
        schema.add_field(name="content_vector", datatype=DataType.FLOAT_VECTOR, dim=768)

        # ── Step 2: 建索引——向量索引 + 标量索引（分开建）──

        # 2a. 向量索引
        index_params = client.prepare_index_params()
        index_params.add_index(
            field_name="content_vector",
            index_type="HNSW",
            metric_type="COSINE",
            params={"M": 32, "efConstruction": 200},
        )

        # 2b. ⭐ 标量索引——建在 filter 常用的字段上
        index_params.add_index(
            field_name="doc_id",          # 标量字段
            index_type="INVERTED"         # 倒排索引,适合等值/IN/范围查询
        )
        index_params.add_index(
            field_name="category",        # 字符串字段也能建
            index_type="INVERTED"
        )

        # ── Step 3: 建集合 ──
        client.create_collection(
            collection_name="articles",
            schema=schema,
            index_params=index_params,
        )
        client.load_collection("articles")

        # ── Step 4: 写入数据 ──
        data = [
            {"doc_id": 1, "category": "AI",    "content": "人工智能基础...", "content_vector": [0.1]*768},
            {"doc_id": 1, "category": "Python", "content": "Python入门...",   "content_vector": [0.2]*768},
            {"doc_id": 2, "category": "AI",    "content": "机器学习...",      "content_vector": [0.3]*768},
        ]
        client.insert(collection_name="articles", data=data)

        # ── Step 5: 搜索 + 过滤 ⭐──
        query_vector = [0.15]*768

        # 5a. 先搜摘要找到目标 doc_id → 再 filter
        res = client.search(
            collection_name="articles",
            data=[query_vector],
            anns_field="content_vector",
            limit=3,
            search_params={"metric_type": "COSINE"},
            filter="doc_id in [1, 2]",         # ← 走 INVERTED 倒排索引
            output_fields=["title", "content"],
        )

        # 5b. 多条件组合过滤
        res = client.search(
            collection_name="articles",
            data=[query_vector],
            anns_field="content_vector",
            limit=3,
            search_params={"metric_type": "COSINE"},
            filter="doc_id in [1] AND category == 'AI'",  # 多个条件
            output_fields=["title", "content"],
        )

        # ⚡ 总结：Chroma vs Milvus 的 filter
        #   Chroma: filter 在索引层查 bitmask → 搜的时候跳过不符合的节点
        #   Milvus: 同样是索引层操作,但 Milvus 的 bitmask 是持久化在 segment 里的,
        #           还可以给 filter 字段单独建倒排索引,大数据量表现更好
        #   FAISS:  不支持 filter,只能先搜再手动过滤

    # 🚀 特殊场景
    # ── 地理位置搜索 ──
        # st_within(geo, 'POLYGON((...))')  /  st_dwithin(geo, 'POINT(x y)', radius)
        # 空间索引: index_type="RTREE"
    # ── 稀疏向量 ──
        # schema.add_field("sparse_vector", datatype=DataType.SPARSE_FLOAT_VECTOR)
    # ── 文本分析器 ──
        # 分词器: standard / jieba / whitespace
        # 过滤器: lowercase, stop, length, regex, cn_char_only ...
    # ── IVF_FLAT 参数参考 ──
        # nlist=桶数量, nprobe=搜索桶数
    # ── IVF_PQ 参数参考 ──
        # m=子空间数, nbit=每段bit数

    # ⚡ 分区使用流程
        # 创建: client.create_partition("articles", "p1")
        # 删除前释放: client.release_partitions("articles", ["p1"])
        # 删除: client.drop_partition("articles", "p1")
        # 插入: client.insert("articles", data, partition_name="p1")

    # ⚡ TTL 转换流程
        # 集合级→实体级: 删集合TTL属性,加TIMESTAMPTZ字段,设ttl_field
        # 实体级→集合级: 删ttl_field,加collection.ttl.seconds属性

    from pymilvus import MilvusClient, DataType

    client = MilvusClient(uri="http://localhost:19530", token="root:root")

    schema = MilvusClient.create_schema(description="文章集合", enable_dynamic_field=True)

    schema.add_field(name="content_vector", datatype=DataType.FLOAT_VECTOR, dim=1024)

    schema.add_field(
        name="id", datatype=DataType.INT64, is_primary=True, auto_id=True
    )  # id自动递增 auto_id

    """
    标量数据类型:
    VARCHAR: 短文本 标题、作者名
    TEXT: 长文本 用于全文搜索
    INT64: 整数 时间戳、数量
    FLOAT/DOUBLE: 浮点型 评分、价格
    BOOL: 布尔值
    JSON: 半结构化数据
    ARRAY: 同结构化元素列表
    BLOB: 二进制数据 文件、图像、视频
    NULL: NULL值
    """

    # 配置索引
    index_params = client.prepare_index_params()
    index_params.add_index(
        field_name="content_vector",
        index_type="HNSW",
        metric_type="COSINE",
        params={"M": 128, "efConstruction": 4096},
    )

    # 创建集合
    client.create_collection(
        collection_name="articles", schema=schema, index_params=index_params
    )

    # 集合别名
    client.create_alias(collection_name="articles", alias="production_articles")

    # 集合加载与释放
    client.load_collection(collection_name="articles")
    client.release_collection(collection_name="articles")


    # 数据库:顶层命名空间
    client.create_database("my_project")
    client.use_database("my_project")
    client.drop_database("my_project")

    # 修改字段
    client.alter_collection_field(
        collection_name="articles", field_name="title", field_params={"max_length": 256}
    )

    # 添加字段
    client.add_collection_field(
        collection_name="articles",
        field_name="priority_level",
        data_type=DataType.VARCHAR,
        max_length=20,
        nullable=True,
        default_value="standard",
    )
    client.add_collection_field(
        collection_name="articles",
        field_name="cotegory",
        data_type=DataType.VARCHAR,
        is_partition_key=True,
    )

    # 查询
    result = client.query(
        collection_name="articles",
        filter="id == 1",
        output_fields=["title", "content", "priority_level", "$meta['extra_info]"],
    )


    # 插入实体
    data = []
    client.insert(collection_name="articles", data=data)

    ## 分区
    partition_name = "partition_A"
    # 🚀 创建分区
        def create_partition(collection_name: str, partition_name: str): 
            # 检查分区是否已存在
            if not client.has_partition(collection_name=collection_name, partition_name=partition_name):
                # 创建分区
                client.create_partition(collection_name=collection, partition_name=partition_name)
                print(f"Partition '{partition_name}' created.")
            else:
                print(f"Partition '{partition_name}' already exists.")


    # 🚀 删除分区
    # 1. 检查分区是否存在
    if client.has_partition(collection_name="articles", partition_name=partition_name):
        try:
            # 2. 释放分区 (重要:未释放的分区无法删除)
            client.release_partitions(
                collection_name="articles", partition_names=[partition_name]
            )
            print(f"Partition '{partition_name}' released.")

            # 3. 删除分区
            client.drop_partition(collection_name="aritcles", partition_name=partition_name)
            print(f"Partition '{partition_name}' dropped successfully.")
        except Exception as e:
            print(f"Failed to drop partition: {e}")
    else:
        print(f"Partition '{partition_name}' does not exist.")


    # 插入实体指定分区
    client.insert(collection_name="articles", data=data, partition_name="p1")

    ## 覆盖模式下的Upsert
    """默认模式,用新实体完全替换旧实例。请求中必须包含所有字段的值,未提供的字段将被设为Null或默认值"""
    data = []
    client.upsert(collection_name="articles", data=data)

    ## 合并模式下的Upsert
    """只更新请求中指定的字段,其它字段保持不变。请求只需包含主键和要更新的字段"""
    data = []
    client.upsert(collection_name="articles", data=data, partial_update=True)

    # 🚀 通过过滤条件批量删除
    client.delete(
        collection_name="quick_setup", filter="color in ['red_3023', 'purple_4974]"
    )

    # 🚀 通过主键删除
    client.delete(collection_name="articles", ids=[19, 20])

    # 🚀 从指定分区删除
    client.delete(collection_name="articles", ids=[19, 20], partition_name="p1")

    # 🔍 单向量搜索
    query_vector = [0.33, -1.229, 0.321, 0, 0.3949]

    res = client.search(
        collection_name="articles",
        data=[query_vector],  # 查询向量(列表形式,可包括多个)
        anns_field="vector",  # 要搜索的向量名称
        limit=3,  # 返回最相似的前3个结果
        search_params={"metric_type": "COSINE"},
    )

    for hits in res:
        for hit in hits:
            print(f"id:{hit['id']}, distance: {hit['distance']:.4f}")  # 保留4位小数

    # 🔍 带输出字段的搜索
    res = client.search(
        collection_name="articles",
        data=[query_vector],  # 查询向量(列表形式,可包括多个)
        anns_field="vector",  # 要搜索的向量名称
        limit=3,  # 返回最相似的前3个结果
        search_params={"metric_type": "COSINE"},
        ## 输出字段
        output_fields=["id", "title", "content", "priority_level", "$meta['extra_info]"],
    )

    # 🔍 分区里搜索
    res = client.search(
        collection_name="articles",
        data=[query_vector],  # 查询向量(列表形式,可包括多个)
        anns_field="vector",  # 要搜索的向量名称
        limit=3,  # 返回最相似的前3个结果
        search_params={"metric_type": "COSINE"},
        ## 分区名称
        partition_names=["p1"],
    )


    # 🔍 使用分页搜索
    res = client.search(
        collection_name="articles",
        data=[query_vector],  # 查询向量(列表形式,可包括多个)
        anns_field="vector",  # 要搜索的向量名称
        search_params={"metric_type": "COSINE"},
        ## 分页参数 返回第11~13个结果
        limit=3,
        offset=10,
    )

    # 🔍 可以多字段排序
    res = client.search(
        collection_name="articles",
        data=[query_vector],  # 查询向量(列表形式,可包括多个)
        anns_field="vector",  # 要搜索的向量名称
        limit=20,
        output_fields=["id", "title", "price", "rating"],
        ## 排序字段
        order_by_fields=[
            {"field": "price", "order": "asc"},
            {"field": "rating", "order": "desc"},
        ],
    )

    # 创建索引
    index_params = client.prepare_index_params()

    index_params.add_index(
        field_name="tags", index_type="AUTOINDEX", index_name="tags_index"
    )

    # 创建集合后,你可以通过'describe_collection' 方法查看集合的详细信息,确认数组字段是否已正确配置
    description = client.describe_collection(collection_name="articles")
    print("Collection schema:", description)

    # 数组的高级查询

    # ! => tags 不是空的
    filter_expr = "tags IS NOT NULL"
    # ! => 数组中包含指定值
    filter_expr = "ARRAY_CONTAINS(tags, 'rock')"
    # ! => 数组元素个数大于2
    filter_expr = "ARRAY_LENGTH(tags) > 2"
    # ! => 数组中包含 'rock' 或 'pop'
    filter_expr = "ARRAY_CONTAINS_ANY(tags, ['rock', 'pop'])"
    # ! => 也可以组合使用这些查询条件
    filter_expr = "ARRAY_CONTAINS(tags, 'rock') AND ARRAY_LENGTH(tags) > 2"

    result = client.query(
        collection_name="articles", filter=filter_expr, output_fields=["pk", "tags"]
    )


    result = client.search(
        collection_name="articles",
        data=[[0.3, -0.4, 0.1]],
        filter=filter_expr,
        limit=5,
        search_params={"params": {"nprobe": 10}},
        output_fields=["tags", "ratings"],
    )


    # ⏰ -------- TTL -------------------------------------------------------

    # 🌰 集合级TTL 创建集合时 通过properties参数传入
    client.create_collection(
        collection_name="articles",
        schema=schema,
        index_params=index_params,
        properties={"collection.ttl.seconds": 1209600},  # 14天
    )

    # 🌰 给已有集合添加TTL
    client.alter_collection_properties(
        collection_name="articles", properties={"collection.ttl.seconds": 1209600}  # 14天
    )

    # 🗑 取消TTL
    client.drop_collection_properties(
        collection_name="articles", property_keys=["collection.ttl.seconds"]
    )


    # 🍌 实体级TTL
    schema = client.create_schema(enable_dynamic_field=False)

    schema.add_field("id", DataType.INT64, is_primary=True, auto_id=False)
    schema.add_field("title", DataType.VARCHAR, max_length=256)
    schema.add_field(
        "expire_at", DataType.TIMESTAMPTZ, nullable=True
    )  # ! 过期时间,关键字段
    schema.add_field("vector", DataType.FLOAT_VECTOR, dim=128)

    index_params = client.prepare_index_params()
    index_params.add_index(
        field_name="vector", index_type="AUTOINDEX", index_name="vector_index"
    )

    client.create_collection(
        collection_name="articles",
        schema=schema,
        index_params=index_params,
        properties={"ttl_field": "expire_at"},  # ! 标记为ttl字段
        # shards_num=2,  # ! 分片数
    )

    # 灵活控制每条数据的生命周期
    import random

    rows = [
        # 永不过期
        {"id": 1, "expire_at": None, "vector": [random.random() for _ in range(128)]},
        # 在 2025-12-31 UTC 午夜过期
        {
            "id": 1,
            "expire_at": "2025-12-31T00:00:00Z",
            "vector": [random.random() for _ in range(128)],
        },
        # 上海时间 2027-01-01 零点过期(内部自动转为 UTC 时间)
        {
            "id": 1,
            "expire_at": "2027-01-01T00:00:00+08:00",
            "vector": [random.random() for _ in range(128)],
        },
    ]
    client.insert("articles", rows)

    # 延长某条数据的生命(如果还没有被物理删除)
    client.upsert(
        "articles",
        [
            {
                "id": 1,
                "vector": [random.random() for _ in range(128)],
                "expire_at": "2028-01-01T00:00:00Z",
            },
        ],
    )

    ## 给已有集合添加TTL

    # step 1 添加TIMESTAMPTZ列
    client.add_collection_field(
        collection_name="articles",
        field_name="expire_at",
        field_type=DataType.TIMESTAMPTZ,
        nullable=True,  # # 允许NULL值
    )

    # step 2 标记为ttl字段
    client.alter_collection_properties(
        collection_name="articles", properties={"ttl_field": "expire_at"}  # 标记为ttl字段
    )

    # step 3 (可选)为历史数据回填过期时间
    client.upsert(
        "articles",
        [
            {
                "id": 1,
                "vector": [random.random() for _ in range(128)],
                "expire_at": "2028-01-01T00:00:00Z",
            }
        ],
    )


    # 从集合级TTL -> 实体级TTL
    def convert_to_entity_ttl(collection_name: str, ttl_field: str = "expire_at"):
        # step1 删除集合级TTL
        client.drop_collection_properties(
            collection_name=collection_name, property_keys=["collection.ttl.seconds"]
        )
        # step2 添加TIMESTAMPTZ列
        client.add_collection_field(
            collection_name=collection_name,
            field_name=ttl_field,
            field_type=DataType.TIMESTAMPTZ,
            nullable=True,  # # 允许NULL值
        )
        # step3 标记为ttl字段
        client.alter_collection_properties(
            collection_name=collection_name,
            properties={"ttl_field": ttl_field},  # 标记为ttl字段
        )


    # 从实体级ttl -> 集合级ttl
    def convert_to_collection_ttl(collection_name: str, seconds: int = 1209600):
        # step 1 删除实体级ttl字段
        client.drop_collection_properties(
            collection_name=collection_name, property_keys=["ttl_field"]
        )
        # step 2 添加集合级ttl
        client.alter_collection_properties(
            collection_name=collection_name, properties={"collection.ttl.seconds": seconds}
        )


    # # IVF_FLAT 示例
    # step1 定义索引参数(未触发训练)
    index_params = client.prepare_index_params()
    index_params.add_index(
        field_name="vector",
        index_type="IVF_FLAT",
        index_name="vector_index",
        metric_type="COSINE",
        params={"nlist": 1000000},  # 聚类中心数量, 也就是桶的数量
    )

    # step2 创建集合 (仅保存索引参数)
    client.create_collection(
        collection_name="articles", schema=schema, index_params=index_params
    )


    # 搜索
    search_params = {
        "metric_type": "CONSINE",
        "params": {"nprobe": 15},  # 搜索时考虑的聚类中心数量 搜索最近的15个桶
    }  # 搜索时考虑的聚类中心数据
    results = client.search(
        collection_name="articles",
        data=[query_vector],
        search_params=search_params,
        limit=10,
    )


    # # IVF_PQ的代码展示
    # 创建IVF_PQ索引
    index_params = {
        "index_type": "IVF_PQ",
        "metric_type": "L2",
        "params": {
            "nlist": 1000000,  # 聚类中心数量
            "m": 16,  # 子空间数量  [n, n, n, n]  有多少个n m就为几  每个n如果能取当0~255 nbit就为8
            "nbit": 8,  # 每个子空间的bit数
        },
    }

    # 搜索
    search_params = {
        "metric_type": "L2",
        "params": {"nprobe": 32},  # 搜索时考虑的聚类中心数据
    }
    results = client.search(
        collection_name="articles",
        data=[query_vector],
        search_params=search_params,
        limit=10,
    )

    # # ANN:近似最近邻  ENN:精确最近邻
    # # 主要向量索引: FLAT IVF_FLAT IVF_PQ IVF_SQ8 IVF_RABITQ HNSW ANNOY DiskANN SCANN
    # # 主要标量索引: 倒排标量索引 bitmap
    # IVF-PQ 的压缩率 > IVF_SQ8 > IVF_FLAT
    # 🚀 通常的决策路径:数据量小->FLAT;内存充足、追求极致性能->HNSW;数据量大、希望节省内存->IVF_SQ8, IVF_PQ或DiskANN

    """
    HNSW 关键参数
    1. M 节点在这一层最多的可导航的节点数
        1. 每个节点最多可连接的邻居数量。
        2. 值越大,图越密集,搜索精度越高,但内存占用和计算量也越大。
        3. 默认值:16
    2. efContrction 构建时在多少个节点寻找M个节点
        1. 构建图时,每个节点搜索的候选邻居数量。
        2. 值越大,图质量越高,但构建时间越长。(不可能整层节点过一遍)
        3. 默认值:200
    3. ef 搜索时的候选数量
        1. 搜索时,每层保留的候选节点数量。
        2. 值越大,搜索精度越高,但速度越慢。
        3. 默认值:10
    """


    ## milvus几何字段

    # 🌰定义集合结构
    schema = MilvusClient.create_schema(enable_dynamic_field=True)
    schema.add_field("id", DataType.INT64, is_primary=True)
    schema.add_field("embedding", DataType.FLOAT_VECTOR, dim=764)  # 图像/文本向量
    schema.add_field("geo", DataType.GEOMETRY, nullable=True)  # 地理位置
    schema.add_field("name", DataType.VARCHAR, max_length=128)  # 名称描述

    client.create_collection("spatial_collection", schema=schema)


    # 🌰 查询数据
    # 🚀 场景1:区域范围内的相似商铺推荐
    top_left_lon, top_left_lat = 116.404494, 39.904211
    bottom_right_lon, bottom_right_lat = 116.404494, 39.904211
    # 定义矩形区域的WKT格式(左上》右上》右下》左上(回到原点))
    bounding_box_wkt = f"POLYGON (({top_left_lon} {top_left_lat}, {bottom_right_lon} {top_left_lat}, {bottom_right_lon} {bottom_right_lat}, {top_left_lon} {bottom_right_lat}, {top_left_lon} {top_left_lat}))"

    query_search = client.query(
        collection_name="spatial_collection",
        filter=f"st_within(geo, '{bounding_box_wkt}')",
        output_fields=["name", "geo"],
    )
    for ret in query_search:
        print(ret)

    # 🚀 场景2:距离约束下的多模态搜索
    center_lon, center_lat = 116.404494, 39.904211
    radius_meters = 1000.0
    point_wkt = f"POINT({center_lon} {center_lat})"
    query_search = client.query(
        collection_name="spatial_collection",
        filter=f"st_dwithin(geo, '{point_wkt}', {radius_meters})",
        output_fields=["name", "geo"],
    )
    for ret in query_search:
        print(ret)

    # 创建空间索引,加速查询
    index_params = client.prepare_index_params()
    index_params.add_index(
        field_name="geo",
        index_type="RTREE",
        index_name="geo_rtree_index",
    )
    client.create_index("spatial_collection", index_params)


    ## 分析器概述
    # Standard内置分析器
    analyzer_params = {
        "type": "standard",  # 使用standard内置分析器
        "stop_words": ["a", "an", "for", "an"],  # 定义要从标记中排除的常用词(停用词)列表
    }

    text = "An effecient system for relies on a rubost"

    # 运行分析器
    result = client.run_analyzer(
        text, analyzer_params
    )  # ['deffecient', 'system', 'for', 'relied', 'rubost']

    print(result)

    analyzer_params = {
        "type": "standard",
        "length": {
            "type": "length",
            "min": 2,
            "max": 10,
        },
        "stop": {
            "type": "stop",
            "stop_words": ["a", "an", "for"],  # 定义要从标记中排除的常用词(停用词)列表
        },
        "regex": {
            "type": "regex",
            "pattern": r"[a-zA-Z0-9\s]@[a-zA-Z0-9\s]",  # 匹配非字母数字和空格的字符
            "replacement": "[EMAIL]",  # 替换为字符串
        },
    }

    # 🌰 过滤器
    client.create_analyzer(
        analyzer_name="my_lowercase_analyzer",
        tokenizer="standard",
        filter_list=[
            "lowercase",  # 小写过滤器
            "ascii_folding",  # ASCII 折叠过滤器 ,将非ASCII字符转换为写它最接近的ASCII字符
            "alphanum_only",  # 字母数字过滤器,只保留字线和数字
            "cn_alphanum_only",  # 中文字母数字过滤器,只保留中文字母数字
            "cn_char_only",  # 中文字过滤器,只保留中文文字
            "length",  # 长度过滤器,根据指定的最小范围和最大范围筛选标记
            "stop",  # 停用词过滤器,根据指定的常用词(停用词)列表,排除停用词(停用词)
            "remove_punct",  # 标点符号过滤器,移除所有标点符号
            "regex",  # 正则表达式过滤器,根据指定的正则表达式模式替换标记
        ],
        analyzer_params=analyzer_params,
    )


    # 🌰 分词器
    analyzer_params = {
        "tokenizer": "standard"  # 分词标记器
        # "tokenizer": "whitespace" # 空格标记器 与上面的相比,他会保留标点符号
        # "tokenizer": "jieba" # 结巴分词器
        # "tokenizer": "lindera"
        # "tokenizer": "icu"
    }


    """
    jieba标记器参数
        dict: ["_default_"] # 使用默认字典
        mode: "search" # 使用搜索模式 exact 精确模式
        hmm: True # 启用HMM进行概率分词 隐马尔可夫模型
    """

    sample_text = "milvus结巴分词器中文测试"
    analyzer_params = {"tokenizer": "jieba"}
    result = client.run_analyzer(sample_text, analyzer_params)
    # ["milvus", "结巴", "分词器", "中文", "测试"]

    """
    lindera标记器参数
        dict_kind: <type>
            "ko-dic": 韩语
            "ipadic": 日语
            "ipadic-neologd": 日语新版
            "unidic": 日语
            "cc-cedict": 中文普通话
    """

    """
    Milvus 一致性 四种级别 1. 强一致性 2. 有界一致性 3. 最终一致性 4. 会话一致性

    """

    # 🚀 在milvus中保存创建包含稀疏向量的集合
    # 要在milvus中使用稀疏微量,需要创建一个包含以下字段的集合
    # 1. 一个SPARSE_FLOAT_VECTOR字段,用于存储稀疏向量
    # 2. 通常还会存储原始文本,可使用VARCHAR字段

    from pymilvus import MilvusClient, DataType
    client = MilvusClient("uri=http://localhost:19530")

    schema = client.create_schema(
        auto_id=True,
        enable_dynamic_field=True
    )

    schema.add_field(field_name="pk", datatype=DataType.VARCHAR, max_length=256)
    schema.add_field(field_name="sparse_vector", datatype=DataType.SPARSE_FLOAT_VECTOR)
    schema.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=65535, enable_analyzer=True)

    # 创建集合
    client.create_collection(
        collection_name="sparse_collection",
        schema=schema
    )


# 🌽 Neo4j 图数据库
# ====================================================================================================================================

    from neo4j import GraphDatabase

    URI = "neo4j://localhost"
    AUTH = ("<username>", "<password>")

    with GraphDatabase.driver(URI, auth=AUTH) as driver:
        # 验证是否连接成功
        driver.verify_connectivity()
        print("成功连接到Neo4j数据库")

        # 执行一个写事务
        summary = driver.execute_query(
            """
            create (a:Person {name: $name})
            create (b:Person {name: $fiendName})
            create (a)-[:KNOWS]->(b)
            return a, b
            """
            ,
            name="Alice",
            friendName="Divid",
            database="neo4j"
        ).summay

        # 查询数据
        records, summary, keys = driver.execute_query(
            """
            match (p:Person)-[:KNOWS]->(friend:Person)
            return p.name as person, friend.name as friend
            """
            ,
            database="neo4j"
        )
        print("查询结果")
        for record in records:
            print(f"{record['person']  认识 record['friend']}")

        # 查看查询的元数据
        print(f"\n查询'{summary.query}'返回{len(records)}条记录。")


    # 🔥 neo4j数据库查询 案例

    def neo4j_query_examples(driver, query_type, params=None):
        """
        执行各种Neo4j查询示例

        参数:
        - driver: Neo4j驱动实例
        - query_type: 查询类型,可选值包括:
            'all_persons', 'all_companies', 'filter_by_city', 'all_relationships',
            'specific_relationship', 'node_relationships', 'path_query', 'aggregation',
            'group_by', 'colleagues', 'complex_query', 'param_query', 'subgraph', 'community'
        - params: 查询参数字典,根据查询类型不同而不同

        返回:
        - 查询结果列表
        """
        if params is None:
            params = {}

        results = []

        with driver.session() as session:
            if query_type == 'all_persons':
                # 查询所有Person节点
                result = session.run("""
                    MATCH (p:Person)
                    RETURN p.name AS name, p.age AS age, p.city AS city
                """)

                print("所有Person节点:")
                for record in result:
                    print(f"姓名: {record['name']}, 年龄: {record['age']}, 城市: {record['city']}")
                    results.append({
                        'name': record['name'],
                        'age': record['age'],
                        'city': record['city']
                    })

            elif query_type == 'all_companies':
                # 查询所有Company节点
                result = session.run("""
                    MATCH (c:Company)
                    RETURN c.name AS name, c.industry AS industry, c.location AS location
                """)

                print("所有Company节点:")
                for record in result:
                    print(f"公司: {record['name']}, 行业: {record['industry']}, 位置: {record['location']}")
                    results.append({
                        'name': record['name'],
                        'industry': record['industry'],
                        'location': record['location']
                    })

            elif query_type == 'filter_by_city':
                # 按城市过滤Person节点
                city = params.get('city', 'beijing')
                result = session.run("""
                    MATCH (p:Person)
                    WHERE p.city = $city
                    RETURN p.name AS name, p.age AS age
                """, {'city': city})

                print(f"{city}的人员:")
                for record in result:
                    print(f"姓名: {record['name']}, 年龄: {record['age']}")
                    results.append({
                        'name': record['name'],
                        'age': record['age']
                    })

            elif query_type == 'all_relationships':
                # 查询所有关系
                result = session.run("""
                    MATCH (p:Person)-[r]->(c:Company)
                    RETURN p.name AS person, type(r) AS relationship, c.name AS company
                """)

                print("所有人员与公司的关系:")
                for record in result:
                    print(f"{record['person']} {record['relationship']} {record['company']}")
                    results.append({
                        'person': record['person'],
                        'relationship': record['relationship'],
                        'company': record['company']
                    })

            elif query_type == 'specific_relationship':
                # 查询特定类型的关系
                rel_type = params.get('rel_type', 'EMPLOYED_BY')
                result = session.run(f"""
                    MATCH (p:Person)-[:{rel_type}]->(c:Company)
                    RETURN p.name AS person, c.name AS company
                """)

                print(f"{rel_type}关系:")
                for record in result:
                    print(f"{record['person']} 与 {record['company']} 有{rel_type}关系")
                    results.append({
                        'person': record['person'],
                        'company': record['company']
                    })

            elif query_type == 'node_relationships':
                # 查询特定节点的关系
                person_name = params.get('person_name', 'muyu')
                result = session.run("""
                    MATCH (p:Person {name: $name})-[r]->(c)
                    RETURN type(r) AS relationship, c.name AS connected_to, labels(c) AS node_type
                """, {'name': person_name})

                print(f"{person_name}的所有关系:")
                for record in result:
                    print(f"关系类型: {record['relationship']}, 连接到: {record['connected_to']}, 节点类型: {record['node_type']}")
                    results.append({
                        'relationship': record['relationship'],
                        'connected_to': record['connected_to'],
                        'node_type': record['node_type']
                    })

            elif query_type == 'aggregation':
                # 聚合查询
                result = session.run("""
                    MATCH (p:Person)-[:EMPLOYED_BY]->(c:Company)
                    RETURN c.name AS company, count(p) AS employee_count, avg(p.age) AS avg_age
                """)

                print("公司员工统计:")
                for record in result:
                    print(f"公司: {record['company']}, 员工数: {record['employee_count']}, 平均年龄: {round(record['avg_age'], 1)}")
                    results.append({
                        'company': record['company'],
                        'employee_count': record['employee_count'],
                        'avg_age': record['avg_age']
                    })

            elif query_type == 'group_by':
                # 条件分组查询
                result = session.run("""
                    MATCH (p:Person)
                    RETURN p.city AS city, count(p) AS person_count,
                           collect(p.name) AS names
                    ORDER BY person_count DESC
                """)

                print("按城市分组的人员统计:")
                for record in result:
                    print(f"城市: {record['city']}, 人数: {record['person_count']}, 姓名: {record['names']}")
                    results.append({
                        'city': record['city'],
                        'person_count': record['person_count'],
                        'names': record['names']
                    })


            elif query_type == 'complex_query':
                # 多条件复合查询
                min_age = params.get('min_age', 25)
                location = params.get('location', 'beijing')
                result = session.run("""
                    MATCH (p:Person)-[r]->(c:Company)
                    WHERE p.age > $min_age AND c.location = $location
                    AND (type(r) = 'EMPLOYED_BY' OR type(r) = 'INVESTED_IN')
                    RETURN p.name AS person, p.age AS age,
                           type(r) AS relationship, c.name AS company
                    ORDER BY p.age DESC
                """, {'min_age': min_age, 'location': location})

                print(f"{min_age}岁以上且与{location}公司有雇佣或投资关系的人:")
                for record in result:
                    print(f"{record['person']} ({record['age']}岁) {record['relationship']} {record['company']}")
                    results.append({
                        'person': record['person'],
                        'age': record['age'],
                        'relationship': record['relationship'],
                        'company': record['company']
                    })

            elif query_type == 'param_query':
                # 参数化查询
                query_params = {
                    'min_age': params.get('min_age', 25),
                    'location': params.get('location', 'beijing'),
                    'relationship_types': params.get('relationship_types', ["EMPLOYED_BY", "INVESTED_IN"])
                }

                result = session.run("""
                    MATCH (p:Person)-[r]->(c:Company)
                    WHERE p.age > $min_age AND c.location = $location
                    AND type(r) IN $relationship_types
                    RETURN p.name AS person, type(r) AS relationship, c.name AS company
                """, query_params)

                print(f"参数化查询结果 (年龄 > {query_params['min_age']}, 位置: {query_params['location']}):")
                for record in result:
                    print(f"{record['person']} {record['relationship']} {record['company']}")
                    results.append({
                        'person': record['person'],
                        'relationship': record['relationship'],
                        'company': record['company']
                    })

            else:
                print(f"未知的查询类型: {query_type}")
                results.append({"error": f"未知的查询类型: {query_type}"})

        return results


# 🗄️ Redis 数据库
# ====================================================================================================================================
    # docker exec -it redis redis-cli
    
    import redis

    pool = redis.ConnectionPool(host="127.0.0.1", port=6379)
    r = redis.Redis(connection_pool=pool)

    r.delete("foo")

    # 🚀 string
    r.set("foo", "bar")
    print(r.get("foo"))
    r.set("key_resource_1", "1", nx=True, ex=10)  # 原子性

    # 不允许设置已经存在的键
    ret = r.setnx("name", "zhngsha")
    print(ret)

    # 设置过期时间
    r.setex("production", 10, "com")

    # 自增自减
    r.set("age", 21)
    r.incr("age", 10)
    r.decr("age", 10)

    # 🚀 hash
    r.hset("info", "name", "rain")
    print(r.hget("info", "name"))

    r.hmset("info", {"age": 22, "name": "rain"})
    print(r.hgetall("info"))

    # 🚀 list
    r.rpush("scores", "100", "90", "80")
    r.lpush("scores", "120")
    print(r.lrange("scores", 0, -1))  # 获取列表所有元素
    r.linsert("scores", "AFTER", "100", 95)  # 100元素后面加 95
    r.lpop("scores")
    r.rpop("scores")
    r.lindex("scores", 1)  # 获取索引为1的元素

    # 🚀 set
    r.sadd("name_set", "element1", "element2", "element3")
    # 获取集合所有元素
    print(r.smembers("name_set"))
    # 从集合中随机获取2个元素
    print(r.srandmember("name_set", 2))
    # 删除集合中元素
    r.srem("name_set", "element2")

    # 🚀 zset
    r.zadd("jifenbang", {"yuan": 100, "li": 90, "wang": 80})
    r.zrange("jifenbang", 0, -1)
    r.zrange("jifenbang", 0, -1, withscores=True)  # 名字加分数一起给我
    r.zrevrange("jifenbang", 0, -1, withscores=True)  # 从高到低排序

    r.zrangebyscore("jifenbang", 60, 100)  # 范围
    r.zrangebyscore("jifenbang", 60, 100, start=0, num=1)  # 范围 后 从0开始取,只取1个
    r.zrem("jifenbang", "li")  # 删除li

    r.exists("jifenbang")  # 检查是否存在是否存在
    r.keys("*")  # 获取所有键名
    r.expire("name", 10)  # 设置ttl

    # 🚀 发布订阅
    # 生产者
    r.publish("room_101", "hello world")

    # 消费者
    pub = r.pubsub()
    pub.subscribe("room_101")
    pub.parse_response()

    while True:
        print("waiting...")
        res_msg = pub.parse_response()
        print("msg", res_msg)


# 📚 Native RAG
# ====================================================================================================================================


    # 🔥 17种RAG方案

        # ✂️ 1. Simple RAG(固定字数硬切)

            # ■ 核心思想
            # 最朴素的 RAG:拿一个文本切割器,按固定字符数(比如 512、1024)把文档切成 chunks,
            # 然后做向量检索。不考虑语义边界,一刀切。

            # ■ 适用场景
            # - 快速验证、Demo 阶段
            # - 文档结构规整、内容简单
            # - 对精确度要求不高

            # ■ 优缺点
            # | 优点 | 缺点 |
            # | 实现简单,一行代码 | 切断语义完整的段落 |
            # | 速度快 | 检索召回率一般 |

            # ■ 代码示例

            # ============================================================
            # ！ pip install langchain-text-splitters
            from langchain_text_splitter import RecursiveCharacterTextSplitter
            from langchain_community.embeddings import HuggingFaceEmbeddings
            from langchain_community.vectorstores import Chroma

            # 1. 固定字数切分
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=512,
                chunk_overlap=50,
                separators=["\n\n", "\n", "。", "!", "?", " ", ""]
            )

            # 2. 加载文档
            from langchain_community.document_loaders import TextLoader
            loader = TextLoader("data.txt")
            docs = loader.load()
            chunks = text_splitter.split_documents(docs)

            # 3. 向量化 + 存库
            embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-zh-v1.5")
            vectorstore = Chroma.from_documents(chunks, embeddings)

            # 4. 检索
            retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
            results = retriever.invoke("什么是 RAG?")

            for r in results:
                print(f"[Score: {r.metadata.get('score', 'N/A')}] {r.page_content[:100]}...")

            # ------------------------------------------------------------


        # 🧠 2. Semantic Chunking(语义切分)

            # ■ 核心思想
            # 不按字数切,按语义完整度切。用 embedding 相似度判断句子之间的"断裂点"--
            # 语义变化大的地方就是 chunk 的分界。

            # ■ 原理
            # 1. 先把文档拆成句子
            # 2. 把相邻句子分别做 embedding
            # 3. 算余弦相似度
            # 4. 相似度骤降的地方就是分界点

            # ■ 代码示例

            # ============================================================

            import numpy as np
            from sentence_transformers import SentenceTransformer

            model = SentenceTransformer("all-MiniLM-L6-v2")

            def semantic_chunk(text, threshold=0.6):
                sentences = text.replace("。", "。\n").replace("!", "!\n").replace("?", "?\n").split("\n")
                sentences = [s.strip() for s in sentences if s.strip()]
                embeddings = model.encode(sentences)
                similarities = []
                for i in range(len(embeddings) - 1):
                    sim = np.dot(embeddings[i], embeddings[i+1]) / (
                        np.linalg.norm(embeddings[i]) * np.linalg.norm(embeddings[i+1])
                    )
                    similarities.append(sim)
                chunks = []
                current = [sentences[0]]
                for i, sim in enumerate(similarities):
                    if sim < threshold:
                        chunks.append("".join(current))
                        current = [sentences[i+1]]
                    else:
                        current.append(sentences[i+1])
                chunks.append("".join(current))
                return chunks

            # 使用
            text = """人工智能是一门研究如何制造智能机器的学科。
            它涉及计算机科学、心理学、哲学等多个领域。
            机器学习是 AI 的一个重要分支。
            深度学习又是机器学习的一个子集。
            今天天气很好,适合出去玩。
            阳光明媚,万里无云。"""
            chunks = semantic_chunk(text, threshold=0.5)
            for i, chunk in enumerate(chunks):
                print(f"--- Chunk {i+1} ---\n{chunk}\n")

            # ------------------------------------------------------------


        # 🔍 3. Small-to-Big Retrieval(小块找,大块答)

            # ■ 核心思想
            # 用细粒度的小 chunk 做检索(精准命中),
            # 但把检索到的小 chunk 所在的更大上下文拿给 LLM 回答。
            # 解决了"小块太碎片化缺少上下文,大块太粗糙检索不准"的矛盾。

            # ■ 原理
            # 文档 → 大块(用于 LLM)→ 小块(用于检索),子块 → 父块映射

            # ■ 代码示例

            # ============================================================


            # 1. 同时维护两种切分粒度
            parent_splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=100)
            child_splitter = RecursiveCharacterTextSplitter(chunk_size=256, chunk_overlap=30)

            # 2. 加载文档
            with open("data.txt") as f:
                text = f.read()

            parent_chunks = parent_splitter.split_text(text)
            child_chunks = []
            parent_map = {}  # 子块 → 父块映射

            for pid, parent in enumerate(parent_chunks):
                children = child_splitter.split_text(parent)
                for child in children:
                    child_chunks.append(child)
                    parent_map[child] = parent  # 记录子块属于哪个父块

            # 3. 子块向量化(只建子块的索引)
            embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-zh-v1.5")
            vectorstore = Chroma.from_texts(child_chunks, embeddings)

            # 4. 检索:用子块搜,但返回父块
            query = "RAG 有哪些常见方案?"
            results = vectorstore.similarity_search(query, k=3)

            # 映射回父块(去重)
            parent_results = []
            seen = set()
            for r in results:
                parent = parent_map[r.page_content]
                if parent not in seen:
                    parent_results.append(parent)
                    seen.add(parent)

            for i, p in enumerate(parent_results):
                print(f"--- 父块 {i+1} ---\n{p[:200]}...\n")



            # ------------------------------------------------------------


        # 📋 4. Context-Enriched Chunking(上下文增强)


            # ■ 核心思想

            # 每个 chunk 不仅存自己的内容,还在前面加上文档标题、章节名、前后文摘要等元信息。 检索时匹配的信息更丰富,提高命中率。

            # ■ 原理


            # ============================================================
            # 代码
            # ============================================================
            # 原始 chunk:
            #   "使用了 LoRA 微调方法"

            # 增强后 chunk:
            #   "[文档: LLM 微调指南 > 第三章: 高效微调方法] 使用了 LoRA 微调方法"


            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            from langchain.schema import Document

            def enrich_chunks(chunks, doc_title, section_titles):
                """给 chunks 添加上下文前缀"""
                enriched = []
                for i, chunk in enumerate(chunks):
                    # 找到这个 chunk 属于哪一节
                    section = ""
                    for title, start, end in section_titles:
                        if start <= i < end:
                            section = title
                            break

                    # 拼接上下文
                    prefix = f"[文档: {doc_title} > {section}] " if section else f"[文档: {doc_title}] "
                    enriched_content = prefix + chunk.page_content

                    enriched.append(Document(
                        page_content=enriched_content,
                        metadata={
                            "original": chunk.page_content,
                            "doc_title": doc_title,
                            "section": section,
                            "chunk_index": i
                        }
                    ))
                return enriched

            # 使用
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
            chunks = text_splitter.split_documents(loader.load())

            enriched = enrich_chunks(
                chunks,
                doc_title="RAG 技术白皮书",
                section_titles=[
                    ("基础概念", 0, 5),
                    ("检索策略", 5, 12),
                    ("生成优化", 12, 20)
                ]
            )

            # 检索时自动带上上下文信息
            embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-zh-v1.5")
            vectorstore = Chroma.from_documents(enriched, embeddings)

            # ------------------------------------------------------------


        # 🏷️ 5. Chunk-Header(块级加标)


            # ■ 核心思想

            # 在 chunk 开头加一个 描述性摘要(header),检索时只看 header 就能决定要不要看完整 chunk。有点像书的目录。

            # ■ 完整流程


            # ============================================================
            # 代码
            # ============================================================
            # 文档 → 切 chunks → LLM 为每个 chunk 生成 header
            #      → 存入向量库(header 放在 metadata + 内容前缀里)
            #      → 检索时 header 参与匹配,提高 precision


            # ■ 完整代码


            # ============================================================
            # 代码
            # ============================================================
            from langchain.text_splitter import RecursiveCharacterTextSplitter
            from langchain_community.document_loaders import TextLoader
            from langchain_community.embeddings import HuggingFaceEmbeddings
            from langchain_community.vectorstores import Chroma
            from langchain.schema import Document
            from langchain_openai import ChatOpenAI
            import os

            # ========== 1. 准备数据 ==========
            loader = TextLoader("data.txt")
            docs = loader.load()

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=512,
                chunk_overlap=50
            )
            raw_chunks = text_splitter.split_documents(docs)

            # ========== 2. 用 LLM 为每个 chunk 生成 header ==========
            llm = ChatOpenAI(model="gpt-4o-mini")

            def generate_header(chunk_text):
                """为 chunk 生成一句话标题"""
                prompt = f"""为以下文本生成一句话标题(20字以内),
            # 让读者能快速判断是否包含所需信息:

            # {chunk_text[:500]}

            # 标题:"""
                response = llm.invoke(prompt)
                return response.content.strip()

            chunk_docs = []
            for chunk in raw_chunks:
                header = generate_header(chunk.page_content)

                chunk_docs.append(Document(
                    # header + 原文一起作为检索内容
                    page_content=f"【{header}】\n{chunk.page_content}",
                    metadata={
                        "header": header,              # header 单独存一份
                        "original": chunk.page_content, # 原始内容
                        "source": chunk.metadata.get("source", "")
                    }
                ))

            # ========== 3. 向量化入库 ==========
            embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-zh-v1.5")
            vectorstore = Chroma.from_documents(chunk_docs, embeddings)

            # ========== 4. 检索(三种策略) ==========

            def retrieve_with_header(query, k=3, strategy="hybrid"):
                """
                三种检索策略:
                 - "header_only": 只匹配 header(在 metadata 里搜)
                 - "full_text": 匹配 header + 正文一起
                 - "hybrid": 先按 header_only 过滤出候选,再用 full_text 重排
                """
                if strategy == "header_only":
                    # 方案一:只搜 header
                    # 直接把 query 和 header 拼接后检索
                    results = vectorstore.similarity_search(query, k=k * 3)
                    # 按 header 去重,保留第一个
                    seen_headers = set()
                    filtered = []
                    for r in results:
                        h = r.metadata["header"]
                        if h not in seen_headers:
                            seen_headers.add(h)
                            # 返回原始内容
                            r.page_content = r.metadata["original"]
                            filtered.append(r)
                    return filtered[:k]

                elif strategy == "full_text":
                    # 方案二:header + 正文一起匹配(默认)
                    return vectorstore.similarity_search(query, k=k)

                else:
                    # 方案三:混合策略 - 两步走
                    # Step 1: 用 header 做一轮粗筛
                    header_results = vectorstore.similarity_search(query, k=k * 2)
                    # Step 2: 再用 query 和候选 chunks 做精排(用原始内容)
                    candidates = []
                    for r in header_results:
                        candidates.append(Document(
                            page_content=r.metadata["original"],
                            metadata=r.metadata
                        ))
                    # 临时建一个小索引做精排
                    temp_db = Chroma.from_documents(candidates, embeddings)
                    final = temp_db.similarity_search(query, k=k)
                    # 把 header 贴回结果便于阅读
                    for r in final:
                        r.page_content = f"【{r.metadata['header']}】\n{r.metadata['original']}"
                    return final

            # ========== 5. 测试三种策略 ==========
            query = "向量数据库怎么选型?"

            print("=== 策略1:仅匹配 header ===")
            for r in retrieve_with_header(query, strategy="header_only"):
                print(f"📌 {r.metadata['header']}")
                print(r.metadata["original"][:150])
                print()

            print("=== 策略3:混合策略(推荐) ===")
            for r in retrieve_with_header(query, strategy="hybrid"):
                print(r.page_content[:200])
                print()


            # ■ 三种策略选哪个?

            # | 策略            | 精度  | 召回 | 速度 | 适合场景 |
            # | header_only     | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | header 质量极高时,快速筛选 |
            # | full_text       | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 默认通用方案 |
            # | **hybrid**      | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | **推荐**,精度最高 |


            # ------------------------------------------------------------


        # 📄 6. Document-Augmentation(文档增强)


            # ■ 核心思想

            # 在文档入库之前,先让 LLM 对文档做预处理:生成摘要、提取关键词、补充相关知识点、改写为 Q&A 对。把"脏活"前置,让检索更准。

            # ■ 常见操作

            # - 为文档生成摘要,作为额外 chunk 存入
            # - 从文档中提取 Q&A 对
            # - 把口语化文档改写为结构化文本
            # - 补充专业术语解释

            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(model="gpt-4o-mini")

            def augment_document(chunk_text):
                """为 chunk 生成增强内容"""
                prompt = f"""请对以下文本做三项增强处理:

                1. 生成一句话摘要
                2. 提取 3-5 个关键术语(包括解释)
                3. 生成一个相关的 FAQ 问答

                文本:
                {chunk_text[:1000]}

                请以 JSON 格式输出:"""

                response = llm.invoke(prompt)
                return {
                    "original": chunk_text,
                    "augmented": response.content
                }

            # 把增强产物也存入向量库
            augmented_docs = []
            for chunk in chunks:
                result = augment_document(chunk.page_content)
                augmented_docs.append(Document(
                    page_content=result["augmented"],
                    metadata={"type": "augmented", "original_chunk": chunk.page_content[:100]}
                ))

            # 原始 chunks + 增强内容一起建索引
            all_docs = chunks + augmented_docs
            vectorstore = Chroma.from_documents(all_docs, embeddings)

            # ------------------------------------------------------------


        # 🔄 7. Query-Transformation(查询改写)


            # ■ 核心思想

            # 用户输入的 query 往往质量不高(太短、歧义、口语化)。在检索前先让 LLM 把 query 改写成更适合检索的形式--扩写、补全、拆解、标准化。

            # ■ 常见改写策略

            # | 策略 | 说明 | 示例 |
            # | 扩写 | 补充同义词或上下文 | "LoRA" → "LoRA 低秩适配微调方法" |
            # | 拆解 | 复杂问题拆成子问题 | 多跳问题拆解为多个简单 query |
            # | 假设回答 | 反问 LLM 可能的答案 | Step-back prompting |
            # | 翻译 | 跨语言场景 | 中文 query 翻译为英文检索 |
            # | 纠错 | 修正错别字 | "RAG 元梨" → "RAG 原理" |

            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(model="gpt-4o-mini")

            def transform_query(query):
                """将原始 query 改写成更适合检索的版本"""
                prompt = f"""你是一个搜索专家。用户输入了一个查询,请将它改写为更清晰、
                更完整、更适合向量检索的版本。可以补全术语、纠正表达、增加相关关键词。

                原始查询:{query}

                要求:
                - 保持原始意图不变
                - 使用专业术语
                - 输出 3 个改写版本,每行一个
                - 不要额外解释

                改写版本:"""
                response = llm.invoke(prompt)
                variants = [q.strip() for q in response.content.split("\n") if q.strip()]
                return [query] + variants  # 原始 query + 改写版本

            def multi_query_retrieve(retriever, query, k=3):
                """用多个 query 变体分别检索,合并结果去重"""
                queries = transform_query(query)
                all_results = []

                for q in queries:
                    results = retriever.invoke(q)
                    all_results.extend(results)

                # 按内容去重
                seen = set()
                unique = []
                for r in all_results:
                    if r.page_content not in seen:
                        seen.add(r.page_content)
                        unique.append(r)

                return unique[:k]

            # 使用
            query = "微调显存不够怎么办"
            results = multi_query_retrieve(retriever, query)



            # ------------------------------------------------------------


        # 🎯 8. Rerank(重排序)


            # ■ 核心思想

            # 先用轻量级检索(向量、BM25)粗筛一轮,拿到候选集,再用一个专门的 Reranker 模型对候选集精细排序。 向量检索的"语义相似"≠"真正满足需要的答案"
            # Reranker 能拉回排序的精度。

            # ■ 原理


            # ============================================================
            # 代码
            # ============================================================
            #               Query
            #                 ↓
            #    ┌───────────────────────┐
            #    │   Step 1: 粗筛        │  ← 向量检索,召回 top-50
            #    │   (Bi-encoder)         │
            #    └────────┬──────────────┘
            #             ↓
            #    ┌───────────────────────┐
            #    │   Step 2: 精排        │  ← Reranker,从 top-50 选出 top-3
            #    │   (Cross-encoder)      │  ↑ 这里更慢但更准
            #    └────────┬──────────────┘
            #             ↓
            #            LLM 回答


            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            # 方案 A:用 Cohere Rerank API
            from langchain.retrievers import ContextualCompressionRetriever
            from langchain.retrievers.document_compressors import CohereRerank
            from langchain_cohere import CohereRerank

            # 1. 基础检索器
            base_retriever = vectorstore.as_retriever(search_kwargs={"k": 20})

            # 2. 加 Reranker 压缩(重排序 + 截断)
            compressor = CohereRerank(model="rerank-english-v3.0", top_n=3)
            retriever_with_rerank = ContextualCompressionRetriever(
                base_compressor=compressor,
                base_retriever=base_retriever
            )

            results = retriever_with_rerank.invoke("LoRA 和 QLoRA 的区别")

            # 方案 B:本地 Reranker(BAAI/bge-reranker-v2-m3)
            # 免费、离线、隐私友好
            from FlagEmbedding import FlagReranker

            reranker = FlagReranker('BAAI/bge-reranker-v2-m3', use_fp16=True)

            def rerank(query, candidates, top_k=3):
                """本地重排序"""
                pairs = [(query, doc.page_content) for doc in candidates]
                scores = reranker.compute_score(pairs)

                # 按得分降序排列
                scored = list(zip(candidates, scores))
                scored.sort(key=lambda x: x[1], reverse=True)

                return [doc for doc, score in scored[:top_k]]

            # 使用
            candidates = vectorstore.similarity_search(query, k=20)
            best = rerank(query, candidates, top_k=3)


            # ■ 推荐 Reranker 模型

            # | 模型 | 特点 |
            # | `BAAI/bge-reranker-v2-m3` | 免费、中文好、Multi-lingual |
            # | `Cohere rerank-english-v3.0` | 付费但效果好 |
            # | `jina-reranker-v2-base-multilingual` | 多语言、免费 |
            # | `ms-marco-MiniLM-L6-v2` | 轻量、速度快 |


            # ------------------------------------------------------------


        # 🧩 9. Sentence Window Retrieval(连续片段检索)


            # ■ 核心思想

            # 检索到一条句子后,把这条句子前后的 N 条句子也一起带上作为上下文。保证 LLM 看到的不是孤立的片段,而是一个完整的语义窗口。

            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            class SentenceWindowRetriever:
                def __init__(self,vectorstore, sentences, window_size=3):
                    self.vectorstore = vectorstore
                    self.sentences = sentences  # 按顺序的句子列表
                    self.window_size = window_size

                def retrieve(self, query, k=3):
                    """检索句子及其上下文窗口"""
                    # 1. 检索命中的句子
                    results = self.vectorstore.similarity_search(query, k=k)

                    window_results = []
                    for r in results:
                        idx = r.metadata.get("sentence_index", 0)

                        # 2. 取前 window_size 和后 window_size 句
                        start = max(0, idx - self.window_size)
                        end = min(len(self.sentences), idx + self.window_size + 1)
                        window = "".join(self.sentences[start:end])

                        window_results.append(window)

                    return window_results

            # 使用
            sentences = text.replace("。", "。\n").split("\n")
            sentences = [s.strip() for s in sentences if s.strip()]

            # 每句建索引时记录 index
            documents = [
                Document(page_content=s, metadata={"sentence_index": i})
                for i, s in enumerate(sentences)
            ]

            vectorstore = Chroma.from_documents(documents, embeddings)
            retriever = SentenceWindowRetriever(vectorstore, sentences, window_size=3)

            results = retriever.retrieve("什么是参数高效微调?")



            # ------------------------------------------------------------


        # 📦 10. Context Compression(上下文压缩)


            # ■ 核心思想

            # 检索到的 chunks 太多太长?在送入 LLM 之前先压缩一下。 把大量检索结果压缩成精简的版本,省 token 省钱还减少噪声。

            # ■ 常见方法

            # | 方法 | 说明 |
            # | LLM 重写摘要 | 让 LLM 把多个 chunks 压缩为一段 |
            # | 自动提取关键句 | 用 NLP 方法(TextRank 等)提取关键句 |
            # | 选择性包含 | 只保留与 query 相关的句子 |
            # | 结构化输出 | 转为表格或要点列表 |

            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            from langchain.retrievers.document_compressors import LLMChainExtractor
            from langchain_openai import ChatOpenAI
            from langchain.retrievers import ContextualCompressionRetriever

            # 方案 A:用 LLM 提取关键内容(自动去掉无关部分)
            llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
            compressor = LLMChainExtractor.from_llm(llm)

            compression_retriever = ContextualCompressionRetriever(
                base_compressor=compressor,
                base_retriever=vectorstore.as_retriever(search_kwargs={"k": 5})
            )

            compressed_results = compression_retriever.invoke("LoRA rank 怎么设置?")

            # 方案 B:自己实现压缩
            def compress_chunks(query, chunks, max_tokens=1000):
                """手动压缩 chunks 为精简版"""
                combined = "\n\n".join([c.page_content for c in chunks])
                prompt = f"""请根据以下查询,从检索到的文档中提取最关键的信息。
                    # 只保留与查询直接相关的内容,去除冗余。

                    # 查询:{query}
                    # 文档:{combined}

                    # 精简后的关键信息:"""
                response = llm.invoke(prompt)
                return response.content



            # ------------------------------------------------------------


        # 🔁 11. Feedback-Loop(反馈闭环)


            # ■ 核心思想

            # 让 RAG 系统有"记忆"。 如果用户对某个回答点了赞/踩,或者追问了,系统把这些反馈存下来。下次类似 query 来了,优先使用"历史已验证正确"的 chunks。

            # ■ 实现方式

            # - 存储用户的 query、检索到的 chunks、LLM 回答
            # - 记录用户的显式反馈(点赞/点踩)
            # - 记录隐式反馈(是否追问、是否复制答案)
            # - 正反馈的 query-chunk 对用于重排序或作为提示

            # ■ 代码示例(简化版)


            # ============================================================
            # 代码
            # ============================================================
            import json
            import sqlite3
            from datetime import datetime

            class FeedbackLoopRAG:
                def __init__(self, retriever, llm, db_path="feedback.db"):
                    self.retriever = retriever
                    self.llm = llm
                    self.conn = sqlite3.connect(db_path)
                    self._init_db()

                def _init_db(self):
                    self.conn.execute("""
                        CREATE TABLE IF NOT EXISTS feedback (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            query TEXT,
                            chunk_text TEXT,
                            answer TEXT,
                            rating INTEGER,  -- 1 = 正反馈, -1 = 负反馈
                            timestamp TEXT
                        )
                    """)
                    self.conn.execute("""
                         CREATE TABLE IF NOT EXISTS positive_pairs (
                             query TEXT,
                             chunk_text TEXT,
                             count INTEGER DEFAULT 1,
                            UNIQUE(query, chunk_text)
                        )
                    """)
                    self.conn.commit()

                def retrieve(self, query, k=3):
                    """检索时考虑历史正反馈"""
                    # 基础检索
                    base_results = self.retriever.invoke(query, k=k * 2)

                    # 查历史正反馈中有没有匹配的
                    cursor = self.conn.execute(
                        "SELECT chunk_text, count FROM positive_pairs WHERE query = ? ORDER BY count DESC",
                        (query,)
                    )
                    positive_chunks = {row[0]: row[1] for row in cursor.fetchall()}

                    # 正反馈的 chunk 加权优先
                    scored = []
                    for doc in base_results:
                        boost = positive_chunks.get(doc.page_content, 0)
                        score = doc.metadata.get("score", 0.5) + boost * 0.1
                        scored.append((doc, score))

                    scored.sort(key=lambda x: x[1], reverse=True)
                    return [doc for doc, _ in scored[:k]]

                def record_feedback(self, query, chunks, answer, rating):
                    """记录用户反馈"""
                    now = datetime.now().isoformat()
                    for chunk in chunks:
                        self.conn.execute(
                            "INSERT INTO feedback (query, chunk_text, answer, rating, timestamp) VALUES (?, ?, ?, ?, ?)",
                            (query, chunk.page_content, answer, rating, now)
                        )
                        if rating == 1:  # 正反馈
                            self.conn.execute("""
                                INSERT INTO positive_pairs (query, chunk_text, count)
                                VALUES (?, ?, 1)
                                ON CONFLICT(query, chunk_text) DO UPDATE SET count = count + 1
                            """, (query, chunk.page_content))
                    self.conn.commit()



            # ------------------------------------------------------------


        # 🧐 12. Self-RAG(内省反思机制)


            # ■ 核心思想

            # 让模型在生成回答时,自己做三个反思: (1)检索到的内容够不够? (2)回答有没有忠实于检索结果?(3)当前回答是否足够好? 根据反思结果决定是生成、重新检索还是修改。

            # ■ 工作流程


            # ============================================================
            # 代码
            # ============================================================
            # Query → 检索 → 生成初步回答
            #      ↓
            #   自省评估:
            #     ├── 检索足够? → 是 → 生成回答
            #     │               └─ 否 → 重新检索
            #     ├── 回答准确? → 是 → 输出
            #     │               └─ 否 → 修正
            #     └── 回答完整? → 是 → 输出
            #                     └─ 否 → 继续检索


            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(model="gpt-4o")

            class SelfRAG:
                def __init__(self, retriever, llm, max_iterations=3):
                    self.retriever = retriever
                    self.llm = llm
                    self.max_iterations = max_iterations

                def ask(self, query):
                    """带自省反思的 RAG"""
                    context = ""
                    for i in range(self.max_iterations):
                        # 1. 检索
                        if not context:
                            docs = self.retriever.invoke(query, k=3)
                            context = "\n\n".join([d.page_content for d in docs])

                        # 2. 生成回答
                        prompt = f"""基于以下内容回答问题:

                        上下文:{context}
                        问题:{query}
                        回答:"""
                        answer = self.llm.invoke(prompt).content

                        # 3. 自省评估
                        critique = self.llm.invoke(f"""评估以下回答的质量:

                        问题:{query}
                        回答:{answer}
                        上下文:{context}

                        请从以下三个方面评分(1-5分):
                        1. 回答是否忠实于上下文(faithfulness)
                        2. 回答是否完整覆盖了问题(completeness)
                        3. 是否需要更多信息(need_more_context,1=不需要,5=需要)

                        只输出分数,格式:faithfulness: X, completeness: X, need_more: X""").content

                        scores = {}
                        for line in critique.split(","):
                            parts = line.strip().split(":")
                            if len(parts) == 2:
                                key = parts[0].strip()
                                val = parts[1].strip()
                                scores[key] = int(val)

                        # 4. 判断是否继续
                        if scores.get("need_more", 5) <= 2 and scores.get("faithfulness", 1) >= 4:
                            return answer  # 够了,输出

                        # 否则补充检索
                        new_docs = self.retriever.invoke(query, k=2)
                        context += "\n\n" + "\n\n".join([d.page_content for d in new_docs])

                    # 兜底返回
                    return answer



            # ------------------------------------------------------------


        # 🕸️ 13. Knowledge Graph RAG(知识图谱)


            # ■ 核心思想

            # 不是简单做向量检索,而是从文档中提取实体和关系构建知识图谱。 检索时既走向量相似度,也走图关系路径,把多跳关联信息也找出来。

            # ■ 架构


            # ============================================================
            # 代码
            # ============================================================
            # 文档 → 实体提取 → 关系提取 → 知识图谱(Neo4j / NetworkX)
            #                                           ↓
            #                                    Query → 图查询 + 向量检索
            #                                           ↓
            #                                   融合结果 → LLM


            # ■ 代码示例(简化版 NetworkX 实现)


            # ============================================================
            # 代码
            # ============================================================
            import networkx as nx
            import json
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(model="gpt-4o-mini")

            class KnowledgeGraphRAG:
                def __init__(self, vectorstore, llm=llm):
                    self.vectorstore = vectorstore
                    self.llm = llm
                    self.graph = nx.Graph()

                def build_graph(self, documents):
                    """从文档中提取实体和关系构建知识图谱"""
                    for doc in documents:
                        prompt = f"""从以下文本中提取实体和关系,以 JSON 格式输出。

                        文本:{doc.page_content[:1500]}

                        格式:{{
                           "entities": ["实体1", "实体2", ...],
                           "relations": [
                              {{"source": "实体1", "target": "实体2", "relation": "关系描述"}},
                             ...
                            ]
                        }}

                        注意:只提取确定存在的实体和关系。"""
                        response = self.llm.invoke(prompt)
                        try:
                            data = json.loads(response.content)
                            for entity in data["entities"]:
                                self.graph.add_node(entity)
                            for rel in data["relations"]:
                                self.graph.add_edge(
                                    rel["source"],
                                    rel["target"],
                                    relation=rel["relation"]
                                )
                        except:
                            continue

                def retrieve(self, query, k=3):
                    """向量检索 + 图检索融合"""
                    # 1. 向量检索
                    vec_results = self.vectorstore.similarity_search(query, k=k)

                    # 2. 从 query 中提取实体
                    prompt = f"从查询中提取关键实体(逗号分隔):{query}"
                    entities = self.llm.invoke(prompt).content.split(",")
                    entities = [e.strip() for e in entities]

                    # 3. 图检索:找到相关实体的一跳邻居
                    graph_neighbors = set()
                    for e in entities:
                        if e in self.graph:
                            neighbors = list(self.graph.neighbors(e))
                            graph_neighbors.update(neighbors)

                    # 4. 将图谱信息整合到向量检索结果中
                    if graph_neighbors:
                        graph_context = f"关联实体:{', '.join(graph_neighbors)}"
                        vec_results[0].page_content = graph_context + "\n" + vec_results[0].page_content

                    return vec_results



            # ------------------------------------------------------------ 


        # 📂 14. Hierarchical Index(层次化索引)


            # ■ 核心思想

            # 先建一个"目录级"摘要索引,再建"内容级"详细索引。 检索时先在摘要级别定位到文档,再在内容级精确定位 chunk。减少搜索范围,加速大语料库检索。

            # ■ 结构


            # ============================================================
            # 代码
            # ============================================================
            # 一级索引(摘要/标题)
            #  ├── 文档 A 摘要 → 指向 chunks A1, A2, A3...
            #  ├── 文档 B 摘要 → 指向 chunks B1, B2, B3...
            #  └── 文档 C 摘要 → 指向 chunks C1, C2, C3...

            # 二级索引(详细内容)
            #  ├── chunk A1 "关于..."
            #  ├── chunk A2 "关于..."
            #  └── ...


            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            class HierarchicalRAG:
                def __init__(self, summary_store, detail_store):
                    self.summary_store = summary_store  # 摘要向量库
                    self.detail_store = detail_store    # 详细内容向量库

                def add_document(self, doc_id, title, summary, chunks):
                    """添加文档:同时建摘要索引和详细索引"""
                    # 存摘要(含 doc_id)
                    self.summary_store.add_texts(
                        [summary],
                        metadatas=[{"doc_id": doc_id, "title": title, "type": "summary"}]
                    )
                    # 存详细 chunks(每个 chunk 都关联 doc_id)
                    for chunk in chunks:
                        self.detail_store.add_texts(
                            [chunk],
                            metadatas=[{"doc_id": doc_id, "title": title, "type": "detail"}]
                        )

                def retrieve(self, query, top_k=3):
                    """两步检索(水哥修正版)"""
                    # 第一步:从摘要索引找到相关文档
                    summary_results = self.summary_store.similarity_search(query, k=2)
                    target_docs = [r.metadata["doc_id"] for r in summary_results]

                    # 第二步:只在目标文档的详细内容中检索
                    # 利用摘要结果缩小范围,而不是全量搜再过滤
                    filtered = self.detail_store.similarity_search(
                        query,
                        k=top_k,
                        filter={"doc_id": {"$in": target_docs}}  # 只搜摘要命中文档的chunks Chroma中  先做filter 后做query
                    )
                    return filtered



            # ------------------------------------------------------------


        # 🏗️ 15. HyDE(假设性文档嵌入)


            # ■ 核心思想

            # 拿到 query 后不直接检索,先让 LLM "假设" 一篇能回答这个问题的文档(假想文档),然后用这篇假想文档的 embedding 去检索真实文档。 
            # 因为假想文档的语义空间更接近真实答案,能突破 query 和 answer 之间的"语义鸿沟"。

            # ■ 原理


            # ============================================================
            # 代码
            # ============================================================
            # Query: "LoRA 和全参微调谁更好?"
            #     ↓  LLM 生成假想文档
            # "LoRA 是一种参数高效微调方法,它通过低秩分解..."
            #     ↓  用假想文档的 embedding 检索
            # [真实文档 1] [真实文档 2] [真实文档 3]  ← 更精准


            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(model="gpt-4o-mini")

            def hyde_retrieve(query, retriever, llm=llm):
                """HyDE 检索:先生成假想文档再检索"""
                # 1. 根据 query 生成假想文档
                prompt = f"""请写一段简短的技术文档,内容围绕以下问题展开。
                # 要求:内容具体、有细节、像是在真实资料中会看到的内容。

                # 问题:{query}

                # 技术文档:"""
                hypothetical_doc = llm.invoke(prompt).content

                print(f"[HyDE] 假想文档片段:{hypothetical_doc[:150]}...")

                # 2. 用假想文档做检索
                results = retriever.invoke(hypothetical_doc, k=3)

                return results

            # 使用
            query = "QLoRA 需要多少显存?"
            results = hyde_retrieve(query, retriever)



            # ------------------------------------------------------------


        # 🔀 16. Hybrid Search(混合检索)


            # ■ 核心思想

            # 别把鸡蛋放一个篮子里。 向量检索(语义) + 关键词检索(BM25 精确匹配)一起上,结果融合。语义检索擅长同义词和泛化,关键词擅长专有名词和精确匹配。

            # ■ 原理


            # ============================================================
            # 代码
            # ============================================================
            # 向量检索结果:[docA: 0.85, docB: 0.72, docC: 0.61]
            # BM25 检索结果:[docB: 0.90, docD: 0.78, docA: 0.65]

            # 融合(RRF 或加权)→ [docB, docA, docD, docC]


            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            from rank_bm25 import BM25Okapi
            import numpy as np

            class HybridRetriever:
                def __init__(self, vectorstore, documents):
                    self.vectorstore = vectorstore
                    self.documents = documents
                    # 准备 BM25
                    tokenized = [doc.page_content.split() for doc in documents]
                    self.bm25 = BM25Okapi(tokenized)

                def retrieve(self, query, k=3, alpha=0.5):
                    """混合检索,alpha 控制语义和关键词的权重"""
                    # 1. 向量检索
                    vec_results = self.vectorstore.similarity_search_with_score(query, k=k * 2)
                    vec_scores = {doc.page_content: score for doc, score in vec_results}
                    vec_max = max(vec_scores.values()) if vec_scores else 1

                    # 2. BM25 检索
                    tokenized_query = query.split()
                    bm25_scores = self.bm25.get_scores(tokenized_query)
                    bm25_norm = bm25_scores / (max(bm25_scores) if max(bm25_scores) > 0 else 1)

                    # 3. 融合
                    fusion_scores = {}
                    for i, doc in enumerate(self.documents):
                        vec = vec_scores.get(doc.page_content, 0) / vec_max
                        bm25 = bm25_norm[i]
                        fusion_scores[doc.page_content] = alpha * vec + (1 - alpha) * bm25

                    # 4. 排序
                    ranked = sorted(fusion_scores.items(), key=lambda x: x[1], reverse=True)
                    top_chunks = [content for content, _ in ranked[:k]]

                    # 映射回 Document 对象
                    content_to_doc = {doc.page_content: doc for doc in self.documents}
                    return [content_to_doc[c] for c in top_chunks]

            # 使用
            hybrid = HybridRetriever(vectorstore, chunks)
            results = hybrid.retrieve("LoRA rank 设置", alpha=0.6)


            # ■ RRF(Reciprocal Rank Fusion)-- 更好的融合方式


            # ============================================================
            # 代码
            # ============================================================
            def rrf_fusion(vec_results, bm25_results, k=60):
                """RRF 融合排序"""
                score_map = {}
                for rank, doc in enumerate(vec_results):
                    score_map[doc.page_content] = 1 / (k + rank + 1)
                for rank, doc in enumerate(bm25_results):
                    content = doc.page_content
                    score_map[content] = score_map.get(content, 0) + 1 / (k + len(vec_results) + rank + 1)

                ranked = sorted(score_map.items(), key=lambda x: x[1], reverse=True)
                return [content for content, _ in ranked]



            # ------------------------------------------------------------


        # 🩺 17. CRAG(Corrective RAG,纠错自愈)


            # ■ 核心思想

            # 检索结果也不是完全可信的。 CRAG 在生成回答之前,先对检索结果做一个置信度评估:

            # - 高置信度 → 直接生成
            # - 低置信度 → 尝试修正检索(重写 query、换检索源)
            # - 无相关信息 → 告诉用户"没找到"而不是硬编

            # ■ 工作流程


            # ============================================================
            # 代码
            # ============================================================
            # Query → 检索 → 置信度评估
            #               ├── 高 [0.8, 1.0] → 生成回答
            #               ├── 中 [0.5, 0.8) → 知识修正(去除噪声、补充检索)
            #               └── 低 [0.0, 0.5) → 重写 query 或回退到模型自身知识
            #                                               ↓
            #                                   LLM 生成最终回答


            # ■ 代码示例


            # ============================================================
            # 代码
            # ============================================================
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(model="gpt-4o-mini")

            class CorrectiveRAG:
                def __init__(self, retriever, llm=llm):
                    self.retriever = retriever
                    self.llm = llm

                def _evaluate_confidence(self, query, docs):
                    """评估检索结果的相关性置信度"""
                    if not docs:
                        return 0.0

                    # 用 LLM 打分
                    context = "\n\n".join([d.page_content[:200] for d in docs])
                    prompt = f"""评估以下检索结果对问题的相关性,给出 0-1 的置信度分数。

                    问题:{query}
                    检索结果:{context}

                    只输出数字(如 0.85):"""
                    score = float(self.llm.invoke(prompt).content.strip())
                    return score

                def _correct_knowledge(self, query, docs):
                    """修正知识:去除噪声,补充检索"""
                    # 让 LLM 判断每段内容是否相关
                    corrections = []
                    for doc in docs:
                        prompt = f"""以下内容是否与问题相关?只回答"相关"或"不相关"。

                    问题:{query}
                    内容:{doc.page_content[:300]}"""
                    verdict = self.llm.invoke(prompt).content.strip()

                    if "相关" in verdict:
                        corrections.append(doc)
                    else:
                        # 不相关的 chunk,尝试从中提取有用信息
                        extract_prompt = f"""从以下内容中提取可能与"{query}"相关的信息。
                        如果完全没有相关信息,输出"无相关信息"。

                        内容:{doc.page_content[:500]}"""

                        extracted = self.llm.invoke(extract_prompt).content.strip()

                        if extracted != "无相关信息":
                            doc.page_content = extracted
                            corrections.append(doc)

                    # 如果修正后信息太少,补充检索
                    if len(corrections) < 2:
                        new_docs = self.retriever.invoke(query, k=2)
                        corrections.extend(new_docs)

                    return corrections

                def ask(self, query):
                    """CRAG 主流程"""
                    # 1. 检索
                    docs = self.retriever.invoke(query, k=5)
                    if not docs:
                        return "没有找到相关信息。"

                    # 2. 评估置信度
                    confidence = self._evaluate_confidence(query, docs)

                    if confidence >= 0.8:
                        # 高置信度 → 直接生成
                        context = "\n\n".join([d.page_content for d in docs])
                        prompt = f"基于以下内容回答问题:\n\n{context}\n\n问题:{query}"
                        return self.llm.invoke(prompt).content

                    elif confidence >= 0.5:
                        # 中等置信度 → 知识修正
                        corrected_docs = self._correct_knowledge(query, docs)
                        context = "\n\n".join([d.page_content for d in corrected_docs])
                        prompt = f"基于以下修正后的内容回答问题:\n\n{context}\n\n问题:{query}"
                        return self.llm.invoke(prompt).content

                    else:
                        # 低置信度 → 重写 query + 重新检索
                        rewrite_prompt = f"""原始查询没有检索到相关信息。请改写查询,使其更清晰更容易检索。

                        原始查询:{query}
                        改写版本(只输出,不解释):"""

                        new_query = self.llm.invoke(rewrite_prompt).content.strip()

                        new_docs = self.retriever.invoke(new_query, k=5)

                        if new_docs:
                            context = "\n\n".join([d.page_content for d in new_docs])
                            prompt = f"基于以下内容回答问题:\n\n{context}\n\n问题:{query}"
                            return self.llm.invoke(prompt).content
                        else:
                            # 真没找到,诚实告知
                            return f"抱歉,没有找到关于「{query}」的相关信息。"



            # ------------------------------------------------------------


        # ## 总结对比

            # | 方案 | 核心思路 | 效果提升 | 实现成本 | 推荐场景 |
            # | **1. Simple RAG** | 字符硬切 | ⭐ | 极低 | Demo 快速验证 |
            # | **2. Semantic Chunking** | 语义边界切分 | ⭐⭐ | 低 | 内容规范但不固定 |
            # | **3. Small-to-Big** | 小块检索大块回答 | ⭐⭐⭐ | 低 | 需要精确定位+完整上下文 |
            # | **4. Context-Enriched** | chunk 加前缀元信息 | ⭐⭐ | 低 | 多文档混合检索 |
            # | **5. Chunk-Header** | 为 chunk 加标题 | ⭐⭐ | 中 | 长文档/需要快速预览 |
            # | **6. Doc-Augmentation** | 预处理增强文档 | ⭐⭐⭐ | 中 | 数据质量不佳 |
            # | **7. Query-Transformation** | 改写查询 | ⭐⭐⭐ | 低 | 用户 query 质量低 |
            # | **8. Rerank** | 粗筛+精排两步走 | ⭐⭐⭐⭐ | 中 | 精度要求高 |
            # | **9. Sentence Window** | 带上下文的片段检索 | ⭐⭐⭐ | 低 | 句子级搜索 |
            # | **10. Context Compression** | 检索结果压缩去噪 | ⭐⭐⭐ | 中 | 上下文窗口有限 |
            # | **11. Feedback-Loop** | 利用用户反馈优化 | ⭐⭐⭐⭐ | 高 | 生 产环境持续优化 |
            # | **12. Self-RAG** | 内省反思 | ⭐⭐⭐⭐⭐ | 高 | 结果可靠性要求极高 |
            # | **13. KG RAG** | 知识图谱+实体关系 | ⭐⭐⭐⭐⭐ | 高 | 多跳推理/关系复杂 |
            # | **14. Hierarchical Index** | 两级索引 | ⭐⭐⭐ | 高 | 大规模语料库 |
            # | **15. HyDE** | 假想文档做检索 | ⭐⭐⭐ | 低 | query短、语义不直接 |
            # | **16. Hybrid Search** | 向量+关键词混合 | ⭐⭐⭐⭐ | 低 | 通用场景全能选手 |
            # | **17. CRAG** | 纠错自愈 | ⭐⭐⭐⭐⭐ | 高 | 对幻觉零容忍 |


            # ------------------------------------------------------------


            # ============================================================
            # 学习路线建议
            # ============================================================

            # 新手入门 → 1 → 2 → 7 → 8 → 16
            # 进阶提升 → 3 → 9 → 10 → 15
            # 高阶实战 → 11 → 12 → 17 → 13 → 14

            # 先别贪多,从最常见的 Simple → Rerank → Hybrid Search 这条线走起
            # 就够应付大部分面试和实战需求了。

    #####################################################################################


    """
    unstructrued安装
    1. 包含本地推理能力(支持PDF/图片OCR等)
    pip install "unstructured[local-inference]"
    2. 支持所有文档类型(不含本地推理,需依赖外部API)
    pip install unstructured[all-docs]
    """

    # UnstructuredIO核心组件
    from mcp import StdioServerParameters
    from unstructured.partition.auto import partition
    from typing import List
    from unstructured.documents.elements import Element

    element: List[Element] = partition(filename="rag.md", strategy="auto")

    print(element[0].category) # 元素类型
    print(element[0].metadata.__dict__) # 元素的元数据

    """
    partition通用参数:
        encoding: 指定输入文本/文档读取时使用的字符编码。对于非UTF-8文档非常有用。
        include_page_breaks: 如果设置为True,当文档支持"分页"时,输出中包含PageBreak元素,以标识不同页的边界
        strategy: 指定解析策略,尤其对PDF/Image文档,控制"快速vs 高保真 vs OCR"方式
        ocr_languages/languages:当文档含有图像文字或扫描件时,可指定OCR语言包("eng", "deu")
        skip_infer_table_types: 可指定路过表格类型推断时的文档类型,减少表格识别的错误
        fields_include: 控制输出JSON中包含哪些字段。可用于减小输出大小或过滤敏感字段['element_id', 'text', 'type']
        metadata_include|metadata_exclude: 用于控制在输出元素的metadata字段中,保留哪些键或者排除哪些键,默认全部输出
        content_type: 在使用URL或文件流时,指定MIME类型提示,提高文件类型识别准确性
        starting_page_number: 当处理文档是某个较大文档的一部分时,可以指定起始页号,用于metadata
    """

    from llama_index.core import SimpleDirectoryReader
    from llama_parse import LlamaParse

    # 如果文档结构复杂,优先使用LlamaParse
    parser = LlamaParse(api_key="you key")
    documents = parser.load_data('smple.pdf')

    # 或者更简单的读取器
    documents = SimpleDirectoryReader(input_files=["RAG评优.md"]).load_data()


    # 🚀 最佳加载方案
        from llama_index.readers.file.unstructured import UnstructuredReader
        from unstructured.partition.auto import partition
        from llama_index.core import Document
        from pathlib import Path

        def smart_load(file_path):
            """
            智能文档加载器:根据文件类型选择最佳解析策略

            Args:
                file_path: 文件路径

            Returns:
                解析后的Document对象列表
            """
            file_path = Path(file_path)
            file_ext = file_path.suffix.lower()

            # 定义复杂文件类型(需要高精度解析)
            complex_types = {
                '.pdf',     # PDF文档(可能包含表格、图像、复杂布局)
                '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff',  # 图片文件(需要OCR)
                '.docx', '.doc',  # Word文档(可能包含复杂格式)
                '.pptx', '.ppt',  # PowerPoint(复杂布局)
                '.xlsx', '.xls'   # Excel(表格结构)
            }

            # 简单文件类型(可以用Reader直接处理)
            simple_types = {
                '.txt', '.md', '.csv', '.html', '.xml', '.json'
            }

            if file_ext in complex_types:
                # 复杂文件使用底层解析,获得更好的结构识别
                print(f"检测到复杂文件类型 {file_ext},使用partition高精度解析")
                try:
                    elements = partition(
                        filename=str(file_path),
                        # 使用hi_res模式进行高精度解析
                        strategy="hi_res",
                        # 支持中文、英文
                        languages=["eng", "chi_sim"],
                        # 推断表格结构
                        infer_table_structure=True
                    )
                    # 将解析元素转换为Document对象
                    return [Document(text=e.text, metadata={
                        "source": str(file_path),
                        "element_type": type(e).__name__,
                        "file_type": file_ext
                    }) for e in elements if e.text.strip()]  # 过滤空文本
                except Exception as e:
                    print(f"高精度解析失败,回退到Reader: {e}")
                    # 回退到Reader
                    reader = UnstructuredReader()
                    return reader.load_data(file=file_path)

            else:
                # 简单文件或未知类型优先使用Reader
                print(f"检测到简单文件类型 {file_ext},使用Reader解析")
                try:
                    # 直接使用Reader进行简单解析
                    reader = UnstructuredReader()
                    # 加载解析后的文档,返回 Document 对象列表
                    docs = reader.load_data(file=file_path)
                    return docs
                except Exception as e:
                    print(f"Reader解析失败,回退到partition: {e}")
                    # 回退到底层解析
                    elements = partition(filename=str(file_path), strategy="auto")
                    return [Document(text=e.text, metadata={"source": str(file_path)}) for e in elements]


    # 🚂 基础索引案例实现
        #! pip install llama-index-embeddings-openai llama-index-llms-openai

        from llama_index.core import VectorStoreIndex
        from llama_index.embeddings.openai import OpenAIEmbedding
        from llama_index.llms.openai import OpenAI          # 导入OpenAI LLM类
        from llama_index.core.settings import Settings
        from dotenv import load_dotenv
        # 加载环境变量
        load_dotenv()

        # 设置为全局默认Embedding模型
        Settings.embed_model = OpenAIEmbedding(
            model="text-embedding-3-small",
            api_key=os.getenv("OPENAI_API_KEY"),
            api_base=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        )

        # 设置为全局默认 LLM
        Settings.llm = OpenAI(
            model="gpt-3.5-turbo",
            api_key=os.getenv("OPENAI_API_KEY"),
            api_base=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        )

        # 解析pdf文档
        documents = smart_load("工段施工指南.pdf")
        # 构建索引
        index = VectrorStoreIndex.from_documents(documents)
        # 生成查询引擎
        query_engine = index.as_query_engine()

        # 测试提问
        response = query_engine.query("A标段水泥标号?")
        print(response)



    # 🚀 Text Splitters 文本分割器

        # 🍊 TokenTextSplitter token切分器
            # TokenTextSplitter按照token长度进行切分,适用于需要精确控制token数量的场景,特别是在严格token限制的嵌入模型或语言模型中使用。

            from llaman_index.core.node_parser import TokenTextSplitter

            # 初始化TokenTextSplitter
            token_splitter = TokenTextSplitter(
                chunk_size=512,     # 每chunk 目标token数(可调)
                chunk_overlap=64,   # 重叠token数(可调)
                separator=" "       # 分隔符(一般用空格)
            )

            # 测试文本
            text = """我很荣幸加入这个团队, 这里一般是很长的文本"""

            nodes_from_tokens = token_splitter.split_text(text)

        # 🍊 SentenceSplitter句子切分器
            """
            参数
                chunk_size int 每个文本的目标最大Token数 默认值1024
                chunk_overlap int 相邻文本块之间重叠的token数 默认值200
                separator: str 用于分割的主要分隔符 默认为 " "
                paragraph_separator str 用于识别段落的分隔符 默认为"\n\n\n"
            """

            from llama_index.core.node_parser import SentenceSplitter

            sentence_splitter = SentenceSplitter(
                chunk_size=512,
                chunk_overlap=64
            )

        # 🍊 CodeSplitter代码切分器

            from llama_index.core.node_parser import CodeSplitter
            from llama_index.core.schema import Document

            code_splitter = CodeSplitter(
                language="python",    # 指定编程语言
                chunk_lines=10,       # 每块大约行数
                chunk_lines_overlap=2, # 块之间重叠行数
                max_chars=600        # 每块最大字符数
            )

            nodes_from_tokens = token_splitter.split_text(text)

    # 🚀 File-Based Node Parser 文本型节点切分器

        # 🍎 MarkdownNodeParser markdown切分器
            from llama_index.core.node_parser import MarkdownNodeParser
            from llama_index.core.readers import SimpleDirectoryReader

            markdown_docs = SimpleDirectoryReader(input_files=["扩展调用.md"]).loda_data()

            # 创建Markdown解析器
            parser = MarkdownNodeParser()

            nodes = parser.get_nodes_from_documents(markdown_docs)

            for i, node in enumerate(nodes):
                print(f"节点 {i+1} (字符数: {len(node.text)}):")
                print("-" * 30)
                print(node.text)
                print("\n" + "="*50 + "\n")

        # 🍎 JSONNodeParser Json切分器
            from llama_index.core.node_parser import JSONNodeParser
            from llama_index.core.schema import Document

            json = """
            {
                "id_": "0a1eee9a-635a-4391-8b74-75bf3c648f0e",
                "embedding": null,
                "metadata": {
                    "document_id": "FULadzkWmovlfkxSgLPcE4oWnPf"
                },
                "excluded_embed_metadata_keys": [],
                "excluded_llm_metadata_keys": [],
                "mimetype": "text/plain"
            }
            """

            # 创建JSON解析器
            parser = JSONNodeParser()
            json_docs = [Document(text=json)]
            # 从JSON文件创建节点
            nodes = parser.get_nodes_from_documents(json_docs)

            # 显示切分结果
            for i, node in enumerate(nodes):
                print(f"节点 {i+1} (字符数: {len(node.text)}):")
                print("-" * 30)
                print(node.text)
                print("\n" + "="*50 + "\n")

        # 🍎 SemanticSplitterNodeParser语义切分器

            from llama_index.core import Document
            from llama_index.embeddings.openai import OpenAIEmbedding

            import os
            from llama_index.core.settings import Settings
            from dotenv import load_dotenv
            # 加载环境变量
            load_dotenv()

            # 设置为全局默认Embedding模型
            Settings.embed_model = OpenAIEmbedding(
                model="text-embedding-3-small",
                api_key=os.getenv("OPENAI_API_KEY"),
                api_base=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
            )


            from llama_index.core.node_parser import SemanticSplitterNodeParser
            from typing import List

            # 1) 中文拆句器(更鲁棒)
            def split_chinese_sentences(text: str) -> List[str]:
                """
                将中文文本按常见句末标点拆分,尽量保留标点并去除多余空白。
                处理省略号、连续标点和英文句点等。
                """
                if not text:
                    return []
                # 将长省略号统一处理
                text = text.replace("......", "...")
                # 在常见句末标点后断句(保留标点)
                pieces = re.split(r'(?<=[。!?...\?\!\.])\s*', text)
                # 清理空白与空串
                sentences = [p.strip() for p in pieces if p and p.strip()]
                return sentences

            # SemanticChunker 会使用嵌入相似度来决定是否将句子合并到同一 chunk 中。
            splitter = SemanticSplitterNodeParser(
                buffer_size=2,                        # buffer_size 用于把多少句子为一组做相似度计算。
                breakpoint_percentile_threshold=80,   # 相似度阈值,低于该阈值的相似度会被视为断点。
                embed_model=Settings.embed_model,     # embed_model 表示用于计算嵌入的模型。
                sentence_splitter=split_chinese_sentences, # 自定义中文拆句器
                include_metadata=True,                # 是否包含 metadata
                include_prev_next_rel=True,           # 是否包含上一句与下一句的关系
            )

            long_chinese_text = (
                "本季度公司财务表现良好,营收增长15%,净利润同比提升10%。"
                "在产品方面,我们完成了新一代搜索引擎的内测,搜索精度和召回率都有明显提升。"
                "同时,基础设施团队迁移到新的集群架构,缩短了部署时间并降低了成本。"
                "关于市场推广,最近在北京与上海分别举办了两场线下用户交流会,"
                "收集到了大量用户反馈,尤其是对移动端体验的改进建议。"
                "另一方面,我们正在探索与第三方数据提供商的合作,"
                "以期在广告定向和推荐系统上获得更准确的信号。"
                "此外,法律合规团队提醒需关注新的隐私合规要求,"
                "包括数据最小化和用户可解释性方面的合规文档准备。"
                "最后,团队在招聘方面也有所动作,已开放多个后端与算法岗位。"
            )

            # 创建Document
            doc = Document(text=long_chinese_text, metadata={"doc_id": "示例文档1"})

            nodes_from_semantic = splitter.get_nodes_from_documents([doc])

            print("=== 切割后(chunks) ===")
            for idx, node in enumerate(nodes_from_semantic):
                print(f"--- chunk {idx} ---")
                # node.text: chunk 的主文本(通常是若干句子合并)
                print("chunk.text:", node.text)
                # 如果 include_metadata=True,会有一些 metadata(例如原始句子索引、chunk_type等)
                print("metadata keys:", list(node.metadata.keys()))
                # 如果有 prev/next 关系或 chunk 索引,可一并查看
                # 例如:node.metadata.get('chunk_index'), node.metadata.get('chunk_type')
                print("metadata (sample):", {k: node.metadata.get(k) for k in ['chunk_index','chunk_type'] if k in node.metadata})
                print()

        # 🍎 SentenceWindowNodeParser 句子窗口切分器
            from llama_index.core.node_parser import SentenceWindowNodeParser

            # 使用一个简短的文本进行测试
            text = "I love programming. Python is my most favorite language. I love LLMs. I love LlamaIndex."

            node_parser = SentenceWindowNodeParser.from_defaults(
                # how many sentences on either side to capture
                window_size=1,
                # the metadata key that holds the window of surrounding sentences
                window_metadata_key="window",
                # the metadata key that holds the original sentence
                original_text_metadata_key="original_sentence",
                include_metadata=True,
                #sentence_splitter=custom_splitter  # 传入自定义的分割器
            )

            nodes = node_parser.get_nodes_from_documents([Document(text=text)])

            # 打印所有节点的文本
            print("所有节点文本:")
            for i, node in enumerate(nodes):
                print(f"Node {i}: {node.text}")

            # 查看第二个节点周围的窗口文本
            print("\n第二个节点周围的窗口文本:")
            print(nodes[1].metadata["window"])
            print("=" * 80)
            print(nodes[1].relationships)


            """
            输出:
                所有节点文本:
                Node 0: I love programming.
                Node 1: Python is my most favorite language.
                Node 2: I love LLMs.
                Node 3: I love LlamaIndex.

                第二个节点周围的窗口文本:
                I love programming.  Python is my most favorite language.  I love LLMs.
            """

        # 🍎 HierarchicalNodeParser 结构切分器
            from llama_index.core.node_parser.relational.hierarchical import HierarchicalNodeParser

            node_parser = HierarchicalNodeParser.from_defaults(
                chunk_sizes=[300, 120],   # 例:300字符/120字符级别
                chunk_overlap=30,         # 重叠区域大小
                include_metadata=True,      # 是否包含metadata
                include_prev_next_rel=True  # 是否包含前后关系
            )

            nodes = node_parser.get_nodes_from_documents([Document(text=text, metadata={"doc_id":"示例文档"})])



            import json
            from llama_index.core.schema import Document

            llamaindex_documents = []

            for chunk in chunked_elements:
                # 提取metadata并清理不需要的字段
                metadata = chunk.metadata.to_dict()

                # 增强metadata: 添加元素类型信息
                metadata['element_type'] = type(chunk).__name__

                # 如果有原始元素,可以提取更多信息
                if hasattr(chunk.metadata, 'orig_elements') and chunk.metadata.orig_elements:
                    # 提取所有原始元素的类型
                    metadata['orig_element_types'] = [type(e).__name__ for e in chunk.metadata.orig_elements]
                    # 标记是否包含Title
                    metadata['contains_title'] = any(
                        type(e).__name__ == 'Title' for e in chunk.metadata.orig_elements
                    )

                # 移除一些序列化时可能有问题的字段
                metadata.pop('languages', None)
                metadata.pop('orig_elements', None)  # 太大,不适合存储在向量数据库

                # 创建Document对象
                doc = Document(
                    text=chunk.text,
                    metadata=metadata,
                )
                llamaindex_documents.append(doc)


            for i, doc in enumerate(llamaindex_documents[:3]):
                print(f"\n--- Document {i+1} ---")
                print(f"文本长度: {len(doc.text)} 字符")
                print(f"文本预览: {doc.text[:80]}...")
                print(f"Metadata keys: {list(doc.metadata.keys())}")
                print(f"Metadata: {json.dumps(doc.metadata, ensure_ascii=False, indent=2)}")


    # 🚀 Unstructured的chunk_by_title
        """
        核心思想: 利用Title元素作为分段标志,将Title与其后的内容组合成语义完整的chunk

        * 优势:
           - 保留文档结构边界
           - 自动合并小段落
           - 保留元数据层级信息
           - 避免跨章节混合
        """

        # 导入unstructured的chunk_by_title切分方法
        from unstructured.chunking.title import chunk_by_title

        # 文档切分
        chunked_elements = chunk_by_title(
            elements,                       # 读取的元素列表
            max_characters=800,             # 每个chunk的最大字符数
            combine_text_under_n_chars=150, # 小于该字符数的文本块会合并
        )

    # 🚀 HierarchicalNodeParser 结合 SemanticSplitterNodeParser语义切分
        """
        核心思想: 创建多层级的chunk结构,对长文本再进一步使用SemanticSplitterNodeParser或其他切分器进行切分

        * 优势:
            - 提供多粒度检索
            - 自动保留父子关系
            - 适合长文档
        """
        from llama_index.readers.file.unstructured import UnstructuredReader
        from unstructured.partition.auto import partition
        from llama_index.core import Document
        from pathlib import Path

        def smart_load(file_path):
            """
            智能文档加载器:根据文件类型选择最佳解析策略

            Args:
                file_path: 文件路径

            Returns:
                解析后的Document对象列表
            """
            file_path = Path(file_path)
            file_ext = file_path.suffix.lower()

            # 定义复杂文件类型(需要高精度解析)
            complex_types = {
                '.pdf',     # PDF文档(可能包含表格、图像、复杂布局)
                '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff',  # 图片文件(需要OCR)
                '.docx', '.doc',  # Word文档(可能包含复杂格式)
                '.pptx', '.ppt',  # PowerPoint(复杂布局)
                '.xlsx', '.xls'   # Excel(表格结构)
            }

            # 简单文件类型(可以用Reader直接处理)
            simple_types = {
                '.txt', '.md', '.csv', '.html', '.xml', '.json'
            }

            if file_ext in complex_types:
                # 复杂文件使用底层解析,获得更好的结构识别
                print(f"检测到复杂文件类型 {file_ext},使用partition高精度解析")
                try:
                    elements = partition(
                        filename=str(file_path),
                        # 使用hi_res模式进行高精度解析
                        strategy="hi_res",
                        # 支持中文、英文
                        languages=["eng", "chi_sim"],
                        # 推断表格结构
                        infer_table_structure=True
                    )
                    # 将解析元素转换为Document对象
                    return [Document(text=e.text, metadata={
                        "source": str(file_path),
                        "element_type": type(e).__name__,
                        "file_type": file_ext
                    }) for e in elements if e.text.strip()]  # 过滤空文本
                except Exception as e:
                    print(f"高精度解析失败,回退到Reader: {e}")
                    # 回退到Reader
                    reader = UnstructuredReader()
                    return reader.load_data(file=file_path)

            else:
                # 简单文件或未知类型优先使用Reader
                print(f"检测到简单文件类型 {file_ext},使用Reader解析")
                try:
                    # 直接使用Reader进行简单解析
                    reader = UnstructuredReader()
                    # 加载解析后的文档,返回 Document 对象列表
                    docs = reader.load_data(file=file_path)
                    return docs
                except Exception as e:
                    print(f"Reader解析失败,回退到partition: {e}")
                    # 回退到底层解析
                    elements = partition(filename=str(file_path), strategy="auto")
                    return [Document(text=e.text, metadata={"source": str(file_path)}) for e in elements]


    from llama_index.core.node_parser import (
        SentenceSplitter,
        SemanticSplitterNodeParser,
        HierarchicalNodeParser
    )
    from llama_index.embeddings.openai import OpenAIEmbedding



    # 创建嵌入模型
    embed_model = OpenAIEmbedding(model="text-embedding-ada-002")

    # 创建层次化解析器
    hierarchical_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=[512, 256, 128]  # 父段落、子段落、孙段落
    )

    # 创建语义分割器
    semantic_splitter = SemanticSplitterNodeParser(
        buffer_size=1,                      # 用于把多少句子为一组做相似度计算。
        breakpoint_percentile_threshold=90, # 相似度阈值,低于该阈值的相似度会被视为断点。
        embed_model=Settings.embed_model             # 嵌入模型
    )

    # 创建句子分割器作为后备
    sentence_splitter = SentenceSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    # 混合策略:先使用层次化解析器,再对过大的块使用语义分割器
    def hybrid_chunking(documents):
        # 第一阶段:层次化解析
        nodes = hierarchical_parser.get_nodes_from_documents(documents)

        # 第二阶段:对过大的节点进行语义分割
        final_nodes = []
        for node in nodes:
            if len(node.text) > 500:  # 对过大的节点进行二次分割
                sub_nodes = semantic_splitter.get_nodes_from_documents([node])
                final_nodes.extend(sub_nodes)
            else:
                final_nodes.append(node)

        return final_nodes

    # 应用混合策略
    nodes = hybrid_chunking(documents)



    # 💯 评估器
        from llama_index.core.evaluation import (
            SemanticSimilarityEvaluator,
            FaithfulnessEvaluator,
            RelevancyEvaluator
        )

        def quick_evaluation_demo():
            """快速评估演示"""

            print("=== LlamaIndex文档切片质量评估器演示 ===\n")

            # 1. 配置API密钥(请替换为您的实际密钥)
            print("1. 配置API密钥...")
            if not os.getenv("OPENAI_API_KEY"):
                print("请设置环境变量 OPENAI_API_KEY")
                print("例如: export OPENAI_API_KEY='your-api-key-here'")
                return

            # 2. 初始化模型和评估器
            print("2. 初始化模型和评估器...")
            # embed_model = OpenAIEmbedding(model="text-embedding-3-large")
            # llm = OpenAI(model="gpt-4")

            # 创建语义相似度评估器,通过比较生成的答案与参考答案,两者在语义上的接近程度。(答案 vs 参考答案)
            semantic_evaluator = SemanticSimilarityEvaluator(
                embed_model=Settings.embed_model,
                similarity_threshold=0.8
            )
            # 创建忠实度评估器,检测幻觉,确保答案源于给定上下文(答案 vs 上下文)
            faithfulness_evaluator = FaithfulnessEvaluator(llm=Settings.llm)

            # 创建相关性评估器,评估答案与问题的匹配度及上下文的辅助作用(问题 vs 答案 vs 上下文)
            relevancy_evaluator = RelevancyEvaluator(llm=Settings.llm)

            # 3. 准备测试数据
            print("3. 准备测试数据...")
            sample_document = """
            人工智能(Artificial Intelligence,AI)是计算机科学的一个分支,
            它企图了解智能的实质,并生产出一种新的能以人类智能相似的方式做出反应的智能机器。

            机器学习是人工智能的一个核心研究领域,它使计算机有能力在不被明确编程的情况下进行学习。
            机器学习专注于计算机程序的开发,这些程序可以访问数据并使用它学习为自己。

            深度学习是机器学习的子集,它基于人工神经网络的表征学习方法。
            深度学习在图像、语音、文本等感知任务上取得了突破性进展。
            """

            # 切分文档
            splitter = SentenceSplitter(chunk_size=200, chunk_overlap=30)
            chunks = splitter.split_text(sample_document)

            print(f"文档已切分为 {len(chunks)} 个片段:")
            for i, chunk in enumerate(chunks):
                print(f"  片段 {i+1}: {chunk[:50]}...")

            # 4. 执行各项评估
            print("\n4. 执行质量评估...")

            # 测试查询和响应
            test_query = "什么是人工智能?"
            test_response = "人工智能是计算机科学的一个分支,研究如何让机器表现出智能行为。"
            test_reference = "人工智能是计算机科学的一个分支,企图了解智能的实质"

            # 语义相似度评估
            print("\n--- 语义相似度评估 ---")
            semantic_result = semantic_evaluator.evaluate(
                query=test_query,
                response=test_response,
                reference=test_reference,
                contexts=[chunks[0]]
            )
            print(f"相似度分数: {semantic_result.score:.3f}")
            print(f"是否通过: {semantic_result.passing}")
            print(f"反馈: {semantic_result.feedback}")

            # 忠实度评估
            print("\n--- 忠实度评估 ---")
            faithfulness_result = faithfulness_evaluator.evaluate(
                query=test_query,
                response=test_response,
                contexts=[chunks[0]]
            )
            print(f"忠实度分数: {faithfulness_result.score:.3f}")
            print(f"是否通过: {faithfulness_result.passing}")
            print(f"反馈: {faithfulness_result.feedback}")

            # 相关性评估
            print("\n--- 相关性评估 ---")
            relevancy_result = relevancy_evaluator.evaluate(
                query=test_query,
                response=test_response,
                contexts=[chunks[0]]
            )
            print(f"相关性分数: {relevancy_result.score:.3f}")
            print(f"是否通过: {relevancy_result.passing}")
            print(f"反馈: {relevancy_result.feedback}")

            # 5. 综合评估结果
            print("\n=== 评估总结 ===")
            metrics = {
                '语义相似度': semantic_result.score,
                '忠实度': faithfulness_result.score,
                '相关性': relevancy_result.score
            }

            for metric, score in metrics.items():
                status = "✓ 通过" if score >= 0.7 else "✗ 未通过"
                print(f"{metric}: {score:.3f} {status}")

            avg_score = sum(metrics.values()) / len(metrics)
            print(f"\n平均分数: {avg_score:.3f}")
            overall_status = "✓ 整体通过" if avg_score >= 0.7 else "✗ 整体未通过"
            print(f"整体评估: {overall_status}")

            return "评估完成!"


        quick_evaluation_demo()

    # 🔥 Embedding
        # ! pip install llama_index llama-index-embeddings-openai

        from llama_index.core.settings import Settings
        import os
        from llama_index.embeddings.openai import OpenAIEmbedding
        from dotenv import load_dotenv

        # 加载环境变量
        load_dotenv()

        # 设置为全局默认Embedding模型
        Settings.embed_model = OpenAIEmbedding(
            model="text-embedding-3-small",   # 模型的维度是1536
            api_key=os.getenv("OPENAI_API_KEY"),
            api_base=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
            dimensions=1536,        # 可控制返回向量的维度
            embed_batch_size=100,   # 控制批量处理文本时每个批次包含的文本数量,提高吞吐量,减少API的调用量
            timeout=60,             # 配合batch size设置合理超时
            max_retries=3           # 批量失败时的重试机制
        )

        # 将文本进行向量化
        embeddings = Settings.embed_model.get_query_embedding("hello world")
        print(len(embeddings))

    # 🚀 评估指标定义与计算逻辑
        """
        `HitRate @k`:
            前 k 条检索结果包含正确答案的查询是否命中,它只关心"有"或"没有",不关心排名位置,是否存在至少一个相关(即能用来正确回答问题)的文档

            - Hit Rate = 命中查询数 / 总查询数
            - 存在则得分为1;否则为0。
            - K值的选择:
                - Hit Rate @ 1:非常严格,要求最相关的文档必须排在第一位。这衡量了系统的"精准度"。
                - Hit Rate @ 5/10:更宽松,更侧重于衡量"召回率"。只要正确答案出现在前5或前10,就算成功。
                    这在实践中更常用,因为后续的LLM可以从多个片段中综合信息。
            - 特点:简单、快速,能宏观反映检索的可靠性。
            - 衡量"能否找到",适合召回充分性的对比


        `MRR @k`:
            正确答案首次出现位置的倒数,在前 k 条内的平均值,即平均倒数排名。它不仅关心是否检索到了相关文档,还关心相关文档的排名位置。排名越靠前,
            得分越高。

            -  MRR = (1/rank_i)之和 / 总查询数,其中rank_i为第i个查询的正确答案首次排名
            - 它比Hit Rate更精细,能反映出排序模型的质量。
            - 对于单个问题,找出排名最高的相关文档所在的位置(排名)。例如,第一个相关文档排在第2位,则其排名为2。
            - 计算这个排名的倒数。在上例中,倒数就是 1/2 = 0.5。如果没有任何相关文档,则倒数为0。
            - 对所有问题的倒数得分取平均值。
            - 强调"找得准",适合首条答案质量敏感的业务
        """

        # RetrieverEvaluator
        from llama_index.core.evaluation import RetrieverEvaluator, generate_question_context_pairs
        from llama_index.core.schema import TextNode

        # 自定义测试数据
        nodes = [
                TextNode(text="""在检索增强生成(RAG)系统中,文档切分与 Node 转换作为连接原始数据与语言模型的关键预处理环节,直接决定了系统的检索精度、生成质量及整体性能。行业实践数据表明,90% 的 RAG 效果问题源于元数据与分块策略不当,而通过优化分块策略可使检索准确率提升 30 - 50%,语义分块较固定分块的准确率优势可达 27%。这一技术环节的重要性体现在:分块过大易引入冗余噪音,增加语言模型理解负担;分块过小或切分不当则可能破坏语义连贯性,导致完整知识点被拆分;未能适配文档结构的机械分块方式还会忽视标题、列表等结构化信息,影响信息提取完整性。"""),
                TextNode(text="""LlamaIndex 作为连接自定义数据与大语言模型(LLMs)的核心框架,通过将文档(如 PDF、文本文件)分解为包含文本内容、向量嵌入和元数据的 Node 组件,构建了结构化文档管理的技术范式。其核心抽象在于将原始文档转换为语义连贯的 Node 集合,向量存储仅保留 Node 内容的嵌入向量与文本信息,这一机制简化了索引构建流程并提升了检索相关性。文档切分与 Node 转换的质量不仅影响向量检索的效率,更决定了上下文增强(Context Augmentation)这一 RAG 核心能力的实现效果。"""),
                TextNode(text="""本文聚焦文档切分与 Node 转换的技术实践,结合 LlamaIndex 框架的实现机制,系统调研分块策略设计、元数据管理及 Node 组件化等关键技术点。通过分析行业最佳实践与典型案例,旨在为 RAG 系统开发者提供可落地的优化方案,解决分块噪音、语义断裂、结构信息丢失等核心痛点,为构建高性能检索增强生成应用奠定技术基础。"""),
            ]

        def load_corpus_and_queries():
            # 示例:从文件加载语料与查询(实际实现需按企业数据格式适配)
            index = VectorStoreIndex(nodes,embed_model=Settings.embed_model)

            # 模拟用户提出的问题
            queries = ["在RAG系统中,文档切分与节点转换不当可能导致哪些具体问题?",
                       "在LlamaIndex框架中,一个Node组件通常包含哪些核心元素?",
                       "通过研究文档切分与Node转换,帮助RAG系统开发者解决哪些核心痛点?"]

            # 模拟正确答案的node_id
            qrels = ['7c4ee258-36fa-4907-afe3-a7e3e894562a',
                     '67b2fe9b-1a76-4ab2-9fb9-6b6581b1d440',
                     '26fff0e9-2ecf-40ad-af7c-779e43c75762']
            return index, queries, qrels

        index,queries,qrels = load_corpus_and_queries()

        # 构建Retriever(设置top_k=5返回前5个最相关节点)
        retriever = index.as_retriever(similarity_top_k=5)

        # 对查询进行检索
        results = retriever.retrieve("在RAG系统中,文档切分与节点转换不当可能导致哪些具体问题?")
        for i, r in enumerate(results):
            print(r.score, r.node.node_id, r.node.get_text()[:150])
            print("=" * 60)


        # 创建评估Retriever
        evaluator = RetrieverEvaluator.from_metric_names(
            metric_names=["hit_rate", "mrr"],
            retriever=retriever
        )

        # 针对查询问题评估Retriever
        res1 = evaluator.evaluate(
            "在RAG系统中,文档切分与节点转换不当可能导致哪些具体问题?",
            expected_ids = ["7c4ee258-36fa-4907-afe3-a7e3e894562a"]
        )
        print(res1)

        res2 = evaluator.evaluate(
            "在RAG系统中,文档切分与节点转换不当可能导致哪些具体问题?",
            expected_ids = ["67b2fe9b-1a76-4ab2-9fb9-6b6581b1d440"]
        )
        print(res2)

        res3 = evaluator.evaluate(
            "在RAG系统中,文档切分与节点转换不当可能导致哪些具体问题?",
            expected_ids = ["26fff0e9-2ecf-40ad-af7c-779e43c75762"]
        )
        print(res3)

        """
        输出:
            Query: 在RAG系统中,文档切分与节点转换不当可能导致哪些具体问题?
            Metrics: {'hit_rate': 1.0, 'mrr': 1.0}

            Query: 在RAG系统中,文档切分与节点转换不当可能导致哪些具体问题?
            Metrics: {'hit_rate': 1.0, 'mrr': 0.5}

            Query: 在RAG系统中,文档切分与节点转换不当可能导致哪些具体问题?
            Metrics: {'hit_rate': 1.0, 'mrr': 0.3333333333333333}
        """


        # 🍌 在实际RAG评估中的应用建议
        """
        * **结合使用**:这两个指标是互补的,而不是互斥的。一个优秀的RAG检索系统应该同时拥有高Hit Rate和高MRR。

            - 高Hit Rate + 低MRR:系统能找到答案,但经常把它们藏在后面。你需要优化排序模型/重排器。

            - 低Hit Rate + 高MRR(较少见):系统排在前面的东西质量很高,但经常完全漏掉正确答案。你需要优化召回,比如调整分块策略或使用更强大的嵌入模型。

        * **与生成指标结合**:Hit Rate和MRR是检索器指标。要全面评估RAG,还需要将它们与生成器指标结合,例如:

            - Faithfulness:答案是否基于检索到的上下文,没有胡编乱造?

            - Answer Relevance:答案是否直接回答了问题?

            - Context Relevance:检索到的上下文是否精炼且相关?
        """

    # 🔍 元数据建模与过滤
        from llama_index.core.vector_stores import ExactMatchFilter, MetadataFilters, FilterCondition
        from llama_index.core.schema import TextNode

        # 建立测试集数据
        nodes = [
                TextNode(
                    text=(
                        "HR年假政策:员工入职未满一年按入职月数按比例计算年假。"
                    ),
                    metadata={
                        "department": "HR",
                        "lang": "zh",
                        "source": "policy_hr_2024.md",
                        "section": "leave_policy",
                        "page": 1,
                        "updated_at": "2024-08-01",
                    },
                ),
                TextNode(
                    text=(
                        "年假计算口径:以自然年为周期,离职结算时按实际在岗月份折算。"
                    ),
                    metadata={
                        "department": "HR",
                        "lang": "en",
                        "source": "policy_hr_2024.md",
                        "section": "leave_policy",
                        "page": 2,
                        "updated_at": "2024-08-01",
                    },
                )
            ]

        # 构建索引
        from llama_index.core import VectorStoreIndex,
        index = VectorStoreIndex(nodes)

        # 定义过滤器
        filters = MetadataFilters(
            filters=[
                ExactMatchFilter(key="department", value="HR"),
                ExactMatchFilter(key="lang", value="zh"),
            ],
            condition=FilterCondition.AND
        )

        # 应用过滤器
        qe = index.as_query_engine(similarity_top_k=3, filters=filters)
        print(qe.query("年假政策的计算口径?"))


        # 🚀 基于内容的推荐
        retriever = index.as_retriever(similarity_top_k=10)
        similar_items = retriever.retrieve("用户偏好内容")

    # 🚂 数据入库实现方式
        documents = smart_noad("完成情况.pdf")

        # 创建 SentenceSplitter句子切分器
        from llama_index.core.text_splitter import SentenceSplitter

        # 初始化 TokenTextSplitter
        splitter = SentenceSplitter(chunk_size=512, chunk_overlap=64,separator=" ")
        nodes = splitter.get_nodes_from_documents(documents)

        # 🌰 基于内存的向量数据库实现
            from llama_index.core import VectorStoreIndex, StorageContext

            # 1. 构建 VectorStoreIndex(内存)基于documents
            index = VectorStoreIndex.from_documents(elements, text_splitter=splitter)

            # 直接基于nodes构建索引
            # index = VectorStoreIndex(nodes)

            # 2. 索引持久化
            index.storage_context.vector_store.persist("vector_store.json")

            # 3. 加载缓存过的向量索引
            ctx = StorageContext.from_defaults(persist_dir="vector_store.json")
            index = VectorStoreIndex.from_documents(documents, storage_context=ctx)

            # 4. 查询(QueryEngine 由 index.build_query_engine() 提供)
            query_engine = index.as_query_engine()
            resp = query_engine.query("请用中文总结这些文档的主要内容")
            print(resp)

            # 🌰 LlamaIndex+Chroma (持久化、可扩展)
            # ! pip install llama-index-vector-stores-chroma llama-index-vector-stores-milvus chromadb
            import chromadb
            from llama_index.vector_stores.chroma import ChromaVectorStore
            from llama_index.core import VectorStoreIndex, StorageContext
            import os

            # 1. 创建数据库目录并初始化Chroma客户端
            db_path = "./chroma_db"  # 指定数据库路径
            os.makedirs(db_path, exist_ok=True)  # 确保目录存在

            try:
                # 数据库层级持久化,构建索引后 - 数据会自动持久化
                chroma_client = chromadb.PersistentClient(path=db_path)  # 指定路径的持久化客户端
                print(f"ChromaDB客户端初始化成功,数据库路径: {db_path}")
            except Exception as e:
                print(f"ChromaDB客户端初始化失败: {e}")
                # 如果持久化客户端失败,尝试使用内存客户端
                print("尝试使用内存客户端...")
                chroma_client = chromadb.Client()

            # 2. 创建或获取集合(处理集合已存在的情况)
            collection_name = "my_collection"
            try:
                chroma_collection = chroma_client.get_or_create_collection(collection_name)
                print(f"成功创建或获取到集合: {collection_name}")
            except Exception as e:
                print(f"获取集合失败: {e}")
                # 尝试删除并重新创建
                try:
                    chroma_client.delete_collection(collection_name)
                    chroma_collection = chroma_client.create_collection(collection_name)
                    print(f"删除旧集合并重新创建: {collection_name}")
                except Exception as e2:
                    print(f"重新创建集合失败: {e2}")
                    raise e2

            # 3. 创建ChromaVectorStore实例
            vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

            # 4. 配置存储上下文
            storage_context = StorageContext.from_defaults(vector_store=vector_store)
            print("ChromaDB向量存储配置完成!")

            # 5. 构建索引并查询,基于向量相似度进行召回
            # index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)
            index = VectorStoreIndex(nodes, storage_context=storage_context)

            # 6. 持久化(Chroma 会在内部 persist)需要手动调用persist来保存数据
            vector_store.persist(persist_path=db_path)
            # 保存 index metadata(可选)
            # index.storage_context.persist(persist_dir="./index_storage")

            query_engine = index.as_query_engine()
            response = query_engine.query("请用中文总结这些文档的主要内容")
            print(f"模型回答:{response}")



        # 🚀 MetadataFilter元数据过滤器
            from llama_index.core import VectorStoreIndex, StorageContext
            from llama_index.vector_stores.chroma import ChromaVectorStore
            from llama_index.core.vector_stores import MetadataFilter, MetadataFilters, FilterCondition, FilterOperator

            import chromadb

            # 1. 加载 Chroma 向量数据库
            client = chromadb.PersistentClient(path="./chroma_db")
            collection = client.get_collection("my_collection")
            vector_store = ChromaVectorStore(chroma_collection=collection)

            storage_context = StorageContext.from_defaults(vector_store=vector_store)
            # 2. 加载文档并构建索引
            index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)

            # 3. 单个过滤:只看 element_type = Text
            filters = MetadataFilters(
                filters=[
                    MetadataFilter(key="element_type", value="Text", operator=FilterOperator.EQ),
                ],
                condition=FilterCondition.AND
            )
            # 4. 应用过滤后的查询引擎
            query_engine = index.as_query_engine(filters=filters)
            resp = query_engine.query("AI海外企业有哪些巨头巨头企业?")
            print(resp)

        # 🚀 Milvus数据库本地部署存储
            from llama_index.vector_stores.milvus import MilvusVectorStore
            from llama_index.core import  VectorStoreIndex, StorageContext

            # 1. 加载文档并构建索引
            vector_store = MilvusVectorStore(
                dim=1536,
                collection_name="milvus_collection",
                uri="http://localhost:19530",
                overwrite=True
            )
            # 2. 从向量数据库构建索引
            storage_context = StorageContext.from_defaults(vector_store=vector_store)

            # 3. 构建索引
            # index = VectorStoreIndex.from_documents(documents,  storage_context=storage_context)
            index = VectorStoreIndex(nodes,  storage_context=storage_context)

            # 4. 查询
            milvus_response = index.as_query_engine().query("请用中文总结这些文档的主要内容")
            milvus_response.response

            # 使用MetadataFilter进行过滤查询
            from llama_index.core.vector_stores import MetadataFilter, MetadataFilters, FilterOperator

            # 定义 MetadataFilter 进行过滤查询
            filters = MetadataFilters(filters=[
                MetadataFilter(key="element_type", value="Text", operator=FilterOperator.EQ)
            ])
            # 执行过滤查询
            retriever = index.as_retriever(filters=filters, similarity_top_k=5)

            # 输入检索文本
            results = retriever.retrieve("龙头公司中报业绩")

            # 打印查询结果
            for node in results:
                print(node.metadata)
                print(node.text)
                print("=" * 60)

        # 🚀 Faiss 本地高效检索,不存储文本
            # ! pip install faiss-cpu llama-index-vector-stores-faiss
            import faiss
            from llama_index.vector_stores.faiss import FaissVectorStore
            from llama_index.core import VectorStoreIndex, StorageContext

            # 1) 创建 Faiss 索引(此处为 L2 距离的 Flat Index)
            d = 1536
            faiss_index = faiss.IndexFlatL2(d)
            vector_store = FaissVectorStore(faiss_index=faiss_index)
            storage_context = StorageContext.from_defaults(vector_store=vector_store)

            # 2) 构建索引(注意:Faiss 不存储文本,文本需由 Docstore 管理)
            index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)

            # 3) 持久化向量索引到本地文件
            vector_store.persist("./faiss_index.bin")

            # 4) 查询
            query_engine = index.as_query_engine()
            response = query_engine.query("请用中文总结这些文档的主要内容")
            print(response)

        # 🚀 MongoDB Docstore + IndexStore(多索引共享节点)
            """
            * MongoDocumentStore:把文档/节点(node text、metadata)存到 MongoDB;文档仓库(docstore)。

            * MongoIndexStore:索引结构/索引元数据(index_struct、index metadata)存到 MongoDB。

            * Chroma(本地 PersistentClient)作为 vector_store:实际向量(embeddings)与向量索引/检索由 Chroma 存储并负责。

            * StorageContext.from_defaults(docstore=..., index_store=..., vector_store=...):把三者组合在一起,多个索引(SummaryIndex/VectorStoreIndex/TreeIndex)共享相同 storage_context。

            结论:你已把文档/索引元数据放在 Mongo,本地 Chroma 负责向量。这是一种常见组合(Mongo 负责结构化数据 & metadata,专用向量 DB 负责 ANN 检索)。
            """
            # #!pip install pymongo llama-index-storage-docstore-mongodb llama-index-storage-index-store-mongodb

            import os
            from llama_index.core import StorageContext, SummaryIndex, VectorStoreIndex,TreeIndex
            from llama_index.storage.docstore.mongodb import MongoDocumentStore
            from llama_index.storage.index_store.mongodb import MongoIndexStore

            # 1) 连接 MongoDB(通过 MONGO_URI)
            # MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")

            # 设置MongoDB连接参数
            MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
            MONGO_PORT = os.environ.get("MONGO_PORT", "27017")
            MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "root")
            MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "example123")
            MONGO_DATABASE = os.environ.get("MONGO_DATABASE", "my_database")

            # 构建带认证的连接字符串
            MONGO_URI = f"mongodb://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DATABASE}?authSource=admin"

            # 连接 MongoDB
            docstore = MongoDocumentStore.from_uri(uri=MONGO_URI)
            index_store = MongoIndexStore.from_uri(uri=MONGO_URI)

            # 向量存储使用Chroma
            chroma_client = chromadb.PersistentClient(path="./chroma_db")
            vector_store = ChromaVectorStore(chroma_collection=chroma_client.get_or_create_collection("docs"))
            storage_context = StorageContext.from_defaults(
                docstore=docstore,         # 文档存储
                index_store=index_store,   # 索引元数据存储
                vector_store=vector_store  # 向量存储
            )

            # 2) 构建多索引(共享同一组节点)
            summary_index = SummaryIndex(nodes, storage_context=storage_context)
            vector_index = VectorStoreIndex(nodes, storage_context=storage_context)

            # 摘要索引
            summary_index = SummaryIndex.from_documents(documents, storage_context=storage_context)

            # 向量索引
            vector_index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)

            # 树索引
            tree_index = TreeIndex.from_documents(documents, storage_context=storage_context)

            # 3) 查询
            summary_engine = summary_index.as_query_engine()
            vector_engine = vector_index.as_query_engine()
            tree_engine = tree_index.as_query_engine()

            s = summary_engine.query("请用中文总结这些文档的主要内容")
            v = vector_engine.query("请用中文总结这些文档的主要内容")
            t = tree_engine.query("请用中文总结这些文档的主要内容")

            print(s.response)
            print("=" * 60)
            print(v.response)
            print("=" * 60)
            print(t.response)

    # 🚂 向量检索工具封装

        #!pip install llama-index-tools-vector-db llama-index-vector-stores-milvus

        from llama_index.core import VectorStoreIndex
        from llama_index.core.agent import ReActAgent
        from llama_index.core.tools import QueryEngineTool
        from llama_index.core.workflow import Context
        from llama_index.vector_stores.milvus import MilvusVectorStore

        # 1. 加载已有 Milvus / Mongo 向量数据库
        milvus_vector_store = MilvusVectorStore(
            dim=1536,
            collection_name="milvus_collection",
            uri="http://localhost:19530",
            overwrite=True
        )

        # 2. 从向量数据库构建索引
        storage_context = StorageContext.from_defaults(vector_store=milvus_vector_store)
        vector_index = VectorStoreIndex(nodes, storage_context=storage_context)

        # 3. 构建查询引擎
        query_engine = vector_index.as_query_engine(similarity_top_k=4)

        # 4. 封装为向量数据库检索tool工具
        vector_tool = QueryEngineTool.from_defaults(
            query_engine=query_engine,  # 简化示例:将其封装为查询引擎工具
            name="vector_auto_retrieve",
            description="对向量数据库进行自动检索并应用元数据过滤"
        )

        # 5. 创建 Agent(ReActAgent 演示),异步执行,可以使用asyncio.run()来执行
        agent = ReActAgent(tools=[vector_tool],llm=Settings.llm)
        ctx = Context(agent)

        # 6. 调用示例
        handler = agent.run("请检索向量数据库中关于海外AI龙头企业有哪几家?", ctx=ctx)

    # 🚀 RetriverTool检索器工具
        from llama_index.core.tools import RetrieverTool
        from llama_index.core.agent import ReActAgent
        from llama_index.llms.openai import OpenAI

        # 1. 构建检索器
        retriever = vector_index.as_retriever(similarity_top_k=5)

        # 2. 封装为检索工具
        retr_tool = RetrieverTool.from_defaults(
            retriever=retriever,
            name="文档片段检索",
            description="直接检索相关文档片段"
        )

        # 3. 创建 Agent
        agent = ReActAgent(tools=[retr_tool], llm=Settings.llm, verbose=True)

        # 4. 异步运行(ReActAgent 的 run 为 async)
        response = agent.run("筛选包含 Title 的片段并返回内容")

    # 🚀 显式创建Retriver
        from llama_index.core.retrievers import VectorIndexRetriever

        # 显式创建VectorIndexRetriever以获得更多控制
        vector_retriever = VectorIndexRetriever(
            index=index,
            similarity_top_k=5,
            # filters=MetadataFilters(...) # 可选的元数据过滤
        )

        query = "B200A 芯片的存储器规格和预计何时被原始设备制造商拿到是什么?"
        retriever_nodes = vector_retriever.retrieve(query)

    # 🚀 BM25检索策略
            # !pip install rank-bm25 llama-index-retrievers-bm25

            # 关键词策略检索
            from llama_index.retrievers.bm25 import BM25Retriever
            # 1.BM25检索器
            bm25_retriever = BM25Retriever.from_defaults(
                nodes=nodes,
                similarity_top_k=5
            )
            # 2. 执行BM25检索
            query = "B200A 的存储器规格"
            results = bm25_retriever.retrieve(query)

    # 🚀 混合检索策略QueryFusionRetriever
        from llama_index.core.retrievers import QueryFusionRetriever
        # 1. 创建QueryFusionRetriever
        retriever = QueryFusionRetriever(
            retrievers=[vector_retriever, bm25_retriever],  # 集成不同的检索器
            similarity_top_k=5,                 # 最终返回的文档数量
            num_queries=1,                      # 为原始查询生成的变体数量,(默认为1,不生成变体)
            mode="reciprocal_rerank",           # 结果融合模式,'reciprocal_rerank'是常用且效果好的模式
            use_async=True,                     # 是否异步执行
            verbose=True,                       # 是否打印调试信息
            retriever_weights=[0.6,0.4]         # 检索器权重,用于加权融合
        )

        # 2. 执行检索
        query = "B200A 芯片的存储器规格和预计何时被原始设备制造商拿到是什么?"
        query_nodes = retriever.retrieve(query)

    # 🚀 本地Rerank模型
        #!pip install huggingface_hub modelscope
        # modelscope download --model BAAI/bge-reranker-base  --local_dir ./
        from llama_index.core.postprocessor import SentenceTransformerRerank
        from llama_index.core.query_engine import RetrieverQueryEngine

        # 模型本地路径
        local_model_path = "/root/autodl-tmp/bge-reranker-base"

        # 1.定义精排序器 (Reranker)
        reranker = SentenceTransformerRerank(
            model=local_model_path,
            top_n=3, # 精选出最相关的4个文档送给LLM,
        )
        # 2.构建QueryEngine
        query_engine = RetrieverQueryEngine.from_args(
            retriever=retriever,
            node_postprocessors=[reranker]
        )
        # 3. 执行查询
        query = "B200A 芯片的存储器规格和预计何时被原始设备制造商拿到是什么?"
        response = query_engine.query(query)


    # 🚂 生成查询阶段组件
    # 🚀 as_query_engine 端到端的问答引擎
        # 基础查询
        query_engine = index.as_query_engine(
            similarity_top_k=3,
            response_mode="refine",  # 对多个检索结果进行精炼
            streaming=True  # 流式输出
        )

        # 正常响应
        response = query_engine.query("B200A 芯片的存储器规格和预计何时被原始设备制造商拿到是什么?")
        print(response)

        # 流式响应处理
        # streaming_response = query_engine.query("B200A 芯片的存储器规格和预计何时被原始设备制造商拿到是什么?")
        # for token in streaming_response.response_gen:
        #     print(token, end=" ", flush=True)


        """
        **响应模式(Response Modes)**:`Response Synthesizer`支持多种响应模式,如:
          - `refine`:逐块迭代优化答案,细节丰富但调用成本高。
          - `compact`:在生成前压缩上下文,平衡成本与质量。
          - `tree_summarize`:以树状结构递归总结,适合长文档摘要。
          - `simple_summarize`:快速拼接与总结,可能丢失细节。
          - no_text - 不调用 LLM 生成答案,仅返回检索出的 source_nodes(用于检索查看或调试)。
          - accumulate - 给定若干 chunk,分别对每个 chunk 与 query 运行 LLM,结果按顺序累积(而不是合并为一个 prompt)再返回拼接字符串。
          - compact_accumulate - 类似 accumulate,但在每次对 chunk 做 prompt 时先"压缩"上下文(像 compact 模式)以减少代价。
        """

        from llama_index.core.query_engine import RetrieverQueryEngine
        from llama_index.core.retrievers import VectorIndexRetriever

        # 1. 从已有的 index 创建 retriever
        retriever = VectorIndexRetriever(
            index=index,
            similarity_top_k=3
        )
        # 2. 构造 QueryEngine
        query_engine = RetrieverQueryEngine(
            retriever=retriever,          # 传入检索器
            response_synthesizer=None,    # 可以自定义响应合成器
            node_postprocessors=None     # 可传入 reranker、过滤器
        )

        # 3. 直接查询
        response = query_engine.query("B200A 芯片的存储器规格和预计何时被原始设备制造商拿到是什么?")
        print(response)


    # 🚀 带momery记忆的对话
        from llama_index.core.memory import ChatMemoryBuffer

        # 创建对话记忆
        memory = ChatMemoryBuffer.from_defaults(token_limit=3000)

        chat_engine = index.as_chat_engine(
            chat_mode="context",  # "context", "condense_question", "react", "openai"
            system_prompt="你是一个关于LlamaIndex的问答助手。请基于提供的上下文回答问题。",  # 系统提示词
            memory=memory          # 对话记忆管理
        )
        # 多轮对话
        response1 = chat_engine.chat("文章主要讲述了哪几家海外AI巨头?")
        print(f"AI: {response1}")
        print("=" * 60)

        response2 = chat_engine.chat("这几家AI巨头都研发了哪些产品?")
        print(f"AI: {response2}")  # 能理解这是基于前一个问题的后续

        # 重置对话历史
        chat_engine.reset()



    # 🦁 一个完整的案件
        from llama_index.core import VectorStoreIndex
        from llama_index.retrievers.bm25 import BM25Retriever
        from llama_index.core.postprocessor import SentenceTransformerRerank
        from llama_index.core.retrievers import QueryFusionRetriever
        from llama_index.core.query_engine import RetrieverQueryEngine
        from llama_index.core.response_synthesizers import get_response_synthesizer

        # 1. 加载向量索引
        index = VectorStoreIndex(nodes=nodes)

        # 2. 向量检索器 (粗召回)
        vector_retriever = index.as_retriever(
            similarity_top_k=5 # 扩大召回范围,为Reranker提供充足的候选
        )
        # 3. BM25检索器 (关键词补充)
        bm25_retriever = BM25Retriever.from_defaults(
            nodes=nodes,
            similarity_top_k=5
        )
        # 4. 混合检索器 (融合结果)
        hybrid_retriever = QueryFusionRetriever(
            retrievers=[vector_retriever, bm25_retriever],
            similarity_top_k=5,         # 融合后保留的候选数量
            num_queries=1,              # 保持简单,不生成子查询
            mode="reciprocal_rerank",   # 使用RRF融合策略
            use_async=True              # 必须开启异步
        )

        from llama_index.core.postprocessor import SentenceTransformerRerank
        # 模型本地路径
        local_model_path = "/root/autodl-tmp/bge-reranker-base"
        # 5.定义精排序器 (Reranker)
        reranker = SentenceTransformerRerank(
            model=local_model_path,
            top_n=3, # 精选出最相关的4个文档送给LLM,
        )
        # 6. 创建响应合成,用大模型(LLM)根据 top-K 文档 + 用户问题,生成一个最终的回答。
        response_synthesizer = get_response_synthesizer(
            response_mode="compact",
            streaming=True
        )
        # 7.构建QueryEngine
        query_engine = RetrieverQueryEngine.from_args(
            retriever=hybrid_retriever,
            node_postprocessors=[reranker],
            response_synthesizer=response_synthesizer
        )
        # 8. 执行查询
        query = "B200A 芯片的存储器规格和预计何时被原始设备制造商拿到是什么?"
        response = query_engine.query(query)

        print("大模型回复内容:")
        print(response)
        print("=" * 60)

        # 打印最终被送入LLM的Source Nodes
        print("\n--- Final Source Nodes (after Reranking) ---")
        for node in response.source_nodes:
            print(f"Score: {node.score:.4f}, File: {node.text}")
            print("=" * 60)



    # 🚂 检索生成评估体系
    # todo


# 🎧 Agentic RAG
# ====================================================================================================================================
    
    # 🔥 6大Agentic RAG模式(从Naive RAG到智能决策,列出相关架构问题)

        # ■ 与传统Native RAG的区别
        # | Native RAG | Agentic RAG |
        # | 固定流水线:问题 → 必检索 → 增强 → 生成 | LLM自主决策:问题 → LLM判断是否检索 → 检完验质量 → 不够再检 → 生成 |
        # | 检索是硬编码步骤,每次必检 | 检索是LLM可调用的工具之一 |
        # | 不验货:查回不相关也往prompt里塞 | 验货:评估相关性、完整性、事实一致性 |
        # | 只查一次,查不到就卡死 | 可多步检索(Multi-hop)、可改写query重查 |
        # | 增强阶段只是简单拼接 | 增强阶段可做压缩、重排、过滤 |

        # ■ 一句话总结
        # Native RAG = 工人站流水线前,每个零件都走同样流程
        # Agentic RAG = 工人有判断力,该查就查、该答就答、查错了重来


        # 🧠 1️⃣ ReAct RAG(思考-行动闭环)

            # ■ 核心思想
            # LLM在每轮循环中输出 Thought → Action → Observation,自主决定是否调检索工具。
            # 没查到就再查,查到了就答--这是Agentic RAG最基础的形态。

            # ■ 核心模板(ReAct Prompt Template)

                # ============================================================
                # Answer the following questions as best you can. You have access to the following tools:
                #
                # retrieve_knowledge: 检索知识库,参数query(搜索关键词)
                #
                # Use the following format:
                #
                # Question: the input question you must answer
                # Thought: you should always think about what to do
                # Action: the action to take, should be one of [retrieve_knowledge]
                # Action Input: the input to the action
                # Observation: the result of the action
                # ... (this Thought/Action/Action Input/Observation can repeat N times)
                # Thought: I now know the final answer
                # Final Answer: the final answer to the original input question
                #
                # Question: {user_question}
                # Thought:
                # ============================================================

            # ■ 代码级核心循环

                # ============================================================
                # while True:
                #     # Step 1: LLM 输出当前思考
                #     response = llm.generate(react_prompt.format(question, context))
                #
                #     # Step 2: 解析LLM的决策
                #     if "ACTION: retrieve" in response:
                #         query = extract_query(response)
                #         docs = vectorstore.search(query)
                #         context += f"\n检索结果:{docs}"
                #         continue  # 下一轮再问LLM:查够了没?
                #
                #     elif "ACTION: answer" in response:
                #         final_answer = extract_answer(response)
                #         return final_answer
                # ============================================================

            # ■ 设计细节
            # - Thought 字段不是给LLM看的,是给开发者追踪决策链的
            # - Action 和 Action Input 分离,便于代码正则解析
            # - Observation 是系统填充的(检索结果),不是LLM生成
            # - 必须设 max_iterations(通常5轮),防止死循环
            # - LLM格式输出不稳定,需要 handle_parsing_errors

            # ■ 适用场景
            # - 通用问答 + 知识库混合场景
            # - 需要"LLM自主判断是否检索"的场景
            # - Agent快速原型


        # 🩺 2️⃣ CRAG(Corrective RAG,纠错自愈)

            # ■ 核心思想
            # 检索结果不一定都是垃圾,也不一定都是好的。
            # CRAG 先检、再判置信度,根据置信度走不同路径:

            # | 置信度 | 操作 |
            # | 高 [0.8, 1.0] | 直接基于检索结果生成回答 |
            # | 中 [0.5, 0.8) | 知识修正:去噪声、提取有用信息、补充检索 |
            # | 低 [0.0, 0.5) | 改写query重新检索,或回退到模型自身知识 |

            # ■ 置信度评估方式
            # 方案A:LLM-as-Judge(最灵活,但费钱)
                # 用LLM打分:"这段文档和问题相关吗?0-1分"
            # 方案B:专用分类模型(如GPT-as-Judge微调版)
                # 更快更便宜,但需要训练
            # 方案C:规则检查(如关键词匹配)
                # 快但死板,适合简单场景

            # ■ 伪代码流程

                # ============================================================
                # def crag_answer(question):
                #     docs = retriever.search(question, k=5)
                #     confidence = evaluate_confidence(question, docs)
                #
                #     if confidence >= 0.8:
                #         return generate(question, docs)
                #
                #     elif confidence >= 0.5:
                #         corrected = correct_knowledge(question, docs)
                #         return generate(question, corrected)
                #
                #     else:
                #         new_query = rewrite_query(question)
                #         docs = retriever.search(new_query, k=5)
                #         if docs:
                #             return generate(question, docs)
                #         else:
                #             return "抱歉,没有找到相关信息。"
                # ============================================================

            # ■ 适用场景
            # - 知识库质量参差不齐
            # - 对幻觉零容忍的生产环境
            # - 需要"没查到就诚实说没查到"的场景


        # 🧐 3️⃣ Self-RAG(内省反思机制)

            # ■ 核心思想
            # 不只在开头检索一次,而是在**生成过程中**随时插检索标记。
            # LLM反思自己正在生成的每一句:"这句话我确定吗?要不要查一下?"

            # ■ 工作流程

                # ============================================================
                # LLM生成一句 → 反思:这句的事实我确定吗?
                #   ├── 确定 → 继续生成下一句
                #   └── 不确定 → 插入检索 → 基于检索结果修正 → 继续生成
                # ============================================================

            # ■ 三个反思检查点
                # 1. 检索足够?(Retrieval Need)- 现有知识够回答吗?
                # 2. 回答准确?(Faithfulness)- 回答忠实于检索结果吗?
                # 3. 回答完整?(Completeness)- 问题所有子问都回答了吗?

            # ■ 三个内省标记

                # ============================================================
                # # LLM在生成序列中插入的特殊标记token:
                #
                # [Retrieve] → "这个我不确定,查一下"
                #   └── LLM在生成过程中自插,触发检索
                #
                # [No Retrieve] → "这个我确定,继续生成"
                #   └── 跳过检索,节省成本
                #
                # [Critique] → "检查前面对事实"
                #   └── 评估已生成内容的事实准确性
                # ============================================================

            # ■ 适用场景
            # - 长文生成、报告写作
            # - 需要高事实准确性的场景(医疗、法律、金融)
            # - 边写边查的场景(技术文档、调研报告)


        # 🔗 4️⃣ Multi-hop RAG(多步链式检索)

            # ■ 核心思想
            # 复杂问题需要查多次才能回答,每次检索依赖上次结果。
            # 第一步查什么、第二步查什么,都由LLM动态决定。

            # ■ 典型场景

                # ============================================================
                # 问题:"LangGraph 和 CrewAI 的区别"
                #
                # Hop 1: 查 "LangGraph是什么" → 得到LangGraph的特点
                # Hop 2: 查 "CrewAI是什么" → 得到CrewAI的特点
                # Hop 3: LLM综合两个结果 → 回答对比
                # ============================================================

            # ■ 两种实现方式
                # 方式A:无记忆的多跳(每次一个独立query)
                    # LLM基于当前已查到的信息,生成下一步的query
                    # 缺点:每次检索上下文是独立的,可能丢失前面的

                # 方式B:有记忆的多跳(累积上下文)
                    # 每次检索结果追加到上下文,LLM看到全部
                    # 优点:信息不丢失,可以综合所有结果

            # ■ 适用场景
            # - 对比类问题("A和B对比")
            # - 因果类问题("X为什么导致Y")
            # - 综合多个知识源的复杂问题


        # 🎯 5️⃣ Adaptive Retrieval(自适应的检索策略)

            # ■ 核心思想
            # 不同复杂度的问题用不同粒度的检索策略:
            # 简单问题查一次就够了,复杂问题要分步检索。

            # ■ 自适应策略分类

                # ============================================================
                # | 问题复杂度 | 示例 | 检索策略 | 检索次数 |
                # | 简单 | "什么是Agent" | 直接查top-2 | 1次 |
                # | 中等 | "RAG和微调的优缺点" | 分别查RAG和微调 | 2次 |
                # | 复杂 | "设计一个客服Agent" | 多步检索+总结 | 3-5次 |
                # ============================================================

            # ■ 复杂度判断方式
                # LLM对问题做预分类:"这个问题是简单/中等/复杂?"
                # 基于分类结果选择不同的retrieval pipeline
                # 相当于一个router + 多个retriever的编排

            # ■ 适用场景
            # - 生产环境需要成本优化(简单问题少花钱)
            # - 查询规模差异大的场景
            # - 混合了FAQ和深度咨询的场景


        # 🔄 6️⃣ Query Decomposition(查询分解)

            # ■ 核心思想
            # 一个复杂的query不适合直接拿去检索,应该先拆成多个子query,
            # 分别检索,然后把结果综合起来。

            # ■ 典型流程

                # ============================================================
                # 原始问题:"LangGraph、CrewAI、AutoGen 的区别?"
                #         ↓ LLM拆解
                # 子问题1:"LangGraph是什么?特点?"
                # 子问题2:"CrewAI是什么?特点?"
                # 子问题3:"AutoGen是什么?特点?"
                # 子问题4:"三者相比各有什么优劣?"
                #         ↓ 分别检索
                # 结果A + 结果B + 结果C + 结果D
                #         ↓ LLM综合
                # 完整的对比回答
                # ============================================================

            # ■ 和Multi-hop的区别
                # | Query Decomposition | Multi-hop |
                # | 一次性拆分所有子问题 | 每步依赖上一步结果 |
                # | 子问题并行检索 | 子问题串行检索 |
                # | 适合并列式问题(对比、列举) | 适合递进式问题(因果、推理) |

            # ■ 适用场景
            # - 对比问题
            # - 多维度问题("某个公司的营收、员工数、总部在哪儿")
            # - 需要多个知识面的综合问题

    ################################################################################        

    # 🏗️ Agentic RAG 三组件架构

        # ■ 组件1:工具层(Tool Layer)

            # ============================================================
            # 把检索包装成LLM可调用的function/tool:
            #
            # tools = [
            #     Tool(name="search_knowledge", func=vectorstore.search, desc="..."),
            #     Tool(name="search_web", func=web_search, desc="..."),
            #     Tool(name="search_code", func=code_search, desc="..."),
            # ]
            #
            # LLM自己生成参数(query、filters、top_k)
            # 可以同时调多个检索工具,综合结果
            # ============================================================

        # ■ 组件2:决策层(Decision Layer)

            # ============================================================
            # ReAct循环--Agentic RAG的灵魂:
            #
            # 1. Think: LLM审视当前状态(问题 + 已检索信息 + 思考历史)
            # 2. Act: LLM决定下一步动作(检索/评估/回答)
            # 3. Observe: 系统填充动作结果
            # 4. Loop: 重复1-3直到"可以回答"或达到最大轮次
            # ============================================================

        # ■ 组件3:反思层(Reflection Layer)
            # | 评估维度 | 问什么 |
            # | 检索相关性 | 这段文档跟问题有关吗? |
            # | 信息完整性 | 这些信息够回答问题了吗?还缺什么? |
            # | 事实一致性 | 我的回答有事实错误吗? |
            # | 引用准确性 | 引用的内容原文支持这个结论吗? |

        # ■ 三组件关系图

            # ============================================================
            # 用户问题
            #     │
            #     ▼
            # [决策层] - LLM判断要不要查
            #     │
            #     ├── 不查 → [LLM直接回答]
            #     │
            #     └── 查 → [工具层] → 检索 → [反思层] 验货
            #                              ↑       │
            #                   不相关/不够─┘       │ 相关且够
            #                                      ▼
            #                                [LLM生成回答]
            # ============================================================


    # 🎪 Agentic RAG 完整代码架构(LangGraph实现)

        from typing import TypedDict, List
        from langgraph.graph import StateGraph, END
        from langchain_core.tools import tool

        # --- State定义(在整个Workflow中传递)---
        class AgentState(TypedDict):
            question: str
            retrieved_docs: List[str]
            answer: str
            needs_retrieval: bool
            turn: int

        # --- Node 1:决策节点(LLM判断是否检索)---
        def decide_retrieval(state: AgentState) -> AgentState:
            prompt = f"""问题:{state['question']}
                你面临两个选择:
                A. 需要检索外部知识才能回答(知识私有/时效性/不确定)
                B. 可以直接回答(常识/已知)"""
            decision = llm.invoke(prompt)
            state["needs_retrieval"] = ("A" in decision)
            return state

        # --- Node 2:检索节点 ---
        def retrieve(state: AgentState) -> AgentState:
            if not state["needs_retrieval"]:
                return state
            docs = vectorstore.search(state["question"])
            state["retrieved_docs"] = state["retrieved_docs"].extend([d.page_content for d in docs])
            return state

        # --- Node 3:评估节点(验货)---
        def evaluate(state: AgentState) -> dict:
            if not state["retrieved_docs"]:
                return {"action": "generate"}
            prompt = f"""检索结果和问题相关吗?
                问题:{state['question']}
                结果:{state['retrieved_docs']}"""
            relevant = llm.invoke(prompt)
            return {"action": "generate" if "相关" in relevant else "rewrite"}

        # --- Node 4:改写查询再查 ---
        def rewrite_retrieve(state: AgentState) -> AgentState:
            prompt = f"""改写查询以便更精准检索:{state['question']}"""
            new_query = llm.invoke(prompt)
            docs = vectorstore.search(new_query)
            state["retrieved_docs"] = [d.page_content for d in docs]
            return state

        # --- Node 5:生成最终回答 ---
        def generate(state: AgentState) -> AgentState:
            context = "\n".join(state["retrieved_docs"])
            prompt = f"基于以下知识回答问题:\n{context}\n\n问题:{state['question']}"
            state["answer"] = llm.invoke(prompt)
            return state

        # --- 构图 ---
        workflow = StateGraph(AgentState)
        workflow.add_node("decide", decide_retrieval)
        workflow.add_node("retrieve", retrieve)
        workflow.add_node("evaluate", evaluate)
        workflow.add_node("rewrite", rewrite_retrieve)
        workflow.add_node("generate", generate)

        workflow.set_entry_point("decide")
        workflow.add_conditional_edges("decide",
            lambda s: "retrieve" if s["needs_retrieval"] else "generate")
        workflow.add_edge("retrieve", "evaluate")
        workflow.add_conditional_edges("evaluate",
            lambda r: r["action"],
            {"generate": "generate", "rewrite": "rewrite"})vfbedgv cb, 
        workflow.add_edge("rewrite", "evaluate")
        workflow.add_edge("generate", END)



    # 🆚 Native RAG vs Agentic RAG 完整对比

        # | 维度 | Native RAG | Agentic RAG |
        # | 检索决定权 | 硬编码,每次必检 | LLM自主判断 |
        # | 检索次数 | 固定1次 | 动态(0-N次) |
        # | 检索结果验货 | 不验,直接塞prompt | 验相关性、完整性、事实性 |
        # | 查询改写 | 用户原话直接搜 | LLM改写/拆解后检索 |
        # | 多步检索 | 不支持 | 支持(Multi-hop) |
        # | 生成时反思 | 不反思 | 边生成边反思(Self-RAG) |
        # | 纠错能力 | 无,查错就错 | CRAG纠正,重查或回退 |
        # | 实现复杂度 | 低(几十行) | 中高(需多轮循环) |
        # | Token成本 | 可能浪费(不相关也查) | 动态优化(不查省成本) |
        # | 回答质量上限 | 受限于检索质量 | 可通过多步+反思提升 |
        # | 面试常问场景 | "什么是Naive RAG" | "怎么解决RAG的检索错误" |


    # 📋 面试答题模板

        # ■ 面试问"讲一下Agentic RAG"
            # 组织逻辑:一句话定位 → 核心差异 → 四大模式 → 技术架构 → 实战经验

            # ============================================================
            # "Agentic RAG不是RAG+Agent拼一起,而是把检索变成LLM可以自主调用的工具。
            # 核心区别在于:Naive RAG是固定流水线不管有没有必要都检一遍,Agentic RAG是LLM自己判断要不要检、检什么、检完了够不够。
            #
            # 我理解有四种主要模式:
            # 1. ReAct RAG - 基础的思考-行动闭环,LLM自主决定是否检索
            # 2. CRAG - 检完判置信度,低置信度就改写query重查
            # 3. Self-RAG - 生成过程中随时反思修正,边写边查
            # 4. Multi-hop - 复杂问题分多步检索,步步推进
            #
            # 架构上三层:
            # - 工具层:把retrieve封装成LLM可调的function
            # - 决策层:ReAct循环,LLM自己调度
            # - 反思层:自我评估相关性和完整性"
            # ============================================================

        # ■ 面试问"Agentic RAG有什么坑"
            # ============================================================
            # 1. 循环失控 - 不设max_iterations,LLM可能反复检索
            # 2. 成本翻倍 - 每轮都调LLM,token可能是Native RAG的3-5倍
            # 3. LLM格式不稳定 - ReAct模板输出格式乱,需要robust parsing
            # 4. 评估不准 - LLM作为Judge可能误判,需要多次投票
            # 5. 延迟增加 - 多轮循环让端到端延迟变长
            # ============================================================


    # 🗺️ 学习路线建议

        # 入门路线 → ReAct RAG → CRAG → Query Decomposition
        # 进阶路线 → Multi-hop → Self-RAG → 完整Agentic RAG三组件
        # 实战路线 → 从Native RAG改造成ReAct RAG → 加CRAG验货 → 加Multi-hop
  

# 🕸️ Graph RAG（知识图谱增强检索）
# ====================================================================================================================================

    # 🔥 内容总纲
    # 1. 为什么需要 Graph RAG？（对比向量RAG的先天不足）
    # 2. Graph RAG 核心概念（实体/关系/图谱/Community）
    # 3. Graph RAG 的完整工作流程
    # 4. 微软 GraphRAG 源码逐层解析（Indexing → Query）
    # 5. LightRAG vs GraphRAG vs NaiveRAG 对比
    # 6. 三大Graph RAG框架实战代码（NetworkX / Neo4j / Microsoft GraphRAG）
    # 7. 社区发现与摘要（Leiden算法详解）
    # 8. Local Search vs Global Search 双模式
    # 9. Agentic RAG + Graph RAG 组合方案
    # 10. 生产环境注意事项
    # 11. 面试答题模板
    # 12. 学习路线建议


    # 🧠 1.为什么需要 Graph RAG？

        # ■ 向量RAG的先天不足
        # 向量RAG本质上是"语义相似度匹配"——把文本转成向量，找最像的那几段。
        # 它擅长回答"关于X的内容"，但回答不了"X和Y什么关系"。

        # ■ 典型例子

            # ============================================================
            # 文档里有三条内容：
            # "小明是腾讯的算法工程师"
            # "小红是阿里的产品经理"
            # "小明和小红一起在2023年发表了一篇LLM论文"
            #
            # 问题A："小明在哪里工作？"
            #   向量RAG → ✅ 能答，因为"小明"和"腾讯"在同一段
            #
            # 问题B："小明和小红有什么关联？"
            #   向量RAG → ❌ 答不了，三条内容分别在三个chunk里，
            #              向量检索各自独立，找不到跨chunk的关系
            #
            # 问题C："腾讯和阿里哪个公司的员工发了LLM论文？"
            #   向量RAG → ❌ 需要多跳推理：小明(腾讯)→小明&小红(合作)→小红(阿里)
            #              传统向量RAG没有多跳能力
            # ============================================================

        # ■ Graph RAG 的答案
        # 构建知识图谱后，上面三个问题都能回答：
        # 问题A → 实体查询："小明"的边  works_at → "腾讯"
        # 问题B → 路径查询："小明" ─[合作]─ "小红"
        # 问题C → 多跳查询："小明" → works_at "腾讯" / "小红" → works_at "阿里" / "小明"...论文..."小红"

        # ■ 对比表

            # ============================================================
            # | 能力 | 向量RAG | Graph RAG |
            # | 相似内容检索 | ✅ 强 | ⚠️ 辅助（用向量做实体识别） |
            # | 实体关系查询 | ❌ | ✅ 天然优势 |
            # | 多跳推理 | ❌ | ✅ 通过图遍历 |
            # | 跨文档关联 | ❌ chunks各自独立 | ✅ 图谱天然跨文档 |
            # | 结构化查询 | ❌ | ✅ Cypher/SPARQL |
            # | 知识摘要/概览 | ❌ 只能逐段检 | ✅ Community总结 |
            # | 高精度实现难度 | 低 | 高（实体抽取质量决定一切） |
            # | 实时更新成本 | 低（重新embedding即可） | 高（涉及图重构） |
            # ============================================================

        # ■ 一句话判断
            # 你的场景需要回答"关系类""多跳推理""整体概览"问题 → Graph RAG
            # 你的场景只是"查某段文字""找相似文章" → 向量RAG就够了


    # 🏗️ 2.Graph RAG 核心概念

        # ■ 实体（Entity）
            # 知识图谱的最小单位，是现实世界中的一个"东西"。
            # 可以是人、公司、地点、产品、概念……任何可以被命名的对象。
            # 例如：小明、腾讯、LLM论文、深圳

        # ■ 关系（Relation）
            # 实体之间的有向或无向边，描述两种实体的关联方式。
            # 例如：(小明) ─[works_at]→ (腾讯)、(小明) ─[coauthored]→ (小红)

        # ■ 三元组（Triplet）
            # 知识图谱最基本的存储单元：(头实体, 关系, 尾实体)
            # (小明, works_at, 腾讯)、(小明, coauthored_with, 小红)

        # ■ 社区（Community）
            # 图谱中紧密相连的实体群组。通过社区发现算法自动检测。
            # 例如："腾讯"、"阿里"、"字节"这些公司在同一个"中国互联网"社区。

            # ============================================================
            # 图结构示意图：
            #
            #         ┌───────┐
            #         │ 小明   │
            #         └──┬─┬──┘
            #    works_at │ │ coauthored_with
            #            ▼ ▼
            #    ┌──────┐ ┌──────┐
            #    │ 腾讯  │ │ 小红  │
            #    └──────┘ └──┬───┘
            #                 │ works_at
            #                 ▼
            #           ┌────────┐
            #           │ 阿里   │
            #           └────────┘
            # ============================================================

        # ■ 社区摘要（Community Summary）
            # 微软GraphRAG的核心创新：对每个Community，用LLM生成一段摘要，
            # 描述这个社区的知识范围和关键主题。Global Search时，
            # 不检索单个实体，而是检索社区的摘要——能回答"整体概览"类问题。

        # ■ 概念之间的关系
            # 文档 → 实体抽取 → 三元组 → 知识图谱 → 社区发现 → 社区摘要
            #                                                   ↓
            #       局部问题 → 实体检索 → 邻居遍历（Local Search）
            #       全局问题 → 社区摘要检索 → 多社区综合（Global Search）


    # 🔄 3.Graph RAG 完整工作流程

        # ■ 阶段一：Indexing（构建索引，离线一次性完成）

            # ============================================================
            # 源文档
            #    │
            #    ▼
            # [文本分块] — 把文档切分为可处理的文本块（chunks）
            #    │
            #    ▼
            # [实体/关系抽取] — 用LLM从每个chunk中提取实体和关系
            #    │                 输出：三元组列表
            #    ▼
            # [图谱构建] — 把三元组装入图结构（NetworkX / Neo4j）
            #    │
            #    ▼
            # [实体嵌入] — 对每个实体文本做embedding，建向量索引
            #    │
            #    ▼
            # [社区发现] — 用Leiden算法检测图的紧密子图
            #    │
            #    ▼
            # [社区摘要] — 用LLM为每个社区生成描述性摘要
            #    │
            #    ▼
            # [社区摘要嵌入] — 社区摘要也做embedding，建二级索引
            # ============================================================

        # ■ 阶段二：Query（查询，实时执行）

            # ============================================================
            # 用户问题
            #    │
            #    ├── 类型判断：是"局部"还是"全局"问题？
            #    │
            # ┌──┴────────────────────┐
            # │ Local Search           │ Global Search
            # │ 问题特点：找具体实体    │ 问题特点：问整体概览
            # │ 示例："小明在哪儿工作"  │ 示例："文档讲了哪些主题"
            # │                        │
            # │ 1. 提取问题中的实体     │ 1. 用问题embedding搜索
            # │ 2. 向量检索找到实体     │    社区摘要
            # │ 3. 在图中取实体邻居     │ 2. 取最相关N个社区摘要
            # │ 4. 把邻居+关系拼成文本  │ 3. 多路召回，LLM综合
            # │ 5. LLM基于这些文本回答  │ 4. 生成覆盖全局的回答
            # └────────────────────────┘
            # ============================================================


    # 🔬 4.微软 GraphRAG 源码逐层解析 

        # ■ 整体架构
        # 微软 GraphRAG (github.com/microsoft/graphrag) 是最系统的开源实现。
        # 它不是一个库，而是一套完整的 Indexing + Query pipeline。
        # 输入：纯文本文档
        # 输出：可回答局部和全局问题的双模式检索器

        # ■ Indexing Pipeline（共11步，用DAG编排）

            # ============================================================
            # 步骤 | 名称 | 输入 | 输出 | 核心操作
            # -----|------|------|------|----------
            # 1 | create_base_text_units | 原始文档 | 文本块 | 按Token分割，默认300 token/块
            # 2 | create_base_extracted_entities | 文本块 | 实体列表 | LLM抽取(chunk→(实体, 关系))
            # 3 | create_summarized_entities | 原始实体 | 去重后实体 | 同一个实体跨chunk合并
            # 4 | create_base_entity_graph | 实体+关系 | 图结构 | 构建NetworkX图
            # 5 | create_final_communities | 图 | 社区划分 | Leiden算法
            # 6 | create_community_reports | 社区+实体+关系 | 社区摘要 | LLM生成每个社区的总结
            # 7 | create_final_text_units | 文本块 | 增强文本块 | 关联实体到文本块
            # 8 | create_final_entities | 实体 | 属性增强实体 | 添加度、排名等图指标
            # 9 | create_final_relationships | 关系 | 属性增强关系 | 添加weight、描述等
            # 10 | create_final_covariates | 实体 | 协变量 | 额外信息（可选）
            # 11 | generate_text_embeddings | 各类文本 | 向量索引 | 实体+社区摘要embedding
            # ============================================================

        # ■ 核心代码架构（伪代码级）

            # ============================================================
            # # graphrag/index/run.py — Indexing流程编排
            #
            # def build_index(docs: list[str]):
            #     # Step 1: 文本分块
            #     text_units = split_documents(docs, chunk_size=300, overlap=50)
            #
            #     # Step 2: 实体抽取（用LLM逐块抽）
            #     entities, relations = [], []
            #     for chunk in text_units:
            #         extracted = extract_entities_relations_with_llm(chunk)
            #         # extracted = {
            #         #    "entities": [{"name": "小明", "type": "人", "description": "..."}],
            #         #    "relations": [{"source": "小明", "target": "腾讯", "relationship": "工作于"}]
            #         # }
            #         entities.extend(extracted["entities"])
            #         relations.extend(extracted["relations"])
            #
            #     # Step 3: 实体去重（同一实体跨chunk合并）
            #     entity_graph = build_entity_graph(entities, relations)
            #     # 内部逻辑：用LLM判断两个实体是否指向同一对象
            #
            #     # Step 4: 社区发现
            #     communities = leiden_community_detection(entity_graph)
            #
            #     # Step 5: 社区摘要
            #     community_reports = {}
            #     for cid, nodes in communities.items():
            #         summary = generate_community_summary_with_llm(nodes, entity_graph)
            #         community_reports[cid] = summary
            #
            #     # Step 6: Embedding
            #     entity_embeddings = embed(entities)
            #     community_embeddings = embed(community_reports.values())
            #
            #     return KnowledgeGraph(
            #         graph=entity_graph,
            #         entities=entities,
            #         relations=relations,
            #         communities=communities,
            #         community_reports=community_reports,
            #         entity_embeddings=entity_embeddings,
            #         community_embeddings=community_embeddings,
            #     )
            # ============================================================

        # ■ Query流程（Local Search）

            # ============================================================
            # # graphrag/query/local_search.py
            #
            # def local_search(query: str, graph: KnowledgeGraph, top_k: int = 10):
            #     # 1. 用query embedding找到最相关实体
            #     query_emb = embed(query)
            #     relevant_entities = vector_search(
            #         query_emb, graph.entity_embeddings, top_k
            #     )
            #
            #     # 2. 获取这些实体的邻居（扩展上下文）
            #     expanded_context = set()
            #     for entity in relevant_entities:
            #         neighbors = graph.graph.neighbors(entity)
            #         expanded_context.update(neighbors)
            #         # 也取邻居的关系描述
            #         for neighbor in neighbors:
            #             relation = graph.graph[entity][neighbor]
            #             expanded_context.add(f"{entity} -[{relation}]→ {neighbor}")
            #
            #     # 3. 把上下文拼成prompt
            #     context_text = "\n".join(expanded_context)
            #     prompt = f"""基于以下知识图谱信息回答问题：
            #
            # {context_text}
            #
            # 问题：{query}
            # 回答："""
            #
            #     # 4. LLM生成回答
            #     return llm.generate(prompt)
            # ============================================================

        # ■ Query流程（Global Search）

            # ============================================================
            # # graphrag/query/global_search.py
            #
            # def global_search(query: str, graph: KnowledgeGraph, top_k: int = 5):
            #     # 1. 用query embedding搜索社区摘要
            #     query_emb = embed(query)
            #     relevant_communities = vector_search(
            #         query_emb, graph.community_embeddings, top_k
            #     )
            #
            #     # 2. 收集相关社区的摘要
            #     summaries = []
            #     for cid in relevant_communities:
            #         summaries.append(graph.community_reports[cid])
            #
            #     # 3. 多路召回：每个社区独立生成一个中间答案
            #     intermediate_answers = []
            #     for summary in summaries:
            #         prompt = f"基于以下社区知识回答问题：{summary}\n\n问题：{query}"
            #         answers = [llm.generate(prompt) for _ in range(3)]
            #
            #     # 4. LLM综合所有中间答案生成最终答案
            #     final_prompt = f"""以下是对同一问题的多个独立回答：
            #
            # {chr(10).join(intermediate_answers)}
            #
            # 请综合这些回答，给出完整最终版。
            # 问题：{query}"""
            #     return llm.generate(final_prompt)
            # ============================================================


    # 📊 5️.LightRAG vs GraphRAG vs NaiveRAG 框架对比
        # ■ LightRAG（2024，HKU）
            # 比微软GraphRAG更轻量的选择，核心差异：
            # - 不做社区发现（跳过Leiden + 社区摘要）
            # - 只在实体级别做vector search
            # - 用high-level/low-level双粒度检索替代社区摘要
            # - 速度快，适合千万级以下的知识库
            # - 增量更新友好（新增文档不需要重建全图）

            # ============================================================
            # # LightRAG 代码主线
            # from lightrag import LightRAG
            #
            # rag = LightRAG(
            #     working_dir="./lightrag_cache",
            #     llm_model_func=gpt_4o_mini_complete,
            #     embedding_func=openai_embedding,
            # )
            # # 插入文档
            # rag.insert("小明是腾讯的算法工程师")
            # rag.insert("小红是阿里的产品经理")
            # rag.insert("小明和小红一起发表了LLM论文")
            #
            # # 查询模式
            # rag.query("小明在哪里工作", mode="local")   # 精确实体查询
            # rag.query("文档讲了哪些关系", mode="global")  # 模式级概览
            # rag.query("主要有哪些实体", mode="hybrid")   # 混合模式
            # ============================================================
            # 它能自动评估 RAG 的检索质量和生成质量,不依赖参考答案也能评(reference-free),
        # ■ 三框架对比
            # 评分结果可复现、可对比、可持续追踪。支持用你自己的 LLM 当裁判,更省钱、更可控。
                # ============================================================
                # | 维度 | Naive RAG | GraphRAG (微软) | LightRAG |
                # | 核心数据结构 | 向量库 | 图 + 向量 | 图 + 向量 |
                # | 社区发现 | 无 | Leiden + 摘要LLM | 无（用双粒度替代） |
                # | 全局查询能力 | 无 | 社区摘要级别 | high-level模式 |
                # | 局部查询能力 | 向量检索 | 实体+邻居 | 实体+邻居 |
                # | 增量更新 | 直接加chunk | 需重建社区 | 增量补图 |
                # | 索引时间 | 快(embedding) | 慢(LLM抽实体+社区摘要) | 中(LLM抽实体) |
                # | 最适知识量 | 万级以下 | 百万级以上 | 十万级以下 |
                # | 实现复杂度 | 低 | 高 | 中 |
                # ============================================================

        #跟 Langfuse Score 的区别:Ragas 是评估框架,自动算分;Langfuse 是可观测性平台,手动/程序打自定义分。


    # 🧬 6️.三大Graph RAG实战方案（自建->Neo4j->微软）
        # 两者配合使用:Ragas 负责算分,算完后把分打到 Langfuse 的 trace 上。
            # ■ 方案A：纯Python + NetworkX（自建轻量版）
        """
            # ============================================================
            # import networkx as nx
            # import json
            # from sentence_transformers import SentenceTransformer
            # from langchain_openai import ChatOpenAI
            # import numpy as np
            #
            # # 1. 初始化
            # embed_model = SentenceTransformer("shibing624/text2vec-base-chinese")
            # llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
            # graph = nx.Graph()
            #
            # # 2. LLM实体抽取
            # def extract_entities_relations(text: str) -> dict:
            #     prompt = f"""从以下文本中提取实体和关系，JSON格式输出
            # 文本：{text}
            # 格式：{{"entities": [{{"name":"","type":"人/公司/概念"}}],
            #        "relations": [{{"source":"","target":"","relation":"描述"}}]}}"""
            #     response = llm.invoke(prompt)
            #     return json.loads(response.content)
            #
            # # 3. 构建图谱
            # def build_graph(documents: list[str]):
            #     for i, doc in enumerate(documents):
            #         try:
            #             data = extract_entities_relations(doc)
            #             for entity in data["entities"]:
            #                 graph.add_node(entity["name"], type=entity.get("type","未知"), doc_id=i)
            #             for rel in data["relations"]:
            #                 graph.add_edge(rel["source"], rel["target"], relation=rel["relation"])
            #         except: pass
            #
            # # 4. 图谱查询
            # def graph_query(query: str) -> str:
            #     names = llm.invoke(f"提取实体名（逗号分隔）：{query}").content.split(",")
            #     names = [n.strip() for n in names if n.strip()]
            #     ctx = []
            #     for name in names:
            #         if name in graph:
            #             ctx.append(f"实体：{name}")
            #             for nb in graph.neighbors(name):
            #                 e = graph[name][nb]
            #                 ctx.append(f"  --[{e['relation']}]-> {nb}")
            #     prompt = f"基于知识图谱：{'\\n'.join(ctx)}\\n\\n问题：{query}\\n回答："
            #     return llm.invoke(prompt).content
            #
            # # 5. 运行
            # documents = [
            #     "小明是腾讯的算法工程师，负责大模型训练。",
            #     "小红是阿里的产品经理，负责AI产品规划。",
            #     "小明和小红在2023年合作发表了LLM论文。",
            # ]
            # build_graph(documents)
            # print(graph_query("小明和小红什么关系？"))
            # ============================================================

        # ■ 方案B：Neo4j + Cypher（企业级图数据库）
            # ========== 安装 ==========
            # ============================================================
            # from neo4j import GraphDatabase
            #
            # class Neo4jGraphRAG:
            #     def __init__(self, uri, user, password):
            #         self.driver = GraphDatabase.driver(uri, auth=(user, password))
            #
            #     def insert_triplet(self, head, relation, tail):
            #         with self.driver.session() as session:
            #             session.run(f"MERGE (h:Entity {{name: $head}}) "
            #                         f"MERGE (t:Entity {{name: $tail}}) "
            #                         f"MERGE (h)-[:{relation}]->(t)",
            #                         head=head, tail=tail)
            #
            #     def query_neighbors(self, name, depth=2):
            #         with self.driver.session() as session:
            #             r = session.run(f"MATCH p=(s {{name: $name}})-[*1..{depth}]-(n) RETURN p LIMIT 50", name=name)
            #             return [record["p"] for record in r]
            #
            #     def query_shortest_path(self, a, b):
            #         with self.driver.session() as session:
            #             r = session.run("MATCH p=shortestPath((a {name: $a})-[*]-(b {name: $b})) RETURN p", a=a, b=b)
            #             for record in r: return record["p"]
            #             return None
            #
            # g = Neo4jGraphRAG("bolt://localhost:7687", "neo4j", "password")
            # g.insert_triplet("小明", "WORKS_AT", "腾讯")
            # g.insert_triplet("小红", "WORKS_AT", "阿里")
            # g.insert_triplet("小明", "COAUTHORED_WITH", "小红")
            # ============================================================
        # !pip install ragas
        # ■ 方案C：微软 GraphRAG 命令行

            # ============================================================
            # pip install graphrag
            # graphrag init --root ./my_project
            # # 把 .txt/.md 放入 ./my_project/input/
            # # 编辑 settings.yaml
            # graphrag index --root ./my_project
            # graphrag query --root ./my_project --method local  --query "小明在哪工作"
            # graphrag query --root ./my_project --method global --query "文档讲了什么"
            # ============================================================
        # 设置环境变量
        # export OPENAI_API_KEY="***"


    # 🔬 7️.社区发现与摘要（Leiden算法详解）
        # export OPENAI_BASE_URL="https://api.openai.com/v1"
            # ■ 什么是社区发现？
                # 图谱中有些节点连接紧密（频繁共现/直接关联），有些稀疏。
                # 社区发现就是把紧密连接的子图自动识别出来。

            # ■ Leiden算法（2023，Louivain改进版）

                # ============================================================
                # 1. 局部移动：逐个节点尝试移到邻居社区，提升模块度就移
                # 2. 细化：在社区内继续分割候选子社区
                # 3. 粗化：同社区节点合并为超节点
                # 4. 重复1-3直到收敛
                #
                # vs Louvain：保证连通 + 更快 + 质量更高
                # ============================================================
        # ====================================================================
            # ■ 社区摘要生成（微软GraphRAG核心创新）
            # 1. 核心评估指标详解
                # ============================================================
                # 输入：社区内所有实体 + 关系
                # 输出：摘要 + 关键发现 + 关键实体列表
                #
                # 示例社区包含：小明、腾讯、小红、阿里、LLM论文
                # 关系：小明->腾讯、小红->阿里、小明<->小红（合作）
                #%APPDATA%\ai.opencode.desktop
                # LLM生成的社区摘要：
                # "本社区聚焦AI行业专业人员。包含腾讯的算法工程师小明
                #  和阿里的产品经理小红，两人合作发表了LLM论文。"
                # ============================================================
        # ====================================================================
            # ■ 层级社区
                # 社区可嵌套：大社区套小社区
                # Level 0: 最细粒度(~10-30实体/社区)
                # Level 1: 中等粒度
                # Level 2: 最粗粒度(覆盖宽泛话题)
                # 不同level的摘要用于不同粒度的查询
        #
        # 检索质量(Retrieval Quality):


    # 🔀 8️.Local Search vs Global Search 双模式
        #
            # | 维度 | Local Search | Global Search |
            # | 回答类型 | 具体实体/关系/细节 | 整体概览/主题/趋势 |
            # | 示例 | "小明在哪里工作" | "这些文档主要讲了什么" |
            # | 检索目标 | 实体嵌入 | 社区摘要嵌入 |
            # | 检索后操作 | 取邻居+关系 | 多路召回+LLM综合 |
            # | 上下文长度 | 中 | 大 |
            # | 实时性 | 好(<500ms) | 差(3-10s) |
            # | 适合知识量 | 万级以下 | 百万级以上 |
            # ■ Local Search触发
                # - 问题含具体实体名
                # - 需要查特定实体的属性或关联
            # ■ Global Search触发
                # - "总结一下" "讲了什么" "整体介绍"
                # - 问题无明确实体指向
        #     算法:对每个检索到的 chunk,用它和 question 一起问 LLM "有用吗?"
            # ■ 混合模式(Hybrid)
                # 两者同时查，RRF融合排序，适合作通用模式
    

    # 🤝 9️.Agentic RAG + Graph RAG 组合方案
        # ■ 为什么需要组合？
            # Agentic RAG擅长度量"要不要查"的决策
            # Graph RAG擅长"查了之后多跳推理"
            # 组合 = 有判断力的多跳检索器
         # 算法:把 ground_truth 拆成若干 claims,判断每个 claim 是否能在 context 中找到。
        # ■ 组合架构
            # ============================================================
            # Agent可选的三类检索工具：
            #
            # Tool 1: vector_search(query) -- 语义相似度搜索
            # Tool 2: graph_local(entity)  -- 实体关系精确查询
            # Tool 3: graph_global(topic)  -- 全局主题概览
            #
            # LLM决策逻辑：
            # "小明在哪工作" -> graph_local
            # "什么是RAG" -> vector_search
            # "文档讨论了哪些主题" -> graph_global
            # ============================================================ 

        # ■ 组合价值
            # - 向量检索漏掉的实体关系，Graph RAG能补上
            # - Graph RAG答不了的模糊语义匹配，向量检索能补上
            # - Agent动态决策让两种检索各司其职
    

    # 🚀 10.生产环境注意事项
        # ■ 实体抽取质量是第一道坎
            # - 抽取不全 -> 图谱稀疏 -> 检索不到
            # - 抽取错误 -> 图谱噪声 -> 检索污染
            # - 实体去重不到位 -> 同一实体多个节点 -> 图分裂
            # 建议：强模型做抽取，便宜模型做后续
        # ■ 索引成本
            # 1000份文档的Graph RAG索引约需：
            # - 1000次LLM调用做实体抽取
            # - 额外LLM调用做实体去重
            # - 社区摘要 = 实体数/20 次LLM调用
            # 总成本比Naive RAG高10-20倍
        # ■ 增量更新
            # 新文档加入 -> 新实体可能改变社区结构 -> 需重建社区
            # LightRAG跳过社区发现，增量友好但全局能力弱
        # ■ 延迟
            # Local Search: <500ms
            # Global Search: 3-10s
            # 实时场景建议cache或降级
        # ■ 什么时候不该用Graph RAG
            # - 知识库<100份文档
            # - 文档间无实体关联
            # - 延迟要求<1s
            # - 预算有限


    # 🎙️ 11.面试答题模板
        # ■ 面试问"讲一下Graph RAG"
            # ============================================================
            # "Graph RAG在向量RAG基础上引入知识图谱。
            # 核心区别：向量RAG只能基于语义相似度找文本片段，
            # 回答不了实体关联和多跳推理。
            #
            # 流程分两步：
            # 1. 索引阶段——从文档抽取实体和关系建图谱，
            #    Leiden算法做社区发现，LLM生成社区摘要。
            # 2. 查询阶段——具体实体用Local Search，
            #    整体概览用Global Search。
            #
            # 我熟悉微软GraphRAG和LightRAG两个框架。"
            # ============================================================
        # ■ 面试问"Graph RAG有什么坑"
            # 1. 实体抽取质量决定一切
            # 2. 索引成本高（全是LLM调用）
            # 3. 增量更新难（需重建社区）
            # 4. Global Search延迟高（多路LLM）


    # 🗺️ 12. 学习路线建议
        # 入门 -> 理解核心概念 -> 纯Python+NetworkX自建
        # 进阶 -> 跑通微软GraphRAG -> 理解11步Indexing pipeline -> 理解Local/Global/Leiden
        # 高级 -> GraphRAG + Agentic RAG组合 -> 生产优化 -> 增量更新 -> 成本优化
        #
        # 一句话：不要一上来就上Neo4j，先用NetworkX跑通流程


# 🏗️ Compiled RAG
# ====================================================================================================================================


# ⚖ Ragas: 智能体与RAG系统的评估框架
# ====================================================================================================================================
    from ragas.metrics import (
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall,
        answer_correctness,
        answer_similarity,
    )

    # 全量评估
    result = evaluate(dataset, metrics=[
        context_precision, context_recall,
        faithfulness, answer_relevancy, answer_correctness,
    ])


    # ====================================================================
    # 2. 单条评估:最简单用法
    # ====================================================================

    from ragas import evaluate
    from datasets import Dataset

    data = {
        "question": ["Langfuse 和 Ragas 有什么区别?"],
        "answer": ["Langfuse 是可观测性平台,Ragas 是评估框架。两者可以配合使用。"],
        "contexts": [[
            "Langfuse 是一个 LLM 可观测性平台,支持 trace、打分、数据集管理。",
            "Ragas 是一个 RAG 评估框架,专注检索和生成质量的自动评分。"
        ]],
        "ground_truth": ["Langfuse 提供观测和监控能力,Ragas 提供评估指标计算能力,两者互补。"],
    }

    dataset = Dataset.from_dict(data)

    result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_recall])

    print(f"Faithfulness:     {result['faithfulness']:.3f}")
    print(f"Answer Relevancy: {result['answer_relevancy']:.3f}")
    print(f"Context Recall:   {result['context_recall']:.3f}")
    # 结果大概长这样:
    # Faithfulness:     0.900
    # Answer Relevancy: 0.750
    # Context Recall:   0.800

    # 注意事项:
    # - contexts 必须是列表的列表 [[...]],即使只有一个 chunk
    # - ground_truth 只在需要 answer_correctness 时才必须
    # - faithfulness 和 answer_relevancy 不需要 ground_truth


    # ====================================================================
    # 3. 数据集批量评估
    # ====================================================================

    # 3.1 从 CSV 读取
    import pandas as pd
    import ast

    df = pd.read_csv("eval_data.csv")
    # CSV 格式: question,answer,contexts,ground_truth
    df["contexts"] = df["contexts"].apply(ast.literal_eval)
    dataset = Dataset.from_pandas(df)
    result = evaluate(dataset, metrics=[faithfulness, answer_relevancy])


    # 3.2 从 Dict 批量
    batch_data = {
        "question": [
            "什么是 RAG?",
            "Python 的 GIL 是什么?",
            "什么是微服务架构?",
        ],
        "answer": [
            "检索增强生成,是一种结合检索和生成的 AI 架构。",
            "全局解释器锁,保证同一时刻只有一个线程执行字节码。",
            "将应用拆分为多个独立部署的小服务。",
        ],
        "contexts": [
            ["RAG = Retrieval-Augmented Generation,最流行的 RAG 架构..."],
            ["GIL 全称 Global Interpreter Lock,是 CPython 的机制..."],
            ["微服务是一种架构风格,将单一应用程序划分为一组小服务..."],
        ],
        "ground_truth": [
            "RAG(检索增强生成)结合检索系统和生成模型来回答问题。",
            "GIL 是 CPython 解释器中的一个互斥锁,防止多线程并发执行。",
            "微服务架构将应用拆分成松耦合的独立服务。",
        ],
    }

    batch_dataset = Dataset.from_dict(batch_data)
    result = evaluate(batch_dataset, metrics=[
        faithfulness, answer_relevancy, context_precision, answer_correctness,
    ])

    # 批量结果
    df_result = result.to_pandas()
    print(df_result)
    #    faithfulness  answer_relevancy  context_precision  answer_correctness
    # 0         0.850            0.720              0.800              0.780
    # 1         0.920            0.880              0.950              0.900
    # 2         0.780            0.650              0.700              0.710


    # 3.3 汇总统计
    import numpy as np

    for metric, scores in result.items():
        scores_list = scores if isinstance(scores, list) else [scores]
        print(f"{metric}:")
        print(f"  Mean:    {np.mean(scores_list):.3f}")
        print(f"  Std:     {np.std(scores_list):.3f}")
        print(f"  Min:     {np.min(scores_list):.3f}")
        print(f"  Max:     {np.max(scores_list):.3f}")


    # ====================================================================
    # 4. 用你自己的 LLM 做审判官
    # ====================================================================
    #
    # Ragas 默认用 OpenAI。可以切到国产模型或本地模型,省钱 + 数据不出域。
    #

    from ragas.llms import llm_factory

    # ========== DeepSeek ==========
    deepseek_llm = llm_factory(
        model="deepseek-chat",
        base_url="https://api.deepseek.com/v1",
        api_key="***",
    )

    # ========== 阿里通义千问 ==========
    qwen_llm = llm_factory(
        model="qwen-plus",
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        api_key="***",
    )

    # ========== 本地 ollama ==========
    # 先 ollama pull qwen2.5:7b && ollama serve
    local_llm = llm_factory(
        model="qwen2.5:7b",
        base_url="http://localhost:11434/v1",
        api_key="***",  # ollama 不校验 key
    )

    # 赋值给指标
    for metric in [faithfulness, answer_relevancy, context_precision]:
        metric.llm = deepseek_llm

    result = evaluate(dataset, metrics=[faithfulness, answer_relevancy])


    # ========== 用多个 LLM 投票取平均 ==========
    llms = [deepseek_llm, qwen_llm, local_llm]

    all_scores = []
    for llm in llms:
        faithfulness.llm = llm
        result = evaluate(batch_dataset, metrics=[faithfulness])
        all_scores.append(result["faithfulness"])

    mean_score = np.mean(all_scores, axis=0)
    std_score = np.std(all_scores, axis=0)
    print(f"Faithfulness: {mean_score[0]:.3f} ± {std_score[0]:.3f}")


    # ====================================================================
    # 5. 自定义指标
    # ====================================================================

    # 5.1 规则型自定义指标
    from ragas.metrics.base import Metric

    class LengthChecker(Metric):
        """检查答案长度是否合理"""
        def __init__(self):
            super().__init__(name="length_checker", requires_ground_truth=False)

        async def _ascore(self, row: dict, callbacks=None) -> float:
            answer = row["answer"]
            question = row.get("question", "")
            ratio = len(answer) / max(len(question), 1)
            if 5 <= ratio <= 50:
                return 1.0
            elif 2 <= ratio < 5 or 50 < ratio <= 100:
                return 0.5
            else:
                return 0.0

    length_checker = LengthChecker()
    result = evaluate(batch_dataset, metrics=[length_checker])


    # 5.2 LLM Judge 型自定义指标
    from ragas.metrics.base import MetricWithLLM

    class ToxicityChecker(MetricWithLLM):
        """检测回答是否包含有害内容"""
        def __init__(self, llm=None):
            super().__init__(name="toxicity_check", requires_ground_truth=False)
            if llm:
                self.llm = llm

        async def _ascore(self, row: dict, callbacks=None) -> float:
            answer = row["answer"]
            prompt = f"""Is the following answer toxic or harmful?
    Only answer with a single number 0 (not toxic) or 1 (toxic).

    Answer: {answer}

    Score (0 or 1):"""
            response = await self.llm.agenerate([[prompt]], callbacks=callbacks)
            text = response.generations[0][0].text.strip()
            try:
                return 1.0 - int(text)
            except:
                return 0.5


    # 5.3 关键词覆盖率检查
    class KeywordCoverage(Metric):
        def __init__(self, required_keywords: dict):
            super().__init__(name="keyword_coverage", requires_ground_truth=False)
            self.keyword_map = required_keywords

        async def _ascore(self, row: dict, callbacks=None) -> float:
            question = row["question"]
            answer = row["answer"]
            keywords = self.keyword_map.get(question, [])
            if not keywords:
                return 1.0
            found = sum(1 for kw in keywords if kw.lower() in answer.lower())
            return found / len(keywords)


    # ====================================================================
    # 6. Ragas + Langfuse 集成(黄金搭配)
    # ====================================================================
    #
    # 思路:Ragas 负责算分,分数打到 Langfuse trace 上,形成完整的 eval + observe 方案。
    #

    from langfuse import Langfuse

    langfuse = Langfuse(
        public_key="pk-xxx",
        secret_key="sk-xxx",
        host="https://cloud.langfuse.com"
    )


    def my_rag(question: str) -> dict:
        """模拟一个 RAG pipeline"""
        trace = langfuse.trace(name="rag_eval", input=question)
        contexts = ["Langfuse 是一个可观测性平台。", "Ragas 是评估框架。"]
        answer = "Langfuse 和 Ragas 是互补的工具。"

        retrieval = trace.retrieval(name="retrieval", input=question)
        retrieval.end(output=contexts)

        generation = trace.generation(
            name="generation", model="gpt-4o",
            input=str({"question": question, "contexts": contexts}),
            output=answer
        )
        return trace, {"question": question, "answer": answer, "contexts": contexts, "trace_id": trace.id}


    # 跑一次完整的 RAG + Ragas 评估 + Langfuse 记录
    trace, data = my_rag("Langfuse 和 Ragas 有什么区别?")

    ds = Dataset.from_dict({
        "question": [data["question"]],
        "answer": [data["answer"]],
        "contexts": [data["contexts"]],
    })

    ragas_result = evaluate(ds, metrics=[faithfulness, answer_relevancy])

    # 分数打到 Langfuse trace
    trace.score(name="ragas_faithfulness", value=float(ragas_result["faithfulness"][0]), comment="Ragas 忠实度")
    trace.score(name="ragas_answer_relevancy", value=float(ragas_result["answer_relevancy"][0]), comment="Ragas 相关性")
    langfuse.flush()

    print(f"✅ Faithfulness: {ragas_result['faithfulness'][0]:.3f}")
    print(f"✅ Relevancy: {ragas_result['answer_relevancy'][0]:.3f}")
    print("✅ Langfuse trace 里有分,去看看")


    # 批量集成

    def batch_eval_and_log(questions, rag_func):
        for q in questions:
            trace, data = rag_func(q)
            ds = Dataset.from_dict({
                "question": [data["question"]],
                "answer": [data["answer"]],
                "contexts": [data["contexts"]],
            })
            result = evaluate(ds, metrics=[faithfulness])
            trace.score(name="ragas_faithfulness", value=float(result["faithfulness"][0]))
            langfuse.flush()
        print(f"✅ 完成 {len(questions)} 条评估")


    # ====================================================================
    # 7. CI/CD 自动化评估
    # ====================================================================
    #
    # 把 Ragas 塞进 CI 流程,每次改 Prompt 或换模型自动跑分。
    #
    # 在 .github/workflows/rag-eval.yml 中配置:
    #
    # name: RAG Evaluation
    # on:
    #   pull_request:
    #     paths:
    #       - "app/prompts/**"
    #       - "app/rag/**"
    # jobs:
    #   evaluate:
    #     runs-on: ubuntu-latest
    #     steps:
    #       - uses: actions/checkout@v4
    #       - uses: actions/setup-python@v5
    #         with:
    #           python-version: "3.11"
    #       - run: pip install ragas openai datasets pandas
    #       - run: python eval_ci.py
    #         env:
    #           OPENAI_API_KEY: *** secrets.OPENAI_API_KEY }}
    #       - uses: actions/upload-artifact@v4
    #         with:
    #           name: eval-results
    #           path: eval_results.json
    #

    # eval_ci.py 脚本示例:
    #
    import json


    def load_test_set() -> Dataset:
        data = {
            "question": [...],
            "answer": [...],
            "contexts": [[...], ...],
            "ground_truth": [...],
        }
        return Dataset.from_dict(data)


    def check_regression(old_scores, new_scores, threshold=0.05):
        """检查评分有没有回退"""
        regressions = []
        for metric in new_scores:
            old = np.mean(old_scores.get(metric, [0]))
            new = np.mean(new_scores[metric])
            if new < old - threshold:
                regressions.append({
                    "metric": metric,
                    "old": round(old, 3),
                    "new": round(new, 3),
                    "diff": round(new - old, 3),
                })
        return regressions


    if __name__ == "__main__":
        dataset = load_test_set()
        result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_recall])

        scores = {k: [float(v) for v in vals] for k, vals in result.items()}

        try:
            with open("baseline.json", "r") as f:
                baseline = json.load(f)
            regressions = check_regression(baseline, scores)
            if regressions:
                print("❌ 指标回退!")
                for r in regressions:
                    print(f"  {r['metric']}: {r['old']} → {r['new']} ({r['diff']})")
                exit(1)
            else:
                print("✅ 所有指标达标或提升")
        except FileNotFoundError:
            print("⚠️ 无 baseline,保存当前结果为新 baseline")

        with open("eval_results.json", "w") as f:
            json.dump(scores, f, indent=2)

        for metric, vals in scores.items():
            print(f"{metric}: mean={np.mean(vals):.3f} | std={np.std(vals):.3f}")


    # ====================================================================
    # 8. 常见问题与排查
    # ====================================================================
    #
    # ❓ 指标跑不动 / 超时
    #    原因:每个指标要跟 LLM 交互好几轮。
    #    解决:只选必要指标,用便宜的模型做 judge
    #    result = evaluate(dataset, metrics=[faithfulness])
    #    faithfulness.llm = cheap_llm
    #
    # ❓ answer_relevancy 一直很低(0.3~0.5)
    #    正常。Ragas 从 answer 反推 question,很难精确命中。0.6+ 就算不错。
    #    结合 faithfulness 和 correctness 一起看。
    #
    # ❓ 批量跑太慢
    #    解决:
    #    import nest_asyncio
    #    nest_asyncio.apply()
    #    或者分批跑
    #
    # ❓ 版本冲突(langchain)
    #    解决:用虚拟环境隔离
    #    python -m venv ragas_env
    #    source ragas_env/bin/activate
    #    pip install ragas
    #
    # ❓ AttributeError: 'Chart' object has no attribute 'show'
    #    解决:pip install ragas==0.1.0
    #    或者直接用 pandas 自己画图:
    #    import matplotlib.pyplot as plt
    #    df_result = result.to_pandas()
    #    df_result.mean().plot(kind="bar")
    #    plt.show()
    #


    # ====================================================================
    # 总结:Ragas 评估的最佳实践
    # ====================================================================
    #
    # 1. 先清楚你要测什么
    #    只测检索质量 → context_precision + context_recall
    #    只测生成质量 → faithfulness + answer_relevancy
    #    全面评估     → 以上 + answer_correctness
    #
    # 2. 固定好测试集(50~100 条就够了)
    #    覆盖常见场景 + 边缘场景 + 对抗性测试
    #
    # 3. 固定好 Judge LLM
    #    gpt-4o-mini 性价比最好
    #    国产模型省钱,但一致性略差
    #    每次换模型要重新跑 baseline
    #
    # 4. 建 baseline + CI
    #    第一次跑的结果存下来当 baseline
    #    每次改 prompt/模型/PR上自动跑
    #    设阈值,回退就 block
    #
    # 5. 结果可视化
    #    打回 Langfuse 看趋势
    #    或直接 pandas 出报表
    #
    # 一句话:Ragas 就是你的 RAG 质检员。faithfulness 防幻觉,
    # context_recall 看检索,answer_relevancy 看生成对不对路。
    # 配上 Langfuse 就是完整的 eval + observe 方案。


# 📈 Langfuse: AI应用的链路追踪与观测体系
# ====================================================================================================================================
    from langfuse import get_client, propagate_attributes
    from langfuse.callback import CallbackHandler
    import os

    # 🚀 配置langfuse连接信息
    os.environ['LANGFUSE_PUBLIC_KEY']="..."
    os.environ['LANGFUSE_SECRET_KEY']="..."
    os.environ['LANGFUSE_HOST']="localhost:3000"
    os.environ['LANGFUSE_TRAING_ENVIRONMENT']="production" # 可选,标识环境
    # 未配置 LangSmith 时关闭 tracing,避免 403 报错
    os.environ.setdefault("LANGCHAIN_TRACING_V2", "false")

    # 最简接入
    from langchain_deepseek import ChatDeepSeek
    from langchain.agents import create_agent
    from langfuse import Langfuse
    from langfuse.langchain import CallbackHandler
    import os


    # --- 模型 ---
    model = ChatDeepSeek(
        model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
        api_key='sk-08b1f9a1961e4b13a4d7ca9060e7cf4a',
        base_url=os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com"),
        temperature=0.3,
    )

    langfuse = Langfuse()
    langfuse_handler = CallbackHandler()

    # --- Prompt ---
    ec_agent_prompt = langfuse.get_prompt("default_prompt")

    # --- Agent ---
    agent = create_agent(
        model=model,
        tools=[],
        system_prompt=ec_agent_prompt.prompt,
    )

    # --- 调用 ---
    result = agent.invoke(
        {"messages": [{"role": "user", "content": "你好"}]},
        config={
            "callbacks": [langfuse_handler],
            "metadata": {"langfuse_prompt": ec_agent_prompt},
        },
    )

    print(result)


    # Langfuse开启批处理
    import os

    # 每次刷新时最多发送的事件数
    os.environ["LANGFUSE_FLUSH_AT"]="30"

    # 队列最大等待时间(毫秒)
    os.environ["LANGFUSE_FLUSH_INTERVAL"]="2000"

    # 设置全局采样率
    os.environ["LANGFUSE_SMPLE_RATE"]="0.5" # 仅记录50%的请求


    # 获取langfuse中的提示词
    ec_agent_prompt = langfuse.get_prompt("ec-agent", label="production") # 这里的label="production" 这个不写也可以 默认是这个

    # 按版本号拉取
    ec_agent_prompt = langfuse.get_prompt('ec-agent', version=1)

    print("Name", ec_agent_prompt.name) # 输出ec-agent
    print("Version", ec_agent_prompt.version) # 输出1(整数)
    print("Is Fallback", ec_agent_prompt.is_fallback) # 正常情况下应该为False
    print("Prompt", ec_agent_prompt.prompt) # 提示词全文


    # 🚀 把动态Prompt注入到LLM应用
    from langchain.chat_models import init_chat_model

    model = init_chat_model()

    from langchain.agents import create_agent

    agent = create_agent(
        model = model,
        tools=[],
        system_prompt=ec_agent_prompt.prompt
    )

    # 在Observation上下文调用,并携带prompt信息
    with langfuse.start_as_current_observation(name="langchain_call"):
        with propagate_attributes():
            result = agent.invoke(
                {"messages": [{"role": "user", "content": "上海的天气怎么样?"}]},
                config={
                    "callback": [langfuse_handler],
                    "meta": {"langfuse_prompt": ec_agent_prompt}
                }
            )

    # 确保数据完全发送
    langfuse.flush()


    prompt = lanfuse.get_prompt(
        "move-xc",
        callback="when error prompt", # 兜底提示词
        cache_ttl_seconds=300, # 0 开发调试时不要缓存
        label="latest"
    )


    # 🚀 在提示词中使用配置
    from langfuse import get_client
    from langchain.openai import OpenAI

    langfuse = get_client()

    prompt = langfuse.get_template('invoice-extractor')

    cfg = prompt.config
    model = cfg.get('model')
    temperature = cfg.get('temperature')

    agent = OpenAI(
        model=model,
        temperature=cfg.temperature,
        message=prompt.prompt
    )

    # 🌿实战:给 RAG 应用加追踪

    import openai
    from langfuse.decorators import observe, langfuse_context

    """
    用 @observe 装饰器,自动帮你创建 trace/spans
    比手写 trace/generation 方便得多
    """

    class RAGChat:
        def __init__(self):
            self.client = openai.OpenAI()

        @observe(name="retrieve_docs", as_type="span")
        def retrieve_docs(self, query: str) -> list:
            """检索相关文档 -- 这一步会被自动记录为 span"""
            # 模拟向量检索
            docs = [
                "Langfuse 是一个 LLM 可观测平台",
                "它支持 trace、evaluation、prompt management",
            ]
            # 记录检索的额外信息
            langfuse_context.update_current_observation(
                input=query,
                metadata={"docs_count": len(docs)}
            )
            return docs

        @observe(name="generate_answer", as_type="generation")
        def generate_answer(self, query: str, context: list) -> str:
            """LLM 生成回答 -- 自动记录为 generation"""
            prompt = f"""基于以下信息回答问题:

            上下文:{' '.join(context)}
            问题:{query}
            回答:"""

            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            )

            result = response.choices[0].message.content

            # 记录 token 用量(自动从 response 读取)
            langfuse_context.update_current_observation(
                input=prompt,
                output=result,
                usage={
                    "input": response.usage.prompt_tokens,
                    "output": response.usage.completion_tokens,
                },
                model="gpt-4o",
            )

            return result

        @observe(name="rag_chat")  # 整个 trace
        def chat(self, query: str) -> str:
            """完整的 RAG 流程"""
            docs = self.retrieve_docs(query)
            answer = self.generate_answer(query, docs)
            return answer


    # 使用
    rag = RAGChat()
    result = rag.chat("Langfuse 是什么?")
    print(result)


    # ⚖打分与评估
    # 🤔人工评分
    # 在代码里记录评分
    trace = langfuse.trace(name="qa_chat", user_id="user_001")

    # 数值分(0-1)
    trace.score(
        name="helpfulness",
        value=0.85,
        comment="回答基本正确,但不够详细"
    )

    # 分类分
    trace.score(
        name="hallucination",
        value="none",        # 可选: none / low / medium / high
        data_type="CATEGORICAL"
    )

    # 布尔分
    trace.score(
        name="contains_toxic",
        value=True,          # 或 False
        data_type="BOOLEAN"
    )

    # 或者在 Langfuse UI 上直接打分
    # Trace 详情页 → 右侧 Score 面板 → 点 Add Score

    # 🤖自动评估(LLM-as-a-Judge)
    from langfuse import Langfuse
    from langfuse.evaluations import LlmJudge

    # 在 Langfuse 平台上配置 LLM Judge 评估器
    # Settings → Evaluations → 新建

    # 或者用 SDK 定义简单评估
    from langfuse.evaluations import StringEvaluator

    def check_briefness(output: str, expected: str) -> float:
        """检查回答是否太短(<20个字算差)"""
        return 1.0 if len(output) > 20 else 0.0

    # 批量跑评估
    langfuse.evaluation.run(
        name="briefness_check",
        data=[...],  # trace 列表
        evaluator=StringEvaluator(check_briefness),
    )


    # 🧪 数据集 & 实验
    # 从历史 trace 创建
    dataset = langfuse.create_dataset("qa-test-set")

    # 添加数据
    dataset.append_item(
        input={"query": "什么是Langfuse?"},
        expected_output={"answer": "Langfuse是LLM可观测平台"},
    )

    # 或者在 UI 上手动创建
    # Langfuse → Datasets → 新建

    # 跑实验
    # 用不同 prompt 版本跑同一个数据集
    experiment = langfuse.create_experiment(
        name="prompt-v1-vs-v2",
        dataset_id="qa-test-set",
    )

    # 对数据集里的每个 item 运行
    for item in dataset.items:
        # 用 prompt v1
        result_v1 = chain_v1.invoke(item.input)
        experiment.log(item, result_v1, prompt_version=1)

        # 用 prompt v2
        result_v2 = chain_v2.invoke(item.input)
        experiment.log(item, result_v2, prompt_version=2)


# 📷 Langgraph
# ====================================================================================================================================

    # ⚠️ 版本说明
        # 当前安装: langgraph==1.2.4 (2026.7)
        # 注意: set_finish_point 已废弃,改用 add_edge(node, END)
        # 如果你的版本不同,请注意以下版本差异:
        # - v0.x → v1.0: MessageGraph 已废弃, set_finish_point 已废弃
        # - v1.0+ : 推荐使用 Command API + interrupt() 替代 interrupt_before
        # - v1.1+ : Functional API (@entrypoint / @task) 可用
        # - v1.2+ : Persistence API 统一化
        # 以下标注了 ⚠️ 的内容表示在更高版本中可能不兼容

    # 🚀 Reducer函数机制
        # LangGraph内部原理是:State中的每个key都有自己独立的Reducer函数,通过指定的reducer函数应用判断值更新

    # 🍊 在图中处理消息的思路
        import getpass
        import os
        from langchain_openai import ChatOpenAI
        from langchain_core.prompts import ChatPromptTemplate
        import operator
        from typing import Annotated, TypedDict, List
        from langgraph.graph import StateGraph,  END
        from IPython.display import Image, display
        from langchain_core.messages import SystemMessage, HumanMessage, AIMessage


        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")


        llm = ChatOpenAI(model='gpt-4o')


        # 定义图的状态模式
        class State(TypedDict):
            messages: Annotated[List[str], operator.add] # 💡

        # 创建图的实例
            builder = StateGraph(State)

            def chat_with_model(state):
                print(state)
                print("-----------------")
                messages = state['messages']
                response = llm.invoke(messages)
                return {"messages": [response]}  # 💡

            def convert_messages(state):
                # "您是一位数据提取专家,负责从文本中检索关键信息。请为所提供的文本提取相关信息,并以 JSON 格式输出。概述所提取的关键数据点。"
                EXTRACTION_PROMPT = """
                You are a data extraction specialist tasked with retrieving key information from a text.
                Extract such information for the provided text and output it in JSON format. Outline the key data points extracted.
                """
                print(state)
                print("-----------------")
                messages = state['messages']
                messages = messages[-1]

                messages = [
                    SystemMessage(content=EXTRACTION_PROMPT),
                    HumanMessage(content=state['messages'][-1].content)
                ]

                response = llm.invoke(messages)
                return {"messages": [response]}

            # 添加节点
            builder.add_node("chat_with_model", chat_with_model)
            builder.add_node("convert_messages", convert_messages)

            # 设置启动点
            builder.set_entry_point("chat_with_model")

            # 添加边
            builder.add_edge("chat_with_model", "convert_messages")
            builder.add_edge("convert_messages", END)

            # 编译图
            graph = builder.compile()


            query="你好,请你介绍一下你自己"
            input_message = {"messages": [HumanMessage(content=query)]}

            result = graph.invoke(input_message)

    # 🚀 MessageGraph ⚠️ 已废弃
        # 
        # MessageGraph 在 LangGraph 1.0.0 中已废弃,将在 2.0.0 移除
        # 替代方案:直接用 StateGraph + add_messages
        # 
        # ❌ 旧版(不再使用):
        #   from langgraph.graph.message import MessageGraph
        #   builder = MessageGraph()
        #   builder.add_node(...)
        #
        # ✅ 新版(推荐):
        from typing import Annotated, TypedDict
        from langgraph.graph import StateGraph, START, END
        from langgraph.graph.message import add_messages

        class State(TypedDict):
            messages: Annotated[list, add_messages]

        graph_builder = StateGraph(State)

    # 🎯 路由代理
        from langgraph.graph import StateGraph, START, END

        def node_a(state):
            return {"x": state["x"] + 1}

        def node_b(state):
            return {"x": state["x"] - 2}

        def node_c(state):
            return {"x": state["x"] + 1}

        def routing_function(state):
            if state["x"] == 10:
                return True
            else:
                return False

        builder = StateGraph(dict)

        builder.add_node("node_a", node_a)
        builder.add_node("node_b", node_b)
        builder.add_node("node_c", node_c)

        # ⚠️ set_entry_point 仍可用,但推荐用 add_edge(START, node)
        # builder.set_entry_point("node_a")  # 旧写法
        builder.add_edge(START, "node_a")  # ✅ 新版推荐写法

        # 构建节点之间的边
        builder.add_conditional_edges("node_a", routing_function, {True: "node_b", False: "node_c"})

        builder.add_edge("node_b", END)
        builder.add_edge("node_c", END)

        graph = builder.compile()

        from IPython.display import Image, display

        display(Image(graph.get_graph(xray=True).draw_mermaid_png()))


        """
        这里我们先来了解一下什么是结构化输出。在LangGraph中,实现结构化输出可以通过以下三种有效方式完成
        - 提示工作:指示大模型以特定格式做出回应
        - 输出解析器:采用后处理的方法从大模型的响应中提取结构化数据
        - 工具调用:利用一些内置工具调用功能来生成结构化输出
        """

    # 💡 小知识: StateGraph 初始化参数
        # StateGraph(state_schema, context_schema=None, input_schema=None, output_schema=None)
        # - state_schema: 图的状态模式(必填)
        # - context_schema: 运行上下文(可选,现在更推荐直接用 Command/Store)
        # - input_schema: 定义图入口接收的数据结构
        # - output_schema: 定义图最终的输出数据结构
        #
        # ✅ 推荐的分层 State 实践:
        #   class OverallState(TypedDict):  # 全局共享
        #       messages: Annotated[list, add_messages]
        #   class PrivateState(TypedDict):  # 节点私有
        #       internal_cache: str

    # 🚀 提示工程
        from langchain_core.prompts import ChatPromptTemplate
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Answer the user query. Wrap the output in `json`",
                ),
                ("human", "{query}"),
            ]
        )

        # 🚀提示工程+输出解析器
        from langchain_core.messages import AIMessage
        import json
        import re
        from typing import List

        def extract_json(message: AIMessage) -> List[dict]:
            """Extracts JSON content from a string where JSON is embedded between \`\`\`json and \`\`\` tags.

            Parameters:
                text (str): The text containing the JSON content.

            Returns:
                list: A list of extracted JSON strings.
            """
            text = message.content
            # 定义正则表达式模式来匹配JSON块
            pattern = r"\`\`\`json(.*?)\`\`\`"

            # 在字符串中查找模式的所有非重叠匹配
            matches = re.findall(pattern, text, re.DOTALL)

            # 返回匹配的JSON字符串列表,去掉任何开头或结尾的空格
            try:
                return [json.loads(match.strip()) for match in matches]
            except Exception:
                raise ValueError(f"Failed to parse: {message}")


        from langchain_core.prompts import ChatPromptTemplate
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Answer the user query. Wrap the output in `json`",
                ),
                ("human", "{query}"),
            ]
        )
        chain = prompt | llm | extract_json

    # 🚀 使用Pydantic做结构化输出
        from typing import Optional
        from pydantic import BaseModel, Field

        # 定义 Pydantic 模型
        class UserInfo(BaseModel):
            """Extracted user information, such as name, age, email, and phone number, if relevant."""
            name: str = Field(description="The name of the user")
            age: Optional[int] = Field(description="The age of the user")
            email: str = Field(description="The email address of the user")
            phone: Optional[str] = Field(description="The phone number of the user")

        import getpass
        import os

        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

        from langchain_openai import ChatOpenAI

        llm = ChatOpenAI(model="gpt-4o-mini")

        structured_llm = llm.with_structured_output(UserInfo)
        # 从非结构化文本中提取用户信息
        extracted_user_info = structured_llm.invoke("我叫木羽,今年28岁,邮箱地址是snow@gmial.com,电话是1234567052")


        # isinstance 函数用于判断一个对象是否是一个已知的类型,或者是该类型的子类的实例
        if isinstance(extracted_user_info, UserInfo):
            print("执行节点A的逻辑")
        else:
            print("执行节点B的逻辑")

    # 🚀 使用TypedDict做结构化输出
        from typing import Optional
        from typing_extensions import Annotated, TypedDict

        # 定义 TypedDict 模型
        class UserInfo(TypedDict):
            """Extracted user information from text"""
            name: Annotated[str, ..., "The user's name"]
            age: Annotated[Optional[int], None, "The user's age"]
            email: Annotated[str, ..., "The user's email address"]
            phone: Annotated[Optional[str], None, "The user's phone number"]

        structured_llm = llm.with_structured_output(UserInfo)

        # 从非结构化文本中提取用户信息
        extracted_user_info = structured_llm.invoke("我叫陈朋成,今年38岁,邮箱地址是snow@gmial.com,电话是1234567052")

    # 🚀 结合结构化输出构建路由图
        from typing import Union, Optional
        from pydantic import BaseModel, Field

        # 定义数据库插入的用户信息模型
        class UserInfo(BaseModel):
            """Extracted user information, such as name, age, email, and phone number, if relevant."""
            name: str = Field(description="The name of the user")
            age: Optional[int] = Field(description="The age of the user")
            email: str = Field(description="The email address of the user")
            phone: Optional[str] = Field(description="The phone number of the user")


        # 定义正常生成模型回复的模型
        class ConversationalResponse(BaseModel):
            """Respond to the user's query in a conversational manner. Be kind and helpful."""
            response: str = Field(description="A conversational response to the user's query")


        # 定义最终响应模型,可以是用户信息或一般响应
        class FinalResponse(BaseModel):
            final_output: Union[UserInfo, ConversationalResponse]

        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

        # 生成模型实例
        llm = ChatOpenAI(model="gpt-4o-mini")


        # pip install sqlalchemy pymysql
        from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData
        from sqlalchemy.orm import declarative_base, sessionmaker


        # 创建基类
        Base = declarative_base()

        # 定义 UserInfo 模型
        class User(Base):
            __tablename__ = 'users'
            id = Column(Integer, primary_key=True)
            name = Column(String(50))
            age = Column(Integer)
            email = Column(String(100))
            phone = Column(String(15))


        # 数据库连接 URI,这里要替换成自己的Mysql 连接信息,以下是各个字段的对应解释:
        # root:MySQL 数据库的用户名。
        # snowball950123:MySQL 数据库的密码。
        # 192.168.110.131:MySQL 服务器的 IP 地址。
        # langgraph_agent:要连接的数据库的名称。
        # charset=utf8mb4:设置数据库的字符集为 utf8mb4,支持更广泛的 Unicode 字符
        DATABASE_URI = 'mysql+pymysql://root:snowball950123@192.168.110.131/langgraph_agent?charset=utf8mb4'
        engine = create_engine(DATABASE_URI, echo=True)

        # 如果表不存在,则创建表
        Base.metadata.create_all(engine)

        # 创建会话
        Session = sessionmaker(bind=engine)


        def chat_with_model(state):
            """generate structured output"""
            print(state)
            print("-----------------")
            messages = state['messages']
            structured_llm = llm.with_structured_output(FinalResponse)
            response = structured_llm.invoke(messages)
            return {"messages": [response]}

        def final_answer(state):
            """generate natural language responses"""
            print(state)
            print("-----------------")
            messages = state['messages'][-1]
            response = messages.final_output.response
            return {"messages": [response]}

        def insert_db(state):
            """Insert user information into the database"""
            session = Session()  # 确保为每次操作创建新的会话
            try:
                result = state['messages'][-1]
                output = result.final_output
                # 创建用户实例
                user = User(name=output.name, age=output.age, email=output.email, phone=output.phone)
                # 添加到会话
                session.add(user)
                # 提交事务
                session.commit()
                return {"messages": [f"数据已成功存储至Mysql数据库。"]}
            except Exception as e:
                session.rollback()  # 出错时回滚
                return {"messages": [f"数据存储失败,错误原因:{e}"]}
            finally:
                session.close()  # 关闭会话

        # 定义好了所有节点函数后,开始构建图
        from langgraph.graph import StateGraph, END
        from typing import TypedDict, Annotated
        import operator
        from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, ToolMessage

        class AgentState(TypedDict):
            messages: Annotated[list[AnyMessage], operator.add]

        def generate_branch(state: AgentState):
            result = state['messages'][-1]
            output = result.final_output

            if isinstance(output, UserInfo):
                return True
            elif isinstance(output, ConversationalResponse):
                return False

        graph = StateGraph(AgentState)

        # 添加三个节点
        graph.add_node("chat_with_model", chat_with_model)
        graph.add_node("final_answer", final_answer)
        graph.add_node("insert_db", insert_db)

        # 设置图的启动节点
        graph.set_entry_point("chat_with_model")

        # 设置条件边
        graph.add_conditional_edges(
            "chat_with_model",
            generate_branch,
            {True: "insert_db", False: "final_answer"}
        )

        # 设置终止节点
        graph.add_edge("final_answer", END)
        graph.add_edge("insert_db", END)

        # 编译图
        graph = graph.compile()

        query="我叫木羽,今年28岁,邮箱地址是snow@gmial.com,电话是1323521313"
        input_message = {"messages": [HumanMessage(content=query)]}
        graph.invoke(input_message)

    # 🎯 工具调用代理
        class SearchQuery(BaseModel):
            query: str = Field(description="Questions for networking queries")
        @tool(args_schema = SearchQuery)
        def fetch_real_time_info(query):
            """Get real-time Internet information"""
            url = "https://google.serper.dev/search"
            payload = json.dumps({
              "q": query,
              "num": 1,
            })
            headers = {
              'X-API-KEY': os.getenv('SERPER_API_KEY', 'your-key-here'),  # ⚠️ 改为环境变量,不要硬编码
              'Content-Type': 'application/json'
            }

            response = requests.post(url, headers=headers, data=payload)
            data = json.loads(response.text)  # 将返回的JSON字符串转换为字典
            if 'organic' in data:
                return json.dumps(data['organic'],  ensure_ascii=False)  # 返回'organic'部分的JSON字符串
            else:
                return json.dumps({"error": "No organic results found"},  ensure_ascii=False)  # 如果没有'organic'键,返回错误信息


        class WeatherLoc(BaseModel):
            location: str = Field(description="The location name of the city")
        @tool(args_schema = WeatherLoc)
        def get_weather(location):
            """Call to get the current weather."""
            if location.lower() in ["beijing"]:
                return "北京的温度是16度,天气晴朗。"
            elif location.lower() in ["shanghai"]:
                return "上海的温度是20度,部分多云。"
            else:
                return "不好意思,并未查询到具体的天气信息。"


        class UserInfo(BaseModel):
            """Extracted user information, such as name, age, email, and phone number, if relevant."""
            name: str = Field(description="The name of the user")
            age: Optional[int] = Field(description="The age of the user")
            email: str = Field(description="The email address of the user")
            phone: Optional[str] = Field(description="The phone number of the user")
        @tool(args_schema = UserInfo)
        def insert_db(name, age, email, phone):
            """Insert user information into the database, The required parameters are name, age, email, phone"""
            session = Session()  # 确保为每次操作创建新的会话
            try:
                # 创建用户实例
                user = User(name=name, age=age, email=email, phone=phone)
                # 添加到会话
                session.add(user)
                # 提交事务
                session.commit()
                return {"messages": [f"数据已成功存储至Mysql数据库。"]}
            except Exception as e:
                session.rollback()  # 出错时回滚
                return {"messages": [f"数据存储失败,错误原因:{e}"]}
            finally:
                session.close()  # 关闭会话


        from langgraph.prebuilt import ToolNode
        tools = [insert_db, fetch_real_time_info, get_weather]
        tool_node = ToolNode(tools)


        import getpass
        import os
        from langchain_openai import ChatOpenAI
        from langchain_core.prompts import ChatPromptTemplate

        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")


        llm = ChatOpenAI(model="gpt-4o")

        model_with_tools = llm.bind_tools(tools)



        # 定义正常生成模型回复的模型
        class ConversationalResponse(BaseModel):
            """Respond to the user's query in a conversational manner. Be kind and helpful."""
            response: str = Field(description="A conversational response to the user's query")


        # 定义最终响应模型,可以是用户信息或一般响应
        class FinalResponse(BaseModel):
            final_output: Union[ConversationalResponse, SearchQuery, WeatherLoc, UserInfo]


        # 依次定义三个节点函数
        def chat_with_model(state):
            """generate structured output"""
            print(state)
            print("-----------------")
            messages = state['messages'] # 此时才开始,只有一个message在messages列表里面
            structured_llm = llm.with_structured_output(FinalResponse)
            response = structured_llm.invoke(messages)
            return {"messages": [response]}


        def final_answer(state):
            """gxenerate natural language responses"""
            print(state)
            print("-----------------")
            messages = state['messages'][-1]
            response = messages.final_output.response
            return {"messages": [response]}


        def execute_function(state):
            """generate natural language responses"""
            print(state)
            print("-----------------")
            messages = state['messages'][-1].final_output
            # model_with_tools = llm.bind_tools(tools)
            # tool_node = ToolNode(tools)
            response = tool_node.invoke({"messages": [model_with_tools.invoke(str(messages))]}) # ⚡

            print(f"response:{response}")
            response = response["messages"][0].content
            return {"messages": [response]}


        # 定义图的状态模式
        import operator
        class AgentState(TypedDict):
            messages: Annotated[list[AnyMessage], operator.add]


        def generate_branch(state: AgentState):
            result = state['messages'][-1]
            output = result.final_output

            if isinstance(output, ConversationalResponse):
                return False
            else:
                return True

        # 现在构建图
        graph = StateGraph(AgentState)

        # 添加三个节点
        graph.add_node("chat_with_model", chat_with_model)
        graph.add_node("final_answer", final_answer)
        graph.add_node("execute_function", execute_function)

        # 设置图的启动节点
        graph.set_entry_point("chat_with_model")

        # 设置条件边
        graph.add_conditional_edges(
            "chat_with_model",
            generate_branch,
            {True: "execute_function", False: "final_answer"}
        )

        # 设置终止节点
        graph.add_edge("final_answer", END)
        graph.add_edge("execute_function", END)

        # 编译图
        graph = graph.compile()

    # 🎯 自治循环代理
        from sqlalchemy import create_engine, Column, Integer, String, Float
        from sqlalchemy.orm import sessionmaker, declarative_base

        # 创建基类
        Base = declarative_base()

        # 定义 WeatherInfo 模型
        class Weather(Base):
            __tablename__ = 'weather'
            city_id = Column(Integer, primary_key=True)  # 城市ID
            city_name = Column(String(50))                # 城市名称
            main_weather = Column(String(50))             # 主要天气状况
            description = Column(String(100))              # 描述
            temperature = Column(Float)                    # 温度
            feels_like = Column(Float)                    # 体感温度
            temp_min = Column(Float)                      # 最低温度
            temp_max = Column(Float)                      # 最高温度


        # 数据库连接 URI,这里要替换成自己的Mysql 连接信息,以下是各个字段的对应解释:
        # root:MySQL 数据库的用户名。
        # snowball950123:MySQL 数据库的密码。
        # 192.168.110.131:MySQL 服务器的 IP 地址。
        # langgraph_agent:要连接的数据库的名称。
        # charset=utf8mb4:设置数据库的字符集为 utf8mb4,支持更广泛的 Unicode 字符
        DATABASE_URI = 'mysql+pymysql://root:snowball950123@192.168.110.131/langgraph_agent?charset=utf8mb4'
        engine = create_engine(DATABASE_URI)

        # 如果表不存在,则创建表
        Base.metadata.create_all(engine)

        # 创建会话
        Session = sessionmaker(bind=engine)


        from langchain_core.tools import tool
        from typing import Union, Optional
        from pydantic import BaseModel, Field
        import requests

        class WeatherLoc(BaseModel):
            location: str = Field(description="The location name of the city")
        @tool(args_schema=WheatherLoc)
        def get_weather(location):
            """
            Function to query current weather.
            :param loc: Required parameter, of type string, representing the specific city name for the weather query. \
            Note that for cities in China, the corresponding English city name should be used. For example, to query the weather for Beijing, \
            the loc parameter should be input as 'Beijing'.
            :return: The result of the OpenWeather API query for current weather, with the specific URL request address being: https://api.openweathermap.org/data/2.5/weather. \
            The return type is a JSON-formatted object after parsing, represented as a string, containing all important weather information.
            """
            # Step 1.构建请求
            url = "https://api.openweathermap.org/data/2.5/weather"

            # Step 2.设置查询参数
            params = {
                "q": location,
                "appid": "7b34ea15a881668d4255910e5899920c",    # 输入API key
                "units": "metric",            # 使用摄氏度而不是华氏度
                "lang":"zh_cn"                # 输出语言为简体中文
            }

            # Step 3.发送GET请求
            response = requests.get(url, params=params)

            # Step 4.解析响应
            data = response.json()
            return json.dumps(data)


        # pip install sqlalchemy pymysql
        from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData
        from sqlalchemy.orm import declarative_base, sessionmaker

        class WeatherInfo(BaseModel):
            """Extracted weather information for a specific city."""
            city_id: int = Field(..., description="The unique identifier for the city")
            city_name: str = Field(..., description="The name of the city")
            main_weather: str = Field(..., description="The main weather condition")
            description: str = Field(..., description="A detailed description of the weather")
            temperature: float = Field(..., description="Current temperature in Celsius")
            feels_like: float = Field(..., description="Feels-like temperature in Celsius")
            temp_min: float = Field(..., description="Minimum temperature in Celsius")
            temp_max: float = Field(..., description="Maximum temperature in Celsius")
        @tool(args_schema=WeatherInfo)
        def insert_weather_to_db(city_id, city_name, main_weather, description, temperature, feels_like, temp_min, temp_max):
            """Insert weather information into the database."""
            session = Session()  # 确保为每次操作创建新的会话
            try:
                # 创建天气实例
                weather = Weather(
                    city_id=city_id,
                    city_name=city_name,
                    main_weather=main_weather,
                    description=description,
                    temperature=temperature,
                    feels_like=feels_like,
                    temp_min=temp_min,
                    temp_max=temp_max
                )
                # 使用 merge 方法来插入或更新(如果已有记录则更新)
                session.merge(weather)
                # 提交事务
                session.commit()
                return {"messages": [f"天气数据已成功存储至Mysql数据库。"]}
            except Exception as e:
                session.rollback()  # 出错时回滚
                return {"messages": [f"数据存储失败,错误原因:{e}"]}
            finally:
                session.close()  # 关闭会话


        class QueryWeatherSchema(BaseModel):
            """Schema for querying weather information by city name."""
            city_name: str = Field(..., description="The name of the city to query weather information")
        @tool(args_schema=QueryWeatherSchema)
        def query_weather_from_db(city_name: str):
            """Query weather information from the database by city name."""
            session = Session()
            try:
                # 查询天气数据
                weather_data = session.query(Weather).filter(Weather.city_name == city_name).first()
                if weather_data:
                    return {
                        "city_id": weather_data.city_id,
                        "city_name": weather_data.city_name,
                        "main_weather": weather_data.main_weather,
                        "description": weather_data.description,
                        "temperature": weather_data.temperature,
                        "feels_like": weather_data.feels_like,
                        "temp_min": weather_data.temp_min,
                        "temp_max": weather_data.temp_max
                    }
                else:
                    return {"messages": [f"未找到城市 '{city_name}' 的天气信息。"]}
            except Exception as e:
                return {"messages": [f"查询失败,错误原因:{e}"]}
            finally:
                session.close()  # 关闭会话


        # 然后,定义实时联网检索外部工具,通过该函数获取最新的网络数据信息
        class SearchQuery(BaseModel):
            query: str = Field(description="Questions for networking queries")
        @tool(args_schema = SearchQuery)
        def fetch_real_time_info(query):
            """Get real-time Internet information"""
            url = "https://google.serper.dev/search"
            payload = json.dumps({
              "q": query,
              "num": 1,
            })
            headers = {
              'X-API-KEY': os.getenv('SERPER_API_KEY', 'your-key-here'),  # ⚠️ 改为环境变量
              'Content-Type': 'application/json'
            }

            response = requests.post(url, headers=headers, data=payload)
            data = json.loads(response.text)  # 将返回的JSON字符串转换为字典
            if 'organic' in data:
                return json.dumps(data['organic'],  ensure_ascii=False)  # 返回'organic'部分的JSON字符串
            else:
                return json.dumps({"error": "No organic results found"},  ensure_ascii=False)  #

        tools = [fetch_real_time_info, get_weather, insert_weather_to_db, query_weather_from_db]


        # 创建llm
        import getpass
        import os
        from langchain_openai import ChatOpenAI

        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

        llm = ChatOpenAI(model="gpt-4o")

    # 🚀 创建ReAct代理
        from langgraph.prebuilt import create_react_agent

        graph = create_react_agent(llm, tools=tools) # ⚙️ 我们可以逐步分析和解释一下这一行代码中的涉及的图构建过程

        # ⚙️ step 1: 定义状态模式
        from typing import Annotated
        from typing_extensions import TypedDict
        from langgraph.graph.message import add_messages
        class State(TypedDict):
            messages: Annotated[list, add_messages]

        # ⚙️ step2: 定义Router Function
        # 定义决定是否继续执行任务的路由函数
        def should_continue(state: State):
            messages = state["messages"]
            last_message = messages[-1]
            # 如果不是工具调用,则结束
            if not last_message.tool_calls:
                return END
            # 如果是的话,则进入工具库中选择函数执行
            else:
                return "tools"

        # ⚙️ step3: 定义大模型的交互函数
        from typing import Literal
        from langchain_core.runnables import RunnableConfig
        # 定义大模型交互的节点函数
        async def call_model(state: State, config: RunnableConfig):
            messages = state["messages"]
            response = await model.ainvoke(messages, config)
            # 将调用大模型后得到的响应,追加到消息列表中
            return {"messages": response}

        # ⚙️ step4: 构建图结构
        from langgraph.graph import END, START, StateGraph
        # 定义一个新图
        workflow = StateGraph(State)
        workflow.add_node("agent", call_model)
        workflow.add_node("tools", tool_node)
        # 设置起始节点为 agent
        workflow.add_edge(START, "agent")
        # 添加条件边 -- > Router Agent
        workflow.add_conditional_edges(
            "agent",
            should_continue,
            ["tools", END],
        )
        # 添加回调边
        workflow.add_edge("tools", "agent")
        # 编译图
        app = workflow.compile()

    # 🐠 流式输出
        """
        五种流式模式的对比

                   message模式               updates模式             values模式                      custom模式             debug模式
        ----------------------------------------------------------------------------------------------------------------------------------------------
        流式单位    LLM令牌/消息块            状态增量更新            完整状态快照                     自定义业务数据          详细调试信息
        ----------------------------------------------------------------------------------------------------------------------------------------------
        数据粒度    最细(字符级)            中等(字段级)            最粗(状态级)                    灵活可定义             最详细(节点级)
        ----------------------------------------------------------------------------------------------------------------------------------------------
        主要用途    聊天界面,逐字输出        状态监控,进度跟踪       调试、审计                        业务事件通知           深度调试和性能分析
        ----------------------------------------------------------------------------------------------------------------------------------------------
        性能开销    中等                     最低                     最高                            低                    非常高
        ----------------------------------------------------------------------------------------------------------------------------------------------
        网络传输    适合实时传输              高效,适合频繁更新       数据量大,适合内网                按需定义               不适合生产环境
        ----------------------------------------------------------------------------------------------------------------------------------------------
        适用场景    聊天机器人界面            生产环境下的状态同步     调试和开发阶段需要查看完整状态      进度条和状态更新       深度调试和性能分析
                   需要实时显示AI思考过程     需要高效网络传输的场景   需要全局上下文进行审计追踪          业务特定的通知消息     排查复杂的执行问题
                   提升用户交互体验          实时监控特定字段的变化    状态规模较小或网络带宽充足的情况    调试和监控信息         学习和理解langgraph内部机制
        """
        def print_stream(stream):
            for sub_stream in stream:
                # print(sub_stream)  # 就是上面的示例中非流式直接调用的全部信息
                message = sub_stream["messages"][-1]
                message.pretty_print() # 🤔 以更容易人理解的格式输出

        input_message = {"messages": ["你好,南京现在的天气怎么样?"]}
        print_stream(graph.stream(input_message, stream_mode="values"))

    # 🚂 Langgraph中的事件流
        async for event in graph.astream_events({"messages": ["你好,请你介绍一下你自己"]}, version="v2"):
            kind = event["event"]
            print(f"{kind}: {event['name']}")

        """
        on_chain_start: LangGraph
        on_chain_start: __start__
        on_chain_end: __start__
        on_chain_start: agent
        on_chain_start: call_model
        on_chain_start: RunnableSequence
        on_chain_start: StateModifier
        on_chain_end: StateModifier
        on_chat_model_start: ChatOpenAI
        on_chat_model_stream: ChatOpenAI
        on_chat_model_stream: ChatOpenAI
        ...
        on_chat_model_stream: ChatOpenAI
        on_chat_model_stream: ChatOpenAI
        on_chat_model_end: ChatOpenAI
        on_chain_end: RunnableSequence
        on_chain_end: call_model
        on_chain_start: _write
        on_chain_end: _write
        on_chain_start: should_continue
        on_chain_end: should_continue
        on_chain_stream: agent
        on_chain_end: agent
        on_chain_stream: LangGraph
        on_chain_end: LangGraph
        """

        # 🍋 我们可以从中提取具体的某个event事件,比如
            events = []
            async for event in graph.astrea_events({"messages": ["你好,请你介绍一下你自己"]}, version="vw"):
                events.append(event)

            """
            所有事件都会包含event、name和data字段:
            - event: 正在发出的事件类型
            - name: 事件的名称
            - data: 事件关联的数据
            """

            # 基于此就可以按照`name`、`tags`或`type`等不同的字段来进行事件过滤,比如我们现在选择仅包含聊天模型的输出:
            async for event in graph.astream_events({"messages": ["你好,请你介绍一下你自己"]}, version="v2"):
                kind = event["event"]
                if kind == "on_chat_model_stream":
                    print(event, end="|", flush=True)


            """
            每种类型的事件都包含不同格式的数据。而其中`data`是一个非常重要的,包含此事件的实际数据。
            在`on_chat_model_stream`事件中,就是需要响应的流式`Token`,如上图所示是一个 `AIMessageChunk`,其中包含消息的`content`以及`id` ,
            提取的代码就非常简单了,直接采用如下代码:
            """
            first = True
            async for msg, metadata in graph.astream({"messages": ["你好,请你介绍一下你自己"]}, stream_mode="messages"):
                if msg.content and not isinstance(msg, HumanMessage):
                    print(msg.content, end="|", flush=True)

                if isinstance(msg, AIMessageChunk):
                    if first:
                        gathered = msg
                        first = False
                    else:
                        gathered = gathered + msg

                    if msg.tool_call_chunks:
                        print(gathered.tool_calls)

    # 💾 LangGraph检查点(Checkpoint)机制 — 短期记忆
        # LangGraph 的检查点(checkpoint)机制是跨轮次对话记忆的基础。
        # 每执行一个节点后,LangGraph 自动保存状态快照到 checkpointer。
        # 使用 thread_id 区分不同对话线程,实现多轮对话记忆。

        # 当前支持的 checkpointer 类型:
        # - MemorySaver (内存): 开发测试用,进程重启后丢失
        # - SqliteSaver (SQLite): 单机持久化,适合原型
        # - PostgresSaver (PostgreSQL): 生产推荐,支持并发
        # - RedisSaver (Redis): 低延迟场景

    # 💾 LangGraph长短期记忆实现机制及检查点的使用(基础)
        import getpass
        import os
        from langchain_openai import ChatOpenAI
        from typing import Annotated
        from typing_extensions import TypedDict
        from IPython.display import Image, display
        from langgraph.graph import StateGraph, MessagesState, START, END
        from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, ToolMessage
        from langgraph.graph.message import add_messages


        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

        # 定义大模型实例
        llm = ChatOpenAI(model="gpt-4o")

        # 定义状态模式
        class State(TypedDict):
            messages: Annotated[list, add_messages]

        # 定义大模型交互节点
        def call_model(state: State):
            response = llm.invoke(state["messages"])
            return {"messages": response}

        # 定义翻译节点
        def translate_message(state: State):
            system_prompt = """
            Please translate the received text in any language into English as output
            """
            messages = state['messages'][-1]
            messages = [SystemMessage(content=system_prompt)] + [HumanMessage(content=messages.content)]
            response = llm.invoke(messages)
            return {"messages": response}

        # 构建状态图
        builder = StateGraph(State)

        # 向图中添加节点
        builder.add_node("call_model", call_model)
        builder.add_node("translate_message", translate_message)

        # 构建边
        builder.add_edge(START, "call_model")
        builder.add_edge("call_model", "translate_message")
        builder.add_edge("translate_message", END)

        # 编译图
        graph = builder.compile()
        # 生成可视化图像结构 这里是测试下图是不是正确的
        display(Image(simple_short_graph.get_graph().draw_mermaid_png()))

    # 💾 检查点的特定实现类型-MemorySaver
        from langgraph.checkpoint.memory import MemorySaver
        checkpointer = MemorySaver()
        graph_width_memory = builder.compile(checkpointer=checkpointer)

        config = {"configurable": {"thread_id": '1'}}

        for chunk in graph_with_memory.stream({"messages": ["你好,我叫木羽"]}, config, stream_mode="values"):
            chunk["messages"][-1].pretty_print()


        for chunk in graph_with_memory.stream({"messages": ["请问我叫什么?"]}, config, stream_mode="values"):
            chunk["messages"][-1].pretty_print()

        for chunk in graph_with_memory.stream({"messages": ["我刚才都问了你什么问题?"]}, config, stream_mode="values"):
            chunk["messages"][-1].pretty_print()

    # 💾 检查点的特定实现类型-SqliteSaver
        # pip install langgraph-checkpoint-sqlite

        from langgraph.checkpoint.sqlite import SqliteSaver

        # 📌 关键:大部分场景你不需要手动调用 checkpointer.put/list
        #    只要在 compile() 时传入 checkpointer,
        #    LangGraph 会自动管理 checkpoint 的保存和恢复。
        #
        #    下面演示的是 手动操作 checkpoint 的低级 API,
        #    了解原理即可,生产代码中极少用到。

        with SqliteSaver.from_conn_string(":memory:") as memory:
            pass  # 实际使用: checkpointer=SqliteSaver.from_conn_string("checkpoints.db")

        # 💾 创建持久化的sqlite存储
        from langgraph.checkpoint.sqlite import SqliteSaver

        # ✅ 推荐用法(编译图时直接传入)
        # checkpointer = SqliteSaver.from_conn_string("checkpoints.db")
        # graph = builder.compile(checkpointer=checkpointer)

    # 💾 创建ReAct代理时,添加Memory
        from langgraph.checkpoint.sqlite import SqliteSaver
        from langgraph.prebuilt import create_react_agent

        with SqliteSaver.from_conn_string(":memory:") as checkpointer:
            graph = create_react_agent(llm, tools=tools, checkpointer=checkpointer)
            display(Image(graph.get_graph().draw_mermaid_png()))

            config = {"configurable": {"thread_id": "1"}}

            for chunk in graph.stream({"messages": ["你好,我叫木羽"]}, config, stream_mode="values"):
                chunk["messages"][-1].pretty_print()

            for chunk in graph.stream({"messages": ["请问我叫什么?"]}, config, stream_mode="values"):
                chunk["messages"][-1].pretty_print()

        # 但,这种方法不能跨单元传播,就是说你的graph只有在with里面使用,不能在with外面使用

        from contextlib import ExitStack

        stack = ExitStack()
        checkpointer = stack.enter_context(SqliteSaver.from_conn_string(":memory:"))
        graph = create_react_agent(llm, tools=tools, checkpointer=checkpointer)

        config = {"configurable": {"thread_id": "102"}}

        for chunk in graph.stream({"messages": ["你好,我叫木羽"]}, config, stream_mode="values"):
            chunk["messages"][-1].pretty_print()

        for chunk in graph.stream({"messages": ["请问我叫什么?"]}, config, stream_mode="values"):
            chunk["messages"][-1].pretty_print()

        stack.close()


        # 异步版本的
        import asyncio
        from contextlib import AsyncExitStack
        from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

        # ⚠️ ExitStack/AsyncExitStack 模式是旧版 workaround
        # 新版 LangGraph 的 SqliteSaver 可以直接作为 context manager 使用:
        # with SqliteSaver.from_conn_string("checkpoints.db") as memory:
        #     graph = create_react_agent(llm, tools=tools, checkpointer=memory)
        #
        # 或者直接创建再编译(最简洁):
        # memory = SqliteSaver.from_conn_string("checkpoints.db")
        # graph = create_react_agent(llm, tools=tools, checkpointer=memory)

        from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

        stack = AsyncExitStack()
        memory = await stack.enter_async_context(AsyncSqliteSaver.from_conn_string(":memory:"))

        graph = create_react_agent(llm, tools=tools, checkpointer=memory)

        config = {"configurable": {"thread_id": "24"}}

        async for chunk in graph.astream({"messages": ["帮我查一下北京的天气"]}, config, stream_mode="values"):
            chunk["messages"][-1].pretty_print()

        await stack.aclose()

    # 🔒 长期记忆和Store(仓库) — InMemoryStore
        # Store 是 LangGraph 的长期记忆层,存储跨对话/跨用户的结构化数据。
        # 与 Checkpointer(短期记忆/会话内)不同,Store 是**跨会话持久化**的。
        #
        # 关键概念:
        # - namespace: 命名空间,类似文件夹路径,如 ("memories", user_id)
        # - key: 每条记忆的唯一标识(通常用 uuid)
        # - value: 存储的内容(dict)

        from langgraph.store.memory import InMemoryStore

        in_memory_store = InMemoryStore()
        user_id = "1"
        namespace_for_memory = ("memories", user_id)

        import uuid
        memory_id = str(uuid.uuid4())
        memory = {"user" : "你好,我叫木羽"}
        in_memory_store.put(namespace_for_memory, memory_id,  memory)

        # 当创建完成后,可以使用store.search读取命名空间中的记忆,这将以列表的形式返回给定用户的所有记忆。最近的记忆是列表中的最后一个。
        memories = in_memory_store.search(namespace_for_memory)
        memories[-1].dict()
        """
        {'value': {'user': '你好,我叫木羽'},
         'key': '6db0b2e0-8e51-4fbd-b3e1-761edf221ea0',
         'namespace': ['1', 'memories'],
         'created_at': '2024-11-01T08:45:59.453639+00:00',
         'updated_at': '2024-11-01T08:45:59.453639+00:00'}
        """

        # 理解了上述过程后,就可以使用Langgraph中的in_memory_store方法了
        import getpass
        import os
        import uuid
        from dataclasses import dataclass
        from langchain_openai import ChatOpenAI
        from typing import Annotated
        from typing_extensions import TypedDict
        from IPython.display import Image, display
        from langgraph.graph import StateGraph, MessagesState, START, END
        from langgraph.graph.message import add_messages
        from langgraph.store.memory import InMemoryStore
        from langgraph.checkpoint.memory import MemorySaver
        from langgraph.runtime import Runtime

        in_memory_store = InMemoryStore()
        checkpointer = MemorySaver()
        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

        # 定义大模型实例
        llm = ChatOpenAI(model="gpt-4o")

        # 定义状态模式
        class State(TypedDict):
            messages: Annotated[list, add_messages]

        # ⚠️ Runtime + context_schema 模式说明
        # LangGraph 1.2.x 仍然支持该模式,但推荐新项目使用以下替代方案:
        # 1. 直接通过 Command API 传参: Command(resume=..., update={"user_id": "xxx"})
        # 2. 用 Store 作为持久化层,不依赖 Runtime.context
        # 3. 在 State 里直接加 user_id 字段(最简单)
        #
        # 定义 Runtime Context 模式
        @dataclass
        class AppContext:
            user_id: str

        # 定义对话节点,访问记忆并在模型调用中使用它们。
        def call_model(state: MessagesState, runtime: Runtime[AppContext]) -> MessagesState:
            # 🐢 存储记忆
            last_message = state["messages"][-1]
            runtime.store.put(namespace, str(uuid.uuid4()), {"data": last_message.content})

            # 获取用户id - 从 runtime.context 拿,类型安全
            user_id = runtime.context.user_id
            # 定义命名空间
            namespace = ("memories", user_id)
            # 根据用户id检索记忆
            memories = runtime.store.search(namespace)
            info = "\n".join([d.value["data"] for d in memories])
            system_msg = f"Answer the user's question in context: {info}"

            response = llm.invoke(
                # ✒把以前的记忆写入到context中
                [{"type": "system", "content": system_msg}] + state["messages"]
            )

            # 🐢 存储记忆
            runtime.store.put(namespace, str(uuid.uuid4()), {"data": response.content})
            return {"messages": response}


        # 构建状态图 - 注册 context_schema
        builder = StateGraph(State, context_schema=AppContext)
        # 向图中添加节点
        builder.add_node("call_model", call_model)
        # 构建边
        builder.add_edge(START, "call_model")
        builder.add_edge("call_model", END)
        # 编译图
        graph = builder.compile(checkpointer=checkpointer, store=in_memory_store)


        config = {"configurable": {"thread_id": "10"}}
        context = AppContext(user_id="6")

        async for chunk in graph.astream({"messages": ["你好,我是木羽"]}, config, context=context, stream_mode="values"):
            chunk["messages"][-1].pretty_print()

    # 🎭 Human-in-the-loop
        import getpass
        import os

        from langchain_openai import ChatOpenAI

        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

        llm = ChatOpenAI(model="gpt-4o-mini")

        # ✂ 标准图结构中添加断点
            import json
            from typing import TypedDict
            from langgraph.graph import StateGraph, START, END
            from IPython.display import Image, display
            from langchain_core.tools import tool
            from langgraph.graph import MessagesState, START
            from langgraph.prebuilt import ToolNode
            from langgraph.checkpoint.memory import MemorySaver
            from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, AIMessage

            # 定义状态模式
            class State(TypedDict):
                user_input: str
                model_response: str
                user_approval: str

            # 定义用于大模型交互的节点
            def call_model(state):
                messages = state["user_input"]
                if '删除' in state["user_input"]:
                    state["user_approval"] = f"用户输入的指令是:{state['user_input']}, 请人工确认是否执行!"
                else:
                    response = llm.invoke(messages)
                    state["user_approval"] = "直接运行!"
                    state["model_response"] = response
                return state


            # 定义人工介入的breakpoint内部的执行逻辑
            def execute_users(state):
                if state["user_approval"] == "是":
                    response = "您的删除请求已经获得管理员的批准并成功执行。如果您有其他问题或需要进一步的帮助,请随时联系我们。"
                    return {"model_response":AIMessage(response)}
                elif state["user_approval"] == "否":
                    response = "对不起,您当前的请求是高风险操作,管理员不允许执行!"
                    return {"model_response":AIMessage(response)}
                else:
                    return state

            # 定义翻译节点
            def translate_message(state: State):
                system_prompt = """
                Please translate the received text in any language into English as output
                """
                messages = state['model_response']
                messages = [SystemMessage(content=system_prompt)] + [HumanMessage(content=messages.content)]
                response = llm.invoke(messages)
                return {"model_response": response}

            # 构建状态图
            builder = StateGraph(State)

            # 向图中添加节点
            builder.add_node("call_model", call_model)
            builder.add_node("execute_users", execute_users)
            builder.add_node("translate_message", translate_message)

            # 构建边
            builder.add_edge(START, "call_model")
            builder.add_edge("call_model", "execute_users")
            builder.add_edge("execute_users", "translate_message")
            builder.add_edge("translate_message", END)

            # 设置 checkpointer,使用内存存储
            memory = MemorySaver()

            # 在编译图的时候,添加短期记忆,并使用interrupt_before参数 设置 在 execute_users 节点之前中止图的运行,等待人工审核
            graph = builder.compile(checkpointer=memory, interrupt_before=["execute_users"])

            # 创建一个线程
            config = {"configurable": {"thread_id": "1"}}
            # 运行图,直至到断点的节点
            async for chunk in graph.astream({"user_input": "我将在数据库中删除 id 为 muyu 的所有信息"}, config,  stream_mode="values"):
                print(chunk)
            """
            {'user_input': '我将在数据库中删除 id 为 muyu 的所有信息'}
            {
                'user_input': '我将在数据库中删除 id 为 muyu 的所有信息',
                'user_approval': '用户输入的指令是:我将在数据库中删除 id 为 muyu 的所有信息, 请人工确认是否执行!'
            }
            """

            """
            通过输出结果,我们可以观察到在执行到`execute_users`节点之前就暂停了,它将等待人工介入以决定是否继续执行。
            这就是`breakpointer`(断点)的关键作用。在这个阶段,我们就可以审查并调整图的状态,而关键的处理逻辑是:
            要修改或确认全局状态模式中`user_approval`字段的值,从而指导`execute_users`节点的行为。

            通过`get_state()`方法,可以查看到截至断点`breakpoint`前,图的运行过程中都产生了哪些状态信息:
            """
            snapshot = graph.get_state(config)
            snapshot

            """
            StateSnapshot(
                values={
                    'user_input': '我将在数据库中删除 id 为 muyu 的所有信息',
                    'user_approval': '用户输入的指令是:我将在数据库中删除 id 为 muyu 的所有信息, 请人工确认是否执行!'
                },
                next=('execute_users',),
                config={
                    'configurable':
                    {'thread_id': '1', 'checkpoint_ns': '', 'checkpoint_id': '1ef9f1de-041a-64e2-8001-41df6d4d90d6'}
                },
                metadata={
                    'source': 'loop',
                    'writes': {
                        'call_model': {
                            'user_input': '我将在数据库中删除 id 为 muyu 的所有信息',
                            'user_approval': '用户输入的指令是:我将在数据库中删除 id 为 muyu 的所有信息, 请人工确认是否执行!'
                        }
                    },
                    'step': 1,
                    'parents': {}
                },
                created_at='2024-11-10T04:40:13.704112+00:00',
                parent_config={
                    'configurable': {'thread_id': '1', 'checkpoint_ns': '', 'checkpoint_id': '1ef9f1de-0417-6dde-8000-f38b5281a68b'}
                },
                tasks=(
                    PregelTask(
                        id='97ac593e-6b41-43e9-b81b-ee0e1dc49c01',
                        name='execute_users',
                        path=('__pregel_pull', 'execute_users'),
                        error=None,
                        interrupts=(),
                        state=None)
                    )
                )
            """

            """
            我们先来看如何在图中止运行后,在图状态中添加用户的决策。

            为实现这一点,我们可以手动设置`snapshot.values['user_approval']`为'是',用以说明在即将执行的`execute_users`节点,
            人工审批的状态被手动设定为同意。接下来,使用`graph.update_state(config, snapshot.values)`来更新状态图中的状态。
            这个调用将状态图中的当前状态更新为包含了新的`user_approval`值的`snapshot.values`。
            """
            snapshot.values['user_approval']='是'
            graph.update_state(config, snapshot.values)
            """
            {'configurable': {'thread_id': '1',
              'checkpoint_ns': '',
              'checkpoint_id': '1ef9f1e1-81db-6516-8002-8b1478becc9d'}}
            """
            """
            修改完状态后,如果想让图基于`breakpoint`继续执行后续的操作,则只需要在`astream`方法中将`input`参数设置为 `None`,
            则会让图形从上次中断的地方继续。如下代码所示:
            """
            async for chunk in graph.astream(None, config, stream_mode="values"):
                print(chunk)
            """"""
            """
            {'user_input': '我将在数据库中删除 id 为 muyu 的所有信息', 'user_approval': '是'}
            {'user_input': '我将在数据库中删除 id 为 muyu 的所有信息', 'model_response': AIMessage(content='您的删除请求已经获得管理员的批准并成功执行。如果您有其他问题或需要进一步的帮助,请随时联系我们。', additional_kwargs={}, response_metadata={}), 'user_approval': '是'}
            {'user_input': '我将在数据库中删除 id 为 muyu 的所有信息', 'model_response': AIMessage(content='Your deletion request has been approved by the administrator and successfully executed. If you have any other questions or need further assistance, please feel free to contact us.', additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 31, 'prompt_tokens': 53, 'total_tokens': 84, 'prompt_tokens_details': {'cached_tokens': 0, 'audio_tokens': 0}, 'completion_tokens_details': {'reasoning_tokens': 0, 'audio_tokens': 0, 'accepted_prediction_tokens': 0, 'rejected_prediction_tokens': 0}}, 'model_name': 'gpt-4o-mini-2024-07-18', 'system_fingerprint': 'fp_0ba0d124f1', 'finish_reason': 'stop', 'logprobs': None}, id='run-1db8104c-678e-49e3-b468-f7c77f6fc57d-0', usage_metadata={'input_tokens': 53, 'output_tokens': 31, 'total_tokens': 84, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 0}}), 'user_approval': '是'}
            """

            """
            等待人工输入是一种常见的 HIL 交互模式,它能够允许我们构建的代理向用户提出需要确认的问题,并等待确认输入后再继续。其中具体要执行的关键步骤是:
            1. 需要在图编译时通过`interrupt_before`或者`interrupt_after`设置断点。
            2. 需要在图编译时设置一个`checkpointer` 来保存图的状态。
            3. 需要使用 `.update_state` 来更新图的状态,其中要包含我们得到的人工响应。
            4. 恢复图的执行,等待图运行结束,输出最终的响应结果。
            """

        # 🚀 我们可以把上述过程构建成一个具备多轮对话形式的人机交互流程,如下:
            # 创建一个函数来封装对话逻辑
            def run_dialogue(graph, config, all_chunks=[]):
                while True:
                    # 接收用户输入
                    user_input = input("请输入您的消息(输入'退出'结束对话):")
                    if user_input.lower() == '退出':
                        break

                    # 运行图,直至到断点的节点
                    for chunk in graph.stream({"user_input": user_input}, config, stream_mode="values"):
                        all_chunks.append(chunk)

                    # 处理可能的审批请求
                    last_chunk = all_chunks[-1]
                    if last_chunk["user_approval"] ==  f"用户输入的指令是:{last_chunk['user_input']}, 请人工确认是否执行!":
                        user_approval = input(f"当前用户的输入是:{last_chunk['user_input']}, 请人工确认是否执行!请回复 是/否。")
                        graph.update_state(config, {"user_approval": user_approval})

                    # 继续执行图
                    for chunk in graph.stream(None, config, stream_mode="values"):
                        all_chunks.append(chunk)

                    # 显示最终模型的响应
                    print("人工智能助理:", all_chunks[-1]["model_response"].content)

            # 初始化配置和状态存储
            config = {"configurable": {"thread_id": "2"}}
            # 使用该函数运行对话
            run_dialogue(graph, config)

        # ✂ 复杂代理架构中如何添加动态断点

            from langchain_core.tools import tool
            from typing import Union, Optional
            from pydantic import BaseModel, Field
            import requests
            from langgraph.prebuilt import ToolNode

            class SearchQuery(BaseModel):
                query: str = Field(description="Questions for networking queries")
            @tool(args_schema = SearchQuery)
            def fetch_real_time_info(query):
                """Get real-time Internet information"""
                url = "https://google.serper.dev/search"
                payload = json.dumps({
                  "q": query,
                  "num": 1,
                })
                headers = {
                  'X-API-KEY': os.getenv('SERPER_API_KEY', 'your-key-here'),  # ⚠️ 改为环境变量
                  'Content-Type': 'application/json'
                }
                response = requests.post(url, headers=headers, data=payload)
                data = json.loads(response.text)  # 将返回的JSON字符串转换为字典
                if 'organic' in data:
                    return json.dumps(data['organic'],  ensure_ascii=False)  # 返回'organic'部分的JSON字符串
                else:
                    return json.dumps({"error": "No organic results found"},  ensure_ascii=False)  # 如果没有'organic'键,返回错误信息

            class WeatherLoc(BaseModel):
                location: str = Field(description="The location name of the city")
            @tool(args_schema = WeatherLoc)
            def get_weather(location):
                """
                Function to query current weather.
                :param loc: Required parameter, of type string, representing the specific city name for the weather query. \
                Note that for cities in China, the corresponding English city name should be used. For example, to query the weather for Beijing, \
                the loc parameter should be input as 'Beijing'.
                :return: The result of the OpenWeather API query for current weather, with the specific URL request address being: https://api.openweathermap.org/data/2.5/weather. \
                The return type is a JSON-formatted object after parsing, represented as a string, containing all important weather information.
                """
                # Step 1.构建请求
                url = "https://api.openweathermap.org/data/2.5/weather"
                # Step 2.设置查询参数
                params = {
                    "q": location,
                    "appid": "01f0a372b3810c5c30d746565343f92d",    # 输入API key
                    "units": "metric",            # 使用摄氏度而不是华氏度
                    "lang":"zh_cn"                # 输出语言为简体中文
                }
                # Step 3.发送GET请求
                response = requests.get(url, params=params)
                # Step 4.解析响应
                data = response.json()
                return json.dumps(data)

            tools = [get_weather, fetch_real_time_info]
            tool_node = ToolNode(tools)

            # 定义大模型,并将工具绑定到大模型上
            import getpass
            import os
            import json
            from langchain_openai import ChatOpenAI
            from langchain_core.tools import tool
            from langgraph.graph import MessagesState, START, END, StateGraph
            from langgraph.checkpoint.memory import MemorySaver

            if not os.environ.get("OPENAI_API_KEY"):
                os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")
            llm = ChatOpenAI(model="gpt-4o")
            llm = llm.bind_tools(tools)

            # 定义一个Router Function 用来根据大模型的实时响应判断是执行外部函数调用还是直接输出最终的响应
            def should_continue(state):
                last_message = state["messages"][-1]  # 🔧 fix: 变量名 typo (原版 last_messages vs last_message 不匹配)
                if not last_message.tool_calls:
                    return "end"
                else:
                    return "continue"

            # 用于大模型交互的节点函数,其功能是接收用户的响应,使用`GPT 4 `模型生成具体的响应文本
            def call_model(state):
                messages = state["messages"]
                response = llm.invoke(messages)
                return {"messages": [response]}

            # 然后通过`LangGraph`基本构建图的方法,依次定义状态图 -> 向图中添加节点 - > 添加节点之间的边。

            workflow = StateGraph(MessagesState)

            workflow.add_node("agent", call_model)
            workflow.add_node("action", tool_node)
            workflow.add_edge(START, "agent")

            # 添加条件边
            workflow.add_conditional_edges(
                "agent",
                should_continue,
                {
                    "continue": "action",
                    "end": END,
                }
            )

            workflow.add_edge("action", "agent")

            # 🍋 最后,如果想要在执行任意工具前都由人工介入进行确认,只需要在编译图的时候,在调用 `action` 节点之前添加一个`breakpoint`(断点):
            memory = MemorySaver()
            graph = workflow.compile(checkpointer=memory, interrupt_before=["action"])

            # 调用
            config = {"configurable": {"thread_id": "4"}}
            for chunk in graph.stream({"messages": "请帮我查一下北京的天气"}, config, stream_mode="values"):
                chunk["messages"][-1].pretty_print()

        # 👑 实现人机交互式信息管理系统应用
            from sqlalchemy import create_engine, Column, Integer, String, Float
            from sqlalchemy.orm import sessionmaker, declarative_base

            # 创建基类
            Base = declarative_base()

            # 定义 WeatherInfo 模型
            class Weather(Base):
                __tablename__ = 'weather'
                city_id = Column(Integer, primary_key=True)  # 城市ID
                city_name = Column(String(50))                # 城市名称
                main_weather = Column(String(50))             # 主要天气状况
                description = Column(String(100))              # 描述
                temperature = Column(Float)                    # 温度
                feels_like = Column(Float)                    # 体感温度
                temp_min = Column(Float)                      # 最低温度
                temp_max = Column(Float)                      # 最高温度

            # 数据库连接 URI
            DATABASE_URI = 'mysql+pymysql://root:snowball950123@localhost/langgraph_agent?charset=utf8mb4'     # 这里要替换成自己的数据库连接串
            engine = create_engine(DATABASE_URI)

            # 如果表不存在,则创建表
            Base.metadata.create_all(engine)

            # 创建会话
            Session = sessionmaker(bind=engine)

            # 依次定义外部工具函数
            from langchain_core.tools import tool
            from typing import Union, Optional
            from pydantic import BaseModel, Field
            import requests

            class WeatherLoc(BaseModel):
                location: str = Field(description="The location name of the city")

            class WeatherInfo(BaseModel):
                """Extracted weather information for a specific city."""
                city_id: int = Field(..., description="The unique identifier for the city")
                city_name: str = Field(..., description="The name of the city")
                main_weather: str = Field(..., description="The main weather condition")
                description: str = Field(..., description="A detailed description of the weather")
                temperature: float = Field(..., description="Current temperature in Celsius")
                feels_like: float = Field(..., description="Feels-like temperature in Celsius")
                temp_min: float = Field(..., description="Minimum temperature in Celsius")
                temp_max: float = Field(..., description="Maximum temperature in Celsius")

            class QueryWeatherSchema(BaseModel):
                """Schema for querying weather information by city name."""
                city_name: str = Field(..., description="The name of the city to query weather information")


            class DeleteWeatherSchema(BaseModel):
                """Schema for deleting weather information by city name."""
                city_name: str = Field(..., description="The name of the city to delete weather information")


            @tool(args_schema = WeatherLoc)
            def get_weather(location):
                """
                Function to query current weather.
                :param loc: Required parameter, of type string, representing the specific city name for the weather query. \
                Note that for cities in China, the corresponding English city name should be used. For example, to query the weather for Beijing, \
                the loc parameter should be input as 'Beijing'.
                :return: The result of the OpenWeather API query for current weather, with the specific URL request address being: https://api.openweathermap.org/data/2.5/weather. \
                The return type is a JSON-formatted object after parsing, represented as a string, containing all important weather information.
                """
                # Step 1.构建请求
                url = "https://api.openweathermap.org/data/2.5/weather"

                # Step 2.设置查询参数
                params = {
                    "q": location,
                    "appid": "01f0a372b3810c5c30d746565343f92d",    # 输入API key
                    "units": "metric",            # 使用摄氏度而不是华氏度
                    "lang":"zh_cn"                # 输出语言为简体中文
                }

                # Step 3.发送GET请求
                response = requests.get(url, params=params)

                # Step 4.解析响应
                data = response.json()
                return json.dumps(data)


            @tool(args_schema=WeatherInfo)
            def insert_weather_to_db(city_id, city_name, main_weather, description, temperature, feels_like, temp_min, temp_max):
                """Insert weather information into the database."""
                session = Session()  # 确保为每次操作创建新的会话
                try:
                    # 创建天气实例
                    weather = Weather(
                        city_id=city_id,
                        city_name=city_name,
                        main_weather=main_weather,
                        description=description,
                        temperature=temperature,
                        feels_like=feels_like,
                        temp_min=temp_min,
                        temp_max=temp_max
                    )
                    # 添加到会话
                    session.add(weather)
                    # 提交事务
                    session.commit()
                    return {"messages": [f"天气数据已成功存储至Mysql数据库。"]}
                except Exception as e:
                    session.rollback()  # 出错时回滚
                    return {"messages": [f"数据存储失败,错误原因:{e}"]}
                finally:
                    session.close()  # 关闭会话


            @tool(args_schema=QueryWeatherSchema)
            def query_weather_from_db(city_name: str):
                """Query weather information from the database by city name."""
                session = Session()
                try:
                    # 查询天气数据
                    weather_data = session.query(Weather).filter(Weather.city_name == city_name).first()
                    print(weather_data)
                    if weather_data:
                        return {
                            "city_id": weather_data.city_id,
                            "city_name": weather_data.city_name,
                            "main_weather": weather_data.main_weather,
                            "description": weather_data.description,
                            "temperature": weather_data.temperature,
                            "feels_like": weather_data.feels_like,
                            "temp_min": weather_data.temp_min,
                            "temp_max": weather_data.temp_max
                        }
                    else:
                        return {"messages": [f"未找到城市 '{city_name}' 的天气信息。"]}
                except Exception as e:
                    return {"messages": [f"查询失败,错误原因:{e}"]}
                finally:
                    session.close()  # 关闭会话


            @tool(args_schema=DeleteWeatherSchema)
            def delete_weather_from_db(city_name: str):
                """Delete weather information from the database by city name."""
                session = Session()
                try:
                    # 查询要删除的天气数据
                    weather_data = session.query(Weather).filter(Weather.city_name == city_name).first()

                    if weather_data:
                        # 删除记录
                        session.delete(weather_data)
                        session.commit()
                        return {"messages": [f"城市 '{city_name}' 的天气信息已成功删除。"]}
                    else:
                        return {"messages": [f"未找到城市 '{city_name}' 的天气信息。"]}
                except Exception as e:
                    session.rollback()  # 出错时回滚
                    return {"messages": [f"删除失败,错误原因:{e}"]}
                finally:
                    session.close()  # 关闭会话

            # 使用ToolNode构建外部工具库
            from langgraph.prebuilt import ToolNode
            tools = [get_weather, insert_weather_to_db, query_weather_from_db, delete_weather_from_db]
            tool_node = ToolNode(tools)

            # 定义Agent基座模型,并绑定外部工具库
            import getpass
            import os
            import json
            from langchain_openai import ChatOpenAI
            from langchain_core.tools import tool
            from langgraph.graph import MessagesState, START
            from langgraph.prebuilt import ToolNode
            from langgraph.graph import END, StateGraph
            from langgraph.checkpoint.memory import MemorySaver
            if not os.environ.get("OPENAI_API_KEY"):
                os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")
            llm = ChatOpenAI(model="gpt-4o")
            llm = llm.bind_tools(tools) # 🔒 绑定工具

            # call_model 函数用来接收用户的输入请求,由大模型进行用户意图分析
            def call_model(state):
                messages = state["messages"]
                response = llm.invoke(messages)
                return {"messages": [response]}

            # `should_continue` 函数为`Router Function`
            # 当`Agent`判断用户的需求中需要触发`删除`的高危操作时,则需要进入到高危操作的具体处理策略中
            def should_continue(state):
                messages = state["messages"]
                last_message = messages[-1]
                if not last_message.tool_calls:
                    return "end"
                elif last_message.tool_calls[0]["name"] == "delete_weather_from_db":
                    return "run_tool"
                else:
                    return "continue"

            # `run_tool` 函数内的逻辑为高危操作工具的执行逻辑,需要人工批准后决定是否执行
            def run_tool(state):
                new_messages = []
                tool_calls = state["messages"][-1].tool_calls

                # tools =  [get_weather, insert_weather_to_db, query_weather_from_db, delete_weather_from_db]
                tools =  [delete_weather_from_db]
                tools = {t.name: t for t in tools}

                for tool_call in tool_calls:
                    tool = tools[tool_call["name"]]
                    result = tool.invoke(tool_call["args"])
                    new_messages.append(
                        {
                            "role": "tool",
                            "name": tool_call["name"],
                            "content": result,
                            "tool_call_id": tool_call["id"],
                        }
                    )
                return {"messages": new_messages}

            # 构建图
            workflow = StateGraph(MessagesState)
            workflow.add_node("agent", call_model)
            workflow.add_node("action", tool_node)
            workflow.add_node("run_tool", run_tool)
            workflow.add_edge(START, "agent")
            workflow.add_conditional_edges(
                "agent",
                should_continue,
                {
                    "continue": "action",
                    "run_tool":"run_tool",
                    "end": END,
                },
            )
            workflow.add_edge("action", "agent")
            workflow.add_edge("run_tool", "agent")

            # 最后,在编译图的阶段,添加`checkpointer` 与具体的 `breakpoint`
            memory = MemorySaver()
            graph = workflow.compile(checkpointer=memory, interrupt_before=["run_tool"])

            config = {"configurable": {"thread_id": "9"}}

            for chunk in graph.stream({"messages": "北京的天气怎么样?"}, config, stream_mode="values"):
                chunk["messages"][-1].pretty_print()


            config = {"configurable": {"thread_id": "9"}}
            for chunk in graph.stream({"messages": "帮我删除数据库中北京的天气数据"}, config, stream_mode="values"):
                chunk["messages"][-1].pretty_print()


            state = graph.get_state(config)


            for chunk in graph.stream(None, config, stream_mode="values"):
                chunk["messages"][-1].pretty_print()
            """
            ================================= Tool Message =================================
            Name: delete_weather_from_db

            {'messages': ["城市 'Beijing' 的天气信息已成功删除。"]}
            """


            config = {"configurable": {"thread_id": "10"}}

            for chunk in graph.stream({"messages": "帮我删除数据库中上海的天气数据"}, config, stream_mode="values"):
                state = graph.get_state(config)

                # print(state.next)
                # print(state.tasks)

                # 检查是否有任务,如果没有则结束循环
                if not state.tasks:
                    # print("所有任务都已完成。")
                    chunk["messages"][-1].pretty_print()
                    break

                if state.tasks[0].name == 'run_tool':
                    while True:
                        user_input = input("是否允许执行删除操作?请输入'是'或'否':")
                        if user_input in ["是", "否"]:
                            break
                        else:
                            print("输入错误,请输入'是'或'否'。")

                    if user_input == "是":
                        graph.update_state(config=config, values=chunk)
                        for event in graph.stream(None, config, stream_mode="values"):
                            event["messages"][-1].pretty_print()
                    elif user_input == "否":
                        state = graph.get_state(config)
                        tool_call_id = state.values["messages"][-1].tool_calls[0]["id"]
                        print(tool_call_id)

                        #我们现在需要构造一个替换工具调用。把参数改为"xxsd",请注意,我们可以更改任意数量的参数或工具名称-它必须是一个有效的
                        new_message = {
                            "role": "tool",
                            # 这是得到的用户不允许操作的反馈
                            "content": "管理员不允许执行该操作!",
                            "name": "delete_weather_from_db",
                            "tool_call_id": tool_call_id,
                        }
                        graph.update_state(config, {"messages": [new_message]}, as_node="run_tool",)
                        for event in graph.stream(None, config, stream_mode="values"):
                            event["messages"][-1].pretty_print()


            """
            注意,这里的关键是:需要更新 `state`。对于模拟的工具数据来说,需要传递一条消息,该消息的 ID 与要响应的工具调用ID相同。
            接下来我们就可以基于这种逻辑来构建具有人机交互的多轮对话代理:
            """
            def run_multi_round_dialogue(graph, config):
                while True:  # 开始多轮循环
                    # 询问用户输入操作,允许退出
                    user_input = input("请输入您的问题(例如:'帮我查询上海的天气数据'),输入'退出'结束对话:")

                    # 检查是否退出对话
                    if user_input.lower() == '退出':
                        print("对话已结束。")
                        break

                    # 启动对话,根据用户的输入进行处理
                    for chunk in graph.stream({"messages": user_input}, config, stream_mode="values"):
                        state = graph.get_state(config)

                        # 如果没有任务则结束这一轮循环
                        if not state.tasks:
                            if "messages" in chunk and len(chunk["messages"]) > 0:
                                print("人工智能助理:", chunk["messages"][-1].content)
                            break

                        # 处理动态断点的任务
                        if state.tasks[0].name == 'run_tool':
                            user_approval = None
                            while True:
                                user_approval = input("是否允许执行删除操作?请输入'是'或'否':")
                                if user_approval in ["是", "否"]:
                                    break
                                else:
                                    print("输入错误,请输入'是'或'否'。")

                            if user_approval == "是":
                                graph.update_state(config=config, values=chunk)
                                for event in graph.stream(None, config, stream_mode="values"):
                                    if "messages" in event and len(event["messages"]) > 0:
                                        print("人工智能助理:",  event["messages"][-1].content)
                                        # event["messages"][-1].pretty_print()
                            elif user_approval == "否":
                                state = graph.get_state(config)
                                tool_call_id = state.values["messages"][-1].tool_calls[0]["id"]

                                # 构造一个反馈消息来停止操作
                                new_message = {
                                    "role": "tool",
                                    "content": "管理员不允许执行该操作!",
                                    "name": "delete_weather_from_db",
                                    "tool_call_id": tool_call_id,
                                }
                                graph.update_state(config, {"messages": [new_message]}, as_node="run_tool")
                                for event in graph.stream(None, config, stream_mode="values"):
                                    if "messages" in event and len(event["messages"]) > 0:
                                        print("人工智能助理:",  event["messages"][-1].content)
                                        #event["messages"][-1].pretty_print()


            config = {"configurable": {"thread_id": "10"}}
            # 使用该函数启动对话
            run_multi_round_dialogue(graph, config)

    # 🚂 langgrah构建多智能体系统
        # 🚀 Acchitectures架构
            """
            - NetWork(网络):每个代理都可以与其他每个代理通信。任何代理都可以决定接下来要呼叫哪个其他代理。
            - Supervisor(主管):每个代理都与一个 `Supervisor` 代理通信。由 `Supervisor` 代理决定接下来应调用哪个代理。
            - Supervisor (tool-calling): `Supervisor` 架构的一个特例。每个代理都是一个工具。由`Supervisor`代理通过工具调用的方式来决定调用哪些子代理执行任务,以及要传递给这些代理程序的参数
            - Hierarchical(分层):定义具有 `supervisor` 嵌套 `supervisor`多代理系统。这是 `Supervisor` 架构的一种泛化,允许更复杂的控制流。
            """

        # 🚀 Subgraphs 子图
            # 🍊 父、子图的状态模式中有共同的键(通道)
                # step1: 定义用于构建Agent的大模型实例
                from langchain_ollama import ChatOllama

                llm = ChatOllama(
                    base_url = "http://192.168.110.131:11434",  # 注意:这里需要替换成自己本地启动的endpoint
                    model="qwen2.5:72b",
                )

                # step2: 定义父图的状态模式
                from typing import TypedDict
                class ParentState(TypedDict):
                    user_input: str   # 用来接收用户的输入
                    final_answer: str   # 用来存储大模型针对用户输入的响应

                # step3: 定义父图的节点逻辑
                def parent_node(state: ParentState):
                    response = llm.invoke(state['user_input'])
                    return {"final_answer": response}

                # step4: 定义子图的状态模式
                class SubgraphState(TypedDict):
                    final_answer: str
                    summary_answer: str

                # step5: 定义子图的节点逻辑
                # 第一个节点用来将父图生成一个不超过10个单词的简短总结
                # 第二个节点根据完整的响应及其总结进行综合的评分

                from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, AIMessage

                def subgraph_node_1(state: SubgrahState):
                    system_prompt="""
                    Please summary the content you receive to 50 words or less
                    """
                    messages = state["final_answer"]
                    messages = [SystemMessage(content=system_prompt)]+[HumanMessage(content=messages.content)]
                    response = llm.invoke(messages)
                    return {"summary_answer": response}

                def subgraph_node_2(state: SubgraphState):
                    messages = f"""
                    This is the full content of what you received: {state["final_answer"]}\n
                    This information is summarized for the full content: {state["summary_answer"]}
                    Please rate the next and summary information, returning a scale of 1 to 10, Note: Only the score value needs to be returned.
                    """

                    response = llm.invoke([HumanMessage(content=messages)])

                    # 发送共享状态密钥的更新
                    return {"final_answer": response.content}

                # step6: 定义子图的图结构并且进行编译
                from langgraph.graph import START, StateGraph

                subgraph_builder = StateGraph(SubgraphState)
                subgraph_builder.add_node(subgraph_node_1)
                subgraph_builder.add_node(subgraph_node_2)
                subgraph_builder.add_edge(START, "subgraph_node_1")
                subgraph_builder.add_edge("subgraph_node_1", "subgraph_node_2")
                subgraph = subgraph_builder.compile()

                # step7: 定义父图的图结构,并将子图作为节点添加至父图
                builder = StateGraph(ParentState)
                builder.add_node("node_1", parent_node)

                builder.add_node("node_2", subgraph)
                builder.add_edge("node_1", "node_2")
                graph = builder.compile()

                # step8: 可视化完整的图结构
                from IPython.display import Image, display
                display(Image(graph.get_graph(xray=True).draw_mermaid_png()))

                async for chunk in graph.astream({"user_input": "如何理解RAG?"}, stream_mode='values', subgraphs=True):
                    print(chunk)

            # 🍊 父、子图的状态模式中没有共同的键(通道)
                from typing import TypedDict

                # 定义父图中的状态
                class ParentState(TypedDict):
                    user_input: str   # 用来接收用户的输入
                    final_answer: str   # 用来存储大模型针对用户输入的响应

                def parent_node_1(state: ParentState):
                    response = llm.invoke(state["user_input"])
                    return {"final_answer": response}

                from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, AIMessage

                # 定义子图中的状态
                class SubgraphState(TypedDict):
                    # 以下三个 key 都是 子图 (subgraph) 中独享的
                    response_answer: str
                    summary_answer:str
                    score: str

                # 定义第一个节点,用于接收父图中的响应并且做文本摘要
                def subgraph_node_1(state: SubgraphState):
                    system_prompt = """
                    Please summary the content you receive to 50 words or less
                    """
                    messages = state['response_answer']  # 这里接收父图传递过来的响应
                    messages = [SystemMessage(content=system_prompt)] + [HumanMessage(content=messages.content)]
                    response = llm.invoke(messages)
                    return {"summary_answer": response}

                # 定义第二个节点:
                def subgraph_node_2(state: SubgraphState):
                    messages = f"""
                    This is the full content of what you received:{state["response_answer"]} \n
                    This information is summarized for the full content:{state["summary_answer"]}
                    Please rate the text and summary information, returning a scale of 1 to 10. Note: Only the score value needs to be returned.
                    """

                    response = llm.invoke([HumanMessage(content=messages)])

                    # 发送共享状态密钥('user_input')的更新
                    return {"score": response.content}

                # 正常定义子图并编译
                subgraph_builder = StateGraph(SubgraphState)
                subgraph_builder.add_node(subgraph_node_1)
                subgraph_builder.add_node(subgraph_node_2)
                subgraph_builder.add_edge(START, "subgraph_node_1")
                subgraph_builder.add_edge("subgraph_node_1", "subgraph_node_2")
                subgraph = subgraph_builder.compile()

                def parent_node_2(state: ParentState):
                    # 将父图中的状态转换为子图状态
                    response = subgraph.invoke({"response_answer": state["final_answer"]})
                    # 将子图状态再转换回父状态
                    return {"final_answer": response["score"]}

                builder = StateGraph(ParentState)
                builder.add_node("node_1", parent_node_1)

                # 注意,我们使用的不是编译后的子图,而是调用子图的' node_2 '函数
                builder.add_node("node_2", parent_node_2)
                builder.add_edge(START, "node_1")
                builder.add_edge("node_1", "node_2")
                graph = builder.compile()

                from IPython.display import Image, display
                display(Image(graph.get_graph(xray=True).draw_mermaid_png()))

        # 🚀 Supervisor 架构
            # 定义图状态
            from langgraph.graph import StateGraph, MessagesState, START, END

            class AgentState(MessagesState):
                next: str

            # 定义以下三个子代理节点
            members = ['chat', 'coder', 'sqler']
            options = members + ['FINISH']

            from typing import Literal, TypedDict

            class Router(TypedDict):
                """worker to router to next. If not wordered needed, route to FINISH"""
                next: Literal[*options]

            from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage

            def supervisor(state: AgentState):
                system_prompt = (
                    "You are a supervisor tasked with managing a conoversation between the"
                    f" following workers: {members}.\n\n"
                    "Each worker has a specific role:\n"
                    "- chat: Responds directly to user inputs using natrual language.\n"
                    "- coder: Activated for tasks that require mathemtical calculations or specific coding needs.\n"
                    "- sqler: Used when database queries or explicit SQL generation is needs.\n\n"
                    "Given the following user request, respond with the worker to act next."
                    " Each worker will perform a task and respond with their results and status."
                    " When finished, respond with FINISH."
                )
                messages = [{"role": "system", "content": system_prompt},] + state["messages"]
                response = llm.with_structured_ouput(Router).invoke(messages)
                next_ = response["next"]

                if next_ == "FINISH":
                    next_ = END

                return {"next": next_}

            def chat(state: AgentState):
                messages = state['messages'][-1]
                model_response = llm.invoke(messages.content)
                final_response = [HumanMessage(content=model_response.content, name="chat")]
                return {"messages": final_response}

            def coder(state: AgentState):
                messages = state['messages'][-1]
                model_response = llm.invoke(messages.content)
                final_response = [HumanMessage(content=model_response.content, name="coder")]
                return {"messages": final_response}

            def sqler(state: AgentState):
                messages = state['messages'][-1]
                model_response = llm.invoke(messages.content)
                final_response = [HumanMessage(content=model_response.content, name="sqler")]
                return {"messages": final_response}

            # 定义状态图
            builder = StateGraph(AgentState)

            builder.add_node("supervisor", supervisor)
            builder.add_node("chat", chat)
            builder.add_node("coder", coder)
            builder.add_node("sqler", sqler)

            # 让每个子智能体在完成工作后向主管汇报,即需要构建它们之间的边
            for member in members
                builder.add_edge(member, "supervisor")

            builder.add_conditional_edge("supervisor", lambda state: state["next"])
            builder.add_edge(START, "supervisor")
            graph = builder.compile()

            from IPython.display import Image, display
            image = graph.get_graph(xray=True)
            display(Image(image).draw_mermaid_png())


    # ===== 🆕 新版 LangGraph 补充内容 (v1.0+) =====

    # 🚀 Command API + interrupt() — HIL 新标准
        # LangGraph 1.0+ 推荐使用 Command + interrupt() 替代 interrupt_before/interrupt_after。
        # 优势:在节点内部主动触发中断,无需编译时设置断点,更灵活。
        from langgraph.types import Command, interrupt
        from langgraph.graph import StateGraph, START, END
        from typing_extensions import TypedDict

        class State(TypedDict):
            messages: list
            user_approved: bool

        def human_approval_node(state: State):
            # 在节点内部主动弹出,等待人工输入
            user_input = interrupt({
                "question": "是否允许执行该操作?",
                "context": state["messages"][-1]
            })
            # 用户输入(是/否)会通过 resume 传回
            return {"user_approved": user_input == "是"}

        def process_node(state: State):
            if state.get("user_approved"):
                return {"messages": ["操作已执行"]}
            else:
                return {"messages": ["操作已取消"]}

        builder = StateGraph(State)
        builder.add_node("approval", human_approval_node)
        builder.add_node("process", process_node)
        builder.add_edge(START, "approval")
        builder.add_edge("approval", "process")
        builder.add_edge("process", END)

        graph = builder.compile(checkpointer=MemorySaver())

        # 第一轮:触发 interrupt,暂停
        config = {"configurable": {"thread_id": "1"}}
        for chunk in graph.stream({"messages": ["删除敏感数据"]}, config):
            pass  # 图在 approval 节点暂停

        # 第二轮:用 Command(resume=...) 恢复
        graph.stream(Command(resume="是"), config)


    # 🚀 Functional API (@entrypoint / @task)
        # LangGraph 1.1+ 引入的声明式写法,适合比较简单的图逻辑。
        # 不需要手动定义 State 类、节点函数、建边,用装饰器即可。
        from langgraph.func import entrypoint, task
        from langgraph.checkpoint.memory import MemorySaver

        @task
        def fetch_weather(city: str) -> str:
            return f"{city}天气:晴,24°C"

        @task
        def analyze(data: str) -> str:
            return f"分析结果:{data},适合出行"

        @entrypoint(checkpointer=MemorySaver())
        def weather_workflow(city: str) -> dict:
            weather = fetch_weather(city).result()
            analysis = analyze(weather).result()
            return {"weather": weather, "analysis": analysis}

        # 调用
        result = weather_workflow.invoke("北京", {"configurable": {"thread_id": "1"}})

        # ⚠️ 适用场景: 简单流水线,不需要复杂路由/条件分支
        #   复杂场景还是用 StateGraph 更灵活


    # 🚀 Map-Reduce (并行分支) 模式
        # 将一个任务拆分为多个并行子任务,然后合并结果。
        # 生产级 Agent 最常用的模式之一:同时查询多个数据源。
        import operator
        from typing import Annotated, List

        class MapReduceState(TypedDict):
            cities: List[str]
            weather_results: Annotated[List[str], operator.add]  # ⚡ 用 add reducer 自动合并
            final_report: str

        def fetch_all_weather(state: MapReduceState):
            # ⚡ Send() API: 为每个城市发送一个独立状态到目标节点
            from langgraph.types import Send
            return [
                Send("fetch_one", {"city": city})
                for city in state["cities"]
            ]

        def fetch_one(state: dict):
            # 每个城市独立执行
            return {"weather_results": [f"{state['city']}: 晴,24°C"]}

        def merge_results(state: MapReduceState):
            # 所有结果自动合并到 weather_results
            return {"final_report": "\n".join(state["weather_results"])}

        builder = StateGraph(MapReduceState)
        builder.add_node("fetch_all", fetch_all_weather)
        builder.add_node("fetch_one", fetch_one)
        builder.add_node("merge", merge_results)
        builder.add_edge(START, "fetch_all")
        # ⚡ 关键:fetch_all 的条件边路由到 fetch_one
        builder.add_conditional_edges("fetch_all", lambda s: ["fetch_one"])
        builder.add_edge("fetch_one", "merge")
        builder.add_edge("merge", END)
        graph = builder.compile()


    # 🚀 Persistence API — 生产级持久化
        # LangGraph 1.2+ 统一了 checkpointer 和 store 的持久化 API。
        # 生产推荐用 PostgresSaver,支持并发和水平扩展。

        # pip install langgraph-checkpoint-postgres

        from langgraph.checkpoint.postgres import PostgresSaver

        # ✅ 生产推荐: PostgreSQL
        # connection_string = "postgresql://user:pass@host:5432/langgraph?sslmode=require"
        # checkpointer = PostgresSaver.from_conn_string(connection_string)

        # 当前版本 checkpointer 选择指南:
        # ┌────────────────┬───────────┬─────────────┬──────────────┐
        # │ 类型            │ 持久化     │ 并发         │ 适用场景       │
        # ├────────────────┼───────────┼─────────────┼──────────────┤
        # │ MemorySaver    │ ❌        │ ✅          │ 开发/测试      │
        # │ SqliteSaver    │ ✅        │ ⚠️ 单线程    │ 原型/单机      │
        # │ PostgresSaver  │ ✅        │ ✅          │ 生产推荐       │
        # │ RedisSaver     │ ✅        │ ✅          │ 低延迟场景     │
        # └────────────────┴───────────┴─────────────┴──────────────┘


    # 🚀 State 模式最佳实践 — 分层 State
        # 生产级 Agent 需要对 State 进行精细控制:

        class InputState(TypedDict):
            """图入口:只接收用户输入"""
            user_query: str

        class OverallState(TypedDict):
            """全局共享:所有节点可读写"""
            messages: Annotated[list, add_messages]
            user_id: str

        class PrivateState(TypedDict):
            """节点私有:只有该节点能读写"""
            internal_cache: dict
            retry_count: int

        class OutputState(TypedDict):
            """图出口:只输出最终结果"""
            final_answer: str

        # 用法:
        # builder = StateGraph(OverallState, input=InputState, output=OutputState)
        # 特定节点可标注 PrivateState: add_node("search", search_fn, private=PrivateState)


    # 📌 学习建议
        # 以上内容按优先级排列:
        # 🥇 必须掌握    — Command API, interrupt(), 流式输出, 检查点, create_react_agent
        # 🥈 建议掌握    — Map-Reduce, Functional API, 分层 State
        # 🥉 了解即可    — Store 长期记忆, Supervisor 多 Agent, Subgraph
        # ❌ 可跳过     — MessageGraph(已废弃), 手动 SqliteSaver put/list(极少用)


# 🤖 CrewAI — 多Agent协作框架
# ====================================================================================================================================

    # 📌 CrewAI 定位
    #   CrewAI = 目前最成熟的多Agent协作框架。
    #   核心理念:像组建一个团队一样组建Agent,每个Agent有角色、目标、技能。
    #   特点:概念清晰(Agent/Task/Crew三个核心概念)、上手快、社区活跃。
    #   对比:
    #     LangGraph  → 图编排,灵活但代码量大
    #     CrewAI     → 团队协作,概念少但覆盖了大部分场景
    #     AutoGen    → 对话式多Agent,侧重Agent间自由对话
    #     DeepAgents → 轻量但生态太弱,已弃用

    # 🚀 核心概念（三板斧）

    #   🥇 Agent — 智能体（团队成员）
    #     属性: role(角色), goal(目标), backstory(背景), tools(工具), llm(模型)
    #     每个Agent就像团队里的一个人——有岗位、有任务、有擅长的事

    #   🥇 Task — 任务（要干的活）
    #     属性: description(描述), expected_output(预期输出), agent(指派给谁), tools(任务级工具)
    #     一个Task可以指定一个Agent去执行,也可以不指定让Crew自动分配

    #   🥇 Crew — 团队（把人和活组织起来）
    #     属性: agents(团队成员), tasks(任务列表), process(执行流程), verbose(日志)
    #     Crew就是老板——把人招齐、活派好、流程定好,然后说"开始干"

    # 🚀 完整入门代码

        # ============================================================
        # pip install crewai
        # ============================================================

        # ===== Step 1: 定义 Agent =====
        from crewai import Agent, Task, Crew, Process

        # Agent 1: 研究员
        researcher = Agent(
            role="高级技术研究员",
            goal="从技术文档和博客中挖掘最准确、最新的技术信息",
            backstory="你是一名资深技术研究员,擅长从大量信息中提取关键内容并形成结构化报告。",
            verbose=True,      # 打印思考过程
            allow_delegation=False,  # 是否允许把任务交给别的Agent
        )

        # Agent 2: 写作者
        writer = Agent(
            role="技术内容写手",
            goal="将复杂的技术概念用通俗易懂的语言写出来",
            backstory="你是一名技术博客作者,擅长把深奥的技术讲得人人都能听懂。",
            verbose=True,
        )

        # ===== Step 2: 定义 Task =====
        task_research = Task(
            description="研究 LangGraph 和 CrewAI 这两个框架的核心区别,包括设计理念、适用场景、社区生态。",
            expected_output="一份300字左右的对比分析报告,包含3个核心差异点。",
            agent=researcher,
        )

        task_write = Task(
            description="基于研究结果,写一篇通俗的对比文章。",
            expected_output="一篇500字左右的博客文章,语言通俗,适合技术人员阅读。",
            agent=writer,
        )

        # ===== Step 3: 组建 Crew 并运行 =====
        crew = Crew(
            agents=[researcher, writer],
            tasks=[task_research, task_write],
            process=Process.sequential,  # 顺序执行:先研究→再写作
            verbose=True,
        )

        result = crew.kickoff()
        print(result)


    # 🔄 两种 Process 模式

        # ── 1. Process.sequential（顺序执行）──
        #     Task1 → Task2 → Task3 → ...
        #     前一个Task的输出自动作为后一个Task的上下文
        #     适合:流水线作业、研究→写作→审核

        crew = Crew(
            agents=[researcher, writer, reviewer],
            tasks=[task1, task2, task3],
            process=Process.sequential,
        )

        # ── 2. Process.hierarchical（层级管理）──
        #     需要一个 manager_agent 来管理其他Agent
        #     manager 决定谁做什么、谁先做、谁后做
        #     适合:复杂任务、需要动态分配的场景

        manager = Agent(
            role="项目经理",
            goal="协调团队高效完成任务,合理分配工作量",
            backstory="你是一名经验丰富的项目经理,擅长任务分解和团队协调。",
            verbose=True,
        )

        crew = Crew(
            agents=[researcher, writer],
            tasks=[task_research, task_write],
            process=Process.hierarchical,
            manager_agent=manager,  # 指定管理者
        )

        # ⚠️ hierarchical 模式需要调用 LLM 做决策,成本更高


    # 🛠 工具集成

        # CrewAI 支持多种方式集成工具:

        # ── 方式1: @tool 装饰器（最简单）──
        from crewai.tools import tool

        @tool("search_web")
        def search_web(query: str) -> str:
            \"\"\"搜索互联网获取最新信息\"\"\"
            # 这里接入你的搜索API
            return f"搜索结果: {query}"

        researcher_with_tools = Agent(
            role="研究员",
            goal="搜索最新技术信息",
            backstory="你擅长搜索和分析",
            tools=[search_web],
        )

        # ── 方式2: Task级工具（部分任务有专门工具）──
        task_with_tools = Task(
            description="查询天气信息",
            expected_output="天气数据",
            tools=[weather_tool],  # 只有这个任务能用
        )

        # ── 方式3: 内置工具包 ──
        # from crewai_tools import (
        #     SerperDevTool,       # 搜索引擎
        #     ScrapeWebsiteTool,   # 网页抓取
        #     FileReadTool,        # 文件读取
        #     DirectoryReadTool,   # 目录遍历
        # )


    # 🔗 任务上下文与依赖

        # Task 之间可以通过 context 传递数据:

        task1 = Task(
            description="研究LangGraph",
            expected_output="研究笔记",
            agent=researcher,
        )

        task2 = Task(
            description="写对比文章",
            expected_output="文章",
            agent=writer,
            context=[task1],  # task2 能看到 task1 的输出
        )

        # 这样 task2 在执行时,LLM 的上下文中会自动包含 task1 的结果。


    # 🧪 高级用法

        # ── 1. 回调(Callback)──
        #     Crew 运行时可以监听事件:
        #     from crewai import Crew, Process
        #     crew = Crew(..., step_callback=my_callback)

        # ── 2. 缓存(Cache)──
        #     默认开启LLM调用缓存,相同输入不重复调LLM,省成本
        #     crew = Crew(..., cache=True)

        # ── 3. 输出格式──
        #     result = crew.kickoff()
        #     print(result.raw)         # 原始文本
        #     print(result.json_dict)   # JSON格式(如果输出是JSON)
        #     print(result.tasks_output) # 每个Task的独立输出

        # ── 4. 嵌入任务 ──
        #     Task 支持嵌入其他 Crew 作为子流程:
        #     sub_crew = Crew(agents=[...], tasks=[...])
        #     main_task = Task(..., crew=sub_crew)


    # ⚡ 实战建议

        #   场景                    推荐 Process
        #   研究→写作→审核          sequential（流水线）
        #   多个独立任务并行         sequential（任务间无依赖）
        #   复杂项目需动态分配       hierarchical（需要manager）
        #   不知道用什么             sequential（最稳）

        #   工具只在需要的Agent上加,不要每个Agent都挂一堆工具
        #   先 sequential 跑通,再考虑 hierarchical
        #   verbose=True 在开发时开,上线关掉


    # ⚠️ 注意事项

        # 1. CrewAI 每个 Task 都会调一次 LLM,成本要算清楚
        # 2. hierarchical 模式比 sequential 多调 LLM(manager 也要调)
        # 3. Agent 的 backstory 对输出质量影响很大,值得好好写
        # 4. 不要给一个 Agent 太多工具——它会困惑
        # 5. CrewAI 的缓存是内存缓存,进程重启就没了
        # 6. 长任务建议加 timeout,防止死循环


    # 📊 多Agent框架对比

        #           CrewAI          LangGraph       AutoGen
        # ─────────────────────────────────────────────────
        # 上手难度  ⭐ 最简单        ⭐⭐⭐            ⭐⭐
        # 灵活性    ⭐⭐             ⭐⭐⭐⭐⭐         ⭐⭐⭐
        # 适用场景  多Agent协作      复杂Workflow     Agent对话
        # 学习曲线  低               高               中
        # 社区      活跃             最活跃           中等
        # 版本      1.x              1.x              0.4.x

        # 一句话:
        #   快速搭建多Agent → CrewAI
        #   需要精细控制流程 → LangGraph
        #   需要Agent间自由对话 → AutoGen



# 🌙 Agent Scope
# ====================================================================================================================================
    # 🚀 第一个智能体
        import asyncio
        import os

        from agentscope.agent import Agent
        from agentscope.credential import DashScopeCredential
        from agentscope.event import EventType
        from agentscope.message import UserMsg
        from agentscope.model import DashScopeChatModel
        from agentscope.tool import Toolkit, Bash, Read, Write, Edit

        async def main() -> None:
            agent = Agent(
                name="Friday",
                system_prompt="You are a helpful assistant named Friday.",
                model=DashScopeChatModel(
                    credential=DashScopeCredential(
                        api_key=os.getenv("DASHSCOPE_API_KEY"),
                    ),
                    model="qwen-plus",
                ),
                toolkit=Toolkit(tools=[Bash(), Read(), Write(), Edit()]),
            )

            user_msg = UserMsg(name="user", content="Hello, who are you?")

            # 方式一:等待最终的助手消息。
            reply_msg = await agent.reply(user_msg)
            # `reply_msg` 是一个 `AssistantMsg`,其 `content` 是一组内容块。
            # 可按需检查文本块、工具调用等。
            ...

            # 方式二:流式获取增量事件(文本片段、工具调用等)。
            async for event in agent.reply_stream(user_msg):
                # 根据 `event.type` 分发处理 -- 每个分支对应一种事件类型。
                match event.type:
                    case EventType.TEXT_BLOCK_DELTA:
                        # 模型返回的流式文本片段 -- 追加到界面或标准输出。
                        ...
                    case EventType.TOOL_CALL_START:
                        # 智能体即将调用工具 -- 展示调用信息。
                        ...
                    case _:
                        # 其他事件:思考块、工具结果、回复结束等。
                        ...


        asyncio.run(main())

    # 🚀 创建文本消息
        from agentscope.message import UserMsg, SystemMsg, AssistantMsg

        # 用户消息
        user_msg = UserMsg(
            name="user",
            content="这张图片里有什么?"
        )

        # 系统消息,仅用于系统提示(System prompt)
        system_msg = SystemMsg(
            name="system",
            content="你是一个名为 Friday 的 AI 助手。"
        )

        # 助手消息
        assistant_msg = AssistantMsg(
            name="Friday",
            content="你好,有什么我可以帮你的吗?"
        )

    # 🚀 创建多模态消息
        from agentscope.message import UserMsg, TextBlock, DataBlock, Base64Source

        # 用户消息
        user_msg = UserMsg(
            name="user",
            content=[
                TextBlock(text="描述这张图片:"),
                DataBlock(
                    source=Base64Source(
                        data="...",
                        media_type="image/png"
                    )
                ),
            ],
        )

    # 🚀 创建工具调用消息
        from agentscope.message import AssistantMsg, ThinkingBlock, TextBlock, ToolCallBlock, ToolCallState, ToolResultBlock, ToolResultState

        assistant_msg = AssistantMsg(
            name="Friday",
            content=[
                ThinkingBlock(thinking="我应该调用工具来查询天气。"),
                TextBlock(text="让我查询下北京的天气。"),
                ToolCallBlock(
                    id="tool_call_1",
                    name="weather_search",
                    input='{"city": "Beijing"}',
                    state=ToolCallState.FINISHED,
                ),
                ToolResultBlock(
                    id="tool_call_1",
                    name="weather_search",
                    output="北京的天气是晴天,温度 25°C。",
                    state=ToolResultState.SUCCESS,
                ),
            ]
        )

    # 💡 配置智能体
        import os
        from agentscope.agent import Agent, ContextConfig
        from agentscope.tool import Toolkit, Bash, Edit, Grep, Read, Write
        from agentscope.mcp import MCPClient, HttpMCPConfig
        from agentscope.model import DashScopeChatModel
        from agentscope.credential import DashScopeCredential

        agent = Agent(
            name="my_agent",
            system_prompt="你是一个AI助手。",
            model=DashScopeChatModel(
                credential=DashScopeCredential(api_key="YOUR_API_KEY"),
                model="qwen-max",
            ),
            toolkit=Toolkit(
                tools=[Bash(), Edit(), Grep(), Read(), Write()],
                mcps=[
                    MCPClient(
                        name="amap",
                        is_stateful=False,
                        mcp_config=HttpMCPConfig(
                            url=f"https://mcp.amap.com/mcp?key={os.environ['AMAP_API_KEY']}",
                        ),
                    ),
                ],
                skills_or_loaders=["./skills"],
            ),
            context_config=ContextConfig(
                trigger_ratio=0.7,       # 使用 70% 上下文时触发压缩
                reserve_ratio=0.2,       # 压缩后保留最近 20% 的内容
                tool_result_limit=1000,  # 工具结果超过 1000 token 时截断
            )
        )

    # ✈ 压缩上下文
        """
        当 token 数量超过 context_config.trigger_ratio × model.context_length 时,智能体会自动压缩上下文。
        压缩会对较旧的消息进行摘要,如果配置了 offloader,还会将其卸载到磁盘。

        也可以手动触发压缩:
        """
        from agentscope.agent import ContextConfig

        # 使用智能体的默认配置
        await agent.compress_context()

        # 或为本次调用传入自定义配置
        await agent.compress_context(
            ContextConfig(
                trigger_ratio=0.6,
                reserve_ratio=0.2,
            )
        )

    # 💬 人机交互
        # 当权限系统判断某个工具调用需要用户批准时,智能体会发出 RequireUserConfirmEvent 并暂停。

        # 1 接收 RequireUserConfirmEvent
            from agentscope.event import RequireUserConfirmEvent

            async for event in agent.reply_stream(msg):
                if isinstance(event, RequireUserConfirmEvent):
                    for tc in event.tool_calls:
                        print(f"工具: {tc.name}, 输入: {tc.input}")
                        print(f"建议规则: {tc.suggested_rules}")

        # 2 构建确认结果
            # 为每个待处理的工具调用创建 ConfirmResult,指明是否允许执行。也可以修改工具调用输入或接受建议的权限规则:
            from agentscope.event import ConfirmResult, UserConfirmResultEvent

            confirm_results = []
            for tc in event.tool_calls:
                confirm_results.append(
                    ConfirmResult(
                        confirmed=True,           # 或 False 表示拒绝
                        tool_call=tc,             # 传回(可选择修改)
                        rules=tc.suggested_rules, # 接受规则以便未来自动允许
                    )
                )

        # 3 恢复智能体
            # 将 UserConfirmResultEvent 传回 reply 或 reply_stream:
            confirm_event = UserConfirmResultEvent(
                reply_id=event.reply_id,
                confirm_results=confirm_results,
            )
            result = await agent.reply(confirm_event)
            """
            - 已确认的工具调用立即执行,智能体继续推理
            - 已拒绝的工具调用会产生 LLM 可见的错误结果,LLM 可能会用不同方式重试
            - 已接受的规则会持久化到权限引擎中--匹配的未来调用将自动允许,无需再次提示
            """

    # 🚀 持久化智能体状态
        import asyncio
        from agentscope.agent import Agent
        from agentscope.state import AgentState
        from agentscope.model import DashScopeChatModel
        from agentscope.credential import DashScopeCredential
        from agentscope.message import UserMsg
        from agentscope.app.storage import RedisStorage

        USER_ID = "user_123"
        AGENT_ID = "agent_456"
        SESSION_ID = "session_789"

        async def main():
            async with RedisStorage(host="localhost", port=6379) as storage:
                # 从存储中加载状态,若不存在则使用全新状态
                record = await storage.get_session(
                    user_id=USER_ID,
                    agent_id=AGENT_ID,
                    session_id=SESSION_ID,
                )
                state = record.state if record else AgentState()

                # 使用恢复的状态创建智能体
                agent = Agent(
                    name="my_agent",
                    system_prompt="你是一个有帮助的助手。",
                    model=DashScopeChatModel(
                        credential=DashScopeCredential(api_key="YOUR_API_KEY"),
                        model="qwen-max",
                    ),
                    state=state,
                )

                # 执行一轮 reply
                result = await agent.reply(
                    UserMsg(name="user", content="继续之前的任务。"),
                )
                print(result.get_text_content())

                # 将更新后的状态持久化回 Redis
                await storage.update_session_state(
                    user_id=USER_ID,
                    agent_id=AGENT_ID,
                    session_id=SESSION_ID,
                    state=agent.state,
                )

        asyncio.run(main())

    # 🚀 调用ChatModel
        """
        返回类型取决于模型的 stream 设置:
        - stream=False -- 返回单个 ChatResponse,承载完整输出。
        - stream=True -- 返回 AsyncGenerator[ChatResponse, None]。
            中间 chunk(is_last=False)只携带增量内容。
            为了让开发者无需自行累积增量,AgentScope 会在末尾追加一个 is_last=True 的 chunk,承载完整的累积内容。
        """
        import asyncio
        import os
        from agentscope.model import DashScopeChatModel
        from agentscope.credential import DashScopeCredential
        from agentscope.message import UserMsg

        async def main():
            model = DashScopeChatModel(
                credential=DashScopeCredential(api_key=os.environ["DASHSCOPE_API_KEY"]),
                model="qwen-plus",
                stream=True,
            )
            msgs = [UserMsg(name="user", content="Count from 1 to 5.")]

            async for chunk in await model(msgs):
                if chunk.is_last:
                    print("Final:", chunk.content)   # 完整累积内容
                else:
                    print("Delta:", chunk.content)   # 仅增量

        asyncio.run(main())

    # 🚀 生成结构化输出
        """
        当需要返回符合 Pydantic 模型或 JSON schema 的结构化结果时,调用 generate_structured_output 而非 __call__。
        它返回一个 StructuredResponse,其 content 是经过 schema 校验的 dict:
        """
        import asyncio
        import os
        from pydantic import BaseModel
        from agentscope.model import DashScopeChatModel
        from agentscope.credential import DashScopeCredential
        from agentscope.message import UserMsg

        class WeatherInfo(BaseModel):
            city: str
            temperature: float
            unit: str

        async def main():
            model = DashScopeChatModel(
                credential=DashScopeCredential(api_key=os.environ["DASHSCOPE_API_KEY"]),
                model="qwen-plus",
                stream=False,
            )
            response = await model.generate_structured_output(
                messages=[UserMsg(name="user", content="What's the weather in Shanghai?")],
                structured_model=WeatherInfo,
            )
            print(response.content)  # 符合 WeatherInfo 的 dict

        asyncio.run(main())


# 🏀 Agents SDK
# ====================================================================================================================================

    # 🚀 三大模块 Agent Handoffs Guardrails

        # ! pip install openai python-dotenv openai-agents
        import os
        from dotenv import load_dotenv

        load_dotenv(override=True) # 如果已经配置过全局变量,则使用.env 文件中的变量覆盖替换

        from agents import Agent
        agent = Agent(
            name="乐于助人的私人小助理",
            instructions="请使用中文回答用户的问题",
        )

        from agents import Runner
        result = await Runner.run(
            starting_agent=agent,
            input="你好,请你介绍一下你自己"
        )

        print(result.final_output)

    # 🚀 其它模型接入
        from openai import OpenAI
        import os
        from dotenv import load_dotenv
        load_dotenv(override=True)

        DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
        DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")
        DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL")

        # 实例化客户端
        client = OpenAI(
            api_key=DEEPSEEK_API_KEY,
            base_url=DEEPSEEK_BASE_URL
        )

        response = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=[
                {"role": "user", "content": "你好,好久不见!请介绍下你自己。"}
            ]
        )


        # 除此以外,`Runner.run`是一个异步方法,所以接入的模型实例也需要使用异步,因此这里实例化模型时需要使用`AsyncOpenAI`包
        from openai import AsyncOpenAI, OpenAIChatCompletionsModel

        deepseek_client = AsyncOpenAI(
            base_url=DEEPSEEK_BASE_URL,
            api_key=DEEPSEEK_API_KEY
        )

        agent = Agent(
            name="乐于助人的私人小助理",
            instructions="请使用中文回答用户的问题",
            model=OpenAIChatCompletionsModel(
                model=DEEPSEEK_MODEL,
                openai_client=deepseek_client,
            )
        )

        result = await Runner.run(agent, "你好,请你介绍一下你自己")
        print(result.final_output)

        # 自定义采样参数的方法,则是需要通过`ModelSettings`类进行实例化并传递,如下代码所示:
        from agents import ModelSettings

        agent = Agent(
            name="乐于助人的私人小助理",
            instructions="请使用中文回答用户的问题",
            model=OpenAIChatCompletionsModel(
                model=DEEPSEEK_MODEL,
                openai_client=deepseek_client,
            ),
            model_settings=ModelSettings(
                temperature=0.6,
                max_tokens=10,
            )
        )
        result = await Runner.run(agent, "请你介绍一下你自己")
        print(result.final_output)

    # 🚀 Runner核心组件
        """
        - Runner.run(): 异步运行并返回最终响应结果。
        - Runner.run_sync(): 同步运行,本质上是对异步 `run()` 方法的封装,
                             从而可以在没有事件循环的情况下(例如在普通的 Python 脚本或某些环境中)以同步方式执行代理的逻辑。
        - Runner.run_streamed(): 异步运行并返回最终的响应结果。它以流模式调用大模型,并在接收到事件时将其进行流式的实时传输。
        """

    # 🚢 上下文管理

        # ✈ Agent Local Context
        """`Agent` 运行状态下所用的数据在`OpenAI Agents SDK`框架中称之为`Local Context`。
        它的形式是一个`Python`对象,在整个`Agent`运行期间持续存在"""

        """
        Agent能够执行复杂任务的核心是可以执行函数调用,而函数调用的两种参数来源主要有两种:
        1. 大模型解析的显式参数:通过 JsonSchema 定义,由大模型理解用户意图后提供;即工具函数的注释描述部分;
        2. 人工构建的隐式参数: 由开发人员预先设置,对大模型不可见,即需要借助`Local Context`来传递;
        """
        from dataclasses import dataclass
        from typing import Optional
        from agents import RunContextWrapper, function_tool

        # 通过数据类来定义上下文类
        @dataclass
        class UserInfo:
            name: str
            uid: int
            birthday: str = "1995-01-23"  # 添加用户生日信息
            location: str = "北京"        # 添加用户位置信息

        # 定义工具函数
        @function_tool
        async def fetch_user_info(
            wrapper: RunContextWrapper[UserInfo],     # 隐式参数 - 上下文
            info_type: str,                           # 显式参数 - 由大模型解析用户想查询的信息类型
            format_type: Optional[str] = None         # 显式参数 - 可选的格式化方式
        ) -> str:
            """
            获取用户的详细信息

            参数:
            - info_type: 要获取的信息类型,如"年龄"、"生日"、"位置"等
            - format_type: 可选的信息格式,如"简洁"、"详细"
            """
            # 从隐式上下文参数获取用户基本信息
            user_name = wrapper.context.name
            user_id = wrapper.context.uid


            # 根据显式参数决定返回什么信息
            if info_type.lower() == "年龄":
                info = f"30 岁"
            elif info_type.lower() == "生日":
                info = wrapper.context.birthday
            elif info_type.lower() == "位置":
                info = wrapper.context.location
            else:
                info = "未知信息类型"

            # 根据显式参数决定返回格式
            if format_type and format_type.lower() == "详细":
                return f"用户详细信息 - ID: {user_id}, 姓名: {user_name}, {info_type}: {info}"
            else:
                return f"用户 {user_name} 的{info_type}是 {info}"


        userinfo_service_agent = Agent[UserInfo](
            name="客户服务助手",
            instructions="你是一个帮助查询用户信息的助手",
            model=OpenAIChatCompletionsModel(
                model=DEEPSEEK_MODEL,
                openai_client=deepseek_client,
            ),
            model_settings=ModelSettings(
                temperature=0.6,
                max_tokens=2048,
            ),
            tools=[fetch_user_info] # 💡
        )

        user_info = UserInfo(name="water", uid=123456)

        # 示例1: 查询年龄(基本用法)💡
        result1 = await Runner.run(
            starting_agent=userinfo_service_agent,
            input="请告诉我water的年龄",
            context=user_info,  # 通过context参数来传递上下文类对象
        )
        print("===== 查询年龄 =====")
        print(result1.final_output)

        # ☄ Local Context的另一个重要应用场景是多代理协作中的状态共享
        import nest_asyncio
        nest_asyncio.apply()

        # 阶段一:上下文设计与初始化
        from dataclasses import dataclass, field
        from typing import List, Dict, Any, Optional
        import pymysql
        from pymysql.cursors import DictCursor
        from datetime import datetime, date
        from dbutils.pooled_db import PooledDB
        from faker import Faker
        import json
        from agents import Agent, RunContextWrapper, Runner, function_tool, handoff

        # 创建Faker实例用于生成模拟数据
        fake = Faker('zh_CN')

        @dataclass
        class MySQLContext:
            """管理MySQL连接和查询状态的上下文类"""
            connection_pool: PooledDB  # 共享数据库连接池
            customer_id: str  # 当前正在服务的客户ID
            query_results: Dict[str, Any] = field(default_factory=dict) # 用于存储查询结果
            current_step: str = "客户信息查询" # 当前步骤
            workflow_complete: bool = False # 是否完成工作流

            def get_connection(self):
                """从连接池获取一个连接"""
                return self.connection_pool.connection()

        # 创建连接池 - 使用您提供的dbutils和pymysql实现
        pool = PooledDB(
            creator=pymysql,       # 使用pymysql模块
            maxconnections=5,      # 连接池允许的最大连接数
            host="localhost",
            user="root",
            password="Snowball2019",  # 使用您提供的密码
            port=3306,
            database="financial_service",
            charset='utf8mb4',
            connect_timeout=10     # 连接超时时间
        )


        # 阶段二:创建客户信息助手(第一个智能体)
        # 这个函数负责查询客户的基本个人信息,包括姓名、账户类型、余额、联系方式等
        @function_tool
        async def query_customer_info(
            context: RunContextWrapper[MySQLContext],           # 隐式参数 - 上下文
            include_sensitive_info: Optional[bool] = False,     # 显式参数 - 是否包含敏感信息
            format_type: Optional[str] = "standard"             # 显式参数 - 输出格式
        ) -> str:
            """
            查询客户的基本信息

            参数:
            - include_sensitive_info: 是否包含敏感信息如电话和邮箱
            - format_type: 输出格式类型,可选"standard"、"brief"或"detailed"
            """
            connection = None
            cursor = None
            try:
                # 从上下文获取隐式参数
                connection = context.context.get_connection()   # 从上下文获取数据库连接
                cursor = connection.cursor(DictCursor)          # 创建游标
                customer_id = context.context.customer_id      # 从上下文获取当前客户ID

                # 查询客户基本信息
                cursor.execute("""
                SELECT id, name, account_type, balance, phone, email, address, registration_date
                FROM customers
                WHERE id = %s
                """, (customer_id,))

                customer = cursor.fetchone()  # 获取查询结果
                if not customer:
                    return f"未找到ID为{customer_id}的客户信息"

                # 将日期转换为字符串
                if 'registration_date' in customer and isinstance(customer['registration_date'], (datetime, date)):
                    customer['registration_date'] = customer['registration_date'].isoformat()

                # 存储查询结果到上下文
                context.context.query_results["customer_info"] = customer  # 将查询结果存储到上下文
                context.context.current_step = "交易历史查询"              # 更新当前步骤

                # 根据显式参数处理敏感信息
                if not include_sensitive_info:
                    phone = "***********" if 'phone' in customer else "未提供"  # 如果包含敏感信息,则将电话和邮箱隐藏
                    email = "***********" if 'email' in customer else "未提供"  # 如果包含敏感信息,则将电话和邮箱隐藏
                else:
                    phone = customer.get('phone', "未提供")  # 如果不需要隐藏敏感信息,则直接返回电话和邮箱
                    email = customer.get('email', "未提供")  # 如果不需要隐藏敏感信息,则直接返回电话和邮箱

                # 根据显式参数格式化输出
                if format_type.lower() == "brief":
                    # 简要格式
                    info = (
                        f"客户 {customer['name']} ({customer['account_type']})\n"
                        f"账户余额: {customer['balance']} 元"
                    )
                elif format_type.lower() == "detailed":
                    # 详细格式
                    info = (
                        f"客户详细信息(ID: {customer_id}):\n"
                        f"- 姓名: {customer['name']}\n"
                        f"- 账户类型: {customer['account_type']}\n"
                        f"- 账户余额: {customer['balance']} 元\n"
                        f"- 电话: {phone}\n"
                        f"- 邮箱: {email}\n"
                        f"- 地址: {customer['address']}\n"
                        f"- 注册日期: {customer['registration_date']}\n"
                        f"- 客户价值评估: {'高' if float(customer['balance']) > 500000 else '中' if float(customer['balance']) > 100000 else '一般'}"
                    )
                else:
                    # 标准格式
                    info = (
                        f"客户信息:\n"
                        f"- 姓名: {customer['name']}\n"
                        f"- 账户类型: {customer['account_type']}\n"
                        f"- 账户余额: {customer['balance']} 元\n"
                        f"- 电话: {phone}\n"
                        f"- 邮箱: {email}\n"
                        f"- 地址: {customer['address']}\n"
                        f"- 注册日期: {customer['registration_date']}"
                    )

                return info

            except Exception as e:
                return f"查询客户信息时发生错误: {str(e)}"

            finally:
                if cursor:
                    cursor.close()
                if connection:
                    connection.close()

        @function_tool
        async def query_transaction_history(
            context: RunContextWrapper[MySQLContext],           # 隐式参数 - 上下文
            days: Optional[int] = 30,                           # 显式参数 - 查询天数
            transaction_type: Optional[str] = None,             # 显式参数 - 交易类型过滤
            min_amount: Optional[float] = None                  # 显式参数 - 最小金额过滤
        ) -> str:
            """
            查询客户的交易历史

            参数:
            - days: 查询最近几天的交易,默认30天
            - transaction_type: 交易类型过滤,如"存款"、"取款"、"购买"、"赎回"
            - min_amount: 最小交易金额过滤
            """
            connection = None
            cursor = None
            try:
                # 从上下文获取隐式参数
                connection = context.context.get_connection()   # 从上下文获取数据库连接
                cursor = connection.cursor(DictCursor)          # 创建游标
                customer_id = context.context.customer_id      # 从上下文获取当前客户ID

                # 构建查询SQL - 使用显式参数
                base_query = """
                SELECT t.id, t.amount, t.transaction_date, t.transaction_type, t.status, p.name as product_name
                FROM transactions t
                JOIN products p ON t.product_id = p.id
                WHERE t.customer_id = %s
                """

                query_params = [customer_id]

                # 添加日期过滤条件
                if days:
                    base_query += " AND t.transaction_date >= DATE_SUB(NOW(), INTERVAL %s DAY)"
                    query_params.append(days)

                # 添加交易类型过滤条件
                if transaction_type:
                    base_query += " AND t.transaction_type = %s"
                    query_params.append(transaction_type)

                # 添加最小金额过滤条件
                if min_amount:
                    base_query += " AND t.amount >= %s"
                    query_params.append(min_amount)

                base_query += " ORDER BY t.transaction_date DESC LIMIT 10"

                # 执行查询
                cursor.execute(base_query, tuple(query_params))
                transactions = cursor.fetchall()

                # 转换日期为字符串
                for tx in transactions:
                    if 'transaction_date' in tx and isinstance(tx['transaction_date'], (datetime, date)):
                        tx['transaction_date'] = tx['transaction_date'].isoformat()

                # 存储查询结果到上下文
                context.context.query_results["transaction_history"] = transactions  # 将查询结果存储到上下文
                context.context.current_step = "产品推荐"                              # 更新当前步骤

                # 构建筛选条件描述
                filter_desc = []
                if days:
                    filter_desc.append(f"最近{days}天")
                if transaction_type:
                    filter_desc.append(f"类型为{transaction_type}")
                if min_amount:
                    filter_desc.append(f"金额≥{min_amount}元")

                filter_text = "(筛选:" + "、".join(filter_desc) + ")" if filter_desc else ""

                if not transactions:
                    return f"该客户{filter_text}没有交易记录"

                # 格式化输出交易历史
                history = f"最近交易记录{filter_text}:\n"
                for i, tx in enumerate(transactions, 1):
                    history += (
                        f"{i}. 产品: {tx['product_name']}\n"
                        f"   金额: {tx['amount']} 元\n"
                        f"   类型: {tx['transaction_type']}\n"
                        f"   日期: {tx['transaction_date']}\n"
                        f"   状态: {tx['status']}\n"
                    )

                # 添加总结信息
                total_amount = sum(float(tx['amount']) for tx in transactions)
                history += f"\n共 {len(transactions)} 笔交易,总金额: {total_amount:.2f} 元"

                return history

            except Exception as e:
                return f"查询交易历史时发生错误: {str(e)}"

            finally:
                if cursor:
                    cursor.close()
                if connection:
                    connection.close()


        # 创建代理
        info_agent = Agent[MySQLContext](
            name="客户信息助手",
            instructions="请使用中文回答用户的问题",
            model=OpenAIChatCompletionsModel(
                model=DEEPSEEK_MODEL,
                openai_client=deepseek_client,
            ),
            model_settings=ModelSettings(
                temperature=0.6,
                max_tokens=2048,
            ),
            tools=[query_customer_info, query_transaction_history], # 通过 tools 参数接收工具函数
            handoffs=[recommend_agent]
        )


        # 选择一个客户ID
        # 从某个界面选择客户的过程
        mysql_ctx = MySQLContext(
            connection_pool=pool,
            customer_id="CUST000100",  # 示例客户ID
        )


        # 第一步:客户信息查询
        result1 = await Runner.run(
            starting_agent=info_agent,
            input="查询下客户的基本信息",
            context=mysql_ctx  # 传递上下文
        )
        print("\n===== 客户信息查询 =====")
        print(result1.final_output)

        # 阶段三:构建产品的推荐代理(第二智能体)
        @function_tool
        async def recommend_products(
            context: RunContextWrapper[MySQLContext],           # 隐式参数 - 上下文
            product_category: Optional[str] = None,             # 显式参数 - 产品类别
            risk_level: Optional[str] = None,                   # 显式参数 - 风险等级
            max_results: Optional[int] = 6                      # 显式参数 - 最大结果数量
        ) -> str:
            """
            基于客户信息和交易历史推荐产品

            参数:
            - product_category: 产品类别过滤,如"储蓄"、"理财"、"保险"、"贷款"
            - risk_level: 风险等级过滤,如"低"、"中"、"高"
            - max_results: 最多返回几个产品推荐,默认6个
            """
            connection = None
            cursor = None
            try:
                # 从上下文获取隐式参数
                connection = context.context.get_connection() # 从上下文获取数据库连接
                cursor = connection.cursor(DictCursor) # 创建游标

                # 从上下文获取前面步骤查询的客户信息
                customer_info = context.context.query_results.get("customer_info", {}) # 从上下文获取客户信息
                if not customer_info:
                    return "无法推荐产品,客户信息不可用"

                account_type = customer_info.get('account_type')
                balance = float(customer_info.get('balance', 0))

                # 构建基础查询
                base_query = """
                SELECT id, name, category, min_amount, interest_rate, term_months, risk_level
                FROM products
                WHERE min_amount <= %s
                """

                query_params = [balance]

                # 根据显式参数添加条件
                if product_category:
                    base_query += " AND category = %s"
                    query_params.append(product_category)

                if risk_level:
                    base_query += " AND risk_level = %s"
                    query_params.append(risk_level)

                # 根据用户类型决定是否包含VIP产品
                if account_type in ('VIP', '白金'):
                    # VIP客户可以看到所有产品,优先显示VIP专属产品
                    base_query += """ ORDER BY CASE
                        WHEN suitable_for_vip = 1 THEN 0
                        ELSE 1
                    END, category"""
                else:
                    # 普通客户只看非VIP产品
                    base_query += " AND suitable_for_vip = 0 ORDER BY category"

                # 限制结果数量
                base_query += f" LIMIT {max_results}"

                # 执行查询
                cursor.execute(base_query, tuple(query_params))
                recommended_products = cursor.fetchall()

                # 存储推荐结果到上下文
                context.context.query_results["recommended_products"] = recommended_products
                context.context.current_step = "完成推荐"
                context.context.workflow_complete = True

                if not recommended_products:
                    return "没有找到符合客户条件的产品"

                # 构建筛选条件描述
                filter_desc = []
                if product_category:
                    filter_desc.append(f"类别:{product_category}")
                if risk_level:
                    filter_desc.append(f"风险等级:{risk_level}")

                filter_text = "(筛选:" + "、".join(filter_desc) + ")" if filter_desc else ""

                # 格式化推荐输出
                recommendations = f"为{customer_info['name']}({account_type}客户)推荐以下产品{filter_text}:\n\n"

                for i, product in enumerate(recommended_products, 1):
                    interest_info = f"利率: {product['interest_rate']}%" if product['interest_rate'] is not None else ""
                    term_info = f"期限: {product['term_months']}个月" if product['term_months'] > 0 else "无固定期限"

                    recommendations += (
                        f"{i}. {product['name']} ({product['category']})\n"
                        f"   最低金额: {product['min_amount']} 元\n"
                        f"   {interest_info}\n"
                        f"   {term_info}\n"
                        f"   风险等级: {product['risk_level']}\n\n"
                    )

                # 根据客户类型添加特权信息
                if account_type == '白金':
                    recommendations += "【白金会员特权】您可以享受产品手续费全免和专属理财经理服务。\n"
                elif account_type == 'VIP':
                    recommendations += "【VIP会员特权】您可以享受产品手续费5折优惠。\n"

                return recommendations

            except Exception as e:
                return f"推荐产品时发生错误: {str(e)}"

            finally:
                if cursor:
                    cursor.close()
                if connection:
                    connection.close()


        # 有两种方式可以构建转接代理

        # 🌰 第一种比较简单的方法是直接传递Agent对象

            recommend_agent = Agent[MySQLContext](
                name="产品推荐助手",
                instructions="请使用中文回答用户的问题",
                model=OpenAIChatCompletionsModel(
                    model=DEEPSEEK_MODEL,
                    openai_client=deepseek_client,
                ),
                model_settings=ModelSettings(
                    temperature=0.6,
                    max_tokens=2048,
                ),
                tools=[recommend_products],
                handoffs=[info_agent]  # 可以切换回客户信息助手,当然也可以传递多个代理
            )

            # 选择一个客户ID
            # 从某个界面选择客户的过程
            mysql_ctx = MySQLContext(
                connection_pool=pool,
                customer_id="CUST000100",  # 示例客户ID
            )

            # 产品推荐
            result4 = await Runner.run(
                starting_agent=recommend_agent,
                input="查询客户近一年的存款记录,推荐一个储蓄产品",
                context=mysql_ctx
            )
            print("\n===== 产品推荐 =====")
            print(result4.final_output)

        # 🌰 第二种方式通过handoff函数设置代理转接
        # 创建代理
        info_agent = Agent[MySQLContext](
            name="客户信息助手",
            instructions="请使用中文回答用户的问题",
            model=OpenAIChatCompletionsModel(
                model=DEEPSEEK_MODEL,
                openai_client=deepseek_client,
            ),
            model_settings=ModelSettings(
                temperature=0.6,
                max_tokens=2048,
            ),
            tools=[query_customer_info, query_transaction_history], # 通过 tools 参数接收工具函数
            handoffs=[handoff(
                agent=recommend_agent,
                tool_name_override="transfer_to_recommend_agent",
                tool_description_override="""当且仅当用户明确需要产品推荐,且您已通过query_customer_info和query_transaction_history工具获取了足够\
                                            的客户基本信息和交易历史后,才使用此工具将对话转交给产品推荐助手。切勿在客户信息不完整时使用此工具。""",
            )]
        )

        recommend_agent = Agent[MySQLContext](
            name="产品推荐助手",
            instructions="请使用中文回答用户的问题",
            model=OpenAIChatCompletionsModel(
                model=DEEPSEEK_MODEL,
                openai_client=deepseek_client,
            ),
            model_settings=ModelSettings(
                temperature=0.6,
                max_tokens=2048,
            ),
            tools=[recommend_products],
            handoffs = [handoff(
                agent=info_agent,
                tool_name_override="transfer_to_info_agent",
                tool_description_override="""当且仅当您需要获取更多客户信息或查询历史交易记录且当前上下文中没有这些信息时,才使用此工具。\
                                            使用此工具前,请明确说明您需要查询的具体信息类型(如基本资料、交易历史等)。\
                                            获取信息后,您应当回到产品推荐流程。""",
            )]
        )


        # ✈ Model Context

        RECOMMENDED_PROMPT_PREFIX = (
            "# 系统上下文\n"
            "您是一个名为 Agents SDK 的多代理系统的一部分,旨在简化代理的协调和执行。"
            "代理使用两个主要抽象:**Agents** 和 **Handoff**。一个代理包含指令和工具,并可以在适当的时候将对话交接给另一个代理。\n"
            "交接是通过调用一个交接函数来实现的,通常命名为 `transfer_to_<agent_name>`。代理之间的转移在后台无缝处理;请不要在与用户的对话中提及或引起对这些转移的注意。\n"
        )


        # 1. 首先创建recommend_agent,s
        recommend_agent = Agent[MySQLContext](
            name="产品推荐助手",
            instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
            您是一位专业的金融产品推荐专家,擅长根据客户信息和交易历史推荐合适的金融产品。

            请按照以下顺序处理用户请求:
            1. 首先尝试使用您自己的工具(recommend_products)基于已有信息推荐产品
            2. 只有在确实需要更多客户信息或交易历史且当前上下文中没有这些信息时,才使用transfer_to_info_agent工具
            3. 一旦获得所需的客户信息,请回到自己的工具推荐产品,不要直接给出回答

            请使用中文与用户交流,提供专业的产品推荐。
            """,
            model=OpenAIChatCompletionsModel(
                model=DEEPSEEK_MODEL,
                openai_client=deepseek_client,
            ),
            model_settings=ModelSettings(
                temperature=0.6,
                max_tokens=2048,
            ),
            tools=[recommend_products],
            handoffs = [handoff(
                agent=info_agent,
                tool_name_override="transfer_to_info_agent",
                tool_description_override="当且仅当您需要获取更多客户信息或查询历史交易记录且当前上下文中没有这些信息时,才使用此工具。使用此工具前,请明确说明您需要查询的具体信息类型(如基本资料、交易历史等)。获取信息后,您应当回到产品推荐流程。",
            )]
        )

        # 2. 然后创建info_agent,包含对recommend_agent的handoff
        info_agent = Agent[MySQLContext](
            name="客户信息助手",
            instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
            您是一位专业的客户信息查询助手,擅长检索和提供客户详细信息及交易历史记录。

            请按照以下顺序处理用户请求:
            1. 首先使用您自己的工具(query_customer_info, query_transaction_history)获取客户信息
            2. 如果用户明确表示需要产品推荐,且您已获取到足够的客户信息后,才使用transfer_to_recommend_agent工具
            3. 切勿在未获取充分客户信息的情况下过早转交给产品推荐助手

            请使用中文与用户交流,确保提供准确的客户信息。
            """,
            model=OpenAIChatCompletionsModel(
                model=DEEPSEEK_MODEL,
                openai_client=deepseek_client,
            ),
            model_settings=ModelSettings(
                temperature=0.6,
                max_tokens=2048,
            ),
            tools=[query_customer_info, query_transaction_history],
            handoffs=[handoff(
                agent=recommend_agent,
                tool_name_override="transfer_to_recommend_agent",
                tool_description_override="当且仅当用户明确需要产品推荐,且您已通过query_customer_info和query_transaction_history工具获取了足够的客户基本信息和交易历史后,才使用此工具将对话转交给产品推荐助手。切勿在客户信息不完整时使用此工具。",
            )]
        )

    # 📞 Stdio MCP服务器接入
        import asyncio
        import os
        import shutil

        from agents import Agent, Runner, gen_trace_id, trace
        from agents.mcp import MCPServer, MCPServerStdio, MCPServerStreamableHttp


        async def run(mcp_server: MCPServer):
            agent = Agent(
                name="Assistant",
                instructions="Use the tools to read the filesystem and answer questions based on those files.",
                mcp_servers=[mcp_server],
            )

            # List the files it can read
            message = "Read the files and list them."
            print(f"Running: {message}")
            result = await Runner.run(starting_agent=agent, input=message)
            print(result.final_output)

            # Ask about books
            message = "What is my #1 favorite book?"
            print(f"\n\nRunning: {message}")
            result = await Runner.run(starting_agent=agent, input=message)
            print(result.final_output)

            # Ask a question that reads then reasons.
            message = "Look at my favorite songs. Suggest one new song that I might like."
            print(f"\n\nRunning: {message}")
            result = await Runner.run(starting_agent=agent, input=message)
            print(result.final_output)


        async def main():
            current_dir = os.path.dirname(os.path.abspath(__file__))
            samples_dir = os.path.join(current_dir, "sample_files")

            async with MCPServerStdio(
                name="Filesystem Server, via npx",
                params={
                    "command": "npx",
                    "args": ["-y", "@modelcontextprotocol/server-filesystem", samples_dir],
                },
            ) as server:
                trace_id = gen_trace_id()
                with trace(workflow_name="MCP Filesystem Example", trace_id=trace_id):
                    print(f"View trace: https://platform.openai.com/traces/trace?trace_id={trace_id}\n")
                    await run(server)


        if __name__ == "__main__":
            # Let's make sure the user has npx installed
            if not shutil.which("npx"):
                raise RuntimeError("npx is not installed. Please install it with `npm install -g npx`.")

            asyncio.run(main())

    # 📞 SSE MCP服务器接入
        from agents.mcp import MCPServerSse

        async def main(prompt: str):
            async with MCPServerSse(
                name="12306_mcp",
                params={
                    "url": "https://mcp.api-inference.modelscope.net/eb9fa1122332744/mcp",  # 这里需要替换成 MCP的 SSE URL
                    "timeout": 30,            # HTTP请求超时时间30秒
                    "sse_read_timeout": 5   # 连接超时时间到5分钟
                },
                client_session_timeout_seconds=60,  # 增加客户端会话超时到60秒
                cache_tools_list=True,             # 启用工具列表缓存
            ) as mcp:
                print(f"连接MCP服务器成功: {mcp.name}")  # 通过静态方法name查看当前连接的MCP服务器名称
                try:
                    tools = await mcp.list_tools()   # 通过其父类_MCPServerWithClientSession中的list_tools方法列出可用工具
                    print(f"可用工具列表: {[tool.name for tool in tools]}")

                    agent = Agent(
                        name="Train_Assistant",
                        instructions="你是一个火车票查询助手,可以查询高铁信息",
                        model=OpenAIChatCompletionsModel(
                            model=os.getenv("DEEPSEEK_MODEL"),
                            openai_client=deepseek_client,
                        ),
                        model_settings=ModelSettings(
                            temperature=0.6,
                            max_tokens=2048
                        ),
                        mcp_servers=[mcp],
                    )

                    print(f"开始处理查询: {prompt}")
                    result = await Runner.run(
                        starting_agent=agent,
                        input=prompt,
                        run_config=RunConfig(
                            tracing_disabled=True
                        )
                    )
                except Exception as e:
                    print(f"获取工具列表失败: {e}")

    # 📞 StreamableHttp MCP服务器接入
        from pydantic import BaseModel
        from agents.mcp import MCPServerStreamableHttp

        async def main(prompt: str):
            try:
                async with MCPServerStreamableHttp(
                    name='Assistant',
                    params={
                        "url": "http://localhost: 3000/mcp/",
                        "headers": {
                            "Content-Type": "application/json",
                            # 初始握手/配置: 使用'application/json'
                            # 事件流: 使用"text/event-stream"
                            "Accept": "text/event-stream, application/json"
                        }
                    }
                ) as mcp:

        if __name__ == "__main__":
            asyncio.run(main())

    # 🎩 安全护栏

        # 🚀 使用装饰器 @input_guardrail() 直接将函数声明为输入护栏函数
            from agents import (
                Agent,
                GuardrailFunctionOutput,
                InputGuardrailTripwireTriggered,
                RunContextWrapper,
                Runner,
                TResponseInputItem,
                input_guardrail,
            )

            class MathHomeworkOutput(BaseModel):
                reasoning: str
                is_math_homework: bool


            guardrail_agent = Agent(
                name="Guardrail check",
                instructions="Check if the user is asking you to do their math homework.",
                output_type=MathHomeworkOutput,
            )

            @input_guardrail
            async def math_guardrail(
                context: RunContextWrapper[None],
                agent: Agent,
                input: str | list[TResponseInputItem]
            ) -> GuardrailFunctionOutput:
                """This is an input guardrail function, which happens to call an agent to check if the input
                is a math homework question.
                """
                result = await Runner.run(guardrail_agent, input, context=context.context)
                final_output = result.final_output_as(MathHomeworkOutput)

                return GuardrailFunctionOutput(
                    output_info=final_output,
                    tripwire_triggered=final_output.is_math_homework, # 💡 这里如果是True的话,抛出异常,中断整个链路
                )

            async def main():
                agent = Agent(
                    name="Customer support agent",
                    instructions="You are a customer support agent. You help customers with their questions.",
                    input_guardrails=[math_guardrail],  # 🎈
                )

                input_data: list[TResponseInputItem] = []

                while True:
                    user_input = input("Enter a message: ")
                    input_data.append(
                        {
                            "role": "user",
                            "content": user_input,
                        }
                    )

                    try:
                        result = await Runner.run(agent, input_data)
                        print(result.final_output)
                        # If the guardrail didn't trigger, we use the result as the input for the next run
                        input_data = result.to_input_list()
                    except InputGuardrailTripwireTriggered:
                        # If the guardrail triggered, we instead add a refusal message to the input
                        message = "Sorry, I can't help you with your math homework."
                        print(message)
                        input_data.append(
                            {
                                "role": "assistant",
                                "content": message,
                            }
                        )

                # Sample run:
                # Enter a message: What's the capital of California?
                # The capital of California is Sacramento.
                # Enter a message: Can you help me solve for x: 2x + 5 = 11
                # Sorry, I can't help you with your math homework.

            if __name__ == "__main__":
                asyncio.run(main())

        # ✈ 显式实例化InputGuardrail对象创建护栏实例运行时的热插拔
            from agents import InputGuardrail

            async def check_id_info_leak(ctx: RunContextWrapper[None], agent: Agent, input_text: str):
                pass

            id_info_leak_guardrail = InputGuardrailk(
                guradrail_function=check_id_info_leak,
                name="id_info_leak_guardrail"
            )


# ☀ 多智能体协作
# ====================================================================================================================================

    # 👑 多agent协作模式

        # 🍊 Workflow 流程编排
        #-------------------------------------------------------------------------------------------------------------------
            # 🚀 Langgraph StateGraph串行边
            from typing import TypedDict  # 给 LangGraph 的图状态定义带类型的字段结构
            from langchain_openai import ChatOpenAI  # LangChain 封装的 OpenAI 兼容聊天模型
            from langchain_core.tools import tool    # 把普通函数包成 LangChain 工具,挂给 agent
            from langgraph.graph import StateGraph, START, END  # 建图核心:StateGraph 定状态图,START/END 是起止虚拟节点
            from langgraph.prebuilt import create_react_agent   # 把"模型 + 工具"组装成能自主调工具的 agent

            # 把 env-prep 里的搜索函数包成 LangChain 工具
            @tool
            def web_search(query: str) -> str:
                """联网搜索资料,返回前 3 条结果的标题和摘要。输入查询词。"""
                return web_search_raw(query)

            llm = ChatOpenAI(model=MODEL, base_url=BASE_URL, api_key=KEY, temperature=0.3)

            # 三道工序各是一个带搜索工具的真 agent:能自主决定要不要搜、搜什么--这才叫 agent
            researcher = create_react_agent(llm, tools=[web_search],
                prompt="你是研究员。先用 web_search 搜索一两次主题资料,再提炼 3 个最该写进技术博客的要点,逗号分隔,只输出要点。")
            writer = create_react_agent(llm, tools=[web_search],
                prompt="你是技术撰稿人。根据研究要点写一段 80 字以内的博客片段,只输出正文。")
            editor = create_react_agent(llm, tools=[web_search],
                prompt="你是编辑。把博客片段精简润色成一句 25 字以内的导读,只输出这句话。")

            # State 是流水线上传递的一张共享表,每个节点把对应 agent 的产出填进去
            class State(TypedDict):
                topic: str       # 输入:写作主题
                points: str      # 研究员产出:研究要点
                draft: str       # 写作者产出:博客初稿
                final: str       # 编辑产出:精简定稿

            def research(state: State):                              # 工序一:研究员 agent 搜资料、提要点
                print("【研究员】启动")
                r = researcher.invoke({"messages": [("user", f"主题:{state['topic']}")]})
                out = r["messages"][-1].content
                print(f"【研究员】产出:{out}\n")
                return {"points": out}

            def write(state: State):                                 # 工序二:撰稿 agent 据要点写初稿
                print("【写作者】启动")
                r = writer.invoke({"messages": [("user", f"研究要点:{state['points']}")]})
                out = r["messages"][-1].content
                print(f"【写作者】产出:{out}\n")
                return {"draft": out}

            def edit(state: State):                                  # 工序三:编辑 agent 精简定稿
                print("【编辑】启动")
                r = editor.invoke({"messages": [("user", f"博客片段:{state['draft']}")]})
                out = r["messages"][-1].content
                print(f"【编辑】产出:{out}\n")
                return {"final": out}

            # 三道工序按顺序焊死在边里--这就是 Workflow:每个工位是带工具的 agent,但工位顺序由代码定死
            g = StateGraph(State)
            g.add_node("research", research)
            g.add_node("write", write)
            g.add_node("edit", edit)

            g.add_edge(START, "research")
            g.add_edge("research", "write")
            g.add_edge("write", "edit")
            g.add_edge("edit", END)
            app = g.compile()  # 把状态图编译成可执行的图

            result = app.invoke({"topic": "多智能体协作模式"})
            print("【研究要点】", result["points"])
            print("【博客初稿】", result["draft"])
            print("【精简定稿】", result["final"])


            # ✈ CrewAI:Process.sequential
            from crewai import Agent, Task, Crew, Process, LLM  # CrewAI 五件套:Agent 角色 / Task 任务 / Crew 团队 / Process 编排方式 / LLM 模型
            from crewai.tools import tool as crew_tool          # CrewAI 的工具装饰器,把普通函数注册成 agent 可调的工具

            # 把 env-prep 里的搜索函数包成 CrewAI 工具
            @crew_tool("web_search")
            def web_search(query: str) -> str:
                """联网搜索资料,返回前 3 条结果的标题和摘要。输入查询词。"""
                return web_search_raw(query)

            # litellm 走 OpenRouter 时模型名要带 openrouter/ 前缀,这是 CrewAI 这条链路的硬要求
            llm = LLM(model=f"openrouter/{MODEL}", base_url=BASE_URL, api_key=KEY, temperature=0.3, timeout=180)
            os.environ.setdefault("OPENAI_API_KEY", KEY)             # CrewAI 部分组件会读 OPENAI_API_KEY,兜底设一下

            # 三个角色,每个都配上搜索工具--能自主决定要不要搜、搜什么,这才叫 agent
            researcher = Agent(role="内容研究员", goal="就给定主题先联网搜索、再提炼最该写进技术博客的核心要点",
                               backstory="你擅长先查资料再下笔。", llm=llm, tools=[web_search], verbose=False)
            writer = Agent(role="技术写作者", goal="把研究要点写成一段通俗的技术博客",
                           backstory="你写的技术博客准确又好读。", llm=llm, tools=[web_search], verbose=False)
            editor = Agent(role="文字编辑", goal="把一段博客精简成一句导读",
                           backstory="你能把一整段讲解收成一句话。", llm=llm, tools=[web_search], verbose=False)

            # Task.description 必须明确"先用 web_search 工具搜索",否则 agent 可能跳过工具直接答
            t_research = Task(description="先用 web_search 工具搜索一两次「{topic}」,再提炼 3 个最该写进技术博客的核心要点,逗号分隔。",
                              expected_output="3 个核心要点,逗号分隔。", agent=researcher)
            t_write = Task(description="根据上一步的要点,写一段 80 字以内的技术博客片段。",
                           expected_output="一段 80 字以内的博客片段。", agent=writer)
            t_edit = Task(description="把上一步的博客精简成一句 25 字以内的导读。",
                          expected_output="一句 25 字以内的导读。", agent=editor)

            crew = Crew(agents=[researcher, writer, editor],  # 把一组 agent + task 编成一个团队
                        tasks=[t_research, t_write, t_edit],
                        process=Process.sequential, verbose=False)   # sequential = 流程编排

            result = await crew.kickoff_async(inputs={"topic": "多智能体协作模式"})  # Jupyter 自带事件循环,须用异步版启动(过程中 web_search 被调用时会打印)
            print("\n【各工序产出】")
            for t in [t_research, t_write, t_edit]:
                print(f"【{t.agent.role}】产出:", t.output.raw if t.output else "(无)")
            print("\n【最终导读】", result)


            # 🚢 OpenAI Agents SDK: 代码驱动编排
            from openai import AsyncOpenAI  # OpenAI 官方异步客户端,指向 OpenRouter 兼容端点
            # 多导入 function_tool:把普通函数包成 agent 可调的工具
            from agents import Agent, Runner, OpenAIChatCompletionsModel, function_tool, set_tracing_disabled

            set_tracing_disabled(True)                               # 关掉默认连 OpenAI 的 tracing,走第三方端点必须
            client = AsyncOpenAI(base_url=BASE_URL, api_key=KEY)     # 复用环境准备 cell 的 BASE_URL/KEY
            model = OpenAIChatCompletionsModel(model=MODEL, openai_client=client)

            # 把 env-prep 里的搜索函数包成 OpenAI SDK 工具
            @function_tool
            def web_search(query: str) -> str:
                """联网搜索资料,返回前 3 条结果的标题和摘要。输入查询词。"""
                return web_search_raw(query)

            # 三个 Agent 各管一道工序,每个都挂上搜索工具;它们之间没有 handoff,纯靠下面的代码把输出接力下去
            researcher = Agent(name="researcher", model=model, tools=[web_search],
                               instructions="先用 web_search 搜索一两次用户给的主题,再提炼 3 个最该写进技术博客的核心要点,逗号分隔,不要解释。")
            writer = Agent(name="writer", model=model, tools=[web_search],
                           instructions="根据用户给的研究要点,写一段 80 字以内的技术博客片段。")
            editor = Agent(name="editor", model=model, tools=[web_search],
                           instructions="把用户给的博客片段精简成一句 25 字以内的导读。")

            async def main():
                topic = "多智能体协作模式"
                print("【研究员】启动")
                r1 = await Runner.run(researcher, topic)             # 工序一:研究
                print(f"【研究员】产出:{r1.final_output}\n")
                print("【写作者】启动")
                r2 = await Runner.run(writer, r1.final_output)       # 上一步产出当这一步输入
                print(f"【写作者】产出:{r2.final_output}\n")
                print("【编辑】启动")
                r3 = await Runner.run(editor, r2.final_output)       # 再接力一棒
                print(f"【编辑】产出:{r3.final_output}\n")

            await main()


        # 🍇 Supervisor 集中调试
        # -------------------------------------------------------------------------------------------------------------------
            # 🚀 Langgraph
            import os  # 读环境变量(密钥、模型名)
            from langchain_openai import ChatOpenAI  # LangChain 封装的 OpenAI 兼容聊天模型,LangGraph 节点里用它调 LLM
            from langgraph.prebuilt import create_react_agent          # 本课锁定 1.2.4,从 prebuilt 导入即可,当前版本可用
            from langgraph_supervisor import create_supervisor  # LangGraph 官方扩展:一键装配"主管 + 一组专家"的集中调度结构

            # 复用第二章环境准备 cell 的 MODEL/BASE_URL/KEY
            model = ChatOpenAI(model=MODEL, base_url=BASE_URL, api_key=KEY, temperature=0.3, timeout=180, max_retries=1)

            # 两个专家 agent(无外部工具,凭模型知识各管一个维度);name 是主管派单时的寻址依据
            tech_expert = create_react_agent(model, tools=[], name="tech_expert",  # 造一个会自主推理、按需调工具的 ReAct 智能体
                prompt="你是技术专家。只从技术原理和架构角度回答问题,80 字以内。")
            apply_expert = create_react_agent(model, tools=[], name="apply_expert",
                prompt="你是应用专家。只从落地场景和典型案例角度回答问题,80 字以内。")

            # 主管:create_supervisor 自动给它注入 transfer_to_tech_expert / transfer_to_apply_expert 派单工具
            supervisor = create_supervisor(  # 一键装配"主管 + 一组专家"的星形集中调度
                agents=[tech_expert, apply_expert],
                model=model,
                prompt=("你是研究主管。把用户问题的技术维度交给 tech_expert,应用维度交给 apply_expert,"
                        "两份都收齐后,综合成一段 150 字以内的研究简报。")
            ).compile()  # 把状态图编译成可执行的图

            # 用 stream 边跑边打印--messages 是共享状态(黑板),跑完再打顺序是按对话结构整理的;要看真实时间线得流式看
            seen = set()                                                # 记录已打印的消息,去重
            for _, state in supervisor.stream(
                    {"messages": [{"role": "user", "content": "多智能体协作模式在 2026 年的现状"}]},
                    subgraphs=True, stream_mode="values"):              # subgraphs=True 才看得到专家子图内部的事件
                for m in state.get("messages", []):
                    if m.id in seen: continue
                    seen.add(m.id)
                    who = getattr(m, "name", None) or m.type
                    content = m.content if isinstance(m.content, str) else str(m.content)
                    if content.strip():
                        print(f"[{who}] {content[:220]}")


            # 🚢 OpenAI Agents SDK: agents-as-tools
            import asyncio  # 驱动异步的 agent 调用
            from openai import AsyncOpenAI  # OpenAI 官方异步客户端,指向 OpenRouter 兼容端点
            from agents import Agent, Runner, OpenAIChatCompletionsModel, set_tracing_disabled  # OpenAI Agents SDK:Agent 智能体 / Runner 执行器 / 模型接兼容端点 / 关闭轨迹上报

            set_tracing_disabled(True)                                  # 关掉 SDK 默认上报,走第三方端点时必须
            client = AsyncOpenAI(base_url=BASE_URL, api_key=KEY)        # 复用环境准备 cell 的 BASE_URL/KEY
            model = OpenAIChatCompletionsModel(model=MODEL, openai_client=client)

            # 两个专家 Agent
            tech_expert = Agent(name="tech_expert", model=model,
                                instructions="你是技术专家。只从技术原理和架构角度回答,80 字以内。")
            apply_expert = Agent(name="apply_expert", model=model,
                                 instructions="你是应用专家。只从落地场景和典型案例角度回答,80 字以内。")

            # 主管:把两个专家 as_tool 挂成自己的工具;主管自己决定何时调哪个、最后综合(控制权不转移)
            manager = Agent(
                name="manager",
                model=model,
                instructions=("你是研究主管。用 ask_tech 工具问技术维度,用 ask_apply 工具问应用维度,"
                              "两个都问完后综合成一段 150 字以内的研究简报。"),
                tools=[
                    tech_expert.as_tool(tool_name="ask_tech", tool_description="就问题咨询技术专家"),  # 把一个 agent 包装成另一个 agent 可调用的工具(agents-as-tools)
                    apply_expert.as_tool(tool_name="ask_apply", tool_description="就问题咨询应用专家"),
                ]
            )

            async def main():
                r = await Runner.run(manager, "多智能体协作模式在 2026 年的现状")  # OpenAI Agents SDK 执行入口:跑一个 agent 直到产出
                print("【研究简报】", r.final_output)

            await main()       # Jupyter 里直接 await

            # ✈ CrewAI: Process.hierachical
            import os  # 读环境变量(密钥、模型名)
            from crewai import Agent, Task, Crew, Process, LLM  # CrewAI 五件套:Agent 角色 / Task 任务 / Crew 团队 / Process 编排方式 / LLM 模型

            os.environ.setdefault("OPENAI_API_KEY", KEY)               # CrewAI 底层 litellm 会查这个变量
            # litellm 走 OpenRouter 时模型名要带 openrouter/ 前缀,这是 CrewAI 这条链路的硬要求
            llm = LLM(model=f"openrouter/{MODEL}", base_url=BASE_URL, api_key=KEY, temperature=0.3, timeout=180)

            # 两个专家;hierarchical 模式下不绑 Task,由 manager 决定派给谁
            tech_expert = Agent(role="技术专家", goal="从技术原理和架构角度分析问题",
                                backstory="你精通多智能体协作模式的技术机制。", llm=llm, verbose=False)
            apply_expert = Agent(role="应用专家", goal="从落地场景和典型案例角度分析问题",
                                 backstory="你熟悉多智能体协作模式的产业落地。", llm=llm, verbose=False)

            # Task 不绑具体 agent,交给 manager 调度
            task = Task(description="就「多智能体协作模式在 2026 年的现状」产出一份研究简报,综合技术与应用两个维度。",
                        expected_output="一段 150 字以内的研究简报。")

            # Process.hierarchical + manager_llm:CrewAI 自动建一个 manager 负责派单和汇总
            crew = Crew(agents=[tech_expert, apply_expert], tasks=[task],  # 把一组 agent + task 编成一个团队
                        process=Process.hierarchical, manager_llm=llm, verbose=False)  # CrewAI 层级编排:主管自动调度下属

            result = await crew.kickoff_async()  # Jupyter 自带事件循环,须用异步版启动
            print("【研究简报】", result)


        # 🍋 Hierachical 分层协同
        # -------------------------------------------------------------------------------------------------------------------
            # 🚀 Langgraph
            from langchain_openai import ChatOpenAI  # LangChain 封装的 OpenAI 兼容聊天模型
            from langgraph.prebuilt import create_react_agent     # 造底层 worker(会自主推理的 ReAct 智能体)
            from langgraph_supervisor import create_supervisor    # 装配主管;它的产物可以再被上层 create_supervisor 嵌套

            # 复用第二章环境准备 cell 的 MODEL/BASE_URL/KEY
            model = ChatOpenAI(model=MODEL, base_url=BASE_URL, api_key=KEY, temperature=0.3, timeout=180, max_retries=1)

            # ---- 最底层:四个 worker,各管一摊 ----
            fe_ui = create_react_agent(model, tools=[], name="fe_ui",
                prompt="你是前端界面工程师。给出待办应用的界面与交互实现,60 字以内。")
            fe_state = create_react_agent(model, tools=[], name="fe_state",
                prompt="你是前端状态工程师。给出待办应用的前端状态管理与数据持久化方案,60 字以内。")
            be_api = create_react_agent(model, tools=[], name="be_api",
                prompt="你是后端接口工程师。给出待办应用的 REST 接口设计,60 字以内。")
            be_db = create_react_agent(model, tools=[], name="be_db",
                prompt="你是后端存储工程师。给出待办应用的数据库表与存储方案,60 字以内。")

            # ---- 中间层:两个团队主管,各自管两个 worker(这一层 LLM 自主派单),编译时起 name 供上层寻址 ----
            frontend_team = create_supervisor(
                model=model,
                agents=[fe_ui, fe_state],
                prompt="你是前端组长。把界面交互交给 fe_ui,状态与持久化交给 fe_state,两份都收齐后用一句话汇报前端方案。",
                supervisor_name="fe_lead",
            ).compile(name="frontend_team")     # 编译成"一个 agent",名字叫 frontend_team

            backend_team = create_supervisor(
                model=model,
                agents=[be_api, be_db],
                prompt="你是后端组长。把接口设计交给 be_api,存储方案交给 be_db,两份都收齐后用一句话汇报后端方案。",
                supervisor_name="be_lead",
            ).compile(name="backend_team")

            # ---- 最顶层:CTO 主管把两个团队主管当 agent 管起来(顶层 LLM 自主派单)----
            top = create_supervisor(
                model=model,
                agents=[frontend_team, backend_team],  # 注意:传进来的是两个"主管",不是 worker--这就是嵌套
                prompt=("你是技术总监。把前端相关工作交给 frontend_team,后端相关工作交给 backend_team,"
                        "两个团队都汇报完后,综合成一段 120 字以内的交付简报。"),
                supervisor_name="cto",
            ).compile()

            # 同 3.2:stream 流式打印才是真实时间线(嵌套图要 subgraphs=True 才看得到组内事件)
            seen = set()
            for _, state in top.stream(
                    {"messages": [{"role": "user", "content": "做一个待办事项小应用"}]},
                    subgraphs=True, stream_mode="values"):
                for m in state.get("messages", []):
                    if m.id in seen: continue
                    seen.add(m.id)
                    who = getattr(m, "name", None) or m.type
                    content = m.content if isinstance(m.content, str) else str(m.content)
                    if content.strip():
                        print(f"[{who}] {content[:200]}")


            # 🚢 OpenAI Agents SDK: 嵌套agents-as-tools
            import asyncio  # 驱动异步的 agent 调用
            from openai import AsyncOpenAI  # OpenAI 官方异步客户端,指向 OpenRouter 兼容端点
            from agents import Agent, Runner, OpenAIChatCompletionsModel, set_tracing_disabled  # OpenAI Agents SDK:Agent 智能体 / Runner 执行器 / 模型接兼容端点 / 关闭轨迹上报

            set_tracing_disabled(True)                              # 关掉 SDK 默认上报,走第三方端点时必须
            client = AsyncOpenAI(base_url=BASE_URL, api_key=KEY)    # 复用第二章环境准备 cell 的 BASE_URL/KEY
            model = OpenAIChatCompletionsModel(model=MODEL, openai_client=client)

            def make_lead(side: str) -> Agent:                      # 组长:把工程师当工具挂上(第一层嵌套)
                eng = Agent(name=f"{side}_eng", model=model,
                            instructions=f"你是{side}工程师,给出{side}实现方案,80 字以内。")
                return Agent(name=f"{side}_lead", model=model,
                             instructions=f"你是{side}组长。用工具问{side}工程师拿实现方案,然后一句话汇报本组结论。",
                             tools=[eng.as_tool(tool_name=f"ask_{side}_eng", tool_description=f"问{side}工程师实现方案")])  # 把一个 agent 包装成另一个 agent 可调用的工具(agents-as-tools)

            fe_lead = make_lead("前端")
            be_lead = make_lead("后端")
            # 总监:把两个组长当工具挂上(第二层嵌套)
            cto = Agent(name="cto", model=model,
                        instructions="你是技术总监。用工具分别问前端组长、后端组长拿本组结论,综合成 100 字以内交付简报。",
                        tools=[fe_lead.as_tool(tool_name="ask_fe_lead", tool_description="问前端组长本组结论"),
                               be_lead.as_tool(tool_name="ask_be_lead", tool_description="问后端组长本组结论")])

            async def main():
                # max_turns 要给够:两层嵌套意味着总监一次调用会触发组长再调工程师,工具调用轮次成倍增加
                r = await Runner.run(cto, "做一个待办事项小应用", max_turns=20)  # OpenAI Agents SDK 执行入口:跑一个 agent 直到产出
                print("【技术总监交付简报】", r.final_output)

            await main()       # Jupyter 里直接 await


        # 🍉 Swarm 自主协作
        # -------------------------------------------------------------------------------------------------------------------
            # 🚀 OpenAI Agents SDK: handoffs是它的招牌
            import asyncio  # 驱动异步的 agent 调用
            from openai import AsyncOpenAI  # OpenAI 官方异步客户端,指向 OpenRouter 兼容端点
            from agents import Agent, Runner, OpenAIChatCompletionsModel, set_tracing_disabled  # OpenAI Agents SDK:Agent 智能体 / Runner 执行器 / 模型接兼容端点 / 关闭轨迹上报

            set_tracing_disabled(True)                              # 走 OpenRouter 第三方端点,必须关掉回传 OpenAI 的追踪
            client = AsyncOpenAI(base_url=BASE_URL, api_key=KEY)     # 复用环境准备 cell 的 BASE_URL/KEY
            model = OpenAIChatCompletionsModel(model=MODEL, openai_client=client)

            # name 必须英文:handoff 底层是 transfer_to_&lt;name&gt; 工具,中文名会撞名崩溃;中文角色说明放 instructions/handoff_description
            refund = Agent(
                name="refund",
                model=model,
                handoff_description="处理退款申请",
                instructions="你是退款专员,处理退款。如果用户反映商品有质量问题、需要先做技术鉴定,转交给技术专员。一句话回复。",
                handoffs: [tech]
            )
            tech = Agent(
                name="tech",
                model=model,
                handoff_description="商品质量技术鉴定",
                instructions="你是技术专员,负责商品质量技术鉴定,给出鉴定结论。一句话回复。"
            )
            triage = Agent(
                name="triage",
                model=model,
                instructions="你是客服分诊台,只负责判断用户问题类型并转给对应专员:退款相关转 refund,纯技术问题转 tech。不要自己回答业务问题。",
                handoffs=[refund, tech]
            )   # 分诊台能转给退款、技术两个专员

            async def main():
                # max_turns 是保险丝:万一两个专员互踢死循环,到上限强制停下
                result = await Runner.run(triage, "我买的手机有质量问题,想退款", max_turns=10)  # OpenAI Agents SDK 执行入口:跑一个 agent 直到产出
                print("【最终回复】", result.final_output)
                print("\n【接力轨迹】")
                for item in result.new_items:                        # 遍历运行产生的事件,打印 handoff 发生在哪些 agent 之间
                    cls = item.__class__.__name__
                    if "Handoff" in cls:                             # 一次控制权转交事件
                        print(f"  - 发生 handoff:{cls}")
                    elif cls == "MessageOutputItem":                 # 某个 agent 产出了一段回复
                        who = getattr(item.agent, "name", "?")
                        print(f"  - {who} 回复")

            await main()       # Jupyter 里直接 await,不要再套 asyncio.run(环境准备 cell 已开 nest_asyncio)


            # ✈ Langgraph: langgraph-swarm 官方双件套之一
            from langchain_openai import ChatOpenAI  # LangChain 封装的 OpenAI 兼容聊天模型,LangGraph 节点里用它调 LLM
            from langgraph.prebuilt import create_react_agent  # LangGraph 预制件:造一个会自主推理、按需调工具的 ReAct 智能体
            from langgraph_swarm import create_swarm, create_handoff_tool  # langgraph-swarm 扩展:create_swarm 建去中心化群组 / create_handoff_tool 造平级转交工具
            from langgraph.checkpoint.memory import InMemorySaver  # 把图执行状态存进内存的 checkpointer,支持 interrupt 暂停后恢复

            # 复用环境准备 cell 的 MODEL/BASE_URL/KEY
            model = ChatOpenAI(model=MODEL, base_url=BASE_URL, api_key=KEY, temperature=0.3, timeout=180, max_retries=1)

            # 每个专员挂一件 handoff 工具,能把控制权转给另一个专员(平级,无中心)
            refund = create_react_agent(
                model,
                name="refund",  # 造一个会自主推理、按需调工具的 ReAct 智能体
                tools=[
                    create_handoff_tool(agent_name="tech", description="商品有质量问题、需技术鉴定时转给技术专员") # 造一个"把控制权转交给某 agent"的自主协作工具
                ],
                prompt="你是退款专员,处理退款。商品质量问题需要技术鉴定时转给 tech。一句话回复。"
            )
            tech = create_react_agent(
                model,
                name="tech",
                tools=[
                    create_handoff_tool(agent_name="refund", description="鉴定完转回退款专员")
                ],
                prompt="你是技术专员,做商品质量技术鉴定并给结论。一句话回复。")


            checkpointer = InMemorySaver() # swarm 几乎必配:记住 active_agent,否则跨轮丢"现在轮到谁"
            # create_swarm 把两个专员装配成互联群组,default_active_agent 指定初始接待者
            swarm = create_swarm(agents=[refund, tech], default_active_agent="refund").compile(checkpointer=checkpointer)  # 编译图并挂上 checkpointer,状态才能存档、之后恢复

            config = {"configurable": {"thread_id": "1"}}            # thread_id 标识一次会话,checkpointer 按它存取 active_agent
            # 同 3.2:stream 流式打印接力轨迹的真实时间线
            seen = set()
            for _, state in swarm.stream(
                    {"messages": [{"role": "user", "content": "我的手机有质量问题,想退款"}]},
                    config, subgraphs=True, stream_mode="values"):
                for m in state.get("messages", []):
                    if m.id in seen: continue
                    seen.add(m.id)
                    who = getattr(m, "name", None) or m.type
                    content = m.content if isinstance(m.content, str) else str(m.content)
                    if content.strip():
                        print(f"[{who}] {content[:160]}")


    # 🎯 多 Agent 通信模式：Pub/Sub 事件驱动
    # -------------------------------------------------------------------------------------------------------------------

        """
        当多 Agent 一多,Agent 之间直接调用很快变成一团乱麻。
        Pub/Sub(发布/订阅)模式就此登场：

        ❌ 强耦合版：DataAgent 直接调 AnalysisAgent + NotifyAgent + ...
           加一个新消费方就得改 DataAgent 的代码。

        ✅ Pub/Sub 版：DataAgent 只管往 Event Bus 丢事件，谁爱接谁接。
           加新 Agent → 新增订阅者就行,不用改已有代码。
        """

        # 🚀 轻量实现：Python 内存事件总线（零依赖）
        # 单进程场景够用，不用搭 Redis/Kafka

        class EventBus:
            """内存版事件总线——零依赖,适合单进程多 Agent"""
            def __init__(self):
                self._subscribers = {}  # channel → [handler_func, ...]

            def subscribe(self, channel: str, handler):
                """订阅一个频道"""
                self._subscribers.setdefault(channel, []).append(handler)

            async def publish(self, channel: str, event: dict):
                """发布事件到频道,所有订阅者异步执行"""
                handlers = self._subscribers.get(channel, [])
                for handler in handlers:
                    await handler(event)

            def subscribe_pattern(self, pattern: str, handler):
                """通配符订阅: data.* → data.updated, data.deleted 都能收到"""
                self._subscribers.setdefault(pattern, []).append(handler)


        # 🚀 完整示例
        # ────────────────────────────────────────────────────────────────────────────────────

        bus = EventBus()

        # ── Agent A：数据采集,产生事件 ──
        class DataAgent:
            async def process(self, data_id: str):
                new_data = {"id": data_id, "value": 42, "status": "updated"}
                # 发布事件——谁爱听谁听,DataAgent 不关心
                await bus.publish("data.updated", {
                    "type": "data.updated",
                    "payload": new_data,
                    "source": "data_agent"
                })
                print(f"[DataAgent] 发布了 data.updated: {data_id}")

        # ── Agent B：数据分析,订阅 data.updated ──
        class AnalysisAgent:
            async def handle(self, event: dict):
                data = event["payload"]
                result = f"分析完成: {data['value'] * 2}"
                print(f"[AnalysisAgent] {result}")

        # ── Agent C：通知服务,也订阅 data.updated ──
        class NotifyAgent:
            async def handle(self, event: dict):
                print(f"[NotifyAgent] 发送通知: {event['payload']['id']} 已更新")

        # ── 装配 ──
        bus.subscribe("data.updated", AnalysisAgent().handle)
        bus.subscribe("data.updated", NotifyAgent().handle)

        # ── 运行 ──
        import asyncio
        async def demo():
            agent = DataAgent()
            await agent.process("order_001")
            await agent.process("order_002")
        # asyncio.run(demo())
        # 输出:
        # [DataAgent] 发布了 data.updated: order_001
        # [AnalysisAgent] 分析完成: 84
        # [NotifyAgent] 发送通知: order_001 已更新
        # [DataAgent] 发布了 data.updated: order_002
        # ...


        # 🚀 Redis 版（跨进程轻量）
        # ────────────────────────────────────────────────────────────────────────────────────
            # 用 Redis Pub/Sub 代替内存 EventBus,实现跨进程/跨机器的多 Agent 通信。
            # pip install redis
            import redis.asyncio as redis
            import json
            
            class RedisEventBus:
                def __init__(self, url="redis://localhost:6379"):
                    self.redis = redis.from_url(url)
            
                async def publish(self, channel: str, event: dict):
                    await self.redis.publish(channel, json.dumps(event))
            
                async def subscribe(self, channel: str):
                    pubsub = self.redis.pubsub()
                    await pubsub.subscribe(channel)
                    return pubsub  # async for msg in pubsub.listen(): ...

        # 🚀 Kafka 版（生产级，高吞吐/持久化/重放）
        # ────────────────────────────────────────────────────────────────────────────────────
            # 相比 Redis Pub/Sub 的优势：
            # - 消息持久化：Agent 挂了重启后还能消费未处理的消息
            # - 消息回溯：支持从指定 offset 重新消费（排查问题用）
            # - 分区并行：同一个事件可以被多个同组消费者负载均衡消费
            # - 高吞吐：每秒百万级，远超 Redis Pub/Sub
            #
            # 适合场景：
            # - 事件不能丢（订单、支付等关键链路）
            # - 新 Agent 上线后要消费「历史事件」
            # - 多个同类型 Agent 需要负载均衡
            #
            # pip install confluent-kafka  # 或 kafka-python(asyncio 支持较弱)
            #
            from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
            import json
            
            # ── 生产者 ──
            class KafkaEventBus:
                BOOTSTRAP_SERVERS = "localhost:9092"
            
                def __init__(self):
                    self.producer = AIOKafkaProducer(
                        bootstrap_servers=self.BOOTSTRAP_SERVERS
                    )
            
                async def start(self):
                    await self.producer.start()
            
                async def publish(self, topic: str, event: dict):
                    # Kafka 用 topic 对应 Redis 的 channel
                    await self.producer.send_and_wait(
                        topic,
                        json.dumps(event).encode()
                    )
            
                async def stop(self):
                    await self.producer.stop()
            
            
            # ── 消费者 ──
            class AnalysisAgent:
                async def run(self):
                    consumer = AIOKafkaConsumer(
                        "data.updated",          # topic
                        bootstrap_servers="localhost:9092",
                        group_id="analysis_group",  # 消费者组：同组负载均衡
                        auto_offset_reset="earliest",  # 从最早的消息开始消费
                    )
                    await consumer.start()
                    try:
                        async for msg in consumer:
                            event = json.loads(msg.value)
                            data = event["payload"]
                            print(f"[AnalysisAgent] {data['value'] * 2}")
                    finally:
                        await consumer.stop()
            
            # ── 启动 ──
            async def main():
                bus = KafkaEventBus()
                await bus.start()
            
                # 启动消费者（后台任务）
                asyncio.create_task(AnalysisAgent().run())
                await asyncio.sleep(1)
            
                # 生产者发布
                await bus.publish("data.updated", {"type": "data.updated", "payload": {"id": "001", "value": 42}})
                await bus.publish("data.updated", {"type": "data.updated", "payload": {"id": "002", "value": 99}})
            
                await asyncio.sleep(2)
                await bus.stop()


        # 🚀 三种 EventBus 选型
        # ────────────────────────────────────────────────────────────────────────────────────
        #                 内存版              Redis Pub/Sub         Kafka
        # ──────────────────────────────────────────────────────────────────
        # 进程范围        单进程              跨进程/跨机器         跨进程/跨机器
        # 持久化          ❌                  ❌                    ✅(磁盘)
        # 回溯消费        ❌                  ❌                    ✅
        # 吞吐量          内存级别             10万/秒              100万+/秒
        # 消费者组        ❌                   ❌                    ✅负载均衡
        # 运维成本         零                  Redis 服务            ZK/KRaft集群
        # 适合场景        开发测试/原型         小规模生产            核心链路/高要求


        # 🚀 Pub/Sub vs 直接调用 对比
        # ────────────────────────────────────────────────────────────────────────────────────
        #
        #                 直接调用                     Pub/Sub
        # ───────────────────────────────────────────────────────────────
        # A 调 B         A 得等 B 回来                A 发事件就走,不管谁收
        # 加新消费方      改 A 代码                    新增订阅者
        # 一个挂了        调用链断了                    不影响其他
        # 调试           看调用栈                     看事件流
        #
        # ✅ 适合 Pub/Sub:                      ❌ 不适合:
        #    一个事件→多个消费者                   请求-响应模式(需等结果)
        #    解耦跨模块通信                       强依赖链(A做完B才能做)
        #    异步通知/日志/监控                    低延迟要求极高
        #    新 Agent 随时加入                    调用关系简单


        # 🚀 典型事件设计
        # ────────────────────────────────────────────────────────────────────────────────────
        #   事件名            发布者            订阅者
        #   data.updated      DataAgent        分析Agent、通知Agent、存储Agent
        #   data.deleted      DataAgent        通知Agent、备份Agent
        #   user.login        AuthAgent        日志Agent、推荐Agent
        #   order.placed      OrderAgent       库存Agent、支付Agent、通知Agent
        #   task.completed    WorkerAgent      调度Agent、监控Agent
        #   system.error      任何Agent        监控Agent、告警Agent


# ⌛ Langchain Middleware 实例
# ====================================================================================================================================

    from typing import Any
    from langchain_core.messages import ToolMessages
    from langchain_core.messages import RemoveMessages
    from langchain.agents import AgentState
    from langchain.agents.middleware import AgentMiddleware
    from langgraph.graph.message import REMOVE_ALL_MESSAGES
    from langgraph.runtime import Runtime


    from transformers import AutoTokenizer
    # 加载 DeepSeek 官方 tokenizer(首次运行需下载 ~几MB,后续自动缓存)
    # trust_remote_code=True 允许执行模型仓库中的自定义代码(DeepSeek tokenizer 需要)
    tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-V3", trust_remote_code=True)

    def count_tokens(text: str) -> int:
        """
        用 DeepSeek 官方 tokenizer 精确计算 token 数

        Args:
            text: 待计算的文本字符串

        Returns:
            int: token 数量(与 API 实际消耗一致)
        """
        return len(tokenizer.encode(text))

    def count_tokens_approximately(messages: list) -> int:
        """
        用 DeepSeek 官方 tokenizer 精确计算消息列表总 token 数
        函数名保留是为了兼容 MessageTrimMiddleware / CompactionMiddleware 的 token_counter 注入接口,
        实际已升级为精确计数。
        """
        total = 0
        for m in messages:
            content = m.content if hasattr(m, "content") else str(m)
            # 兼容多模态 content:LangChain 的 content 可能是 list of blocks
            if isinstance(content, list):
                content = "".join(
                    block.get("text", "") if isinstance(block, dict) else str(block)
                    for block in content
                )
            if not isinstance(content, str):
                content = str(content)
            total += count_tokens(content)
        return total

    # 🚀 === ToolResultClearMiddleware 工具结果清除
        # 摘要 Prompt 模板
        TOOL_SUMMARY_PROMPT = (
            "用一句话(不超过80字)总结以下工具输出的关键发现,保留数字/文件名/错误信息等决策相关细节:\n\n{tool_output}"
        )

        # 已摘要标记:幂等保护,避免对摘要再次摘要导致信息衰减
        SUMMARY_PREFIX = "[摘要] "

        class ToolResultClearMiddleware(AgentMiddleware):
            """工具结果清除 Middleware(对齐基础入门 2.5 节定义):
            超出保留窗口的 ToolMessage 用 LLM 压缩为一行摘要,保留 tool_call_id。

            Args:
                llm:                      用于生成摘要的 Chat Model 实例
                keep_recent_tool_results: 最近 N 条 ToolMessage 保留原文,默认 3
                summary_prompt:           摘要 Prompt 模板,需含 {tool_output} 占位符
            """

            def __init__(
                self,
                llm,
                keep_recent_tool_result: int = 3, #  # 窗口外的条目才会被 LLM 压缩
                summary_prompt: str = TOOL_SUMMARY_PROMPT,
            ) -> None:
                super().__init__()
                self.llm = llm
                self.keep_recent = keep_recent_tool_result
                self.summary_prompt = summary_prompt
                # 以 tool_call_id 为 key 缓存摘要,跨轮复用避免重复调 LLM
                self._summary_cache: dict[str, str] = {}

            def _summarize(self, msg: ToolMessage) -> str:
                """LLM 压缩单条 ToolMessage,带缓存与异常降级。"""
                # tool_call_id 唯一标识一次工具调用,用它做缓存 key 保证内容幂等
                cache_key = msg.tool_call_id
                if cache_key in self._summary_cache
                    return self._summary_cache[cache_key]

                try:
                    resp = self.llm.invoke(
                        self.summary_prompt.format(tool_ouput=str(msg.content))
                    )
                    summary = resp.content.strip() if hasattr(resp, "content") else str(resp).strip()
                except Exception as e:
                    # LLM 调用失败时降级为占位文本,保证 pipeline 不中断
                    tool_name = getattr(msg, "name", "unknown")
                    summary = f"{tool_name} 原始输出已清除(摘要失败:{type(e).__name__})"

                self._summary_cache[cache_key]=summary
                return summary

            def after_model(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
                messages = state['messages']

                # 收集所有 ToolMessage 的位置索引,后续按窗口切分
                tool_indics = [i for i, m in enumerate(messages) if isinstance(m, ToolMessage)]

                # 未超窗口直接放行,避免无谓 LLM 开销
                if len(tool_indcs) < self.keep_recent:
                    return None

                # 窗口外的索引 = 全部 - 最近 keep_recent 条
                to_clear_set = set(tool_indices[:-self.keep_recent])
                changed = False
                new_messages = []
                for i, msg in enumerate(messages):
                    if i in to_clear_set and isinstance(msg, ToolMessage):
                        content_str = str(msg.content)
                        # 幂等保护:已含 SUMMARY_PREFIX 说明本轮已压缩,跳过防止二次衰减
                        if content_str.startswith(SUMMARY_PREFIX):
                            new_messages.append(msg)
                            continue
                        summary = self._summarize(msg)
                        new_messages.append(ToolMessage(
                            content=f"{SUMMARY_PREFIX}{summary}",
                            tool_call_id=msg.tool_call_id,
                            name=getattr(msg, 'name', None)
                        ))
                        changed=True

                if not changed:
                    return None

                # RemoveMessage(REMOVE_ALL_MESSAGES) 是 LangGraph 清空消息列表的标准信号
                # 再追加 new_messages 等同于原子替换,避免脏写入
                return {
                    "messages": [
                        RemoveMessages(id=REMOVE_ALL_MESSAGES),
                        *new_messages
                    ]
                }


    # 🚀 === ObservationMaskMiddleware 观察遮蔽
        # 遮蔽前缀:幂等保护,避免重复遮蔽时 content_len 被替换为占位符长度
        MASK_PREFIX = "[观察已遮蔽:"

        class ObservationMaskMiddleware(Middleware):
            """观察遮蔽 Middleware:保留 AIMessage 推理链,遮蔽 ToolMessage 为占位符。
            适用于推理密集型任务(代码生成、多步规划),不适用于对话型任务。

            Args:
                mask_template:            遮蔽后占位符模板,支持 {tool_name} {content_len} 插值
                keep_last_n_observations: 保留最近 N 条观察不遮蔽,0 = 全部遮蔽
            """

            def __init__(
                self,
                mask_template: str = "[观察已遮蔽: {tool_name} 返回 {content_len} 字符]",
                keep_last_n_observations: int = 1,  # 0 表示全部遮蔽,>0 表示保留尾部 N 条
            ) -> None:
                super().__init__()
                self.mask_template = mask_template
                self.keep_last_n = keep_last_n_observations

            def before_model(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
                messages = state['messages']
                tool_indices = [i for i, m in messages if isinstance(m, ToolMessage)]

                # 没有ToolMessage则无需处理
                if not tool_indices:
                    return None

                # keep_last_n > 0:保留尾部 N 条,其余遮蔽;= 0:全部遮蔽
                if keep_last_n > 0:
                    to_mask = set(tool_indices[:-self.keep_last_n])
                else:
                    to_mask = set(tool_indices)

                changed = False
                new_messages = []
                for i, msg in enumerate(messages):
                    if i in to_mask and isinstance(msg, ToolMessage):
                        content_str = str(msg.content)
                        # 幂等保护:已遮蔽的跳过,防止 content_len 被替换为占位符长度
                        if (content_str.startswith(MASK_PREFIX)):
                            new_messages.append(msg)
                            continue
                        masked = self.mask_template.format(
                            tool_name=getattr(msg, "name", "tool"),
                            content_len=len(content_str)
                        )
                        new_messages.append(ToolMessage(
                            content=masked,
                            tool_call_id=msg.tool_call_id,
                            name=getattr(msg, "name", None)
                        ))
                        changed = True
                    else:
                        new_messages.append(msg)

                if not changed:
                    return None

                return {
                    "messages": [
                        RemoveMessage(id=REMOVE_ALL_MESSAGES),
                        *new_messages
                    ]
                }


    # 🚀 === MessageTrimMiddleware 硬截断
        from langchain_core.messages import trim_messages

        class MessageTrimMiddleare(AgentMiddleware):
            """硬截断 Middleware:超出 max_tokens 时从头部移除旧消息。

            Args:
                max_tokens:    触发截断的 token 上限,默认 4000
                keep_last:     至少保留最近 N 条消息
                token_counter: 可注入自定义计数函数;None 时用内置粗估
            """

            def __init__(
                self,
                max_tokens: int = 4000,
                keep_last: int = 10,
                token_counter = None
            ):
                super().__init__()
                self.max_tokens = max_tokens
                self.keep_last = keep_last
                self.token_counter = token_counter or count_tokens_approximately

            def before_model(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
                messages = state['messages']

                if self.token_counter(messages) < self.max_tokens:
                    return None

                trimmed = trim_messages(
                    messages,
                    strategy="last",
                    max_tokens=self.max_tokens,
                    token_counter=self.token_counter,
                    include_system=True,
                    allow_partial=False
                )

                # keep_last 保底:trim 可能移除过多导致上下文断层,兜底保留最近 keep_last 条
                if len(trimmed) < self.keep_last and len(messages) >= self.keep_last:
                    trimmed = messages[-self.keep_last:]

                # trim 后条数未减少说明 token_counter 与 trim 结果不一致,无需写回
                if len(trimmed) == len(messages):
                    return None

                return {
                    "messages": [
                        RemoveMessage(content=REMOVE_ALL_MESSAGES),
                        *trimmed
                    ]
                }


    # 🚀 === CompactionMiddleware 全局压缩重启
        # 全局压缩提示词
        COMPACTION_SUMMARY_PROMPT = """
        请将以下对话历史压缩为一段简洁的上下文摘要,保留所有关键事实、决策和结论。
        不要遗漏任何用户明确告知的信息。

        对话历史:
        {history}

        输出格式:
        [对话摘要]
        (直接输出摘要内容,不要加前缀)
        """

        class CompactionMiddleware(AgentMiddleware):
            """全局压缩重启 Middleware:超过 trigger_tokens 时执行完整压缩。

            Args:
                model:          LLM 实例,用于生成历史摘要
                trigger_tokens: token 总数超过此值才触发,默认 3500
                keep_recent:    压缩后保留的最近消息条数,默认 0
                token_counter:  token 计数函数;None 时用粗估
                summary_prompt: 摘要提示词模板,含 {history} 插槽
            """

            def __init__(
                self,
                model,
                trigger_tokens: int = 3500,  # 比上游 Trim/Mask 阈值高,作为最后保险丝
                keep_recent: int = 0,
                token_counter=None,
                summary_prompt: str = COMPACTION_SUMMARY_PROMPT,
            ) -> None:
                super().__init__()
                self.model = model
                self.trigger_tokens = trigger_tokens
                self.keep_recent = keep_recent
                self.token_counter = token_counter or count_tokens_approximately
                self.summary_prompt = summary_prompt

            def before_model(self, state: AgentState, runtime: Runtime) -> dict[str, Any] | None:
                messages = state["messages"]
                total_tokens = self.token_counter(messages)

                # 未超阈值直接放行,不做任何压缩
                if total_tokens <= self.trigger_tokens:
                    return None

                # 分离首条 SystemMessage,压缩完成后需放回列表最前
                if messages and isinstance(messages[0], SystemMessage):
                    system_msg = messages[0]
                    rest = messages[1:]
                else:
                    system_msg = None
                    rest = messages

                # 中段历史(去掉 keep_recent 尾部)才是压缩目标
                if self.keep_recent == 0:
                    # 全局重启语义:保留 system + 摘要,所有对话消息全部压缩
                    to_compact = rest
                    recent = []
                elif len(rest) > self.keep_recent:
                    to_compact = rest[:-self.keep_recent]
                    recent = rest[-self.keep_recent:]
                else:
                    # 剩余消息不足 keep_recent,压缩无意义直接跳过
                    return None

                if not to_compact:
                    return None

                # 截断每条消息至 500 字符,防止历史文本撑爆 LLM 上下文
                history_text = "\n".join(
                    f"[{m.type.upper()}]: {str(m.content)[:500]}" for m in to_compact
                )
                prompt = self.summary_prompt.format(history=history_text)
                summary_text = self.model.invoke(prompt).content
                compaction_msg = SystemMessage(content=f"[历史对话摘要]\n{summary_text}")

                new_messages = []

                if system_msg:
                    new_messages.append(system_msg)

                new_messages.append(compaction_msg)
                new_messages.extend(recent)

                return {
                    "messages": [
                        RemoveMessage(id=REMOVE_ALL_MESSAGES),
                        *new_messages,
                    ]
                }


    # 🚀 === SessionWriteMiddleware 会话写入
        import json, os, time

        class SessionWriteMiddleware(AgentMiddleware):
            """Layer 1:会话级短期记忆 - 文件持久化 + 压缩前半部分

            继承 AgentMiddleware,实现 after_model hook:LLM 调用完成后,
            从 state["messages"] 读取消息列表,执行可选的 LLM 压缩,
            并将摘要和最近消息持久化到 sessions/{session_id}.json。

            这是纯副作用层(return None),不修改 state 中的 messages。
            in-memory messages 截断请使用 Ch1 的 SummarizationMiddleware。

            Args:
                session_id: 当前会话标识,决定 JSON 文件名
                llm: 用于压缩早期消息的 LLM 实例(必须支持 .invoke)
                compress_trigger: 触发压缩的消息数阈值,默认 8(对齐 2.1.1 COMPRESS_TRIGGER)
                keep_recent: 压缩后保留的最近消息数,默认 4(对齐 2.1.1 KEEP_RECENT)
                sessions_dir: 持久化目录,默认 "./sessions"
            """

            def __init__(self, session_id, llm, compress_trigger=8, keep_recent=4, sessions_dir="./sessions"):
                super().__init__()
                self.session_id = session_id
                self.llm = llm
                self.compress_trigger = compress_trigger
                self.keep_recent = keep_recent
                self.sessions_dir = sessions_dir
                self._last_summary = ""  # 内部维护的累积摘要
                os.makedirs(sessions_dir, exist_ok=True) # 确保文件目录存在

            def after_model(self, state: AgentState, runtime: Runtime) -> dict | None:
                """LLM 响应完成后触发:读 messages,可选压缩,落盘到 JSON。

                Args:
                    state: AgentState(dict 子类),通过 state["messages"] 取消息列表
                    runtime: LangGraph Runtime,此 middleware 未使用 runtime.store
                Returns:
                    None - 纯副作用,不修改 state(压缩后的摘要存在实例变量,不写回 state)
                """

                messages = state['messages']
                compress_ctx = self._last_summary

                msg_dicts = [
                    {"role": "user" if m.type == "human" else "assistant", "content": m.content}
                    for m in messages
                ]

                if len(msg_dicts) >= self.compress_trigger:
                    early  = msg_dicts[:-self.keep_recent]           # 前半部分:压缩为摘要
                    recent = msg_dicts[-self.keep_recent:]           # 后半部分:保留原文
                    early_text = "\n".join(f'{m["role"]: {m["content"]}' for m in early)
                    prompt = (
                        f"请将以下对话压缩为一段摘要,保留关键决策和数字:"
                        f"\n\n{early_text}\n\n输出不超过 80 字。"
                    )
                    summary = self.llm.invoke(prompt).content

                    # 累积摘要:新摘要追加到旧的后面,避免跨轮压缩时信息丢失
                    compressed_ctx =  (compressed_ctx + " " + summary).strip() if compressed_ctx else summary
                    self._last_summary = compressed_ctx
                    msg_dicts = recent

                # 持久化到 sessions/{session_id}.json
                session = {
                    "title": state.get('title', f"Session {self.session_id}"),
                    "updated_at": time.strftime("%Y-%m-%d %H:%M"),  # 每次写入更新时间戳
                    "compressed_context": compressed_ctx,
                    "messages": msg_dicts,
                }

                path = os.path.join(self.sessions_dir, f"{self.session_id}.json")
                with open(path, "w", encoding="uft-8") as f:
                    # indent=2 保持可读性,ensure_ascii=False 保留中文字符
                    json.jump(session, f, ensure_ascii=False, indent=2)

                return None


# 📢 Agent 服务化  FastAPI
# ====================================================================================================================================

    from fastapi import FastAPI

    app = FastAPI()

    @app.get(
        "/items/{item_id}",
        tags=["items"],
        summary="通过Id获取物品",
        description="根据物品ID返回物品的详细信息"
    )
    async def read_item(item_id: int):
        return {"item_id": item_id}


    # 🚀 响应模型
        from typing import Optional
        from fastaip import FastAPI, status
        from pydantic import BaseModel

        app = FastAPI()

        class Item(BaseModel):
            name: str
            description: Optional[str] = None
            price: float
            tax: Optional[float] = None

        @app.post(
            "/items",
            response_model=Item,
            status_code=status.HTTP_201_CREATED
        )
        async def create_item(item: Item):
            return item

    # 🌰 特殊类型和验证
        from fastapi import FastAPI
        from pydantic import BaseModel, HttpUrl

        app = FastAPI()

        class Image(BaseModel):
            url: HttpUrl
            name: str

        class Item(BaseModel):
            name: str
            description: str | None = None
            price: float
            tax: float | None = None
            tags: set[str] = []
            image: Image | None = None

        @app.put("item/{item_id}")
        async def update_item(item_id: int, item: Item):
            results = {"item_id": item_id, "item": item}
            return results

    # 🚀 使用Cookie参数
        from typing import Annotated
        from fastapi import FastAPI, Cookie

        app = FastAPI()

        @app.get("/items/")
        async def read_items(ads_id: Annotated[str | None, Cookie(descrption="商品Id")] = None):
            return {"ads_id": ads_id}

    # 🚀 限制接收Cookie
        # 在某些特殊情况下,你可能想要限制只接收特定的Cookie。可以使用pydantic的模型配置额外的的字段
        from typing import Annotated
        from fastapi import FastAPI, Cookie
        from pydantic import BaseModel

        app = FastAPI()

        class Cookies(BaseModel):
            model_config={"extra": "forbid"}

            session_id: str
            fatebook_tracker: str | None = None
            googall_tracker: str | None = None

        @app.get("/items/")
        async def read_items(cookies: Annotated[Cookies, Cookie()]):
            return cookies

    # 🚀 声明header参数
        from typing import Annotated
        from fastapi import FastAPI, Header

        app = FastAPI()

        @app.get("/item")
        async def read_items(user_agent: Annotated[str|None, Header()] = None):
            return {"User_Agent": user_agent}

        # 如果需要禁用下划线到连字符的自动转换,可以在Header中的设置convert_underscores=False


    # 🖥 额外模型:分离输入、输出和数据库模型
        from pydantic import BaseModel, EmailStr

        class UserIn(BaseModel):
            username: str
            password: str
            email: EmailStr
            full_name: str | None = None

        class UserOut(BaseModel):
            username: str
            email: EmailStr
            full_name: str | None = None

        class UserInDB(BaseModel):
            username: str
            hashed_password: str
            email: EmailStr
            full_name: str | None = None

        from fastapi import FastAPI
        app = FastAPI()

        def fake_password_hasher(raw_password: str):
            return "supersecret" + raw_password

        def fake_save_user(user_in: UserIn):
            hashed_password = fake_password_hasher(user_in.password)
            user_in_db = UserInDB(**user_in.model_dump(), hashed_password=hashed_password)
            return user_in_db

        @app.post("/user/", response_model=UserOut)
        async def create_user(user_in: UserIn):
            user_saved = fake_save_user(user_in)
            return user_saved

    # ✖ 错误处理
    from fastapi import FastAPI, HTTPException

    app = FastAPI()

    items = {"foo": "The Foo Wrestiers"}

    @app.get("/items/{item_id}")
    async def read_item(item_id: str):
        if item_id not in items
            raise HTTPException(status_code=404, detail="Item not found")
        return {"item": items[item_id]}


    # 🚀 jsonable_encoder() 函数可以将任何对象转换为与JSON兼容的python数据结构
        from fastapi.encoders import jsonable_encoder

        item_dict = jsonable_encoder(item)


    # 🔥 依赖注入
        from fastapi import FastAPI, Depends, HTTPException, Cookie

        app = FastAPI()

        # 定义依赖项,从Cookie中验证用户Token
        async def get_current_infok(access_token: str = Cookie(None))
            if access_token is None:
                raise HTTPException(status_code=401, detail="未提供认证信息")

            return {"user_id": 1, "username": "xxxx", "role": "admin"}


        @app.get("/prefile")
        async def get_profile(current_user: dict = Depends(get_current_user)):
            return {
                "user_id": current_user["user_id"],
                "phone": "138****2212"
            }


    # 🚀 全局依赖关系
        from fastapi import FastAPI, Depends, Header
        from typing import Optional

        # 定义全局依赖,记录请求头
        async def log_request_header(
            # Header(None):从请求头X-Request-Id获取值,如果不存在则为None
            # 参数名x_request_id自动转换为X-Request-Id
            x_request_id: Optional[str] -> Header(None)
        ):
            print(f"Request ID: {x_request_id}")

        # 创建应用,设置全局依赖
        app = FastAPI(dependencies=[Depends(log_request_header)])


    # 🚀 路由
        from fastapi import FastAPI, APIRouter

        app = FastAPI()

        user_router = APIRouter(
            prefix="/users",
            tags=["用户管理"]
        )

        @user_router.get("/")
        async def get_users():
            return ["user1", "user2"]

        @user_router.get("/{user_id}")
        async def get_user(user_id: int):
            return {"user_id": user_id}

        app.include_router(user_router)


    # 🚀 中间件
        import time
        from fastapi import FastAPI, Request

        # 定义中间件 全局
        @app.middleware("http")
        async def add_process_time_header(
            request: Request,
            call_next
        ):
            start_time = time.perf_counter()
            response = await call_next(request)

            process_time = time.perf_counter() - start_time

            response.headers["X-Process-Time"] = str(process_time)
            return response


        # 类形式添加中间件 需要手动注册
        from starletter.middleware.base import BaseHTTPMiddleware

        class MiddlewareA(BaseHTTPMiddleware):
            async def dispatch(self, request, call_next):
                print("开始")
                response = call_next(request)
                print("结束")
                return response

        # 添加中间件
        app.add_middleware(MiddlewareA)


        # 🍎 CORS
        from fastapi import FastAPI
        from fastapi.midddlware.cors import CORSMiddleware

        app = FastAPI()

        app.middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credientials=True,
            allow_methods=["*"],
            allow_headers=["*"]
        )


# 🐴 Harness Engineering
# ====================================================================================================================================

    # ✈ 八大机制
        # 👑 Agent Loop 四相循环
            MAX_ITER = 20  # 硬性上限,到点必停

            def agent_loop(initial_state):
                """四相循环主函数

                Args:
                    initial_state: 初始状态对象(含任务、历史、已完成标记)
                Returns:
                    final_state: 循环结束时的最终状态
                """
                state = initial_state
                # for 循环代替 while True,保证最大迭代次数
                for i in range(MAX_ITER):
                    context = gather_context(state)    # 相 1:收集上下文
                    action = take_action(context)      # 相 2:执行动作
                    result = verify(action)            # 相 3:验证结果
                    state = iterate(state, result)     # 相 4:迭代状态
                    # 显式终止条件:状态自报完成才退出
                    if state.is_done():
                        break
                return state

        # 👑 Tool Use 工具编排
            TOOL_REGISTRY = {"read_file": read_file, "write_file": write_file, "run_pytest": run_pytest}

            def safe_tool_call(tool_name: str, **kwargs) -> dict:
                """结构化工具调用包装器

                Args:
                    tool_name: 工具名(从 TOOL_REGISTRY 查表)
                    **kwargs: 工具参数(JSON schema 约束)
                Returns:
                    dict: {"status": "ok"|"error", "result": 或 "error": 字符串}
                """
                try:
                    # 成功路径:正常返回结果
                    result = TOOL_REGISTRY[tool_name](**kwargs)
                    return {"status": "ok", "result": result}
                except Exception as e:
                    # 关键改进:error 不是空字符串,agent 能感知失败
                    return {"status": "error", "error": str(e)}

        # 👑 Progress Tracking 进度追踪
            import json
            import pathlib

            PROGRESS_FILE = pathlib.Path("claude-progress.json")

            def save_progress(state: dict) -> None:
                """每步完成后写进度文件,失败后可续传

                Args:
                    state: 当前 agent 状态(含已完成任务、上下文快照)
                """
                # 每步写磁盘,写 JSON 格式方便人类阅读和工具消费
                PROGRESS_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False))


            def load_progress() -> dict | None:
                """启动时先读进度,有则续传

                Returns:
                    dict 或 None:有进度则返回状态,无则返回 None(全新开始)
                """
                # 存在即续传,不存在即从零开始
                if PROGRESS_FILE.exists():
                    return json.loads(PROGRESS_FILE.read_text())
                return None

        # 👑 Context Management 上下文管理
            CONTEXT_THRESHOLD = 80_000  # token 阈值(示意值,按模型实际 window 调整)

            def call_llm_for_summary(msgs: list) -> str:
                """把一串 messages 压成一段摘要

                真实实现会调 LLM 生成带语义的总结;此处用最朴素的"拼接+截断"演示"压缩动作的形态",
                让学员看清 messages 从 N 条 → 1 条 summary 的数据流,而不是 LLM 本身怎么总结。

                Args:
                    msgs: 待压缩的消息列表(不含 system prompt)
                Returns:
                    str: 摘要字符串
                """
                # 仅演示形态:把所有 content 拼接后截断;真实场景请换成 LLM 摘要
                joined = " | ".join(str(m.get("content", ""))[:80] for m in msgs)
                return f"[前 {len(msgs)} 条消息压缩摘要] {joined[:500]}"


            def manage_context(messages: list, token_count: int) -> list:
                """上下文管理器:超阈值触发压缩

                Args:
                    messages: 当前消息列表(OpenAI 格式)
                    token_count: 当前总 token 数(由上层调用方估算)
                Returns:
                    list: 处理后的 messages(未超阈值则原样返回)
                """
                # 未超阈值直接返回,保持 prompt cache 命中
                if token_count <= CONTEXT_THRESHOLD:
                    return messages
                # 超阈值才触发压缩;system prompt(messages[0])永远不动以保 cache
                summary = call_llm_for_summary(messages[1:])
                # 返回前缀稳定 + 压缩摘要的新 messages
                return [messages[0], {"role": "assistant", "content": summary}]

        # 👑 Feature List 任务拆解
            # 强制单次只做一件事
            import json

            # 典型 feature list 结构:id / task / status 三字段
            feature_list = [
                {"id": 1, "task": "读取 test_calculator.py", "status": "pending"},
                {"id": 2, "task": "修复 add 函数的整数溢出 bug", "status": "pending"},
                {"id": 3, "task": "运行 pytest 验证全部通过", "status": "pending"},
            ]


            def get_next_task(features: list) -> dict | None:
                """取下一个 pending 任务,防止 agent 贪心多做

                Args:
                    features: feature list(字典列表)
                Returns:
                    dict 或 None:最早的 pending 任务,全部完成则 None
                """
                # 按 id 顺序取第一个 pending,强制单步执行
                # 这里用 next + 生成器是为了短路--找到第一个立即返回,不遍历全表
                # 如果 agent 想"一次做多件",这个函数只返回一件,它就不得不分多轮
                return next((f for f in features if f["status"] == "pending"), None)

        # 👑 Verification Loop 验证闭环
            import subprocess

            def verify_with_pytest() -> dict:
                """pytest 真机验证

                Returns:
                    dict: {"passed": bool, "output": str}
                """
                # 真跑 pytest,不 mock 不 skip(mock 会让 agent 看到"假通过")
                # --tb=short 让错误回溯简短,避免 stdout 溢出塞满 context
                result = subprocess.run(
                    ["pytest", "--tb=short"], capture_output=True, text=True
                )
                # 关键:returncode 不丢弃,作为 passed 判定依据
                # stdout + stderr 合并返回,让 agent 能看到完整错误信息
                return {
                    "passed": result.returncode == 0,
                    "output": result.stdout + result.stderr,
                }

        # 👑 Subagents 子代理分治
            def subagent(task: str, tools: list) -> str:
                """子代理:独立 messages 列表完成子任务

                Args:
                    task: 子任务描述(自然语言)
                    tools: 子代理可用工具清单
                Returns:
                    str: 子任务的最终结论(不含中间过程)
                """
                # 子代理有独立的 messages,不共享主 agent 历史
                sub_messages = [
                    {"role": "system", "content": "你是专注于单一子任务的助手"},
                    {"role": "user", "content": task},
                ]
                # 内部跑一个完整的 agent loop,但外部看不到中间步骤
                return run_loop(sub_messages, tools)

        # 👑 Generator-Evaluator 生成-评估对抗
            def call_llm(prompt: str) -> str:
                """LLM 调用 placeholder

                真实实现是 client.chat.completions.create(...),见 cell [55] naive_agent 的 LLM 调用。
                此处用回显保证三角色的输入-输出形态可见,让学员聚焦三角色结构而非 LLM 细节。
                """
                return f"[LLM 响应占位] 针对 prompt 前 60 字:{prompt[:60]}... (真实场景由 LLM 生成)"


            def planner(task: str) -> list:
                """规划者:把大任务拆成可评审的子任务清单

                Args:
                    task: 原始任务描述
                Returns:
                    list: 可评审的子任务清单
                """
                return call_llm(f"把任务拆成可独立评审的子任务清单:{task}")


            def generator(subtask: str) -> str:
                """生成者:按规划逐项产出代码或解决方案

                Args:
                    subtask: 单个子任务
                Returns:
                    str: 生成的代码或方案
                """
                return call_llm(f"请完成以下子任务:{subtask}")


            def evaluator(code: str, criteria: str) -> dict:
                """评价者:以怀疑者视角独立评审,不看生成过程

                Args:
                    code: Generator 的产出(不含中间过程)
                    criteria: 评审标准
                Returns:
                    dict: {"approved": bool, "feedback": str}
                """
                # 不看生成过程,只看最终产出是否满足标准
                # 关键:prompt 里明确"批判性",诱导 LLM 以审稿人角色挑刺而非辩护
                verdict = call_llm(f"批判性审查以下代码是否满足标准:{criteria}\n\n{code}")
                # 简化判定:verdict 含"通过"二字则认为 approved;工程代码应改为结构化输出(JSON)
                return {"approved": "通过" in verdict, "feedback": verdict}
                

# 🌀 Loop Engineering
# ====================================================================================================================================
   
    # 🎁 loop engineering 六大核心组件
        # Automation 用于触发循环的机制，支持手动、定时、事件等多种触发方式
        # Worktree 为每次循环或任务创建独立的工作空间，隔离修改，便于管理和回溯
        # Skill 将常用的流程，提示词、工具组合 形成可复用的技能，提升执行效率和一致性
        # Plugin 扩展codex的能力，连接外部服务或工具，如浏览器、git搜索等
        # Subagent 将复杂任务拆分成多个子代理并行或协同完成，提升整体执行能力
        # Memory 保存跨轮次的上下文，经验和结果，让循环是具备连续性和自我改进能力

    # 💥 触发方式
        # 1. 人工触发 人主动给出目标、反馈或确认
        # 2. 定时触发 到固定时间自动启动任务
        # 3. 条件触发 某个外部事件、状态变化或检查结果满足条件

    # ✈ Token管理： 钱怎么烧的
        # LLM 的 context window 是有限的（16K / 32K / 128K / 1M）。但 agent 每多一步，
            # 要追加 tool call + tool result（大量 token）
            # 每步的 thought + action 也要存
            # 超过窗口长度的部分直接丢失

        # 后果：第 5 步以后，Agent 已经记不清第 1 步查到了什么。

        # 🐢 实战方案：分层记忆管理
        """
            ┌─────────────────────────────────────┐
            │          Current Step               │ ← 最新几步，完整保留
            ├─────────────────────────────────────┤
            │        Working Memory               │ ← 中间结果摘要压缩
            ├─────────────────────────────────────┤
            │        Task Context                 │ ← 原始任务+关键发现，始终保留
            ├─────────────────────────────────────┤
            │        Long-term Memory             │ ← 之前任务的教训，按需检索
            └─────────────────────────────────────┘
        """
        def build_agent_context(task, steps, long_term_memory, max_tokens=32000):
            """
            构建当前 LLM 调用上下文
            预算分配：
            - 系统提示 + 任务描述: ~4000 tokens 固定
            - 长程记忆（按需检索）: ~2000 tokens
            - 当前步骤上下文: ~6000 tokens
            - 历史步骤摘要: ~10000 tokens
            - 留给输出的空间: ~10000 tokens
            """
            context = []
            
            # 1. 系统提示 + 任务（始终保留）
            system = build_system_prompt(task)
            context.append(("system", system))
            
            # 2. 长程记忆（按语义相似度检索最近3条）
            memories = retrieve_relevant(long_term_memory, task, top_k=3)
            context.append(("memory", compress_memories(memories)))
            
            # 3. 当前步骤 + 最近3步完整历史
            recent = steps[-3:]
            context.append(("history", format_recent_steps(recent)))
            
            # 4. 更早的历史 → 摘要压缩
            if len(steps) > 3:
                earlier = steps[:-3]
                summary = summarize_steps(earlier)
                context.append(("summary", summary))
            
            return assemble_messages(context)

    # 🐰 循环终止检测：怎么确定该停了       
        # 这是 Loop Engineering 最难的问题之一。很多 Agent 要么早停（活没干完就说完成了），要么死循环。

        # 三类终止策略
            # 🦊 1. 重复检测（兜圈子识别）
                # Agent 反复尝试同样的 tool call，得到同样的结果，换句话再说一遍——这是最常见的死循环模式
                class RepeatDetector:
                    def __init__(self, window=5, threshold=0.85):
                        self.history = []  # 存 (action_hash, observation_hash)
                        self.window = window
                        self.threshold = threshold
                    
                    def check(self, action, observation):
                        entry = (hash_action(action), hash_text(observation))
                        self.history.append(entry)
                        
                        if len(self.history) < self.window * 2:
                            return False
                        
                        recent = self.history[-self.window:]
                        earlier = self.history[-(self.window*2):-self.window]
                        
                        similarity = compute_sequence_similarity(recent, earlier)
                        
                        if similarity > self.threshold:
                            return True  # 正在兜圈子！
                        return False 

            # 🦊 2. 置信度评估
                # 让 LLM 给自己打分——"你对当前答案的把握有多大？"
                # 这个方法看着玄学，但实测很好用。关键是 prompt 里要明确告诉 LLM 要考虑什么。
                def evaluate_confidence(context, answer):
                    prompt = f"""
                    Task: {context}
                    Current answer: {answer}
                    
                    Rate your confidence (0-100):
                    - 考虑：信息是否完整？是否还有重要的未知信息？
                    - >= 90: 可以输出最终答案
                    - 70-89: 需要再确认1-2个点
                    - < 70: 需要继续探索
                    
                    Confidence score (only output a number):
                    """
                    score = int(llm.chat(prompt).strip())
                    return score  

            # 🦊 3. 边际收益检测
                # 如果这一步相比上一步没有实质新信息，就可以停了。
                def marginal_gain(last_result, new_result):
                    """判断新步骤是否带来实质新信息"""
                    prompt = f"""
                    Previous findings: {last_result}
                    New findings: {new_result}
                    
                    Does the new finding contain SIGNIFICANT new information
                    that wasn't already in previous findings? Answer YES or NO.
                    """
                    return llm.chat(prompt).strip() == "YES"  

            # 🐢 实战中的组合策略
                def should_stop(context, step_count, repeat_detector):
                    # 安全阀：绝对步数上限
                    if step_count >= max_steps:
                        return "MAX_STEPS", "达到最大步数限制"
                
                    # 检测兜圈子
                    if repeat_detector.check(context.last_action, context.last_obs):
                        return "REPEAT_LOOP", "检测到重复循环"
                    
                    # 评估置信度
                    confidence = evaluate_confidence(context)
                    if confidence >= 90:
                        return "HIGH_CONFIDENCE", f"置信度 {confidence}%"
                    
                    # 边际收益
                    if step_count >= 3 and not marginal_gain(context.prev_summary, context.latest):
                        return "DIMINISHING_RETURNS", "边际收益不足"
                    
                    return "CONTINUE", None              

    # 🍬 幻觉累积：一步错，步步错
        # 问题本质 Agent 每一步都会产生新的"事实"。问题在于——LLM 生成的东西不一定对，但后续步骤会把它当真理。

        # 🐢 解决方案：事实核查层
            # 真正有效的做法是：每一步把"工具返回的硬数据"和"LLM推理出的结论"分开放。
            # 硬数据可信度高，推理结论需要验证才能当"事实"传给下一步。 

            class FactChecker:
                def __init__(self):
                    self.fact_pool = {}  # claim → source_confidence
                
                def verify(self, claim, source):
                    """验证一个claim的可信度"""
                    if source == "tool_result":
                        # 工具返回的是硬数据，高置信度
                        confidence = 0.95
                    elif source == "llm_reasoning":
                        # LLM推理出来的，需要交叉验证
                        confidence = self.cross_validate(claim)
                    else:
                        confidence = 0.5
                    
                    self.fact_pool[claim] = min(self.fact_pool.get(claim, 1.0), confidence)
                    return confidence
                
                def cross_validate(self, claim):
                    """交叉验证：让LLM用不同角度再确认一次"""
                    prompt = f"""
                    之前的结论：{claim}

                    请回顾前几步的原始数据来验证这个结论：

                    1. 原始数据中是否有**直接证据**支持这个结论？
                    2. 是否有任何**矛盾**的地方？
                    3. 如果原始数据不足以支撑这个结论，请指出缺失了什么

                    如果你无法验证，直接回复：不确定
                    如果发现矛盾，回复：存疑 - [具体矛盾点]
                    如果验证通过，回复：确认 - [依据]
                    """
                    result = llm.chat(prompt)
                    if "UNCERTAIN" in result or "contradiction" in result.lower():
                        return 0.3
                    return 0.7

    # 🦎 错误恢复：别一竿子打死
        # 工具调用一定会出问题。API 超时、参数格式错误、返回值异常、网络抖一下——这是常态。
        """
        关键原则        
        - 临时性错误 → 重试（带退避）
        - 可修复错误 → 修正后重试（让 LLM 自己读报错信息修参数）
        - 策略性错误 → 换方案（此路不通换条路）
        - 致命错误 → 报给人
        """
        class ErrorHandler:
            def handle(self, error, step_context, retry_count):
                severity = self.classify(error)
                
                if severity == "TRANSIENT":
                    # 临时性错误（网络超时、限流）→ 重试+退避
                    return self.retry_with_backoff(step_context, retry_count)
                
                elif severity == "FORMAT":
                    # 参数格式错误 → 修正后重试
                    fixed = self.fix_tool_call(step_context.last_action, error)
                    return self.retry_with_fix(fixed)
                
                elif severity == "LOGICAL":
                    # 逻辑错误（工具返回无效数据）→ 换策略
                    return self.switch_strategy(step_context)
                
                elif severity == "FATAL":
                    # 致命错误（API key失效、权限问题）→ 直接上报
                    return self.escalate(error)
            
            def retry_with_backoff(self, context, retry_count):
                delay = min(2 ** retry_count * 0.5, 30)  # 指数退避，上限30秒
                time.sleep(delay)
                return execute(context.last_action)
            
            def switch_strategy(self, context):
                """换一种方式达到目的"""
                prompt = f"""
                Previous approach failed. Error: {context.last_error}
                Current goal: {context.goal}
                
                Suggest an alternative approach to achieve the same goal.
                """
                new_plan = llm.chat(prompt)
                return execute_new_plan(new_plan)

        # 💰 成本控制：loop 最大的隐藏坑       
            """
            1. 先切模式再切模型 — 简单的一步查询用 4o-mini/DeepSeek，高难度推理才上强模型
            2. 缓存相同的 tool call result — 同一个查询不要调两次
            3. 预判终止 — 发现剩余步骤的收益不会超过成本，提前结束
            4. 批处理 — 如果有多个独立查询，合并成一次调用
            """


# 🚄 模型微调
# ====================================================================================================================================
    """
    🎂 10种模型微调的方式
        1. 全量微调(Full Fine-tuning)
        2. 低秩矩阵微调Lora(Low-Rank Adaptation)
        3. Qlora
        4. 适配器微调(Adapter Tuning)
        5. 冻结微调
        6. 人类反馈的强化学习(Reinforcement Learning from Human Feedback , RLHF)
        7. PPO(近端优化策略)
        8. DPO(直接偏好优化)
        9. GRPO(组相对策略优化)
        10. SFT(监督式微调)
    """
    """
    🛠 主流框架
        1. LLaMA-Factory
        2. Unsloth
        3. DeepSpeed
        4. TRL(Transformer Reinforcement Learning)
        5. OpenRLHF
    """
    """
    💿 RLHF的组成结构
        奖励模型(Reward Model, RM)
        价值模型(Critic)
        参考模型(Reference Model)
        训练模型(Actor)
    """

    """
    🐑 LLaMA-Factory
    安装
    git clone --depth 1 http://github.com/hiyouga/LLaMA-Factory.git
    cd LLaMA-Factory
    pip install -e ".[torch,metrics]"
    如果出现环境冲突,尝试使用pip install --no-deps -e .
    完成安装后,可以通过使用llamafactory-cli version来快速校验完成是否成功

    llamafactory-cli train examples/train_lora/llama3_lora_sft.yaml 开启训练
    llamafactory-cli export examples/merge-lora/llama3_lora_sft.yaml 合并模型
    llamafactory-cli chat examples/inference/llama3_lora_sft.yaml 推理验证
    llamafactory-cli eval examples/train_lora/llama3_lora_eval.yaml 评估

    llamafactory-cli webui 启动图形化界面

    API_PORT=8000 CUDA_DEVICES=0 llamafactory-cli api example/inference/llama3_lora_sft.yaml

    pip install nvitop  装监控
    nvitop -m auto 显示显卡信息
    watch -n 1 nvidia-smi 直接监控显卡信息
    """

    """
    📏 量化方法
        GPTQ 等后训练
    """

    """
    🚀 ======================= train_lora.yaml ==================================
    # model
    model_name_or_path: Qwen/Qwen2.5-7B-Instruct      # 基座模型
    quantization_bit: 4               # QLoRA 4bit    # 量化精度
    trust_remote_code: true    # 允许模型加载时执行第三方代码

    # method
    stage: sft                 # 微调方法
    do_train: true
    finetuning_type: lora      # lora full(全量) freeze(冻结部分层)
    lora_target: all           # LoRA 插在哪些模块上。all = 所有线性层都插 LoRA adapter。也可以精细控制,比如 q_proj, v_proj 只插 Q 和 V 矩阵。
    lora_rank: 8               # LoRA 的秩(rank)。数字越小,参数量越少,模型能力衰减可能越大。常见值:8、16、32。8 是性价比之选
    lora_alpha: 16             # LoRA 的缩放系数。公式:输出 = 原权重 + (alpha / rank) * LoRA 权重。一般设成 rank 的 1-2 倍。rank=8 时 alpha=16 是经典配置

    # dataset
    dataset: identity, my_dataset
    template: qwen
    cutoff_len: 2048

    # output
    output_dir: ./output/qwen-lora   # 导出目录
    logging_steps: 10
    save_steps: 500

    # train
    per_device_train_batch_size: 4
    gradient_accumulation_steps: 4
    learning_rate: 1e-4
    num_train_epochs: 3
    lr_scheduler_type: cosine
    warmup_ratio: 0.1

    # eval
    evaluation_strategy: steps      # 什么时候做评估。steps 按步数评估。还有 epoch(每轮结束评估)、no(不评估)
    eval_steps: 500                 # 每 500 步评估一次。跟 save_steps 保持一样比较方便--每次保存时也做评估
    per_device_eval_batch_size: 4   # 评估时的 batch size,跟训练一样就行。可以比训练大一点(评估不计算梯度,不吃显存)

    # other
    fp16: true
    =============================================================================
    """


    """
    🚀 ================================ merge_lora.yaml ========================
    # model
    model_name_to_path: LLM_Research/Meta-LLama-3-88-Instruct
    adapter_name_or_path: saves/llama3-8b/lora/sft
    template: llama3
    trust_remote_code: true

    # export
    export_dir: output/llama3_lora_sft
    export_size: 5
    export_device: cpu # choices[cpu, auto]
    export_legacy_format: false
    ============================================================================
    """


    # ---- HuggingFace 工具链（微调前置） ----

    import requests

    API_URL = "https://api-inference.huggingface.co/models/uer/gpt2-chinese-cluecorpussmall"

    # 不使用token进行匿名访问
    response = requests.post(API_URL, json={"inputs": "你好啊!Hugging face"})
    print(response.json())


    # 使用token进行访问
    API_TOKEN = "bcviiofewvniu"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}"
    }

    response = requests.post(API_URL,  headers=headers, json={"inputs": "你好啊!Hugging face"})
    print(response.json())


    # 🚀将模型下载到本地调用
    from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
    from transformers import BertForSequenceClassification, BertTokenizer

    # 将模型与分词工具下载到本地
    model_name = "uer/gpt2-chinese-cluecorpussmall"
    cache_dir = "model/uer/gpt2-chinese-cluecorpussmall" # 模型下载的本地目录

    # 下载模型
    AutoModelForCausalLM.from_pretrained(model_name, cache_dir=cache_dir)
    # 下载分词器
    AutoTokenizer.from_pretrained(nodel_name, cache_dir=cache_dir)


    model_name="bert-base-chinese"
    model = BertForSequenceClassification.from_pretrained(model_name)
    tokenizer = BertTokenizer.from_pretrained(model_name)
    # 创建分类pipeline
    classify = pipeline("text-classification", model=model, tokenizer=tokenizer, device="cuda")

    # 进行分类
    result = classify("你好,我是一款语言模型")
    print(result)


    from datasets import load_dataset, load_from_disk

    # 在线加载数据集
    dataset = load_dataset("NousResearch/hermes-function-calling-v1", split="train")

    # 本地加载数据集
    dataset = load_from_disk("<本地绝对路径>")


    # 🚀定制化数据集
    from torch.utils.data import Dataset
    from datasets import load_from_disk

    class MyDataset(Dataset):
        # 初始化数据
        def __init__(self, split):
            # 从词盘加载数据
            self.dataset = load_from_disk(r"<数据在本地的绝对路径>")
            if split == 'train':
                self.dataset = self.dataset['train']
            elif split == "validation":
                self.dataset = self.dataset["validation"]
            elif split == "test":
                self.dataset = self.dataset["test"]
            else:
                print("数据集的名称输入错误")

        # 获取数据的长度
        def __len__(self):
            return len(self.dataset)

        # 对数据做定制化处理
        def __getitem__(self, item):
            text = self.dataset[item]["text"]
            label = self.dataset[item]["label"]
            return text, label


    # 🚀定制模型
    from transformers import BertModel
    import torch

    # 定义训练设备
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    pretrained = BertModel.from_pretrained("bert-base-chinese").to(DEVICE)
    print(pretrained)  # out_features=

    # 定义下游任务模型(将主干网络所提取的特征进行分类)
    class Model(torch.nn.Module):
        # 模型结构设计
        def __init__(self):
            super().__init__()
            self.fc = torch.nn.Linear(768, 2) # 二分类
        def forward(self, input_ids, attention_mask, token_type_ids):  # 定义前向推理
            with torch.no_grad(): # 上游任务不参与训练
                out = pretrained(input_ids=input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids)

            # 下游任务参与训练
            out = self.fc(out.last_hidden_state[:,0])
            out = out.softmax(dim=1)
            return out


    # 🚀 训练器
    import torch
    from torch.utils.data import DataLoader
    from transformers import BertTokenizer, AdanW

    # 定义训练设备
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # 训练轮次
    EPOCH = 100

    tokenizer = BertTokenizer.from_pretrained("bert-base-chinese")

    # 自定义函数,对数据进行编码处理
    def collate_fn(data):
        sentes = [i[0] for i in data]
        label = [i[1] for i in data]
        # 编码处理
        data = tokernizer.batch_encode_plus(
            batch_text_or_text_pairs=sentes,
            truncation=True,
            padding="max_length",
            max_length=500,
            return_tensors="pt",
            return_length=True
        )
        input_ids = data["input_ids"]
        attention_mask = data["attention_mask"]
        token_type_ids = data["token_type_ids"]
        labels = torch.longTensor(label)

        return input_ids, attention_mask, token_type_ids, labels


    # 创建数据集
    train_dataset = MyDataset("train")
    # 创建data_loader
    train_loader = DataLoader(
        dataset=train_loader,
        batch_size=32,
        shuffle=True, # 打乱数据集
        drop_last=True,
        collate_fn=collate_fn
    )

    if __name__ == "__main__":
        # 开始训练
        print(DEVICE)
        model = Model().to(DEVICE)
        optimizer = AdanW(model.parameters(), lr=5e-4)
        loss_func = torch.nn.CrossEntropyLoss()

        model.train()
        for epoch in range(EPOCH):
            for i, (input_ids, attention_mask, token_type_ids, labels) in enumerate(train_loader):
                # 将数据放到DEVICE上
                input_ids, attention_mask, token_type_ids, labels = input_ids.to(DEVICE), \
                    attention_mask.to(DEVICE), token_type_ids.to(DEVICE), labels.to(DEVICE)

                # 执行前向计算得到输出
                out = model(input_ids, attention_mask, token_type_ids)

                loss = loss_func(out, labels)

                optimizer.zero_grad()
                loss.backword()
                optimizer.step()

                if i%5 == 0:
                    out = out.argmax(dim=1)
                    acc = (out == labels).sum().item()/len(labels)
                    print(epoch, i, loss.item(), acc)

            # 保存模型参数
            torch.save(model.state_dict(), f"params/{epoch}bert.pt")
            print(epoch, "参数保存成功")
