import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import { CourseDNA } from '../types';

interface DNAEditModalProps {
    isOpen: boolean;
    dna: CourseDNA;
    onClose: () => void;
    onSave: (dna: CourseDNA) => Promise<void>;
}

const DNAEditModal: React.FC<DNAEditModalProps> = ({ isOpen, dna, onClose, onSave }) => {
    const { t } = useTranslation();
    
    // Form State (Source of Truth)
    const [formData, setFormData] = useState<Partial<CourseDNA>>({});
    
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (dna) {
            // Initialize form with existing DNA
            // We ensure deep copies of arrays/objects to avoid reference issues
            setFormData(JSON.parse(JSON.stringify(dna)));
        }
    }, [dna]);

    const handleSave = async () => {
        try {
            setError(null);
            
            // Basic validation
            if (!formData.terminology || !formData.narrativeUniverse) {
                throw new Error(t('dna.edit.error.structure') || "Invalid DNA structure.");
            }

            setIsSaving(true);
            // We cast to CourseDNA because we assume the structure is valid based on the form inputs
            // Any hidden fields (like masterTimeline) are preserved in formData since we initialized it with the full object
            await onSave(formData as CourseDNA);
            setIsSaving(false);
            onClose();
        } catch (e: any) {
            setError(e.message || "Error saving DNA.");
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🧬</span>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {t('dna.edit.title')}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/30">
                    <div className="p-6 space-y-8">
                        {/* Terminology Section */}
                        <section>
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 border-b pb-2">
                                {t('dna.edit.section.terminology')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('dna.edit.field.participant')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.terminology?.participant || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            terminology: { ...formData.terminology!, participant: e.target.value }
                                        })}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('dna.edit.field.trainer')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.terminology?.trainer || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            terminology: { ...formData.terminology!, trainer: e.target.value }
                                        })}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('dna.edit.field.exercise')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.terminology?.exercise || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            terminology: { ...formData.terminology!, exercise: e.target.value }
                                        })}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                    />
                                </div>
                            </div>

                            {/* Mandatory Terms */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {t('dna.edit.section.mandatory')}
                                    </label>
                                    <button
                                        onClick={() => {
                                            const currentTerms = formData.terminology?.mandatoryTerms || {};
                                            const newKey = `term_${Date.now()}`;
                                            setFormData({
                                                ...formData,
                                                terminology: {
                                                    ...formData.terminology!,
                                                    mandatoryTerms: {
                                                        ...currentTerms,
                                                        [newKey]: { term: '', definition: '' }
                                                    }
                                                }
                                            });
                                        }}
                                        className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        <Plus size={14} />
                                        {t('dna.edit.term.add')}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(formData.terminology?.mandatoryTerms || {}).map(([key, item]) => (
                                        <div key={key} className="flex gap-2 items-start bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 group">
                                            <input
                                                type="text"
                                                value={item.term}
                                                onChange={(e) => {
                                                    const newTerms = { ...(formData.terminology?.mandatoryTerms || {}) };
                                                    newTerms[key] = { ...item, term: e.target.value };
                                                    setFormData({
                                                        ...formData,
                                                        terminology: { ...formData.terminology!, mandatoryTerms: newTerms }
                                                    });
                                                }}
                                                placeholder={t('dna.edit.mandatory.term')}
                                                className="flex-1 rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm p-1.5"
                                            />
                                            <input
                                                type="text"
                                                value={item.definition}
                                                onChange={(e) => {
                                                    const newTerms = { ...(formData.terminology?.mandatoryTerms || {}) };
                                                    newTerms[key] = { ...item, definition: e.target.value };
                                                    setFormData({
                                                        ...formData,
                                                        terminology: { ...formData.terminology!, mandatoryTerms: newTerms }
                                                    });
                                                }}
                                                placeholder={t('dna.edit.mandatory.definition')}
                                                className="flex-[2] rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm p-1.5"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newTerms = { ...(formData.terminology?.mandatoryTerms || {}) };
                                                    delete newTerms[key];
                                                    setFormData({
                                                        ...formData,
                                                        terminology: { ...formData.terminology!, mandatoryTerms: newTerms }
                                                    });
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Voice Profile Section */}
                        <section>
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4 border-b pb-2">
                                {t('dna.edit.section.voice')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('dna.edit.field.formality')}
                                    </label>
                                    <select
                                        value={formData.voiceProfile?.formality || 'professional'}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            voiceProfile: { ...formData.voiceProfile!, formality: e.target.value as any }
                                        })}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                    >
                                        <option value="professional">{t('dna.edit.formality.professional')}</option>
                                        <option value="buddy">{t('dna.edit.formality.buddy')}</option>
                                        <option value="academic">{t('dna.edit.formality.academic')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('dna.edit.field.humor')}
                                    </label>
                                    <select
                                        value={formData.voiceProfile?.humorLevel || 'none'}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            voiceProfile: { ...formData.voiceProfile!, humorLevel: e.target.value as any }
                                        })}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2"
                                    >
                                        <option value="none">{t('dna.edit.humor.none')}</option>
                                        <option value="light">{t('dna.edit.humor.light')}</option>
                                        <option value="heavy">{t('dna.edit.humor.heavy')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Forbidden & Signature Phrases */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {t('dna.edit.section.forbidden')}
                                        </label>
                                        <button
                                            onClick={() => {
                                                const current = formData.voiceProfile?.forbiddenPhrases || [];
                                                setFormData({
                                                    ...formData,
                                                    voiceProfile: {
                                                        ...formData.voiceProfile!,
                                                        forbiddenPhrases: [...current, '']
                                                    }
                                                });
                                            }}
                                            className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            <Plus size={14} />
                                            {t('dna.edit.phrase.add')}
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(formData.voiceProfile?.forbiddenPhrases || []).map((phrase, idx) => (
                                            <div key={idx} className="flex gap-2 items-center group">
                                                <input
                                                    type="text"
                                                    value={phrase}
                                                    onChange={(e) => {
                                                        const newPhrases = [...(formData.voiceProfile?.forbiddenPhrases || [])];
                                                        newPhrases[idx] = e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            voiceProfile: { ...formData.voiceProfile!, forbiddenPhrases: newPhrases }
                                                        });
                                                    }}
                                                    className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-1.5"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newPhrases = [...(formData.voiceProfile?.forbiddenPhrases || [])];
                                                        newPhrases.splice(idx, 1);
                                                        setFormData({
                                                            ...formData,
                                                            voiceProfile: { ...formData.voiceProfile!, forbiddenPhrases: newPhrases }
                                                        });
                                                    }}
                                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                            {t('dna.edit.section.signature')}
                                        </label>
                                        <button
                                            onClick={() => {
                                                const current = formData.voiceProfile?.signaturePhrases || [];
                                                setFormData({
                                                    ...formData,
                                                    voiceProfile: {
                                                        ...formData.voiceProfile!,
                                                        signaturePhrases: [...current, '']
                                                    }
                                                });
                                            }}
                                            className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            <Plus size={14} />
                                            {t('dna.edit.phrase.add')}
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(formData.voiceProfile?.signaturePhrases || []).map((phrase, idx) => (
                                            <div key={idx} className="flex gap-2 items-center group">
                                                <input
                                                    type="text"
                                                    value={phrase}
                                                    onChange={(e) => {
                                                        const newPhrases = [...(formData.voiceProfile?.signaturePhrases || [])];
                                                        newPhrases[idx] = e.target.value;
                                                        setFormData({
                                                            ...formData,
                                                            voiceProfile: { ...formData.voiceProfile!, signaturePhrases: newPhrases }
                                                        });
                                                    }}
                                                    className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-1.5"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newPhrases = [...(formData.voiceProfile?.signaturePhrases || [])];
                                                        newPhrases.splice(idx, 1);
                                                        setFormData({
                                                            ...formData,
                                                            voiceProfile: { ...formData.voiceProfile!, signaturePhrases: newPhrases }
                                                        });
                                                    }}
                                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Narrative Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
                                    {t('dna.edit.section.narrative')}
                                </h3>
                                <button
                                    onClick={() => {
                                        const currentProtagonists = formData.narrativeUniverse?.protagonists || [];
                                        const newProtagonists = [
                                            ...currentProtagonists,
                                            { name: '', role: '', personality: '', arc: '' }
                                        ];
                                        setFormData({
                                            ...formData,
                                            narrativeUniverse: {
                                                ...(formData.narrativeUniverse || {}),
                                                protagonists: newProtagonists
                                            }
                                        });
                                    }}
                                    className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    <Plus size={14} />
                                    {t('dna.edit.protagonist.add')}
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {(formData.narrativeUniverse?.protagonists || []).map((protagonist, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 relative group">
                                        <button
                                            onClick={() => {
                                                const newProtagonists = [...(formData.narrativeUniverse?.protagonists || [])];
                                                newProtagonists.splice(index, 1);
                                                setFormData({
                                                    ...formData,
                                                    narrativeUniverse: {
                                                        ...(formData.narrativeUniverse || {}),
                                                        protagonists: newProtagonists
                                                    }
                                                });
                                            }}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title={t('dna.edit.protagonist.remove')}
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    {t('dna.edit.protagonist.name')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={protagonist.name}
                                                    onChange={(e) => {
                                                        const newProtagonists = [...(formData.narrativeUniverse?.protagonists || [])];
                                                        newProtagonists[index] = { ...protagonist, name: e.target.value };
                                                        setFormData({
                                                            ...formData,
                                                            narrativeUniverse: { ...(formData.narrativeUniverse || {}), protagonists: newProtagonists }
                                                        });
                                                    }}
                                                    className="w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm p-1.5"
                                                    placeholder="Ex: Ana Popescu"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                                    {t('dna.edit.protagonist.role')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={protagonist.role}
                                                    onChange={(e) => {
                                                        const newProtagonists = [...(formData.narrativeUniverse?.protagonists || [])];
                                                        newProtagonists[index] = { ...protagonist, role: e.target.value };
                                                        setFormData({
                                                            ...formData,
                                                            narrativeUniverse: { ...(formData.narrativeUniverse || {}), protagonists: newProtagonists }
                                                        });
                                                    }}
                                                    className="w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm p-1.5"
                                                    placeholder="Ex: Manager Vânzări"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                                {t('dna.edit.protagonist.personality')}
                                            </label>
                                            <input
                                                type="text"
                                                value={protagonist.personality}
                                                onChange={(e) => {
                                                    const newProtagonists = [...(formData.narrativeUniverse?.protagonists || [])];
                                                    newProtagonists[index] = { ...protagonist, personality: e.target.value };
                                                    setFormData({
                                                        ...formData,
                                                        narrativeUniverse: { ...(formData.narrativeUniverse || {}), protagonists: newProtagonists }
                                                    });
                                                }}
                                                className="w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm p-1.5"
                                                placeholder="Ex: Ambițioasă, orientată spre rezultate..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                                {t('dna.edit.protagonist.arc')}
                                            </label>
                                            <textarea
                                                value={protagonist.arc}
                                                onChange={(e) => {
                                                    const newProtagonists = [...(formData.narrativeUniverse?.protagonists || [])];
                                                    newProtagonists[index] = { ...protagonist, arc: e.target.value };
                                                    setFormData({
                                                        ...formData,
                                                        narrativeUniverse: { ...(formData.narrativeUniverse || {}), protagonists: newProtagonists }
                                                    });
                                                }}
                                                rows={2}
                                                className="w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm p-1.5 resize-none"
                                                placeholder="Ex: Învață să delege și să aibă încredere în echipă..."
                                            />
                                        </div>
                                    </div>
                                ))}
                                
                                {(!formData.narrativeUniverse?.protagonists || formData.narrativeUniverse.protagonists.length === 0) && (
                                    <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 mb-2">Nu există protagoniști definiți.</p>
                                        <button
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    narrativeUniverse: {
                                                        ...(formData.narrativeUniverse || {}),
                                                        protagonists: [{ name: '', role: '', personality: '', arc: '' }]
                                                    }
                                                });
                                            }}
                                            className="text-sm text-indigo-600 hover:underline"
                                        >
                                            + {t('dna.edit.protagonist.add')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                    <div className="text-red-500 text-sm font-medium">
                        {error}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {t('dna.edit.cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isSaving ? <span className="animate-spin">⏳</span> : <Save size={18} />}
                            {t('dna.edit.save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DNAEditModal;
