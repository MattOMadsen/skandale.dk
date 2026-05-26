// js/stats-snapshot.js - Statistik snapshot på forsiden

function renderStatsSnapshot() {
    const container = document.getElementById('stats-snapshot');
    if (!container || !window.politicians || window.politicians.length === 0) return;

    const politicians = window.politicians;

    // === Beregninger ===
    const totalPoliticians = politicians.length;

    const totalScandals = politicians.reduce((sum, p) => {
        return sum + (p.scandals ? p.scandals.length : 0);
    }, 0);

    // Gennemsnitlig alvorlighed
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

    const avgSeverity = severityCount > 0 
        ? (totalSeverity / severityCount).toFixed(1) 
        : '—';

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

    // === Render HTML ===
    container.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-3xl p-8 mb-8">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold tracking-tight">Hurtig statistik</h3>
                <span class="text-xs text-slate-400">Baseret på aktuelle data</span>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
                <div>
                    <div class="text-4xl font-bold text-[#C8102E]">${totalPoliticians}</div>
                    <div class="text-sm text-slate-500 mt-1">Politikere</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-[#C8102E]">${totalScandals}</div>
                    <div class="text-sm text-slate-500 mt-1">Skandaler i alt</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-[#C8102E]">${avgSeverity}</div>
                    <div class="text-sm text-slate-500 mt-1">Gennemsnitlig alvorlighed</div>
                </div>
                <div>
                    <div class="text-lg font-semibold leading-tight">${topParty}</div>
                    <div class="text-sm text-slate-500 mt-1">Flest skandaler</div>
                </div>
            </div>
        </div>
    `;
}

// Gør funktionen tilgængelig globalt
window.renderStatsSnapshot = renderStatsSnapshot;