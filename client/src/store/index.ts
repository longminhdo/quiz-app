import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from 'src/reducers';
import requestHandlingMiddleware from './requestHandlingMiddleware';
import { tokenExpirationMiddleware } from '@/store/tokenExpirationMiddleware';

const middlewares = [requestHandlingMiddleware, tokenExpirationMiddleware];

const store = createStore(rootReducer, compose(applyMiddleware(...middlewares)));

export default store;
