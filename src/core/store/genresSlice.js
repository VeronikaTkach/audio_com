import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

// Создаем асинхронный thunk для получения всех жанров
export const fetchGenres = createAsyncThunk(
  'genres/fetchGenres',
  async () => {
    const { data, error } = await supabase
      .from('albums')
      .select('genre');

    if (error) {
      throw new Error(error.message);
    }

    // Извлекаем уникальные жанры из данных
    const genres = new Set();
    data.forEach(album => {
      if (album.genre) {
        JSON.parse(album.genre).forEach(genre => genres.add(genre));
      }
    });

    // Возвращаем массив уникальных жанров
    return Array.from(genres).map(genre => ({ value: genre, label: genre }));
  }
);

const genresSlice = createSlice({
  name: 'genres',
  initialState: {
    genres: []
  },
  reducers: {
    addGenre: (state, action) => {
      state.genres.push(action.payload);
    },
    setGenres: (state, action) => {
      state.genres = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
    });
  }
});

export const { addGenre, setGenres } = genresSlice.actions;
export default genresSlice.reducer;
