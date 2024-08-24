import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchYearsApi } from '../../api';

// Асинхронный thunk для получения годов
export const fetchYears = createAsyncThunk('years/fetchYears', fetchYearsApi);

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
