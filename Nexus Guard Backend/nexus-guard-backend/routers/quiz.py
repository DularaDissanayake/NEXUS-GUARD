from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter

router = APIRouter()

# MongoDB connection setup
MONGO_URI = "mongodb+srv://dularasankaa_db_user:NkepOGLpoa8hvoOa@cluster01.sfqlujk.mongodb.net/?retryWrites=true&w=majority" 
client = AsyncIOMotorClient(MONGO_URI)
db = client["nexusguard_db"]       


class QuestionSchema(BaseModel):
    id: int
    difficulty: str
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

@router.get("/beginner", response_model=List[QuestionSchema])
async def get_beginner_quiz():
    collection = db["questions_beginner"]
    try:
        # Use MongoDB $sample stage to get 10 random questions
        pipeline = [{"$sample": {"size": 10}}]
        cursor = collection.aggregate(pipeline)
        questions = await cursor.to_list(length=10)
        
        # Strip internal Mongo _id if necessary
        for q in questions:
            q.pop("_id", None)
            
        return questions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/intermediate", response_model=List[QuestionSchema])
async def get_intermediate_quiz():
    collection = db["questions_intermediate"]
    try:
        # Use MongoDB $sample stage to get 10 random questions
        pipeline = [{"$sample": {"size": 10}}]
        cursor = collection.aggregate(pipeline)
        questions = await cursor.to_list(length=10)
        
        # Strip internal Mongo _id if necessary
        for q in questions:
            q.pop("_id", None)
            
        return questions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/advanced", response_model=List[QuestionSchema])
async def get_advanced_quiz():
    collection = db["questions_advanced"]
    try:
        # Use MongoDB $sample stage to get 10 random questions
        pipeline = [{"$sample": {"size": 10}}]
        cursor = collection.aggregate(pipeline)
        questions = await cursor.to_list(length=10)
        
        # Strip internal Mongo _id if necessary
        for q in questions:
            q.pop("_id", None)
            
        return questions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))