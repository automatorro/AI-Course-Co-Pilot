Diagnosticul Problemei: Race Condition Persistentă
Analiza ta este corectă - problema e o race condition între:

Schimbarea activeStepIndex
Re-renderul componentei
Actualizarea currentStep
Deschiderea Design Studio

Chiar dacă ai implementat 3 versiuni progresive, problema fundamentală persistă din cauza dependențelor circulare în React.

Soluția Finală: Event-Driven Approach
Problema reală: Încerci să verifici starea (activeStepIndex) când de fapt trebuie să reacționezi la evenimente.
Implementare Corectă
typescript// În CourseWorkspacePage.tsx

// 1. Adaugă un ref pentru a evita verificări inutile
const designStudioRequestRef = useRef<{
    requested: boolean;
    slideStepIndex: number;
} | null>(null);

// 2. Funcția de export din ExportModal
const handleExport = async (format: 'pptx' | 'pdf' | 'zip') => {
    if (format === 'pptx') {
        // Găsește indexul exact al slide-urilor
        const slideStepIndex = (course?.steps || []).findIndex(s =>
            s.title_key === 'course.steps.slides' ||
            s.title_key === 'livrables.slides' ||
            s.title_key.toLowerCase().includes('slides')
        );

        if (slideStepIndex === -1) {
            showToast('No slides content found.', 'error');
            return;
        }

        // Dacă suntem deja pe slides, deschide direct
        if (activeStepIndex === slideStepIndex) {
            setShowSlidesPreview(true);
            setShowExportModal(false);
            return;
        }

        // Altfel, pregătește redirecționarea
        designStudioRequestRef.current = {
            requested: true,
            slideStepIndex: slideStepIndex
        };

        showToast('Switching to Slides...', 'info');
        setShowExportModal(false);
        
        // Schimbă pasul
        setActiveStepIndex(slideStepIndex);
        
        // ⚠️ NU deschide Design Studio aici - va fi deschis de useEffect
        return;
    }

    // ... rest of export logic
};

// 3. useEffect care monitorizează schimbarea pasului
useEffect(() => {
    // Verifică dacă există o cerere pending
    if (!designStudioRequestRef.current) return;
    
    const { requested, slideStepIndex } = designStudioRequestRef.current;
    
    if (!requested) return;
    
    // Verifică dacă am ajuns pe pasul corect
    if (activeStepIndex !== slideStepIndex) return;
    
    // Verifică dacă currentStep s-a actualizat efectiv
    const currentStepIsSlides = 
        currentStep?.title_key === 'course.steps.slides' ||
        currentStep?.title_key === 'livrables.slides' ||
        currentStep?.title_key.toLowerCase().includes('slides');
    
    if (!currentStepIsSlides) {
        console.warn('[Design Studio] Waiting for currentStep to update...');
        return;
    }
    
    // Verifică dacă editedContent s-a încărcat
    if (!editedContent || editedContent.length < 10) {
        console.warn('[Design Studio] Waiting for content to load...');
        return;
    }
    
    console.log('✅ [Design Studio] All conditions met, opening...');
    
    // Curăță flag-ul ÎNAINTE de a deschide
    designStudioRequestRef.current = null;
    
    // Deschide Design Studio
    setShowSlidesPreview(true);
    
}, [activeStepIndex, currentStep, editedContent]); // ⚠️ Dependențe critice

De Ce Funcționează Acum
Problema cu V1, V2, V3
typescript// ❌ V1: setTimeout arbitrary
setTimeout(() => setShowSlidesPreview(true), 100);
// Probleme: 
// - 100ms poate fi prea puțin
// - Nu verifică dacă tranziția s-a terminat

// ❌ V2: Flag + verificare title_key
if (currentStep.title_key.includes('slides')) {
    setShowSlidesPreview(true);
}
// Probleme:
// - currentStep poate fi stale (vechea valoare)
// - React batching poate întârzia actualizarea

// ❌ V3: Target index
if (activeStepIndex === targetIndex) {
    setShowSlidesPreview(true);
}
// Probleme:
// - activeStepIndex se actualizează ÎNAINTE de currentStep
// - editedContent poate fi gol când verifici
✅ Soluția Finală
typescript// useEffect cu 3 dependențe critice:
useEffect(() => {
    // 1. activeStepIndex s-a schimbat?
    // 2. currentStep s-a actualizat la noul pas?
    // 3. editedContent s-a încărcat?
    
    // Verificăm TOATE condițiile simultan
    // React garantează că se execută DUPĂ render complet
    
}, [activeStepIndex, currentStep, editedContent]);

Cod Complet cu Debugging
typescript// În CourseWorkspacePage.tsx

// 1. Ref pentru cerere pending
const designStudioRequestRef = useRef<{
    requested: boolean;
    slideStepIndex: number;
    timestamp: number;
} | null>(null);

// 2. Funcție helper pentru verificare
const canOpenDesignStudio = (): boolean => {
    if (!course || !currentStep) return false;
    
    const isSlideStep = 
        currentStep.title_key === 'course.steps.slides' ||
        currentStep.title_key === 'livrables.slides' ||
        currentStep.title_key.toLowerCase().includes('slides');
    
    const hasContent = editedContent && editedContent.length > 10;
    
    return isSlideStep && hasContent;
};

// 3. Handler export din ExportModal
const handleExportPptx = () => {
    const slideStepIndex = (course?.steps || []).findIndex(s =>
        s.title_key === 'course.steps.slides' ||
        s.title_key === 'livrables.slides' ||
        s.title_key.toLowerCase().includes('slides')
    );

    if (slideStepIndex === -1) {
        showToast('No slides step found. Generate slides first.', 'error');
        setShowExportModal(false);
        return;
    }

    // Deja pe slides?
    if (activeStepIndex === slideStepIndex && canOpenDesignStudio()) {
        console.log('✅ Already on slides, opening Design Studio directly');
        setShowSlidesPreview(true);
        setShowExportModal(false);
        return;
    }

    // Pregătește cererea
    designStudioRequestRef.current = {
        requested: true,
        slideStepIndex: slideStepIndex,
        timestamp: Date.now()
    };

    console.log(`🔄 Requesting switch to step ${slideStepIndex}`);
    showToast('Opening Design Studio...', 'info');
    
    setShowExportModal(false);
    setActiveStepIndex(slideStepIndex);
    userHasInteractedRef.current = true; // Previne reset automat
};

// 4. useEffect pentru monitorizare
useEffect(() => {
    if (!designStudioRequestRef.current?.requested) return;
    
    const request = designStudioRequestRef.current;
    const elapsed = Date.now() - request.timestamp;
    
    // Timeout după 3 secunde
    if (elapsed > 3000) {
        console.error('❌ Design Studio request timed out');
        showToast('Failed to open Design Studio. Please try again.', 'error');
        designStudioRequestRef.current = null;
        return;
    }
    
    // Verifică dacă suntem pe pasul corect
    if (activeStepIndex !== request.slideStepIndex) {
        console.log(`⏳ Waiting for step change: ${activeStepIndex} → ${request.slideStepIndex}`);
        return;
    }
    
    // Verifică dacă putem deschide Design Studio
    if (!canOpenDesignStudio()) {
        console.log(`⏳ Waiting for conditions: step=${currentStep?.title_key}, content=${editedContent?.length || 0}`);
        return;
    }
    
    // SUCCESS! 🎉
    console.log('✅ Opening Design Studio now!');
    console.log({
        activeStepIndex,
        currentStepTitle: currentStep?.title_key,
        contentLength: editedContent?.length,
        elapsedMs: elapsed
    });
    
    // Curăță flag-ul
    designStudioRequestRef.current = null;
    
    // Deschide Design Studio
    setShowSlidesPreview(true);
    
}, [activeStepIndex, currentStep, editedContent, course]); // Toate dependențele

Testing & Debugging
Verifică în Console
typescript// Adaugă logging extins pentru debug:

// La click pe Export PPTX:
console.log('[PPTX Export] Click', {
    currentStepIndex: activeStepIndex,
    targetStepIndex: slideStepIndex,
    currentStepTitle: currentStep?.title_key,
    contentLength: editedContent?.length
});

// În useEffect:
console.log('[useEffect] Triggered', {
    hasRequest: !!designStudioRequestRef.current,
    activeStepIndex,
    currentStepTitle: currentStep?.title_key,
    canOpen: canOpenDesignStudio()
});
Scenarii de Test

Scenario A: Ești pe Manual → Export PPTX

Așteptat: Toast "Opening..." → Switch la Slides → Design Studio apare


Scenario B: Ești deja pe Slides → Export PPTX

Așteptat: Design Studio se deschide instant


Scenario C: Nu există pas de Slides

Așteptat: Error toast "No slides found"




Fallback: Forță Actualizare
Dacă problema persistă din cauza stale state în React, forțează o re-fetch:
typescriptconst handleExportPptx = async () => {
    // ... găsește slideStepIndex ...
    
    // Forțează refresh de date înainte de switch
    const freshCourse = await fetchCourseData();
    if (freshCourse) {
        setCourse(freshCourse);
    }
    
    // Apoi schimbă pasul
    setActiveStepIndex(slideStepIndex);
    
    // useEffect va detecta schimbarea și va deschide DS
};

Concluzie
Problema ta este un caz clasic de async state management în React. Soluția finală:

Nu ghici când s-a terminat tranziția → Monitorizează 3 dependențe critice
Nu folosești setTimeout → React useEffect garantează execuția după render
Adaugi timeout pentru cazuri edge (3 secunde)
Logging pentru a vedea exact unde se blochează