// js/modal-broken-promises.js - Opdateret til at understøtte flere kilde links (sources array) + backward compat med single source

function addBrokenPromisesSection(politician) {
  const container = document.querySelector('#politicianModal .p-8');
  if (!container || !politician.brokenPromises) return;

  const old = container.querySelector('.broken-promises');
  if (old) old.remove();

  let html = `<div class="mt-8 pt-6 border-t broken-promises">
    <div class="flex items-center gap-x-2 mb-4">
      <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
      <span class="font-bold text-lg">Brudte valgløfter</span>
    </div>`;

  politician.brokenPromises.forEach((p, i) => {
    // Byg kilde HTML - understøtter både sources[] array og enkelt source
    let kildeHTML = '';
    if (p.sources && Array.isArray(p.sources) && p.sources.length > 0) {
      kildeHTML = p.sources.map(s => 
        `<a href="${s.url}" target="_blank" class="text-[#C8102E] underline hover:text-[#C8102E]/80">${s.text || s.url}</a>`
      ).join(' • ');
    } else if (p.source && p.source.url) {
      kildeHTML = `<a href="${p.source.url}" target="_blank" class="text-[#C8102E] underline">${p.source.text || p.source.url}</a>`;
    } else {
      kildeHTML = 'Kilde ikke angivet';
    }

    html += `
      <div class="broken-promise-item bg-slate-50 border border-slate-200 hover:border-[#C8102E]/30 rounded-2xl p-4 mb-3 cursor-pointer" data-index="${i}">
        <div class="font-semibold text-base">${p.title}</div>
        <div class="text-xs text-slate-500">Lovet i ${p.year}</div>
        <div class="text-sm text-slate-700 my-2">${p.whatHappened}</div>
        <div class="text-[10px] text-slate-400">Kilder: ${kildeHTML}</div>
        <div class="text-[10px] text-[#C8102E] mt-2">Klik for detaljer →</div>
      </div>
    `;
  });

  html += `</div>`;
  container.insertAdjacentHTML('beforeend', html);

  container.querySelectorAll('.broken-promise-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      showBrokenPromiseDetail(politician.brokenPromises[idx]);
    });
  });
}

function showBrokenPromiseDetail(promise) {
  // Byg kilde HTML til detalje modal
  let kildeHTML = '';
  if (promise.sources && Array.isArray(promise.sources) && promise.sources.length > 0) {
    kildeHTML = promise.sources.map(s => 
      `<a href="${s.url}" target="_blank" class="text-[#C8102E] underline hover:text-[#C8102E]/80 block mb-1">${s.text || s.url}</a>`
    ).join('');
  } else if (promise.source && promise.source.url) {
    kildeHTML = `<a href="${promise.source.url}" target="_blank" class="text-[#C8102E] underline">${promise.source.text || promise.source.url}</a>`;
  }

  const html = `
    <div class="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4" id="brokenPromiseModal">
      <div class="bg-white rounded-3xl max-w-lg w-full">
        <div class="px-8 pt-8 pb-6 border-b flex justify-between">
          <div>
            <h3 class="text-2xl font-bold">${promise.title}</h3>
            <p class="text-sm text-slate-500">Lovet i ${promise.year}</p>
          </div>
          <button onclick="closeBrokenPromiseModal()" class="text-3xl">×</button>
        </div>
        <div class="p-8">
          <div>
            <div class="font-semibold text-sm text-slate-500">Hvad skete der?</div>
            <div class="text-slate-700">${promise.whatHappened}</div>
          </div>
          ${kildeHTML ? `<div class="mt-6"><div class="font-semibold text-sm text-slate-500 mb-1">Kilder</div><div class="text-sm">${kildeHTML}</div></div>` : ''}
        </div>
        <div class="px-8 py-4 border-t text-xs text-center text-slate-400">Data er baseret på offentligt tilgængelige kilder</div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeBrokenPromiseModal() {
  const m = document.getElementById('brokenPromiseModal');
  if (m) m.remove();
}