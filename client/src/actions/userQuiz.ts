import { UserQuizAction } from 'src/constants/action';
import { GET, PUT, POST, DELETE } from '@/utilities/request';

export const joinQuiz = (code) => ({
  type: UserQuizAction.JOIN,
  promise: POST('/userQuizzes/join', {
    body: { code },
  }),
});

export const getUserQuizById = (userQuizId) => ({
  type: UserQuizAction.GET_USER_QUIZ_BY_ID,
  promise: GET(`/userQuizzes/${userQuizId}`),
});
