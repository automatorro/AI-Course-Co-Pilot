# Audit tehnic și pedagogic — CourseCopilot
**Data:** 18 iulie 2026 · **Perspectivă:** arhitectură React/Supabase + instructional design
**Cod analizat:** `main` (clonă completă: frontend, `supabase/functions/generate-course-content`, migrații, docs)

---

## 0. Verdict pe scurt

Aplicația nu are o problemă de calitate a AI-ului. Are o problemă de **arhitectură fragmentată**: trei sisteme de generare coexistă și se suprapun, post-procesări „de siguranță" strică textul mai rău decât îl repară, iar promisiunile din landing (5 artefacte, tonul tău „verbatim", orice limbă) nu sunt conectate la niciun mecanism real din cod. Fiecare simptom pe care l-ai raportat are o cauză exactă, demonstrabilă, mai jos.

---

## 1. Ce promite landing page-ul (contractul cu utilizatorul)

Din `src/pages/HomePage.tsx`:

| Promisiune | Formulare exactă |
|---|---|
| **5 artefacte numite** | Trainer Guide, Participant Manual, Slide Deck, Exercise Sheets, Trainer Flow — „Not a blob of Markdown. Named files, each with a job" |
| **Tonul utilizatorului** | „Tone: **Yours, verbatim**" · „Your voice — the tone, the metaphors, the taboos" |
| **Orice domeniu, orice nivel** | „Any professional domain", „Novice through executive" |
| **Live sau online** | „Live room or online cohort" |
| **Anti-slide-superficial** | Secțiunea „The shallow slide" — promite specificitate, nu bullet-uri generice |
| **Profunzime** | „as thorough as one you would build by hand" |

Acesta e etalonul. Restul auditului măsoară codul față de el.

---

## 2. Cum funcționează aplicația AZI: trei arhitecturi suprapuse

Aceasta e problema-rădăcină din care derivă aproape tot.

**Arhitectura A — Secvența „legacy" de 17 pași (frontend).** `GenerationProgressModal.tsx:41-59` definește `STEPS_ORDER` cu **17 pași** (nu 12): CourseDNA, PerformanceObjectives, CourseObjectives, Structure, LearningMethods, TimingAndFlow, AgendaTable, Exercises, DiagnosticQuestionnaire, ExamplesAndStories, FacilitatorNotes, FacilitatorManual, DiscussionGuide, Slides, ParticipantWorkbook, ActionPlan, VideoScripts. Fiecare pas invocă `generate_step_content` pe server, trimițând ca „memorie" conținutul pașilor anteriori trunchiat la 2.000 caractere/pas.

**Arhitectura B — „Golden Path" per modul (server).** `index.ts:3631` (`handleGoldenStep`): pentru pașii per-modul, serverul iterează automat TOATE modulele (`index.ts:3325-3369`), generează/reciclează un `ModuleContext` per modul, apoi apelează câte un prompt specializat (WORKBOOK / MANUAL / SLIDES / EXERCISES / VIDEO_SCRIPT).

**Arhitectura C — Granular pe lecții.** Dacă există rânduri în `course_lessons`, `handleGoldenStep` deviază în `generateLessonContent` per lecție (`index.ts:3746-3752`), cu un ModuleContext „fals" construit din lecție (`index.ts:2846`), care pierde macro-poziția (isFirst/isLast, tranziții — hardcodate `false/null` la 2881-2888).

Consecințe directe:
- **Aceleași informații se generează de mai multe ori** sub nume diferite (Structure vs AgendaTable vs TimingAndFlow; FacilitatorNotes vs FacilitatorManual — vezi §6).
- **Nicio sursă unică de adevăr pentru coerență**: Arhitectura A leagă pașii prin context trunchiat la 2.000 caractere; B prin ModuleContext; C rupe firul narativ. De aici inconsistențele dintre materiale pe care le tot documentați în `docs/` din ianuarie încoace.
- Frontend-ul folosește chei `course.steps.*` iar serverul acceptă dublete (`'slides'`/`'course.steps.slides'` etc.) în `switch`-uri răspândite în 4 locuri — fragil la orice redenumire.

---

## 3. Bug-ul „Alex, Alex, Alex" și „pozițAlexând" — cauză demonstrată

Exemplul pe care l-ai lipit e produs de **`ProtagonistEnforcer`** (`supabase/functions/generate-course-content/fixes/protagonist_enforcer.ts`), aplicat pe **fiecare** livrabil generat (`index.ts:2628, 2691, 2745, 2775, 2794`).

Ce face: are o listă de nume „interzise" (`ion, maria, ana, bogdan, vasile, elena, andrei, mihai, alexandru, ioana, george`) și le înlocuiește **orb, prin regex**, cu numele protagonistului. Protagonistul implicit, când DNA-ul nu are unul, este `'Alex'` (`index.ts:3679`).

Două defecte fatale:

**3a. Distruge personajele secundare.** Exercițiul tău avea nevoie de 4 stakeholderi diferiți. Modelul a generat probabil „Maria (Manager Customer Support)" și „Andrei (DPO)" — enforcer-ul i-a înlocuit pe amândoi cu „Alex". Rezultatul: trei personaje distincte, toate numite Alex, într-un exercițiu de stakeholder mapping — exact ce ai citat. Pedagogic, exercițiul devine inutilizabil.

**3b. Sparge cuvinte românești.** Regex-ul folosește `\b` (word boundary) **fără flag Unicode**. În JavaScript, `\b` recunoaște doar `[A-Za-z0-9_]` ca litere; diacriticele `ț`, `ă`, `â` sunt tratate ca separatoare. În „pozi**ț**ion**â**nd", secvența „ion" e mărginită de `ț` și `â` → `\bion\b` face match → „ion" devine „Alex" → **„pozițAlexând"**, litera cu litera ce apare în materialul tău. Același mecanism va lovi „naț**ion**al", „profes**ion**ist", „situaț**ion**al", „**maria**j" etc.

**Recomandare:** ștergerea completă a `ProtagonistEnforcer` (și a folderului `fixes/` — cele trei fișiere de acolo sunt patch-uri nefolosite sau periculoase). Consistența protagonistului se obține în prompt (deja există `{{protagonistName}}` peste tot) plus, eventual, o **validare** care doar semnalează, nu rescrie. Post-procesarea prin find-replace pe text generat de LLM este categoric o anti-practică.

---

## 4. Amestecul de limbi — patru cauze cumulate

**4a. Șabloanele de prompt conțin română hardcodată, prezentată ca format obligatoriu.** `EXERCISES_PROMPT` (`index.ts:1809-1893`) cere „ALL content in {{language}}" dar impune structura cu titluri fixe: `### Instrucțiuni Participant`, `### Spațiu de Lucru`, `### Instrucțiuni Facilitator`, `**Întrebări de Debrief:**`, tabelul `| Etapă | Durată | Acțiune Facilitator | ...`. Modelul copiază fidel headerele-șablon — de aceea materialul tău are exact aceste titluri, indiferent de limbă, amestecate cu `**Format:**` și `**Obiectiv:**` în engleză/română aleator. Aceeași problemă în `WORKBOOK_PROMPT:1554` („**Povestea lui/ei {{protagonistName}}:**") și în prompturile globale (`index.ts:394, 555`).

**4b. Slide-urile „cost-zero" au română hardcodată chiar și pentru cursuri în engleză.** `generateCostZeroSlides` (`index.ts:2560-2562`) scrie literal `- Aplicarea conceptelor prezentate prin exercițiu practic` în CONTENT, iar dicționarul de etichete există doar pentru `ro` și `en` (`COST_ZERO_SLIDES_LABELS:2478`) — orice altă limbă cade pe română. Promisiunea „any language" nu are acoperire.

**4c. Validarea de limbă este dezactivată exact pe livrabilele mari.** `callLLM` are un detector determinist bun (`index.ts:1023`), dar `handleGoldenStep` apelează generatorii cu `skipAiValidation` implicit `true` (`generateWorkbookContent`, `generateManualContent(..., true, ...)`, `generateExercisesContent` — `index.ts:3759-3782`). Deci workbook-ul, manualul și exercițiile — cele mai lungi texte — nu trec deloc prin verificarea de limbă. Doar fluxul pe lecții o activează.

**4d. Detectorul acoperă 5 limbi** (`LANG_SIGNATURES:972` — ro, en, fr, de, es). Pentru orice altă limbă promisă de landing, verificarea e un no-op.

**Recomandare:** toate headerele structurale să vină dintr-un singur set de `localizedLabels` generat o dată per curs (mecanismul există deja parțial în golden-parser: `getDefaultEnglishLabels`, `labels?.objective` etc.) și injectat în prompturi ca variabile — zero text hardcodat în vreo limbă în șabloane. Validarea de limbă activată uniform, cu un singur retry.

---

## 5. „ADN-ul" cursului: de ce tonul nu se aplică

`buildDNABlocks` (`index.ts:1233`) construiește corect 5 blocuri, dar aplicarea lor e găurită:

1. **Exercițiile — materialul pe care l-ai citat — nu primesc deloc vocea.** `EXERCISES_PROMPT` nu conține `{{voiceProfile}}` și nici `{{terminology}}`, iar `generateExercisesContent` (`index.ts:2749`) nici nu le pasează. Tonul ales în DNA nu ajunge niciodată în foile de exerciții.
2. **Slide-urile nu trec prin AI pe calea principală.** Când există lecții (cazul normal după noile migrații), slide-urile ies din șablonul determinist `generateCostZeroSlides` — zero ton, zero DNA, un bullet per slide. Asta contrazice frontal promisiunea „The shallow slide". Ai economisit tokeni exact acolo unde landing-ul promite profunzime.
3. **Tonul e strivit în 3 arhetipuri predefinite.** `buildDNABlocks:1256-1264`: orice ar scrie utilizatorul la formality, sistemul îl mapează pe „The Mentor" / „The Coach" / „The Buddy" prin `String.includes()` pe cuvinte-cheie englezești. „Yours, verbatim" din landing devine, în realitate, „unul din trei preseturi ale noastre". Frazele-semnătură și interdicțiile utilizatorului se pierd dacă formality-ul nu conține exact `casual`/`energetic`.
4. **`domainContextBlock` (termeni de industrie, profiluri de clienți, competitori) e injectat doar în `MODULE_CONTEXT_PROMPT`** (`index.ts:1429`), nu și în livrabilele finale — adică influențează scheletul, dar nu textul pe care îl citește participantul.
5. **Blocurile DNA sunt scrise în engleză** chiar și pentru cursuri românești, ceea ce alimentează suplimentar contaminarea lingvistică din §4.

---

## 6. Economia de tokeni: unde se arde bugetul

Estimare pentru un curs LIVE cu 5 module, o singură generare completă, fără retry-uri:

| Sursă de apeluri LLM | Apeluri |
|---|---|
| Pași globali (DNA, obiective×2, structură, metode, timing, agendă, diagnostic, discussion guide, action plan) | ~10 |
| Story Arc + ModuleContext (5 module) | ~6 |
| Exercises, per modul | 5 |
| ExamplesAndStories, per modul | 5 |
| **FacilitatorNotes, per modul — generează manualul COMPLET** | **5** |
| **FacilitatorManual, per modul — generează ACELAȘI manual încă o dată** | **5** |
| Workbook (intro + 5 module + outro, prin `generate_workbook_part`) | 7 |
| Slides (per modul, dacă nu există lecții) | 0–5 |
| **Total** | **~43–48** |

Cu retry-ul de limbă/fraze interzise (`retryWithStrictInstructions` reapelează cu promptul integral + instrucțiuni), orice apel se poate dubla → plafon realist **~90 de apeluri** per generare.

Punctele critice:

- **Duplicarea FacilitatorNotes/FacilitatorManual e risipă pură 2×** pe cel mai scump prompt: `index.ts:3763-3766` rutează ambele step-type-uri către `generateManualContent` complet, iar `STEPS_ORDER` le rulează pe amândouă pentru cursurile live.
- **Suprapunerea Structure / TimingAndFlow / AgendaTable**: trei apeluri globale care produc în esență aceeași agendă în trei formate, apoi validatoarele din frontend (`outputValidators`) încearcă să le re-alinieze a posteriori.
- **17 livrabile generate vs 5 promise.** DiagnosticQuestionnaire, DiscussionGuide, ActionPlan, ExamplesAndStories, CheatSheets, Projects, Tests — niciunul nu apare în landing. Fiecare costă tokeni, timp de generare (utilizatorul așteaptă în modal) și suprafață de bug-uri, iar propria voastră analiză (`docs/brutal_reassessment.md`) arată că livrabilele de bază ies subțiri („Caietul participantului: 3 pagini aproape goale"). Ați plătit lățime în loc de adâncime.

---

## 7. Butoanele „Generează" și „Rafinează cu AI" din editor: cod mort, demonstrabil

Aici e mai grav (sau mai simplu) decât „consum inutil de tokeni": **fluxul e rupt cap-coadă și nu poate funcționa**.

Traseul: butoanele din `CourseWorkspacePage.tsx` → `geminiService.invokeContentFunction` → trimite `{ action: 'generate' | 'refine', course, step, refinePayload }`. Pe server însă:

1. **Nu există niciun handler pentru `action === 'generate'`, `'improve'` sau `'refine'`** — am verificat toate ramurile din `serve()` (`index.ts:3044-3299`).
2. Cererea cade în fluxul generic, care extrage `const { step_type } = body` (`index.ts:3301`) — dar clientul trimite `step`, nu `step_type` → `step_type === undefined`.
3. `undefined` nu e în `GLOBAL_STEPS`, nici în `PER_MODULE_STEPS_AUTO` → ramura B aruncă `"[CRITICAL] module_id is required for step 'undefined'"` (`index.ts:3401`).
4. `refinePayload` (textul selectat + acțiunea simplify/expand/example) **nu este citit nicăieri în tot serverul** — zero referințe.

Deci butoanele fie eșuează, fie (în versiuni anterioare de server) regenerau întregul pas de la zero ignorând selecția. Decizia ta de a le elimina e corectă și fără costuri ascunse. **Lista completă de ștergere:**

| Fișier | Ce se șterge |
|---|---|
| `src/config/featureFlags.ts` | cheile `editorRefineButtonEnabled`, `editorGenerateButtonEnabled` + intrările din `FEATURE_DOCS` și din union type |
| `src/pages/CourseWorkspacePage.tsx` | blocurile UI desktop (~1769-1810) și mobil (~2108-2140); `handleAiAction`, `handleGenerate` (varianta care apelează `generateCourseContent`), `canGenerate`, `canRefine`, `isAiActionsOpen`, `aiActionsDesktopRef/MobileRef`, `isProposingChanges`, `proposedContent`/`originalForProposal` + `handleAcceptChanges`/`handleRejectChanges`, `localRefinements`, importurile `Sparkles`, `Wand`, `Pilcrow`, `Combine`, `Lightbulb`, `refineCourseContent` |
| `src/services/geminiService.ts` | `invokeContentFunction`, `generateCourseContent`, `improveCourseContent` (deja marcată deprecated), `refineCourseContent` |
| `src/components/ReviewChangesModal.tsx` | de șters dacă e folosit doar de fluxul de propuneri refine (de verificat referințele înainte) |
| `src/__tests__` / chei i18n | testele și cheile `course.refine.*` rămase orfane |

Notă separată: rafinarea de **Blueprint** (`BlueprintRefineModal`, `action: 'refine_blueprint'`) are handler pe server și e alt flux — nu o confunda cu ștergerea de mai sus; decizi separat dacă o păstrezi.

---

## 8. Alte constatări relevante

- **Erorile serverului sunt mascate cu status 200** (`index.ts:3412-3424` — „Intentional 200 to bypass Edge Function 500 trap"). Clientul primește `{error}` cu 200, dar în multe locuri verifică doar `data.content` → utilizatorul vede mesaje generice („răspuns invalid") în loc de cauza reală. Îngreunează sistematic debugging-ul pe care îl tot faceți în `docs/`.
- **Credit gate „fail-open"** (`index.ts:3009-3040`): dacă RPC-ul de credit eșuează, generarea (cea mai scumpă operație) trece nelimitat.
- **Fallback-uri de model învechite/riscante**: lanțul `gemini-3.5-flash → 3.1-flash-lite → 2.5-flash` plus `moonshot-v1-8k` (context 8k — insuficient pentru prompturile voastre lungi; risc de trunchiere silențioasă când Gemini pică).
- **Cheia Stripe live e hardcodată în `constants.ts`.** E o cheie *publishable* (publică prin design), dar merită mutată în env pentru igienă și medii separate test/live.
- **Repo-ul cară balast**: `docs/` cu ~70 de planuri/analize parțial contradictorii, `fixes/` cu patch-uri neintegrate, `header.txt`, pagini de test (`RlsTestPage`) — zgomot care încetinește orice colaborator (uman sau AI) și explică de ce fiecare „restructurare totală" a mai adăugat un strat în loc să scoată unul.

---

## 9. Sinteza: promisiune vs realitate

| Promisiune landing | Stare în cod |
|---|---|
| 5 artefacte numite, „each with a job" | 17 livrabile difuze; „Trainer Flow" nu există ca artefact — e împrăștiat în Timing/Agenda |
| „Tone: Yours, verbatim" | 3 arhetipuri predefinite; vocea lipsește complet din exerciții și slide-uri |
| Orice limbă | Șabloane cu română hardcodată; detector pentru 5 limbi; etichete slide pentru 2 |
| Slide-uri profunde, nu superficiale | Șablon determinist cu 1 bullet/slide pe calea principală |
| „As thorough as built by hand" | Lățime (17 outputs) în detrimentul adâncimii; propria analiză internă: workbook 2/10 |
| Live vs Online respectat | Singura zonă solidă: `envConstraints` sunt injectate consecvent ✔ |

---

## 10. Direcția de simplificare propusă (de discutat, nu de implementat încă)

1. **O singură arhitectură de generare**: Blueprint aprobat → `ModuleContext` per modul (păstrat, e o idee bună și e deja cache-uit) → exact **5 livrabile aliniate 1:1 cu landing-ul** (Trainer Guide, Participant Manual, Slide Deck, Exercise Sheets, Trainer Flow). Se elimină arhitectura legacy de 17 pași și dubletul FacilitatorNotes/Manual; „Trainer Flow" devine un livrabil real (agenda coreografiată), absorbind Timing/Agenda/DiscussionGuide.
2. **Ștergere definitivă** a butoanelor Generate/Refine din editor (lista din §7) și a `ProtagonistEnforcer` + folderul `fixes/`.
3. **Localizare prin `localizedLabels`** generate o dată per curs; zero text hardcodat în șabloane; validare de limbă activă uniform, cu maximum un retry.
4. **DNA aplicat uniform**: același bloc de voce (textul utilizatorului, nu arhetipuri) injectat identic în toate cele 5 prompturi; `domainContext` inclus în livrabile, nu doar în context.
5. **Slide-uri: hibrid, nu cost-zero**: structura din lecții (ieftin, determinist) + un singur apel AI per modul care scrie conținutul și speaker notes în vocea cursului — compromisul corect între cost și promisiunea „no shallow slides".
6. **Rezultat estimat pe un curs de 5 module**: de la ~45-90 de apeluri LLM la **~20-25** (3 globale + 5 contexte + 5×~3-4 livrabile AI), cu calitate mai mare pentru că fiecare prompt primește context complet, nu trunchiat la 2.000 de caractere.

Ordinea de atac recomandată: întâi §7 și §3 (ștergeri sigure, câștig imediat de calitate), apoi §4 (localizare), apoi consolidarea arhitecturii (§10.1) — cea mai mare, dar abia după ce terenul e curățat.
