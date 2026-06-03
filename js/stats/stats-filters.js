// js/stats/stats-filters.js
// Party filter logic for the stats page

function filterByParty(party) {
    currentPartyFilter = party;
    
    // Update active button styles
    document.querySelectorAll('.party-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-party') === party) {
            btn.classList.add('!bg-blue-600', '!text-white', 'ring-2', 'ring-blue-300');
        } else {
            btn.classList.remove('!bg-blue-600', '!text-white', 'ring-2', 'ring-blue-300');
        }
    });

    renderAll();
}

function resetPartyFilter() {
    currentPartyFilter = null;
    
    document.querySelectorAll('.party-filter-btn').forEach(btn => {
        btn.classList.remove('!bg-blue-600', '!text-white', 'ring-2', 'ring-blue-300');
    });

    renderAll();
}

// Make functions globally available
window.filterByParty = filterByParty;
window.resetPartyFilter = resetPartyFilter;