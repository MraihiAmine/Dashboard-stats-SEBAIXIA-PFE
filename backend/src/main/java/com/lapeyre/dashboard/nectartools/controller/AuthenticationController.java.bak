package com.lapeyre.dashboard.nectartools.controller;

import com.lapeyre.dashboard.nectartools.dto.AuthenticationRequest;
import com.lapeyre.dashboard.nectartools.dto.AuthenticationResponse;
import com.lapeyre.dashboard.nectartools.dto.RegisterRequest;
import com.lapeyre.dashboard.nectartools.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
@Slf4j
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            log.debug("Received registration request for email: {}", request.getEmail());
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Password is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Username is required");
                return ResponseEntity.badRequest().body(response);
            }

            AuthenticationResponse response = service.register(request);
            log.debug("Registration successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Registration validation failed: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        try {
            log.debug("Received login request for email: {}", request.getEmail());
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Password is required");
                return ResponseEntity.badRequest().body(response);
            }

            AuthenticationResponse response = service.authenticate(request);
            log.debug("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Login validation failed: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> request) {
        try {
            log.debug("Received Google authentication request");
            
            String email = request.get("email");
            String username = request.get("username");
            
            if (email == null || email.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (username == null || username.trim().isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Username is required");
                return ResponseEntity.badRequest().body(response);
            }

            AuthenticationResponse response = service.handleGoogleAuth(email, username);
            log.debug("Google authentication successful for email: {}", email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Google authentication validation failed: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error("Google authentication failed: {}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", "Google authentication failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 