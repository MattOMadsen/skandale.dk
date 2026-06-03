// js/stats/stats-data.js
// Data loading, politician meta and aggregation for the stats page

const POLITICIAN_META = {
    "mette-frederiksen": { name: "Mette Frederiksen", party: "Socialdemokratiet", partyShort: "S", color: "#E30613" },
    "inger-stoejberg": { name: "Inger Støjberg", party: "Danmarksdemokraterne", partyShort: "DD", color: "#0055A5" },
    "morten-oestergaard": { name: "Morten Østergaard", party: "Radikale Venstre", partyShort: "RV", color: "#00AEEF" },
    "helle-thorning-schmidt": { name: "Helle Thorning-Schmidt", party: "Socialdemokratiet", partyShort: "S", color: "#E30613" },
    "lars-loekke-rasmussen": { name: "Lars Løkke Rasmussen", party: "Moderaterne", partyShort: "M", color: "#6B2D7B" },
    "pia-kjaersgaard": { name: "Pia Kjærsgaard", party: "Dansk Folkeparti", partyShort: "DF", color: "#F7C948" },
    "anders-fogh-rasmussen": { name: "Anders Fogh Rasmussen", party: "Venstre", partyShort: "V", color: "#0033A0" },
    "morten-messerschmidt": { name: "Morten Messerschmidt", party: "Dansk Folkeparti", partyShort: "DF", color: "#F7C948" },
    "kristian-thulesen-dahl": { name: "Kristian Thulesen Dahl", party: "Dansk Folkeparti", partyShort: "DF", color: "#F7C948" },
    "soeren-pape-poulsen": { name: "Søren Pape Poulsen", party: "Det Konservative Folkeparti", partyShort: "K", color: "#0066B3" },
    "uffe-elbaek": { name: "Uffe Elbæk", party: "Frie Grønne", partyShort: "FG", color: "#4CAF50" },
    "claus-hjort-frederiksen": { name: "Claus Hjort Frederiksen", party: "Venstre", partyShort: "V", color: "#0033A0" },
    "pernille-skipper": { name: "Pernille Skipper", party: "Enhedslisten", partyShort: "EL", color: "#E30613" },
    "pernille-vermund": { name: "Pernille Vermund", party: "Nye Borgerlige", partyShort: "NB", color: "#8B5CF6" },
    "alex-vanopslagh": { name: "Alex Vanopslagh", party: "Liberal Alliance", partyShort: "LA", color: "#F59E0B" },
    "ida-auken": { name: "Ida Auken", party: "Socialdemokratiet", partyShort: "S", color: "#E30613" }
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

        const scandalPromises = slugs.map(slug => fetchJSON(`data/scandals/${slug}.json`));
        const promisePromises = slugs.map(slug => fetchJSON(`data/broken-promises/${slug}.json`));
        const donationPromises = slugs.map(slug => fetchJSON(`data/economic-support/${slug}.json`));

        const [scandalResults, promiseResults, donationResults] = await Promise.all([
            Promise.all(scandalPromises),
            Promise.all(promisePromises),
            Promise.all(donationPromises)
        ]);

        politiciansData = slugs.map((slug, index) => {
            const meta = POLITICIAN_META[slug] || { name: slug, party: 'Ukendt', partyShort: '?', color: '#6B7280' };
            const scandalData = scandalResults[index];
            const promiseData = promiseResults[index];
            const donationData = donationResults[index];

            let scandalCount = 0;
            let totalSeverity = 0;
            let severityCounts = {1:0, 2:0, 3:0, 4:0, 5:0};

            if (scandalData && scandalData.scandals) {
                scandalCount = scandalData.scandals.length;
                scandalData.scandals.forEach(s => {
                    const sev = s.ourSeverity || s.severity || 3;
                    totalSeverity += sev;
                    if (severityCounts[sev] !== undefined) severityCounts[sev]++;
                });
            }

            let brokenPromiseCount = 0;
            if (promiseData && promiseData.brokenPromises) {
                brokenPromiseCount = promiseData.brokenPromises.length;
            }

            let donationCount = 0;
            if (donationData && donationData.donations) {
                donationCount = donationData.donations.length;
            }

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
        });

        // Trigger render after data is ready
        if (typeof renderAll === 'function') {
            renderAll();
        }

        // Update last updated
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

// Expose for other modules if needed
window.loadAllStatsData = loadAllStatsData;
window.politiciansData = politiciansData;