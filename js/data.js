// js/data.js - Ny version med split data struktur

let politicians = [];

async function loadPoliticians() {
  try {
    // Hent alle centrale datafiler
    const [
      politiciansRes,
      scandalsRes,
      brokenPromisesRes,
      economicSupportRes,
      affiliationsRes
    ] = await Promise.all([
      fetch('data/politicians.json'),
      fetch('data/scandals.json'),
      fetch('data/brokenPromises.json'),
      fetch('data/economicSupport.json'),
      fetch('data/affiliations.json')
    ]);

    const politiciansData = await politiciansRes.json();
    const allScandals = await scandalsRes.json();
    const allBrokenPromises = await brokenPromisesRes.json();
    const allEconomicSupport = await economicSupportRes.json();
    const allAffiliations = await affiliationsRes.json();

    // Saml data til hver politiker
    politicians = politiciansData.map(politician => {
      return {
        ...politician,
        scandals: allScandals.filter(s => s.politicianId === politician.id),
        brokenPromises: allBrokenPromises.filter(b => b.politicianId === politician.id),
        economicSupport: allEconomicSupport.filter(e => e.politicianId === politician.id),
        affiliations: allAffiliations.filter(a => a.politicianId === politician.id)
      };
    });

    console.log('%c[Skandale.dk] Alle 12 politikere loaded succesfuldt (ny struktur)', 'color:#10b981');
  } catch (error) {
    console.error('Kunne ikke loade data:', error);
  }
}