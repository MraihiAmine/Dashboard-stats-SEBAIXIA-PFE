package com.example.productapi.controller;

import com.example.productapi.model.Product;
import com.example.productapi.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testEndpoint() {
        return ResponseEntity.ok(Map.of("message", "Product API is working!"));
    }

    // Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        Optional<Product> product = productService.getProduct(id);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // Create new product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    // Update product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return ResponseEntity.ok(productService.updateProduct(product));
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Product Analytics Endpoints

    // Get inventory status
    @GetMapping("/analytics/inventory-status")
    public ResponseEntity<Map<String, Object>> getInventoryStatus() {
        return ResponseEntity.ok(productService.getInventoryStatus());
    }

    // Get sales trends
    @GetMapping("/analytics/sales-trends")
    public ResponseEntity<Map<String, Object>> getSalesTrends() {
        return ResponseEntity.ok(productService.getSalesTrends());
    }

    // Get category performance
    @GetMapping("/analytics/category-performance")
    public ResponseEntity<Map<String, Object>> getCategoryPerformance() {
        return ResponseEntity.ok(productService.getCategoryPerformance());
    }

    // Get product lifecycle analysis
    @GetMapping("/analytics/lifecycle")
    public ResponseEntity<Map<String, Object>> getProductLifecycle() {
        return ResponseEntity.ok(productService.getProductLifecycle());
    }

    // Get profitability matrix
    @GetMapping("/analytics/profitability")
    public ResponseEntity<Map<String, Object>> getProfitabilityMatrix() {
        return ResponseEntity.ok(productService.getProfitabilityMatrix());
    }

    // Get seasonality analysis
    @GetMapping("/analytics/seasonality")
    public ResponseEntity<Map<String, Object>> getSeasonalityAnalysis() {
        return ResponseEntity.ok(productService.getSeasonalityAnalysis());
    }

    // Get product statistics
    @GetMapping("/analytics/statistics")
    public ResponseEntity<Map<String, Object>> getProductStatistics() {
        return ResponseEntity.ok(productService.getProductStatistics());
    }

    // Search products
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    // Get low stock products
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }

    // Get out of stock products
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<Product>> getOutOfStockProducts() {
        return ResponseEntity.ok(productService.getOutOfStockProducts());
    }
}