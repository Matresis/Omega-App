package cz.cervenka.omega.controllers;

import cz.cervenka.omega.database.entities.UserEntity;
import cz.cervenka.omega.services.AuthService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new UserEntity());
        return "register";
    }

    @PostMapping("/login")
    public String authenticateUser(@RequestParam String email,
                                   @RequestParam String password,
                                   Model model,
                                   HttpSession session) {  // Inject session
        if (email.isBlank() || password.isBlank()) {
            model.addAttribute("errorMessage", "Email and password cannot be empty.");
            return "login";
        }

        boolean isAuthenticated = authService.authenticateUser(email, password);
        if (isAuthenticated) {
            session.setAttribute("userEmail", email); // Store email in session
            return "redirect:/";
        } else {
            model.addAttribute("errorMessage", "Invalid email or password.");
            return "login";
        }
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam String name,
                               @RequestParam String surname,
                               @RequestParam String email,
                               @RequestParam String password,
                               Model model) {
        if (name.isBlank() || surname.isBlank() || email.isBlank() || password.isBlank()) {
            model.addAttribute("errorMessage", "All fields are required.");
            return "register";
        }

        UserEntity newUser = new UserEntity();
        newUser.setName(name);
        newUser.setSurname(surname);
        newUser.setEmail(email);
        newUser.setPassword(password);

        try {
            authService.registerUser(newUser);
            return "redirect:/";
        } catch (IllegalArgumentException e) {
            model.addAttribute("errorMessage", "User with this email already exists.");
            return "register";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate(); // Clear session on logout
        return "redirect:/";
    }
}
