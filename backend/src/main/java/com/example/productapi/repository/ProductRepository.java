package com.example.productapi.repository;

import com.example.productapi.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Search products by name
    List<Product> findByProductNameContainingIgnoreCase(String productName);
    
    // Find products with low stock (quantity <= 10 and > 0)
    List<Product> findByQuantityLessThanEqualAndQuantityGreaterThan(int maxQuantity, int minQuantity);
    
    // Find out of stock products (quantity = 0)
    List<Product> findByQuantity(int quantity);
    
    // Get products by category (if you add category field later)
    // List<Product> findByCategory(String category);
    
    // Get total revenue
    @Query("SELECT SUM(p.totalPrice) FROM Product p")
    Double getTotalRevenue();
    
    // Get total charges
    @Query("SELECT SUM(p.totalPriceCharges) FROM Product p")
    Double getTotalCharges();
    
    // Get total quantity
    @Query("SELECT SUM(p.quantity) FROM Product p")
    Integer getTotalQuantity();
    
    // Get average price
    @Query("SELECT AVG(p.totalPrice) FROM Product p")
    Double getAveragePrice();
}
