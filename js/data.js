// js/data.js - Dynamisk loading via manifest.json + fallback
// Opdateret til hurtigere forside: Kun lette core-data loades initialt (lazy details)

let politicians = [];
let networkIndex = {};

async function loadPoliticians() {
  try {
    let politicianSlugs = [];

    // === Prøv at hente manifest (anbefalet måde) ===
    try {
      const manifestRes = await fetch('data/politicians/manifest.json');
      if (manifestRes.ok) {
        const manifest = await manifestRes.json();
        if (manifest.politicians && Array.isArray(manifest.politicians)) {
          politicianSlugs = manifest.politicians;
          console.log('[data.js] Bruger manifest.json med', politicianSlugs.length, 'politikere');
        }
      }
    } catch (e) {
      console.warn('[data.js] Kunne ikke hente manifest.json, bruger fallback-liste');
    }

    // === Fallback til hardcoded liste (hvis manifest mangler) ===
    if (politicianSlugs.length === 0) {
      politicianSlugs = [
        'mette-frederiksen', 'inger-stoejberg', 'morten-oestergaard', 'helle-thorning-schmidt',
        'lars-loekke-rasmussen', 'pia-kjaersgaard', 'anders-fogh-rasmussen', 'morten-messerschmidt',
        'kristian-thulesen-dahl', 'soeren-pape-poulsen', 'uffe-elbaek', 'claus-hjort-frederiksen',
        'pernille-skipper'
      ];
    }

    // Kun load core JSONs (lette data til grid: navn, parti, billede, bio, role osv.)
    const corePromises = politicianSlugs.map(slug => 
      fetch(`data/politicians/${slug}.json`).then(r => r.ok ? r.json() : null)
    );
    const cores = (await Promise.all(corePromises)).filter(Boolean);

    // Initialiser politicians med KUN core data (ingen tunge detaljer endnu)
    politicians = cores.map(core => ({
      ...core,
      scandals: [],           // Tom indtil loadPoliticianDetails kaldes
      affiliations: [],
      economicSupport: [],
      brokenPromises: [],
      _detailsLoaded: false
    }));

    // Byg et minimalt netværks-index (kan udvides senere)
    networkIndex = {};
    // (valgfrit: vi kan springe dette over på frontpage eller gøre det on-demand)

    window.networkIndex = networkIndex;
    window.politicians = politicians;

    console.log(`[Skandale.dk] ${politicians.length} politikere loaded (lette core-data kun) - detaljer loades on-demand`);
    return politicians;
  } catch (error) {
    console.error('Fejl ved loading:', error);
    return [];
  }
}

/**
 * Henter fulde detaljer (scandals, affiliations, brokenPromises, economicSupport) for én politiker.
 * Kaldes automatisk når en modal åbnes.
 * Opdaterer objektet in-place og sætter _detailsLoaded = true.
 */
async function loadPoliticianDetails(politician) {
  if (!politician || politician._detailsLoaded) {
    return politician;
  }

  const slug = politician.name.toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-');

  let scandals = [];
  let affiliations = [];
  let brokenPromises = [];
  let economicSupport = [];

  // === NY GRANULAR STRUKTUR ===
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

  // Fallback single file
  if (scandals.length === 0) {
    try {
      const s = await fetch(`data/scandals/${slug}.json`);
      if (s.ok) {
        const sData = await s.json();
        scandals = sData.scandals || (Array.isArray(sData) ? sData : []);
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

  // Merge ind i det eksisterende objekt
  politician.scandals = scandals;
  politician.affiliations = affiliations;
  politician.brokenPromises = brokenPromises;
  politician.economicSupport = economicSupport;
  politician._detailsLoaded = true;

  console.log(`[data.js] Fulde detaljer loaded for ${politician.name}`);
  return politician;
}

// Gør funktionen globalt tilgængelig
window.loadPoliticianDetails = loadPoliticianDetails;