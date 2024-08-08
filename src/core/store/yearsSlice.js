import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchYears = createAsyncThunk('years/fetchYears', async () => {
  const { data, error } = await supabase
    .from('albums')
    .select('release_date');

  if (error) {
    throw new Error(error.message);
  }

  // Извлекаем уникальные годы из даты выпуска альбома
  const years = Array.from(new Set(data.map(album => album.release_date.split('-')[0])))
    .sort()
    .map(year => ({ value: year, label: year }));

  return years;
});

const yearsSlice = createSlice({
  name: 'years',
  initialState: {
    years: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchYears.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchYears.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.years = action.payload;
      })
      .addCase(fetchYears.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default yearsSlice.reducer;
