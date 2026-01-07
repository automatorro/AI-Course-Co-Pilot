import React, { useEffect, useMemo, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Wand2, LayoutTemplate, ChevronDown, Info } from 'lucide-react';
import { Course, SlideModel, SlideArchetype } from '../types';
import { getSlideModelsForPreview, getTemplateRules, validateSlide, getPedagogicWarnings } from '../services/exportService';
import SlideLayoutSelector from './SlideLayoutSelector';

type Props = { 
  isOpen: boolean; 
  onClose: () => void; 
  course: Course; 
  onApplySuggestion?: (s: string, targetTitle?: string) => void;
  onUpdateSlideLayout?: (slideTitle: string, newLayout: SlideArchetype, slideIndex?: number) => void;
  onUpdateSlideAdapted?: (slideTitle: string, adaptedText: string, slideIndex?: number) => void;
};

type TileProps = {
  m: SlideModel;
  status: 'idle' | 'saving' | 'saved' | 'error';
  onLayoutUpdate: (slideTitle: string, newLayout: SlideArchetype, slideIndex?: number) => void;
  onAdaptedUpdate: (slideTitle: string, newLayout: SlideArchetype, adaptedText: string, slideIndex?: number, slideId: string) => void;
  onApplySuggestion?: (s: string, targetTitle?: string) => void;
};

const Tile: React.FC<TileProps> = ({ m, status, onLayoutUpdate, onAdaptedUpdate, onApplySuggestion }) => {
  const bulletsText = (m.bullets || []).join('\n');
  const warns = getPedagogicWarnings(m);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [adaptedInput, setAdaptedInput] = useState('');
  const tileStatus = status;
  const latentCount = Object.keys(m.adaptedContent || {}).filter(k => k !== m.slide_type).length;

  // Initialize adaptedInput from model
  useEffect(() => {
      if (m.adaptedContent && m.adaptedContent[m.slide_type]) {
          setAdaptedInput(m.adaptedContent[m.slide_type]);
      } else {
          setAdaptedInput('');
      }
  }, [m.slide_type, m.adaptedContent]);

  const renderWarn = (w: string, i: number) => {
    const isCritical = w.startsWith('[CRITICAL]');
    const isWarn = w.startsWith('[WARN]');
    const text = w.replace(/^\[(CRITICAL|WARN|INFO)\]\s*/, '');
    const cls = isCritical
      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
      : isWarn
        ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
        : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
    const Icon = isCritical ? AlertTriangle : isWarn ? AlertTriangle : CheckCircle;
    return (
      <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] mr-2 mb-2 ${cls}`}>
        <Icon size={12} /> {text}
      </span>
    );
  };

  const localSuggestions = (() => {
    const set = new Set<string>();
    warns.forEach(w => {
      if (w.includes('Studiu de caz fără structură')) set.add('Adaugă context, problemă, soluție, rezultat');
      if (w.includes('evaluare')) set.add('Adaugă concluzii sau criterii de evaluare');
      if (w.includes('Nivel Bloom prea scăzut')) set.add('Adaugă verbe de aplicare: aplică, utilizează, implementează');
      if (w.includes('Lipsește imaginea')) set.add('Inserează o imagine relevantă în Image+Text');
    });
    return Array.from(set);
  })();

  return (
    <div className="rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-200">
      <div className="px-4 py-2 text-xs bg-gray-50 dark:bg-gray-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {m.slide_type.replace('_', ' ')}
           </span>
           {latentCount > 0 && (
             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
               Adaptări latente: {latentCount}
             </span>
           )}
           {tileStatus === 'saved' && (
             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
               <CheckCircle size={12}/> Salvat
             </span>
           )}
           {tileStatus === 'error' && (
             <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
               <AlertTriangle size={12}/> Eroare la salvare
             </span>
           )}
           <button 
             type="button"
              onClick={() => setShowLayoutSelector(!showLayoutSelector)}
              className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                  showLayoutSelector 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
           >
             <LayoutTemplate size={12}/> {m.slide_type.replace('_', ' ')} <ChevronDown size={12} className={`transition-transform ${showLayoutSelector ? 'rotate-180' : ''}`}/>
           </button>
        </div>

        {validateSlide(m, getTemplateRules(m.slide_type)) ? (
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle size={14}/> OK</span>
        ) : (
          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400"><AlertTriangle size={14}/> Needs fix</span>
        )}
      </div>

      {showLayoutSelector && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/20 border-b dark:border-gray-700 animate-fade-in-down">
          <div className="flex gap-6">
              <div className="w-1/3 border-r dark:border-gray-700 pr-4">
                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Alege Structura Vizuală:</p>
                  <SlideLayoutSelector 
                     currentType={m.slide_type} 
                     onSelect={(t) => {
                        onLayoutUpdate(m.title || '', t, m.originalIndex);
                     }}
                  />
              </div>
              <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1">
                          Personalizare Conținut 
                          <span className="text-gray-400 font-normal normal-case" title="Textul introdus aici va înlocui conținutul implicit pentru acest layout.">
                              <Info size={10}/>
                          </span>
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                              onAdaptedUpdate(m.title || '', m.slide_type, adaptedInput.trim(), m.originalIndex, m.id);
                          }}
                          className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        >
                          Salvează Modificări
                        </button>
                      </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="space-y-1">
                          <label className="text-[11px] font-medium text-gray-600 dark:text-gray-400">Conținut Slide (Bullets/Paragrafe)</label>
                          <textarea
                              value={adaptedInput}
                              onChange={(e) => setAdaptedInput(e.target.value)}
                              placeholder="Introduceți textul aici. Liniile noi vor fi tratate ca bullets."
                              className="w-full text-xs rounded border dark:border-gray-700 bg-white dark:bg-gray-800 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              rows={6}
                          />
                      </div>
                  </div>
              </div>
          </div>
        </div>
      )}

      <div className="p-4 min-h-[150px] flex flex-col justify-center">
        {/* Simple Preview */}
        <h3 className="text-sm font-bold text-center mb-2">{m.title}</h3>
        <div className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap text-center">
            {adaptedInput || bulletsText}
        </div>
      </div>

      {warns.length > 0 && (
        <div className="px-4 pb-3">
          {warns.map(renderWarn)}
        </div>
      )}
      {localSuggestions.length > 0 && (
        <div className="px-4 pb-3">
          <div className="text-[11px] font-semibold mb-1">Aplică sugestii pentru acest slide</div>
          <div className="flex flex-wrap">
            {localSuggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onApplySuggestion && onApplySuggestion(s, m.title || '')}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 mr-2 mb-2 hover:bg-primary-100 dark:hover:bg-primary-900/30"
              >
                <Wand2 size={12}/> {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SlidesPreviewModal: React.FC<Props> = ({ isOpen, onClose, course, onApplySuggestion, onUpdateSlideLayout, onUpdateSlideAdapted }) => {
  const [models, setModels] = useState<SlideModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, 'idle' | 'saving' | 'saved' | 'error'>>({});
  const [overrides, setOverrides] = useState<Record<string, { layout?: SlideArchetype; adapted?: string }>>({});

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    // Only show full loading state on initial load
    if (models.length === 0) setLoading(true);
    
    const applyOverrides = (ms: SlideModel[]): SlideModel[] => {
      return ms.map(m => {
        const ov = overrides[m.id];
        if (!ov) return m;
        const next = { ...m };
        if (ov.layout) next.slide_type = ov.layout;
        if (ov.adapted && ov.layout) {
          const ac = { ...(next.adaptedContent || {}) };
          ac[ov.layout] = ov.adapted;
          next.adaptedContent = ac;
        }
        return next;
      });
    };

    const loadModels = async () => {
        try {
            const ms = await getSlideModelsForPreview(course);
            setModels(applyOverrides(ms));
        } catch (err: any) {
            console.error("Preview generation failed:", err);
            setError(err.message || "A apărut o eroare la generarea previzualizării.");
        } finally {
            setLoading(false);
        }
    };

    loadModels();
  }, [isOpen, course, overrides]);

  const handleLayoutUpdate = (slideTitle: string, newLayout: SlideArchetype, slideIndex?: number) => {
    // Optimistic local update
    setModels(prev => prev.map(m => (m.title === slideTitle && (slideIndex === undefined || m.originalIndex === slideIndex)) ? { ...m, slide_type: newLayout } : m));
    const targetId = (models.find(x => x.originalIndex === slideIndex && (x.title || '') === slideTitle)?.id) || `${slideTitle}-${slideIndex ?? ''}`;
    setStatusMap(prev => ({ ...prev, [targetId]: 'saving' }));
    setOverrides(prev => ({ ...prev, [targetId]: { ...(prev[targetId] || {}), layout: newLayout } }));
    
    // Propagate to parent - Parent will update course, triggering useEffect
    if (onUpdateSlideLayout) {
        onUpdateSlideLayout(slideTitle, newLayout, slideIndex);
    }
    
    // Remove the timeout-based revert which was using stale state
    // The useEffect above will handle synchronization when the parent updates the course prop
    setTimeout(() => {
       setStatusMap(prev => ({ ...prev, [targetId]: 'saved' }));
    }, 500);
  };

  const handleAdaptedUpdate = (slideTitle: string, newLayout: SlideArchetype, adaptedText: string, slideIndex?: number, slideId: string) => {
      if (onUpdateSlideAdapted) {
          onUpdateSlideAdapted(slideTitle, adaptedText, slideIndex);
      }
      setStatusMap(prev => ({ ...prev, [slideId]: 'saving' }));
      setOverrides(prev => ({ ...prev, [slideId]: { ...(prev[slideId] || {}), layout: newLayout, adapted: adaptedText } }));
      
      setTimeout(() => {
         setStatusMap(prev => ({ ...prev, [slideId]: 'saved' }));
      }, 500);
  };

  const summary = useMemo(() => {
    let critical = 0, warn = 0, info = 0;
    models.forEach(m => {
      const ws = getPedagogicWarnings(m);
      ws.forEach(w => {
        if (w.startsWith('[CRITICAL]')) critical++;
        else if (w.startsWith('[WARN]')) warn++;
        else if (w.startsWith('[INFO]')) info++;
      });
    });
    return { critical, warn, info };
  }, [models]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="w-[95vw] max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl ring-1 ring-black/5 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold">Slides Preview</h2>
            <p className="text-xs text-gray-500">Deterministic render pe arhetipuri</p>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="px-4 py-2 text-[11px] bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
          Recomandare: întâi alege layout-ul, apoi scrie „Conținut adaptat”. Adaptările sunt specifice layout-ului curent.
        </div>
        <div className="px-4 py-2 border-b dark:border-gray-700 flex items-center gap-2 text-[12px]">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
            <AlertTriangle size={12}/> {summary.critical} critical
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
            <AlertTriangle size={12}/> {summary.warn} warnings
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            <CheckCircle size={12}/> {summary.info} info
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 ml-auto">
            <CheckCircle size={12}/> Adaptări active: {models.filter(m => !!m.adaptedContent && !!m.adaptedContent[m.slide_type]).length}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
            <CheckCircle size={12}/> Latente: {models.reduce((acc, m) => acc + Math.max(0, Object.keys(m.adaptedContent || {}).filter(k => k !== m.slide_type).length), 0)}
          </span>
        </div>
        
        <div className="p-4 overflow-y-auto space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-sm">Loading...</div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-sm text-red-600 dark:text-red-400">
                <AlertTriangle size={32} className="mb-2" />
                <p className="font-bold">Eroare la generare</p>
                <p>{error}</p>
            </div>
          ) : models.length === 0 ? (
            <div className="text-sm text-gray-500">Nu există slide-uri de previzualizat.</div>
          ) : (
            models.map(m => (
                <Tile 
                    key={m.id} 
                    m={m} 
                    status={statusMap[m.id] || 'idle'}
                    onLayoutUpdate={handleLayoutUpdate}
                    onAdaptedUpdate={handleAdaptedUpdate}
                    onApplySuggestion={onApplySuggestion}
                />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SlidesPreviewModal;
