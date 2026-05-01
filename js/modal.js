// js/modal.js - Modal, afstemning og kommentarer

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

    // Kommentarer
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
  
  const politicianId = parseInt(document.getElementById('politicianModal').dataset.currentPoliticianId || 0);
  if (politicianId) showPoliticianModal(politicianId);
}