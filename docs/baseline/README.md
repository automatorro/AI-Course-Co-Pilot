# baseline — SKIPPED (owner decision, 2026-07-18)

Acest folder a fost planificat pentru output-uri brute generate pe cursul-etalon
(§3 din plan) cu arhitectura actuală, ca artefact „before" pentru comparația
din F6.

**S-a decis să nu se ruleze.** Motivele:

1. **Rubrica din F6 e absolută** (medie ≥4,0 pe scala 1–5, `docs/QUALITY_RUBRIC.md`),
   nu relativă la baseline. Poarta de calitate M6 se poate atinge fără artefact
   „before".
2. **UI-ul actual nu are câmp de ton verbatim** — audit §5 confirmă: tonul e
   strivit în 3 arhetipuri (Mentor/Coach/Buddy). Cursul-etalon are un ton liber
   pe care arhitectura veche nu-l poate accepta. Câmpul liber apare abia în
   F3-T1. Un baseline generat cu preset ≠ un baseline al aceluiași curs.
3. **Efort disproporționat** — ~2h de generare live + 34 de copy-paste-uri din
   editor, pentru un artefact folosit doar la comunicare (before/after
   marketing), nu la poartă blocantă.

## Dacă vreodată vrei să generezi baseline-ul

Deschide un curs nou în aplicația live cu parametrii cursului-etalon
(`src/tests/fixtures/etalonCourse.ts` — dar aplică tonul cât mai apropiat
dintre preseturile Mentor/Coach/Buddy, ex. „Mentor" pentru cald+direct).
Rulează generarea completă. Exportează Markdown-ul fiecărui pas în
`docs/baseline/RO/NN-<step>.md` (numerotare din 01 până la 17, exact ca în
`STEPS_ORDER` din `GenerationProgressModal.tsx:41`). Repetă pentru EN.

Fără procese de deploy, fără chei — aplicația live are tot ce trebuie.
