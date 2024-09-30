document.getElementById('addNoteButton').addEventListener('click', async () => {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    const tag = document.getElementById('noteTag').value;

    if (title && content) {
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, tag })
        });

        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        document.getElementById('noteTag').value = '';
        loadNotes();
    }
});

// Load notes on page load
async function loadNotes() {
    const response = await fetch('/api/notes');
    const notes = await response.json();
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = `${note.title}: ${note.content} [Tag: ${note.tag || 'N/A'}]`;

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => {
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            document.getElementById('noteTag').value = note.tag || '';
            deleteNote(note.id); // Remove the note after editing
        };

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = async () => {
            await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
            loadNotes();
        };

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        notesList.appendChild(li);
    });
}

// Filter notes based on search input
function filterNotes() {
    const searchInput = document.getElementById('searchBar').value.toLowerCase();
    const notesList = document.getElementById('notesList');
    const notes = notesList.getElementsByTagName('li');

    for (let note of notes) {
        const noteText = note.textContent.toLowerCase();
        note.style.display = noteText.includes(searchInput) ? 'list-item' : 'none';
    }
}

window.onload = loadNotes;
