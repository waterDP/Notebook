"""
Agent + FastAPI 服务化（LangChain 版本）
启动: uvicorn main:app --reload --port 8000
测试: http://localhost:8000/docs (Swagger UI)
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# 切换版本: agent_lc = LangChain / agent = 手写 ReAct
from agent_lc import chat

app = FastAPI(title="Agent API (LangChain)", version="1.0.0")

sessions: dict[str, list] = {}

class ChatRequest(BaseModel):
    session_id: str
    question: str

class ChatResponse(BaseModel):
    session_id: str
    answer: str

class HistoryResponse(BaseModel):
    session_id: str
    messages: list

@app.get("/")
def root():
    return {"service": "Agent API", "version": "langchain", "status": "running", "docs": "/docs"}

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    if not req.question.strip():
        raise HTTPException(400, "问题不能为空")

    history = sessions.get(req.session_id, [])
    answer = chat(req.question, history)

    if req.session_id not in sessions:
        sessions[req.session_id] = []
    sessions[req.session_id].append({"role": "user", "content": req.question})
    sessions[req.session_id].append({"role": "assistant", "content": answer})

    return ChatResponse(session_id=req.session_id, answer=answer)

@app.get("/history/{session_id}", response_model=HistoryResponse)
def get_history(session_id: str):
    msgs = sessions.get(session_id, [])
    return HistoryResponse(session_id=session_id, messages=msgs)

@app.delete("/history/{session_id}")
def clear_history(session_id: str):
    sessions.pop(session_id, None)
    return {"message": f"会话 {session_id} 已清除"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
