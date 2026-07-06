import pandas as pd
import numpy as np
from datetime import datetime, timezone

from app.services.data_loader import load_satellites, load_debris
from app.services.orbit_engine import tle_to_satrec, get_position_km, distance_km

OUTPUT_FILE = "data/training_pairs.parquet"

def generate():
    sats = load_satellites().sample(50)      # small batch
    debris = load_debris().sample(50)

    rows = []
    now = datetime.now(timezone.utc)

    for _, sat in sats.iterrows():
        for _, deb in debris.iterrows():

            sat_obj = tle_to_satrec(sat["Line1"], sat["Line2"])
            deb_obj = tle_to_satrec(deb["Line1"], deb["Line2"])

            try:
                sat_pos = get_position_km(sat_obj)
                deb_pos = get_position_km(deb_obj)

                if sat_pos is None or deb_pos is None:
                    continue

                # features
                d = distance_km(sat_pos, deb_pos)
                rel_vel = np.random.uniform(0.1, 10.0)   # synthetic relative speed

                rows.append({
                    "distance_km": d,
                    "relative_velocity": rel_vel,
                    "time_step": 0,
                    "label": 1 if d < 20 else 0
                })

            except Exception:
                continue

    df = pd.DataFrame(rows)

    if len(df) == 0:
        print("❌ No data generated. Try again.")
        return

    df.to_parquet(OUTPUT_FILE, index=False)
    print(f"✅ Generated {len(df)} samples -> {OUTPUT_FILE}")


if __name__ == "__main__":
    generate()
