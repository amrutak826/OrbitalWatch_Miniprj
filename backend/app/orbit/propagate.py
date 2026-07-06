import pandas as pd
from skyfield.api import EarthSatellite, load
from datetime import datetime, timezone

ts = load.timescale()

def compute_orbital_state(line1, line2, name):
    """Returns position and velocity vectors for one satellite."""
    sat = EarthSatellite(line1, line2, name, ts)
    t = ts.now()

    # Position & velocity in TEME frame (km and km/s)
    position, velocity = sat.at(t).position.km, sat.at(t).velocity.km_per_s

    return {
        "Name": name,
        "x": position[0],
        "y": position[1],
        "z": position[2],
        "vx": velocity[0],
        "vy": velocity[1],
        "vz": velocity[2],
        "Inclination": sat.model.inclo,
        "Eccentricity": sat.model.ecco,
        "MeanMotion": sat.model.no_kozai,
        "TimestampUTC": datetime.now(timezone.utc).isoformat()
    }


def propagate_parquet(parquet_path, output_csv):
    """Reads TLE parquet → computes xyz, velocity → saves numeric dataset."""
    df = pd.read_parquet(parquet_path)

    results = []
    for _, row in df.iterrows():
        try:
            entry = compute_orbital_state(row["Line1"], row["Line2"], row["Name"])
            results.append(entry)
        except Exception as e:
            print(f"Skipping {row['Name']}: {e}")

    df_out = pd.DataFrame(results)
    df_out.to_csv(output_csv, index=False)
    print(f"Saved propagated orbital state → {output_csv}")

    return df_out
