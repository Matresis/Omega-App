from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.preprocessing import StandardScaler

# Load model & encoders
with open("models/gradient_boosting_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("models/brand_encoding.pkl", "rb") as f:
    brand_encoding = pickle.load(f)

with open("models/feature_order.pkl", "rb") as f:
    expected_columns = pickle.load(f)

with open("models/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    df_input = pd.DataFrame([data])

    df_input["Car_Age"] = datetime.now().year - df_input["Year"]
    df_input["Mileage_per_Year"] = df_input["Mileage"] / (df_input["Car_Age"] + 1)

    df_input["Brand_Encoded"] = df_input["Brand"].map(brand_encoding).fillna(0)

    df_input.drop(columns=["Year", "Brand"], inplace=True)
    df_input = pd.get_dummies(df_input, columns=["Transmission", "Body Type", "Condition", "Fuel Type", "Title Status"])

    for col in expected_columns:
        if col not in df_input.columns:
            df_input[col] = 0

    df_input = df_input[expected_columns]
    df_input[["Car_Age", "Mileage", "Cylinders", "Brand_Encoded"]] = scaler.transform(
        df_input[["Car_Age", "Mileage", "Cylinders", "Brand_Encoded"]]
    )

    predicted_price = model.predict(df_input.values)

    return jsonify({"prediction": round(float(predicted_price[0]), 2)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
