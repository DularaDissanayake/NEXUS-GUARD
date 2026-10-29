import uuid
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
from fastapi import APIRouter


#GEMINI_API_KEY = "AQ.Ab8RN6LTc58d5KmwJiWGyUyMNjPWr0S1Q1VO3fvvly4jsxTV_w"

GEMINI_API_KEY = "AQ.Ab8RN6IPeJaMaBJT50ikni233p_zOkiTnyHjxrXj6Wq76FtehA"

#app = FastAPI(title="Gemini Chatbot API")

router = APIRouter()

# Initialize the Gemini client with an explicit API key
client = genai.Client(api_key=GEMINI_API_KEY)

chat_sessions = {}

class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str

class ChatResponse(BaseModel):
    session_id: str
    reply: str

@router.post("/assistant", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        session_id = request.session_id
        
        if not session_id or session_id not in chat_sessions:
            session_id = str(uuid.uuid4())
            chat_config = types.GenerateContentConfig(
                system_instruction="You are a helpful, witty, and concise AI assistant.",
                temperature=0.7,
            )
            chat_sessions[session_id] = client.chats.create(
                model="gemini-3.6-flash",
                config=chat_config
            )
        
        chat = chat_sessions[session_id]
        response = chat.send_message(request.message)
        
        return ChatResponse(session_id=session_id, reply=response.text)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))