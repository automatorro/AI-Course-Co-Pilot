## Diferențe față de ce există acum
- **Delimitare slide**: acum parsarea tratează H2–H4 (și parțial H1) doar când nu există „Slide X: …”. Propunerea standardizează: H1–H6 și „Slide X: …” sunt mereu valide ca început de slide, fără gating reciproc.
- **Poziționarea metadatelor**: acum inserarea/actualizarea meta (layout/adapted) poate opera pe HTML randat și poate rata secțiunea. Propunerea fixează scrierea exclusiv pe Markdown sursă, cu căutare deterministă în **primele 6 linii** după titlu.
- **Chei pentru conținut adaptat**: acum există suport pentru adaptedContent pe layout, dar nu este garantată poziționarea deterministă. Propunerea impune formatul `<!-- slide-adapted: LAYOUT | TEXT -->` (câte o linie per layout), plasată predictibil imediat sub `slide-layout`.
- **Regulile de fallback la imagini**: acum există căutări și un placeholder, dar fără o ordine comunicată clar. Propunerea fixează ordinea: imagini inline → „Visual” → titlu → placeholder, documentată și testată.
- **Preview ↔ Export identic**: acum există diferențe ad-hoc (de ex. detectarea începutului de slide, gating pe marker). Propunerea unifică parserul și regulile IR: aceeași identificare de slide, aceeași alegere de layout/adaptări/imagini.
- **UX explicit**: acum toaster/închidere modal poate crea confuzie. Propunerea standardizează comportamentul: modalul rămâne deschis, re-render optimist, badge „Salvat/Eroare”, indicator „Adaptări latente”, plus hint despre ordinea recomandată.
- **Failure rules**: acum „continuă pe erori” există, dar propunerea definește clar ce e „valid”, când continuăm, când oprim.

## Formatul Editorului (standard)
- **Delimitare**: Recomand „Slide X: Titlu” pentru fiecare slide. Alternativ, `## Titlu`–`#### Titlu` sau `---`. Nu amesteca stiluri în același fișier.
- **Metadate**: 
  - `<!-- slide-layout: IMAGE_LEFT -->` după titlu (în primele 6 linii);
  - `<!-- slide-adapted: IMAGE_LEFT | Introducere → 3 puncte cheie -->` (câte una per layout, plasată sub `slide-layout`).
- **Conținut**: `Visual:` (prompt scurt), `Text:` (bullets sau paragraf), `Speaker Notes:` (plain text), imagini inline `![alt](url)`, tabele markdown.

## Reguli de Generare (Preview = Export)
- **Layout activ**: meta `slide-layout`, altfel default derivat minimal (există imagine ⇒ ImageText; altfel Explainer).
- **Adaptări**: numai pentru layoutul activ; latentele persistă, nu se amestecă.
- **Imagini**: ordine fixă (inline → Visual → titlu → placeholder). Nicio inferență semantică.

## Persistență deterministă
- **Schimbare layout**: actualizează/inseră `slide-layout` în primele 6 linii.
- **Salvare adaptări**: actualizează/inseră `slide-adapted: TYPE | TEXT` pentru layoutul curent, după `slide-layout`. Păstrează latentele.

## Failure Rules
- **Valid**: marker început + titlu non‑gol. Layout/adaptări opțional.
- **Continuă**: imagine lipsă, bullets prea lungi, adaptări absente.
- **Oprire**: fără slideuri valide sau corupție XML (post‑sanitizare).

## Risk Management
- **UX**: hint „întâi layout, apoi adaptări”, badge latente, badge salvat/eroare.
- **Preview/Export**: un singur parser, teste end‑to‑end pe fixture‑uri.
- **Pierderea conținutului**: inserare doar în primele 6 linii; fallback de insert dacă blocul e scurt.

## Ghid de Authoring (exemplu)
```
Slide 2: Ce este Managementul Schimbării?
<!-- slide-layout: IMAGE_LEFT -->
<!-- slide-adapted: IMAGE_LEFT | Introducere → 3 puncte cheie -->
Visual: employee confusion flowchart
Text:
- Ce înseamnă Managementul Schimbării?
- De ce e important?
- MS vs Managementul Proiectelor
Speaker Notes: …
---
```

## Beneficiu
- Elimină ambiguitatea: aceeași regulă pentru început de slide și metadate, aceeași mapare Preview/Export, zero inferențe.
- Rezultat previzibil: 100% consistență între ce vezi în Preview și ce ajunge în PPTX.