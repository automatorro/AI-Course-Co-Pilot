## Obiectiv
- Mențin modalul Slides Preview deschis după „Salvează text” și după alegerea layout-ului.
- Afișez instant în Preview că modificările s-au aplicat, fără a obliga utilizatorul să revină din nou în Preview.
- Clarific ordinea recomandată: întâi alegi layout-ul, apoi scrii „Conținut adaptat (opțional)”.

## Comportament Dorit
- „Alege Layout” aplică imediat layout-ul ales pe tile-ul curent; modalul rămâne deschis.
- „Salvează text” scrie meta „slide-adapted: LAYOUT | TEXT” pentru layout-ul activ; modalul rămâne deschis și re-render.
- Toate feedback-urile (OK/Error) apar în contextul tile-ului, nu în toaster global (toaster rămâne, dar nu închide modalul).

## Modificări UX în Slides Preview
- Actualizare optimistă: după selectarea layout-ului sau salvarea textului, modelul local se actualizează și re-renderizează slide-ul imediat.
- Indicatori vizuali:
  - Badges „Salvat” (verde) când operația reușește; „Eroare” (galben/roșu) dacă nu s-a putut localiza slide-ul.
  - Badge „Adaptări latente” dacă există conținut adaptat pentru alte layout-uri ale aceluiași slide.
  - Chip cu layout activ lângă titlu (ex.: „Image Left”).
- CTA-uri:
  - „Alege Layout” rămâne un drop-in selector; nu închide zona; arată imediat noul layout.
  - „Salvează text” rămâne buton explicit; în timpul salvării arată spinner și disable pentru a evita double-click.
- Ghidaj în UI:
  - Un hint subtil deasupra gridului: „Recomandare: selectează layout-ul înainte de a scrie conținutul adaptat. Adaptările sunt specifice layout-ului.”
  - Tooltip pe câmpul „Conținut adaptat”: „Se aplică doar layout-ului activ. Dacă schimbi layout-ul, acest text devine latent.”

## Ordinea de Lucru Clară
- Recomandare: 1) Alege layout-ul, 2) Scrie „Conținut adaptat”, 3) Verifică vizual, 4) Exportă.
- Dacă schimbi layout-ul ulterior:
  - Adaptarea pentru layout-ul anterior rămâne salvată (latentă); o badge „Adaptări latente (n)” indică existența lor.
  - Poți reveni la layoutul anterior și vezi imediat textul salvat pentru acel layout.

## Persistență (fără migrații majore)
- Scriere deterministă în Markdown cu meta:
  - „<!-- slide-layout: TYPE -->”
  - „<!-- slide-adapted: TYPE | TEXT -->”
- Identificarea slide-ului se face index-first, cu fallback pe titlu; căutare meta în primele 6 linii după startul slide-ului.
- Preview și Export consumă același model; nu există inferențe sau conversii automate.

## Failure Rules & Edge Cases
- Dacă nu se poate localiza slide-ul: nu închidem modalul; afișăm badge „Eroare la salvare” pe tile și păstrăm editarea.
- Dacă imaginea nu poate fi obținută la export: se afişează placeholder; exportul continuă.
- Slide valid: are un titlu și un layout; conținutul adaptat este opțional și specific layout-ului.

## Validare
- Test manual: selectare layout → preview instant; salvare „Conținut adaptat” → preview instant; schimbare layout → badge „Adaptări latente”.
- Test end-to-end: ceea ce vezi în Preview corespunde fidel în PPTX.

## Implementare Incrementală
- Faza 1: Actualizare optimistă + menținere modal deschis; badges „Salvat/Eroare”.
- Faza 2: Badge „Adaptări latente” și hint-uri UX despre ordinea recomandată.
- Faza 3: Mic summary bar: „Slide-uri cu layout ales: X; cu conținut adaptat: Y; erori: Z”.
