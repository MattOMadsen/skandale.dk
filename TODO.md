# TODO-liste for Skandale.dk

**Sidst opdateret:** 8. juni 2026

## Fuldførte features

- [x] PWA (manifest.json + sw.js + ikoner)
- [x] PDF-eksport af en politikers rapport
- [x] Tilføj ny skandale direkte på siden (Formspree)
- [x] Password-beskyttet Admin Dashboard
- [x] Dedikeret tidslinje-side (`tidslinje.html`)
- [x] Modular JS-arkitektur
- [x] Stats-dashboard (`stats.html`) med alle 16 politikere via manifest
- [x] Infinite scroll på forsiden
- [x] Dedikeret `netvaerk.html` med filtre, sortering og dark mode
- [x] Dark mode på index, netværk, om, kontakt, tidslinje
- [x] Dynamisk politiker-antal i hero/stats
- [x] Folketing-filter på forsiden («Folketinget nu» / «Alle politikere»)
- [x] Parti-filter på forsiden
- [x] Billeder på alle 16 politikere (forside-grid)
- [x] Krydsreferencer: netværk, donorer og relaterede politikere i skandaler (`cross-reference.js`)
- [x] Brudte løfter: granulær mappe-loading + undefined-fix
- [x] Del specifik skandale + deep link (`?politician=&scandal=`)
- [x] Relaterede politikere i skandaler (auto-match + `otherPoliticians` i data)
- [x] Søgning inkl. skandale-tekst (scoring i `search.js`)
- [x] **Sammenlign-siden loader alle 16 politikere dynamisk fra manifest.json** (juni 2026)

## Delvist implementeret

- [ ] **Sammenlign-siden – finpudsning**
  - [x] Alle 16 politikere tilgængelige
  - [x] Profilbillede i sammenlign-kort (liste + sammenligningskort)
  - [ ] PDF-eksport kan gøres rigere
  - [ ] Mere polish på mobil
  - [ ] «Sammenlign med…»-knap fra politiker-modal

- [ ] **Kommentar-system + voting**
  - JS-filer findes (`modal-comments.js`, `modal-voting.js`)
  - Kun localStorage — ingen moderation eller central database

- [ ] **Relaterede skandaler i data**
  - Logik findes i `cross-reference.js`
  - Kun 3 skandaler har `otherPoliticians` / `relatedTopics` — flere kan udfyldes

- [ ] **Stats-side data-loading**
  - Loader 16 politikere fra manifest
  - Skandaler hentes kun fra single-file JSON — misser granulære mapper for nogle

- [ ] **Skeleton loader**
  - `js/skeleton-loader.js` findes men er ikke koblet på `index.html`

## Skal testes manuelt

- [ ] Sammenlign-funktionen end-to-end (vælg 2, tabs, PDF, URL-deling)
- [ ] «Før politik / Ungdom» og «Karriereoversigt» toggle i modal
- [ ] «Tilføj ny»-formular (Formspree-indsendelse)
- [ ] Modal-lukning — klik på mørk baggrund lukker ikke (kun X-knap); bekræft om det er ønsket

## Ikke startet

1. **Central database** (Supabase) til delt afstemning + kommentar-moderation
2. **Kilde-kvalitetsindikatorer** (grøn/gul/rød badges på kilder)
3. **«Sidst opdateret» + versionshistorik** på skandaler
4. **Billede i politiker-modal-header** (forsiden har billeder, modal har initialer)
5. **Loading-spinner i politiker-modal** ved `ensureAllDetailsLoaded()`
6. **«Sammenlign med…»-knap** i politiker-modal
7. **Granulær broken-promises mappe** for Pernille Vermund
8. **Erstat Tailwind CDN** med lokal optimeret CSS
9. **Admin: slet/rediger skandaler** i dashboard
10. **Alvorligheds-diagram** på stats-siden

## Teknisk gæld / oprydning

- [ ] Ryd op i legacy script-referencer
- [ ] Erstat Tailwind Play CDN (7 HTML-sider)
- [x] Ens navbar + dark mode på alle sider (`navbar.js` + `dark-mode.js`)
- [ ] Opdater CHANGELOG.md med juni-2026 ændringer

## Fremtidige større features

- Delt afstemning med central database
- Kommentar-moderation med admin-flow
- Vis skandale-navne direkte i forsøgeresultater (ikke kun politiker-kort)