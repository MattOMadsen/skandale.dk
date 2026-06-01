// js/search.js - Avanceret søgefunktion til Skandale.dk (dedikeret modul)
// Holder ui.js lille og ren

let searchTimeout = null;

function debounce(func, delay = 200) {
  return function(...args) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00e6/g, 'ae')
    .replace(/\u00f8/g, 'oe')
    .replace(/\u00e5/g, 'aa');
}

function calculateSearchScore(politician, term) {
  if (!term || !politician) return 0;
  const normalizedTerm = normalizeText(term);
  let score = 0;

  const name = normalizeText(politician.name || '');
  const party = normalizeText(politician.party || '');
  const role = normalizeText(politician.role || '');

  // Prioritet 1: Navn (højest vægt)
  if (name === normalizedTerm) score += 100;
  else if (name.startsWith(normalizedTerm)) score += 80;
  else if (name.includes(normalizedTerm)) score += 60;

  // Prioritet 2: Parti
  if (party.includes(normalizedTerm)) score += 40;

  // Prioritet 3: Rolle
  if (role.includes(normalizedTerm)) score += 30;

  // Prioritet 4: Skandaler (så man kan søge på "mink" eller "skattesag")
  if (politician.scandals && politician.scandals.length > 0) {
    const scandalText = politician.scandals
      .map(s => normalizeText((s.title || '') + ' ' + (s.description || '')))
      .join(' ');
    if (scandalText.includes(normalizedTerm)) score += 25;
  }

  return score;
}

function updateSearchUI(count, total, hasTerm) {
  const inputContainer = document.getElementById('searchInput')?.parentNode;
  if (!inputContainer) return;

  // Fjern gammel tæller
  const oldCount = document.getElementById('search-result-count');
  if (oldCount) oldCount.remove();

  // Fjern gammel clear-knap
  const oldClear = document.getElementById('search-clear-btn');
  if (oldClear) oldClear.remove();

  if (hasTerm) {
    // Live resultat-tæller
    const countEl = document.createElement('div');
    countEl.id = 'search-result-count';
    countEl.className = 'text-center text-sm text-slate-500 mt-2';
    countEl.textContent = `Viser ${count} af ${total} politikere`;
    inputContainer.appendChild(countEl);

    // Dynamisk clear-knap (✕)
    const clearBtn = document.createElement('button');
    clearBtn.id = 'search-clear-btn';
    clearBtn.type = 'button';
    clearBtn.innerHTML = '<i class="fa-solid fa-times text-xl text-slate-400 hover:text-[#C8102E] transition-colors"></i>';
    clearBtn.className = 'absolute right-5 top-[17px] cursor-pointer z-10';
    clearBtn.onclick = () => {
      const input = document.getElementById('searchInput');
      if (input) {
        input.value = '';
        if (typeof window.resetVisibleCount === 'function') {
          window.resetVisibleCount();
        }
        filterPoliticians();
      }
    };
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(clearBtn);
  }
}

function filterPoliticians() {
  const input = document.getElementById('searchInput');
  if (!input || !window.politicians || !Array.isArray(window.politicians)) {
    console.warn('[search.js] politicians array ikke klar endnu');
    return;
  }

  const term = input.value.trim();
  const hasTerm = term.length > 0;

  let filtered = window.politicians;

  if (hasTerm) {
    // Score + sortér efter relevans
    const scored = window.politicians
      .map(p => ({
        politician: p,
        score: calculateSearchScore(p, term)
      }))
      .filter(item => item.score > 0);

    scored.sort((a, b) => b.score - a.score);
    filtered = scored.map(item => item.politician);

    // Nulstil visibleCount så alle matchende vises
    if (typeof window.resetVisibleCount === 'function') {
      window.resetVisibleCount();
    }
  } else {
    // Søgning ryddet → gå tilbage til infinite scroll start
    if (typeof window.resetVisibleCount === 'function') {
      window.resetVisibleCount();
    }
  }

  // Render de filtrerede politikere
  if (typeof window.renderPoliticians === 'function') {
    window.renderPoliticians(filtered);
  } else if (typeof renderPoliticians === 'function') {
    renderPoliticians(filtered);
  }

  // Opdater UI (tæller + clear-knap)
  updateSearchUI(filtered.length, window.politicians.length, hasTerm);
}

// Gør funktionen global så onkeyup i HTML virker
window.filterPoliticians = filterPoliticians;

// ESC-tast rydder søgefeltet
 document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const input = document.getElementById('searchInput');
    if (input && input.value) {
      input.value = '';
      if (typeof window.resetVisibleCount === 'function') {
        window.resetVisibleCount();
      }
      filterPoliticians();
    }
  }
});

// Lyt efter når data er loadet (sikrer at søgning virker med det samme)
window.addEventListener('politiciansLoaded', () => {
  const input = document.getElementById('searchInput');
  if (input && input.value) filterPoliticians();
});

console.log('%c[search.js] Avanceret søgefunktion (v1.0) indlæst – klar til brug', 'color: #10b981; font-size: 10px');