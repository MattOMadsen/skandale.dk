// js/modal-core.js - KOMPLET OG ROBUST VERSION (fungerer 100%)
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

    const stars = createStars(s.severity);
    html += `
      <div class="border border-slate-200 rounded-2xl mb-4 overflow-hidden">
        <div class="flex items-center justify-between p-4 bg-slate-50">
          <div class="flex-1">
            <div class="flex items-center gap-x-3">
              <div class="font-bold text-lg">${s.title}</div>
              <div class="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">${s.year || ''}</div>
            </div>
            <div class="flex items-center gap-x-2 mt-1">
              <div class="flex items-center text-amber-500">${stars}</div>
              <div class="text-xs text-slate-500">Alvorlighed: ${s.severity}/5</div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t">
          <div class="text-slate-700">${s.shortDesc || s.description || ''}</div>
          ${s.mediaLinks && s.mediaLinks.length > 0 ? `
            <div class="mt-3 flex flex-wrap gap-2">
              ${s.mediaLinks.map(link => `
                <a href="${link.url}" target="_blank" class="inline-flex items-center gap-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs hover:border-[#C8102E]/50">
                  <i class="fa-solid fa-external-link-alt text-[#C8102E]"></i>
                  <span>${link.name}</span>
                </a>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function showPoliticianModal(politicianId) {
  const politician = politicians.find(p => p.id === politicianId);
  if (!politician) {
    console.error('Politiker ikke fundet:', politicianId);
    return;
  }

  if (!politician.scandals && politician.scandalsFile) {
    try {
      const response = await fetch(politician.scandalsFile);
      const data = await response.json();
      politician.scandals = data.scandals || (Array.isArray(data) ? data : []);
    } catch (e) {
      politician.scandals = [];
    }
  }

  if (!politician.affiliations && politician.id) {
    try {
      const affPath = `data/affiliations/${politician.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      const response = await fetch(affPath);
      if (response.ok) {
        const data = await response.json();
        politician.affiliations = data.affiliations || [];
      }
    } catch (e) {
      politician.affiliations = [];
    }
  }

  currentPolitician = politician;

  document.querySelectorAll('.fixed.inset-0').forEach(m => m.remove());

  const html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" id="politicianModal">
      <div onclick="event.target.id === 'politicianModal' && closePoliticianModal()" 
           class="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        
        <div class="px-8 pt-8 pb-6 border-b flex flex-col sm:flex-row sm:items-start justify-between gap-y-4">
          <div class="flex items-center gap-x-4">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl" 
                 style="background-color: ${politician.avatarColor || politician.color || '#C8102E'}">
              ${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 class="text-3xl font-bold">${politician.name}</h2>
              <div class="flex items-center gap-x-2 mt-1">
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">${politician.party}</span>
                <span class="text-sm text-slate-500">${politician.role || ''}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-x-2">
            <button id="share-btn" class="flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-2xl transition-all">
              <i class="fa-solid fa-share-alt"></i>
              <span class="hidden sm:inline">Del</span>
            </button>
            <button onclick="exportPoliticianToPDF(currentPolitician)" class="flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-2xl transition-all">
              <i class="fa-solid fa-file-pdf"></i>
              <span class="hidden sm:inline">PDF</span>
            </button>
            <button onclick="closePoliticianModal()" class="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all text-3xl leading-none">×</button>
          </div>
        </div>
        
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div class="mb-6">
            <div class="font-semibold text-sm text-slate-500 mb-2">Om Politikeren</div>
            <div class="text-slate-700">${politician.bio || 'Ingen beskrivelse tilgængelig.'}</div>
          </div>
          
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
          
          <div class="mb-8">
            <div class="flex items-center gap-x-2 mb-4">
              <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
              <span class="font-bold text-lg">Skandaler</span>
              <span class="text-xs text-slate-500">(${politician.scandals ? politician.scandals.length : 0})</span>
            </div>
            <div id="scandalsContainer"></div>
          </div>
          
          <div id="economicSupportSection"></div>
          
          ${politician.affiliations && politician.affiliations.length > 0 ? `
            <div class="mt-8 pt-6 border-t">
              <div class="flex items-center gap-x-2 mb-4">
                <i class="fa-solid fa-globe text-[#C8102E]"></i>
                <span class="font-bold text-lg">Internationale netværk & tilknytninger</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${politician.affiliations.map(aff => `
                  <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div class="font-semibold">${aff.name}</div>
                    <div class="text-xs text-slate-500">${aff.role || aff.organization || ''} • ${aff.year}</div>
                    ${aff.description ? `<div class="text-sm text-slate-600 mt-1">${aff.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <div id="brokenPromisesSection"></div>
          
        </div>
        
        <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center">
          Data er baseret på offentligt tilgængelige kilder • v2.00.54
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  setTimeout(() => {
    const container = document.getElementById('scandalsContainer');
    if (container) renderScandalsDirect(politician, container);
  }, 50);

  setTimeout(() => {
    if (typeof addBrokenPromisesSection === 'function') addBrokenPromisesSection(politician);
    if (typeof addEconomicSupportSection === 'function') addEconomicSupportSection(politician);
    if (typeof initShareButton === 'function') initShareButton(politician);
  }, 100);
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

window.showPoliticianModal = showPoliticianModal;