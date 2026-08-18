// js/dark-mode.js
// Professionel Dark Mode til Skandale.dk
// Understøtter Tailwind dark: variant, localStorage og system preference
// Robust håndtering af dynamisk injiceret toggle-knap fra navbar.js

(function() {
    'use strict';

    const html = document.documentElement;
    const storageKey = 'theme';

    function getPreferredTheme() {
        const legacyDarkMode = localStorage.getItem('darkMode');
        if (legacyDarkMode !== null && !localStorage.getItem(storageKey)) {
            const migrated = legacyDarkMode === 'true' ? 'dark' : 'light';
            localStorage.setItem(storageKey, migrated);
            localStorage.removeItem('darkMode');
            return migrated;
        }

        if (localStorage.getItem(storageKey)) {
            return localStorage.getItem(storageKey);
        }
        return 'dark';
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            html.classList.add('dark');
            localStorage.setItem(storageKey, 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem(storageKey, 'light');
        }
    }

    // Anvend tema med det samme for at undgå flash ved sideskift
    setTheme(getPreferredTheme());

    function toggleTheme() {
        const current = html.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        updateIcon();
    }

    function updateIcon() {
        const toggleBtn = document.getElementById('theme-toggle') || document.querySelector('[data-theme-toggle]');
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('i');
        if (!icon) return;

        const isDark = html.classList.contains('dark');

        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    function setupToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle') || document.querySelector('[data-theme-toggle]');
        if (!toggleBtn) return false;

        if (!toggleBtn.dataset.themeListenerAttached) {
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                toggleTheme();
            });
            toggleBtn.dataset.themeListenerAttached = 'true';
        }

        updateIcon();

        const observer = new MutationObserver(updateIcon);
        observer.observe(html, { attributes: true, attributeFilter: ['class'] });

        return true;
    }

    function initDarkMode() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(storageKey)) {
                setTheme(e.matches ? 'dark' : 'light');
                updateIcon();
            }
        });

        const attached = setupToggleButton();

        if (!attached) {
            const observer = new MutationObserver(() => {
                if (setupToggleButton()) {
                    observer.disconnect();
                }
            });
            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });

            setTimeout(setupToggleButton, 300);
            setTimeout(setupToggleButton, 800);
            setTimeout(setupToggleButton, 1500);
        }

        window.toggleTheme = toggleTheme;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDarkMode);
    } else {
        initDarkMode();
    }
})();