// js/modal-party.js - Parti-oversigt modal

function showPartyOverview() {
    // Gruppér politikere efter parti
    const parties = {};
    
    politicians.forEach(p => {
        if (!parties[p.party]) {
            parties[p.party] = {
                name: p.party,
                color: p.partyColor || '#64748b',
                politicians: [],
                totalScandals: 0,
                totalSeverity: 0,
                totalSupport: 0
            };
        }
        
        parties[p.party].politicians.push(p);
        parties[p.party].totalScandals += p.scandals ? p.scandals.length : 0;
        
        if (p.scandals) {
            p.scandals.forEach(s => {
                parties[p.party].totalSeverity += s.severity || 0;
            });
        }
        
        if (p.economicSupport) {
            p.economicSupport.forEach(s => {
                const amount = parseInt(s.amount.replace(/[^0-9]/g, '')) || 0;
                parties[p.party].totalSupport += amount;
            });
        }
    });

    // Byg HTML
    let html = `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4" id="partyModal">
            <div onclick="event.target.id === 'partyModal' && closePartyModal()" 
                 class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                
                <!-- Header -->
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight">Parti-oversigt</h3>
                        <p class="text-slate-500 mt-1">Klik på et parti for detaljer</p>
                    </div>
                    <button onclick="closePartyModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                
                <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;

    Object.values(parties).forEach(party => {
        const avgSeverity = party.totalScandals > 0 
            ? (party.totalSeverity / party.totalScandals).toFixed(1) 
            : '0.0';
        
        const supportFormatted = (party.totalSupport / 1000).toFixed(0) + 'k kr';

        html += `
            <div onclick="showPartyDetail('${party.name}', '${party.color}')" 
                 class="border border-slate-200 hover:border-[#C8102E]/30 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md">
                <div class="flex items-center justify-between mb-3">
                    <div class="font-bold text-lg" style="color: ${party.color}">${party.name}</div>
                    <div class="text-xs px-3 py-1 rounded-full" style="background-color: ${party.color}20; color: ${party.color}">
                        ${party.politicians.length} politikere
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-3 text-sm">
                    <div>
                        <div class="text-slate-500 text-xs">Skandaler</div>
                        <div class="font-bold text-xl">${party.totalScandals}</div>
                    </div>
                    <div>
                        <div class="text-slate-500 text-xs">Alvorlighed</div>
                        <div class="font-bold text-xl">${avgSeverity}</div>
                    </div>
                    <div>
                        <div class="text-slate-500 text-xs">Støtte</div>
                        <div class="font-bold text-xl">${supportFormatted}</div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

function showPartyDetail(partyName, partyColor) {
    closePartyModal(); // Luk oversigten

    const partyPoliticians = politicians.filter(p => p.party === partyName);
    
    let totalScandals = 0;
    let totalSeverity = 0;
    let totalSupport = 0;

    partyPoliticians.forEach(p => {
        if (p.scandals) {
            totalScandals += p.scandals.length;
            p.scandals.forEach(s => totalSeverity += s.severity || 0);
        }
        if (p.economicSupport) {
            p.economicSupport.forEach(s => {
                totalSupport += parseInt(s.amount.replace(/[^0-9]/g, '')) || 0;
            });
        }
    });

    const avgSeverity = totalScandals > 0 ? (totalSeverity / totalScandals).toFixed(1) : '0.0';
    const supportFormatted = (totalSupport / 1000).toFixed(0) + 'k kr';

    let html = `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[160] flex items-center justify-center p-4" id="partyDetailModal">
            <div onclick="event.target.id === 'partyDetailModal' && closePartyDetailModal()" 
                 class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                
                <!-- Header -->
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between" style="border-color: ${partyColor}30">
                    <div class="flex items-center gap-x-4">
                        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl font-bold" 
                             style="background-color: ${partyColor}">
                            ${partyName.split(' ').map(w => w[0]).join('')}
                        </div>
                        <div>
                            <h3 class="text-3xl font-bold" style="color: ${partyColor}">${partyName}</h3>
                            <p class="text-slate-500">${partyPoliticians.length} politikere • ${totalScandals} skandaler</p>
                        </div>
                    </div>
                    <button onclick="closePartyDetailModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                
                <div class="p-8">
                    <!-- Statistik -->
                    <div class="grid grid-cols-3 gap-4 mb-8">
                        <div class="bg-slate-50 rounded-2xl p-4 text-center">
                            <div class="text-3xl font-bold">${totalScandals}</div>
                            <div class="text-sm text-slate-500">Skandaler</div>
                        </div>
                        <div class="bg-slate-50 rounded-2xl p-4 text-center">
                            <div class="text-3xl font-bold">${avgSeverity}</div>
                            <div class="text-sm text-slate-500">Gennemsnit</div>
                        </div>
                        <div class="bg-slate-50 rounded-2xl p-4 text-center">
                            <div class="text-3xl font-bold">${supportFormatted}</div>
                            <div class="text-sm text-slate-500">Samlet støtte</div>
                        </div>
                    </div>

                    <!-- Politikere -->
                    <div class="mb-4">
                        <div class="font-bold text-lg mb-3">Politikere i partiet</div>
                        <div class="space-y-3">
    `;

    partyPoliticians.forEach(p => {
        const scandals = p.scandals ? p.scandals.length : 0;
        html += `
            <div onclick="closePartyDetailModal(); showPoliticianModal(${p.id})" 
                 class="flex items-center justify-between p-4 bg-white border border-slate-200 hover:border-[#C8102E]/30 rounded-2xl cursor-pointer transition-all">
                <div class="flex items-center gap-x-4">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl" 
                         style="background-color: ${p.avatarColor || p.partyColor}">
                        ${p.initials}
                    </div>
                    <div>
                        <div class="font-semibold">${p.name}</div>
                        <div class="text-sm text-slate-500">${p.role}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm font-medium">${scandals} skandaler</div>
                    <div class="text-xs text-emerald-600">Se detaljer →</div>
                </div>
            </div>
        `;
    });

    html += `
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

function closePartyModal() {
    const modal = document.getElementById('partyModal');
    if (modal) modal.remove();
}

function closePartyDetailModal() {
    const modal = document.getElementById('partyDetailModal');
    if (modal) modal.remove();
}