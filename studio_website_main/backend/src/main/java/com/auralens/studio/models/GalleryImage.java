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
}
