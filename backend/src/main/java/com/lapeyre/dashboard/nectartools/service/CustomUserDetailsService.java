package com.lapeyre.dashboard.nectartools.service;

import com.lapeyre.dashboard.nectartools.model.User;
import com.lapeyre.dashboard.nectartools.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Loading user by email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        log.debug("User found in database - status: {}, role: {}", 
            user.getStatus(), user.getRole());

        // Create UserDetails with the actual user password
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword()) // Use actual password from user
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(user.getStatus() != User.UserStatus.ACTIVE)
                .build();

        log.debug("Created UserDetails - enabled: {}, authorities: {}", 
            userDetails.isEnabled(), userDetails.getAuthorities());
        return userDetails;
    }
} 