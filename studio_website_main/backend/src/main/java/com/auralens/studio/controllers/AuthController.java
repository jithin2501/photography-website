package com.auralens.studio.controllers;

import com.auralens.studio.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
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

        // 1. Try admin authentication
        Map<String, Object> adminAuthResult = authService.authenticateAdmin(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        if (adminAuthResult != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", adminAuthResult.get("token"));
            response.put("username", adminAuthResult.get("username"));
            response.put("role", adminAuthResult.get("role"));
            response.put("pageAccess", adminAuthResult.get("pageAccess"));
            return ResponseEntity.ok(response);
        }

        // 2. Try client user authentication
        Map<String, Object> clientAuthResult = authService.authenticateClient(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        if (clientAuthResult != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", clientAuthResult.get("token"));
            response.put("username", clientAuthResult.get("username"));
            response.put("fullName", clientAuthResult.get("fullName"));
            response.put("bookingId", clientAuthResult.get("bookingId"));
            response.put("role", "client");
            return ResponseEntity.ok(response);
        }

        Map<String, String> err = new HashMap<>();
        err.put("error", "Invalid username or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
    }

    @GetMapping("/client/booking/{bookingId}")
    public ResponseEntity<?> getClientByBooking(@PathVariable String bookingId) {
        return authService.getClientByBookingId(bookingId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/client/register")
    public ResponseEntity<?> registerClient(@RequestBody com.auralens.studio.models.ClientUser clientUser) {
        if (clientUser.getUsername() == null || clientUser.getPassword() == null || clientUser.getBookingId() == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Username, password and bookingId are required");
            return ResponseEntity.badRequest().body(err);
        }
        com.auralens.studio.models.ClientUser saved = authService.registerClient(clientUser);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/client/admin/users")
    public ResponseEntity<?> getAllClientUsers() {
        return ResponseEntity.ok(authService.getAllClientUsers());
    }

    @PutMapping("/client/admin/{id}/status")
    public ResponseEntity<?> updateClientStatus(@PathVariable @NonNull String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || (!status.equalsIgnoreCase("ACTIVE") && !status.equalsIgnoreCase("DEACTIVATED"))) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid status. Must be ACTIVE or DEACTIVATED");
            return ResponseEntity.badRequest().body(err);
        }
        return authService.updateClientStatus(id, status.toUpperCase())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/client/admin/{id}")
    public ResponseEntity<?> deleteClientUser(@PathVariable @NonNull String id) {
        authService.deleteClientUser(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Client user deleted successfully");
        return ResponseEntity.ok(res);
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
