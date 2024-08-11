import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../../assets/styles/themes/slice';
import albumsReducer from '../store/albumsSlice';
import userSlice from '../store/userSlice';
import genresReducer from './genresSlice';
import yearsReducer from './yearsSlice';
import formatsReducer from './formatsSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    albums: albumsReducer,
    user: userSlice,
    genres: genresReducer,
    years: yearsReducer,
    formats: formatsReducer,
  },
});

export default store;