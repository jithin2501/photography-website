package com.auralens.studio.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wheel_images")
public class WheelImage {

    @Id
    private String id;
    private int slot; // 1 to 10
    private String imageUrl;
    private String title;
    private String description;

    public WheelImage() {}

    public WheelImage(int slot, String imageUrl, String title, String description) {
        this.slot = slot;
        this.imageUrl = imageUrl;
        this.title = title;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getSlot() {
        return slot;
    }

    public void setSlot(int slot) {
        this.slot = slot;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
