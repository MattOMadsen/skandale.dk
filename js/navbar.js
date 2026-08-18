// js/navbar.js - Central og moderne navbar med mobil menu
// 1 fil = 1 ansvar: Alt relateret til navigation

function loadNavbar() {
    const navbarHTML = `
        <div class="site-top no-print">
        <nav class="house-switch no-print" aria-label="Vælg sted">
            <div class="house-switch__inner">
                <a href="https://mattomadsen.github.io/folketsmedie/">Folkets Medie</a>
                <a href="https://mattomadsen.github.io/folketsmedie/skandale/" aria-current="page">Politiske skandaler</a>
                <a href="https://mattomadsen.github.io/skattejaegeren/">Skattejægeren</a>
            </div>
        </nav>
        <div class="support-bar no-print" role="region" aria-label="Støt projektet">
            <p>
                Hjælp med at få projektet ud på en rigtig hjemmeside.
                <a href="https://mattomadsen.github.io/folketsmedie/stoet/" target="_top">Støt os</a>
            </p>
        </div>
        <!-- Desktop + Tablet Navbar -->
        <nav class="fm-local-nav no-print">
            <div class="fm-local-nav__inner">
                <a class="fm-logo" href="index.html">Politiske <span>skandaler</span></a>
                <div class="fm-nav">
                    <a href="index.html">Politikere</a>
                    <details class="nav-drop" data-group="vaerktoejer">
                        <summary>Værktøjer</summary>
                        <div class="nav-drop__menu">
                            <a href="tidslinje.html">Tidslinje</a>
                            <a href="sammenlign.html">Sammenlign</a>
                            <a href="stats.html">Statistik</a>
                            <a href="netvaerk.html">Netværk</a>
                        </div>
                    </details>
                    <details class="nav-drop" data-group="om">
                        <summary>Om</summary>
                        <div class="nav-drop__menu">
                            <a href="https://mattomadsen.github.io/folketsmedie/om/" target="_top">Om projektet</a>
                            <a href="https://mattomadsen.github.io/folketsmedie/kontakt/" target="_top">Kontakt os</a>
                            <a href="https://mattomadsen.github.io/folketsmedie/stoet/" target="_top">Støt os</a>
                        </div>
                    </details>
                </div>
            </div>
        </nav>
        </div>
    `;

    // Indsæt navbaren
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    if (window.self !== window.top) {
        document.querySelectorAll('.house-switch, .support-bar').forEach((el) => el.remove());
    }

    highlightActiveNavLink();
}

function highlightActiveNavLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return;

        const isActive = href === current || (current === '' && href === 'index.html');
        if (!isActive) return;

        link.setAttribute('aria-current', 'page');
        link.classList.add('is-on');
    });

    const tools = ['tidslinje.html', 'sammenlign.html', 'stats.html', 'netvaerk.html'];
    if (tools.includes(current)) {
        const drop = document.querySelector('[data-group="vaerktoejer"]');
        if (drop) drop.classList.add('is-on');
    }
}

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