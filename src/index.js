const express = require('express');
const path = require('path');
const LocalDB = require('@trylocal/local.db');

const app = express();
const db = new LocalDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API to get all notes
app.get('/api/notes', (req, res) => {
    const notes = db.getNotes();
    res.json(notes);
});

// API to add a note
app.post('/api/notes', (req, res) => {
    const note = req.body.content;
    db.addNote({ content: note, createdAt: new Date() });
    res.status(201).send();
});

// API to delete a note
app.delete('/api/notes/:index', (req, res) => {
    const index = parseInt(req.params.index);
    db.deleteNote(index);
    res.status(204).send();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
