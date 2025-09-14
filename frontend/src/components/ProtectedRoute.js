import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the token exists in localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // If the token exists, allow the user to see the page
    return children;
  } else {
    // If no token, redirect the user to the login page
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;