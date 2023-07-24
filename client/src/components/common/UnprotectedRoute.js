import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';

function UnprotectedRoute({ children: Component }) {
  const { loggedIn, role } = useSelector((state) => state.user);

  if (role === 'teacher') {
    return loggedIn ? <Navigate to={routePaths.COLLECTIONS} /> : Component;
  }

  return loggedIn ? <Navigate to={routePaths.HOME} /> : Component;
}

export default UnprotectedRoute;
