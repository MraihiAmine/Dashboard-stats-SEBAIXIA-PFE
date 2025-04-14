package com.example.productapi.model;

import jakarta.persistence.*;

@Entity
public class Detail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @SuppressWarnings("unused")
    private float unitPrice;
    private int quantity;
    private float totalPrice;
    private String designation;

   
    @ManyToOne
    @JoinColumn(name = "product_id") 
    private Product product;

    
}
