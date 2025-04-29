package com.lapeyre.dashboard.nectartools.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // optional: disable CSRF if you're not using a browser form
            .authorizeHttpRequests()
            .requestMatchers("/api/project-lines/**").permitAll() // allow your endpoint
            .anyRequest().authenticated() // everything else requires authentication
            .and()
            .httpBasic(); // optional, for basic auth if needed
        return http.build();
    }
}

