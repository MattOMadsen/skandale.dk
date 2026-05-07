// js/modal-broken-promises.js - ABSOLUT SIMPLEST VERSION

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
    let kilde = p.source;
    if (p.source && p.source.url) {
      kilde = `<a href="${p.source.url}" target="_blank" class="text-[#C8102E] underline">${p.source.text || p.source.url}</a>`;
    }

    html += `
      <div class="broken-promise-item bg-slate-50 border border-slate-200 hover:border-[#C8102E]/30 rounded-2xl p-4 mb-3 cursor-pointer" data-index="${i}">
        <div class="font-semibold text-base">${p.title}</div>
        <div class="text-xs text-slate-500">Lovet i ${p.year}</div>
        <div class="text-sm text-slate-700 my-2">${p.whatHappened}</div>
        <div class="text-[10px] text-slate-400">Kilde: ${kilde}</div>
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
  let kilde = promise.source;
  if (promise.source && promise.source.url) {
    kilde = `<a href="${promise.source.url}" target="_blank" class="text-[#C8102E] underline">${promise.source.text || promise.source.url}</a>`;
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
          ${kilde ? `<div class="mt-6"><div class="font-semibold text-sm text-slate-500">Kilde</div><div class="text-sm">${kilde}</div></div>` : ''}
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