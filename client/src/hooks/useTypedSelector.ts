import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from 'src/reducers';

// Use this instead of plain `useSelector`
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useTypedSelector;
