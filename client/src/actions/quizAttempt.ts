import { QuizAttemptAction } from 'src/constants/action';
import { GET, PUT, POST, DELETE } from '@/utilities/request';

export const getQuizAttempts = (query) => ({
  type: QuizAttemptAction.GET_ATTEMPTS,
  promise: GET('/quizAttempts', {
    params: query,
  }),
});

export const getQuizAttemptById = (quizAttemptId) => ({
  type: QuizAttemptAction.GET_ATTEMPT_BY_ID,
  promise: GET(`/quizAttempts/${quizAttemptId}`),
});

export const joinQuiz = (code) => ({
  type: QuizAttemptAction.JOIN,
  promise: POST('/quizAttempts/join', {
    body: { code },
  }),
});
