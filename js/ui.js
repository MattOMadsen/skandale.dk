// js/ui.js - Render politikere på forsiden (incremental DOM + IntersectionObserver)
// Forbedret version: Konstanter ekstraheret for bedre vedligeholdelse + robusthed

// === Konfiguration (nem at tune performance uden at ændre logik) ===
const INITIAL_VISIBLE_COUNT = 8;
const LOAD_BATCH_SIZE = 8;
const SCROLL_ROOT_MARGIN = '240px';

let visibleCount = INITIAL_VISIBLE_COUNT;
let isLoadingMore = false;
let isSearchActive = false;
let renderedCount = 0;
let scrollObserver = null;
let userRatingsCache = null;

function getUserRatingsCache() {
  if (userRatingsCache) return userRatingsCache;
  userRatingsCache = new Map();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('userSeverity_')) {
        const val = parseInt(localStorage.getItem(key) || '0', 10);
        if (val > 0) userRatingsCache.set(key, val);
      }
    }
  } catch (e) {
    // Silent fail i produktion - localStorage kan være deaktiveret eller fuld
    console.warn('Kunne ikke læse bruger-ratings fra localStorage');
  }
  return userRatingsCache;
}

function invalidateUserRatingsCache() {
  userRatingsCache = null;
}

function createStars(severity) {
  if (!severity || severity < 1) severity = 1;
  if (severity > 5) severity = 5;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= severity
      ? '<i class="fa-solid fa-star text-[#C8102E]"></i>'
      : '<i class="fa-solid fa-star text-slate-300 dark:text-slate-600"></i>';
  }
  return html;
}

window.openPoliticianModal = function(id) {
  if (typeof window.showPoliticianModal === 'function') {
    window.showPoliticianModal(id);
  } else {
    console.error('showPoliticianModal ikke fundet - prøv at genindlæse siden');
    alert('Der opstod en fejl. Prøv at genindlæse siden (Ctrl + Shift + R).');
  }
};

function getPoliticianStats(politician) {
  const scandalCount = politician.scandals
    ? politician.scandals.length
    : (politician._scandalCount ?? null);
  const brokenCount = politician.brokenPromises
    ? politician.brokenPromises.length
    : (politician._brokenCount ?? null);

  let avgSeverity = null;
  let userAvgSeverity = null;
  let userRatedCount = 0;

  if (politician.scandals && politician.scandals.length > 0) {
    const severities = politician.scandals.map(s => s.ourSeverity || s.severity || 3);
    avgSeverity = severities.reduce((a, b) => a + b, 0) / severities.length;

    const ratings = getUserRatingsCache();
    const polId = politician.id || politician.name.replace(/\s+/g, '-').toLowerCase();
    let userSum = 0;
    politician.scandals.forEach(s => {
      const scId = s.id || s.title.replace(/\s+/g, '-').toLowerCase();
      const userRating = ratings.get(`userSeverity_${polId}_${scId}`) || 0;
      if (userRating > 0) {
        userSum += userRating;
        userRatedCount++;
      }
    });
    if (userRatedCount > 0) {
      userAvgSeverity = userSum / userRatedCount;
    }
  }

  return { scandalCount, brokenCount, avgSeverity, userAvgSeverity, userRatedCount };
}

function buildPoliticianCardHTML(politician) {
  const { scandalCount, brokenCount, avgSeverity, userAvgSeverity, userRatedCount } = getPoliticianStats(politician);

  const scandalLabel = scandalCount == null ? '…' : scandalCount;
  const brokenLabel = brokenCount == null ? '…' : brokenCount;

  const starsHTML = avgSeverity != null ? createStars(Math.round(avgSeverity)) : '<span class="text-white/50">…</span>';
  const severityLabel = avgSeverity != null ? `${avgSeverity.toFixed(1)}/5` : '…';
  const userStarsHTML = userRatedCount > 0 ? createStars(Math.round(userAvgSeverity)) : '';

  const avatarColor = politician.avatarColor || politician.partyColor || '#C8102E';
  const initials = politician.initials || politician.name.split(' ').map(n => n[0]).join('');

  let avatarHTML = '';
  if (politician.image) {
    avatarHTML = `<div class="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
      <img src="${politician.image}" alt="${politician.name}" class="w-full h-full object-cover" loading="lazy" decoding="async" width="56" height="56" onerror="this.parentElement.innerHTML = \`<div class='w-full h-full flex items-center justify-center text-white font-bold text-xl' style='background-color: ${avatarColor}'>${initials}</div>\`;">
    </div>`;
  } else {
    avatarHTML = `<div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0" style="background-color: ${avatarColor}">${initials}</div>`;
  }

  return `
    <div onclick="window.openPoliticianModal(${politician.id})"
         class="politician-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 cursor-pointer hover:border-[#C8102E]/30 dark:hover:border-[#C8102E]/50 shadow-sm hover:shadow-md group"
         data-id="${politician.id}">
      <div class="flex items-start justify-between mb-4">
        ${avatarHTML}
        <div class="text-right">
          <div class="text-xs text-slate-400 dark:text-slate-500">${politician.party}</div>
          <div class="text-[10px] text-slate-400 dark:text-slate-500">${politician.role || ''}</div>
          ${!politician.inFolketinget ? `<div class="mt-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">Tidligere</div>` : ''}
        </div>
      </div>

      <div class="font-bold text-xl mb-1 group-hover:text-[#C8102E] transition-colors">${politician.name}</div>

      <div class="flex items-center gap-x-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
        <div class="flex items-center gap-x-1">
          <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
          <span data-stat="scandals">${scandalLabel} skandaler</span>
        </div>
        <div class="flex items-center gap-x-1">
          <i class="fa-solid fa-link text-[#C8102E]"></i>
          <span data-stat="promises">${brokenLabel} løfter</span>
        </div>
      </div>

      <div class="mb-3">
        <div class="flex items-center gap-x-2 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-x-1">
            <span class="font-medium">Vores vurdering:</span>
            <span class="text-amber-500" data-stat="stars">${starsHTML}</span>
            <span data-stat="severity">${severityLabel}</span>
          </div>
          ${userRatedCount > 0 ? `
          <div class="flex items-center gap-x-1 border-l pl-2 border-slate-200 dark:border-slate-700">
            <span class="font-medium">Dine stemmer:</span>
            <span class="text-[#C8102E]">${userStarsHTML}</span>
            <span>${userAvgSeverity.toFixed(1)}/5</span>
          </div>` : ''}
        </div>
      </div>

      <div class="flex items-center justify-between text-xs">
        <div class="text-[#C8102E] group-hover:underline">Se detaljer →</div>
      </div>
    </div>
  `;
}

function appendPoliticianCards(grid, politicians) {
  if (!politicians.length) return;

  const fragment = document.createDocumentFragment();
  politicians.forEach(politician => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildPoliticianCardHTML(politician).trim();
    fragment.appendChild(wrapper.firstElementChild);
  });
  grid.appendChild(fragment);
}

function updatePoliticianCard(politician) {
  const grid = document.getElementById('politiciansGrid');
  if (!grid || !politician) return;

  const card = grid.querySelector(`.politician-card[data-id="${politician.id}"]`);
  if (!card) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildPoliticianCardHTML(politician).trim();
  const fresh = wrapper.firstElementChild;
  if (fresh) card.replaceWith(fresh);
}

function renderPoliticians(filteredPoliticians = null, options = {}) {
  const grid = document.getElementById('politiciansGrid');
  if (!grid) return;

  const appendOnly = options.appendOnly === true;

  if (filteredPoliticians && Array.isArray(filteredPoliticians)) {
    isSearchActive = true;
    grid.innerHTML = '';
    renderedCount = 0;
    appendPoliticianCards(grid, filteredPoliticians);
    renderedCount = filteredPoliticians.length;
  } else {
    isSearchActive = false;
    const source = (typeof window.getFilteredPoliticians === 'function')
      ? window.getFilteredPoliticians()
      : (window.politicians || []);
    const targetCount = Math.min(visibleCount, source.length);

    if (!appendOnly || renderedCount === 0 || targetCount < renderedCount) {
      grid.innerHTML = '';
      renderedCount = 0;
      appendPoliticianCards(grid, source.slice(0, targetCount));
      renderedCount = targetCount;
    } else if (targetCount > renderedCount) {
      appendPoliticianCards(grid, source.slice(renderedCount, targetCount));
      renderedCount = targetCount;
    }
  }

  updateAllShownMessage();
}

window.renderPoliticians = renderPoliticians;
window.updatePoliticianCard = updatePoliticianCard;
window.invalidateUserRatingsCache = invalidateUserRatingsCache;

function updateAllShownMessage() {
  const shownEl = document.getElementById('all-politicians-shown');
  if (!shownEl) return;

  const source = (typeof window.getFilteredPoliticians === 'function')
    ? window.getFilteredPoliticians()
    : (window.politicians || []);
  const total = source.length;

  if (!isSearchActive && renderedCount >= total && total > 0) {
    shownEl.classList.remove('hidden');
  } else {
    shownEl.classList.add('hidden');
  }
}

function showInfiniteLoader(show) {
  const loader = document.getElementById('infinite-scroll-loader');
  if (!loader) return;
  loader.classList.toggle('hidden', !show);
  loader.classList.toggle('flex', show);
}

function loadMorePoliticians() {
  if (isLoadingMore || isSearchActive) return;

  const source = (typeof window.getFilteredPoliticians === 'function')
    ? window.getFilteredPoliticians()
    : (window.politicians || []);
  const total = source.length;

  if (renderedCount >= total) {
    updateAllShownMessage();
    return;
  }

  isLoadingMore = true;
  showInfiniteLoader(true);

  requestAnimationFrame(() => {
    visibleCount = Math.min(visibleCount + LOAD_BATCH_SIZE, total);
    renderPoliticians(null, { appendOnly: true });
    showInfiniteLoader(false);
    isLoadingMore = false;
    updateAllShownMessage();
  });
}

function resetVisibleCount() {
  visibleCount = INITIAL_VISIBLE_COUNT;
  renderedCount = 0;
  isSearchActive = false;
  const shownEl = document.getElementById('all-politicians-shown');
  if (shownEl) shownEl.classList.add('hidden');
}

window.resetVisibleCount = resetVisibleCount;
window.loadMorePoliticians = loadMorePoliticians;

function setupInfiniteScroll() {
  const sentinel = document.getElementById('scroll-sentinel');
  if (!sentinel) return;

  if (scrollObserver) scrollObserver.disconnect();

  scrollObserver = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      loadMorePoliticians();
    }
  }, { rootMargin: SCROLL_ROOT_MARGIN, threshold: 0 });

  scrollObserver.observe(sentinel);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('politiciansGrid')) {
    setupInfiniteScroll();
  }
});

function initMobileMenu() {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeButton = document.getElementById('mobile-menu-close');

  if (!menuButton || !mobileMenu) return;

  menuButton.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeMobileMenu);
  }

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

window.closeMobileMenu = closeMobileMenu;

document.addEventListener('DOMContentLoaded', initMobileMenu);