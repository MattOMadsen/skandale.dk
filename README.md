# Skandale.dk v6.0 – Per-politiker JSON Split

**Dansk politisk skandale-oversigt med medier, retfærdighedsanalyse og interaktiv afstemning.**

Dette er den **optimale split-version** (v6.0) hvor hver politiker har sin egen JSON-fil. Det gør det ekstremt nemt at redigere, tilføje eller fjerne politikere uden at røre den centrale kode.

## Struktur
skandale.dk-v6/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js          ← Loader automatisk alle JSON-filer
├── data/
│   └── politicians/
│       ├── mette-frederiksen.json
│       ├── inger-stoejberg.json
│       ├── morten-oestergaard.json
│       └── helle-thorning-schmidt.json
└── README.md