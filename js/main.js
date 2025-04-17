import { registerServiceWorker } from './service-worker.js';
import { setupInstallPrompt } from './install-prompt.js';
import { handleAuth, setupLogout } from './auth.js';
import { loadTasks } from './tasks.js';
import { setupUI } from './ui.js';

document.addEventListener('DOMContentLoaded', async function() {
    console.log("App initializing...");
    try {
        registerServiceWorker();
        setupInstallPrompt();

        const authData = handleAuth();
        if (!authData) {
            console.log("Authentication failed, stopping initialization");
            return;
        }

        const { username, encodedUsername } = authData;
        console.log("Setting up UI and logout for user:", username);
        setupLogout();

        const { toggleAddTaskForm, toggleEditForm, toggleSettingsPanel, showCelebration, renderTasks } = setupUI(encodedUsername, username, animateAddTask);

        console.log("Loading tasks...");
        await loadTasks(encodedUsername, renderTasks);
        console.log("App initialization complete");
    } catch (error) {
        console.error("Error during app initialization:", error);
        alert("Failed to initialize app. Please try again.");
    }

    function animateAddTask() {
        console.log("Animating add task button...");
        const addTaskBtn = document.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.style.animation = 'glow 1s ease';
            setTimeout(() => {
                addTaskBtn.style.animation = '';
            }, 1000);
        } else {
            console.error("Add task button not found");
        }
    }
});