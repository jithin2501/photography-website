package com.auralens.studio.services;

import com.auralens.studio.models.GalleryImage;
import com.auralens.studio.repositories.GalleryImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class GalleryImageService {

    private final GalleryImageRepository galleryImageRepository;
    private final List<GalleryImage> inMemoryFallback = new CopyOnWriteArrayList<>();
    private boolean useFallback = false;

    @Autowired
    public GalleryImageService(GalleryImageRepository galleryImageRepository) {
        this.galleryImageRepository = galleryImageRepository;
    }

    @PostConstruct
    public void init() {
        // Default gallery items matching the static layout
        String[] defaultUrls = {
            "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
        };

        String[] defaultCategories = {
            "Maternity", "Newborn", "Milestone", "Family", "Couples", "Newborn",
            "Newborn", "Maternity", "Milestone", "Events", "Events", "Couples"
        };

        String[] defaultTitles = {
            "Serene Waiting", "Swaddled Dreams", "Golden First Year", "Joyful Togetherness",
            "Forever Promise", "Tiny Wonders", "Sweet Simplicity", "Angelic Bloom",
            "Solid Beginnings", "Midnight Sparkle", "Garden Banquets", "Sunset Whispers"
        };

        long baseTime = System.currentTimeMillis();
        for (int i = 0; i < defaultUrls.length; i++) {
            // Keep timestamps descending
            GalleryImage img = new GalleryImage(defaultUrls[i], defaultCategories[i], defaultTitles[i], baseTime - (i * 1000));
            img.setId("fallback-gallery-id-" + (i + 1));
            img.setShowcasePosition(i + 1);
            inMemoryFallback.add(img);
        }

        try {
            long count = galleryImageRepository.count();
            if (count == 0) {
                List<GalleryImage> dbImages = new ArrayList<>();
                for (int i = 0; i < defaultUrls.length; i++) {
                    GalleryImage img = new GalleryImage(defaultUrls[i], defaultCategories[i], defaultTitles[i], baseTime - (i * 1000));
                    img.setShowcasePosition(i + 1);
                    dbImages.add(img);
                }
                galleryImageRepository.saveAll(dbImages);
                System.out.println("Initialized MongoDB with " + defaultUrls.length + " default gallery images.");
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize MongoDB gallery images. Using in-memory fallback. Error: " + e.getMessage());
            useFallback = true;
        }
    }

    public List<GalleryImage> getAllGalleryImages() {
        if (useFallback) {
            return inMemoryFallback;
        }
        try {
            List<GalleryImage> images = galleryImageRepository.findAllByOrderByCreatedAtDesc();
            if (images.isEmpty()) {
                return inMemoryFallback;
              }
            return images;
        } catch (Exception e) {
            System.err.println("MongoDB connection failed! Falling back to in-memory gallery images. Error: " + e.getMessage());
            useFallback = true;
            return inMemoryFallback;
        }
    }

    public GalleryImage addGalleryImage(@NonNull GalleryImage image) {
        if (image.getCreatedAt() == 0) {
            image.setCreatedAt(System.currentTimeMillis());
        }
        if (useFallback) {
            image.setId("fallback-gallery-id-" + (inMemoryFallback.size() + 1));
            inMemoryFallback.add(0, image); // Add to beginning (newest first)
            return image;
        }
        try {
            return galleryImageRepository.save(image);
        } catch (Exception e) {
            System.err.println("MongoDB connection failed during save! Falling back to in-memory. Error: " + e.getMessage());
            useFallback = true;
            image.setId("fallback-gallery-id-" + (inMemoryFallback.size() + 1));
            inMemoryFallback.add(0, image);
            return image;
        }
    }

    public void deleteGalleryImage(@NonNull String id) {
        if (useFallback) {
            inMemoryFallback.removeIf(img -> id.equals(img.getId()));
            return;
        }
        try {
            galleryImageRepository.deleteById(id);
        } catch (Exception e) {
            System.err.println("MongoDB connection failed during delete! Falling back to in-memory. Error: " + e.getMessage());
            useFallback = true;
            inMemoryFallback.removeIf(img -> id.equals(img.getId()));
        }
    }

    public GalleryImage updateGalleryImage(@NonNull String id, @NonNull GalleryImage updatedImage) {
        if (useFallback) {
            for (int i = 0; i < inMemoryFallback.size(); i++) {
                GalleryImage img = inMemoryFallback.get(i);
                if (id.equals(img.getId())) {
                    img.setImageUrl(updatedImage.getImageUrl());
                    img.setCategory(updatedImage.getCategory());
                    img.setTitle(updatedImage.getTitle());
                    img.setShowcasePosition(updatedImage.getShowcasePosition());
                    img.setServiceType(updatedImage.getServiceType());
                    img.setServicePosition(updatedImage.getServicePosition());
                    return img;
                }
            }
            return null;
        }
        try {
            return galleryImageRepository.findById(id).map(existing -> {
                existing.setImageUrl(updatedImage.getImageUrl());
                existing.setCategory(updatedImage.getCategory());
                existing.setTitle(updatedImage.getTitle());
                existing.setShowcasePosition(updatedImage.getShowcasePosition());
                existing.setServiceType(updatedImage.getServiceType());
                existing.setServicePosition(updatedImage.getServicePosition());
                return galleryImageRepository.save(existing);
            }).orElse(null);
        } catch (Exception e) {
            System.err.println("MongoDB connection failed during update! Falling back to in-memory. Error: " + e.getMessage());
            useFallback = true;
            for (int i = 0; i < inMemoryFallback.size(); i++) {
                GalleryImage img = inMemoryFallback.get(i);
                if (id.equals(img.getId())) {
                    img.setImageUrl(updatedImage.getImageUrl());
                    img.setCategory(updatedImage.getCategory());
                    img.setTitle(updatedImage.getTitle());
                    img.setShowcasePosition(updatedImage.getShowcasePosition());
                    img.setServiceType(updatedImage.getServiceType());
                    img.setServicePosition(updatedImage.getServicePosition());
                    return img;
                }
            }
            return null;
        }
    }
}
