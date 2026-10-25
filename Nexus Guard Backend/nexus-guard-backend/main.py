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

from routers import auth, image_analysis


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



def clean_text(text: str) -> str:
    """Must mirror the cleaning used during training exactly,
    or the vectorizer will see out-of-distribution input."""
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " URL ", text)
    text = re.sub(r"\S+@\S+", " EMAIL ", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


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


app.include_router(auth.router, tags=["Authentication"])
app.include_router(image_analysis.router, tags=["Image Analysis"])


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
