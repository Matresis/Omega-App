document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("pricePredictionForm");
    const resultDiv = document.getElementById("pricePredictionResult");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Collect form data
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
            resultDiv.textContent = `Predicted Price: $${data.prediction}`;
            resultDiv.classList.add("fade-in");
        } catch (error) {
            resultDiv.textContent = "Error predicting price.";
            console.error(error);
        }
    });
});