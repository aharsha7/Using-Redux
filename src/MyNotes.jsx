import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./components/Modal";
import {loadNotes,addNote,editNote,removeNote} from "./features/notesSlice";

const MyNotes = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.list);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [modalType, setModalType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);

  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  const openModal = (type, id = null) => {
    setModalType(type);
    setCurrentNoteId(id);
    if (type === "update" && id) {
      const note = notes.find((n) => n._id === id);
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

  const handleAdd = () => {
    if (title && description) {
      const timestamp = new Date();
      const newNote = {
        title,
        description,
        createdAt: timestamp,
        updatedAt: timestamp,
        color: getRandomColor(),
      };
      dispatch(addNote(newNote));
      closeModal();
    }
  };

  const handleUpdate = () => {
    if (title && description) {
      const updatedNote = {
        title,
        description,
        updatedAt: new Date(),
      };
      dispatch(editNote({ id: currentNoteId, note: updatedNote }));
      closeModal();
    }
  };

  const handleDelete = () => {
    dispatch(removeNote(currentNoteId));
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
    
    if (filterType === "all") {
      filtered = notes;
    }
    else if (filterType === "today") {
      filtered = notes.filter(
        (note) =>
          new Date(note.createdAt).toDateString() === now.toDateString()
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
    const colors = [
      "#FFFFCC","#CCFFCC","#CCE5FF","#B0E0E6","#FFE4E1","#FFEBCC","#FFD6E0","#D6EAF8","#D5F5E3","#FDEBD0"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div>
      <h1 className="head">MY NOTES</h1>
      <div className="navbar">
        <input
          type="text"
          placeholder="🔍 Search Notes..."
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />

        <div className="filter-tabs">
          <button onClick={() => handleFilter("all")} className="tab-btn">
            All Notes
          </button>
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
          modalType === "add" ? handleAdd : modalType === "update" ? handleUpdate : handleDelete}
        title={modalType !== "delete" ? title : undefined}
        description={modalType !== "delete" ? description : undefined}
        setTitle={setTitle}
        setDescription={setDescription}
        type={modalType}
      />
    </div>
  );
};

export default MyNotes;
