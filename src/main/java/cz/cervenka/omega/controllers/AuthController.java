package cz.cervenka.omega.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @GetMapping
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String logout() {
        return "register";
    }

    @PostMapping("/login")
    public String authenticate() {
        // Implement authentication logic here
        return "redirect:/";
    }

    @PostMapping("/register")
    public String register() {
        // Implement registration logic here
        return "redirect:/";
    }
}