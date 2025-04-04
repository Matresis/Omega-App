package cz.cervenka.omega.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import cz.cervenka.omega.services.PredictorService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/risk-predictor")
public class RiskPredictionController {

    private final PredictorService predictorService;

    public RiskPredictionController(PredictorService predictorService) {
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
        return "risk_predictor";
    }

    @PostMapping("/predict-risk")
    @ResponseBody
    public Map<String, Object> predictRisk(@RequestBody Map<String, Object> carData) {
        return predictorService.predictRisk(carData);
    }
}
