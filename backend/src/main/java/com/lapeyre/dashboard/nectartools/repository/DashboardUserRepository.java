package com.lapeyre.dashboard.nectartools.repository;

import com.lapeyre.dashboard.nectartools.model.DashboardUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface DashboardUserRepository extends JpaRepository<DashboardUser, Long> {
    
    // Find by email
    Optional<DashboardUser> findByEmail(String email);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find by role
    List<DashboardUser> findByRole(DashboardUser.UserRole role);
    
    // Find by status
    List<DashboardUser> findByStatus(DashboardUser.UserStatus status);
    
    // Search users by name, email, role, or status
    @Query("SELECT u FROM DashboardUser u WHERE " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.role) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(u.status) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<DashboardUser> searchUsers(@Param("query") String query);
    
    // Count by status
    long countByStatus(DashboardUser.UserStatus status);
    
    // Find users created after a specific date
    List<DashboardUser> findByCreatedAtAfter(java.time.LocalDateTime date);
    
    // Find users who haven't logged in recently
    @Query("SELECT u FROM DashboardUser u WHERE u.lastLogin IS NULL OR u.lastLogin < :date")
    List<DashboardUser> findInactiveUsers(@Param("date") java.time.LocalDateTime date);

    // Find top N users by lastLogin desc
    @Query("SELECT u FROM DashboardUser u WHERE u.lastLogin IS NOT NULL ORDER BY u.lastLogin DESC")
    List<DashboardUser> findTopRecentLogins(Pageable pageable);

    // Find top N users by createdAt desc
    @Query("SELECT u FROM DashboardUser u ORDER BY u.createdAt DESC")
    List<DashboardUser> findTopRecentRegistrations(Pageable pageable);
} 