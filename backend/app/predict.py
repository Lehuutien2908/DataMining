import numpy as np
import joblib
import xgboost as xgb
import os
import zipfile
import tempfile

from sklearn.svm import SVC
from pytorch_tabnet.tab_model import TabNetClassifier
from .preprocess import preprocess_input

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# ---- Load models ----
# XGBoost
xgb_model = xgb.XGBClassifier()
xgb_model.load_model(os.path.join(MODELS_DIR, "xgb_model.json"))

# TabNet
tabnet_model_path = os.path.join(MODELS_DIR, "tabnet_optuna_2fold_10trial.zip")
tabnet_model = TabNetClassifier()
# Load TabNet model from zip file
with zipfile.ZipFile(tabnet_model_path, 'r') as zip_ref:
    with tempfile.TemporaryDirectory() as temp_dir:
        zip_ref.extractall(temp_dir)
        tabnet_model.load_model(os.path.join(temp_dir, "tabnet_model"))

#svm
svm_model = joblib.load(os.path.join(MODELS_DIR, "svm_model.pkl"))

# Random Forest - load với error handling
rf_model = joblib.load(os.path.join(MODELS_DIR, "rf_model.pkl"))


def predict_xgb(data: dict):
    x = preprocess_input(data)
    prob = xgb_model.predict_proba(x)[0][1]
    return float(prob)

def predict_svm(data: dict) -> float:
    x = preprocess_input(data)
    prob = svm_model.predict_proba(x)[0][1]
    return float(prob)

def predict_rf(data: dict) -> float:
    x = preprocess_input(data)
    prob = rf_model.predict_proba(x)[0][1]
    return float(prob)

def predict_tabnet(data: dict) -> float:
    x = preprocess_input(data)
    prob = tabnet_model.predict_proba(x)[0][1]
    return float(prob)