// js/timeline.js - Tidslinje (robust + proaktiv data loading + selvforsynende modal-struktur)

let allScandals = [];
let currentScandals = [];
let timelineLoadAttempts = 0;
const MAX_TIMELINE_ATTEMPTS = 4;

function createStars(severity) {
    let html = '';
    const num = parseInt(severity) || 0;
    for (let i = 1; i <= 5; i++) {
        if (i <= num) {
            html += '<i class="fa-solid fa-star text-yellow-400"></i>';
        } else {
            html += '<i class="fa-regular fa-star text-slate-300"></i>';
        }
    }
    return html;
}

async function showTimeline() {
    const modal = document.getElementById('timelineModal');
    if (!modal) {
        console.error('[Skandale.dk] #timelineModal findes ikke i DOM!');
        return;
    }

    // === NY ROBUSTHED: Dynamisk opbygning af indre struktur hvis #timelineContent mangler ===
    // Dette gør timeline.js selvforsynende og løser den tomme/gennemsigtige boks
    if (!document.getElementById('timelineContent')) {
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                <!-- Header -->
                <div class="flex items-center justify-between px-6 py-5 border-b">
                    <div>
                        <h2 class="text-2xl font-bold tracking-tight">Tidslinje over politiske skandaler</h2>
                        <p class="text-sm text-slate-500 mt-0.5">Filtrer efter parti og alvorlighed – klik på en sag for at se detaljer</p>
                    </div>
                    <button onclick="closeTimeline()" 
                            class="w-10 h-10 flex items-center justify-center text-3xl text-slate-400 hover:text-slate-600 transition-colors">
                        &times;
                    </button>
                </div>

                <!-- Filtre -->
                <div class="px-6 py-4 border-b bg-slate-50 flex flex-wrap items-end gap-4">
                    <div class="flex-1 min-w-[180px]">
                        <label class="block text-xs font-medium text-slate-500 mb-1.5">Parti</label>
                        <select id="filterParty" onchange="filterTimeline()" 
                                class="w-full border border-slate-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30">
                            <option value="">Alle partier</option>
                        </select>
                    </div>
                    <div class="flex-1 min-w-[180px]">
                        <label class="block text-xs font-medium text-slate-500 mb-1.5">Minimum alvorlighed</label>
                        <select id="filterSeverity" onchange="filterTimeline()" 
                                class="w-full border border-slate-300 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30">
                            <option value="">Alle niveauer</option>
                            <option value="1">1+ stjerner</option>
                            <option value="2">2+ stjerner</option>
                            <option value="3">3+ stjerner</option>
                            <option value="4">4+ stjerner</option>
                            <option value="5">5 stjerner</option>
                        </select>
                    </div>
                    <div>
                        <button onclick="resetTimelineFilters()" 
                                class="px-5 py-2.5 text-sm font-medium border border-slate-300 hover:bg-white rounded-2xl transition-colors">
                            Nulstil filtre
                        </button>
                    </div>
                </div>

                <!-- Indhold -->
                <div id="timelineContent" class="flex-1 overflow-auto p-6 space-y-3 bg-white">
                    <!-- Indhold indsættes dynamisk af renderTimeline() -->
                </div>

                <!-- Footer -->
                <div class="px-6 py-4 border-t text-xs text-slate-400 flex items-center justify-between">
                    <div>Klik på en sag for at åbne politikeren</div>
                    <div class="font-mono">Skandale.dk</div>
                </div>
            </div>
        `;
        console.log('%c[Skandale.dk] Dynamisk timeline-modal-struktur opbygget', 'color:#10b981');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const contentContainer = document.getElementById('timelineContent');
    if (contentContainer) {
        contentContainer.innerHTML = `
            <div class="flex items-center justify-center py-12">
                <div class="text-center">
                    <i class="fa-solid fa-spinner fa-spin text-3xl text-[#C8102E] mb-4"></i>
                    <p class="text-slate-500">Indlæser tidslinje...</p>
                </div>
            </div>
        `;
    }

    allScandals = [];
    timelineLoadAttempts = 0;

    if (typeof politicians === 'undefined' || !politicians.length) {
        // Fallback til window.politicians for kompatibilitet
        if (typeof window.politicians !== 'undefined' && window.politicians.length) {
            window.politicians.forEach(p => { /* midlertidig reference */ });
        } else {
            console.warn('[Skandale.dk] politicians ikke loaded endnu');
            if (contentContainer) contentContainer.innerHTML = '<p class="text-slate-500 text-center py-8">Data ikke klar endnu. Prøv igen om lidt.</p>';
            return;
        }
    }

    // Først: Prøv at samle eksisterende data
    collectScandalsFromPoliticians();

    // Hvis ingen skandaler, så load detaljer proaktivt for alle der mangler det
    if (allScandals.length === 0) {
        console.log('[Skandale.dk] Ingen skandaler fundet - loader detaljer for alle politikere...');
        
        const loadPromises = (typeof politicians !== 'undefined' ? politicians : window.politicians || []).map(async (p) => {
            if (!p._detailsLoaded && typeof window.loadPoliticianDetails === 'function') {
                try {
                    await window.loadPoliticianDetails(p);
                } catch (e) {
                    console.warn('Kunne ikke loade detaljer for', p.name);
                }
            }
        });

        await Promise.all(loadPromises);

        // Saml igen efter loading
        collectScandalsFromPoliticians();
    }

    // Hvis stadig ingen skandaler efter proaktiv loading
    if (allScandals.length === 0) {
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="text-center py-12 px-6">
                    <p class="text-slate-500 mb-2">Ingen skandaler fundet til tidslinjen.</p>
                    <p class="text-sm text-slate-400">Det kan skyldes at data endnu ikke er fuldt indlæst.</p>
                </div>
            `;
        }
        return;
    }

    // Sorter nyeste først
    allScandals.sort((a, b) => {
        const yearA = a.year || '0';
        const yearB = b.year || '0';
        return yearB.localeCompare(yearA);
    });

    currentScandals = [...allScandals];

    // Opbyg parti filter
    const partySelect = document.getElementById('filterParty');
    if (partySelect) {
        partySelect.innerHTML = '<option value="">Alle partier</option>';
        const uniqueParties = [...new Set(allScandals.map(s => s.party))].sort();
        uniqueParties.forEach(party => {
            const option = document.createElement('option');
            option.value = party;
            option.textContent = party;
            partySelect.appendChild(option);
        });
    }

    renderTimeline(allScandals);
}

function collectScandalsFromPoliticians() {
    allScandals = [];
    const pols = (typeof politicians !== 'undefined' && politicians.length) ? politicians : (window.politicians || []);
    pols.forEach(politician => {
        if (politician.scandals && Array.isArray(politician.scandals) && politician.scandals.length > 0) {
            politician.scandals.forEach(scandal => {
                allScandals.push({
                    ...scandal,
                    politicianName: politician.name,
                    politicianId: politician.id,
                    party: politician.party,
                    partyColor: politician.partyColor || '#64748b'
                });
            });
        }
    });
}

window.showTimelineModal = showTimeline;
window.filterTimeline = filterTimeline;
window.resetTimelineFilters = resetTimelineFilters;
window.closeTimeline = closeTimeline;

function renderTimeline(scandalsToShow) {
    const container = document.getElementById('timelineContent');
    if (!container) return;

    container.innerHTML = '';

    if (!scandalsToShow || scandalsToShow.length === 0) {
        container.innerHTML = '<p class="text-slate-500 text-center py-8">Ingen skandaler matcher filtrene.</p>';
        return;
    }

    scandalsToShow.forEach(scandal => {
        const entryHTML = `
            <div onclick="showPoliticianModal(${scandal.politicianId}); closeTimeline();" 
                 class="flex gap-4 p-5 border border-slate-200 rounded-2xl hover:border-[#C8102E]/30 cursor-pointer group transition-all">
                <div class="w-16 text-center flex-shrink-0">
                    <div class="text-xl font-bold text-[#C8102E]">${scandal.year}</div>
                    <div class="flex justify-center mt-1">${createStars(scandal.severity)}</div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-x-3">
                        <span class="font-bold text-lg group-hover:text-[#C8102E]">${scandal.title}</span>
                        <span class="text-xs px-2 py-0.5 rounded-full" style="background-color: ${scandal.partyColor}20; color: ${scandal.partyColor}">
                            ${scandal.politicianName}
                        </span>
                    </div>
                    <div class="text-sm text-slate-600 mt-1 line-clamp-2">${scandal.shortDesc}</div>
                </div>
                <div class="flex items-center text-slate-400 group-hover:text-[#C8102E]">
                    <i class="fa-solid fa-arrow-right"></i>
                </div>
            </div>
        `;
        container.innerHTML += entryHTML;
    });
}

function filterTimeline() {
    const partySelect = document.getElementById('filterParty');
    const severitySelect = document.getElementById('filterSeverity');
    
    if (!partySelect || !severitySelect) return;

    const party = partySelect.value;
    const severityStr = severitySelect.value;
    const minSeverity = severityStr ? parseInt(severityStr) : 0;

    let filtered = allScandals;

    if (party) {
        filtered = filtered.filter(s => s.party === party);
    }
    if (minSeverity > 0) {
        filtered = filtered.filter(s => s.severity >= minSeverity);
    }

    currentScandals = filtered;
    renderTimeline(filtered);
}

function resetTimelineFilters() {
    const partySelect = document.getElementById('filterParty');
    const severitySelect = document.getElementById('filterSeverity');
    
    if (partySelect) partySelect.value = '';
    if (severitySelect) severitySelect.value = '';

    renderTimeline(allScandals);
}

function closeTimeline() {
    const modal = document.getElementById('timelineModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}