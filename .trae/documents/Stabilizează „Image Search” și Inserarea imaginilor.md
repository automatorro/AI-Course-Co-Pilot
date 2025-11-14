## Simptome și cauze probabile
- Mesaj „Failed to fetch” poate apărea în:
  - Căutare: `searchImages()` face `fetch` către Lexica și poate fi blocat de CORS/rețea (`src/services/imageSearchService.ts:17`).
  - Inserare „Copy to Storage”: `fetch(item.url)` pe un host extern poate fi blocat de CORS (`src/components/ImageSearchModal.tsx:43–51`).
- Edge Function `image-search` nu pare a fi disponibil; codul face fallback direct la Lexica (vezi `invoke` cu `catch { }` în `src/services/imageSearchService.ts:10–15`).

## Obiectiv
- Asigurăm că „Image Search” funcționează fiabil, cu rezultate și inserare fără erori CORS.

## Soluție tehnică
1. Creează și folosește un proxy server-side pentru căutare
- Supabase Edge Function `image-search`:
  - Primește `query`, `page`.
  - Face request server-side la Lexica (sau alternativă), returnează `{ results: ImageSearchResult[] }`.
  - Setează CORS: `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Headers: *`.
- Actualizează `searchImages` să nu înghită erorile și să prefere `invoke('image-search')`; dacă `data.results` absent, afișează mesaj clar.

2. Evită fetch-ul de imagini din browser la „Copy to Storage”
- Creează Edge Function `fetch-image`:
  - Primește `url`, `userId`, `courseId`.
  - Descarcă server-side imaginea și o urcă în bucket `course-assets`, returnează `publicUrl`.
  - Setează CORS.
- Actualizează `ImageSearchModal.handleInsert`:
  - Dacă „Copy to Storage” ON, cheamă `supabase.functions.invoke('fetch-image', { body })` și inserează `publicUrl`.
  - Dacă OFF, inserează hotlinkul `item.url` (fără fetch în browser).

3. UX și robustețe
- Setează implicit „Copy to Storage” = OFF, cu tooltip „activarea copiază imaginea în Storage (stabilitate), dar necesită permisii server”.
- Afișează erori prietenoase: „Căutarea a eșuat (posibil CORS sau rețea). Încearcă din nou.” și „Inserarea a eșuat (hostul blochează descărcarea directă).”
- Loghează URL-ul folosit (doar în consola dev) pentru diagnoză.

## Criterii de acceptare
- Căutarea returnează rezultate consistent (prin Edge Function) fără „Failed to fetch”.
- „Copy to Storage” inserează URL public fără CORS/erori.
- Hotlink inserare funcționează imediat (fără fetch).
- Mesajele de eroare sunt informative.

## Pași de implementare
1. Implementăm `image-search` (Edge Function) și testăm cu Lexica.
2. Implementăm `fetch-image` (Edge Function) pentru copiere server-side.
3. Actualizăm `imageSearchService.ts` să folosească strict `image-search` și să trateze erorile.
4. Actualizăm `ImageSearchModal.tsx` pentru folosirea `fetch-image` și default „Copy to Storage” OFF.
5. Testăm: căutare, hotlink, copiere în Storage, previzualizare și salvare curs.