// js/stats/stats-render.js
// All rendering functions for metrics, charts, lists and filters on the stats page

function renderAll() {
    if (!politiciansData || politiciansData.length === 0) return;

    let filteredData = politiciansData;
    if (currentPartyFilter) {
        filteredData = politiciansData.filter(p => p.party === currentPartyFilter);
    }

    renderKeyMetrics(filteredData);
    renderPartyFilterBar();
    renderPartyDistribution(filteredData);
    renderTopScandalPoliticians(filteredData);
    renderSeverityDistribution(filteredData);
    renderBrokenAndDonations(filteredData);
}

function renderKeyMetrics(filteredData) {
    const container = document.getElementById('metricsGrid');
    if (!container) return;

    const totalPoliticians = filteredData.length;
    const totalScandals = filteredData.reduce((sum, p) => sum + p.scandalCount, 0);
    const avgSeverity = totalScandals > 0 
        ? (filteredData.reduce((sum, p) => sum + parseFloat(p.avgSeverity), 0) / totalPoliticians).toFixed(1) 
        : '0.0';
    const totalBroken = filteredData.reduce((sum, p) => sum + p.brokenPromiseCount, 0);
    const totalDonations = filteredData.reduce((sum, p) => sum + p.donationCount, 0);

    container.innerHTML = `
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Politikere</div>
                    <div class="metric-value text-red-600">${totalPoliticians}</div>
                </div>
                <div class="w-12 h-12 bg-red-100 dark:bg-red-950 text-red-600 rounded-2xl flex items-center justify-center">
                    <i class="fa-solid fa-users text-2xl"></i>
                </div>
            </div>
        </div>
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Skandaler i alt</div>
                    <div class="metric-value text-red-600">${totalScandals}</div>
                </div>
                <div class="w-12 h-12 bg-red-100 dark:bg-red-950 text-red-600 rounded-2xl flex items-center justify-center">
                    <i class="fa-solid fa-exclamation-triangle text-2xl"></i>
                </div>
            </div>
        </div>
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Gns. alvorlighed</div>
                    <div class="metric-value text-red-600">${avgSeverity}</div>
                </div>
                <div class="w-12 h-12 bg-red-100 dark:bg-red-950 text-red-600 rounded-2xl flex items-center justify-center">
                    <i class="fa-solid fa-chart-line text-2xl"></i>
                </div>
            </div>
        </div>
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Brudte løfter</div>
                    <div class="metric-value text-red-600">${totalBroken}</div>
                </div>
                <div class="w-12 h-12 bg-red-100 dark:bg-red-950 text-red-600 rounded-2xl flex items-center justify-center">
                    <i class="fa-solid fa-handshake text-2xl"></i>
                </div>
            </div>
        </div>
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Donationer</div>
                    <div class="metric-value text-red-600">${totalDonations}</div>
                </div>
                <div class="w-12 h-12 bg-red-100 dark:bg-red-950 text-red-600 rounded-2xl flex items-center justify-center">
                    <i class="fa-solid fa-coins text-2xl"></i>
                </div>
            </div>
        </div>
    `;
}

function renderPartyFilterBar() {
    const container = document.getElementById('partyFilterBar');
    if (!container) return;

    const parties = [...new Set(politiciansData.map(p => p.party))].sort();

    container.innerHTML = parties.map(party => {
        const isActive = currentPartyFilter === party;
        const count = politiciansData.filter(p => p.party === party).length;
        return `
            <button onclick="filterByParty('${party}')"
                    class="party-badge px-4 py-2 rounded-2xl text-sm font-medium transition-all ${isActive ? 'active bg-red-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
                ${party} <span class="opacity-70">(${count})</span>
            </button>
        `;
    }).join('');
}

function renderPartyDistribution(filteredData) {
    const container = document.getElementById('partyDistribution');
    if (!container) return;

    const partyStats = {};
    filteredData.forEach(p => {
        if (!partyStats[p.party]) {
            partyStats[p.party] = { count: 0, color: p.color };
        }
        partyStats[p.party].count += p.scandalCount;
    });

    const sorted = Object.entries(partyStats).sort((a, b) => b[1].count - a[1].count);

    container.innerHTML = sorted.map(([party, data]) => {
        const maxCount = Math.max(...sorted.map(s => s[1].count));
        const width = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
        return `
            <div class="flex items-center gap-x-3">
                <div class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${data.color}"></div>
                <div class="flex-1">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="font-medium">${party}</span>
                        <span class="font-bold">${data.count}</span>
                    </div>
                    <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="bar h-2 rounded-full" style="width: ${width}%; background-color: ${data.color}"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTopScandalPoliticians(filteredData) {
    const container = document.getElementById('topScandalPoliticians');
    if (!container) return;

    const sorted = [...filteredData].sort((a, b) => b.scandalCount - a.scandalCount).slice(0, 5);

    container.innerHTML = sorted.map((p, index) => `
        <div onclick="showPoliticianModal('${p.slug}')" 
             class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-all group">
            <div class="flex items-center gap-x-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-110" style="background-color: ${p.color}">
                    ${p.partyShort}
                </div>
                <div>
                    <div class="font-semibold group-hover:text-red-600 transition-colors">${p.name}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">${p.party}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="font-bold text-lg text-red-600">${p.scandalCount}</div>
                <div class="text-[10px] text-gray-500 -mt-1">skandaler</div>
            </div>
        </div>
    `).join('');
}

function renderSeverityDistribution(filteredData) {
    const container = document.getElementById('severityDistribution');
    if (!container) return;

    const totalSev = {1:0, 2:0, 3:0, 4:0, 5:0};
    filteredData.forEach(p => {
        Object.keys(totalSev).forEach(sev => {
            totalSev[sev] += p.severityCounts[sev] || 0;
        });
    });

    const labels = {1: 'Meget lav', 2: 'Lav', 3: 'Middel', 4: 'Høj', 5: 'Meget høj'};
    const colors = {1: '#22c55e', 2: '#eab308', 3: '#f97316', 4: '#ef4444', 5: '#b91c1c'};

    container.innerHTML = Object.keys(totalSev).map(sev => {
        const count = totalSev[sev];
        const max = Math.max(...Object.values(totalSev));
        const width = max > 0 ? (count / max) * 100 : 0;
        return `
            <div class="flex items-center gap-x-3">
                <div class="w-16 text-sm text-right text-gray-600 dark:text-gray-400">${labels[sev]}</div>
                <div class="flex-1">
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="bar h-3 rounded-full" style="width: ${width}%; background-color: ${colors[sev]}"></div>
                    </div>
                </div>
                <div class="w-8 text-right font-bold text-sm">${count}</div>
            </div>
        `;
    }).join('');
}

function renderBrokenAndDonations(filteredData) {
    const container = document.getElementById('brokenAndDonations');
    if (!container) return;

    const sortedBroken = [...filteredData].sort((a, b) => b.brokenPromiseCount - a.brokenPromiseCount).slice(0, 4);
    const sortedDonations = [...filteredData].sort((a, b) => b.donationCount - a.donationCount).slice(0, 4);

    container.innerHTML = `
        <div>
            <div class="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Flest brudte løfter</div>
            ${sortedBroken.map(p => `
                <div class="flex justify-between items-center py-1 text-sm">
                    <span>${p.name}</span>
                    <span class="font-bold">${p.brokenPromiseCount}</span>
                </div>
            `).join('')}
        </div>
        <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div class="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Flest økonomiske donationer</div>
            ${sortedDonations.map(p => `
                <div class="flex justify-between items-center py-1 text-sm">
                    <span>${p.name}</span>
                    <span class="font-bold">${p.donationCount}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Global modal function - connects to the project's main modal system
window.showPoliticianModal = function(slug) {
    // This should call the existing modal from the rest of the project
    if (typeof window.openPoliticianModal === 'function') {
        window.openPoliticianModal(slug);
    } else if (typeof window.showModal === 'function') {
        window.showModal(slug);
    } else {
        // Fallback if no global modal function is found
        console.warn('Modal function not found for slug:', slug);
        alert('Åbner detaljer for: ' + slug + '\n\n(Modal-integration fuldføres i næste trin)');
    }
};

// Make renderAll available globally for filters
window.renderAll = renderAll;