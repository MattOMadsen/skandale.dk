// js/data.js - Opdateret til per-politiker mappe + manifest for BOTH scandals og broken-promises (v2.00.63+)
// Støtter både ny granular struktur og gammel single-file som fallback
// Læst MODAL-STRUKTUR.md før ændringer

let politicians = [];
let networkIndex = {};

async function loadPoliticians() {
  try {
    const coreFiles = [
      'mette-frederiksen', 'inger-stoejberg', 'morten-oestergaard', 'helle-thorning-schmidt',
      'lars-loekke-rasmussen', 'pia-kjaersgaard', 'anders-fogh-rasmussen', 'morten-messerschmidt',
      'kristian-thulesen-dahl', 'soeren-pape-poulsen', 'uffe-elbaek', 'claus-hjort-frederiksen'
    ];

    const corePromises = coreFiles.map(slug => fetch(`data/politicians/${slug}.json`).then(r => r.json()));
    const cores = await Promise.all(corePromises);

    const detailPromises = cores.map(async (core) => {
      const slug = core.name.toLowerCase()
        .replace(/æ/g, 'ae')
        .replace(/ø/g, 'oe')
        .replace(/å/g, 'aa')
        .replace(/[^a-z0-9]+/g, '-');

      let scandals = [];
      let affiliations = [];
      let brokenPromises = [];
      let economicSupport = [];

      // === NY STRUKTUR: Prøv per-politiker mappe med manifest for SCANDALS ===
      try {
        const manifestRes = await fetch(`data/scandals/${slug}/manifest.json`);
        if (manifestRes.ok) {
          const manifest = await manifestRes.json();
          if (manifest.scandals && Array.isArray(manifest.scandals)) {
            const scandalPromises = manifest.scandals.map(filename =>
              fetch(`data/scandals/${slug}/${filename}`).then(r => r.ok ? r.json() : null)
            );
            const loadedScandals = await Promise.all(scandalPromises);
            scandals = loadedScandals.filter(Boolean);
          }
        }
      } catch (e) {
        // manifest ikke fundet → fortsæt til fallback
      }

      // Fallback til gammel single-file struktur for scandals
      if (scandals.length === 0) {
        try {
          const s = await fetch(`data/scandals/${slug}.json`);
          if (s.ok) {
            const sData = await s.json();
            scandals = sData.scandals || (Array.isArray(sData) ? sData : []);
          }
        } catch (e) {}
      }

      // === NY STRUKTUR: Prøv per-politiker mappe med manifest for BROKEN-PROMISES ===
      let brokenPromisesLoadedFromManifest = false;
      try {
        const bpManifestRes = await fetch(`data/broken-promises/${slug}/manifest.json`);
        if (bpManifestRes.ok) {
          const bpManifest = await bpManifestRes.json();
          if (bpManifest.brokenPromises && Array.isArray(bpManifest.brokenPromises)) {
            const bpPromises = bpManifest.brokenPromises.map(filename =>
              fetch(`data/broken-promises/${slug}/${filename}`).then(r => r.ok ? r.json() : null)
            );
            const loadedBP = await Promise.all(bpPromises);
            brokenPromises = loadedBP.filter(Boolean);
            brokenPromisesLoadedFromManifest = true;
          }
        }
      } catch (e) {
        // manifest ikke fundet → fortsæt til fallback
      }

      // Fallback til gammel single-file struktur for broken-promises
      if (!brokenPromisesLoadedFromManifest || brokenPromises.length === 0) {
        try {
          const b = await fetch(`data/broken-promises/${slug}.json`);
          if (b.ok) {
            const bData = await b.json();
            brokenPromises = bData.brokenPromises || [];
          }
        } catch (e) {}
      }

      // Affiliations
      try {
        const a = await fetch(`data/affiliations/${slug}.json`);
        if (a.ok) {
          const aData = await a.json();
          affiliations = aData.affiliations || aData || [];
        }
      } catch (e) {}

      if (scandals.length === 0 || affiliations.length === 0) {
        try {
          const d = await fetch(`data/details/${slug}-details.json`);
          if (d.ok) {
            const details = await d.json();
            if (scandals.length === 0) scandals = details.scandals || [];
            if (affiliations.length === 0) affiliations = details.affiliations || [];
          }
        } catch (e) {}
      }

      try {
        const e = await fetch(`data/economic-support/${slug}.json`);
        if (e.ok) {
          const eData = await e.json();
          economicSupport = eData.donations || eData.economicSupport || [];
        }
      } catch (e) {}

      return {
        scandals,
        affiliations,
        economicSupport,
        brokenPromises
      };
    });

    const detailsList = await Promise.all(detailPromises);

    politicians = cores.map((core, index) => ({
      ...core,
      ...detailsList[index]
    }));

    // Byg globalt netværks-index
    networkIndex = {};
    politicians.forEach(politician => {
      if (politician.affiliations && Array.isArray(politician.affiliations)) {
        politician.affiliations.forEach(aff => {
          let key = (aff.name || aff.organization || 'Ukendt').trim();
          if (key.toLowerCase().includes('world economic forum') || key.toLowerCase().includes('wef')) key = 'World Economic Forum (WEF)';
          if (key.toLowerCase().includes('bilderberg')) key = 'Bilderberg Meetings';
          if (key.toLowerCase().includes('cpac')) key = 'Conservative Political Action Conference (CPAC)';
          if (key.toLowerCase().includes('ecr')) key = 'European Conservatives and Reformists (ECR)';
          if (key.toLowerCase().includes('idu')) key = 'International Democrat Union (IDU)';

          if (!networkIndex[key]) networkIndex[key] = [];
          networkIndex[key].push({
            id: politician.id,
            name: politician.name,
            party: politician.party,
            year: aff.year || '',
            role: aff.role || ''
          });
        });
      }
    });

    window.networkIndex = networkIndex;
    window.politicians = politicians;

    console.log(`[Skandale.dk] Alle ${politicians.length} politikere loaded med ny granular struktur for scandals + broken-promises + fallback`);
    return politicians;
  } catch (error) {
    console.error('Fejl ved loading:', error);
    return [];
  }
}