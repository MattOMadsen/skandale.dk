# Skandale.dk Changelog

## v2.00.61 (18. maj 2026)
- Fuldt migreret alle 12 politikere til ny **granulær scandal-struktur**
  - Hver politiker har nu egen mappe: `data/scandals/[slug]/`
  - `manifest.json` + én JSON-fil pr. skandale
  - Meget nemmere at tilføje og vedligeholde skandaler fremover
- Opdateret `data.js` med intelligent loader (prøver manifest først, fallback til gammel single-file)
- Opdateret `MODAL-STRUKTUR.md` med ny datastruktur og vejledning
- Beholdt kebab-case navngivning for konsistens med resten af projektet
- Alt indhold bevaret – kun omstruktureret

## v2.00.59 (10. maj 2026)
- Version consistency opdateret: APP_VERSION matcher nu changelog
- Små UI tweaks og polish for bedre brugeroplevelse
- Forberedelse til næste features (dark mode, PWA)
- Klar til produktion og GitHub Pages deployment

## v2.00.58 (10. maj 2026)
- PDF-eksport og sammenlign af to politikere fuldt integreret, testet og bekræftet som implementeret
- Alle features fra den oprindelige todo-liste nu dækket (PDF, sammenlign, deling, statistik osv.)
- Små polish: version consistency, UI tweaks, data fuldstændighed for alle 12 politikere
- Version bumpet til v2.00.58
- Klar til endelig deployment og brug

## v2.00.52 (9. maj 2026)
- Alle politikere nu fuldt ensartede med `beforePolitics` + `careerTimeline` (præcis som MODAL-STRUKTUR.md kræver)
- Version bumpet til v2.00.52
- Del- og PDF-knapper bevaret i modal-header
- Klar til produktion

## v2.00.51 (8. maj 2026)
- Genindført **Del-knap** og **PDF-eksport** i den nye collapsible modal (v2.00.50+)
- Header med mobilvenligt layout (Del / PDF / Luk)
- `currentPolitician` gemt globalt + `initShareButton` kaldes automatisk

## v2.00.50 (tidligere)
- Collapsible sektioner + omrokering af modal-indhold
