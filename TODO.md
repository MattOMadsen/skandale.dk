# TODO & Roadmap – Skandale.dk

**Sidst tjekket:** 27. maj 2026  
**Baseret på gennemgang af:** `index.html`, `js/`, `manifest.json`, `sw.js`, `data/` mappen og dokumentationsfiler.

---

## 🐞 Kendte bugs (skal fixes)

- **Tidslinje virker ikke fra menuen**  
  Når man klikker på "Tidslinje" i både desktop og mobil menu, sker der intet (eller funktionen findes ikke).

- **Sammenlign virker ikke ordentligt**  
  Funktionen åbner, men viser ikke politikerne korrekt / kan ikke vælge politikere ordentligt.

- **"Før politik / Ungdom" og "Karriere oversigt" virker ikke i modal**  
  I politikermodalen vises sektionerne "Før politik / Ungdom" og "Karriere oversigt" ikke eller fungerer ikke som forventet.

- **"Tilføj ny" i modal virker ikke**  
  Muligheden for at tilføje ny skandale direkte fra politikermodalen virker ikke.

- **Modal lukker hele politikeren når man interagerer inde i den**  
  Når man åbner f.eks. en skandale, kommentar, eller andet inde i en politikers modal, og derefter lukker det, går man tilbage til forsiden i stedet for at vende tilbage til politikermodalen.

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

- **Erstat Tailwind Play CDN** med en lokal, optimeret/purged `tailwind.css` fil (større performance forbedring på første load).
- Gøre antallet af politikere **dynamisk** i hero-badge (i stedet for hardcoded).
- Rydde op i ubrugte ID'er (f.eks. `politician-count`).
- Forbedre mobil-UX yderligere.
- Tilføje flere politikere (strukturen er allerede klar).
- Mulighed for at slette/redigere skandaler i Admin Dashboard (fremtidig forbedring).

**Nye punkter tilføjet 27. maj 2026 (fra arkitektur & UX gennemgang):**
- **Modal-arkitektur inkonsistent**  
  Nogle modals bygges 100% dynamisk i JS (f.eks. via `modal-core.js`), mens timeline bruger en statisk tom shell i `index.html`. Dette har direkte forårsaget den tomme/gennemsigtige boks i menuen. Anbefaling: Gør `timeline.js` selvforsynende og dynamisk for robusthed.

- **Forbedre fejlhåndtering og loading-states yderligere**  
  `timeline.js` har allerede en god spinner + proaktiv data-loading – brug dette mønster konsekvent andre steder i appen for ensartet brugeroplevelse.

- **Automatisk/konsekvent dokumentationsopdatering**  
  Opdater `TODO.md` og `CHANGELOG.md` systematisk efter større fixes (gerne som en del af udviklingsprocessen).

- **Test af mobil-menu + modals integration**  
  Sørg for at alle menu-links (inkl. Tidslinje) virker problemfrit på både mobil og desktop, og at der ikke opstår z-index- eller lukke-problemer mellem modals.

- **Gør timeline.js mere robust**  
  Lad `timeline.js` dynamisk opbygge manglende indre HTML-struktur i `#timelineModal`, så den ikke er afhængig af specifikke elementer i `index.html`. (Dette er nu implementeret som en del af fixet.)

---

**Næste prioritet?**  
Sig gerne hvilket punkt du vil have hjælp til først.