// js/data.js - Dynamisk loading via manifest.json (kræver site-stats.js)

let politicians = [];
let networkIndex = {};

async function loadPoliticians() {
  try {
    const politicianSlugs = window.SiteStats
      ? await SiteStats.getPoliticianSlugs()
      : [];

    if (politicianSlugs.length === 0) {
      console.warn('[data.js] Manifest ikke fundet – ingen politikere indlæst');
      politicians = [];
      window.politicians = politicians;
      return politicians;
    }

    const cores = await SiteStats.loadPoliticianCores(politicianSlugs);

    politicians = cores.map((core) => ({
      ...core,
      slug: core.slug || SiteStats.slugFromName(core.name),
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
    politicians = [];
    window.politicians = politicians;
    return politicians;
  }
}

async function loadPoliticianDetails(politician) {
  if (!politician) return politician;

  if (politician._detailsLoaded) {
    return politician;
  }

  if (!window.SiteStats) {
    politician._detailsLoaded = true;
    return politician;
  }

  const slug = politician.slug || SiteStats.slugFromName(politician.name);

  const [scandals, affiliations, brokenPromises, economicSupport] = await Promise.all([
    SiteStats.loadScandalsForSlug(slug),
    SiteStats.loadAffiliationsForSlug(slug),
    SiteStats.loadBrokenPromisesForSlug(slug),
    SiteStats.loadEconomicSupportForSlug(slug)
  ]);

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