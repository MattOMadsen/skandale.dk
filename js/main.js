// js/main.js - Hovedfil der starter alt

function initializeEverything() {
  loadPoliticians().then(() => {
    // Sikkerhed: Brug window. hvis funktionen ikke er direkte global
    if (typeof renderPoliticians === 'function') {
      renderPoliticians();
    } else if (typeof window.renderPoliticians === 'function') {
      window.renderPoliticians();
    } else {
      console.error('renderPoliticians er stadig ikke defineret – tjek script-rækkefølge i index.html');
    }
    
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
    
    console.log(`%c[Skandale.dk ${APP_VERSION}] Split version klar!`, 'color:#10b981');
  });
}

window.onload = initializeEverything;
