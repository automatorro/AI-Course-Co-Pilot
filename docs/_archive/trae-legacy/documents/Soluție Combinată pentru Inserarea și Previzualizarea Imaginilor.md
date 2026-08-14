## Obiective

* Permite introducerea imaginilor din: local, căutare pe internet și generare AI.

* Asigură previzualizare instant și persistență reală (URL public) fără erori CORS.

* Păstrează progresul actual: editor Markdown, AI Studio, salvare pași.

## Probleme actuale (comparativ cu codul)

* Căutare internet: `fetch` direct către Lexica e blocat de CORS — "Failed to fetch" (`src/services/imageSearchService.ts:17`).

* Inserare din căutare: `fetch(item.url)` în browser pentru copiere în Storage produce CORS — "Failed to fetch" (`src/components/ImageSearchModal.tsx:43–51`).

* Inserare AI: funcționează parțial; preview ok, dar upload imediat poate eșua. Inserarea Data URL este mai robustă (`src/components/ImageStudioModal.tsx:38–57`).

* Local: inserarea funcționează; previzualizarea în panel lipsește sau era inconsistentă, iar uneori folosirea `blob:` ducea la conținut volatil (`src/pages/CourseWorkspacePage.tsx:466–512`).

* Salvare: conversia `blob:` și `data:` la URL public există și e bună (`src/services/imageService.ts:26–60`).

## Strategia combinată (nu stricăm ce merge, adăugăm ce lipsește)

* Previzualizare imediată cu Data URL în editor (local + AI + căutare cu hotlink) — menținem UX fluid.

* Persistență la „Save”: conversie server-side la URL public (deja acoperită) plus background upload pentru inserări imediate.

* Proxy server-side pentru căutare și copiere din internet (elimină CORS). Când proxy nu e disponibil, fallback la hotlink direct cu previzualizare, iar upload se face la „Save”.

## Fluxuri detaliate

* Local:

  * Selectare fișier → previzualizare în panel → inserare `data:` în editor.

  * La „Save” → `replaceBlobUrlsWithPublic` deja procesează și `data:` (`src/services/imageService.ts:26–60`).

* Internet:

  * Căutare: se preferă Edge Function `image-search` (server-side) pentru Lexica; fallback CORS proxy public; dacă tot eșuează, se arată mesaj clar.

  * Inserare: implicit hotlink (`it.url`) pentru previzualizare rapidă; opțiune „Copiază în Storage”. Dacă ON, se folosește Edge Function `fetch-image` (server-side) pentru descărcare și upload în Storage; fallback la proxy public.

* AI Studio:

  * Previzualizare cu `URL.createObjectURL` → inserare ca Data URL pentru randare; upload în Storage se face la „Save”.

## Modificări în cod (incremental și sigure)

* `src/components/ImageSearchModal.tsx`:

  * Implicit „Copy to Storage” = OFF (inserare hotlink fără fetch în browser).

  * Când „Copy to Storage” = ON: invoke `fetch-image` (Edge Function) care descarcă server-side și urcă în `course-assets`, returnează `publicUrl`.

  * Fallback de rețea: dacă Edge Function indisponibilă, folosește `images.weserv.nl` ca proxy la descărcare.

* `src/services/imageSearchService.ts`:

  * Preferă `supabase.functions.invoke('image-search')`; la eșec, fallback `https://cors.isomorphic-git.org/...` către Lexica.

  * Returnează mesaje de eroare clare către UI.

* `src/pages/CourseWorkspacePage.tsx`:

  * Panel „Insert Image”: previzualizare live pentru URL și fișier local (menținere și extindere).

  * Inserare locală: inserează Data URL; fără upload imediat.

  * La „Save”: păstrăm pipeline existent care înlocuiește `blob:`/`data:` cu URL public.

* `src/components/ImageStudioModal.tsx`:

  * Inserează Data URL în editor; upload la „Save” (flux unificat cu local).

* `src/components/MarkdownPreview.tsx`:

  * Menținem conversia `blob:` → Data URL pentru compatibilitate istorică; `data:` și `http(s)` se randază nativ.

## Edge Functions (design)

* `image-search`: primește `{ query, page }`, face request server-side la Lexica, returnează `{ results }`, setează CORS headers permissive.

* `fetch-image`: primește `{ url, userId, courseId }`, descarcă server-side imaginea (respectând Content-Type), urcă în `course-assets`, returnează `{ publicUrl }`.

## Securitate și robustețe

* Validare tip MIME și limită de dimensiune (8MB) pentru local.

* Evităm hotlink descărcat în browser (CORS) prin server-side sau proxy; nu propagăm headere sensibile.

* Nu logăm secrete; nu expunem tokenuri.

* În UI, afișăm erori prietenoase și oferim retry; nu blocăm editorul.

## Pași de implementare

1. Actualizează `imageSearchService` cu fallback CORS proxy (done).
2. Actualizează `ImageSearchModal`:

* Default hotlink; la „Copy to Storage” → invoke `fetch-image`; fallback `images.weserv.nl`.

1. Unifică AI Studio la Data URL (done) și păstrează upload la „Save”.
2. Extinde panelul „Insert Image” cu previzualizare live (done).
3. Adaugă Edge Functions `image-search` și `fetch-image` (documente + endpoints).
4. Testează fluxuri: local, internet (hotlink/proxy), AI, apoi „Save” pentru persistență.

## Criterii de acceptare

* Previzualizare funcționează pentru local/internet/AI imediat în editor.

* „Save” transformă `blob:`/`data:` în URL public;

* Căutarea și inserarea din internet nu mai afișează „Failed to fetch” în mod normal.

* Nimic din progresul actual nu este stricat; componentele existente continuă să funcționeze cu îmbunătățiri vizibile.

