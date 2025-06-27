package com.lapeyre.dashboard.nectartools.service;

import com.lapeyre.dashboard.nectartools.dto.AuthenticationRequest;
import com.lapeyre.dashboard.nectartools.dto.AuthenticationResponse;
import com.lapeyre.dashboard.nectartools.dto.RegisterRequest;
import com.lapeyre.dashboard.nectartools.model.User;
import com.lapeyre.dashboard.nectartools.repository.UserRepository;
import com.lapeyre.dashboard.nectartools.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        log.debug("Processing registration request for email: {}", request.getEmail());
        
        try {
            // Validate email format
            if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                log.error("Invalid email format: {}", request.getEmail());
                throw new IllegalArgumentException("Invalid email format");
            }

            // Check if user already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                log.error("User with email {} already exists", request.getEmail());
                throw new IllegalArgumentException("User with this email already exists");
            }

            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                log.error("User with username {} already exists", request.getUsername());
                throw new IllegalArgumentException("User with this username already exists");
            }

            // Create new user
            var user = new User(
                request.getUsername(), // name
                request.getUsername(), // username
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                User.UserRole.USER,
                User.UserStatus.ACTIVE
            );

            log.debug("Saving new user with enabled status: {}", user.isEnabled());
            userRepository.save(user);
            
            // Convert User to UserDetails for JWT generation
            UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isEnabled())
                .build();
            
            String jwtToken = jwtService.generateToken(userDetails);
            log.debug("Generated JWT token for new user");
            
            return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.debug("Attempting authentication for email: {}", request.getEmail());
        log.debug("[DEBUG] Received login request: email={}, password={}", request.getEmail(), request.getPassword());
        
        try {
            // First check if user exists
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        log.error("[DEBUG] User not found with email: {}", request.getEmail());
                        return new UsernameNotFoundException("Invalid email or password");
                    });

            log.debug("[DEBUG] User found: email={}, username={}, encodedPassword={}", user.getEmail(), user.getUsername(), user.getPassword());
            log.debug("[DEBUG] Comparing provided password with encoded password in DB...");
            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            log.debug("[DEBUG] Password match result: {}", passwordMatches);

            if (!passwordMatches) {
                log.error("[DEBUG] Invalid password for user: {}", request.getEmail());
                throw new BadCredentialsException("Invalid email or password");
            }

            // Attempt authentication
            try {
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                    )
                );
            } catch (BadCredentialsException e) {
                log.error("Invalid password for user: {}", request.getEmail());
                throw new BadCredentialsException("Invalid email or password");
            } catch (DisabledException e) {
                log.error("User account is disabled: {}", request.getEmail());
                throw new DisabledException("User account is disabled");
            }

            log.debug("Authentication successful for email: {}", request.getEmail());
            
            // Convert User to UserDetails for JWT generation
            UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isEnabled())
                .build();
            
            String jwtToken = jwtService.generateToken(userDetails);
            log.debug("JWT token generated successfully");
            
            return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
                
        } catch (UsernameNotFoundException | BadCredentialsException e) {
            log.error("Authentication failed: {}", e.getMessage());
            throw new RuntimeException("Invalid email or password");
        } catch (DisabledException e) {
            log.error("User account is disabled: {}", e.getMessage());
            throw new RuntimeException("User account is disabled");
        } catch (Exception e) {
            log.error("Authentication failed - Unexpected error: {}", e.getMessage());
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public AuthenticationResponse handleGoogleAuth(String email, String username) {
        log.debug("Processing Google authentication for email: {}", email);
        
        try {
            // Check if user exists
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        // Generate a secure random password for Google users
                        String randomPassword = generateSecureRandomPassword();
                        log.debug("Creating new user for Google authentication");
                        
                        // Create new user
                        User newUser = new User(
                            username, // name
                            username, // username
                            email,
                            passwordEncoder.encode(randomPassword),
                            User.UserRole.USER,
                            User.UserStatus.ACTIVE
                        );
                        
                        return userRepository.save(newUser);
                    });

            // Convert User to UserDetails for JWT generation
            UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isEnabled())
                .build();

            String jwtToken = jwtService.generateToken(userDetails);
            log.debug("Generated JWT token for Google user");
            
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
                    
        } catch (Exception e) {
            log.error("Google authentication failed: {}", e.getMessage());
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    private String generateSecureRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        StringBuilder password = new StringBuilder();
        java.security.SecureRandom random = new java.security.SecureRandom();
        
        for (int i = 0; i < 16; i++) {
            int index = random.nextInt(chars.length());
            password.append(chars.charAt(index));
        }
        
        return password.toString();
    }
} 