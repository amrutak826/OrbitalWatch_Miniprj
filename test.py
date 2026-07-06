import pandas as pd

df_sat = pd.read_parquet("backend/source/satellite.parquet")
df_debri = pd.read_parquet("backend/source/debri.parquet")

print("\n--- SATELLITES (HEAD) ---")
print(df_sat.head())

print("\n--- DEBRIS (HEAD) ---")
print(df_debri.head())
