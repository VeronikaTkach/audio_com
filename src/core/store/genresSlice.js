import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchAllGenres = createAsyncThunk('genres/fetchAllGenres', async () => {
  const { data, error } = await supabase
    .from('albums')
    .select('genre');

  if (error) {
    throw new Error(error.message);
  }

  const allGenres = data.flatMap(album => album.genre);
  const uniqueGenres = [...new Set(allGenres.map(genre => genre.toLowerCase()))].map(genre => ({ value: genre, label: genre }));

  return uniqueGenres;
});

const initialState = {
  genres: [
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' }
  ],
  status: 'idle',
  error: null,
};

const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    addGenre: (state, action) => {
      state.genres.push(action.payload);
    },
    setGenres: (state, action) => {
      state.genres = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGenres.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllGenres.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.genres = action.payload;
      })
      .addCase(fetchAllGenres.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { addGenre, setGenres } = genresSlice.actions;
export default genresSlice.reducer;
