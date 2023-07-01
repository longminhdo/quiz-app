import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

interface Options<R, E> {
  onSuccess?: (result: R) => void;
  onError?: (error: E) => void;
  disableErrorToast?: boolean;
}

const useDispatchAsyncAction = () => {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch<any>();
  const actionCount = useRef(0);

  const run = useCallback(
    async <R = any, E = any>(action: any, options: Options<R, E> = {}): Promise<any> => {
      setSubmitting(true);
      actionCount.current += 1;
      const response = await dispatch(action);
      const { onSuccess, onError, disableErrorToast } = options;

      if (response.success) {
        onSuccess?.(response.result);
      } else {
        onError?.(response.error);
        if (!response.type && !disableErrorToast) {
          // toast.error(response.error);
          console.error(response);
        }
      }

      // Update `submitting` state after callback call
      actionCount.current -= 1;
      if (actionCount.current === 0) {
        setSubmitting(false);
      }

      return response;
    },
    [dispatch],
  );

  return [run, submitting] as const;
};

export default useDispatchAsyncAction;
