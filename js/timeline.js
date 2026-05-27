// js/timeline.js - Tidslinje (v2.00.51 - fuld filter-support + createStars + sikkerhed)

let allScandals = [];
let currentScandals = [];

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

function showTimeline() {
    allScandals = [];
    
    if (typeof politicians === 'undefined' || !politicians.length) {
        console.error('[Skandale.dk] politicians er ikke loaded endnu');
        return;
    }

    politicians.forEach(politician => {
        if (politician.scandals && politician.scandals.length) {
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

    // Sikkerheds-tjek: Hvis ingen skandaler blev fundet, vent kort og prøv igen
    if (allScandals.length === 0) {
        console.warn('[Skandale.dk] Ingen skandaler fundet i første forsøg. Prøver igen om 300ms...');
        setTimeout(() => {
            showTimeline();
        }, 300);
        return;
    }

    allScandals.sort((a, b) => {
        const yearA = a.year || '0';
        const yearB = b.year || '0';
        return yearB.localeCompare(yearA);
    });
    currentScandals = [...allScandals];

    const modal = document.getElementById('timelineModal');
    if (!modal) {
        console.error('[Skandale.dk] #timelineModal findes ikke i DOM!');
        alert('Tidslinje-modalen mangler i index.html. Kontakt udvikler.');
        return;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');

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