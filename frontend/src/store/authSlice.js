import { createSlice } from '@reduxjs/toolkit';

const getTokenFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Reading token from storage:', token ? 'present' : 'absent');
    return token;
  } catch (e) {
    console.error('Error reading token:', e);
    return null;
  }
};

const initialState = {
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
  error: null,
  loading: false,
};

console.log('Auth slice initialState:', { 
  isAuthenticated: initialState.isAuthenticated,
  hasToken: !!initialState.token 
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      console.log('Setting token:', action.payload ? 'present' : 'null');
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      console.log('Logging out');
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setToken, setError, setLoading, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
