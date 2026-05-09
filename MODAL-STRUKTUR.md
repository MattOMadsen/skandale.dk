# Politiker Modal Struktur (Skandale.dk)

**Mål:** Ensartet og professionel struktur i alle politikermodals, baseret på den aktuelle implementering (v6.9+).

## Aktuel mappe-struktur (vigtigt!)

Hver politiker har følgende dedikerede JSON-filer:

| Fil | Indhold | Bruges til i modalen |
|-----|---------|------------------------|
| `data/politicians/[navn].json` | Core data (id, name, party, bio, careerTimeline, beforePolitics, scandalsFile) | Om Politikeren, Før politik, Karriereoversigt |
| `data/scandals/[navn].json` | Skandaler (title, year/shortDesc, severity, mediaLinks/source) | Skandaler sektionen (med voting + kommentarer) |
| `data/affiliations/[navn].json` | Internationale netværk (NATO, Bilderberg, UNICEF, Europa-Parlamentet m.m.) | Internationale netværk & tilknytninger |
| `data/economic-support/[navn].json` | Donorer (name, amount, type, year) | Økonomisk støtte tabel |
| `data/broken-promises/[navn].json` | Brudte løfter (title, year, whatHappened, source) | Brudte valgløfter sektion |

> **Note:** `data/details/` er legacy og bruges ikke længere til aktiv rendering.

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
- Liste over skandaler (fra scandals JSON)
- Alvorlighed med stjerner (1-5)
- Klik for at åbne: beskrivelse + kilder + voting (Godt/Dårligt/Neutral) + kommentarer

### 6. Økonomisk støtte
- **Overskrift:** "Økonomisk støtte"
- Tabel med donorer
- Klik på donor åbner alle de har støttet

### 7. Internationale netværk & tilknytninger
- **Overskrift:** "Internationale netværk & tilknytninger"
- Liste over netværk (fra affiliations JSON)
- F.eks. NATO, Bilderberg, Save the Children, Europa-Parlamentet

### 8. Brudte valgløfter
- **Overskrift:** "Brudte valgløfter"
- Liste over brudte løfter (fra broken-promises JSON)

### 9. Footer
- "Data er baseret på offentligt tilgængelige kilder"
- Delingsknapper + PDF-eksport

## Tekniske noter (vedligeholdelse)
- Script-rækkefølge i index.html: `modal-scandal.js` før `modal-core.js`
- Hver modal-*.js fil har én ansvar (1 fil = 1 funktion)
- Data er JSON-baseret → nem at opdatere og udvide
- Alle 12 politikere skal have identisk struktur for genkendelighed

**Sidst opdateret:** 9. maj 2026 (v2.00.54) – Opdateret til aktuel mappe-struktur med scandals/, affiliations/ m.m.