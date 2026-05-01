// js/main.js - Hovedfil der starter alt

function initializeEverything() {
  loadPoliticians().then(() => {
    renderPoliticians();
    console.log('%c[Skandale.dk v6.5] Split version klar! (5 filer)', 'color:#10b981');
  });
}

window.onload = initializeEverything;