import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import os

def train():

    print("📥 Loading dataset...")
    df = pd.read_parquet("data/training_pairs.parquet")

    # --- FIX: Use correct columns ---
    FEATURES = ["distance_km", "relative_velocity", "time_step"]
    TARGET = "label"

    X = df[FEATURES]
    y = df[TARGET]

    print("📊 Dataset shape:", df.shape)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("🤖 Training RandomForest model...")
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluate
    print("\n📈 Evaluation Report:")
    preds = model.predict(X_test)
    print(classification_report(y_test, preds))

    # Save model
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/collision_risk_model.pkl")

    print("\n💾 Model saved to: models/collision_risk_model.pkl")

if __name__ == "__main__":
    train()
