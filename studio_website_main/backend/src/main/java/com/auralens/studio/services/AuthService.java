package com.auralens.studio.services;

import com.auralens.studio.models.Booking;
import com.auralens.studio.models.ClientUser;
import com.auralens.studio.repositories.BookingRepository;
import com.auralens.studio.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    private final JwtTokenProvider tokenProvider;
    private final com.auralens.studio.repositories.ClientUserRepository clientUserRepository;
    private final BookingRepository bookingRepository;
    private final com.auralens.studio.repositories.AdminUserRepository adminUserRepository;

    @Autowired
    public AuthService(JwtTokenProvider tokenProvider, 
                       com.auralens.studio.repositories.ClientUserRepository clientUserRepository, 
                       BookingRepository bookingRepository,
                       com.auralens.studio.repositories.AdminUserRepository adminUserRepository) {
        this.tokenProvider = tokenProvider;
        this.clientUserRepository = clientUserRepository;
        this.bookingRepository = bookingRepository;
        this.adminUserRepository = adminUserRepository;
    }

    @jakarta.annotation.PostConstruct
    public void seedAdminUsers() {
        try {
            Optional<com.auralens.studio.models.AdminUser> existing = adminUserRepository.findByUsername(adminUsername);
            if (!existing.isPresent()) {
                com.auralens.studio.models.AdminUser defaultAdmin = new com.auralens.studio.models.AdminUser();
                defaultAdmin.setUsername(adminUsername);
                defaultAdmin.setPassword(adminPassword);
                defaultAdmin.setRole("Superadmin");
                defaultAdmin.setStatus("ACTIVE");
                defaultAdmin.setPageAccess(java.util.Arrays.asList(
                    "bookings",
                    "contacts",
                    "clients",
                    "client-images",
                    "payments",
                    "wheel",
                    "gallery",
                    "reviews",
                    "settings",
                    "user-management"
                ));
                adminUserRepository.save(defaultAdmin);
                System.out.println("Seeded default Superadmin user: " + adminUsername);
            }
        } catch (Exception e) {
            System.err.println("Failed to seed default admin user: " + e.getMessage());
        }
    }

    @jakarta.annotation.PostConstruct
    @SuppressWarnings("null")
    public void migrateClientIds() {
        try {
            List<ClientUser> users = clientUserRepository.findAll();
            boolean updatedAny = false;
            for (ClientUser user : users) {
                if (user.getClientId() == null && user.getBookingId() != null) {
                    Optional<Booking> bookingOpt = bookingRepository.findById(user.getBookingId());
                    if (bookingOpt.isPresent()) {
                        user.setClientId(bookingOpt.get().getClientId());
                        clientUserRepository.save(user);
                        updatedAny = true;
                    }
                }
            }
            if (updatedAny) {
                System.out.println("Migrated existing ClientUser records to include ClientID.");
            }
        } catch (Exception e) {
            System.err.println("Failed to run ClientID migration: " + e.getMessage());
        }
    }

    public Map<String, Object> authenticateAdmin(String username, String password) {
        Optional<com.auralens.studio.models.AdminUser> adminOpt = adminUserRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            com.auralens.studio.models.AdminUser admin = adminOpt.get();
            if (admin.getPassword().equals(password)) {
                if ("DEACTIVATED".equalsIgnoreCase(admin.getStatus())) {
                    return null;
                }
                
                admin.setLastLogin(System.currentTimeMillis());
                adminUserRepository.save(admin);

                String token = tokenProvider.generateToken(username, admin.getRole().toLowerCase());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("username", username);
                response.put("role", admin.getRole());
                response.put("pageAccess", admin.getPageAccess());
                return response;
            }
        }
        return null;
    }

    public ClientUser registerClient(ClientUser clientUser) {
        Optional<ClientUser> existingOpt = clientUserRepository.findByBookingId(clientUser.getBookingId());
        if (existingOpt.isPresent()) {
            ClientUser existing = existingOpt.get();
            existing.setUsername(clientUser.getUsername());
            existing.setPassword(clientUser.getPassword());
            existing.setFullName(clientUser.getFullName());
            existing.setPhone(clientUser.getPhone());
            existing.setClientId(clientUser.getClientId());
            // Preserve status and lastLogin if they exist
            return clientUserRepository.save(existing);
        }
        return clientUserRepository.save(clientUser);
    }

    public Map<String, Object> authenticateClient(String username, String password) {
        Optional<ClientUser> userOpt = clientUserRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            ClientUser user = userOpt.get();
            
            // Block if deactivated
            if ("DEACTIVATED".equalsIgnoreCase(user.getStatus())) {
                return null;
            }

            // Update last login
            user.setLastLogin(System.currentTimeMillis());
            clientUserRepository.save(user);

            String token = tokenProvider.generateToken(username);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);
            response.put("fullName", user.getFullName());
            response.put("bookingId", user.getBookingId());
            return response;
        }
        return null;
    }

    public Optional<ClientUser> getClientByBookingId(String bookingId) {
        return clientUserRepository.findByBookingId(bookingId);
    }

    // Admin APIs for Client Users
    public List<ClientUser> getAllClientUsers() {
        return clientUserRepository.findAll();
    }

    public Optional<ClientUser> updateClientStatus(@NonNull String id, String status) {
        Optional<ClientUser> userOpt = clientUserRepository.findById(id);
        if (userOpt.isPresent()) {
            ClientUser user = userOpt.get();
            user.setStatus(status);
            return Optional.of(clientUserRepository.save(user));
        }
        return Optional.empty();
    }

    public void deleteClientUser(@NonNull String id) {
        clientUserRepository.deleteById(id);
    }

    // Admin Users Management methods
    public List<com.auralens.studio.models.AdminUser> getAllAdminUsers() {
        return adminUserRepository.findAll();
    }

    public com.auralens.studio.models.AdminUser createAdminUser(com.auralens.studio.models.AdminUser adminUser) {
        adminUser.setStatus("ACTIVE");
        if (adminUser.getRole() == null) {
            adminUser.setRole("Admin");
        }
        if (adminUser.getPageAccess() == null) {
            adminUser.setPageAccess(new java.util.ArrayList<>());
        }
        return adminUserRepository.save(adminUser);
    }

    public Optional<com.auralens.studio.models.AdminUser> updateAdminStatus(@NonNull String id, String status) {
        Optional<com.auralens.studio.models.AdminUser> adminOpt = adminUserRepository.findById(id);
        if (adminOpt.isPresent()) {
            com.auralens.studio.models.AdminUser admin = adminOpt.get();
            if (admin.getUsername().equals(adminUsername)) {
                // Cannot deactivate primary superadmin
                return Optional.empty();
            }
            admin.setStatus(status);
            return Optional.of(adminUserRepository.save(admin));
        }
        return Optional.empty();
    }

    public Optional<com.auralens.studio.models.AdminUser> updateAdminPermissions(@NonNull String id, List<String> pageAccess) {
        Optional<com.auralens.studio.models.AdminUser> adminOpt = adminUserRepository.findById(id);
        if (adminOpt.isPresent()) {
            com.auralens.studio.models.AdminUser admin = adminOpt.get();
            admin.setPageAccess(pageAccess);
            return Optional.of(adminUserRepository.save(admin));
        }
        return Optional.empty();
    }

    public boolean deleteAdminUser(@NonNull String id) {
        Optional<com.auralens.studio.models.AdminUser> adminOpt = adminUserRepository.findById(id);
        if (adminOpt.isPresent()) {
            com.auralens.studio.models.AdminUser admin = adminOpt.get();
            if (admin.getUsername().equals(adminUsername)) {
                // Cannot delete primary superadmin
                return false;
            }
            adminUserRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
