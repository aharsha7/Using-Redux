import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { fetchNotes, createNote, updateNote, deleteNote } from "./api/notesapi";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [modalType, setModalType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await fetchNotes();
        setNotes(res.data);
        setFilteredNotes(res.data);
      } catch (err) {
        console.error("Failed to load notes", err);
      }
    };
    loadNotes();
  }, []);

  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  const openModal = (type, id = null) => {
    setModalType(type);
    setCurrentNoteId(id);
    if (type === "update" && id) {
      const note = notes.find((note) => note._id === id);
      setTitle(note.title);
      setDescription(note.description);
    } else {
      setTitle("");
      setDescription("");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTitle("");
    setDescription("");
  };

  const handleAdd = async () => {
    if (title && description) {
      try {
        const timestamp = new Date();
        const newNote = {
          title,
          description,
          createdAt: timestamp,
          updatedAt: timestamp,
          color: getRandomColor(),
        };
        const res = await createNote(newNote);
        setNotes([res.data, ...notes]);
      } catch (err) {
        console.error("Failed to add note", err);
      }
    }
    closeModal();
  };

  const handleUpdate = async () => {
    if (title && description) {
      try {
        const updatedNote = {
          title,
          description,
          updatedAt: new Date(),
        };
        const res = await updateNote(currentNoteId, updatedNote);
        setNotes(
          notes.map((note) => (note._id === currentNoteId ? res.data : note))
        );
      } catch (err) {
        console.error("Failed to update note", err);
      }
    }
    closeModal();
  };

  const handleDelete = async () => {
    try {
      await deleteNote(currentNoteId);
      setNotes(notes.filter((note) => note._id !== currentNoteId));
    } catch (err) {
      console.error("Failed to delete note", err);
    }
    closeModal();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filterNotes = () => {
    return filteredNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.description.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleFilter = (filterType) => {
    const now = new Date();
    let filtered = notes;

    if (filterType === "today") {
      filtered = notes.filter(
        (note) => new Date(note.createdAt).toDateString() === now.toDateString()
      );
    } else if (filterType === "lastWeek") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filtered = notes.filter(
        (note) => new Date(note.createdAt) >= oneWeekAgo
      );
    } else if (filterType === "lastMonth") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(now.getMonth() - 2);
      filtered = notes.filter(
        (note) =>
          new Date(note.createdAt) >= twoMonthsAgo &&
          new Date(note.createdAt) < oneMonthAgo
      );
    }
    setFilteredNotes(filtered);
  };

  const getRandomColor = () => {
    const colors =  ["#FFFFCC", "#CCFFCC","#CCE5FF","#B0E0E6","#FFE4E1","#FFEBCC",
       "#FFD6E0", "#D6EAF8", "#D5F5E3", "#FDEBD0"];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div>
      <h1 className="head">MY NOTES</h1>
      <div className="navbar">
        <input
          type="text"
          placeholder="🔍Search Notes..."
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />
        <div className="filter-tabs">
          <button onClick={() => handleFilter("today")} className="tab-btn">
            Today
          </button>
          <button onClick={() => handleFilter("lastWeek")} className="tab-btn">
            This Week
          </button>
          <button onClick={() => handleFilter("lastMonth")} className="tab-btn">
            Last Month
          </button>
        </div>
      </div>
      <div className="notes-grid">
        {filterNotes().map((note) => (
          <div
            key={note._id}
            className="note-card"
            style={{ backgroundColor: note.color }}
          >
            <div className="note-header">
              <button
                className="edit-btn hover-effect"
                onClick={() => openModal("update", note._id)}
              >
                <i className="fas fa-pen"></i>
              </button>
              <button
                className="delete-btn hover-effect"
                onClick={() => openModal("delete", note._id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
            <div className="note-content">
              <h3 className="note-title">{note.title}</h3>
              <p className="note-description">{note.description}</p>
            </div>
            <div className="note-footer">
              <span className="date-left">
                {new Date(
                  note.updatedAt || note.createdAt
                ).toLocaleDateString()}
              </span>
              <span className="time-right">
                {new Date(
                  note.updatedAt || note.createdAt
                ).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div
          className="note-card add-card hover-effect"
          onClick={() => openModal("add")}
        >
          <span>➕ New Note</span>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={
          modalType === "add"
            ? handleAdd
            : modalType === "update"
            ? handleUpdate
            : handleDelete
        }
        title={modalType !== "delete" ? title : undefined}
        description={modalType !== "delete" ? description : undefined}
        setTitle={setTitle}
        setDescription={setDescription}
        type={modalType}
      />
    </div>
  );
};

export default App;
