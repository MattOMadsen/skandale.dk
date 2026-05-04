// js/data.js - Data og indlæsning
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
  ];

  try {
    const responses = await Promise.all(politicianFiles.map(file => fetch(file)));
    politicians = await Promise.all(responses.map(res => res.json()));
    console.log('%c[Skandale.dk] Alle 12 politikere loaded succesfuldt', 'color:#10b981');
  } catch (error) {
    console.error('Kunne ikke loade data:', error);
  }
}