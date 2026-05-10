// js/modal-scandals.js - Skandale rendering, stjerner, bruger- og fællesbedømmelse
// 1 fil = 1 ansvarsområde (alt relateret til skandaler og interaktiv vurdering)

function renderScandalsDirect(politician, container) {
  if (!container || !politician.scandals || politician.scandals.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-500">Ingen skandaler registreret for denne politiker.</div>`;
    return;
  }

  let html = '';
  politician.scandals.forEach((scandal, index) => {
    const s = { ...scandal };
    if (!s.severity && s.ourSeverity) s.severity = s.ourSeverity;
    if (!s.severity) s.severity = 3;
    if (!s.year && s.date) s.year = s.date;
    if (!s.shortDesc && s.description) s.shortDesc = s.description;

    if (!s.mediaLinks) {
      if (s.source && s.source.url) {
        s.mediaLinks = [{ name: s.source.text || 'Kilde', url: s.source.url }];
      } else if (s.sources && Array.isArray(s.sources)) {
        s.mediaLinks = s.sources.map((url, i) => ({ name: `Kilde ${i+1}`, url }));
      }
    }

    const ourSeverity = s.severity || 3;
    const stars = createStars(ourSeverity);
    const polId = politician.id || politician.name.replace(/\s+/g, '-').toLowerCase();
    const scId = s.id || s.title.replace(/\s+/g, '-').toLowerCase();

    html += `
      <div class="border border-slate-200 rounded-2xl mb-4 overflow-hidden">
        <!-- Header -->
        <div id="scandal-header-${index}" class="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
          <div class="flex-1">
            <div class="flex items-center gap-x-3">
              <div class="font-bold text-lg">${s.title}</div>
              <div class="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">${s.year || ''}</div>
            </div>
            <div class="flex items-center gap-x-2 mt-1">
              <div class="flex items-center text-amber-500">${stars}</div>
              <div class="text-xs text-slate-500">Vores vurdering: ${ourSeverity}/5</div>
            </div>
          </div>
          <i id="scandal-chevron-${index}" class="fa-solid fa-chevron-down text-slate-400 transition-transform"></i>
        </div>

        <!-- Content -->
        <div id="scandal-content-${index}" class="hidden p-4 border-t">
          <div class="space-y-4">
            <!-- Hvad skete der? -->
            <div>
              <div class="font-semibold text-sm text-slate-500 mb-1">Hvad skete der?</div>
              <div class="text-slate-700">${s.longDesc || s.shortDesc || s.description || ''}</div>
            </div>

            <!-- KONSEKVENSER (ny) -->
            ${s.consequences ? `
              <div class="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-2xl">
                <div class="font-semibold text-sm text-emerald-600 mb-1 flex items-center gap-x-2">
                  <i class="fa-solid fa-gavel"></i> Konsekvenser
                </div>
                <div class="text-slate-700">${s.consequences}</div>
              </div>
            ` : ''}

            <!-- HVAD BURDE VÆRE SKET? (ny) -->
            ${s.whatShouldHaveHappened ? `
              <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-2xl">
                <div class="font-semibold text-sm text-orange-600 mb-1 flex items-center gap-x-2">
                  <i class="fa-solid fa-balance-scale"></i> ${s.whatShouldHaveHappened.title || 'Hvad burde være sket?'}
                </div>
                <div class="text-slate-700">${s.whatShouldHaveHappened.content}</div>
              </div>
            ` : ''}

            <!-- Media Links -->
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

            <!-- INTERAKTIV BRUGER-BEDØMMELSE (erstatter Godt/Dårligt/Neutral) -->
            <div class="pt-4 border-t">
              <div class="font-semibold text-sm text-slate-500 mb-2">Hvor alvorlig synes DU sagen er? (1-5 stjerner)</div>
              <div id="user-severity-container-${index}" data-our-severity="${ourSeverity}" data-pol-id="${polId}" data-sc-id="${scId}" class="flex items-center gap-x-1 text-2xl cursor-pointer"></div>
              <div id="user-severity-label-${index}" class="mt-1 text-xs text-slate-500"></div>
              <button id="reset-severity-btn-${index}" onclick="resetUserSeverityAndCommunity(${index}, '${polId}', '${scId}')" class="hidden mt-2 px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <i class="fa-solid fa-undo mr-1"></i> Nulstil min bedømmelse
              </button>

              <!-- SAMLET FÆLLES VURDERING -->
              <div class="mt-4 pt-4 border-t">
                <div class="font-semibold text-sm text-slate-500 mb-1">Samlet vurdering (alle brugere)</div>
                <div id="community-severity-${index}" class="flex items-center gap-x-2 text-lg"></div>
                <div class="text-[10px] text-slate-400">Vores vurdering: ${ourSeverity}/5 • Fælles gennemsnit opdateres live</div>
              </div>
            </div>

            <!-- Kommentarer (fixed to use postComment) -->
            <div class="pt-4 border-t">
              <div class="font-semibold text-sm text-slate-500 mb-2">Kommentarer</div>
              <div class="flex gap-x-2 mb-3">
                <input type="text" id="comment-input-${index}" placeholder="Skriv en kommentar..." class="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm">
                <button onclick="postComment(${index})" class="px-4 py-2 bg-[#C8102E] text-white rounded-xl text-sm font-medium hover:bg-[#C8102E]/90 transition-colors">
                  Send
                </button>
              </div>
              <div id="comments-list-${index}" class="space-y-2 text-sm"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Event listeners + init stjerner
  politician.scandals.forEach((scandal, index) => {
    const header = document.getElementById(`scandal-header-${index}`);
    if (header) {
      header.addEventListener('click', () => {
        const content = document.getElementById(`scandal-content-${index}`);
        const chevron = document.getElementById(`scandal-chevron-${index}`);
        if (content && chevron) {
          content.classList.toggle('hidden');
          chevron.classList.toggle('rotate-180');
        }
      });
    }

    // Init interaktiv stjerne-bedømmelse + fælles vurdering
    initUserSeverityWithCommunity(index, politician, scandal);
  });
}

// === Interaktiv stjerne-bedømmelse + fælles vurdering ===

function initUserSeverityWithCommunity(index, politician, scandal) {
  const container = document.getElementById(`user-severity-container-${index}`);
  if (!container) return;

  const polId = container.dataset.polId || (politician.id || politician.name.replace(/\s+/g, '-').toLowerCase());
  const scId = container.dataset.scId || (scandal.id || scandal.title.replace(/\s+/g, '-').toLowerCase());
  const ourSeverity = parseInt(container.dataset.ourSeverity) || 3;

  // Personlig bedømmelse (localStorage)
  const personalKey = `userSeverity_${polId}_${scId}`;
  let userRating = parseInt(localStorage.getItem(personalKey) || '0');

  // Fælles bedømmelse
  renderCommunitySeverity(index, polId, scId, ourSeverity);
  renderInteractiveStarsWithCommunity(container, index, polId, scId, userRating, ourSeverity);

  const resetBtn = document.getElementById(`reset-severity-btn-${index}`);
  if (resetBtn) resetBtn.classList.toggle('hidden', userRating === 0);
}

function renderInteractiveStarsWithCommunity(container, index, polId, scId, currentRating, ourSeverity) {
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('i');
    const isFilled = i <= currentRating;
    star.className = `fa-solid fa-star cursor-pointer transition-colors text-2xl ${isFilled ? 'text-[#C8102E]' : 'text-slate-300 hover:text-amber-400'}`;
    
    star.onclick = () => {
      saveUserSeverityAndUpdateCommunity(index, polId, scId, i, ourSeverity);
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

function saveUserSeverityAndUpdateCommunity(index, polId, scId, rating, ourSeverity) {
  // Gem personlig bedømmelse
  const personalKey = `userSeverity_${polId}_${scId}`;
  localStorage.setItem(personalKey, rating);

  // Gem i fælles array (community)
  const communityKey = `communityRatings_${polId}_${scId}`;
  let ratings = JSON.parse(localStorage.getItem(communityKey) || '[]');
  ratings.push(rating);
  localStorage.setItem(communityKey, JSON.stringify(ratings));

  // Re-render
  const container = document.getElementById(`user-severity-container-${index}`);
  if (container) {
    renderInteractiveStarsWithCommunity(container, index, polId, scId, rating, ourSeverity);
  }

  // Opdater labels
  updateSeverityLabelWithCommunity(index, rating, ourSeverity);
  renderCommunitySeverity(index, polId, scId, ourSeverity);

  const resetBtn = document.getElementById(`reset-severity-btn-${index}`);
  if (resetBtn) resetBtn.classList.remove('hidden');
}

function updateSeverityLabelWithCommunity(index, userRating, ourSeverity) {
  const label = document.getElementById(`user-severity-label-${index}`);
  if (!label) return;

  if (userRating > 0) {
    label.innerHTML = `<span class="font-medium text-[#C8102E]">Din bedømmelse: ${userRating}/5 stjerner</span>`;
  } else {
    label.innerHTML = `Vores vurdering: ${ourSeverity}/5 – klik på stjernerne for at give din egen`;
  }
}

function renderCommunitySeverity(index, polId, scId, ourSeverity) {
  const container = document.getElementById(`community-severity-${index}`);
  if (!container) return;

  const communityKey = `communityRatings_${polId}_${scId}`;
  const ratings = JSON.parse(localStorage.getItem(communityKey) || '[]');

  if (ratings.length === 0) {
    container.innerHTML = `
      <div class="flex items-center gap-x-2">
        <span class="text-slate-400">Ingen fælles bedømmelser endnu</span>
        <span class="text-xs px-2 py-0.5 bg-slate-100 rounded-full">Vores: ${ourSeverity}/5</span>
      </div>
    `;
    return;
  }

  const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  const count = ratings.length;

  container.innerHTML = `
    <div class="flex items-center gap-x-3">
      <div class="flex items-center text-amber-500">${createStars(Math.round(avg))}</div>
      <div>
        <span class="font-bold text-lg text-[#C8102E]">${avg}/5</span>
        <span class="text-xs text-slate-500 ml-1">(${count} stemmer)</span>
      </div>
    </div>
  `;
}

function resetUserSeverityAndCommunity(index, polId, scId) {
  const personalKey = `userSeverity_${polId}_${scId}`;
  localStorage.removeItem(personalKey);

  const container = document.getElementById(`user-severity-container-${index}`);
  if (container) {
    const ourSeverity = parseInt(container.dataset.ourSeverity) || 3;
    renderInteractiveStarsWithCommunity(container, index, polId, scId, 0, ourSeverity);
    updateSeverityLabelWithCommunity(index, 0, ourSeverity);
  }

  const resetBtn = document.getElementById(`reset-severity-btn-${index}`);
  if (resetBtn) resetBtn.classList.add('hidden');
}

// Gør funktionerne globalt tilgængelige
window.renderScandalsDirect = renderScandalsDirect;
window.initUserSeverityWithCommunity = initUserSeverityWithCommunity;
window.saveUserSeverityAndUpdateCommunity = saveUserSeverityAndUpdateCommunity;
window.resetUserSeverityAndCommunity = resetUserSeverityAndCommunity;
