import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../../assets/styles/themes/slice';
import albumsReducer from '../store/albumsSlice';
import userSlice from '../store/userSlice';
import genresReducer from './genresSlice';
import yearsReducer from './yearsSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    albums: albumsReducer,
    user: userSlice,
    genres: genresReducer,
    years: yearsReducer,
  },
});

export default store;