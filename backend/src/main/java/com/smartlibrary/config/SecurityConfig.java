package com.smartlibrary.config;

import com.smartlibrary.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"success\":false,\"message\":\"Unauthorized: Please log in again.\"}");
                })
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(authorize -> authorize
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/error/**").permitAll()
                
                // Books API
                .requestMatchers(HttpMethod.GET, "/api/books", "/api/books/**").hasAnyRole("ADMIN", "LIBRARIAN", "USER")
                .requestMatchers(HttpMethod.POST, "/api/books", "/api/books/**").hasAnyRole("ADMIN", "LIBRARIAN")
                .requestMatchers(HttpMethod.PUT, "/api/books/**").hasAnyRole("ADMIN", "LIBRARIAN")
                .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("ADMIN")
                
                // Categories API
                .requestMatchers(HttpMethod.GET, "/api/categories", "/api/categories/**").hasAnyRole("ADMIN", "LIBRARIAN", "USER")
                .requestMatchers(HttpMethod.POST, "/api/categories", "/api/categories/**").hasAnyRole("ADMIN", "LIBRARIAN")
                .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasAnyRole("ADMIN", "LIBRARIAN")
                .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                
                // Users API
                .requestMatchers(HttpMethod.GET, "/api/users/me").hasAnyRole("ADMIN", "LIBRARIAN", "USER")
                .requestMatchers(HttpMethod.PUT, "/api/users/*").hasAnyRole("ADMIN", "LIBRARIAN", "USER")
                .requestMatchers("/api/users", "/api/users/**").hasRole("ADMIN")
                
                // Settings API
                .requestMatchers("/api/settings", "/api/settings/**").hasRole("ADMIN")
                
                // Borrows API
                .requestMatchers(HttpMethod.GET, "/api/borrows/history").hasRole("USER")
                .requestMatchers(HttpMethod.GET, "/api/borrows", "/api/borrows/**").hasAnyRole("ADMIN", "LIBRARIAN")
                .requestMatchers(HttpMethod.POST, "/api/borrows", "/api/borrows/**").hasRole("USER")
                .requestMatchers(HttpMethod.PUT, "/api/borrows/return/**").hasAnyRole("ADMIN", "LIBRARIAN")
                
                .anyRequest().authenticated()
            );
            
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:5173")); // Default Vite port
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
