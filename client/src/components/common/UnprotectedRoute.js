import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function UnprotectedRoute({ children: Component }) {
  const loggedIn = useSelector((state) => state.user.loggedIn);

  return loggedIn ? <Navigate to="/forms" /> : Component;
}

export default UnprotectedRoute;