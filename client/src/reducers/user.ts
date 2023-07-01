import { AuthenticationAction } from 'src/constants/action';
import type { Action } from 'src/actions/authentication';
import jwt_decode from 'jwt-decode';
import configs from '@/configuration';

interface UserState {
  loggedIn: boolean;
  email: string | null;
  userId: string | null;
  studentId: string | null;
  staffCode: string | null;
  role: string | null;
}

interface Token {
  email: string;
  id: string;
  studentId?: string;
  staffCode?: string;
  role: string;
}

const getInitialState = () => {
  const token = localStorage.getItem('survey-app-token');
  if (!token || token === '') {
    return {
      loggedIn: false,
      email: null,
      userId: null,
      studentId: null,
      staffCode: null,
      role: null,
    };
  }

  const decodedToken = jwt_decode<Token>(token);
  return {
    loggedIn: true,
    email: decodedToken.email,
    userId: decodedToken.id,
    role: decodedToken.role,
    studentId: decodedToken.studentId || null,
    staffCode: decodedToken.staffCode || null,
  };
};

const INITIAL_STATE: UserState = getInitialState();

export const userReducer = (state = INITIAL_STATE, action: Action): UserState => {
  switch (action.type) {
    case AuthenticationAction.SSO_LOGIN: {
      const { token, refreshToken } = action.payload.data;
      const decodedToken = jwt_decode<Token>(token);

      localStorage.setItem('survey-app-token', token);
      localStorage.setItem('rf-tk', refreshToken);

      return {
        ...state,
        loggedIn: true,
        email: decodedToken.email,
        userId: decodedToken.id,
        role: decodedToken.role,
        studentId: decodedToken.studentId || null,
        staffCode: decodedToken.staffCode || null,
      };
    }

    case AuthenticationAction.LOGOUT: {
      localStorage.removeItem('survey-app-token');
      localStorage.removeItem('rf-tk');

      // Logout from SSO server
      window.location.href = `${configs.SSO_DOMAIN}/ssoserver/sso/logout?redirectUrl=${configs.FE_BASE_URL}/login`;

      return {
        loggedIn: false,
        email: null,
        userId: null,
        studentId: null,
        staffCode: null,
        role: null,
      };
    }

    default:
      break;
  }
  return state;
};
