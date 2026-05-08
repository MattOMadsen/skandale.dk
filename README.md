# Skandale.dk

**Version:** v2.00.52  
**Status:** Statisk hjemmeside klar til GitHub Pages

## Seneste ændringer (v2.00.52)
- **RESTORE**: Genskabt fuld detaljeret data for broken-promises og economic-support (Inger Støjberg, Mette Frederiksen, Morten Østergaard) fra commit f71317
- Mange tabte brudte løfter og donationsdata er nu tilbage

## Tidligere ændringer (v2.00.51)
- FIX: Tidslinjen i menuen virker nu fuldt ud (modal åbner korrekt + filtre på parti + alvorlighed)
- Tilføjet createStars(), filterTimeline() og resetTimelineFilters()

## Formål
En moderne, interaktiv og gennemsigtig hjemmeside, der giver danskerne et samlet overblik over politiske skandaler, økonomisk støtte, internationale netværk og brudte valgløfter.

## Teknisk setup
- Ren HTML + Tailwind CSS + Font Awesome
- Vanilla JavaScript delt op i 10 små filer
- Data i JSON-filer (politicians/, details/, broken-promises/, economic-support/)
- Klar til GitHub Pages

## Aktuelle funktioner (12 politikere)
- Søgning efter politikere
- Detaljeret modal med skandaler
- Per-skandale afstemning
- Kommentarer under hver skandale
- Tidslinje med filtre (parti + alvorlighed)
- Økonomisk støtte (klikbar donor)
- Internationale netværk & tilknytninger
- Brudte valgløfter

## Politikere
Mette Frederiksen, Inger Støjberg, Morten Østergaard, Helle Thorning-Schmidt, Lars Løkke Rasmussen, Pia Kjærsgaard, Anders Fogh Rasmussen, Morten Messerschmidt, Kristian Thulesen Dahl, Søren Pape Poulsen, Uffe Elbæk, Claus Hjort Frederiksen.

## Fremtidige planer
- Delt afstemning (Supabase)
- Flere politikere
- Dark mode
- PDF-eksport
- Sammenlign to politikere
- PWA

**Live demo:** https://mattomadsen.github.io/skandale.dk/

