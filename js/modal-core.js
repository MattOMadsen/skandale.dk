// js/modal-core.js - Hovedmodal (åbn og luk)

function showPoliticianModal(id) {
  const politician = politicians.find(p => p.id === id);
  if (!politician) return;

  document.getElementById('politicianModal').dataset.currentPoliticianId = id;

  document.getElementById('modalName').innerHTML = politician.name;
  document.getElementById('modalParty').innerHTML = politician.party;
  document.getElementById('modalParty').style.backgroundColor = politician.partyColor + '20';
  document.getElementById('modalParty').style.color = politician.partyColor;
  document.getElementById('modalRole').innerHTML = politician.role;

  const avatar = document.getElementById('modalAvatar');
  avatar.style.backgroundColor = politician.avatarColor;
  avatar.innerHTML = politician.initials;

  document.getElementById('modalBio').innerHTML = politician.bio;
  document.getElementById('modalScandalCount').innerHTML = politician.scandals.length;

  const scandalsContainer = document.getElementById('modalScandals');
  scandalsContainer.innerHTML = '';

  politician.scandals.forEach((scandal) => {
    // Vi kalder de andre filer for at bygge indholdet
    const scandalHTML = buildScandalHTML(scandal);
    scandalsContainer.innerHTML += scandalHTML;
  });

  // Tilføj økonomisk støtte sektion (fra modal-donor.js)
  addEconomicSupportSection(politician);

  document.getElementById('politicianModal').classList.remove('hidden');
  document.getElementById('politicianModal').classList.add('flex');
}

function closeModal() {
  document.getElementById('politicianModal').classList.remove('flex');
  document.getElementById('politicianModal').classList.add('hidden');
}