import { QuizAction } from 'src/constants/action';

interface QuizState {
  currentQuiz?: any;
}

const INITIAL_STATE: any = {
  quiz: null,
};

export const quizReducer = (state = INITIAL_STATE, action: any): QuizState => {
  switch (action.type) {
    case QuizAction.GET_QUIZ_BY_ID:
    case QuizAction.UPDATE_QUIZ: {
      const quiz = action.payload.data;

      return {
        currentQuiz: quiz,
      };
    }

    case QuizAction.FLUSH_QUIZ: {
      return INITIAL_STATE;
    }

    default:
      break;
  }

  return state;
};
