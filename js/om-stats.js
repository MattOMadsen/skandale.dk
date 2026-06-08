// js/om-stats.js – live tal på om.html fra manifest + politiker-data

async function loadOmPageStats() {
    try {
        const manifestRes = await fetch('data/politicians/manifest.json');
        if (!manifestRes.ok) throw new Error('Manifest ikke fundet');

        const manifest = await manifestRes.json();
        const slugs = manifest.politicians || [];

        const countEl = document.getElementById('om-politician-count');
        if (countEl) {
            countEl.textContent = `${slugs.length} politikere`;
        }

        const cores = await Promise.all(
            slugs.map(slug =>
                fetch(`data/politicians/${slug}.json`)
                    .then(r => r.ok ? r.json() : null)
                    .catch(() => null)
            )
        );

        const inFolketinget = cores.filter(c => c?.inFolketinget === true).length;
        const ftEl = document.getElementById('om-folketing-count');
        if (ftEl) {
            ftEl.textContent = `${inFolketinget} i Folketinget`;
        }

        const parties = new Set(cores.filter(Boolean).map(c => c.party));
        const partyEl = document.getElementById('om-party-count');
        if (partyEl) {
            partyEl.textContent = `${parties.size} partier`;
        }

        const lastEl = document.getElementById('om-last-updated');
        if (lastEl) {
            lastEl.textContent = new Date().toLocaleDateString('da-DK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    } catch (e) {
        console.warn('[om-stats] Kunne ikke hente live stats:', e);
    }
}

document.addEventListener('DOMContentLoaded', loadOmPageStats);