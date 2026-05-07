// js/data.js - Komplet fix: Henter fra alle dedikerede mapper

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
      const slug = core.name.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa').replace(/[^a-z0-9]+/g, '-');

      let details = {};
      let brokenPromises = [];
      let economicSupport = [];

      // Details (scandals + affiliations)
      try {
        const d = await fetch(`data/details/${slug}-details.json`);
        if (d.ok) details = await d.json();
      } catch (e) {}

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
        scandals: details.scandals || [],
        economicSupport: economicSupport,
        brokenPromises: brokenPromises,
        affiliations: details.affiliations || []
      };
    });

    const detailsList = await Promise.all(detailPromises);

    politicians = cores.map((core, index) => ({
      ...core,
      ...detailsList[index]
    }));

    console.log(`[Skandale.dk] Alle ${politicians.length} politikere loaded med fuld data`);
    return politicians;
  } catch (error) {
    console.error('Fejl ved loading:', error);
    return [];
  }
}