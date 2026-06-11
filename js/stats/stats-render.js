// js/stats/stats-render.js
// All rendering functions for stats page (metrics, charts, lists etc.)

function renderKeyMetrics(data) {
    const grid = document.getElementById('metricsGrid');
    if (!grid) return;

    const totalPoliticians = data.length;
    const totalScandals = data.reduce((sum, p) => sum + p.scandalCount, 0);
    const totalBrokenPromises = data.reduce((sum, p) => sum + p.brokenPromiseCount, 0);
    const avgSeverity = data.reduce((sum, p) => sum + parseFloat(p.avgSeverity || 0), 0) / (data.length || 1);

    grid.innerHTML = `
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Politikere</p>
                    <p class="text-4xl font-bold text-gray-900 dark:text-white">${totalPoliticians}</p>
                </div>
                <i class="fa-solid fa-users text-4xl text-blue-500"></i>
            </div>
        </div>
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Skandaler i alt</p>
                    <p class="text-4xl font-bold text-red-600">${totalScandals}</p>
                </div>
                <i class="fa-solid fa-exclamation-triangle text-4xl text-red-500"></i>
            </div>
        </div>
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Brudte løfter</p>
                    <p class="text-4xl font-bold text-amber-600">${totalBrokenPromises}</p>
                </div>
                <i class="fa-solid fa-handshake-slash text-4xl text-amber-500"></i>
            </div>
        </div>
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Gennemsnitlig alvor</p>
                    <p class="text-4xl font-bold text-gray-900 dark:text-white">${avgSeverity.toFixed(1)}</p>
                </div>
                <i class="fa-solid fa-scale-balanced text-4xl text-purple-500"></i>
            </div>
        </div>
    `;
}

function renderPartyDistribution(data) {
    const container = document.getElementById('partyDistribution');
    if (!container) return;

    const byParty = {};
    data.forEach(p => {
        if (!byParty[p.party]) byParty[p.party] = { count: 0, color: p.color };
        byParty[p.party].count++;
    });

    let html = '';
    Object.keys(byParty).forEach(party => {
        const pct = Math.round((byParty[party].count / data.length) * 100) || 0;
        html += `
            <div class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                    <span>${party}</span>
                    <span class="font-medium">${byParty[party].count}</span>
                </div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" style="width: ${pct}%; background-color: ${byParty[party].color}"></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderTop5Scandals(data) {
    const container = document.getElementById('topScandals');
    if (!container) return;

    const sorted = [...data].sort((a,b) => b.scandalCount - a.scandalCount).slice(0, 5);

    let html = '';
    sorted.forEach(p => {
        html += `
            <div onclick="openStatsPoliticianModal(${p.id})" class="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl cursor-pointer transition-colors">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold" style="background-color: ${p.color}">
                        ${p.partyShort}
                    </div>
                    <div>
                        <p class="font-semibold">${p.name}</p>
                        <p class="text-sm text-gray-500">${p.party}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-red-600">${p.scandalCount}</p>
                    <p class="text-xs text-gray-400">skandaler</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderAll() {
    if (!politiciansData || politiciansData.length === 0) return;

    let filteredData = politiciansData;
    if (currentPartyFilter) {
        filteredData = politiciansData.filter(p => p.party === currentPartyFilter);
    }

    renderKeyMetrics(filteredData);
    renderPartyDistribution(filteredData);
    renderTop5Scandals(filteredData);

    renderSeverityDistribution(filteredData);
}

function renderSeverityDistribution(data) {
    const container = document.getElementById('severityDistribution');
    if (!container) return;

    const totals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach(p => {
        Object.keys(totals).forEach(level => {
            totals[level] += p.severityCounts?.[level] || 0;
        });
    });

    const max = Math.max(...Object.values(totals), 1);
    const labels = { 1: 'Meget lav', 2: 'Lav', 3: 'Middel', 4: 'Høj', 5: 'Meget høj' };
    const colors = { 1: '#94a3b8', 2: '#fbbf24', 3: '#f97316', 4: '#ef4444', 5: '#991b1b' };

    let html = '<div class="space-y-3">';
    [5, 4, 3, 2, 1].forEach(level => {
        const count = totals[level];
        const pct = Math.round((count / max) * 100);
        html += `
            <div>
                <div class="flex justify-between text-sm mb-1">
                    <span>${level} — ${labels[level]}</span>
                    <span class="font-medium">${count}</span>
                </div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all" style="width:${pct}%;background-color:${colors[level]}"></div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

async function openStatsPoliticianModal(politicianId) {
    if (!politicianId) return;

    if ((!window.politicians || window.politicians.length === 0) && typeof loadPoliticians === 'function') {
        try {
            await loadPoliticians();
        } catch (e) {
            console.error('[stats] Fejl ved loadPoliticians:', e);
        }
    }

    if (typeof window.showPoliticianModal === 'function') {
        const politician = window.politicians?.find(p => p.id == politicianId);
        if (politician && !politician._detailsLoaded && typeof window.loadPoliticianDetails === 'function') {
            await window.loadPoliticianDetails(politician);
        }
        window.showPoliticianModal(politicianId);
        return;
    }

    const entry = politiciansData.find(p => p.id == politicianId);
    const slug = entry?.slug;
    window.location.href = slug ? `index.html?politician=${slug}` : 'index.html';
}

window.renderAll = renderAll;
window.openStatsPoliticianModal = openStatsPoliticianModal;