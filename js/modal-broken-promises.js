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
          ${politician.brokenPromises.map((p, index) => `
            <div data-promise-index="${index}" 
                 class="broken-promise-item bg-slate-50 border border-slate-200 hover:border-[#C8102E]/30 rounded-2xl p-4 cursor-pointer transition-all">
              <div class="font-semibold text-base mb-1">${p.title}</div>
              <div class="text-xs text-slate-500 mb-2">Lovet i ${p.year}</div>
              <div class="text-sm text-slate-700 mb-2">${p.whatHappened}</div>
              ${p.source ? `<div class="text-[10px] text-slate-400">Kilde: ${p.source}</div>` : ''}
              <div class="text-[10px] text-[#C8102E] mt-2 font-medium">Klik for detaljer →</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const modalContent = document.querySelector('#politicianModal .p-8');
  if (modalContent) {
    const oldBroken = modalContent.querySelector('.broken-promises');
    if (oldBroken) oldBroken.remove();

    const brokenDiv = document.createElement('div');
    brokenDiv.className = 'broken-promises';
    brokenDiv.innerHTML = brokenPromisesHTML;
    modalContent.appendChild(brokenDiv);

    // Tilføj click event listeners
    const items = brokenDiv.querySelectorAll('.broken-promise-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.promiseIndex);
        const promise = politician.brokenPromises[index];
        if (promise) {
          showBrokenPromiseDetail(promise, politician);
        }
      });
    });
  }
}

function showBrokenPromiseDetail(promise, politician) {
  const html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" id="brokenPromiseModal">
      <div onclick="event.target.id === 'brokenPromiseModal' && closeBrokenPromiseModal()" 
           class="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
        
        <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
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
          
          ${promise.source ? `
            <div class="mb-6">
              <div class="font-semibold text-sm text-slate-500 mb-1">Kilde</div>
              <div class="text-sm text-slate-600">${promise.source}</div>
            </div>
          ` : ''}
          
          ${promise.otherPoliticians && promise.otherPoliticians.length > 0 ? `
            <div>
              <div class="font-semibold text-sm text-slate-500 mb-2">Andre politikere der har brudt lignende løfter</div>
              <div class="space-y-2">
                ${promise.otherPoliticians.map(name => `
                  <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span class="font-medium">${name}</span>
                    <span class="text-xs text-[#C8102E] cursor-pointer hover:underline" 
                          onclick="closeBrokenPromiseModal(); showPoliticianByName('${name}')">
                      Se politiker →
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center rounded-b-3xl">
          Data er baseret på offentligt tilgængelige kilder
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeBrokenPromiseModal() {
  const modal = document.getElementById('brokenPromiseModal');
  if (modal) modal.remove();
}

function showPoliticianByName(name) {
  const politician = politicians.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (politician) {
    closeBrokenPromiseModal();
    showPoliticianModal(politician.id);
  } else {
    alert('Politiker ikke fundet i databasen.');
  }
}