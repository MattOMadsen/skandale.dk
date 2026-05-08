// js/modal-core.js - Med collapsible sektioner (v2.00.22)

let isModalOpen = false;

function showPoliticianModal(politicianId) {
  if (isModalOpen) return; // Prevent recursion
  isModalOpen = true;

  const politician = politicians.find(p => p.id === politicianId);
  if (!politician) {
    console.error('Politiker ikke fundet:', politicianId);
    isModalOpen = false;
    return;
  }

  const existingModals = document.querySelectorAll('.fixed.inset-0');
  existingModals.forEach(m => m.remove());

  const html = `...`; // (keep the rest of the template as before)

  document.body.insertAdjacentHTML('beforeend', html);

  setTimeout(() => {
    if (typeof loadScandals === 'function') loadScandals(politician);
    if (typeof addBrokenPromisesSection === 'function') addBrokenPromisesSection(politician);
    if (typeof addEconomicSupportSection === 'function') addEconomicSupportSection(politician);
    isModalOpen = false;
  }, 100);
}

// ... rest of the file (closePoliticianModal, toggleSection, showPoliticiansWithAffiliation) ...