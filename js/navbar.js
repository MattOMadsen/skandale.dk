// js/navbar.js - Central og moderne navbar med mobil menu
// 1 fil = 1 ansvar: Alt relateret til navigation

function loadNavbar() {
    const navbarHTML = `
        <!-- Desktop + Tablet Navbar -->
        <nav class="bg-white border-b sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <!-- Logo -->
                <div class="flex items-center gap-x-3">
                    <div class="w-10 h-10 bg-[#C8102E] rounded-2xl flex items-center justify-center">
                        <i class="fa-solid fa-balance-scale text-white text-2xl"></i>
                    </div>
                    <div>
                        <div class="font-bold text-2xl tracking-tight">Skandale.dk</div>
                        <div class="text-[10px] text-slate-500 -mt-1">Politisk gennemsigtighed</div>
                    </div>
                </div>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center gap-x-8 text-sm font-medium">
                    <a href="index.html" class="nav-link text-slate-600 hover:text-[#C8102E] transition-colors">Politikere</a>
                    <a href="tidslinje.html" class="nav-link text-slate-600 hover:text-[#C8102E] transition-colors">Tidslinje</a>
                    <a href="sammenlign.html" class="nav-link text-slate-600 hover:text-[#C8102E] transition-colors">Sammenlign</a>
                    <a href="stats.html" class="nav-link text-slate-600 hover:text-[#C8102E] transition-colors">Statistik</a>
                    <a href="netvaerk.html" class="nav-link text-slate-600 hover:text-[#C8102E] transition-colors">Netværk</a>
                    <a href="#" onclick="if (typeof window.showAboutModal === 'function') window.showAboutModal()" 
                       class="nav-link text-slate-600 hover:text-[#C8102E] transition-colors">Om</a>
                </div>

                <!-- Right side -->
                <div class="flex items-center gap-x-3">
                    <div id="navbar-version" class="hidden md:block text-xs px-3 py-1 bg-slate-100 rounded-full text-slate-500 font-mono"></div>
                    
                    <!-- Mobile menu button -->
                    <button id="mobile-menu-button" 
                            class="md:hidden w-10 h-10 flex items-center justify-center text-2xl text-slate-600 hover:text-slate-900 transition-colors"
                            aria-label="Åbn menu">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
        </nav>

        <!-- Mobile Menu Overlay -->
        <div id="mobile-menu" class="hidden fixed inset-0 bg-black/60 z-[200] md:hidden">
            <div class="bg-white w-4/5 max-w-xs h-full shadow-xl flex flex-col" onclick="event.target.closest('#mobile-menu-content') || closeMobileMenu()">
                <div id="mobile-menu-content" class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="px-6 py-5 border-b flex items-center justify-between">
                        <div class="flex items-center gap-x-3">
                            <div class="w-9 h-9 bg-[#C8102E] rounded-2xl flex items-center justify-center">
                                <i class="fa-solid fa-balance-scale text-white text-xl"></i>
                            </div>
                            <div class="font-bold text-xl">Skandale.dk</div>
                        </div>
                        <button onclick="closeMobileMenu()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                    </div>

                    <!-- Links -->
                    <div class="flex-1 px-2 py-4 text-lg">
                        <a href="index.html" class="block px-4 py-3 rounded-xl hover:bg-slate-100">Politikere</a>
                        <a href="tidslinje.html" class="block px-4 py-3 rounded-xl hover:bg-slate-100">Tidslinje</a>
                        <a href="sammenlign.html" class="block px-4 py-3 rounded-xl hover:bg-slate-100">Sammenlign</a>
                        <a href="stats.html" class="block px-4 py-3 rounded-xl hover:bg-slate-100">Statistik</a>
                        <a href="netvaerk.html" class="block px-4 py-3 rounded-xl hover:bg-slate-100">Netværk</a>
                        <a href="#" onclick="closeMobileMenu(); if (typeof window.showAboutModal === 'function') window.showAboutModal()" 
                           class="block px-4 py-3 rounded-xl hover:bg-slate-100">Om projektet</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Indsæt navbaren
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    // Initialiser mobil menu
    initMobileMenu();
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

// Auto-load navbar når scriptet er indlæst
document.addEventListener('DOMContentLoaded', loadNavbar);