import { UserQuizAction } from 'src/constants/action';
import { GET, PUT, POST, DELETE } from '@/utilities/request';
import { QuizAttempt } from '@/types/quizAttempt';

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

export const updateFlushUserQuiz = (newUserQuiz) => {
  const { _id, ...rest } = newUserQuiz;
  const data = rest;

  return {
    type: UserQuizAction.UPDATE_FLUSH_USER_QUIZ,
    promise: PUT(`/userQuizzes/${_id}`, {
      body: data,
    }),
  };
};

export const updateAttempt = (newAttempt: QuizAttempt) => {
  const { _id, completedQuestions } = newAttempt;
  const payload = {
    completedQuestions,
  };

  return {
    type: UserQuizAction.UPDATE_ATTEMPT,
    promise: PUT(`/quizAttempts/${_id}`, {
      body: payload,
    }),
  };
};