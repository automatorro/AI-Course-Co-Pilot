## Răspuns esențial
- Da: pentru 100% predictibilitate, generatorul trebuie să emită un format canonical al slide-urilor în editor. Nu schimbăm logica AI sau arhitectura; doar ambalăm output-ul actual într-o structură standardizată, pe care Preview și Export o consumă identic.

## Format Canonical (șablon de generare)
- Pentru fiecare slide N:
```
Slide N: Titlu
<!-- slide-layout: EXPLAINER -->   (opțional, dacă vrem default explicit)
<!-- slide-adapted: EXPLAINER |  --> (opțional, placeholder gol)
Visual: <prompt scurt>
Text:
- bullet 1
- bullet 2
Speaker Notes: <text simplu>
---
```
- Titlul: derivat din outputul AI (prima idee clară/rezumat).
- Visual: 3–7 cuvinte cheie din sugestia vizuală deja generată.
- Text: exact listele generate (fără conversii semantice).
- Notes: preluare curată din script/explicații (plain text).
- Meta-taguri: inserate determinist (primele 6 linii), chiar dacă sunt goale/implicite;
  - layout implicit = EXPLAINER (sau dedus minimal: dacă există imagine inline ⇒ IMAGE_TEXT), dar îl putem scrie ca meta pentru claritate.

## Reguli de mapare (minime, non-inferență)
- Layout default: EXPLAINER; IMAGE_TEXT doar dacă există imagine inline; altfel rămâne EXPLAINER.
- Adapted: inițial gol; utilizatorul îl completează ulterior în Preview, per layout.
- Imagini: nu forțăm inserare; dacă ai URL, îl lăsăm în Text/inline; altfel se va rezolva la export (Visual/titlu/placeholder).

## Impact minim
- Nu schimbăm AI sau structura aplicației; adăugăm un pas de „formatting writer” între generare și salvarea în editor.
- Preview/Export nu se schimbă semantic; doar consumă un format consistent, reducând erorile de localizare.

## Pași de Implementare
1) Introdu „Slide Template Writer” în pipeline-ul de generare:
   - Numerotează secțiunile ca „Slide 1: …”, „Slide 2: …”.
   - Normalizează secțiunile (Visual/Text/Notes) și inserează separator „---”.
   - Inserează meta layout/adapted (gol) în primele 6 linii.
2) Backfill opțional (doar pentru materiale existente):
   - Script de reformatat conținutul curent în șablonul canonical (fără alterarea textului), menținând titlurile.
3) Validează cu parserul unificat:
   - Teste pe cursul „Managementul schimbării” (primele 5–10 slideuri), verificând Preview=Export 1:1.
4) UX minim în Preview:
   - Hint „Întâi layout, apoi adaptări”; badge „Salvat/Eroare” și „Adaptări latente”.

## Risk Management
- UX: clarificăm ordinea de lucru și arătăm feedback local; risc scăzut.
- Compatibilitate: „Slide X:” și H1–H6 rămân suportate; standardul recomandat e „Slide X: …”.
- Pierdere conținut: Writer doar ambalează; nu elimină text; metadatele sunt add-only.
- Export: fallback la placeholder pentru imagini; nu se oprește pe erori non-critice.

## Testare
- Unit: detectare „Slide X:”, meta în primele 6 linii, secțiuni Visual/Text/Notes.
- Integrare: Preview ⇄ Export cu fișiere reformatate.
- E2E: generare → Preview (layout+adapted) → Export PPTX identic.

## Concluzie
- Canonizarea formatului de editor rezolvă determinist localizarea slide-urilor și metadatelor. Astfel, orice acțiune din Preview este reflectată perfect în Export, fără a modifica AI sau arhitectura existentă.