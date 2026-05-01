// js/ui.js - Rendering og filtre
function renderPoliticians(filteredPoliticians = null) {
  const grid = document.getElementById('politiciansGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const toRender = filteredPoliticians || politicians;
  
  toRender.forEach(politician => {
    const totalSeverity = politician.scandals.reduce((sum, s) => sum + s.severity, 0);
    const avgSeverity = (totalSeverity / politician.scandals.length).toFixed(1);
    const totalLinks = politician.scandals.reduce((sum, s) => sum + (s.mediaLinks ? s.mediaLinks.length : 0), 0);
    
    const cardHTML = `
      <div onclick="showPoliticianModal(${politician.id})" 
           class="politician-card bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer hover:border-[#C8102E]/30 group">
        <div class="flex justify-between items-start mb-5">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md" 
               style="background-color: ${politician.avatarColor}">
            ${politician.initials}
          </div>
          <div class="text-right">
            <div class="inline-flex items-center bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
              ${politician.scandals.length} skandaler
            </div>
            <div class="mt-1 text-[10px] text-emerald-600 font-medium">${totalLinks} medie-links</div>
          </div>
        </div>
        <div class="mb-4">
          <div class="font-bold text-2xl tracking-tight text-slate-900 group-hover:text-[#C8102E] transition-colors">${politician.name}</div>
          <div class="text-sm text-slate-500 mt-0.5">${politician.party}</div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center text-amber-500">
            ${createStars(Math.round(avgSeverity))}
            <span class="ml-2 text-slate-400 font-medium">${avgSeverity}</span>
          </div>
          <div class="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider" 
               style="background-color: ${politician.partyColor}20; color: ${politician.partyColor}">
            ${politician.role.split(' ')[0]}
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += cardHTML;
  });
}

function createStars(count) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += (i < count) ? `<i class="fa-solid fa-star severity-star text-sm"></i>` : `<i class="fa-solid fa-star text-slate-200 text-sm"></i>`;
  }
  return stars;
}

function filterPoliticians() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!searchTerm) {
    renderPoliticians();
    return;
  }
  const filtered = politicians.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.party.toLowerCase().includes(searchTerm)
  );
  renderPoliticians(filtered);
}