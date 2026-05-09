// js/ui.js - Render politikere på forsiden (med global open funktion)

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

    html += `
      <div onclick="window.openPoliticianModal(${politician.id})" 
           class="politician-card bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer hover:border-[#C8102E]/30 group">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl" 
               style="background-color: ${politician.avatarColor || politician.color || '#C8102E'}">
            ${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-400">${politician.party}</div>
            <div class="text-[10px] text-slate-400">${politician.role || ''}</div>
          </div>
        </div>
        
        <div class="font-bold text-xl mb-1 group-hover:text-[#C8102E] transition-colors">${politician.name}</div>
        
        <div class="flex items-center gap-x-3 text-xs text-slate-500 mb-4">
          <div class="flex items-center gap-x-1">
            <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
            <span>${scandalCount} skandaler</span>
          </div>
          <div class="flex items-center gap-x-1">
            <i class="fa-solid fa-link text-[#C8102E]"></i>
            <span>${brokenCount} løfter</span>
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