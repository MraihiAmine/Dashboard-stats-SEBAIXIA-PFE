package com.example.productapi.config;

import com.example.productapi.model.Product;
import com.example.productapi.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class ProductDataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no products exist
        if (productRepository.count() == 0) {
            initializeProductData();
        }
    }

    private void initializeProductData() {
        List<Product> products = Arrays.asList(
            // Kitchen Products
            createProduct("Kitchen Cabinet - Oak", 25, 450.00, 380.00, "KC001"),
            createProduct("Kitchen Sink - Stainless Steel", 15, 280.00, 220.00, "KS002"),
            createProduct("Kitchen Faucet - Chrome", 30, 180.00, 140.00, "KF003"),
            createProduct("Kitchen Countertop - Granite", 8, 1200.00, 950.00, "KC004"),
            createProduct("Kitchen Island - White", 12, 650.00, 520.00, "KI005"),
            createProduct("Kitchen Drawer Organizer", 45, 35.00, 25.00, "KDO006"),
            createProduct("Kitchen Backsplash - Tile", 20, 85.00, 65.00, "KB007"),
            createProduct("Kitchen Lighting - LED", 18, 120.00, 90.00, "KL008"),
            createProduct("Kitchen Appliances Set", 5, 2500.00, 2000.00, "KAS009"),
            createProduct("Kitchen Storage Cabinet", 22, 320.00, 260.00, "KSC010"),

            // Bathroom Products
            createProduct("Bathroom Vanity - Modern", 18, 420.00, 340.00, "BV011"),
            createProduct("Bathroom Mirror - LED", 25, 150.00, 120.00, "BM012"),
            createProduct("Bathroom Faucet - Gold", 20, 220.00, 180.00, "BF013"),
            createProduct("Bathroom Shower Head", 30, 95.00, 75.00, "BSH014"),
            createProduct("Bathroom Towel Rack", 35, 45.00, 35.00, "BTR015"),
            createProduct("Bathroom Storage Cabinet", 15, 280.00, 230.00, "BSC016"),
            createProduct("Bathroom Floor Tile", 40, 65.00, 50.00, "BFT017"),
            createProduct("Bathroom Wall Tile", 35, 55.00, 42.00, "BWT018"),
            createProduct("Bathroom Lighting Fixture", 22, 110.00, 85.00, "BLF019"),
            createProduct("Bathroom Accessories Set", 28, 75.00, 60.00, "BAS020"),

            // Garden Products
            createProduct("Garden Shed - Wooden", 8, 850.00, 680.00, "GS021"),
            createProduct("Garden Furniture Set", 12, 650.00, 520.00, "GFS022"),
            createProduct("Garden Planters - Ceramic", 25, 45.00, 35.00, "GPC023"),
            createProduct("Garden Tools Set", 30, 85.00, 65.00, "GTS024"),
            createProduct("Garden Lighting - Solar", 20, 120.00, 95.00, "GLS025"),
            createProduct("Garden Irrigation System", 10, 350.00, 280.00, "GIS026"),
            createProduct("Garden Fence - Metal", 15, 280.00, 220.00, "GFM027"),
            createProduct("Garden Soil - Premium", 50, 25.00, 18.00, "GSP028"),
            createProduct("Garden Seeds - Organic", 60, 15.00, 12.00, "GSO029"),
            createProduct("Garden Compost Bin", 18, 95.00, 75.00, "GCB030"),

            // Low Stock Products
            createProduct("Rare Kitchen Knife Set", 3, 180.00, 140.00, "RKKS031"),
            createProduct("Limited Edition Bath Mat", 2, 65.00, 50.00, "LEBM032"),
            createProduct("Premium Garden Hose", 4, 120.00, 95.00, "PGH033"),
            createProduct("Designer Kitchen Scale", 1, 85.00, 65.00, "DKKS034"),
            createProduct("Luxury Bath Towel Set", 5, 95.00, 75.00, "LBTS035"),

            // Out of Stock Products
            createProduct("Smart Kitchen Assistant", 0, 350.00, 280.00, "SKA036"),
            createProduct("Heated Bathroom Mirror", 0, 280.00, 220.00, "HBM037"),
            createProduct("Automatic Garden Watering", 0, 450.00, 360.00, "AGW038"),
            createProduct("Kitchen Wine Fridge", 0, 850.00, 680.00, "KWF039"),
            createProduct("Bathroom Steam Shower", 0, 1200.00, 950.00, "BSS040")
        );

        productRepository.saveAll(products);
        System.out.println("Product data initialized with " + products.size() + " products");
    }

    private Product createProduct(String productName, int quantity, double totalPrice, double totalPriceCharges, String artCode) {
        Product product = new Product();
        product.setProductName(productName);
        product.setQuantity(quantity);
        product.setTotalPrice((float) totalPrice);
        product.setTotalPriceCharges((float) totalPriceCharges);
        product.setArtCode(artCode);
        return product;
    }
} 