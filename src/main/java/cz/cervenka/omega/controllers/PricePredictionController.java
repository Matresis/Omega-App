package cz.cervenka.omega.controllers;

import cz.cervenka.omega.services.PredictorService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/price-predictor")
public class PricePredictionController {

    private final PredictorService predictorService;

    public PricePredictionController(PredictorService predictorService) {
        this.predictorService = predictorService;
    }

    @GetMapping
    public String showForm(Model model, HttpSession session) {
        List<String> brands = predictorService.getBrands();
        List<String> transmissions = predictorService.getTransmissions();
        List<String> bodyTypes = predictorService.getBodyTypes();
        List<String> conditions = predictorService.getConditions();
        List<String> fuelTypes = predictorService.getFuelTypes();
        List<String> titleStatuses = predictorService.getTitleStatuses();

        model.addAttribute("brands", brands);
        model.addAttribute("fuelTypes", fuelTypes);
        model.addAttribute("transmissions", transmissions);
        model.addAttribute("bodyTypes", bodyTypes);
        model.addAttribute("conditions", conditions);
        model.addAttribute("titleStatuses", titleStatuses);

        String userEmail = (String) session.getAttribute("userEmail");
        model.addAttribute("userEmail", userEmail);

        return "price_predictor";
    }

    @PostMapping("/predict-price")
    @ResponseBody
    public Map<String, Object> predictCarPrice(@RequestBody Map<String, Object> carData) {
        return predictorService.predictCarPrice(carData);
    }
}
