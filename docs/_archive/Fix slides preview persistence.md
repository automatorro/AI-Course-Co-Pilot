# Fix REAL: Persistența Modificărilor din Slides Preview

## Problema Corectă (Acum Înțeleasă)

### Flux Actual (Incomplet)
```
1. AI generează → Editor (format uniform pentru toate slide-urile)
   Titlu / Bullets / Visual / Notes

2. Utilizator deschide Slides Preview
   - Vede slide-urile
   - Alege layout pentru fiecare slide
   - Adaptează textul manual pentru layout-ul ales
   
3. ❌ Modificările rămân doar în state-ul React
4. ❌ La export, citește din Editor (versiunea originală)
5. ❌ Layout-urile și textele adaptate se pierd
```

### Flux Corect (Ce Trebuie)
```
1. AI generează → Editor (format uniform)

2. Slides Preview
   - Utilizator alege layout
   - Utilizator adaptează text
   - ✅ SALVEAZĂ în DB cu metadata
   
3. ✅ Export citește metadata din DB
4. ✅ Folosește layout-ul ales + textul adaptat
```

---

## Unde Este Handler-ul de Salvare

Din documentul teoretic ai menționat:
> "Layout: CourseWorkspacePage.tsx:1949-2067"
> "Conținut adaptat: CourseWorkspacePage.tsx:2072-2203"

**Acestea EXISTĂ** dar probabil nu scriu metadata în formatul pe care parserul îl caută.

---

## Ce Trebuie Verificat în CourseWorkspacePage.tsx

### Verificare 1: Handler-ul de Layout

Găsește codul în jurul liniei 1949-2067. Ar trebui să arate cam așa:

```typescript
const handleLayoutChange = async (slideIndex: number, newLayout: SlideArchetype) => {
  // ... cod existent ...
  
  // VERIFICĂ: Se face update la course_steps.content?
  await supabase
    .from('course_steps')
    .update({ content: ??? }) // <- Ce se salvează aici?
    .eq('id', slidesStep.id);
};
```

**Întrebare Critică**: Ce se salvează în `content`? 

### Posibile Scenarii

#### Scenariu A: NU se salvează deloc
```typescript
// GREȘIT - doar update state local
setSlideModels(prev => /* modifică layout în memorie */);
// Lipsește: supabase.update()
```
→ **Soluție**: Adaugă update la DB

#### Scenariu B: Se salvează doar layout-ul, fără metadata
```typescript
// INCOMPLET - salvează layout dar fără marker pentru parser
await supabase
  .from('course_steps')
  .update({ 
    // Problemă: content rămâne neschimbat
    content: slidesStep.content // <- același conținut original
  });
```
→ **Soluție**: Injectează metadata în content

#### Scenariu C: Se salvează într-un câmp separat
```typescript
// GREȘIT - salvează în alt câmp decât `content`
await supabase
  .from('course_steps')
  .update({ 
    slides_metadata: { layout: newLayout } // <- Parser nu citește din slides_metadata
  });
```
→ **Soluție**: Parserul citește din `content`, deci metadata trebuie să fie acolo

---

## Soluția Definitivă

### Pas 1: Modifică Handler-ul de Layout

```typescript
const handleLayoutChange = async (slideIndex: number, newLayout: SlideArchetype) => {
  const slidesStep = course.steps?.find(s => 
    s.title_key === 'livrables.slides'
  );
  
  if (!slidesStep) return;

  try {
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'saving' }));
    
    // CRITICAL: Injectează metadata în content
    const updatedContent = injectLayoutMetadata(
      slidesStep.content,
      slideIndex,
      newLayout
    );
    
    // Salvează în DB
    const { error } = await supabase
      .from('course_steps')
      .update({ content: updatedContent })
      .eq('id', slidesStep.id);
    
    if (error) throw error;
    
    // Update state local
    setCourse(prev => ({
      ...prev,
      steps: prev.steps?.map(step => 
        step.id === slidesStep.id 
          ? { ...step, content: updatedContent }
          : step
      )
    }));
    
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'saved' }));
    showToast('Layout salvat', 'success');
    
  } catch (error) {
    console.error('[Layout] Save failed:', error);
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'error' }));
    showToast('Eroare la salvare', 'error');
  }
};
```

### Pas 2: Funcția de Injectare Metadata

```typescript
/**
 * Injectează metadata de layout în content
 * Găsește slide-ul cu index-ul specificat și adaugă marker
 */
const injectLayoutMetadata = (
  content: string,
  slideIndex: number,
  layout: SlideArchetype
): string => {
  const lines = content.split('\n');
  const result: string[] = [];
  
  let currentSlide = -1;
  let metadataInjected = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detectează începutul unui slide
    const isSlideStart = /^(Slide|幻灯片)\s*(\d+|nr\.?\s*\d+)/i.test(line.trim());
    
    if (isSlideStart) {
      currentSlide++;
      
      // Dacă e slide-ul nostru, adăugăm metadata
      if (currentSlide === slideIndex) {
        result.push(line); // Titlul slide-ului
        
        // Șterge metadata veche dacă există
        let j = i + 1;
        while (j < lines.length && lines[j].includes('slide-layout:')) {
          j++; // Skip old metadata
        }
        i = j - 1;
        
        // Injectează metadata nouă
        result.push(`<!-- slide-layout: ${layout} -->`);
        metadataInjected = true;
        continue;
      }
    }
    
    result.push(line);
  }
  
  if (!metadataInjected) {
    console.warn(`[Metadata] Could not inject for slide ${slideIndex}`);
  }
  
  return result.join('\n');
};
```

### Pas 3: Modifică Handler-ul pentru Conținut Adaptat

```typescript
const handleAdaptedContentChange = async (
  slideIndex: number,
  layout: SlideArchetype,
  newText: string
) => {
  const slidesStep = course.steps?.find(s => 
    s.title_key === 'livrables.slides'
  );
  
  if (!slidesStep) return;

  try {
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'saving' }));
    
    // CRITICAL: Injectează conținut adaptat în content
    const updatedContent = injectAdaptedContent(
      slidesStep.content,
      slideIndex,
      layout,
      newText
    );
    
    // Salvează în DB
    const { error } = await supabase
      .from('course_steps')
      .update({ content: updatedContent })
      .eq('id', slidesStep.id);
    
    if (error) throw error;
    
    // Update state local
    setCourse(prev => ({
      ...prev,
      steps: prev.steps?.map(step => 
        step.id === slidesStep.id 
          ? { ...step, content: updatedContent }
          : step
      )
    }));
    
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'saved' }));
    showToast('Conținut salvat', 'success');
    
  } catch (error) {
    console.error('[Adapted Content] Save failed:', error);
    setSlideStatusMap(prev => ({ ...prev, [slideIndex]: 'error' }));
    showToast('Eroare la salvare', 'error');
  }
};
```

### Pas 4: Funcția de Injectare Conținut Adaptat

```typescript
/**
 * Injectează conținutul adaptat pentru un layout specific
 */
const injectAdaptedContent = (
  content: string,
  slideIndex: number,
  layout: SlideArchetype,
  adaptedText: string
): string => {
  const lines = content.split('\n');
  const result: string[] = [];
  
  let currentSlide = -1;
  let injected = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detectează început slide
    const isSlideStart = /^(Slide|幻灯片)\s*(\d+|nr\.?\s*\d+)/i.test(line.trim());
    
    if (isSlideStart) {
      currentSlide++;
      
      if (currentSlide === slideIndex) {
        result.push(line); // Titlu
        
        // Șterge metadata veche
        let j = i + 1;
        while (j < lines.length && 
               (lines[j].includes('slide-layout:') || 
                lines[j].includes('slide-adapted:'))) {
          j++;
        }
        i = j - 1;
        
        // Injectează metadata nouă
        result.push(`<!-- slide-layout: ${layout} -->`);
        
        // Escape pipe în text
        const escapedText = adaptedText.replace(/\|/g, '\\|');
        result.push(`<!-- slide-adapted: ${layout} | ${escapedText} -->`);
        
        injected = true;
        continue;
      }
    }
    
    result.push(line);
  }
  
  if (!injected) {
    console.warn(`[Adapted] Could not inject for slide ${slideIndex}`);
  }
  
  return result.join('\n');
};
```

---

## Testare Completă

### Test 1: Schimbare Layout

1. Deschide Slides Preview
2. Schimbă layout-ul unui slide (ex: de la Explainer la ImageLeft)
3. Verifică în Network tab (F12) că se face request la Supabase
4. Verifică în DB:
   ```sql
   SELECT content FROM course_steps 
   WHERE title_key = 'livrables.slides' 
   LIMIT 1;
   ```
5. Caută în content linia: `<!-- slide-layout: ImageLeft -->`

### Test 2: Editare Conținut Adaptat

1. În Slides Preview, editează textul pentru un layout
2. Salvează
3. Verifică în DB că există: `<!-- slide-adapted: ImageLeft | textul tău -->`

### Test 3: Export PPTX

1. După modificări în Preview
2. Exportă PPTX
3. Deschide fișierul → slide-ul ar trebui să aibă layout-ul ales
4. Textul ar trebui să fie cel adaptat, nu cel original

---

## Diagnostic Rapid

Dacă nu funcționează, verifică:

### Verificare 1: Handler-ele Există?
```bash
# Caută în cod
grep -n "handleLayoutChange" src/pages/CourseWorkspacePage.tsx
grep -n "handleAdaptedContentChange" src/pages/CourseWorkspacePage.tsx
```

Dacă **NU EXISTĂ**, înseamnă că Slides Preview nu are logică de salvare.

### Verificare 2: Ce Face Handler-ul?
Pune `console.log` în handler:
```typescript
const handleLayoutChange = async (slideIndex, newLayout) => {
  console.log('[DEBUG] Layout change called:', { slideIndex, newLayout });
  console.log('[DEBUG] Current content:', slidesStep?.content);
  // ... rest of code ...
  console.log('[DEBUG] Updated content:', updatedContent);
};
```

### Verificare 3: Content-ul Se Schimbă?
După salvare în Preview, reîncarcă pagina. Dacă revii la layout-ul original, înseamnă că DB nu s-a updatat.

---

## Concluzie

**Problema reală** nu este formatul din editor (MD/HTML) - acesta e OK și uniform cum trebuie.

**Problema reală** este că **Slides Preview nu scrie modificările în DB**.

Soluția:
1. ✅ Adaugă funcții de injectare metadata în content
2. ✅ Modifică handler-ele să folosească aceste funcții
3. ✅ Salvează content-ul updatat în DB
4. ✅ Export-ul va citi metadata și va genera corect

**Next Step**: Verifică dacă handler-ele `handleLayoutChange` și `handleAdaptedContentChange` există în `CourseWorkspacePage.tsx` și ce fac exact.