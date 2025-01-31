const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON data

// Environment Variables
const mongoURI = 'mongodb://164.92.166.224:27017/mydb';

// MongoDB Connection
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  jobTitle: String,
  age: Number,
});

const User = mongoose.model('User', userSchema);

// API Endpoint to Get Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// API Endpoint to Add a New User
app.post('/users', async (req, res) => {
  const { name, email, jobTitle, age } = req.body;

  try {
    const newUser = new User({ name, email, jobTitle, age });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: 'Error adding user', error: err });
  }
});

// API Endpoint to Edit an Existing User
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, jobTitle, age } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, jobTitle, age },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err });
  }
});

// API Endpoint to Delete a User
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
