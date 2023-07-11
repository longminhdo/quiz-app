import React, { useEffect, useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';

const AdminRoute = ({ children: Component }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const hasAdminPermission = (() => {
    console.log('first', localStorage.getItem('admin'));

    return true;
  })();

  useEffect(() => {
    if (!hasAdminPermission) {
      navigate(routePaths.ACCESS_DENIED);
    } else {
      setIsLoading(false);
    }
  }, [navigate, hasAdminPermission]);

  if (isLoading) {
    return null;
  }

  return Component;
};

export default AdminRoute;
