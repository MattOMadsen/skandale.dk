# TODO-liste for Skandale.dk

## Kendte bugs (skal fixes)
- Sammenlign virker ikke ordentligt
- "Før politik / Ungdom" og "Karriere oversigt" virker ikke i modal
- "Tilføj ny" i modal virker ikke
- Modal lukker hele politikeren når man interagerer inde i den

## Fuldført
- Sammenlign to politikere (`js/modal-compare.js` + menu-link)
- PDF-eksport af en politikers rapport (`js/modal-pdf-export.js` + jsPDF)
- Mulighed for at tilføje nye skandaler direkte på siden (`js/modal-add-scandal.js` med Formspree)
- PWA (kan installeres på telefon) (`manifest.json`, `sw.js`, ikoner)
- Password-beskyttet Admin Dashboard (`js/modal-admin.js` v2)

## Delvist implementeret / I gang
- Kommentar-moderation og sikkerhed (`js/modal-comments.js` – mangler moderation, admin-godkendelse, backend-sikkerhed)
- Delt afstemning (central database) (`js/modal-voting.js` – mangler central database, pt. client-side)

## Ikke startet endnu
- Dark mode
- Central database til delt afstemning + moderation (kræver backend-løsning som Supabase)

## Nye større features (planlagt)

### Dedikeret Sammenlign-side (`sammenlign.html`)
**Mål:** Lav en rigtig dedikeret side til sammenligning af to politikere (i stedet for kun modal). Dette giver bedre plads, bedre mobil-oplevelse og mulighed for deling.

**Plan i faser:**

**Fase 1 – Forberedelse**
- Fix den kendte bug i `modal-compare.js`
- Gennemgå nuværende sammenligningslogik

**Fase 2 – Opret dedikeret side**
- Opret `sammenlign.html` (selvstændig side ligesom `tidslinje.html`)
- Genbrug `loadPoliticians()` + `loadAllPoliticianDetails()`
- To søgbare felter til at vælge politikere
- Side-by-side layout på desktop, stablet på mobil

**Fase 3 – Udvidet sammenligningsindhold**
- Antal skandaler + gennemsnitlig alvorlighed
- Økonomisk støtte + top donorer
- Brudte løfter
- Internationale netværk
- Top 3-5 skandaler pr. politiker (med alvorlighed)
- Visuel sammenligning og highlights

**Fase 4 – Avancerede features**
- Deling via URL (`?p1=mette-frederiksen&p2=inger-stoejberg`)
- "Byt om"-knap
- PDF-eksport af sammenligningen

**Fase 5 – Integration**
- Tilføj "Sammenlign" i hovedmenuen (desktop + mobil)
- Tilføj "Sammenlign med..." knap inde i politikermodalen

**Status:** Ikke startet  
**Prioritet:** Medium  
**Oprettet:** 29. maj 2026

## Andre forbedringsforslag
- Erstat Tailwind Play CDN med lokal, optimeret `tailwind.css`
- Gør antallet af politikere dynamisk i hero-badge
- Rydde op i ubrugte ID'er (f.eks. `politician-count`)
- Forbedre mobil-UX
- Tilføje flere politikere
- Mulighed for at slette/redigere skandaler i Admin Dashboard

## Nye punkter tilføjet 27. maj 2026
- Modal-arkitektur inkonsistent
- Forbedre fejlhåndtering og loading-states
- Automatisk/konsekvent dokumentationsopdatering
- Test af mobil-menu + modals integration
- Gør `timeline.js` mere robust