package com.clinica.infrastructure.config;

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
            .csrf(csrf -> csrf.disable()) // Permite peticiones POST desde el frontend (React)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Por ahora, deja pasar TODAS las peticiones sin login
            );
        return http.build();
    }
}