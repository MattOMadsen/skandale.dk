// js/modal-broken-promises.js - Endelig fix: Kilder er ALTID klikbare

function addBrokenPromisesSection(politician) {
  if (!politician.brokenPromises || politician.brokenPromises.length === 0) return;

  let html = `
    <div class="mt-8 pt-6 border-t">
      <div class="flex items-center gap-x-2 mb-4">
        <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
        <span class="font-bold text-lg">Brudte valgløfter</span>
      </div>
      <div class="space-y-4">
  `;

  politician.brokenPromises.forEach((p, index) => {
    const sourceHTML = p.source && p.source.url 
      ? `<a href="${p.source.url}" target="_blank" class="text-[#C8102E] underline hover:text-[#C8102E]/80">${p.source.text || p.source.url}</a>`
      : (p.source || '');

    html += `
      <div data-index="${index}" class="broken-promise-item bg-slate-50 border border-slate-200 hover:border-[#C8102E]/30 rounded-2xl p-4 cursor-pointer transition-all">
        <div class="font-semibold text-base mb-1">${p.title}</div>
        <div class="text-xs text-slate-500 mb-2">Lovet i ${p.year}</div>
        <div class="text-sm text-slate-700 mb-2">${p.whatHappened}</div>
        ${p.source ? `<div class="text-[10px] text-slate-400">Kilde: ${sourceHTML}</div>` : ''}
        <div class="text-[10px] text-[#C8102E] mt-2 font-medium">Klik for detaljer →</div>
      </div>
    `;
  });

  html += `</div></div>`;

  const modalContent = document.querySelector('#politicianModal .p-8');
  if (modalContent) {
    const old = modalContent.querySelector('.broken-promises');
    if (old) old.remove();

    const div = document.createElement('div');
    div.className = 'broken-promises';
    div.innerHTML = html;
    modalContent.appendChild(div);

    // Event listeners
    div.querySelectorAll('.broken-promise-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        showBrokenPromiseDetail(politician.brokenPromises[i], politician);
      });
    });
  }
}

function showBrokenPromiseDetail(promise, politician) {
  let sourceHTML = '';

  if (promise.source && promise.source.url) {
    sourceHTML = `
      <div class="mb-6">
        <div class="font-semibold text-sm text-slate-500 mb-1">Kilde</div>
        <a href="${promise.source.url}" target="_blank" class="inline-flex items-center gap-x-1 text-[#C8102E] underline hover:text-[#C8102E]/80">
          ${promise.source.text || promise.source.url}
          <i class="fa-solid fa-external-link-alt text-xs ml-1"></i>
        </a>
      </div>
    `;
  } else if (promise.source) {
    sourceHTML = `<div class="mb-6"><div class="font-semibold text-sm text-slate-500 mb-1">Kilde</div><div class="text-sm text-slate-600">${promise.source}</div></div>`;
  }

  const html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" id="brokenPromiseModal">
      <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
        <div class="px-8 pt-8 pb-6 border-b flex justify-between items-center">
          <div>
            <h3 class="text-2xl font-bold">${promise.title}</h3>
            <p class="text-sm text-slate-500">Lovet i ${promise.year}</p>
          </div>
          <button onclick="closeBrokenPromiseModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
        </div>

        <div class="p-8">
          <div class="mb-6">
            <div class="font-semibold text-sm text-slate-500 mb-1">Hvad skete der?</div>
            <div class="text-slate-700">${promise.whatHappened}</div>
          </div>
          ${sourceHTML}

          ${promise.otherPoliticians && promise.otherPoliticians.length > 0 ? `
            <div>
              <div class="font-semibold text-sm text-slate-500 mb-2">Andre politikere der har brudt lignende løfter</div>
              <div class="space-y-2">
                ${promise.otherPoliticians.map(n => `
                  <div class="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span class="font-medium">${n}</span>
                    <span onclick="closeBrokenPromiseModal(); showPoliticianByName('${n}')" class="text-xs text-[#C8102E] cursor-pointer hover:underline">Se politiker →</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="px-8 py-4 border-t bg-slate-50 text-xs text-center text-slate-400 rounded-b-3xl">
          Data er baseret på offentligt tilgængelige kilder
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeBrokenPromiseModal() {
  const m = document.getElementById('brokenPromiseModal');
  if (m) m.remove();
}

function showPoliticianByName(name) {
  const p = politicians.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (p && typeof window.showPoliticianModal === 'function') {
    closeBrokenPromiseModal();
    window.showPoliticianModal(p.id);
  }
}