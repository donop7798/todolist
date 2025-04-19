import { db, doc, getDoc, setDoc } from './firebase.js';

export function setupLogin() {
    const landingButtons = document.getElementById('landing-buttons');
    const createUsernameForm = document.getElementById('create-username-form');
    const viewUsernameForm = document.getElementById('view-username-form');
    
    const createListBtn = document.getElementById('create-list-btn');
    const viewListBtn = document.getElementById('view-list-btn');
    const saveUsernameBtn = document.getElementById('save-username-btn');
    const cancelUsernameBtn = document.getElementById('cancel-username-btn');
    const loadTasksBtn = document.getElementById('load-tasks-btn');
    const cancelViewBtn = document.getElementById('cancel-view-btn');
    
    const newUsernameInput = document.getElementById('new-username');
    const existingUsernameInput = document.getElementById('existing-username');

    function encodeUsername(username) {
        return btoa(encodeURIComponent(username));
    }

    function applySavedTheme() {
        const savedTheme = localStorage.getItem('todo_theme');
        if (savedTheme) {
            console.log("Applying saved theme:", savedTheme);
            document.body.className = savedTheme === 'light' ? '' : `${savedTheme}-mode`;
        }
    }

    applySavedTheme();

    createListBtn.addEventListener('click', function() {
        landingButtons.style.display = 'none';
        createUsernameForm.classList.add('visible');
        newUsernameInput.focus();
    });

    viewListBtn.addEventListener('click', function() {
        landingButtons.style.display = 'none';
        viewUsernameForm.classList.add('visible');
        existingUsernameInput.focus();
    });

    function resetForms() {
        landingButtons.style.display = 'flex';
        createUsernameForm.classList.remove('visible');
        viewUsernameForm.classList.remove('visible');
        newUsernameInput.value = '';
        existingUsernameInput.value = '';
    }

    cancelUsernameBtn.addEventListener('click', resetForms);
    cancelViewBtn.addEventListener('click', resetForms);

    saveUsernameBtn.addEventListener('click', async function() {
        const username = newUsernameInput.value.trim();
        if (!username) {
            alert('Please enter a username');
            return;
        }

        try {
            const encodedUsername = encodeUsername(username);
            const userDocRef = doc(db, "users", encodedUsername);
            
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                alert('Username already exists. Please choose another or view your existing list.');
                return;
            }

            await setDoc(userDocRef, {
                tasks: [],
                createdAt: new Date()
            });

            sessionStorage.setItem('todo_username', encodedUsername);
            localStorage.setItem('todo_username_fallback', encodedUsername);
            window.location.href = 'app.html';
        } catch (error) {
            console.error("Error creating user: ", error);
            alert('An error occurred. Please try again.');
        }
    });

    loadTasksBtn.addEventListener('click', async function() {
        const username = existingUsernameInput.value.trim();
        if (!username) {
            alert('Please enter your username');
            return;
        }

        try {
            const encodedUsername = encodeUsername(username);
            const userDocRef = doc(db, "users", encodedUsername);
            
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                alert('Username not found. Please check your username or create a new list.');
                return;
            }

            sessionStorage.setItem('todo_username', encodedUsername);
            localStorage.setItem('todo_username_fallback', encodedUsername);
            window.location.href = 'app.html';
        } catch (error) {
            console.error("Error loading user: ", error);
            alert('An error occurred. Please try again.');
        }
    });

    newUsernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveUsernameBtn.click();
        }
    });

    existingUsernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadTasksBtn.click();
        }
    });
}
