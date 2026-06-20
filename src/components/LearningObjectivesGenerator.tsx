import React, { useState, useEffect } from 'react';
import { Loader2, Lightbulb, RefreshCw, Check } from 'lucide-react';
import { Course, GenerationEnvironment } from '../types';
import { supabase } from '../services/supabaseClient';

interface LearningObjectivesGeneratorProps {
    course: Course;
    onComplete: () => void;
}

const LearningObjectivesGenerator: React.FC<LearningObjectivesGeneratorProps> = ({ course, onComplete }) => {
    const [objectives, setObjectives] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Editing Details States
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [editTitle, setEditTitle] = useState(course.title);
    const [editSubject, setEditSubject] = useState(course.subject || '');
    const [editAudience, setEditAudience] = useState(course.target_audience || '');
    const [editEnvironment, setEditEnvironment] = useState<GenerationEnvironment>(course.environment || GenerationEnvironment.LiveWorkshop);
    const [editLanguage, setEditLanguage] = useState(course.language || 'ro');

    // Sync state when course prop updates
    useEffect(() => {
        setEditTitle(course.title);
        setEditSubject(course.subject || '');
        setEditAudience(course.target_audience || '');
        setEditEnvironment(course.environment || GenerationEnvironment.LiveWorkshop);
        setEditLanguage(course.language || 'ro');
    }, [course]);

    const handleSaveDetails = async () => {
        try {
            setError(null);
            const { error: updateError } = await supabase
                .from('courses')
                .update({
                    title: editTitle,
                    subject: editSubject,
                    target_audience: editAudience,
                    environment: editEnvironment,
                    language: editLanguage
                })
                .eq('id', course.id);

            if (updateError) throw updateError;
            
            setIsEditingDetails(false);
            // Refresh parent course state
            onComplete();
        } catch (err: any) {
            console.error('Error saving course details:', err);
            setError(err.message || 'Failed to save course details');
        }
    };

    // Auto-generate on mount only if objectives don't exist
    useEffect(() => {
        generateObjectives();
    }, []);

    const generateObjectives = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const { data, error: functionError } = await supabase.functions.invoke('generate-course-content', {
                body: {
                    action: 'generate_learning_objectives',
                    course: {
                        title: course.title,
                        subject: course.subject,
                        target_audience: course.target_audience,
                        environment: course.environment,
                        language: course.language,
                    },
                },
            });

            if (functionError) throw functionError;
            if (data?.error) throw new Error(data.error);
            if (!data || !data.content) throw new Error('AI-ul nu a returnat conținut valid.');

            // Parse JSON response
            let response;
            try {
                response = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
            } catch (e) {
                console.error('Failed to parse JSON content:', data.content);
                throw new Error('Invalid response format from AI');
            }

            if (!response || typeof response !== 'object') {
                throw new Error('Obiectivele primite de la AI nu sunt în formatul corect.');
            }

            const objectivesList = response.objectives || [];

            // Convert array to newline-separated string
            const objectivesText = objectivesList
                .map((obj: string, index: number) => `${index + 1}. ${obj}`)
                .join('\n');

            setObjectives(objectivesText);
            setHasGenerated(true);
        } catch (err: any) {
            console.error('Error generating learning objectives:', err);
            setError(err.message || 'Failed to generate learning objectives');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!objectives.trim()) {
            setError('Please provide at least one learning objective');
            return;
        }

        try {
            // Save to database
            const { error: updateError } = await supabase
                .from('courses')
                .update({ learning_objectives: objectives })
                .eq('id', course.id);

            if (updateError) throw updateError;

            const { error: dirtyError } = await supabase
                .from('course_modules')
                .update({ is_dirty: true })
                .eq('course_id', course.id);
            if (dirtyError) {
                console.warn('Failed to mark modules as dirty after learning objectives update:', dirtyError);
            }

            // Call onComplete callback (no params needed, course will be reloaded)
            onComplete();
        } catch (err: any) {
            console.error('Error saving learning objectives:', err);
            setError(err.message || 'Failed to save learning objectives');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Lightbulb size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">Define Learning Objectives</h2>
                    </div>
                    <p className="text-primary-100">
                        What should participants be able to do after completing this course?
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Course Info */}
                    {!isEditingDetails ? (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2 relative">
                            <button
                                onClick={() => {
                                    setEditTitle(course.title);
                                    setEditSubject(course.subject || '');
                                    setEditAudience(course.target_audience || '');
                                    setEditEnvironment(course.environment || 'LIVE');
                                    setEditLanguage(course.language || 'ro');
                                    setIsEditingDetails(true);
                                }}
                                className="absolute top-2 right-2 text-xs text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                            >
                                Modifică detalii curs
                            </button>
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-medium text-ink-600 dark:text-ink-400">Course:</span>
                                <span className="font-semibold text-ink-900 dark:text-white">{course.title}</span>
                            </div>
                            {course.subject && (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-medium text-ink-600 dark:text-ink-400">Subject:</span>
                                    <span className="text-ink-800 dark:text-ink-200">{course.subject}</span>
                                </div>
                            )}
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-medium text-ink-600 dark:text-ink-400">Audience:</span>
                                <span className="text-ink-800 dark:text-ink-200">{course.target_audience}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-medium text-ink-600 dark:text-ink-400">Format:</span>
                                <span className="text-ink-800 dark:text-ink-200">{course.environment}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
                            <h3 className="font-bold text-sm text-ink-900 dark:text-white">Editează Detaliile Cursului</h3>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs font-medium text-ink-600">Titlu Curs</label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full input-premium text-sm p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-ink-600">Subiect</label>
                                    <input
                                        type="text"
                                        value={editSubject}
                                        onChange={(e) => setEditSubject(e.target.value)}
                                        className="w-full input-premium text-sm p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-ink-600">Public Țintă</label>
                                    <input
                                        type="text"
                                        value={editAudience}
                                        onChange={(e) => setEditAudience(e.target.value)}
                                        className="w-full input-premium text-sm p-2"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-ink-600">Format</label>
                                        <select
                                            value={editEnvironment}
                                            onChange={(e) => setEditEnvironment(e.target.value as GenerationEnvironment)}
                                            className="w-full input-premium text-sm p-2 bg-white dark:bg-gray-800"
                                        >
                                            <option value={GenerationEnvironment.LiveWorkshop}>Live Workshop</option>
                                            <option value={GenerationEnvironment.OnlineCourse}>Curs Online</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-ink-600">Limbă</label>
                                        <input
                                            type="text"
                                            value={editLanguage}
                                            onChange={(e) => setEditLanguage(e.target.value)}
                                            className="w-full input-premium text-sm p-2"
                                            placeholder="ro"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setIsEditingDetails(false)}
                                    className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
                                >
                                    Anulează
                                </button>
                                <button
                                    onClick={handleSaveDetails}
                                    className="px-3 py-1 text-xs bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors font-semibold"
                                >
                                    Salvează detalii
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI-Generated Objectives */}
                    {isGenerating && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <Loader2 className="animate-spin text-primary-600" size={48} />
                            <p className="text-ink-600 dark:text-ink-400">
                                AI is analyzing your course and generating learning objectives...
                            </p>
                        </div>
                    )}

                    {!isGenerating && (
                        <>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-ink-700 dark:text-ink-200">
                                        Learning Objectives
                                        {hasGenerated && (
                                            <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-normal">
                                                <Check size={14} className="inline mr-1" />
                                                AI-generated
                                            </span>
                                        )}
                                    </label>
                                    <button
                                        onClick={generateObjectives}
                                        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                                        disabled={isGenerating}
                                    >
                                        <RefreshCw size={16} />
                                        Regenerate
                                    </button>
                                </div>
                                <textarea
                                    value={objectives}
                                    onChange={(e) => setObjectives(e.target.value)}
                                    rows={8}
                                    className="w-full input-premium resize-none"
                                    placeholder="e.g.,
1. Build a functional React application using components and hooks
2. Implement state management using Context API
3. Debug React applications using Developer Tools"
                                />
                                <p className="text-xs text-ink-500 dark:text-ink-400 mt-2">
                                    💡 You can edit these objectives or add your own. Be specific about what participants will be able to DO.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={isGenerating || !objectives.trim()}
                                    className="btn-premium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Check size={20} />
                                    Continue to Blueprint
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningObjectivesGenerator;
