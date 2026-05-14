"""
新版 LangChain 1.3.0 常用导入路径参考
"""

# ===== Prompts（提示模板）=====
from langchain_core.prompts import (
    PromptTemplate,               # 单一提示模板
    ChatPromptTemplate,           # 聊天提示模板
    HumanMessagePromptTemplate,   # 人类消息模板
    AIMessagePromptTemplate,      # AI消息模板
    SystemMessagePromptTemplate,  # 系统消息模板
    FewShotPromptTemplate,        # 少样本提示模板
    FewShotChatMessagePromptTemplate  # 少样本聊天提示模板
)

# ===== Messages（消息类型）=====
from langchain_core.messages import (
    HumanMessage,     # 用户消息
    AIMessage,        # AI消息
    SystemMessage,    # 系统消息
    ChatMessage,      # 聊天消息
    FunctionMessage,  # 函数消息
    ToolMessage       # 工具消息
)

# ===== Output Parsers（输出解析器）=====
from langchain_core.output_parsers import (
    StrOutputParser,           # 字符串解析器
    JsonOutputParser,          # JSON解析器
    PydanticOutputParser,      # Pydantic模型解析器
    ListOutputParser,          # 列表解析器
    XMLOutputParser,           # XML解析器
    CommaSeparatedListOutputParser  # 逗号分隔列表解析器
)

from langchain_classic.output_parsers import (
    StructuredOutputParser,     # 结构化输出解析器
    ResponseSchema              # 响应架构
)

# ===== Chains（链）=====
from langchain_classic.chains import (
    LLMChain,              # LLM链
    SequentialChain,       # 顺序链
    SimpleSequentialChain, # 简单顺序链
    TransformChain,        # 转换链
    ConversationChain      # 对话链
)

# ===== Models（模型）=====
from langchain_community.llms import (
    OpenAI,       # OpenAI LLM
    Tongyi,       # 通义千问
    # 其他LLM模型...
)

from langchain_community.chat_models import (
    ChatOpenAI,       # OpenAI聊天模型
    ChatZhipuAI,      # 智谱AI聊天模型
    ChatTongyi,       # 通义千问聊天模型
    # 其他聊天模型...
)

# ===== Embeddings（嵌入）=====
from langchain_community.embeddings import (
    OpenAIEmbeddings,    # OpenAI嵌入
    HuggingFaceEmbeddings,  # HuggingFace嵌入
    # 其他嵌入模型...
)

# ===== Vector Stores（向量存储）=====
from langchain_community.vectorstores import (
    FAISS,       # FAISS向量存储
    Chroma,      # Chroma向量存储
    Pinecone,    # Pinecone向量存储
    # 其他向量存储...
)

# ===== Document Loaders（文档加载器）=====
from langchain_community.document_loaders import (
    TextLoader,          # 文本加载器
    PDFLoader,           # PDF加载器
    WebBaseLoader,       # 网页加载器
    UnstructuredFileLoader,  # 非结构化文件加载器
    # 其他加载器...
)

# ===== Text Splitters（文本分割器）=====
from langchain_text_splitters import (
    CharacterTextSplitter,    # 字符分割器
    RecursiveCharacterTextSplitter,  # 递归字符分割器
    TokenTextSplitter,        # Token分割器
    MarkdownTextSplitter,     # Markdown分割器
    # 其他分割器...
)

# ===== Utilities（工具）=====
from langchain_core.utils import (
    get_colored_text,   # 获取彩色文本
    # 其他工具...
)

# ===== Runnables（可运行对象）=====
from langchain_core.runnables import (
    RunnableLambda,      # Lambda可运行对象
    RunnablePassthrough, # 透传可运行对象
    RunnableParallel,    # 并行可运行对象
    RunnableSequence,    # 序列可运行对象
    # 其他可运行对象...
)

print("导入路径参考文件加载成功！")