// Skandale.dk v6.4 - Per-skandale afstemning
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
    populatePartyFilter();
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
    // Hent gemte stemmer for denne skandale
    const savedVotes = JSON.parse(localStorage.getItem(`vote_${scandal.id}`) || '{"ja":0,"nej":0,"vedikke":0}');

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

    // NY: Per-skandale afstemning
    const voteHTML = `
      <div class="mt-4 pt-4 border-t border-slate-200">
        <div class="text-sm font-semibold mb-2">Hvad synes du om denne sag?</div>
        <div class="flex gap-2">
          <button onclick="voteScandal(${scandal.id}, 'ja', this)" class="flex-1 py-2 px-3 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl font-medium transition-colors">
            Godt <span class="font-bold">(${savedVotes.ja})</span>
          </button>
          <button onclick="voteScandal(${scandal.id}, 'nej', this)" class="flex-1 py-2 px-3 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-colors">
            Dårligt <span class="font-bold">(${savedVotes.nej})</span>
          </button>
          <button onclick="voteScandal(${scandal.id}, 'vedikke', this)" class="flex-1 py-2 px-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors">
            Neutral <span class="font-bold">(${savedVotes.vedikke})</span>
          </button>
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
            ${voteHTML}
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
  document.getElementById('politicianModal').classList.remove('flex');
  document.getElementById('politicianModal').classList.add('hidden');
}

// ==================== PER-SKANDALE AFSTEMNING ====================
function voteScandal(scandalId, choice, button) {
  const key = `vote_${scandalId}`;
  let votes = JSON.parse(localStorage.getItem(key) || '{"ja":0,"nej":0,"vedikke":0}');
  
  votes[choice]++;
  localStorage.setItem(key, JSON.stringify(votes));
  
  // Opdater knapperne med nye tal
  const parent = button.parentElement;
  const buttons = parent.querySelectorAll('button');
  
  buttons[0].innerHTML = `Godt <span class="font-bold">(${votes.ja})</span>`;
  buttons[1].innerHTML = `Dårligt <span class="font-bold">(${votes.nej})</span>`;
  buttons[2].innerHTML = `Neutral <span class="font-bold">(${votes.vedikke})</span>`;
  
  // Vis tak
  const originalText = button.innerHTML;
  button.innerHTML = 'Tak!';
  setTimeout(() => {
    button.innerHTML = originalText;
  }, 800);
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
  populatePartyFilter();
}

function renderTimeline(scandalsToShow) {
  const container = document.getElementById('timelineContent');
  container.innerHTML = '';

  if (scandalsToShow.length === 0) {
    container.innerHTML = '<p class="text-center text-slate-500 py-8">Ingen skandaler matcher dine filtre.</p>';
    return;
  }

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

function filterTimeline() {
  const party = document.getElementById('filterParty').value;
  const severity = document.getElementById('filterSeverity').value;

  let filtered = allScandals;

  if (party) {
    filtered = filtered.filter(s => s.party === party);
  }

  if (severity) {
    filtered = filtered.filter(s => s.severity >= parseInt(severity));
  }

  renderTimeline(filtered);
}

function populatePartyFilter() {
  const select = document.getElementById('filterParty');
  if (!select) return;

  const parties = [...new Set(politicians.map(p => p.party))];
  select.innerHTML = '<option value="">Alle partier</option>';
  parties.forEach(party => {
    const option = document.createElement('option');
    option.value = party;
    option.textContent = party;
    select.appendChild(option);
  });
}

function resetTimelineFilters() {
  document.getElementById('filterParty').value = '';
  document.getElementById('filterSeverity').value = '';
  renderTimeline(allScandals);
}

function closeTimeline() {
  const modal = document.getElementById('timelineModal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

function initializeEverything() {
  loadPoliticians();
  console.log('%c[Skandale.dk v6.4] Per-skandale afstemning aktiveret!', 'color:#10b981');
}

window.onload = initializeEverything;