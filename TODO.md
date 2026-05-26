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

**Næste prioritet?**  
Sig gerne hvilket punkt du vil have hjælp til først.