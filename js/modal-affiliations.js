// js/modal-affiliations.js - Klikbar affiliations-funktion (Fase 2)

function showAffiliationModal(affiliationName) {
    // Find alle politikere der har denne affiliation
    const matchingPoliticians = politicians.filter(p => 
        p.affiliations && p.affiliations.some(a => 
            a.name.toLowerCase() === affiliationName.toLowerCase() ||
            a.organization.toLowerCase().includes(affiliationName.toLowerCase())
        )
    );

    if (matchingPoliticians.length === 0) {
        alert("Ingen andre politikere har denne tilknytning.");
        return;
    }

    // Opret modal HTML
    const modalHTML = `
        <div id="affiliationModal" onclick="closeAffiliationModal()" 
             class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div onclick="event.stopImmediatePropagation()" 
                 class="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
                
                <!-- Header -->
                <div class="px-8 pt-8 pb-6 border-b flex items-center justify-between">
                    <div>
                        <h3 class="text-3xl font-bold tracking-tight">${affiliationName}</h3>
                        <p class="text-slate-500 mt-1">Politikere med samme tilknytning</p>
                    </div>
                    <button onclick="closeAffiliationModal()" class="text-3xl text-slate-400 hover:text-slate-600">×</button>
                </div>
                
                <!-- Liste over politikere -->
                <div class="p-8 overflow-y-auto max-h-[calc(85vh-120px)] space-y-3">
                    ${matchingPoliticians.map(p => `
                        <div onclick="closeAffiliationModal(); showPoliticianModal(${p.id});" 
                             class="flex items-center gap-x-4 p-4 rounded-2xl border border-slate-200 hover:border-[#C8102E] hover:bg-slate-50 cursor-pointer transition-all">
                            
                            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                                 style="background-color: ${p.avatarColor || '#C8102E'}">
                                ${p.initials || p.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            
                            <div class="flex-1 min-w-0">
                                <div class="font-bold text-xl tracking-tight">${p.name}</div>
                                <div class="text-sm text-slate-500">${p.party || ''}</div>
                            </div>
                            
                            <div class="text-[#C8102E]">
                                <i class="fa-solid fa-chevron-right text-xl"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="px-8 py-4 border-t bg-slate-50 text-xs text-slate-500 text-center">
                    Klik på en politiker for at se deres fulde profil
                </div>
            </div>
        </div>
    `;

    // Fjern eventuel eksisterende modal
    const existing = document.getElementById('affiliationModal');
    if (existing) existing.remove();

    // Tilføj ny modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeAffiliationModal() {
    const modal = document.getElementById('affiliationModal');
    if (modal) modal.remove();
}

// Gør funktionerne globale
window.showAffiliationModal = showAffiliationModal;
window.closeAffiliationModal = closeAffiliationModal;