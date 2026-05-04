// js/modal-core.js - Bedste version (kombineret)

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
    
    // Ryd gamle dynamiske sektioner (vigtigt!)
    const modalBody = document.querySelector('#politicianModal .p-8');
    if (modalBody) {
        const oldSections = modalBody.querySelectorAll('.dynamic-section, .economic-support');
        oldSections.forEach(el => el.remove());
    }
    
    // Vis modal
    document.getElementById('politicianModal').classList.remove('hidden');
    document.getElementById('politicianModal').classList.add('flex');
    
    // Indlæs sektioner
    if (typeof loadScandals === 'function') loadScandals(politician);
    if (typeof addEconomicSupportSection === 'function') addEconomicSupportSection(politician);
    if (typeof initShareButton === 'function') initShareButton(politician);
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