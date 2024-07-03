import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../../assets/styles/themes/slice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export default store;