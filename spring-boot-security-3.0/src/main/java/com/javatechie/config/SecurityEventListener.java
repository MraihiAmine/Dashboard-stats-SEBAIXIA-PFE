package com.javatechie.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class SecurityEventListener {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityEventListener.class);

    @EventListener
    public void onSuccess(AuthenticationSuccessEvent success) {
        Authentication auth = success.getAuthentication();
        logger.info("Successful authentication for user: {}", auth.getName());
    }

    @EventListener
    public void onFailure(AbstractAuthenticationFailureEvent failures) {
        logger.error("Authentication failed for user: {}, reason: {}", 
            failures.getAuthentication().getName(),
            failures.getException().getMessage());
    }
}