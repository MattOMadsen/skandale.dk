# TODO-liste for Skandale.dk

**Sidst opdateret:** 11. juni 2026

**Aktuelt antal (juni 2026):** Ca. 40 politikere og 90+ skandaler (baseret på live stats på forsiden). Nogle ældre referencer til 12/16 politikere er gradvist opdateret.

## Fuldførte features

- [x] PWA (manifest.json + sw.js + ikoner + `js/pwa.js` registrering)
- [x] PDF-eksport af en politikers rapport
- [x] Tilføj ny skandale direkte på siden (Formspree)
- [x] Password-beskyttet Admin Dashboard
- [x] Dedikeret tidslinje-side (`tidslinje.html`)
- [x] Modular JS-arkitektur
- [x] Stats-dashboard (`stats.html`) med alle politikere via manifest
- [x] Infinite scroll på forsiden
- [x] Dedikeret `netvaerk.html` med filtre, sortering og dark mode
- [x] Dark mode på index, netværk, om, kontakt, tidslinje
- [x] Dynamisk politiker-antal i hero/stats
- [x] Folketing-filter på forsiden («Folketinget nu» / «Alle politikere»)
- [x] Parti-filter på forsiden
- [x] Billeder på alle politikere (forside-grid)
- [x] Krydsreferencer: netværk, donorer og relaterede politikere i skandaler (`cross-reference.js`)
- [x] Brudte løfter: granulær mappe-loading + undefined-fix
- [x] Del specifik skandale + deep link (`?politician=&scandal=`)
- [x] Relaterede politikere i skandaler (auto-match + `otherPoliticians` i data)
- [x] Søgning inkl. skandale-tekst (scoring i `search.js`)
- [x] **Sammenlign-siden loader alle politikere dynamisk fra manifest.json** (juni 2026)

## Delvist implementeret

- [ ] **Sammenlign-siden – finpudsning**
  - [x] Alle politikere tilgængelige
  - [x] Profilbillede i sammenlign-kort (liste + sammenligningskort)
  - [ ] PDF-eksport kan gøres rigere
  - [x] Mere polish på mobil (sticky handlingslinje, scroll-tabs, touch targets)
  - [ ] «Sammenlign med…»-knap fra politiker-modal

- [ ] **Kommentar-system + voting**
  - [x] Supabase-klient + `supabase-data.js` (kommentarer + fælles stjerne-bedømmelser)
  - [ ] Kør `supabase/schema.sql` i Supabase SQL Editor
  - [ ] Kommentar-moderation (admin-godkendelse)

- [ ] **Relaterede skandaler i data**
  - Logik findes i `cross-reference.js`
  - Kun 3 skandaler har `otherPoliticians` / `relatedTopics` — flere kan udfyldes

- [x] **Stats-side Top 5 → politiker-modal** (bruger numerisk id)
- [x] **Alvorligheds-diagram** på stats-siden
- [x] **Lazy load** på tidslinje og netværk (ingen fuld `loadAllPoliticianDetails()` ved opstart)
- [x] **Økonomisk støtte** for alle 40 politikere
- [x] **Profilbilleder** for alle 40 politikere

## Skal testes manuelt

- [ ] Sammenlign-funktionen end-to-end (vælg 2, tabs, PDF, URL-deling)
- [ ] «Før politik / Ungdom» og «Karriereoversigt» toggle i modal
- [ ] «Tilføj ny»-formular (Formspree-indsendelse)
- [ ] Modal-lukning — klik på mørk baggrund lukker ikke (kun X-knap); bekræft om det er ønsket

## Ikke startet

1. **Central database** (Supabase) til delt afstemning + kommentar-moderation — grundstruktur klar (`supabase-client.js` + `secrets.example.js`)
2. **Kilde-kvalitetsindikatorer** (grøn/gul/rød badges på kilder)
3. **«Sidst opdateret» + versionshistorik på skandaler
4. **Billede i politiker-modal-header** (forsiden har billeder, modal har initialer)
5. **Loading-spinner i politiker-modal** ved `ensureAllDetailsLoaded()`
6. **«Sammenlign med…»-knap** i politiker-modal
7. **Granulær broken-promises mappe** for Pernille Vermund
8. ~~**Erstat Tailwind CDN** med lokal optimeret CSS~~ (implementeret: `npm run build:css` → `css/tailwind.css`)
9. **Admin: slet/rediger skandaler** i dashboard
10. ~~**Alvorligheds-diagram** på stats-siden~~ (implementeret juni 2026)

## Teknisk gæld / oprydning

- [ ] Ryd op i legacy script-referencer
- [x] Erstat Tailwind Play CDN (lokal build: `npm run build:css`) (7 HTML-sider)
- [x] Ens navbar + dark mode på alle sider (`navbar.js` + `dark-mode.js`)
- [ ] Opdater CHANGELOG.md med juni-2026 ændringer

## Fremtidige større features

- Delt afstemning med central database
- Kommentar-moderation med admin-flow
- Vis skandale-navne direkte i forsøgeresultater (ikke kun politiker-kort)