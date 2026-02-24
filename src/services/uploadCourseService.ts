import { supabase } from './supabaseClient';
import { CourseBlueprint } from '../types';
import { uploadCourseFile } from './fileStorageService';

/**
 * Parse DOCX file to markdown
 */
async function parseDocx(arrayBuffer: ArrayBuffer): Promise<string> {
    try {
        const mammothLib: any = await import('mammoth');
        const result = await mammothLib.convertToHtml({ arrayBuffer });
        const html: string = result.value || '';

        // Convert HTML to Markdown
        const TurndownService = (await import('turndown')).default;
        const turndownPluginGfm = await import('turndown-plugin-gfm');
        const gfm = turndownPluginGfm.gfm || turndownPluginGfm;

        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        });
        turndownService.use(gfm);
        turndownService.keep(['img']);

        const markdown = turndownService.turndown(html);
        return markdown;
    } catch (e) {
        console.warn('DOCX parse error:', e);
        // Fallback to plain text
        const text = new TextDecoder().decode(new Uint8Array(arrayBuffer));
        return text;
    }
}

/**
 * Parse TXT file
 */
function parseTxt(arrayBuffer: ArrayBuffer): string {
    return new TextDecoder().decode(new Uint8Array(arrayBuffer));
}

/**
 * Helper to safely parse JSON from AI response
 */
function safeJsonParse(text: string): any {
    if (!text) throw new Error('Empty content');
    let clean = text.trim();
    
    // Remove markdown code blocks
    clean = clean.replace(/```json\s*([\s\S]*?)\s*```/g, '$1');
    clean = clean.replace(/```\s*([\s\S]*?)\s*```/g, '$1');
    
    try {
        return JSON.parse(clean);
    } catch (e) {
        // Try to find JSON object bounds
        const first = clean.indexOf('{');
        const last = clean.lastIndexOf('}');
        if (first !== -1 && last !== -1) {
            const extracted = clean.substring(first, last + 1);
            try {
                return JSON.parse(extracted);
            } catch (e2) {
                // If standard parse fails, we might want to try a relaxed parser or just fail
                throw new Error(`JSON parse failed: ${(e as Error).message}`);
            }
        }
        throw e;
    }
}

function blueprintHasValidSections(blueprint: CourseBlueprint): boolean {
    if (!blueprint || !Array.isArray(blueprint.modules) || blueprint.modules.length === 0) return false;
    for (const m of blueprint.modules as any[]) {
        if (!m || !Array.isArray(m.sections) || m.sections.length === 0) return false;
        const hasValid = m.sections.some((s: any) => s && typeof s.title === 'string' && s.title.trim().length > 0 && typeof s.content_type === 'string' && s.content_type.trim().length > 0);
        if (!hasValid) return false;
    }
    return true;
}

/**
 * Create a new course from an uploaded file
 */
export async function createCourseFromUpload(
    file: File,
    environment: 'LiveWorkshop' | 'OnlineCourse',
    userId: string
): Promise<{ success: boolean; courseId?: string; error?: string }> {
    try {
        // 1. Parse file based on extension
        const arrayBuffer = await file.arrayBuffer();
        const ext = file.name.split('.').pop()?.toLowerCase();
        let content = '';

        if (ext === 'docx') {
            content = await parseDocx(arrayBuffer);
        } else if (ext === 'txt') {
            content = parseTxt(arrayBuffer);
        } else {
            return { success: false, error: 'Unsupported file format. Please use .docx or .txt' };
        }

        if (!content || content.trim().length === 0) {
            return { success: false, error: 'Could not extract content from file' };
        }

        // 2. Call Edge Function to analyze content and generate Blueprint
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
            'generate-course-content',
            {
                body: {
                    action: 'analyze_upload',
                    fileContent: content,
                    fileName: file.name,
                    environment
                }
            }
        );

        if (analysisError) {
            const errObj = analysisError as unknown as { context?: Response; status?: number; message: string };
            let status: number | undefined = errObj.status;
            let serverMsg: string | undefined = undefined;
            try {
                const ctx = errObj.context;
                if (ctx && typeof (ctx as any).status === 'number') status = (ctx as any).status;
                if (ctx && typeof (ctx as any).clone === 'function') {
                    const cloned = (ctx as any).clone();
                    const ct = cloned.headers?.get?.('content-type') || '';
                    if (ct.includes('application/json')) {
                        const json = await cloned.json();
                        serverMsg = (json?.error as string) || (json?.message as string) || JSON.stringify(json);
                    } else {
                        serverMsg = await cloned.text();
                    }
                }
            } catch (_) { /* swallow */ }

            // Fallback path on 429 (quota exceeded): create minimal course and attach uploaded file
            if (status === 429) {
                const courseTitle = file.name.replace(/\.[^/.]+$/, '');
                const { data: course, error: courseError } = await supabase
                    .from('courses')
                    .insert({
                        user_id: userId,
                        title: courseTitle,
                        subject: 'Imported Course',
                        environment,
                        target_audience: 'General',
                        language: 'en',
                        learning_objectives: null,
                        blueprint: null,
                        progress: 0
                    })
                    .select()
                    .single();

                if (courseError || !course) {
                    console.error('Fallback course creation error:', courseError);
                    return { success: false, error: `Edge 429 and failed fallback course creation: ${courseError?.message || 'unknown error'}` };
                }

                try {
                    await uploadCourseFile(course.id, file, userId);
                } catch (e: unknown) {
                    console.warn('Fallback: failed to attach file to knowledge base:', e);
                }

                return { success: true, courseId: course.id };
            }

            console.error('Analysis error:', { message: analysisError.message, status, serverMsg });
            return { success: false, error: `Edge Function error (${status || 'unknown'}): ${serverMsg || analysisError.message}` };
        }

        let blueprint: CourseBlueprint;
        try {
            if (!analysisData || typeof (analysisData as any).content !== 'string') {
                return { success: false, error: 'Invalid response from Edge Function (no content)' };
            }
            blueprint = safeJsonParse((analysisData as any).content);
            const isRomanian = /[ăâîșțĂÂÎȘȚ]/.test(content);
            if (!blueprintHasValidSections(blueprint)) {
                const { data: fixData, error: fixError } = await supabase.functions.invoke(
                    'generate-course-content',
                    {
                        body: {
                            action: 'complete_sections_for_import',
                            blueprint,
                            environment,
                            language: isRomanian ? 'Romanian' : 'English'
                        }
                    }
                );
                if (fixError || !fixData || typeof (fixData as any).content !== 'string') {
                    return { success: false, error: 'Failed to enrich blueprint with sections' };
                }
                blueprint = safeJsonParse((fixData as any).content);
                if (!blueprintHasValidSections(blueprint)) {
                    return { success: false, error: 'AI did not return a usable module/section structure' };
                }
            }
            blueprint.modules = (blueprint.modules || []).map((m: any, i: number) => ({
                ...m,
                id: m.id || `mod-${Date.now()}-${i}`,
                sections: (m.sections || []).map((s: any, j: number) => ({
                    ...s,
                    id: s.id || `sec-${Date.now()}-${i}-${j}`
                }))
            }));

        } catch (e) {
            console.error('Blueprint parse error:', e);
            return { success: false, error: 'Failed to generate course blueprint' };
        }

        // 3. Create course record with Blueprint
        const courseTitle = blueprint.title || file.name.replace(/\.\w+$/, '');
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert({
                user_id: userId,
                title: courseTitle,
                subject: 'Imported Course',
                environment,
                target_audience: blueprint.target_audience || 'General',
                language: 'en',
                learning_objectives: blueprint.modules
                    .map(m => m.learning_objective)
                    .join('\n'),
                blueprint,
                progress: 0
            })
            .select()
            .single();

        if (courseError) {
            console.error('Course creation error:', courseError);
            return { success: false, error: 'Failed to create course' };
        }

        // 4. Fill content gaps (generate missing exercises, quizzes, etc.)
        // Note: This is optional and non-blocking
        fillContentGaps(course.id, blueprint, content, environment).catch(err => {
            console.warn('Gap filling failed (non-critical):', err);
        });

        return { success: true, courseId: course.id };
    } catch (error: any) {
        console.error('Upload error:', error);
        return { success: false, error: error.message || 'Upload failed' };
    }
}

/**
 * Fill missing content types in the course (runs in background)
 */
async function fillContentGaps(
    _courseId: string,
    blueprint: CourseBlueprint,
    existingContent: string,
    environment: string
): Promise<void> {
    try {
        // Call Edge Function to identify and generate missing content
        const { data, error } = await supabase.functions.invoke('generate-course-content', {
            body: {
                action: 'fill_gaps',
                blueprint,
                existingContent,
                environment
            }
        });

        if (error) {
            console.error('Gap filling error:', error);
            return;
        }

        const gapsData = safeJsonParse(data.content);
        const gaps = gapsData.gaps || [];

        if (gaps.length === 0) {
            console.log('No content gaps to fill');
            return;
        }

        // Log generated gap content
        console.log('Generated gap content:', gaps);

        // TODO: In a full implementation, you would create additional course_steps
        // or append this content to the blueprint
    } catch (error) {
        console.error('Gap filling failed:', error);
        // Non-critical, so we don't throw
    }
}
