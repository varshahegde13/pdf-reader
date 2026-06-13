from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from resume_parser import parse_resume
from chatbot import ask_about_resume

app = FastAPI(title="Resume AI Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    resume_text: str
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    file_bytes = await file.read()
    text = parse_resume(file_bytes, file.filename)
    return {"filename": file.filename, "text": text}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    reply = ask_about_resume(request.resume_text, request.message)
    return ChatResponse(reply=reply)


@app.get("/health")
async def health():
    return {"status": "ok"}
