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

export const createQuiz = (payload: { title: string }) => ({
  type: QuizAction.CREATE_QUIZ,
  promise: POST('/quizzes', {
    body: payload,
  }),
});

export const updateQuiz = (newQuiz: { _id: string; title: string }) => {
  const data = {
    title: newQuiz?.title,
  };

  return {
    type: QuizAction.UPDATE_QUIZ,
    promise: PUT(`/quizzes/${newQuiz._id}`, {
      body: data,
    }),
  };
};
