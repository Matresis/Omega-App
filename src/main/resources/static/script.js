document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("predictionForm");
    const resultDiv = document.getElementById("predictionResult");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Collect form data
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
            const response = await fetch("/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            resultDiv.textContent = `Predicted Price: <strong>${data.prediction}</strong>`;
        } catch (error) {
            resultDiv.textContent = "Error predicting price.";
            console.error(error);
        }
    });
});