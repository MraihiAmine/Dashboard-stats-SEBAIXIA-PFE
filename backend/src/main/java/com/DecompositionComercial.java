package com.example.productapi.model;

import java.util.List;

import org.springframework.data.annotation.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.Column;

@Entity
public class DecompositionComercial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @Column(length = 1000)
    private String description;

    private int quantity;
    private double totalPrice;
    private double totalPriceLowCharges;
    private String artCode;
    private List<Detail> details;
    private String productName;

    // Constructors
    public DecompositionComercial() {
    }

    public DecompositionComercial(String name, String category, String description) {
        this.name = name;
        this.category = category;
        this.description = description;
    }

    public DecompositionComercial(int quantity, double totalPrice, double totalPriceLowCharges, String artCode,
            List<Detail> details, String productName) {
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.totalPriceLowCharges = totalPriceLowCharges;
        this.artCode = artCode;
        this.details = details;
        this.productName = productName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public double getTotalPriceLowCharges() {
        return totalPriceLowCharges;
    }

    public void setTotalPriceLowCharges(double totalPriceLowCharges) {
        this.totalPriceLowCharges = totalPriceLowCharges;
    }

    public String getArtCode() {
        return artCode;
    }

    public void setArtCode(String artCode) {
        this.artCode = artCode;
    }

    public List<Detail> getDetails() {
        return details;
    }

    public void setDetails(List<Detail> details) {
        this.details = details;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    @Override
    public String toString() {
        return "DecompositionComercial{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                ", quantity=" + quantity +
                ", totalPrice=" + totalPrice +
                ", totalPriceLowCharges=" + totalPriceLowCharges +
                ", artCode='" + artCode + '\'' +
                ", details=" + details +
                ", productName='" + productName + '\'' +
                '}';
    }
}