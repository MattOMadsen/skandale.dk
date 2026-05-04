// js/modal-broken-promises.js - Brudte valgløfter (separat fil)

function addBrokenPromisesSection(politician) {
  let brokenPromisesHTML = '';
  
  if (politician.brokenPromises && politician.brokenPromises.length > 0) {
    brokenPromisesHTML = `
      <div class="mt-8 pt-6 border-t">
        <div class="flex items-center gap-x-2 mb-4">
          <i class="fa-solid fa-exclamation-triangle text-[#C8102E]"></i>
          <span class="font-bold text-lg">Brudte valgløfter</span>
        </div>
        <div class="space-y-4">
          ${politician.brokenPromises.map(p => `
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div class="font-semibold text-base mb-1">${p.title}</div>
              <div class="text-xs text-slate-500 mb-2">Lovet i ${p.year}</div>
              <div class="text-sm text-slate-700 mb-2">${p.whatHappened}</div>
              ${p.source ? `<div class="text-[10px] text-slate-400">Kilde: ${p.source}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const modalContent = document.querySelector('#politicianModal .p-8');
  if (modalContent) {
    // Fjern gammel broken promises sektion hvis den findes
    const oldBroken = modalContent.querySelector('.broken-promises');
    if (oldBroken) oldBroken.remove();

    const brokenDiv = document.createElement('div');
    brokenDiv.className = 'broken-promises';
    brokenDiv.innerHTML = brokenPromisesHTML;
    modalContent.appendChild(brokenDiv);
  }
}