// js/sammenlign/sammenlign-data.js
// Data-håndtering, loading og cross-reference index for sammenlign-siden
// Fuldt modulært – ingen side-effekter på globalt scope ud over window.

const SammenlignData = {
    POLITICIANS: [
        { slug: "mette-frederiksen", name: "Mette Frederiksen", party: "Socialdemokratiet", partyShort: "S", color: "#E30613", initials: "MF", role: "Statsminister", scandalCount: 6, avgSeverity: 4.2, brokenPromises: 7, donorCount: 14, networkCount: 5 },
        { slug: "inger-stoejberg", name: "Inger Støjberg", party: "Danmarksdemokraterne", partyShort: "DD", color: "#00A651", initials: "IS", role: "Formand & MF", scandalCount: 7, avgSeverity: 4.1, brokenPromises: 3, donorCount: 9, networkCount: 2 },
        { slug: "morten-oestergaard", name: "Morten Østergaard", party: "Radikale Venstre", partyShort: "RV", color: "#7B2D8E", initials: "MØ", role: "Tidligere politisk leder", scandalCount: 4, avgSeverity: 3.0, brokenPromises: 2, donorCount: 7, networkCount: 4 },
        { slug: "helle-thorning-schmidt", name: "Helle Thorning-Schmidt", party: "Socialdemokratiet", partyShort: "S", color: "#E30613", initials: "HTS", role: "Tidligere statsminister", scandalCount: 5, avgSeverity: 2.8, brokenPromises: 4, donorCount: 11, networkCount: 6 },
        { slug: "lars-loekke-rasmussen", name: "Lars Løkke Rasmussen", party: "Moderaterne", partyShort: "M", color: "#00A0DC", initials: "LLR", role: "Tidligere statsminister, MF", scandalCount: 6, avgSeverity: 3.2, brokenPromises: 5, donorCount: 13, networkCount: 7 },
        { slug: "pia-kjaersgaard", name: "Pia Kjærsgaard", party: "Dansk Folkeparti", partyShort: "DF", color: "#F7B32B", initials: "PK", role: "MF, tidligere formand", scandalCount: 4, avgSeverity: 2.8, brokenPromises: 3, donorCount: 8, networkCount: 3 },
        { slug: "anders-fogh-rasmussen", name: "Anders Fogh Rasmussen", party: "Venstre", partyShort: "V", color: "#0066B3", initials: "AFR", role: "Tidligere statsminister, NATO-generalsekretær", scandalCount: 4, avgSeverity: 2.9, brokenPromises: 3, donorCount: 10, networkCount: 8 },
        { slug: "morten-messerschmidt", name: "Morten Messerschmidt", party: "Dansk Folkeparti", partyShort: "DF", color: "#F7B32B", initials: "MM", role: "MF, tidligere næstformand", scandalCount: 5, avgSeverity: 3.6, brokenPromises: 2, donorCount: 6, networkCount: 2 },
        { slug: "kristian-thulesen-dahl", name: "Kristian Thulesen Dahl", party: "Dansk Folkeparti", partyShort: "DF", color: "#F7B32B", initials: "KTD", role: "MF, tidligere formand", scandalCount: 3, avgSeverity: 2.5, brokenPromises: 2, donorCount: 5, networkCount: 1 },
        { slug: "soeren-pape-poulsen", name: "Søren Pape Poulsen", party: "Det Konservative Folkeparti", partyShort: "K", color: "#006633", initials: "SPP", role: "MF, tidligere formand", scandalCount: 3, avgSeverity: 2.7, brokenPromises: 2, donorCount: 7, networkCount: 3 },
        { slug: "uffe-elbaek", name: "Uffe Elbæk", party: "Alternativet / Uafhængig", partyShort: "Å", color: "#00A99D", initials: "UE", role: "MF, tidligere kulturminister", scandalCount: 2, avgSeverity: 2.0, brokenPromises: 3, donorCount: 4, networkCount: 5 },
        { slug: "claus-hjort-frederiksen", name: "Claus Hjort Frederiksen", party: "Venstre", partyShort: "V", color: "#0066B3", initials: "CHF", role: "MF, tidligere minister", scandalCount: 3, avgSeverity: 2.8, brokenPromises: 2, donorCount: 6, networkCount: 4 }
    ],

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

    async loadScandals(slug) {
        const manifest = await this.fetchJSON(`data/scandals/${slug}/manifest.json`);
        if (!manifest?.scandals) return [];
        const items = await Promise.all(manifest.scandals.map(f => this.fetchJSON(`data/scandals/${slug}/${f}`)));
        return items.filter(Boolean).map(item => ({
            id: item.id,
            title: item.title || item.id,
            severity: item.ourSeverity || 3,
            shortDesc: item.shortDesc || '',
            longDesc: item.longDesc || '',
            sources: item.mediaLinks || item.sources || [],
            consequences: item.consequences || '',
            whatShouldHaveHappened: item.whatShouldHaveHappened || null
        }));
    },

    async loadBrokenPromises(slug) {
        const manifest = await this.fetchJSON(`data/broken-promises/${slug}/manifest.json`);
        if (!manifest?.brokenPromises) return [];
        const items = await Promise.all(manifest.brokenPromises.map(f => this.fetchJSON(`data/broken-promises/${slug}/${f}`)));
        return items.filter(Boolean).map(item => ({
            title: item.title || 'Brudt løfte',
            status: item.status || 'Brudt',
            desc: item.whatHappened || item.description || item.shortDesc || item.longDesc || '',
            sources: item.sources || []
        }));
    },

    async loadEconomicSupport(slug) {
        const data = await this.fetchJSON(`data/economic-support/${slug}.json`);
        return (data?.donations || []).map(d => ({ name: d.name, year: d.year || '', amount: d.amount || '' }));
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

    async buildCrossReferenceIndex() {
        this.donorToPoliticians = {};
        this.networkToPoliticians = {};

        for (const pol of this.POLITICIANS) {
            const supportData = await this.fetchJSON(`data/economic-support/${pol.slug}.json`);
            if (supportData && supportData.donations) {
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
            if (affData && affData.affiliations) {
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

// Gør tilgængelig globalt til brug i andre moduler og HTML
window.SammenlignData = SammenlignData;