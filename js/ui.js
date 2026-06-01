// js/ui.js - Render politikere på forsiden (med global open funktion + stjerner + billed-avatar + bruger-påvirket score)

// ============================================
// INFINITE SCROLL STATE (tilføjet juni 2026)
// ============================================
let visibleCount = 8;
let isLoadingMore = false;
let isSearchActive = false;

// Hjælpefunktion til stjerner (duplikeret fra modal for uafhængighed)
function createStars(severity) {
  if (!severity || severity < 1) severity = 1;
  if (severity > 5) severity = 5;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= severity) {
      html += '<i class="fa-solid fa-star text-[#C8102E]"></i>';
    } else {
      html += '<i class="fa-solid fa-star text-slate-300"></i>';
    }
  }
  return html;
}

// Global funktion der altid er tilgængelig
window.openPoliticianModal = function(id) {
  if (typeof window.showPoliticianModal === 'function') {
    window.showPoliticianModal(id);
  } else {
    console.error('showPoliticianModal ikke fundet - prøv at genindlæse siden');
    alert('Der opstod en fejl. Prøv at genindlæse siden (Ctrl + Shift + R).');
  }
};

/**
 * Viser skeleton cards med det samme for bedre oplevet performance
 * Kaldes automatisk på index.html
 */
function showSkeletonCards(count = 8) {
  const grid = document.getElementById('politiciansGrid');
  if (!grid) return;

  let html = '';

  for (let i = 0; i < count; i++) {
    html += `
      <div class="bg-white border border-slate-200 rounded-3xl p-6 animate-pulse">
        <div class="flex items-start justify-between mb-4">
          <!-- Avatar skeleton -->
          <div class="w-14 h-14 bg-slate-200 rounded-2xl flex-shrink-0"></div>
          
          <div class="text-right space-y-1.5">
            <div class="h-3 w-16 bg-slate-200 rounded ml-auto"></div>
            <div class="h-2.5 w-12 bg-slate-200 rounded ml-auto"></div>
          </div>
        </div>

        <!-- Navn skeleton -->
        <div class="h-6 w-3/4 bg-slate-200 rounded mb-3"></div>

        <!-- Stats skeleton -->
        <div class="flex items-center gap-x-4 mb-3">
          <div class="h-3 w-20 bg-slate-200 rounded"></div>
          <div class="h-3 w-16 bg-slate-200 rounded"></div>
        </div>

        <!-- Stjerner skeleton -->
        <div class="flex items-center gap-x-2 mb-4">
          <div class="h-3 w-24 bg-slate-200 rounded"></div>
        </div>

        <!-- Link skeleton -->
        <div class="h-3 w-20 bg-slate-200 rounded"></div>
      </div>
    `;
  }

  grid.innerHTML = html;
}

// Gør skeleton funktion global (kan kaldes manuelt hvis nødvendigt)
window.showSkeletonCards = showSkeletonCards;

function renderPoliticians(filteredPoliticians = null) {
  const grid = document.getElementById('politiciansGrid');
  if (!grid) return;

  let toRender;

  if (filteredPoliticians && Array.isArray(filteredPoliticians)) {
    // Søgning aktiv → vis ALLE matchende resultater med det samme
    toRender = filteredPoliticians;
    isSearchActive = true;
  } else {
    // Normal visning / infinite scroll
    isSearchActive = false;
    const source = window.politicians || [];
    toRender = source.slice(0, visibleCount);
  }

  let html = '';
  toRender.forEach(politician => {
    const scandalCount = politician.scandals ? politician.scandals.length : 0;
    const brokenCount = politician.brokenPromises ? politician.brokenPromises.length : 0;

    // Beregn gennemsnitlig voresSeverity
    let avgSeverity = 0;
    let userAvgSeverity = 0;
    let userRatedCount = 0;
    if (politician.scandals && politician.scandals.length > 0) {
      const severities = politician.scandals.map(s => s.ourSeverity || s.severity || 3);
      avgSeverity = severities.reduce((a, b) => a + b, 0) / severities.length;

      // Brugerens egne bedømmelser fra localStorage
      const polId = politician.id || politician.name.replace(/\s+/g, '-').toLowerCase();
      let userSum = 0;
      politician.scandals.forEach(s => {
        const scId = s.id || s.title.replace(/\s+/g, '-').toLowerCase();
        const key = `userSeverity_${polId}_${scId}`;
        const userRating = parseInt(localStorage.getItem(key) || '0');
        if (userRating > 0) {
          userSum += userRating;
          userRatedCount++;
        }
      });
      if (userRatedCount > 0) {
        userAvgSeverity = userSum / userRatedCount;
      }
    }

    const starsHTML = createStars(Math.round(avgSeverity));
    const userStarsHTML = userRatedCount > 0 ? createStars(Math.round(userAvgSeverity)) : '';

    // Avatar: billede hvis tilgængeligt, ellers initialer (forbedret version med fast container)
    let avatarHTML = '';
    const avatarColor = politician.avatarColor || politician.partyColor || '#C8102E';
    const initials = politician.initials || politician.name.split(' ').map(n => n[0]).join('');
    if (politician.image) {
      avatarHTML = `<div class="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0">
        <img src="${politician.image}" alt="${politician.name}" class="w-full h-full object-cover" loading="lazy" onerror="this.parentElement.innerHTML = \`<div class='w-full h-full flex items-center justify-center text-white font-bold text-xl' style='background-color: ${avatarColor}'>${initials}</div>\`;">
      </div>`;
    } else {
      avatarHTML = `<div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0" style="background-color: ${avatarColor}">${initials}</div>`;
    }

    html += `
      <div onclick="window.openPoliticianModal(${politician.id})" 
           class="politician-card bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer hover:border-[#C8102E]/30 shadow-sm hover:shadow-md transition-all group" data-id="${politician.id}">
        <div class="flex items-start justify-between mb-4">
          ${avatarHTML}
          <div class="text-right">
            <div class="text-xs text-slate-400">${politician.party}</div>
            <div class="text-[10px] text-slate-400">${politician.role || ''}</div>
          </div>
        </div>
        
        <div class="font-bold text-xl mb-1 group-hover:text-[#C8102E] transition-colors">${politician.name}</div>
        
        <div class="flex items-center gap-x-3 text-xs text-slate-500 mb-2">
          <div class="flex items-center gap-x-1">
            <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
            <span>${scandalCount} skandaler</span>
          </div>
          <div class="flex items-center gap-x-1">
            <i class="fa-solid fa-link text-[#C8102E]"></i>
            <span>${brokenCount} løfter</span>
          </div>
        </div>

        <!-- STJERNER PÅ FORSIDEN - Opdateret: Renere visning uden prompt-tekst -->
        <div class="mb-3">
          <div class="flex items-center gap-x-2 text-xs text-slate-500">
            <div class="flex items-center gap-x-1">
              <span class="font-medium">Vores vurdering:</span> 
              <span class="text-amber-500">${starsHTML}</span>
              <span>${avgSeverity.toFixed(1)}/5</span>
            </div>
            ${userRatedCount > 0 ? `
            <div class="flex items-center gap-x-1 border-l pl-2">
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
  });

  grid.innerHTML = html;

  // Opdater "Alle vist" besked
  updateAllShownMessage();
}

// Gør renderPoliticians global så search.js kan kalde den
window.renderPoliticians = renderPoliticians;


// ============================================
// INFINITE SCROLL FUNKTIONER
// ============================================

function updateAllShownMessage() {
  const shownEl = document.getElementById('all-politicians-shown');
  if (!shownEl) return;

  const total = (window.politicians || []).length;
  if (!isSearchActive && visibleCount >= total && total > 0) {
    shownEl.classList.remove('hidden');
  } else {
    shownEl.classList.add('hidden');
  }
}

function showInfiniteLoader(show) {
  const loader = document.getElementById('infinite-scroll-loader');
  if (loader) {
    if (show) {
      loader.classList.remove('hidden');
      loader.classList.add('flex');
    } else {
      loader.classList.add('hidden');
      loader.classList.remove('flex');
    }
  }
}

/**
 * Øger visibleCount og gen-render
 */
function loadMorePoliticians() {
  if (isLoadingMore || isSearchActive) return;

  const total = (window.politicians || []).length;
  if (visibleCount >= total) {
    updateAllShownMessage();
    return;
  }

  isLoadingMore = true;
  showInfiniteLoader(true);

  setTimeout(() => {
    visibleCount = Math.min(visibleCount + 8, total);
    
    if (typeof window.renderPoliticians === 'function') {
      window.renderPoliticians();
    }

    showInfiniteLoader(false);
    isLoadingMore = false;

    if (visibleCount >= total) {
      updateAllShownMessage();
    }
  }, 180);
}

/**
 * Nulstiller til start-tilstand (8 politikere)
 */
function resetVisibleCount() {
  visibleCount = 8;
  isSearchActive = false;
  const shownEl = document.getElementById('all-politicians-shown');
  if (shownEl) shownEl.classList.add('hidden');
}

// Gør funktionerne globale
window.resetVisibleCount = resetVisibleCount;
window.loadMorePoliticians = loadMorePoliticians;

/**
 * Sætter scroll listener op for infinite scroll
 */
function setupInfiniteScroll() {
  let scrollTimeout = null;

  window.addEventListener('scroll', () => {
    if (isSearchActive || isLoadingMore) return;

    const total = (window.politicians || []).length;
    if (visibleCount >= total) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 220) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isLoadingMore && visibleCount < total) {
          loadMorePoliticians();
        }
      }, 80);
    }
  });

  console.log('%c[ui.js] Infinite Scroll aktiveret (visibleCount starter på 8)', 'color: #10b981; font-size: 10px');
}

// Initialiser skeleton + infinite scroll
 document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('politiciansGrid');
  if (grid) {
    // Vis skeleton med det samme for bedre oplevet hastighed
    showSkeletonCards(8);
    
    // Start infinite scroll
    setupInfiniteScroll();
  }
});


// ============================================
// MOBIL MENU (gendannet)
// ============================================

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
    closeButton.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
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

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
});