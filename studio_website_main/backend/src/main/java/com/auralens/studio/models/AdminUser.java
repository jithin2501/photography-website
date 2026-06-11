package com.auralens.studio.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "admin_users")
public class AdminUser {

    @Id
    private String id;
    private String username;
    private String password;
    private String role = "Admin"; // "Superadmin", "Admin"
    private String status = "ACTIVE"; // "ACTIVE", "DEACTIVATED"
    private Long lastLogin; // unix timestamp
    private List<String> pageAccess; // e.g. ["bookings", "contacts", "clients", ...]

    public AdminUser() {}

    public AdminUser(String username, String password, String role, String status) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Long lastLogin) {
        this.lastLogin = lastLogin;
    }

    public List<String> getPageAccess() {
        return pageAccess;
    }

    public void setPageAccess(List<String> pageAccess) {
        this.pageAccess = pageAccess;
    }
}
