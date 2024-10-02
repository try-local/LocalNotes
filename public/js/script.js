document.addEventListener('DOMContentLoaded', async () => {
    const notesGrid = document.getElementById('notes-grid');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteModal = document.getElementById('note-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const noteForm = document.getElementById('note-form');
    const themeToggle = document.getElementById('theme-toggle');
    const collapseSidebar = document.getElementById('collapse-sidebar');
    const sidebar = document.getElementById('sidebar');

    let editingNoteId = null; // Store the ID of the note being edited

    // Show modal
    addNoteBtn.addEventListener('click', () => {
        noteModal.classList.remove('hidden');
        editingNoteId = null; // Reset on new note
    });

    // Hide modal
    closeModalBtn.addEventListener('click', () => {
        noteModal.classList.add('hidden');
    });

    // Fetch notes from the backend
    async function fetchNotes() {
        try {
            const response = await fetch('/api/notes');
            const notes = await response.json();
            renderNotes(notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    // Render notes on the dashboard
    function renderNotes(notes) {
        notesGrid.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note-card', 'bg-white', 'p-6', 'rounded-lg', 'shadow-lg');
            noteElement.setAttribute('draggable', true); // Enable dragging
            noteElement.setAttribute('data-id', note.id); // Store note ID for editing
            noteElement.addEventListener('dragstart', dragStart);
            noteElement.innerHTML = `
                <h3 class="text-xl font-bold mb-2">${note.title}</h3>
                <p class="text-gray-600 mb-4">${note.content}</p>
                <span class="text-sm bg-blue-200 text-blue-600 rounded-full px-2 py-1">${note.tag || 'General'}</span>
                <button class="mt-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 delete-btn">Delete</button>
            `;
            notesGrid.appendChild(noteElement);

            // Add delete functionality
            noteElement.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id));
            noteElement.addEventListener('click', () => editNote(note)); // Edit note on click
        });
    }

    // Handle form submission for adding a new note
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const tag = document.getElementById('note-tag').value;

        try {
            if (editingNoteId) {
                // Update the existing note
                await fetch(`/api/notes/${editingNoteId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content, tag }),
                });
            } else {
                // Add a new note
                await fetch('/api/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content, tag }),
                });
            }
            noteModal.classList.add('hidden');
            fetchNotes();  // Refresh the notes after adding or editing
        } catch (error) {
            console.error('Error saving note:', error);
        }
    });

    // Search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const noteCards = document.querySelectorAll('.note-card');
        noteCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = title.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Drag and drop functionality
    let draggedNote = null;

    function dragStart(event) {
        draggedNote = event.target;
        event.dataTransfer.effectAllowed = 'move';
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        if (event.target.classList.contains('note-card')) {
            const targetNote = event.target;
            const notes = [...notesGrid.children];

            if (draggedNote !== targetNote) {
                notesGrid.insertBefore(draggedNote, targetNote);
            }
        } else {
            notesGrid.appendChild(draggedNote);
        }
        // Optionally update order on the backend
        // await updateNoteOrder([...notesGrid.children].map(note => note.dataset.id));
    }

    // Delete a note
    async function deleteNote(noteId) {
        const confirmDelete = confirm('Are you sure you want to delete this note?');
        if (confirmDelete) {
            try {
                await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
                fetchNotes(); // Refresh notes after deletion
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
    }

    // Edit a note
    async function editNote(note) {
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-tag').value = note.tag;
        noteModal.classList.remove('hidden');
        editingNoteId = note.id; // Set the editing note ID
    }

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Collapse sidebar
    collapseSidebar.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });

    // Initial fetch of notes
    fetchNotes();
});
