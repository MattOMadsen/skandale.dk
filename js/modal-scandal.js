// js/modal-scandal.js - Skandaler (med createStars defineret + legacy support)

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

function loadScandals(politician) {
  const container = document.getElementById('scandalsContainer');
  if (!container) return;

  if (!politician.scandals || politician.scandals.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-500">Ingen skandaler registreret for denne politiker.</div>`;
    return;
  }

  let html = '';
  politician.scandals.forEach((scandal, index) => {
    html += buildScandalHTML(scandal, index, politician);
  });

  container.innerHTML = html;

  // Event listeners for expand/collapse
  politician.scandals.forEach((scandal, index) => {
    const header = document.getElementById(`scandal-header-${index}`);
    if (header) {
      header.addEventListener('click', () => {
        const content = document.getElementById(`scandal-content-${index}`);
        const chevron = document.getElementById(`scandal-chevron-${index}`);
        
        if (content.classList.contains('hidden')) {
          content.classList.remove('hidden');
          chevron.classList.add('rotate-180');
        } else {
          content.classList.add('hidden');
          chevron.classList.remove('rotate-180');
        }
      });
    }
  });
}

function buildScandalHTML(scandal, index, politician) {
  // === LEGACY SUPPORT: Normaliser gamle data-formater (Helle, Anders Fogh, Mette m.fl.) ===
  const s = { ...scandal }; // shallow clone

  if (!s.severity || s.severity < 1) s.severity = 3;           // default alvorlighed
  if (!s.year && s.date) s.year = s.date;                          // support "date" som fallback
  if (!s.shortDesc && !s.longDesc && s.description) {
    s.shortDesc = s.description;                                   // brug description som shortDesc
  }

  // Konverter legacy source/sources til mediaLinks
  if (!s.mediaLinks) {
    if (s.source && s.source.url) {
      s.mediaLinks = [{
        name: s.source.text || 'Kilde',
        url: s.source.url
      }];
    } else if (s.sources && Array.isArray(s.sources)) {
      s.mediaLinks = s.sources.map((url, i) => ({
        name: `Kilde ${i + 1}`,
        url: url
      }));
    }
  }

  const severityStars = createStars(s.severity);
  
  return `
    <div class="border border-slate-200 rounded-2xl mb-4 overflow-hidden">
      <!-- Header -->
      <div id="scandal-header-${index}" class="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
        <div class="flex-1">
          <div class="flex items-center gap-x-3">
            <div class="font-bold text-lg">${s.title}</div>
            <div class="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">${s.year || ''}</div>
          </div>
          <div class="flex items-center gap-x-2 mt-1">
            <div class="flex items-center text-amber-500">${severityStars}</div>
            <div class="text-xs text-slate-500">Alvorlighed: ${s.severity}/5</div>
          </div>
        </div>
        <div class="flex items-center gap-x-2">
          <i id="scandal-chevron-${index}" class="fa-solid fa-chevron-down text-slate-400 transition-transform"></i>
        </div>
      </div>
      
      <!-- Content -->
      <div id="scandal-content-${index}" class="hidden p-4 border-t">
        <div class="space-y-4">
          <!-- Hvad skete der? -->
          <div>
            <div class="font-semibold text-sm text-slate-500 mb-1">Hvad skete der?</div>
            <div class="text-slate-700">${s.longDesc || s.shortDesc || s.description || ''}</div>
          </div>
          
          <!-- Outcome -->
          ${s.outcome ? `
            <div>
              <div class="font-semibold text-sm text-slate-500 mb-1">Udvikling / Konsekvens</div>
              <div class="text-slate-700">${s.outcome}</div>
            </div>
          ` : ''}
          
          <!-- Justice Analysis -->
          ${s.justiceAnalysis ? `
            <div>
              <div class="font-semibold text-sm text-slate-500 mb-1">Juridisk vurdering</div>
              <div class="text-slate-700">${s.justiceAnalysis}</div>
            </div>
          ` : ''}
          
          <!-- Media Links -->
          ${s.mediaLinks && s.mediaLinks.length > 0 ? `
            <div>
              <div class="font-semibold text-sm text-slate-500 mb-2">Kilder & Medier</div>
              <div class="flex flex-wrap gap-2">
                ${s.mediaLinks.map(link => `
                  <a href="${link.url}" target="_blank" class="inline-flex items-center gap-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs hover:border-[#C8102E]/50 transition-colors">
                    <i class="fa-solid fa-external-link-alt text-[#C8102E]"></i>
                    <span>${link.name}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <!-- Voting -->
          <div class="pt-4 border-t">
            <div class="font-semibold text-sm text-slate-500 mb-2">Hvad synes du?</div>
            <div class="flex gap-x-2">
              <button onclick="voteOnScandal(${index}, 'good')" class="flex-1 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-medium transition-colors">
                <i class="fa-solid fa-thumbs-up mr-1"></i> Godt
              </button>
              <button onclick="voteOnScandal(${index}, 'bad')" class="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-sm font-medium transition-colors">
                <i class="fa-solid fa-thumbs-down mr-1"></i> Dårligt
              </button>
              <button onclick="voteOnScandal(${index}, 'neutral')" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                <i class="fa-solid fa-minus mr-1"></i> Neutral
              </button>
            </div>
            <div id="vote-result-${index}" class="mt-2 text-xs text-center text-slate-500"></div>
          </div>
          
          <!-- Comments -->
          <div class="pt-4 border-t">
            <div class="font-semibold text-sm text-slate-500 mb-2">Kommentarer</div>
            <div class="flex gap-x-2 mb-3">
              <input type="text" id="comment-input-${index}" placeholder="Skriv en kommentar..." class="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm">
              <button onclick="addComment(${index})" class="px-4 py-2 bg-[#C8102E] text-white rounded-xl text-sm font-medium hover:bg-[#C8102E]/90 transition-colors">
                Send
              </button>
            </div>
            <div id="comments-list-${index}" class="space-y-2 text-sm"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}