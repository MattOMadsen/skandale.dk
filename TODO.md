# TODO-liste for Skandale.dk (Opdateret 3. juni 2026)

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
- [x] Grundlæggende dedikeret sammenlign-side (`sammenlign.html`) med side-by-side metrics + swap-funktion + **klikbar støtte/netværk + skandale-modal + PDF-eksport**
- [x] Stats-dashboard (`stats.html`)
- [x] Infinite scroll på forsiden (tilføjet 1. juni 2026)
- [x] **Dedikeret netvaerk.html** – fuld genopbygning med filtre, sortering, stats-bar, parti-farvede politik-preview, "STOR" badge, dark mode (via js/dark-mode.js) og robust modal-integration (juni 2026)
- [x] Dark mode – fuldt integreret på netvaerk.html med `js/dark-mode.js`, Tailwind `darkMode: 'class'`, localStorage + system preference
- [x] Gør antallet af politikere dynamisk i hero-badge (via `js/stats-snapshot.js` + `#stats-snapshot`)
- [x] Fjernet legacy `modal-compare.js` fra `index.html` (erstattet af dedikeret `sammenlign.html`)

## Delvist implementeret / Igangværende

- [ ] Kommentar-system + voting  
  JS-filer findes (`modal-comments.js`, `modal-voting.js`), men mangler fuld moderation, admin-godkendelse og central database.

- [ ] Dedikeret sammenlign-side (`sammenlign.html`)  
  **Kernefunktionalitet er nu på plads** (data loader, modaler, klikbar støtte/netværk, PDF-eksport, URL-deling, detaljeret visning).
  
  **Små ting der stadig mangler / kan forbedres:**
  - PDF-eksport kan gøres endnu rigere (flere detaljer, bedre layout, fulde beskrivelser + kilder)
  - Mere polish på mobil (søgefelt, modal-størrelse)
  - Eventuelt "Sammenlign direkte fra politikermodal"-knap
  - Finpudsning af loading states og fejlhåndtering

## Ikke startet endnu (Prioriteret)

1. **Central database** (f.eks. Supabase) til delt afstemning + kommentar-moderation
2. Færdiggørelse af dedikeret sammenlign-side (sidste små finpudsninger)

## Oprydning & Teknisk gæld

- [ ] Ryd op i andre potentielle legacy script-referencer efter overgangen til dedikerede sider
- [ ] Erstat Tailwind Play CDN med lokal, optimeret `tailwind.css`
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

## Nye forslag til forbedringer (30. maj 2026)

### 1. Kilde-kvalitetsindikatorer
Tilføj en lille, visuel indikator ved hver kilde i en skandale (f.eks. farvede prikker eller badges).
- Grøn = officiel kilde (Rigsrevisionen, domstol, ministerium)
- Gul = seriøs medie
- Rød = socialt medie / anonym kilde

**Formål:** Øger troværdigheden og hjælper brugeren med hurtigt at vurdere, hvor solid en påstand er.

### 2. "Senest opdateret" + versionshistorik på skandaler
Vis tydeligt hvornår en skandale sidst blev opdateret, og gerne en lille "Se ændringer"-knap, der viser, hvad der er blevet tilføjet/rettet.

**Formål:** Viser, at siden bliver vedligeholdt aktivt, og skaber tillid til, at informationen ikke er forældet.

### 3. Forbedret intern søgning (Scandal Search)
Udvid søgefunktionen, så man også kan søge direkte i skandale-titler og beskrivelser på tværs af alle politikere – ikke kun politikernavne.

**Formål:** Gør det meget nemmere at finde specifikke sager (f.eks. "mink" eller "cancergaranti").

### 4. Politiker-sammenligning direkte fra modal
Tilføj en hurtig "Sammenlign med..." knap inde i en politikers modal, som åbner den dedikerede sammenlign-side med den aktuelle politiker allerede valgt.

**Formål:** Gør det mere naturligt at gå fra enkeltvisning til sammenligning uden at skulle starte forfra.

### 5. "Relaterede skandaler" sektion
Inde i en skandale-modal vises 2–4 relaterede skandaler (baseret på samme parti, samme tema, eller samme donorer/netværk).

**Formål:** Øger engagementet og hjælper brugeren med at se sammenhænge.

### 6. Forbedret deling af specifikke skandaler
Mulighed for at dele et direkte link til en specifik skandale inde i en modal (f.eks. via en "Del denne skandale"-knap), der åbner politikeren + åbner den pågældende skandale automatisk.

**Formål:** Gør det nemmere at dele konkrete sager på sociale medier eller i debatter.

### 7. Visuel oversigt over alvorlighedsfordeling
På forsiden eller i en statistik-sektion: Et simpelt, interaktivt diagram (f.eks. donut eller bar), der viser fordelingen af skandaler på tværs af alvorlighedsniveauer for hele siden eller pr. parti.

**Formål:** Giver et hurtigt overblik over det samlede billede uden at skulle klikke sig ind på enkeltpersoner.

### 8. "Bidrag med viden"-sektion
En tydelig, men diskret sektion (måske i bunden eller i Admin-modalen), der forklarer, hvordan man kan bidrage med nye kilder eller korrigere information – kombineret med et simpelt formular-link.

**Formål:** Gør siden mere levende og inviterende uden at åbne for spam.