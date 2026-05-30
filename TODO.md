# TODO-liste for Skandale.dk (Opdateret 30. maj 2026)

## Kendte bugs / Issues der skal testes
> **Note:** Flere af de tidligere kendte bugs ser ud til at være løst gennem refaktoreringen. De skal dog testes i praksis.

- [ ] Sammenlign-funktionen (modal + dedikeret side) – test om den virker stabilt
- [ ] "Før politik / Ungdom" og "Karriere oversigt" i modal – virker de nu?
- [ ] "Tilføj ny" i modal – virker det?
- [ ] Modal-lukning når man klikker inde i modalen

## Fuldførte features

- [x] PWA (manifest.json + sw.js + ikoner) – fuldt implementeret
- [x] PDF-eksport af en politikers rapport
- [x] Tilføj ny skandale direkte på siden (Formspree)
- [x] Password-beskyttet Admin Dashboard
- [x] Dedikeret tidslinje-side (`tidslinje.html`) med avancerede filtre og year-grouping
- [x] Modular JS-arkitektur (mange små, vedligeholdelsesvenlige filer i `js/`)
- [x] Grundlæggende dedikeret sammenlign-side (`sammenlign.html`) med side-by-side metrics + swap-funktion
- [x] Stats-dashboard (`stats.html`)

## Delvist implementeret / Igangværende

- [ ] Kommentar-system + voting  
  JS-filer findes (`modal-comments.js`, `modal-voting.js`), men mangler fuld moderation, admin-godkendelse og central database.

- [ ] Dedikeret sammenlign-side (`sammenlign.html`)  
  Grundlæggende funktionalitet er på plads, men mangler:
  - Detaljeret visning af skandaler, donorer og brudte løfter
  - Søgning i udvælgelsesfelterne
  - URL-deling (`?p1=...&p2=...`)
  - PDF-eksport af sammenligningen
  - Fuld menu- og modal-integration

## Ikke startet endnu (Prioriteret)

1. **Dark mode** (professionel og troværdig dark variant)
2. **Central database** (f.eks. Supabase) til delt afstemning + kommentar-moderation
3. Færdiggørelse af dedikeret sammenlign-side (avancerede features)

## Oprydning & Teknisk gæld

- [ ] Fjern `modal-compare.js` fra `index.html` (legacy – erstattet af dedikeret `sammenlign.html`)
- [ ] Ryd op i andre potentielle legacy script-referencer efter overgangen til dedikerede sider
- [ ] Erstat Tailwind Play CDN med lokal, optimeret `tailwind.css`
- [ ] Gør antallet af politikere dynamisk i hero-badge
- [ ] Ryd op i ubrugte ID'er og gammel kode
- [ ] Forbedre fejlhåndtering og loading-states

## Andre forbedringsforslag

- Forbedre mobil-UX yderligere på tværs af alle sider
- Tilføj flere politikere
- Mulighed for at slette/redigere skandaler direkte i Admin Dashboard
- Konsistent dokumentationsopdatering (CHANGELOG.md + TODO.md)
- Gør `timeline.js` og modal-systemet endnu mere robust

## Fremtidige større features (lavere prioritet)

- Delt afstemning med central database
- Kommentar-moderation med admin-flow