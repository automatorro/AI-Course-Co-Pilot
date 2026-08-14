## Sursă PPTX
- Consumă exclusiv pasul „Slides” din editor; elimină fallback-ul la alte pași.

## Notes (PPTX)
- activează addNotes() cu trainer_notes; plain text, Unicode NFC, limită ~1500 chars.

## i18n Adapter (PPTX)
- detectează script (latin/cjk/rtl), setează fontFace/align/rtl; normalizează Unicode; wrapping controlat.

## Auto-Split (PPTX)
- împarte bullets când depășesc regulile arhetipului; păstrează arhetipul.

## Garduri & Flag
- rulează sub feature flag; fallback instant la exportul curent.

## Neimpact DOCX/PDF/ZIP
- nu modifică fluxurile DOCX/PDF/ZIP; verificare de regresie pe 10 cursuri.

Accept implementarea; trec la modificări și validări.