import numpy as np
import joblib
import os

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Load scaler + selector
scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))
selector = joblib.load(os.path.join(MODELS_DIR, "selector.pkl"))

# Định nghĩa thứ tự features đúng với thứ tự khi training
FEATURE_ORDER = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", 
    "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]

def preprocess_input(data: dict):
    """Nhận input từ FE, convert sang vector đúng dạng model (scaled + selected features)"""

    # Đảm bảo thứ tự features đúng
    x = np.array([[data[feature] for feature in FEATURE_ORDER]], dtype=float)

    # Scale
    x_scaled = scaler.transform(x)

    # Chọn features
    x_selected = selector.transform(x_scaled)

    return x_selected
