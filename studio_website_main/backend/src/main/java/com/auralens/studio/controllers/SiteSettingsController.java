package com.auralens.studio.controllers;

import com.auralens.studio.models.SiteSettings;
import com.auralens.studio.repositories.SiteSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
public class SiteSettingsController {

    private final SiteSettingsRepository siteSettingsRepository;

    @Autowired
    public SiteSettingsController(SiteSettingsRepository siteSettingsRepository) {
        this.siteSettingsRepository = siteSettingsRepository;
    }

    // Public endpoint: get settings
    @GetMapping
    public ResponseEntity<Map<String, Object>> getSettings() {
        Optional<SiteSettings> optionalSettings = siteSettingsRepository.findById("system");
        SiteSettings settings;
        if (optionalSettings.isPresent()) {
            settings = optionalSettings.get();
        } else {
            // Create default settings if not exists
            settings = new SiteSettings();
            settings = siteSettingsRepository.save(settings);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", settings);
        return ResponseEntity.ok(response);
    }

    // Admin endpoint: update settings
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody SiteSettings updatedSettings) {
        Optional<SiteSettings> optionalSettings = siteSettingsRepository.findById("system");
        SiteSettings settings = optionalSettings.orElseGet(SiteSettings::new);

        settings.setHappyClients(updatedSettings.getHappyClients());
        settings.setPhotoshoots(updatedSettings.getPhotoshoots());
        settings.setAwardsWon(updatedSettings.getAwardsWon());
        settings.setClientSatisfaction(updatedSettings.getClientSatisfaction());
        if (updatedSettings.getInstagramId() != null) {
            settings.setInstagramId(updatedSettings.getInstagramId());
        }

        SiteSettings saved = siteSettingsRepository.save(settings);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }
}
