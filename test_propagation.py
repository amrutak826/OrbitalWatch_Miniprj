from backend.app import propagate_parquet

df = propagate_parquet("source/satellite.parquet", "source/satellite_positions.csv")
print(df.head())
