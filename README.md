# Skandale.dk

En moderne, interaktiv og gennemsigtig hjemmeside der giver danskerne et samlet overblik over politiske skandaler, økonomisk støtte, internationale netværk og brudte valgløfter.

**Mål:** Større gennemsigtighed i dansk politik.

## Live version

https://mattomadsen.github.io/skandale.dk/

## Funktioner

- Søgning efter politikere
- Detaljeret modal med skandaler, kilder og bruger-vurdering
- Tidslinje med filtre (parti + alvorlighed)
- Økonomisk støtte (klikbar donor viser alle de har støttet)
- Internationale netværk & tilknytninger
- Brudte valgløfter
- Sammenlign to politikere
- Statistik Dashboard
- PDF-eksport

## Aktuel status & Roadmap

Se den fulde og opdaterede todo-liste her:

**[`TODO.md`](TODO.md)**

**Seneste tjek:** 9. juni 2026  
**Aktuelt antal:** Ca. 40 politikere og 90+ skandaler (live statistik juni 2026).

**Hovedstatus:**
- Flere større features er implementeret (Sammenlign to politikere, PDF-eksport, Tilføj skandale direkte, PWA, Infinite scroll, Dark mode på flere sider, Granulær data-struktur)
- Central database til delt afstemning/kommentar-moderation mangler stadig som største udestående

## Bidrag

### Tilføj en ny politiker

**Hurtig start (anbefales):**
Brug [`TILFOEJ-NY-POLITIKER-CHECKLISTE.md`](TILFOEJ-NY-POLITIKER-CHECKLISTE.md) som tjekliste.

**Detaljeret vejledning:**
- [`TILFOEJ-NY-POLITIKER.md`](TILFOEJ-NY-POLITIKER.md)
- [`MODAL-STRUKTUR.md`](MODAL-STRUKTUR.md) – teknisk struktur og krav til modalen

### Tilføj en ny skandale
Se guiden her:

**[`TILFOEJ-SKANDALE.md`](TILFOEJ-SKANDALE.md)**

## Teknisk setup

- Ren HTML + Tailwind CSS + Font Awesome
- Vanilla JavaScript
- Data i JSON-filer (manifest-baseret)
- Klar til GitHub Pages

## Kør lokalt

```bash
git clone https://github.com/MattOMadsen/skandale.dk.git
cd skandale.dk
# Åbn index.html i browseren
```