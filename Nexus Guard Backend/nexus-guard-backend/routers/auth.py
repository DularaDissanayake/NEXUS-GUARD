
from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel, Field, field_validator, EmailStr
from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import bcrypt
from fastapi import APIRouter


# --- MongoDB Atlas Connection ---

MONGO_URI = "mongodb+srv://dularasankaa_db_user:NkepOGLpoa8hvoOa@cluster01.sfqlujk.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database("nexusguard_db")  
users_collection = db.get_collection("users")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")




# --- Pydantic Models ---
class UserCreate(BaseModel):
  firstname: str
  lastname: str
  email_address: EmailStr
  password: str
  active_status: bool = True

class UserResponse(BaseModel):
  id: str
  firstname: str
  lastname: str
  email_address: EmailStr
  active_status: bool
  created_dttm: datetime
  last_login_dttm: datetime | None = None


# --- Pydantic Model for Login ---
class UserLogin(BaseModel):
    email_address: EmailStr
    password: str


def hash_password(password: str) -> str:
  return pwd_context.hash(password)


##############################################################


# Create the router instance
router = APIRouter()


@router.post(
    "/users/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
)
async def create_user(user: UserCreate):
  # 1. Check if user with this email already exists
  existing_user = await users_collection.find_one(
      {"email_address": user.email_address}
  )
  if existing_user:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="An account with this email address already exists.",
    )

  # 2. Hash the password securely
  hashed_password = hash_password(user.password)

  # IST is always UTC + 5 hours and 30 minutes (no daylight saving)
  ist_timezone = timezone(timedelta(hours=5, minutes=30))
  current_time_ist = datetime.now(ist_timezone)

  # 4. Construct user document dictionary
  user_dict = user.model_dump()
  user_dict["password"] = hashed_password
  user_dict["created_dttm"] = current_time_ist
  user_dict["last_login_dttm"] = (
      None  # Default to None until their first login
  )

  # 5. Insert document into MongoDB Atlas
  result = await users_collection.insert_one(user_dict)

  # 6. Format response data
  user_dict["id"] = str(result.inserted_id)

  return user_dict


# --- Sign-In Endpoint ---
@router.post(
    "/users/login",
    summary="Sign in an existing user",
)
async def login_user(credentials: UserLogin):
    # 1. Find the user by email address
    user = await users_collection.find_one({"email_address": credentials.email_address})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password.",
        )

    # 2. Verify the password against the stored bcrypt hash
    stored_password_hash = user["password"]
    if not bcrypt.checkpw(credentials.password.encode("utf-8"), stored_password_hash.encode("utf-8")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password.",
        )

    # 3. Check if the user's account is active
    if not user.get("active_status", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    # 4. Get current timestamp in IST (Asia/Kolkata)
    ist_timezone = timezone(timedelta(hours=5, minutes=30))
    current_time_ist = datetime.now(ist_timezone)

    # 5. Update the last_login_dttm in MongoDB Atlas
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login_dttm": current_time_ist}}
    )

    # 6. Return success response (excluding password)
    return {
        "message": "Login successful",
        "user": {
            "id": str(user["_id"]),
            "firstname": user["firstname"],
            "lastname": user["lastname"],
            "email_address": user["email_address"],
            "active_status": user["active_status"],
            "created_dttm": user["created_dttm"],
            "last_login_dttm": current_time_ist
        }
    }