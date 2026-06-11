## [v2.01.04] - 2026-06-11
### Fix: profilbillede i politiker-modal
- Avatar renderes nu via DOM (`setPoliticianModalAvatar`) i stedet for HTML-streng med `onerror`-backticks
- `loading="eager"` + `referrerpolicy="no-referrer"` for Wikimedia-billeder
- Fallback henter `image` fra politiker-JSON hvis feltet mangler på objektet
- Service worker cache bumped til v7

## [v2.01.03] - 2026-06-11
### Modal UX & data-krydsreferencer
- Politiker-modal: profilbillede i header, loading-spinner ved indlæsning, «Sammenlign med…»-knap
- Sammenlign-siden: `?p1=slug` forudvælger politiker 1 (uden at kræve p2)
- Pernille Vermund: granulær `broken-promises/pernille-vermund/` mappe (2 poster)
- Skandaler: `otherPoliticians` / `relatedTopics` på 6 nye filer (WEF, mink, Bilderberg)

## [v2.01.02] - 2026-06-11
### Pernille Vermund — research & affiliations
- Research: Nye Borgerlige havde ingen dokumenteret tilknytning til ECR, IDU, CPAC eller WCF
- Tilføjet **European Liberal Forum** og **Liberal International** via medlemskab af Liberal Alliance (jan. 2024, TV2/DR/Berlingske)
- Opdateret `data/politicians/pernille-vermund.json`: parti skiftet til Liberal Alliance
- `POLITIKER-STATUS.md` og `TODO.md` opdateret — nu 40/40 affiliations udfyldt

## [v2.01.01] - 2026-06-11
### Internationale affiliations for 9 politikere
- Udfyldt affiliations for Peter Skaarup, Mette Abildgaard, Ane Halsboe-Jørgensen, Christine Egelund, Jakob Engel-Schmidt, Jeppe Bruus, Magnus Heunicke og Rasmus Stoklund
- Nye netværksprofiler: OECD, International Transport Forum, WHO Regional Office for Europe, Council of Europe
- Verifikation: 0 domestic entries på tværs af alle 40 affiliations-filer

## [v2.01.00] - 2026-06-10
### Om-siden & donation
- Donationssektion med PayPal, QR-kode og bankoverførsel (9070 / 8060896667)
- Dark mode-fix for donationsboks; fjernet døde `.md`-links fra bidragsektionen

## [v2.00.94] - 2026-06-09
### Netværk & affiliations-oprydning
- `cross-reference.js` filtrerer domestic/parti-netværk fra modaler og netværkssiden
- `network-profiles.js` + `modal-network-overview.js`: faktuelle profiler før politikerliste
- 25 affiliations-filer ryddet for Folketinget/partinavne; internationale tilknytninger tilføjet hvor kendt

## [v2.00.87] - 2026-06-02
### netvaerk.html – Fuld genopbygning & forbedringer
- Gendannet fuld working version efter trunkering under dark-mode arbejde
- Integreret `js/dark-mode.js` + Tailwind `darkMode: 'class'` (localStorage + system preference + dynamisk navbar-toggle)
- Tilføjet live filtre (minimum antal politikere), sortering (antal / navn A-Å) og stats-bar med total netværk + politikere dækket
- Forbedret card-visning med parti-farvede politik-preview (første 3 politikere + "+N") og "STOR" badge til netværk med 5+ politikere
- Bedre tom-tilstand, fejlhåndtering og robust modal-kald (`showNetworkConnections` med fallback)
- Fuldt dark mode kompatibel, mobilvenlig og konsistent med resten af projektet

## [v2.00.86] - 2026-06-02
### Sammenlign-siden forbedringer
- **PDF-eksport fuldt rettet**: Nu bruger den rigtige jsPDF med korrekt data (skandaler + brudte løfter vises med titler og beskrivelser)
- Data gemmes nu korrekt på politiker-objekterne (`loadedScandals`, `loadedPromises` osv.) efter indlæsning
- Skandale-modal tilføjet (klik på skandale viser fuld tekst + klikbare kilder)
- Klikbare politikere i "Andre politikere"-modal (erstatter Politiker 2 automatisk)
- Brudte løfter viser nu korrekt tekst (`whatHappened`)
- Samlet set meget mere brugervenlig og indholdsrig sammenligningsoplevelse

## [v2.00.85] - 2026-06-02
### Documentation & Status Update
- Opdateret `TODO.md` med aktuel projektstatus:
  - Infinite scroll på forsiden tilføjet til Fuldførte features
  - Dark mode flyttet til "Igangværende" (startet)
  - Sammenlign-side præciseret som delvist implementeret
  - Tilføjet oprydningsnote om legacy `modal-compare.js`
- Begyndt implementering af Dark mode

## [v2.00.84] - 2026-05-28
### Timeline Feature Overhaul
- Oprettet dedikeret `tidslinje.html` som fuld side (bedre mobiloplevelse)
- Tilføjet real-time søgning i skandaler på tidslinjesiden
- Tilføjet gruppering efter år med overskrifter
- Kombinerede filtre (søgning + parti + alvorlighed) på den nye side
- Opdateret menu så "Tidslinje" linker direkte til den nye dedikerede side
- Forbedret visuel visning af alvorlighed og parti-farver

### Fixes
- Rettet at politikere ikke blev vist på forsiden efter tidligere ændringer (tilføjet sikkerhedsnet + genoprettet ren index.html)
- Timeline modal gjort robust og genskabt historisk design

## [v2.00.83] - 2026-05-27
### Refactor & Modularity
- Kraftig oprydning af `index.html` – trukket så meget som muligt ud i separate filer
- Ny fil: `js/about-modal.js` (Om Skandale.dk modal)
- Ny fil: `js/mobile-menu.js` (mobil menu funktionalitet)
- Ny fil: `js/skeleton-loader.js` (dynamisk skeleton loader til politiker-grid)
- Tilføjet manglende `js/modal-networks.js` → "Internationale netværk & tilknytninger" klik virker igen (viser andre politikere i samme netværk)
- Beholdt princippet: Hellere nye filer end at gøre eksisterende filer længere
- `index.html` er nu markant kortere og renere

## [v2.00.82] - 2026-05-27
### Performance & Fixes (Frontpage)
- Tilføjet `defer` på alle scripts for hurtigere initial rendering
- Lazy loading af politician data (kun lette core-data loades på forsiden)
- Baggrundsindlæsning af detaljer → korrekte tal i statistik og grid
- Tilføjet skeleton loader på politiker-grid'et
- Rettet at antal skandaler og brudte løfter ikke blev vist på forsiden
- Rettet at "Netværk & Overlap" ikke viste data (networkIndex bygges nu fra affiliations)

## [v2.00.81] - 2026-05-27
### Fixed
- Mindre justeringer og oprydning