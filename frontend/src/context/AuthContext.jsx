import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on load and restore user session
    const accessToken = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    if (accessToken && username && role) {
      setUser({ username, role, email, firstName, lastName });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const data = response.data; // The API returns ApiResponse, so it might be response.data.data or directly the fields depending on the controller structure
      
      // Let's check: our controller AuthController returns ApiResponse<AuthResponse>
      // The JSON has { success: true, message: "...", data: { accessToken, refreshToken, username, role, ... } }
      const authData = data.data;

      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
      localStorage.setItem('username', authData.username);
      localStorage.setItem('role', authData.role);
      localStorage.setItem('email', authData.email || '');
      localStorage.setItem('firstName', authData.firstName || '');
      localStorage.setItem('lastName', authData.lastName || '');

      setUser({
        username: authData.username,
        role: authData.role,
        email: authData.email,
        firstName: authData.firstName,
        lastName: authData.lastName,
      });
      setIsAuthenticated(true);
      return authData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (allowedRoles) => {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, hasRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
