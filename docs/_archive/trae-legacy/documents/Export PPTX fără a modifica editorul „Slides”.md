## Context
Editorul „Slides” produce deja un format semi-structurat, stabil și de calitate, folosit în producție: titluri de tip "**Slide X**" urmate de liste cu etichete semantice "**Visual:**", "**Text/Texto:**" și "**Speaker Notes:**". Aceasta este munca validată de 6 luni și nu trebuie schimbată.

## Nivel Conceptual (adevăr semantic)
- Axioma: Editorul este sursa de adevăr. Exportul se adaptează la formatul existent, nu invers.
- Intenția slide-ului derivă din etichetele semantice: "Visual" (ancoră vizuală), "Text/Texto" (conținut principal), "Speaker Notes" (meta, invizibil pe slide).
- Titlul slide-ului este derivat determinist din conținutul "Text/Texto" dacă nu este furnizat explicit după "**Slide X**"; derivarea este o mapare semantică, nu un fallback decorativ.

## Nivel de Mecanism (validare, fallback, stop)
- Parser de normalizare (Language-Aware):
  - Recunoaște etichete în mai multe limbi/scrisuri: Visual/Vizual/Imagem/Imagen/Image; Text/Texto/Conținut/Content; Speaker Notes/Notas/Note Trainer etc.
  - Acceptă formatarea Markdown (bold "**...**", bullets "-", "*", "•").
  - Extrage: title (din header sau primul bullet din Text), bullets (restul din Text), imagePrompt (din Visual) și notes (din Speaker Notes).
- Preflight semantic:
  - Verifică integralitatea: title + content pentru TextOnly; title + content + visual pentru ImageText; notes dacă există sunt atașabile.
  - Stop (blocant) dacă vreun câmp obligatoriu nu poate fi mapat din formatul editorului (fără injectarea valorilor default).
- Fără rețea la decizie:
  - Vizualul aparține slide-ului: folosește exclusiv conținutul "Visual" sau imaginile Markdown. Nu se face căutare implicită din titlu.

## Nivel de Execuție (export, randare)
- Pipeline: Editor („Slides”) → Parser de normalizare → IR SlideModel (Content Class + câmpuri) → Validare semantică + i18n → Randare PPTX.
- i18n invariant: font/RTL/wrapping per script; notes în Notes pane (addNotes, plain, NFC).
- Raport de erori în UI: lista slide-urilor cu index "Slide X" și motivul; link către secțiunea din editor.

## Implementare (fără a modifica editorul)
1) Parser de normalizare
- Dicționar de etichete: Visual/Text/Notes cu sinonime multi-limbă.
- Algoritm:
  - Detectează blocul "**Slide X**"; dacă urmează un titlu explicit, îl folosește.
  - Pentru titlu absent: ia primul bullet din blocul "Text/Texto" ca titlu; restul bullet-urilor devin content.
  - "Visual" → imagePrompt (sau imagine Markdown explicită).
  - "Speaker Notes" → text normalizat pentru addNotes.
2) Preflight
- Verifică Content Class (TextOnly vs ImageText etc.) și integralitatea; fără default-uri.
- Stop & raport dacă integralitatea e încălcată.
3) Randare
- Mapare layout doar în cadrul Content Class; i18n adapter aplicat; addNotes invariabil.
4) Raport UI
- Modal cu erori listate pe "Slide X"; buton "Sari la secțiune" (ancore) în editor.
5) Teste
- Set de probe pe formatele actuale (RO, PT, ES, EN) pentru Visual/Text/Notes; verificare deterministă a IR.

## De ce rezolvă problema
- Nu cere modificări în editor; exportul se conformează formatului existent.
- Elimină fallback-urile vizuale/textuale; orice lipsă reală blochează exportul cu explicații.
- Titlul derivat din "Text" nu este un "default": este o mapare semantică stabilă și documentată.

## Consecințe asumate
- Exporturi oprite când materialul nu respectă etichetele semantice; UI oferă remedieri precise.
- Stabilitate și predictibilitate la export; fără imagini duplicate sau titluri "Slide".
- Notes apar constant în Notes pane; nu pe slide.

Confirmă dacă mergem pe acest plan; îl implementez fără să ating formatul din editor și validez exportul pe cursul tău exemplu.