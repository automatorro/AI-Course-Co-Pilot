## Context actual
- Inserarea imaginilor se face prin panoul din `CourseWorkspacePage.tsx` (URL sau fișier local) și prin AI Studio (`ImageStudioModal.tsx`).
- Preview-ul în tabul „Preview” este asigurat de `MarkdownPreview.tsx`, care convertește `blob:` în Data URL doar pentru afișare.
- La salvare, `replaceBlobUrlsWithPublic` înlocuiește `blob:` cu URL public din Supabase Storage.

## Probleme observate
- `blob:` sunt volatile și pot fi confuze; preview funcționează, dar conținutul rămâne cu `blob:` sau Data URL până la salvare.
- Panoul „Insert Image” nu oferă un preview live înainte de inserare.
- Fluxul AI Studio încearcă upload imediat; dacă eșuează, inserează Data URL – logica nu este unitară.

## Alternativa propusă (simplă și robustă)
1. Unificăm inserarea: pentru imagini locale și cele generate de AI inserăm **mereu Data URL** în editor pentru preview instant, fără dependențe de Storage în acel moment.
2. La salvare, înlocuim toate `data:` cu URL-uri publice din Supabase Storage printr-o nouă funcție `replaceDataUrlsWithPublic` (similară cu `replaceBlobUrlsWithPublic`). Păstrăm suportul existent pentru `blob:` pentru compatibilitate.
3. Adăugăm **preview live** în panoul de inserare (URL și fișier local) înainte de apăsarea „Insert”.
4. Păstrăm `MarkdownPreview` neschimbat (acceptă `data:` și `http(s)` nativ; conversia `blob:` rămâne pentru cazuri vechi).

## Implementare tehnică
- `src/services/imageService.ts`
  - Adăugăm `replaceDataUrlsWithPublic(md, userId, courseId)`: detectează imagini `data:` în Markdown, decodează în `Blob`, uploadează în bucket `course-assets`, înlocuiește cu `publicUrl`.
- `src/pages/CourseWorkspacePage.tsx`
  - Simplificăm `handleInsertLocalImage`: eliminăm „blob” și „upload” din UI; convertim fișierul în Data URL și îl inserăm.
  - Adăugăm preview live în panel: pentru `imageUrl` valid (`http(s)`), render `<img src={imageUrl}>`; pentru fișier local, render `<img src={dataUrl}>`.
  - În `handleSaveChanges`, rulăm secvențial: `replaceBlobUrlsWithPublic` + `replaceDataUrlsWithPublic` înainte de update în DB.
- `src/components/ImageStudioModal.tsx`
  - Modificăm `handleInsert`: obține Data URL din `previewUrl` și inserează Data URL (nu mai încercăm upload imediat). Upload-ul se va face la „Save”.

## UX detalii
- Panelul „Insert Image” afișează o zonă de preview cu starea curentă (URL sau fișier selectat), plus dimensiune fișier și mesaje de validare.
- Mesaj informativ: „Imaginile locale și AI sunt previzualizate imediat și se publică automat la Save.”

## Criterii de acceptare
- Utilizatorul vede preview live înainte de inserare (URL și fișier local).
- Imaginile generate de AI apar imediat în Preview și rămân funcționale după Save (convertite la URL public).
- Conținutul salvat nu conține `data:` sau `blob:`; doar URL-uri publice.
- Comportamentul existent pentru imagini de la URL public rămâne neschimbat.

## Riscuri și mitigare
- Data URL pot mări temporar dimensiunea conținutului: limităm fișierele la 8MB (existent) și mutăm la URL public la Save.
- Upload poate eșua la Save: păstrăm conținutul și afișăm toast de eroare; utilizatorul poate reîncerca. În caz de eșec, imaginea rămâne `data:` până la rezolvare.

## Pași
1. Implementăm `replaceDataUrlsWithPublic`.
2. Simplificăm inserarea locală la Data URL + adăugăm preview live.
3. Unificăm AI Studio să insereze Data URL.
4. Extindem `handleSaveChanges` să proceseze `blob:` și `data:`.
5. Testăm manual: local file, URL direct, AI Studio, Save și Preview.