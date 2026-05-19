// js/modal-network-overview.js - Oversigt over internationale netværk & overlap

function showNetworkOverviewModal() {
    if (!window.networkIndex || Object.keys(window.networkIndex).length === 0) {
        alert('Ingen netværksdata tilgængelig endnu. Prøv igen senere.');
        return;
    }

    const networks = Object.entries(window.networkIndex)
        .map(([name, politicians]) => ({
            name: name,
            count: politicians.length,
            politicians: politicians
        }))
        .sort((a, b) => b.count - a.count);

    let html = `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4" id="networkOverviewModal">
            <div onclick="event.target.id === 'networkOverviewModal' && closeNetworkOverviewModal()" 
                 class="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl">
                
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight">Internationale Netværk & Overlap</h3>
                        <p class="text-slate-500 mt-1">Hvilke politikere har været tilknyttet de samme netværk?</p>
                    </div>
                    <button onclick="closeNetworkOverviewModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                
                <div class="p-8 overflow-y-auto max-h-[calc(92vh-140px)]">
                    <div class="space-y-3">
    `;

    networks.forEach(network => {
        const safeName = network.name.replace(/'/g, "\\'");
        html += `
            <div onclick="event.stopImmediatePropagation(); closeNetworkOverviewModal(); setTimeout(() => { showNetworkConnections('${safeName}'); }, 50)" 
                 class="flex items-center justify-between p-5 bg-slate-50 border border-slate-200 hover:border-[#C8102E]/40 rounded-2xl cursor-pointer transition-all">
                
                <div>
                    <div class="font-semibold text-lg">${network.name}</div>
                    <div class="text-sm text-slate-500">${network.count} politikere har været tilknyttet dette netværk</div>
                </div>
                
                <div class="text-right">
                    <div class="text-2xl font-bold text-[#C8102E]">${network.count}</div>
                    <div class="text-xs text-slate-400">Se overlap →</div>
                </div>
            </div>
        `;
    });

    html += `
                    </div>
                </div>
                
                <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-400 text-center">
                    Klik på et netværk for at se hvilke politikere der har været tilknyttet det
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

function closeNetworkOverviewModal() {
    const modal = document.getElementById('networkOverviewModal');
    if (modal) modal.remove();
}

window.showNetworkOverviewModal = showNetworkOverviewModal;