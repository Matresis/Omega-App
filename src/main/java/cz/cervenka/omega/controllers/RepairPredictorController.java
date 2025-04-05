package cz.cervenka.omega.controllers;

import cz.cervenka.omega.services.PredictorService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/repair-predictor")
public class RepairPredictorController {

    private final PredictorService predictorService;

    public RepairPredictorController(PredictorService predictorService) {
        this.predictorService = predictorService;
    }

    @PostMapping("/predict-repair")
    @ResponseBody
    public Map<String, Object> predictRepair(@RequestBody Map<String, Object> carData) {
        return predictorService.predictRepair(carData);
    }

    @PostMapping("/estimate-cost")
    @ResponseBody
    public Map<String, Object> estimateCost(@RequestBody Map<String, Object> carData) {
        return predictorService.estimateCost(carData);
    }
}