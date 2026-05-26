// js/main.js - Hovedfil der starter alt (gendannet + dynamisk count)

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

    // Opdater dynamisk antal politikere (ved siden af version)
    updatePoliticianCount();

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

    console.log(`%c[Skandale.dk ${APP_VERSION}] main.js gendannet og klar!`, 'color:#10b981');
  });
}

function updatePoliticianCount() {
  // Finder elementet med "X politikere" i hero-sektionen
  const heroContainer = document.querySelector('#app-version-hero')?.parentElement;
  if (!heroContainer || !window.politicians) return;

  // Opdater teksten – virker selvom der ikke er et separat span endnu
  const text = heroContainer.textContent || '';
  if (text.includes('politikere')) {
    const newCount = window.politicians.length;
    heroContainer.innerHTML = heroContainer.innerHTML.replace(
      /\d+ politikere/,
      `${newCount} politikere`
    );
  }
}

// Gør funktionen tilgængelig globalt hvis nødvendigt
window.updatePoliticianCount = updatePoliticianCount;

window.onload = initializeEverything;