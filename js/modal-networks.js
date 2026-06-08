// js/modal-networks.js - Internationale netværk & tilknytninger
// Meget robust version med flere fallbacks

function showNetworkConnections(networkName) {
  let connectedPoliticians = [];

  // 1. Prøv globale networkIndex
  if (window.networkIndex && Array.isArray(window.networkIndex[networkName])) {
    connectedPoliticians = window.networkIndex[networkName];
  }

  // 2. Fallback: Søg i window.politicians (case-insensitive)
  if (connectedPoliticians.length === 0 && window.politicians && Array.isArray(window.politicians)) {
    const searchName = networkName.toLowerCase();
    window.politicians.forEach(p => {
      if (p.affiliations && Array.isArray(p.affiliations)) {
        const hasMatch = p.affiliations.some(aff => {
          const name = (aff.name || aff.organization || aff || '').toString().toLowerCase();
          return name === searchName;
        });
        if (hasMatch) {
          connectedPoliticians.push({
            id: p.id,
            name: p.name,
            party: p.party,
            year: '',
            role: ''
          });
        }
      }
    });
  }

  if (connectedPoliticians.length === 0) {
    alert('Ingen andre politikere fundet med netværket: ' + networkName);
    return;
  }

  let html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" id="networkModal">
      <div onclick="event.target.id === 'networkModal' && closeNetworkModal()" class="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl">
        <div class="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${networkName}</h3>
            <p class="text-slate-500 dark:text-slate-400">${connectedPoliticians.length} politikere har været tilknyttet dette netværk</p>
          </div>
          <button onclick="closeNetworkModal()" class="text-3xl text-slate-400 hover:text-slate-600 dark:hover:text-white">×</button>
        </div>
        <div class="p-8 max-h-[70vh] overflow-y-auto">
          <div class="space-y-3">
  `;

  connectedPoliticians.forEach(p => {
    html += `
      <div onclick="closeNetworkModal(); if (typeof window.showPoliticianModal === 'function') window.showPoliticianModal(${p.id});" class="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-[#C8102E]/30 cursor-pointer">
        <div>
          <div class="font-semibold text-slate-900 dark:text-white">${p.name}</div>
          <div class="text-sm text-slate-500 dark:text-slate-400">${p.party}</div>
        </div>
        <div class="text-right text-sm">
          <div class="font-medium">${p.year || ''}</div>
          <div class="text-xs text-slate-500">${p.role || ''}</div>
        </div>
      </div>
    `;
  });

  html += `
          </div>
        </div>
      </div>
    </div>
  `;

  const old = document.getElementById('networkModal');
  if (old) old.remove();

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeNetworkModal() {
  const modal = document.getElementById('networkModal');
  if (modal) modal.remove();
}

window.showNetworkConnections = showNetworkConnections;
window.closeNetworkModal = closeNetworkModal;