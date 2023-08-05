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

export const updateQuizAttempt = (newQuizAttempt) => {
  const { _id, ...rest } = newQuizAttempt;
  const data = rest;

  return {
    type: QuizAttemptAction.UPDATE_ATTEMPT,
    promise: PUT(`/quizAttempts/${_id}`, {
      body: data,
    }),
  };
};

export const updateFlushQuizAttempt = (newQuizAttempt) => {
  const { _id, ...rest } = newQuizAttempt;
  const data = rest;

  return {
    type: QuizAttemptAction.UPDATE_FLUSH_ATTEMPT,
    promise: PUT(`/quizAttempts/${_id}`, {
      body: data,
    }),
  };
};

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
