// js/ui.js - Render politikere på forsiden (med global open funktion + stjerner + billed-avatar + bruger-påvirket score)

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

function renderPoliticians(filteredPoliticians = null) {
  const grid = document.getElementById('politiciansGrid');
  if (!grid) return;

  const toRender = filteredPoliticians || politicians;

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

      // Brugerens egne bedømmelser fra localStorage - påvirker den viste score!
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

    // Avatar: billede hvis tilgængeligt, ellers initialer (ren og sikker fallback)
    let avatarHTML = '';
    if (politician.image) {
      avatarHTML = `<img src="${politician.image}" alt="${politician.name}" class="w-14 h-14 rounded-2xl object-cover border border-slate-200" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
      avatarHTML += `<div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl hidden" style="background-color: ${politician.avatarColor || politician.partyColor || '#C8102E'}">${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}</div>`;
    } else {
      avatarHTML = `<div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style="background-color: ${politician.avatarColor || politician.partyColor || '#C8102E'}">${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}</div>`;
    }

    html += `
      <div onclick="window.openPoliticianModal(${politician.id})" 
           class="politician-card bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer hover:border-[#C8102E]/30 group" data-id="${politician.id}">
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

        <!-- STJERNER PÅ FORSIDEN - vores + brugeres (påvirkes af dine stemmer i localStorage) -->
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
            </div>` : '<div class="text-[10px] text-slate-400">(Stem på skandaler for at se din score)</div>'}
          </div>
        </div>

        <div class="flex items-center justify-between text-xs">
          <div class="text-[#C8102E] group-hover:underline">Se detaljer →</div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// Gør renderPoliticians global så search.js kan kalde den
window.renderPoliticians = renderPoliticians;
