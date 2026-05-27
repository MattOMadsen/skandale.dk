// js/timeline.js - Tidslinje (robust + proaktiv data loading)

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
        console.warn('[Skandale.dk] politicians ikke loaded endnu');
        if (contentContainer) contentContainer.innerHTML = '<p class="text-slate-500 text-center py-8">Data ikke klar endnu. Prøv igen om lidt.</p>';
        return;
    }

    // Først: Prøv at samle eksisterende data
    collectScandalsFromPoliticians();

    // Hvis ingen skandaler, så load detaljer proaktivt for alle der mangler det
    if (allScandals.length === 0) {
        console.log('[Skandale.dk] Ingen skandaler fundet - loader detaljer for alle politikere...');
        
        const loadPromises = politicians.map(async (p) => {
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
    politicians.forEach(politician => {
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