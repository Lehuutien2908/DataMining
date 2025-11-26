import numpy as np
import joblib

# Load scaler + selector
scaler = joblib.load("app/models/scaler.pkl")
selector = joblib.load("app/models/selector.pkl")

def preprocess_input(data: dict):
    """Nhận input từ FE, convert sang vector đúng dạng model (scaled + selected features)"""

    # Chuyển input dict -> numpy array
    x = np.array([list(data.values())], dtype=float)

    # Scale
    x_scaled = scaler.transform(x)

    # Chọn features
    x_selected = selector.transform(x_scaled)

    return x_selected
