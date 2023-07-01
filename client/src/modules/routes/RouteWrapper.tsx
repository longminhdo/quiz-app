import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';

type Props = { children?: any };

const RouteWrapper = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (['/', '/forms'].includes(location.pathname)) {
      navigate(routePaths.LIBRARY, { replace: true });
    }
  }, [location.pathname, navigate]);

  return children;
};

export default RouteWrapper;
