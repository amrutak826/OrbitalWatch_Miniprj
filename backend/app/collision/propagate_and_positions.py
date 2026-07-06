# app/collision/propagate_and_positions.py
from skyfield.api import EarthSatellite, load
from datetime import datetime, timezone
import pandas as pd
import numpy as np

ts = load.timescale()

def compute_state_from_tle(line1, line2, name, t=None):
    """
    Return position (km) and velocity (km/s) arrays at time t (skyfield Time).
    If t is None uses ts.now()
    """
    sat = EarthSatellite(line1, line2, name, ts)
    if t is None:
        t = ts.now()
    geocentric = sat.at(t)
    pos = geocentric.position.km  # numpy array length-3
    vel = geocentric.velocity.km_per_s
    return np.array(pos), np.array(vel)

def build_current_state_df(parquet_path="source/satellite.parquet", output_csv=None):
    """
    Read parquet (satellites or debris), compute current position+velocity for each,
    return a DataFrame with columns: Name, Catalog_Number, x,y,z,vx,vy,vz,Inclination,...
    Optionally save to CSV (output_csv).
    """
    df = pd.read_parquet(parquet_path)
    results = []
    t = ts.now()
    for _, row in df.iterrows():
        try:
            line1 = row["Line1"]
            line2 = row["Line2"]
            name = row["Name"]
            pos, vel = compute_state_from_tle(line1, line2, name, t=t)
            results.append({
                "Name": name,
                "Catalog_Number": int(row.get("Catalog_Number", -1)),
                "x": float(pos[0]), "y": float(pos[1]), "z": float(pos[2]),
                "vx": float(vel[0]), "vy": float(vel[1]), "vz": float(vel[2]),
                "Inclination": float(row.get("Inclination_deg", float('nan'))),
                "Eccentricity": float(row.get("Eccentricity", float('nan'))),
                "Mean_Motion": float(row.get("Mean_Motion_rev_per_day", float('nan'))),
                "timestamp_utc": datetime.now(timezone.utc).isoformat()
            })
        except Exception as e:
            # skip malformed TLEs
            print(f"Skipping {row.get('Name','<unknown>')} due to {e}")
            continue

    state_df = pd.DataFrame(results)
    if output_csv:
        state_df.to_csv(output_csv, index=False)
    return state_df
