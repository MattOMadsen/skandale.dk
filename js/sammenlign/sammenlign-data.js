// js/sammenlign/sammenlign-data.js
// Data-håndtering – loader dynamisk fra manifest.json (alle politikere)

const PARTY_SHORT = {
  'Socialdemokratiet': 'S',
  'Danmarksdemokraterne': 'DD',
  'Radikale Venstre': 'RV',
  'Moderaterne': 'M',
  'Dansk Folkeparti': 'DF',
  'Venstre': 'V',
  'Det Konservative Folkeparti': 'K',
  'Enhedslisten': 'EL',
  'Nye Borgerlige': 'NB',
  'Liberal Alliance': 'LA',
  'Alternativet / Uafhængig': 'Å',
  'Frie Grønne': 'FG',
  'Socialistisk Folkeparti': 'SF'
};

const SammenlignData = {
  POLITICIANS: [],
  loadedDataCache: {},
  donorToPoliticians: {},
  networkToPoliticians: {},

  async fetchJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[SammenlignData] Kunne ikke hente ${path}:`, e);
      return null;
    }
  },

  slugFromName(name) {
    return name.toLowerCase()
      .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
      .replace(/[^a-z0-9]+/g, '-');
  },

  mapScandalItem(item) {
    return {
      id: item.id,
      title: item.title || item.id,
      severity: item.ourSeverity || item.severity || 3,
      shortDesc: item.shortDesc || item.description || '',
      longDesc: item.longDesc || item.description || '',
      sources: item.mediaLinks || item.sources || [],
      consequences: item.consequences || '',
      whatShouldHaveHappened: item.whatShouldHaveHappened || null
    };
  },

  async loadScandals(slug) {
    const manifest = await this.fetchJSON(`data/scandals/${slug}/manifest.json`);
    if (manifest?.scandals && Array.isArray(manifest.scandals)) {
      const items = await Promise.all(
        manifest.scandals.map(f => this.fetchJSON(`data/scandals/${slug}/${f}`))
      );
      return items.filter(Boolean).map(item => this.mapScandalItem(item));
    }

    const single = await this.fetchJSON(`data/scandals/${slug}.json`);
    if (single) {
      const items = single.scandals || (Array.isArray(single) ? single : []);
      return items.filter(Boolean).map(item => this.mapScandalItem(item));
    }

    return [];
  },

  async loadBrokenPromises(slug) {
    const manifest = await this.fetchJSON(`data/broken-promises/${slug}/manifest.json`);
    if (manifest?.brokenPromises && Array.isArray(manifest.brokenPromises)) {
      const items = await Promise.all(
        manifest.brokenPromises.map(f => this.fetchJSON(`data/broken-promises/${slug}/${f}`))
      );
      return items.filter(Boolean).map(item => ({
        title: item.title || 'Brudt løfte',
        status: item.status || 'Brudt',
        desc: item.whatHappened || item.description || item.shortDesc || item.longDesc || '',
        sources: item.sources || []
      }));
    }

    const single = await this.fetchJSON(`data/broken-promises/${slug}.json`);
    if (single?.brokenPromises) {
      return single.brokenPromises.map(item => ({
        title: item.title || 'Brudt løfte',
        status: item.status || 'Brudt',
        desc: item.whatHappened || item.description || item.shortDesc || item.longDesc || '',
        sources: item.sources || []
      }));
    }

    return [];
  },

  async loadEconomicSupport(slug) {
    const data = await this.fetchJSON(`data/economic-support/${slug}.json`);
    return (data?.donations || []).map(d => ({
      name: d.name,
      year: d.year || '',
      amount: d.amount || ''
    }));
  },

  async loadAffiliations(slug) {
    const data = await this.fetchJSON(`data/affiliations/${slug}.json`);
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.affiliations) return data.affiliations;
    return [];
  },

  async loadDetailedData(slug) {
    if (this.loadedDataCache[slug]) return this.loadedDataCache[slug];
    const [scandals, promises, support, networks] = await Promise.all([
      this.loadScandals(slug),
      this.loadBrokenPromises(slug),
      this.loadEconomicSupport(slug),
      this.loadAffiliations(slug)
    ]);
    const result = { scandals, promises, support, networks };
    this.loadedDataCache[slug] = result;
    return result;
  },

  async buildPoliticianEntry(slug) {
    const core = await this.fetchJSON(`data/politicians/${slug}.json`);
    if (!core) return null;

    const data = await this.loadDetailedData(slug);
    const scandals = data.scandals || [];
    const severities = scandals.map(s => s.severity || 3);
    const avgSeverity = severities.length
      ? Math.round((severities.reduce((a, b) => a + b, 0) / severities.length) * 10) / 10
      : 0;

    return {
      slug,
      id: core.id,
      name: core.name,
      party: core.party,
      partyShort: PARTY_SHORT[core.party] || core.party.substring(0, 2).toUpperCase(),
      color: core.partyColor || core.avatarColor || '#C8102E',
      initials: core.initials || core.name.split(' ').map(n => n[0]).join(''),
      role: core.role || '',
      image: core.image || null,
      scandalCount: scandals.length,
      avgSeverity,
      brokenPromises: (data.promises || []).length,
      donorCount: (data.support || []).length,
      networkCount: (data.networks || []).length
    };
  },

  async loadPoliticians() {
    let slugs = [];
    if (window.SiteStats) {
      slugs = await SiteStats.getPoliticianSlugs();
    } else {
      const manifest = await this.fetchJSON('data/politicians/manifest.json');
      slugs = manifest?.politicians || [];
    }

    if (!slugs.length) {
      console.warn('[SammenlignData] Ingen politikere i manifest');
      this.POLITICIANS = [];
      return this.POLITICIANS;
    }

    const entries = await Promise.all(slugs.map(slug => this.buildPoliticianEntry(slug)));
    this.POLITICIANS = entries.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name, 'da'));
    return this.POLITICIANS;
  },

  async buildCrossReferenceIndex() {
    this.donorToPoliticians = {};
    this.networkToPoliticians = {};

    for (const pol of this.POLITICIANS) {
      const supportData = await this.fetchJSON(`data/economic-support/${pol.slug}.json`);
      if (supportData?.donations) {
        supportData.donations.forEach(d => {
          if (!this.donorToPoliticians[d.name]) this.donorToPoliticians[d.name] = [];
          if (!this.donorToPoliticians[d.name].includes(pol.name)) {
            this.donorToPoliticians[d.name].push(pol.name);
          }
        });
      }
    }

    for (const pol of this.POLITICIANS) {
      const affData = await this.fetchJSON(`data/affiliations/${pol.slug}.json`);
      if (affData?.affiliations) {
        affData.affiliations.forEach(a => {
          const key = a.name || a.organization;
          if (key) {
            if (!this.networkToPoliticians[key]) this.networkToPoliticians[key] = [];
            if (!this.networkToPoliticians[key].includes(pol.name)) {
              this.networkToPoliticians[key].push(pol.name);
            }
          }
        });
      }
    }
  }
};

window.SammenlignData = SammenlignData;