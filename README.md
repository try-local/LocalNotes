# LocalNotes

> LocalNotes is a lightweight, user-friendly package designed to help users create, manage, and organize notes effortlessly. With its rich set of features, LocalNotes enhances your note-taking experience by allowing you to:

- **Add and manage notes**: Create, edit, and delete notes with ease.
- **Tagging system**: Assign tags to your notes for better organization and quick access.
- **Search functionality**: Quickly find notes by content or tags.
- **Simple and intuitive UI**: Features a responsive and modern frontend for seamless note management.
- **Local storage integration**: Data is stored locally with the help of the accompanying [`LocalDB`](https://github.com/try-local/LocalDB) package, ensuring your notes are accessible offline.

---

## Features
- **Create and Organize**: Effortlessly add new notes and categorize them using tags.
- **Edit and Update**: Modify existing notes without duplicating them.
- **Search**: Easily search through notes to find exactly what you're looking for.
- **Tagging System**: Organize notes by adding tags for better filtering and navigation.
- **Responsive Frontend**: Includes a clean, modern UI that adapts to any device.
- **Local Storage**: Save notes locally and retrieve them at any time using `LocalDB`.

## Installation

Install the package via npm:

```bash
npm install @trylocal/local.notes
```

You can also install the required dependencies, such as `LocalDB` for local storage:

```bash
npm install @trylocal/local.db
```

## Usage

Here's a basic example of how to use LocalNotes in normal node.js project:

```javascript
const LocalNotes = require("@trylocal/local.notes");

// BOOM! Your website will be open on localhost:3000
// Make sure you have both packages - local.notes & local.db
```

## Frontend Integration

> LocalNotes also comes with a simple, responsive dashboard for managing notes. After installation, you can run the frontend using your preferred local server or include it in your existing project.

## Custom Domain

> ⚠️ This thing is in WIP, will share the details later!
