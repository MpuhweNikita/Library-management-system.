package com.smartlibrary.service;

import com.smartlibrary.dto.*;
import com.smartlibrary.entity.User;

public interface AuthenticationService {
    AuthResponse login(AuthRequest request);
    User register(UserDto userDto);
    TokenRefreshResponse refreshToken(TokenRefreshRequest request);
}
