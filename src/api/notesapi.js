import axios from 'axios';

const API = axios.create({
  baseURL: 'https://notes-api-backend-iwuw.onrender.com',
});

export const fetchNotes = () => API.get('/');
export const createNote = (note) => API.post('/', note);
export const updateNote = (id, note) => API.put(`/${id}`, note);
export const deleteNote = (id) => API.delete(`/${id}`);
