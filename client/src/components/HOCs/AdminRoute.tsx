import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/constants';
import { routePaths } from '@/constants/routePaths';
import useTypedSelector from '@/hooks/useTypedSelector';

interface AdminRouteProps {
  children: any;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children: Component }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { role, email } = useTypedSelector(state => state.user);

  const hasAdminPermission = (() => {
    if ([UserRole.TEACHER].includes(role || '')) {
      return true;
    }

    // ADMIN EMAIL
    if (email === 'minh.dl184289@sis.hust.edu.vn') {
      return true;
    }

    return false;
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
