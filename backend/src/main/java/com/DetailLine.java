package com.example.productapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "detail_lines")
public class DetailLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "detail_id")
    @NotNull(message = "Detail cannot be null")
    private Detail detail;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @PositiveOrZero(message = "Amount must be zero or positive")
    private double amount;
    
    // Constructors
    public DetailLine() {
    }
    
    public DetailLine(String description, double amount) {
        this.description = description;
        this.amount = amount;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Detail getDetail() {
        return detail;
    }
    
    public void setDetail(Detail detail) {
        this.detail = detail;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public double getAmount() {
        return amount;
    }
    
    public void setAmount(double amount) {
        this.amount = amount;
    }
    
    @Override
    public String toString() {
        return "DetailLine{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                '}';
    }
}
