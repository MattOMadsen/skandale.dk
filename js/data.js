// js/data.js - Endelig version til details-mappe struktur (v2.1)

let politicians = [];

async function loadPoliticians() {
  const politicianFiles = [
    'data/politicians/mette-frederiksen.json',
    'data/politicians/inger-stoejberg.json',
    'data/politicians/morten-oestergaard.json',
    'data/politicians/helle-thorning-schmidt.json',
    'data/politicians/lars-loekke-rasmussen.json',
    'data/politicians/pia-kjaersgaard.json',
    'data/politicians/anders-fogh-rasmussen.json',
    'data/politicians/morten-messerschmidt.json',
    'data/politicians/kristian-thulesen-dahl.json',
    'data/politicians/soeren-pape-poulsen.json',
    'data/politicians/uffe-elbaek.json',
    'data/politicians/claus-hjort-frederiksen.json'
  ];

  try {
    // 1. Load alle core politician filer
    const coreResponses = await Promise.all(politicianFiles.map(file => fetch(file)));
    const cores = await Promise.all(coreResponses.map(res => res.json()));

    // 2. Load details for hver politiker
    const detailPromises = cores.map(core => {
      const slug = core.name.toLowerCase()
        .replace(/æ/g, 'ae')
        .replace(/ø/g, 'oe')
        .replace(/å/g, 'aa')
        .replace(/[^a-z0-9]+/g, '-');
      
      return fetch(`data/details/${slug}-details.json`)
        .then(res => {
          if (!res.ok) {
            console.warn(`Ingen details fundet for ${core.name}`);
            return { scandals: [], economicSupport: [], brokenPromises: [], affiliations: [] };
          }
          return res.json();
        });
    });

    const detailsList = await Promise.all(detailPromises);

    // 3. Merge core + details
    politicians = cores.map((core, index) => {
      const details = detailsList[index];
      return {
        ...core,
        scandals: details.scandals || [],
        economicSupport: details.economicSupport || [],
        brokenPromises: details.brokenPromises || [],
        affiliations: details.affiliations || []
      };
    });

    console.log('%c[Skandale.dk] Alle 12 politikere + details loaded succesfuldt', 'color:#10b981');
  } catch (error) {
    console.error('Kunne ikke loade data:', error);
  }
}