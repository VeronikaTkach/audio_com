import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGenresApi, saveGenreToSupabaseApi } from '../../api';

// Асинхронный thunk для получения жанров
export const fetchGenres = createAsyncThunk('genres/fetchGenres', fetchGenresApi);

// Асинхронный thunk для сохранения нового жанра
export const saveGenreToSupabase = createAsyncThunk('genres/saveGenre', saveGenreToSupabaseApi);

const genresSlice = createSlice({
  name: 'genres',
  initialState: {
    genres: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addGenre: (state, action) => {
      state.genres.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveGenreToSupabase.pending, (state) => {
        state.status = 'saving';
      })
      .addCase(saveGenreToSupabase.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.genres.push(action.payload);
      })
      .addCase(saveGenreToSupabase.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addGenre } = genresSlice.actions;
export default genresSlice.reducer;
