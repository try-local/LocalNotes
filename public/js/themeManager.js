document.addEventListener("DOMContentLoaded", function() {
    // Load initial theme based on localStorage or default
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        applyTheme(storedTheme);
    } else {
        applyTheme('default');
    }

    // Load themes for the store
    fetchThemes();

    // Toggle between main content and theme store
    const themeStoreLink = document.getElementById('open-theme-store');
    themeStoreLink.addEventListener('click', () => {
        document.getElementById('main-content').classList.add('hidden');
        document.getElementById('theme-store').classList.remove('hidden');
    });

    // Apply a selected theme
    document.getElementById('themes-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('theme-select-btn')) {
            const themeName = e.target.dataset.theme;
            applyTheme(themeName);
        }
    });

    // Toggle theme button functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'default';
        const newTheme = currentTheme === 'default' ? 'dark' : 'default';
        applyTheme(newTheme);
    });

    // Fetch available themes from an API or themes.json
    function fetchThemes() {
        fetch('/api/themes')  // This will fetch the available themes
            .then(response => response.json())
            .then(themes => {
                const themesList = document.getElementById('themes-list');
                themesList.innerHTML = '';  // Clear the list before rendering
                themes.forEach(theme => {
                    const themeCard = document.createElement('div');
                    themeCard.classList.add('bg-gray-200', 'dark:bg-gray-700', 'p-4', 'rounded-lg', 'shadow-lg', 'text-center');
    
                    themeCard.innerHTML = `
                        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">${theme.name}</h3>
                        <img src="${theme.imageUrl}" alt="${theme.name}" class="w-full h-32 object-cover rounded-lg mb-4">
                        <p class="text-gray-700 dark:text-gray-300">${theme.description}</p>
                        <button class="theme-select-btn bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-700" data-theme="${theme.name}">
                            Select Theme
                        </button>
                    `;
    
                    themesList.appendChild(themeCard);
                });
            })
            .catch(err => console.error('Failed to load themes:', err));
    }    

    // Function to apply the selected theme
// Function to apply the selected theme
function applyTheme(themeName) {
    const themeCSS = document.getElementById('theme-css');
    fetch('/api/themes/' + themeName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(themeData => {
            themeCSS.href = themeData.cssUrl; // Ensure this URL is accessible
            localStorage.setItem('theme', themeName);
        })
        .catch(err => console.error('Failed to load theme:', err));
}

    // Collapse sidebar functionality
    const collapseBtn = document.getElementById('collapse-sidebar');
    collapseBtn.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('hidden');
    });
});