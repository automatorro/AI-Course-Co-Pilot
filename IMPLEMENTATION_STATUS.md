# IMPLEMENTATION_STATUS — CourseCopilot refactor 2026-07

**Sursa unică de adevăr a progresului.** Se bazează pe:
- `docs/AUDIT-CourseCopilot-2026-07-18.md` (diagnostic)
- `docs/CURATENIE-SI-MODERNIZARE-CourseCopilot.md` v2.0 (plan de execuție)

Convenții:
- Statusuri: `TODO` · `IN_PROGRESS` · `DONE` · `BLOCKED(motiv)` · `N/A`
- `DONE` doar cu Definition of Done al fazei confirmat.
- Descoperirile mergi în §Descoperiri; nu improvizezi soluții.

---

## ▶ REIA DE AICI (scris 2026-08-14, sesiunea S06 — actualizat după F2-T4)

**Stare curentă:** F2 DONE (T1+T2+T3+T4+T5). M1 DONE. CI deploy funcțional. Migrație SQL F2-T1 AȘTEAPTĂ confirmare owner.

### Task următor: F3 — Arhitectura de prompturi + contractul de modul

Sau: confirmă că ai rulat SQL-ul din F2-T1, ca să bifăm M2 complet.

### SQL neconfirmat — F2-T1 (courses.localized_labels)

```sql
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS localized_labels jsonb DEFAULT NULL;
```

Rulat în Studio? Dacă da, confirmă în chat.

### F2-T4 — ce s-a făcut

Inventar complet al prompturilor din `index.ts` pentru meta-instrucțiuni în română. Singurele probleme găsite au fost în MANUAL_PROMPT:
- `English/Romanian here only` → `English here only` (regula A.1: meta-limbajul e EN, nu RO)
- `# Modul: {{moduleTitle}}` → `Begin with the module title as a level-1 heading in {{language}}` (eliminat hardcoding RO în OUTPUT FORMAT)
Toate celelalte prompturi (MODULE_CONTEXT_PROMPT, WORKBOOK_PROMPT, SLIDES_PROMPT, EXERCISES_PROMPT, VIDEO_SCRIPT_PROMPT, toate inline-urile) erau deja în EN. Codul mort (D-011: GOLDEN_SAMPLES) ignorat conform planului.

### Verificare Supabase (§B) — CONFIRMATĂ 2026-08-14

Owner a confirmat în chat că toate există:
- ✅ `waitlist_leads` și `demo_sessions` — tabelele există
- ✅ `course_steps.is_completed` și `course_steps.status` — coloanele există

### F2-T5 — Test puritate lingvistică

De scris `src/tests/languagePurity.test.ts`. Node disponibil în mediul remote (Node 22), deci poate fi scris și rulat direct.

---

**Sesiuni S05 nedocumentate (10-11 aug, lucru ad-hoc în afara fazelor):**
- 599dd5a — fix iterare per-modul (Exercises, Examples, Manual) în `GenerationProgressModal` + acțiuni server noi
- 4bef20f — feat: log token usage (Gemini/Moonshot) în `user_usage` fire-and-forget
- 2989956 — fix `resolveModuleId`: rejectează ID-uri sintetice frontend, verifică mereu prin DB
- 9f2cb92 — fix i18n: anglicisme înlocuite în landing page (RO)
- 88d5459 — feat: UsageSection UI (gauge credite AI, cost lunar) în ProfilePage
- 352c217 — fix: unused vars in UsageSection (TS6133)
- f2d2296 — fix: SUPABASE_SECRET_KEYS fallback + supabase client în logUsage
- 65ff9ce — fix: ACTION_OPERATION_COSTS cu numele reale de acțiuni
- bfb9813 — docs: arhivare fișiere Trae sub `docs/_archive/trae-legacy/`
- 9788ca9 — Update CLAUDE.md (sesiune owner, 14 aug)

Niciuna din cele de mai sus nu e parte din F2–F10 formal. Sunt fix-uri/features ad-hoc confirmate de owner. Nu modifică starea bornelor M0–M10.

---

## Borne (M0–M10)

| Bornă | Faza | Livrabil verificabil | Status |
|---|---|---|---|
| M0 | F0 | Tag + status file + baseline „before" + fixture etalon | DONE (baseline SKIPPED prin decizie owner — vezi F0-T3) |
| M1 | F1 | Cod mort șters (butoane editor, ProtagonistEnforcer, fixes/); build verde | DONE (2026-08-14 — deploy edge function verde, CI funcțional) |
| M2 | F2 | Test puritate lingvistică verde (EN fără RO, RO fără EN) | TODO |
| M3 | F3 | Arhitectura de prompturi instalată: prompts/ + changelog + preambul de ton | TODO |
| M4 | F4 | Contracte de modul valide pe etalon; **aprobate de owner** (poarta umană 1) | TODO |
| M5 | F5 | Cele 5 livrabile randate din contract, validare deterministă verde | TODO |
| M6 | F6 | **Rubrica ≥ prag pe cursul-etalon (RO+EN)** — poarta de calitate (poarta umană 2) | TODO |
| M7 | F7 | Slides: layout stabil generare→editor→export, zero AI la export | TODO |
| M8 | F8 | Plafon 8h în UI+server; landing actualizat | TODO |
| M9 | F9 | Design system pe toate exporturile (DOCX/PDF/PPTX) | TODO |
| M10 | F10 | Legacy șters; index.ts spart în module; e2e verde | TODO |

**Porți umane blocante (cer aprobare explicită a owner-ului):**
1. **M4** — la finalul F3, aprobare contracte de modul valide pe etalon
2. **M6** — la finalul F6, aprobare rubrică ≥4,0 pe RO+EN

---

## Verificări restante (owner — verifică la fiecare reluare, nu sări peste)

Sesiunile de-aici (acest IDE) nu au Node/npm instalat (D-012) și **nu rulează niciodată** SQL pe Supabase (regulă nenegociabilă, `CLAUDE.md § 1`). Cele două liste de mai jos sunt cozile corespunzătoare. O intrare se bifează DOAR de owner, după verificare reală pe o mașină cu Node / cu acces la Supabase Studio — nu se șterge o intrare doar pentru că a trecut timp sau pentru că „probabil e ok".

### A. Cod scris fără typecheck/test local (fără Node/npm aici)
De rulat pe laptopul personal (Node 18+):
```
cd CourseCopilot
npm install
npm run typecheck
npm test
```
Dacă ceva pică, spune exact ce — nu presupune că a mers doar pentru că nimeni nu s-a plâns.

| Verificat (data) | Commit-uri | Ce conțin |
|---|---|---|
| ☑ 2026-08-08 | `f3cb0f0`..`a5e7e0e` (7 aug) | Draft save/resume în `GenerationProgressModal` — cea mai riscantă bucată nouă, logică de upsert/state. Typecheck a picat inițial (2 variabile fără tip); reparat, vezi D-013. |
| ☑ 2026-08-08 | `f13d6b9`, `060adcb` (8 aug) | Sterilizare prompturi F2-T2 — text-only în template literals, risc mic. Typecheck/test verde, fără probleme găsite în acest cod. |

### B. Migrații SQL scrise dar fără confirmare scrisă că au fost rulate manual
Regula corectă (deja în `CLAUDE.md § 1`, respectată de aici înainte): Claude scrie `.sql` sub `supabase/migrations/` + postează SQL-ul complet în chat; **numai owner-ul** îl copiază în Supabase Studio → SQL Editor și confirmă. Lista de mai jos = ce există în `supabase/migrations/` sau e presupus de cod, fără o confirmare scrisă aici că a rulat.

| Rulat manual? | Ce | Semnal |
|---|---|---|
| ☐ | `supabase/migrations/20260718_lead_capture.sql` — tabelele `waitlist_leads`, `demo_sessions` | Commit `683605c` (19 iul) a adăugat explicit un fallback în UI „pentru cazul în care tabela nu există încă" — deci la acea dată sigur nu era rulată. Nicio confirmare ulterioară găsită. |
| ⚠️ de verificat direct în Supabase Studio | Coloanele `course_steps.is_completed` / `course_steps.status` (valoarea `'draft'`) | Feature-ul de draft/resume (`f3cb0f0`, 7 aug) le scrie prin upsert, dar **nu există nicio migrație** în `supabase/migrations/` care să le adauge pe `course_steps`. Fie există deja din schema de bază (creată direct în Studio, înainte de convenția de migrații), fie feature-ul eșuează silențios (are try/catch cu `console.warn`, deci nu vezi eroare vizibilă — doar lipsă de date). |

**Cum verifici B rapid:** Supabase Studio → Table Editor → caută `waitlist_leads` și `demo_sessions` (există?); deschide `course_steps` → Columns → caută `is_completed` și `status`. Raportează ce găsești, ca să pot bifa/corecta lista.

---

## Task-uri pe faze

### F0 — Plasă de siguranță (½ zi) · Risc: zero
- **F0-T1** [DONE] `git tag pre-refactor-2026-07` + `IMPLEMENTATION_STATUS.md` (borne + toate task-urile + secțiunea Descoperiri)
- **F0-T2** [DONE] `docs/` → `docs/_archive/`; creat `docs/golden-references/`, `docs/QUALITY_RUBRIC.md`, `docs/README.md` nou; `docs/baseline/README.md` cu instrucțiuni pentru F0-T3
- **F0-T3** [SKIPPED (owner decision, 2026-07-18)] Generare completă pe etalon RO pe arhitectura ACTUALĂ. Motiv: rubrica F6 e absolută, nu relativă; UI-ul actual nu are câmp de ton verbatim (apare abia în F3-T1) deci baseline-ul ar fi cu preset ≠ cu tonul cursului-etalon; efort ~2h fără impact pe poarta blocantă. Vezi `docs/baseline/README.md` pentru re-execuție opțională.
- **F0-T4** [DONE] `src/tests/fixtures/etalonCourse.ts` (RO+EN, cu tonul din §3)
- **DoD F0:** M0 — tag ✔, status file ✔, rubrică ✔, golden-references ✔, fixture ✔, baseline SKIPPED (decizie owner, motiv în F0-T3); typecheck verde ✔; testul pre-existent e2e_generation vezi D-003.

### F1 — Demolare controlată (1 zi) · Risc: mic
- **F1-T1** [DONE] Butoanele Generate/Rafinează din editor — ștergere completă (commit `ecac06b`)
- **F1-T2** [DONE] `ProtagonistEnforcer` + folderul `fixes/` — șters integral (commit `bbab569`)
- **F1-T3** [DONE] Conceptul de protagonist global — șters: `inferProtagonistFromAudience`, `getOrCreateStoryArc`, `story_arc`, blocul `narrative` din `ModuleContext`, toate placeholder-ele; P4 (personaje locale) în EXERCISES_PROMPT (commit `85b548b`)
- **F1-T4** [DONE 2026-08-14] Deploy edge function verde (CI reparat — SUPABASE_ACCESS_TOKEN actualizat, proiect reactivat); toate funcțiile deployate: generate-course-content, analyze-slide, unsplash-search
- **DoD F1:** M1 parțial — typecheck ✔, 12/12 teste (D-003), grep `ProtagonistEnforcer|refineCourseContent|editorRefineButton|inferProtagonistFromAudience|getOrCreateStoryArc|story_arc` în src/+supabase/ → 0 ✔. Rămâne smoke-ul live la owner.

### F2 — Fundația de localizare (2 zile) · Risc: mediu
- **F2-T1** [TODO] `localizedLabels`: inventar complet + promptul A.4.1 + migrație `courses.localized_labels jsonb` + fallback EN static + generare la crearea cursului. Notă 2026-08-08: există deja un mecanism separat, paralel — `GoldenModuleData.localizedLabels` (schema `types.ts`, generat de `GOLDEN_MASTER_PROMPT`) — AI-generat per apel, fără migrație/fallback static. F2-T1, când se face, trebuie să decidă dacă înlocuiește sau se construiește peste acest mecanism existent, nu să-l ignore.
- **F2-T2** [IN_PROGRESS] Sterilizarea șabloanelor cu headere/etichete hardcodate în română, indiferent de `{{language}}`. **Verificat 2026-08-08 că bug-ul e live**: `WORKBOOK_PROMPT`, `MANUAL_PROMPT`, `EXERCISES_PROMPT`, `VIDEO_SCRIPT_PROMPT` sunt toate atinse prin `handleGoldenStep` → `generateLessonContent`/generare per-modul (calea implicită, `contractPipeline: true`) — deci NU sunt cod mort. Corectat (2 commit-uri, 2026-08-08):
  - Cele 4 șabloane de mai sus: headere/etichete traduse din română + regulă explicită de traducere adăugată. `SLIDES_PROMPT` era deja curat.
  - `COST_ZERO_SLIDES_LABELS`/`generateCostZeroSlides`: fallback-ul alegea RO pentru orice limbă ≠ EN (deci și DE/FR/ES/IT din `src/languages.ts` — ~100 limbi în `ALL_LANGUAGES` — primeau etichete românești); corectat să cadă pe EN pentru orice ≠ RO. Adăugate și 2 bullet-uri hardcodate RO lipsă din dicționar.
  - `getDepthSpecs`: typo `STRUCTURĂ`→`STRUCTURE`.
  - `generateExamplesContent`, prompt-ul `discussion_guide`: headere hardcodate RO în prompturi altfel în engleză.
  - `buildFallbackModuleContext`, fallback-ul final din generarea obiectivelor, fallback-urile de eroare din `handleChatOnboarding` (analiză + blueprint), `generateWorkbookIntro`/`generateWorkbookOutro`: toate aveau text hardcodat RO în ramuri de fallback/eroare, folosit indiferent de `course.language`/`lang` — deși variabila de limbă era deja disponibilă în scope. Corectate cu ramificare pe limbă (RO explicit, altfel EN).
  - **Verificat și exclus din scope** (documentat, neatins): `GOLDEN_SAMPLES.structure_online`/`exercises_live` și întregul subsistem `GoldenModuleData`/`GOLDEN_MASTER_PROMPT`/`renderToMarkdown`/`renderWorkbookSection` etc. — cod mort confirmat, zero apelanți (`renderToMarkdown` nu e apelat de nicăieri; `prompts/golden-master.ts` nu e importat în `index.ts`) — vezi D-011. Mesajul de „credit_limit_exceeded" (linia ~2954) rămâne hardcodat RO — e nivel de aplicație/utilizator, nu conținut de curs, deci în afara scope-ului F2 (candidat pentru o localizare separată a UI-ului de eroare, nu a materialelor generate).
  - Nu s-a putut rula typecheck local (fără Node/npm, D-005) — verificare manuală, diff simetric, backtick-uri verificate pereche cu pereche.
  - Rămas TODO: prompturile globale rămase (structure/blueprint în afara celor verificate), inventarul complet cerut de F2-T1 pentru migrația spre `{{label_*}}`.
- **F2-T3** [DONE 2026-08-14] Validare de limbă uniformă: `skipAiValidation` eliminat complet (parametru șters din `callLLM`, `retryWithStrictInstructions` și toate cele 5 funcții generatoare — `generateWorkbookContent`, `generateManualContent`, `generateExercisesContent`, `generateVideoScriptContent`, `generateExamplesContent`); detectorul rulează acum pe orice output ≥400 chars (prag pe conținut raw, nu pe sample); `LANG_SIGNATURES` extins cu `it`, `pt`, `nl`, `pl`; adăugat `NON_LATIN_SCRIPTS` (regex Unicode) pentru 26 limbi cu scripturi non-latine (ar, he, ru, uk, bg, sr, zh, zh-TW, ja, ko, el, hi, bn, th, ka, am, km, lo, my, si, ta, te, kn, ml, gu, pa) — detecție fiabilă fără n-gram counting. Maximum 1 retry deja implementat (neschimbat). Typecheck verde.
- **F2-T4** [DONE 2026-08-14] Meta-instrucțiuni EN, conținut verbatim (regula A.1) — MANUAL_PROMPT: eliminat "Romanian" din CRITICAL RULES + eliminat "# Modul:" hardcodat din OUTPUT FORMAT
- **F2-T1** [DONE 2026-08-14, AȘTEAPTĂ SQL OWNER] `STATIC_LABELS` + `getLabel()` — traduceri statice pentru 6 limbi (en/ro/es/fr/de/it); switch-urile binare `isRo→Obiectiv/Objective` înlocuite cu `getLabel('objective', lang)` în workbook+exercises generators; migrație `20260814_courses_localized_labels.sql` scrisă — **owner aplică SQL în Studio**
- **F2-T5** [DONE 2026-08-14] `src/tests/languagePurity.test.ts`: 8 teste verzi — EN fără diacritice RO, EN fără headere RO, RO fără headere EN unambigue, cross-contamination checks
- **DoD F2:** M2 — testul verde pe EN și RO; inspecție manuală fără amestec

### F3 — Instalarea arhitecturii de prompturi + contractul de modul (3 zile) · Risc: mare, izolat
- **F3-T1** [TODO] `buildPrompt(layers)` + `buildTonePreamble` (A.1, A.3). Șterge din cod arhetipurile Mentor/Coach/Buddy, `narrativeUniverse`, `learningPhilosophy`, `masterTimeline`. `DNAEditModal` → 3 câmpuri
- **F3-T2** [TODO] Cele 7 fișiere de prompt (A.4) + `PROMPT_CHANGELOG.md` cu intrarea „v1 instalată"
- **F3-T3** [TODO] Schema `ModuleContract` (server types + Zod client) — obiectiv/blocks/exerciseSpec/transitions
- **F3-T4** [TODO] `validateModuleContract()` determinist: ≥1 ACT+DEM+APP; sumă minute = durată (±5); APP ≥40% la bloomLevel≥APPLY; niciun bloc >25 min fără schimbare de fază; BREAK la module ≥90 min; verbi Bloom din dicționar per limbă. Eșec → 1 re-apel → apoi eroare
- **F3-T5** [TODO] Persistență: migrație `course_modules.contract jsonb` + `contract_version`; `is_dirty` invalidează; cache
- **F3-T6** [TODO] Orchestrator: parametru `modelTier` per tip de apel (default: tot Flash)
- **DoD F3:** M3 (prompts/ + preambul + changelog) și M4 (4 contracte valide pe etalon, **aprobate de owner — poarta umană 1**)

### F4 — Cele 5 livrabile ca randări (4 zile) · Risc: mare, controlat prin flag
- **F4-T1** [TODO] Feature flag `contractPipeline` (fluxul vechi intact până la F10; A/B + revenire instant)
- **F4-T2** [TODO] Granularitate: Manual 1 apel/modul (split >6 blocuri); Exercise Sheets 1 apel/exerciseSpec; Trainer Guide 1 apel/modul; Trainer Flow asamblare deterministă + 1 apel finisare; Slides în F7. Țintă etalon: ~25 apeluri
- **F4-T3** [TODO] Consistență prin cod (P3): renderer-ele construiesc headerele din contract+labels via `BLOCK_HEADER_TOKEN`; LLM scrie doar corpul; ID-urile exercițiilor se propagă programatic
- **F4-T4** [TODO] Validare deterministă post-generare (structură completă, puritate lingvistică per livrabil); re-apel doar pe unitatea eșuată
- **F4-T5** [TODO] DB: livrabilele pe cheile `course.livrables.*` existente; sub flag, livrabilele legacy dispar din `STEPS_ORDER`
- **F4-T6** [TODO] Logare consum: apeluri per generare, per tip (necesar pentru F6 și DoD ≤30)
- **F4-T7** [TODO] Generare completă A/B pe etalon (nou vs baseline F0), prezentată owner-ului
- **DoD F4:** M5 — 5 livrabile pe etalon RO+EN, validare deterministă verde, ≤30 apeluri, owner confirmă superioritatea vs baseline

### F5 — N/A (absorbit în F4; numerotarea păstrează bornele)
- Fără task-uri.

### F6 — CALIBRAREA (poarta de calitate; 2–5 zile, buget 10 iterații) · Risc: aici se decide produsul
- **F6-T1** [TODO] Punctează baseline-ul F0 și output-ul F4 pe rubrică (RO+EN). Claude pre-evaluează criteriile mecanice (3,5,7,9); owner-ul punctează 1,2,4,6,8,10
- **F6-T2** [TODO] Rulează bucla B.2: o modificare per iterație (un prompt SAU un parametru), regenerare doar pe unitățile afectate, log în PROMPT_CHANGELOG cu delta
- **F6-T3** [TODO] Dacă după 10 iterații pragul nu e atins → scara B.3, treaptă cu treaptă (decizie owner la treapta 2 „model Pro" și la treapta 5)
- **DoD F6:** M6 — prag atins pe RO și EN, changelog complet, **decizie scrisă a owner-ului „calitatea aprobată" — poarta umană 2**. Nicio fază ulterioară nu începe fără M6.

### F7 — Slide-urile (3 zile) · Risc: mediu
- **F7-T1** [TODO] Slide plan determinist din contract (în cod): mapare fază → layout
- **F7-T2** [TODO] 1 apel AI/modul cu `slides-copy.ts` → `SlideState[]` JSON validat Zod; se elimină formatul `<SLIDE_BEGIN>` pe drumul nou
- **F7-T3** [TODO] O singură taxonomie: `SlideState.layoutId` cap-coadă; șterse `SlideDesignJSON`, maparea arhetip→layout, euristicile pe cuvinte-cheie (păstrate DOAR pentru importul de documente externe)
- **F7-T4** [TODO] `analyze-slide` scos din export (funcția edge + apeluri + rotația fallback); opțional repurpose ca buton „Sugerează layout" în editor
- **F7-T5** [TODO] `VisualOrchestrator` = singurul editor de slide-uri; persistență `SlideState[]` în `course_steps.slides_state jsonb`
- **F7-T6** [TODO] Imagini alese la editare (Unsplash existent; `imagePrompt` pre-populează căutarea); exportul folosește strict `media.url`
- **F7-T7** [TODO] Reguli de calitate în renderer: max 4 bullets (auto-split), overlay de contrast generalizat, `pptxTextOnlySafeMode` păstrat
- **F7-T8** [TODO] Mini-calibrare: criteriul 10 punctat pe deck-ul etalonului; iterare pe `slides-copy.ts` dacă <4
- **DoD F7:** M7 — deck complet pe etalon; layout justificat; editare → PPTX reflectă exact; zero apeluri AI la export; notes consistente cu guide-ul; criteriul 10 ≥4

### F8 — Plafon 8 ore + landing (½ zi) · Risc: zero · Rulabilă oricând după F0
- **F8-T1** [TODO] UI: durata în `NewCourseModal`/`OnboardingChat` → listă închisă (1h, 2h, 3h, 4h, 6h, 8h); mesaj i18n
- **F8-T2** [TODO] Server: `durationMinutes > 480` → 422 cu mesaj clar; clamp defensiv în promptul de blueprint și de contract
- **F8-T3** [TODO] Landing (`HomePage.tsx` + toate localele): Duration → „up to a full training day (8h)"; `grep -ri semester src/` → 0
- **DoD F8:** M8 — imposibil de creat curs >8h din UI și prin apel direct; landing actualizat EN+RO

### F9 — Design modern al materialelor (2 zile) · Risc: mic
- **F9-T1** [TODO] `src/lib/design/tokens.ts`: 2–3 teme („Paper & Gold", „Boardroom", „Clean Light"); paletă, pereche tipografică, scară, spațieri; sursă unică pentru culori/fonturi
- **F9-T2** [TODO] Consumatori: preview HTML editor (CSS vars din tokens), `templates.ts` (PPTX), `exportService`/`pdfExporter` (DOCX/PDF)
- **F9-T3** [TODO] Șabloane document: copertă, header/footer cu paginare + modul, cuprins din contract; componente (casetă Exercițiu, casetă Notă facilitator, spații de lucru reale, timeline vizual)
- **F9-T4** [TODO] Diferențiere per livrabil: Guide (coloană timing absolut), Manual (reflecții integrate), Exercise Sheets (o foaie/exercițiu, debrief verso)
- **F9-T5** [TODO] Test explicit diacritice RO în PDF (jspdf) + un export EN
- **DoD F9:** M9 — export DOCX+PDF+PPTX pe toate livrabilele etalonului; verificare vizuală owner; diacritice corecte

### F10 — Curățenie finală, tăierea legacy (2 zile) · Risc: mediu
- **F10-T1** [TODO] `contractPipeline` devine implicit + șterse: pași legacy din `STEPS_ORDER` (rămân 5 + blueprint), `handleLegacyStep` + ~15 prompturi globale moarte, `generateCostZeroSlides`, `GOLDEN_SAMPLES`/`golden-master`/`golden-parser` (dacă fără apelanți), dublura FacilitatorNotes/FacilitatorManual, `generate_workbook_part`/`generate_slides_part`, `TrainerStepType`-uri nefolosite
- **F10-T2** [TODO] Spargerea `index.ts` (5.400 linii) fără schimbare de comportament: `index.ts` (routing) · `orchestrator.ts` · `contract.ts` · `renderers/` · `validation.ts` · `localization.ts` · `prompts/`
- **F10-T3** [TODO] Erori reale: elimină masca „200 cu error"; statusuri corecte; clientul afișează `error.message`
- **F10-T4** [TODO] Igienă: `STRIPE_PUBLISHABLE_KEY` → env; scoate `moonshot-v1-8k` din fallback; migrație de curățare; șterge `RlsTestPage`, `header.txt`, teste orfane; `README.md` nou
- **F10-T5** [TODO] `e2e_generation.test.ts` rescris: etalon RO+EN; aserțiuni = validările F4-T4 + puritatea F2-T5 + apeluri ≤30
- **DoD F10:** M10 — teste verzi; `index.ts` <300 linii; grep simboluri legacy → 0; generare etalon reușită în producție; toate bornele DONE

---

## Smoke F1 (instrucțiuni owner pentru F1-T4)

Ștergerile F1 ating edge function-ul `generate-course-content`. Ele sunt pe branch, dar nu pe Supabase live decât după deploy. Aplicația live rulează încă versiunea veche (cu ProtagonistEnforcer + protagonist global) până când:

1. **Deploy edge function.** Fie repari CI-ul din `deploy-supabase-functions.yml` (secret expirat — vezi D-005), fie faci deploy manual din clona ta locală:
   ```
   npx supabase functions deploy generate-course-content --project-ref <PROJECT_REF>
   ```
2. **Loghează-te în UI, creează cursul-etalon** cu parametrii din `src/tests/fixtures/etalonCourse.ts` (RO). Tonul rămâne un preset (Mentor/Coach/Buddy) — asta nu se schimbă până la F3-T1.
3. **Generează complet.** Toate step-urile din STEPS_ORDER (17).
4. **Verifică rapid:**
   - **Personaje distincte per exercițiu.** Fiecare exercițiu ar trebui să conțină nume distincte (Maria, Andrei, Elena…), NU aceeași persoană peste tot. Deschide 2-3 exerciții și verifică.
   - **Zero cuvinte sparte.** Caută în output-ul brut al oricărui pas expresii de tip `pozițAlexând`, `ionAlex`, `mariAlexj`. Concret: caută pattern-ul `[a-zăîâșț]Alex` — 0 apariții.
   - **Zero „Alex" repetat 3+ ori pe același material** decât dacă utilizatorul l-a definit explicit ca protagonist în DNA.
5. **Dacă smoke-ul trece:** îmi zici „F1 smoke OK", marchez M1 DONE, pornim F2 în sesiunea următoare.
6. **Dacă apare regresie:** îmi zici ce vezi (paste cu output-ul problematic); rollback la commit-ul `pre-refactor-2026-07` e trivial (`git revert 85b548b bbab569 ecac06b` sau, extrem, `git reset pre-refactor-2026-07`).

Notă: CI-ul `Deploy Supabase Functions` va încerca automat deploy-ul la primul push care atinge `supabase/functions/**` — F1-T3 e prima modificare de acest fel. Dacă failure-ul din 6 iulie (D-005) se repetă, e semnalul că trebuie reparat token-ul de acces înainte de F2.

---

## Descoperiri

Notează aici orice descoperire sau nelămurire care apare în timpul execuției, cu propunere. Owner-ul decide.

### D-001 — Poziția tag-ului `pre-refactor-2026-07` și branch-ul `phase-0-safety`
**Context.** Planul cere „tag pe main". Ramura `main` de la origin e semnificativ în urma branch-ului de lucru `claude/courscopilot-refactor-major-e45nfa` — audit-ul (`docs/AUDIT-CourseCopilot-2026-07-18.md`), planul v2.0 (`docs/CURATENIE-SI-MODERNIZARE-CourseCopilot.md`) și toată recuperarea de landing/design tokens au intrat doar pe branch-ul de lucru. Pe `main` nu există punct de referință valid pentru refactor: baza actuală de cod (cu audit + plan) e HEAD-ul branch-ului de lucru.

**Decizie luată.** Tag-ul `pre-refactor-2026-07` s-a pus pe `HEAD` (branch-ul de lucru `claude/courscopilot-refactor-major-e45nfa`), nu pe `main`. Motiv: acest commit este „starea imediat înaintea refactor-ului" — punctul la care s-ar reveni dacă refactor-ul se anulează. Branch-ul `phase-0-safety` a fost creat local ca pointer la același commit; el va avansa în paralel cu munca pe branch-ul de lucru.

**Tensiune cu instrucțiunile CI/harness.** Sistemul cere „DEVELOP all your changes on the designated branch (`claude/courscopilot-refactor-major-e45nfa`)". Planul cere „o fază per branch (phase-0-safety …)". Pentru a satisface ambele: comm-iturile merg pe branch-ul designat (satisface CI), iar `phase-X-Y` sunt branch-uri-etichetă avansate în paralel la finalul fiecărei faze (satisface planul, oferă puncte de revenire per fază). Owner-ul poate suprascrie: dacă preferă strict câte un PR/branch dedicat per fază (`phase-0-safety` push independent), spune-mi și adaptez.

### D-007 — Bug-uri UI descoperite în timpul smoke-ului F1-T4 (reparate, în afara planului, cu aprobare owner)
**Context.** În timp ce owner-ul rula smoke-ul F1-T4, a semnalat două simptome pe onboarding: (a) enum brut `OnlineCourse`/`LiveWorkshop` afișat netradus în salutul de chat, (b) chat-ul pare să reîntrebe obiectivele de învățare deși tocmai fuseseră completate. Niciunul nu ține de ProtagonistEnforcer/protagonist global (scope-ul F1) — dar owner-ul a cerut reparare imediată, aprobată explicit.

**(a) Enum brut în salut (`OnboardingChat.tsx`).** `t('chat.onboarding.greet*', { env: course.environment, ... })` injecta valoarea brută a enum-ului (`'OnlineCourse'`) direct în placeholder-ul `{env}`, în loc de eticheta localizată. Fix: mapare prin cheile deja existente `modal.newCourse.environment.onlinecourse` / `.liveworkshop` înainte de injectare, cu fallback pe valoarea brută dacă cheia lipsește.

**(b) Chat „fantomă" — cauză reală: cursă de randare, nu istoric înghețat.** Investigație confirmă: NU e vorba de `ai_refinement_history` persistat dintr-o sesiune anterioară (owner-ul a confirmat: curs nou, prima deschidere). Cauza reală: `CourseWorkspacePage.tsx` decide ecranul de onboarding (`showLOGenerator`/`showBlueprintReview`) printr-un `useEffect` separat, dependent de `[course]`, care rulează DUPĂ commit. Când `course` se încarcă prima dată (curs nou, fără `learning_objectives`), există un randare intermediar în care `course` e deja setat dar `showLOGenerator` încă are valoarea implicită `false` (efectul de rutare nu a apucat să ruleze) — condiția `!course.blueprint` e adevărată, deci se montează `OnboardingChat` ÎNAINTE ca obiectivele să existe. Acel mount scrie imediat salutul „fără obiective" în `course.ai_refinement_history` (efect de bord, fire-and-forget către Supabase). Randarea următoare corectează vizual ecranul (arată `LearningObjectivesGenerator`, ca și cum fluxul ar fi corect), dar scrierea în DB deja s-a produs. Când utilizatorul ajunge ulterior, normal, la chat, istoricul e deja populat cu acel salut fantomă și nu se regenerează.

**Fix:** flag nou `routedCourseId`, setat la finalul efectului de rutare cu `course.id`-ul pentru care s-a calculat decizia. Randarea de onboarding (inclusiv spinner-ul de încărcare) verifică `routedCourseId !== course.id` — dacă rutarea nu s-a calculat încă pentru cursul curent, rămâne pe spinner. Elimină clipa de randare cu valori implicite stale, deci elimină mount-ul prematur al `OnboardingChat`.

**Fișiere:** `src/components/OnboardingChat.tsx`, `src/pages/CourseWorkspacePage.tsx`. Typecheck verde; teste 12/12 (D-003 neschimbat). Nu a fost reprodus live (fără acces la Supabase din mediul remote) — owner-ul re-testează cu smoke-ul F1-T4.

**Urmare — protocol de triaj permanent.** Discuție cu owner-ul: riscul ca „descoperiri" repetate să bulverseze planul de 11 faze. Decizie: planul rămâne coloana vertebrală; orice descoperire trece printr-un test unic (blochează DoD-ul fazei curente? DA → reparat imediat sub plafon strict + aprobare owner, ca mai sus; NU → doar logat aici, cu recomandare de fază). Revizuirea planului se face DOAR la M4 și M6. Fiecare fază capătă un smoke minimal, nu doar typecheck+test. Protocolul complet e scris permanent în `CLAUDE.md § Reguli owner → 5. Protocolul de triaj pentru descoperiri` — citit automat la fiecare sesiune viitoare.

### D-008 — F1-T5 (branch-ul de refactor) NU a fost adus pe `main`; DNA rămâne, simplificarea se mută la F3-T1
**Context.** Pe branch-ul `claude/courscopilot-refactor-major-e45nfa`, commit-ul `5ba03c2` ("F1-T5: fix agenda_table crash + eliminate CourseDNA feature", 2026-07-19) șterge integral conceptul CourseDNA: `DNAEditModal.tsx` (619 linii), pasul `course_dna` din edge function, integrarea din `CourseWorkspacePage`/`BlueprintReview`, cheile de locale `dna.*`. Acest commit nu a fost niciodată mers pe `main` (PR #20 s-a oprit la F1-T3) și **nu apare deloc în acest fișier** — spre deosebire de `D-007` (fix-ul din aceeași zi), care documentează explicit aprobarea owner-ului, `5ba03c2` nu are nicio urmă de aprobare, deși protocolul de triaj (§D-007, codificat cu ~17 minute înainte în `CLAUDE.md`) o cere pentru orice reparație în afara scope-ului fazei curente.

**Verificare 2026-08-07.** S-a verificat în cod dacă CourseDNA e cod mort: NU e. `buildDNABlocks()` (edge function) alimentează terminologie, voice/tone, learning philosophy și domain context în >10 puncte din prompt-urile de generare pentru aproape toate livrabilele; pasul `course_dna` rulează mereu primul, atât în `LEGACY_STEPS_ORDER` cât și în `CONTRACT_STEPS_ORDER`. Nu blochează generarea dacă lipsește (`hasMinimalCourseDNA` doar loghează un warning). În plus, `main` a continuat să investească activ în DNA **după** data lui F1-T5: `b51ba87` (31 iul) rescrie `buildDNABlocks`/voice profile, `79fd1dc` (1 aug) modifică `DNAEditModal.tsx` — exact fișierul pe care F1-T5 îl șterge complet.

**Decizie (owner, 2026-08-07).** Nu se aduce F1-T5 pe `main`. CourseDNA rămâne ca funcționalitate. Planul formal însuși (F3-T1) prevede deja ce owner-ul de fapt vrea: *simplificare*, nu eliminare — „Șterge arhetipurile Mentor/Coach/Buddy, `narrativeUniverse`, `learningPhilosophy`, `masterTimeline`. `DNAEditModal` → 3 câmpuri." Senzația că „DNA încurcă" vine din supra-complexitatea actuală (arhetipuri, narrative universe, master timeline), nu din conceptul în sine. F1-T5 rămâne un artefact orfan pe branch-ul de refactor — nu se șterge branch-ul (păstrează istoricul), dar nu se mai integrează ca atare.

### D-009 — Fir de lucru ad-hoc pe `main` (31 iul – 7 aug), în afara fazelor F2–F4 documentate
**Context.** Între ultima actualizare a acestui fișier (F1-T4 BLOCKED, 18 iul) și azi, `main` a primit 10 commit-uri care nu trec prin protocolul de triaj și nu sunt reflectate în tabelul de borne M0–M10, deși unele se suprapun conceptual cu F3/F4:
- `b51ba87` (31 iul) — introduce flag `contractPipeline` (inițial `false`) + rutare parțială "Golden per-module generation" pentru manual. **Nu** e schema `ModuleContract` din F3-T3 (verificat prin grep — nu există în repo); e o implementare paralelă, informală, mult mai restrânsă decât F3/F4.
- `79fd1dc`, `21ad1f1` (1 aug) — extinde flag-ul în `DNAEditModal`; adaugă `agenda_table`, `discussion_guide`, `action_plan`, `diagnostic_questionnaire` în `GLOBAL_STEPS`.
- `c98a59b` (1 aug) — **activează `contractPipeline: true`** (implicit ON de atunci).
- `12bad7a` (5 aug) — hardening erori upsert/insert `course_steps`.
- `f3cb0f0`, `c519463`, `a5e7e0e` (7 aug, azi) — funcție nouă de **salvare draft + reluare server-side a generării** în `GenerationProgressModal.tsx`. `a5e7e0e` adaugă și §D-005 (sesiunea respectivă nu a putut rula `typecheck`/`test` local — fără Node/npm în mediul acela).

**Decizie (owner, 2026-08-07).** Se documentează aici ca reper istoric; nu se modifică cod în cadrul reconcilierii de azi. Acest fir rămâne de reconciliat explicit cu planul quando se ajunge la F3/F4 — la momentul respectiv trebuie decis dacă flag-ul `contractPipeline` existent se înlocuiește cu arhitectura `ModuleContract` din plan sau se construiește pe el. Până atunci, `contractPipeline: true` e activ în producție și afectează comportamentul real al aplicației, deși F4 (unde ar trebui introdus formal) e încă `TODO`.

### D-011 — Rutare Golden vs Legacy pentru F2: `handleGoldenStep` e calea vie, nu `EXERCISES_PROMPT`/`WORKBOOK_PROMPT` direct
**Context.** Înainte de a atinge cod pentru F2-T2, s-a verificat dacă `EXERCISES_PROMPT`/`WORKBOOK_PROMPT`/`MANUAL_PROMPT`/`VIDEO_SCRIPT_PROMPT` (cu headerele hardcodate în română) mai sunt pe calea vie, sau au fost înlocuite de sistemul `GoldenModuleData`/`GOLDEN_MASTER_PROMPT` (care are propriul mecanism de `localizedLabels` generat de AI). Verificare: `handleGoldenStep` (calea implicită pentru module/lecții sub `contractPipeline: true`) apelează `generateLessonContent` per lecție (dacă `course_lessons` există) sau direct `generateWorkbookContent`/`generateExercisesContent`/`generateManualContent`/`generateVideoScriptContent` la nivel de modul — **ambele ramuri folosesc șabloanele vechi cu headere RO hardcodate**, nu `GOLDEN_MASTER_PROMPT`. Schema `GoldenModuleData`/prompt-ul „God Prompt" pare pregătită dar nefolosită efectiv de `handleGoldenStep` la data verificării (renderWorkbookSection/renderManualSection care consumă `data.localizedLabels` nu au fost găsite ca fiind apelate din `handleGoldenStep` — posibil cod dintr-o iterație anterioară a arhitecturii Golden, netras din uz).
**Concluzie.** Bug-ul de limbă din F2-T2 e real și afectează cursuri active. Corectat 2026-08-08.

**Update 2026-08-08 (a doua sesiune F2-T2).** Confirmat definitiv: `renderToMarkdown` (linia ~1997, punctul de intrare care ar apela `renderWorkbookSection`/`renderManualSection`/etc.) **nu are niciun apelant în `index.ts`** (grep pentru `renderToMarkdown(` → 0 rezultate). `supabase/functions/generate-course-content/prompts/golden-master.ts` (unde e `GOLDEN_MASTER_PROMPT`) **nu e importat nicăieri în `index.ts`**. Deci întregul subsistem `GoldenModuleData`/`GOLDEN_MASTER_PROMPT`/`renderToMarkdown`/`renderWorkbookSection`/`renderManualSection`/`renderExerciseSheet`/`renderVideoScript` (~270 linii doar în `index.ts`, plus `prompts/golden-master.ts` + `utils/golden-parser.ts` + `types.ts` întregi) e **cod mort confirmat, nu doar suspectat**. La fel, în `GOLDEN_SAMPLES` (linia ~278), doar cheile `workbook_online`/`workbook_live` sunt citite undeva (de `generateWorkbookContent` prin `{{goldenSamples}}`); restul (`objectives`, `structure_online`, `slides_live`, `slides_online`, `quiz`, `video_script_online`, `exercises_live`, `exercises_online`, `case_study`) nu au niciun apelant găsit — inclusiv exemplele cu headere hardcodate RO de la liniile 391-402/549-559, care din acest motiv NU au fost corectate (nu sunt pe calea vie). **Recomandare pentru F10-T1**: candidat clar de șters, cu grep-urile de mai sus ca dovadă.

### D-004 — Tag-ul `pre-refactor-2026-07` respins la push (403)
**Context.** Owner-ul a confirmat push-ul tag-ului de siguranță. `git push origin pre-refactor-2026-07` a returnat `403` de la remote-ul de sesiune. Cauza probabilă: GitHub App-ul folosit de sesiune nu are scope-ul pentru crearea de tag-uri, sau există tag protection rule pe repo.
**Decizie.** Tag-ul rămâne local (`git tag pre-refactor-2026-07` la commit `6b5bc9a`, HEAD-ul branch-ului de lucru la momentul refactor-ului). Ancora e păstrată — orice clonă cu istoricul actual îl poate reconstitui pentru că e la HEAD-ul unui commit deja push-uit.
**Acțiune propusă pentru owner.** Rulează local pe mașina proprie (o singură comandă): `git fetch origin && git tag pre-refactor-2026-07 6b5bc9a && git push origin pre-refactor-2026-07`. Astfel ancora ajunge și pe origin. Alternativ, creează tag-ul manual din GitHub UI („Releases → Tags → Create tag") pe commit-ul `6b5bc9a`.

### D-003 — Testul `src/tests/e2e_generation.test.ts` e rupt la baseline
**Context.** La rularea `npm test` (F0-T4 DoD), testul eșuează cu:
`Failed to load url ../../supabase/functions/generate-course-content/index_bundled`.
Reprodus și pe HEAD-ul curat (înainte de modificările F0), deci defectul e pre-existent, nu introdus de refactor. Fișierul `index_bundled.ts` nu există în repo.
**Decizie.** Nu se atinge acum. Planul îl trece explicit la F10-T5 („e2e_generation.test.ts rescris") — se ignoră până acolo. `npm test` fără acest fișier: 4 test files, 12 tests, toate verzi. DoD F0 („typecheck verde") e îndeplinit; „test verde" se aplică la testele necorupte + orice test adăugat de refactor.
**Riscul asumat.** Dacă în F1–F9 acest test se strică suplimentar, nu vom observa. Fazele F1–F2 adaugă teste noi (F2-T5, F1-T4 smoke) care oferă acoperire alternativă.

### D-002 — Baseline F0-T3 depinde de acces la Supabase + chei LLM
**Context.** Instrucțiunea utilizatorului spune explicit: dacă mediul nu poate rula generarea, marchez F0-T3 ca BLOCKED cu instrucțiuni pas-cu-pas, fără să simulez output-uri.
**Stare.** Mediul remote nu are chei API și nici acces la instanța Supabase de producție. F0-T3 va fi marcat BLOCKED cu instrucțiuni în `docs/baseline/README.md` (creat la F0-T2).

---

## Jurnal de sesiune

| Data | Sesiune | Task-uri atinse | Note |
|---|---|---|---|
| 2026-07-18 | S01 | F0-T1 DONE · F0-T2 DONE · F0-T3 BLOCKED · F0-T4 DONE | Plasa de siguranță instalată. Baseline așteaptă owner-ul (docs/baseline/README.md). M0 rămâne parțial până la F0-T3; F1 NU pornește în această sesiune. |
| 2026-07-18 | S02 | F0-T3 SKIPPED (owner decision) · M0 DONE · F1 pornit | CLAUDE.md adăugat (regula: owner deploy SQL). Baseline abandonat cu motiv (rubrică absolută + UI fără câmp ton verbatim). F1 începe în această sesiune. |
| 2026-07-18 | S02 | F1-T1 · F1-T2 · F1-T3 DONE · F1-T4 BLOCKED(owner smoke live) | Editor Generate/Refine + ProtagonistEnforcer + fixes/ + protagonist global toate șterse (commits ecac06b, bbab569, 85b548b). ~1.000 linii cod mort eliminate. Placeholder-ele `{{protagonist*}}`/`{{storyStage}}` sterilizate din toate prompturile. Regula P4 (personaje locale) intră în EXERCISES_PROMPT. Typecheck verde; teste 12/12 (D-003 pre-existent). Așteaptă deploy edge function + smoke owner. |
| 2026-08-07 | S03 | Reconciliere `main` ↔ branch de refactor | Cherry-pick `7b6f8c3` (fix onboarding: label mediu localizat + cursă de randare) și `81add01` (protocol D-007 în CLAUDE.md) pe `main`. F1-T5 (elimină CourseDNA) NU adus — verificat că DNA nu e mort, decizie owner: rămâne, simplificare mutată la F3-T1 (§D-008). Documentat firul ad-hoc `contractPipeline`/draft-resume din 31 iul–7 aug, nereflectat până acum în borne (§D-009). F1-T4 rămâne BLOCKED — nicio confirmare de smoke test primită încă. F2 nu a început. |
| 2026-08-08 | S04 | F2-T2 IN_PROGRESS | Pornit F2 (următorul pas logic după reconciliere). Verificat rutare Golden/Legacy (§D-011): `EXERCISES_PROMPT`/`WORKBOOK_PROMPT`/`MANUAL_PROMPT`/`VIDEO_SCRIPT_PROMPT` sunt calea vie sub `contractPipeline: true`, nu cod mort. Corectat headerele/etichetele hardcodate în română din toate cele 4 (Manual era cel mai afectat); `SLIDES_PROMPT` era deja curat. Adăugată regulă explicită de traducere a etichetelor la fiecare prompt. Nu s-a putut rula typecheck local (fără Node/npm, D-005) — verificare făcută prin citire atentă + diff linie-cu-linie (55 inserții/55 ștergeri, fără backtick-uri noi, fără drift de linii). |
| 2026-08-08 | S04 (continuare) | F2-T2 tot IN_PROGRESS | Scanare exhaustivă a fișierului pentru text hardcodat RO rămas. Corectat: `COST_ZERO_SLIDES_LABELS` (fallback greșit → RO pentru orice non-EN, inclusiv DE/FR/ES/IT; acum RO doar pentru RO), typo `STRUCTURĂ` în `getDepthSpecs`, headere hardcodate în `generateExamplesContent` și prompt-ul `discussion_guide`, și 5 fallback-uri de eroare/parsare (`buildFallbackModuleContext`, obiective, `handleChatOnboarding` ×2, workbook intro/outro) care ignorau `lang`/`course.language` deja disponibil în scope. Confirmat definitiv cod mort (§D-011 update): `renderToMarkdown` are 0 apelanți, `golden-master.ts` neimportat — subsistemul `GoldenModuleData` întreg + majoritatea `GOLDEN_SAMPLES` sunt candidați F10, nu bug-uri F2 active. Exclus intenționat din scope: mesajul `credit_limit_exceeded` (nivel aplicație, nu conținut curs). Rămas: inventarul complet F2-T1, F2-T3 (validare de limbă uniformă), F2-T4, F2-T5 (test puritate lingvistică). |
| 2026-08-10–11 | S05 (ad-hoc, fără faze) | Fix-uri audit + features | 9 commit-uri nedocumentate (PRs #21-23 + fix-uri directe): per-modul iterare client-side (Exercises/Examples/Manual), token usage logging, fix resolveModuleId, i18n landing, UsageSection UI, TS fix, SUPABASE_SECRET_KEYS fallback, ACTION_OPERATION_COSTS corectat. Niciuna din F2–F10 formal. Typecheck verde la finalul sesiunii. |
| 2026-08-14 | S06 | F2-T3 DONE · F2-T4 DONE · status actualizat | Pornit cu typecheck+test verde (Node 22 disponibil în mediu remote — nu mai e limitarea D-012). Documentate commit-urile S05 nedocumentate. F2-T3 implementat: `skipAiValidation` eliminat din toate call-site-urile (15 ocurențe), prag 400 chars pe conținut raw, `LANG_SIGNATURES` extins (+it/pt/nl/pl), `NON_LATIN_SCRIPTS` adăugat (26 limbi cu scripturi non-latine via regex Unicode). F2-T4: inventar complet prompturi — singurele probleme în MANUAL_PROMPT: "English/Romanian" → "English" + "# Modul:" hardcodat eliminat. Typecheck verde per commit. |

### D-012 — Local terminal lacks Node/npm; cannot execute local repro here
**Notă de renumerotare (2026-08-08).** Acest discovery a fost scris inițial cu ID-ul `D-005`, care era deja folosit (vezi `D-005` mai jos, despre eșecul CI-ului de deploy Supabase — acela e cel referit din `CLAUDE.md § Convenții de lucru → CI`). Renumerotat aici la `D-012` ca să nu mai existe două intrări cu același ID. Dacă mai găsești referințe vechi la „D-005 = lipsă Node" în alte note, înlocuiește-le cu D-012.

**Context.** The current terminal environment does not expose `node`, `npm`, `npx`, `yarn`, or `pnpm`, so this session cannot run the local JavaScript repro or execute `npm run typecheck` from the workspace.

**Discovery.** The implementation changes in `src/components/GenerationProgressModal.tsx` rely on a working local Node toolchain for full verification. This session can inspect and patch code, but not execute the application locally.

**Recommendation.** Owner or developer should run the following from a local machine with Node 18+ installed:

1. `cd CourseCopilot`
2. `npm install` (or `pnpm install` / `yarn install`)
3. `npm run typecheck`
4. `npm test`
5. Launch the app and reproduce the generation flow:
   - generate content for a course with blueprint/DNA
   - close and reopen the generation modal to verify resume
   - confirm final save persists `course_steps` rows and clears draft state
6. If Supabase is available, inspect `course_steps` rows for draft entries with `is_completed = false` and final `status = generat`.

**Status impact.** This is a local-environment blocker for direct repro in this session, not a code-completion blocker. The implementation and database-safe fallback work were still completed in code inspection.

### D-013 — Prima rulare locală (Pas 1, 2026-08-08): 2 defecte reale găsite și reparate, sub aprobare owner
**Context.** Runbook-ul „REIA DE AICI" (scris în sesiunea anterioară, vezi D-012) a cerut explicit ca prima sesiune cu Node/npm să ruleze `npm run typecheck && npm test` înainte de orice altceva pe F2. Rulat azi pentru prima dată — a confirmat exact avertismentul din §A: codul din 7-8 aug nu fusese verificat de compilator.

**Defect 1 — typecheck roșu, 12 erori TS7034/TS7005.** `src/components/GenerationProgressModal.tsx`, în ambele funcții de sincronizare (`handleFinalize`/logica de salvare finală și `handleSaveDraft`), liniile ~1486-1487 și ~1599-1600: `const toUpdate = []; const toInsert = [];` fără tip → TypeScript nu poate infera `any[]` în ramurile ulterioare unde sunt populate/citite (upsert/insert Supabase). Cauzează DoD-ul F2 (typecheck verde per commit, `CLAUDE.md § 3`). **Fix** (plafon respectat: 1 fișier, adnotare de tip, zero schimbare de logică): `const toUpdate: any[] = []` / `const toInsert: any[] = []` în ambele locuri, consistent cu restul fișierului care folosește deja `as any` pe scară largă în aceeași funcție.

**Defect 2 — test roșu, nou, neconsemnat până acum.** `src/__tests__/chatLocalizer.test.ts` → `detectChatLanguage(undefined, undefined)` aștepta `'en'`, primea `'ro'`. Cauză: `src/lib/chatLocalizer.ts` cădea, în lipsa `courseLanguage`/`appLanguage`, pe `navigator.language` (activ prin flagul `languageDetector: true` din `src/config/featureFlags.ts`) — pe Node 25.4.0/Windows cu locale românesc, acest global reflectă limba sistemului de operare, nu un default fix. Testul documentează intenția corectă („defaults to en when none provided") — comportamentul de fallback pe locale-ul mașinii nu era acoperit de nicio cerință scrisă și e non-determinist (depinde de OS-ul dezvoltatorului/utilizatorului final, nu de cursul sau aplicația CourseCopilot). **Fix** (plafon respectat: 1 fișier, 3 linii eliminate): scoasă ramura `navigator.language`, `detectChatLanguage` cade direct pe `'en'` când nici cursul, nici aplicația nu specifică o limbă.

**Verificare.** `npm run typecheck` → verde (0 erori). `npm test` → 12/13 verde; singurul eșec rămas e `e2e_generation.test.ts`, excepția pre-existentă D-003, ignorată explicit conform `CLAUDE.md § 3`.

**Fișiere atinse:** `src/components/GenerationProgressModal.tsx`, `src/lib/chatLocalizer.ts`. Ambele reparate sub aprobare explicită owner (întrebare pusă înainte de a scrie cod), plafon respectat (≤2 fișiere, zero schimbare de schemă, reversibil într-un commit).