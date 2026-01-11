import numpy as np
import joblib
import xgboost as xgb
import os

from sklearn.svm import SVC
from tensorflow import keras
from .preprocess import preprocess_input

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ---- Load models ----
# XGBoost
xgb_model = xgb.XGBClassifier()
xgb_model.load_model(os.path.join(MODELS_DIR, "xgb_model.json"))

# MLP
mlp_model = keras.models.load_model(os.path.join(MODELS_DIR, "mlp_model.h5"))

dnn_model = keras.models.load_model(
    os.path.join(MODELS_DIR, "dnn_model.h5")
)

#svm
svm_model = joblib.load(os.path.join(MODELS_DIR, "svm_model.pkl"))

# Random Forest - load với error handling
rf_model = joblib.load(os.path.join(MODELS_DIR, "rf_model.pkl"))


def predict_xgb(data: dict):
    x = preprocess_input(data)
    prob = xgb_model.predict_proba(x)[0][1]
    return float(prob)


def predict_mlp(data: dict):
    x = preprocess_input(data)
    prob = mlp_model.predict(x)[0][0]
    return float(prob)

def predict_svm(data: dict) -> float:
    x = preprocess_input(data)
    prob = svm_model.predict_proba(x)[0][1]
    return float(prob)

def predict_rf(data: dict) -> float:
    if rf_model is None:
        raise ValueError("RF model not available. Please add rf_model.pkl to models directory.")
    x = preprocess_input(data)
    prob = rf_model.predict_proba(x)[0][1]
    return float(prob)

def predict_dnn(data: dict) -> float:
    x = preprocess_input(data)
    prob = dnn_model.predict(x, verbose=0)[0][0]
    return float(prob)
