from langchain import hub
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_chroma import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter

# 🔑 LangSmith 配置（本地模式，无需 API Key）
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "http://localhost:1984"
os.environ["LANGCHAIN_PROJECT"] = "waterbro-rag-demo"  # 你的项目名，面试时可改

# 🧠 模拟一份小知识库（替换成你的真实文档）
loader = TextLoader("data.txt", encoding="utf-8")
documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(documents)

# 📦 向量数据库（Chroma，轻量本地）
vectorstore = Chroma.from_documents(documents=splits, embedding=OllamaEmbeddings(model="llama3.2"))
retriever = vectorstore.as_retriever()

# 💬 提示词（中文友好版）
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一名专业、耐心的 AI 助手。请基于以下检索到的资料回答问题，若资料中无答案，请明确说 \"暂未找到相关信息\"。"),
    ("human", "{input}")
])

document_chain = create_stuff_documents_chain(llm, prompt)
retrieval_chain = create_retrieval_chain(retriever, document_chain)

# 🚀 执行查询（带 LangSmith 自动追踪）
if __name__ == "__main__":
    print("【LangSmith RAG Agent 已启动】")
    print("> 正在模拟一次用户提问...")
    
    # 示例问题（可替换为你关心的 Agent 开发问题）
    result = retrieval_chain.invoke({"input": "LangSmith 的 trace 是什么？怎么查看？"})
    
    print("\n💡 回答：", result["answer"])
    print("\n🔗 LangSmith Trace 链接（启动后访问 http://localhost:1984 查看）")
    print("   → 项目名：waterbro-rag-demo")
    print("   → 可直接分享给面试官！")
