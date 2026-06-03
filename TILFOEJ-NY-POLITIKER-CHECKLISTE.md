# Tjekliste: Tilføj ny politiker

Denne tjekliste er ment som en hurtig og praktisk guide, når du skal tilføje en ny politiker til Skandale.dk.

**Læs altid først:**
- [`MODAL-STRUKTUR.md`](MODAL-STRUKTUR.md) – for den tekniske struktur og krav til modalen
- [`TILFOEJ-NY-POLITIKER.md`](TILFOEJ-NY-POLITIKER.md) – for den detaljerede vejledning

Brug denne tjekliste som en hurtig afkrydsningsliste.

---

## Forudsætninger

- [ ] Du har besluttet dig for en god `slug` (f.eks. `alex-vanopslagh`)
- [ ] Du har fundet pålidelige kilder til bio, karriere og eventuelle skandaler/løfter

## Trin 1: Opret politikeren

- [ ] Opret filen `data/politicians/[slug].json`
- [ ] Tilføj politikeren til `data/politicians/manifest.json` (i arrayet)
- [ ] Udfyld følgende **krævede felter** i JSON-filen:

  **Påkrævede felter:**
  - `id` (unikt nummer)
  - `name`
  - `party`
  - `role`
  - `avatarColor` + `initials`
  - `image` ← **Vigtigt!** (Wikimedia eller officiel kilde – undgå kun avatarColor)
  - `bio`
  - `beforePolitics` (med `title` + `content`)
  - `careerTimeline`

## Trin 2: Opret mapper og datafiler

- [ ] Opret mappen `data/scandals/[slug]/`
  - [ ] Opret `manifest.json` i mappen (selv hvis den er tom til at starte med)
- [ ] Opret mappen `data/broken-promises/[slug]/`
  - [ ] Opret `manifest.json` i mappen
- [ ] Opret filen `data/affiliations/[slug].json` (kan være tom array til at starte med)
- [ ] Opret filen `data/economic-support/[slug].json` (kan være tom array til at starte med)

## Trin 3: Indholdskvalitet

- [ ] Der er mindst **én skandale** med `longDesc`, `ourSeverity` og `mediaLinks`
- [ ] Der er mindst **ét brudt løfte** (hvis relevant)
- [ ] `bio`, `beforePolitics` og `careerTimeline` er skrevet i et neutralt og faktabaseret tonefald
- [ ] Alle kilder er angivet med links

## Trin 4: Test

- [ ] Åbn siden lokalt og tjek at politikeren dukker up på forsiden
- [ ] Åbn modalen og tjek at alle sektioner vises korrekt
- [ ] Tjek at billedet vises (hvis `image` feltet er udfyldt)
- [ ] Tjek dark mode
- [ ] Tjek mobilvisning

## Efter tilføjelse

- [ ] Opdater `POLITIKER-STATUS.md` hvis relevant
- [ ] Tilføj en linje i `CHANGELOG.md`
- [ ] Commit + push

---

**Tip:** Start gerne med at kopiere en eksisterende politiker-JSON (f.eks. en af de nyere som `ida-auken.json`) som skabelon.

Har du spørgsmål undervejs, så spørg hellere en gang for meget end en gang for lidt.