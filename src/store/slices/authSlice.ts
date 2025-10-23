import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; refresh_token: string }>) => {
      state.token = action.payload.token;
      localStorage.setItem('refresh_token', action.payload.refresh_token);
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('refresh_token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice;
