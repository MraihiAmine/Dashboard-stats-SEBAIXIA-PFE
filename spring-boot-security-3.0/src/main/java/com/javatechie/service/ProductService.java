package com.javatechie.service;

import com.javatechie.dto.Product;
import com.javatechie.entity.UserInfo;
import com.javatechie.repository.UserInfoRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ProductService {

    private List<Product> productList;

    @Autowired
    private UserInfoRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void loadProductsFromDB() {
        productList = IntStream.rangeClosed(1, 100)
                .mapToObj(i -> Product.builder()
                        .productId(i)
                        .name("product " + i)
                        .qty(new Random().nextInt(10))
                        .price(new Random().nextInt(5000))
                        .build()
                ).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Product> getProducts() {
        return productList;
    }

    @Transactional(readOnly = true)
    public Product getProduct(int id) {
        return productList.stream()
                .filter(product -> product.getProductId() == id)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product " + id + " not found"));
    }

    @Transactional
    public String addUser(UserInfo userInfo) {
        if (repository.findByName(userInfo.getName()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        repository.save(userInfo);
        return "User " + userInfo.getName() + " added successfully";
    }
}
