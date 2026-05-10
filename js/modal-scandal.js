// js/modal-scandal.js - Skandaler (med createStars + interaktiv bruger-vurdering af alvorlighed)
// Opdateret 10. maj 2026 – Fuldt kompatibel med MODAL-STRUKTUR.md v6.9.2
// Understøtter nu "consequences" og "whatShouldHaveHappened" + legacy fallback

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

function loadScandals(politician) {
  const container = document.getElementById('scandalsContainer');
  if (!container) return;

  if (!politician.scandals || politician.scandals.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-500">Ingen skandaler registreret for denne politiker.</div>`;
    return;
  }

  let html = '';
  politician.scandals.forEach((scandal, index) => {
    html += buildScandalHTML(scandal, index, politician);
  });

  container.innerHTML = html;

  // Event listeners for expand/collapse
  politician.scandals.forEach((scandal, index) => {
    const header = document.getElementById(`scandal-header-${index}`);
    if (header) {
      header.addEventListener('click', () => {
        const content = document.getElementById(`scandal-content-${index}`);
        const chevron = document.getElementById(`scandal-chevron-${index}`);
        
        if (content.classList.contains('hidden')) {
          content.classList.remove('hidden');
          chevron.classList.add('rotate-180');
        } else {
          content.classList.add('hidden');
          chevron.classList.remove('rotate-180');
        }
      });
    }
  });

  // Init interaktiv bruger-vurdering af alvorlighed
  politician.scandals.forEach((scandal, index) => {
    initUserSeverityRating(index, politician, scandal);
  });
}

function buildScandalHTML(scandal, index, politician) {
  // === LEGACY SUPPORT: Normaliser gamle data-formater ===
  const s = { ...scandal };

  if (!s.ourSeverity || s.ourSeverity < 1) s.ourSeverity = 3;
  if (!s.year && s.date) s.year = s.date;
  if (!s.shortDesc && !s.longDesc && s.description) {
    s.shortDesc = s.description;
  }

  // Konverter legacy source/sources til mediaLinks
  if (!s.mediaLinks) {
    if (s.source && s.source.url) {
      s.mediaLinks = [{
        name: s.source.text || 'Kilde',
        url: s.source.url
      }];
    } else if (s.sources && Array.isArray(s.sources)) {
      s.mediaLinks = s.sources.map((url, i) => ({
        name: `Kilde ${i + 1}`,
        url: url
      }));
    }
  }

  const polId = politician.id || politician.name.replace(/\s+/g, '-').toLowerCase();
  const scId = s.id || s.title.replace(/\s+/g, '-').toLowerCase();
  const ourSeverity = s.ourSeverity;

  const severityStars = createStars(ourSeverity);
  
  return `
    <div class="border border-slate-200 rounded-2xl mb-4 overflow-hidden">
      <!-- Header -->
      <div id="scandal-header-${index}" class="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
        <div class="flex-1">
          <div class="flex items-center gap-x-3">
            <div class="font-bold text-lg">${s.title}</div>
            <div class="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">${s.year || ''}</div>
          </div>
          <div class="flex items-center gap-x-2 mt-1">
            <div class="flex items-center text-amber-500">${severityStars}</div>
            <div class="text-xs text-slate-500">Alvorlighed: ${ourSeverity}/5 <span class="text-slate-400">(Vores vurdering)</span></div>
          </div>
        </div>
        <div class="flex items-center gap-x-2">
          <i id="scandal-chevron-${index}" class="fa-solid fa-chevron-down text-slate-400 transition-transform"></i>
        </div>
      </div>
      
      <!-- Content -->
      <div id="scandal-content-${index}" class="hidden p-4 border-t">
        <div class="space-y-4">
          <!-- Hvad skete der? -->
          <div>
            <div class="font-semibold text-sm text-slate-500 mb-1">Hvad skete der?</div>
            <div class="text-slate-700">${s.longDesc || s.shortDesc || s.description || ''}</div>
          </div>
          
          <!-- Konsekvenser (NYT - grøn overskrift) -->
          ${s.consequences ? `
            <div>
              <div class="font-semibold text-sm text-green-600 mb-1">Konsekvens:</div>
              <div class="text-slate-700">${s.consequences}</div>
            </div>
          ` : ''}
          
          <!-- Hvad burde være sket? (NYT - fremhævet boks med ⚖️ og orange/rød border) -->
          ${s.whatShouldHaveHappened ? `
            <div class="pt-4 border-t">
              <div class="font-semibold text-sm text-orange-600 mb-2 flex items-center gap-x-2">
                <i class="fa-solid fa-balance-scale"></i> 
                Hvad burde være sket?
              </div>
              <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
                <div class="font-bold text-orange-700">${s.whatShouldHaveHappened.title}</div>
                <div class="text-slate-700 mt-2">${s.whatShouldHaveHappened.content}</div>
              </div>
            </div>
          ` : ''}
          
          <!-- Legacy fallback: Udvikling / Konsekvens (gamle data) -->
          ${!s.consequences && s.outcome ? `
            <div>
              <div class="font-semibold text-sm text-slate-500 mb-1">Udvikling / Konsekvens</div>
              <div class="text-slate-700">${s.outcome}</div>
            </div>
          ` : ''}
          
          <!-- Legacy fallback: Juridisk vurdering (gamle data) -->
          ${!s.whatShouldHaveHappened && s.justiceAnalysis ? `
            <div>
              <div class="font-semibold text-sm text-slate-500 mb-1">Juridisk vurdering</div>
              <div class="text-slate-700">${s.justiceAnalysis}</div>
            </div>
          ` : ''}
          
          <!-- Media Links / Kilder -->
          ${s.mediaLinks && s.mediaLinks.length > 0 ? `
            <div>
              <div class="font-semibold text-sm text-slate-500 mb-2">Kilder & Medier</div>
              <div class="flex flex-wrap gap-2">
                ${s.mediaLinks.map(link => `
                  <a href="${link.url}" target="_blank" class="inline-flex items-center gap-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs hover:border-[#C8102E]/50 transition-colors">
                    <i class="fa-solid fa-external-link-alt text-[#C8102E]"></i>
                    <span>${link.name}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <!-- Brugerens alvorlighedsvurdering (1-5 stjerner) -->
          <div class="pt-4 border-t">
            <div class="font-semibold text-sm text-slate-500 mb-2">Hvor alvorlig synes du sagen er? (1-5 stjerner)</div>
            <div id="user-severity-container-${index}" data-our-severity="${ourSeverity}" class="flex items-center gap-x-1 text-2xl cursor-pointer"></div>
            <div id="user-severity-label-${index}" class="mt-1 text-xs text-slate-500"></div>
            <button id="reset-severity-btn-${index}" onclick="resetUserSeverity(${index}, '${polId}', '${scId}')" class="hidden mt-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <i class="fa-solid fa-undo mr-1"></i> Nulstil min bedømmelse
            </button>
          </div>
          
          <!-- Kommentarer -->
          <div class="pt-4 border-t">
            <div class="font-semibold text-sm text-slate-500 mb-2">Kommentarer</div>
            <div class="flex gap-x-2 mb-3">
              <input type="text" id="comment-input-${index}" placeholder="Skriv en kommentar..." class="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm">
              <button onclick="addComment(${index})" class="px-4 py-2 bg-[#C8102E] text-white rounded-xl text-sm font-medium hover:bg-[#C8102E]/90 transition-colors">
                Send
              </button>
            </div>
            <div id="comments-list-${index}" class="space-y-2 text-sm"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// === Interaktiv bruger-vurdering af alvorlighed (1-5 stjerner) ===

function initUserSeverityRating(index, politician, scandal) {
  const container = document.getElementById(`user-severity-container-${index}`);
  if (!container) return;

  const polId = politician.id || politician.name.replace(/\s+/g, '-').toLowerCase();
  const scId = scandal.id || scandal.title.replace(/\s+/g, '-').toLowerCase();
  const storageKey = `userSeverity_${polId}_${scId}`;
  
  let userRating = parseInt(localStorage.getItem(storageKey) || '0');
  const ourSeverity = scandal.ourSeverity || 3;

  renderInteractiveStars(container, index, polId, scId, userRating, ourSeverity);
  updateSeverityLabel(index, userRating, ourSeverity);

  const resetBtn = document.getElementById(`reset-severity-btn-${index}`);
  if (resetBtn) {
    resetBtn.classList.toggle('hidden', userRating === 0);
  }
}

function renderInteractiveStars(container, index, polId, scId, currentRating, ourSeverity) {
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('i');
    const isFilled = i <= currentRating;
    star.className = `fa-solid fa-star cursor-pointer transition-colors text-2xl ${isFilled ? 'text-[#C8102E]' : 'text-slate-300 hover:text-amber-400'}`;
    
    star.onclick = () => {
      saveUserSeverity(index, polId, scId, i);
    };
    
    star.onmouseenter = () => highlightStars(container, i, currentRating);
    star.onmouseleave = () => highlightStars(container, currentRating, currentRating);
    
    container.appendChild(star);
  }
}

function highlightStars(container, hoverRating, currentRating) {
  const stars = container.querySelectorAll('i');
  stars.forEach((star, idx) => {
    const starNum = idx + 1;
    if (starNum <= hoverRating) {
      star.classList.add('text-[#C8102E]');
      star.classList.remove('text-slate-300', 'hover:text-amber-400');
    } else {
      star.classList.remove('text-[#C8102E]');
      if (starNum > currentRating) {
        star.classList.add('text-slate-300');
      }
    }
  });
}

function saveUserSeverity(index, polId, scId, rating) {
  const storageKey = `userSeverity_${polId}_${scId}`;
  localStorage.setItem(storageKey, rating);
  
  const container = document.getElementById(`user-severity-container-${index}`);
  if (!container) return;
  
  const ourSeverity = container.dataset.ourSeverity ? parseInt(container.dataset.ourSeverity) : 3;
  
  renderInteractiveStars(container, index, polId, scId, rating, ourSeverity);
  updateSeverityLabel(index, rating, ourSeverity);
  
  const resetBtn = document.getElementById(`reset-severity-btn-${index}`);
  if (resetBtn) resetBtn.classList.remove('hidden');
}

function updateSeverityLabel(index, userRating, ourSeverity) {
  const label = document.getElementById(`user-severity-label-${index}`);
  if (!label) return;

  if (userRating > 0) {
    label.innerHTML = `<span class="font-medium text-[#C8102E]">Din bedømmelse: ${userRating}/5 stjerner</span>`;
  } else {
    label.innerHTML = `Vores vurdering: ${ourSeverity}/5 – klik på stjernerne for at give din egen`;
  }
}

function resetUserSeverity(index, polId, scId) {
  const storageKey = `userSeverity_${polId}_${scId}`;
  localStorage.removeItem(storageKey);
  
  const container = document.getElementById(`user-severity-container-${index}`);
  if (!container) return;
  
  const ourSeverity = container.dataset.ourSeverity ? parseInt(container.dataset.ourSeverity) : 3;
  
  renderInteractiveStars(container, index, polId, scId, 0, ourSeverity);
  updateSeverityLabel(index, 0, ourSeverity);
  
  const resetBtn = document.getElementById(`reset-severity-btn-${index}`);
  if (resetBtn) resetBtn.classList.add('hidden');
}
