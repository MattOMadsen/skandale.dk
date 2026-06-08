// js/stats/stats-data.js – bruger fælles SiteStats til dataaggregering

let politiciansData = [];
let currentPartyFilter = null;

async function loadAllStatsData() {
    const metricsGrid = document.getElementById('metricsGrid');
    if (metricsGrid) {
        metricsGrid.innerHTML = createSkeletonMetrics();
        metricsGrid.classList.add('loading');
    }

    try {
        if (!window.SiteStats) throw new Error('SiteStats ikke indlæst');

        const slugs = await SiteStats.getPoliticianSlugs();
        if (!slugs.length) throw new Error('Manifest ikke fundet');

        politiciansData = await Promise.all(slugs.map(async (slug) => {
            const [core, scandals, brokenPromises, donationData] = await Promise.all([
                SiteStats.loadPoliticianCore(slug),
                SiteStats.loadScandalsForSlug(slug),
                SiteStats.loadBrokenPromisesForSlug(slug),
                SiteStats.fetchJSON(`data/economic-support/${slug}.json`)
            ]);

            const meta = SiteStats.metaFromCore(slug, core);

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
            lastUpdatedEl.textContent = SiteStats.formatDaDate();
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