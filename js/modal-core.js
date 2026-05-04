// js/modal-core.js
// Håndterer åbning/lukning af modal + integration af deleknap

let currentPolitician = null;

function openModal(politician) {
    currentPolitician = politician;

    // Udfyld modal
    document.getElementById('modalName').textContent = politician.name;
    document.getElementById('modalParty').textContent = politician.party;
    document.getElementById('modalRole').textContent = politician.role || '';
    document.getElementById('modalBio').textContent = politician.bio || 'Ingen beskrivelse tilgængelig.';
    
    const avatar = document.getElementById('modalAvatar');
    avatar.style.backgroundColor = politician.color || '#C8102E';
    avatar.innerHTML = `<span class="font-bold">${politician.name.split(' ').map(n => n[0]).join('')}</span>`;
    
    // Skandaler (fra modal-scandal.js)
    if (typeof loadScandals === 'function') {
        loadScandals(politician);
    }
    
    // Vis modal
    document.getElementById('politicianModal').classList.remove('hidden');
    document.getElementById('politicianModal').classList.add('flex');
    
    // Aktivér deleknap (Version 2)
    initShareButton(politician);
}

function closeModal() {
    const modal = document.getElementById('politicianModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    
    const options = document.getElementById('share-options');
    if (options) options.style.display = 'none';
}

// Gør funktionerne globale
window.openModal = openModal;
window.closeModal = closeModal;