package com.auralens.studio.services;

import com.auralens.studio.models.WheelImage;
import com.auralens.studio.repositories.WheelImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class WheelImageService {

    private final WheelImageRepository wheelImageRepository;
    private final List<WheelImage> inMemoryFallback = new CopyOnWriteArrayList<>();
    private boolean useFallback = false;

    @Autowired
    public WheelImageService(WheelImageRepository wheelImageRepository) {
        this.wheelImageRepository = wheelImageRepository;
    }

    @PostConstruct
    public void init() {
        // Load default 10 wheel images
        String[] defaultUrls = {
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
        };

        String[] defaultTitles = {
            "Portrait Arts",
            "Milestone Photoshoot",
            "Urban Stories",
            "Classic Frames",
            "Outdoor Vibe",
            "Modern Life",
            "Cinema Moments",
            "Artistic Vision",
            "Natural Light",
            "Studio Master"
        };

        String[] defaultDescriptions = {
            "Every face tells a unique story. Capturing the essence of personality.",
            "Capturing life's most precious milestones. Celebrating your special moments.",
            "Capturing the heartbeat of the city. Raw, candid, and full of life.",
            "Timeless monochrome and rich textures that never go out of style.",
            "Nature meets portraiture. Beautiful golden hour shots and natural backdrops.",
            "High-end commercial and lifestyle photography for the digital age.",
            "Stunning cinematic shots that capture the drama and beauty of life.",
            "Exploring unique perspectives and creative compositions.",
            "Mastering the art of natural illumination for soft, ethereal portraits.",
            "Precision lighting and professional backdrops for high-end studio work."
        };

        for (int i = 0; i < 9; i++) {
            WheelImage img = new WheelImage(i + 1, defaultUrls[i], defaultTitles[i], defaultDescriptions[i]);
            img.setId("fallback-id-" + (i + 1));
            inMemoryFallback.add(img);
        }

        // Try to initialize MongoDB with default values if empty
        try {
            // Delete slot 10 if it exists in DB
            wheelImageRepository.findBySlot(10).ifPresent(wheelImageRepository::delete);

            long count = wheelImageRepository.count();
            if (count == 0) {
                List<WheelImage> dbImages = new ArrayList<>();
                for (int i = 0; i < 9; i++) {
                    WheelImage img = new WheelImage(i + 1, defaultUrls[i], defaultTitles[i], defaultDescriptions[i]);
                    dbImages.add(img);
                }
                wheelImageRepository.saveAll(dbImages);
                System.out.println("Initialized MongoDB with 9 default wheel images.");
            }
        } catch (Exception e) {
            System.err.println("Failed to count, save, or clean MongoDB on init. Using in-memory fallback. Error: " + e.getMessage());
            useFallback = true;
        }
    }

    public List<WheelImage> getAllWheelImages() {
        if (useFallback) {
            return inMemoryFallback;
        }
        try {
            List<WheelImage> images = wheelImageRepository.findAllByOrderBySlotAsc();
            if (images.isEmpty()) {
                return inMemoryFallback;
            }
            return images;
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory wheel images. Error: " + e.getMessage());
            useFallback = true;
            return inMemoryFallback;
        }
    }

    public WheelImage updateWheelImage(@NonNull WheelImage updatedImage) {
        if (useFallback) {
            for (int i = 0; i < inMemoryFallback.size(); i++) {
                if (inMemoryFallback.get(i).getSlot() == updatedImage.getSlot()) {
                    inMemoryFallback.set(i, updatedImage);
                    return updatedImage;
                }
            }
            return updatedImage;
        }
        try {
            Optional<WheelImage> existingOpt = wheelImageRepository.findBySlot(updatedImage.getSlot());
            if (existingOpt.isPresent()) {
                WheelImage existing = existingOpt.get();
                existing.setImageUrl(updatedImage.getImageUrl());
                existing.setTitle(updatedImage.getTitle());
                existing.setDescription(updatedImage.getDescription());
                return wheelImageRepository.save(existing);
            } else {
                return wheelImageRepository.save(updatedImage);
            }
        } catch (Exception e) {
            System.err.println("MongoDB connection failed during update! Falling back to in-memory update. Error: " + e.getMessage());
            useFallback = true;
            // Update in fallback list
            for (int i = 0; i < inMemoryFallback.size(); i++) {
                if (inMemoryFallback.get(i).getSlot() == updatedImage.getSlot()) {
                    inMemoryFallback.set(i, updatedImage);
                    return updatedImage;
                }
            }
            return updatedImage;
        }
    }
}
