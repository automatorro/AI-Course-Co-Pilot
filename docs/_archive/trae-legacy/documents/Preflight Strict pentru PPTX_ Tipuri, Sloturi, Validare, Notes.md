## Context
CourseCopilot generează prezentări PPTX dintr-un pas „Slides”. Situații observate: slide-uri cu titlu + imagine fără conținut, și note de facilitator neatașate în Notes pane. Obiectivul: definirea unei constituții arhitecturale care face imposibile, prin design, reprezentările vizuale incorecte semantic.

## Problemă
- Informația semantică nu este garantat mapată într-un slot vizual valid.
- Layout-ul poate fi decis înaintea validării semantice.
- Exportul continuă când informația nu poate fi plasată integral.
- Notele facilitatorului nu au un statut invariabil și o politică de validare.

## Decizii
### Nivel conceptual (adevăr semantic)
1) Intenția slide-ului conduce reprezentarea. Fiecare slide are o intenție (Explain, Quote, Process, Comparison, ImageAnchor, Agenda, Statistic). Dacă intenția nu este furnizată, se deduce; dacă nu poate fi dedusă, se aplică „Semantic Resolution Ladder”.
2) Content Class Contract. Se formalizează clasele de conținut și câmpurile obligatorii/interzise per clasă:
- TextOnly: title + body/bullets (obligatorii); image (interzis); intents permise: Explain, Agenda (compact), KeyTakeaways.
- ImageText: title + bullets + image (obligatorii); quote (interzis); intents: Explain, ImageAnchor.
- Quote: quote_text (+ author opțional) (obligatorii); bullets (interzise); intents: Quote.
- BigStat: stat_value (+ label opțional) (obligatorii); bullets (interzise); intents: Statistic.
- Timeline/Process: steps_array (obligatoriu); image (opțional); intents: Process, Timeline.
- Comparison: left_side + right_side (obligatorii); image (opțional); intents: Comparison.
3) Integralitatea informației. „Integral” înseamnă: toate câmpurile semantice declarate pentru intenție și pentru Content Class au un slot vizual valid și pot fi plasate fără alterarea formei.
4) Notele facilitatorului sunt meta inviolabilă. Notes sunt opționale, dar dacă există, intră în criteriul de „integral” și sunt întotdeauna atașate în Notes pane; nu influențează layout și nu sunt parsate semantic.

### Nivel de mecanism (validare, fallback, stop)
5) Validare semantică completă înainte de orice decizie vizuală. Nicio decizie de layout nu poate preceda validarea intenției, a Content Class și a integralității câmpurilor.
6) Renderable Slot Contract. Un slot este valid doar dacă: (a) este vizibil; (b) are dimensiuni nenule și renderabile; (c) acceptă tipul de conținut (paragraph/list/quote); (d) nu este acoperit de alte elemente; (e) permite wrapping pentru scriptul limbii (i18n). Compatibilitatea nu este doar semantică, ci și fizică.
7) Semantic Resolution Ladder. Ordinea rezolvării:
- Intenție explicită furnizată de autor → acceptată.
- Pattern structural derivat (formă conținut) → clasifică.
- Default safe intent = Explain.
- Dacă nici Explain nu poate fi satisfăcut integral (semantic + slot fizic), rezultatul este „fatal” (export oprit).
8) Relayout limitat la Content Class. Dacă layout-ul ales nu respectă contractul, se poate alege alt layout doar în cadrul aceleiași clase. Nu se schimbă clasa fără decizie didactică explicită.
9) Auto-split ca decizie didactică. Decizie explicită prin flag semantic `allowSplit: true|false` (default=false). Permis numai pentru intenții enumerative (Agenda, KeyTakeaways, Checklist, Process/Timeline) și evaluat înainte de preflight. Interzis pentru narative, citate, statistici, imagini ancoră. Riscuri pedagogice: fragmentare și pierdere de coerență; de aceea nu este default.
10) Stop pe „nu poate afișa integral informația”. Clasificare rezultat:
- Warning: ergonomie (densitate) dar slot compatibil fizic și semantic; se sugerează relayout în aceeași clasă.
- Eroare blocantă: lipsește slotul pentru un câmp obligatoriu sau lipsește un element cerut de tip (ex: imagine pentru ImageText); se încearcă relayout în aceeași Content Class; dacă imposibil, exportul se oprește.
- Fatală: tip incert/neclasificabil sau contradicții între intenție și conținut; exportul se oprește fără relayout.

### Nivel de execuție (export, randare)
11) Ordine de execuție: intenție → validare Content Class & integral → selecție layout în clasă → verificare Renderable Slot Contract → atașare resurse vizuale → randare.
12) Notes sunt atașate cu addNotes (plain text, NFC), independente de layout; nu se adaugă pe slide vizibil.
13) i18n ca invariant: font/RTL/wrapping determinate de script; nu se compromite lizibilitatea pentru estetică.

## Alternative respinse
- Rotire liberă între șabloane: respinsă (permite layout-uri fără slot pentru mesaj).
- Praguri numerice ca regulă primară (maxChars/maxBullets): respinse (compatibilitate de tip are prioritate; pragurile rămân semnale secundare).
- Auto-split implicit și mecanic: respins (decizie didactică explicită, nu automatism).
- Adaptare automată a conținutului (rezumare/conversie): respins (fidelitate educațională).

## Consecințe
- Exporturi oprite pe incompatibilități: fricțiune în UI cu raport clar (slide, motiv, acțiune recomandată); rezultat considerat valid.
- Mai puțină „magie” vizuală, mai mult control și predictibilitate semantică.
- Limitarea alegerilor vizuale de intenție și Content Class: coerență sporită, varietate arbitrară redusă.
- Notes garantate în Notes pane, neatins vizual.

## Reguli nenegociabile (Invariants)
- Nicio decizie de layout înainte de validarea semantică completă.
- Un slide nu se randă dacă nu există sloturi fizice și compatibile pentru toate câmpurile semantice obligatorii.
- ImageText nu se randă fără imagine validă.
- Quote nu poate conține bullets.
- Conținutul principal nu este adaptat automat (fără rezumare/conversie) fără decizie didactică explicită.
- Notes sunt mereu separate și atașate cu addNotes; nu apar pe slide vizibil.
- Dacă „integral” nu poate fi satisfăcut, exportul se oprește (blocant sau fatal) conform clasificării.

## Ce NU face sistemul
- NU face auto-split pentru narative/citate/statistici/imagini ancoră.
- NU schimbă Content Class fără decizie didactică explicită.
- NU adaptează automat conținutul pentru a „încapea”.
- NU plasează notes pe slide.

Acest ADR consacră un flux semantic-first, cu compatibilitate și integritate ca axiome. Mecanismele (validator, relayout limitat, stop) sunt subordonate acestor reguli și nu pot fi eludate.