// js/modal-helpers.js - Fælles hjælpere (createStars + toggleSection)
// 1 fil = 1 ansvarsområde

function createStars(severity) {
  if (!severity || severity < 1) severity = 1;
  if (severity > 5) severity = 5;
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= severity 
      ? '<i class="fa-solid fa-star text-[#C8102E]"></i>' 
      : '<i class="fa-solid fa-star text-slate-300"></i>';
  }
  return html;
}

function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  const chevron = document.getElementById(sectionId.replace('Section', 'Chevron'));
  if (section) {
    section.classList.toggle('hidden');
    if (chevron) chevron.classList.toggle('rotate-180');
  }
}

// Gør globalt tilgængeligt
window.createStars = createStars;
window.toggleSection = toggleSection;
