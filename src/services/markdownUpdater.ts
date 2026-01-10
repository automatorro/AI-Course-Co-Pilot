import { SlideState, SlideLayoutId } from '../types/slideState';
import TurndownService from 'turndown';
import { getParsingKeywords } from '../lib/slideParsingLocales';

// Helper to check if a line is a slide start
const isSlideStart = (line: string, hasSlideMarkers: boolean, language: string = 'en') => {
    const trimmed = line.trim();
    const keywords = getParsingKeywords(language);
    const slideIdentifierPattern = keywords.slideIdentifier.join('|');
    
    // Updated regex to match exportService.ts (allow brackets/parens around number)
    const slideMatchRegex = new RegExp(`^(\\*\\*|#+)?\\s*(${slideIdentifierPattern})\\s*(nr\\.|#)?\\s*[\\[\\(]?\\d+[\\]\\)]?(?:\\s*[:：]\\s*(.+?))?(\\*\\*|#+)?$`, 'i');
    const slideMatch = trimmed.match(slideMatchRegex) || trimmed.match(/^<SLIDE_BEGIN\s+id="[^"]+">/i);
    if (slideMatch) return true;
    if (hasSlideMarkers) return false;
    const isHeading = /^#{1,6}\s+/.test(trimmed);
    const isHr = /^(\-{3,}|\*{3,})$/.test(trimmed);
    return isHeading || isHr;
};

export const updateSlideLayoutInMarkdown = (
    markdown: string, 
    slideIndex: number, 
    layoutId: SlideLayoutId,
    slideTitle?: string,
    language: string = 'en'
): string => {
    const lines = markdown.split('\n');
    const keywords = getParsingKeywords(language);
    const slideIdentifierPattern = keywords.slideIdentifier.join('|');
    const slideMarkerRegex = new RegExp(`^\\s*(\\*\\*|#+)?\\s*(${slideIdentifierPattern})\\s*(nr\\.|#)?\\s*\\d+:|^\\s*<SLIDE_BEGIN`, 'i');

    const hasSlideMarkers = lines.some((l: string) => slideMarkerRegex.test(l.trim()));
    
    let newLines = [...lines];
    let found = false;

    // Strategy A: Index-based lookup (Deterministic)
    let currentIdx = -1;
    for (let i = 0; i < newLines.length; i++) {
        if (isSlideStart(newLines[i], hasSlideMarkers, language)) {
            currentIdx++;
            if (currentIdx === slideIndex) {
                found = true;
                // Look for existing layout metadata
                let metaIdx = -1;
                for(let k = 1; k <= 6 && i + k < newLines.length; k++) {
                    const nextLine = newLines[i+k].trim();
                    if (nextLine.match(/^<!--\s*slide-layout:/) || nextLine.match(/<div\s+data-slide-layout=/)) {
                        metaIdx = i + k;
                        break;
                    }
                    if (isSlideStart(newLines[i+k], hasSlideMarkers, language)) break;
                }

                const token = layoutId.replace('LAYOUT_', '');
                const metaTag = `<div data-slide-layout="${token}" style="display:none;"></div>`;
                
                if (metaIdx !== -1) {
                    newLines[metaIdx] = metaTag;
                } else {
                    newLines.splice(i + 1, 0, metaTag);
                }
                break;
            }
        }
    }

    // Strategy B: Title-based fallback (Legacy)
    if (!found && slideTitle) {
        const norm = (s: string) => s.toLowerCase().trim().replace(/[*#]/g, '').replace(new RegExp(`^(${slideIdentifierPattern})\\s*\\d+[:.]?\\s*`, 'i'), '');
        const target = norm(slideTitle);

        for (let i = 0; i < newLines.length; i++) {
            const line = newLines[i];
            if (isSlideStart(line, hasSlideMarkers, language)) {
                let lineContent = line.trim().replace(/^#{1,6}\s+/, '').replace(/^\*\*/, '').replace(/\*\*$/, '');
                
                // XML Title Extraction
                if (line.match(/^<SLIDE_BEGIN/i)) {
                    for (let k = 1; k <= 4 && i + k < newLines.length; k++) {
                        const tMatch = newLines[i+k].match(/<TITLE>(.*?)<\/TITLE>/i);
                        if (tMatch) {
                            lineContent = tMatch[1];
                            break;
                        }
                    }
                }

                const lineNorm = norm(lineContent);
                
                if (lineNorm.includes(target) || target.includes(lineNorm)) {
                    found = true;
                    let metaIdx = -1;
                    for(let k = 1; k <= 6 && i + k < newLines.length; k++) {
                        const nextLine = newLines[i+k].trim();
                        if (nextLine.match(/^<!--\s*slide-layout:/) || nextLine.match(/<div\s+data-slide-layout=/)) {
                            metaIdx = i + k;
                            break;
                        }
                        if (isSlideStart(newLines[i+k], hasSlideMarkers, language)) break;
                    }

                    const token = layoutId.replace('LAYOUT_', '');
                    const metaTag = `<div data-slide-layout="${token}" style="display:none;"></div>`;
                    
                    if (metaIdx !== -1) {
                        newLines[metaIdx] = metaTag;
                    } else {
                        newLines.splice(i + 1, 0, metaTag);
                    }
                    break;
                }
            }
        }
    }

    return newLines.join('\n');
};

export const htmlToMarkdownWithComments = (html: string): string => {
    // Preserve HTML comments during HTML->Markdown conversion to avoid losing layout metadata
    // @ts-ignore
    const turndownService = new TurndownService({ headingStyle: 'atx' });
    
    // Preserve layout metadata div
    turndownService.addRule('preserveLayout', {
        filter: (node: any) => node.nodeName === 'DIV' && node.hasAttribute('data-slide-layout'),
        replacement: (_content: any, node: any) => {
            const token = (node as HTMLElement).getAttribute('data-slide-layout') || '';
            return `\n<div data-slide-layout="${token}" style="display:none;"></div>\n`;
        }
    });

    turndownService.addRule('preserveImage', {
        filter: (node: any) => node.nodeName === 'DIV' && node.hasAttribute('data-slide-image'),
        replacement: (_content: any, node: any) => {
            const url = (node as HTMLElement).getAttribute('data-slide-image') || '';
            const alt = (node as HTMLElement).getAttribute('data-slide-image-alt') || '';
            return `\n<div data-slide-image="${url}" data-slide-image-alt="${alt}" style="display:none;"></div>\n`;
        }
    });

    turndownService.addRule('restoreComments', {
        filter: (node: any) => node.nodeName === 'DIV' && node.hasAttribute('data-turndown-comment'),
        replacement: (_content: any, node: any) => {
            const comment = (node as HTMLElement).getAttribute('data-turndown-comment') || '';
            return '\n<!--' + comment + '-->\n';
        }
    });
    
    const preProcessed = (html || '').replace(/<!--([\s\S]*?)-->/g, (_match, p1) => {
        return `<div data-turndown-comment="${p1.replace(/"/g, '&quot;')}"></div>`;
    });
    
    return turndownService.turndown(preProcessed);
};

export const serializeSlideStateToMarkdown = (
    slide: SlideState,
    options: { useSlideMarkers?: boolean, slideIndex?: number, language?: string } = {}
): string => {
    let md = '';
    const language = options.language || 'en';
    const keywords = getParsingKeywords(language);
    const primarySlideId = keywords.slideIdentifier[0] || 'Slide';
    
    // 1. Title
    if (options.useSlideMarkers && options.slideIndex !== undefined) {
        md += `**${primarySlideId} ${options.slideIndex + 1}: ${slide.content.title}**\n\n`;
    } else {
        md += `## ${slide.content.title}\n\n`;
    }
    
    // 2. Layout Meta
    if (slide.layoutId) {
        const token = slide.layoutId.replace('LAYOUT_', '');
        md += `<div data-slide-layout="${token}" style="display:none;"></div>\n\n`;
    }

    // 3. Media (Image) or Visual Suggestion
    if (slide.media && slide.media.url) {
        const alt = slide.media.alt || '';
        md += `<div data-slide-image="${slide.media.url}" data-slide-image-alt="${alt}" style="display:none;"></div>\n\n`;
    } else if (slide.metadata.visualSearchTerm) {
        md += `**Visual**: ${slide.metadata.visualSearchTerm}\n\n`;
    }

    // 4. Subtitle / Body Text
    if (slide.content.subtitle) {
        md += `${slide.content.subtitle}\n\n`;
    }

    // 5. Content (Bullets, Columns, etc flattened)
    const allBullets: string[] = [];
    
    if (slide.content.bullets && slide.content.bullets.length > 0) {
        allBullets.push(...slide.content.bullets);
    }
    
    if (slide.content.columns) {
        slide.content.columns.forEach((col: any) => {
             if (col.content) allBullets.push(...col.content);
        });
    }
    
    if (slide.content.quote) {
        if (slide.content.quote.text) allBullets.push(slide.content.quote.text);
        if (slide.content.quote.author) allBullets.push(slide.content.quote.author);
    }

    if (slide.content.bigValue) allBullets.push(slide.content.bigValue);
    if (slide.content.bigLabel) allBullets.push(slide.content.bigLabel);

    // Deduplicate and filter empty
    const uniqueBullets = [...new Set(allBullets)].filter(b => b && b.trim());
    
    uniqueBullets.forEach(b => {
        md += `- ${b}\n`;
    });

    // 5. Speaker Notes
    if (slide.speakerNotes) {
        md += `\n<!-- speaker-notes: ${slide.speakerNotes} -->\n`;
    }

    return md;
};

export const updateSlideInMarkdown = (
    originalMarkdown: string,
    slideIndex: number,
    newSlideState: SlideState,
    language: string = 'en'
): string => {
    const lines = originalMarkdown.split('\n');
    const keywords = getParsingKeywords(language);
    const slideIdentifierPattern = keywords.slideIdentifier.join('|');
    const slideMarkerRegex = new RegExp(`^\\s*(\\*\\*|#+)?\\s*(${slideIdentifierPattern})\\s*(nr\\.|#)?\\s*\\d+:|^\\s*<SLIDE_BEGIN`, 'i');

    const hasSlideMarkers = lines.some((l: string) => slideMarkerRegex.test(l.trim()));
    
    let currentIdx = -1;
    let startLine = -1;
    let endLine = -1;

    // Find slide bounds
    for (let i = 0; i < lines.length; i++) {
        if (isSlideStart(lines[i], hasSlideMarkers, language)) {
            currentIdx++;
            if (currentIdx === slideIndex) {
                startLine = i;
            } else if (currentIdx === slideIndex + 1) {
                endLine = i;
                break;
            }
        }
    }
    
    if (startLine === -1) return originalMarkdown; // Slide not found
    if (endLine === -1) endLine = lines.length;

    // Generate new slide markdown
    const newSlideMd = serializeSlideStateToMarkdown(newSlideState, { 
        useSlideMarkers: hasSlideMarkers, 
        slideIndex: slideIndex,
        language: language
    });
    
    // Replace content
    const before = lines.slice(0, startLine);
    const after = lines.slice(endLine);
    
    return [...before, newSlideMd, ...after].join('\n');
};
