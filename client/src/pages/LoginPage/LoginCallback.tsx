import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './LoginPage.scss';
import { ssoLogin } from '@/actions/authentication';

const LoginCallback = () => {
  const [run] = useDispatchAsyncAction();
  const [searchParams] = useSearchParams();
  const ssoToken = searchParams.get('token');

  useEffect(() => {
    if (ssoToken) {
      (async () => {
        await run(ssoLogin(ssoToken));
      })();
    }
  }, [run, ssoToken]);

  return null;
};

export default LoginCallback;
