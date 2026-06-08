// js/modal-donor.js - Økonomisk støtte med krydsreferencer

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
      const kildeHTML = s.source && s.source.url
        ? `<a href="${s.source.url}" target="_blank" class="text-[#C8102E] underline text-xs">${s.source.text || 'Kilde'}</a>`
        : '';

      tableRows += `
        <tr class="donor-row border-t border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer ${hiddenClass}" data-donor="${encodeURIComponent(s.name)}">
          <td class="px-4 py-3 text-[#C8102E] hover:underline">${s.name}</td>
          <td class="px-4 py-3 text-right font-medium">${s.amount}</td>
          <td class="px-4 py-3 text-xs text-slate-500">${s.type}</td>
          <td class="px-4 py-3 text-xs text-slate-500 font-mono">${yearDisplay}</td>
          <td class="px-4 py-3 text-xs">${kildeHTML}</td>
        </tr>
      `;
    });

    let showMoreHTML = '';
    if (donations.length > initialCount) {
      showMoreHTML = `
        <div class="px-4 py-3 bg-slate-100 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-700 flex justify-center gap-x-3" id="show-more-container-${politician.id}">
          <button onclick="showMoreDonations(${politician.id}, ${initialCount}, ${showMoreCount})"
                  class="px-4 py-1.5 text-sm font-medium text-[#C8102E] hover:bg-white dark:hover:bg-slate-600 rounded-xl border border-[#C8102E]/30 transition-colors">
            Vis ${Math.min(showMoreCount, donations.length - initialCount)} flere
          </button>
          <button onclick="hideAllDonations(${politician.id})"
                  class="px-4 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-600 rounded-xl border border-slate-300 dark:border-slate-600 transition-colors hidden" id="hide-all-btn-${politician.id}">
            Skjul alle
          </button>
        </div>
      `;
    }

    supportHTML = `
      <div class="mt-10 pt-8 border-t">
        <div class="flex items-center gap-x-2 mb-4">
          <i class="fa-solid fa-handshake text-[#C8102E]"></i>
          <span class="font-bold text-lg text-slate-900 dark:text-white">Økonomisk støtte (2023–2025)</span>
          <span class="text-xs text-slate-500 dark:text-slate-400 ml-2">(${donations.length} donorer)</span>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-slate-100 dark:bg-slate-700">
              <tr>
                <th class="text-left px-4 py-3 font-semibold">Bidragyder</th>
                <th class="text-right px-4 py-3 font-semibold">Beløb</th>
                <th class="text-left px-4 py-3 font-semibold">Type</th>
                <th class="text-left px-4 py-3 font-semibold">År</th>
                <th class="text-left px-4 py-3 font-semibold">Kilde</th>
              </tr>
            </thead>
            <tbody id="donation-tbody-${politician.id}">
              ${tableRows}
            </tbody>
          </table>
          ${showMoreHTML}
        </div>
        <p class="text-[10px] text-slate-400 mt-2">Klik på et navn for at se alle politikere denne donor har støttet</p>
      </div>
    `;
  }

  const modalContent = document.querySelector('#politicianModal .p-8');
  if (modalContent) {
    const oldSupport = modalContent.querySelector('.economic-support');
    if (oldSupport) oldSupport.remove();

    const supportDiv = document.createElement('div');
    supportDiv.className = 'economic-support';
    supportDiv.innerHTML = supportHTML;
    modalContent.appendChild(supportDiv);

    supportDiv.querySelectorAll('.donor-row').forEach(row => {
      row.addEventListener('click', () => {
        const donorName = decodeURIComponent(row.dataset.donor || '');
        if (donorName) showDonorModal(donorName);
      });
    });
  }
}

function showMoreDonations(politicianId, startIndex, count) {
  const tbody = document.getElementById(`donation-tbody-${politicianId}`);
  if (!tbody) return;

  const rows = tbody.querySelectorAll('.donation-row.hidden');
  let shown = 0;

  rows.forEach(row => {
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
                class="px-4 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-600 rounded-xl border border-slate-300 dark:border-slate-600 transition-colors">
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
              class="px-4 py-1.5 text-sm font-medium text-[#C8102E] hover:bg-white dark:hover:bg-slate-600 rounded-xl border border-[#C8102E]/30 transition-colors">
        Vis ${Math.min(10, total - 5)} flere
      </button>
    `;
  }
}

async function showDonorModal(donorName) {
  if (typeof window.ensureAllDetailsLoaded === 'function') {
    await window.ensureAllDetailsLoaded();
  }

  const politicianModal = document.getElementById('politicianModal');
  if (politicianModal) {
    politicianModal.classList.remove('flex');
    politicianModal.classList.add('hidden');
  }

  const supportedPoliticians = typeof window.findPoliticiansByDonor === 'function'
    ? window.findPoliticiansByDonor(donorName)
    : [];

  const html = `
    <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4" id="donorModal">
      <div onclick="event.target.id === 'donorModal' && closeDonorModal()"
           class="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden">

        <div class="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${donorName}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">${supportedPoliticians.length} politiker${supportedPoliticians.length === 1 ? '' : 'e'} har modtaget støtte fra denne bidragyder</p>
          </div>
          <button onclick="closeDonorModal()" class="text-3xl text-slate-400 hover:text-slate-600 dark:hover:text-white">×</button>
        </div>

        <div class="p-8 overflow-y-auto max-h-[60vh]">
          ${supportedPoliticians.length > 0 ? `
            <div class="space-y-3">
              ${supportedPoliticians.map(p => {
                const kildeHTML = p.source && p.source.url
                  ? `<a href="${p.source.url}" target="_blank" class="text-[#C8102E] underline text-xs">${p.source.text || 'Kilde'}</a>`
                  : '';
                return `
                  <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#C8102E]/30 transition-colors cursor-pointer"
                       onclick="closeDonorModalAndShowPolitician(${p.id})">
                    <div>
                      <div class="font-semibold text-slate-900 dark:text-white">${p.name}</div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">${p.party} • ${p.type} • ${p.year}</div>
                      ${kildeHTML ? `<div class="text-xs mt-1">${kildeHTML}</div>` : ''}
                    </div>
                    <div class="text-right">
                      <div class="font-medium text-[#C8102E]">${p.amount}</div>
                      <div class="text-[10px] text-slate-400">Se politiker →</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="text-center py-8 text-slate-500">
              Ingen yderligere oplysninger om denne donor i databasen.
            </div>
          `}
        </div>

        <div class="px-8 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-400 dark:text-slate-500 text-center rounded-b-3xl">
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

  const politicianModal = document.getElementById('politicianModal');
  if (politicianModal) {
    politicianModal.classList.remove('hidden');
    politicianModal.classList.add('flex');
  }
}

function closeDonorModalAndShowPolitician(politicianId) {
  closeDonorModal();
  setTimeout(() => {
    if (typeof window.showPoliticianModal === 'function') {
      window.showPoliticianModal(politicianId);
    }
  }, 50);
}

window.addEconomicSupportSection = addEconomicSupportSection;
window.showDonorModal = showDonorModal;
window.showMoreDonations = showMoreDonations;
window.hideAllDonations = hideAllDonations;
window.closeDonorModal = closeDonorModal;
window.closeDonorModalAndShowPolitician = closeDonorModalAndShowPolitician;