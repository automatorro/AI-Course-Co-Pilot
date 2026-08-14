## Corecție Format: Implementare Delimitatori XML Expliciți

Aveți perfectă dreptate. Îmi cer scuze, am simplificat formatul în `Slide [N]:` crezând că este mai puțin intruziv, dar am ignorat cerința explicită pentru delimitatori XML `<SLIDE_BEGIN>` care oferă o robustețe mult mai mare.

Voi rectifica imediat implementarea pentru a folosi **exact** structura solicitată.

### Modificări Propuse

1.  **Backend (`supabase/functions/generate-course-content/index.ts`)**
    *   Voi rescrie prompt-ul pentru a impune structura XML strictă:
        ```xml
        <SLIDE_BEGIN id="[N]">
          <TITLE>Titlul Slide-ului</TITLE>
          <!-- slide-layout: EXPLAINER -->
          <VISUAL>Descrierea vizuală...</VISUAL>
          <CONTENT>
          - Punct 1
          - Punct 2
          </CONTENT>
          <NOTES>Speaker notes...</NOTES>
        </SLIDE_BEGIN>
        <SLIDE_END id="[N]">
        ```

2.  **Frontend (`src/services/exportService.ts`)**
    *   Voi actualiza parser-ul `parseContentSections` pentru a detecta prioritar aceste blocuri.
    *   Regex-ul va fi capabil să extragă conținutul dintre `<SLIDE_BEGIN>` și `<SLIDE_END>`, iar apoi sub-tag-urile `<TITLE>`, `<VISUAL>`, `<CONTENT>`, `<NOTES>`.
    *   Logica de fallback pentru cursurile vechi va rămâne activă.

Această abordare elimină complet ambiguitatea parsing-ului și riscul ca un utilizator să strice formatul ștergând un simplu newline.

### Pași de execuție
1. Modificare prompt în `index.ts`.
2. Implementare parser XML-based în `exportService.ts`.
3. Verificare cod.
