import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserApi, registerUserApi, getUserApi, logoutUserApi } from '../../api';

// Асинхронный thunk для получения пользователя
export const fetchUser = createAsyncThunk('user/fetchUser', fetchUserApi);

// Асинхронный thunk для регистрации пользователя
export const registerUser = createAsyncThunk('user/registerUser', registerUserApi);

// Асинхронный thunk для получения текущего пользователя
export const getUser = createAsyncThunk('user/getUser', getUserApi);

// Асинхронный thunk для выхода пользователя
export const logoutUser = createAsyncThunk('user/logoutUser', logoutUserApi);

const userSlice = createSlice({
  name: 'user',
  initialState: {     
    user: null,
    authStatus: 'idle',
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.authStatus = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.authStatus = 'succeeded';
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.authStatus = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authStatus = 'succeeded';
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('user');
      });
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
