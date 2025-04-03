
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
            const response = await fetch("/flip-estimator/estimate-flip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            resultDiv.textContent = `Potential Predicted Flip Price: ${data.prediction}`;
            resultDiv.classList.add("fade-in");
        } catch (error) {
            resultDiv.textContent = "Error predicting price.";
            console.error(error);
        }
    });
});