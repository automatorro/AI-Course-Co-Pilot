## Obiectiv
- Inserare locală ca în industry: „Choose file” → imagine vizibilă imediat → upload automat → conținut actualizat cu URL public. Fără șiruri lungi în editor, fără imagini rupte.

## Acțiuni
- Inserare locală
  - Folosește `blob:` (`URL.createObjectURL`) la inserare pentru previzualizare instant.
  - Pornește upload imediat; când termină, înlocuiește `blob:` cu URL public în conținut.
  - Elimină folosirea `data:` la inserare pentru a evita „sârma lungă” în editor.
- Previzualizare
  - Randă direct `blob:` fără `fetch`/conversie; doar fallback dacă eșuează.
  - Păstrează randare pentru `http(s)://` și `data:`.
- Validări inserare
  - Blochează tokenuri ne‑URL (`@img{...}`); la paste acceptă doar `image/*`; altfel arată mesaj clar.
- Persistență
  - La salvare, convertește doar `blob:` rămase în URL public; `data:` nu va mai fi introdus prin flux local.
- Storage
  - Verifică/creează bucket `course-assets` + politici publice; dacă lipsește, dezactivează upload și afișează instrucțiuni de configurare.

## Pași
1) Inserare: schimbă generarea sursei locale la `blob:` + upload imediat.
2) Previzualizare: simplifică componenta de imagine să accepte `blob:` direct.
3) Inserare din clipboard/drag‑drop: filtrează `image/*`, respinge text‑tokenuri.
4) Salvare: procesează `blob:` în URL public, nu `data:`.
5) Storage: verifică existența bucketului și policy; ajustează UI dacă lipsesc.

## Acceptare
- După selectare, imaginea apare instant, fără „șir lung”.
- Previzualizarea nu mai arată icon rupt.
- Conținutul se actualizează automat cu URL public după upload.
- Nicio referință `blob:`/`data:` în DB după salvare.

Confirmă implementarea; apoi fac modificările vizate și validez end‑to‑end.