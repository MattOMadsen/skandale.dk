// js/modal-donor.js - Økonomisk støtte (v2.00.23)

function addEconomicSupportSection(politician) {
  const container = document.getElementById('economicSupportSection');
  if (!container) return;

  const donations = politician.economicSupport || [];
  if (donations.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <div class="mb-8">
      <div class="flex items-center gap-x-2 mb-4">
        <i class="fa-solid fa-handshake text-[#C8102E]"></i>
        <span class="font-bold text-lg">Økonomisk støtte</span>
        <span class="text-xs text-slate-500">(${donations.length})</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-2 px-3 font-semibold text-slate-600">Bidragyder</th>
              <th class="text-right py-2 px-3 font-semibold text-slate-600">Beløb</th>
              <th class="text-left py-2 px-3 font-semibold text-slate-600">Type</th>
              <th class="text-right py-2 px-3 font-semibold text-slate-600">År</th>
            </tr>
          </thead>
          <tbody>
  `;

  donations.forEach(d => {
    const sourceLink = d.source && d.source.url 
      ? `<a href="${d.source.url}" target="_blank" class="text-[#C8102E] hover:underline">${d.source.text}</a>` 
      : (d.source ? d.source.text : '');

    html += `
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="py-2 px-3 font-medium">${d.name}</td>
        <td class="py-2 px-3 text-right font-mono">${d.amount}</td>
        <td class="py-2 px-3 text-slate-600">${d.type}</td>
        <td class="py-2 px-3 text-right text-slate-500">${d.year}</td>
      </tr>
    `;
  });

  html += `</tbody></table></div></div>`;
  container.innerHTML = html;
}

function closeDonorModalAndShowPolitician(politicianId) {
  closeDonorModal();
  // Removed recursive call to prevent infinite loop
  // setTimeout(() => {
  //   if (typeof window.showPoliticianModal === 'function') {
  //     window.showPoliticianModal(politicianId);
  //   }
  // }, 50);
}