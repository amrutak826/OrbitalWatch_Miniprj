# app/collision/collision_detector.py
import numpy as np
from sklearn.neighbors import KDTree
import pandas as pd
from datetime import timedelta
from math import isfinite
def linear_tca_and_miss(r0, v, t_max_seconds):
    v_norm2 = np.dot(v, v)
    if v_norm2 <= 1e-12:
        # relative velocity near zero -> evaluate at t=0
        t_star = 0.0
    else:
        t_star = - float(np.dot(r0, v)) / float(v_norm2)
        if t_star < 0:
            t_star = 0.0
        if t_max_seconds is not None and t_star > t_max_seconds:
            t_star = t_max_seconds
    miss_vector = r0 + v * t_star
    miss_dist = float(np.linalg.norm(miss_vector))
    return t_star, miss_dist
def detect_close_approaches(state_df, neighbor_radius_km=50.0, t_max_hours=72, top_k=200, risk_threshold_km=5.0):
    coords = state_df[["x","y","z"]].to_numpy(dtype=float)
    kdt = KDTree(coords, leaf_size=40, metric='euclidean')
    # For each point, query neighbors within neighbor_radius_km
    indices = kdt.query_radius(coords, r=neighbor_radius_km)
    t_max_seconds = float(t_max_hours * 3600.0)
    events = []
    n = len(state_df)
    for i in range(n):
        neigh = indices[i]
        for j in neigh:
            if j <= i:
                continue  # handle each pair once
            # relative position and velocity: r0 = r_j - r_i ; v = v_j - v_i
            r_i = coords[i]; r_j = coords[j]
            v_i = state_df.loc[i, ["vx","vy","vz"]].to_numpy(dtype=float)
            v_j = state_df.loc[j, ["vx","vy","vz"]].to_numpy(dtype=float)
            r0 = r_j - r_i
            v = v_j - v_i
            t_star, miss_km = linear_tca_and_miss(r0, v, t_max_seconds)
            # compute rel speed at TCA (approx magnitude of v)
            rel_speed_kms = float(np.linalg.norm(v))
            # time_to_tca in seconds
            time_to_tca_s = float(t_star)
            events.append({
                "sat_a_idx": int(i),
                "sat_b_idx": int(j),
                "norad_a": int(state_df.iloc[i]["Catalog_Number"]),
                "norad_b": int(state_df.iloc[j]["Catalog_Number"]),
                "name_a": state_df.iloc[i]["Name"],
                "name_b": state_df.iloc[j]["Name"],
                "tca_seconds": time_to_tca_s,
                "miss_distance_km": miss_km,
                "rel_speed_kms": rel_speed_kms
            })
    # sort events by miss distance
    events_sorted = sorted(events, key=lambda e: e["miss_distance_km"])
    # return top_k closest events
    return events_sorted[:min(top_k, len(events_sorted))]
