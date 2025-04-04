package cz.cervenka.omega.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HomeController {

    @GetMapping
    public String home(Model model, HttpSession session) {
        String userEmail = (String) session.getAttribute("userEmail");
        model.addAttribute("userEmail", userEmail);
        return "index";
    }

    @GetMapping("/try-ai")
    public String ai() {
        return "redirect:/price-predictor";
    }

    @GetMapping("/about")
    public String about(Model model, HttpSession session) {
        String userEmail = (String) session.getAttribute("userEmail");
        model.addAttribute("userEmail", userEmail);
        return "about";
    }
}
