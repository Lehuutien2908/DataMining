from fastapi import FastAPI
from pydantic import BaseModel
from .predict import predict_xgb, predict_mlp

app = FastAPI(title="Heart Disease Prediction API")

class PatientData(BaseModel):
    age: float
    sex: float
    trestbps: float
    chol: float
    thalach: float
    oldpeak: float
    cp: float
    fbs: float
    restecg: float
    exang: float
    slope: float
    ca: float
    thal: float

@app.get("/")
def root():
    return {"message": "Heart Disease Model API running"}

@app.post("/predict/xgb")
def predict_xgb_api(data: PatientData):
    prob = predict_xgb(data.dict())
    return {"probability": prob, "label": int(prob >= 0.5)}

@app.post("/predict/mlp")
def predict_mlp_api(data: PatientData):
    prob = predict_mlp(data.dict())
    return {"probability": prob, "label": int(prob >= 0.5)}
