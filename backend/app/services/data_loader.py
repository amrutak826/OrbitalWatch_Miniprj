import pandas as pd

SATELLITE_FILE = "source/satellite.parquet"
DEBRIS_FILE = "source/debri.parquet"

def load_satellites():
    return pd.read_parquet(SATELLITE_FILE)

def load_debris():
    return pd.read_parquet(DEBRIS_FILE)
