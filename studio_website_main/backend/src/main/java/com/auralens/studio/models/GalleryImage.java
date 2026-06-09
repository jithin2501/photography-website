package com.auralens.studio.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "gallery_images")
public class GalleryImage {

    @Id
    private String id;
    private String imageUrl;
    private String category; // Maternity, Newborn, Milestone, Family, Couples, Events
    private String title;
    private long createdAt;
    private int showcasePosition = 0; // 0 = not featured, 1-12 = home page grid slots
    private String serviceType = "none"; // none, maternity, newborn, milestone, classes
    private int servicePosition = 0; // 0 = not featured, 1-4 = service page slots

    public GalleryImage() {}

    public GalleryImage(String imageUrl, String category, String title, long createdAt) {
        this.imageUrl = imageUrl;
        this.category = category;
        this.title = title;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    public int getShowcasePosition() {
        return showcasePosition;
    }

    public void setShowcasePosition(int showcasePosition) {
        this.showcasePosition = showcasePosition;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public int getServicePosition() {
        return servicePosition;
    }

    public void setServicePosition(int servicePosition) {
        this.servicePosition = servicePosition;
    }
}
