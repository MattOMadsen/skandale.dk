// js/data.js - Dynamisk loading via manifest.json + fallback
// Opdateret med mere robust håndtering af _detailsLoaded

let politicians = [];
let networkIndex = {};

function extractYearFromDate(dateStr) {
  if (dateStr == null || dateStr === '') return null;
  if (typeof dateStr === 'number') return String(dateStr);
  const years = String(dateStr).match(/\d{4}/g);
  if (!years || !years.length) return null;
  return years[years.length - 1];
}

function normalizeScandal(scandal) {
  if (!scandal) return scandal;
  const year = scandal.year || extractYearFromDate(scandal.date) || null;
  const severity = scandal.ourSeverity ?? scandal.severity ?? 3;
  return {
    ...scandal,
    year,
    shortDesc: scandal.shortDesc || scandal.description || scandal.longDesc || '',
    severity,
    ourSeverity: scandal.ourSeverity ?? scandal.severity ?? severity
  };
}

async function loadPoliticians() {
  try {
    let politicianSlugs = [];

    try {
      const manifestRes = await fetch('data/politicians/manifest.json');
      if (manifestRes.ok) {
        const manifest = await manifestRes.json();
        if (manifest.politicians && Array.isArray(manifest.politicians)) {
          politicianSlugs = manifest.politicians;
        }
      }
    } catch (e) {}

    if (politicianSlugs.length === 0) {
      politicianSlugs = [
        'mette-frederiksen', 'inger-stoejberg', 'morten-oestergaard', 'helle-thorning-schmidt',
        'lars-loekke-rasmussen', 'pia-kjaersgaard', 'anders-fogh-rasmussen', 'morten-messerschmidt',
        'kristian-thulesen-dahl', 'soeren-pape-poulsen', 'uffe-elbaek', 'claus-hjort-frederiksen',
        'pernille-skipper', 'pernille-vermund', 'alex-vanopslagh', 'ida-auken',
        'nicolai-wammen', 'troels-lund-poulsen', 'sophie-loehde', 'pia-olsen-dyhr',
        'henrik-dahl', 'mona-juul', 'mattias-tesfaye', 'rosa-lund',
        'magnus-heunicke', 'dan-jorgensen', 'ane-halsboe-jorgensen', 'stephanie-lose',
        'karina-lorentzen', 'mette-abildgaard', 'jeppe-bruus', 'marcus-knuth',
        'rasmus-stoklund', 'morten-boedskov', 'christine-egelund', 'jakob-engel-schmidt',
        'mai-mercado', 'pelle-dragsted', 'peter-skaarup', 'jakob-ellemann-jensen'
      ];
    }

    const corePromises = politicianSlugs.map(slug => 
      fetch(`data/politicians/${slug}.json`).then(r => r.ok ? r.json() : null)
    );
    const cores = (await Promise.all(corePromises)).filter(Boolean);

    politicians = cores.map(core => ({
      ...core,
      scandals: [],
      affiliations: [],
      economicSupport: [],
      brokenPromises: [],
      _detailsLoaded: false
    }));

    window.politicians = politicians;
    return politicians;
  } catch (error) {
    console.error('Fejl ved loading:', error);
    return [];
  }
}

async function loadPoliticianDetails(politician) {
  if (!politician) return politician;

  if (politician._detailsLoaded) {
    return politician;
  }

  const slug = politician.name.toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-');

  let scandals = [];
  let affiliations = [];
  let brokenPromises = [];
  let economicSupport = [];

  try {
    const manifestRes = await fetch(`data/scandals/${slug}/manifest.json`);
    if (manifestRes.ok) {
      const manifest = await manifestRes.json();
      if (manifest.scandals && Array.isArray(manifest.scandals)) {
        const scandalPromises = manifest.scandals.map(filename =>
          fetch(`data/scandals/${slug}/${filename}`).then(r => r.ok ? r.json() : null)
        );
        const loaded = await Promise.all(scandalPromises);
        scandals = loaded.filter(Boolean).map(normalizeScandal);
      }
    }
  } catch (e) {}

  if (scandals.length === 0) {
    try {
      const s = await fetch(`data/scandals/${slug}.json`);
      if (s.ok) {
        const sData = await s.json();
        const raw = sData.scandals || (Array.isArray(sData) ? sData : []);
        scandals = raw.filter(Boolean).map(normalizeScandal);
      }
    } catch (e) {}
  }

  try {
    const a = await fetch(`data/affiliations/${slug}.json`);
    if (a.ok) {
      const aData = await a.json();
      affiliations = aData.affiliations || aData || [];
    }
  } catch (e) {}

  try {
    const bpManifestRes = await fetch(`data/broken-promises/${slug}/manifest.json`);
    if (bpManifestRes.ok) {
      const bpManifest = await bpManifestRes.json();
      if (bpManifest.brokenPromises && Array.isArray(bpManifest.brokenPromises)) {
        const promisePromises = bpManifest.brokenPromises.map(filename =>
          fetch(`data/broken-promises/${slug}/${filename}`).then(r => r.ok ? r.json() : null)
        );
        const loaded = await Promise.all(promisePromises);
        brokenPromises = loaded.filter(Boolean);
      }
    }
  } catch (e) {}

  if (brokenPromises.length === 0) {
    try {
      const b = await fetch(`data/broken-promises/${slug}.json`);
      if (b.ok) {
        const bData = await b.json();
        brokenPromises = bData.brokenPromises || [];
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

  brokenPromises = brokenPromises.map(bp => ({
    ...bp,
    whatHappened: bp.whatHappened
      || bp.description
      || bp.whatShouldHaveHappened
      || bp.shortDesc
      || bp.longDesc
      || ''
  }));

  politician.scandals = scandals;
  politician.affiliations = affiliations;
  politician.brokenPromises = brokenPromises;
  politician.economicSupport = economicSupport;
  politician._detailsLoaded = true;

  return politician;
}

window.loadPoliticianDetails = loadPoliticianDetails;

async function loadAllPoliticianDetails() {
  const pols = (typeof politicians !== 'undefined' && politicians.length) 
    ? politicians 
    : (window.politicians || []);

  if (!pols.length) return;

  await Promise.allSettled(
    pols.map(async (p) => {
      if (!p._detailsLoaded) {
        try {
          await loadPoliticianDetails(p);
        } catch (e) {
          p._detailsLoaded = true;
        }
      }
    })
  );
}

window.loadAllPoliticianDetails = loadAllPoliticianDetails;