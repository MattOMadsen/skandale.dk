// js/stats-snapshot.js - Mørk, klikbar statistik i hero (klikbar partifordeling)

function renderStatsSnapshot() {
    const container = document.getElementById('stats-snapshot');
    if (!container || !window.politicians || window.politicians.length === 0) return;

    const politicians = window.politicians;

    const totalPoliticians = politicians.length;
    const totalScandals = politicians.reduce((sum, p) => sum + (p.scandals ? p.scandals.length : 0), 0);

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

    container.innerHTML = `
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-white">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold tracking-tight">Hurtig statistik</h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onclick="showStatsDetail('politicians')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985] flex flex-col justify-between min-h-[92px]">
                    <div class="text-3xl font-bold">${totalPoliticians}</div>
                    <div class="text-sm text-white/70 mt-1">Politikere</div>
                </div>

                <div onclick="showStatsDetail('scandals')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985] flex flex-col justify-between min-h-[92px]">
                    <div class="text-3xl font-bold">${totalScandals}</div>
                    <div class="text-sm text-white/70 mt-1">Skandaler i alt</div>
                </div>

                <div onclick="showStatsDetail('severity')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985] flex flex-col justify-between min-h-[92px]">
                    <div class="text-3xl font-bold">${avgSeverity}</div>
                    <div class="text-sm text-white/70 mt-1">Gennemsnitlig alvorlighed</div>
                </div>

                <div onclick="filterByTopParty('${topParty.replace(/'/g, "\\'")}')" class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.985] flex flex-col justify-center items-center text-center gap-1 min-h-[92px]">
                    <div class="text-sm md:text-base font-semibold leading-tight break-words">${topParty}</div>
                    <div class="text-sm text-white/70">Flest skandaler</div>
                </div>
            </div>
        </div>
    `;
}

function escapeStatsHtml(str) {
    return String(str)
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#39;');
}

function closeStatsDetailModal(el) {
    const overlay = el?.closest?.('.stats-detail-overlay');
    if (overlay) overlay.remove();
}

function buildStatsDetailShell(title, bodyHtml, options = {}) {
    const wide = options.wide ? ' stats-detail-panel--wide' : '';
    const footer = options.showFooter !== false ? `
        <div class="stats-detail-footer">
            <button type="button" onclick="closeStatsDetailModal(this)" class="stats-detail-btn">Luk</button>
        </div>
    ` : '';

    return `
        <div class="stats-detail-panel${wide}">
            <div class="stats-detail-header">
                <h3 class="stats-detail-title">${escapeStatsHtml(title)}</h3>
                <button type="button" onclick="closeStatsDetailModal(this)" class="stats-detail-close" aria-label="Luk">×</button>
            </div>
            <div class="stats-detail-body">${bodyHtml}</div>
            ${footer}
        </div>
    `;
}

function showStatsDetail(type) {
    document.querySelectorAll('.stats-detail-overlay').forEach(el => el.remove());

    const modal = document.createElement('div');
    modal.className = 'stats-detail-overlay';
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    let html = '';

    if (type === 'politicians') {
        const partyCount = {};
        window.politicians.forEach(p => {
            if (!partyCount[p.party]) partyCount[p.party] = 0;
            partyCount[p.party]++;
        });

        const sortedParties = Object.entries(partyCount).sort((a, b) => b[1] - a[1]);
        let list = '';
        sortedParties.forEach(([party, count]) => {
            const jsParty = party.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            list += `
                <div onclick="filterByTopParty('${jsParty}'); closeStatsDetailModal(this);" class="stats-detail-item">
                    <span class="stats-detail-item-name">${escapeStatsHtml(party)}</span>
                    <span class="stats-detail-item-value">${count} politikere</span>
                </div>
            `;
        });

        html = buildStatsDetailShell('Politikere fordelt på partier', list);
    }

    else if (type === 'scandals') {
        const sorted = [...window.politicians]
            .sort((a, b) => (b.scandals?.length || 0) - (a.scandals?.length || 0))
            .slice(0, 5);

        let list = '';
        sorted.forEach(p => {
            const count = p.scandals ? p.scandals.length : 0;
            list += `
                <div onclick="window.openPoliticianModal(${p.id}); closeStatsDetailModal(this);" class="stats-detail-item">
                    <span class="stats-detail-item-name">${escapeStatsHtml(p.name)}</span>
                    <span class="stats-detail-item-value">${count} skandaler</span>
                </div>
            `;
        });

        html = buildStatsDetailShell('Top 5 med flest skandaler', list, { wide: true, showFooter: false });
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
                <div onclick="window.openPoliticianModal(${p.id}); closeStatsDetailModal(this);" class="stats-detail-item">
                    <span class="stats-detail-item-name">${escapeStatsHtml(p.name)}</span>
                    <span class="stats-detail-item-value stats-detail-item-value--amber">${p.avg.toFixed(1)} / 5</span>
                </div>
            `;
        });

        const body = list || '<p class="stats-detail-empty">Ingen data endnu.</p>';
        html = buildStatsDetailShell('Højeste gennemsnitlige alvorlighed', body, { wide: true, showFooter: false });
    }

    modal.innerHTML = html;
    document.body.appendChild(modal);
}

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
window.showStatsDetail = showStatsDetail;
window.closeStatsDetailModal = closeStatsDetailModal;
window.filterByTopParty = filterByTopParty;