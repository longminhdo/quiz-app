import { UserAction } from 'src/constants/action';
import { GET, PUT, POST, DELETE } from '@/utilities/request';

export const getCurrentUser = () => ({
  type: UserAction.GET_CURRENT_USER,
  promise: GET('/users'),
});

export const flushUser = () => ({
  type: UserAction.FLUSH_USER,
});
