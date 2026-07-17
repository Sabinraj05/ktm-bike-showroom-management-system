package com.ktm.showroom.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "bikes")
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(name = "engine_size", nullable = false)
    private String engineSize;

    @Column(nullable = false)
    private String power;

    @Column(nullable = false)
    private Double price;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    private String displacement;
    private String transmission;
    private String cooling;

    @Column(name = "fuel_capacity")
    private String fuelCapacity;

    private String weight;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", insertable = false, updatable = false)
    private Date createdAt;

    // Default Constructor
    public Bike() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getEngineSize() { return engineSize; }
    public void setEngineSize(String engineSize) { this.engineSize = engineSize; }

    public String getPower() { return power; }
    public void setPower(String power) { this.power = power; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDisplacement() { return displacement; }
    public void setDisplacement(String displacement) { this.displacement = displacement; }

    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }

    public String getCooling() { return cooling; }
    public void setCooling(String cooling) { this.cooling = cooling; }

    public String getFuelCapacity() { return fuelCapacity; }
    public void setFuelCapacity(String fuelCapacity) { this.fuelCapacity = fuelCapacity; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
