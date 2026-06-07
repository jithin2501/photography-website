package com.auralens.studio.services;

import com.auralens.studio.models.ServicePackagePrice;
import com.auralens.studio.repositories.ServicePackagePriceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ServicePackagePriceService {

    private final ServicePackagePriceRepository repository;
    private final List<ServicePackagePrice> inMemoryFallback = new ArrayList<>();
    private boolean useFallback = false;

    @Autowired
    public ServicePackagePriceService(ServicePackagePriceRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void init() {
        inMemoryFallback.add(new ServicePackagePrice("maternity", "Maternity", "₹15,000", "₹25,000", "₹40,000"));
        inMemoryFallback.add(new ServicePackagePrice("newborn", "Newborn", "₹15,000", "₹25,000", "₹40,000"));
        inMemoryFallback.add(new ServicePackagePrice("milestone", "Milestone", "₹15,000", "₹25,000", "₹40,000"));
        inMemoryFallback.add(new ServicePackagePrice("classes", "Classes", "₹14,999", "₹24,999", "₹39,999"));

        try {
            long count = repository.count();
            if (count == 0) {
                repository.saveAll(inMemoryFallback);
                System.out.println("Initialized MongoDB with default service package prices.");
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize MongoDB service package prices. Using in-memory fallback. Error: " + e.getMessage());
            useFallback = true;
        }
    }

    public List<ServicePackagePrice> getAllPrices() {
        if (useFallback) {
            return inMemoryFallback;
        }
        try {
            List<ServicePackagePrice> prices = repository.findAll();
            if (prices.isEmpty()) {
                return inMemoryFallback;
            }
            return prices;
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory prices. Error: " + e.getMessage());
            useFallback = true;
            return inMemoryFallback;
        }
    }

    public ServicePackagePrice updatePrice(@NonNull String id, @NonNull ServicePackagePrice updated) {
        if (useFallback) {
            for (ServicePackagePrice p : inMemoryFallback) {
                if (id.equals(p.getId())) {
                    p.setBasicPrice(updated.getBasicPrice());
                    p.setStandardPrice(updated.getStandardPrice());
                    p.setPremiumPrice(updated.getPremiumPrice());
                    return p;
                }
            }
            return null;
        }
        try {
            return repository.findById(id).map(existing -> {
                existing.setBasicPrice(updated.getBasicPrice());
                existing.setStandardPrice(updated.getStandardPrice());
                existing.setPremiumPrice(updated.getPremiumPrice());
                return repository.save(existing);
            }).orElseGet(() -> {
                updated.setId(id);
                return repository.save(updated);
            });
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory price update. Error: " + e.getMessage());
            useFallback = true;
            for (ServicePackagePrice p : inMemoryFallback) {
                if (id.equals(p.getId())) {
                    p.setBasicPrice(updated.getBasicPrice());
                    p.setStandardPrice(updated.getStandardPrice());
                    p.setPremiumPrice(updated.getPremiumPrice());
                    return p;
                }
            }
            return null;
        }
    }
}
