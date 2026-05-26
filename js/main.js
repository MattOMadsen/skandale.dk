// js/main.js - Hovedfil der starter alt (med parti-filter + dynamisk count)

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
    initPartyFilterChips();           // ← Ny: Parti-filter
    setupPartyFilterListeners();      // ← Ny: Klik-håndtering

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

    console.log(`%c[Skandale.dk ${APP_VERSION}] Klar med parti-filter`, 'color:#10b981');
  });
}

function updatePoliticianCount() {
  const countEl = document.getElementById('politician-count');
  if (countEl && window.politicians) {
    countEl.textContent = `${window.politicians.length} politikere`;
  }
}

// ============================================
// PARTI FILTER (chips)
// ============================================

function initPartyFilterChips() {
  const container = document.getElementById('party-filter-chips');
  if (!container || !window.politicians) return;

  // Find unikke partier
  const parties = [...new Set(window.politicians.map(p => p.party))].sort();

  let html = `
    <button class="party-chip active px-4 py-1.5 text-sm rounded-full border transition-all bg-[#C8102E] text-white border-[#C8102E]" data-party="">
      Alle
    </button>
  `;

  parties.forEach(party => {
    html += `
      <button class="party-chip px-4 py-1.5 text-sm rounded-full border transition-all hover:bg-slate-100 border-slate-300" data-party="${party}">
        ${party}
      </button>
    `;
  });

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
      c.classList.remove('active', 'bg-[#C8102E]', 'text-white', 'border-[#C8102E]');
      c.classList.add('border-slate-300', 'hover:bg-slate-100');
    });

    // Tilføj active til valgt
    chip.classList.add('active', 'bg-[#C8102E]', 'text-white', 'border-[#C8102E]');
    chip.classList.remove('border-slate-300', 'hover:bg-slate-100');

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

  // Søgning (hvis der er tekst i søgefeltet)
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value.trim() !== '') {
    const term = searchInput.value.trim().toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.party.toLowerCase().includes(term)
    );
  }

  // Render
  if (typeof window.renderPoliticians === 'function') {
    window.renderPoliticians(filtered);
  }

  // Opdater tæller midlertidigt til det filtrerede antal
  const countEl = document.getElementById('politician-count');
  if (countEl) {
    countEl.textContent = `${filtered.length} politikere`;
  }
}

// Gør applyFilters global hvis nødvendigt
window.applyFilters = applyFilters;

window.onload = initializeEverything;