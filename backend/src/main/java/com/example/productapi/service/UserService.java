package com.example.productapi.service;

import com.example.productapi.model.User;
import com.example.productapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    // Get user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Create new user
    public User createUser(User user) {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }
        
        // Set creation time
        user.setCreatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    // Update user
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("Email already exists: " + userDetails.getEmail());
        }
        
        // Update fields
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setStatus(userDetails.getStatus());
        
        return userRepository.save(user);
    }
    
    // Delete user
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        userRepository.delete(user);
    }
    
    // Search users
    public List<User> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllUsers();
        }
        return userRepository.searchUsers(query.trim());
    }
    
    // Get users by role
    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }
    
    // Get users by status
    public List<User> getUsersByStatus(User.UserStatus status) {
        return userRepository.findByStatus(status);
    }
    
    // Get user statistics
    public Map<String, Long> getUserStatistics() {
        long total = userRepository.count();
        long active = userRepository.countByStatus(User.UserStatus.ACTIVE);
        long inactive = userRepository.countByStatus(User.UserStatus.INACTIVE);
        long pending = userRepository.countByStatus(User.UserStatus.PENDING);
        
        return Map.of(
            "total", total,
            "active", active,
            "inactive", inactive,
            "pending", pending
        );
    }
    
    // Update last login
    public void updateLastLogin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }
    
    // Get inactive users (haven't logged in for 30 days)
    public List<User> getInactiveUsers() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return userRepository.findInactiveUsers(thirtyDaysAgo);
    }
    
    // Get recently created users (last 7 days)
    public List<User> getRecentlyCreatedUsers() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return userRepository.findByCreatedAtAfter(sevenDaysAgo);
    }
} 