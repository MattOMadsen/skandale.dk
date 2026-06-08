// js/modal-network-overview.js - Oversigt over internationale netværk & overlap (fixed v2)

async function showNetworkOverviewModal() {
    if (typeof window.ensureAllDetailsLoaded === 'function') {
        await window.ensureAllDetailsLoaded();
    }

    if (!window.networkIndex || Object.keys(window.networkIndex).length === 0) {
        alert('Ingen netværksdata tilgængelig endnu. Prøv igen senere.');
        return;
    }

    const networks = Object.entries(window.networkIndex)
        .map(([name, pols]) => ({
            name,
            count: pols.length,
            politicians: pols
        }))
        .sort((a, b) => b.count - a.count);

    let html = `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4" id="networkOverviewModal">
            <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl">
                
                <div class="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Internationale Netværk & Overlap</h3>
                        <p class="text-slate-500 dark:text-slate-400 mt-1">Klik på et netværk for at se hvilke politikere der har været tilknyttet det</p>
                    </div>
                    <button onclick="closeNetworkOverviewModal()" class="text-3xl text-slate-400 hover:text-slate-600 dark:hover:text-white">×</button>
                </div>
                
                <div class="p-8 overflow-y-auto max-h-[calc(92vh-140px)]">
                    <div class="space-y-3">
    `;

    networks.forEach(network => {
        const safeName = network.name.replace(/'/g, "\\'");
        html += `
            <div onclick="event.stopImmediatePropagation(); showNetworkDetail('${safeName}')" 
                 class="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:border-[#C8102E]/40 rounded-2xl cursor-pointer transition-all">
                
                <div class="flex-1">
                    <div class="font-semibold text-lg text-slate-900 dark:text-white">${network.name}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">${network.count} politikere</div>
                </div>
                
                <div class="text-right pr-2">
                    <div class="text-2xl font-bold text-[#C8102E]">${network.count}</div>
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

async function showNetworkDetail(networkName) {
    if (typeof window.ensureAllDetailsLoaded === 'function') {
        await window.ensureAllDetailsLoaded();
    }

    const politiciansInNetwork = typeof window.findPoliticiansByNetwork === 'function'
        ? window.findPoliticiansByNetwork(networkName)
        : (window.networkIndex[networkName] || []);

    let listHTML = '';
    if (politiciansInNetwork.length > 0) {
        listHTML = politiciansInNetwork.map(p => `
            <div onclick="closeNetworkDetailModal(); showPoliticianModal(${p.id})" 
                 class="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-[#C8102E]/30 cursor-pointer mb-2">
                <div>
                    <div class="font-semibold text-slate-900 dark:text-white">${p.name}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">${p.party}</div>
                </div>
                <div class="text-xs text-slate-400">${p.year || ''} ${p.role ? '• ' + p.role : ''}</div>
            </div>
        `).join('');
    } else {
        listHTML = '<p class="text-slate-500">Ingen politikere fundet.</p>';
    }

    const detailHTML = `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[160] flex items-center justify-center p-4" id="networkDetailModal">
            <div onclick="event.target.id === 'networkDetailModal' && closeNetworkDetailModal()" class="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl">
                <div class="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${networkName}</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400">${politiciansInNetwork.length} politikere har været tilknyttet dette netværk</p>
                    </div>
                    <button onclick="closeNetworkDetailModal()" class="text-3xl text-slate-400 hover:text-slate-600 dark:hover:text-white">×</button>
                </div>
                <div class="p-8 max-h-[60vh] overflow-y-auto">
                    ${listHTML}
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', detailHTML);
}

function closeNetworkOverviewModal() {
    const m = document.getElementById('networkOverviewModal');
    if (m) m.remove();
}

function closeNetworkDetailModal() {
    const m = document.getElementById('networkDetailModal');
    if (m) m.remove();
}

window.showNetworkOverviewModal = showNetworkOverviewModal;