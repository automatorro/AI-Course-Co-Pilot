# Plan de unificare previzualizare și export

- Obiectiv: Conținutul din “Previzualizare” și cel descărcat (DOCX) să fie identic vizual și fără marcaje Markdown neprocesate.

## Pași

1. Unifică randarea “Previzualizare” pe pipeline Markdown, permițând HTML inline.
   - Elimină comutarea pe HTML brut și procesează mereu Markdown cu `react-markdown` + `rehype-raw` + `rehype-highlight`.
   - Verificare: conținut cu `<u>` și liste; previzualizarea randează corect.

2. Normalizează editorul: conversii între Markdown și HTML.
   - La afișare în TinyMCE: MD → HTML (ex. cu `marked`).
   - La salvare/ieșire din editor: HTML → MD (ex. cu `turndown`).
   - Verificare: alternare Editor/Previzualizare păstrează formatările; fără “escape” Markdown în previzualizare.

3. Export DOCX din HTML complet.
   - Convertește Markdown (canonic) la HTML complet (același pipeline ca previzualizare).
   - Generează DOCX din HTML (ex. `html-to-docx`) pentru heading, liste, bold/italic/underline, imagini, code.
   - Verificare: DOCX reproduce previzualizarea; fără marcaje Markdown rămase.

4. Imagini în export.
   - Înlocuiește `blob:`/`data:` cu data-uri sau URL publice pentru export.
   - Verificare: imagini se văd în DOCX/PPTX.

## Status

- Pasul 1: completed
- Pasul 2: completed
- Pasul 3: pending
- Pasul 4: pending