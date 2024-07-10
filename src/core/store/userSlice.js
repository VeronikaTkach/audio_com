import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchUser = createAsyncThunk('user/fetchUser', async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('isEditor')
    .eq('id', data.user.id)
    .single();

  if (userError) throw userError;

  return { ...data.user, isEditor: userData.isEditor };
});

export const registerUser = createAsyncThunk('user/registerUser', async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    throw error;
  }
  console.log('Пользователь успешно зарегистрирован:', data.user);

  const { error: userError } = await supabase
    .from('users')
    .insert([{ id: data.user.id, email: data.user.email, isEditor: false }]);

  if (userError) {
    console.error('Ошибка при вставке дополнительных данных:', userError);
    throw userError;
  }

  return { ...data.user, isEditor: false };
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('isEditor')
    .eq('id', user.id)
    .single();

  if (userError) throw userError;
  return { ...user, isEditor: userData.isEditor };
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

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
