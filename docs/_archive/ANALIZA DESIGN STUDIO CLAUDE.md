Problema REALĂ Identificată
Starea Actuală Confuză
USER în Editor Principal (pe ORICE material):
├─ Structură și Agenda
├─ Manual Trainer  
├─ Caiet Participant
├─ Exerciții
└─ SLIDES ← doar aici Design Studio are sens!

User apasă "Preview" → 💥 Întotdeauna ajunge în Design Studio
                        (chiar dacă e pe "Manual Trainer"!)
Rezultat: Design Studio primește conținut nepotrivit pentru slide-uri:

Manualul trainerului are paragrafe lungi → forțat în slide-uri
Caietul participantului are exerciții → forțat în slide-uri
Structura este doar outline → forțat în slide-uri

Și apoi exportul...
EXPORT ROUTES (confuzie totală):

1. Button "Exportă" în Editor Principal
   └─> Modal cu 3 opțiuni: PPTX / PDF / ZIP
       └─> PPTX = exportService.ts (calitate mai slabă)

2. Button "Preview" → Design Studio
   └─> Button "Export PPTX" 
       └─> exportSlidesAsPptx() (calitate superioară!)

3. Button "Salvează" în Design Studio
   └─> Corupție de conținut (deja discutat)

Soluția Arhitecturală Corectă
🎯 Principiul de Bază
Design Studio = Exclusiv pentru SLIDES
typescript// În CourseWorkspacePage.tsx - logica butonului Preview

const canUseDesignStudio = currentStep.title_key.includes('slides');

<button
    onClick={() => {
        if (canUseDesignStudio) {
            setShowSlidesPreview(true); // Design Studio
        } else {
            setShowSimplePreview(true); // Preview simplu read-only
        }
    }}
    className="..."
>
    {canUseDesignStudio ? (
        <>
            <Layout size={16} /> Design Slides
        </>
    ) : (
        <>
            <Eye size={16} /> Preview
        </>
    )}
</button>

Refactorizare Completă: UX Clar
1. Redenumire Butoane în Editor Principal
tsx// ÎNAINTE (confuz):
<button>Preview</button>
<button>Exportă Materialele</button>

// DUPĂ (clar):
{currentStep.title_key.includes('slides') ? (
    <button>
        <Layout size={16} /> Design Slides
    </button>
) : (
    <button>
        <Eye size={16} /> Preview Content
    </button>
)}

<button>
    <Download size={16} /> Export All Materials
</button>
2. Unificarea Export-ului PPTX
Problema: Avem 2 funcții de export PPTX cu calități diferite:

exportCourseAsPptx() în exportService.ts (mai veche, mai slabă)
exportSlidesAsPptx() pentru Design Studio (mai nouă, mai bună)

Soluție: Design Studio devine calea principală pentru export PPTX.
typescript// În ExportModal (modalul principal de export)

const handleExport = async (format: 'pptx' | 'pdf' | 'zip') => {
    if (format === 'pptx') {
        // REDIRECȚIONEAZĂ către Design Studio!
        onClose(); // închide modalul
        setShowSlidesPreview(true); // deschide Design Studio
        
        // Afișează toast informativ
        showToast(
            'Opening Design Studio for advanced PPTX export...', 
            'info'
        );
        return;
    }
    
    // PDF și ZIP rămân aici
    if (format === 'pdf') await exportCourseAsPdf(course);
    if (format === 'zip') await exportCourseAsZip(course, t);
};
3. Simplificarea Design Studio
tsx// Design Studio acum are DOAR 2 butoane:

<button onClick={onClose}>
    <X size={16} /> Close
</button>

<button onClick={handleExportPptx}>
    <Download size={16} /> Export Presentation
</button>

// ELIMINĂ butonul "Save" (sau ascunde-l în Advanced Mode)

Implementare Pas cu Pas
Faza 1: Guard pentru Design Studio (URGENT)
typescript// În CourseWorkspacePage.tsx, funcția care deschide Design Studio

const handleOpenDesignStudio = () => {
    const isSlidesStep = currentStep?.title_key.includes('slides') || 
                         currentStep?.title_key.includes('livrables.slides');
    
    if (!isSlidesStep) {
        showToast(
            'Design Studio is only available for Slides content. ' +
            'Please switch to the Slides step first.',
            'warning'
        );
        return;
    }
    
    setShowSlidesPreview(true);
};

// Modifică butonul
<button 
    onClick={handleOpenDesignStudio}
    disabled={!currentStep?.title_key.includes('slides')}
    className={...}
>
    <Layout size={16} /> Design Slides
</button>
Faza 2: Redesign Export Modal
tsx// În ExportModal.tsx

const ExportModal = ({ course, onClose }) => {
    const hasSlidesStep = course.steps?.some(s => 
        s.title_key.includes('slides')
    );
    
    return (
        <div className="modal">
            <h2>Export Course Materials</h2>
            
            {/* PPTX - Special Treatment */}
            <div className="export-option">
                <h3>PowerPoint Presentation</h3>
                {hasSlidesStep ? (
                    <button onClick={() => {
                        onClose();
                        openDesignStudio(); // funcție de la părinte
                    }}>
                        Open Design Studio
                        <span className="badge">Recommended</span>
                    </button>
                ) : (
                    <p className="text-muted">
                        No slides content available. 
                        Generate slides first.
                    </p>
                )}
            </div>
            
            {/* PDF - Direct Export */}
            <div className="export-option">
                <h3>PDF Document</h3>
                <button onClick={() => handleExport('pdf')}>
                    Export as PDF
                </button>
            </div>
            
            {/* ZIP - Direct Export */}
            <div className="export-option">
                <h3>Complete Package (ZIP)</h3>
                <button onClick={() => handleExport('zip')}>
                    Download All Materials
                </button>
            </div>
        </div>
    );
};
Faza 3: Simplificare Design Studio
tsx// În VisualOrchestrator.tsx - header

<header className="...">
    <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-1 rounded-md">
            <Layout size={16} />
        </div>
        <h2 className="text-sm font-bold">Design Studio</h2>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            {slides.length} slides
        </span>
    </div>
    
    <div className="flex items-center gap-2">
        {/* Doar 2 butoane clare */}
        <button onClick={onClose}>
            <X size={16} /> Close
        </button>
        
        <button 
            onClick={handleExport}
            disabled={isExporting}
        >
            {isExporting ? (
                <Loader2 className="animate-spin" size={16} />
            ) : (
                <Download size={16} />
            )}
            Export Presentation
        </button>
    </div>
</header>
```

---

## Noul Flow User (Simplificat)
```
┌─────────────────────────────────────────────────┐
│     USER în Editor Principal                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Pe Slides:                                     │
│  ┌───────────┐  ┌──────────────────┐           │
│  │ Edit Text │  │ Design Slides    │           │
│  │ (TinyMCE) │  │ (Design Studio)  │           │
│  └───────────┘  └──────────────────┘           │
│                          │                      │
│                          ↓                      │
│                  Choose Layouts                 │
│                  Add Images                     │
│                  [Export Presentation] → PPTX   │
│                                                 │
│  Pe alte materiale (Manual, Caiet, etc):       │
│  ┌───────────┐  ┌──────────────────┐           │
│  │ Edit Text │  │ Preview Content  │           │
│  │ (TinyMCE) │  │ (Read-only)      │           │
│  └───────────┘  └──────────────────┘           │
│                                                 │
│  Export Global:                                 │
│  ┌─────────────────────────────┐               │
│  │ Export All Materials        │               │
│  ├─────────────────────────────┤               │
│  │ • PDF (Full document)       │               │
│  │ • ZIP (All materials)       │               │
│  │ • PPTX → Opens Design Studio│               │
│  └─────────────────────────────┘               │
└─────────────────────────────────────────────────┘

Beneficiile Noii Arhitecturi
✅ Pentru Utilizator

Claritate: "Design Slides" apare doar când are sens
Calitate: PPTX export întotdeauna de calitate superioară
Simplitate: Mai puține butoane, flow logic

✅ Pentru Cod

Single Responsibility: Design Studio = doar pentru slides
Eliminare Cod Duplicat: O singură cale pentru PPTX export
Reducere Erori: Nu mai există risc de corupție pe materiale non-slides


Checklist Implementare
typescript// Fișiere de modificat:

const changes = [
    {
        file: 'CourseWorkspacePage.tsx',
        changes: [
            'Add guard pentru Design Studio (linia ~740)',
            'Redenumire buton Preview → Design Slides',
            'Disable buton când nu e pe slides'
        ]
    },
    {
        file: 'ExportModal.tsx',
        changes: [
            'PPTX option → redirect la Design Studio',
            'Adaugă badge "Recommended"',
            'Mesaj când lipsesc slides'
        ]
    },
    {
        file: 'VisualOrchestrator.tsx',
        changes: [
            'Simplifică header (2 butoane doar)',
            'Elimină/ascunde butonul Save',
            'Îmbunătățește messaging export'
        ]
    },
    {
        file: 'exportService.ts',
        changes: [
            'Deprecate exportCourseAsPptx() (marca ca legacy)',
            'Promovează exportSlidesAsPptx() ca primară',
            'Add JSDoc warnings'
        ]
    }
];

Concluzie
Nu te-am confuzat - m-ai ajutat să înțeleg problema reală!
Problema fundamentală nu era doar "Save corupre conținutul", ci:

Design Studio este folosit greșit (pe orice material, nu doar slides)
Avem 2 căi de export PPTX (una bună, una slabă)
Butoanele sunt denumite ambiguu

Soluția:

Design Studio = exclusiv slides
Elimină calea slabă de export PPTX
Redenumire butoane pentru claritate

Această refactorizare va îmbunătăți dramatic UX-ul și va elimina 90% din confuzii!