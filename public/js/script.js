document.addEventListener('DOMContentLoaded', () => {
    const addNoteForm = document.getElementById('add-note-form');
    const notesGrid = document.getElementById('notes-grid');
    const searchBar = document.getElementById('search-bar');
    const themeToggle = document.getElementById('theme-toggle');
    let notes = [];

    // Fetch all notes
    async function fetchNotes() {
        const res = await fetch('/api/notes');
        notes = await res.json();
        renderNotes(notes);
        updateAnalytics(notes);
    }

    // Render notes to the DOM
    function renderNotes(notes) {
        notesGrid.innerHTML = ''; // Clear current notes
        notes.forEach(note => {
            const noteCard = `
                <div class="note-card bg-white shadow-md p-4 rounded-lg draggable" draggable="true" data-id="${note.id}">
                    <input type="text" class="note-title font-bold text-lg" value="${note.title}" onchange="editNoteTitle(${note.id}, this.value)">
                    <textarea class="note-content text-gray-600" onblur="editNoteContent(${note.id}, this.value)">${note.content}</textarea>
                    <span class="note-tag text-sm text-blue-500">${note.tag}</span>
                    <button onclick="deleteNote(${note.id})" class="mt-2 bg-red-500 text-white p-1 rounded">Delete</button>
                </div>
            `;
            notesGrid.insertAdjacentHTML('beforeend', noteCard);
        });
        enableDragAndDrop();
    }

    // Add a new note
    addNoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const tag = document.getElementById('note-tag').value;
        
        const res = await fetch('/api/notes', {
            method: 'POST',
            body: JSON.stringify({ title, content, tag }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            fetchNotes();  // Re-fetch notes
        }
    });

    // Search notes in real time
    searchBar.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filteredNotes = notes.filter(note => note.title.toLowerCase().includes(query));
        renderNotes(filteredNotes);
    });

    // Edit note title in place
    window.editNoteTitle = async function(noteId, newTitle) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            note.title = newTitle;
            await fetch(`/api/notes/${noteId}`, {
                method: 'PUT',
                body: JSON.stringify(note),
                headers: { 'Content-Type': 'application/json' }
            });
            fetchNotes();
        }
    }

    // Edit note content in place
    window.editNoteContent = async function(noteId, newContent) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            note.content = newContent;
            await fetch(`/api/notes/${noteId}`, {
                method: 'PUT',
                body: JSON.stringify(note),
                headers: { 'Content-Type': 'application/json' }
            });
            fetchNotes();
        }
    }

    // Delete a note
    async function deleteNote(noteId) {
        const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
        if (res.ok) {
            fetchNotes();
        }
    }

    // Update analytics
    function updateAnalytics(notes) {
        document.getElementById('total-notes').textContent = notes.length;
        const recentNotes = notes.slice(0, 3).map(note => note.title).join(', ');
        document.getElementById('recent-notes').textContent = recentNotes;
    }

    // Enable drag-and-drop functionality
    function enableDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable');
        const grid = document.getElementById('notes-grid');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
            });
        });

        grid.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(grid, e.clientY);
            const dragging = document.querySelector('.dragging');
            if (afterElement == null) {
                grid.appendChild(dragging);
            } else {
                grid.insertBefore(dragging, afterElement);
            }
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }

    // Theme toggle (dark/light mode)
    themeToggle.addEventListener('click', () => {
        const body = document.body;
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
    });

    fetchNotes(); // Initial fetch
});
