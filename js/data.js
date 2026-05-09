// js/data.js - Komplet fix: Henter fra alle dedikererede mapper + legacy fallback
// Opdateret 9. maj 2026 – Prioriterer data/scandals/ men bevarer fuld bagudkompatibilitet med data/details/

let politicians = [];

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

      // === NY STRUKTUR (prioritet) ===
      // Hent skandaler fra dedikeret mappe (data/scandals/)
      try {
        const s = await fetch(`data/scandals/${slug}.json`);
        if (s.ok) {
          const sData = await s.json();
          scandals = sData.scandals || (Array.isArray(sData) ? sData : []);
        }
      } catch (e) {
        // Ignorer fejl – vi falder tilbage til legacy
      }

      // === LEGACY FALLBACK (data/details/) – beholdes uændret ===
      if (scandals.length === 0) {
        try {
          const d = await fetch(`data/details/${slug}-details.json`);
          if (d.ok) {
            const details = await d.json();
            scandals = details.scandals || [];
            affiliations = details.affiliations || [];
          }
        } catch (e) {}
      } else {
        // Hvis nye skandaler blev fundet, hent stadig affiliations fra legacy (indtil det også migreres)
        try {
          const d = await fetch(`data/details/${slug}-details.json`);
          if (d.ok) {
            const details = await d.json();
            affiliations = details.affiliations || [];
          }
        } catch (e) {}
      }

      // Broken promises (dedikeret mappe)
      try {
        const b = await fetch(`data/broken-promises/${slug}.json`);
        if (b.ok) {
          const bData = await b.json();
          brokenPromises = bData.brokenPromises || [];
        }
      } catch (e) {}

      // Economic support (dedikeret mappe)
      try {
        const e = await fetch(`data/economic-support/${slug}.json`);
        if (e.ok) {
          const eData = await e.json();
          economicSupport = eData.donations || eData.economicSupport || [];
        }
      } catch (e) {}

      return {
        scandals: scandals,
        affiliations: affiliations,
        economicSupport: economicSupport,
        brokenPromises: brokenPromises
      };
    });

    const detailsList = await Promise.all(detailPromises);

    politicians = cores.map((core, index) => ({
      ...core,
      ...detailsList[index]
    }));

    console.log(`[Skandale.dk] Alle ${politicians.length} politikere loaded med fuld data (ny + legacy struktur)`);
    return politicians;
  } catch (error) {
    console.error('Fejl ved loading:', error);
    return [];
  }
}