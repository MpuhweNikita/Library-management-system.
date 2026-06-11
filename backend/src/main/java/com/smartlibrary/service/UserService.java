package com.smartlibrary.service;

import com.smartlibrary.dto.UserDto;
import com.smartlibrary.entity.User;
import java.util.List;

public interface UserService {
    User registerUser(UserDto userDto);
    User findByUsername(String username);
    User findByEmail(String email);
    User findById(Long id);
    List<UserDto> findAllUsers();
    User updateUserRole(Long userId, String role);
    void deleteUser(Long id);
    User updateUserProfile(Long id, UserDto userDto);
}
