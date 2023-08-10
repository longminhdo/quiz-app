import { QuizAction } from 'src/constants/action';
import { GET, PUT, POST, DELETE } from '@/utilities/request';

export const getQuizzes = (query?: { search?: string; createdIn?: string; page?: number; sort?: string; limit?: number }) => ({
  type: QuizAction.GET_QUIZZES,
  promise: GET('/quizzes', {
    params: query,
  }),
});

export const deleteQuiz = (quizId: string) => ({
  type: QuizAction.DELETE_QUIZ,
  promise: DELETE(`/quizzes/${quizId}`),
});

export const getQuizById = (quizId: string) => ({
  type: QuizAction.GET_QUIZ_BY_ID,
  promise: GET(`/quizzes/${quizId}`),
});

export const createQuiz = (payload: any) => ({
  type: QuizAction.CREATE_QUIZ,
  promise: POST('/quizzes', {
    body: payload,
  }),
});

export const updateQuiz = (newQuiz: any) => {
  const { _id, ...rest } = newQuiz;
  const data = rest;

  return {
    type: QuizAction.UPDATE_QUIZ,
    promise: PUT(`/quizzes/${_id}`, {
      body: data,
    }),
  };
};

export const generateQuizCode = (quizId: string) => ({
  type: QuizAction.GENERATE_QUIZ_CODE,
  promise: POST(`/quizzes/${quizId}/generate-code`),
});

export const flushQuiz = () => ({
  type: QuizAction.FLUSH_QUIZ,
});

export const removeAssign = (payload: { userId: string; quizId: string }) => ({
  type: QuizAction.REMOVE_ASSIGN,
  promise: POST(`/quizzes/${payload.quizId}/remove-assign`, {
    body: {
      userId: payload.userId,
    },
  }),
});

export const assign = (payload: { assignTo: Array<string>; quizId: string }) => ({
  type: QuizAction.ASSIGN,
  promise: POST(`/quizzes/${payload.quizId}/assign`, {
    body: {
      assignTo: payload.assignTo,
    },
  }),
});

export const getQuizAnalytics = (quizId: string) => ({
  type: QuizAction.GET_QUIZ_ANALYTICS,
  promise: GET(`/quizzes/${quizId}/analytics`),
});
