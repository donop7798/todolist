export function setupInstallPrompt() {
    let deferredPrompt = null;
    const installPrompt = document.getElementById('install-prompt');
    const dismissInstallBtn = document.getElementById('dismiss-install');
    const installConfirm = document.getElementById('install-confirm');
    const installNowBtn = document.getElementById('install-now');
    const installLaterBtn = document.getElementById('install-later');
    const hasSeenPrompt = localStorage.getItem('has_seen_install_prompt');
    const hasSeenConfirm = localStorage.getItem('has_seen_install_confirm');

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt fired');
        e.preventDefault();
        deferredPrompt = e;
    });

    if (!hasSeenPrompt) {
        setTimeout(() => {
            installPrompt.classList.add('visible');
            localStorage.setItem('has_seen_install_prompt', 'true');
        }, 3000);
    }

    if (dismissInstallBtn) {
        dismissInstallBtn.addEventListener('click', () => {
            installPrompt.classList.remove('visible');
            if (!hasSeenConfirm && deferredPrompt) {
                installConfirm.classList.add('visible');
                localStorage.setItem('has_seen_install_confirm', 'true');
            }
        });
    }

    if (installNowBtn) {
        installNowBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                console.log('Triggering install prompt');
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('Install prompt outcome:', outcome);
                deferredPrompt = null;
            }
            installConfirm.classList.remove('visible');
        });
    }

    if (installLaterBtn) {
        installLaterBtn.addEventListener('click', () => {
            console.log('User dismissed install confirm');
            installConfirm.classList.remove('visible');
        });
    }
}