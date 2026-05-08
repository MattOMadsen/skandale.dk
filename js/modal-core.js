// js/modal-core.js - Fuldt fungerende version (fix til klik fra forsiden)
// Erstatter stubben der gjorde at modalen ikke åbnede

let currentPolitician = null;

function showPoliticianModal(politicianId) {
  const politician = politicians.find(p => p.id === politicianId || p.id == politicianId);
  if (!politician) {
    console.error('[Skandale.dk] Politiker ikke fundet med id:', politicianId);
    alert('Kunne ikke finde politikeren. Prøv igen.');
    return;
  }

  currentPolitician = politician;

  // Avatar
  const avatar = document.getElementById('modalAvatar');
  if (avatar) {
    avatar.style.backgroundColor = politician.avatarColor || '#C8102E';
    avatar.textContent = politician.initials || politician.name.split(' ').map(n => n[0]).join('');
  }

  // Navn
  const nameEl = document.getElementById('modalName');
  if (nameEl) nameEl.textContent = politician.name;

  // Parti
  const partyEl = document.getElementById('modalParty');
  if (partyEl) {
    partyEl.textContent = politician.party || '';
    partyEl.style.backgroundColor = (politician.partyColor || '#64748b') + '20';
    partyEl.style.color = politician.partyColor || '#64748b';
  }

  // Rolle
  const roleEl = document.getElementById('modalRole');
  if (roleEl) roleEl.textContent = politician.role || '';

  // Bio
  const bioEl = document.getElementById('modalBio');
  if (bioEl) bioEl.innerHTML = (politician.bio || '').replace(/\n/g, '<br>');

  // Skandale tæller
  const countEl = document.getElementById('modalScandalCount');
  const scandals = Array.isArray(politician.scandals) ? politician.scandals : [];
  if (countEl) countEl.textContent = scandals.length;

  // Skandaler liste
  const scandalsContainer = document.getElementById('modalScandals');
  if (scandalsContainer) {
    scandalsContainer.innerHTML = '';
    if (scandals.length === 0) {
      scandalsContainer.innerHTML = '<p class="text-slate-500">Ingen skandaler registreret.</p>';
    } else {
      scandals.forEach((scandal) => {
        const div = document.createElement('div');
        div.className = 'bg-slate-50 border border-slate-200 rounded-2xl p-5';
        let mediaHTML = '';
        if (scandal.mediaLinks && scandal.mediaLinks.length > 0) {
          mediaHTML = `<div class="mt-3 flex flex-wrap gap-2">${scandal.mediaLinks.map(link => `<a href="${link.url || '#'}" target="_blank" class="text-xs px-2 py-1 bg-white border rounded-full hover:bg-slate-100 transition-colors">${link.label || 'Kilde'}</a>`).join('')}</div>`;
        }
        div.innerHTML = `
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold text-lg">${scandal.title || 'Skandale'}</div>
              <div class="text-xs text-slate-500 mt-1">${scandal.year || ''}</div>
            </div>
            <div class="text-right">
              <div class="text-amber-500">${createStars(scandal.severity || 3)}</div>
              <div class="text-[10px] text-slate-400">${scandal.severity || 3}/5</div>
            </div>
          </div>
          <div class="mt-3 text-sm text-slate-600 leading-relaxed">${scandal.description || ''}</div>
          ${mediaHTML}
        `;
        scandalsContainer.appendChild(div);
      });
    }
  }

  // Vis modal
  const modal = document.getElementById('politicianModal');
  if (modal) modal.classList.remove('hidden');

  console.log(`%c[Skandale.dk] Åbnede modal for ${politician.name} (id: ${politicianId})`, 'color:#10b981');
}

function closeModal() {
  const modal = document.getElementById('politicianModal');
  if (modal) modal.classList.add('hidden');
  currentPolitician = null;
}

// Gør funktionerne globale
window.showPoliticianModal = showPoliticianModal;
window.closeModal = closeModal;

// Lokal createStars (sikkerhed hvis ui.js ikke er loadet endnu)
function createStars(count) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += (i < count) ? `<i class="fa-solid fa-star severity-star text-sm"></i>` : `<i class="fa-solid fa-star text-slate-200 text-sm"></i>`;
  }
  return stars;
}