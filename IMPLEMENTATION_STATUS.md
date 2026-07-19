# IMPLEMENTATION_STATUS — CourseCopilot refactor 2026-07

**Sursa unică de adevăr a progresului.** Se bazează pe:
- `docs/AUDIT-CourseCopilot-2026-07-18.md` (diagnostic)
- `docs/CURATENIE-SI-MODERNIZARE-CourseCopilot.md` v2.0 (plan de execuție)

Convenții:
- Statusuri: `TODO` · `IN_PROGRESS` · `DONE` · `BLOCKED(motiv)` · `N/A`
- `DONE` doar cu Definition of Done al fazei confirmat.
- Descoperirile mergi în §Descoperiri; nu improvizezi soluții.

---

## Borne (M0–M10)

| Bornă | Faza | Livrabil verificabil | Status |
|---|---|---|---|
| M0 | F0 | Tag + status file + baseline „before" + fixture etalon | DONE (baseline SKIPPED prin decizie owner — vezi F0-T3) |
| M1 | F1 | Cod mort șters (butoane editor, ProtagonistEnforcer, fixes/); build verde | ALMOST (cod șters + typecheck verde; F1-T4 smoke live așteaptă owner-ul) |
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
- **F1-T4** [BLOCKED(owner runs smoke)] Smoke test pe etalon RO după deploy edge function; instrucțiuni în §Smoke F1 mai jos
- **DoD F1:** M1 parțial — typecheck ✔, 12/12 teste (D-003), grep `ProtagonistEnforcer|refineCourseContent|editorRefineButton|inferProtagonistFromAudience|getOrCreateStoryArc|story_arc` în src/+supabase/ → 0 ✔. Rămâne smoke-ul live la owner.

### F2 — Fundația de localizare (2 zile) · Risc: mediu
- **F2-T1** [TODO] `localizedLabels`: inventar complet + promptul A.4.1 + migrație `courses.localized_labels jsonb` + fallback EN static + generare la crearea cursului
- **F2-T2** [TODO] Sterilizarea TUTUROR șabloanelor (EXERCISES_PROMPT:1843-1867, WORKBOOK_PROMPT:1554, prompturi globale :394/:555, `generateCostZeroSlides`, `COST_ZERO_SLIDES_LABELS` + orice alt string găsit la inventar); structura doar prin `{{label_*}}`
- **F2-T3** [TODO] Validare de limbă uniformă: elimină `skipAiValidation` complet; detectorul rulează pe orice output >400 caractere; `LANG_SIGNATURES` extins la toate limbile din `src/languages.ts`; maximum 1 retry, apoi warning
- **F2-T4** [TODO] Meta-instrucțiuni EN, conținut verbatim (regula A.1)
- **F2-T5** [TODO] `src/tests/languagePurity.test.ts`: pe etalonul EN → 0 apariții headere RO și 0 diacritice; pe RO → 0 headere EN
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
