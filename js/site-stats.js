// js/site-stats.js – fælles data-loading og live site-meta

const SiteStats = {
  PARTY_SHORT: {
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
  },

  async fetchJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[SiteStats] Kunne ikke hente ${path}:`, e);
      return null;
    }
  },

  formatDaDate(date = new Date()) {
    return date.toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  },

  slugFromName(name) {
    return name.toLowerCase()
      .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa')
      .replace(/[^a-z0-9]+/g, '-');
  },

  extractYearFromDate(dateStr) {
    if (dateStr == null || dateStr === '') return null;
    if (typeof dateStr === 'number') return String(dateStr);
    const years = String(dateStr).match(/\d{4}/g);
    if (!years || !years.length) return null;
    return years[years.length - 1];
  },

  normalizeScandal(scandal) {
    if (!scandal) return scandal;
    const year = scandal.year || this.extractYearFromDate(scandal.date) || null;
    const severity = scandal.ourSeverity ?? scandal.severity ?? 3;
    return {
      ...scandal,
      year,
      shortDesc: scandal.shortDesc || scandal.description || scandal.longDesc || '',
      severity,
      ourSeverity: scandal.ourSeverity ?? scandal.severity ?? severity
    };
  },

  normalizeBrokenPromise(bp) {
    if (!bp) return bp;
    return {
      ...bp,
      whatHappened: bp.whatHappened
        || bp.description
        || bp.whatShouldHaveHappened
        || bp.shortDesc
        || bp.longDesc
        || ''
    };
  },

  async getPoliticianSlugs() {
    const manifest = await this.fetchJSON('data/politicians/manifest.json');
    return manifest?.politicians || [];
  },

  async loadPoliticianCore(slug) {
    return this.fetchJSON(`data/politicians/${slug}.json`);
  },

  async loadPoliticianCores(slugs) {
    const cores = await Promise.all(slugs.map(slug => this.loadPoliticianCore(slug)));
    return cores.filter(Boolean);
  },

  async loadScandalsForSlug(slug) {
    const manifest = await this.fetchJSON(`data/scandals/${slug}/manifest.json`);
    if (manifest?.scandals && Array.isArray(manifest.scandals)) {
      const items = await Promise.all(
        manifest.scandals.map(filename => this.fetchJSON(`data/scandals/${slug}/${filename}`))
      );
      return items.filter(Boolean).map(item => this.normalizeScandal(item));
    }

    const single = await this.fetchJSON(`data/scandals/${slug}.json`);
    if (single?.scandals) {
      return single.scandals.filter(Boolean).map(item => this.normalizeScandal(item));
    }
    if (Array.isArray(single)) {
      return single.filter(Boolean).map(item => this.normalizeScandal(item));
    }
    return [];
  },

  async loadBrokenPromisesForSlug(slug) {
    const manifest = await this.fetchJSON(`data/broken-promises/${slug}/manifest.json`);
    if (manifest?.brokenPromises && Array.isArray(manifest.brokenPromises)) {
      const items = await Promise.all(
        manifest.brokenPromises.map(filename => this.fetchJSON(`data/broken-promises/${slug}/${filename}`))
      );
      return items.filter(Boolean).map(item => this.normalizeBrokenPromise(item));
    }

    const single = await this.fetchJSON(`data/broken-promises/${slug}.json`);
    if (single?.brokenPromises) {
      return single.brokenPromises.map(item => this.normalizeBrokenPromise(item));
    }
    return [];
  },

  async loadAffiliationsForSlug(slug) {
    const data = await this.fetchJSON(`data/affiliations/${slug}.json`);
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.affiliations || [];
  },

  async loadEconomicSupportForSlug(slug) {
    const data = await this.fetchJSON(`data/economic-support/${slug}.json`);
    return data?.donations || data?.economicSupport || [];
  },

  metaFromCore(slug, core) {
    if (!core) {
      return { name: slug, party: 'Ukendt', partyShort: '?', color: '#6B7280' };
    }
    return {
      name: core.name || slug,
      party: core.party || 'Ukendt',
      partyShort: this.PARTY_SHORT[core.party] || '?',
      color: core.partyColor || core.avatarColor || '#6B7280'
    };
  },

  async aggregateCounts() {
    const slugs = await this.getPoliticianSlugs();
    const cores = await this.loadPoliticianCores(slugs);

    const [scandalLists, promiseLists] = await Promise.all([
      Promise.all(slugs.map(slug => this.loadScandalsForSlug(slug))),
      Promise.all(slugs.map(slug => this.loadBrokenPromisesForSlug(slug)))
    ]);

    let totalScandals = 0;
    let totalBrokenPromises = 0;
    let totalSeverity = 0;
    let severityCount = 0;

    scandalLists.forEach(scandals => {
      totalScandals += scandals.length;
      scandals.forEach(s => {
        const sev = s.ourSeverity || s.severity || 0;
        if (sev > 0) {
          totalSeverity += sev;
          severityCount++;
        }
      });
    });

    promiseLists.forEach(promises => {
      totalBrokenPromises += promises.length;
    });

    const partyBreakdown = {};
    cores.forEach(core => {
      partyBreakdown[core.party] = (partyBreakdown[core.party] || 0) + 1;
    });

    return {
      slugCount: slugs.length,
      inFolketinget: cores.filter(c => c.inFolketinget === true).length,
      partyCount: Object.keys(partyBreakdown).length,
      partyBreakdown,
      totalScandals,
      totalBrokenPromises,
      avgSeverity: severityCount > 0 ? (totalSeverity / severityCount).toFixed(1) : '0.0'
    };
  },

  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  },

  renderPartyBreakdown(containerId, partyBreakdown) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const sorted = Object.entries(partyBreakdown).sort((a, b) => b[1] - a[1]);
    el.innerHTML = sorted.map(([party, count]) => {
      const short = this.PARTY_SHORT[party] || party.substring(0, 2);
      return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300">${short}: ${count}</span>`;
    }).join('');
  },

  async applySiteMeta(options = {}) {
    const slugs = await this.getPoliticianSlugs();
    const dateLabel = `Opdateret ${this.formatDaDate()}`;

    this.setText('site-updated-label', dateLabel);
    this.setText('om-last-updated', this.formatDaDate());

    if (!slugs.length) return null;

    if (options.full) {
      const stats = await this.aggregateCounts();
      this.setText('om-politician-count', `${stats.slugCount} politikere`);
      this.setText('om-folketing-count', `${stats.inFolketinget} i Folketinget`);
      this.setText('om-party-count', `${stats.partyCount} partier`);
      this.setText('om-party-count-stat', stats.partyCount);
      this.setText('om-scandal-count', stats.totalScandals);
      this.setText('om-promise-count', stats.totalBrokenPromises);
      this.setText('om-avg-severity', stats.avgSeverity);
      this.setText('kontakt-politician-count', `${stats.slugCount} politikere i databasen`);
      this.renderPartyBreakdown('om-party-breakdown', stats.partyBreakdown);
      return stats;
    }

    const cores = await this.loadPoliticianCores(slugs);
    const partyBreakdown = {};
    cores.forEach(core => {
      partyBreakdown[core.party] = (partyBreakdown[core.party] || 0) + 1;
    });

    this.setText('om-politician-count', `${slugs.length} politikere`);
    this.setText('kontakt-politician-count', `${slugs.length} politikere i databasen`);
    this.setText('om-folketing-count', `${cores.filter(c => c.inFolketinget === true).length} i Folketinget`);
    this.setText('om-party-count', `${Object.keys(partyBreakdown).length} partier`);
    this.setText('om-party-count-stat', Object.keys(partyBreakdown).length);
    this.renderPartyBreakdown('om-party-breakdown', partyBreakdown);

    return { slugCount: slugs.length, partyBreakdown };
  }
};

window.SiteStats = SiteStats;