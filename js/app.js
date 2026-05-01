// Skandale.dk v6.1 - Komplet version med 8 politikere + per-skandale justiceAnalysis + voting
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
    console.error('Kunne ikke loade politiker-data:', error);
    const grid = document.getElementById('politiciansGrid');
    if (grid) grid.innerHTML = '<p class="text-red-500">Fejl ved indlæsning af data. Prøv at genindlæse siden.</p>';
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
    if (i < count) {
      stars += `<i class="fa-solid fa-star severity-star text-sm"></i>`;
    } else {
      stars += `<i class="fa-solid fa-star text-slate-200 text-sm"></i>`;
    }
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

    const scandalHTML = `
      <div class="border border-slate-200 rounded-2xl overflow-hidden scandal-card">
        <div onclick="toggleScandalDetails(this)" class="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
          <div class="flex items-center gap-x-4">
            <div>
              <div class="font-semibold text-xl">${scandal.title}</div>
              <div class="text-xs text-slate-500 mt-0.5">${scandal.year}</div>
            </div>
          </div>
          <div class="flex items-center gap-x-4">
            <div class="flex items-center text-amber-500">
              ${createStars(scandal.severity)}
            </div>
            <div class="w-8 h-8 flex items-center justify-center text-slate-400 transition-transform">
              <i class="fa-solid fa-chevron-down"></i>
            </div>
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
          </div>
        </div>
      </div>
    `;
    scandalsContainer.innerHTML += scandalHTML;
  });

  document.getElementById('politicianModal').classList.remove('hidden');
  document.getElementById('politicianModal').classList.add('flex');
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
  const modal = document.getElementById('politicianModal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

let metteVotes = { ja: 1247, nej: 389, vedikke: 518 };

function loadMetteVotes() {
  const saved = localStorage.getItem('metteVotes');
  if (saved) metteVotes = JSON.parse(saved);
  updateVoteDisplay();
}

function updateVoteDisplay() {
  const jaEl = document.getElementById('vote-ja');
  const nejEl = document.getElementById('vote-nej');
  const vedikkeEl = document.getElementById('vote-vedikke');
  if (jaEl) jaEl.textContent = metteVotes.ja.toLocaleString('da-DK');
  if (nejEl) nejEl.textContent = metteVotes.nej.toLocaleString('da-DK');
  if (vedikkeEl) vedikkeEl.textContent = metteVotes.vedikke.toLocaleString('da-DK');
}

function voteMette(choice) {
  if (localStorage.getItem('metteVoted')) {
    alert('Du har allerede stemt på denne sag (demo)');
    return;
  }
  metteVotes[choice]++;
  localStorage.setItem('metteVotes', JSON.stringify(metteVotes));
  localStorage.setItem('metteVoted', 'true');
  updateVoteDisplay();
  alert('Tak for din stemme! (Demo – gemt lokalt)');
}

function initializeEverything() {
  loadPoliticians();
  loadMetteVotes();
  console.log('%c[Skandale.dk v6.1] 8 politikere + per-skandale justiceAnalysis + voting klar!', 'color:#10b981');
}

window.onload = initializeEverything;