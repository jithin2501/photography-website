package com.auralens.studio.controllers;

import com.auralens.studio.models.AdminUser;
import com.auralens.studio.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/admin-users")
public class AdminUserController {

    private final AuthService authService;

    @Autowired
    public AdminUserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getAllAdminUsers() {
        return ResponseEntity.ok(authService.getAllAdminUsers());
    }

    @PostMapping
    public ResponseEntity<?> createAdminUser(@RequestBody AdminUser adminUser) {
        if (adminUser.getUsername() == null || adminUser.getPassword() == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Username and password are required");
            return ResponseEntity.badRequest().body(err);
        }
        AdminUser saved = authService.createAdminUser(adminUser);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAdminStatus(@PathVariable @NonNull String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || (!status.equalsIgnoreCase("ACTIVE") && !status.equalsIgnoreCase("DEACTIVATED"))) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid status. Must be ACTIVE or DEACTIVATED");
            return ResponseEntity.badRequest().body(err);
        }
        return authService.updateAdminStatus(id, status.toUpperCase())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Failed to update status. Primary Superadmin status cannot be modified."));
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<?> updateAdminPermissions(@PathVariable @NonNull String id, @RequestBody Map<String, List<String>> body) {
        List<String> pageAccess = body.get("pageAccess");
        if (pageAccess == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "pageAccess list is required");
            return ResponseEntity.badRequest().body(err);
        }
        return authService.updateAdminPermissions(id, pageAccess)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdminUser(@PathVariable @NonNull String id) {
        boolean deleted = authService.deleteAdminUser(id);
        Map<String, String> res = new HashMap<>();
        if (deleted) {
            res.put("message", "Admin user deleted successfully");
            return ResponseEntity.ok(res);
        } else {
            res.put("error", "Failed to delete admin user. Primary Superadmin cannot be deleted.");
            return ResponseEntity.badRequest().body(res);
        }
    }
}
