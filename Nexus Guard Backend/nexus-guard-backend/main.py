# ============================================================
# FastAPI service for phishing email detection
# Loads the joblib artifacts produced by the ORIGINAL pipeline
# (TF-IDF + LogisticRegression + RandomForest models), not the
# CNN override — the CNN needs a separate Keras-loading service.
#
# Expected files in the same directory as this script:
#   tfidf_vectorizer.joblib
#   phishing_label_model.joblib
#   phishing_type_model.joblib
#   phishing_type_encoder.joblib
#   severity_model.joblib
#   severity_encoder.joblib
#   confidence_model.joblib
#
# Run locally:
#   pip install -r requirements.txt
#   uvicorn main:app --reload --host 0.0.0.0 --port 8000
#
# Then open http://localhost:8000/docs for interactive Swagger UI.
# ============================================================

import re
import logging
from pathlib import Path
from contextlib import asynccontextmanager

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, field_validator, EmailStr

from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import bcrypt


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("phishing-api")

MODEL_DIR = Path(__file__).parent / "models"  # change if your .joblib files live elsewhere

ARTIFACT_FILES = {
    "vectorizer": "tfidf_vectorizer.joblib",
    "phishing_clf": "phishing_label_model.joblib",
    "type_clf": "phishing_type_model.joblib",
    "type_encoder": "phishing_type_encoder.joblib",
    "severity_clf": "severity_model.joblib",
    "severity_encoder": "severity_encoder.joblib",
    "confidence_reg": "confidence_model.joblib",
}

models = {}  # populated at startup

# --- MongoDB Atlas Connection ---

MONGO_URI = "mongodb+srv://dularasankaa_db_user:NkepOGLpoa8hvoOa@cluster01.sfqlujk.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database("nexusguard_db")  
users_collection = db.get_collection("users")

# --- Password Hashing Setup ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def clean_text(text: str) -> str:
    """Must mirror the cleaning used during training exactly,
    or the vectorizer will see out-of-distribution input."""
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " URL ", text)
    text = re.sub(r"\S+@\S+", " EMAIL ", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def hash_password(password: str) -> str:
  return pwd_context.hash(password)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load every artifact once, fail fast if any is missing
    logger.info("Loading model artifacts from %s", MODEL_DIR)
    for key, filename in ARTIFACT_FILES.items():
        path = MODEL_DIR / filename
        if not path.exists():
            raise RuntimeError(
                f"Missing artifact '{filename}' in {MODEL_DIR}. "
                f"Make sure all .joblib files from training are placed alongside this script."
            )
        models[key] = joblib.load(path)
        logger.info("Loaded %s", filename)
    logger.info("All models loaded. API ready.")
    yield
    models.clear()
    logger.info("Models unloaded.")


app = FastAPI(
    title="Phishing Email Detection API",
    description="Detects phishing emails and returns phishing_type, severity, and confidence.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------
# Request / response schemas
# ------------------------------------------------------------
class EmailRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Full email body text to classify")

    @field_validator("text")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("text must not be blank")
        return v


class BatchEmailRequest(BaseModel):
    texts: list[str] = Field(..., min_length=1, max_length=200)


class PredictionResponse(BaseModel):
    is_phishing: bool
    phishing_probability: float
    phishing_type: str
    severity: str
    confidence: float


class BatchPredictionResponse(BaseModel):
    results: list[PredictionResponse]


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

# ------------------------------------------------------------
# Core prediction logic (shared by single + batch endpoints)
# ------------------------------------------------------------
def run_prediction(raw_texts: list[str]) -> list[dict]:
    cleaned = [clean_text(t) for t in raw_texts]
    vec = models["vectorizer"].transform(cleaned)

    label_preds = models["phishing_clf"].predict(vec)
    label_probs = models["phishing_clf"].predict_proba(vec)[:, 1]

    type_preds = models["type_encoder"].inverse_transform(
        models["type_clf"].predict(vec)
    )
    sev_preds = models["severity_encoder"].inverse_transform(
        models["severity_clf"].predict(vec)
    )
    conf_preds = np.clip(models["confidence_reg"].predict(vec), 0.0, 1.0)

    results = []
    for i in range(len(raw_texts)):
        is_phish = bool(label_preds[i] == 1)
        results.append({
            "is_phishing": is_phish,
            "phishing_probability": round(float(label_probs[i]), 4),
            "phishing_type": type_preds[i] if is_phish else "legitimate",
            "severity": sev_preds[i],
            "confidence": round(float(conf_preds[i]), 4),
        })
    return results


# ------------------------------------------------------------
# Endpoints
# ------------------------------------------------------------
@app.get("/health")
def health_check():
    return {"status": "ok", "models_loaded": list(models.keys())}

@app.post(
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
@app.post(
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


@app.post("/predict", response_model=PredictionResponse)
def predict(request: EmailRequest):
    try:
        result = run_prediction([request.text])[0]
        return result
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


@app.post("/predict/batch", response_model=BatchPredictionResponse)
def predict_batch(request: BatchEmailRequest):
    try:
        results = run_prediction(request.texts)
        return {"results": results}
    except Exception as e:
        logger.exception("Batch prediction failed")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
