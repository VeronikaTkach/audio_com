import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchGenres = createAsyncThunk('genres/fetchGenres', async () => {
  const { data, error } = await supabase
    .from('albums')
    .select('genre');

  if (error) {
    console.error('Error fetching genres from albums:', error.message);
    throw new Error(error.message);
  }

  const genres = new Set();
  try {
    data.forEach(album => {
      if (album.genre) {
        // Проверка формата данных перед JSON.parse
        if (typeof album.genre === 'string' && album.genre.trim().startsWith('[')) {
          JSON.parse(album.genre).forEach(genre => genres.add(genre));
        } else {
          console.error('Invalid genre data:', album.genre);
        }
      }
    });
  } catch (parseError) {
    console.error('Error parsing genre data:', parseError.message);
    throw new Error('Error parsing genre data.');
  }

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
        console.error('Error in genresSlice:', action.error.message);
      });
  }
});

export const { addGenre } = genresSlice.actions;
export default genresSlice.reducer;
