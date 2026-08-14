## Context
Raportul arată "(no title)" și "content lipsă" pe multe slide-uri, deși editorul conține blocuri "Slide X", "Visual", "Text", "Speaker Notes". Cauza este parsing-ul fragil (indentări, linii goale, etichete multi-limbă), nu conținutul.

## Decizie
- Introducem un pas intermediar Pre-Export Normalization care transformă forma actuală din editor în IR JSON exportabil, fără a modifica editorul.

## Nivel Conceptual
- Editorul rămâne sursa de adevăr; nu rescriem mesajul.
- Mapping determinist:
  - title: din "Slide X: …" sau, dacă lipsește, primul rând din "Text/Texto";
  - content: fiecare rând non-gol sub "Text/Texto" devine bullet;
  - visual: prompt/imagine din "Visual" (sau imagine Markdown);
  - notes: text din "Speaker Notes" (plain NFC).

## Nivel de Mecanism
- Parser tolerant (multi-limbă):
  - Dicționar etichete: Visual/Vizual/Imagem/Image; Text/Texto/Conținut/Content; Speaker Notes/Notas/Note Trainer etc. (case-insensitive, cu/ fără bold, colon, indentare);
  - Normalizare: elimină linii goale/whitespace după "Text", tratează rânduri simple ca bullets; recunoaște imagini Markdown cu spații;
  - Derivare de titlu: dacă titlul din "Slide X" lipsește, ia primul rând din "Text" și îl scoate din lista de content;
- Preflight:
  - validează "integralitatea" per Content Class (TextOnly vs ImageText etc.); raportează doar erori reale.

## Nivel de Execuție
- UI modal "Pre-Export Normalization":
  - listă slide-uri (Slide X), preview: Title/Content/Visual/Notes;
  - buton "Sari la Slide X" în editor;
  - "Generează PPTX" activ doar când toate sunt integrale.
- Export PPTX consumă exclusiv IR, cu i18n adapter și addNotes invariabil.

## Pași
1) Implement parserul multi-limbă și normalizatorul.
2) Construiește IR SlideModel și validatorul "integral".
3) Adaugă modalul de pre-export cu preview + raport.
4) Integrează exportul PPTX să consume IR.
5) Testează pe cursul "Managementul Schimbării" și alte 2 cursuri (PT/RO/EN).

## Consecințe
- Clienții nu fac nicio modificare în editor; exportul devine robust.
- Erorile apar doar când slide-ul este realmente incomplet (fără "Text" real sau imagine cerută).
- Dispar blocajele false generate de spații/linii goale și etichete variate.