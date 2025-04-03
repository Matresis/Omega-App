document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("riskPredictionForm");
    const resultDiv = document.getElementById("riskPredictionResult");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Collect form data
        const formData = {
            Brand: document.getElementById("brand2").value,
            Year: parseInt(document.getElementById("year2").value),
            Mileage: parseInt(document.getElementById("mileage2").value),
            Transmission: document.getElementById("transmission2").value,
            "Body Type": document.getElementById("bodyType2").value,
            Condition: document.getElementById("condition2").value,
            Cylinders: parseInt(document.getElementById("cylinders2").value),
            "Fuel Type": document.getElementById("fuelType2").value,
            "Title Status": document.getElementById("titleStatus2").value,
            Price: parseInt(document.getElementById("price2").value)
        };

        console.log("Sending risk prediction data:", formData);

        try {
            const response = await fetch("/risk-predictor/predict-risk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            resultDiv.textContent = `Predicted Risk: ${data.prediction}`;
            resultDiv.classList.add("fade-in");
        } catch (error) {
            resultDiv.textContent = "Error predicting price.";
            console.error(error);
        }
    });
});