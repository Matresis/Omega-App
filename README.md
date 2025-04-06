# Car Evaluation AI System

#### Author: Matěj Červenka C4c 6.4.2025
#### School Project: Střední průmyslová škola elektrotechnická, Praha 2, Ječná 30
#### Contact: matej.cervenka1106@gmail.com

This repository contains a machine learning-based car evaluation system implemented with various predictive models. These models are integrated into a Spring Boot web application to predict the price, risk, and repair costs of used cars based on various attributes. This system is designed to help users assess the value, potential risk, and repair requirements of used cars before making purchasing decisions.

## Models Overview

### 1. **Car Price Prediction Model**
   This model predicts the price of a used car based on its features:
   - **Brand**
   - **Year of Make**
   - **Mileage**
   - **Body Type**
   - **Fuel Type**
   - **Transmission**
   - **Condition**
   - **Title Status**
   - **Number of Cylinders**

   It uses **regression techniques** to predict the most probable price based on the input features. 
   Model used: **GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, max_depth=5, random_state=42)**

### 2. **Car Risk Prediction Model**
   The risk prediction model estimates the **risk level** associated with purchasing a used car. This risk level can help users identify suspicious listings. The model considers:
   - **Price**
   - **Year of Make**
   - **Mileage**
   - **Body Type**
   - **Transmission**
   - **Condition**
   - **Title Status**
   
   The model predicts a **risk category** based on these features, with categories ranging from low to very high risk.
   Model used: **RandomForestClassifiern_estimators=300, max_depth=10, min_samples_split=5, min_samples_leaf=3, class_weight='balanced', random_state=42**

### 3. **Repair Cost Prediction Model**
   This model classifies whether the car is likely to need repairs or not based on the following features:
   - **Price**
   - **Year of Make**
   - **Mileage**
   - **Condition**
   - **Title Status**

   The model uses a heuristic approach based on **car mileage**, **condition**, and **car age**.
   Model used: **RandomForestClassifiern_estimators=300, max_depth=10, min_samples_split=5, min_samples_leaf=3, class_weight='balanced', random_state=42**

### 4. **Repair Cost Prediction Model**
   This model predicts the likely **repair costs** based on the following features:
   - **Price**
   - **Year of Make**
   - **Mileage**
   - **Condition**
   - **Title Status**

   The model uses a heuristic approach based on **car mileage** and **condition** to estimate repair costs.
   Model used: **XGBoostRegressor(random_state=42, learning_rate=0.1, max_depth=5, n_estimators=100, subsample=1.0)**

---

## Issues
| Name                     | Description                                                                                   | Expected                     | Issue                   | Resolved/Fix                 |
|--------------------------|-----------------------------------------------------------------------------------------------|------------------------------|-------------------------|------------------------------|
| Price not send into api      | Price wasn't being sent from form into model             | Error message                | Crash                   | Parsing form String to Double                           |
| Result of prediction not displayed | After trying to predict cost of repair, result did not display  | Error message                | JavaScript Key Mismatch   | Entering correct passing key                          |
| Wrong model endpoint called      | Called the wrong Flask endpoint from predictor service                                        | Correct model result                 | Wrong output or 404              | Fixed `apiUrl` string in service class            |
| Flask not running                | Prediction endpoints returned `Connection Refused`                                            | Valid API response                   | Flask server not started         | Ran Flask model locally        |
| JSON parsing issues              | API call returned unexpected error or null values                                             | Parsed response object               | Bad or nested JSON structure     | Checked Flask response keys and structure         |
| Shape mismatch              | Shape mismatch when sending formData into model prediction                                             | Result of Prediction               | Shape mismatch     | Added / Removed parameters from recieving data         |


## Spring Boot Web Application

### Overview
The Spring Boot application provides a web interface for users to interact with the car evaluation models. It allows users to input car details, view predictions, and receive evaluations for:
   - Car price prediction
   - Car risk level prediction
   - Estimated repair costs

### Features
- **User Authentication**: Secure login and registration system to allow only logged in users use other ai models on website.
- **Car Evaluation Forms**: Three main forms for:
  1. **Price Prediction**
  2. **Risk Prediction**
  3. **Repair Cost Estimation**
- **Results Display**: After submitting the form, users are shown predictions for car price, risk level, and repair cost.

### Model Integration
Each machine learning model (price prediction, risk prediction, repair cost estimation) is exposed via **RESTful API endpoints** in the Spring Boot application. The backend communicates with the models, which are deployed as **Python microservices** using Flask.

#### API Endpoints
- **/predict-price**: Endpoint for car price prediction.
- **/predict-risk**: Endpoint for car risk level prediction.
- **/predict-repair-cost**: Endpoint for estimating repair costs.

These endpoints call the respective models, process the data, and return predictions to the frontend.

### Steps to Implement Models in Spring Boot

1. **Model Integration**:  
   The models are trained and saved as Python pickle files (`.pkl`). These files are loaded by the Flask application, which serves the prediction APIs.

2. **Flask Microservice Setup**:  
   Each model is hosted on a Flask server. The Flask app listens for requests from the Spring Boot application and returns predictions. The following Flask APIs are set up:
   - `/predict-price`
   - `/predict-risk`
   - `/predict-repair`
   - `/estimate-cost`

3. **Spring Boot Integration**:
   - **Controller Layer**: The Spring Boot application communicates with the Flask microservices via HTTP requests (REST calls) using `RestTemplate` to invoke the prediction APIs.
   - **Service Layer**: A service layer is created to handle the communication between the Spring Boot application and the Flask services. It sends the necessary data to the Flask APIs and processes the results.

4. **Frontend**:
   - The frontend of the application provides forms for users to input car details. Upon form submission, the corresponding model's prediction is displayed.

### Setting Up the Flask Model API
Ensure that each Flask model API is deployed and accessible to the Spring Boot application. Here's an example of how to call the Flask APIs from Spring Boot:

```java
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CarEvaluationService {

    private final RestTemplate restTemplate;

    public CarEvaluationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PricePredictionResult predictPrice(CarDetails carDetails) {
        String url = "http://localhost:5000/predict-price";
        return restTemplate.postForObject(url, carDetails, PricePredictionResult.class);
    }

    public RiskPredictionResult predictRisk(CarDetails carDetails) {
        String url = "http://localhost:5001/predict-risk";
        return restTemplate.postForObject(url, carDetails, RiskPredictionResult.class);
    }

    public RepairCostPredictionResult predictRepairCost(CarDetails carDetails) {
        String url = "http://localhost:5002/predict-repair-cost";
        return restTemplate.postForObject(url, carDetails, RepairCostPredictionResult.class);
    }
}
```
---

## ChatGPT
| Topic                            | Description                                                                                      | Result                                                   |
|----------------------------------|--------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| Scraper for cars          | Helped structure the scraper using selenium and webdriver library                                       | Functional scraper for **craigslist** website             |
| Flask model integration          | Helped connect Spring Boot to Flask ML models via REST API                                       | Functional prediction endpoints `/predict-*`            |
| Data cleaning and preprocessing  | Created robust cleaning pipelines for car datasets                                               | Clean, consistent data for training & inference         |
| Encoding field "Brand"  | Encoding parameter "Brand" into number-like form for models to handle                                     | Encoded into number representing mean of price of cars with same brand          |
| Feature engineering              | Suggested features like `Car_Age`, `Mileage_per_Year`, and price-based brand encoding            | Improved model performance and realism                  |
| Mapping risk labels              | Feature engineering columns as for example `Condition_Risk` into `Risk_Category` represented by number and labels (Low, Medium, High)            | Feature engineering and label mapping                  |
| Passing models              | Passing functions like Scaler, encodings or order of parameters as models            | Secured passing of normalization methods and maintenance of order of features model is trained and tested with                  |

---

## Requirements
### Backend
- Spring Boot: For the backend logic and REST API endpoints.
- Flask: For serving the machine learning models via Python APIs.
- Python 3.x: To run Flask and the machine learning models.
- Java 8+: Required for the Spring Boot application.
- Maven: For building the Spring Boot application.

### Frontend
- Thymeleaf: Server-side templating engine for rendering views
- HTML/CSS/JS: For the frontend to display car evaluation forms and results.

### Libraries and Tools Used
- Spring Boot (Backend)
- Flask (Python Microservice for ML Models)
- Scikit-learn (for model training)
- Pandas (Data cleaning and preprocessing)
- NumPy (Numerical computations)
- Java RestTemplate (Spring Boot - Flask Communication)

## How to Run the Application
1) Train the Models:
- Use the provided datasets to train your machine learning models (Price Prediction, Risk Prediction, Repair Cost Estimation).
- Save the models, encodings, and mappings as .pkl files and deploy them using Flask.
- **Whole cleaning, training, and testing are included in Google Colab notebooks available in the repository.**

2) Set Up the Flask APIs:
- Ensure that each model has an available API endpoint as a Flask microservice and is accessible at `http://localhost:5000`.

2) Build and Run the Spring Boot Application:
- Clone this repository.
- Run `mvn clean install` to build the project.
- Start the Spring Boot application: `mvn spring-boot:run`.

3) Access the Application:
- Navigate to `http://localhost:8080` to use the car evaluation system.
