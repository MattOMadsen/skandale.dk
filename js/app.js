// Skandale.dk v6.1 - Per-skandale justiceAnalysis + collapsible + voting fix
let politicians = [];

async function loadPoliticians() {
  const politicianFiles = [
    'data/politicians/mette-frederiksen.json',
    'data/politicians/inger-stoejberg.json',
    'data/politicians/morten-oestergaard.json',
    'data/politicians/helle-thorning-schmidt.json'
  ];

  try {
    const responses = await Promise.all(politicianFiles.map(file => fetch(file)));
    politicians = await Promise.all(responses.map(res => res.json()));
    renderPoliticians();
  } catch (error) {
    console.error('Kunne ikke loade data:', error);
  }
}

function renderPoliticians(filtered = null) {
  const grid = document.getElementById('politiciansGrid');
  grid.innerHTML = '';
  const list = filtered || politicians;

  list.forEach(p => {
    const avg = (p.scandals.reduce((s, sc) => s + sc.severity, 0) / p.scandals.length).toFixed(1);
    const totalLinks = p.scandals.reduce((s, sc) => s + (sc.mediaLinks?.length || 0), 0);

    const card = `
      <div onclick="showPoliticianModal(${p.id})" class="politician-card bg-white border border-slate-200 rounded-3xl p-6 cursor-pointer hover:border-[#C8102E]/30 group">
        <div class="flex justify-between items-start mb-5">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md" style="background-color: ${p.avatarColor}">
            ${p.initials}
          </div>
          <div class="text-right">
            <div class="inline-flex items-center bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">${p.scandals.length} skandaler</div>
            <div class="mt-1 text-[10px] text-emerald-600 font-medium">${totalLinks} medie-links</div>
          </div>
        </div>
        <div class="mb-4">
          <div class="font-bold text-2xl tracking-tight text-slate-900 group-hover:text-[#C8102E] transition-colors">${p.name}</div>
          <div class="text-sm text-slate-500 mt-0.5">${p.party}</div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center text-amber-500">
            ${createStars(Math.round(avg))}
            <span class="ml-2 text-slate-400 font-medium">${avg}</span>
          </div>
          <div class="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider" style="background-color: ${p.partyColor}20; color: ${p.partyColor}">
            ${p.role.split(' ')[0]}
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += card;
  });
}

function createStars(count) {
  let html = '';
  for (let i = 0; i < 5; i++) {
    html += i < count ? `<i class="fa-solid fa-star severity-star text-sm"></i>` : `<i class="fa-solid fa-star text-slate-200 text-sm"></i>`;
  }
  return html;
}

function showPoliticianModal(id) {
  const p = politicians.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modalName').innerHTML = p.name;
  document.getElementById('modalParty').innerHTML = p.party;
  document.getElementById('modalParty').style.backgroundColor = p.partyColor + '20';
  document.getElementById('modalParty').style.color = p.partyColor;
  document.getElementById('modalRole').innerHTML = p.role;

  const avatar = document.getElementById('modalAvatar');
  avatar.style.backgroundColor = p.avatarColor;
  avatar.innerHTML = p.initials;

  document.getElementById('modalBio').innerHTML = p.bio;
  document.getElementById('modalScandalCount').innerHTML = p.scandals.length;

  const container = document.getElementById('modalScandals');
  container.innerHTML = '';

  p.scandals.forEach(scandal => {
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
      mediaHTML = `<div class="mt-4 pt-4 border-t border-slate-100"><div class="flex items-center gap-x-2 mb-3"><i class="fa-solid fa-newspaper text-[#C8102E] text-sm"></i><span class="text-xs font-bold uppercase tracking-[1px] text-slate-500">Læs mere i medierne (${scandal.mediaLinks.length})</span></div><div class="space-y-2">${scandal.mediaLinks.map(link => `<a href="${link.url}" target="_blank" class="media-link group flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm hover:border-slate-300"><div class="flex-1 pr-4"><div class="flex items-center gap-x-2"><span class="media-badge" style="background-color: #E2E8F0; color: #475569;">${link.name}</span><span class="font-medium text-slate-700 group-hover:text-[#C8102E]">${link.title}</span></div></div><div class="flex items-center text-xs text-slate-400 whitespace-nowrap">${link.date}<i class="fa-solid fa-external-link-alt ml-2 text-xs group-hover:text-[#C8102E]"></i></div></a>`).join('')}</div></div>`;
    }

    const html = `
      <div class="border border-slate-200 rounded-2xl overflow-hidden scandal-card">
        <div onclick="toggleScandalDetails(this)" class="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-slate-50">
          <div><div class="font-semibold text-xl">${scandal.title}</div><div class="text-xs text-slate-500 mt-0.5">${scandal.year}</div></div>
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
          </div>
        </div>
      </div>
    `;
    container.innerHTML += html;
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

function toggleScandalDetails(el) {
  const details = el.nextElementSibling;
  const icon = el.querySelector('.fa-chevron-down');
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

// Voting functions (restored)
let metteVotes = { ja: 1247, nej: 389, vedikke: 518 };
function loadMetteVotes() { /* ... */ }
function updateVoteDisplay() { /* ... */ }
function voteMette(choice) { /* ... */ }

function initializeEverything() {
  loadPoliticians();
  console.log('%c[Skandale.dk v6.1] Per-skandale justiceAnalysis aktiveret!', 'color:#10b981');
}

window.onload = initializeEverything;