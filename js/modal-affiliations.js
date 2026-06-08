// js/modal-affiliations.js - Klikbar affiliations-funktion

async function showAffiliationModal(affiliationName, organization = '') {
  if (typeof window.ensureAllDetailsLoaded === 'function') {
    await window.ensureAllDetailsLoaded();
  }

  const matchingPoliticians = typeof window.findPoliticiansByNetwork === 'function'
    ? window.findPoliticiansByNetwork(affiliationName, organization)
    : [];

  const displayName = typeof window.normalizeNetworkName === 'function'
    ? window.normalizeNetworkName(affiliationName, organization)
    : affiliationName;

  if (matchingPoliticians.length === 0) {
    alert('Ingen politikere har denne tilknytning.');
    return;
  }

  const modalHTML = `
    <div id="affiliationModal" onclick="closeAffiliationModal()"
         class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div onclick="event.stopImmediatePropagation()"
           class="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">

        <div class="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">${displayName}</h3>
            <p class="text-slate-500 dark:text-slate-400 mt-1">${matchingPoliticians.length} politikere med samme tilknytning</p>
          </div>
          <button onclick="closeAffiliationModal()" class="text-3xl text-slate-400 hover:text-slate-600 dark:hover:text-white">×</button>
        </div>

        <div class="p-8 overflow-y-auto max-h-[calc(85vh-120px)] space-y-3">
          ${matchingPoliticians.map(p => `
            <div onclick="closeAffiliationModal(); showPoliticianModal(${p.id});"
                 class="flex items-center gap-x-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#C8102E] hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                   style="background-color: #C8102E">
                ${p.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-xl tracking-tight text-slate-900 dark:text-white">${p.name}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">${p.party || ''}${p.year ? ` • ${p.year}` : ''}${p.role ? ` • ${p.role}` : ''}</div>
              </div>
              <div class="text-[#C8102E]">
                <i class="fa-solid fa-chevron-right text-xl"></i>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="px-8 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
          Klik på en politiker for at se deres fulde profil
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('affiliationModal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeAffiliationModal() {
  const modal = document.getElementById('affiliationModal');
  if (modal) modal.remove();
}

window.showAffiliationModal = showAffiliationModal;
window.closeAffiliationModal = closeAffiliationModal;