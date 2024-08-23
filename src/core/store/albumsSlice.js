import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchAlbums = createAsyncThunk('albums/fetchAlbums', async ({ page, perPage, searchTerm, genre, year, formats }) => {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;

  console.log('Fetching albums with params:', { page, perPage, searchTerm, genre, year, formats });

  let query = supabase
    .from('albums')
    .select('*')
    .range(start, end);

  if (searchTerm) {
    console.log('Applying search term filter:', searchTerm);
    query = query.or(`title.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`);
  }

  if (genre) {
    console.log('Applying genre filter:', genre);
    const { data: genreData, error: genreError } = await supabase
      .from('genre')
      .select('genre_id')
      .eq('genre', genre)
      .single();

    if (genreError || !genreData) {
      console.error('Error fetching genre:', genreError ? genreError.message : 'No genre found');
      return [];
    }

    const genreId = genreData.genre_id;
    console.log('Found genre ID:', genreId);

    const { data: genreAlbums, error: genreAlbumsError } = await supabase
      .from('genre_album')
      .select('album_id')
      .eq('genre_id', genreId);

    if (genreAlbumsError || genreAlbums.length === 0) {
      console.error('Error fetching genre_album or no albums found:', genreAlbumsError ? genreAlbumsError.message : 'No albums found for the selected genre.');
      return [];
    }

    const albumIds = genreAlbums.map(ga => ga.album_id);
    console.log('Found album IDs for genre:', albumIds);

    query = query.in('id', albumIds);
  }

  if (year) {
    console.log('Applying year filter:', year);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte('release_date', startDate).lte('release_date', endDate);
  }

  if (formats && formats.length > 0) {
    console.log('Applying format filter:', formats);
    const { data: formatData, error: formatError } = await supabase
      .from('format')
      .select('format_id')
      .in('format', formats); 

    if (formatError || !formatData || formatData.length === 0) {
      console.error('Error fetching format:', formatError ? formatError.message : 'No format found');
      return [];
    }

    const formatIds = formatData.map(f => f.format_id);

    const { data: formatAlbums, error: formatAlbumsError } = await supabase
      .from('format_album')
      .select('album_id')
      .in('format_id', formatIds);

    if (formatAlbumsError || formatAlbums.length === 0) {
      console.error('Error fetching format_album or no albums found:', formatAlbumsError ? formatAlbumsError.message : 'No albums found for the selected formats.');
      return [];
    }

    const albumIds = formatAlbums.map(fa => fa.album_id);
    query = query.in('id', albumIds);
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
      state.hasMoreAlbums = true;
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
          state.hasMoreAlbums = action.payload.length === state.albumsPerPage;
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
