// js/stats-snapshot.js - Mørk, klikbar statistik i hero (Partifordeling i Politikere-modal)

function renderStatsSnapshot() {
    const container = document.getElementById('stats-snapshot');
    if (!container || !window.politicians || window.politicians.length === 0) return;

    const politicians = window.politicians;

    // === Beregninger ===
    const totalPoliticians = politicians.length;

    const totalScandals = politicians.reduce((sum, p) => sum + (p.scandals ? p.scandals.length : 0), 0);

    // Gennemsnitlig alvorlighed (global)
    let totalSeverity = 0;
    let severityCount = 0;

    politicians.forEach(p => {
        if (p.scandals && p.scandals.length > 0) {
            p.scandals.forEach(s => {
                const sev = s.ourSeverity || s.severity || 0;
                if (sev > 0) {
                    totalSeverity += sev;
                    severityCount++;
                }
            });
        }
    });

    const avgSeverity = severityCount > 0 ? (totalSeverity / severityCount).toFixed(1) : '—';

    // Parti med flest skandaler
    const partyStats = {};
    politicians.forEach(p => {
        if (!partyStats[p.party]) partyStats[p.party] = 0;
        partyStats[p.party] += (p.scandals ? p.scandals.length : 0);
    });

    let topParty = '';
    let maxScandals = 0;
    Object.keys(partyStats).forEach(party => {
        if (partyStats[party] > maxScandals) {
            maxScandals = partyStats[party];
            topParty = party;
        }
    });

    // === MØRK VERSION ===
    container.innerHTML = `
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-white">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold tracking-tight">Hurtig statistik</h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onclick="showStatsDetail('politicians')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985]">
                    <div class="text-3xl font-bold">${totalPoliticians}</div>
                    <div class="text-sm text-white/70 mt-1">Politikere</div>
                </div>

                <div onclick="showStatsDetail('scandals')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985]">
                    <div class="text-3xl font-bold">${totalScandals}</div>
                    <div class="text-sm text-white/70 mt-1">Skandaler i alt</div>
                </div>

                <div onclick="showStatsDetail('severity')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985]">
                    <div class="text-3xl font-bold">${avgSeverity}</div>
                    <div class="text-sm text-white/70 mt-1">Gennemsnitlig alvorlighed</div>
                </div>

                <div onclick="filterByTopParty('${topParty}')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985]">
                    <div class="text-lg font-semibold leading-tight">${topParty}</div>
                    <div class="text-sm text-white/70 mt-1">Flest skandaler</div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// Forbedrede modals (inkl. Partifordeling)
// ============================================

function showStatsDetail(type) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4';

    let html = '';

    if (type === 'politicians') {
        // === PARTIFORDELING ===
        const partyCount = {};
        window.politicians.forEach(p => {
            if (!partyCount[p.party]) partyCount[p.party] = 0;
            partyCount[p.party]++;
        });

        // Sorter efter antal (højest først)
        const sortedParties = Object.entries(partyCount).sort((a, b) => b[1] - a[1]);

        let list = '';
        sortedParties.forEach(([party, count]) => {
            list += `
                <div class="flex justify-between items-center p-3 border border-slate-200 rounded-2xl mb-2">
                    <span class="font-medium">${party}</span>
                    <span class="text-sm font-bold text-[#C8102E]">${count} politikere</span>
                </div>
            `;
        });

        html = `
            <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl">
                <div class="px-6 pt-6 pb-4 border-b flex justify-between">
                    <h3 class="text-xl font-bold">Politikere fordelt på partier</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                <div class="p-6 max-h-[60vh] overflow-y-auto">
                    ${list}
                </div>
                <div class="px-6 py-4 border-t flex justify-end">
                    <button onclick="this.closest('.fixed').remove()" class="px-5 py-2 text-sm bg-slate-900 text-white rounded-2xl hover:bg-black transition-colors">
                        Luk
                    </button>
                </div>
            </div>
        `;
    }

    else if (type === 'scandals') {
        const sorted = [...window.politicians].sort((a, b) => (b.scandals?.length || 0) - (a.scandals?.length || 0)).slice(0, 5);

        let list = '';
        sorted.forEach(p => {
            const count = p.scandals ? p.scandals.length : 0;
            list += `
                <div onclick="window.openPoliticianModal(${p.id}); this.closest('.fixed').remove();" 
                     class="flex justify-between items-center p-3 border border-slate-200 rounded-2xl mb-2 hover:border-[#C8102E]/30 cursor-pointer">
                    <span class="font-medium">${p.name}</span>
                    <span class="text-sm font-bold text-[#C8102E]">${count} skandaler</span>
                </div>
            `;
        });

        html = `
            <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
                <div class="px-6 pt-6 pb-4 border-b flex justify-between">
                    <h3 class="text-xl font-bold">Top 5 med flest skandaler</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                <div class="p-6">${list}</div>
            </div>
        `;
    }

    else if (type === 'severity') {
        const withAvg = window.politicians.map(p => {
            if (!p.scandals || p.scandals.length === 0) return { ...p, avg: 0 };
            const sum = p.scandals.reduce((s, sc) => s + (sc.ourSeverity || sc.severity || 0), 0);
            return { ...p, avg: sum / p.scandals.length };
        }).sort((a, b) => b.avg - a.avg).slice(0, 6);

        let list = '';
        withAvg.forEach(p => {
            if (p.avg === 0) return;
            list += `
                <div onclick="window.openPoliticianModal(${p.id}); this.closest('.fixed').remove();" 
                     class="flex justify-between items-center p-3 border border-slate-200 rounded-2xl mb-2 hover:border-[#C8102E]/30 cursor-pointer">
                    <span class="font-medium">${p.name}</span>
                    <span class="text-sm font-bold text-amber-600">${p.avg.toFixed(1)} / 5</span>
                </div>
            `;
        });

        html = `
            <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl">
                <div class="px-6 pt-6 pb-4 border-b flex justify-between">
                    <h3 class="text-xl font-bold">Højeste gennemsnitlige alvorlighed</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                <div class="p-6">${list || '<p>Ingen data endnu.</p>'}</div>
            </div>
        `;
    }

    modal.innerHTML = html;
    document.body.appendChild(modal);
}

// Filtrer side til parti med flest skandaler
function filterByTopParty(party) {
    if (!party || !window.politicians) return;

    if (typeof currentPartyFilter !== 'undefined') currentPartyFilter = party;

    const filtered = window.politicians.filter(p => p.party === party);
    if (typeof window.renderPoliticians === 'function') window.renderPoliticians(filtered);

    const countEl = document.getElementById('politician-count');
    if (countEl) countEl.textContent = `${filtered.length} politikere`;

    const grid = document.getElementById('politiciansGrid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.renderStatsSnapshot = renderStatsSnapshot;