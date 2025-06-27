package com.lapeyre.dashboard.nectartools.controller;

import com.lapeyre.dashboard.nectartools.model.DashboardUser;
import com.lapeyre.dashboard.nectartools.service.DashboardUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard-users")
@CrossOrigin(origins = "*") // Configure this properly for production
public class DashboardUserController {
    
    @Autowired
    private DashboardUserService dashboardUserService;
    
    // Test endpoint to verify API is accessible
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testEndpoint() {
        return ResponseEntity.ok(Map.of("message", "Dashboard User API is working!"));
    }
    
    // Get all users
    @GetMapping
    public ResponseEntity<List<DashboardUser>> getAllUsers() {
        try {
            List<DashboardUser> users = dashboardUserService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<DashboardUser> getUserById(@PathVariable Long id) {
        try {
            Optional<DashboardUser> user = dashboardUserService.getUserById(id);
            return user.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Create new user
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody DashboardUser user) {
        try {
            DashboardUser createdUser = dashboardUserService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
        }
    }
    
    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody DashboardUser userDetails) {
        try {
            DashboardUser updatedUser = dashboardUserService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("User not found")) {
                return ResponseEntity.notFound().build();
            }
            if (e.getMessage().contains("Email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
        }
    }
    
    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            dashboardUserService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("User not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
        }
    }
    
    // Search users
    @GetMapping("/search")
    public ResponseEntity<List<DashboardUser>> searchUsers(@RequestParam String q) {
        try {
            List<DashboardUser> users = dashboardUserService.searchUsers(q);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get users by role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<DashboardUser>> getUsersByRole(@PathVariable String role) {
        try {
            DashboardUser.UserRole userRole = DashboardUser.UserRole.valueOf(role.toUpperCase());
            List<DashboardUser> users = dashboardUserService.getUsersByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get users by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<DashboardUser>> getUsersByStatus(@PathVariable String status) {
        try {
            DashboardUser.UserStatus userStatus = DashboardUser.UserStatus.valueOf(status.toUpperCase());
            List<DashboardUser> users = dashboardUserService.getUsersByStatus(userStatus);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get user statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getUserStatistics() {
        try {
            Map<String, Long> statistics = dashboardUserService.getUserStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Update last login
    @PutMapping("/{id}/last-login")
    public ResponseEntity<?> updateLastLogin(@PathVariable Long id) {
        try {
            dashboardUserService.updateLastLogin(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("User not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error"));
        }
    }
    
    // Get inactive users
    @GetMapping("/inactive")
    public ResponseEntity<List<DashboardUser>> getInactiveUsers() {
        try {
            List<DashboardUser> users = dashboardUserService.getInactiveUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get recently created users
    @GetMapping("/recent")
    public ResponseEntity<List<DashboardUser>> getRecentlyCreatedUsers() {
        try {
            List<DashboardUser> users = dashboardUserService.getRecentlyCreatedUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // User role distribution endpoint
    @GetMapping("/role-distribution")
    public ResponseEntity<Map<String, Long>> getUserRoleDistribution() {
        Map<String, Long> roleCounts = dashboardUserService.getUserRoleDistribution();
        return ResponseEntity.ok(roleCounts);
    }
    
    // Recent logins endpoint
    @GetMapping("/recent-logins")
    public ResponseEntity<List<DashboardUser>> getRecentLogins() {
        return ResponseEntity.ok(dashboardUserService.getRecentLogins(5));
    }

    // Recent registrations endpoint
    @GetMapping("/recent-registrations")
    public ResponseEntity<List<DashboardUser>> getRecentRegistrations() {
        return ResponseEntity.ok(dashboardUserService.getRecentRegistrations(5));
    }
} 