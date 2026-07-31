## Plan comparativ: CourseDNA și arhitectura de generare actuală vs cel mai recent plan discutat

### 1. Ce zice ultimul plan real
- `CourseDNA` trebuie să fie sursa unică de adevăr.
- Tonul introdus în `CourseDNA` trebuie aplicat fidel în toate generările.
- Personajele globale trebuie eliminate; povestirile trebuie folosite doar local, acolo unde ajută pedagogic.
- Fluxul principal trebuie să se concentreze pe artefactele promise de landing:
  - Trainer Guide
  - Participant Manual
  - Slide Deck
  - Exercise Sheets
  - Trainer Flow
- Pașii legacy precum `AgendaTable`, `DiagnosticQuestionnaire`, `DiscussionGuide`, `ActionPlan`, `VideoScripts` nu sunt parte din contractul principal și ar trebui să fie opționali.
- Tonul utilizatorului trebuie să fie verbatim, nu transformat în arhetipuri.

### 2. Ce observ în codul actual
- Frontend-ul încă afișează `STEPS_ORDER` cu 17 pași legacy.
- `FacilitatorNotes` și `FacilitatorManual` sunt încă separate în UI, dar în server folosesc același generator.
- `handleLegacyStep` încă procesează pași globali vechi care nu sunt legați direct de cele 5 livrabile promise.
- `buildDNABlocks(course)` încă mapă `voiceProfile` la arhetipuri (`Mentor` / `Coach` / `Buddy`).
- `CourseDNA` este generat, dar nu există dovezi că este aplicat consecvent în toate prompturile mari.
- `CourseDNA` încă include `narrativeUniverse.protagonists`, ceea ce produce povești globale inventate.

### 3. Discrepanțele cheie
- **Promise vs realitate:** planul cere 5 artefacte; codul actual generează 17 pași.
- **CourseDNA aplicat:** planul îl vrea ca sursă unică; codul actual îl reduce la un bloc de reguli și arhetipuri.
- **Tonul:** planul vrea verbatim; codul rezultă în tone standardizate.
- **Protagoniști:** planul recomandă personaje locale utile; codul încă menține o arhitectură narativă globală.
- **Legacy:** pași precum `AgendaTable`, `DiscussionGuide`, `ActionPlan` și `VideoScripts` sunt încă prezenți, deși nu sunt promise de landing.

### 4. Ce trebuie păstrat
- `CourseDNA` generat și salvat ca JSON.
- `Structure`, `Slides`, `ParticipantWorkbook`, `Exercises`, `TrainerManual` / `Trainer Guide` ca livrabile principale.
- `CourseDNA` folosit în prompturi ca `terminology`, `voiceProfile`, `domainContext`.
- `voiceProfile` aplicat exact, fără transformarea în arhetipuri.
- Povestirile/exemplele folosite doar acolo unde ajută pedagogic, nu ca engine de poveste global.

### 5. Ce trebuie eliminat / reorganizat
- Elimină din fluxul principal:
  - `AgendaTable`
  - `DiagnosticQuestionnaire`
  - `DiscussionGuide`
  - `ActionPlan`
  - `VideoScripts` (sau lasă-l opțional pentru medii unde are sens)
- Unifică `PerformanceObjectives + CourseObjectives` într-un singur pas de obiective clare.
- Unifică `FacilitatorNotes + FacilitatorManual` într-un singur pas de manual/trainer guide.
- Redefinește `TimingAndFlow` / `AgendaTable` ca parte internă a `Trainer Flow` sau `Structure`, nu ca pași independenți.

### 6. Ce trebuie verificat imediat
1. Dacă `CourseDNA` este injectat efectiv în toate prompturile principale.
2. Dacă `voiceProfileBlock` este folosit consistent și nu doar parțial.
3. Dacă `CourseDNA` mai conține personaje globale care apar peste tot.
4. Dacă `FacilitatorNotes` și `FacilitatorManual` sunt duplicate funcțional.
5. Dacă pașii legacy sunt încă afișați în modalul de generare.

### 7. Propunere de next step
- Păstrează codul actual, dar aplică un flag de tranziție: `contractPipeline`.
- Redu UI-ul la fluxul principal ales pentru landing.
- Revizuiește `generate-course-content/index.ts` astfel încât `CourseDNA` și `voiceProfile` să fie injectate în toate generările mari.
- Elimină maparea către arhetipuri și folosește textul exact din utilizator.
- Evită generarea de povești globale doar pentru că sunt în `CourseDNA`.

### 8. Rezumat pentru owner
- AI-ul face ceea ce codul i se spune: nu e vina promptului doar.
- Ultimul plan adoptat cerea deja să treci la o arhitectură curată bazată pe 5 artefacte și `CourseDNA` aplicat corect.
- Starea actuală este încă un hibrid între ceea ce ai decis și ceea ce este implementat.
- Verificarea principală de făcut este dacă `CourseDNA` este folosit cu adevărat în prompturile principale și dacă tonul scris de utilizator apare în output.
