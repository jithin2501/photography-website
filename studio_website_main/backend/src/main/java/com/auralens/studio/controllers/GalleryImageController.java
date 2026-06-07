package com.auralens.studio.controllers;

import com.auralens.studio.models.GalleryImage;
import com.auralens.studio.services.GalleryImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gallery-images")
public class GalleryImageController {

    private final GalleryImageService galleryImageService;

    @Autowired
    public GalleryImageController(GalleryImageService galleryImageService) {
        this.galleryImageService = galleryImageService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getGalleryImages() {
        List<GalleryImage> images = galleryImageService.getAllGalleryImages();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", images);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addGalleryImage(@RequestBody GalleryImage newImage) {
        String category = newImage.getCategory();
        if (category == null || category.trim().isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("error", "Category is required.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        GalleryImage saved = galleryImageService.addGalleryImage(newImage);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteGalleryImage(@PathVariable("id") @NonNull String id) {
        galleryImageService.deleteGalleryImage(id);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Gallery image deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
