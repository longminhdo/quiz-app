import { combineReducers } from 'redux';
import appReducer from '@/modules/redux/slices/appReducer';
import { quizReducer } from '@/reducers/quiz';
import { userQuizReducer } from '@/reducers/userQuiz';
import { collectionReducer } from './collection';
import { userReducer } from './user';

const rootReducer = combineReducers({
  user: userReducer,
  collection: collectionReducer,
  quiz: quizReducer,
  app: appReducer,
  userQuiz: userQuizReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
