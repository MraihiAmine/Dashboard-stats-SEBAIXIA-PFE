package com.lapeyre.dashboard.nectartools.config;

import com.lapeyre.dashboard.nectartools.model.DashboardUser;
import com.lapeyre.dashboard.nectartools.repository.DashboardUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DashboardUserDataInitializer implements CommandLineRunner {
    
    @Autowired
    private DashboardUserRepository dashboardUserRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no users exist
        if (dashboardUserRepository.count() == 0) {
            initializeSampleUsers();
        }
    }
    
    private void initializeSampleUsers() {
        // Create sample users
        DashboardUser user1 = new DashboardUser("John Doe", "john.doe@example.com", DashboardUser.UserRole.ADMIN, DashboardUser.UserStatus.ACTIVE);
        user1.setCreatedAt(LocalDateTime.now().minusDays(5));
        user1.setLastLogin(LocalDateTime.now().minusHours(2));
        
        DashboardUser user2 = new DashboardUser("Jane Smith", "jane.smith@example.com", DashboardUser.UserRole.USER, DashboardUser.UserStatus.ACTIVE);
        user2.setCreatedAt(LocalDateTime.now().minusDays(3));
        user2.setLastLogin(LocalDateTime.now().minusDays(1));
        
        DashboardUser user3 = new DashboardUser("Bob Johnson", "bob.johnson@example.com", DashboardUser.UserRole.VIEWER, DashboardUser.UserStatus.ACTIVE);
        user3.setCreatedAt(LocalDateTime.now().minusDays(10));
        user3.setLastLogin(LocalDateTime.now().minusDays(5));
        
        DashboardUser user4 = new DashboardUser("Alice Brown", "alice.brown@example.com", DashboardUser.UserRole.USER, DashboardUser.UserStatus.INACTIVE);
        user4.setCreatedAt(LocalDateTime.now().minusDays(15));
        user4.setLastLogin(LocalDateTime.now().minusDays(20));
        
        DashboardUser user5 = new DashboardUser("Charlie Wilson", "charlie.wilson@example.com", DashboardUser.UserRole.VIEWER, DashboardUser.UserStatus.PENDING);
        user5.setCreatedAt(LocalDateTime.now().minusDays(1));
        
        DashboardUser user6 = new DashboardUser("Diana Davis", "diana.davis@example.com", DashboardUser.UserRole.ADMIN, DashboardUser.UserStatus.ACTIVE);
        user6.setCreatedAt(LocalDateTime.now().minusDays(7));
        user6.setLastLogin(LocalDateTime.now().minusHours(1));
        
        DashboardUser user7 = new DashboardUser("Edward Miller", "edward.miller@example.com", DashboardUser.UserRole.USER, DashboardUser.UserStatus.ACTIVE);
        user7.setCreatedAt(LocalDateTime.now().minusDays(12));
        user7.setLastLogin(LocalDateTime.now().minusDays(2));
        
        DashboardUser user8 = new DashboardUser("Fiona Garcia", "fiona.garcia@example.com", DashboardUser.UserRole.VIEWER, DashboardUser.UserStatus.INACTIVE);
        user8.setCreatedAt(LocalDateTime.now().minusDays(20));
        user8.setLastLogin(LocalDateTime.now().minusDays(25));
        
        // Save all users
        dashboardUserRepository.save(user1);
        dashboardUserRepository.save(user2);
        dashboardUserRepository.save(user3);
        dashboardUserRepository.save(user4);
        dashboardUserRepository.save(user5);
        dashboardUserRepository.save(user6);
        dashboardUserRepository.save(user7);
        dashboardUserRepository.save(user8);
        
        System.out.println("Sample dashboard users initialized successfully!");
    }
} 