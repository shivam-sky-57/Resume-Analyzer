package com.resume.analyzer.controller;

import com.resume.analyzer.entity.User;
import com.resume.analyzer.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String token = authService.register(
                request.get("name"),
                request.get("email"),
                request.get("password")
        );
        return ResponseEntity.ok(Map.of(
                "token", token,
                "name", request.get("name"),
                "email", request.get("email")
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String token = authService.login(
                request.get("email"),
                request.get("password")
        );
        // Find user to return info
        User user = authService.getCurrentUser();
        
        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", request.get("email"),
                "name", user != null ? user.getName() : "User"
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        authService.resetPassword(request.get("email"), request.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }
}
