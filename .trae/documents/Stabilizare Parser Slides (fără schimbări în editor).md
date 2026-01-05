## Context
Erorile „(no title)” și „content lipsă” indică o problemă de parsing: formatul actual din editor folosește bullets indentate și etichete bold (Visual/Texto/Notes) în liste. Exportul trebuie să recunoască robust aceste forme fără a cere modificări de conținut.

## Nivel Conceptual
- Editorul este sursa de adevăr: păstrăm exact structura cu „**Slide X**”, „**Visual:**”, „**Texto:**”, „**Speaker Notes:**”.
- Mapping semantic determinist: titlul derivat din primul bullet din „Texto”, restul bullets = content; „Visual” → image/prompt; „Speaker Notes” → addNotes.

## Nivel de Mecanism
- Parser Fixes (fără a schimba editorul):
  1) Bullets: detectează bullets cu regex tolerant la indentare: /^\s*[-*•]\s+/ și numerotate /^\s*\d+\.\s+/. Strip corect al markerului (indiferent de spații).
  2) Etichete: recunoaște „Visual/Texto/Notes” cu bold/colon și spații, în mai multe limbi (PT/RO/ES/EN); acceptă „**Texto:**”, „* **Texto:**”, „**Text:**”.
  3) Imagini Markdown: acceptă spații înainte de ![...](...) (regex /^\s*!\[/).
  4) Titlu derivat: dacă „**Slide X**” nu are titlu explicit, ia primul bullet din „Texto” ca titlu și îl scoate din lista de content.
  5) Boundaries: după ce intră în „Texto”, preia doar până la următoarea etichetă; nu combină blocuri.

- Preflight Adjustments:
  - „content lipsă” devine valid doar dacă blocul „Texto” nu are niciun bullet după normalizare; altfel nu blochează.
  - „title lipsă” e valid doar dacă derivarea eșuează (nu există bullet/text în „Texto”).
  - „image lipsă” blochează doar pentru slide-uri clasificate ca ImageText, nu pentru TextOnly.

## Nivel de Execuție
- Randare: nicio căutare de imagine din titlu; doar „Visual” sau imagine Markdown.
- Notes: addNotes invariabil, plain NFC.
- Raport UI: listează „Slide X” + titlul derivat, nu „(no title)”; buton „Sari la Slide X” (ancoră) în editor.

## Testare
- Set de probe cu exact formatul exemplu (PT/RO): bullets cu „*   ”, etichete bold, imagini cu spații.
- Verifică că: titlurile derivă corect, content populat, „Visual” mapat, notes atașate, fără blocaje false.

## Consecințe
- Dispar erorile „(no title)”/„content lipsă” pentru slide-uri corecte din editor.
- Blocajele rămân doar pentru slide-uri cu adevărat incomplete (fără „Texto”, fără imagine la ImageText).

Dacă confirmi, aplic fixurile în parser și preflight, fără nicio schimbare a conținutului din editor, și verific exportul pe cursul tău exemplu.