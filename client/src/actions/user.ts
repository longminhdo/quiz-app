import { UserAction } from 'src/constants/action';
import { GET } from '@/utilities/request';

export const getCurrentUser = () => ({
  type: UserAction.GET_CURRENT_USER,
  promise: GET('/users'),
});

export const flushUser = () => ({
  type: UserAction.FLUSH_USER,
});

export const getStudents = (query) => ({
  type: UserAction.GET_CURRENT_USER,
  promise: GET('/users/students', {
    params: query,
  }),
});
