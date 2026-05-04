// js/ui.js - Sikker version (Løsning A) - virker med din nuværende struktur

function renderPoliticians(filteredPoliticians = null) {
  const grid = document.getElementById('politiciansGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const toRender = filteredPoliticians || politicians;

  toRender.forEach(politician => {
    // Sikkerhed: sørg altid for at scandals er et array
    const scandals = Array.isArray(politician.scandals) ? politician.scandals : [];
    
    const totalSeverity = scandals.reduce((sum, s) => sum + (s.severity || 0), 0);
    const avgSeverity = scandals.length > 0 ? (totalSeverity / scandals.length).toFixed(1) : '0.0';
    const totalLinks = scandals.reduce((sum, s) => sum + (s.mediaLinks ? s.mediaLinks.length : 0), 0);
    const brokenPromises = politician.brokenPromises || 0;

    const cardHTML = `
      <div onclick="showPoliticianModal(${politician.id})" 
           class="politician-card bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer hover:border-[#C8102E]/30 group">
        <div class="flex justify-between items-start mb-5">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md" 
               style="background-color: ${politician.avatarColor || '#C8102E'}">
            ${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div class="text-right">
            <div class="inline-flex items-center bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
              ${scandals.length} skandaler
            </div>
            <div class="mt-1 text-[10px] text-amber-600 font-medium">${brokenPromises} brudte løfter</div>
            <div class="mt-0.5 text-[10px] text-emerald-600 font-medium">${totalLinks} medie-links</div>
          </div>
        </div>
        <div class="mb-4">
          <div class="font-bold text-2xl tracking-tight text-slate-900 group-hover:text-[#C8102E] transition-colors">${politician.name}</div>
          <div class="text-sm text-slate-500 mt-0.5">${politician.party || ''}</div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center text-amber-500">
            ${createStars(Math.round(parseFloat(avgSeverity)))}
            <span class="ml-2 text-slate-400 font-medium">${avgSeverity}</span>
          </div>
          <div class="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider" 
               style="background-color: ${politician.partyColor || '#64748b'}20; color: ${politician.partyColor || '#64748b'}">
            ${politician.isFormer ? 'Tidligere ' : ''}${(politician.role || '').split(' ')[0]}
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += cardHTML;
  });
}