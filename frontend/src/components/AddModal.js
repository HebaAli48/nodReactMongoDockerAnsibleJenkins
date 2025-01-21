import React, { useState } from 'react';
import './Modal.css';
function AddModal({ show, onClose, onAddUser }) {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    jobTitle: '',
    age: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onAddUser(newUser);
    setNewUser({ name: '', email: '', jobTitle: '', age: '' });
    onClose();
  };

  return (
    show && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Add New User</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="jobTitle"
            placeholder="Job Title"
            value={newUser.jobTitle}
            onChange={handleChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newUser.age}
            onChange={handleChange}
          />
          <div className="modal-actions">
            <button onClick={handleSubmit}>Add User</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
}

export default AddModal;
