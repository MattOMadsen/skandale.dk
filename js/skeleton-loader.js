// js/skeleton-loader.js - Skeleton loader til politiker-grid (1 fil = 1 funktion)

function renderPoliticianSkeletons(count = 8) {
    const grid = document.getElementById('politiciansGrid');
    if (!grid) return;

    grid.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const card = document.createElement('div');
        card.className = 'politician-card animate-pulse bg-white border border-slate-200 rounded-3xl p-5 h-48';
        grid.appendChild(card);
    }
}

// Eksponer globalt
window.renderPoliticianSkeletons = renderPoliticianSkeletons;