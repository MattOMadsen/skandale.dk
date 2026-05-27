// js/timeline.js - Tidslinje (robust + proaktiv data loading + selvforsynende modal-struktur der matcher historisk design)

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

    // === ROBUST: Bygger præcis den historiske modal-struktur fra commit der fik den til at virke "som før" ===
    if (!document.getElementById('timelineContent')) {
        modal.innerHTML = `
            <!-- Timeline Modal (genskabt præcis som i den historiske version der virkede) -->
            <div class="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
                <!-- Header -->
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between flex-shrink-0">
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight">Tidslinje over skandaler</h3>
                        <p class="text-slate-500 mt-1">Sorteret efter år – nyeste først</p>
                    </div>
                    <button onclick="closeTimeline()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>

                <!-- Filtre -->
                <div class="px-8 py-6 border-b flex flex-wrap gap-4 items-end flex-shrink-0">
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">Parti</label>
                        <select id="filterParty" onchange="filterTimeline()" class="border border-slate-300 rounded-2xl px-4 py-2 text-sm w-56">
                            <option value="">Alle partier</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-500 mb-1">Minimum alvorlighed</label>
                        <select id="filterSeverity" onchange="filterTimeline()" class="border border-slate-300 rounded-2xl px-4 py-2 text-sm w-48">
                            <option value="">Alle</option>
                            <option value="1">1+ stjerner</option>
                            <option value="2">2+ stjerner</option>
                            <option value="3">3+ stjerner</option>
                            <option value="4">4+ stjerner</option>
                            <option value="5">5 stjerner</option>
                        </select>
                    </div>
                    <button onclick="resetTimelineFilters()" class="px-5 py-2 text-sm border border-slate-300 rounded-2xl hover:bg-slate-100 transition-colors">Nulstil filtre</button>
                </div>

                <!-- Indhold -->
                <div id="timelineContent" class="flex-1 overflow-y-auto p-8 space-y-4">
                    <!-- Indsættes dynamisk via JS -->
                </div>
            </div>
        `;
        console.log('%c[Skandale.dk] Historisk timeline-modal-struktur genskabt', 'color:#10b981');
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

    const pols = (typeof politicians !== 'undefined' && politicians.length) ? politicians : (window.politicians || []);
    if (!pols.length) {
        console.warn('[Skandale.dk] politicians ikke loaded endnu');
        if (contentContainer) contentContainer.innerHTML = '<p class="text-slate-500 text-center py-8">Data ikke klar endnu. Prøv igen om lidt.</p>';
        return;
    }

    // Saml eksisterende data
    collectScandalsFromPoliticians();

    // Proaktiv loading hvis nødvendigt
    if (allScandals.length === 0) {
        console.log('[Skandale.dk] Ingen skandaler fundet - loader detaljer for alle politikere...');
        const loadPromises = pols.map(async (p) => {
            if (!p._detailsLoaded && typeof window.loadPoliticianDetails === 'function') {
                try { await window.loadPoliticianDetails(p); } catch (e) {}
            }
        });
        await Promise.all(loadPromises);
        collectScandalsFromPoliticians();
    }

    if (allScandals.length === 0) {
        if (contentContainer) {
            contentContainer.innerHTML = `<div class="text-center py-12 px-6"><p class="text-slate-500 mb-2">Ingen skandaler fundet til tidslinjen.</p></div>`;
        }
        return;
    }

    allScandals.sort((a, b) => (b.year || '0').localeCompare(a.year || '0'));
    currentScandals = [...allScandals];

    // Byg filtre
    const partySelect = document.getElementById('filterParty');
    if (partySelect) {
        partySelect.innerHTML = '<option value="">Alle partier</option>';
        [...new Set(allScandals.map(s => s.party))].sort().forEach(party => {
            const opt = document.createElement('option');
            opt.value = party;
            opt.textContent = party;
            partySelect.appendChild(opt);
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
    const minSeverity = severitySelect.value ? parseInt(severitySelect.value) : 0;

    let filtered = allScandals;
    if (party) filtered = filtered.filter(s => s.party === party);
    if (minSeverity > 0) filtered = filtered.filter(s => s.severity >= minSeverity);

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