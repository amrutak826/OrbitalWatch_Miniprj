import os
import joblib
import numpy as np

# Build absolute path to the model file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "collision_risk_model.pkl")

# Load trained ML model
model = joblib.load(MODEL_PATH)


def classify_risk(distance_km: float):
    if distance_km < 5:
        return "HIGH"
    elif distance_km < 20:
        return "MEDIUM"
    else:
        return "LOW"


def predict_collision_risk(distance_km, relative_velocity, trend):
    X = np.array([[distance_km, relative_velocity, trend]])
    return int(model.predict(X)[0])  # returns 0 or 1
