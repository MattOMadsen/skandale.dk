// js/modal-core.js - Komplet og stabil version (v2.00.48)

function showPoliticianModal(politicianId) {
  const politician = politicians.find(p => p.id === politicianId);
  if (!politician) {
    console.error('Politiker ikke fundet:', politicianId);
    return;
  }

  // Luk eventuelle åbne modals
  const existingModals = document.querySelectorAll('.fixed.inset-0');
  existingModals.forEach(m => m.remove());

  const html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" id="politicianModal">
      <div onclick="event.target.id === 'politicianModal' && closePoliticianModal()" 
           class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        <!-- Header -->
        <div class="px-8 pt-8 pb-6 border-b flex items-start justify-between">
          <div class="flex items-center gap-x-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" 
                 style="background-color: ${politician.avatarColor || politician.color || '#C8102E'}">
              ${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 class="text-3xl font-bold">${politician.name}</h2>
              <div class="flex items-center gap-x-2 mt-1">
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">${politician.party}</span>
                <span class="text-sm text-slate-500">${politician.role || ''}</span>
              </div>
            </div>
          </div>
          <button onclick="closePoliticianModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
        </div>
        
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          <!-- Bio -->
          <div class="mb-8">
            <div class="font-semibold text-sm text-slate-500 mb-2">Om politikeren</div>
            <div class="text-slate-700">${politician.bio || 'Ingen beskrivelse tilgængelig.'}</div>
          </div>
          
          <!-- Before Politics -->
          ${politician.beforePolitics ? `
            <div class="mb-8">
              <div class="font-semibold text-sm text-slate-500 mb-2">${politician.beforePolitics.title || 'Før politik / Ungdom'}</div>
              <div class="text-slate-700">${politician.beforePolitics.content}</div>
            </div>
          ` : ''}
          
          <!-- Career Timeline -->
          ${politician.careerTimeline ? `
            <div class="mb-8">
              <div class="font-semibold text-sm text-slate-500 mb-2">Karriereoversigt</div>
              <div class="text-slate-700 whitespace-pre-line">${politician.careerTimeline}</div>
            </div>
          ` : ''}
          
          <!-- Scandals -->
          <div class="mb-8">
            <div class="flex items-center gap-x-2 mb-4">
              <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
              <span class="font-bold text-lg">Skandaler</span>
              <span class="text-xs text-slate-500">(${politician.scandals ? politician.scandals.length : 0})</span>
            </div>
            <div id="scandalsContainer"></div>
          </div>
          
          <!-- Broken Promises -->
          <div id="brokenPromisesSection"></div>
          
          <!-- Economic Support -->
          <div id="economicSupportSection"></div>
          
          <!-- Affiliations -->
          ${politician.affiliations && politician.affiliations.length > 0 ? `
            <div class="mt-8 pt-6 border-t">
              <div class="flex items-center gap-x-2 mb-4">
                <i class="fa-solid fa-globe text-[#C8102E]"></i>
                <span class="font-bold text-lg">Internationale netværk & tilknytninger</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${politician.affiliations.map(aff => `
                  <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div class="font-semibold">${aff.name}</div>
                    <div class="text-xs text-slate-500">${aff.organization} • ${aff.year}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
        </div>
        
        <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center">
          Data er baseret på offentligt tilgængelige kilder
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  // Load dynamic sections
  setTimeout(() => {
    if (typeof loadScandals === 'function') loadScandals(politician);
    if (typeof addBrokenPromisesSection === 'function') addBrokenPromisesSection(politician);
    if (typeof addEconomicSupportSection === 'function') addEconomicSupportSection(politician);
  }, 100);
}

function closePoliticianModal() {
  const modal = document.getElementById('politicianModal');
  if (modal) modal.remove();
}

// Make function globally available
window.showPoliticianModal = showPoliticianModal;