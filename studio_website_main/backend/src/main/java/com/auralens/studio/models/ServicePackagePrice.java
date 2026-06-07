package com.auralens.studio.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "service_package_prices")
public class ServicePackagePrice {

    @Id
    private String id; // e.g. "maternity", "newborn", "milestone", "classes"
    private String serviceName;
    private String basicPrice;
    private String standardPrice;
    private String premiumPrice;

    public ServicePackagePrice() {}

    public ServicePackagePrice(String id, String serviceName, String basicPrice, String standardPrice, String premiumPrice) {
        this.id = id;
        this.serviceName = serviceName;
        this.basicPrice = basicPrice;
        this.standardPrice = standardPrice;
        this.premiumPrice = premiumPrice;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getBasicPrice() {
        return basicPrice;
    }

    public void setBasicPrice(String basicPrice) {
        this.basicPrice = basicPrice;
    }

    public String getStandardPrice() {
        return standardPrice;
    }

    public void setStandardPrice(String standardPrice) {
        this.standardPrice = standardPrice;
    }

    public String getPremiumPrice() {
        return premiumPrice;
    }

    public void setPremiumPrice(String premiumPrice) {
        this.premiumPrice = premiumPrice;
    }
}
