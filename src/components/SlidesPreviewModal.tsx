import React, { useEffect, useMemo, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Wand2, LayoutTemplate, ChevronDown } from 'lucide-react';
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

const SlidesPreviewModal: React.FC<Props> = ({ isOpen, onClose, course, onApplySuggestion, onUpdateSlideLayout, onUpdateSlideAdapted }) => {
  const [models, setModels] = useState<SlideModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, 'idle' | 'saving' | 'saved' | 'error'>>({});

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getSlideModelsForPreview(course)
      .then(setModels)
      .finally(() => setLoading(false));
  }, [isOpen, course]);

  const handleLayoutUpdate = (slideTitle: string, newLayout: SlideArchetype, slideIndex?: number) => {
    // Optimistic local update
    setModels(prev => prev.map(m => (m.title === slideTitle && (slideIndex === undefined || m.originalIndex === slideIndex)) ? { ...m, slide_type: newLayout } : m));
    const targetId = (models.find(x => x.originalIndex === slideIndex && (x.title || '') === slideTitle)?.id) || `${slideTitle}-${slideIndex ?? ''}`;
    setStatusMap(prev => ({ ...prev, [targetId]: 'saving' }));
    // Propagate to parent
    if (onUpdateSlideLayout) {
        onUpdateSlideLayout(slideTitle, newLayout, slideIndex);
    }
    setTimeout(async () => {
      const refreshed = await getSlideModelsForPreview(course);
      setModels(refreshed);
      const mm = refreshed.find(x => x.originalIndex === slideIndex && (x.title || '') === slideTitle);
      const ok = !!mm && mm.slide_type === newLayout;
      setStatusMap(prev => ({ ...prev, [targetId]: ok ? 'saved' : 'error' }));
    }, 250);
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

  const Tile: React.FC<{ m: SlideModel }> = ({ m }) => {
    const bulletsText = (m.bullets || []).join('\n');
    const warns = getPedagogicWarnings(m);
    const [lowRes, setLowRes] = useState(false);
    const [showLayoutSelector, setShowLayoutSelector] = useState(false);
    const [adaptedInput, setAdaptedInput] = useState('');
    const tileStatus = statusMap[m.id] || 'idle';
    const latentCount = Object.keys(m.adaptedContent || {}).filter(k => k !== m.slide_type).length;

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
                onClick={() => setShowLayoutSelector(!showLayoutSelector)}
                className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                    showLayoutSelector 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
             >
                <LayoutTemplate size={12}/> Alege Layout <ChevronDown size={12} className={`transition-transform ${showLayoutSelector ? 'rotate-180' : ''}`}/>
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
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Alege Structura Vizuală:</p>
            <SlideLayoutSelector 
               currentType={m.slide_type} 
               onSelect={(t) => {
                  handleLayoutUpdate(m.title || '', t, m.originalIndex);
                  // Removed auto-close to allow user to see the selection state
                  // setShowLayoutSelector(false); 
               }}
            />
              <div className="mt-3 flex items-center justify-between">
              <div className="flex-1 mr-2">
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Conținut adaptat (opțional)</label>
                <textarea
                    value={adaptedInput}
                    onChange={(e) => setAdaptedInput(e.target.value)}
                    placeholder="Ex.: „Dacă nu asculți, nu vei fi ascultat.”"
                    className="w-full text-xs rounded border dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                    rows={2}
                />
              </div>
              <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                        if (onUpdateSlideAdapted) onUpdateSlideAdapted(m.title || '', `${m.slide_type}|${adaptedInput.trim()}`, m.originalIndex);
                        setStatusMap(prev => ({ ...prev, [m.id]: 'saving' }));
                        setTimeout(async () => {
                          const refreshed = await getSlideModelsForPreview(course);
                          setModels(refreshed);
                          const mm = refreshed.find(x => x.originalIndex === m.originalIndex && (x.title || '') === (m.title || ''));
                          const ok = !!mm && !!mm.adaptedContent && !!mm.adaptedContent[mm.slide_type] && mm.adaptedContent[mm.slide_type] === adaptedInput.trim();
                          setStatusMap(prev => ({ ...prev, [m.id]: ok ? 'saved' : 'error' }));
                        }, 250);
                    }}
                    className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    Salvează text
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLayoutSelector(false)}
                    className="px-3 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  >
                    Închide
                  </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {m.slide_type === 'image_text' ? (
            <>
              <div>
                <h3 className="font-bold text-lg mb-2">{m.title}</h3>
                {bulletsText && <ul className="list-disc ml-5 text-sm">
                  {(m.bullets || []).map((b, i) => (<li key={i}>{b}</li>))}
                </ul>}
              </div>
              <div className="flex items-center justify-center">
                {m.image_url ? (
                  <div className="text-center">
                    <img
                      src={m.image_url}
                      alt=""
                      className="max-h-48 rounded-lg object-contain"
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        const nw = img.naturalWidth || 0;
                        const nh = img.naturalHeight || 0;
                        setLowRes(nw < 800 || nh < 600);
                      }}
                    />
                    {lowRes && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
                        <AlertTriangle size={12} /> Rezoluție imagine mică
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No image</div>
                )}
              </div>
            </>
          ) : m.slide_type === 'exercise' ? (
            <div className="md:col-span-2">
              <div className="px-3 py-2 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-semibold mb-2">Exercițiu</div>
              <h3 className="font-bold text-lg mb-2">{m.title}</h3>
              {bulletsText && <ul className="list-disc ml-5 text-sm">
                {(m.bullets || []).map((b, i) => (<li key={i}>{b}</li>))}
              </ul>}
            </div>
          ) : m.slide_type === 'case_study' ? (
            <div className="md:col-span-2">
              <div className="px-3 py-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">Studiu de caz</div>
              <h3 className="font-bold text-lg mb-2">{m.title}</h3>
              {bulletsText && <ul className="list-disc ml-5 text-sm">
                {(m.bullets || []).map((b, i) => (<li key={i}>{b}</li>))}
              </ul>}
            </div>
          ) : m.slide_type === 'quote' ? (
            <div className="md:col-span-2">
              <blockquote className="text-xl italic text-center p-6">{m.title}</blockquote>
            </div>
          ) : (
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-2">{m.title}</h3>
              {bulletsText && <ul className="list-disc ml-5 text-sm">
                {(m.bullets || []).map((b, i) => (<li key={i}>{b}</li>))}
              </ul>}
            </div>
          )}
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
          ) : models.length === 0 ? (
            <div className="text-sm text-gray-500">Nu există slide-uri de previzualizat.</div>
          ) : (
            models.map(m => (<Tile key={m.id} m={m}/>))
          )}
        </div>
      </div>
    </div>
  );
};

export default SlidesPreviewModal;
