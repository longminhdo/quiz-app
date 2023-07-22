import { QuizAttemptAction } from 'src/constants/action';

interface QuizAttemptState {
  currentQuizAttempt?: any;
}

const INITIAL_STATE: any = {
  quizAttempt: null,
};

export const quizAttemptReducer = (state = INITIAL_STATE, action: any): QuizAttemptState => {
  switch (action.type) {
    case QuizAttemptAction.GET_ATTEMPT_BY_ID:
    case QuizAttemptAction.UPDATE_ATTEMPT: {
      const quizAttempt = action.payload.data;

      return {
        currentQuizAttempt: quizAttempt,
      };
    }

    case QuizAttemptAction.FLUSH_QUIZ_ATTEMPT: {
      return INITIAL_STATE;
    }

    default:
      break;
  }

  return state;
};
