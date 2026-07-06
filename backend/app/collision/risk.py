# app/collision/risk.py

def classify_risk_rule(miss_km, time_to_tca_seconds, rel_speed_kms):
    """
    Simple rules:
      - High risk: miss < 1 km  OR (miss < 2 km and time_to_tca < 48h)
      - Medium: 1 <= miss < 5 km OR (miss < 10 km and time_to_tca < 24h)
      - Low: miss >= 5 km
    Returns (label, score) where score is a simple numeric proxy (lower miss -> higher score).
    """
    hours = time_to_tca_seconds / 3600.0
    if miss_km < 1.0:
        return "HIGH", 0.99
    if miss_km < 2.0 and hours < 48:
        return "HIGH", 0.9
    if miss_km < 5.0:
        return "MEDIUM", 0.6
    if miss_km < 10.0 and hours < 24:
        return "MEDIUM", 0.4
    return "LOW", 0.05
