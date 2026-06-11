package com.smartlibrary.service;

import com.smartlibrary.dto.UserDto;
import com.smartlibrary.entity.Role;
import com.smartlibrary.entity.User;
import com.smartlibrary.exception.ResourceNotFoundException;
import com.smartlibrary.repository.UserRepository;
import com.smartlibrary.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl(userRepository, passwordEncoder);
    }

    @Test
    void registerUser_Success() {
        UserDto dto = new UserDto(null, "John", "Doe", "john", "john@email.com", "password", "USER", "123", null);
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "encodedPass", Role.USER, "123", null);

        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(userRepository.existsByEmail("john@email.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.registerUser(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("john", result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUser_UsernameConflict_ThrowsException() {
        UserDto dto = new UserDto(null, "John", "Doe", "john", "john@email.com", "password", "USER", "123", null);

        when(userRepository.existsByUsername("john")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(dto));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUser_EmailConflict_ThrowsException() {
        UserDto dto = new UserDto(null, "John", "Doe", "john", "john@email.com", "password", "USER", "123", null);

        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(userRepository.existsByEmail("john@email.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(dto));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void findById_Success() {
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "pass", Role.USER, "123", null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.findById(1L);

        assertNotNull(result);
        assertEquals("john", result.getUsername());
    }

    @Test
    void findById_NotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.findById(1L));
    }

    @Test
    void updateUserRole_Success() {
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "pass", Role.USER, "123", null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.updateUserRole(1L, "LIBRARIAN");

        assertNotNull(result);
        assertEquals(Role.LIBRARIAN, result.getRole());
    }

    @Test
    void updateUserRole_InvalidRole_ThrowsException() {
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "pass", Role.USER, "123", null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> userService.updateUserRole(1L, "INVALID_ROLE"));
    }
}
