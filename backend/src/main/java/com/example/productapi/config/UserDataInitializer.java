package com.example.productapi.config;

import com.example.productapi.model.User;
import com.example.productapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserDataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no users exist
        if (userRepository.count() == 0) {
            initializeUsers();
        }
    }
    
    private void initializeUsers() {
        // Create sample users
        User user1 = new User("Sahar Belhaj Amor", "sahar.belhajamor@gmail.com", User.UserRole.ADMIN, User.UserStatus.ACTIVE);
        user1.setCreatedAt(LocalDateTime.now().minusDays(30));
        user1.setLastLogin(LocalDateTime.now());
        
        User user2 = new User("Alaa Belhaj Amor", "alaa.belhajamor@gmail.com", User.UserRole.USER, User.UserStatus.INACTIVE);
        user2.setCreatedAt(LocalDateTime.now().minusDays(25));
        user2.setLastLogin(LocalDateTime.now().minusDays(5));
        
        User user3 = new User("Najwa Bela", "najwa.bela@gmail.com", User.UserRole.USER, User.UserStatus.ACTIVE);
        user3.setCreatedAt(LocalDateTime.now().minusDays(20));
        user3.setLastLogin(LocalDateTime.now());
        
        User user4 = new User("Hadyl Rbiha", "hadyl.rbiha@gmail.com", User.UserRole.VIEWER, User.UserStatus.PENDING);
        user4.setCreatedAt(LocalDateTime.now().minusDays(15));
        user4.setLastLogin(null);
        
        User user5 = new User("Amina Mraihi", "amina.mraihi@gmail.com", User.UserRole.USER, User.UserStatus.ACTIVE);
        user5.setCreatedAt(LocalDateTime.now().minusDays(10));
        user5.setLastLogin(LocalDateTime.now());
        
        User user6 = new User("Ala Ben Samir", "ala.bensamir@gmail.com", User.UserRole.ADMIN, User.UserStatus.ACTIVE);
        user6.setCreatedAt(LocalDateTime.now().minusDays(5));
        user6.setLastLogin(LocalDateTime.now());
        
        // Save all users
        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(user4);
        userRepository.save(user5);
        userRepository.save(user6);
        
        System.out.println("Sample users initialized successfully!");
    }
} 