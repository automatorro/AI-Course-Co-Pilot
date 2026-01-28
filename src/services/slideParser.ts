import { SlideState, SlideLayoutId } from '../types/slideState';
import { SlideArchetype } from '../types';
import { parseContentSections } from './exportService';
import TurndownService from 'turndown';

// Mapping from old Archetype to new LayoutId
const ARCHETYPE_TO_LAYOUT_ID: Record<SlideArchetype, SlideLayoutId> = {
  [SlideArchetype.Title]: 'LAYOUT_TITLE',
  [SlideArchetype.Explainer]: 'LAYOUT_EXPLAINER',
  [SlideArchetype.ImageText]: 'LAYOUT_IMAGE_TEXT',
  [SlideArchetype.ImageLeft]: 'LAYOUT_IMAGE_LEFT',
  [SlideArchetype.ImageRight]: 'LAYOUT_IMAGE_RIGHT',
  [SlideArchetype.FullImage]: 'LAYOUT_FULL_IMAGE',
  [SlideArchetype.Quote]: 'LAYOUT_QUOTE',
  [SlideArchetype.BigNumber]: 'LAYOUT_BIG_NUMBER',
  [SlideArchetype.ThreeCol]: 'LAYOUT_THREE_COL',
  [SlideArchetype.Comparison]: 'LAYOUT_COMPARISON',
  [SlideArchetype.Timeline]: 'LAYOUT_TIMELINE',
  [SlideArchetype.GridCards]: 'LAYOUT_GRID_CARDS',
  [SlideArchetype.SectionHeader]: 'LAYOUT_SECTION_HEADER',
  [SlideArchetype.Checklist]: 'LAYOUT_CHECKLIST',
  [SlideArchetype.DoDont]: 'LAYOUT_DO_DONT',
  [SlideArchetype.Table]: 'LAYOUT_TABLE',
  [SlideArchetype.ImageCenter]: 'LAYOUT_IMAGE_CENTER',
  [SlideArchetype.Exercise]: 'LAYOUT_EXERCISE',
  [SlideArchetype.Agenda]: 'LAYOUT_AGENDA',
  [SlideArchetype.Summary]: 'LAYOUT_SUMMARY',
  [SlideArchetype.CaseStudy]: 'LAYOUT_CASE_STUDY'
};

const DEFAULT_LAYOUT: SlideLayoutId = 'LAYOUT_EXPLAINER';

/**
 * The Bridge: Transforms raw Markdown into Structured SlideState
 */
export const parseSlidesFromMarkdown = (markdown: string, language: string = 'en'): SlideState[] => {
  // Ensure we have Markdown (convert HTML if needed)
  let content = markdown;
  if (/<[a-z][\s\S]*>/i.test(content)) {
      try {
          const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
          // Preserve layout/adapted metadata comments
          td.addRule('preserveComments', {
              filter: (node: any) => node.nodeType === 8 && (
                  node.nodeValue?.trim().startsWith('slide-layout:') || 
                  node.nodeValue?.trim().startsWith('slide-adapted:')
              ),
              replacement: (_content: string, node: any) => {
                  return '<!--' + node.nodeValue + '-->';
              }
          });
          content = td.turndown(content);
      } catch (e) {
          console.warn('Failed to convert HTML to Markdown in slideParser:', e);
      }
  }

  // Use existing robust parser to get sections
  const sections = parseContentSections(content, language);

  return sections.map((section, index) => {
    // 1. Determine Layout
    let layoutId: SlideLayoutId = DEFAULT_LAYOUT;
    
    if (section.slideLayout && ARCHETYPE_TO_LAYOUT_ID[section.slideLayout]) {
      layoutId = ARCHETYPE_TO_LAYOUT_ID[section.slideLayout];
    } else {
      // Robust Fallback Heuristics for missing/unknown archetypes
      const t = (section.title || '').toLowerCase();
      const raw = (section.rawContent || '').toLowerCase();
      
      if (t.includes('summary') || t.includes('rezumat') || t.includes('concluzi')) layoutId = 'LAYOUT_SUMMARY';
      else if (t.includes('agenda') || t.includes('cuprins') || t.includes('structur')) layoutId = 'LAYOUT_AGENDA';
      else if (t.includes('exercise') || t.includes('exerci')) layoutId = 'LAYOUT_EXERCISE';
      else if (t.includes('studiu de caz') || t.includes('case study')) layoutId = 'LAYOUT_CASE_STUDY';
      else if (raw.includes('> "') || t.includes('citat') || t.includes('quote')) layoutId = 'LAYOUT_QUOTE';
      else if (section.images && section.images.length > 0) layoutId = 'LAYOUT_IMAGE_RIGHT';
    }

    // 2. Map Content
    const state: SlideState = {
      id: `slide-${Date.now()}-${index}`, // Temporary ID, will be stable in session
      layoutId,
      content: {
        title: section.title,
        bullets: section.bulletPoints || [],
        // Subtitle heuristics
        subtitle: section.bodyText || undefined,
        
        // Initialize structured fields (to be populated by UI or advanced parsing later)
        columns: [],
        table: { headers: [], rows: [] },
        quote: { text: '', author: '' },
        bigValue: '',
        bigLabel: ''
      },
      media: section.images && section.images.length > 0 ? {
        url: section.images[0].url,
        alt: section.images[0].alt,
        position: 'right' // Default
      } : undefined,
      speakerNotes: section.speakerNotes || '',
      metadata: {
        originalIndex: index,
        isManuallyEdited: false,
        visualSearchTerm: section.visualSearchTerm
      }
    };

    // 3. Apply Heuristics for Specific Layouts
    applyLayoutHeuristics(state, section);

    return state;
  });
};

/**
 * Refines the state based on the specific layout requirements and available data
 */
const applyLayoutHeuristics = (state: SlideState, section: any) => {
  const { bullets } = state.content;

  switch (state.layoutId) {
    case 'LAYOUT_QUOTE':
      // If we have a quote layout, try to split content into quote and author
      if (bullets.length > 0) {
        state.content.quote = {
          text: bullets[0],
          author: bullets[1] || 'Unknown'
        };
      }
      break;

    case 'LAYOUT_BIG_NUMBER': {
      // Try to find a number in the first bullet
      if (bullets.length > 0) {
        const match = bullets[0].match(/^([\d%.,]+)\s*(.*)$/);
        if (match) {
          state.content.bigValue = match[1];
          state.content.bigLabel = match[2] || section.bodyText || '';
        } else {
          state.content.bigValue = bullets[0];
        }
      }
      break;
    }

    case 'LAYOUT_COMPARISON':
    case 'LAYOUT_DO_DONT': {
      // Split bullets into two columns if possible
      const half = Math.ceil(bullets.length / 2);
      state.content.columns = [
        { header: 'Column 1', content: bullets.slice(0, half), type: 'positive' },
        { header: 'Column 2', content: bullets.slice(half), type: 'negative' }
      ];
      break;
    }
      
    case 'LAYOUT_THREE_COL': {
       // Split bullets into three columns
       const third = Math.ceil(bullets.length / 3);
       state.content.columns = [
        { header: 'Col 1', content: bullets.slice(0, third) },
        { header: 'Col 2', content: bullets.slice(third, third * 2) },
        { header: 'Col 3', content: bullets.slice(third * 2) }
       ];
       break;
    }
  }
};
