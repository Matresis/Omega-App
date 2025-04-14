package cz.cervenka.omega.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class PredictorService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${flask.server.url}")
    private String flaskServerUrl;

    public Map<String, Object> predictCarPrice(Map<String, Object> carData) {
        String apiUrl = flaskServerUrl + "/predict-price";
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, carData, Map.class);
        return response.getBody();
    }

    public Map<String, Object> predictRisk(Map<String, Object> carData) {
        String apiUrl = flaskServerUrl + "/predict-risk";

        carData.put("Price", Double.valueOf(carData.get("Price").toString()));

        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, carData, Map.class);
        return response.getBody();
    }

    public Map<String, Object> predictRepair(Map<String, Object> carData) {
        String apiUrl = flaskServerUrl + "/predict-repair";

        carData.put("Price", Double.valueOf(carData.get("Price").toString()));
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, carData, Map.class);
        return response.getBody();
    }

    public Map<String, Object> estimateCost(Map<String, Object> carData) {
        String apiUrl = flaskServerUrl + "/estimate-cost";

        carData.put("Price", Double.valueOf(carData.get("Price").toString()));
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, carData, Map.class);
        return response.getBody();
    }

    public List<String> getBrands() {
        return Arrays.asList("Ford", "Toyota", "Chevrolet", "Honda", "Nissan", "BMW", "Dodge", "Jeep",
                "GMC", "Subaru", "Lexus", "Mercedes-Benz", "Hyundai", "Volkswagen",
                "Kia", "Cadillac", "Audi", "Chrysler");
    }

    public List<String> getTransmissions() {
        return Arrays.asList("automatic", "manual");
    }

    public List<String> getBodyTypes() {
        return Arrays.asList("sedan", "suv", "coupe", "hatchback", "minivan", "convertible", "offroad", "pickup", "truck", "van", "wagon", "other");
    }

    public List<String> getConditions() {
        return Arrays.asList("new", "excellent", "good", "fair", "salvage", "unknown");
    }

    public List<String> getFuelTypes() {
        return Arrays.asList("gas", "diesel", "electric", "hybrid", "other");
    }

    public List<String> getTitleStatuses() {
        return Arrays.asList("clean", "lien", "missing", "parts only", "rebuilt", "salvage", "unknown");
    }
}