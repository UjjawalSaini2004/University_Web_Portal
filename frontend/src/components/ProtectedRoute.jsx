import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import Loader from './common/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('ProtectedRoute check:', { 
    loading, 
    isAuthenticated, 
    user: user?.email, 
    role: user?.role,
    allowedRoles 
  });

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.log('User role not allowed, redirecting to home');
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;
