import React from "react";

const Modal = ({ isOpen, onClose, onConfirm, title, description, setTitle, setDescription, type }) => {
  if (!isOpen) return null;

  const actionLabel = type === "add" ? "Add" : type === "update" ? "Update" : "Confirm";
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{type === "add" ? "Add Note" : type === "update" ? "Update Note" : "Delete Note"}</h2>
        {type !== "delete" && (
          <>
        
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}
        {type === "delete" && <p>Are you sure you want to delete this note?</p>}
        <div className="modal-actions">
          <button onClick={onConfirm}>{actionLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;