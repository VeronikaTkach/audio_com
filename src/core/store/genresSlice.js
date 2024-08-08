import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

// Fetch genres from the albums table
export const fetchGenres = createAsyncThunk('genres/fetchGenres', async () => {
  const { data, error } = await supabase
    .from('albums')
    .select('genre');

  if (error) {
    throw new Error(error.message);
  }

  const genres = new Set();
  data.forEach(album => {
    if (album.genre) {
      JSON.parse(album.genre).forEach(genre => genres.add(genre));
    }
  });

  return Array.from(genres).map(genre => ({ value: genre, label: genre }));
});

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
    }
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
      });
  }
});

export const { addGenre } = genresSlice.actions;
export default genresSlice.reducer;
