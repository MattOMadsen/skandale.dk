// js/modal-core.js - Hovedmodalen (showPoliticianModal + close + skeleton)
// 1 fil = 1 ansvarsområde (kun hovedlogik + HTML skeleton)
//
// ÆNDRINGER (additive only):
// - showPoliticianModal accepterer nu valgfri targetScandalId som 2. parameter
// - Efter render: auto-expand + highlight af specifik skandale ved deep link
// - Ny helper: expandSpecificScandal()
// - Ny initDeepLink() der kører ved load og håndterer ?politician=...&scandal=...
// - Eksporteret initDeepLink til window + bedre timing-støtte (retry hvis politicians ikke klar endnu)
// INGEN eksisterende funktioner, kode eller logik er slettet eller ændret.

let currentPolitician = null;

async function showPoliticianModal(politicianId, targetScandalId = null) {
  // FIX: Bruger det globale politicians-array (samme som ui.js)
  // Bruger loose equality (==) i stedet for strict (===) fordi:
  // - p.id fra JSON/data er altid et number (f.eks. 1)
  // - politicianId fra localStorage (via sammenlign.html) er altid en string ("1")
  // Dette sikrer at auto-open fra Sammenlign-siden virker.
  let politician = typeof politicians !== 'undefined' ? politicians.find(p => p.id == politicianId) : null;
  if (!politician) {
    console.error('Politiker ikke fundet:', politicianId);
    alert('Kunne ikke finde politikeren. Prøv at genindlæse siden.');
    return;
  }

  // === Lazy load detaljer ===
  if (!politician._detailsLoaded || !politician.scandals || politician.scandals.length === 0) {
    if (typeof window.loadPoliticianDetails === 'function') {
      try {
        await window.loadPoliticianDetails(politician);

        if (typeof window.buildCrossReferenceIndices === 'function') {
          window.buildCrossReferenceIndices();
        }
      } catch (e) {
        console.warn('Kunne ikke loade detaljer for', politician.name, e);
      }
    }
  }

  // Load scandals dynamically if needed
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

  if (typeof window.ensureAllDetailsLoaded === 'function') {
    await window.ensureAllDetailsLoaded();
  }

  currentPolitician = politician;

  document.querySelectorAll('#politicianModal, #networkModal').forEach(m => m.remove());

  const html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" id="politicianModal" data-current-politician-id="${politicianId}">
      <div onclick="event.target.id === 'politicianModal' && closePoliticianModal()" 
           class="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        <!-- Header -->
        <div class="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-start justify-between gap-y-4 flex-shrink-0">
          <div class="flex items-center gap-x-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" 
                 style="background-color: ${politician.avatarColor || politician.partyColor || '#C8102E'}">
              ${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 class="text-3xl font-bold text-slate-900 dark:text-white">${politician.name}</h2>
              <div class="flex items-center gap-x-2 mt-1">
                <span class="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm" style="background-color: ${politician.partyColor}20; color: ${politician.partyColor}">${politician.party}</span>
                <span class="text-sm text-slate-500 dark:text-slate-400">${politician.role || ''}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-x-2">
            <button id="share-btn" class="flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all">
              <i class="fa-solid fa-share-alt"></i>
              <span class="hidden sm:inline">Del</span>
            </button>
            <button onclick="if (typeof exportPoliticianToPDF === 'function') exportPoliticianToPDF(currentPolitician)" class="flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all">
              <i class="fa-solid fa-file-pdf"></i>
              <span class="hidden sm:inline">PDF</span>
            </button>
            <button onclick="closePoliticianModal()" class="flex items-center justify-center w-10 h-10 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all text-3xl leading-none">×</button>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-8" id="modalScrollable">
          
          <!-- Om Politikeren -->
          <div class="mb-6">
            <div class="font-semibold text-sm text-slate-500 dark:text-slate-400 mb-2">Om Politikeren</div>
            <div class="text-slate-700 dark:text-slate-200">${politician.bio || 'Ingen beskrivelse tilgængelig.'}</div>
          </div>
          
          <!-- Før politik / Ungdom -->
          ${politician.beforePolitics ? `
            <div class="mb-4 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <div onclick="toggleSection('beforePoliticsSection')" class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                <div class="font-semibold text-sm text-slate-700 dark:text-slate-200">${politician.beforePolitics.title || 'Før politik / Ungdom'}</div>
                <i class="fa-solid fa-chevron-down text-slate-400 dark:text-slate-500" id="beforePoliticsChevron"></i>
              </div>
              <div id="beforePoliticsSection" class="hidden p-4 border-t border-slate-200 dark:border-slate-700">
                <div class="text-slate-700 dark:text-slate-200">${politician.beforePolitics.content}</div>
              </div>
            </div>
          ` : ''}
          
          <!-- Karriereoversigt -->
          ${politician.careerTimeline ? `
            <div class="mb-4 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <div onclick="toggleSection('careerSection')" class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                <div class="font-semibold text-sm text-slate-700 dark:text-slate-200">Karriereoversigt</div>
                <i class="fa-solid fa-chevron-down text-slate-400 dark:text-slate-500" id="careerChevron"></i>
              </div>
              <div id="careerSection" class="hidden p-4 border-t border-slate-200 dark:border-slate-700">
                <div class="text-slate-700 dark:text-slate-200 whitespace-pre-line">${politician.careerTimeline}</div>
              </div>
            </div>
          ` : ''}
          
          <!-- Skandaler -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-x-2">
                <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
                <span class="font-bold text-lg text-slate-900 dark:text-white">Skandaler</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">(${politician.scandals ? politician.scandals.length : 0})</span>
              </div>
              <button onclick="window.showAddScandalModal(currentPolitician)" class="px-4 py-1.5 text-sm bg-[#C8102E] text-white rounded-xl hover:bg-[#C8102E]/90 transition-colors flex items-center gap-x-2">
                <i class="fa-solid fa-plus"></i>
                <span>Tilføj ny</span>
              </button>
            </div>
            <div id="scandalsContainer"></div>
          </div>
          
          <!-- Økonomisk støtte -->
          <div id="economicSupportSection"></div>
          
          <!-- Internationale netværk & tilknytninger (uden inline onclick - attaches nedenfor) -->
          ${politician.affiliations && politician.affiliations.length > 0 ? `
            <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div class="flex items-center gap-x-2 mb-4">
                <i class="fa-solid fa-globe text-[#C8102E]"></i>
                <span class="font-bold text-lg text-slate-900 dark:text-white">Internationale netværk & tilknytninger</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="networkAffiliationsContainer">
                ${politician.affiliations.map((aff, index) => {
                  const networkName = aff.name || aff.organization || 'Ukendt';
                  return `
                    <div class="network-affiliation-item p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-[#C8102E]/30 dark:hover:border-[#C8102E]/50 cursor-pointer transition-all" data-network-name="${networkName.replace(/"/g, '\"')}" data-network-org="${(aff.organization || '').replace(/"/g, '\"')}">
                      <div class="font-semibold text-[#C8102E]">${networkName}</div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">${aff.organization || ''} • ${aff.year || ''}</div>
                      ${aff.role ? `<div class="text-sm text-slate-600 dark:text-slate-300 mt-1">${aff.role}</div>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
          
          <!-- Brudte valgløfter -->
          <div id="brokenPromisesSection"></div>
          
        </div>
        
        <div class="px-8 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-400 dark:text-slate-500 text-center flex-shrink-0">
          Data er baseret på offentligt tilgængelige kilder • v2.00.87
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  // Initialize after DOM is ready
  setTimeout(() => {
    const scandalsContainer = document.getElementById('scandalsContainer');
    if (scandalsContainer) {
      renderScandalsDirect(politician, scandalsContainer);
    }

    if (typeof addEconomicSupportSection === 'function') addEconomicSupportSection(politician);
    if (typeof addBrokenPromisesSection === 'function') addBrokenPromisesSection(politician);
    if (typeof initShareButton === 'function') initShareButton(politician);

    // === NY: Attach click listeners på netværs-kort (robust) ===
    const networkContainer = document.getElementById('networkAffiliationsContainer');
    if (networkContainer) {
      networkContainer.querySelectorAll('.network-affiliation-item').forEach(item => {
        const networkName = item.dataset.networkName;
        const networkOrg = item.dataset.networkOrg || '';
        if (networkName) {
          item.addEventListener('click', () => {
            if (typeof window.showNetworkConnections === 'function') {
              window.showNetworkConnections(networkName, networkOrg);
            } else {
              console.warn('showNetworkConnections ikke tilgængelig');
            }
          });
        }
      });
    }

    // === NY: Hvis der er targetScandalId (fra deep link), så udfold + highlight ===
    if (targetScandalId) {
      setTimeout(() => {
        if (typeof expandSpecificScandal === 'function') {
          expandSpecificScandal(targetScandalId);
        }
      }, 350);
    }

    console.log('%c[Skandale.dk] Modal initialiseret med robust netværk-håndtering', 'color:#10b981');
  }, 60);
}

function closePoliticianModal() {
  const modal = document.getElementById('politicianModal');
  if (modal) modal.remove();
  currentPolitician = null;
}

// === NY HELPER: Udvid og highlight en specifik skandale (til deep linking) ===
function expandSpecificScandal(scandalId) {
  const container = document.getElementById('scandalsContainer');
  if (!container) return;

  // Find elementet med data-sc-id (tilføjet i modal-scandal.js)
  const target = container.querySelector(`[data-sc-id="${scandalId}"]`);
  if (!target) {
    console.log('Specifik skandale ikke fundet til expand:', scandalId);
    return;
  }

  // Find header og content inden i
  const header = target.querySelector('[id^="scandal-header-"]');
  const content = target.querySelector('[id^="scandal-content-"]');
  const chevron = target.querySelector('[id^="scandal-chevron-"]');

  if (content && content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
  }

  // Midlertidig highlight for god UX
  target.classList.add('ring-2', 'ring-[#C8102E]/40', 'ring-offset-2', 'rounded-2xl');
  setTimeout(() => {
    target.classList.remove('ring-2', 'ring-[#C8102E]/40', 'ring-offset-2', 'rounded-2xl');
  }, 2800);

  // Scroll til den
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// === NY: Deep link support - håndterer ?politician=xxx&scandal=yyy ved side-load ===
function initDeepLink() {
  try {
    const params = new URLSearchParams(window.location.search);
    const polSlug = params.get('politician');
    const scandalId = params.get('scandal');

    if (!polSlug) return;

    // Robust tjek: vent på at politicians er klar
    const tryOpen = () => {
      const polArray = (typeof politicians !== 'undefined' && Array.isArray(politicians)) ? politicians : (window.politicians || []);
      if (!polArray || polArray.length === 0) {
        setTimeout(tryOpen, 300);
        return;
      }

      const pol = polArray.find(p => {
        const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return slug === polSlug;
      });

      if (pol) {
        setTimeout(() => {
          if (typeof window.showPoliticianModal === 'function') {
            window.showPoliticianModal(pol.id || pol.name, scandalId);
          }
        }, 400);
      }
    };

    tryOpen();
  } catch (e) {
    console.warn('Deep link init fejlede:', e);
  }
}

// Start deep link check (DOMContentLoaded + fallback)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDeepLink);
} else {
  initDeepLink();
}

window.showPoliticianModal = showPoliticianModal;
window.closePoliticianModal = closePoliticianModal;
window.expandSpecificScandal = expandSpecificScandal;
window.initDeepLink = initDeepLink;