// Skandale.dk v6.5 - Kommentarer per skandale
let politicians = [];

async function loadPoliticians() {
  const politicianFiles = [
    'data/politicians/mette-frederiksen.json',
    'data/politicians/inger-stoejberg.json',
    'data/politicians/morten-oestergaard.json',
    'data/politicians/helle-thorning-schmidt.json',
    'data/politicians/lars-loekke-rasmussen.json',
    'data/politicians/pia-kjaersgaard.json',
    'data/politicians/anders-fogh-rasmussen.json',
    'data/politicians/morten-messerschmidt.json'
  ];

  try {
    const responses = await Promise.all(politicianFiles.map(file => fetch(file)));
    politicians = await Promise.all(responses.map(res => res.json()));
    renderPoliticians();
  } catch (error) {
    console.error('Kunne ikke loade data:', error);
  }
}

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

function showPoliticianModal(id) {
  const politician = politicians.find(p => p.id === id);
  if (!politician) return;

  document.getElementById('modalName').innerHTML = politician.name;
  document.getElementById('modalParty').innerHTML = politician.party;
  document.getElementById('modalParty').style.backgroundColor = politician.partyColor + '20';
  document.getElementById('modalParty').style.color = politician.partyColor;
  document.getElementById('modalRole').innerHTML = politician.role;

  const avatar = document.getElementById('modalAvatar');
  avatar.style.backgroundColor = politician.avatarColor;
  avatar.innerHTML = politician.initials;

  document.getElementById('modalBio').innerHTML = politician.bio;
  document.getElementById('modalScandalCount').innerHTML = politician.scandals.length;

  const scandalsContainer = document.getElementById('modalScandals');
  scandalsContainer.innerHTML = '';

  politician.scandals.forEach((scandal) => {
    let justiceHTML = '';
    if (scandal.justiceAnalysis) {
      justiceHTML = `
        <div class="mt-4 pt-4 border-t border-slate-200">
          <button onclick="toggleJusticeAnalysis(this)" class="flex items-center gap-x-2 text-sm font-semibold text-red-600 hover:text-red-700">
            <i class="fa-solid fa-balance-scale"></i>
            <span>Hvad burde være sket?</span>
            <i class="fa-solid fa-chevron-down ml-1 transition-transform"></i>
          </button>
          <div class="hidden mt-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl text-sm text-slate-700 justice-analysis">
            ${scandal.justiceAnalysis}
          </div>
        </div>
      `;
    }

    let mediaHTML = '';
    if (scandal.mediaLinks && scandal.mediaLinks.length > 0) {
      mediaHTML = `
        <div class="mt-4 pt-4 border-t border-slate-100">
          <div class="flex items-center gap-x-2 mb-3">
            <i class="fa-solid fa-newspaper text-[#C8102E] text-sm"></i>
            <span class="text-xs font-bold uppercase tracking-[1px] text-slate-500">Læs mere i medierne (${scandal.mediaLinks.length})</span>
          </div>
          <div class="space-y-2">
            ${scandal.mediaLinks.map(link => `
              <a href="${link.url}" target="_blank" class="media-link group flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm hover:border-slate-300">
                <div class="flex-1 pr-4">
                  <div class="flex items-center gap-x-2">
                    <span class="media-badge" style="background-color: #E2E8F0; color: #475569;">${link.name}</span>
                    <span class="font-medium text-slate-700 group-hover:text-[#C8102E]">${link.title}</span>
                  </div>
                </div>
                <div class="flex items-center text-xs text-slate-400 whitespace-nowrap">
                  ${link.date}
                  <i class="fa-solid fa-external-link-alt ml-2 text-xs group-hover:text-[#C8102E]"></i>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    // NY: Kommentar sektion
    const comments = JSON.parse(localStorage.getItem(`comments_${scandal.id}`) || '[]');
    let commentsHTML = '';
    if (comments.length > 0) {
      commentsHTML = `<div class="mt-3 space-y-2">${comments.map(c => `
        <div class="bg-slate-100 p-3 rounded-xl text-sm">
          <div class="text-slate-600">${c.text}</div>
          <div class="text-[10px] text-slate-400 mt-1">${c.date}</div>
        </div>
      `).join('')}</div>`;
    }

    const commentSection = `
      <div class="mt-4 pt-4 border-t border-slate-200">
        <div class="font-semibold text-sm mb-2">Kommentarer (${comments.length})</div>
        ${commentsHTML}
        <div class="flex gap-2 mt-3">
          <input type="text" id="comment-input-${scandal.id}" placeholder="Skriv en kommentar..." class="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm">
          <button onclick="postComment(${scandal.id})" class="px-4 py-2 bg-[#C8102E] text-white rounded-xl text-sm font-semibold">Send</button>
        </div>
      </div>
    `;

    const scandalHTML = `
      <div class="border border-slate-200 rounded-2xl overflow-hidden scandal-card">
        <div onclick="toggleScandalDetails(this)" class="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
          <div>
            <div class="font-semibold text-xl">${scandal.title}</div>
            <div class="text-xs text-slate-500 mt-0.5">${scandal.year}</div>
          </div>
          <div class="flex items-center gap-x-4">
            <div class="flex items-center text-amber-500">${createStars(scandal.severity)}</div>
            <div class="w-8 h-8 flex items-center justify-center text-slate-400"><i class="fa-solid fa-chevron-down"></i></div>
          </div>
        </div>
        <div class="hidden px-6 pb-6 pt-1 text-sm border-t bg-slate-50" id="scandal-details-${scandal.id}">
          <div class="pt-4">
            <div class="prose prose-sm max-w-none text-slate-600">${scandal.longDesc}</div>
            <div class="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-y-3 text-xs">
              <div><span class="font-semibold text-emerald-700">Konsekvens:</span> <span class="text-slate-600">${scandal.outcome}</span></div>
            </div>
            ${justiceHTML}
            ${mediaHTML}
            ${commentSection}
          </div>
        </div>
      </div>
    `;
    scandalsContainer.innerHTML += scandalHTML;
  });

  document.getElementById('politicianModal').classList.remove('hidden');
  document.getElementById('politicianModal').classList.add('flex');
}

function postComment(scandalId) {
  const input = document.getElementById(`comment-input-${scandalId}`);
  if (!input || !input.value.trim()) return;

  const key = `comments_${scandalId}`;
  const comments = JSON.parse(localStorage.getItem(key) || '[]');
  
  comments.push({
    text: input.value.trim(),
    date: new Date().toLocaleDateString('da-DK') + ' ' + new Date().toLocaleTimeString('da-DK', {hour: '2-digit', minute:'2-digit'})
  });
  
  localStorage.setItem(key, JSON.stringify(comments));
  input.value = '';
  
  // Genindlæs modalen for at vise den nye kommentar
  const modal = document.getElementById('politicianModal');
  const politicianId = parseInt(modal.dataset.currentPoliticianId || 0);
  if (politicianId) {
    showPoliticianModal(politicianId);
  }
}

function toggleJusticeAnalysis(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector('.fa-chevron-down');
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.classList.add('fa-rotate-180');
  } else {
    content.classList.add('hidden');
    icon.classList.remove('fa-rotate-180');
  }
}

function toggleScandalDetails(element) {
  const details = element.nextElementSibling;
  const icon = element.querySelector('.fa-chevron-down');
  if (details.classList.contains('hidden')) {
    details.classList.remove('hidden');
    icon.classList.add('fa-rotate-180');
  } else {
    details.classList.add('hidden');
    icon.classList.remove('fa-rotate-180');
  }
}

function closeModal() {
  document.getElementById('politicianModal').classList.remove('flex');
  document.getElementById('politicianModal').classList.add('hidden');
}

// ==================== TIMELINE ====================
let allScandals = [];

function showTimeline() {
  allScandals = [];
  politicians.forEach(politician => {
    politician.scandals.forEach(scandal => {
      allScandals.push({
        ...scandal,
        politicianName: politician.name,
        politicianId: politician.id,
        party: politician.party,
        partyColor: politician.partyColor
      });
    });
  });

  allScandals.sort((a, b) => b.year.localeCompare(a.year));

  const modal = document.getElementById('timelineModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  renderTimeline(allScandals);
}

function renderTimeline(scandalsToShow) {
  const container = document.getElementById('timelineContent');
  container.innerHTML = '';

  scandalsToShow.forEach(scandal => {
    const entryHTML = `
      <div onclick="showPoliticianModal(${scandal.politicianId}); closeTimeline();" 
           class="flex gap-4 p-5 border border-slate-200 rounded-2xl hover:border-[#C8102E]/30 cursor-pointer group">
        <div class="w-16 text-center flex-shrink-0">
          <div class="text-xl font-bold text-[#C8102E]">${scandal.year}</div>
          <div class="flex justify-center mt-1">${createStars(scandal.severity)}</div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-x-3">
            <span class="font-bold text-lg group-hover:text-[#C8102E]">${scandal.title}</span>
            <span class="text-xs px-2 py-0.5 rounded-full" style="background-color: ${scandal.partyColor}20; color: ${scandal.partyColor}">
              ${scandal.politicianName}
            </span>
          </div>
          <div class="text-sm text-slate-600 mt-1 line-clamp-2">${scandal.shortDesc}</div>
        </div>
        <div class="flex items-center text-slate-400 group-hover:text-[#C8102E]">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      </div>
    `;
    container.innerHTML += entryHTML;
  });
}

function closeTimeline() {
  const modal = document.getElementById('timelineModal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

function initializeEverything() {
  loadPoliticians();
  console.log('%c[Skandale.dk v6.5] Kommentarer aktiveret!', 'color:#10b981');
}

window.onload = initializeEverything;