import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchAlbums = createAsyncThunk(
  'albums/fetchAlbums',
  async () => {
    const { data, error } = await supabase
      .from('albums')
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
);

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
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    deleteAlbum(state, action) {
      state.items = state.items.filter(album => album.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setSearchTerm, setCurrentPage, deleteAlbum } = albumsSlice.actions;

export default albumsSlice.reducer;
