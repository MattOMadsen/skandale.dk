# Skandale.dk

**Version:** v2.00.05  
**Status:** Statisk hjemmeside klar til GitHub Pages

## Formål
En moderne, interaktiv og gennemsigtig hjemmeside, der giver danskerne et samlet overblik over politiske skandaler, økonomisk støtte, internationale netværk og brudte valgløfter. Målet er at skabe større gennemsigtighed i dansk politik.

## Seneste ændringer (v2.00.05)
- Ny data-struktur med `data/details/` mappe (core + details adskilt)
- Klikbar på internationale netværk (åbner modal med alle politikere der har samme tilknytning)
- Version nummer nu tydeligt synligt i toppen af navbaren
- Bedre vedligeholdelse og klar til flere politikere

## Teknisk setup
- Ren HTML + Tailwind CSS (via CDN) + Font Awesome
- Vanilla JavaScript delt op i 10 små filer
- Data i JSON-filer (core i `data/politicians/` + detaljer i `data/details/`)
- Klar til GitHub Pages

## Aktuelle funktioner (12 politikere)
- Søgning efter politikere
- Detaljeret modal med skandaler
- Per-skandale afstemning (Godt / Dårligt / Neutral)
- Kommentarer under hver skandale
- Tidslinje med filtre (parti + alvorlighed)
- Økonomisk støtte (klikbar donor)
- Internationale netværk & tilknytninger (klikbar)
- Brudte valgløfter
- Deleknap med sociale medier (X, Facebook, LinkedIn, WhatsApp + kopiér link)

## Politikere
Mette Frederiksen, Inger Støjberg, Morten Østergaard, Helle Thorning-Schmidt, Lars Løkke Rasmussen, Pia Kjærsgaard, Anders Fogh Rasmussen, Morten Messerschmidt, Kristian Thulesen Dahl, Søren Pape Poulsen, Uffe Elbæk, Claus Hjort Frederiksen.

## Mappe-struktur
skandale.dk/
├── index.html
├── css/styles.css
├── js/ (10 filer)
├── data/
│   ├── politicians/ (12 core JSON-filer)
│   └── details/ (12 detalje JSON-filer)
└── README.md


## Fremtidige planer / Todo-liste
- [ ] Delt afstemning (central database – f.eks. Supabase)
- [ ] Kommentar-moderation og sikkerhed
- [ ] Flere politikere fx 8 nye politikere (Mogens Jensen, Jakob Ellemann-Jensen, Troels Lund Poulsen, Mattias Tesfaye, Rasmus Prehn, Ane Halsboe-Jørgensen, Peter Hummelgaard, Barbara Bertelsen)
- [ ] Dark mode
- [ ] PDF-eksport af en politikers rapport
- [ ] Sammenlign to politikere
- [ ] PWA (kan installeres på telefon)
- [ ] Mulighed for at tilføje nye skandaler direkte på siden
- [ ] Deep linking via URL-parameter

## Ønsket stil
Professionel, neutral og troværdig • Nem at vedligeholde • God brugeroplevelse på mobil og computer • Fokus på fakta og kilder

---

**Live demo:** https://mattomadsen.github.io/skandale.dk/

Forslag:

op 6 forslag (anbefalet rækkefølge)






















































#Modal-navnBeskrivelseSværhedsgradPrioritet1Sammenlign to politikereVælg to politikere og se dem side om side (skandaler, støtte, netværk, score)Medium★★★★★2Eksporter PDF-rapportGenerer en pæn PDF med alle data om én politiker (skandaler, støtte, analyse)Medium★★★★☆3Global søgningSøg på tværs af alle skandaler, politikere, donorer og netværkLav★★★★☆4Parti-oversigtKlik på et parti og se alle skandaler + samlet statistik for partietLav★★★☆☆5"Hvad burde være sket?" oversigtSamlet modal med de vigtigste "justiceAnalysis" fra alle skandalerLav★★★☆☆6Avanceret filterAvanceret søgning med flere filtre (år, alvorlighed, parti, type)Medium★★★☆☆