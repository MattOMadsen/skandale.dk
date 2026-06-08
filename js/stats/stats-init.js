// js/stats/stats-init.js
// Initialization, dark mode, mobile menu and page load for the stats page

function initStatsPage() {

    // Load data and render
    if (typeof loadAllStatsData === 'function' && typeof loadPoliticians === 'function') {
        loadAllStatsData();
        loadPoliticians();                    // ← VIGTIG: Loader det globale politicians-array til modalen
    } else {
        console.error('stats-data.js or data.js not loaded correctly');
    }

    // Set initial last updated if not set by data loader
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl && !lastUpdatedEl.textContent) {
        lastUpdatedEl.textContent = new Date().toLocaleDateString('da-DK');
    }
}

// Auto init on load
window.onload = initStatsPage;

// Expose init for debugging if needed
window.initStatsPage = initStatsPage;