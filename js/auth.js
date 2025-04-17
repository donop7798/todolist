export function handleAuth() {
    function decodeUsername(encoded) {
        try {
            return decodeURIComponent(atob(encoded));
        } catch (e) {
            console.error("Error decoding username:", e);
            return null;
        }
    }

    const encodedUsername = sessionStorage.getItem('todo_username') || localStorage.getItem('todo_username_fallback');
    if (!encodedUsername) {
        console.log("No username found in sessionStorage or localStorage");
        if (!navigator.onLine) {
            const offlineLogin = document.getElementById('offline-login');
            const container = document.querySelector('.container');
            if (offlineLogin && container) {
                offlineLogin.style.display = 'block';
                container.style.display = 'none';
            } else {
                console.error("Offline login or container element not found");
            }
        } else {
            console.log("Redirecting to index.html due to missing username");
            window.location.href = '/tools/dailish/index.html';
        }
        return null;
    }

    const username = decodeUsername(encodedUsername);
    if (!username) {
        console.error("Invalid username, redirecting to index.html");
        window.location.href = '/tools/dailish/index.html';
        return null;
    }

    console.log("User authenticated:", username);
    return { username, encodedUsername };
}

export function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("Logging out...");
            sessionStorage.removeItem('todo_username');
            localStorage.removeItem('todo_username_fallback');
            window.location.href = '/tools/dailish/index.html';
        });
    } else {
        console.error("Logout button not found");
    }
}