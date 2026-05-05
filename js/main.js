// js/main.js - Hovedfil der starter alt

function initializeEverything() {
  loadPoliticians().then(() => {
    renderPoliticians();
    console.log(`%c[Skandale.dk ${APP_VERSION}] Split version klar!`, 'color:#10b981');
  });
}

window.onload = initializeEverything;