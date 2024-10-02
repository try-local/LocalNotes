const express = require('express');
const path = require('path');
const LocalDB = require('@trylocal/local.db');

const app = express();
const db = new LocalDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API to get all notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await db.getNotes();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve notes.' });
    }
});

// API to add a note
app.post('/api/notes', async (req, res) => {
    const { title, content, tag } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }

    try {
        const note = await db.addNote(title, content, tag);
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add note.' });
    }
});

// API to delete a note
app.delete('/api/notes/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const result = await db.deleteNote(id);
        if (result === 0) {
            return res.status(404).json({ error: 'Note not found.' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
