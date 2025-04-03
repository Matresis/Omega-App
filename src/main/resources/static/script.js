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
            const response = await fetch("/predict-price", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            resultDiv.textContent = `Predicted Price: $${data.prediction}`;
        } catch (error) {
            resultDiv.textContent = "Error predicting price.";
            console.error(error);
        }
    });
});

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
            const response = await fetch("/predict-risk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            resultDiv.textContent = `Predicted Risk: ${data.prediction}`;
        } catch (error) {
            resultDiv.textContent = "Error predicting price.";
            console.error(error);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("flipPredictorForm");
    const resultDiv = document.getElementById("flipPredictorResult");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Collect form data
        const formData = {
            Brand: document.getElementById("brand3").value,
            Year: parseInt(document.getElementById("year3").value),
            Mileage: parseInt(document.getElementById("mileage3").value),
            Transmission: document.getElementById("transmission3").value,
            "Body Type": document.getElementById("bodyType3").value,
            Condition: document.getElementById("condition3").value,
            Cylinders: parseInt(document.getElementById("cylinders3").value),
            "Fuel Type": document.getElementById("fuelType3").value,
            "Title Status": document.getElementById("titleStatus3").value,
            Price: parseInt(document.getElementById("price3").value)
        };

        console.log("Sending flip prediction data:", formData);

        try {
            const response = await fetch("/predict-flip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            resultDiv.textContent = `Potential Predicted Flip Price: ${data.prediction}`;
        } catch (error) {
            resultDiv.textContent = "Error predicting price.";
            console.error(error);
        }
    });
});