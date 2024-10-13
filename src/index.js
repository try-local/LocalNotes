const express = require('express');
const path = require('path');
const LocalDB = require('@trylocal/local.db');
const LocalThemes = require('@trylocal/local.themes');

const app = express();
const db = new LocalDB();

// Middleware to parse JSON bodies and serve static files
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

app.get('/api/themes', (req, res) => {
    try {
        const themes = LocalThemes.getAllThemes(); // Fetch themes from the LocalThemes package
        if (!themes) {
            return res.status(404).json({ error: 'No themes available.' });
        }
        res.json(themes);  // Return the list of themes
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve themes.' });
    }
});

app.get('/api/themes/:name', (req, res) => {
    try {
        const themes = LocalThemes.getAllThemes();  // Get all themes
        const theme = themes.find(t => t.name === req.params.name);  // Find the theme by name
        if (!theme) {
            return res.status(404).json({ error: 'Theme not found.' });
        }
        res.json(theme);  // Return the theme data including the CSS URL
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve theme.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
