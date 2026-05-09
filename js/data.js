// js/data.js - Komplet fix: Henter fra alle dedikerede mapper + legacy fallback
// Opdateret 9. maj 2026 – Nu med både scandals og affiliations fra nye mapper

let politicians = [];
let networkIndex = {}; // Globalt indeks: netværk -> liste af politikere

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

      try {
        const s = await fetch(`data/scandals/${slug}.json`);
        if (s.ok) {
          const sData = await s.json();
          scandals = sData.scandals || (Array.isArray(sData) ? sData : []);
        }
      } catch (e) {}

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
        const b = await fetch(`data/broken-promises/${slug}.json`);
        if (b.ok) {
          const bData = await b.json();
          brokenPromises = bData.brokenPromises || [];
        }
      } catch (e) {}

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

    // === BYG GLOBALT NETVÆRKS-INDEX (case-insensitive + trim) ===
    networkIndex = {};
    politicians.forEach(politician => {
      if (politician.affiliations && Array.isArray(politician.affiliations)) {
        politician.affiliations.forEach(aff => {
          let key = (aff.name || aff.organization || 'Ukendt').trim();
          // Normaliser kendte varianter
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

    // Gør det globalt tilgængeligt
    window.networkIndex = networkIndex;

    console.log(`[Skandale.dk] Alle ${politicians.length} politikere loaded med fuld data + netværksindeks`);
    return politicians;
  } catch (error) {
    console.error('Fejl ved loading:', error);
    return [];
  }
}
