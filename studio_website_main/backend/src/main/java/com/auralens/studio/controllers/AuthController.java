package com.auralens.studio.controllers;

import com.auralens.studio.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Username and password are required");
            return ResponseEntity.badRequest().body(err);
        }

        Map<String, String> authResult = authService.authenticateAdmin(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        if (authResult == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", authResult.get("token"));
        response.put("username", authResult.get("username"));

        return ResponseEntity.ok(response);
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
