# app/api/ml_routes.py
from fastapi import APIRouter, HTTPException, Query
import joblib
import numpy as np
from app.services.orbit_engine import tle_to_satrec
from app.ml.features import relative_state_features
from app.services.data_loader import load_satellites, load_debris

router = APIRouter(prefix="/api/ml", tags=["ML"])

# load model once
_model_blob = None
def get_model():
    global _model_blob
    if _model_blob is None:
        _model_blob = joblib.load("model/collision_prob_model.pkl")
    return _model_blob

@router.get("/predict")
def predict_pair(sat_name: str = Query(...), deb_name: str = Query(...)):
    sats = load_satellites()
    debs = load_debris()
    sat_row = sats[sats["Name"] == sat_name]
    deb_row = debs[debs["Name"] == deb_name]
    if sat_row.empty or deb_row.empty:
        raise HTTPException(status_code=404, detail="Satellite or debris not found")

    sat_row = sat_row.iloc[0]; deb_row = deb_row.iloc[0]
    sa = tle_to_satrec(sat_row["Line1"], sat_row["Line2"])
    db = tle_to_satrec(deb_row["Line1"], deb_row["Line2"])

    from datetime import datetime, timezone
    t0 = datetime.now(timezone.utc)
    feat = relative_state_features(sa, db, t0)
    if feat is None:
        raise HTTPException(status_code=500, detail="Failed to compute features (bad TLE?)")

    X = np.array([[feat["distance_km"], feat["rel_speed_kms"], feat["dist_trend_5min"], feat["plane_angle"]]])
    blob = get_model()
    proba = blob["model"].predict_proba(X)[0]
    le = blob["label_encoder"]
    classes = le.inverse_transform(np.arange(len(proba)))
    result = {cls: float(prob) for cls, prob in zip(classes, proba)}
    return {
        "satellite": sat_name,
        "debris": deb_name,
        "features": feat,
        "probabilities": result
    }
