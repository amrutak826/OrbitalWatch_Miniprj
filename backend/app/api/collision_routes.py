from fastapi import APIRouter
from app.services.data_loader import load_satellites, load_debris
from app.services.collision_engine import compute_all_distances
from app.services.risk_model import classify_risk, predict_collision_risk

# Orbit propagation utilities
from app.services.orbit_engine import tle_to_satrec, get_position_km, distance_km

# Future prediction engine
from app.services.prediction_engine import predict_future_approaches


# ---------------------------------------------------
# Create router
# ---------------------------------------------------
router = APIRouter(prefix="/api/collision", tags=["Collision Scanner"])


# ---------------------------------------------------
# 1. SCAN ALL — Top closest approaches
# ---------------------------------------------------
@router.get("/scan")
def scan_all():
    sats = load_satellites()
    debris = load_debris()

    results = compute_all_distances(sats, debris, limit=20)

    # Add rule-based + ML risk labels
    for r in results:
        dist = r["distance_km"]
        rel_vel = r.get("relative_velocity", 0)  # temporary (we will compute it later)
        time_step = 0

        r["rule_risk"] = classify_risk(dist)
        r["ml_prediction"] = predict_collision_risk(dist, rel_vel, time_step)

    return {
        "total_objects_checked": len(sats) * len(debris),
        "top_close_approaches": results
    }


# ---------------------------------------------------
# 2. CHECK ONE SATELLITE — Real-time distance check
# ---------------------------------------------------
@router.get("/sat/{sat_name}")
def check_satellite(sat_name: str, threshold_km: float = 50):
    sats = load_satellites()
    debris = load_debris()

    sat_row = sats[sats["Name"] == sat_name]
    if sat_row.empty:
        return {"error": f"Satellite '{sat_name}' not found"}

    sat = sat_row.iloc[0]

    # Propagate satellite
    sat_obj = tle_to_satrec(sat["Line1"], sat["Line2"])
    sat_pos = get_position_km(sat_obj)
    if sat_pos is None:
        return {"error": "SGP4 propagation failed for this satellite"}

    close_objects = []

    # Compare with all debris
    for _, deb in debris.iterrows():
        deb_obj = tle_to_satrec(deb["Line1"], deb["Line2"])
        deb_pos = get_position_km(deb_obj)
        if deb_pos is None:
            continue

        d = distance_km(sat_pos, deb_pos)

        if d <= threshold_km:
            close_objects.append({
                "debris": deb["Name"],
                "distance_km": d,
                "rule_risk": classify_risk(d),
                "ml_prediction": predict_collision_risk(d, 0, 0)
            })

    close_objects = sorted(close_objects, key=lambda x: x["distance_km"])

    return {
        "satellite": sat_name,
        "threshold_km": threshold_km,
        "close_objects": close_objects
    }


# ---------------------------------------------------
# 3. FUTURE PREDICTION — Predict risk for next X hours
# ---------------------------------------------------
@router.get("/predict/{sat_name}")
def predict_satellite(
        sat_name: str,
        hours: int = 12,
        step_min: int = 5,
        threshold_km: float = 50,
):
    sats = load_satellites()
    debris = load_debris()

    sat_row = sats[sats["Name"] == sat_name]
    if sat_row.empty:
        return {"error": f"Satellite '{sat_name}' not found"}
    sat_row = sat_row.iloc[0]

    results = predict_future_approaches(
        sat_row,
        debris,
        hours=hours,
        step_min=step_min,
        threshold_km=threshold_km,
    )

    # Add ML and rule-based risk scoring
    for r in results:
        dist = r["distance_km"]
        rel_vel = r.get("relative_velocity", 0)
        time_step = 0

        r["rule_risk"] = classify_risk(dist)
        r["ml_prediction"] = predict_collision_risk(dist, rel_vel, time_step)

    return {
        "satellite": sat_name,
        "prediction_hours": hours,
        "step_minutes": step_min,
        "threshold_km": threshold_km,
        "predicted_close_approaches": results,
    }
