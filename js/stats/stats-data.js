// js/stats/stats-data.js
// Data loading, politician meta and aggregation for the stats page

const PARTY_SHORT = {
    'Socialdemokratiet': 'S',
    'Danmarksdemokraterne': 'DD',
    'Radikale Venstre': 'RV',
    'Moderaterne': 'M',
    'Dansk Folkeparti': 'DF',
    'Venstre': 'V',
    'Det Konservative Folkeparti': 'K',
    'Enhedslisten': 'EL',
    'Nye Borgerlige': 'NB',
    'Liberal Alliance': 'LA',
    'Alternativet / Uafhængig': 'Å',
    'Frie Grønne': 'FG',
    'Socialistisk Folkeparti': 'SF'
};

let politiciansData = [];
let currentPartyFilter = null;

async function fetchJSON(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (e) {
        console.warn('Kunne ikke hente', path, e);
        return null;
    }
}

async function loadScandalsForStats(slug) {
    const manifest = await fetchJSON(`data/scandals/${slug}/manifest.json`);
    if (manifest?.scandals && Array.isArray(manifest.scandals)) {
        const items = await Promise.all(
            manifest.scandals.map(f => fetchJSON(`data/scandals/${slug}/${f}`))
        );
        return items.filter(Boolean);
    }

    const single = await fetchJSON(`data/scandals/${slug}.json`);
    if (single?.scandals) return single.scandals;
    if (Array.isArray(single)) return single;
    return [];
}

async function loadBrokenPromisesForStats(slug) {
    const manifest = await fetchJSON(`data/broken-promises/${slug}/manifest.json`);
    if (manifest?.brokenPromises && Array.isArray(manifest.brokenPromises)) {
        const items = await Promise.all(
            manifest.brokenPromises.map(f => fetchJSON(`data/broken-promises/${slug}/${f}`))
        );
        return items.filter(Boolean);
    }

    const single = await fetchJSON(`data/broken-promises/${slug}.json`);
    if (single?.brokenPromises) return single.brokenPromises;
    return [];
}

function metaFromCore(slug, core) {
    if (!core) {
        return { name: slug, party: 'Ukendt', partyShort: '?', color: '#6B7280' };
    }
    return {
        name: core.name || slug,
        party: core.party || 'Ukendt',
        partyShort: PARTY_SHORT[core.party] || '?',
        color: core.partyColor || core.avatarColor || '#6B7280'
    };
}

async function loadAllStatsData() {
    const metricsGrid = document.getElementById('metricsGrid');
    if (metricsGrid) {
        metricsGrid.innerHTML = createSkeletonMetrics();
        metricsGrid.classList.add('loading');
    }

    try {
        const manifest = await fetchJSON('data/politicians/manifest.json');
        if (!manifest || !manifest.politicians) throw new Error('Manifest ikke fundet');

        const slugs = manifest.politicians;
        const countEl = document.getElementById('politicianCount');
        if (countEl) countEl.textContent = slugs.length;

        politiciansData = await Promise.all(slugs.map(async (slug) => {
            const [core, scandals, brokenPromises, donationData] = await Promise.all([
                fetchJSON(`data/politicians/${slug}.json`),
                loadScandalsForStats(slug),
                loadBrokenPromisesForStats(slug),
                fetchJSON(`data/economic-support/${slug}.json`)
            ]);

            const meta = metaFromCore(slug, core);

            let scandalCount = 0;
            let totalSeverity = 0;
            const severityCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            scandalCount = scandals.length;
            scandals.forEach(s => {
                const sev = s.ourSeverity || s.severity || 3;
                totalSeverity += sev;
                if (severityCounts[sev] !== undefined) severityCounts[sev]++;
            });

            const brokenPromiseCount = brokenPromises.length;
            const donationCount = donationData?.donations?.length || 0;

            return {
                slug,
                name: meta.name,
                party: meta.party,
                partyShort: meta.partyShort,
                color: meta.color,
                scandalCount,
                avgSeverity: scandalCount > 0 ? (totalSeverity / scandalCount).toFixed(1) : '0.0',
                severityCounts,
                brokenPromiseCount,
                donationCount
            };
        }));

        if (typeof renderAll === 'function') {
            renderAll();
        }

        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = new Date().toLocaleDateString('da-DK');
        }

    } catch (error) {
        console.error('Fejl ved indlæsning af stats data:', error);
        if (metricsGrid) {
            metricsGrid.innerHTML = '<div class="col-span-full text-red-500 p-4">Fejl ved indlæsning af data. Prøv at opdatere siden.</div>';
        }
    } finally {
        if (metricsGrid) metricsGrid.classList.remove('loading');
    }
}

function createSkeletonMetrics() {
    return Array(5).fill('').map(() => `
        <div class="stat-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="h-4 w-24 skeleton rounded mb-3"></div>
                    <div class="h-8 w-16 skeleton rounded"></div>
                </div>
                <div class="w-12 h-12 skeleton rounded-2xl"></div>
            </div>
        </div>
    `).join('');
}

window.loadAllStatsData = loadAllStatsData;
window.politiciansData = politiciansData;