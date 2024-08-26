import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAlbumsApi } from '../../api';

// Асинхронный thunk для получения альбомов
export const fetchAlbums = createAsyncThunk('albums/fetchAlbums', fetchAlbumsApi);

const albumsSlice = createSlice({
  name: 'albums',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    searchTerm: '',
    currentPage: 1,
    albumsPerPage: 10,
    hasMoreAlbums: true,
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
      state.currentPage = 1;
      state.hasMoreAlbums = true;
      state.error = null;
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

        // Логика определения, есть ли еще альбомы
        if (action.payload.length < state.albumsPerPage) {
          state.hasMoreAlbums = false;
        } else {
          state.hasMoreAlbums = true;
        }
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.hasMoreAlbums = false;
      });
  }
});

export const { setSearchTerm, setCurrentPage, deleteAlbum, resetAlbums } = albumsSlice.actions;

export default albumsSlice.reducer;
