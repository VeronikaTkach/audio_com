import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchAlbums = createAsyncThunk('albums/fetchAlbums', async ({ page, perPage, searchTerm }) => {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;
  
  let query = supabase
    .from('albums')
    .select('*')
    .range(start, end);

  if (searchTerm) {
    const lowercasedTerm = searchTerm.toLowerCase();
    query = query.or(`title.ilike.%${lowercasedTerm}%,artist.ilike.%${lowercasedTerm}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }
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
      state.items = [];
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
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
