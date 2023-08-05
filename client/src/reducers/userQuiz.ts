import { UserQuizAction } from '@/constants/action';

interface UserQuizState {
  currentUserQuiz?: any;
}

const INITIAL_STATE: any = {
  currentUserQuiz: null,
};

export const userQuizReducer = (state = INITIAL_STATE, action: any): UserQuizState => {
  switch (action.type) {
    case UserQuizAction.GET_USER_QUIZ_BY_ID:
    case UserQuizAction.UPDATE_USER_QUIZ: {
      const userQuiz = action.payload.data;

      return {
        currentUserQuiz: userQuiz,
      };
    }

    case UserQuizAction.FLUSH_USER_QUIZ: {
      return INITIAL_STATE;
    }

    default:
      break;
  }

  return state;
};
