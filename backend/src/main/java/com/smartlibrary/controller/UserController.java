package com.smartlibrary.controller;

import com.smartlibrary.dto.ApiResponse;
import com.smartlibrary.dto.UserDto;
import com.smartlibrary.entity.User;
import com.smartlibrary.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> listUsers() {
        List<UserDto> users = userService.findAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        User user = userService.findByUsername(principal.getName());
        UserDto dto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .build();
        return ResponseEntity.ok(ApiResponse.success("Current user profile retrieved successfully", dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        UserDto dto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .build();
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDto userDto,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }

        User currentUser = userService.findByUsername(principal.getName());
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

        if (!isAdmin && !currentUser.getId().equals(id)) {
            return ResponseEntity.status(403).body(ApiResponse.error("You are not authorized to update another user's profile."));
        }

        if (currentUser.getId().equals(id) && userDto.getRole() != null && !currentUser.getRole().name().equals(userDto.getRole())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("You cannot change your own authorization role."));
        }

        // Update profile details
        User user = userService.updateUserProfile(id, userDto);
        
        // Update role if specified and current user is admin updating another user
        if (userDto.getRole() != null && isAdmin && !currentUser.getId().equals(id)) {
            user = userService.updateUserRole(id, userDto.getRole());
        }

        UserDto updatedDto = UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id, Principal principal) {
        if (principal != null) {
            User currentUser = userService.findByUsername(principal.getName());
            if (currentUser.getId().equals(id)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("You cannot delete your own administrative account."));
            }
        }

        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }
}
