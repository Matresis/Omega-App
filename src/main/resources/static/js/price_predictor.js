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
            Brand: document.getElementById("brand").value,
            Year: parseInt(document.getElementById("year").value),
            Mileage: parseInt(document.getElementById("mileage").value),
            Transmission: document.getElementById("transmission").value,
            "Body Type": document.getElementById("bodyType").value,
            Condition: document.getElementById("condition").value,
            Cylinders: parseInt(document.getElementById("cylinders").value),
            "Fuel Type": document.getElementById("fuelType").value,
            "Title Status": document.getElementById("titleStatus").value
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
            repairCostButton.style.display = "inline-block";

        } catch (error) {
            resultDiv.textContent = "Error predicting price.";
            console.error(error);
        }
    });

    repairCostButton.addEventListener("click", async function () {
        if (predictedPrice === null) return;

        const formData = {
            Brand: document.getElementById("brand").value,
            Year: parseInt(document.getElementById("year").value),
            Mileage: parseInt(document.getElementById("mileage").value),
            Transmission: document.getElementById("transmission").value,
            "Body Type": document.getElementById("bodyType").value,
            Condition: document.getElementById("condition").value,
            Cylinders: parseInt(document.getElementById("cylinders").value),
            "Fuel Type": document.getElementById("fuelType").value,
            "Title Status": document.getElementById("titleStatus").value,
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

document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = document.cookie.split('; ').find(row => row.startsWith('userEmail=')) !== undefined;

    if (!isLoggedIn) {
        document.querySelectorAll(".restricted").forEach(button => {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                showLoginModal();
            });
        });
    }
});

function showLoginModal() {
    const modal = document.getElementById("loginModal");
    modal.style.display = "block";
}

function closeLoginModal() {
    const modal = document.getElementById("loginModal");
    modal.style.display = "none";
}

function redirectToLogin() {
    window.location.href = "/auth";
}