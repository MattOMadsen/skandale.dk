// js/navbar.js - Central og moderne navbar med mobil menu
// 1 fil = 1 ansvar: Alt relateret til navigation

function loadNavbar() {
    const navbarHTML = `
        <div class="site-top no-print">
        <nav class="house-switch no-print" aria-label="Vælg sted">
            <div class="house-switch__inner">
                <a href="https://mattomadsen.github.io/folketsmedie/">Folkets Medie</a>
                <a href="https://mattomadsen.github.io/folketsmedie/skandale/" aria-current="page">Skandaler</a>
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
        <nav class="fm-local-nav no-print">
            <div class="fm-local-nav__inner">
                <a class="fm-logo" href="index.html">Skand<span>aler</span> <small>Opslag</small></a>
                <div class="fm-nav hidden md:flex">
                    <a href="index.html">Politikere</a>
                    <a href="tidslinje.html">Tidslinje</a>
                    <a href="sammenlign.html">Sammenlign</a>
                    <a href="netvaerk.html">Netværk</a>
                    <a href="om.html">Om</a>
                    <a href="om.html#doner">Støt</a>
                </div>
                <button id="mobile-menu-button"
                        class="md:hidden w-10 h-10 flex items-center justify-center text-xl text-[#c8c4bb]"
                        aria-label="Åbn menu">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </nav>
        </div>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu" class="hidden fixed inset-0 bg-black/60 z-[200] md:hidden">
            <div class="fm-drawer w-4/5 max-w-xs h-full flex flex-col" onclick="event.target.closest('#mobile-menu-content') || closeMobileMenu()">
                <div id="mobile-menu-content" class="flex flex-col h-full">
                    <div class="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                        <div class="font-bold text-xl text-[#f2f0eb]">Skandaler</div>
                        <button onclick="closeMobileMenu()" class="text-3xl text-[#8b918c] hover:text-white">×</button>
                    </div>
                    <div class="flex-1 px-2 py-4 text-lg">
                        <a href="index.html" class="block px-4 py-3 rounded-xl text-[#f2f0eb] hover:bg-white/5">Politikere</a>
                        <a href="tidslinje.html" class="block px-4 py-3 rounded-xl text-[#f2f0eb] hover:bg-white/5">Tidslinje</a>
                        <a href="sammenlign.html" class="block px-4 py-3 rounded-xl text-[#f2f0eb] hover:bg-white/5">Sammenlign</a>
                        <a href="stats.html" class="block px-4 py-3 rounded-xl text-[#f2f0eb] hover:bg-white/5">Statistik</a>
                        <a href="netvaerk.html" class="block px-4 py-3 rounded-xl text-[#f2f0eb] hover:bg-white/5">Netværk</a>
                        <a href="om.html" onclick="closeMobileMenu()" class="block px-4 py-3 rounded-xl text-[#f2f0eb] hover:bg-white/5">Om</a>
                        <a href="om.html#doner" onclick="closeMobileMenu()" class="block px-4 py-3 rounded-xl text-[#f2f0eb] hover:bg-white/5">Støt</a>
                        <a href="kontakt.html" onclick="closeMobileMenu()" class="block px-4 py-3 rounded-xl text-[#f2f0eb] hover:bg-white/5">Kontakt</a>
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

        link.setAttribute('aria-current', 'page');
        link.classList.add('is-on');
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