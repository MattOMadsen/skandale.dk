// js/dark-mode.js
// Professionel Dark Mode til Skandale.dk
// Understøtter Tailwind dark: variant, localStorage og system preference
// Automatisk initialisering + valgfri toggle-knap

(function() {
    'use strict';

    const html = document.documentElement;
    const storageKey = 'theme';

    function getPreferredTheme() {
        if (localStorage.getItem(storageKey)) {
            return localStorage.getItem(storageKey);
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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

    function toggleTheme() {
        const current = html.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Initial setup
    function initDarkMode() {
        const preferred = getPreferredTheme();
        setTheme(preferred);

        // Lyt efter system ændringer (hvis brugeren ikke har valgt manuelt)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(storageKey)) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Find toggle knap (hvis den findes i DOM)
        const toggleBtn = document.getElementById('theme-toggle') || document.querySelector('[data-theme-toggle]');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
            
            // Opdater ikon dynamisk (sun/moon)
            const updateIcon = () => {
                const isDark = html.classList.contains('dark');
                toggleBtn.innerHTML = isDark 
                    ? '<i class="fas fa-sun text-xl"></i>' 
                    : '<i class="fas fa-moon text-xl"></i>';
            };
            updateIcon();

            // Lyt på klasse-ændringer for at holde ikon opdateret
            const observer = new MutationObserver(updateIcon);
            observer.observe(html, { attributes: true, attributeFilter: ['class'] });
        }
    }

    // Kør når DOM er klar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDarkMode);
    } else {
        initDarkMode();
    }

    // Gør toggleTheme globalt tilgængelig (hvis nødvendigt til manuel brug)
    window.toggleTheme = toggleTheme;
})();