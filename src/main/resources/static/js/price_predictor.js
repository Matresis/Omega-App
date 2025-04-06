document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("pricePredictionForm");
    const resultDiv = document.getElementById("pricePredictionResult");
    const repairButton = document.getElementById("predictRepairsButton");
    const repairPredictionResult = document.getElementById("repairPredictionResult");
    const repairCostButton = document.getElementById("repairCostButton");
    const repairCostResult = document.getElementById("repairCostResult");
    const repairReasonResult = document.getElementById("repairReasonResult");

    let predictedPrice = null;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = {
            Brand: document.getElementById("brand1").value,
            Year: parseInt(document.getElementById("year1").value),
            Mileage: parseInt(document.getElementById("mileage1").value),
            Transmission: document.getElementById("transmission1").value,
            "Body Type": document.getElementById("bodyType1").value,
            Condition: document.getElementById("condition1").value,
            Cylinders: parseInt(document.getElementById("cylinders1").value),
            "Fuel Type": document.getElementById("fuelType1").value,
            "Title Status": document.getElementById("titleStatus1").value
        };

        try {
            const response = await fetch("/price-predictor/predict-price", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            predictedPrice = data.prediction;
            resultDiv.textContent = `Predicted Price: $${predictedPrice}`;
            resultDiv.classList.add("fade-in");

            // Show repair button
            repairButton.style.display = "inline-block";

        } catch (error) {
            resultDiv.textContent = "Error predicting price.";
            console.error(error);
        }
    });

    repairButton.addEventListener("click", async function () {
        if (predictedPrice === null) return;

        const formData = {
            Brand: document.getElementById("brand1").value,
            Year: parseInt(document.getElementById("year1").value),
            Mileage: parseInt(document.getElementById("mileage1").value),
            Transmission: document.getElementById("transmission1").value,
            "Body Type": document.getElementById("bodyType1").value,
            Condition: document.getElementById("condition1").value,
            Cylinders: parseInt(document.getElementById("cylinders1").value),
            "Fuel Type": document.getElementById("fuelType1").value,
            "Title Status": document.getElementById("titleStatus1").value,
            Price: predictedPrice
        };

        try {
            const response = await fetch("/repair-predictor/predict-repair", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            repairPredictionResult.textContent = `Repair Prediction: ${data.prediction}`;
            repairCostButton.style.display = "inline-block";

        } catch (error) {
            repairPredictionResult.textContent = "Error predicting repairs.";
            console.error(error);
        }
    });

    repairCostButton.addEventListener("click", async function () {
        if (predictedPrice === null) return;

        const formData = {
            Brand: document.getElementById("brand1").value,
            Year: parseInt(document.getElementById("year1").value),
            Mileage: parseInt(document.getElementById("mileage1").value),
            Transmission: document.getElementById("transmission1").value,
            "Body Type": document.getElementById("bodyType1").value,
            Condition: document.getElementById("condition1").value,
            Cylinders: parseInt(document.getElementById("cylinders1").value),
            "Fuel Type": document.getElementById("fuelType1").value,
            "Title Status": document.getElementById("titleStatus1").value,
            Price: predictedPrice
        };

        try {
            const response = await fetch("/repair-predictor/estimate-cost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            repairCostResult.textContent = `Estimated Repair Cost: $${data.estimated_repair_cost}`;
            repairReasonResult.textContent = `Repair Reason: ${data.possible_repair_reasons}`;

        } catch (error) {
            repairCostResult.textContent = "Error estimating repair cost.";
            repairReasonResult.textContent = "Error getting repair reasons.";
            console.error(error);
        }
    });
});
