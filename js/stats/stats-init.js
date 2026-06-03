// js/stats/stats-init.js
// Initialization, dark mode, mobile menu and page load for the stats page

function initTailwind() {
    // Ensure Tailwind dark mode class strategy
    if (typeof tailwind !== 'undefined') {
        tailwind.config = { darkMode: 'class' };
    }
    // Apply saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }
}

function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    const html = document.documentElement;

    toggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('darkMode', html.classList.contains('dark'));
        
        // Update icon
        const icon = toggle.querySelector('i');
        if (icon) {
            if (html.classList.contains('dark')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun', 'text-yellow-400');
            } else {
                icon.classList.remove('fa-sun', 'text-yellow-400');
                icon.classList.add('fa-moon');
            }
        }
    });

    // Set initial icon
    const icon = toggle.querySelector('i');
    if (icon && html.classList.contains('dark')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun', 'text-yellow-400');
    }
}

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

function initStatsPage() {
    initTailwind();
    initDarkMode();
    initMobileMenu();

    // Load data and render
    if (typeof loadAllStatsData === 'function' && typeof loadPoliticians === 'function') {
        loadAllStatsData();
        loadPoliticians();                    // ← VIGTIG: Loader det globale politicians-array til modalen
    } else {
        console.error('stats-data.js or data.js not loaded correctly');
    }

    // Set initial last updated if not set by data loader
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl && !lastUpdatedEl.textContent) {
        lastUpdatedEl.textContent = new Date().toLocaleDateString('da-DK');
    }
}

// Auto init on load
window.onload = initStatsPage;

// Expose init for debugging if needed
window.initStatsPage = initStatsPage;