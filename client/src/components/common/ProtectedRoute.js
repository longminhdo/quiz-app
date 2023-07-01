import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children: Component }) {
  const loggedIn = useSelector((state) => state.user.loggedIn);

  return loggedIn ? Component : <Navigate to="/login" />;
}

export default ProtectedRoute;