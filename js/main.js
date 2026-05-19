// js/main.js - Hovedfil der starter alt + mobil menu

function initializeEverything() {
  loadPoliticians().then(() => {
    renderPoliticians();
    
    // ROBUST EVENT DELEGATION for politiker-kort på forsiden
    const grid = document.getElementById('politiciansGrid');
    if (grid) {
      grid.addEventListener('click', function(e) {
        const card = e.target.closest('.politician-card');
        if (card && card.dataset.id) {
          const id = parseInt(card.dataset.id);
          if (typeof window.showPoliticianModal === 'function') {
            window.showPoliticianModal(id);
          } else {
            console.error('showPoliticianModal ikke fundet');
          }
        }
      });
    }
    
    initMobileMenu();
    
    console.log(`%c[Skandale.dk ${APP_VERSION}] Mobil menu klar!`, 'color:#10b981');
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (!btn || !menu || !closeBtn) return;

  btn.addEventListener('click', () => {
    menu.classList.remove('hidden');
    menu.classList.add('flex');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', closeMobileMenu);

  menu.addEventListener('click', (e) => {
    if (e.target === menu) closeMobileMenu();
  });
}

window.closeMobileMenu = function() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
    document.body.style.overflow = '';
  }
};

window.onload = initializeEverything;