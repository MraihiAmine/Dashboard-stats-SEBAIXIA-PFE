package com.example.productapi.repository;

import com.example.productapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find by email
    Optional<User> findByEmail(String email);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find by role
    List<User> findByRole(User.UserRole role);
    
    // Find by status
    List<User> findByStatus(User.UserStatus status);
    
    // Search users by name, email, role, or status
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.role) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.status) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);
    
    // Count by status
    long countByStatus(User.UserStatus status);
    
    // Find users created after a specific date
    List<User> findByCreatedAtAfter(java.time.LocalDateTime date);
    
    // Find users who haven't logged in recently
    @Query("SELECT u FROM User u WHERE u.lastLogin IS NULL OR u.lastLogin < :date")
    List<User> findInactiveUsers(@Param("date") java.time.LocalDateTime date);
} 