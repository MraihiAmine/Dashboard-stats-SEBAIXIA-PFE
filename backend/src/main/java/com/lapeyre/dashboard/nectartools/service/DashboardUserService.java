package com.lapeyre.dashboard.nectartools.service;

import com.lapeyre.dashboard.nectartools.model.DashboardUser;
import com.lapeyre.dashboard.nectartools.repository.DashboardUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class DashboardUserService {
    
    @Autowired
    private DashboardUserRepository dashboardUserRepository;
    
    // Get all users
    public List<DashboardUser> getAllUsers() {
        return dashboardUserRepository.findAll();
    }
    
    // Get user by ID
    public Optional<DashboardUser> getUserById(Long id) {
        return dashboardUserRepository.findById(id);
    }
    
    // Get user by email
    public Optional<DashboardUser> getUserByEmail(String email) {
        return dashboardUserRepository.findByEmail(email);
    }
    
    // Create new user
    public DashboardUser createUser(DashboardUser user) {
        // Check if email already exists
        if (dashboardUserRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }
        
        // Set creation time
        user.setCreatedAt(LocalDateTime.now());
        
        return dashboardUserRepository.save(user);
    }
    
    // Update user
    public DashboardUser updateUser(Long id, DashboardUser userDetails) {
        DashboardUser user = dashboardUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            dashboardUserRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("Email already exists: " + userDetails.getEmail());
        }
        
        // Update fields
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setStatus(userDetails.getStatus());
        
        return dashboardUserRepository.save(user);
    }
    
    // Delete user
    public void deleteUser(Long id) {
        DashboardUser user = dashboardUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        dashboardUserRepository.delete(user);
    }
    
    // Search users
    public List<DashboardUser> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllUsers();
        }
        return dashboardUserRepository.searchUsers(query.trim());
    }
    
    // Get users by role
    public List<DashboardUser> getUsersByRole(DashboardUser.UserRole role) {
        return dashboardUserRepository.findByRole(role);
    }
    
    // Get users by status
    public List<DashboardUser> getUsersByStatus(DashboardUser.UserStatus status) {
        return dashboardUserRepository.findByStatus(status);
    }
    
    // Get user statistics
    public Map<String, Long> getUserStatistics() {
        long total = dashboardUserRepository.count();
        long active = dashboardUserRepository.countByStatus(DashboardUser.UserStatus.ACTIVE);
        long inactive = dashboardUserRepository.countByStatus(DashboardUser.UserStatus.INACTIVE);
        long pending = dashboardUserRepository.countByStatus(DashboardUser.UserStatus.PENDING);
        
        return Map.of(
            "total", total,
            "active", active,
            "inactive", inactive,
            "pending", pending
        );
    }
    
    // Update last login
    public void updateLastLogin(Long userId) {
        DashboardUser user = dashboardUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setLastLogin(LocalDateTime.now());
        dashboardUserRepository.save(user);
    }
    
    // Get inactive users (haven't logged in for 30 days)
    public List<DashboardUser> getInactiveUsers() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return dashboardUserRepository.findInactiveUsers(thirtyDaysAgo);
    }
    
    // Get recently created users (last 7 days)
    public List<DashboardUser> getRecentlyCreatedUsers() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return dashboardUserRepository.findByCreatedAtAfter(sevenDaysAgo);
    }
    
    public Map<String, Long> getUserRoleDistribution() {
        List<DashboardUser> users = dashboardUserRepository.findAll();
        Map<String, Long> roleCounts = new java.util.HashMap<>();
        for (DashboardUser user : users) {
            String role = user.getRole() != null ? user.getRole().name() : "UNKNOWN";
            roleCounts.put(role, roleCounts.getOrDefault(role, 0L) + 1);
        }
        return roleCounts;
    }
    
    public List<DashboardUser> getRecentLogins(int limit) {
        return dashboardUserRepository.findTopRecentLogins(PageRequest.of(0, limit));
    }

    public List<DashboardUser> getRecentRegistrations(int limit) {
        return dashboardUserRepository.findTopRecentRegistrations(PageRequest.of(0, limit));
    }
} 