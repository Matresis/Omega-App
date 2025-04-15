import pickle as pc
import pandas as pd
import numpy as np
import traceback
from flask import Flask, request, jsonify
from datetime import datetime
from sklearn.preprocessing import StandardScaler

# Load Model and Preprocessing Objects - Price Prediction Model
with open("models/price/price_model.pkl", "rb") as f:
    price_model = pc.load(f)

with open("models/price/brand_encoding.pkl", "rb") as f:
    price_brand_encoding = pc.load(f)

with open("models/price/feature_order.pkl", "rb") as f:
    price_expected_columns = pc.load(f)

with open("models/price/scaler.pkl", "rb") as f:
    price_scaler = pc.load(f)


# Load Model and Preprocessing Objects - Risk Prediction Model
with open("models/risk/risk_model.pkl", "rb") as f:
    risk_model = pc.load(f)

with open("models/risk/feature_order.pkl", "rb") as f:
    risk_expected_columns = pc.load(f)

with open("models/risk/scaler.pkl", "rb") as f:
    risk_scaler = pc.load(f)

with open("models/risk/risk_label_map.pkl", "rb") as f:
    risk_labels = pc.load(f)


# Load Model and Preprocessing Objects - Repair Classification Model
with open("models/repair_cost/repair_cost_model.pkl", "rb") as f:
    repair_cost_model = pc.load(f)

with open("models/repair_cost/feature_order.pkl", "rb") as f:
    repair_cost_expected_columns = pc.load(f)

with open("models/repair_cost/scaler.pkl", "rb") as f:
    repair_cost_scaler = pc.load(f)


app = Flask(__name__)


def generate_repair_reason(car):
    reasons = []
    mileage = car.get("Mileage", 0)
    age = datetime.now().year - car.get("Year", datetime.now().year)
    condition = car.get("Condition", "").lower()
    title = car.get("Title Status", "").lower()
    price = car.get("Price", 0)

    if mileage > 120_000:
        reasons.append("High mileage – possible engine wear, transmission issues, or brake replacement.")

    if age > 10:
        reasons.append("Older vehicle – may require rust removal, battery replacement, or timing belt service.")

    if "fair" in condition or "salvage" in condition:
        reasons.append("Low condition – interior/exterior damage, possible frame or suspension issues.")

    if "salvage" in title:
        reasons.append("Salvage title – vehicle may have been in an accident and require structural repairs.")

    if price < 5000 and mileage > 100_000:
        reasons.append("Low price with high mileage – likely maintenance overdue or hidden issues.")

    if not reasons:
        reasons.append("Minor maintenance (e.g., oil change, brake pads, fluid replacement).")

    return reasons


@app.route("/predict-price", methods=["POST"])
def predict_price():
    try:
        data = request.get_json()
        print("Received JSON data:", data)

        df_input = pd.DataFrame([data])

        df_input["Car_Age"] = datetime.now().year - df_input["Year"]
        df_input["Mileage_per_Year"] = df_input["Mileage"] / (df_input["Car_Age"] + 1)

        df_input["Brand_Encoded"] = df_input["Brand"].map(price_brand_encoding).fillna(0)

        df_input.drop(columns=["Year", "Brand"], inplace=True)
        df_input = pd.get_dummies(df_input,
                                  columns=["Transmission", "Body Type", "Condition", "Fuel Type", "Title Status"])

        for col in price_expected_columns:
            if col not in df_input.columns:
                df_input[col] = 0

        df_input = df_input[price_expected_columns]

        numeric_features = ["Car_Age", "Mileage", "Cylinders", "Brand_Encoded"]
        df_input[numeric_features] = price_scaler.transform(df_input[numeric_features])

        predicted_price = price_model.predict(df_input.values)

        return jsonify({"prediction": round(float(predicted_price[0]), 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict-risk", methods=["POST"])
def predict_risk():
    try:
        data = request.get_json()

        # Convert input to DataFrame
        df_input = pd.DataFrame([data])

        # Normalize text data
        df_input["Brand"] = df_input["Brand"].str.title().str.strip()
        df_input["Condition"] = df_input["Condition"].str.lower().replace("like new", "excellent")
        df_input["Fuel Type"] = df_input["Fuel Type"].str.lower().str.strip()
        df_input["Transmission"] = df_input["Transmission"].str.lower().str.strip()
        df_input["Body Type"] = df_input["Body Type"].str.lower().str.strip()
        df_input["Title Status"] = df_input["Title Status"].str.lower().str.strip()

        # Convert numerical values
        df_input["Price"] = pd.to_numeric(df_input["Price"], errors="coerce").fillna(0)
        df_input["Mileage"] = pd.to_numeric(df_input["Mileage"], errors="coerce").fillna(df_input["Mileage"].median())
        df_input["Cylinders"] = pd.to_numeric(df_input["Cylinders"], errors="coerce").fillna(df_input["Cylinders"].median())

        # Handle missing values in categorical columns
        default_mappings = {
            "Transmission": "automatic",
            "Body Type": "sedan",
            "Condition": "good",
            "Fuel Type": "gas",
            "Title Status": "clean"
        }
        for col, default_value in default_mappings.items():
            df_input[col] = df_input[col].fillna(default_value)

        # Feature Engineering
        CURRENT_YEAR = 2025
        df_input["Car_Age"] = CURRENT_YEAR - df_input["Year"]


        # Drop redundant columns
        df_input.drop(columns=["Year"], inplace=True, errors="ignore")

        # One-Hot Encoding for categorical variables
        categorical_columns = ["Brand", "Transmission", "Body Type", "Condition", "Fuel Type", "Title Status"]
        df_input = pd.get_dummies(df_input, columns=categorical_columns)

        # Ensure all expected columns exist
        for col in risk_expected_columns:
            if col not in df_input.columns:
                df_input[col] = 0  # Add missing columns with 0

        # Standardize numeric features
        numeric_features = ["Car_Age", "Mileage", "Cylinders"]
        df_input[numeric_features] = risk_scaler.transform(df_input[numeric_features])

        # Ensure column order matches training
        df_input = df_input[risk_expected_columns]

        # Convert to NumPy array
        df_input_np = df_input.values  # Store separately to avoid overwriting DataFrame

        # Make the prediction
        predicted_risk = risk_model.predict(df_input_np)

        # Reverse the dictionary to use numbers as keys
        risk_labels_reversed = {v: k for k, v in risk_labels.items()}

        # Debugging prediction and labels
        print(risk_labels)  # Debugging: should print {0: 'Very Low', 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Very High'}
        print(f"Predicted numeric risk value: {int(predicted_risk[0])}")  # Debugging

        # Convert numeric risk to descriptive label
        predicted_risk_label = risk_labels_reversed.get(int(predicted_risk[0]), "Unknown Risk Level")

        return jsonify({"prediction": predicted_risk_label})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/estimate-cost", methods=["POST"])
def predict_repair_cost():
    try:
        data = request.get_json()
        print("Received JSON data for repair cost prediction:", data)
        print("Number of features received:", len(data))

        # Convert input to DataFrame
        df_input = pd.DataFrame([data])

        # Normalize text data
        df_input["Brand"] = df_input["Brand"].str.title().str.strip()
        df_input["Condition"] = df_input["Condition"].str.lower().replace("like new", "excellent")
        df_input["Fuel Type"] = df_input["Fuel Type"].str.lower().str.strip()
        df_input["Transmission"] = df_input["Transmission"].str.lower().str.strip()
        df_input["Body Type"] = df_input["Body Type"].str.lower().str.strip()
        df_input["Title Status"] = df_input["Title Status"].str.lower().str.strip()

        # Convert numerical values
        df_input["Price"] = pd.to_numeric(df_input["Price"], errors="coerce").fillna(0)
        df_input["Mileage"] = pd.to_numeric(df_input["Mileage"], errors="coerce").fillna(df_input["Mileage"].median())
        df_input["Cylinders"] = pd.to_numeric(df_input["Cylinders"], errors="coerce").fillna(df_input["Cylinders"].median())

        # Feature Engineering
        df_input["Car_Age"] = datetime.now().year - df_input["Year"]
        df_input["Mileage_per_Year"] = df_input["Mileage"] / (df_input["Car_Age"] + 1)

        # Only drop what you truly don't need
        df_input.drop(columns=["Year"], inplace=True)

        # One-Hot Encoding for categorical columns
        categorical_columns = ["Brand", "Transmission", "Body Type", "Condition", "Fuel Type", "Title Status"]
        df_input = pd.get_dummies(df_input, columns=categorical_columns)

        print("Expected columns:", repair_cost_expected_columns)

        # Add missing columns with default value 0
        for col in repair_cost_expected_columns:
            if col not in df_input.columns:
                df_input[col] = 0

        # Ensure all columns are present and in correct order
        df_input = df_input[repair_cost_expected_columns]

        print("Final input shape:", df_input.shape)

        # Scale numerical features
        numeric_features = ["Car_Age", "Mileage", "Cylinders", "Price"]
        df_input[numeric_features] = repair_cost_scaler.transform(df_input[numeric_features])

        # Predict repair cost
        predicted_cost = repair_cost_model.predict(df_input.values)[0]

        # Generate human-readable repair reasons
        repair_reasons = generate_repair_reason(data)

        return jsonify({
            "estimated_repair_cost": round(float(predicted_cost), 2),
            "possible_repair_reasons": repair_reasons
        })

    except Exception as e:
        print("Exception occurred:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)