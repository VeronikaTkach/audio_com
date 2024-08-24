import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

// Асинхронный thunk для получения жанров из таблицы 'albums' в Supabase
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

// Асинхронный thunk для добавления нового жанра в таблицу 'genre' в Supabase
export const saveGenreToSupabase = createAsyncThunk('genres/saveGenre', async (newGenre, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from('genre')
      .insert([{ genre: newGenre.value }]);

    if (error) {
      console.error('Error adding genre to Supabase:', error.message);
      return rejectWithValue(error.message);
    }

    console.log('New genre added to Supabase:', data);
    return newGenre;
  } catch (err) {
    console.error('Error saving genre:', err.message);
    return rejectWithValue(err.message);
  }
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
      console.log('Adding genre to state:', action.payload);
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
        console.error('Error in genresSlice:', action.error.message);
      })
      .addCase(saveGenreToSupabase.pending, (state) => {
        state.status = 'saving';
      })
      .addCase(saveGenreToSupabase.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.genres.push(action.payload);
        console.log('Genre successfully saved and added to state:', action.payload);
      })
      .addCase(saveGenreToSupabase.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Error saving genre to Supabase:', action.payload);
      });
  }
});

export const { addGenre } = genresSlice.actions;
export default genresSlice.reducer;
