import { 
    loadTasks, // Tambah impor loadTasks
    setCurrentEditingTask, 
    renderTasks as originalRenderTasks, 
    addTask, 
    toggleTaskComplete, 
    saveEditedTask, 
    deleteTask, 
    exportAllTasksToTXT, 
    getAllCategories, 
    getAvailableIcons, 
    setCurrentFilter, 
    setCurrentSort, 
    setCurrentActiveSort, 
    setCurrentSearch 
} from './tasks.js';

export function setupUI(encodedUsername, username, animateAddTask) {
    const elements = {
        usernameDisplay: document.getElementById('username-display'),
        userAvatar: document.getElementById('user-avatar'),
        taskList: document.getElementById('task-list'),
        emptyState: document.getElementById('empty-state'),
        addTaskForm: document.getElementById('add-task-form'),
        taskTitleInput: document.getElementById('task-title'),
        taskBriefInput: document.getElementById('task-brief'),
        taskCategoryInput: document.getElementById('task-category'),
        taskCategoryIconSelect: document.getElementById('task-category-icon'),
        taskIconDisplay: document.getElementById('task-icon-display'),
        taskIconOptions: document.getElementById('task-icon-options'),
        categorySuggestions: document.getElementById('category-suggestions'),
        taskPrioritySelect: document.getElementById('task-priority'),
        taskDeadlineInput: document.getElementById('task-deadline'),
        addTaskBtn: document.getElementById('add-task-btn'),
        cancelTaskBtn: document.getElementById('cancel-task-btn'),
        filterAllBtn: document.getElementById('filter-all'),
        filterActiveBtn: document.getElementById('filter-active'),
        filterCompletedBtn: document.getElementById('filter-completed'),
        sortSelect: document.getElementById('sort-select'),
        activeSortSelect: document.getElementById('active-sort-select'),
        searchBtn: document.getElementById('search-btn'),
        searchBar: document.getElementById('search-bar'),
        searchInput: document.getElementById('search-input'),
        settingsPanel: document.getElementById('settings-panel'),
        hamburgerMenu: document.getElementById('hamburger-menu'),
        closeSettingsBtn: document.getElementById('close-settings'),
        exportAllTxtBtn: document.getElementById('export-all-txt'),
        fab: document.getElementById('fab'),
        celebration: document.getElementById('celebration'),
        celebrationOverlay: document.getElementById('celebration-overlay'),
        editTaskForm: document.getElementById('edit-task-form'),
        editTaskTitleInput: document.getElementById('edit-task-title'),
        editTaskBriefInput: document.getElementById('edit-task-brief'),
        editTaskCategoryInput: document.getElementById('edit-task-category'),
        editTaskCategoryIconSelect: document.getElementById('edit-task-category-icon'),
        editTaskIconDisplay: document.getElementById('edit-task-icon-display'),
        editTaskIconOptions: document.getElementById('edit-task-icon-options'),
        editCategorySuggestions: document.getElementById('edit-category-suggestions'),
        editTaskPrioritySelect: document.getElementById('edit-task-priority'),
        editTaskDeadlineInput: document.getElementById('edit-task-deadline'),
        editTaskRevisionInput: document.getElementById('edit-task-revision'),
        saveEditBtn: document.getElementById('save-edit-btn'),
        cancelEditBtn: document.getElementById('cancel-edit-btn')
    };

    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.warn(`Element ${key} not found in DOM`);
        }
    }

    const today = new Date().toISOString().split('T')[0];
    if (elements.taskDeadlineInput) {
        elements.taskDeadlineInput.value = today;
    }

    if (elements.usernameDisplay) {
        elements.usernameDisplay.textContent = username;
    }
    if (elements.userAvatar) {
        elements.userAvatar.textContent = username.charAt(0).toUpperCase();
    }

    function toggleAddTaskForm(show) {
        console.log("Toggling add task form:", show);
        if (show) {
            elements.editTaskForm?.classList.remove('visible');
            elements.addTaskForm?.classList.add('visible');
            elements.fab?.style.setProperty('display', 'none');
            elements.taskTitleInput?.focus();
            elements.categorySuggestions?.classList.remove('visible');
            if (elements.taskCategoryIconSelect) {
                elements.taskCategoryIconSelect.value = 'fa-tag';
            }
            if (elements.taskIconDisplay) {
                elements.taskIconDisplay.innerHTML = `<i class="fas fa-tag"></i>`;
            }
        } else {
            elements.addTaskForm?.classList.remove('visible');
            elements.fab?.style.setProperty('display', 'flex');
            if (elements.taskTitleInput) elements.taskTitleInput.value = '';
            if (elements.taskBriefInput) elements.taskBriefInput.value = '';
            if (elements.taskCategoryInput) elements.taskCategoryInput.value = '';
            if (elements.taskCategoryIconSelect) {
                elements.taskCategoryIconSelect.value = 'fa-tag';
            }
            if (elements.taskIconDisplay) {
                elements.taskIconDisplay.innerHTML = `<i class="fas fa-tag"></i>`;
            }
            if (elements.taskPrioritySelect) {
                elements.taskPrioritySelect.value = 'medium';
            }
            if (elements.taskDeadlineInput) {
                elements.taskDeadlineInput.value = today;
            }
            elements.categorySuggestions?.classList.remove('visible');
            if (elements.taskIconOptions) {
                elements.taskIconOptions.style.display = 'none';
            }
        }
    }

    function toggleEditForm(show, task) {
        console.log("Toggling edit form:", show, task);
        if (show) {
            elements.addTaskForm?.classList.remove('visible');
            setCurrentEditingTask(task);
            if (elements.editTaskTitleInput) elements.editTaskTitleInput.value = task.title;
            if (elements.editTaskBriefInput) elements.editTaskBriefInput.value = task.brief || '';
            if (elements.editTaskCategoryInput) elements.editTaskCategoryInput.value = task.category || '';
            if (elements.editTaskCategoryIconSelect) {
                elements.editTaskCategoryIconSelect.value = task.icon || 'fa-tag';
            }
            if (elements.editTaskIconDisplay) {
                elements.editTaskIconDisplay.innerHTML = `<i class="fas ${task.icon || 'fa-tag'}"></i>`;
            }
            if (elements.editTaskPrioritySelect) {
                elements.editTaskPrioritySelect.value = task.priority;
            }
            if (elements.editTaskDeadlineInput) {
                elements.editTaskDeadlineInput.value = task.deadline;
            }
            if (elements.editTaskRevisionInput) {
                elements.editTaskRevisionInput.value = '';
            }
            elements.editTaskForm?.classList.add('visible');
            elements.editCategorySuggestions?.classList.remove('visible');
        } else {
            elements.editTaskForm?.classList.remove('visible');
            setCurrentEditingTask(null);
            elements.editCategorySuggestions?.classList.remove('visible');
            if (elements.editTaskIconOptions) {
                elements.editTaskIconOptions.style.display = 'none';
            }
        }
    }

    function toggleSettingsPanel(show) {
        console.log("Toggling settings panel:", show);
        if (show) {
            elements.settingsPanel?.classList.add('visible');
        } else {
            elements.settingsPanel?.classList.remove('visible');
        }
    }

    function showCelebration() {
        console.log("Showing celebration...");
        if (elements.celebration && elements.celebrationOverlay) {
            elements.celebration.classList.add('show');
            elements.celebrationOverlay.classList.add('show');
            setTimeout(() => {
                elements.celebration.classList.remove('show');
                elements.celebrationOverlay.classList.remove('show');
            }, 2000);
        }
    }

    function changeTheme(theme) {
        console.log("Changing theme to:", theme);
        document.body.className = theme === 'light' ? '' : `${theme}-mode`;
        localStorage.setItem('todo_theme', theme);
        toggleSettingsPanel(false);
    }

    function applySavedTheme() {
        const savedTheme = localStorage.getItem('todo_theme');
        if (savedTheme) {
            console.log("Applying saved theme:", savedTheme);
            changeTheme(savedTheme);
        }
    }

    function showCategorySuggestions(input, suggestionContainer, iconSelect, iconDisplay) {
        if (!input || !suggestionContainer) return;
        const value = input.value.trim().toLowerCase();
        suggestionContainer.innerHTML = '';

        if (!value && getAllCategories().length === 0) {
            suggestionContainer.classList.remove('visible');
            return;
        }

        const filteredCategories = value
            ? getAllCategories().filter(category => category.toLowerCase().includes(value))
            : getAllCategories();

        if (filteredCategories.length > 0) {
            filteredCategories.forEach(category => {
                const suggestion = document.createElement('div');
                suggestion.className = 'category-suggestion';
                const task = tasks.find(t => t.category === category);
                const icon = task ? task.icon : 'fa-tag';
                suggestion.innerHTML = `<i class="fas ${icon}"></i> ${category}`;
                suggestion.addEventListener('click', () => {
                    input.value = category;
                    if (iconSelect) iconSelect.value = icon;
                    if (iconDisplay) iconDisplay.innerHTML = `<i class="fas ${icon}"></i>`;
                    suggestionContainer.classList.remove('visible');
                });
                suggestionContainer.appendChild(suggestion);
            });
            suggestionContainer.classList.add('visible');
        } else {
            suggestionContainer.classList.remove('visible');
        }
    }

    if (elements.taskIconDisplay && elements.taskIconOptions && elements.taskCategoryIconSelect) {
        elements.taskIconDisplay.addEventListener('click', () => {
            elements.taskIconOptions.style.display = elements.taskIconOptions.style.display === 'none' ? 'block' : 'none';
        });

        elements.taskIconOptions.querySelectorAll('.icon-option').forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                elements.taskCategoryIconSelect.value = value;
                elements.taskIconDisplay.innerHTML = `<i class="fas ${value}"></i>`;
                elements.taskIconOptions.style.display = 'none';
            });
        });

        elements.taskCategoryIconSelect.addEventListener('change', () => {
            elements.taskIconDisplay.innerHTML = `<i class="fas ${elements.taskCategoryIconSelect.value}"></i>`;
        });

        document.addEventListener('click', (e) => {
            if (!elements.taskIconDisplay.contains(e.target) && !elements.taskIconOptions.contains(e.target)) {
                elements.taskIconOptions.style.display = 'none';
            }
        });
    }

    if (elements.editTaskIconDisplay && elements.editTaskIconOptions && elements.editTaskCategoryIconSelect) {
        elements.editTaskIconDisplay.addEventListener('click', () => {
            elements.editTaskIconOptions.style.display = elements.editTaskIconOptions.style.display === 'none' ? 'block' : 'none';
        });

        elements.editTaskIconOptions.querySelectorAll('.icon-option').forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                elements.editTaskCategoryIconSelect.value = value;
                elements.editTaskIconDisplay.innerHTML = `<i class="fas ${value}"></i>`;
                elements.editTaskIconOptions.style.display = 'none';
            });
        });

        elements.editTaskCategoryIconSelect.addEventListener('change', () => {
            elements.editTaskIconDisplay.innerHTML = `<i class="fas ${elements.editTaskCategoryIconSelect.value}"></i>`;
        });

        document.addEventListener('click', (e) => {
            if (!elements.editTaskIconDisplay.contains(e.target) && !elements.editTaskIconOptions.contains(e.target)) {
                elements.editTaskIconOptions.style.display = 'none';
            }
        });
    }

    // Filter buttons
    if (elements.filterAllBtn) {
        elements.filterAllBtn.addEventListener('click', async () => {
            console.log("Clicked filter: All tasks");
            try {
                setCurrentFilter('all');
                elements.filterAllBtn.classList.add('active');
                elements.filterActiveBtn?.classList.remove('active');
                elements.filterCompletedBtn?.classList.remove('active');
                if (elements.activeSortSelect) {
                    elements.activeSortSelect.style.display = 'none';
                }
                await loadTasks(encodedUsername, wrappedRenderTasks);
            } catch (error) {
                console.error("Error filtering all tasks:", error);
            }
        });
    } else {
        console.error("Filter All button not found");
    }

    if (elements.filterActiveBtn) {
        elements.filterActiveBtn.addEventListener('click', async () => {
            console.log("Clicked filter: Active tasks");
            try {
                setCurrentFilter('active');
                elements.filterActiveBtn.classList.add('active');
                elements.filterAllBtn?.classList.remove('active');
                elements.filterCompletedBtn?.classList.remove('active');
                if (elements.activeSortSelect) {
                    elements.activeSortSelect.style.display = 'block';
                }
                await loadTasks(encodedUsername, wrappedRenderTasks);
            } catch (error) {
                console.error("Error filtering active tasks:", error);
            }
        });
    } else {
        console.error("Filter Active button not found");
    }

    if (elements.filterCompletedBtn) {
        elements.filterCompletedBtn.addEventListener('click', async () => {
            console.log("Clicked filter: Completed tasks");
            try {
                setCurrentFilter('completed');
                elements.filterCompletedBtn.classList.add('active');
                elements.filterAllBtn?.classList.remove('active');
                elements.filterActiveBtn?.classList.remove('active');
                if (elements.activeSortSelect) {
                    elements.activeSortSelect.style.display = 'none';
                }
                await loadTasks(encodedUsername, wrappedRenderTasks);
            } catch (error) {
                console.error("Error filtering completed tasks:", error);
            }
        });
    } else {
        console.error("Filter Completed button not found");
    }

    // Sort selects
    if (elements.sortSelect) {
        elements.sortSelect.addEventListener('change', async () => {
            console.log("Sorting tasks by:", elements.sortSelect.value);
            try {
                setCurrentSort(elements.sortSelect.value);
                await loadTasks(encodedUsername, wrappedRenderTasks);
            } catch (error) {
                console.error("Error sorting tasks:", error);
            }
        });
    } else {
        console.error("Sort select not found");
    }

    if (elements.activeSortSelect) {
        elements.activeSortSelect.addEventListener('change', async () => {
            console.log("Active sorting tasks by:", elements.activeSortSelect.value);
            try {
                setCurrentActiveSort(elements.activeSortSelect.value);
                await loadTasks(encodedUsername, wrappedRenderTasks);
            } catch (error) {
                console.error("Error active sorting tasks:", error);
            }
        });
    } else {
        console.error("Active sort select not found");
    }

    // Search
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', () => {
            console.log("Toggling search bar");
            elements.searchBar?.classList.toggle('visible');
            if (elements.searchBar?.classList.contains('visible')) {
                elements.searchInput?.focus();
            } else {
                if (elements.searchInput) elements.searchInput.value = '';
                setCurrentSearch('');
                loadTasks(encodedUsername, wrappedRenderTasks).catch(error => {
                    console.error("Error resetting search:", error);
                });
            }
        });
    }

    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', async () => {
            console.log("Searching tasks:", elements.searchInput.value);
            try {
                setCurrentSearch(elements.searchInput.value);
                await loadTasks(encodedUsername, wrappedRenderTasks);
            } catch (error) {
                console.error("Error searching tasks:", error);
            }
        });
    }

    // Task form buttons
    if (elements.cancelTaskBtn) {
        elements.cancelTaskBtn.addEventListener('click', () => {
            console.log("Cancel adding task");
            toggleAddTaskForm(false);
        });
    }

    if (elements.addTaskBtn) {
        elements.addTaskBtn.addEventListener('click', () => {
            const taskData = {
                title: elements.taskTitleInput?.value.trim() || '',
                brief: elements.taskBriefInput?.value.trim() || '',
                category: elements.taskCategoryInput?.value.trim() || '',
                icon: elements.taskCategoryIconSelect?.value || 'fa-tag',
                priority: elements.taskPrioritySelect?.value || 'medium',
                deadline: elements.taskDeadlineInput?.value || today
            };
            addTask(taskData, encodedUsername, toggleAddTaskForm, animateAddTask);
        });
        elements.taskTitleInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log("Enter pressed, adding task");
                const taskData = {
                    title: elements.taskTitleInput?.value.trim() || '',
                    brief: elements.taskBriefInput?.value.trim() || '',
                    category: elements.taskCategoryInput?.value.trim() || '',
                    icon: elements.taskCategoryIconSelect?.value || 'fa-tag',
                    priority: elements.taskPrioritySelect?.value || 'medium',
                    deadline: elements.taskDeadlineInput?.value || today
                };
                addTask(taskData, encodedUsername, toggleAddTaskForm, animateAddTask);
            }
        });
    }

    if (elements.saveEditBtn) {
        elements.saveEditBtn.addEventListener('click', () => {
            const taskData = {
                title: elements.editTaskTitleInput?.value.trim() || '',
                brief: elements.editTaskBriefInput?.value.trim() || '',
                category: elements.editTaskCategoryInput?.value.trim() || '',
                icon: elements.editTaskCategoryIconSelect?.value || 'fa-tag',
                priority: elements.editTaskPrioritySelect?.value || 'medium',
                deadline: elements.editTaskDeadlineInput?.value || today,
                revisionNote: elements.editTaskRevisionInput?.value.trim() || ''
            };
            saveEditedTask(taskData, encodedUsername, toggleEditForm);
        });
    }

    if (elements.cancelEditBtn) {
        elements.cancelEditBtn.addEventListener('click', () => {
            console.log("Cancel editing task");
            toggleEditForm(false);
        });
    }

    // Settings
    if (elements.hamburgerMenu) {
        elements.hamburgerMenu.addEventListener('click', () => {
            console.log("Opening settings panel");
            toggleSettingsPanel(true);
        });
    }

    if (elements.closeSettingsBtn) {
        elements.closeSettingsBtn.addEventListener('click', () => {
            console.log("Closing settings panel");
            toggleSettingsPanel(false);
        });
    }

    if (elements.exportAllTxtBtn) {
        elements.exportAllTxtBtn.addEventListener('click', () => {
            exportAllTasksToTXT(encodedUsername, username, toggleSettingsPanel);
        });
    }

    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            console.log("Theme selected:", option.dataset.theme);
            changeTheme(option.dataset.theme);
        });
    });

    if (elements.fab) {
        elements.fab.addEventListener('click', () => {
            console.log("FAB clicked, opening add task form");
            toggleAddTaskForm(true);
        });
    }

    // Category suggestions
    if (elements.taskCategoryInput) {
        elements.taskCategoryInput.addEventListener('input', () => {
            showCategorySuggestions(elements.taskCategoryInput, elements.categorySuggestions, elements.taskCategoryIconSelect, elements.taskIconDisplay);
        });
        elements.taskCategoryInput.addEventListener('focus', () => {
            showCategorySuggestions(elements.taskCategoryInput, elements.categorySuggestions, elements.taskCategoryIconSelect, elements.taskIconDisplay);
        });
        elements.taskCategoryInput.addEventListener('blur', () => {
            setTimeout(() => {
                elements.categorySuggestions?.classList.remove('visible');
            }, 200);
        });
    }

    if (elements.editTaskCategoryInput) {
        elements.editTaskCategoryInput.addEventListener('input', () => {
            showCategorySuggestions(elements.editTaskCategoryInput, elements.editCategorySuggestions, elements.editTaskCategoryIconSelect, elements.editTaskIconDisplay);
        });
        elements.editTaskCategoryInput.addEventListener('focus', () => {
            showCategorySuggestions(elements.editTaskCategoryInput, elements.editCategorySuggestions, elements.editTaskCategoryIconSelect, elements.editTaskIconDisplay);
        });
        elements.editTaskCategoryInput.addEventListener('blur', () => {
            setTimeout(() => {
                elements.editCategorySuggestions?.classList.remove('visible');
            }, 200);
        });
    }

    applySavedTheme();

    function attachTaskEventListeners() {
        console.log("Attaching task event listeners...");
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.removeEventListener('click', handleEdit);
            btn.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.removeEventListener('click', handleDelete);
            btn.addEventListener('click', handleDelete);
        });

        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.removeEventListener('change', handleCheckbox);
            checkbox.addEventListener('change', handleCheckbox);
        });

        document.querySelectorAll('.task-header').forEach(header => {
            header.removeEventListener('click', handleTaskHeader);
            header.addEventListener('click', handleTaskHeader);
        });
    }

    function handleEdit(e) {
        const taskId = e.currentTarget.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            console.log("Editing task:", taskId);
            toggleEditForm(true, task);
        } else {
            console.error("Task not found:", taskId);
        }
    }

    function handleDelete(e) {
        const taskId = e.currentTarget.dataset.id;
        deleteTask(taskId, encodedUsername);
    }

    function handleCheckbox(e) {
        const taskId = e.target.closest('.task-item').dataset.id;
        toggleTaskComplete(taskId, encodedUsername, showCelebration);
    }

    function handleTaskHeader(e) {
        if (e.target.closest('button') || e.target.tagName === 'INPUT') return;
        const taskItem = e.currentTarget.closest('.task-item');
        taskItem?.classList.toggle('expanded');
    }

    function wrappedRenderTasks(tasksToRender, options) {
        console.log("Rendering tasks with options:", options);
        originalRenderTasks(tasksToRender, options);
        attachTaskEventListeners();
    }

    return { toggleAddTaskForm, toggleEditForm, toggleSettingsPanel, showCelebration, renderTasks: wrappedRenderTasks };
}