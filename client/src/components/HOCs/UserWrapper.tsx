import React, { useEffect } from 'react';
import useCurrentPath from '@/hooks/useCurrentPath';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { getCurrentUser } from '@/actions/user';

interface UserWrapperProps {
  children: any;
}

const UserWrapper: React.FC<UserWrapperProps> = ({ children: Component }) => {
  const currentPath = useCurrentPath();
  const [run] = useDispatchAsyncAction();

  useEffect(() => {
    (async() => {
      if (!localStorage.getItem('survey-app-token')) {
        return;
      }

      run(getCurrentUser());
    })();
  }, [run, currentPath]);

  return Component;
};

export default UserWrapper;
