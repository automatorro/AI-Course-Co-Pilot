# Editor Markdown – Varianta A

Acest document descrie implementarea și comportamentul editorului Markdown conform Variantei A, cu integrare perfectă în aplicație, menținerea compatibilității înapoi și consistență arhitecturală.

## Obiective
- Păstrarea modelului de date existent (`string Markdown`).
- Eliminarea interacțiunilor cu `window.prompt()` și înlocuirea lor cu panouri dedicate.
- Îmbunătățirea UX: butoane suplimentare în toolbar, validări, preview bogat.

## Funcționalități cheie
- Insert Link: panou cu câmpuri `Text` și `URL` (validare `http(s)://`).
- Insert Image: panou cu câmpuri `URL` și `Alt` (validare `http(s)://`).
- Insert Image (local): încărcare fișier (PNG/JPEG/GIF/WEBP), validare tip și dimensiune, inserare ca `Data URL` (persistă) sau `Blob URL` (doar preview în sesiune).
- Task list: buton dedicat care inserează listă de tip task (`- [ ] item`).
- Insert Table: panou cu `Rows` și `Columns` ce generează tabel Markdown.
- Syntax highlighting: preview cu `rehype-highlight` și stil `highlight.js` (tema `github`).

## Validare URL
- Link/Image verifică prefixul `http://` sau `https://`.
- Butonul `Insert` este dezactivat pentru URL gol sau invalid.
- Câmpurile invalide sunt marcate vizual cu bordură roșie și mesaj explicativ.

## Încărcare locală (imagini)
- Tipuri acceptate: `image/png`, `image/jpeg`, `image/gif`, `image/webp`.
- Dimensiune maximă: 8MB.
- Moduri de inserare:
  - `Data URL`: inserează conținutul imaginii în Markdown ca URL `data:` (portabil și persistent, crește dimensiunea conținutului).
  - `Blob URL`: inserează un URL `blob:` valabil doar în sesiunea curentă (util pentru preview rapid; nu persistă după refresh).
- Notă: SVG nu este acceptat pentru a reduce riscurile de securitate.

## Compatibilitate și integritate
- Stocarea conținutului rămâne în Markdown; nu s-au introdus conversii sau scheme noi.
- Inserțiile respectă formatul Markdown standard (GFM pentru tabele/task list).
- Nu afectează funcționalitățile existente; toolbar-ul este extensibil și izolat.

## UX și accesibilitate
- Panourile se închid la click în afara lor sau la `Cancel`.
- Butoanele respectă starea `disabled` când nu se poate edita.
- Mesajele de eroare sunt concise și vizibile.

## Dependințe
- `rehype-highlight` pentru evidențiere sintaxă în preview.
- Stiluri: `highlight.js/styles/github.css` importate în `MarkdownPreview.tsx`.

## Testare
- Verificare vizuală în dev preview: butoane, panouri, inserție corectă Markdown și evidențiere cod.
- Typecheck (`npm run typecheck`) pentru consistență tipuri.

## Întreținere
- Codul editorului se află în `src/pages/CourseWorkspacePage.tsx`.
- Preview-ul Markdown este în `src/components/MarkdownPreview.tsx`.
- Extensii viitoare: validări suplimentare URL (TLD, MIME), shortcut-uri, stilizare panouri.