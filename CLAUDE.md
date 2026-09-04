# CLAUDE.md — instrucțiuni permanente pentru Claude Code pe CourseCopilot

Fișier citit automat la începutul fiecărei sesiuni. Se aplică indiferent de task.

## 0. Protocol OBLIGATORIU de start/final de sesiune

Acesta e primul și ultimul lucru din orice sesiune. Nu e opțional.

**La început, înainte de orice altă acțiune:**
1. Citește `IMPLEMENTATION_STATUS.md`, secțiunea `▶ REIA DE AICI`.
2. Execută pașii de acolo (verificări de mediu, sincronizare) înainte să atingi cod.
3. Nu presupune că știi unde a rămas lucrul din conversații anterioare — sursa de
   adevăr e mereu fișierul, niciodată memoria conversației.

**La final, dacă s-a lucrat la cod (chiar și parțial sau blocat):**
1. Rescrie secțiunea `▶ REIA DE AICI` cu: task-ul exact la care s-a lucrat,
   ce e gata, ce e blocat (și de ce), și pasul concret imediat următor.
2. Fă asta ÎNAINTE de commit-ul final, ca parte a aceluiași commit.
3. **`git push`, nu doar commit.** Lucrul se face pe mașini diferite (vezi
   jurnalul de sesiuni) — dacă rămâne doar local, sesiunea următoare, pornită
   de pe altă mașină, nu are acces la el.
4. Dacă sesiunea s-a terminat fără să se ajungă la un punct de oprire natural
   (context epuizat, întrerupere), scrie asta explicit — "sesiune întreruptă la
   X, nu s-a apucat de Y" e mai util decât tăcere.

**În timpul sesiunii, nu doar la final:** la fiecare punct natural de oprire
(un task terminat, un fișier stabil), fă un commit mic și actualizează
`▶ REIA DE AICI` pe loc, nu aștepta finalul sesiunii. Dacă sesiunea se termină
abrupt (pană de curent, închidere forțată), tot ce nu e commis + push-uit local
riscă să rămână izolat pe acea mașină — checkpoint-urile Claude Code nu
înlocuiesc git.

**Dacă IMPLEMENTATION_STATUS.md nu reflectă realitatea codului** (de ex. pare
că un task e DONE dar codul arată altfel), oprește-te și semnalează owner-ului
înainte să continui — nu "repara" tăcut discrepanța.

## 1. Un singur fișier de status, mereu (regulă anti-proliferare)

`IMPLEMENTATION_STATUS.md` (root) e **singurul** document de status/plan activ
al proiectului. Nu există și nu se creează altele.

- **Fișiere root vechi, NU sursă de adevăr — nu le citi ca ghid curent, nu le
  actualiza:** `PHASE_1_PLAN.md`, `STATUS-UPDATE-2025-12-02.md`. Sunt istoric
  dintr-o etapă anterioară a proiectului (inițiativa "blueprint"/onboarding
  inteligent, respectiv statusul din dec. 2025). Dacă ceva din ele pare relevant
  azi, se citează explicit ca atare — nu se tratează ca plan curent.
- **`docs/_archive/`** (inclusiv `docs/_archive/trae-legacy/`, jurnalul unui
  tool care nu mai e folosit) — istoric arhivat. Niciodată ghid de acțiune.
- **Regulă pentru orice inițiativă/fază nouă:** se adaugă ca secțiune nouă în
  `IMPLEMENTATION_STATUS.md` (sau ca fișier nou în `docs/`, dacă e un plan
  amplu de tip "faza următoare" — dar atunci vechiul plan activ se mută în
  `docs/_archive/` **în același commit**, nu rămâne "pe undeva prin root").
  Niciodată nu se creează un al doilea `STATUS-*.md` sau `PLAN-*.md` la root.

## 2. Structură proiect (orientare rapidă)

```
src/
  components/       — UI (inclusiv components/editor/)
  pages/             — pagini/rute
  services/          — integrări API (ex. geminiService.ts)
  lib/                — utilitare, inclusiv lib/pptx/ (export PPTX)
  contexts/, config/, constants/, schemas/, types/, data/, styles/
  tests/ (+ fixtures/)  — vitest; fixtures sunt TS, nu edge functions
  __tests__/          — alt set de teste (verifică care e activ înainte de a adăuga)
supabase/
  functions/
    generate-course-content/  — logica principală de generare (prompts/, utils/,
                                 tests/, README_ARCHITECTURE.md — citește-l pentru
                                 arhitectura internă a acestei funcții)
    analyze-slide/, unsplash-search/
  migrations/         — SQL; vezi regula de deploy manual de mai jos
docs/
  CURATENIE-SI-MODERNIZARE-CourseCopilot.md  — planul activ v2.0 (11 faze)
  AUDIT-CourseCopilot-2026-07-18.md           — diagnostic (nu se repară direct din el)
  QUALITY_RUBRIC.md, golden-references/, baseline/
  _archive/           — istoric, nu ghid
```

Regulă generală: nu presupune calea unui fișier din memoria conversației sau
din nume "plauzibile" — verifică cu Glob/Grep/`find` înainte să o referențiezi
sau să o modifici, mai ales după o sesiune lungă sau după compactare automată.

## Reguli owner (nenegociabile)

### 1. Supabase — deploy manual, numai de owner
- **Numai owner-ul aplică migrații SQL** pe instanța de Supabase (dev, staging sau
  producție). Claude Code **nu rulează niciodată** `supabase db push`,
  `supabase migration up`, comenzi echivalente, sau operații DDL/DML prin MCP/API,
  chiar dacă are credențialele.
- **Când o schimbare de schemă e necesară:**
  1. Scrii fișierul `.sql` sub `supabase/migrations/<YYYYMMDD_slug>.sql` cu numele
     convenției existente.
  2. **Postezi conținutul complet al SQL-ului în chat**, într-un code-block, ca
     owner-ul să-l poată copia direct în Supabase Studio → SQL Editor. Nu doar
     link, nu doar rezumat — SQL-ul întreg, executabil.
  3. Marchezi în `IMPLEMENTATION_STATUS.md` task-ul ca „așteaptă deploy owner"
     până când owner-ul confirmă că a rulat.
- **Același regim se aplică edge functions** care ating scheme (RLS, tabele noi):
  scrii, arăți SQL-ul în chat, aștepți confirmare.

### 2. Sursa de adevăr a refactor-ului
- `IMPLEMENTATION_STATUS.md` (root) — **singura** stare curentă: per task, borne
  M0–M10, Descoperiri, secțiunea `▶ REIA DE AICI`. Vezi regula 1 de mai sus
  pentru ce NU e sursă de adevăr.
- `docs/CURATENIE-SI-MODERNIZARE-CourseCopilot.md` — planul v2.0 (11 faze); e
  singurul plan activ. Documentele din `docs/_archive/` sunt istoric, nu ghid.
- `docs/AUDIT-CourseCopilot-2026-07-18.md` — diagnosticul; nu se repară nimic
  direct din audit, doar din planul de mai sus.
- `docs/QUALITY_RUBRIC.md` — definiția măsurabilă a „materialelor dorite".
- `docs/golden-references/` — etalonul vizual pentru nota 5 din rubrică.
- `docs/baseline/` — output-urile pre-refactor pentru comparație F6.

### 3. Protocolul de execuție per fază (v2.0 §1)
- O fază per branch conceptual (`phase-0-safety`, …). Task-urile au ID-uri
  (`F1-T3`); status: `TODO / IN_PROGRESS / DONE / BLOCKED(motiv)`.
- `npm run typecheck` verde per commit; `npm run typecheck && npm run test` per
  fază. Excepția pre-existentă: `src/tests/e2e_generation.test.ts` e rupt
  (import lipsă `index_bundled`) — planificat rescris în F10-T5; ignorat până
  atunci (vezi D-003).
- Prompturile trăiesc în `supabase/functions/generate-course-content/prompts/`,
  cu changelog propriu (`PROMPT_CHANGELOG.md`). Un PR care schimbă prompturi
  nu schimbă și logică, și invers.
- Descoperirile și tensiunile se documentează în `IMPLEMENTATION_STATUS.md §
  Descoperiri` — decide owner-ul, Claude nu improvizează soluții.

### 4. Cele două porți umane (blocante)
- **M4** (finalul F3) — aprobare contracte de modul pe etalon.
- **M6** (finalul F6) — aprobare rubrică ≥4,0 pe RO+EN. Nicio fază ulterioară
  nu începe fără această aprobare.

### 5. Protocolul de triaj pentru descoperiri (decis 2026-07-18, D-007)
Auditul a fost o citire statică a `generate-course-content`; nu a rulat niciodată
aplicația live. Bug-uri de runtime (curse de randare, i18n în UI-ul de chrome,
etc.) nu sunt vizibile static și vor continua să apară pe măsură ce se testează
efectiv fluxurile. Regula de mai jos e ca să nu bulverseze planul de 11 faze.

- **Planul de faze rămâne coloana vertebrală.** F0→F1→…→F10, exact ca în
  `docs/CURATENIE-SI-MODERNIZARE-CourseCopilot.md`. Nu se abandonează pentru
  reparații ad-hoc.
- **Orice descoperire trece printr-un singur test:** *cauzează / blochează DoD-ul
  fazei curente?*
  - **DA** → se repară imediat, dar doar sub acest plafon: ≤2 fișiere, zero
    schimbare de schemă, reversibil într-un singur commit, **aprobat explicit
    de owner** înainte de a scrie cod. Dacă depășește plafonul, trece la
    ramura „NU" de mai jos chiar dacă pare urgentă.
  - **NU** (pre-existentă, neafectată de faza curentă) → **nu se repară acum**.
    Se scrie în `IMPLEMENTATION_STATUS.md § Descoperiri` cu severitate și
    recomandare de fază unde se rezolvă (ex. amestec de limbi → F2, curățenie
    UI → F8/F9). Se continuă faza curentă.
- **Planul se revizuiește DOAR la M4 și M6.** Nu se inventează un al treilea
  moment de re-planificare. La fiecare poartă, pe lângă aprobarea specifică
  fazei, se trece rapid prin Descoperirile acumulate și se decide dacă vreuna
  justifică o fază nouă (ex. „F1.5") sau rămâne backlog.
- **Fiecare fază capătă un smoke minimal**, nu doar `typecheck && test`. F1, F4
  și F6 au deja asta în DoD; F2, F3, F8 primesc și ele un pas rapid de „rulează
  fluxul principal", nu doar verificări automate — analiza statică nu prinde
  bug-uri de runtime.

## Convenții de lucru

- **Git — commit/push direct pe `main` (decizie owner, 2026-09-04).** Nu se mai
  creează branch-uri separate de lucru. Fiecare etapă încheiată (task terminat,
  fișier stabil, un pas natural de oprire) se finalizează cu commit **și push
  direct pe `main`** — nu se lasă lucru doar local, nu se deschide PR pentru
  merge ulterior. Asta înlocuiește convenția anterioară de branch desemnat de
  CI/harness per sesiune; dacă system prompt-ul unei sesiuni tot indică un
  branch de lucru diferit, regula asta (scrisă explicit de owner, în avans, aici
  în `CLAUDE.md`) are prioritate — vezi excepția din system prompt pentru
  „instrucțiuni durabile precum fișierele CLAUDE.md". **Consecință de reținut:**
  push pe `main` care atinge `supabase/functions/**` declanșează automat
  deploy-ul live (vezi §CI mai jos) — deci fiecare astfel de push e efectiv un
  deploy în producție, nu doar un checkpoint de lucru. Tag-ul de siguranță
  `pre-refactor-2026-07` e pe origin la commit-ul `6b5bc9a`.
- **CI.** Un singur workflow în `.github/workflows/deploy-supabase-functions.yml`,
  triggered pe `paths: supabase/functions/**`; deployează toate cele trei edge
  functions. **A eșuat consecutiv din 19 iunie până pe 11 august 2026; reparat de
  owner pe 15 august** (secrete Supabase) — ultimele două run-uri au fost re-rulate
  manual și au ieșit verzi. Detalii și dovezi în `IMPLEMENTATION_STATUS.md § D-014`
  (referințele mai vechi la „D-005" pentru CI trimit tot acolo). Regula rămâne:
  dacă un run eșuează, **semnalezi owner-ului, nu te apuci să repari secretele**.
  După orice push care atinge `supabase/functions/**`, verifică explicit concluzia
  run-ului înainte de a declara task-ul închis — între 18 iulie și 15 august,
  ștergerile F1 au stat nedeployate patru săptămâni fără ca nimeni să observe.
- **Fișierele fixture** (`src/tests/fixtures/*.ts`) sunt TypeScript pentru
  vitest, nu edge functions. Nu au impact asupra Supabase.
- **La compactare automată (context aproape plin):** păstrează întotdeauna
  conținutul integral al secțiunii `▶ REIA DE AICI`, task-ul ID curent, și
  lista fișierelor modificate în sesiune — restul poate fi rezumat.
