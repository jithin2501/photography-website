package com.auralens.studio.controllers;

import com.auralens.studio.models.ServicePackagePrice;
import com.auralens.studio.services.ServicePackagePriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service-package-prices")
public class ServicePackagePriceController {

    private final ServicePackagePriceService service;

    @Autowired
    public ServicePackagePriceController(ServicePackagePriceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getServicePackagePrices() {
        List<ServicePackagePrice> prices = service.getAllPrices();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", prices);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateServicePackagePrice(
            @PathVariable("id") @NonNull String id,
            @RequestBody @NonNull ServicePackagePrice updated) {
        
        ServicePackagePrice result = service.updatePrice(id, updated);
        if (result == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("error", "Service package price not found.");
            return ResponseEntity.status(404).body(errorResponse);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", result);
        return ResponseEntity.ok(response);
    }
}
