import React, { useEffect, useMemo, useState } from 'react';
import { X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { CourseBlueprint, CourseModule, CourseSection, CourseLesson } from '../types';
import { useTranslation } from '../contexts/I18nContext';

interface BlueprintEditModalProps {
  isOpen: boolean;
  blueprint: CourseBlueprint;
  onClose: () => void;
  onSave: (bp: CourseBlueprint) => Promise<void> | void;
}

const safeStringify = (bp: CourseBlueprint) => JSON.stringify(bp, null, 2);

const BlueprintEditModal: React.FC<BlueprintEditModalProps> = ({ isOpen, blueprint, onClose, onSave }) => {
  const { t } = useTranslation();
  const [text, setText] = useState<string>('');
  const [parsed, setParsed] = useState<CourseBlueprint | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<'form' | 'json'>('form');

  useEffect(() => {
    if (isOpen) {
      // Ensure every module has sections array to prevent crashes
      const safeBlueprint = {
        ...blueprint,
        modules: (blueprint.modules || []).map(m => ({
          ...m,
          sections: m.sections || [],
          lessons: m.lessons || []
        }))
      };
      setText(safeStringify(safeBlueprint));
      setParsed(safeBlueprint);
      setErrors([]);
    }
  }, [isOpen, blueprint]);

  const validateBlueprint = (bp: CourseBlueprint): string[] => {
    const errs: string[] = [];
    if (!bp || !Array.isArray(bp.modules)) {
      errs.push(t('blueprint.edit.validation.invalidStructure'));
      return errs;
    }
    if (bp.modules.length === 0) {
      errs.push(t('blueprint.edit.validation.noModules'));
    }
    bp.modules.forEach((m: CourseModule, mi: number) => {
      if (!m.title || m.title.trim().length === 0) {
        errs.push(t('blueprint.edit.validation.emptyModuleTitle', { n: mi + 1 }));
      }
      
      if (m.lessons && Array.isArray(m.lessons) && m.lessons.length > 0) {
        m.lessons.forEach((l, li) => {
          if (!l.title || l.title.trim().length === 0) {
            errs.push(`Lecția ${li + 1} din modulul ${mi + 1} nu are titlu.`);
          }
        });
      } else if (!Array.isArray(m.sections) || m.sections.length === 0) {
        errs.push(t('blueprint.edit.validation.noSections', { n: mi + 1 }));
      } else {
        const seen: Record<string, boolean> = {};
        m.sections.forEach((s: CourseSection, si: number) => {
            if (!s.title || s.title.trim().length === 0) {
              errs.push(t('blueprint.edit.validation.emptySectionTitle', { module: mi + 1, n: si + 1 }));
            }
            if (seen[s.id]) {
              errs.push(t('blueprint.edit.validation.duplicateSectionId', { module: mi + 1 }));
            }
            seen[s.id] = true;
        });
      }
    });
    return errs;
  };

  const preview = useMemo(() => {
    if (!parsed) return null;
    return (
      <div className="space-y-3">
        {(parsed.modules || []).map((m, mi) => (
          <div key={m.id || mi} className="border rounded-lg p-3 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gold">{t('blueprint.moduleN', { n: mi + 1 })}</span>
              <h4 className="font-bold text-graphite">{m.title}</h4>
            </div>
            <p className="text-sm text-stone mt-1 italic">{m.learning_objective}</p>
            {m.lessons && Array.isArray(m.lessons) && m.lessons.length > 0 ? (
              <div className="mt-3 space-y-2 pl-4 border-l-2 border-gold/30">
                {m.lessons.map((l, li) => (
                  <div key={l.id || li} className="text-sm">
                    <div className="font-semibold text-graphite">
                      Lecția {li + 1}: {l.title} 
                      <span className="text-xs font-normal text-stone ml-2">({l.estimated_minutes} min{l.has_exercise ? ', cu exercițiu' : ''})</span>
                    </div>
                    {l.learning_objective && <p className="text-xs text-stone ml-2 mt-0.5">{l.learning_objective}</p>}
                    {l.key_takeaways && l.key_takeaways.length > 0 && (
                      <ul className="list-disc pl-6 text-xs text-stone mt-1 space-y-0.5">
                        {l.key_takeaways.map((t, ti) => (
                          <li key={ti}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <ul className="mt-2 text-sm text-graphite list-disc ml-5">
                {(m.sections || []).map((s, si) => (
                  <li key={s.id || si}>{s.title} — <span className="uppercase text-xs">{(s.content_type || 'slides').replace('_',' ')}</span></li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }, [parsed, t]);

  const updateBlueprint = (updater: (bp: CourseBlueprint) => CourseBlueprint) => {
    if (!parsed) return;
    const next = updater(parsed);
    setParsed(next);
    setText(safeStringify(next));
    setErrors([]);
  };

  const onTopFieldChange = (field: keyof CourseBlueprint, value: string) => {
    updateBlueprint(bp => ({ ...bp, [field]: value }));
  };

  const onModuleFieldChange = (mi: number, field: keyof CourseModule, value: string) => {
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? { ...m, [field]: value } : m)
    }));
  };

  const onSectionFieldChange = (mi: number, si: number, field: keyof CourseSection, value: string) => {
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? {
        ...m,
        sections: (m.sections || []).map((s, j) => j === si ? { ...s, [field]: value } : s)
      } : m)
    }));
  };

  const addSection = (mi: number) => {
    const id = `sec_${Date.now()}`;
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? {
        ...m,
        sections: [...(m.sections || []), { id, title: t('blueprint.edit.sectionNewTitle'), content_type: 'slides', order: (m.sections || []).length + 1 }]
      } : m)
    }));
  };

  const removeSection = (mi: number, si: number) => {
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? {
        ...m,
        sections: (m.sections || []).filter((_, j) => j !== si).map((s, j) => ({ ...s, order: j + 1 }))
      } : m)
    }));
  };

  // Lesson helpers
  const onLessonFieldChange = (mi: number, li: number, field: keyof CourseLesson, value: any) => {
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? {
        ...m,
        lessons: (m.lessons || []).map((l, j) => j === li ? { ...l, [field]: value } : l)
      } : m)
    }));
  };

  const addLesson = (mi: number) => {
    const id = `les_${Date.now()}`;
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? {
        ...m,
        lessons: [...(m.lessons || []), {
          id,
          module_id: m.id,
          course_id: '',
          title: t('blueprint.edit.lessonNewTitle') || 'Lecție Nouă',
          learning_objective: '',
          has_exercise: false,
          estimated_minutes: 15,
          key_takeaways: [],
          order_index: (m.lessons || []).length,
          created_at: new Date().toISOString()
        }]
      } : m)
    }));
  };

  const removeLesson = (mi: number, li: number) => {
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? {
        ...m,
        lessons: (m.lessons || []).filter((_, j) => j !== li).map((l, j) => ({ ...l, order_index: j }))
      } : m)
    }));
  };

  const onTakeawayChange = (mi: number, li: number, ti: number, value: string) => {
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? {
        ...m,
        lessons: (m.lessons || []).map((l, j) => j === li ? {
          ...l,
          key_takeaways: (l.key_takeaways || []).map((t, k) => k === ti ? value : t)
        } : l)
      } : m)
    }));
  };

  const addTakeaway = (mi: number, li: number) => {
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? {
        ...m,
        lessons: (m.lessons || []).map((l, j) => j === li ? {
          ...l,
          key_takeaways: [...(l.key_takeaways || []), '']
        } : l)
      } : m)
    }));
  };

  const removeTakeaway = (mi: number, li: number, ti: number) => {
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.map((m, idx) => idx === mi ? {
        ...m,
        lessons: (m.lessons || []).map((l, j) => j === li ? {
          ...l,
          key_takeaways: (l.key_takeaways || []).filter((_, k) => k !== ti)
        } : l)
      } : m)
    }));
  };

  const addModule = () => {
    const id = `mod_${Date.now()}`;
    const secId = `sec_${Date.now()}`;
    updateBlueprint(bp => ({
      ...bp,
      modules: [
        ...bp.modules,
        {
          id,
          title: t('blueprint.edit.moduleNewTitle') || 'Modul Nou',
          learning_objective: t('blueprint.edit.moduleNewLO') || '',
          sections: [
            { id: secId, title: t('blueprint.edit.sectionNewTitle'), content_type: 'slides', order: 1 }
          ],
          lessons: []
        }
      ]
    }));
  };

  const removeModule = (mi: number) => {
    updateBlueprint(bp => ({
      ...bp,
      modules: bp.modules.filter((_, idx) => idx !== mi)
    }));
  };

  const handleTextChange = (v: string) => {
    setText(v);
    try {
      const bp = JSON.parse(v) as CourseBlueprint;
      setParsed(bp);
      setErrors([]);
    } catch (e) {
      setParsed(null);
      setErrors([t('blueprint.edit.invalidJson')]);
    }
  };

  const handleSave = async () => {
    if (!parsed) {
      setErrors([t('blueprint.edit.invalidJson')]);
      return;
    }
    const errs = validateBlueprint(parsed);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(parsed);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[95vw] max-w-5xl border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl">
          <h3 className="text-lg font-bold">{t('blueprint.edit.title')}</h3>
          <div className="flex items-center gap-2">
            <nav className="hidden lg:flex gap-2 mr-2" aria-label="Tabs">
              <button onClick={() => setMode('form')} className={`px-3 py-1 rounded-md text-sm font-medium transition ${mode === 'form' ? 'bg-gold text-gold-fg' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{t('blueprint.edit.tab.form')}</button>
              <button onClick={() => setMode('json')} className={`px-3 py-1 rounded-md text-sm font-medium transition ${mode === 'json' ? 'bg-gold text-gold-fg' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{t('blueprint.edit.tab.json')}</button>
            </nav>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-stone hover:text-graphite transition" aria-label="Close"><X size={18} /></button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-y-auto">
          <div className="p-4 border-r dark:border-gray-700 max-h-[70vh] overflow-y-auto space-y-4">
            {mode === 'json' ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">{t('blueprint.edit.jsonLabel')}</label>
                <textarea
                  className="w-full h-[50vh] font-mono text-sm rounded-lg border dark:border-gray-700 p-3 focus:outline-none focus:ring-2 focus:ring-gold bg-white dark:bg-gray-900"
                  value={text}
                  onChange={e => handleTextChange(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('blueprint.edit.titleLabel')}</label>
                    <input className="w-full rounded-md border dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-sm" value={parsed?.title || ''} onChange={e => onTopFieldChange('title', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('blueprint.edit.audienceLabel')}</label>
                    <input className="w-full rounded-md border dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-sm" value={parsed?.target_audience || ''} onChange={e => onTopFieldChange('target_audience', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('blueprint.edit.durationLabel')}</label>
                    <input className="w-full rounded-md border dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-sm" value={parsed?.estimated_duration || ''} onChange={e => onTopFieldChange('estimated_duration', e.target.value)} />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">{t('blueprint.edit.modulesLabel')}</h4>
                  {(parsed?.modules || []).map((m, mi) => (
                    <div key={m.id} className="mb-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="text-sm font-bold text-graphite">Modulul {mi + 1}</span>
                        <button
                          type="button"
                          className="text-red-600 dark:text-red-400 text-xs underline"
                          onClick={() => {
                            if (confirm(t('blueprint.edit.confirmRemoveModule'))) {
                              removeModule(mi);
                            }
                          }}
                        >
                          {t('blueprint.edit.removeModule')}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">{t('blueprint.edit.moduleTitleLabel', { n: mi + 1 })}</label>
                          <input className="w-full rounded-md border dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-sm" value={m.title} onChange={e => onModuleFieldChange(mi, 'title', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">{t('blueprint.edit.moduleLOLabel')}</label>
                          <textarea className="w-full rounded-md border dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-sm" value={m.learning_objective} onChange={e => onModuleFieldChange(mi, 'learning_objective', e.target.value)} rows={2} />
                        </div>
                      </div>
                      
                      {m.lessons && Array.isArray(m.lessons) ? (
                        <div className="mt-3 space-y-3">
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone">Lecții Granulare</label>
                          {m.lessons.map((l, li) => (
                            <div key={l.id || li} className="p-3 bg-gray-100/50 dark:bg-gray-900/50 rounded-lg border border-gray-200/80 dark:border-gray-700/80 space-y-3">
                              <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 pb-1">
                                <span className="text-xs font-bold text-gold">Lecția {li + 1}</span>
                                <button
                                  type="button"
                                  className="text-red-600 dark:text-red-400 text-xs hover:underline"
                                  onClick={() => removeLesson(mi, li)}
                                >
                                  Elimină
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 gap-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-stone mb-0.5 uppercase">Titlu Lecție</label>
                                  <input 
                                    className="w-full rounded-md border dark:border-gray-700 p-1.5 bg-white dark:bg-gray-900 text-xs" 
                                    value={l.title || ''} 
                                    onChange={e => onLessonFieldChange(mi, li, 'title', e.target.value)} 
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-stone mb-0.5 uppercase">Obiectiv de Învățare</label>
                                  <textarea 
                                    className="w-full rounded-md border dark:border-gray-700 p-1.5 bg-white dark:bg-gray-900 text-xs" 
                                    value={l.learning_objective || ''} 
                                    onChange={e => onLessonFieldChange(mi, li, 'learning_objective', e.target.value)} 
                                    rows={2}
                                  />
                                </div>
                                
                                <div className="flex items-center gap-4 py-1">
                                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-gray-300 text-gold focus:ring-gold" 
                                      checked={!!l.has_exercise} 
                                      onChange={e => onLessonFieldChange(mi, li, 'has_exercise', e.target.checked)} 
                                    />
                                    Conține Exercițiu
                                  </label>
                                  
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs font-medium">Minute:</label>
                                    <input 
                                      type="number" 
                                      className="w-16 rounded-md border dark:border-gray-700 p-1 bg-white dark:bg-gray-900 text-xs text-center font-bold" 
                                      value={l.estimated_minutes || 15} 
                                      onChange={e => onLessonFieldChange(mi, li, 'estimated_minutes', parseInt(e.target.value) || 15)} 
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[10px] font-semibold text-stone uppercase">Key Takeaways (Slide Bullet Points)</label>
                                  {(l.key_takeaways || []).map((t, ti) => (
                                    <div key={ti} className="flex items-center gap-2">
                                      <input 
                                        className="flex-1 rounded-md border dark:border-gray-700 p-1 bg-white dark:bg-gray-900 text-xs" 
                                        value={t || ''} 
                                        onChange={e => onTakeawayChange(mi, li, ti, e.target.value)} 
                                      />
                                      <button 
                                        type="button" 
                                        className="text-red-500 hover:text-red-700 text-[10px] uppercase font-bold" 
                                        onClick={() => removeTakeaway(mi, li, ti)}
                                      >
                                        Șterge
                                      </button>
                                    </div>
                                  ))}
                                  <button 
                                    type="button" 
                                    className="text-xs text-gold hover:underline pt-1 font-medium" 
                                    onClick={() => addTakeaway(mi, li)}
                                  >
                                    + Adaugă Takeaway
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            className="w-full btn-secondary text-xs py-1.5 border-dashed border-2 bg-white dark:bg-gray-900" 
                            onClick={() => addLesson(mi)}
                          >
                            + Adaugă Lecție
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <label className="block text-xs font-medium mb-1">{t('blueprint.edit.sectionsLabel')}</label>
                          {(m.sections || []).map((s, si) => (
                            <div key={s.id} className="flex items-center gap-2 mb-2">
                              <input className="flex-1 rounded-md border dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-sm" value={s.title} onChange={e => onSectionFieldChange(mi, si, 'title', e.target.value)} />
                              <select className="w-40 rounded-md border dark:border-gray-700 p-2 bg-white dark:bg-gray-900 text-sm" value={s.content_type} onChange={e => onSectionFieldChange(mi, si, 'content_type', e.target.value)}>
                                <option value="slides">Slides</option>
                                <option value="video_script">Video Script</option>
                                <option value="exercise">Exercise</option>
                                <option value="reading">Reading</option>
                                <option value="quiz">Quiz</option>
                              </select>
                              <button className="btn-secondary" onClick={() => removeSection(mi, si)}>{t('blueprint.edit.removeSection')}</button>
                            </div>
                          ))}
                          <button className="btn-secondary mt-1" onClick={() => addSection(mi)}>{t('blueprint.edit.addSection')}</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.length > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} /><span className="font-semibold text-sm">{t('blueprint.edit.validation.title')}</span></div>
                <ul className="list-disc ml-5 text-sm">
                  {errors.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
              </div>
            )}
             <button className="w-full mt-4 btn-secondary py-2.5 border-dashed border-2 font-semibold text-sm" onClick={addModule}>
               + {t('blueprint.edit.addModule') || 'Add New Module'}
             </button>
          </div>
          <div className="p-4 bg-gray-50/50 dark:bg-gray-900/20 max-h-[70vh] overflow-y-auto">
            <label className="block text-sm font-semibold mb-2 text-stone uppercase tracking-wider">{t('blueprint.edit.previewLabel')}</label>
            <div className="space-y-4">{preview}</div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
          <button onClick={onClose} className="btn-secondary">{t('blueprint.edit.cancel')}</button>
          <button onClick={handleSave} className="btn-premium flex items-center gap-2 px-6 py-2.5" disabled={isSaving || !!errors.length}>
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            {t('blueprint.edit.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlueprintEditModal;
