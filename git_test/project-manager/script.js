// Project Management App
class ProjectManager {
    constructor() {
        this.projects = this.loadFromStorage();
        this.currentFilter = 'all';
        this.currentEditingProjectId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Navigation filters
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.nav-btn').classList.add('active');
                this.currentFilter = e.target.closest('.nav-btn').dataset.filter;
                this.updateViewTitle();
                this.render();
            });
        });

        // Add project button
        document.getElementById('addProjectBtn').addEventListener('click', () => {
            this.openProjectModal();
        });

        // Project form submission
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });

        // Modal close buttons
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.closeProjectModal();
        });
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeProjectModal();
        });

        // Task modal close buttons
        document.getElementById('closeTaskModalBtn').addEventListener('click', () => {
            this.closeTaskModal();
        });
        document.getElementById('cancelTaskBtn').addEventListener('click', () => {
            this.closeTaskModal();
        });

        // Task form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Details modal close button
        document.getElementById('closeDetailsBtn').addEventListener('click', () => {
            this.closeDetailsModal();
        });

        // Add task button in details modal
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.openTaskModal(this.currentEditingProjectId);
        });
    }

    updateViewTitle() {
        const titles = {
            all: 'All Projects',
            active: 'Active Projects',
            completed: 'Completed Projects',
            'high-priority': 'High Priority Projects'
        };
        document.getElementById('currentView').textContent = titles[this.currentFilter] || 'All Projects';
    }

    getFilteredProjects() {
        let filtered = this.projects;

        if (this.currentFilter === 'active') {
            filtered = filtered.filter(p => !p.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(p => p.completed);
        } else if (this.currentFilter === 'high-priority') {
            filtered = filtered.filter(p => p.priority === 'high');
        }

        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    render() {
        const grid = document.getElementById('projectsGrid');
        const filtered = this.getFilteredProjects();

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="empty-state"><p>📭 No projects found</p></div>';
        } else {
            grid.innerHTML = filtered.map(project => this.createProjectCard(project)).join('');
            this.attachCardListeners();
        }

        this.updateStats();
    }

    createProjectCard(project) {
        const completedTasks = project.tasks.filter(t => t.completed).length;
        const totalTasks = project.tasks.length;
        const dueDate = project.dueDate ? new Date(project.dueDate) : null;
        const isOverdue = dueDate && dueDate < new Date() && !project.completed;
        const formattedDate = dueDate ? dueDate.toLocaleDateString() : 'No due date';

        return `
            <div class="project-card ${project.priority}" data-project-id="${project.id}">
                <div class="project-header">
                    <h3 class="project-title">${this.escapeHtml(project.name)}</h3>
                    <span class="priority-badge ${project.priority}">${project.priority}</span>
                </div>
                <p class="project-description">${this.escapeHtml(project.description)}</p>
                <div class="project-meta">
                    <div class="meta-item">
                        <span>📋</span>
                        <span>${completedTasks}/${totalTasks} tasks</span>
                    </div>
                    <div class="meta-item ${isOverdue ? 'overdue' : ''}">
                        <span>📅</span>
                        <span>${formattedDate}</span>
                    </div>
                </div>
                <div class="project-footer">
                    <div class="project-actions">
                        <button class="status-toggle ${project.completed ? 'completed' : ''}" data-action="toggle">
                            ${project.completed ? '✅ Completed' : '⏳ Mark Done'}
                        </button>
                        <button class="status-toggle" data-action="view" style="flex: 0.5;">
                            👁️
                        </button>
                        <button class="status-toggle btn-danger" data-action="delete" style="flex: 0.5;">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachCardListeners() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const projectId = parseInt(card.dataset.projectId);
                    const action = btn.dataset.action;

                    if (action === 'toggle') {
                        this.toggleProjectStatus(projectId);
                    } else if (action === 'view') {
                        this.viewProjectDetails(projectId);
                    } else if (action === 'delete') {
                        this.deleteProject(projectId);
                    }
                });
            });

            card.addEventListener('click', () => {
                this.viewProjectDetails(parseInt(card.dataset.projectId));
            });
        });
    }

    openProjectModal() {
        this.currentEditingProjectId = null;
        document.getElementById('modalTitle').textContent = 'Create New Project';
        document.getElementById('projectForm').reset();
        document.getElementById('projectModal').classList.add('active');
    }

    closeProjectModal() {
        document.getElementById('projectModal').classList.remove('active');
    }

    saveProject() {
        const name = document.getElementById('projectName').value;
        const description = document.getElementById('projectDescription').value;
        const priority = document.getElementById('projectPriority').value;
        const dueDate = document.getElementById('projectDueDate').value;

        if (this.currentEditingProjectId) {
            const project = this.projects.find(p => p.id === this.currentEditingProjectId);
            if (project) {
                project.name = name;
                project.description = description;
                project.priority = priority;
                project.dueDate = dueDate;
            }
        } else {
            const newProject = {
                id: Date.now(),
                name,
                description,
                priority,
                dueDate,
                tasks: [],
                completed: false,
                createdAt: new Date().toISOString()
            };
            this.projects.push(newProject);
        }

        this.saveToStorage();
        this.closeProjectModal();
        this.render();
    }

    toggleProjectStatus(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.completed = !project.completed;
            this.saveToStorage();
            this.render();
        }
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.saveToStorage();
            this.render();
        }
    }

    viewProjectDetails(projectId) {
        this.currentEditingProjectId = projectId;
        const project = this.projects.find(p => p.id === projectId);

        if (!project) return;

        document.getElementById('detailsTitle').textContent = project.name;
        document.getElementById('detailsDescription').textContent = project.description || 'No description';
        document.getElementById('detailsDueDate').textContent = project.dueDate ? 
            new Date(project.dueDate).toLocaleDateString() : 'No due date';

        this.renderTasks(project);
        document.getElementById('detailsModal').classList.add('active');
    }

    closeDetailsModal() {
        document.getElementById('detailsModal').classList.remove('active');
        this.currentEditingProjectId = null;
    }

    renderTasks(project) {
        const tasksList = document.getElementById('tasksList');
        
        if (project.tasks.length === 0) {
            tasksList.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 20px;">No tasks yet</p>';
            return;
        }

        tasksList.innerHTML = project.tasks.map((task, index) => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       data-task-index="${index}">
                <div class="task-content">
                    <div class="task-name">${this.escapeHtml(task.name)}</div>
                </div>
                <span class="task-priority priority-badge ${task.priority}">${task.priority}</span>
                <button class="task-delete" data-task-index="${index}">✕</button>
            </div>
        `).join('');

        // Attach task listeners
        tasksList.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.taskIndex);
                project.tasks[index].completed = e.target.checked;
                this.saveToStorage();
                this.renderTasks(project);
            });
        });

        tasksList.querySelectorAll('.task-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.dataset.taskIndex);
                project.tasks.splice(index, 1);
                this.saveToStorage();
                this.renderTasks(project);
            });
        });
    }

    openTaskModal(projectId) {
        document.getElementById('taskProjectId').value = projectId;
        document.getElementById('taskForm').reset();
        document.getElementById('taskModal').classList.add('active');
    }

    closeTaskModal() {
        document.getElementById('taskModal').classList.remove('active');
    }

    addTask() {
        const projectId = parseInt(document.getElementById('taskProjectId').value);
        const taskName = document.getElementById('taskName').value;
        const priority = document.getElementById('taskPriority').value;

        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.tasks.push({
                name: taskName,
                priority,
                completed: false,
                createdAt: new Date().toISOString()
            });
            this.saveToStorage();
            this.closeTaskModal();
            this.renderTasks(project);
        }
    }

    updateStats() {
        const total = this.projects.length;
        const active = this.projects.filter(p => !p.completed).length;

        document.getElementById('totalProjects').textContent = total;
        document.getElementById('activeProjects').textContent = active;
    }

    saveToStorage() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('projects');
        return stored ? JSON.parse(stored) : this.getDefaultProjects();
    }

    getDefaultProjects() {
        return [
            {
                id: 1,
                name: 'Website Redesign',
                description: 'Complete redesign of the company website with modern UI/UX',
                priority: 'high',
                dueDate: '2026-05-15',
                tasks: [
                    { name: 'Design mockups', priority: 'high', completed: true, createdAt: new Date().toISOString() },
                    { name: 'Set up development environment', priority: 'medium', completed: true, createdAt: new Date().toISOString() },
                    { name: 'Implement responsive design', priority: 'high', completed: false, createdAt: new Date().toISOString() },
                    { name: 'Testing and QA', priority: 'medium', completed: false, createdAt: new Date().toISOString() }
                ],
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Mobile App Development',
                description: 'Build cross-platform mobile application using React Native',
                priority: 'high',
                dueDate: '2026-06-30',
                tasks: [
                    { name: 'Project setup', priority: 'medium', completed: true, createdAt: new Date().toISOString() },
                    { name: 'Authentication module', priority: 'high', completed: false, createdAt: new Date().toISOString() }
                ],
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Documentation Update',
                description: 'Update API documentation and create user guides',
                priority: 'medium',
                dueDate: '2026-04-20',
                tasks: [
                    { name: 'Write API docs', priority: 'medium', completed: false, createdAt: new Date().toISOString() },
                    { name: 'Create video tutorials', priority: 'low', completed: false, createdAt: new Date().toISOString() }
                ],
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProjectManager();
});
