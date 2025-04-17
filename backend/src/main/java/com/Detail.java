package com.example.productapi.model;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Detail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @PositiveOrZero(message = "Unit price must be zero or positive")
    private double unitPrice;
    
    @OneToMany(mappedBy = "detail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetailLine> detailLines;
    
    @Min(value = 0, message = "Quantity cannot be negative")
    private int quantity;
    
    @PositiveOrZero(message = "Total price must be zero or positive")
    private double totalPrice;
    
    @NotBlank(message = "Designation is required")
    private String designation;
    
    @NotBlank(message = "CP/CPE is required")
    private String cpCpe;
    
    @NotNull(message = "User type is required")
    @Enumerated(EnumType.STRING)
    private UserType userType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @NotNull(message = "Product is required")
    private DecompositionComercial decompositionComercial;

    // Constructors
    public Detail() {
        this.createdAt = LocalDateTime.now();
    }

    public Detail(double unitPrice, List<DetailLine> detailLines, int quantity, double totalPrice, 
                 String designation, String cpCpe, UserType userType) {
        this.unitPrice = unitPrice;
        this.detailLines = detailLines;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.designation = designation;
        this.cpCpe = cpCpe;
        this.userType = userType;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public List<DetailLine> getDetailLines() {
        return detailLines;
    }

    public void setDetailLines(List<DetailLine> detailLines) {
        this.detailLines = detailLines;
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

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getCpCpe() {
        return cpCpe;
    }

    public void setCpCpe(String cpCpe) {
        this.cpCpe = cpCpe;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public DecompositionComercial getDecompositionComercial() {
        return decompositionComercial;
    }

    public void setDecompositionComercial(DecompositionComercial product) {
        this.decompositionComercial = product;
    }

    @Override
    public String toString() {
        return "Detail{" +
                "unitPrice=" + unitPrice +
                ", detailLines=" + detailLines +
                ", quantity=" + quantity +
                ", totalPrice=" + totalPrice +
                ", designation='" + designation + '\'' +
                ", cpCpe='" + cpCpe + '\'' +
                ", userType=" + userType +
                ", createdAt=" + createdAt +
                ", product=" + decompositionComercial +
                '}';
    }
}

