import numpy as np
import joblib
import xgboost as xgb

from sklearn.svm import SVC
from tensorflow import keras
from .preprocess import preprocess_input

# ---- Load models ----
# XGBoost
xgb_model = xgb.XGBClassifier()
xgb_model.load_model("app/models/xgb_model.json")

# MLP
mlp_model = keras.models.load_model("app/models/mlp_model.h5")

#svm
svm_model = joblib.load("app/models/svm_model.pkl")

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
