# app/ml/features.py
import numpy as np
from datetime import timedelta
from app.services.orbit_engine import propagate_at_time


def relative_state_features(satrec_a, satrec_b, t):
    """
    Compute relative features between two satrec objects at datetime t.
    Returns dict of features.
    """
    pa = propagate_at_time(satrec_a, t)
    pb = propagate_at_time(satrec_b, t)
    if pa is None or pb is None:
        return None

    # instantaneous relative position & distance
    r_rel = pb - pa
    d = float(np.linalg.norm(r_rel))

    # estimate velocities by small dt forward (numerical)
    dt = timedelta(seconds=10)
    pa_f = propagate_at_time(satrec_a, t + dt)
    pb_f = propagate_at_time(satrec_b, t + dt)
    if pa_f is None or pb_f is None:
        return None

    v_a = (pa_f - pa) / dt.total_seconds()
    v_b = (pb_f - pb) / dt.total_seconds()
    v_rel = v_b - v_a
    rel_speed = float(np.linalg.norm(v_rel))

    # approach trend: compute distance a short while later
    dt2 = timedelta(minutes=5)
    pa2 = propagate_at_time(satrec_a, t + dt2)
    pb2 = propagate_at_time(satrec_b, t + dt2)
    if pa2 is None or pb2 is None:
        return None
    d_future = float(np.linalg.norm(pb2 - pa2))
    dist_trend = d_future - d  # negative -> closing

    # orbital plane proxy: angle between position vectors (very rough)
    def angle_between(u, v):
        nu = np.linalg.norm(u); nv = np.linalg.norm(v)
        if nu == 0 or nv == 0: return 0.0
        cos = np.clip(np.dot(u, v) / (nu*nv), -1.0, 1.0)
        return float(np.arccos(cos))

    plane_angle = angle_between(pa, pb)  # rough proxy

    return {
        "distance_km": d,
        "rel_speed_kms": rel_speed,
        "dist_trend_5min": dist_trend,
        "plane_angle": plane_angle
    }
