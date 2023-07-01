import { combineReducers } from 'redux';
import { collectionReducer } from './collection';
import { userReducer } from './user';

import appReducer from '@/modules/redux/slices/appReducer';

const rootReducer = combineReducers({
  user: userReducer,
  collection: collectionReducer,
  app: appReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
