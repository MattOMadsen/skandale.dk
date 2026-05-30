// js/navbar.js - Central navbar med mobil menu

function loadNavbar() {
    const navbarHTML = `
        <nav class="bg-white border-b sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
                    <a href="index.html" class="text-slate-600 hover:text-[#C8102E] transition-colors">Politikere</a>
                    <a href="tidslinje.html" class="text-slate-600 hover:text-[#C8102E] transition-colors">Tidslinje</a>
                    <a href="sammenlign.html" class="text-slate-600 hover:text-[#C8102E] transition-colors">Sammenlign</a>
                    <a href="stats.html" class="text-slate-600 hover:text-[#C8102E] transition-colors">Statistik</a>
                    <a href="#" onclick="if (typeof window.showNetworkOverviewModal === 'function') window.showNetworkOverviewModal()" class="text-slate-600 hover:text-[#C8102E] transition-colors">Netværk</a>
                    <a href="#" onclick="if (typeof window.showAboutModal === 'function') window.showAboutModal()" class="text-slate-600 hover:text-[#C8102E] transition-colors">Om</a>
                </div>

                <div class="flex items-center gap-x-3">
                    <div id="navbar-version" class="hidden md:block text-xs px-3 py-1 bg-slate-100 rounded-full text-slate-500 font-mono"></div>
                    <button id="mobile-menu-button" class="md:hidden w-10 h-10 flex items-center justify-center text-2xl text-slate-600 hover:text-slate-900">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
        </nav>

        <!-- MOBILE MENU -->
        <div id="mobile-menu" class="hidden fixed inset-0 bg-white z-[200] flex flex-col md:hidden">
            <div class="px-6 py-4 border-b flex items-center justify-between">
                <div class="flex items-center gap-x-3">
                    <div class="w-9 h-9 bg-[#C8102E] rounded-2xl flex items-center justify-center">
                        <i class="fa-solid fa-balance-scale text-white text-xl"></i>
                    </div>
                    <div class="font-bold text-2xl tracking-tighter">Skandale.dk</div>
                </div>
                <button id="mobile-menu-close" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
            </div>

            <div class="flex-1 flex flex-col p-6 space-y-2 text-lg">
                <a href="index.html" class="py-3 border-b">Politikere</a>
                <a href="tidslinje.html" class="py-3 border-b">Tidslinje</a>
                <a href="sammenlign.html" class="py-3 border-b">Sammenlign</a>
                <a href="stats.html" class="py-3 border-b">Statistik</a>
                <a href="#" onclick="closeMobileMenu(); if (typeof window.showNetworkOverviewModal === 'function') window.showNetworkOverviewModal()" class="py-3 border-b">Netværk</a>
                <a href="#" onclick="closeMobileMenu(); if (typeof window.showAboutModal === 'function') window.showAboutModal()" class="py-3">Om</a>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    initMobileMenu();
}

function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeButton = document.getElementById('mobile-menu-close');

    if (!menuButton || !mobileMenu) return;

    // Åbn mobil menu
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    // Luk via X-knap
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Luk hvis man klikker udenfor
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Kør automatisk
document.addEventListener('DOMContentLoaded', loadNavbar);