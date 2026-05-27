# TODO & Roadmap – Skandale.dk

**Sidst tjekket:** 26. maj 2026  
**Baseret på gennemgang af:** `index.html`, `js/`, `manifest.json`, `sw.js`, `data/` mappen og dokumentationsfiler.

---

## ✅ Fuldført

- **Sammenlign to politikere**  
  `js/modal-compare.js` + menu-link i både desktop og mobil.

- **PDF-eksport af en politikers rapport**  
  `js/modal-pdf-export.js` + jsPDF CDN er fuldt integreret.

- **Mulighed for at tilføje nye skandaler direkte på siden**  
  `js/modal-add-scandal.js` (med Formspree-integration og mulighed for at tilføje ny politiker samtidig).

- **PWA (kan installeres på telefon)**  
  `manifest.json` + `sw.js` + ikoner i `icons/` mappen er på plads. Siden kan installeres som standalone app.

---

## ⚠️ Delvist implementeret / I gang

- **Kommentar-moderation og sikkerhed**  
  `js/modal-comments.js` findes og viser kommentarer.  
  *Mangler:* Rigtig moderation, admin-godkendelse og backend-sikkerhed (statisk site).

- **Delt afstemning (central database)**  
  `js/modal-voting.js` findes.  
  *Mangler:* Central database (Supabase, Firebase eller lignende). Alt er pt. client-side.

---

## ❌ Ikke startet endnu

- **Dark mode**  
  Ingen dark mode toggle eller `dark:`-klasser implementeret endnu.

- **Central database til delt afstemning + moderation**  
  Kræver backend-løsning (f.eks. Supabase) for at gøre afstemning og kommentarer rigtigt delte og modererede.

---

## Andre forbedringsforslag (ikke på original todo)

- Gøre antallet af politikere **dynamisk** i hero-badge (i stedet for hardcoded).
- Rydde op i ubrugte ID'er (f.eks. `politician-count`).
- Tilføje en rigtig admin-dashboard til godkendelse af indsendte skandaler (via Formspree).
- Forbedre mobil-UX yderligere.
- Tilføje flere politikere (strukturen er allerede klar).

---

# TODO & Roadmap – Skandale.dk

**Sidst opdateret:** 27. maj 2026  
**Baseret på gennemgang af:** `index.html`, `js/`, `manifest.json`, `sw.js`, `data/` mappen og dokumentationsfiler.

---

## ✅ Fuldført

- **Sammenlign to politikere**  
  `js/modal-compare.js` + menu-link i både desktop og mobil.

- **PDF-eksport af en politikers rapport**  
  `js/modal-pdf-export.js` + jsPDF CDN er fuldt integreret.

- **Mulighed for at tilføje nye skandaler direkte på siden**  
  `js/modal-add-scandal.js` (med Formspree-integration og mulighed for at tilføje ny politiker samtidig).  
  *Opdatering 27/5:* Submit-knappen virker nu korrekt (global funktion eksponeret).

- **PWA (kan installeres på telefon)**  
  `manifest.json` + `sw.js` + ikoner i `icons/` mappen er på plads. Siden kan installeres som standalone app.

- **Password-beskyttet Admin Dashboard**  
  `js/modal-admin.js` (v2)  
  - Mulighed for at tilføje godkendte skandaler manuelt via et simpelt password-beskyttet interface.  
  - Politiker-dropdown + mulighed for ny politiker.  
  - Pending-noter med localStorage.  
  - JSON-eksport efter tilføjelse (klar til at kopiere ind i data-filer).  
  - Bedre validering, feedback og auto-opdatering af hovedvisningen.

---

## ⚠️ Delvist implementeret / I gang

- **Kommentar-moderation og sikkerhed**  
  `js/modal-comments.js` findes og viser kommentarer.  
  *Mangler:* Rigtig moderation, admin-godkendelse og backend-sikkerhed (statisk site).

- **Delt afstemning (central database)**  
  `js/modal-voting.js` findes.  
  *Mangler:* Central database (Supabase, Firebase eller lignende). Alt er pt. client-side.

---

## ❌ Ikke startet endnu

- **Dark mode**  
  Ingen dark mode toggle eller `dark:`-klasser implementeret endnu.

- **Central database til delt afstemning + moderation**  
  Kræver backend-løsning (f.eks. Supabase) for at gøre afstemning og kommentarer rigtigt delte og modererede.

---

## Andre forbedringsforslag

- Gøre antallet af politikere **dynamisk** i hero-badge (i stedet for hardcoded "15 politikere").
- Rydde op i ubrugte ID'er (f.eks. `politician-count`).
- Forbedre mobil-UX yderligere.
- Tilføje flere politikere (strukturen er allerede klar).
- Mulighed for at slette/redigere skandaler i Admin Dashboard (fremtidig forbedring).

---

**Næste prioritet?**  
Sig gerne hvilket punkt du vil have hjælp til først.