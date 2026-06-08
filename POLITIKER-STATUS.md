# Politiker Status Oversigt – Skandale.dk

**Sidst opdateret:** 8. juni 2026

## Formål
Denne fil giver et overblik over, hvor komplette de enkelte politikere er i forhold til den struktur der er defineret i `MODAL-STRUKTUR.md`.

## Folketinget nu (9 politikere)

Disse har `inFolketinget: true` og vises som standard på forsiden:

| Politiker | Parti |
|-----------|-------|
| Mette Frederiksen | Socialdemokratiet |
| Ida Auken | Socialdemokratiet |
| Inger Støjberg | Danmarksdemokraterne |
| Lars Løkke Rasmussen | Moderaterne |
| Morten Messerschmidt | Dansk Folkeparti |
| Kristian Thulesen Dahl | Dansk Folkeparti |
| Pernille Skipper | Enhedslisten |
| Pernille Vermund | Nye Borgerlige |
| Alex Vanopslagh | Liberal Alliance |

## Tidligere politikere (7)

Disse har `inFolketinget: false` og vises under «Alle politikere» (sorteret efter folketingsmedlemmer):

Morten Østergaard, Helle Thorning-Schmidt, Pia Kjærsgaard, Anders Fogh Rasmussen, Søren Pape Poulsen, Uffe Elbæk, Claus Hjort Frederiksen.

## Generel status

| Politiker | `image` | Scandals | Broken promises | Affiliations | Economic-support | Bemærkninger |
|-----------|---------|----------|-----------------|--------------|------------------|--------------|
| Mette Frederiksen | Ja | Ja | Ja | Ja | Ja | Komplet (reference) |
| Ida Auken | Ja | Ja | Ja | Ja | Ja | Komplet |
| Pernille Skipper | Ja | Ja | Ja (mappe) | Ja | Ja | Opdateret juni 2026 |
| Pernille Vermund | Ja | Ja | Ja (fil) | Ja | Ja | Opdateret juni 2026 |
| Alex Vanopslagh | Ja | Ja | Ja (mappe) | Ja | Ja | Opdateret juni 2026 |

## Forside-funktioner (juni 2026)

- **Folketinget nu** – standardvisning: kun nuværende folketingsmedlemmer
- **Alle politikere** – viser alle 16; folketingsmedlemmer sorteres først
- Parti-filter og søgning respekterer det valgte folketing-filter

## Tekniske noter

- `js/data.js` loader nu brudte løfter fra granulære mapper (`data/broken-promises/[slug]/manifest.json`) med fallback til single-file JSON
- Billeder hentes fra Wikimedia Commons (samme mønster som Mette Frederiksen)