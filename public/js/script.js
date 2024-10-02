document.addEventListener('DOMContentLoaded', async () => {
    const notesGrid = document.getElementById('notes-grid');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteModal = document.getElementById('note-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const noteForm = document.getElementById('note-form');
    const themeToggle = document.getElementById('theme-toggle');

    // Show modal
    addNoteBtn.addEventListener('click', () => {
        noteModal.classList.remove('hidden');
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
            noteElement.addEventListener('click', () => editNote(note));

            noteElement.innerHTML = `
                <h3 class="text-xl font-bold mb-2">${note.title}</h3>
                <p class="text-gray-600 mb-4">${note.content}</p>
                <span class="text-sm bg-blue-200 text-blue-600 rounded-full px-2 py-1">${note.tag || 'General'}</span>
            `;
            notesGrid.appendChild(noteElement);
        });
    }

    // Handle form submission for adding a new note
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const tag = document.getElementById('note-tag').value;

        try {
            await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, tag }),
            });
            noteModal.classList.add('hidden');
            fetchNotes();  // Refresh the notes after adding a new one
        } catch (error) {
            console.error('Error adding note:', error);
        }
    });

    // Search functionality
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const noteCards = document.querySelectorAll('.note-card');
        noteCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = title.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Drag and drop functionality
    function allowDrop(event) {
        event.preventDefault();
    }

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.id);
    }

    notesGrid.addEventListener('drop', async (event) => {
        event.preventDefault();
        const noteId = event.dataTransfer.getData('text/plain');
        const targetNote = event.target.closest('.note-card');
        
        if (targetNote && targetNote.dataset.id !== noteId) {
            // Swap notes if dropped on a different note
            const draggedNote = document.querySelector(`.note-card[data-id='${noteId}']`);
            const notes = Array.from(notesGrid.children);
            const targetIndex = notes.indexOf(targetNote);
            const draggedIndex = notes.indexOf(draggedNote);

            if (draggedIndex < targetIndex) {
                notesGrid.insertBefore(draggedNote, targetNote.nextSibling);
            } else {
                notesGrid.insertBefore(draggedNote, targetNote);
            }

            // Update the order in the backend if necessary
            // await updateNoteOrder(notes.map(note => note.dataset.id));
        }
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Edit note functionality
    async function editNote(note) {
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-tag').value = note.tag;
        noteModal.classList.remove('hidden');

        // Update the note on submission
        noteForm.onsubmit = async (e) => {
            e.preventDefault();
            try {
                await fetch(`/api/notes/${note.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: note.title, content: note.content, tag: note.tag }),
                });
                noteModal.classList.add('hidden');
                fetchNotes(); // Refresh notes after editing
            } catch (error) {
                console.error('Error updating note:', error);
            }
        };
    }

    // Initial fetch of notes
    fetchNotes();
});
