import pandas as pd

df = pd.read_parquet("backend/source/satellite.parquet")

# Show first 10 rows
print(df.head(10).to_string())
