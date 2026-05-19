# Politiker Modal Struktur (Skandale.dk)

**Mål:** Ensartet og professionel struktur i alle politikermodals, baseret på den aktuelle implementering

## Aktuel mappe-struktur (vigtigt!)

Hver politiker har følgende dedikerede JSON-filer:

| Fil / Mappe | Indhold | Bruges til i modalen |
|-------------|---------|------------------------|
| `data/politicians/[slug].json` | Core data (id, name, party, bio, careerTimeline, beforePolitics) | Om Politikeren, Før politik, Karriereoversigt |
| `data/scandals/[slug]/` | **Granulær struktur**:<br>• `manifest.json` (liste over skandale-filer)<br>• `*.json` (én fil pr. skandale) | Skandaler sektionen |
| `data/affiliations/[slug].json` | Internationale netværk | Internationale netværk & tilknytninger |
| `data/economic-support/[slug].json` | Donorer | Økonomisk støtte tabel |
| `data/broken-promises/[slug]/` | **Granulær struktur**:<br>• `manifest.json` (liste over løfte-filer)<br>• `*.json` (én fil pr. brudt løfte) | Brudte valgløfter sektion |

> **Note:** De gamle single-file versioner beholdes som fallback. Den nye loader i `data.js` prøver først manifest-strukturen.

### Eksempel på ny granulær struktur (både scandals og broken-promises)
```
data/scandals/mette-frederiksen/
├─ manifest.json
├─ minkskandalen-2020.json
└─ ...

data/broken-promises/mette-frederiksen/
├─ manifest.json
├─ velfaerd-2019.json
└─ ...
```

## Kilde links (vigtigt for gennemsigtighed)

**Alle sektioner skal have klikbare kilde links**, så brugeren kan læse mere om emnet og verificere informationen:

- **Skandaler**: Hver skandale skal have `mediaLinks` med klikbar(e) kilde(r)
- **Brudte valgløfter**: Kilde link under hvert løfte (støtter både enkelt `source` og `sources[]` array)
- **Internationale netværk**: Kilde link på hvert netværk
- **Økonomisk støtte**: Kilde link på hver donor (hvis tilgængelig)

Dette sikrer fuld gennemsigtighed og troværdighed.

## Anbefalet rækkefølge i modalen

### 1. Header (altid synlig)
- Navn + initialer + avatar
- Parti (med farve)
- Rolle

### 2. Om Politikeren (collapsible)
- Kort bio (fra politicians JSON)

### 3. Før politik / Ungdom (collapsible)
- Baggrund før Folketinget

### 4. Karriereoversigt (collapsible)
- Tidslinje med vigtige år

### 5. Skandaler
- **Overskrift:** "Skandaler"
- Liste over skandaler (indlæses automatisk via `manifest.json`)
- Alvorlighed med statiske stjerner (`ourSeverity`) + "(Vores vurdering)"
- Klik for at åbne:
  - Beskrivelse (`longDesc`)
  - Kilder (`mediaLinks`)
  - **Konsekvenser** (hvis feltet findes)
  - **Hvad burde være sket?** (`whatShouldHaveHappened` objekt)
  - Interaktiv bruger-vurdering af alvorlighed (1-5 stjerner)
  - Kommentarer

### 6. Økonomisk støtte
- Tabel med donorer (klik på donor åbner alle de har støttet)

### 7. Internationale netværk & tilknytninger
- Liste over netværk (klikbar → viser andre politikere med samme tilknytning)

### 8. Brudte valgløfter
- Liste over brudte løfter (støtter multiple klikbare kilder via `sources[]`)

### 9. Footer
- "Data er baseret på offentligt tilgængelige kilder"
- Delingsknapper + PDF-eksport

## Tekniske noter (vedligeholdelse)

- **Script-rækkefølge** i `index.html`: `modal-scandal.js` før `modal-core.js`
- Hver `modal-*.js` fil har én ansvar (1 fil = 1 funktion)
- Data er JSON-baseret → nem at opdatere og udvide
- **Granulær struktur** (scandals + broken-promises): Tilføj nyt element ved at:
  1. Oprette ny fil i `data/scandals/[slug]/` eller `data/broken-promises/[slug]/`
  2. Tilføje filnavnet til `manifest.json`
- Alle 12 politikere har nu identisk granulær struktur for både skandaler og brudte løfter
- Brugerens alvorlighedsvurdering gemmes i `localStorage` (`userSeverity_${polId}_${scId}`)
- Anbefalede felter i skandale-filer: `consequences` og `whatShouldHaveHappened`

**Sidst opdateret:** 19. maj 2026 – Opdateret til granulær struktur for både `scandals` og `broken-promises` (per-politiker mapper + manifest.json). Alle 12 politikere migreret.