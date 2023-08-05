import { AuthenticationAction, UserAction } from 'src/constants/action';
import jwt_decode from 'jwt-decode';
import configs from '@/configuration';

interface UserState {
  loggedIn: boolean;
  email: string | null;
  userId: string | null;
  studentId: string | null;
  staffCode: string | null;
  role: string | null;
  avatar?: string | null;
  _id?: string | null;
  fullName: string | null;
}

interface Token {
  email: string;
  id: string;
  studentId?: string;
  staffCode?: string;
  role: string;
  fullName: string;
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
      fullName: null,
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
    fullName: decodedToken.fullName || null,
  };
};

const INITIAL_STATE: UserState = getInitialState();

export const userReducer = (state = INITIAL_STATE, action): UserState => {
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
        fullName: decodedToken.fullName || null,
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
        fullName: null,
      };
    }

    case UserAction.GET_CURRENT_USER: {
      const currentUser = action.payload.data;

      return {
        ...state,
        ...currentUser,
      };
    }

    default:
      break;
  }
  return state;
};
