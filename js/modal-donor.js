// js/modal-donor.js - Økonomisk støtte + Internationale netværk + begge modals (fuld version)

function addEconomicSupportSection(politician) {
  let supportHTML = '';
  if (politician.economicSupport && politician.economicSupport.length > 0) {
    supportHTML = `
      <div class="mt-10 pt-8 border-t">
        <div class="flex items-center gap-x-2 mb-4">
          <i class="fa-solid fa-handshake text-[#C8102E]"></i>
          <span class="font-bold text-lg">Økonomisk støtte (2023–2025)</span>
        </div>
        <div class="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-100">
              <tr>
                <th class="text-left px-4 py-3 font-semibold">Bidragyder</th>
                <th class="text-right px-4 py-3 font-semibold">Beløb</th>
                <th class="text-left px-4 py-3 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              ${politician.economicSupport.map(s => `
                <tr class="border-t border-slate-200 hover:bg-slate-100 cursor-pointer" onclick="showDonorModal('${s.name}')">
                  <td class="px-4 py-3 text-[#C8102E] hover:underline">${s.name}</td>
                  <td class="px-4 py-3 text-right font-medium">${s.amount}</td>
                  <td class="px-4 py-3 text-xs text-slate-500">${s.type}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p class="text-[10px] text-slate-400 mt-2">Klik på et navn for at se alle de har støttet</p>
      </div>
    `;
  }

  // INTERNATIONALE NETVÆRK – nu også klikbare (samme design)
  let affiliationsHTML = '';
  if (politician.affiliations && politician.affiliations.length > 0) {
    affiliationsHTML = `
      <div class="mt-8 pt-6 border-t">
        <div class="flex items-center gap-x-2 mb-4">
          <i class="fa-solid fa-globe text-[#C8102E]"></i>
          <span class="font-bold text-lg">Internationale netværk & tilknytninger</span>
        </div>
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <ul class="space-y-2 text-sm">
            ${politician.affiliations.map(a => `
              <li onclick="showAffiliationModal('${a.name}')" class="flex justify-between items-start cursor-pointer hover:bg-slate-100 p-2 rounded-xl transition-colors">
                <div>
                  <span class="font-medium text-[#C8102E] hover:underline">${a.name}</span>
                  ${a.organization ? `<span class="text-xs text-slate-500">(${a.organization})</span>` : ''}
                </div>
                <div class="text-right text-xs text-slate-400">
                  ${a.year || ''}<br>
                  <span class="text-[10px]">${a.source || ''}</span>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
        <p class="text-[10px] text-slate-400 mt-2">Klik på et netværk for at se alle politikere med samme tilknytning</p>
      </div>
    `;
  }

  const modalContent = document.querySelector('#politicianModal .p-8');
  if (modalContent) {
    const oldSupport = modalContent.querySelector('.economic-support');
    if (oldSupport) oldSupport.remove();

    const supportDiv = document.createElement('div');
    supportDiv.className = 'economic-support';
    supportDiv.innerHTML = supportHTML + affiliationsHTML;
    modalContent.appendChild(supportDiv);
  }
}

function showDonorModal(donorName) {
  document.getElementById('politicianModal').classList.remove('flex');
  document.getElementById('politicianModal').classList.add('hidden');

  let supportedPoliticians = [];

  politicians.forEach(politician => {
    if (politician.economicSupport) {
      politician.economicSupport.forEach(support => {
        if (support.name.toLowerCase() === donorName.toLowerCase()) {
          supportedPoliticians.push({
            name: politician.name,
            amount: support.amount,
            type: support.type,
            id: politician.id
          });
        }
      });
    }
  });

  let html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-4" id="donorModal">
      <div onclick="event.target.id === 'donorModal' && closeDonorModal()" class="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
        <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold">${donorName}</h3>
            <p class="text-sm text-slate-500">Har støttet følgende politikere</p>
          </div>
          <button onclick="closeDonorModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
        </div>
        
        <div class="p-8">
          ${supportedPoliticians.length > 0 ? `
            <div class="space-y-3">
              ${supportedPoliticians.map(p => `
                <div onclick="closeDonorModal(); showPoliticianModal(${p.id})" class="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl cursor-pointer border border-slate-200">
                  <div>
                    <div class="font-semibold">${p.name}</div>
                    <div class="text-xs text-slate-500">${p.type}</div>
                  </div>
                  <div class="font-bold text-emerald-600">${p.amount}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-center text-slate-500 py-8">Ingen data fundet for denne donor.</p>
          `}
        </div>
        
        <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center rounded-b-3xl">
          Data er baseret på offentligt tilgængelige regnskaber
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeDonorModal() {
  const donorModal = document.getElementById('donorModal');
  if (donorModal) donorModal.remove();
  
  const politicianModal = document.getElementById('politicianModal');
  if (politicianModal.dataset.currentPoliticianId) {
    politicianModal.classList.remove('hidden');
    politicianModal.classList.add('flex');
  }
}

// ===================== NY AFFILIATION MODAL (samme design som donor) =====================
function showAffiliationModal(affiliationName) {
  document.getElementById('politicianModal').classList.remove('flex');
  document.getElementById('politicianModal').classList.add('hidden');

  let politiciansWithAffiliation = [];

  politicians.forEach(politician => {
    if (politician.affiliations) {
      politician.affiliations.forEach(aff => {
        if (aff.name.toLowerCase() === affiliationName.toLowerCase()) {
          politiciansWithAffiliation.push({
            name: politician.name,
            id: politician.id,
            year: aff.year,
            organization: aff.organization || ''
          });
        }
      });
    }
  });

  let html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-4" id="affiliationModal">
      <div onclick="event.target.id === 'affiliationModal' && closeAffiliationModal()" class="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
        <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold">${affiliationName}</h3>
            <p class="text-sm text-slate-500">Politikere med denne tilknytning</p>
          </div>
          <button onclick="closeAffiliationModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
        </div>
        
        <div class="p-8">
          ${politiciansWithAffiliation.length > 0 ? `
            <div class="space-y-3">
              ${politiciansWithAffiliation.map(p => `
                <div onclick="closeAffiliationModal(); showPoliticianModal(${p.id})" class="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl cursor-pointer border border-slate-200">
                  <div>
                    <div class="font-semibold">${p.name}</div>
                    <div class="text-xs text-slate-500">${p.organization} ${p.year ? '• ' + p.year : ''}</div>
                  </div>
                  <div class="text-emerald-600"><i class="fa-solid fa-arrow-right"></i></div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-center text-slate-500 py-8">Ingen andre politikere fundet med denne tilknytning.</p>
          `}
        </div>
        
        <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center rounded-b-3xl">
          Data er baseret på offentligt tilgængelige kilder
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeAffiliationModal() {
  const affModal = document.getElementById('affiliationModal');
  if (affModal) affModal.remove();
  
  const politicianModal = document.getElementById('politicianModal');
  if (politicianModal && politicianModal.dataset.currentPoliticianId) {
    politicianModal.classList.remove('hidden');
    politicianModal.classList.add('flex');
  }
}