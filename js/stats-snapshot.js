// js/stats-snapshot.js - Mørk, klikbar statistik i hero

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

    // === MØRK VERSION TIL HERO ===
    container.innerHTML = `
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-white">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold tracking-tight">Hurtig statistik</h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <!-- Politikere -->
                <div onclick="showStatsDetail('politicians')" 
                     class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985]">
                    <div class="text-3xl font-bold">${totalPoliticians}</div>
                    <div class="text-sm text-white/70 mt-1">Politikere</div>
                </div>

                <!-- Skandaler -->
                <div onclick="showStatsDetail('scandals')" 
                     class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985]">
                    <div class="text-3xl font-bold">${totalScandals}</div>
                    <div class="text-sm text-white/70 mt-1">Skandaler i alt</div>
                </div>

                <!-- Gennemsnit -->
                <div onclick="showStatsDetail('severity')" 
                     class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985]">
                    <div class="text-3xl font-bold">${avgSeverity}</div>
                    <div class="text-sm text-white/70 mt-1">Gennemsnitlig alvorlighed</div>
                </div>

                <!-- Flest skandaler (klikbar) -->
                <div onclick="filterByTopParty('${topParty}')" 
                     class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985]">
                    <div class="text-lg font-semibold leading-tight">${topParty}</div>
                    <div class="text-sm text-white/70 mt-1">Flest skandaler</div>
                </div>

            </div>
        </div>
    `;
}

// ============================================
// Klik-håndtering
// ============================================

function filterByTopParty(party) {
    if (!party || !window.politicians) return;

    // Sæt parti-filteret
    if (typeof currentPartyFilter !== 'undefined') {
        currentPartyFilter = party;
    }

    // Filtrer visningen
    const filtered = window.politicians.filter(p => p.party === party);
    
    if (typeof window.renderPoliticians === 'function') {
        window.renderPoliticians(filtered);
    }

    // Opdater tæller
    const countEl = document.getElementById('politician-count');
    if (countEl) countEl.textContent = `${filtered.length} politikere`;

    // Scroll ned til politikerne
    const grid = document.getElementById('politiciansGrid');
    if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showStatsDetail(type) {
    let title = '';
    let content = '';

    if (type === 'politicians') {
        title = 'Politikere på platformen';
        content = `Der er i øjeblikket <strong>${window.politicians.length}</strong> politikere med data på Skandale.dk.`;
    } 
    else if (type === 'scandals') {
        const total = window.politicians.reduce((sum, p) => sum + (p.scandals?.length || 0), 0);
        title = 'Samlet antal skandaler';
        content = `Der er registreret i alt <strong>${total}</strong> skandaler på tværs af alle politikere.`;
    } 
    else if (type === 'severity') {
        title = 'Gennemsnitlig alvorlighed';
        content = `Den gennemsnitlige alvorlighed på tværs af alle skandaler er <strong>${document.querySelector('#stats-snapshot .text-3xl')?.innerText || '—'}</strong>.`;
    }

    // Opret modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div class="px-6 pt-6 pb-4 border-b flex justify-between items-center">
                <h3 class="text-xl font-bold">${title}</h3>
                <button class="text-3xl leading-none text-slate-400 hover:text-slate-600" onclick="this.closest('.fixed').remove()">×</button>
            </div>
            <div class="p-6 text-slate-600">
                ${content}
            </div>
            <div class="px-6 py-4 border-t flex justify-end">
                <button onclick="this.closest('.fixed').remove()" 
                        class="px-5 py-2 text-sm bg-slate-900 text-white rounded-2xl hover:bg-black transition-colors">
                    Luk
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

window.renderStatsSnapshot = renderStatsSnapshot;