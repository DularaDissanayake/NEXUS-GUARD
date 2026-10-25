from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

# Load the saved model and vectorizer
model = joblib.load('models/scam_classifier_model.pkl')
vectorizer = joblib.load('models/tfidf_vectorizer.pkl')

class TextSubmission(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/anusara")
async def anusara():
    return {"message": "Hello Anusara"}

@app.post("/api/scan-text")
def analyze_text(submission: TextSubmission):
    # Transform input text and predict
    text_vectorized = vectorizer.transform([submission.text])
    prediction = model.predict(text_vectorized)[0]
    probability = model.predict_proba(text_vectorized)[0]
    
    risk_level = "High" if prediction == 1 else "Low"
    confidence = float(max(probability)) * 100

    return {
        "risk_level": risk_level,
        "confidence_score": f"{confidence:.2f}%",
        "is_scam": bool(prediction)
    }
