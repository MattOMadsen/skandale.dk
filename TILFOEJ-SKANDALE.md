# Tilføj ny skandale

Denne fil beskriver, hvordan man bidrager med nye skandaler til Skandale.dk.

## Nuværende løsning (v1)

- Der findes en "Tilføj ny skandale"-knap inde i politikerens modal.
- Brugeren kan vælge en eksisterende politiker eller tilføje en ny.
- En formular genererer den korrekte JSON-struktur.
- Data sendes via [Formspree](https://formspree.io) direkte til `mattomadsen@proton.me`.
- Brugerens mailklient åbnes ikke.

Dette er en simpel og sikker løsning, der ikke kræver backend.

## Fremtidige planer (v2+)

- **Admin review flow**: Alle indsendte skandaler skal godkendes manuelt, før de bliver publiceret.
- **Automatisk Pull Request**: Mulighed for at godkende og automatisk oprette en Pull Request med de nye filer.
- **Validering**: Bedre validering af data på serversiden.
- **Moderation**: Mulighed for at afvise eller redigere indsendte skandaler.
- **Integration med Supabase**: Flyt til en rigtig database + autentificering.
- **Notifikationer**: Notifikation til admin når ny skandale indsendes.

## Tekniske detaljer

Skandaler gemmes i den granulære struktur:
`data/scandals/[politiker-slug]/`

Hver skandale har sin egen JSON-fil, og `manifest.json` i mappen skal opdateres.

---

*Oprettet: 20. maj 2026*