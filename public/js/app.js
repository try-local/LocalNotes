let editingIndex = -1;

document.getElementById('addNoteButton').addEventListener('click', async () => {
    const noteInput = document.getElementById('noteInput');
    const noteTag = document.getElementById('noteTag');
    const noteContent = noteInput.value;
    const tagContent = noteTag.value;

    if (noteContent) {
        if (editingIndex === -1) {
            await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: noteContent, tag: tagContent })
            });
        } else {
            await fetch(`/api/notes/${editingIndex}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: noteContent, tag: tagContent })
            });
            editingIndex = -1; // Reset editing state
        }
        noteInput.value = '';
        noteTag.value = '';
        loadNotes();
    }
});

async function loadNotes() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const response = await fetch('/api/notes');
    const notes = await response.json();
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    notes.forEach((note, index) => {
        if (note.content.toLowerCase().includes(searchQuery) || (note.tag && note.tag.toLowerCase().includes(searchQuery))) {
            const li = document.createElement('li');
            li.textContent = `${note.content} ${note.tag ? `[#${note.tag}]` : ''}`;
            
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                noteInput.value = note.content;
                noteTag.value = note.tag || '';
                editingIndex = index; // Set index for editing
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', async () => {
                await fetch(`/api/notes/${index}`, { method: 'DELETE' });
                loadNotes();
            });

            li.appendChild(editButton);
            li.appendChild(deleteButton);
            notesList.appendChild(li);
        }
    });
}

// Load notes when the page is loaded
window.onload = loadNotes;
