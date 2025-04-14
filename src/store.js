import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './features/notesSlice';

const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});

export default store;