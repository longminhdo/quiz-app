import { UserAction } from 'src/constants/action';
import { GET, POST } from '@/utilities/request';

export const getCurrentUser = () => ({
  type: UserAction.GET_CURRENT_USER,
  promise: GET('/users'),
});

export const flushUser = () => ({
  type: UserAction.FLUSH_USER,
});

export const getStudents = (payload) => ({
  type: UserAction.GET_CURRENT_USER,
  promise: POST('/users/students', {
    body: payload,
  }),
});
