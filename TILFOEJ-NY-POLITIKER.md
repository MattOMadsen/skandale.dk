# Sådan tilføjer du en ny politiker (Nem guide)

Denne guide viser, hvordan du nemt og hurtigt kan tilføje en ny politiker til Skandale.dk.

## Trin-for-trin

### 1. Opret mappen til politikeren

Opret en ny mappe under `data/politicians/` med et passende slug (f.eks. `mette-frederiksen` eller `pernille-skipper`).

### 2. Opret `data/politicians/[slug].json`

Opret en fil med grundlæggende information:

```json
{
  "id": 13,
  "name": "Pernille Skipper",
  "party": "Enhedslisten",
  "role": "Politisk ordfører",
  "avatarColor": "#E30613",
  "initials": "PS",
  "bio": "Kort beskrivelse af politikeren..."
}
```

### 3. Opret data-mapper (valgfrit men anbefalet)

Opret disse mapper hvis du vil bruge den nye granulære struktur:

- `data/scandals/[slug]/`
- `data/affiliations/[slug].json`
- `data/economic-support/[slug].json`
- `data/broken-promises/[slug].json`

### 4. Opdater manifestet

Åbn `data/politicians/manifest.json` og tilføj det nye slug i listen:

```json
{
  "politicians": [
    "mette-frederiksen",
    "inger-stoejberg",
    ...
    "pernille-skipper"   // <--- Tilføj her
  ]
}
```

### 5. Genindlæs siden

Hard refresh (Ctrl + Shift + R). Den nye politiker dukker nu automatisk op på:

- Forsiden (i søgning og grid)
- Tidslinjen
- **Statistik Dashboardet** (automatisk opdateret!)
- Sammenlign-funktionen
- Parti-oversigten

## Hvad bliver automatisk opdateret?

Når du tilføjer en ny politiker via manifestet, bliver følgende automatisk opdateret uden at du skal ændre kode:

- Antal skandaler
- Gennemsnitlig alvorlighed
- Statistikker per parti
- Økonomisk støtte ranking
- Brudte valgløfter
- Mest alvorlige skandaler

## Gamle single-file struktur (hvis du vil holde det simpelt)

Du kan stadig bruge de gamle single-filer:
- `data/scandals/[slug].json`
- `data/economic-support/[slug].json`
- `data/broken-promises/[slug].json`

Systemet har fallback og vil bruge dem, hvis der ikke findes en mappe-struktur.

## Tips

- Brug konsekvente slugs (små bogstaver, bindestreger)
- Brug `ourSeverity` i skandaler for at få korrekt gennemsnit i statistikken
- Tilføj altid kilder (`mediaLinks`)
- Hold `partyColor` konsistent med partiets farve

---

**Du behøver ikke længere at redigere JavaScript-filer** for at tilføje en ny politiker. Bare manifest + JSON-filer.