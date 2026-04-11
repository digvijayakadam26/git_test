# Project Manager - Professional Task & Project Management

A modern, feature-rich HTML/CSS/JavaScript project management application with an intuitive UI and comprehensive functionality.

## Features

### 📊 Dashboard
- Clean, professional sidebar navigation
- Real-time statistics (total projects, active projects)
- Responsive grid layout for project cards

### 🎯 Project Management
- **Create Projects** - Add new projects with name, description, priority, and due date
- **View Projects** - See all projects in an attractive card layout
- **Edit Projects** - Modify project details anytime
- **Delete Projects** - Remove projects with confirmation
- **Mark Complete** - Toggle project completion status

### ✅ Task Management
- Add tasks to individual projects
- Mark tasks as complete/incomplete
- Set priority levels for tasks (Low, Medium, High)
- Delete tasks
- Track task progress with completion counts

### 🔍 Filtering & Organization
- **All Projects** - View entire project list
- **Active** - Filter only active projects
- **Completed** - View finished projects
- **High Priority** - Quick access to urgent projects

### 🎨 Modern UI
- Gradient backgrounds and smooth animations
- Priority-based color coding (Red = High, Yellow = Medium, Green = Low)
- Responsive design for desktop and tablet devices
- Beautiful hover effects and transitions
- Professional typography and spacing

### 💾 Data Persistence
- Auto-save to browser's local storage
- Projects persist across sessions
- Pre-loaded with sample projects for demonstration

## Getting Started

1. **Open the Application**
   - Open `index.html` in any modern web browser
   - No server or installation required!

2. **Create Your First Project**
   - Click the "➕ New Project" button
   - Fill in project details:
     - **Project Name** (required)
     - **Description** (optional)
     - **Priority Level** (Low, Medium, High)
     - **Due Date** (optional)
   - Click "Create Project"

3. **Add Tasks to a Project**
   - Click on any project card to view details
   - Click "Add Task" button
   - Enter task name and select priority
   - Click "Add Task"

4. **Manage Projects**
   - **Mark Done**: Click "⏳ Mark Done" to complete a project
   - **View Details**: Click the "👁️" button or project card to see full details
   - **Delete**: Click "🗑️" to remove a project

5. **Filter Projects**
   - Use sidebar navigation to filter by status or priority
   - Statistics update in real-time

## Project Structure

```
project-manager/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # Core application logic
└── README.md           # This file
```

## Technical Details

### Built With
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, Gradients
- **Vanilla JavaScript** - No dependencies required

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any modern browser with ES6 support

### Data Storage
- Uses browser's `localStorage` API
- Data persists even after browser closes
- Each project stores: ID, name, description, priority, due date, tasks, and status

## Customization

### Colors & Theme
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;      /* Change primary color */
    --secondary-color: #8b5cf6;    /* Change secondary color */
    --success-color: #10b981;      /* Change success color */
    /* ... more colors ... */
}
```

### Priority Colors
Modify priority styling in `styles.css`:
- `.priority-badge.high` - High priority color
- `.priority-badge.medium` - Medium priority color
- `.priority-badge.low` - Low priority color

## Tips & Tricks

1. **Keyboard Navigation** - Most modern browsers support tab navigation through all interactive elements
2. **Quick Actions** - Hover over project cards to see quick action buttons
3. **Responsive** - The app adapts to different screen sizes automatically
4. **Real-time Updates** - All changes are automatically saved to local storage

## Future Enhancement Ideas

- 🔐 User authentication
- ☁️ Cloud synchronization
- 👥 Team collaboration
- 📅 Calendar view
- 🔔 Notifications & reminders
- 📊 Analytics & reporting
- 🏷️ Tags & categories
- 📎 File attachments
- 💬 Comments & discussions
- 🔄 Recurring tasks

## License

Free to use and modify for personal or commercial projects.

---

**Made with ❤️ for productivity**
