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

## [v2.00.80] - 2026-05-26
### Fixed
- Rettet index.html (genskabt fuld version med parti-filter og dynamisk politikerantal)

## [v2.00.79] - 2026-05-26
### Added
- Parti-filter på forsiden
- Dynamisk antal politikere (15)