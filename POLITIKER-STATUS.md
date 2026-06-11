# Politiker Status Oversigt – Skandale.dk

**Sidst opdateret:** 11. juni 2026 (v2.01.01)

## Formål

Denne fil giver et overblik over, hvor komplette de enkelte politikere er i forhold til den struktur der er defineret i `MODAL-STRUKTUR.md`.

## Overblik (live audit)

| Metrik | Antal | Status |
|--------|------:|--------|
| Politikere i alt | **40** | Via `data/politicians/manifest.json` |
| Folketingsmedlemmer (`inFolketinget: true`) | **33** | Standardvisning på forsiden |
| Tidligere politikere (`inFolketinget: false`) | **7** | Vises under «Alle politikere» |
| Profilbilleder (`image`) | **40/40** | Komplet |
| Skandaler (politikere med data) | **40/40** | **105** skandale-poster i alt |
| Brudte løfter | **40/40** | Granulær mappe eller single-file |
| Økonomisk støtte | **40/40** | Komplet |
| Internationale affiliations | **39/40** | 1 tom (bevidst) |
| Unikke internationale netværk | **47** | Filtreret via `cross-reference.js` |

## Folketinget nu (33 politikere)

Disse har `inFolketinget: true` og vises som standard på forsiden:

| Parti | Politikere |
|-------|------------|
| **Socialdemokratiet** (10) | Mette Frederiksen, Ida Auken, Ane Halsboe-Jørgensen, Dan Jørgensen, Jeppe Bruus, Magnus Heunicke, Mattias Tesfaye, Morten Bødskov, Nicolai Wammen, Rasmus Stoklund |
| **Venstre** (5) | Jakob Ellemann-Jensen, Marcus Knuth, Sophie Løhde, Stephanie Lose, Troels Lund Poulsen |
| **Moderaterne** (3) | Lars Løkke Rasmussen, Christine Egelund, Jakob Engel-Schmidt |
| **Det Konservative Folkeparti** (3) | Mette Abildgaard, Mai Mercado, Mona Juul |
| **Danmarksdemokraterne** (2) | Inger Støjberg, Peter Skaarup |
| **Dansk Folkeparti** (2) | Kristian Thulesen Dahl, Morten Messerschmidt |
| **Enhedslisten** (2) | Pernille Skipper, Rosa Lund |
| **Socialistisk Folkeparti** (3) | Karina Lorentzen, Pelle Dragsted, Pia Olsen Dyhr |
| **Liberal Alliance** (2) | Alex Vanopslagh, Henrik Dahl |
| **Nye Borgerlige** (1) | Pernille Vermund |

## Tidligere politikere (7)

Disse har `inFolketinget: false` og vises under «Alle politikere» (sorteret efter folketingsmedlemmer):

| Politiker | Parti |
|-----------|-------|
| Anders Fogh Rasmussen | Venstre |
| Claus Hjort Frederiksen | Venstre |
| Helle Thorning-Schmidt | Socialdemokratiet |
| Morten Østergaard | Radikale Venstre |
| Pia Kjærsgaard | Dansk Folkeparti |
| Søren Pape Poulsen | Det Konservative Folkeparti |
| Uffe Elbæk | Alternativet |

## Internationale netværk & affiliations

### Status efter oprydning (juni 2026)

- Alle **40** affiliations-filer eksisterer
- **0** domestic/parti-entries (Folketinget, partinavne osv. er filtreret fra)
- **39** politikere har mindst én international tilknytning
- **1** politiker har bevidst tom affiliations-fil: **Pernille Vermund** (ingen solid kilde til elite-netværk)

### Senest udfyldt (v2.01.01)

| Politiker | Netværk |
|-----------|---------|
| Peter Skaarup | ECR |
| Mette Abildgaard | IDU, EPP |
| Ane Halsboe-Jørgensen | Nordic Council |
| Christine Egelund | ALDE, OECD |
| Jakob Engel-Schmidt | Nordic Council |
| Jeppe Bruus | International Transport Forum |
| Magnus Heunicke | WHO Regional Office for Europe |
| Rasmus Stoklund | Council of Europe |

### Top-netværk (antal politikere)

| Netværk | Politikere |
|---------|----------:|
| International Democrat Union (IDU) | 9 |
| European Conservatives and Reformists (ECR) | 7 |
| Bilderberg Meetings | 7 |
| World Economic Forum (WEF) | 6 |
| Nordic Council | 6 |
| Conservative Political Action Conference (CPAC) | 5 |
| European People's Party (EPP) | 5 |

Nye netværksprofiler i `js/network-profiles.js`: OECD, International Transport Forum, WHO Regional Office for Europe, Council of Europe.

## Generel data-status per politiker

Alle 40 politikere har følgende datastruktur på plads:

| Felt | Status |
|------|--------|
| `data/politicians/[slug].json` | 40/40 |
| `data/scandals/[slug]/` eller `.json` | 40/40 |
| `data/broken-promises/[slug]/` eller `.json` | 40/40 |
| `data/affiliations/[slug].json` | 40/40 |
| `data/economic-support/[slug].json` | 40/40 |

## Forside-funktioner (juni 2026)

- **Folketinget nu** – standardvisning: 33 nuværende folketingsmedlemmer
- **Alle politikere** – viser alle 40; folketingsmedlemmer sorteres først
- Parti-filter og søgning respekterer det valgte folketing-filter
- **Netværkssiden** (`netvaerk.html`) viser kun internationale netværk med profilblokke

## Tekniske noter

- `js/cross-reference.js` filtrerer domestic netværk fra (`isInternationalNetwork`, `filterInternationalAffiliations`)
- `js/network-profiles.js` leverer faktuelle profiler til netværksmodaler
- `js/data.js` loader affiliations, skandaler, brudte løfter og økonomisk støtte per politiker
- Billeder hentes fra Wikimedia Commons

## Åbne punkter

- [ ] Research internationale tilknytninger for **Pernille Vermund** (hvis kilder findes)
- [ ] Flere `otherPoliticians` / `relatedTopics` i skandale-data (se `TODO.md`)