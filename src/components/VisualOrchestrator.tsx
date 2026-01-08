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
      <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
        <ImageIcon size={24} className="mb-2 opacity-50" />
        <span className="text-[10px] font-medium uppercase tracking-wider">No Image</span>
      </div>
    );
    return <img src={media.url} alt={media.alt || 'Slide Image'} className="w-full h-full object-cover rounded-2xl shadow-sm" />;
  };

  // Refined Typography - Smaller, Modern, Fluid
  // Updated to prevent title taking 50% of slide (lg:text-3xl instead of 4xl, lg:text-xl instead of 2xl)
  const h1Class = "text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-5 text-gray-900 dark:text-white leading-tight tracking-tight";
  const h2Class = "text-lg md:text-xl lg:text-xl font-bold mb-2 md:mb-4 text-gray-900 dark:text-white leading-tight tracking-tight";
  const pClass = "text-[11px] md:text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-2 md:mb-4 leading-relaxed";
  const liClass = "text-[10px] md:text-sm lg:text-sm text-gray-700 dark:text-gray-200 leading-relaxed";

  // Title / Centered Layouts
  if (['LAYOUT_TITLE', 'LAYOUT_BIG_NUMBER', 'LAYOUT_QUOTE', 'LAYOUT_SECTION_HEADER'].includes(layoutId)) {
     return (
       <div className="h-full flex flex-col items-center justify-center text-center px-4 md:px-16 relative overflow-hidden">
          {media?.url && layoutId === 'LAYOUT_TITLE' && (
             <div className="absolute inset-0 opacity-10 z-0">
                <img src={media.url} className="w-full h-full object-cover" />
             </div>
          )}
          
          <div className="z-10 relative w-full max-w-4xl mx-auto">
              <h1 className={h1Class}>{content.title}</h1>
              {content.subtitle && <p className={`${pClass} max-w-2xl mx-auto opacity-90`}>{content.subtitle}</p>}
              
              {layoutId === 'LAYOUT_QUOTE' && content.quote && (
                   <blockquote className="text-sm md:text-xl lg:text-xl italic text-blue-600 dark:text-blue-400 max-w-3xl mx-auto leading-relaxed font-serif border-l-4 border-blue-200 pl-4 my-4">
                     "{content.quote.text}"
                     <footer className="text-[10px] md:text-sm mt-2 font-semibold text-gray-500 dark:text-gray-400 not-italic sans-serif">— {content.quote.author}</footer>
                   </blockquote>
              )}

              {layoutId === 'LAYOUT_BIG_NUMBER' && content.bigValue && (
                  <div className="my-2 md:my-6 transform hover:scale-105 transition-transform duration-500">
                      <div className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tighter drop-shadow-sm">{content.bigValue}</div>
                      <div className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1 font-medium">{content.bigLabel}</div>
                  </div>
              )}
          </div>
       </div>
     );
  }

  // Split Left (Image Left)
  if (['LAYOUT_IMAGE_LEFT', 'LAYOUT_CASE_STUDY'].includes(layoutId)) {
      return (
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center px-4 md:px-10 py-4 md:py-8">
             <div className="h-32 md:h-4/5 order-2 md:order-1 rounded-2xl overflow-hidden shadow-sm">{renderImage()}</div>
             <div className="flex flex-col justify-center order-1 md:order-2">
                <h2 className={h2Class}>{content.title}</h2>
                {content.subtitle && <p className={pClass}>{content.subtitle}</p>}
                <div className="space-y-1 md:space-y-2">
                    {content.bullets.map((b, i) => (
                        <div key={i} className="flex gap-2 items-start">
                           <span className="text-blue-500 text-xs md:text-lg mt-0.5">•</span>
                           <span className={liClass}>{b}</span>
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
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center px-4 md:px-10 py-4 md:py-8">
             <div className="flex flex-col justify-center">
                <h2 className={h2Class}>{content.title}</h2>
                {content.subtitle && <p className={pClass}>{content.subtitle}</p>}
                <div className="space-y-1 md:space-y-2">
                    {content.bullets.map((b, i) => (
                        <div key={i} className="flex gap-2 items-start">
                           <span className="text-blue-500 text-xs md:text-lg mt-0.5">•</span>
                           <span className={liClass}>{b}</span>
                        </div>
                    ))}
                </div>
             </div>
             <div className="h-32 md:h-4/5 rounded-2xl overflow-hidden shadow-sm">{renderImage()}</div>
          </div>
      );
  }
  
  // Full Image
  if (layoutId === 'LAYOUT_FULL_IMAGE') {
      return (
        <div className="h-full w-full relative group">
           {media?.url ? (
               <img src={media.url} alt={media.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
           ) : (
               <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                   <ImageIcon size={32} className="text-gray-300" />
               </div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-end md:justify-center text-center px-4 md:px-16 pb-6 md:pb-0">
               <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-white drop-shadow-lg tracking-tight">{content.title}</h1>
               {content.subtitle && <p className="text-xs md:text-base lg:text-lg text-gray-100 drop-shadow-md max-w-3xl mx-auto font-light">{content.subtitle}</p>}
           </div>
        </div>
      );
  }

  // Comparisons / DoDont
  if (layoutId === 'LAYOUT_COMPARISON' || layoutId === 'LAYOUT_DO_DONT') {
      const isDoDont = layoutId === 'LAYOUT_DO_DONT';
      return (
          <div className="h-full flex flex-col px-4 md:px-12 py-4 md:py-8">
              <h2 className={`${h2Class} text-center`}>{content.title}</h2>
              <div className="flex-1 grid grid-cols-2 gap-3 md:gap-6 overflow-hidden">
                  {/* Left Column */}
                  <div className={`p-3 md:p-5 rounded-2xl ${isDoDont ? 'bg-green-50/50 border border-green-200/50' : 'bg-gray-50/50 border border-gray-200/50'} overflow-y-auto backdrop-blur-sm`}>
                      <h3 className={`text-[10px] md:text-lg font-bold mb-2 md:mb-3 ${isDoDont ? 'text-green-700' : 'text-gray-800'}`}>
                          {isDoDont ? 'DO' : (content.columns?.[0]?.header || 'Option A')}
                      </h3>
                      <ul className="space-y-1.5 md:space-y-2">
                          {(content.columns?.[0]?.content || content.bullets.slice(0, Math.ceil(content.bullets.length/2))).map((b, i) => (
                              <li key={i} className={`flex gap-1.5 text-[10px] md:text-sm ${isDoDont ? 'text-green-900' : 'text-gray-700'}`}>
                                  <span className={isDoDont ? 'text-green-600' : 'text-blue-500'}>✓</span> {b}
                              </li>
                          ))}
                      </ul>
                  </div>
                  {/* Right Column */}
                  <div className={`p-3 md:p-5 rounded-2xl ${isDoDont ? 'bg-red-50/50 border border-red-200/50' : 'bg-gray-50/50 border border-gray-200/50'} overflow-y-auto backdrop-blur-sm`}>
                      <h3 className={`text-[10px] md:text-lg font-bold mb-2 md:mb-3 ${isDoDont ? 'text-red-700' : 'text-gray-800'}`}>
                          {isDoDont ? 'DON\'T' : (content.columns?.[1]?.header || 'Option B')}
                      </h3>
                      <ul className="space-y-1.5 md:space-y-2">
                          {(content.columns?.[1]?.content || content.bullets.slice(Math.ceil(content.bullets.length/2))).map((b, i) => (
                              <li key={i} className={`flex gap-1.5 text-[10px] md:text-sm ${isDoDont ? 'text-red-900' : 'text-gray-700'}`}>
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
          <div className="h-full flex flex-col px-4 md:px-12 py-4 md:py-8">
              <h2 className={`${h2Class} text-center`}>{content.title}</h2>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 overflow-y-auto">
                  {[0, 1, 2].map(idx => {
                      const col = content.columns?.[idx];
                      const bullets = col?.content || [];
                      const displayBullets = bullets.length ? bullets : content.bullets.filter((_, i) => i % 3 === idx);

                      return (
                        <div key={idx} className="p-3 md:p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex flex-col hover:bg-white hover:shadow-sm transition-all">
                            <h3 className="text-xs md:text-base font-bold mb-2 text-blue-900">{col?.header || `Column ${idx+1}`}</h3>
                            <ul className="space-y-1 md:space-y-2 flex-1">
                                {displayBullets.map((b, ii) => (
                                    <li key={ii} className="text-[10px] md:text-xs text-gray-700 leading-relaxed">• {b}</li>
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
          <div className="h-full flex flex-col px-4 md:px-12 py-4 md:py-8 relative overflow-hidden">
              {media?.url && (
                  <div className="absolute inset-0 z-0 opacity-10">
                      <img src={media.url} className="w-full h-full object-cover" />
                  </div>
              )}
              <div className="z-10 flex flex-col h-full">
                  <h2 className={h2Class}>{content.title}</h2>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 overflow-y-auto content-start">
                      {content.bullets.map((b, i) => (
                          <div key={i} className="p-2 md:p-4 bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 rounded-xl flex flex-col gap-1.5 hover:shadow-md transition-all hover:-translate-y-0.5">
                              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px] md:text-xs shrink-0">
                                  {i+1}
                              </div>
                              <p className="text-gray-700 text-[10px] md:text-sm leading-relaxed">{b}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // Timeline
  if (layoutId === 'LAYOUT_TIMELINE') {
      const contentArea = (
        <div className="flex-1 relative pl-4 md:pl-8 border-l-2 border-blue-200 space-y-3 md:space-y-6 overflow-y-auto py-2">
            {content.bullets.map((b, i) => (
                <div key={i} className="relative pl-3 md:pl-6">
                    <div className="absolute -left-[23px] md:-left-[41px] top-1 w-3 h-3 md:w-6 md:h-6 rounded-full bg-blue-500 border-2 md:border-4 border-white shadow-sm ring-1 ring-blue-100"></div>
                    <div className="bg-gray-50 p-2 md:p-4 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-colors">
                        <p className="text-[10px] md:text-sm text-gray-800">{b}</p>
                    </div>
                </div>
            ))}
        </div>
      );

      if (media?.url) {
          return (
              <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-4 md:px-12 py-4 md:py-8">
                  <div className="flex flex-col h-full">
                      <h2 className={h2Class}>{content.title}</h2>
                      <div className="flex-1 rounded-2xl overflow-hidden relative shadow-sm min-h-[120px]">
                          <img src={media.url} alt={media.alt} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                  </div>
                  {contentArea}
              </div>
          );
      }
      
      return (
          <div className="h-full flex flex-col px-4 md:px-12 py-4 md:py-8">
              <h2 className={h2Class}>{content.title}</h2>
              {contentArea}
          </div>
      );
  }

  // Checklist
  if (layoutId === 'LAYOUT_CHECKLIST') {
      return (
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 px-4 md:px-12 py-4 md:py-8 items-center">
              <div className="flex flex-col h-full justify-center">
                  <h2 className={h2Class}>{content.title}</h2>
                  {content.subtitle && <p className={pClass}>{content.subtitle}</p>}
                  {media?.url && (
                      <div className="mt-2 md:mt-4 rounded-2xl overflow-hidden shadow-sm flex-1 max-h-56 relative">
                          <img src={media.url} alt={media.alt} className="w-full h-full object-cover" />
                      </div>
                  )}
              </div>
              <div className="bg-white p-3 md:p-6 rounded-2xl shadow-sm border border-gray-100 max-h-full overflow-y-auto">
                  <ul className="space-y-2 md:space-y-3">
                      {content.bullets.map((b, i) => (
                          <li key={i} className="flex items-center gap-2 md:gap-3">
                              <div className="w-4 h-4 md:w-5 md:h-5 rounded border-2 border-blue-500 flex items-center justify-center text-blue-500 shrink-0">
                                  ✓
                              </div>
                              <span className="text-xs md:text-base text-gray-700">{b}</span>
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
          <div className="h-full flex flex-col px-4 md:px-16 py-4 md:py-10 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
               {media?.url && (
                  <div className="absolute inset-0 z-0 opacity-5">
                      <img src={media.url} className="w-full h-full object-cover" />
                  </div>
              )}
              <div className="z-10 flex flex-col h-full">
                  <h2 className={`${h2Class} text-center border-b pb-2 md:pb-4`}>{content.title}</h2>
                  <div className="flex-1 space-y-2 md:space-y-4 max-w-2xl mx-auto w-full overflow-y-auto py-2 md:py-4">
                      {content.bullets.map((b, i) => (
                          <div key={i} className="flex items-center gap-3 md:gap-5 p-2 md:p-4 bg-white/95 rounded-xl shadow-sm border border-gray-100/50">
                              <span className="text-xl md:text-3xl font-black text-blue-200">{(i+1).toString().padStart(2, '0')}</span>
                              <span className="text-xs md:text-lg font-medium text-gray-800">{b}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  // Table
  if (layoutId === 'LAYOUT_TABLE') {
      const headers = content.table?.headers?.length ? content.table.headers : ['Item', 'Description'];
      const rows = content.table?.rows?.length 
          ? content.table.rows 
          : content.bullets.map(b => b.includes('|') ? b.split('|').map(s => s.trim()) : [b, '']);

      return (
          <div className="h-full flex flex-col px-4 md:px-12 py-4 md:py-8 relative overflow-hidden">
               {media?.url && (
                  <div className="absolute inset-0 z-0 opacity-10">
                      <img src={media.url} className="w-full h-full object-cover" />
                  </div>
              )}
              <div className="z-10 flex flex-col h-full">
                  <h2 className={h2Class}>{content.title}</h2>
                  {content.subtitle && <p className={pClass}>{content.subtitle}</p>}
                  
                  <div className="flex-1 overflow-auto bg-white/95 rounded-xl shadow-sm border border-gray-200">
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                  {headers.map((h, i) => (
                                      <th key={i} className="p-2 md:p-3 font-bold text-gray-700 uppercase text-[10px] md:text-xs tracking-wider">{h}</th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {rows.map((row, rI) => (
                                  <tr key={rI} className="hover:bg-gray-50">
                                      {row.map((cell, cI) => (
                                          <td key={cI} className="p-2 md:p-3 text-[10px] md:text-sm text-gray-800">{cell}</td>
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
          <div className="h-full flex flex-col items-center justify-center px-4 md:px-12 py-4 md:py-8 text-center">
              <h2 className={h2Class}>{content.title}</h2>
              
              <div className="flex-1 w-full max-w-3xl relative my-3 md:my-5 rounded-2xl overflow-hidden shadow-sm bg-gray-100">
                  {renderImage()}
              </div>

              {content.bullets.length > 0 && (
                  <div className="max-w-3xl mx-auto space-y-1">
                      {content.bullets.map((b, i) => (
                          <p key={i} className="text-xs md:text-base text-gray-700 dark:text-gray-300">{b}</p>
                      ))}
                  </div>
              )}
          </div>
      );
  }

  // Summary
  if (layoutId === 'LAYOUT_SUMMARY') {
      return (
          <div className="h-full flex flex-col px-4 md:px-12 py-4 md:py-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
               {media?.url && (
                  <div className="absolute inset-0 z-0 opacity-10">
                      <img src={media.url} className="w-full h-full object-cover" />
                  </div>
              )}
              <div className="z-10 flex flex-col h-full">
                  <div className="text-center mb-4 md:mb-8">
                      <h2 className="text-2xl md:text-4xl font-bold mb-2 text-blue-900 dark:text-white">{content.title}</h2>
                      <div className="w-12 md:w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 max-w-4xl mx-auto w-full overflow-y-auto p-2">
                      {content.bullets.map((b, i) => (
                          <div key={i} className="bg-white/90 dark:bg-gray-800 p-3 md:p-5 rounded-2xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all">
                              <h3 className="font-bold text-xs md:text-base text-gray-900 dark:text-gray-100 mb-1">Key Point {i+1}</h3>
                              <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{b}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  }
  
  // Default / Explainer / Columns
  return (
      <div className="h-full flex flex-col px-4 md:px-10 py-4 md:py-8">
          <div className="mb-3 md:mb-6 border-b-2 md:border-b-4 border-blue-500 pb-2 md:pb-3 flex justify-between items-end">
              <div>
                  <h2 className={h2Class}>{content.title}</h2>
                  {content.subtitle && <p className="text-xs md:text-lg text-gray-500 dark:text-gray-400 mt-1">{content.subtitle}</p>}
              </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-8 min-h-0">
              <div className="flex-1 overflow-y-auto pr-1 md:pr-2">
                 <div className="space-y-1.5 md:space-y-3">
                    {content.bullets.map((b, i) => (
                        <div key={i} className="flex gap-2 items-start">
                           <span className="text-blue-500 font-bold text-sm md:text-lg">•</span>
                           <span className={liClass}>{b}</span>
                        </div>
                    ))}
                 </div>
                 
                 {content.columns && content.columns.length > 0 && (
                     <div className={`grid grid-cols-1 md:grid-cols-${content.columns.length} gap-3 md:gap-6 mt-3 md:mt-6`}>
                        {content.columns.map((col, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-2 md:p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                {col.header && <h4 className="font-bold text-xs md:text-base mb-1 md:mb-2 text-blue-900 dark:text-blue-300">{col.header}</h4>}
                                <ul className="space-y-1">
                                    {col.content.map((c, ii) => (
                                        <li key={ii} className="flex gap-2 text-[10px] md:text-xs text-gray-700 dark:text-gray-300">
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
                  <div className="w-full md:w-1/3 h-32 md:h-full pl-0 md:pl-4 border-l-0 md:border-l border-gray-100 dark:border-gray-800 mt-3 md:mt-0">
                      <div className="h-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-inner">
                          <img src={media.url} alt={media.alt} className="w-full h-full object-cover" />
                      </div>
                      {media.caption && <p className="mt-2 text-[10px] text-gray-500 italic">{media.caption}</p>}
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
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-[100] flex flex-col overflow-hidden font-sans">
      {/* HEADER - Slimmer & Modern */}
      <header className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 md:px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-blue-600 text-white p-1 rounded-md shadow-sm">
             <Layout size={16} />
          </div>
          <h2 className="text-sm font-bold text-gray-800 dark:text-white hidden sm:block tracking-tight">
            Design Studio
          </h2>
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[9px] font-bold tracking-wider uppercase">
            Beta
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('common.cancel') || 'Cancel'}
          </button>
          
          {onSave && (
            <button 
              onClick={() => onSave(slides)}
              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Save size={12} />
              {t('common.save') || 'Save'}
            </button>
          )}
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95"
          >
            {isExporting ? '...' : (
              <>
                <Download size={12} />
                <span className="hidden sm:inline">Export PPTX</span>
                <span className="sm:hidden">PPTX</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* MAIN BODY - Optimized for Mobile (Vertical Stack) & Desktop (3-Column) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT SIDEBAR - SLIDES */}
        {/* Desktop: Vertical Left Sidebar. Mobile: Bottom Horizontal Strip (Moved to bottom of markup visually via order-last on mobile) */}
        {/* Reduced width from w-48 to w-40 (160px) to save space */}
        {/* Increased mobile height from h-20 to h-32 to make it more usable as requested */}
        <div className="order-3 lg:order-1 w-full lg:w-40 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-r border-gray-200 dark:border-gray-700 flex flex-row lg:flex-col h-32 lg:h-auto shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none">
          <div className="hidden lg:flex p-3 border-b border-gray-200 dark:border-gray-700 items-center justify-between">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Layout size={10} /> Slides ({slides.length})
            </h3>
          </div>
          <div className="flex-1 overflow-x-auto lg:overflow-y-auto p-2 flex lg:flex-col gap-2 scrollbar-thin lg:scrollbar-thin [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-thumb]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full">
            {slides.map((slide, idx) => (
              <div 
                key={slide.id}
                onClick={() => setActiveSlideIndex(idx)}
                className={`flex-shrink-0 lg:flex-shrink w-28 lg:w-auto p-1.5 rounded-lg border cursor-pointer transition-all group ${
                  idx === activeSlideIndex 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500 shadow-sm' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-mono text-gray-400 w-3">{idx + 1}</span>
                  <span className="text-[10px] font-medium truncate flex-1 text-gray-700 dark:text-gray-300">{slide.content.title || 'Untitled'}</span>
                </div>
                {/* Mini thumbnail */}
                <div className={`aspect-video bg-white dark:bg-gray-900 rounded border overflow-hidden relative ${
                    idx === activeSlideIndex ? 'border-blue-200' : 'border-gray-100 dark:border-gray-600'
                }`}>
                   <div className="absolute top-1 left-1 w-3/4 h-0.5 bg-gray-200 rounded-full"></div>
                   <div className="absolute top-2 left-1 w-1/2 h-0.5 bg-gray-100 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER - CANVAS */}
        {/* Reduced padding (lg:p-6 -> lg:p-4) to maximize canvas space */}
        {/* Mobile: Removed flex-1 so it doesn't force a gap between slide and tools. Added shrink-0. */}
        <div className="order-1 lg:order-2 w-full lg:flex-1 shrink-0 bg-gray-100/50 dark:bg-gray-900 overflow-y-auto p-2 lg:p-4 flex flex-col items-center justify-start lg:justify-center relative">
            
            {/* Slide Canvas - Expanded max-width */}
            <div className="w-full max-w-7xl">
                {activeSlide ? (
                    <div className="w-full aspect-video bg-white shadow-2xl rounded-xl overflow-hidden relative group ring-1 ring-black/5 mx-auto">
                        <div className="absolute inset-0 flex flex-col bg-white dark:bg-gray-900">
                            <SlideRenderer slide={activeSlide} />
                            
                            {/* Hover Overlay Info */}
                            <div className="absolute top-2 right-2 md:top-4 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-[9px] md:text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
                                {activeSlide.layoutId}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                        No slide selected
                    </div>
                )}
            </div>

            {/* Mobile-only Hint */}
            <div className="lg:hidden mt-2 text-[10px] text-gray-400 font-medium text-center">
                Use tools below to edit • Scroll right for more slides
            </div>
        </div>

        {/* RIGHT SIDEBAR - TOOLS */}
        {/* Desktop: Right Vertical. Mobile: Below Canvas (Order 2) */}
        {/* Extremely narrow width (w-28) to maximize canvas */}
        <div className="order-2 lg:order-3 w-full lg:w-28 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 flex flex-col lg:shrink-0 flex-1 lg:flex-none h-auto lg:h-auto overflow-y-auto z-10 lg:max-h-none scrollbar-thin [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-transparent">
            
            {/* 1. Layout Selector */}
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1.5 mb-2 justify-center">
                    <div className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Layout size={12} />
                    </div>
                </div>
                
                {/* 2 Columns - Taller grid, larger icons */}
                <div className="grid grid-cols-2 gap-1.5">
                    {Object.entries(LAYOUT_CONFIG).map(([id, config]) => {
                        const Icon = config.icon;
                        const isActive = activeSlide?.layoutId === id;
                        return (
                            <button
                                key={id}
                                onClick={() => activeSlide && handleUpdateSlide(activeSlide.id, { layoutId: id as any })}
                                className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-1 transition-all p-1 hover:shadow-md ${
                                    isActive 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500 scale-105 z-10' 
                                    : 'border-gray-100 hover:border-gray-300 text-gray-500 bg-gray-50/50'
                                }`}
                                title={t(config.labelKey)}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Media Selector */}
            <div className="p-2 mt-auto">
                <div className="flex items-center gap-1.5 mb-2 justify-center">
                    <div className="w-5 h-5 rounded bg-pink-50 text-pink-600 flex items-center justify-center">
                        <ImageIcon size={12} />
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-1.5 border border-gray-100 dark:border-gray-700 space-y-2">
                    {activeSlide?.media?.url ? (
                        <div className="relative aspect-square rounded-md overflow-hidden group">
                            <img src={activeSlide.media.url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => setShowImageSearch(true)}
                                    className="px-2 py-1 bg-white/90 text-gray-900 rounded-full text-[9px] font-bold shadow-lg hover:bg-white"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowImageSearch(true)}
                            className="w-full aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-blue-400 hover:text-blue-500 transition-all"
                        >
                            <ImageIcon size={20} className="mb-1" />
                            <span className="text-[9px] font-medium text-center leading-tight">Add<br/>Image</span>
                        </button>
                    )}

                    {activeSlide?.metadata.visualSearchTerm && (
                        <button 
                            onClick={() => setShowImageSearch(true)}
                            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[9px] font-medium transition-colors flex items-center justify-center gap-1"
                            title={activeSlide.metadata.visualSearchTerm}
                        >
                            <span>AI Search</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>

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
  );
};

export default VisualOrchestrator;
