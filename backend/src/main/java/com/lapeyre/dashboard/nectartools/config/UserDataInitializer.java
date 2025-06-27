package com.lapeyre.dashboard.nectartools.config;

import com.lapeyre.dashboard.nectartools.model.User;
import com.lapeyre.dashboard.nectartools.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserDataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no users exist
        if (userRepository.count() == 0) {
            initializeSampleUsers();
        }
    }
    
    private void initializeSampleUsers() {
        // Create sample users with passwords
        User user1 = new User("John Doe", "johndoe", "john.doe@example.com", 
            passwordEncoder.encode("password123"), User.UserRole.ADMIN, User.UserStatus.ACTIVE);
        user1.setCreatedAt(LocalDateTime.now().minusDays(5));
        user1.setLastLogin(LocalDateTime.now().minusHours(2));
        
        User user2 = new User("Jane Smith", "janesmith", "jane.smith@example.com", 
            passwordEncoder.encode("password123"), User.UserRole.USER, User.UserStatus.ACTIVE);
        user2.setCreatedAt(LocalDateTime.now().minusDays(3));
        user2.setLastLogin(LocalDateTime.now().minusDays(1));
        
        User user3 = new User("Bob Johnson", "bobjohnson", "bob.johnson@example.com", 
            passwordEncoder.encode("password123"), User.UserRole.VIEWER, User.UserStatus.ACTIVE);
        user3.setCreatedAt(LocalDateTime.now().minusDays(10));
        user3.setLastLogin(LocalDateTime.now().minusDays(5));
        
        User user4 = new User("Alice Brown", "alicebrown", "alice.brown@example.com", 
            passwordEncoder.encode("password123"), User.UserRole.USER, User.UserStatus.INACTIVE);
        user4.setCreatedAt(LocalDateTime.now().minusDays(15));
        user4.setLastLogin(LocalDateTime.now().minusDays(20));
        
        User user5 = new User("Charlie Wilson", "charliewilson", "charlie.wilson@example.com", 
            passwordEncoder.encode("password123"), User.UserRole.VIEWER, User.UserStatus.PENDING);
        user5.setCreatedAt(LocalDateTime.now().minusDays(1));
        
        User user6 = new User("Diana Davis", "dianadavis", "diana.davis@example.com", 
            passwordEncoder.encode("password123"), User.UserRole.ADMIN, User.UserStatus.ACTIVE);
        user6.setCreatedAt(LocalDateTime.now().minusDays(7));
        user6.setLastLogin(LocalDateTime.now().minusHours(1));
        
        User user7 = new User("Edward Miller", "edwardmiller", "edward.miller@example.com", 
            passwordEncoder.encode("password123"), User.UserRole.USER, User.UserStatus.ACTIVE);
        user7.setCreatedAt(LocalDateTime.now().minusDays(12));
        user7.setLastLogin(LocalDateTime.now().minusDays(2));
        
        User user8 = new User("Fiona Garcia", "fionagarcia", "fiona.garcia@example.com", 
            passwordEncoder.encode("password123"), User.UserRole.VIEWER, User.UserStatus.INACTIVE);
        user8.setCreatedAt(LocalDateTime.now().minusDays(20));
        user8.setLastLogin(LocalDateTime.now().minusDays(25));
        
        // Add default user for Aroua
        User aroua = new User("Aroua Hkimi", "aroua", "arouahkimi@gmail.com",
            passwordEncoder.encode("password123"), User.UserRole.ADMIN, User.UserStatus.ACTIVE);
        aroua.setCreatedAt(LocalDateTime.now());
        aroua.setLastLogin(LocalDateTime.now());
        System.out.println("[DEBUG] Encoded password for arouahkimi@gmail.com: " + aroua.getPassword());
        
        // Save all users
        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(user4);
        userRepository.save(user5);
        userRepository.save(user6);
        userRepository.save(user7);
        userRepository.save(user8);
        userRepository.save(aroua);
        
        System.out.println("Sample users initialized successfully!");
    }
} 