// js/modal-core.js - Komplet version med collapsible karriereoversigt

let currentPolitician = null;

function showPoliticianModal(idOrPolitician) {
    let politician;
    if (typeof idOrPolitician === 'number' || typeof idOrPolitician === 'string') {
        politician = politicians.find(p => p.id == idOrPolitician);
    } else {
        politician = idOrPolitician;
    }

    if (!politician) {
        console.error('Politiker ikke fundet:', idOrPolitician);
        return;
    }

    currentPolitician = politician;

    // Udfyld modal
    document.getElementById('modalName').textContent = politician.name;
    document.getElementById('modalParty').textContent = politician.party;
    document.getElementById('modalRole').textContent = politician.role || '';
    document.getElementById('modalBio').textContent = politician.bio || 'Ingen beskrivelse tilgængelig.';
    
    const avatar = document.getElementById('modalAvatar');
    avatar.style.backgroundColor = politician.avatarColor || politician.color || '#C8102E';
    avatar.innerHTML = `<span class="font-bold">${politician.initials || politician.name.split(' ').map(n => n[0]).join('')}</span>`;
    
    // Ryd gamle sektioner
    const modalBody = document.querySelector('#politicianModal .p-8');
    if (modalBody) {
        const oldSections = modalBody.querySelectorAll('.dynamic-section, .economic-support, .career-timeline-wrapper');
        oldSections.forEach(el => el.remove());
    }
    
    // Vis modal
    document.getElementById('politicianModal').classList.remove('hidden');
    document.getElementById('politicianModal').classList.add('flex');
    
    // ===================== IND LÆS ALLE SEKTIONER =====================
    if (typeof loadScandals === 'function') loadScandals(politician);
    if (typeof addEconomicSupportSection === 'function') addEconomicSupportSection(politician);
    if (typeof initShareButton === 'function') initShareButton(politician);
    if (typeof addBrokenPromisesSection === 'function') addBrokenPromisesSection(politician);
    
    // Nye sektioner
    if (typeof loadVoting === 'function') loadVoting(politician);
    if (typeof loadComments === 'function') loadComments(politician);
    if (typeof loadBrokenPromises === 'function') loadBrokenPromises(politician);

    // ===================== KARRIEREOVERSIGT (collapsible) =====================
    if (politician.careerTimeline) {
        const bioDiv = document.getElementById('modalBio');
        
        const timelineHTML = `
            <div class="mt-6 pt-4 border-t career-timeline-wrapper">
                <button onclick="toggleCareerTimeline(this)" 
                        class="flex items-center justify-between w-full text-left font-semibold text-[#C8102E] hover:text-[#A00E26] transition-colors py-1">
                    <span>Karriereoversigt</span>
                    <i class="fa-solid fa-chevron-down transition-transform text-lg"></i>
                </button>
                
                <div class="career-timeline hidden mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-line border-l-4 border-[#C8102E]/30 pl-4">
                    ${politician.careerTimeline}
                </div>
            </div>
        `;
        
        bioDiv.insertAdjacentHTML('afterend', timelineHTML);
    }
}

function toggleCareerTimeline(button) {
    const wrapper = button.parentElement;
    const content = wrapper.querySelector('.career-timeline');
    const icon = button.querySelector('i');
    
    content.classList.toggle('hidden');
    
    if (content.classList.contains('hidden')) {
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

function closeModal() {
    const modal = document.getElementById('politicianModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    
    const options = document.getElementById('share-options');
    if (options) options.style.display = 'none';
}

window.showPoliticianModal = showPoliticianModal;
window.closeModal = closeModal;