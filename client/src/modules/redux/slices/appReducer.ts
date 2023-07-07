import { createSlice } from '@reduxjs/toolkit';

const appReducer = createSlice({
  name: 'loading',
  initialState: {
    loading: false,
    syncing: false,
    windowWidth: window.innerWidth,
  },
  reducers: {
    setLoading: (state, action: { payload: boolean }) => {
      state.loading = action.payload;
    },
    setSyncing: (state, action: { payload: boolean }) => {
      state.syncing = action.payload;
    },
    setWindowWidth: (state, action: { payload: number }) => {
      state.windowWidth = action.payload;
    },
  },
});

export const { setLoading, setSyncing, setWindowWidth } = appReducer.actions;
export default appReducer.reducer;
