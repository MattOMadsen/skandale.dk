# Politiker Modal Struktur (Skandale.dk)

**Mål:** Ensartet og professionel struktur i alle politikermodals, baseret på hvordan det ser ud hos Mette Frederiksen.

## Anbefalet rækkefølge i modalen

### 1. Header (altid synlig)
- Navn
- Parti (med farve)
- Rolle (f.eks. "Statsminister siden 2019")
- Avatar (farvet cirkel med initialer)

### 2. Om Politikeren (collapsible)
- **Overskrift:** "Om Politikeren"
- Kort bio / generel information om politikeren

### 3. Før politik / Ungdom (collapsible)
- **Overskrift:** Politikeren "Før politik / Ungdom"
- Tekst om baggrund før Folketinget

### 4. Karriereoversigt (collapsible)
- **Overskrift:** "Karriereoversigt"
- Tidslinje med vigtige år og begivenheder (bullet points eller præ-formateret tekst)

### 5. Skandaler
- **Overskrift:** "Skandaler"
- Liste over skandaler (med titel, år, kort beskrivelse, alvorlighed)
- Hver skandale har en **dropdown / klik for at åbne detaljer** (longDesc, outcome, justiceAnalysis, mediaLinks)

### 6. Brudte valgløfter
- **Overskrift:** "Brudte valgløfter"
- Liste over løfter (titel, år, kort beskrivelse)
- Klik åbner detalje-boks med:
  - Hvad skete der?
  - Kilde (klikbar link)
  - Andre politikere der har brudt lignende løfter (klikbare)

### 7. Økonomisk støtte
- **Overskrift:** "Økonomisk støtte (2023–2025)"
- Tabel med: Bidragyder | Beløb | Type | År
- Klik på donornavn åbner modal med alle de har støttet
- "Vis flere" knap

### 8. Internationale netværk & tilknytninger
- **Overskrift:** "Internationale netværk & tilknytninger"
- Liste over netværk (klikbar → viser alle politikere med samme tilknytning)

### 9. Footer (altid synlig)
- "Data er baseret på offentligt tilgængelige kilder"
- Delingsknapper (Twitter, Facebook, LinkedIn, Kopiér link)
- Luk-knap

## Noter
- Alle collapsible sektioner bruger samme design (pil ned, smooth animation).
- Alvorlighed vises med stjerner (1–5).
- Kilder skal være klikbare (enten som objekt {text, url} eller linkify i koden).
- Strukturen skal være den samme på alle 12 politikere for at sikre genkendelighed og troværdighed.

**Sidst opdateret:** 7. maj 2026 (v2.00.25)