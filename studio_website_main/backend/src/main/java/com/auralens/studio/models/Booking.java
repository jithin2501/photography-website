package com.auralens.studio.models;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String photoshootType;
    private String date;
    private String time;
    private String locationPreference;
    private String packageName;
    private String details;
    private String paymentStatus = "pending"; 
    private String paymentMethod;             
    private String paymentId;                 
    private String razorpayOrderId;           
    private String clientId;
    private List<ClientImage> clientImages = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt = LocalDateTime.now();

    public Booking() {}

    public Booking(String fullName, String email, String phone, String photoshootType, String date, String time, String locationPreference, String packageName, String details) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.photoshootType = photoshootType;
        this.date = date;
        this.time = time;
        this.locationPreference = locationPreference;
        this.packageName = packageName;
        this.details = details;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhotoshootType() {
        return photoshootType;
    }

    public void setPhotoshootType(String photoshootType) {
        this.photoshootType = photoshootType;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getLocationPreference() {
        return locationPreference;
    }

    public void setLocationPreference(String locationPreference) {
        this.locationPreference = locationPreference;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public List<ClientImage> getClientImages() {
        return clientImages;
    }

    public void setClientImages(List<ClientImage> clientImages) {
        this.clientImages = clientImages;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class ClientImage {
        private String name;
        private String url;

        public ClientImage() {}

        public ClientImage(String name, String url) {
            this.name = name;
            this.url = url;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}
