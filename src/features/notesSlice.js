import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotes, createNote, updateNote, deleteNote } from '../api/notesapi';

export const loadNotes = createAsyncThunk('notes/load', async () => {
  const res = await fetchNotes();
  return res.data;
});

export const addNote = createAsyncThunk('notes/add', async (note) => {
  const res = await createNote(note);
  return res.data;
});

export const editNote = createAsyncThunk('notes/edit', async ({ id, note }) => {
  const res = await updateNote(id, note);
  return res.data;
});

export const removeNote = createAsyncThunk('notes/delete', async (id) => {
  await deleteNote(id);
  return id;
});

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    list: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadNotes.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(editNote.fulfilled, (state, action) => {
        const index = state.list.findIndex(n => n._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removeNote.fulfilled, (state, action) => {
        state.list = state.list.filter(n => n._id !== action.payload);
      });
  },
});

export default notesSlice.reducer;
