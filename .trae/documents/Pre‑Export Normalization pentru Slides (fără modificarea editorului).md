## Context
Clienții văd conținutul corect în editor „Slides”, dar formatul (linii goale, etichete multi‑limbă, indentări) uneori nu este mapat perfect de motorul de export. Vrem un pas intermediar care să transforme forma existentă într‑un model exportabil, fără a modifica materialul din editor.

## Obiectiv
Introduce un pas suplimentar „Pre‑Export Normalization” care:
- citește formatul actual (Slide X, Visual, Text/Texto, Speaker Notes),
- normalizează non‑semantic (spații, linii goale, indentări),
- construiește un IR JSON cu câmpuri explicite (title, bullets, visual, notes),
- validează „integralitatea” și afișează un preview mapping,
- livrează export PPTX determinist, fără a schimba conținutul din editor.

## Nivel Conceptual (adevăr semantic)
- Editorul rămâne sursa de adevăr; nu alterăm textul original.
- Mapping determinist:
  - title = „Slide X: …” sau, dacă lipsește, primul rând din „Text/Texto”.
  - content = fiecare rând imediat sub „Text/Texto” (după curățare) ca bullet.
  - visual = prompt din „Visual” sau imagine Markdown (dacă există).
  - notes = conținut din „Speaker Notes” (plain, NFC).
- Nu restructurăm mesajul (fără rezumare/reformatare); doar normalizăm forma (trim/spaces/empty‑line removal).

## Nivel de Mecanism (validare, fallback, stop)
- Parser multi‑limbă: dicționar de etichete (Visual/Vizual/Imagem/Image; Text/Texto/Conținut/Content; Speaker Notes/Notas/Note etc.), tolerant la bold, colon și indentare.
- Normalizare:
  - elimină linii goale și „whitespace only” după „Text/Texto”,
  - recunoaște bullets cu indentare („-”, „*”, „•”) și rânduri simple ca items,
  - acceptă „![alt](url)” cu spații înainte.
- IR builder: SlideModel { title, bullets[], visualPrompt|imageUrl, notes } + Content Class detectată.
- Preflight:
  - verifică integralitatea per Content Class,
  - dacă nu e „integral”, oprește exportul și afișează raport cu „Slide X” + motiv.

## Nivel de Execuție (export, randare)
- UI: „Pre‑Export Normalization” modal înainte de export PPTX, afișează preview mapping per slide (Title/Content/Visual/Notes) și status.
- Opțiuni non‑invazive (default ON) care afectează DOAR IR, nu editorul:
  - elimină linii goale sub Text,
  - transformă fiecare rând Text în bullet,
  - derivează titlul din primul rând Text când lipsește.
- Export PPTX consumă IR, cu i18n adapter și addNotes invariabil; fără căutări vizuale implicite din titlu.

## Interacțiune UI
- Modal de pre‑export cu listă de slide‑uri:
  - fiecare item: „Slide X”, title derivat, nr. bullets, visual (prompt/url), notes (indicator „prezent”).
  - buton „Deschide în editor” (ancoră în „Slides”) pentru corecții.
  - buton „Generează PPTX” activ doar când toate sunt „integrale”.
- Opțional: „Aplică normalizarea în editor” (checkbox) pentru a scrie forma curățată în editor (implicit OFF).

## Testare
- Probe pe cursuri reale (RO, PT, ES, EN):
  - slide-uri cu Text multi‑linie, linii goale, indentări, imagini Markdown,
  - confirmă că mappingul produce PPTX complet cu titlu, bullets, imagine per slide și notes.

## Consecințe
- Zero schimbări pentru clienți în editor; exportul devine robust și predictibil.
- Blocaje apar doar când slide-ul e cu adevărat incomplet (fără Text/Visual încadrate), cu raport clar.
- Reducem drasticele „content lipsă” cauzate de spații/linii goale.

## Livrabile
- Parser + Normalizer multi‑limbă
- IR builder + validator „integral”
- UI modal „Pre‑Export Normalization” cu preview și raport
- Integrare în fluxul de export PPTX (consum IR)

Confirmă; după confirmare implementez pasul intermediar, integrez UI și validez pe „Managementul Schimbării”.