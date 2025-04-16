import axios from "axios";

const baseURL = "https://notes-api-backend-iwuw.onrender.com/api/notes";
// const baseURL = "https://notes-api-backend-rho.vercel.app/api/notes";
// const baseURL = "http://localhost:5000/api/notes";

const API = axios.create({
  baseURL: baseURL,
});

export const fetchNotes = () => API.get("/");
export const createNote = (note) => API.post("/", note);
export const updateNote = (id, note) => API.put(`/${id}`, note);
export const deleteNote = (id) => API.delete(`/${id}`);
