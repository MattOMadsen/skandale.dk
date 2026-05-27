// js/main.js - Hovedfil der starter alt (med parti-filter + dynamisk count + stats snapshot)

let currentPartyFilter = '';

function initializeEverything() {
  loadPoliticians().then(() => {
    if (typeof renderPoliticians === 'function') {
      renderPoliticians();
    } else if (typeof window.renderPoliticians === 'function') {
      window.renderPoliticians();
    } else {
      console.error('renderPoliticians er stadig ikke defineret');
    }

    updatePoliticianCount();
    initPartyFilterChips();
    setupPartyFilterListeners();

    // Vis statistik snapshot på forsiden (initialt med core-data)
    if (typeof window.renderStatsSnapshot === 'function') {
      window.renderStatsSnapshot();
    }

    // Event delegation for politiker-kort
    const grid = document.getElementById('politiciansGrid');
    if (grid) {
      grid.addEventListener('click', function(e) {
        const card = e.target.closest('.politician-card');
        if (card && card.dataset.id) {
          const id = parseInt(card.dataset.id);
          if (typeof window.showPoliticianModal === 'function') {
            window.showPoliticianModal(id);
          }
        }
      });
    }

    // === BAGGRUNDSINDLÆSNING AF DETALJER ===
    // Loader fulde detaljer (scandals osv.) i baggrunden efter grid er vist.
    // Dette gør at "Hurtig statistik" får korrekte tal uden at forsinke den indledende sidevisning.
    if (window.politicians && window.loadPoliticianDetails) {
      Promise.all(
        window.politicians.map(p => 
          window.loadPoliticianDetails(p).catch(err => {
            console.warn('Kunne ikke loade detaljer for', p.name, err);
            return p;
          })
        )
      ).then(() => {
        // Opdater statistik snapshot med fulde data
        if (typeof window.renderStatsSnapshot === 'function') {
          window.renderStatsSnapshot();
        }
        console.log('%c[Skandale.dk] Baggrundsdetaljer loaded – statistik opdateret', 'color:#10b981');
      });
    }

    console.log(`%c[Skandale.dk ${APP_VERSION}] Klar med forbedret parti-filter + stats snapshot`, 'color:#10b981');
  });
}

function updatePoliticianCount() {
  const countEl = document.getElementById('politician-count');
  if (countEl && window.politicians) {
    countEl.textContent = `${window.politicians.length} politikere`;
  }
}

// ============================================
// PARTI FILTER - Forbedret version
// ============================================

function initPartyFilterChips() {
  const container = document.getElementById('party-filter-chips');
  if (!container || !window.politicians) return;

  const parties = [...new Set(window.politicians.map(p => p.party))].sort();

  let html = `
    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
      <button class="party-chip active shrink-0 snap-start px-5 py-2 text-sm font-medium rounded-full transition-all bg-[#C8102E] text-white shadow-sm" data-party="">
        Alle
      </button>
  `;

  parties.forEach(party => {
    html += `
      <button class="party-chip shrink-0 snap-start px-5 py-2 text-sm font-medium rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-all whitespace-nowrap" data-party="${party}">
        ${party}
      </button>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

function setupPartyFilterListeners() {
  const container = document.getElementById('party-filter-chips');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const chip = e.target.closest('.party-chip');
    if (!chip) return;

    // Fjern active fra alle
    container.querySelectorAll('.party-chip').forEach(c => {
      c.classList.remove('active', 'bg-[#C8102E]', 'text-white', 'shadow-sm');
      c.classList.add('border-slate-300', 'text-slate-700', 'hover:bg-slate-100');
    });

    // Aktivér valgt chip
    chip.classList.add('active', 'bg-[#C8102E]', 'text-white', 'shadow-sm');
    chip.classList.remove('border-slate-300', 'text-slate-700', 'hover:bg-slate-100');

    currentPartyFilter = chip.dataset.party || '';
    applyFilters();
  });
}

function applyFilters() {
  if (!window.politicians) return;

  let filtered = window.politicians;

  // Parti filter
  if (currentPartyFilter) {
    filtered = filtered.filter(p => p.party === currentPartyFilter);
  }

  // Søgning
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value.trim() !== '') {
    const term = searchInput.value.trim().toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.party.toLowerCase().includes(term)
    );
  }

  if (typeof window.renderPoliticians === 'function') {
    window.renderPoliticians(filtered);
  }

  // Opdater tæller til filtreret antal
  const countEl = document.getElementById('politician-count');
  if (countEl) countEl.textContent = `${filtered.length} politikere`;
  }

window.applyFilters = applyFilters;

window.onload = initializeEverything;