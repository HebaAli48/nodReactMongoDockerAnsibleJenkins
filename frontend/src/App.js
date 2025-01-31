import React, { useEffect, useState } from 'react';
import './App.css';
import DeleteModal from './components/DeleteModal';
import EditModal from './components/EditModal';
import AddModal from './components/AddModal';

function App() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetch('http://164.92.166.224:5000/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleAddUser = async (newUser) => {
    try {
      const response = await fetch('http://164.92.166.224:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const addedUser = await response.json();
      setUsers([...users, addedUser]);
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const response = await fetch(`http://164.92.166.224:5000/users/${updatedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      setUsers(
        users.map((user) => (user._id === updatedUser._id ? data : user))
      );
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await fetch(`http://164.92.166.224:5000/users/${selectedUser._id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setSelectedUser(null);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.jobTitle.toLowerCase().includes(query) ||
      user.age.toString().includes(query)
    );
  });

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Users Management</h1>
      </header>

      <div className="actions-container">
        <button onClick={handleAddClick} className="action-btn add-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          Add User
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, title, email, or age"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Job Title</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.jobTitle}</td>
                  <td>{user.age}</td>
                  <td>
                  <div className="container">

                    <button onClick={() => handleEditClick(user)} className="btn action-btn edit-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(user)} className="btn action-btn delete-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Users Management</p>
      </footer>

      {/* Modals */}
      <AddModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddUser={handleAddUser}
      />

      <EditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={selectedUser}
        onUpdateUser={handleEditUser}
      />

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDeleteUser={handleDeleteUser}
        user={selectedUser}
      />
    </div>
  );
}

export default App;