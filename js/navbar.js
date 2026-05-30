// js/navbar.js - Central navbar (loades på alle sider)

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
    `;

    // Indsæt navbaren øverst på siden
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    // Mobil menu funktionalitet
    initMobileMenu();
}

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-button');
    if (!btn) return;

    btn.addEventListener('click', () => {
        // Du kan udvide med en rigtig mobil menu senere
        alert('Mobil menu kommer snart');
    });
}

// Kør automatisk når scriptet loades
document.addEventListener('DOMContentLoaded', loadNavbar);