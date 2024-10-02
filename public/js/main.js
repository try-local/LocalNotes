document.addEventListener('DOMContentLoaded', async () => {
    const notesGrid = document.getElementById('notes-grid');

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

            noteElement.innerHTML = `
                <h3 class="text-xl font-bold mb-2">${note.title}</h3>
                <p class="text-gray-600 mb-4">${note.content}</p>
                <span class="text-sm bg-blue-200 text-blue-600 rounded-full px-2 py-1">${note.tag || 'General'}</span>
            `;
            notesGrid.appendChild(noteElement);
        });
    }

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

    // Initial fetch
    fetchNotes();
});
