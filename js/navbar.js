// js/navbar.js - Central og moderne navbar med mobil menu
// 1 fil = 1 ansvar: Alt relateret til navigation

function loadNavbar() {
    const navbarHTML = `
        <div class="site-top no-print">
        <nav class="house-switch no-print" aria-label="Vælg sted">
            <div class="house-switch__inner">
                <a href="https://mattomadsen.github.io/folketsmedie/">Folkets Medie</a>
                <a href="https://mattomadsen.github.io/skandale.dk/" aria-current="page">Skandale</a>
                <a href="https://mattomadsen.github.io/skattejaegeren/">Skattejægeren</a>
            </div>
        </nav>
        <div class="support-bar no-print" role="region" aria-label="Støt projektet">
            <p>
                Hjælp med at få projektet ud på en rigtig hjemmeside.
                <a href="om.html#doner">Støt os</a>
            </p>
        </div>
        <!-- Desktop + Tablet Navbar -->
        <nav class="bg-white dark:bg-slate-900 border-b no-print">
            <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <!-- Logo -->
                <div class="flex items-center gap-x-3">
                    <div class="w-10 h-10 bg-[#C8102E] rounded-2xl flex items-center justify-center">
                        <i class="fa-solid fa-balance-scale text-white text-2xl"></i>
                    </div>
                    <div>
                        <div class="font-bold text-2xl tracking-tight">Skandale.dk</div>
                        <div class="text-[10px] text-slate-500 dark:text-slate-400 -mt-1">Politisk gennemsigtighed</div>
                    </div>
                </div>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center gap-x-8 text-sm font-medium">
                    <a href="index.html" class="nav-link text-slate-600 dark:text-slate-300 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors">Politikere</a>
                    <a href="tidslinje.html" class="nav-link text-slate-600 dark:text-slate-300 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors">Tidslinje</a>
                    <a href="sammenlign.html" class="nav-link text-slate-600 dark:text-slate-300 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors">Sammenlign</a>
                    <a href="stats.html" class="nav-link text-slate-600 dark:text-slate-300 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors">Statistik</a>
                    <a href="netvaerk.html" class="nav-link text-slate-600 dark:text-slate-300 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors">Netværk</a>
                    <a href="om.html" class="nav-link text-slate-600 dark:text-slate-300 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors">Om</a>
                    <a href="om.html#doner" class="nav-link text-slate-600 dark:text-slate-300 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors">Støt</a>
                    <a href="kontakt.html" class="nav-link text-slate-600 dark:text-slate-300 hover:text-[#C8102E] dark:hover:text-[#C8102E] transition-colors">Kontakt</a>
                </div>

                <!-- Right side -->
                <div class="flex items-center gap-x-3">
                    <div id="navbar-version" class="hidden md:block text-xs px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 font-mono"></div>
                    
                    <!-- Dark mode toggle -->
                    <button id="theme-toggle" 
                            class="w-10 h-10 flex items-center justify-center text-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="Skift mellem lyst og mørkt tema">
                        <i class="fas fa-moon"></i>
                    </button>
                    
                    <!-- Mobile menu button -->
                    <button id="mobile-menu-button" 
                            class="md:hidden w-10 h-10 flex items-center justify-center text-2xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="Åbn menu">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
        </nav>
        </div>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu" class="hidden fixed inset-0 bg-black/60 z-[200] md:hidden">
            <div class="bg-white dark:bg-slate-800 w-4/5 max-w-xs h-full shadow-xl flex flex-col" onclick="event.target.closest('#mobile-menu-content') || closeMobileMenu()">
                <div id="mobile-menu-content" class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div class="flex items-center gap-x-3">
                            <div class="w-9 h-9 bg-[#C8102E] rounded-2xl flex items-center justify-center">
                                <i class="fa-solid fa-balance-scale text-white text-xl"></i>
                            </div>
                            <div class="font-bold text-xl">Skandale.dk</div>
                        </div>
                        <button onclick="closeMobileMenu()" class="text-3xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">×</button>
                    </div>

                    <!-- Links -->
                    <div class="flex-1 px-2 py-4 text-lg">
                        <a href="index.html" class="block px-4 py-3 rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Politikere</a>
                        <a href="tidslinje.html" class="block px-4 py-3 rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Tidslinje</a>
                        <a href="sammenlign.html" class="block px-4 py-3 rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Sammenlign</a>
                        <a href="stats.html" class="block px-4 py-3 rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Statistik</a>
                        <a href="netvaerk.html" class="block px-4 py-3 rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Netværk</a>
                        <a href="om.html" onclick="closeMobileMenu()" class="block px-4 py-3 rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Om projektet</a>
                        <a href="om.html#doner" onclick="closeMobileMenu()" class="block px-4 py-3 rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Støt os</a>
                        <a href="kontakt.html" onclick="closeMobileMenu()" class="block px-4 py-3 rounded-xl text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700">Kontakt</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Indsæt navbaren
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    if (window.self !== window.top) {
        document.querySelectorAll('.house-switch, .support-bar').forEach((el) => el.remove());
    }

    highlightActiveNavLink();
    populateNavbarVersion();

    // Initialiser mobil menu
    initMobileMenu();
}

function highlightActiveNavLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a[href], #mobile-menu a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return;

        const isActive = href === current || (current === '' && href === 'index.html');
        if (!isActive) return;

        link.classList.add('text-[#C8102E]', 'font-semibold');
        link.classList.remove('text-slate-600', 'dark:text-slate-300', 'hover:text-[#C8102E]', 'dark:hover:text-[#C8102E]');
    });
}

function populateNavbarVersion() {
    const el = document.getElementById('navbar-version');
    if (el && typeof APP_VERSION !== 'undefined') {
        el.textContent = APP_VERSION;
    }
}

function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuButton || !mobileMenu) return;

    // Åbn mobil menu
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        document.body.style.overflow = 'hidden';
    });

    // Luk når man klikker på overlayet
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    mobileMenu.classList.remove('flex');
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
}

// Gør closeMobileMenu globalt tilgængelig
window.closeMobileMenu = closeMobileMenu;

function redirectStandaloneToFolketsMedie() {
    if (window.self !== window.top) return;
    if (location.hostname !== 'mattomadsen.github.io') return;
    if (!/\/skandale\.dk(\/|$)/i.test(location.pathname)) return;
    const dest = 'https://mattomadsen.github.io/folketsmedie/skandale/' + location.search + location.hash;
    location.replace(dest);
}

// Auto-load navbar når scriptet er indlæst
document.addEventListener('DOMContentLoaded', () => {
    redirectStandaloneToFolketsMedie();
    loadNavbar();
});