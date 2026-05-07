// js/data.js - Data loading (opdateret til at bruge dedikeret broken-promises mappe)

let politicians = [];

async function loadPoliticians() {
  try {
    // 1. Load core politikere
    const coreFiles = [
      'mette-frederiksen', 'inger-stoejberg', 'morten-oestergaard', 'helle-thorning-schmidt',
      'lars-loekke-rasmussen', 'pia-kjaersgaard', 'anders-fogh-rasmussen', 'morten-messerschmidt',
      'kristian-thulesen-dahl', 'soeren-pape-poulsen', 'uffe-elbaek', 'claus-hjort-frederiksen'
    ];

    const corePromises = coreFiles.map(slug => 
      fetch(`data/politicians/${slug}.json`).then(r => r.json())
    );
    const cores = await Promise.all(corePromises);

    // 2. Load details + brokenPromises fra dedikeret mappe
    const detailPromises = cores.map(async (core) => {
      const slug = core.name.toLowerCase()
        .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
        .replace(/[^a-z0-9]+/g, '-');

      const [detailsRes, brokenRes] = await Promise.all([
        fetch(`data/details/${slug}-details.json`).catch(() => ({ json: () => ({}) })),
        fetch(`data/broken-promises/${slug}.json`).catch(() => ({ json: () => ({ brokenPromises: [] }) }))
      ]);

      const details = await detailsRes.json().catch(() => ({}));
      const brokenData = await brokenRes.json().catch(() => ({}));

      return {
        scandals: details.scandals || [],
        economicSupport: details.economicSupport || [],
        brokenPromises: brokenData.brokenPromises || details.brokenPromises || [],
        affiliations: details.affiliations || []
      };
    });

    const detailsList = await Promise.all(detailPromises);

    // 3. Merge
    politicians = cores.map((core, index) => {
      const d = detailsList[index];
      return {
        ...core,
        ...d
      };
    });

    console.log(`[Skandale.dk] Alle ${politicians.length} politikere + details loaded succesfuldt`);
    return politicians;
  } catch (error) {
    console.error('Fejl ved loading af politikere:', error);
    return [];
  }
}