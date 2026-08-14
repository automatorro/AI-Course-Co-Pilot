Voi corecta sintaxa XML din prompt-urile din `index.ts` pentru a elimina tag-ul redundant și incorect `</SLIDE_BEGIN>`. Structura corectă va rămâne perechea `<SLIDE_BEGIN id="..."> ... <SLIDE_END id="...">`.

### Modificări
1.  **Backend (`supabase/functions/generate-course-content/index.ts`)**:
    *   În variabilele `DEPTH_SPECS.slides` și `PROMPT_TEMPLATES.slide`, voi șterge linia `</SLIDE_BEGIN>` care apare eronat înainte de `<SLIDE_END ...>`.

### Verificare Parser
*   Voi verifica rapid și regex-ul din `src/services/exportService.ts` pentru a mă asigura că nu așteaptă explicit acest tag greșit (deși regex-ul scris anterior părea corect: `/<SLIDE_BEGIN ...>([\s\S]*?)<SLIDE_END ...>/`). Dacă parser-ul capturează totul până la `<SLIDE_END>`, eliminarea tag-ului greșit din prompt va face doar output-ul mai curat, fără a strica logica de parsare.

Aceasta este o corecție simplă de sintaxă a prompt-ului.
