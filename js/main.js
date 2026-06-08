// js/main.js - Hovedfil der starter alt (med parti-filter + folketing-filter + dynamisk count + stats snapshot)

let currentPartyFilter = '';
let currentFolketingFilter = 'folketing';

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
    initFolketingFilter();
    initPartyFilterChips();
    setupPartyFilterListeners();

    if (typeof window.renderStatsSnapshot === 'function') {
      window.renderStatsSnapshot();
    }

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

    if (window.politicians && window.loadPoliticianDetails) {
      Promise.all(
        window.politicians.map(p =>
          window.loadPoliticianDetails(p).catch(err => {
            console.warn('Kunne ikke loade detaljer for', p.name, err);
            return p;
          })
        )
      ).then(() => {
        window.networkIndex = {};
        window.politicians.forEach(p => {
          if (p.affiliations && Array.isArray(p.affiliations)) {
            p.affiliations.forEach(aff => {
              const netName = aff.name || aff.organization || aff;
              if (typeof netName !== 'string') return;
              if (!window.networkIndex[netName]) window.networkIndex[netName] = [];
              window.networkIndex[netName].push({
                id: p.id,
                name: p.name,
                party: p.party,
                year: aff.year || '',
                role: aff.role || ''
              });
            });
          }
        });

        if (typeof window.renderStatsSnapshot === 'function') {
          window.renderStatsSnapshot();
        }
        applyFilters();

        console.log('%c[Skandale.dk] Baggrundsdetaljer + networkIndex loaded', 'color:#10b981');
      });
    }

    if (typeof setVersion === 'function') {
      setVersion();
    }

    console.log(`%c[Skandale.dk ${APP_VERSION}] Klar med folketing-filter + parti-filter + stats snapshot`, 'color:#10b981');
  });
}

function getFolketingCount() {
  if (!window.politicians) return 0;
  return window.politicians.filter(p => p.inFolketinget === true).length;
}

function sortPoliticians(list) {
  return [...list].sort((a, b) => {
    if (currentFolketingFilter === 'all') {
      const aFolk = a.inFolketinget ? 0 : 1;
      const bFolk = b.inFolketinget ? 0 : 1;
      if (aFolk !== bFolk) return aFolk - bFolk;
    }
    return (a.name || '').localeCompare(b.name || '', 'da');
  });
}

function getFilteredPoliticians() {
  if (!window.politicians) return [];

  let filtered = window.politicians;

  if (currentFolketingFilter === 'folketing') {
    filtered = filtered.filter(p => p.inFolketinget === true);
  }

  if (currentPartyFilter) {
    filtered = filtered.filter(p => p.party === currentPartyFilter);
  }

  const searchInput = document.getElementById('searchInput');
  const term = searchInput ? searchInput.value.trim() : '';

  if (term !== '') {
    if (typeof window.calculateSearchScore === 'function') {
      const scored = filtered
        .map(p => ({
          politician: p,
          score: window.calculateSearchScore(p, term)
        }))
        .filter(item => item.score > 0);

      scored.sort((a, b) => b.score - a.score);
      filtered = scored.map(item => item.politician);
    } else {
      const normalizedTerm = term.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(normalizedTerm) ||
        p.party.toLowerCase().includes(normalizedTerm)
      );
    }
  } else {
    filtered = sortPoliticians(filtered);
  }

  return filtered;
}

function updatePoliticianCount(filteredLength = null) {
  const countEl = document.getElementById('politician-count');
  if (!countEl || !window.politicians) return;

  const count = filteredLength !== null ? filteredLength : getFilteredPoliticians().length;
  const suffix = currentFolketingFilter === 'folketing' ? ' i Folketinget' : '';
  countEl.textContent = `${count} politikere${suffix}`;
}

function initFolketingFilter() {
  const container = document.getElementById('folketing-filter');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-folketing]');
    if (!chip) return;

    container.querySelectorAll('[data-folketing]').forEach(c => {
      c.classList.remove('active', 'bg-[#C8102E]', 'text-white', 'shadow-sm');
      c.classList.add('text-slate-700', 'dark:text-slate-300', 'hover:bg-white/60', 'dark:hover:bg-slate-700/60');
    });

    chip.classList.add('active', 'bg-[#C8102E]', 'text-white', 'shadow-sm');
    chip.classList.remove('text-slate-700', 'dark:text-slate-300', 'hover:bg-white/60', 'dark:hover:bg-slate-700/60');

    currentFolketingFilter = chip.dataset.folketing || 'folketing';

    if (typeof window.resetVisibleCount === 'function') {
      window.resetVisibleCount();
    }

    applyFilters();
  });
}

function initPartyFilterChips() {
  const container = document.getElementById('party-filter-chips');
  if (!container || !window.politicians) return;

  const parties = [...new Set(window.politicians.map(p => p.party))].sort();

  let html = `
    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
      <button class="party-chip active shrink-0 snap-start px-5 py-2 text-sm font-medium rounded-full transition-all bg-[#C8102E] text-white shadow-sm" data-party="">
        Alle partier
      </button>
  `;

  parties.forEach(party => {
    html += `
      <button class="party-chip shrink-0 snap-start px-5 py-2 text-sm font-medium rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 transition-all whitespace-nowrap" data-party="${party}">
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

    container.querySelectorAll('.party-chip').forEach(c => {
      c.classList.remove('active', 'bg-[#C8102E]', 'text-white', 'shadow-sm');
      c.classList.add('border-slate-300', 'dark:border-slate-600', 'text-slate-700', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-700');
    });

    chip.classList.add('active', 'bg-[#C8102E]', 'text-white', 'shadow-sm');
    chip.classList.remove('border-slate-300', 'dark:border-slate-600', 'text-slate-700', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-700');

    currentPartyFilter = chip.dataset.party || '';

    if (typeof window.resetVisibleCount === 'function') {
      window.resetVisibleCount();
    }

    applyFilters();
  });
}

function applyFilters() {
  if (!window.politicians) return;

  const searchInput = document.getElementById('searchInput');
  const hasTerm = searchInput && searchInput.value.trim() !== '';
  const filtered = getFilteredPoliticians();

  if (hasTerm) {
    if (typeof window.resetVisibleCount === 'function') {
      window.resetVisibleCount();
    }
    if (typeof window.renderPoliticians === 'function') {
      window.renderPoliticians(filtered);
    }
  } else if (typeof window.renderPoliticians === 'function') {
    window.renderPoliticians();
  }

  updatePoliticianCount(filtered.length);

  if (typeof window.updateSearchUI === 'function') {
    const total = currentFolketingFilter === 'folketing'
      ? getFolketingCount()
      : window.politicians.length;
    window.updateSearchUI(filtered.length, total, hasTerm);
  }
}

window.getFilteredPoliticians = getFilteredPoliticians;
window.applyFilters = applyFilters;