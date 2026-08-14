## Starea Actuală
- Generare AI: `ImageStudioModal` folosește Pollinations fără cheie și inserează imagini prin upload în Storage: `src/components/ImageStudioModal.tsx:22-66`, `src/services/imageAiService.ts:8-22`, `src/services/imageService.ts:8-24`.
- Inserare directă: utilizatorul poate insera URL de imagine prin `handleSubmitImage` în `src/pages/CourseWorkspacePage.tsx:409-425`.
- Previzualizare și salvare funcționează (randare imediată, conversie `blob:` → URL public la salvare) în `src/components/MarkdownPreview.tsx:52-121` și `src/services/imageService.ts:27-49`.

## Propuneri pentru Generare AI
- Selector de provider: menține Pollinations (zero‑cheie) și adaugă opțiune pentru furnizori cu cheie (Replicate, OpenAI Images, Stability) prin Edge Function (chei protejate).
- Controluri UX:
  - Preset-uri de stil (flat, sketch, hand‑drawn, 3D), negativ prompt, seed pentru consistență, mărime (512/768/1024) și fundal transparent când e suportat.
  - Preview în timp real + upload în fundal în Storage (cu progres și fallback la `data:` dacă upload-ul eșuează).
- Persistență: inserează doar URL public din Storage pentru stabilitate și performanță; adaugă opțional subtitlu „Generat cu AI” sub imagine.
- Siguranță: filtrare conținut (safe-mode), mesaje clare de licențiere (atenționare că imaginile pot necesita verificare pentru uz comercial).

## Propuneri pentru Căutare și Inserare din Internet
- Nou „Image Search” modal cu:
  - Căutare textuală, filtre (orientare, culoare, tip, dimensiune), paging.
  - Surse cu licență clară: Unsplash, Pexels, Pixabay (prin Edge Function pentru chei).
  - Grid de rezultate cu preview, buton „Inserează”.
- Politică de persist: 2 opțiuni configurabile per proiect:
  - „Hotlink sigur”: inserează URL extern (rapid, fără cost de Storage), adaugă atribuție obligatorie (ex. „Photo by X on Unsplash”).
  - „Copie locală”: descarcă imaginea, încarcă în Supabase Storage cu `uploadBlobToStorage`, inserează URL public (recomandat pentru stabilitate). Metadate (sursă, autor) adăugate sub imagine.
- Implementare:
  - Edge Function `image-search` care apelează API-urile furnizorilor și normalizează răspunsul (URL, thumb, autor, licență), similar cu `generate-course-content` din `src/services/geminiService.ts`.
  - Serviciu client `imageSearchService.ts` care invocă `supabase.functions.invoke('image-search', { body })` și returnează rezultate pentru UI.
  - Inserare: fie URL extern, fie upload → URL din Storage prin `src/services/imageService.ts:8-24`.

## Pași de Implementare
- Extinde `ImageStudioModal` cu: provider selector, preset-uri, negative prompt, seed, progres upload; păstrează fallback la `data:`.
- Creează `ImageSearchModal` cu UI de căutare + grid rezultate + inserare (external/local copy); adaugă buton în toolbar (lângă „Image”). `src/pages/CourseWorkspacePage.tsx`.
- Adaugă Edge Function `image-search` (Node/TS) cu integrare API Unsplash/Pexels/Pixabay; gestionează rate limit și returnează un format unificat.
- Refactorizează uploadul din `handleInsertLocalImage` să folosească doar `uploadBlobToStorage` (consistență). `src/pages/CourseWorkspacePage.tsx:475-491`.
- Atribuție: la inserare, inserează o linie sub imagine cu link către sursă și autor.

## Testare & Validare
- Generare AI: diverse mărimi, stiluri, erori de rețea, fallback la `data:`; verifică că inserarea salvează URL public.
- Căutare web: căutare fără rezultate, paging, rate limit, selecție și inserare; validare licență/atributie.
- Persistență: reîncărcare pas curs → imaginile se afișează corect; niciun `blob:` sau `data:` în DB după salvare.

## Securitate & Licențiere
- Chei API doar în Edge Functions; niciodată în client.
- Filtrează MIME și dimensiuni; blochează conținut nepotrivit.
- Atribuție automată pentru surse care o cer; avertizare la utilizare comercială.

Confirmă dacă vrei să implementez generarea AI extinsă și căutarea/inserarea din internet; după confirmare, voi adăuga modalul de căutare, voi extinde studioul de imagini și voi conecta Edge Functions pentru surse externe.