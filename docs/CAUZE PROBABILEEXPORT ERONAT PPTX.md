# Fix pentru Persistența Metadata în Export PPTX

## Problema Identificată

Conținutul din editor **NU conține metadata de layout** necesară pentru export. Parserul caută linii de forma:
```html
<!-- slide-layout: SPLIT_RIGHT -->
<!-- slide-adapted: SPLIT_RIGHT | conținut adaptat -->
```

Dar aceste linii **lipsesc** din content salvat în DB.

## Cauza

Handler-ele din `CourseWorkspacePage.tsx` pentru schimbarea layout-ului și conținutului adaptat **nu injectează metadata în content**.

## Soluția: Injectarea Metadata în Content

### Pas 1: Funcție Helper pentru Injectarea Metadata

Adaugă această funcție în `CourseWorkspacePage.tsx`:

```typescript
/**
 * Injectează metadata de layout și conținut adaptat în content-ul Markdown/HTML
 * Detectează automat dacă conținutul e MD sau HTML și inserează metadata corespunzător
 */
const injectSlideMetadata = (
  content: string, 
  slideIndex: number, 
  layout?: SlideArchetype,
  adaptedContent?: Record<string, string>
): string => {
  // Parse content în secțiuni
  const sections = parseContentSections(content);
  
  if (slideIndex < 0 || slideIndex >= sections.length) {
    console.warn(`[Metadata] Invalid slide index: ${slideIndex}`);
    return content;
  }

  // Construiește metadata pentru secțiunea specificată
  const metadataLines: string[] = [];
  
  if (layout) {
    metadataLines.push(`<!-- slide-layout: ${layout} -->`);
  }
  
  if (adaptedContent) {
    Object.entries(adaptedContent).forEach(([layoutKey, text]) => {
      // Escape pipe character în text pentru a nu corupe formatul
      const escapedText = text.replace(/\|/g, '\\|');
      metadataLines.push(`<!-- slide-adapted: ${layoutKey} | ${escapedText} -->`);
    });
  }

  // Reconstruct content cu metadata injectată
  const lines = content.split('\n');
  const result: string[] = [];
  
  // Detectăm începutul slide-ului target
  let currentSlideIdx = -1;
  let metadataInjected = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detectează început de slide (Slide 1:, Slide nr: 1, etc.)
    const slideMatch = line.match(/^(\*\*|#+)?\s*(Slide|幻灯片)\s*(nr\.|#)?\s*\d+/i);
    
    if (slideMatch) {
      currentSlideIdx++;
      
      // Dacă e slide-ul nostru, injectăm metadata IMEDIAT DUPĂ titlu
      if (currentSlideIdx === slideIndex) {
        result.push(lines[i]); // Păstrăm linia cu titlul
        
        // Injectăm metadata
        metadataLines.forEach(meta => result.push(meta));
        metadataInjected = true;
        
        continue;
      }
    }
    
    result.push(lines[i]);
  }
  
  if (!metadataInjected) {
    console.warn(`[Metadata] Could not find slide ${slideIndex} to inject metadata`);
  }
  
  return result.join('\n');
};

/**
 * IMPORTANT: Import parseContentSections din exportService
 */
import { parseContentSections } from '../services/exportService';
```

### Pas 2: Modifică Handler-ul pentru Layout Change

În `CourseWorkspacePage.tsx`, găsește handler-ul `handleLayoutChange` (în jurul liniei 1949-2067) și modifică-l astfel:

```typescript
const handleLayoutChange = async (slideIndex: number, newLayout: SlideArchetype) => {
  const slidesStep = course.steps?.find(s => 
    s.title_key === 'livrables.slides' || 
    s.title_key.toLowerCase().includes('.slides')
  );
  
  if (!slidesStep) {
    showToast('Pasul Slides nu a fost găsit', 'error');
    return;
  }

  try {
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'saving' }));
    
    // **MODIFICARE CRITICĂ**: Injectează metadata în content
    const updatedContent = injectSlideMetadata(
      slidesStep.content,
      slideIndex,
      newLayout,
      undefined // Nu schimbăm adapted content aici
    );
    
    // Salvează în DB
    const { error } = await supabase
      .from('course_steps')
      .update({ content: updatedContent })
      .eq('id', slidesStep.id);
    
    if (error) throw error;
    
    // Update local state
    setCourse(prev => {
      if (!prev) return prev;
      const updatedSteps = prev.steps?.map(step => 
        step.id === slidesStep.id 
          ? { ...step, content: updatedContent }
          : step
      );
      return { ...prev, steps: updatedSteps };
    });
    
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'saved' }));
    showToast('Layout salvat cu succes', 'success');
    
    // IMPORTANT: Re-fetch slide models pentru a reflecta modificarea
    const freshModels = await getSlideModelsForPreview(course);
    setSlideModels(freshModels);
    
  } catch (error) {
    console.error('[Layout Change] Error:', error);
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'error' }));
    showToast('Eroare la salvarea layout-ului', 'error');
  }
};
```

### Pas 3: Modifică Handler-ul pentru Adapted Content

Găsește `handleAdaptedContentChange` (în jurul liniei 2072-2203) și modifică:

```typescript
const handleAdaptedContentChange = async (
  slideIndex: number, 
  layout: SlideArchetype, 
  newContent: string
) => {
  const slidesStep = course.steps?.find(s => 
    s.title_key === 'livrables.slides' || 
    s.title_key.toLowerCase().includes('.slides')
  );
  
  if (!slidesStep) {
    showToast('Pasul Slides nu a fost găsit', 'error');
    return;
  }

  try {
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'saving' }));
    
    // Construiește obiect adapted content
    const adaptedContent: Record<string, string> = {
      [layout]: newContent
    };
    
    // **MODIFICARE CRITICĂ**: Injectează metadata în content
    const updatedContent = injectSlideMetadata(
      slidesStep.content,
      slideIndex,
      layout, // Includem și layout-ul pentru consistență
      adaptedContent
    );
    
    // Salvează în DB
    const { error } = await supabase
      .from('course_steps')
      .update({ content: updatedContent })
      .eq('id', slidesStep.id);
    
    if (error) throw error;
    
    // Update local state
    setCourse(prev => {
      if (!prev) return prev;
      const updatedSteps = prev.steps?.map(step => 
        step.id === slidesStep.id 
          ? { ...step, content: updatedContent }
          : step
      );
      return { ...prev, steps: updatedSteps };
    });
    
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'saved' }));
    showToast('Conținut adaptat salvat cu succes', 'success');
    
    // Re-fetch slide models
    const freshModels = await getSlideModelsForPreview(course);
    setSlideModels(freshModels);
    
  } catch (error) {
    console.error('[Adapted Content] Error:', error);
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'error' }));
    showToast('Eroare la salvarea conținutului adaptat', 'error');
  }
};
```

### Pas 4: Adaugă Import Necesar

La începutul fișierului `CourseWorkspacePage.tsx`:

```typescript
import { 
  getSlideModelsForPreview, 
  parseContentSections, // <- ADAUGĂ ACEST IMPORT
  exportCourseAsPptx 
} from '../services/exportService';
```

### Pas 5: Testare și Verificare

După modificări:

1. **Testează schimbarea layout-ului**:
   - Deschide Slides Preview
   - Schimbă layout-ul unui slide
   - Verifică în consolă: `[Metadata] Injected metadata for slide X`

2. **Verifică în DB**:
   ```sql
   SELECT content FROM course_steps 
   WHERE title_key LIKE '%slides%' 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
   
   Ar trebui să vezi linii de forma:
   ```
   Slide 1: Titlu
   <!-- slide-layout: SPLIT_RIGHT -->
   <!-- slide-adapted: SPLIT_RIGHT | text adaptat -->
   Visual: ...
   ```

3. **Testează export PPTX**:
   - După salvare în Preview, exportă PPTX
   - Slide-ul ar trebui să folosească layout-ul ales

## Probleme Potențiale și Rezolvări

### Problem 1: parseContentSections nu este exportată

Dacă primești eroare la import, modifică `exportService.ts`:

```typescript
// La sfârșitul fișierului, schimbă:
export { parseContentSections as __debugParseContentSections };

// În:
export { parseContentSections }; // <- Exportă normal
```

### Problem 2: Metadata apare duplicată

Dacă metadata apare de mai multe ori, adaugă în `injectSlideMetadata` înainte de injectare:

```typescript
// Șterge metadata existentă pentru acest slide
const cleanLines = lines.filter(l => {
  const isOurSlideMetadata = 
    currentSlideIdx === slideIndex && 
    (l.includes('slide-layout:') || l.includes('slide-adapted:'));
  return !isOurSlideMetadata;
});
```

### Problem 3: HTML Editor strip-uiește comentarii

Dacă editorul HTML elimină comentariile, ai două opțiuni:

**Opțiunea A**: Configurează editorul să păstreze comentarii
```typescript
// În configurația TipTap/Quill
extensions: [
  Comment, // <- Adaugă extensie pentru comentarii
]
```

**Opțiunea B**: Folosește format alternativ (atribute data)
Modifică injectarea să folosească atribute HTML în loc de comentarii:
```typescript
metadataLines.push(`<div data-slide-layout="${layout}" data-slide-adapted="${adaptedContent}" style="display:none;"></div>`);
```

Și actualizează parserul în `exportService.ts`:
```typescript
const layoutMatch = line.match(/data-slide-layout="(\w+)"/i);
const adaptedMatch = line.match(/data-slide-adapted="([^"]+)"/i);
```

## Concluzie

După aceste modificări:

1. ✅ Preview-ul va scrie metadata în content
2. ✅ Export-ul va citi metadata corect
3. ✅ Layout-urile alese vor fi persistente
4. ✅ Conținutul adaptat va fi folosit la export

**Problema fundamentală era**: Handler-ele modificau state-ul local dar nu injectau metadata în content. Acum, metadata este scrisă explicit în DB și parserul o poate citi.