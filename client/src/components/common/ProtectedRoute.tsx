import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<any> = ({ children: Component }) => {
  const loggedIn = useSelector((state: any) => state.user.loggedIn);

  return loggedIn ? Component : <Navigate to="/login" />;
};

export default ProtectedRoute;
