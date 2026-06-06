package com.auralens.studio.controllers;

import com.auralens.studio.models.WheelImage;
import com.auralens.studio.services.WheelImageService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wheel-images")
public class WheelImageController {

    private final WheelImageService wheelImageService;
    private final Cloudinary cloudinary;

    @Autowired
    public WheelImageController(WheelImageService wheelImageService, Cloudinary cloudinary) {
        this.wheelImageService = wheelImageService;
        this.cloudinary = cloudinary;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getWheelImages() {
        List<WheelImage> images = wheelImageService.getAllWheelImages();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", images);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateWheelImage(@RequestBody WheelImage updatedImage) {
        // Validation: slot must be between 1 and 9
        if (updatedImage.getSlot() < 1 || updatedImage.getSlot() > 9) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("error", "Slot index must be between 1 and 9.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        WheelImage saved = wheelImageService.updateWheelImage(updatedImage);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String secureUrl = (String) uploadResult.get("secure_url");
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("url", secureUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
