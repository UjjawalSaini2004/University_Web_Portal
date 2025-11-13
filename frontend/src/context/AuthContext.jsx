import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { ROUTES, ROLES } from '../utils/constants';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      console.log('CheckAuth - Token:', savedToken ? 'exists' : 'missing');
      console.log('CheckAuth - User:', savedUser ? 'exists' : 'missing');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('CheckAuth - Restoring auth:', { token: savedToken.substring(0, 20) + '...', user: parsedUser });
          
          setToken(savedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          // Remove corrupted data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('CheckAuth - No valid auth data found');
        // Clean up any partial data
        if (savedToken) localStorage.removeItem('token');
        if (savedUser) localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Starting login...');
      
      // authService.login returns the API response
      const response = await authService.login(credentials);
      
      console.log('Login response:', response);
      
      // Backend returns: { success, message, data: { token, user, refreshToken } }
      // Extract token and user from response.data
      const responseToken = response.data?.token;
      const responseUser = response.data?.user;

      console.log('Extracted token:', responseToken ? responseToken.substring(0, 20) + '...' : 'MISSING');
      console.log('Extracted user:', responseUser);

      if (!responseToken || !responseUser) {
        console.error('Invalid response structure:', response);
        // Clean up any old data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Invalid response from server - missing token or user data');
      }

      // Save to localStorage
      localStorage.setItem('token', responseToken);
      localStorage.setItem('user', JSON.stringify(responseUser));
      
      console.log('Saved to localStorage successfully');

      // Update state
      setToken(responseToken);
      setUser(responseUser);
      setIsAuthenticated(true);

      toast.success('Login successful!');

      // Redirect based on role
      const userRole = responseUser.role;
      console.log('Redirecting user with role:', userRole);

      switch (userRole) {
        case ROLES.SUPER_ADMIN:
          navigate(ROUTES.SUPER_ADMIN_DASHBOARD);
          break;
        case ROLES.ADMIN:
          navigate(ROUTES.ADMIN_DASHBOARD);
          break;
        case ROLES.TEACHER:
        case ROLES.FACULTY:
          navigate(ROUTES.TEACHER_DASHBOARD);
          break;
        case ROLES.STUDENT:
          navigate(ROUTES.STUDENT_DASHBOARD);
          break;
        default:
          navigate(ROUTES.HOME);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Clean up any failed login data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success('Registration successful! Please login.');
      navigate(ROUTES.LOGIN);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out - clearing all auth data');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Navigate to login
    navigate(ROUTES.LOGIN);
    toast.info('Logged out successfully');
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
