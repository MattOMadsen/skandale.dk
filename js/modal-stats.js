// js/modal-stats.js - Statistik Dashboard

function showStatsModal() {
    // Beregn statistikker
    let totalScandals = 0;
    let totalSeverity = 0;
    const partyStats = {};
    const supportRanking = [];
    const brokenPromisesRanking = [];
    const severeScandals = [];

    politicians.forEach(politician => {
        const scandals = politician.scandals || [];
        totalScandals += scandals.length;

        scandals.forEach(scandal => {
            totalSeverity += scandal.severity || 0;
            
            // Top alvorlige skandaler
            severeScandals.push({
                title: scandal.title,
                politician: politician.name,
                severity: scandal.severity,
                year: scandal.year
            });
        });

        // Parti statistik
        if (!partyStats[politician.party]) {
            partyStats[politician.party] = { count: 0, color: politician.partyColor };
        }
        partyStats[politician.party].count += scandals.length;

        // Økonomisk støtte
        if (politician.economicSupport) {
            const totalSupport = politician.economicSupport.reduce((sum, s) => {
                return sum + parseInt(s.amount.replace(/[^0-9]/g, '')) || 0;
            }, 0);
            
            supportRanking.push({
                name: politician.name,
                amount: totalSupport,
                party: politician.party
            });
        }

        // Brudte løfter
        const broken = politician.brokenPromises ? politician.brokenPromises.length : 0;
        brokenPromisesRanking.push({
            name: politician.name,
            count: broken,
            party: politician.party
        });
    });

    // Sorteringer
    severeScandals.sort((a, b) => b.severity - a.severity);
    supportRanking.sort((a, b) => b.amount - a.amount);
    brokenPromisesRanking.sort((a, b) => b.count - a.count);

    const avgSeverity = totalScandals > 0 ? (totalSeverity / totalScandals).toFixed(1) : '0.0';

    // Byg HTML
    let html = `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4" id="statsModal">
            <div onclick="event.target.id === 'statsModal' && closeStatsModal()" 
                 class="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl">
                
                <!-- Header -->
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight">Statistik Dashboard</h3>
                        <p class="text-slate-500 mt-1">Overblik over dansk politik</p>
                    </div>
                    <button onclick="closeStatsModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                
                <div class="p-8 overflow-y-auto max-h-[calc(92vh-120px)]">
                    
                    <!-- Hovedtal -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div class="bg-slate-50 rounded-2xl p-6 text-center">
                            <div class="text-4xl font-bold text-[#C8102E]">${totalScandals}</div>
                            <div class="text-sm text-slate-500 mt-1">Skandaler i alt</div>
                        </div>
                        <div class="bg-slate-50 rounded-2xl p-6 text-center">
                            <div class="text-4xl font-bold text-[#C8102E]">${avgSeverity}</div>
                            <div class="text-sm text-slate-500 mt-1">Gennemsnitlig alvorlighed</div>
                        </div>
                        <div class="bg-slate-50 rounded-2xl p-6 text-center">
                            <div class="text-4xl font-bold text-[#C8102E]">${Object.keys(partyStats).length}</div>
                            <div class="text-sm text-slate-500 mt-1">Partier repræsenteret</div>
                        </div>
                        <div class="bg-slate-50 rounded-2xl p-6 text-center">
                            <div class="text-4xl font-bold text-[#C8102E]">${politicians.length}</div>
                            <div class="text-sm text-slate-500 mt-1">Politikere</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        <!-- Flest skandaler per parti -->
                        <div class="border border-slate-200 rounded-3xl p-6">
                            <h4 class="font-bold text-lg mb-4">Flest skandaler per parti</h4>
                            <div class="space-y-3">
    `;

    Object.entries(partyStats)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 6)
        .forEach(([party, data]) => {
            html += `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-x-3">
                        <div class="w-4 h-4 rounded-full" style="background-color: ${data.color}"></div>
                        <span>${party}</span>
                    </div>
                    <span class="font-bold">${data.count}</span>
                </div>
            `;
        });

    html += `
                            </div>
                        </div>

                        <!-- Top støttede politikere -->
                        <div class="border border-slate-200 rounded-3xl p-6">
                            <h4 class="font-bold text-lg mb-4">Mest økonomisk støttede</h4>
                            <div class="space-y-3">
    `;

    supportRanking.slice(0, 5).forEach((p, index) => {
        html += `
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-medium">${p.name}</span>
                    <span class="text-xs text-slate-500 ml-2">(${p.party})</span>
                </div>
                <span class="font-bold text-emerald-600">${(p.amount / 1000).toFixed(0)}k kr</span>
            </div>
        `;
    });

    html += `
                            </div>
                        </div>

                        <!-- Mest brudte løfter -->
                        <div class="border border-slate-200 rounded-3xl p-6">
                            <h4 class="font-bold text-lg mb-4">Flest brudte valgløfter</h4>
                            <div class="space-y-3">
    `;

    brokenPromisesRanking.slice(0, 5).forEach(p => {
        if (p.count > 0) {
            html += `
                <div class="flex justify-between items-center">
                    <div>
                        <span class="font-medium">${p.name}</span>
                        <span class="text-xs text-slate-500 ml-2">(${p.party})</span>
                    </div>
                    <span class="font-bold">${p.count}</span>
                </div>
            `;
        }
    });

    html += `
                            </div>
                        </div>

                        <!-- Mest alvorlige skandaler -->
                        <div class="border border-slate-200 rounded-3xl p-6">
                            <h4 class="font-bold text-lg mb-4">Mest alvorlige skandaler</h4>
                            <div class="space-y-3 text-sm">
    `;

    severeScandals.slice(0, 5).forEach((s, index) => {
        html += `
            <div class="flex gap-3">
                <div class="font-bold text-[#C8102E] w-5">${index + 1}.</div>
                <div>
                    <div class="font-medium">${s.title}</div>
                    <div class="text-xs text-slate-500">${s.politician} • ${s.year}</div>
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
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

function closeStatsModal() {
    const modal = document.getElementById('statsModal');
    if (modal) modal.remove();
}