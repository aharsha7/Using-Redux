import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/notes',
});

export const fetchNotes = () => API.get('/');
export const createNote = (note) => API.post('/', note);
export const updateNote = (id, note) => API.put(`/${id}`, note);
export const deleteNote = (id) => API.delete(`/${id}`);