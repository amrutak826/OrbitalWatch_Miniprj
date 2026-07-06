from fastapi import APIRouter
from app.services.data_loader import load_satellites, load_debris
from app.services.orbit_engine import tle_to_satrec, get_position_km, distance_km
from app.services.risk_model import classify_risk

router = APIRouter(prefix="/api/risk", tags=["Risk"])

@router.get("/scan")
def scan_collision_risk():
    sats = load_satellites()
    debris = load_debris()

    # Pick one random satellite + debris
    sat = sats.sample(1).iloc[0]
    deb = debris.sample(1).iloc[0]

    # Create SGP4 satellite objects
    sat_obj = tle_to_satrec(sat["Line1"], sat["Line2"])
    deb_obj = tle_to_satrec(deb["Line1"], deb["Line2"])

    # Compute real-time 3D ECI positions
    sat_pos = get_position_km(sat_obj)
    deb_pos = get_position_km(deb_obj)

    # Compute distance
    d = distance_km(sat_pos, deb_pos)

    # Classify risk
    risk = classify_risk(d)

    return {
        "satellite": sat["Name"],
        "debris": deb["Name"],
        "distance_km": d,
        "risk": risk,
    }
