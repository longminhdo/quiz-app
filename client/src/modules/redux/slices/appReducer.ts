import { createSlice } from '@reduxjs/toolkit';

const appReducer = createSlice({
  name: 'loading',
  initialState: {
    loading: false,
    syncing: false,
  },
  reducers: {
    setLoading: (state, action: { payload: boolean }) => {
      state.loading = action.payload;
    },
    setSyncing: (state, action: { payload: boolean }) => {
      state.syncing = action.payload;
    },
  },
});

export const { setLoading, setSyncing } = appReducer.actions;
export default appReducer.reducer;
