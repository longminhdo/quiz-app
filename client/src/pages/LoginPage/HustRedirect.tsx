import { useEffect } from 'react';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './LoginPage.scss';
import { getSSOToken } from '@/actions/authentication';

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
