// js/mobile-menu.js - Mobil menu funktionalitet (1 fil = 1 funktion)

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
    }
}

// Eksponer globalt
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

// Event listeners for bedre praksis (når DOM er klar)
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('mobile-menu-button');
    const closeBtn = document.getElementById('mobile-menu-close');
    
    if (openBtn) {
        openBtn.addEventListener('click', toggleMobileMenu);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }
});