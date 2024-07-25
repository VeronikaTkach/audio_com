import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../../assets/styles/themes/slice';
import albumsReducer from '../store/albumsSlice';
import userSlice from '../store/userSlice';
import genresReducer from './genresSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    albums: albumsReducer,
    user: userSlice,
    genres: genresReducer,
  },
});

export default store;