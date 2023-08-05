import { QuizAttemptAction } from 'src/constants/action';
import { GET, POST } from '@/utilities/request';

export const getQuizAttempts = (query) => ({
  type: QuizAttemptAction.GET_ATTEMPTS,
  promise: GET('/quizAttempts', {
    params: query,
  }),
});

export const submitQuizAttempt = (quizAttempt) => {
  const { _id, ...rest } = quizAttempt;
  const data = rest;

  return {
    type: QuizAttemptAction.SUBMIT,
    promise: POST(`/quizAttempts/${_id}/submit`, {
      body: data,
    }),
  };
};
