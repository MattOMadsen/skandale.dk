// js/modal-donor.js - Økonomisk støtte + Internationale netværk + begge modals (opdateret med årstal på donorer)

function addEconomicSupportSection(politician) {
  let supportHTML = '';
  if (politician.economicSupport && politician.economicSupport.length > 0) {
    const donations = politician.economicSupport;
    const initialCount = 5;
    const showMoreCount = 10;

    let tableRows = '';
    donations.forEach((s, index) => {
      const hiddenClass = index >= initialCount ? 'hidden donation-row' : '';
      const yearDisplay = s.year || '-';
      tableRows += `
        <tr class="border-t border-slate-200 hover:bg-slate-100 cursor-pointer ${hiddenClass}" onclick="showDonorModal('${s.name}')">
          <td class="px-4 py-3 text-[#C8102E] hover:underline">${s.name}</td>
          <td class="px-4 py-3 text-right font-medium">${s.amount}</td>
          <td class="px-4 py-3 text-xs text-slate-500">${s.type}</td>
          <td class="px-4 py-3 text-xs text-slate-500 font-mono">${yearDisplay}</td>
        </tr>
      `;
    });

    let showMoreHTML = '';
    if (donations.length > initialCount) {
      showMoreHTML = `
        <div class="px-4 py-3 bg-slate-100 border-t flex justify-center gap-x-3" id="show-more-container-${politician.id}">
          <button onclick="showMoreDonations(${politician.id}, ${initialCount}, ${showMoreCount})" 
                  class="px-4 py-1.5 text-sm font-medium text-[#C8102E] hover:bg-white rounded-xl border border-[#C8102E]/30 transition-colors">
            Vis ${Math.min(showMoreCount, donations.length - initialCount)} flere
          </button>
          <button onclick="hideAllDonations(${politician.id})" 
                  class="px-4 py-1.5 text-sm font-medium text-slate-500 hover:bg-white rounded-xl border border-slate-300 transition-colors hidden" id="hide-all-btn-${politician.id}">
            Skjul alle
          </button>
        </div>
      `;
    }

    supportHTML = `
      <div class="mt-10 pt-8 border-t">
        <div class="flex items-center gap-x-2 mb-4">
          <i class="fa-solid fa-handshake text-[#C8102E]"></i>
          <span class="font-bold text-lg">Økonomisk støtte (2023–2025)</span>
          <span class="text-xs text-slate-500 ml-2">(${donations.length} donorer)</span>
        </div>
        <div class="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-100">
              <tr>
                <th class="text-left px-4 py-3 font-semibold">Bidragyder</th>
                <th class="text-right px-4 py-3 font-semibold">Beløb</th>
                <th class="text-left px-4 py-3 font-semibold">Type</th>
                <th class="text-left px-4 py-3 font-semibold">År</th>
              </tr>
            </thead>
            <tbody id="donation-tbody-${politician.id}">
              ${tableRows}
            </tbody>
          </table>
          ${showMoreHTML}
        </div>
        <p class="text-[10px] text-slate-400 mt-2">Klik på et navn for at se alle de har støttet</p>
      </div>
    `;
  }

  // INTERNATIONALE NETVÆRK – klikbare (samme design)
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

function showMoreDonations(politicianId, startIndex, count) {
  const tbody = document.getElementById(`donation-tbody-${politicianId}`);
  if (!tbody) return;

  const rows = tbody.querySelectorAll('.donation-row.hidden');
  let shown = 0;

  rows.forEach((row, index) => {
    if (shown < count) {
      row.classList.remove('hidden');
      shown++;
    }
  });

  const container = document.getElementById(`show-more-container-${politicianId}`);
  if (container) {
    const remaining = tbody.querySelectorAll('.donation-row.hidden').length;
    if (remaining === 0) {
      container.innerHTML = `
        <button onclick="hideAllDonations(${politicianId})" 
                class="px-4 py-1.5 text-sm font-medium text-slate-500 hover:bg-white rounded-xl border border-slate-300 transition-colors">
          Skjul alle
        </button>
      `;
    } else {
      container.querySelector('button').innerHTML = `Vis ${Math.min(count, remaining)} flere`;
    }
  }
}

function hideAllDonations(politicianId) {
  const tbody = document.getElementById(`donation-tbody-${politicianId}`);
  if (!tbody) return;

  const rows = tbody.querySelectorAll('.donation-row');
  rows.forEach((row, index) => {
    if (index >= 5) row.classList.add('hidden');
  });

  const container = document.getElementById(`show-more-container-${politicianId}`);
  if (container) {
    const total = tbody.querySelectorAll('tr').length;
    container.innerHTML = `
      <button onclick="showMoreDonations(${politicianId}, 5, 10)" 
              class="px-4 py-1.5 text-sm font-medium text-[#C8102E] hover:bg-white rounded-xl border border-[#C8102E]/30 transition-colors">
        Vis ${Math.min(10, total - 5)} flere
      </button>
    `;
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
            year: support.year || '-',
            id: politician.id
          });
        }
      });
    }
  });

  const html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" id="donorModal">
      <div onclick="event.target.id === 'donorModal' && closeDonorModal()" 
           class="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden">
        
        <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold">${donorName}</h3>
            <p class="text-sm text-slate-500">Har støttet følgende politikere</p>
          </div>
          <button onclick="closeDonorModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
        </div>
        
        <div class="p-8 overflow-y-auto max-h-[60vh]">
          ${supportedPoliticians.length > 0 ? `
            <div class="space-y-3">
              ${supportedPoliticians.map(p => `
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-[#C8102E]/30 transition-colors cursor-pointer"
                     onclick="closeDonorModal(); showPoliticianModal(${p.id})">
                  <div>
                    <div class="font-semibold">${p.name}</div>
                    <div class="text-xs text-slate-500">${p.type} • ${p.year}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-[#C8102E]">${p.amount}</div>
                    <div class="text-[10px] text-slate-400">Se politiker →</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="text-center py-8 text-slate-500">
              Ingen yderligere oplysninger om denne donor i databasen.
            </div>
          `}
        </div>
        
        <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center rounded-b-3xl">
          Data er baseret på offentligt tilgængelige kilder • 2023–2025
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeDonorModal() {
  const modal = document.getElementById('donorModal');
  if (modal) modal.remove();
  
  // Genåbn politiker-moda len hvis den var åben
  const politicianModal = document.getElementById('politicianModal');
  if (politicianModal && politicianModal.classList.contains('hidden')) {
    politicianModal.classList.remove('hidden');
    politicianModal.classList.add('flex');
  }
}

// Hjælpefunktion til at vise politiker fra donor-modal
function showPoliticianModal(politicianId) {
  if (typeof window.showPoliticianModal === 'function') {
    window.showPoliticianModal(politicianId);
  } else {
    console.warn('showPoliticianModal ikke fundet – genindlæs siden.');
  }
}