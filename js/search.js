// js/search.js - Avanceret søgefunktion til Skandale.dk (dedikeret modul)

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

  if (name === normalizedTerm) score += 100;
  else if (name.startsWith(normalizedTerm)) score += 80;
  else if (name.includes(normalizedTerm)) score += 60;

  if (party.includes(normalizedTerm)) score += 40;

  if (role.includes(normalizedTerm)) score += 30;

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

  const oldCount = document.getElementById('search-result-count');
  if (oldCount) oldCount.remove();

  const oldClear = document.getElementById('search-clear-btn');
  if (oldClear) oldClear.remove();

  if (hasTerm) {
    const countEl = document.createElement('div');
    countEl.id = 'search-result-count';
    countEl.className = 'text-center text-sm text-slate-500 mt-2';
    countEl.textContent = `Viser ${count} af ${total} politikere`;
    inputContainer.appendChild(countEl);

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
        if (typeof window.applyFilters === 'function') {
          window.applyFilters();
        }
      }
    };
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(clearBtn);
  }
}

function filterPoliticians() {
  if (!window.politicians || !Array.isArray(window.politicians)) {
    console.warn('[search.js] politicians array ikke klar endnu');
    return;
  }

  if (typeof window.applyFilters === 'function') {
    window.applyFilters();
  }
}

window.calculateSearchScore = calculateSearchScore;
window.updateSearchUI = updateSearchUI;
window.filterPoliticians = filterPoliticians;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const input = document.getElementById('searchInput');
    if (input && input.value) {
      input.value = '';
      if (typeof window.resetVisibleCount === 'function') {
        window.resetVisibleCount();
      }
      if (typeof window.applyFilters === 'function') {
        window.applyFilters();
      }
    }
  }
});

window.addEventListener('politiciansLoaded', () => {
  const input = document.getElementById('searchInput');
  if (input && input.value) filterPoliticians();
});

console.log('%c[search.js] Avanceret søgefunktion (v1.1) indlæst – klar til brug', 'color: #10b981; font-size: 10px');