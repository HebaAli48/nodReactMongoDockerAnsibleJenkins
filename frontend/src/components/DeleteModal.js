import React from 'react';

function DeleteModal({ show, onClose, onDeleteUser, user }) {
  return (
    show && (
        <div className="modal-overlay">
        <div className="modal-content">
          <h2>Delete User</h2>
          <p>Are you sure you want to delete {user?.name}?</p>
          <button onClick={onDeleteUser}>Yes, Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    )
  );
}

export default DeleteModal;
