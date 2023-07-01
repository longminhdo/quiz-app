import { Dispatch } from 'redux';

const requestHandlingMiddleware = ({ dispatch, getState }: { dispatch: Dispatch<any>; getState: () => any }) => (next: (action: any) => void) => async (action: any) => {
  // Thunk
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  // Promise
  if (!action.promise) {
    return next(action);
  }

  const { promise: promisePayload, type, ...rest } = action;

  // Dispatch original action
  // next({ type, ...rest });

  const promise = typeof promisePayload === 'function' ? promisePayload(dispatch, getState) : promisePayload;

  let nextAction;
  let returnValue;

  try {
    const result = await promise;
    // Dispatch _SUCCESS action
    nextAction = {
      // type: `${type}_SUCCESS`,
      type,
      payload: result,
      options: rest.payload,
    };
    returnValue = result;
  } catch (error: any) {
    // Dispatch _FAILURE action
    nextAction = {
      type: `${type}_FAILURE`,
      payload: {
        statusCode: error.statusCode,
        message: error.message,
      },
      options: rest.payload,
    };

    returnValue = error;
  } finally {
    nextAction && next(nextAction);
    // eslint-disable-next-line no-unsafe-finally
    return returnValue;
  }
};

export default requestHandlingMiddleware;
