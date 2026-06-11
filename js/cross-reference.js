// js/cross-reference.js - Krydsreferencer mellem politikere (netværk, donorer, skandaler)

const NETWORK_CANONICAL = {
  'young global leaders': 'Young Global Leaders',
  'young global leader': 'Young Global Leaders',
  'ygl': 'Young Global Leaders',
  'bilderberg meetings': 'Bilderberg Meetings',
  'bilderberg group': 'Bilderberg Meetings',
  'bilderberg-gruppen': 'Bilderberg Meetings',
  'bilderberg': 'Bilderberg Meetings',
  'world economic forum': 'World Economic Forum (WEF)',
  'world economic forum (wef)': 'World Economic Forum (WEF)',
  'wef': 'World Economic Forum (WEF)',
  'global shapers hub': 'Global Shapers Hub',
  'global shapers': 'Global Shapers Hub'
};

const SCANDAL_TOPIC_KEYWORDS = {
  'young-global-leaders': ['young global leader', 'young global leaders'],
  'wef': ['world economic forum', 'weforum', 'wef-artikel', 'wef '],
  'bilderberg': ['bilderberg'],
  'mink': ['minkskandal', 'mink-afliv', 'minkgrave', 'minkkommission', 'mink '],
  'party-funding': ['partistøtte', 'partistotte', 'donor', 'donation', 'gennemsigtighed', 'penge til folketing', 'fond og økonomiske'],
  'nato': ['nato', 'ukraine', 'forsvarsbudget', 'forsvarspolitik', 'forsvarsforlig', 'militære anskaffelser', 'militaer-anskaffelser'],
  'iraq-war': ['irak-krigen', 'irak-kr', 'invasion af irak', 'irak '],
  'tax-scandal': ['skattesag', 'skattesnyd', 'skatteforhold', 'skattevæsen', 'skattevaesen', 'fejludbetaling', 'skattereform'],
  'immigration': ['udlænding', 'udlaending', 'indvandring', 'asylpar', 'integrationspolitik', 'udvisning', 'islam og integration', 'rigsret'],
  'climate-policy': ['klimapolitik', 'klimaminister', 'grøn omstilling', 'groen omstilling', 'klimamål', 'klimamaal', 'kvælstof', 'kvaelstof'],
  'eu-politics': ['europa-parlament', 'eu-parlament', 'eu parlament', 'europaparlament', 'mep', 'eu-midler', 'eu fond'],
  'bank-crisis': ['bankpakke', 'finanskrise', 'statsgaranti til banker'],
  'corruption-power': ['magtmisbrug', 'toejskandal', 'tøjskandal', 'tøjs-sag'],
  'welfare-reform': ['velfærdsreform', 'velfaerdsreform', 'kontanthjælp', 'kontanthjaelp', 'beskæftigelsesreform']
};

const TOPIC_TO_NETWORK = {
  'young-global-leaders': 'Young Global Leaders',
  'wef': 'World Economic Forum (WEF)',
  'bilderberg': 'Bilderberg Meetings'
};

let detailsLoadPromise = null;

function normalizeText(value) {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00e6/g, 'ae')
    .replace(/\u00f8/g, 'oe')
    .replace(/\u00e5/g, 'aa')
    .trim();
}

function normalizeNetworkName(name, organization) {
  const candidates = [normalizeText(name), normalizeText(organization)];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (NETWORK_CANONICAL[candidate]) return NETWORK_CANONICAL[candidate];
    for (const [alias, canonical] of Object.entries(NETWORK_CANONICAL)) {
      if (candidate.includes(alias) || alias.includes(candidate)) {
        return canonical;
      }
    }
  }
  return (name || organization || '').toString().trim();
}

function normalizeDonorName(name) {
  return normalizeText(name);
}

function findPoliticianByName(name) {
  if (!window.politicians || !name) return null;
  const target = normalizeText(name);
  return window.politicians.find(p => normalizeText(p.name) === target) || null;
}

function detectScandalTopics(scandal) {
  const topics = new Set();
  if (!scandal) return [];

  if (Array.isArray(scandal.relatedTopics)) {
    scandal.relatedTopics.forEach(topic => topics.add(topic));
  }

  const haystack = normalizeText([
    scandal.title,
    scandal.shortDesc,
    scandal.longDesc,
    scandal.description
  ].filter(Boolean).join(' '));

  Object.entries(SCANDAL_TOPIC_KEYWORDS).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => haystack.includes(keyword))) {
      topics.add(topic);
    }
  });

  return Array.from(topics);
}

const DOMESTIC_NETWORK_NAMES = new Set([
  'folketinget',
  'socialdemokratiet',
  'venstre',
  'danmarksdemokraterne',
  'radikale venstre',
  'moderaterne',
  'dansk folkeparti',
  'det konservative folkeparti',
  'enhedslisten',
  'nye borgerlige',
  'liberal alliance',
  'alternativet',
  'alternativet / uafhaengig',
  'frie gronne',
  'socialistisk folkeparti',
  'dsu',
  'danmarks socialdemokratiske ungdom',
  'ungdomsbureauet',
  'statsministeriet',
  'ministeriet'
]);

function isDomesticNetworkCandidate(candidate) {
  if (!candidate) return false;
  if (candidate.includes('folketinget')) return true;
  if (DOMESTIC_NETWORK_NAMES.has(candidate)) return true;
  for (const domestic of DOMESTIC_NETWORK_NAMES) {
    if (
      candidate === domestic ||
      candidate.startsWith(domestic + ' ') ||
      candidate.startsWith(domestic + '(')
    ) {
      return true;
    }
  }
  return false;
}

function isInternationalNetwork(name, organization = '') {
  const candidates = [name, organization].map(normalizeText).filter(Boolean);
  for (const candidate of candidates) {
    if (isDomesticNetworkCandidate(candidate)) return false;
  }
  return Boolean((name || organization || '').toString().trim());
}

function filterInternationalAffiliations(affiliations) {
  if (!Array.isArray(affiliations)) return [];
  return affiliations.filter(aff => isInternationalNetwork(aff.name, aff.organization));
}

function buildCrossReferenceIndices() {
  const networkIndex = {};
  const donorIndex = {};
  const scandalTopicIndex = {};

  (window.politicians || []).forEach(politician => {
    (politician.affiliations || []).forEach(aff => {
      if (!isInternationalNetwork(aff.name, aff.organization)) return;

      const canonical = normalizeNetworkName(aff.name, aff.organization);
      if (!canonical || !isInternationalNetwork(canonical)) return;
      if (!networkIndex[canonical]) networkIndex[canonical] = [];

      const exists = networkIndex[canonical].some(entry => entry.id === politician.id);
      if (!exists) {
        networkIndex[canonical].push({
          id: politician.id,
          name: politician.name,
          party: politician.party,
          year: aff.year || '',
          role: aff.role || ''
        });
      }
    });

    (politician.economicSupport || []).forEach(donation => {
      const donorKey = normalizeDonorName(donation.name);
      if (!donorKey) return;
      if (!donorIndex[donorKey]) donorIndex[donorKey] = [];

      donorIndex[donorKey].push({
        id: politician.id,
        name: politician.name,
        party: politician.party,
        amount: donation.amount,
        type: donation.type,
        year: donation.year || '-',
        source: donation.source,
        donorName: donation.name
      });
    });

    (politician.scandals || []).forEach(scandal => {
      detectScandalTopics(scandal).forEach(topic => {
        if (!scandalTopicIndex[topic]) scandalTopicIndex[topic] = [];
        scandalTopicIndex[topic].push({
          politicianId: politician.id,
          politicianName: politician.name,
          party: politician.party,
          scandalId: scandal.id || scandal.title,
          scandalTitle: scandal.title
        });
      });
    });
  });

  window.networkIndex = networkIndex;
  window.donorIndex = donorIndex;
  window.scandalTopicIndex = scandalTopicIndex;
}

async function ensureAllDetailsLoaded() {
  if (!window.politicians || !window.loadPoliticianDetails) {
    buildCrossReferenceIndices();
    return;
  }

  const allLoaded = window.politicians.every(p => p._detailsLoaded);
  if (allLoaded) {
    buildCrossReferenceIndices();
    return;
  }

  if (!detailsLoadPromise) {
    if (typeof window.loadAllPoliticianDetails === 'function') {
      detailsLoadPromise = window.loadAllPoliticianDetails();
    } else {
      detailsLoadPromise = Promise.all(
        window.politicians.map(p => window.loadPoliticianDetails(p).catch(() => p))
      );
    }
    detailsLoadPromise = detailsLoadPromise.then(() => {
      buildCrossReferenceIndices();
    });
  }

  await detailsLoadPromise;
}

function findPoliticiansByNetwork(networkName, organization) {
  const canonical = normalizeNetworkName(networkName, organization);
  const results = new Map();

  (window.networkIndex && window.networkIndex[canonical] || []).forEach(entry => {
    results.set(entry.id, entry);
  });

  (window.politicians || []).forEach(politician => {
    (politician.affiliations || []).forEach(aff => {
      const affCanonical = normalizeNetworkName(aff.name, aff.organization);
      if (affCanonical === canonical) {
        results.set(politician.id, {
          id: politician.id,
          name: politician.name,
          party: politician.party,
          year: aff.year || '',
          role: aff.role || ''
        });
      }
    });
  });

  return Array.from(results.values()).sort((a, b) => a.name.localeCompare(b.name, 'da'));
}

function findPoliticiansByDonor(donorName) {
  const normalized = normalizeDonorName(donorName);
  const results = new Map();

  const exactMatches = window.donorIndex && window.donorIndex[normalized];
  if (exactMatches) {
    exactMatches.forEach(entry => results.set(`${entry.id}-${entry.year}`, entry));
  }

  (window.politicians || []).forEach(politician => {
    (politician.economicSupport || []).forEach(donation => {
      const donationKey = normalizeDonorName(donation.name);
      if (donationKey === normalized || donationKey.includes(normalized) || normalized.includes(donationKey)) {
        results.set(`${politician.id}-${donation.year || ''}`, {
          id: politician.id,
          name: politician.name,
          party: politician.party,
          amount: donation.amount,
          type: donation.type,
          year: donation.year || '-',
          source: donation.source,
          donorName: donation.name
        });
      }
    });
  });

  return Array.from(results.values()).sort((a, b) => a.name.localeCompare(b.name, 'da'));
}

function findRelatedPoliticiansForScandal(politician, scandal) {
  const results = new Map();
  if (!politician || !scandal) return [];

  const addResult = (entry, reason) => {
    if (!entry || entry.id === politician.id) return;
    const existing = results.get(entry.id);
    if (!existing) {
      results.set(entry.id, {
        id: entry.id,
        name: entry.name,
        party: entry.party,
        reason,
        scandalTitle: entry.scandalTitle || ''
      });
    }
  };

  (scandal.otherPoliticians || []).forEach(name => {
    const match = findPoliticianByName(name);
    if (match) addResult(match, 'Nævnt i sagen');
  });

  detectScandalTopics(scandal).forEach(topic => {
    const networkName = TOPIC_TO_NETWORK[topic];
    if (networkName) {
      findPoliticiansByNetwork(networkName).forEach(entry => {
        addResult(entry, `Samme netværk: ${networkName}`);
      });
    }

    (window.scandalTopicIndex && window.scandalTopicIndex[topic] || []).forEach(entry => {
      if (entry.politicianId !== politician.id) {
        addResult(
          {
            id: entry.politicianId,
            name: entry.politicianName,
            party: entry.party,
            scandalTitle: entry.scandalTitle
          },
          `Relateret skandale: ${entry.scandalTitle}`
        );
      }
    });
  });

  return Array.from(results.values()).sort((a, b) => a.name.localeCompare(b.name, 'da'));
}

function getInternationalNetworkEntries(networkIndex = window.networkIndex) {
  return Object.entries(networkIndex || {})
    .filter(([name]) => isInternationalNetwork(name))
    .map(([name, politicians]) => ({ name, politicians }));
}

window.normalizeNetworkName = normalizeNetworkName;
window.isInternationalNetwork = isInternationalNetwork;
window.filterInternationalAffiliations = filterInternationalAffiliations;
window.getInternationalNetworkEntries = getInternationalNetworkEntries;
window.buildCrossReferenceIndices = buildCrossReferenceIndices;
window.ensureAllDetailsLoaded = ensureAllDetailsLoaded;
window.findPoliticiansByNetwork = findPoliticiansByNetwork;
window.findPoliticiansByDonor = findPoliticiansByDonor;
window.findRelatedPoliticiansForScandal = findRelatedPoliticiansForScandal;
window.detectScandalTopics = detectScandalTopics;