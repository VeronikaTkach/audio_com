import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchAlbums = createAsyncThunk('albums/fetchAlbums', async ({ page, perPage, searchTerm, genre, year }) => {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;

  console.log('Fetching albums with params:', { page, perPage, searchTerm, genre, year });

  let query = supabase
    .from('albums')
    .select('*')
    .range(start, end);

  // Apply search term filter if provided
  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`);
  }

  // Apply genre filter if provided
  if (genre) {
    query = query.filter('genre', 'cs', `{${genre}}`); // Используем оператор `cs` для массива жанров
  }

  // Apply year filter if provided
  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte('release_date', startDate).lte('release_date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching albums:', error.message);
    throw new Error(error.message);
  }
  
  console.log('Fetched albums:', data);

  return data;
});

const albumsSlice = createSlice({
  name: 'albums',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    searchTerm: '',
    currentPage: 1,
    albumsPerPage: 10,
  },
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    deleteAlbum(state, action) {
      state.items = state.items.filter(album => album.id !== action.payload);
    },
    resetAlbums(state) {
      state.items = [];
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Здесь заменяем старый список новым, чтобы избежать дублирования
        if (state.currentPage === 1) {
          state.items = action.payload;
        } else {
          state.items = [...state.items, ...action.payload];
        }
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setSearchTerm, setCurrentPage, deleteAlbum, resetAlbums } = albumsSlice.actions;

export default albumsSlice.reducer;
