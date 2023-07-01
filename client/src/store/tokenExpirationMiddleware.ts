import { message } from 'antd';
import { AuthenticationAction } from '@/constants/action';
import { SESSION_EXPIRED_CODE } from '@/constants/statusCodes';
import { SESSION_EXPIRED_MESSAGE } from '@/constants/message';

export const tokenExpirationMiddleware = () => next => action => {
  const payload = action?.payload || {};

  if (payload?.statusCode === SESSION_EXPIRED_CODE) {
    message.error(SESSION_EXPIRED_MESSAGE);

    const nextAction = { type: AuthenticationAction.LOGOUT };

    return next(nextAction);
  }

  return next(action);
};