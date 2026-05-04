// js/timeline.js - Tidslinje

let allScandals = [];

function showTimeline() {
  allScandals = [];
  politicians.forEach(politician => {
    politician.scandals.forEach(scandal => {
      allScandals.push({
        ...scandal,
        politicianName: politician.name,
        politicianId: politician.id,
        party: politician.party,
        partyColor: politician.partyColor
      });
    });
  });

  allScandals.sort((a, b) => b.year.localeCompare(a.year));

  const modal = document.getElementById('timelineModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  renderTimeline(allScandals);
}

function renderTimeline(scandalsToShow) {
  const container = document.getElementById('timelineContent');
  container.innerHTML = '';

  scandalsToShow.forEach(scandal => {
    const entryHTML = `
      <div onclick="showPoliticianModal(${scandal.politicianId}); closeTimeline();" 
           class="flex gap-4 p-5 border border-slate-200 rounded-2xl hover:border-[#C8102E]/30 cursor-pointer group">
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

function closeTimeline() {
  const modal = document.getElementById('timelineModal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}