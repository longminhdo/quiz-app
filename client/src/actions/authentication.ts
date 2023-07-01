import { AuthenticationAction } from 'src/constants/action';
import { GET, POST } from '@/utilities/request';

export type Action =
  | {
      type: AuthenticationAction.SSO_LOGIN;
      payload: {
        success: true;
        data: {
          token: string;
          refreshToken: string;
        };
      };
    }
  | {
      type: AuthenticationAction.LOGOUT;
    };

export const getSSOToken = () => ({
  type: AuthenticationAction.GET_SSO_TOKEN,
  promise: GET('/auth/encodedState'),
});

export const ssoLogin = (token: string) => ({
  type: AuthenticationAction.SSO_LOGIN,
  promise: POST('/auth/userToken', {
    body: {
      token,
    },
  }),
});

export const logout = () => ({
  type: AuthenticationAction.LOGOUT,
});
