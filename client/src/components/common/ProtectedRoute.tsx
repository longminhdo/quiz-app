import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import useCurrentPath from '@/hooks/useCurrentPath';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { getCurrentUser } from '@/actions/user';
import { setLoading } from '@/modules/redux/slices/appReducer';

const ProtectedRoute: React.FC<any> = ({ children: Component }) => {
  const loggedIn = useSelector((state: any) => state.user.loggedIn);
  const currentPath = useCurrentPath();
  const [run] = useDispatchAsyncAction();

  useEffect(() => {
    (async() => {
      if (!localStorage.getItem('survey-app-token')) {
        return;
      }

      run(setLoading(true));
      await run(getCurrentUser());
      run(setLoading(false));
    })();
  }, [run, currentPath]);

  return loggedIn ? Component : <Navigate to="/login" />;
};

export default ProtectedRoute;
