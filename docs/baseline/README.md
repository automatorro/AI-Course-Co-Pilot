# baseline — comparația „before" pentru refactor

Acest folder e destinat output-urilor brute generate pe cursul-etalon
(§3 din plan) pe **arhitectura actuală** (înainte de F1). Va fi punctat
pe rubrică în F6 ca punct de plecare, alături de output-ul post-F4.

## Status: BLOCKED (2026-07-18)

Generarea completă necesită:
- Chei API pentru toate provider-ele LLM configurate în edge function
  (Gemini + fallback-uri Moonshot; secrete Supabase)
- Acces la o instanță Supabase (dev sau staging) cu edge function deploy-ată
- Un cont de utilizator cu credit suficient pentru ~90 apeluri LLM
- Sau: rulare locală cu `supabase functions serve` + cheile în `.env`

Mediul remote în care Claude Code rulează sesiunea nu îndeplinește nici una din
condiții. Baseline-ul rămâne blocat până când owner-ul rulează pașii de mai jos
sau autorizează folosirea unei chei existente.

## Instrucțiuni pas-cu-pas pentru owner

### Varianta A — rulare pe instanța de dev/staging (recomandat)

1. **Deploy edge function** (dacă nu e deja deploy-ată):
   ```bash
   npx supabase functions deploy generate-course-content --project-ref <PROJECT_REF>
   ```
2. **Setează secretele** (o singură dată):
   ```bash
   npx supabase secrets set GEMINI_API_KEY=... MOONSHOT_API_KEY=... --project-ref <PROJECT_REF>
   ```
3. **Loghează-te în UI** (dev/staging) cu un cont care are credit.
4. **Creează cursul-etalon** manual din UI, folosind fix acești parametri:
   - Titlu: `Managementul Stakeholderilor pentru Manageri de Proiect Juniori`
   - Durată: `4h`
   - Mediu: `ONLINE`
   - Limbă: `ro`
   - Audiență: `manageri de proiect la început de drum, companii de servicii IT`
   - Ton (câmpul liber): `direct, cald, fără corporatisme; folosim «tu»; umor discret; interzis: «sinergie», «paradigmă»`
5. **Rulează generarea completă** (toți cei 17 pași ai arhitecturii actuale).
6. **Exportă / salvează output-urile brute** pentru fiecare pas în:
   ```
   docs/baseline/RO/<step-name>.md
   ```
   Sugestie: folosește editorul din UI ca sursă a adevărului; copiază Markdown-ul.
7. **Repetă pentru EN** — clonă a cursului, limbă `en`, aceleași câmpuri traduse; salvează în `docs/baseline/EN/`.
8. **Comite** `docs/baseline/` — asta închide F0-T3.

### Varianta B — rulare locală (dacă preferi izolare)

```bash
# într-un terminal
npx supabase start                       # pornește Postgres + auth + storage local
npx supabase functions serve generate-course-content --env-file .env.local
# .env.local trebuie să conțină GEMINI_API_KEY etc.

# în altul
npm run dev                              # frontend pe :5173
```
Apoi pașii 3–8 din Varianta A.

## Ce salvăm

Un fișier per livrabil per limbă (așa cum apare azi în editor):

```
docs/baseline/
├── RO/
│   ├── 01-course-dna.md
│   ├── 02-performance-objectives.md
│   ├── 03-course-objectives.md
│   ├── 04-structure.md
│   ├── 05-learning-methods.md
│   ├── 06-timing-and-flow.md
│   ├── 07-agenda-table.md
│   ├── 08-exercises.md
│   ├── 09-diagnostic-questionnaire.md
│   ├── 10-examples-and-stories.md
│   ├── 11-facilitator-notes.md
│   ├── 12-facilitator-manual.md
│   ├── 13-discussion-guide.md
│   ├── 14-slides.md
│   ├── 15-participant-workbook.md
│   ├── 16-action-plan.md
│   └── 17-video-scripts.md
└── EN/  (identic, traducere a cursului)
```

Pentru F6 vom puncta baseline-ul RO pe rubrică (docs/QUALITY_RUBRIC.md) ca
scor de plecare. EN e util pentru testul de puritate lingvistică (F2-T5).

## De ce nu simulez

Instrucțiunile utilizatorului sunt explicite: „nu simula și nu inventa
output-uri de baseline". Un baseline fabricat ar contamina rubrica din F6 și
ar face imposibilă măsurarea reală a delta-ului adus de refactor.
