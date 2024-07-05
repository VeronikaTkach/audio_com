import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchUser = createAsyncThunk('user/fetchUser', async (email) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return user;
});

export const registerUser = createAsyncThunk('user/registerUser', async ({ email, userName }) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, userName }])
    .single();
  if (error) throw error;
  return data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, authStatus: 'idle', error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
