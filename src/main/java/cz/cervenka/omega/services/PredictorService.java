package cz.cervenka.omega.services;

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
        String apiUrl = flaskServerUrl + "/predict";
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
        return Arrays.asList("sedan", "suv", "coupe", "hatchback", "minivan", "convertible", "offroad", "pickup", "suv", "truck", "van", "wagon", "other");
    }

    public List<String> getConditions() {
        return Arrays.asList("new", "excellent", "good", "fair", "salvage");
    }

    public List<String> getFuelTypes() {
        return Arrays.asList("gas", "diesel", "electric", "hybrid", "other");
    }

    public List<String> getTitleStatuses() {
        return Arrays.asList("clean", "lien", "missing", "parts only", "rebuilt", "salvage");
    }
}
