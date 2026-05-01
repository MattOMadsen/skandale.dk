# Skandale.dk v6.6

**En moderne, interaktiv og gennemsigtig oversigt over danske politiske skandaler.**

Siden giver brugerne mulighed for at udforske skandaler, læse juridiske analyser, stemme på sagerne, skrive kommentarer og se, hvem der økonomisk støtter politikerne.

## 🚀 Aktuel version: v6.6

### ✅ Funktioner der er implementeret

| Feature                        | Status     | Beskrivelse |
|--------------------------------|------------|-----------|
| **8 politikere**               | ✅ Færdig  | Mette Frederiksen, Inger Støjberg, Morten Østergaard, Helle Thorning-Schmidt, Lars Løkke Rasmussen, Pia Kjærsgaard, Anders Fogh Rasmussen, Morten Messerschmidt |
| **Per-skandale afstemning**    | ✅ Færdig  | Godt / Dårligt / Neutral på hver enkelt skandale |
| **Kommentarer**                | ✅ Færdig  | Brugere kan skrive og læse kommentarer under hver skandale |
| **Tidslinje + Filtre**         | ✅ Færdig  | Alle skandaler sorteret efter år + filtre på parti og alvorlighed |
| **"Hvad burde være sket?"**    | ✅ Færdig  | Juridisk analyse under hver skandale (klappbar) |
| **Økonomisk støtte**           | ✅ Færdig  | Viser største bidragydere og beløb for hver politiker (2023–2025) |
| **Split JS struktur**          | ✅ Færdig  | Koden er delt op i 5 mindre, overskuelige filer |
| **Tilføj ny skandale**         | ✅ Færdig  | Brugere kan tilføje nye skandaler (demo) |
| **Media links**                | ✅ Færdig  | Direkte links til artikler fra Berlingske, DR, Politiken, Altinget m.fl. |

### 📋 Todo / Mangler

- [ ] **Delt afstemning** – Stemmer gemmes centralt (Supabase/Firebase) så alle ser de samme tal
- [ ] **Sikkerhed på kommentarer** – Anti-spam, moderation, mulighed for at slette egne kommentarer
- [ ] **Flere politikere** – F.eks. Kristian Thulesen Dahl, Søren Pape, Uffe Elbæk m.fl.
- [ ] **Dark mode** – Mørkt tema
- [ ] **Bedre UX på kommentarer** – Vis kommentar med det samme uden at skulle genindlæse modalen
- [ ] **Export / PDF** – Download en politikers fulde skandale-rapport
- [ ] **Sammenlign politikere** – Vælg to politikere og sammenlign deres skandaler og støtte
- [ ] **PWA / Mobil app** – Kan installeres på telefon

## 🛠 Teknisk setup

- Ren statisk hjemmeside (klar til GitHub Pages)
- Tailwind CSS + Font Awesome
- JavaScript delt op i 5 filer: `data.js`, `ui.js`, `modal.js`, `timeline.js`, `main.js`
- Alt data ligger i JSON-filer (nemt at vedligeholde og udvide)
- Alt gemmes lokalt i browseren (localStorage) indtil delt afstemning implementeres
