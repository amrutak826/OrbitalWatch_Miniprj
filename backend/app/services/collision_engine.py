from app.services.orbit_engine import tle_to_satrec, get_position_km, distance_km
import pandas as pd
import numpy as np

def compute_all_distances(sat_df: pd.DataFrame, deb_df: pd.DataFrame, limit=50):

    results = []

    for _, sat in sat_df.iterrows():
        sat_obj = tle_to_satrec(sat["Line1"], sat["Line2"])
        sat_pos, sat_vel = get_position_km(sat_obj, return_velocity=True)

        if sat_pos is None:
            continue

        for _, deb in deb_df.iterrows():
            deb_obj = tle_to_satrec(deb["Line1"], deb["Line2"])
            deb_pos, deb_vel = get_position_km(deb_obj, return_velocity=True)

            if deb_pos is None:
                continue

            d = distance_km(sat_pos, deb_pos)
            rel_vel = float(np.linalg.norm(sat_vel - deb_vel))

            results.append({
                "satellite": sat["Name"],
                "debris": deb["Name"],
                "distance_km": d,
                "relative_velocity": rel_vel
            })

    results = sorted(results, key=lambda x: x["distance_km"])
    return results[:limit]
