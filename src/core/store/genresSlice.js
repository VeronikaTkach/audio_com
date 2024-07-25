import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  genres: [
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' }
  ]
};

const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    addGenre: (state, action) => {
      state.genres.push(action.payload);
    },
    setGenres: (state, action) => {
      state.genres = action.payload;
    }
  }
});

export const { addGenre, setGenres } = genresSlice.actions;
export default genresSlice.reducer;
