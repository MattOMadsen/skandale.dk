// js/main.js - Hovedfil (batch-loading + progressive rendering)

let currentPartyFilter = '';
let currentFolketingFilter = 'folketing';
let detailsLoadStarted = false;

function getVisiblePoliticiansForEnrichment() {
  if (typeof window.getFilteredPoliticians !== 'function') {
    return (window.politicians || []).slice(0, 8);
  }
  return window.getFilteredPoliticians().slice(0, 8);
}

async function loadDetailsInBackground() {
  if (detailsLoadStarted || !window.politicians?.length || !window.SiteStats) return;
  detailsLoadStarted = true;

  const all = window.politicians;
  const visibleIds = new Set(getVisiblePoliticiansForEnrichment().map(p => p.id));

  await SiteStats.enrichSummariesBatch(all, 6);

  getVisiblePoliticiansForEnrichment().forEach(p => {
    if (typeof window.updatePoliticianCard === 'function') {
      window.updatePoliticianCard(p);
    }
  });

  if (typeof window.renderStatsSnapshot === 'function') {
    window.renderStatsSnapshot();
  }

  for (let i = 0; i < all.length; i += 3) {
    const batch = all.slice(i, i + 3);
    await Promise.all(
      batch.map(p => window.loadPoliticianDetails(p).catch(() => p))
    );

    batch.forEach(p => {
      if (visibleIds.has(p.id) && typeof window.updatePoliticianCard === 'function') {
        window.updatePoliticianCard(p);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 16));
  }

  if (typeof window.buildCrossReferenceIndices === 'function') {
    window.buildCrossReferenceIndices();
  }

  if (typeof window.renderStatsSnapshot === 'function') {
    window.renderStatsSnapshot();
  }
}

function showHomeLoadError(message) {
  const grid = document.getElementById('politiciansGrid');
  const stats = document.getElementById('stats-snapshot');

  if (stats) {
    stats.innerHTML = `
      <div class="bg-white/10 border border-white/20 rounded-3xl p-6 text-white text-sm">
        Kunne ikke indlæse statistik. ${message}
      </div>
    `;
  }

  if (grid) {
    grid.innerHTML = `
      <div class="col-span-full rounded-3xl border border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-800 p-6 text-red-800 dark:text-red-200">
        <p class="font-semibold mb-2">Kunne ikke indlæse politikere</p>
        <p class="text-sm mb-4">${message}</p>
        <button type="button" onclick="window.location.reload()" class="px-4 py-2 rounded-xl bg-[#C8102E] text-white text-sm font-medium">Prøv igen</button>
      </div>
    `;
  }
}

function bindPoliticianGridClicks() {
  const grid = document.getElementById('politiciansGrid');
  if (!grid || grid.dataset.clickBound === 'true') return;

  grid.dataset.clickBound = 'true';
  grid.addEventListener('click', function(e) {
    const card = e.target.closest('.politician-card');
    if (card && card.dataset.id) {
      const id = parseInt(card.dataset.id, 10);
      if (typeof window.showPoliticianModal === 'function') {
        window.showPoliticianModal(id);
      }
    }
  });
}

async function initializeEverything() {
  if (typeof window.renderPoliticianSkeletons === 'function') {
    window.renderPoliticianSkeletons(8);
  }

  try {
    const loaded = await loadPoliticians();

    if (!loaded || loaded.length === 0) {
      showHomeLoadError('Tjek din internetforbindelse og genindlæs siden (Ctrl+Shift+R).');
      return;
    }

    const visible = getVisiblePoliticiansForEnrichment();

    if (window.SiteStats) {
      await SiteStats.enrichSummariesBatch(visible, visible.length || 8);
    }

    if (typeof window.renderPoliticians === 'function') {
      window.renderPoliticians();
    }

    updatePoliticianCount();
    initFolketingFilter();
    initPartyFilterChips();
    setupPartyFilterListeners();

    if (typeof window.renderStatsSnapshot === 'function') {
      window.renderStatsSnapshot();
    }

    bindPoliticianGridClicks();

    if (typeof window.setVersion === 'function') {
      window.setVersion();
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => loadDetailsInBackground(), { timeout: 2500 });
    } else {
      setTimeout(loadDetailsInBackground, 400);
    }
  } catch (error) {
    console.error('[main] initializeEverything fejlede:', error);
    showHomeLoadError('Der opstod en uventet fejl under indlæsning.');
  }
}

function getFolketingCount() {
  if (!window.politicians) return 0;
  return window.politicians.filter(p => p.inFolketinget === true).length;
}

function sortPoliticians(list) {
  // Ren alfabetisk sortering på dansk (A-Å). Gælder både "Folketinget nu" og "Alle politikere".
  return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'da'));
}

function getFilteredPoliticians() {
  if (!window.politicians) return [];

  let filtered = window.politicians;

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
        (p.name && p.name.toLowerCase().includes(normalizedTerm)) ||
        (p.party && p.party.toLowerCase().includes(normalizedTerm))
      );
    }
  } else {
    if (currentFolketingFilter === 'folketing') {
      filtered = filtered.filter(p => p.inFolketinget === true);
    }
    filtered = sortPoliticians(filtered);
  }

  return filtered;
}

function updatePoliticianCount(filteredLength = null) {
  const countEl = document.getElementById('politician-count');
  if (!countEl || !window.politicians) return;

  const count = filteredLength !== null ? filteredLength : getFilteredPoliticians().length;
  const suffix = (currentFolketingFilter === 'folketing' && !document.getElementById('searchInput')?.value) ? ' i Folketinget' : '';
  countEl.textContent = `${count} politikere${suffix}`;
}

function initFolketingFilter() {
  const container = document.getElementById('folketing-filter');
  if (!container) return;

  const chips = container.querySelectorAll('[data-folketing]');
  chips.forEach(chip => {
    chip.onclick = () => {
      chips.forEach(c => {
        c.classList.remove('active', 'bg-[#C8102E]', 'text-white', 'shadow-sm');
        c.classList.add('text-slate-700', 'dark:text-slate-300', 'hover:bg-white/60', 'dark:hover:bg-slate-700/60');
      });

      chip.classList.add('active', 'bg-[#C8102E]', 'text-white', 'shadow-sm');
      chip.classList.remove('text-slate-700', 'dark:text-slate-300', 'hover:bg-white/60', 'dark:hover:bg-slate-700/60');

      currentFolketingFilter = chip.dataset.folketing || 'folketing';

      if (typeof window.resetVisibleCount === 'function') {
        window.resetVisibleCount();
      }

      if (typeof applyFilters === 'function') {
        applyFilters();
      }
    };
  });
}

function initPartyFilterChips() {
  const container = document.getElementById('party-filter-chips');
  if (!container || !window.politicians) return;

  const parties = [...new Set(window.politicians.map(p => p.party))].sort();

  let html = `
    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
      <button class="party-chip active shrink-0 snap-start px-5 py-2 text-sm font-medium rounded-full transition-colors bg-[#C8102E] text-white shadow-sm" data-party="">
        Alle partier
      </button>
  `;

  parties.forEach(party => {
    html += `
      <button class="party-chip shrink-0 snap-start px-5 py-2 text-sm font-medium rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 transition-colors whitespace-nowrap" data-party="${party}">
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
    const total = currentFolketingFilter === 'folketing' && !hasTerm
      ? getFolketingCount()
      : window.politicians.length;
    window.updateSearchUI(filtered.length, total, hasTerm);
  }
}

window.getFilteredPoliticians = getFilteredPoliticians;
window.applyFilters = applyFilters;
window.initializeEverything = initializeEverything;

function bootHomePage() {
  if (document.getElementById('politiciansGrid')) {
    initializeEverything();
  }
}

document.addEventListener('DOMContentLoaded', bootHomePage);
window.bootHomePage = bootHomePage;