package com.smartlibrary.service;

import com.smartlibrary.dto.*;
import com.smartlibrary.entity.Role;
import com.smartlibrary.entity.User;
import com.smartlibrary.security.JwtService;
import com.smartlibrary.service.impl.AuthenticationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthenticationServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserService userService;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    private AuthenticationService authenticationService;

    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        authenticationService = new AuthenticationServiceImpl(
                authenticationManager,
                userService,
                jwtService,
                userDetailsService
        );
        // Use a real UserDetails object to avoid Mockito Byte Buddy issues on Java 24
        userDetails = org.springframework.security.core.userdetails.User.withUsername("john")
                .password("password")
                .authorities(Collections.emptyList())
                .build();
    }

    @Test
    void login_Success() {
        AuthRequest request = new AuthRequest("john", "password");
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "encodedPass", Role.USER, "123", null);

        when(userDetailsService.loadUserByUsername("john")).thenReturn(userDetails);
        when(userService.findByUsername("john")).thenReturn(user);
        when(jwtService.generateToken(userDetails)).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(userDetails)).thenReturn("refreshToken");

        AuthResponse response = authenticationService.login(request);

        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        assertEquals("john", response.getUsername());
        assertEquals("USER", response.getRole());
        assertEquals("john@email.com", response.getEmail());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_BadCredentials_ThrowsException() {
        AuthRequest request = new AuthRequest("john", "wrongpass");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authenticationService.login(request));
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void register_Success() {
        UserDto dto = new UserDto(null, "John", "Doe", "john", "john@email.com", "password", "USER", "123", null);
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "encodedPass", Role.USER, "123", null);

        when(userService.registerUser(dto)).thenReturn(user);

        User result = authenticationService.register(dto);

        assertNotNull(result);
        assertEquals("john", result.getUsername());
        verify(userService, times(1)).registerUser(dto);
    }

    @Test
    void refreshToken_Success() {
        TokenRefreshRequest request = new TokenRefreshRequest("validRefreshToken");

        when(jwtService.extractUsername("validRefreshToken")).thenReturn("john");
        when(userDetailsService.loadUserByUsername("john")).thenReturn(userDetails);
        when(jwtService.isTokenValid("validRefreshToken", userDetails)).thenReturn(true);
        when(jwtService.generateToken(userDetails)).thenReturn("newAccessToken");
        when(jwtService.generateRefreshToken(userDetails)).thenReturn("newRefreshToken");

        TokenRefreshResponse response = authenticationService.refreshToken(request);

        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("newRefreshToken", response.getRefreshToken());
    }

    @Test
    void refreshToken_InvalidToken_ThrowsException() {
        TokenRefreshRequest request = new TokenRefreshRequest("invalidRefreshToken");

        when(jwtService.extractUsername("invalidRefreshToken")).thenReturn("john");
        when(userDetailsService.loadUserByUsername("john")).thenReturn(userDetails);
        when(jwtService.isTokenValid(eq("invalidRefreshToken"), any(UserDetails.class))).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authenticationService.refreshToken(request));
    }
}
