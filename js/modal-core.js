// js/modal-core.js - Hovedmodalen (showPoliticianModal + close + skeleton)
// 1 fil = 1 ansvarsområde (kun hovedlogik + HTML skeleton)

let currentPolitician = null;

async function showPoliticianModal(politicianId) {
  // FIX: Bruger det globale politicians-array (samme som ui.js)
  let politician = typeof politicians !== 'undefined' ? politicians.find(p => p.id === politicianId) : null;
  if (!politician) {
    console.error('Politiker ikke fundet:', politicianId);
    alert('Kunne ikke finde politikeren. Prøv at genindlæse siden.');
    return;
  }

  // Load scandals dynamically if needed (for split JSON structure)
  if (!politician.scandals && politician.scandalsFile) {
    try {
      const response = await fetch(politician.scandalsFile);
      if (response.ok) {
        const data = await response.json();
        politician.scandals = data.scandals || (Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn('Kunne ikke loade scandals for', politician.name, e);
      politician.scandals = [];
    }
  }

  currentPolitician = politician;

  // Remove existing modals
  document.querySelectorAll('#politicianModal, #networkModal').forEach(m => m.remove());

  const html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" id="politicianModal" data-current-politician-id="${politicianId}">
      <div onclick="event.target.id === 'politicianModal' && closePoliticianModal()" 
           class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        <!-- Header -->
        <div class="px-8 pt-8 pb-6 border-b flex flex-col sm:flex-row sm:items-start justify-between gap-y-4">
          <div class="flex items-center gap-x-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" 
                 style="background-color: ${politician.avatarColor || politician.partyColor || '#C8102E'}">
              ${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 class="text-3xl font-bold">${politician.name}</h2>
              <div class="flex items-center gap-x-2 mt-1">
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm" style="background-color: ${politician.partyColor}20; color: ${politician.partyColor}">${politician.party}</span>
                <span class="text-sm text-slate-500">${politician.role || ''}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-x-2">
            <button id="share-btn" class="flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-2xl transition-all">
              <i class="fa-solid fa-share-alt"></i>
              <span class="hidden sm:inline">Del</span>
            </button>
            <button onclick="if (typeof exportPoliticianToPDF === 'function') exportPoliticianToPDF(currentPolitician)" class="flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-2xl transition-all">
              <i class="fa-solid fa-file-pdf"></i>
              <span class="hidden sm:inline">PDF</span>
            </button>
            <button onclick="closePoliticianModal()" class="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all text-3xl leading-none">×</button>
          </div>
        </div>
        
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          <!-- Om Politikeren -->
          <div class="mb-6">
            <div class="font-semibold text-sm text-slate-500 mb-2">Om Politikeren</div>
            <div class="text-slate-700">${politician.bio || 'Ingen beskrivelse tilgængelig.'}</div>
          </div>
          
          <!-- Før politik / Ungdom (collapsible) -->
          ${politician.beforePolitics ? `
            <div class="mb-4 border border-slate-200 rounded-2xl overflow-hidden">
              <div onclick="toggleSection('beforePoliticsSection')" class="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100">
                <div class="font-semibold text-sm">${politician.beforePolitics.title || 'Før politik / Ungdom'}</div>
                <i class="fa-solid fa-chevron-down text-slate-400" id="beforePoliticsChevron"></i>
              </div>
              <div id="beforePoliticsSection" class="hidden p-4 border-t">
                <div class="text-slate-700">${politician.beforePolitics.content}</div>
              </div>
            </div>
          ` : ''}
          
          <!-- Karriereoversigt (collapsible) -->
          ${politician.careerTimeline ? `
            <div class="mb-4 border border-slate-200 rounded-2xl overflow-hidden">
              <div onclick="toggleSection('careerSection')" class="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100">
                <div class="font-semibold text-sm">Karriereoversigt</div>
                <i class="fa-solid fa-chevron-down text-slate-400" id="careerChevron"></i>
              </div>
              <div id="careerSection" class="hidden p-4 border-t">
                <div class="text-slate-700 whitespace-pre-line">${politician.careerTimeline}</div>
              </div>
            </div>
          ` : ''}
          
          <!-- Skandaler -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-x-2">
                <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
                <span class="font-bold text-lg">Skandaler</span>
                <span class="text-xs text-slate-500">(${politician.scandals ? politician.scandals.length : 0})</span>
              </div>
              <button onclick="window.showAddScandalModal(currentPolitician)" 
                      class="px-4 py-1.5 text-sm bg-[#C8102E] text-white rounded-xl hover:bg-[#C8102E]/90 transition-colors flex items-center gap-x-2">
                <i class="fa-solid fa-plus"></i>
                <span>Tilføj ny</span>
              </button>
            </div>
            <div id="scandalsContainer"></div>
          </div>
          
          <!-- Økonomisk støtte (injected by modal-donor.js) -->
          <div id="economicSupportSection"></div>
          
          <!-- Internationale netværk & tilknytninger -->
          ${politician.affiliations && politician.affiliations.length > 0 ? `
            <div class="mt-8 pt-6 border-t">
              <div class="flex items-center gap-x-2 mb-4">
                <i class="fa-solid fa-globe text-[#C8102E]"></i>
                <span class="font-bold text-lg">Internationale netværk & tilknytninger</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${politician.affiliations.map(aff => {
                  const networkName = aff.name || aff.organization || 'Ukendt';
                  return `
                    <div onclick="showNetworkConnections('${networkName}')" class="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#C8102E]/30 cursor-pointer transition-all">
                      <div class="font-semibold text-[#C8102E]">${networkName}</div>
                      <div class="text-xs text-slate-500">${aff.organization || ''} • ${aff.year || ''}</div>
                      ${aff.role ? `<div class="text-sm text-slate-600 mt-1">${aff.role}</div>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
          
          <!-- Brudte valgløfter (injected by modal-broken-promises.js) -->
          <div id="brokenPromisesSection"></div>
          
        </div>
        
        <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center">
          Data er baseret på offentligt tilgængelige kilder • v2.00.59
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  // Initialize scandals with the NEW render function (from modal-scandals.js)
  setTimeout(() => {
    const scandalsContainer = document.getElementById('scandalsContainer');
    if (scandalsContainer) {
      renderScandalsDirect(politician, scandalsContainer);
    }

    // Call helper functions from other modal-*.js files
    if (typeof addEconomicSupportSection === 'function') {
      addEconomicSupportSection(politician);
    }
    if (typeof addBrokenPromisesSection === 'function') {
      addBrokenPromisesSection(politician);
    }
    if (typeof initShareButton === 'function') {
      initShareButton(politician);
    }
  }, 50);
}

function closePoliticianModal() {
  const modal = document.getElementById('politicianModal');
  if (modal) modal.remove();
  currentPolitician = null;
}

// Make functions global
window.showPoliticianModal = showPoliticianModal;
window.closePoliticianModal = closePoliticianModal;