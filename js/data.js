// js/data.js - Opdateret til bedre support af ny mappe-struktur + both severity/ourSeverity
// Beholdt al gammel fallback-logik

let politicians = [];
let networkIndex = {};

async function loadPoliticians() {
  try {
    // === KERNE-LISTE (kan udvides med nye politikere) ===
    const coreFiles = [
      'mette-frederiksen', 'inger-stoejberg', 'morten-oestergaard', 'helle-thorning-schmidt',
      'lars-loekke-rasmussen', 'pia-kjaersgaard', 'anders-fogh-rasmussen', 'morten-messerschmidt',
      'kristian-thulesen-dahl', 'soeren-pape-poulsen', 'uffe-elbaek', 'claus-hjort-frederiksen',
      'pernille-skipper'  // Tilføjet
    ];

    const corePromises = coreFiles.map(slug => fetch(`data/politicians/${slug}.json`).then(r => r.json()));
    const cores = await Promise.all(corePromises);

    const detailPromises = cores.map(async (core) => {
      const slug = core.name.toLowerCase()
        .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
        .replace(/[^a-z0-9]+/g, '-');

      let scandals = [];
      let affiliations = [];
      let brokenPromises = [];
      let economicSupport = [];

      // === NY GRANULAR STRUKTUR: Prøv mappe + manifest ===
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
      } catch (e) {}

      // Fallback til gammel single-file
      if (scandals.length === 0) {
        try {
          const s = await fetch(`data/scandals/${slug}.json`);
          if (s.ok) {
            const sData = await s.json();
            scandals = sData.scandals || (Array.isArray(sData) ? sData : []);
          }
        } catch (e) {}
      }

      // Affiliations (mappe først)
      try {
        const a = await fetch(`data/affiliations/${slug}.json`);
        if (a.ok) {
          const aData = await a.json();
          affiliations = aData.affiliations || aData || [];
        }
      } catch (e) {}

      // Broken Promises
      try {
        const b = await fetch(`data/broken-promises/${slug}.json`);
        if (b.ok) {
          const bData = await b.json();
          brokenPromises = bData.brokenPromises || [];
        }
      } catch (e) {}

      // Economic Support
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

    console.log(`[Skandale.dk] ${politicians.length} politikere loaded (inkl. Pernille Skipper + ny mappe-struktur)`);
    return politicians;
  } catch (error) {
    console.error('Fejl ved loading:', error);
    return [];
  }
}