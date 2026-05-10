// js/modal-core.js - FULD OG RIG VERSION MED KONSEKVENSER + HVAD BURDE VÆRE SKET + INTERAKTIV STJERNE-BEDØMMELSE (v2.00.59 - FIXED showPoliticianModal)
// Komplet fil med showPoliticianModal + showNetworkConnections + renderScandalsDirect + community star ratings

let currentPolitician = null;

function createStars(severity) {
  if (!severity || severity < 1) severity = 1;
  if (severity > 5) severity = 5;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= severity 
      ? '<i class="fa-solid fa-star text-[#C8102E]"></i>' 
      : '<i class="fa-solid fa-star text-slate-300"></i>';
  }
  return html;
}

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

// === NYE FUNKTIONER: Interaktiv stjerne-bedømmelse + fælles vurdering ===

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

// === HOVEDFUNKTION: showPoliticianModal (KOMPLET OG FULD) ===
async function showPoliticianModal(politicianId) {
  let politician = window.politicians ? window.politicians.find(p => p.id === politicianId) : null;
  if (!politician) {
    console.error('Politiker ikke fundet:', politicianId);
    alert('Kunne ikke finde politikeren. Prøv at genindlæse siden.');
    return;
  }

  // Load scandals dynamically if needed (for split JSON structure)
  if (!politician.scandals && politician.scandalsFile) {
    try {
      const response = await fetch(politician.scandalsFile);
      if (response.ok) {
        const data = await response.json();
        politician.scandals = data.scandals || (Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn('Kunne ikke loade scandals for', politician.name, e);
      politician.scandals = [];
    }
  }

  // Load other data if missing (affiliations, economicSupport, brokenPromises)
  if (!politician.affiliations && politician.affiliationsFile) {
    try {
      const res = await fetch(politician.affiliationsFile);
      if (res.ok) politician.affiliations = (await res.json()).affiliations || [];
    } catch (e) {}
  }
  if (!politician.economicSupport && politician.economicSupportFile) {
    try {
      const res = await fetch(politician.economicSupportFile);
      if (res.ok) politician.economicSupport = (await res.json()).donations || (await res.json()).economicSupport || [];
    } catch (e) {}
  }
  if (!politician.brokenPromises && politician.brokenPromisesFile) {
    try {
      const res = await fetch(politician.brokenPromisesFile);
      if (res.ok) politician.brokenPromises = (await res.json()).brokenPromises || [];
    } catch (e) {}
  }

  currentPolitician = politician;

  // Remove existing modals
  document.querySelectorAll('#politicianModal, #networkModal').forEach(m => m.remove());

  const polId = politician.id || politician.name.replace(/\s+/g, '-').toLowerCase();

  const html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" id="politicianModal" data-current-politician-id="${politicianId}">
      <div onclick="event.target.id === 'politicianModal' && closePoliticianModal()" 
           class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        <!-- Header -->
        <div class="px-8 pt-8 pb-6 border-b flex flex-col sm:flex-row sm:items-start justify-between gap-y-4">
          <div class="flex items-center gap-x-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" 
                 style="background-color: ${politician.avatarColor || politician.partyColor || '#C8102E'}">
              ${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 class="text-3xl font-bold">${politician.name}</h2>
              <div class="flex items-center gap-x-2 mt-1">
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm" style="background-color: ${politician.partyColor}20; color: ${politician.partyColor}">${politician.party}</span>
                <span class="text-sm text-slate-500">${politician.role || ''}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-x-2">
            <button id="share-btn" class="flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-2xl transition-all">
              <i class="fa-solid fa-share-alt"></i>
              <span class="hidden sm:inline">Del</span>
            </button>
            <button onclick="if (typeof exportPoliticianToPDF === 'function') exportPoliticianToPDF(currentPolitician)" class="flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-2xl transition-all">
              <i class="fa-solid fa-file-pdf"></i>
              <span class="hidden sm:inline">PDF</span>
            </button>
            <button onclick="closePoliticianModal()" class="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all text-3xl leading-none">×</button>
          </div>
        </div>
        
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          <!-- Om Politikeren -->
          <div class="mb-6">
            <div class="font-semibold text-sm text-slate-500 mb-2">Om Politikeren</div>
            <div class="text-slate-700">${politician.bio || 'Ingen beskrivelse tilgængelig.'}</div>
          </div>
          
          <!-- Før politik / Ungdom (collapsible) -->
          ${politician.beforePolitics ? `
            <div class="mb-4 border border-slate-200 rounded-2xl overflow-hidden">
              <div onclick="toggleSection('beforePoliticsSection')" class="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100">
                <div class="font-semibold text-sm">${politician.beforePolitics.title || 'Før politik / Ungdom'}</div>
                <i class="fa-solid fa-chevron-down text-slate-400" id="beforePoliticsChevron"></i>
              </div>
              <div id="beforePoliticsSection" class="hidden p-4 border-t">
                <div class="text-slate-700">${politician.beforePolitics.content}</div>
              </div>
            </div>
          ` : ''}
          
          <!-- Karriereoversigt (collapsible) -->
          ${politician.careerTimeline ? `
            <div class="mb-4 border border-slate-200 rounded-2xl overflow-hidden">
              <div onclick="toggleSection('careerSection')" class="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100">
                <div class="font-semibold text-sm">Karriereoversigt</div>
                <i class="fa-solid fa-chevron-down text-slate-400" id="careerChevron"></i>
              </div>
              <div id="careerSection" class="hidden p-4 border-t">
                <div class="text-slate-700 whitespace-pre-line">${politician.careerTimeline}</div>
              </div>
            </div>
          ` : ''}
          
          <!-- Skandaler -->
          <div class="mb-8">
            <div class="flex items-center gap-x-2 mb-4">
              <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
              <span class="font-bold text-lg">Skandaler</span>
              <span class="text-xs text-slate-500">(${politician.scandals ? politician.scandals.length : 0})</span>
            </div>
            <div id="scandalsContainer"></div>
          </div>
          
          <!-- Økonomisk støtte (injected by modal-donor.js) -->
          <div id="economicSupportSection"></div>
          
          <!-- Internationale netværk & tilknytninger -->
          ${politician.affiliations && politician.affiliations.length > 0 ? `
            <div class="mt-8 pt-6 border-t">
              <div class="flex items-center gap-x-2 mb-4">
                <i class="fa-solid fa-globe text-[#C8102E]"></i>
                <span class="font-bold text-lg">Internationale netværk & tilknytninger</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${politician.affiliations.map(aff => {
                  const networkName = aff.name || aff.organization || 'Ukendt';
                  return `
                    <div onclick="showNetworkConnections('${networkName}')" class="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[#C8102E]/30 cursor-pointer transition-all">
                      <div class="font-semibold text-[#C8102E]">${networkName}</div>
                      <div class="text-xs text-slate-500">${aff.organization || ''} • ${aff.year || ''}</div>
                      ${aff.role ? `<div class="text-sm text-slate-600 mt-1">${aff.role}</div>` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
          
          <!-- Brudte valgløfter (injected by modal-broken-promises.js) -->
          <div id="brokenPromisesSection"></div>
          
        </div>
        
        <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center">
          Data er baseret på offentligt tilgængelige kilder • v2.00.59
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  // Initialize scandals with the NEW render function
  setTimeout(() => {
    const scandalsContainer = document.getElementById('scandalsContainer');
    if (scandalsContainer) {
      renderScandalsDirect(politician, scandalsContainer);
    }

    // Call helper functions from other modal-*.js files (they are now loaded)
    if (typeof addEconomicSupportSection === 'function') {
      addEconomicSupportSection(politician);
    }
    if (typeof addBrokenPromisesSection === 'function') {
      addBrokenPromisesSection(politician);
    }
    if (typeof initShareButton === 'function') {
      initShareButton(politician);
    }

    // Load comments for each scandal if any saved
    if (politician.scandals) {
      politician.scandals.forEach((scandal, index) => {
        const scId = scandal.id || scandal.title.replace(/\s+/g, '-').toLowerCase();
        const commentsList = document.getElementById(`comments-list-${index}`);
        if (commentsList) {
          const key = `comments_${scId}`;
          const savedComments = JSON.parse(localStorage.getItem(key) || '[]');
          if (savedComments.length > 0) {
            commentsList.innerHTML = savedComments.map(c => `
              <div class="bg-slate-50 p-2 rounded-xl text-xs">
                <span class="font-medium">${c.date}</span>: ${c.text}
              </div>
            `).join('');
          }
        }
      });
    }
  }, 50);
}

function closePoliticianModal() {
  const modal = document.getElementById('politicianModal');
  if (modal) modal.remove();
  currentPolitician = null;
}

function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  const chevron = document.getElementById(sectionId.replace('Section', 'Chevron'));
  if (section) {
    section.classList.toggle('hidden');
    if (chevron) chevron.classList.toggle('rotate-180');
  }
}

// === showNetworkConnections (for affiliations click) ===
function showNetworkConnections(networkName) {
  if (!window.networkIndex || !window.networkIndex[networkName]) {
    alert('Ingen andre politikere fundet med dette netværk.');
    return;
  }

  const connectedPoliticians = window.networkIndex[networkName];

  let html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" id="networkModal">
      <div onclick="event.target.id === 'networkModal' && closeNetworkModal()" class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl">
        <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold">${networkName}</h3>
            <p class="text-slate-500">${connectedPoliticians.length} politikere har været tilknyttet dette netværk</p>
          </div>
          <button onclick="closeNetworkModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
        </div>
        <div class="p-8 max-h-[70vh] overflow-y-auto">
          <div class="space-y-3">
  `;

  connectedPoliticians.forEach(p => {
    html += `
      <div onclick="closeNetworkModal(); showPoliticianModal(${p.id})" class="flex justify-between items-center p-4 border border-slate-200 rounded-2xl hover:border-[#C8102E]/30 cursor-pointer">
        <div>
          <div class="font-semibold">${p.name}</div>
          <div class="text-sm text-slate-500">${p.party}</div>
        </div>
        <div class="text-right text-sm">
          <div class="font-medium">${p.year}</div>
          <div class="text-xs text-slate-500">${p.role}</div>
        </div>
      </div>
    `;
  });

  html += `
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeNetworkModal() {
  const modal = document.getElementById('networkModal');
  if (modal) modal.remove();
}

// Make functions global
window.showPoliticianModal = showPoliticianModal;
window.showNetworkConnections = showNetworkConnections;
window.closePoliticianModal = closePoliticianModal;
window.toggleSection = toggleSection;
