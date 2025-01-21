import React, { useState, useEffect } from 'react';

function EditModal({ show, onClose, user, onUpdateUser }) {
  const [updatedUser, setUpdatedUser] = useState(user || {});

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onUpdateUser(updatedUser);
    onClose();
  };

  if (!show) return null; // Prevent rendering the modal if not visible

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit User</h2>
        <input
          type="text"
          name="name"
          value={updatedUser.name || ''}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          value={updatedUser.email || ''}
          onChange={handleChange}
        />
        <input
          type="text"
          name="jobTitle"
          value={updatedUser.jobTitle || ''}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          value={updatedUser.age || ''}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Update User</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default EditModal;
