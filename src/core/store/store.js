import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../../assets/styles/themes/slice';
import albumsReducer from '../store/albumsSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    albums: albumsReducer,
  },
});

export default store;