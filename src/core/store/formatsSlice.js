import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchFormats = createAsyncThunk('formats/fetchFormats', async () => {
  const { data, error } = await supabase
    .from('albums')
    .select('format');

  if (error) {
    console.error('Error fetching formats from albums:', error.message);
    throw new Error(error.message);
  }

  const formats = new Set();
  try {
    data.forEach(album => {
      if (album.format) {
        // Проверка формата данных перед JSON.parse
        if (typeof album.format === 'string' && album.format.trim().startsWith('[')) {
          JSON.parse(album.format).forEach(format => formats.add(format));
        } else {
          console.error('Invalid format data:', album.format);
        }
      }
    });
  } catch (parseError) {
    console.error('Error parsing format data:', parseError.message);
    throw new Error('Error parsing format data.');
  }

  return Array.from(formats).map(format => ({ value: format, label: format }));
});

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
        console.error('Error in formatsSlice:', action.error.message);
      });
  }
});

export default formatsSlice.reducer;
