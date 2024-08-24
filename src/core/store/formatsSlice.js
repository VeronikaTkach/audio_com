import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFormatsApi } from '../../api';

// Асинхронный thunk для получения форматов
export const fetchFormats = createAsyncThunk('formats/fetchFormats', fetchFormatsApi);

const formatsSlice = createSlice({
  name: 'formats',
  initialState: {
    formats: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFormats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.formats = action.payload;
      })
      .addCase(fetchFormats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.error('Ошибка в formatsSlice:', action.error.message);
      });
  }
});

export default formatsSlice.reducer;
