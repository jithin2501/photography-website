package com.auralens.studio.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "site_settings")
public class SiteSettings {

    @Id
    private String id = "system";
    private int happyClients = 500;
    private int photoshoots = 1000;
    private int awardsWon = 20;
    private String instagramId = "auralens_studio";
    private int clientSatisfaction = 99;

    public SiteSettings() {}

    public SiteSettings(int happyClients, int photoshoots, int awardsWon, String instagramId, int clientSatisfaction) {
        this.happyClients = happyClients;
        this.photoshoots = photoshoots;
        this.awardsWon = awardsWon;
        this.instagramId = instagramId;
        this.clientSatisfaction = clientSatisfaction;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getHappyClients() {
        return happyClients;
    }

    public void setHappyClients(int happyClients) {
        this.happyClients = happyClients;
    }

    public int getPhotoshoots() {
        return photoshoots;
    }

    public void setPhotoshoots(int photoshoots) {
        this.photoshoots = photoshoots;
    }

    public int getAwardsWon() {
        return awardsWon;
    }

    public void setAwardsWon(int awardsWon) {
        this.awardsWon = awardsWon;
    }

    public String getInstagramId() {
        return instagramId;
    }

    public void setInstagramId(String instagramId) {
        this.instagramId = instagramId;
    }

    public int getClientSatisfaction() {
        return clientSatisfaction;
    }

    public void setClientSatisfaction(int clientSatisfaction) {
        this.clientSatisfaction = clientSatisfaction;
    }
}
