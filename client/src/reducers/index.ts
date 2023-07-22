import { combineReducers } from 'redux';
import appReducer from '@/modules/redux/slices/appReducer';
import { quizReducer } from '@/reducers/quiz';
import { collectionReducer } from './collection';
import { userReducer } from './user';
import { quizAttemptReducer } from '@/reducers/quizAttempt';

const rootReducer = combineReducers({
  user: userReducer,
  collection: collectionReducer,
  quiz: quizReducer,
  app: appReducer,
  quizAttempt: quizAttemptReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
