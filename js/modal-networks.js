// js/modal-networks.js - Internationale netværk & tilknytninger
// 1 fil = 1 ansvarsområde

function showNetworkConnections(networkName) {
  let connectedPoliticians = [];

  // Først: Prøv det globale networkIndex
  if (window.networkIndex && window.networkIndex[networkName]) {
    connectedPoliticians = window.networkIndex[networkName];
  } 
  
  // Fallback: Søg i alle loaded politikere (robusthed)
  if (connectedPoliticians.length === 0 && typeof politicians !== 'undefined') {
    politicians.forEach(p => {
      if (p.affiliations && Array.isArray(p.affiliations)) {
        const hasNetwork = p.affiliations.some(aff => 
          (aff.name || aff.organization || aff) === networkName
        );
        if (hasNetwork) {
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
    alert('Ingen andre politikere fundet med dette netværk: ' + networkName);
    return;
  }

  let html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" id="networkModal">
      <div onclick="event.target.id === 'networkModal' && closeNetworkModal()" class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl">
        <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold">${networkName}</h3>
            <p class="text-slate-500">${connectedPoliticians.length} politikere har været tilknyttet dette netværk</p>
          </div>
          <button onclick="closeNetworkModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
        </div>
        <div class="p-8 max-h-[70vh] overflow-y-auto">
          <div class="space-y-3">
  `;

  connectedPoliticians.forEach(p => {
    html += `
      <div onclick="closeNetworkModal(); if (typeof window.showPoliticianModal === 'function') window.showPoliticianModal(${p.id});" class="flex justify-between items-center p-4 border border-slate-200 rounded-2xl hover:border-[#C8102E]/30 cursor-pointer">
        <div>
          <div class="font-semibold">${p.name}</div>
          <div class="text-sm text-slate-500">${p.party}</div>
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

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeNetworkModal() {
  const modal = document.getElementById('networkModal');
  if (modal) modal.remove();
}

// Gør globalt tilgængeligt
window.showNetworkConnections = showNetworkConnections;
window.closeNetworkModal = closeNetworkModal;