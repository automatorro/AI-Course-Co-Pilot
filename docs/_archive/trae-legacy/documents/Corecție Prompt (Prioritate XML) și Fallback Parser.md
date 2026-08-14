Implementarea delimitatorilor XML va rezolva direct problema layout-urilor ignorate, deoarece formatul XML impus include explicit metadate de layout (`<!-- slide-layout: ... -->`) pe care parser-ul le va citi prioritar.

### Plan Actualizat

1.  **Backend (`index.ts`) - "The Enforcer":**
    *   Mut `DEPTH_SPECS.slides` la finalul promptului.
    *   Adaug instrucțiunea critică: "OUTPUT FORMAT MUST BE STRICTLY XML".
    *   **Nou:** Voi instrui explicit AI-ul să varieze layout-urile în tag-ul `<!-- slide-layout: ... -->`. Nu doar `EXPLAINER`, ci să aleagă dintre `IMAGE_LEFT`, `BIG_STAT`, `QUOTE` în funcție de conținut. Astfel, Preview-ul nu va mai fi monoton.

2.  **Frontend (`exportService.ts`) - "The Reader":**
    *   Verific și (dacă e cazul) ajustez parser-ul XML creat anterior pentru a fi sigur că extrage valoarea `slide-layout` din comentariul HTML aflat în interiorul blocului `<SLIDE_BEGIN>`. (Am scris deja logica asta, dar o voi reverifica pentru siguranță).

Odată aplicat acest plan, AI-ul va genera:
```xml
<SLIDE_BEGIN id="2">
  <TITLE>Barierele Comunicării</TITLE>
  <!-- slide-layout: IMAGE_RIGHT -->
  ...
```
Iar Preview-ul va afișa automat layout-ul "Image Right".
