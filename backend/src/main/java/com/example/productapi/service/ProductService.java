package com.example.productapi.service;

import com.example.productapi.model.Product;
import com.example.productapi.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Basic CRUD operations
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> getProduct(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product updateProduct(Product product) {
        if (productRepository.existsById(product.getId())) {
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found");
    }

    public void deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
        } else {
            throw new RuntimeException("Product not found");
        }
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByProductNameContainingIgnoreCase(query);
    }

    // Analytics methods
    public Map<String, Object> getInventoryStatus() {
        List<Product> products = productRepository.findAll();
        
        long inStock = products.stream().filter(p -> p.getQuantity() > 10).count();
        long lowStock = products.stream().filter(p -> p.getQuantity() <= 10 && p.getQuantity() > 0).count();
        long outOfStock = products.stream().filter(p -> p.getQuantity() == 0).count();
        
        Map<String, Object> result = new HashMap<>();
        result.put("labels", Arrays.asList("In Stock", "Low Stock", "Out of Stock"));
        result.put("data", Arrays.asList(inStock, lowStock, outOfStock));
        result.put("colors", Arrays.asList("#2ecc71", "#f39c12", "#e74c3c"));
        result.put("summary", Map.of(
            "totalProducts", products.size(),
            "inStock", inStock,
            "lowStock", lowStock,
            "outOfStock", outOfStock
        ));
        
        return result;
    }

    public Map<String, Object> getSalesTrends() {
        // Mock data for sales trends - in real implementation, this would come from sales/orders data
        Map<String, Object> result = new HashMap<>();
        result.put("labels", Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun"));
        result.put("datasets", Arrays.asList(
            Map.of(
                "label", "Kitchen Products",
                "data", Arrays.asList(45000, 52000, 48000, 55000, 60000, 58000),
                "borderColor", "#3498db",
                "backgroundColor", "rgba(52, 152, 219, 0.1)"
            ),
            Map.of(
                "label", "Bathroom Products",
                "data", Arrays.asList(38000, 42000, 40000, 45000, 48000, 46000),
                "borderColor", "#e74c3c",
                "backgroundColor", "rgba(231, 76, 60, 0.1)"
            ),
            Map.of(
                "label", "Garden Products",
                "data", Arrays.asList(25000, 28000, 30000, 32000, 35000, 33000),
                "borderColor", "#2ecc71",
                "backgroundColor", "rgba(46, 204, 113, 0.1)"
            )
        ));
        return result;
    }

    public Map<String, Object> getCategoryPerformance() {
        // Mock data for category performance
        Map<String, Object> result = new HashMap<>();
        result.put("datasets", Arrays.asList(
            Map.of(
                "label", "Kitchen",
                "data", Arrays.asList(
                    Map.of("x", 1250000, "y", 15.2),
                    Map.of("x", 980000, "y", 12.8),
                    Map.of("x", 850000, "y", 8.5),
                    Map.of("x", 720000, "y", 6.2),
                    Map.of("x", 650000, "y", 4.8)
                ),
                "backgroundColor", "#3498db"
            ),
            Map.of(
                "label", "Bathroom",
                "data", Arrays.asList(
                    Map.of("x", 980000, "y", 12.8),
                    Map.of("x", 850000, "y", 10.5),
                    Map.of("x", 720000, "y", 8.2),
                    Map.of("x", 650000, "y", 6.8),
                    Map.of("x", 580000, "y", 5.2)
                ),
                "backgroundColor", "#e74c3c"
            )
        ));
        return result;
    }

    public Map<String, Object> getProductLifecycle() {
        // Mock data for product lifecycle
        Map<String, Object> result = new HashMap<>();
        result.put("labels", Arrays.asList("Introduction", "Growth", "Maturity", "Decline", "Innovation", "Market Share"));
        result.put("datasets", Arrays.asList(
            Map.of(
                "label", "Current Products",
                "data", Arrays.asList(85, 92, 78, 45, 88, 76),
                "borderColor", "#3498db",
                "backgroundColor", "rgba(52, 152, 219, 0.2)"
            ),
            Map.of(
                "label", "Industry Average",
                "data", Arrays.asList(70, 75, 65, 40, 72, 68),
                "borderColor", "#e74c3c",
                "backgroundColor", "rgba(231, 76, 60, 0.2)"
            )
        ));
        return result;
    }

    public Map<String, Object> getProfitabilityMatrix() {
        // Mock data for profitability matrix
        Map<String, Object> result = new HashMap<>();
        result.put("datasets", Arrays.asList(
            Map.of(
                "label", "High Revenue, High Margin",
                "data", Arrays.asList(
                    Map.of("x", 1200000, "y", 35, "r", 25),
                    Map.of("x", 980000, "y", 42, "r", 20),
                    Map.of("x", 850000, "y", 38, "r", 18)
                ),
                "backgroundColor", "#2ecc71"
            ),
            Map.of(
                "label", "High Revenue, Low Margin",
                "data", Arrays.asList(
                    Map.of("x", 1500000, "y", 15, "r", 30),
                    Map.of("x", 1200000, "y", 12, "r", 28),
                    Map.of("x", 1100000, "y", 18, "r", 22)
                ),
                "backgroundColor", "#f39c12"
            ),
            Map.of(
                "label", "Low Revenue, High Margin",
                "data", Arrays.asList(
                    Map.of("x", 400000, "y", 45, "r", 15),
                    Map.of("x", 350000, "y", 52, "r", 12),
                    Map.of("x", 300000, "y", 48, "r", 10)
                ),
                "backgroundColor", "#3498db"
            ),
            Map.of(
                "label", "Low Revenue, Low Margin",
                "data", Arrays.asList(
                    Map.of("x", 200000, "y", 8, "r", 8),
                    Map.of("x", 150000, "y", 5, "r", 6),
                    Map.of("x", 100000, "y", 12, "r", 5)
                ),
                "backgroundColor", "#e74c3c"
            )
        ));
        return result;
    }

    public Map<String, Object> getSeasonalityAnalysis() {
        // Mock data for seasonality analysis
        Map<String, Object> result = new HashMap<>();
        result.put("labels", Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"));
        result.put("datasets", Arrays.asList(
            Map.of(
                "label", "Kitchen Products",
                "data", Arrays.asList(85, 78, 92, 88, 95, 98, 92, 88, 85, 90, 95, 100),
                "borderColor", "#3498db",
                "backgroundColor", "rgba(52, 152, 219, 0.1)"
            ),
            Map.of(
                "label", "Bathroom Products",
                "data", Arrays.asList(75, 70, 82, 78, 85, 88, 82, 78, 75, 80, 85, 90),
                "borderColor", "#e74c3c",
                "backgroundColor", "rgba(231, 76, 60, 0.1)"
            ),
            Map.of(
                "label", "Garden Products",
                "data", Arrays.asList(45, 40, 55, 65, 75, 85, 90, 85, 70, 60, 50, 45),
                "borderColor", "#2ecc71",
                "backgroundColor", "rgba(46, 204, 113, 0.1)"
            )
        ));
        return result;
    }

    public Map<String, Object> getProductStatistics() {
        List<Product> products = productRepository.findAll();
        
        double totalRevenue = products.stream().mapToDouble(p -> p.getTotalPrice()).sum();
        double totalCharges = products.stream().mapToDouble(p -> p.getTotalPriceCharges()).sum();
        int totalQuantity = products.stream().mapToInt(p -> p.getQuantity()).sum();
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalProducts", products.size());
        result.put("totalRevenue", totalRevenue);
        result.put("totalCharges", totalCharges);
        result.put("totalQuantity", totalQuantity);
        result.put("averagePrice", products.isEmpty() ? 0 : totalRevenue / products.size());
        result.put("lowStockCount", products.stream().filter(p -> p.getQuantity() <= 10 && p.getQuantity() > 0).count());
        result.put("outOfStockCount", products.stream().filter(p -> p.getQuantity() == 0).count());
        
        return result;
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findByQuantityLessThanEqualAndQuantityGreaterThan(10, 0);
    }

    public List<Product> getOutOfStockProducts() {
        return productRepository.findByQuantity(0);
    }
}
