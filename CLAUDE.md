# CLAUDE.md — instrucțiuni permanente pentru Claude Code pe CourseCopilot

Fișier citit automat la începutul fiecărei sesiuni. Se aplică indiferent de task.

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
- `IMPLEMENTATION_STATUS.md` (root) — starea per task, borne M0–M10, Descoperiri.
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

- **Git.** Branch de lucru desemnat de CI/harness la fiecare sesiune (vezi
  system prompt-ul sesiunii). Push doar acolo dacă instrucțiunile sesiunii nu
  spun altceva. Tag-ul de siguranță `pre-refactor-2026-07` e pe origin la
  commit-ul `6b5bc9a`.
- **CI.** Un singur workflow în `.github/workflows/deploy-supabase-functions.yml`,
  triggered pe `paths: supabase/functions/**`. Eșuează consecutiv din 6 iulie
  2026 (D-005) — cauza rădăcină e la owner (secrete Supabase). Se re-declanșează
  la F1-T2 (prima modificare sub `supabase/functions/**`); dacă eșuează din
  aceeași cauză, semnalezi, nu te apuci să repari secretele.
- **Fișierele fixture** (`src/tests/fixtures/*.ts`) sunt TypeScript pentru
  vitest, nu edge functions. Nu au impact asupra Supabase.
