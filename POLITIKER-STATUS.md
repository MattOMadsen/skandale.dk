# Politiker Status Oversigt – Skandale.dk

**Sidst opdateret:** 3. juni 2026

## Formål
Denne fil giver et overblik over, hvor komplette de enkelte politikere er i forhold til den struktur der er defineret i `MODAL-STRUKTUR.md`.

Fokus er primært på de sidst tilføjede politikere, da de oprindelige 12 generelt er mere komplette.

## Generel status

| Politiker                  | Har `image` felt | Har `avatarColor` + `initials` | Har scandals mappe | Har broken-promises mappe | Har affiliations | Har economic-support | Bemærkninger |
|---------------------------|------------------|--------------------------------|--------------------|---------------------------|------------------|----------------------|--------------|
| **Mette Frederiksen**     | Ja              | Ja                             | Ja                 | Ja                        | Ja               | Ja                   | Komplet (reference) |
| **Pernille Skipper**      | **Nej**         | Ja                             | Ja                 | Ja                        | ?                | ?                    | Mangler `image` |
| **Pernille Vermund**      | **Nej**         | Ja                             | Ja                 | Ja                        | ?                | ?                    | Mangler `image` |
| **Alex Vanopslagh**       | **Nej**         | Ja                             | Ja                 | **Nej**                   | ?                | ?                    | Mangler både `image` og broken-promises mappe |
| **Ida Auken**             | Ja              | Ja                             | Ja                 | Ja                        | Ja               | ?                    | Bedst af de nye – har `image` |

## Detaljer pr. nyere politiker

### Pernille Skipper
- Mangler: `image` felt (kun avatarColor + initials)
- Har: God bio, beforePolitics og careerTimeline
- Anbefaling: Tilføj Wikimedia billede eller officiel portræt

### Pernille Vermund
- Mangler: `image` felt
- Har: Fornuftig bio og karriereoversigt
- Anbefaling: Tilføj billede for konsistens

### Alex Vanopslagh
- Mangler: 
  - `image` felt
  - Mappen `data/broken-promises/alex-vanopslagh/`
- Har: Scandals mappe + manifest
- Anbefaling: Høj prioritet – både billede og broken-promises data mangler

### Ida Auken
- Har: `image` felt (Wikimedia)
- Har: affiliations array
- Ser relativt komplet ud sammenlignet med de andre nye

## Anbefalinger

1. **Høj prioritet**
   - Tilføj `image` felt til Pernille Skipper, Pernille Vermund og Alex Vanopslagh (gerne Wikimedia Commons links som de andre)
   - Opret `data/broken-promises/alex-vanopslagh/` mappe med manifest.json (selvom der måske ikke er mange brudte løfter endnu)

2. **Mellem prioritet**
   - Gennemgå de andre nye politikere for manglende `affiliations` og `economic-support` JSON-filer
   - Overvej at standardisere `careerTimeline` til et array-format (som i nogle af de ældre politikere) i stedet for ren string

3. **Langsigtet**
   - Lav en tjekliste / template, så nye politikere bliver tilføjet mere ensartet

## Næste skridt

Vil du have, at jeg:
- Laver en mere detaljeret tjekliste for alle 16 politikere?
- Starter med at tilføje `image` felter til de tre der mangler det (med forslag til billed-URL'er)?
- Opretter de manglende broken-promises mapper?

Skriv bare hvad du vil have jeg går videre med.