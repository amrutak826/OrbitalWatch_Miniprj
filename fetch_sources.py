import os
import requests
import pandas as pd
from datetime import datetime, timezone
from skyfield.api import EarthSatellite, load

# ====================================
# CELESTRAK DATA SOURCES
# ====================================
ACTIVE_SATELLITES_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle"
IRIDIUM33_DEBRIS_URL  = "https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-33-debris&FORMAT=tle"
COSMOS2251_DEBRIS_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=cosmos-2251-debris&FORMAT=tle"



# Output folder
OUTPUT_FOLDER = "source"
SATELLITE_FILE = f"{OUTPUT_FOLDER}/satellite.parquet"
DEBRI_FILE = f"{OUTPUT_FOLDER}/debri.parquet"


# ====================================
# UTIL: FETCH AND PARSE ANY TLE SOURCE
# ====================================
def fetch_tle_dataset(url):
    response = requests.get(url, timeout=20)
    if response.status_code != 200:
        raise Exception(f"❌ Failed to fetch TLE from {url} (HTTP {response.status_code})")

    lines = response.text.strip().split("\n")
    ts = load.timescale()
    data = []

    for i in range(0, len(lines), 3):
        try:
            name = lines[i].strip()
            line1 = lines[i + 1].strip()
            line2 = lines[i + 2].strip()

            sat = EarthSatellite(line1, line2, name, ts)

            data.append({
                "Name": name,
                "Catalog_Number": sat.model.satnum,
                "Inclination_deg": sat.model.inclo,
                "Eccentricity": sat.model.ecco,
                "Mean_Motion_rev_per_day": sat.model.no_kozai,
                "Line1": line1,
                "Line2": line2,
            })
        except Exception:
            continue

    return pd.DataFrame(data)


# ====================================
# MAIN FETCH PIPELINE
# ====================================
def fetch_all_sources():
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"\n📡 [{now}] Fetching all data sources...")

    # Create output folder if missing
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    # ----- Active Satellites -----
    print("🛰️ Fetching ACTIVE satellites...")
    df_sat = fetch_tle_dataset(ACTIVE_SATELLITES_URL)
    df_sat.to_parquet(SATELLITE_FILE, index=False)
    print(f"💾 Saved {len(df_sat)} satellites → {SATELLITE_FILE}")

    # ----- Iridium-33 Debris -----
    print("♻️ Fetching IRIDIUM-33 debris...")
    df_ir33 = fetch_tle_dataset(IRIDIUM33_DEBRIS_URL)

    # ----- Cosmos-2251 Debris -----
    print("🛰️ Fetching COSMOS-2251 debris...")
    df_cosmos = fetch_tle_dataset(COSMOS2251_DEBRIS_URL)

    # Combine both debris datasets
    df_debri = pd.concat([df_ir33, df_cosmos], ignore_index=True)
    df_debri.to_parquet(DEBRI_FILE, index=False)

    print(f"💾 Saved {len(df_debri)} debris objects → {DEBRI_FILE}")
    print("\n✅ Completed all downloads.")


# ====================================
# RUN SCRIPT
# ====================================
if __name__ == "__main__":
    fetch_all_sources()
