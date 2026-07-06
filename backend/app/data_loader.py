import pandas as pd

SAT_PATH = "source/satellite.parquet"
DEBRIS_PATH = "source/debri.parquet"

def clean_tle(df):
    df = df.dropna(subset=["Line1", "Line2"])
    df = df[df["Line1"].str.len() > 50]
    df = df[df["Line2"].str.len() > 50]
    return df



def load_satellites():
    df = pd.read_parquet(SAT_PATH)
    return clean_tle(df)

def load_debris():
    df = pd.read_parquet(DEBRIS_PATH)
    return clean_tle(df)
