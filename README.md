# Skandale.dk

**Version:** v6.9+  
**Status:** Statisk hjemmeside klar til GitHub Pages

## Formål
En moderne, interaktiv og gennemsigtig hjemmeside, der giver danskerne et samlet overblik over politiske skandaler, økonomisk støtte, internationale netværk og brudte valgløfter. Målet er at skabe større gennemsigtighed i dansk politik.

## Teknisk setup
- Ren HTML + Tailwind CSS + Font Awesome
- Vanilla JavaScript delt op i 10 små filer (1 fil = 1 funktion)
- Data i JSON-filer (én fil per politiker)
- Klar til GitHub Pages

## Aktuelle funktioner (12 politikere)
- Søgning efter politikere
- Detaljeret modal med skandaler
- Per-skandale afstemning (Godt / Dårligt / Neutral)
- Kommentarer under hver skandale
- Tidslinje med filtre (parti + alvorlighed)
- Økonomisk støtte (klikbar donor)
- Internationale netværk & tilknytninger
- Brudte valgløfter
- **Deleknap med sociale medier** (X, Facebook, LinkedIn, WhatsApp + kopiér link)

## Politikere
Mette Frederiksen, Inger Støjberg, Morten Østergaard, Helle Thorning-Schmidt, Lars Løkke Rasmussen, Pia Kjærsgaard, Anders Fogh Rasmussen, Morten Messerschmidt, Kristian Thulesen Dahl, Søren Pape Poulsen, Uffe Elbæk, Claus Hjort Frederiksen.

## Filer
- index.html
- css/styles.css
- js/ (10 filer: modal-core, modal-scandal, modal-voting, modal-comments, modal-donor, modal-broken-promises, data, ui, timeline, main, **modal-share**)
- data/politicians/ (12 JSON-filer)
- README.md

## Fremtidige planer / Todo-liste
- [ ] Delt afstemning (central database – f.eks. Supabase)
- [ ] Kommentar-moderation og sikkerhed
- [ ] Flere politikere
- [ ] Dark mode
- [ ] PDF-eksport af en politikers rapport
- [ ] Sammenlign to politikere
- [ ] PWA (kan installeres på telefon)
- [ ] Mulighed for at tilføje nye skandaler direkte på siden
- [ ] **Deep linking via URL-parameter** (f.eks. `?politician=mette-frederiksen` så delte links åbner direkte i modalen)

## Ønsket stil
Professionel, neutral og troværdig • Nem at vedligeholde • God brugeroplevelse på mobil og computer • Fokus på fakta og kilder

---

**Live demo:** https://mattomadsen.github.io/skandale.dk/