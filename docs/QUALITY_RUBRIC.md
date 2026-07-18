# QUALITY_RUBRIC — CourseCopilot

**Definiția măsurabilă a „materialelor dorite".** Se aplică pe cursul-etalon
complet (toate cele 5 livrabile: Trainer Guide, Participant Manual, Slide Deck,
Exercise Sheets, Trainer Flow), separat RO și EN. Fiecare criteriu se punctează
1–5.

Rubrica e poarta blocantă M6: nicio fază ulterioară nu începe fără ca pragul să
fie atins pe RO și pe EN.

---

## Criterii

| # | Criteriu | 5 înseamnă |
|---|---|---|
| 1 | Aliniere obiectiv–activitate (Bloom) | Fiecare exercițiu antrenează exact verbul obiectivului; debrief-ul îl verifică |
| 2 | Arhitectura Merrill | Activare reală (experiența lor), demonstrație cu exemplu lucrat, aplicare dominantă, integrare spre job |
| 3 | Specificitate | Scenariile s-ar strica dacă schimbi industria; zero placeholder-e; cifre plauzibile |
| 4 | Profunzime/densitate | Teoria e capitol de manual, nu note de slide; proporțională cu minutele blocului |
| 5 | Consistență inter-livrabile | Ghidul, manualul, foile, slide-urile și flow-ul se referă la aceleași blocuri, ID-uri, durate |
| 6 | Ton | Un cititor care cunoaște autorul l-ar recunoaște; interdicțiile respectate 100% |
| 7 | Puritate lingvistică | Zero contaminare între limbi (verificat și automat, F2-T5) |
| 8 | Utilizabilitate în sală | Trainerul poate livra DOAR cu ghidul+flow-ul; participantul poate lucra DOAR cu foaia |
| 9 | Mediu (LIVE/ONLINE) | Mecanicile corecte peste tot; zero referințe din mediul greșit |
| 10 | Slide-uri | Layout justificat de conținut; ≤4 bullets; speaker notes care duc greul |

## Scala 1–5 (referință)

- **5** — Se aliniază complet cu descrierea criteriului „5 înseamnă". Ar putea fi
  material de referință pentru alți autori.
- **4** — Bun. Îndeplinește criteriul cu 1–2 abateri minore, ușor de corectat.
- **3** — Acceptabil. Îndeplinește criteriul dar cu abateri notabile care ar
  necesita editare înainte de sală.
- **2** — Slab. Criteriul e vizibil ratat în cel puțin jumătate din livrabile.
- **1** — Neatins. Criteriul e absent sau contradicted.

## Prag de trecere (M6)

**Medie ≥ 4,0 și niciun criteriu < 3, pe RO și pe EN.**

## Referințe-aur (standardul lui „5")

Exemplele owner-ului mutate în `docs/golden-references/` (F0-T2):
- `docs/golden-references/COURSE OUTPUT EXAMPLES/`
- `docs/golden-references/CURS 8 ORE PROMPT ENGINEERING/`

Acestea sunt materialele deja considerate bune. Rubrica se calibrează în
raport cu ele — dacă un livrabil e la nivelul unui exemplu de aici, primește 5
pe criteriile aplicabile.

## Cine punctează

- **Owner:** criteriile 1, 2, 4, 6, 8, 10 (necesită judecată pedagogică și de voce)
- **Claude (pre-evaluator):** criteriile 3, 5, 7, 9 (mecanice, verificabile)

Notele finale se consolidează într-un tabel per iterație în F6, cu delta
față de iterația precedentă. Log în `supabase/functions/generate-course-content/prompts/PROMPT_CHANGELOG.md`.

## Escaladare (dacă calibrarea stagnează)

Vezi Cap. B.3 din `docs/CURATENIE-SI-MODERNIZARE-CourseCopilot.md`. Pe scurt:
few-shot chirurgical → model Pro pe apelurile cu levier maxim → granularitate
mai fină → îmbogățirea contractului → concluzie onestă de business.
