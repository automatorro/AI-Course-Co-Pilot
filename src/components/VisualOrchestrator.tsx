import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { SlideState } from '../types/slideState';
import { parseSlidesFromMarkdown } from '../services/slideParser';
import { Download, Save, Image as ImageIcon, Layout } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import { exportSlidesAsPptx } from '../services/exportService';
import ImageSearchModal from './ImageSearchModal';
import {
  TitleIcon, ExplainerIcon, ImageLeftIcon, ImageRightIcon,
  FullImageIcon, QuoteIcon, BigNumberIcon, ThreeColIcon,
  ComparisonIcon, TimelineIcon, GridCardsIcon, SectionHeaderIcon,
  ChecklistIcon, TableIcon, AgendaIcon, GenericIcon
} from './SlideLayoutIcons';

interface VisualOrchestratorProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  initialMarkdown: string; // The raw content from TinyMCE
  onSave?: (slides: SlideState[]) => void;
}

const LAYOUT_CONFIG: Record<string, { icon: React.FC<any>, labelKey: string }> = {
  LAYOUT_TITLE: { icon: TitleIcon, labelKey: 'slide.layout.title' },
  LAYOUT_EXPLAINER: { icon: ExplainerIcon, labelKey: 'slide.layout.explainer' },
  LAYOUT_IMAGE_TEXT: { icon: GenericIcon, labelKey: 'slide.layout.imageText' },
  LAYOUT_IMAGE_LEFT: { icon: ImageLeftIcon, labelKey: 'slide.layout.imageLeft' },
  LAYOUT_IMAGE_RIGHT: { icon: ImageRightIcon, labelKey: 'slide.layout.imageRight' },
  LAYOUT_FULL_IMAGE: { icon: FullImageIcon, labelKey: 'slide.layout.fullImage' },
  LAYOUT_QUOTE: { icon: QuoteIcon, labelKey: 'slide.layout.quote' },
  LAYOUT_BIG_NUMBER: { icon: BigNumberIcon, labelKey: 'slide.layout.bigNumber' },
  LAYOUT_THREE_COL: { icon: ThreeColIcon, labelKey: 'slide.layout.threeCol' },
  LAYOUT_COMPARISON: { icon: ComparisonIcon, labelKey: 'slide.layout.comparison' },
  LAYOUT_TIMELINE: { icon: TimelineIcon, labelKey: 'slide.layout.timeline' },
  LAYOUT_GRID_CARDS: { icon: GridCardsIcon, labelKey: 'slide.layout.gridCards' },
  LAYOUT_SECTION_HEADER: { icon: SectionHeaderIcon, labelKey: 'slide.layout.sectionHeader' },
  LAYOUT_CHECKLIST: { icon: ChecklistIcon, labelKey: 'slide.layout.checklist' },
  LAYOUT_DO_DONT: { icon: ComparisonIcon, labelKey: 'slide.layout.doDont' },
  LAYOUT_TABLE: { icon: TableIcon, labelKey: 'slide.layout.table' },
  LAYOUT_IMAGE_CENTER: { icon: GenericIcon, labelKey: 'slide.layout.imageCenter' },
  LAYOUT_EXERCISE: { icon: GenericIcon, labelKey: 'slide.layout.exercise' },
  LAYOUT_AGENDA: { icon: AgendaIcon, labelKey: 'slide.layout.agenda' },
  LAYOUT_SUMMARY: { icon: GenericIcon, labelKey: 'slide.layout.summary' },
  LAYOUT_CASE_STUDY: { icon: GenericIcon, labelKey: 'slide.layout.caseStudy' },
};

const SlideRenderer: React.FC<{ slide: SlideState }> = ({ slide }) => {
  const { content, layoutId, media } = slide;
  
  const renderImage = () => {
    if (!media?.url) return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <ImageIcon size={48} className="mb-2 opacity-50" />
        <span className="text-sm">No Image</span>
      </div>
    );
    return <img src={media.url} alt={media.alt || 'Slide Image'} className="w-full h-full object-cover rounded-lg shadow-sm" />;
  };

  // Title / Centered Layouts
  if (['LAYOUT_TITLE', 'LAYOUT_BIG_NUMBER', 'LAYOUT_QUOTE', 'LAYOUT_SECTION_HEADER'].includes(layoutId)) {
     return (
       <div className="h-full flex flex-col items-center justify-center text-center px-16 relative overflow-hidden">
          {/* Background Image optional for Title? For now keep simple */}
          {media?.url && layoutId === 'LAYOUT_TITLE' && (
             <div className="absolute inset-0 opacity-10 z-0">
                <img src={media.url} className="w-full h-full object-cover" />
             </div>
          )}
          
          <div className="z-10 relative">
              <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">{content.title}</h1>
              {content.subtitle && <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">{content.subtitle}</p>}
              
              {layoutId === 'LAYOUT_QUOTE' && content.quote && (
                   <blockquote className="text-3xl italic text-blue-600 dark:text-blue-400 max-w-4xl mx-auto leading-relaxed">
                     "{content.quote.text}"
                     <footer className="text-lg mt-4 font-semibold text-gray-500 dark:text-gray-400 not-italic">— {content.quote.author}</footer>
                   </blockquote>
              )}

              {layoutId === 'LAYOUT_BIG_NUMBER' && content.bigValue && (
                  <div className="my-8">
                      <div className="text-9xl font-extrabold text-blue-600 dark:text-blue-500">{content.bigValue}</div>
                      <div className="text-2xl text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2">{content.bigLabel}</div>
                  </div>
              )}
          </div>
       </div>
     );
  }

  // Split Left (Image Left)
  if (['LAYOUT_IMAGE_LEFT', 'LAYOUT_CASE_STUDY'].includes(layoutId)) {
      return (
          <div className="h-full grid grid-cols-2 gap-8 items-center px-8">
             <div className="h-4/5">{renderImage()}</div>
             <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{content.title}</h2>
                {content.subtitle && <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{content.subtitle}</p>}
                <div className="space-y-3">
                    {content.bullets.map((b, i) => (
                        <div key={i} className="flex gap-3 items-start">
                           <span className="text-blue-500 text-xl mt-1">•</span>
                           <span className="text-lg text-gray-700 dark:text-gray-200">{b}</span>
                        </div>
                    ))}
                </div>
             </div>
          </div>
      );
  }

  // Split Right (Image Right)
  if (['LAYOUT_IMAGE_RIGHT', 'LAYOUT_IMAGE_TEXT', 'LAYOUT_EXERCISE'].includes(layoutId)) {
      return (
          <div className="h-full grid grid-cols-2 gap-8 items-center px-8">
             <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{content.title}</h2>
                {content.subtitle && <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{content.subtitle}</p>}
                <div className="space-y-3">
                    {content.bullets.map((b, i) => (
                        <div key={i} className="flex gap-3 items-start">
                           <span className="text-blue-500 text-xl mt-1">•</span>
                           <span className="text-lg text-gray-700 dark:text-gray-200">{b}</span>
                        </div>
                    ))}
                </div>
             </div>
             <div className="h-4/5">{renderImage()}</div>
          </div>
      );
  }
  
  // Full Image
  if (layoutId === 'LAYOUT_FULL_IMAGE') {
      return (
        <div className="h-full w-full relative">
           {media?.url ? (
               <img src={media.url} alt={media.alt} className="absolute inset-0 w-full h-full object-cover" />
           ) : (
               <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                   <ImageIcon size={64} className="text-gray-400" />
               </div>
           )}
           <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-16">
               <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">{content.title}</h1>
               {content.subtitle && <p className="text-2xl text-gray-100 drop-shadow-md max-w-3xl mx-auto">{content.subtitle}</p>}
           </div>
        </div>
      );
  }

  // Comparisons / DoDont
  if (layoutId === 'LAYOUT_COMPARISON' || layoutId === 'LAYOUT_DO_DONT') {
      const isDoDont = layoutId === 'LAYOUT_DO_DONT';
      return (
          <div className="h-full flex flex-col px-12 py-10">
              <h2 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">{content.title}</h2>
              <div className="flex-1 grid grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className={`p-6 rounded-lg ${isDoDont ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <h3 className={`text-xl font-bold mb-4 ${isDoDont ? 'text-green-700' : 'text-gray-800'}`}>
                          {isDoDont ? 'DO' : (content.columns?.[0]?.header || 'Option A')}
                      </h3>
                      <ul className="space-y-3">
                          {(content.columns?.[0]?.content || content.bullets.slice(0, Math.ceil(content.bullets.length/2))).map((b, i) => (
                              <li key={i} className="flex gap-2 text-gray-700">
                                  <span className={isDoDont ? 'text-green-500' : 'text-blue-500'}>✓</span> {b}
                              </li>
                          ))}
                      </ul>
                  </div>
                  {/* Right Column */}
                  <div className={`p-6 rounded-lg ${isDoDont ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <h3 className={`text-xl font-bold mb-4 ${isDoDont ? 'text-red-700' : 'text-gray-800'}`}>
                          {isDoDont ? 'DON\'T' : (content.columns?.[1]?.header || 'Option B')}
                      </h3>
                      <ul className="space-y-3">
                          {(content.columns?.[1]?.content || content.bullets.slice(Math.ceil(content.bullets.length/2))).map((b, i) => (
                              <li key={i} className="flex gap-2 text-gray-700">
                                  <span className={isDoDont ? 'text-red-500' : 'text-blue-500'}>{isDoDont ? '✕' : '•'}</span> {b}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
      );
  }

  // Three Columns
  if (layoutId === 'LAYOUT_THREE_COL') {
      return (
          <div className="h-full flex flex-col px-12 py-10">
              <h2 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">{content.title}</h2>
              <div className="flex-1 grid grid-cols-3 gap-6">
                  {[0, 1, 2].map(idx => {
                      const col = content.columns?.[idx];
                      const bullets = col?.content || [];
                      // Fallback if no structured columns: distribute bullets? 
                      const displayBullets = bullets.length ? bullets : content.bullets.filter((_, i) => i % 3 === idx);

                      return (
                        <div key={idx} className="p-4 bg-gray-50 rounded border border-gray-200 flex flex-col">
                            <h3 className="text-lg font-bold mb-3 text-blue-900">{col?.header || `Column ${idx+1}`}</h3>
                            <ul className="space-y-2 flex-1">
                                {displayBullets.map((b, ii) => (
                                    <li key={ii} className="text-sm text-gray-700">• {b}</li>
                                ))}
                            </ul>
                        </div>
                      );
                  })}
              </div>
          </div>
      );
  }

  // Grid Cards
  if (layoutId === 'LAYOUT_GRID_CARDS') {
      return (
          <div className="h-full flex flex-col px-12 py-10 relative overflow-hidden">
              {media?.url && (
                  <div className="absolute inset-0 z-0 opacity-10">
                      <img src={media.url} className="w-full h-full object-cover" />
                  </div>
              )}
              <div className="z-10 flex flex-col h-full">
                  <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{content.title}</h2>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
                      {content.bullets.map((b, i) => (
                          <div key={i} className="p-4 bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100 rounded-lg flex flex-col gap-2 hover:shadow-md transition-shadow">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-1">
                                  {i+1}
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{b}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // Timeline
  if (layoutId === 'LAYOUT_TIMELINE') {
      if (media?.url) {
          return (
              <div className="h-full grid grid-cols-2 gap-8 px-12 py-10">
                  <div className="flex flex-col h-full">
                      <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{content.title}</h2>
                      <div className="flex-1 rounded-xl overflow-hidden relative shadow-md">
                          <img src={media.url} alt={media.alt} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                  </div>
                  <div className="flex-1 relative pl-8 border-l-2 border-blue-200 space-y-8 overflow-y-auto h-full">
                      {content.bullets.map((b, i) => (
                          <div key={i} className="relative pl-8">
                              <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                  <p className="text-gray-800">{b}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          );
      }
      
      return (
          <div className="h-full flex flex-col px-12 py-10">
              <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{content.title}</h2>
              <div className="flex-1 relative pl-8 border-l-2 border-blue-200 space-y-8 overflow-y-auto">
                  {content.bullets.map((b, i) => (
                      <div key={i} className="relative pl-8">
                          <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <p className="text-gray-800">{b}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  // Checklist
  if (layoutId === 'LAYOUT_CHECKLIST') {
      return (
          <div className="h-full grid grid-cols-2 gap-12 px-12 py-10 items-center">
              <div className="flex flex-col h-full justify-center">
                  <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{content.title}</h2>
                  {content.subtitle && <p className="text-xl text-gray-600 mb-8">{content.subtitle}</p>}
                  {media?.url && (
                      <div className="mt-4 rounded-lg overflow-hidden shadow-md flex-1 max-h-64 relative">
                          <img src={media.url} alt={media.alt} className="w-full h-full object-cover" />
                      </div>
                  )}
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-h-full overflow-y-auto">
                  <ul className="space-y-4">
                      {content.bullets.map((b, i) => (
                          <li key={i} className="flex items-center gap-4">
                              <div className="w-6 h-6 rounded border-2 border-blue-500 flex items-center justify-center text-blue-500">
                                  ✓
                              </div>
                              <span className="text-lg text-gray-700">{b}</span>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      );
  }

  // Agenda
  if (layoutId === 'LAYOUT_AGENDA') {
      return (
          <div className="h-full flex flex-col px-16 py-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
               {media?.url && (
                  <div className="absolute inset-0 z-0 opacity-5">
                      <img src={media.url} className="w-full h-full object-cover" />
                  </div>
              )}
              <div className="z-10 flex flex-col h-full">
                  <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white border-b pb-4">{content.title}</h2>
                  <div className="flex-1 space-y-6 max-w-3xl mx-auto w-full overflow-y-auto">
                      {content.bullets.map((b, i) => (
                          <div key={i} className="flex items-center gap-6 p-4 bg-white/95 rounded-lg shadow-sm">
                              <span className="text-4xl font-black text-blue-200">{(i+1).toString().padStart(2, '0')}</span>
                              <span className="text-xl font-medium text-gray-800">{b}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // Table
  if (layoutId === 'LAYOUT_TABLE') {
      // Heuristic: if no structured table data, try to parse bullets as rows
      const headers = content.table?.headers?.length ? content.table.headers : ['Item', 'Description'];
      const rows = content.table?.rows?.length 
          ? content.table.rows 
          : content.bullets.map(b => b.includes('|') ? b.split('|').map(s => s.trim()) : [b, '']);

      return (
          <div className="h-full flex flex-col px-12 py-10 relative overflow-hidden">
               {media?.url && (
                  <div className="absolute inset-0 z-0 opacity-10">
                      <img src={media.url} className="w-full h-full object-cover" />
                  </div>
              )}
              <div className="z-10 flex flex-col h-full">
                  <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{content.title}</h2>
                  {content.subtitle && <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">{content.subtitle}</p>}
                  
                  <div className="flex-1 overflow-auto bg-white/95 rounded-lg shadow border border-gray-200">
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                  {headers.map((h, i) => (
                                      <th key={i} className="p-4 font-bold text-gray-700 uppercase text-sm tracking-wider">{h}</th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {rows.map((row, rI) => (
                                  <tr key={rI} className="hover:bg-gray-50">
                                      {row.map((cell, cI) => (
                                          <td key={cI} className="p-4 text-gray-800">{cell}</td>
                                      ))}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      );
  }

  // Image Center
  if (layoutId === 'LAYOUT_IMAGE_CENTER') {
      return (
          <div className="h-full flex flex-col items-center justify-center px-12 py-10 text-center">
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{content.title}</h2>
              
              <div className="flex-1 w-full max-w-4xl relative my-6 rounded-xl overflow-hidden shadow-lg bg-gray-100">
                  {renderImage()}
              </div>

              {content.bullets.length > 0 && (
                  <div className="max-w-3xl mx-auto space-y-2">
                      {content.bullets.map((b, i) => (
                          <p key={i} className="text-lg text-gray-700 dark:text-gray-300">{b}</p>
                      ))}
                  </div>
              )}
          </div>
      );
  }

  // Summary
  if (layoutId === 'LAYOUT_SUMMARY') {
      return (
          <div className="h-full flex flex-col px-12 py-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
               {media?.url && (
                  <div className="absolute inset-0 z-0 opacity-10">
                      <img src={media.url} className="w-full h-full object-cover" />
                  </div>
              )}
              <div className="z-10 flex flex-col h-full">
                  <div className="text-center mb-12">
                      <h2 className="text-5xl font-bold mb-4 text-blue-900 dark:text-white">{content.title}</h2>
                      <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full overflow-y-auto p-4">
                      {content.bullets.map((b, i) => (
                          <div key={i} className="bg-white/90 dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">Key Point {i+1}</h3>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{b}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }
  
  // Default / Explainer / Columns
  return (
      <div className="h-full flex flex-col px-12 py-10">
          <div className="mb-8 border-b-4 border-blue-500 pb-4 flex justify-between items-end">
              <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{content.title}</h2>
                  {content.subtitle && <p className="text-xl text-gray-500 dark:text-gray-400 mt-2">{content.subtitle}</p>}
              </div>
          </div>

          <div className="flex-1 flex gap-8 min-h-0">
              <div className="flex-1 overflow-y-auto pr-2">
                 <div className="space-y-4">
                    {content.bullets.map((b, i) => (
                        <div key={i} className="flex gap-3 items-start">
                           <span className="text-blue-500 font-bold text-lg">•</span>
                           <span className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed">{b}</span>
                        </div>
                    ))}
                 </div>
                 
                 {content.columns && content.columns.length > 0 && (
                     <div className={`grid grid-cols-${content.columns.length} gap-6 mt-8`}>
                        {content.columns.map((col, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-100 dark:border-gray-700">
                                {col.header && <h4 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-300">{col.header}</h4>}
                                <ul className="space-y-2">
                                    {col.content.map((c, ii) => (
                                        <li key={ii} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="text-blue-400">-</span> {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                     </div>
                 )}
              </div>
              
              {/* Image side-panel for standard layouts if image exists */}
              {media?.url && (
                  <div className="w-1/3 h-full pl-4 border-l border-gray-100 dark:border-gray-800">
                      <div className="h-2/3 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-inner">
                          <img src={media.url} alt={media.alt} className="w-full h-full object-cover" />
                      </div>
                      {media.caption && <p className="mt-2 text-sm text-gray-500 italic">{media.caption}</p>}
                  </div>
              )}
          </div>
      </div>
  );
};

const VisualOrchestrator: React.FC<VisualOrchestratorProps> = ({
  isOpen,
  onClose,
  course,
  initialMarkdown,
  onSave
}) => {
  const { t } = useTranslation();
  const [slides, setSlides] = useState<SlideState[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);

  // Ingest content on open
  useEffect(() => {
    if (isOpen && initialMarkdown) {
      const parsed = parseSlidesFromMarkdown(initialMarkdown);
      setSlides(parsed);
      setActiveSlideIndex(0);
    }
  }, [isOpen, initialMarkdown]);

  if (!isOpen) return null;

  const activeSlide = slides[activeSlideIndex];

  const handleUpdateSlide = (id: string, updates: Partial<SlideState> | Partial<SlideState['content']>) => {
    setSlides(prev => prev.map(s => {
      if (s.id !== id) return s;
      
      // Handle nested content updates
      if ('title' in updates || 'bullets' in updates || 'subtitle' in updates || 'quote' in updates || 'bigValue' in updates) {
         return { 
           ...s, 
           content: { ...s.content, ...updates } as any, 
           metadata: { 
             ...s.metadata, 
             isManuallyEdited: true,
             isContentEdited: true
           } 
         };
      }

      // Handle Layout Update
      if ('layoutId' in updates) {
         return { 
           ...s, 
           ...updates, 
           metadata: { 
             ...s.metadata, 
             isManuallyEdited: true,
             isLayoutEdited: true
           } 
         };
      }
      
      // Default (e.g. notes, media) - assume content edit
      return { 
        ...s, 
        ...updates, 
        metadata: { 
          ...s.metadata, 
          isManuallyEdited: true,
          isContentEdited: true 
        } 
      };
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
        await exportSlidesAsPptx(course, slides);
    } catch (e) {
        console.error('Export failed:', e);
        alert('Export failed. See console for details.');
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Design Studio
          </h2>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            Beta
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('common.cancel') || 'Cancel'}
          </button>
          {onSave && (
            <button 
              onClick={() => {
                console.log('Saving slides:', slides);
                onSave(slides);
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Save size={18} />
              {t('common.save') || 'Save'}
            </button>
          )}
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            {isExporting ? 'Exporting...' : (
              <>
                <Download size={18} />
                Export PPTX
              </>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - SLIDE LIST */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slides ({slides.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {slides.map((slide, idx) => (
              <div 
                key={slide.id}
                onClick={() => setActiveSlideIndex(idx)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  idx === activeSlideIndex 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-gray-400 w-5">{idx + 1}</span>
                  <span className="text-xs font-medium truncate flex-1">{slide.content.title || 'Untitled Slide'}</span>
                </div>
                {/* Mini thumbnail placeholder */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600 overflow-hidden relative">
                   {/* Abstract representation */}
                   <div className="absolute top-2 left-2 w-3/4 h-1 bg-gray-300 rounded-full"></div>
                   <div className="absolute top-4 left-2 w-1/2 h-1 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER - WORKSPACE */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-y-auto p-8 flex flex-col items-center">
          {/* LAYOUT SELECTOR (TOP SHELF) */}
          {activeSlide && (
            <div className="w-full max-w-5xl mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
               <div className="flex items-center gap-2 mb-3">
                 <Layout size={16} className="text-gray-500"/>
                 <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Choose Layout</span>
               </div>
               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                 {/* Layout options */}
                 {Object.entries(LAYOUT_CONFIG).map(([id, config]) => {
                   const Icon = config.icon;
                   return (
                   <button
                     key={id}
                     onClick={() => handleUpdateSlide(activeSlide.id, { layoutId: id as any })}
                     className={`flex-shrink-0 w-24 h-16 rounded border flex flex-col items-center justify-center gap-1 transition-all ${
                       activeSlide.layoutId === id 
                         ? 'border-blue-500 bg-blue-50 text-blue-700' 
                         : 'border-gray-200 hover:border-gray-300 text-gray-500'
                     }`}
                     title={t(config.labelKey)}
                   >
                     <div className="w-8 h-5 flex items-center justify-center">
                        <Icon className="w-full h-full opacity-80" />
                     </div>
                     <span className="text-[10px] font-medium truncate w-full text-center px-1">
                       {t(config.labelKey)}
                     </span>
                   </button>
                   );
                 })}
               </div>
            </div>
          )}

          {/* MEDIA & VISUALS */}
          {activeSlide && (
            <div className="w-full max-w-5xl mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
               <div className="flex items-center gap-2">
                 <ImageIcon size={16} className="text-gray-500"/>
                 <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Media</span>
               </div>
               
               <div className="flex flex-wrap items-center gap-4">
                  {activeSlide.metadata.visualSearchTerm && (
                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
                          <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">Suggestion:</span>
                          <span className="text-xs text-gray-600 dark:text-gray-300 italic truncate max-w-[200px]" title={activeSlide.metadata.visualSearchTerm}>
                            {activeSlide.metadata.visualSearchTerm}
                          </span>
                          <button 
                             onClick={() => setShowImageSearch(true)}
                             className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors font-medium"
                          >
                             Search
                          </button>
                      </div>
                  )}
                  
                  <button
                    onClick={() => setShowImageSearch(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    {activeSlide.media?.url ? 'Change Image' : 'Add Image'}
                  </button>
               </div>
            </div>
          )}

          {/* SLIDE CANVAS */}
          {activeSlide && (
            <div className="w-full max-w-5xl aspect-video bg-white shadow-2xl rounded-lg overflow-hidden relative group">
               {/* This is where the Visual Renderer goes */}
               <div className="absolute inset-0 flex flex-col bg-white dark:bg-gray-900">
                  <SlideRenderer slide={activeSlide} />
                  
                  {/* Layout specific Debug Info */}
                  <div className="absolute bottom-4 right-4 text-xs text-gray-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {activeSlide.layoutId}
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* RIGHT/BOTTOM - SPEAKER NOTES (Optional, or placed below slide) */}
      {showImageSearch && activeSlide && (
        <ImageSearchModal
          initialQuery={activeSlide.metadata.visualSearchTerm}
          onClose={() => setShowImageSearch(false)}
          onInsert={(url, alt) => {
             handleUpdateSlide(activeSlide.id, {
                media: {
                   url,
                   alt: alt || activeSlide.metadata.visualSearchTerm || 'Slide Image',
                   position: 'right'
                }
             });
          }}
        />
      )}
      </div>
    </div>
  );
};

export default VisualOrchestrator;
