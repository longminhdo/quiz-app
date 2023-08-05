import { useEffect } from 'react';
import { getSSOToken } from '@/actions/authentication';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './LoginPage.scss';

const HustRedirect = () => {
  const [run] = useDispatchAsyncAction();

  useEffect(() => {
    (async () => {
      const { data } = await run(getSSOToken());
      window.location.replace(data.url);
    })();
  }, [run]);

  return null;
};

export default HustRedirect;
