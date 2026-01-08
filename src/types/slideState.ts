export type SlideLayoutId = 
  | 'LAYOUT_TITLE' 
  | 'LAYOUT_EXPLAINER' 
  | 'LAYOUT_IMAGE_TEXT' 
  | 'LAYOUT_IMAGE_LEFT' 
  | 'LAYOUT_IMAGE_RIGHT' 
  | 'LAYOUT_FULL_IMAGE' 
  | 'LAYOUT_QUOTE' 
  | 'LAYOUT_BIG_NUMBER' 
  | 'LAYOUT_THREE_COL' 
  | 'LAYOUT_COMPARISON' 
  | 'LAYOUT_TIMELINE' 
  | 'LAYOUT_GRID_CARDS' 
  | 'LAYOUT_SECTION_HEADER' 
  | 'LAYOUT_CHECKLIST' 
  | 'LAYOUT_DO_DONT' 
  | 'LAYOUT_TABLE' 
  | 'LAYOUT_IMAGE_CENTER' 
  | 'LAYOUT_EXERCISE' 
  | 'LAYOUT_AGENDA' 
  | 'LAYOUT_SUMMARY' 
  | 'LAYOUT_CASE_STUDY';

export interface SlideState {
  /** Unique identifier for the slide instance in the orchestrator */
  id: string;
  
  /** The chosen layout template */
  layoutId: SlideLayoutId;
  
  /** 
   * Primary content payload. 
   * Structure depends on layout, but we aim for a unified schema where possible.
   */
  content: {
    /** Main title of the slide */
    title: string;
    
    /** Secondary text (subtitle, explanation, etc.) */
    subtitle?: string;
    
    /** Main body text (standard bullets) */
    bullets: string[];
    
    /** 
     * Structured data for complex layouts (Comparison, Columns, etc.)
     */
    columns?: {
        header?: string;
        content: string[];
        type?: 'positive' | 'negative' | 'neutral'; // For Do/Dont
    }[]; 
    
    /** Highlighted text for quotes or big stats */
    bigValue?: string; 
    
    /** Label for the highlight (e.g. "95%" -> "Success Rate") */
    bigLabel?: string;
    
    /** Quote specific data */
    quote?: {
      text: string;
      author: string;
    };
    
    /** Table specific data */
    table?: {
      headers: string[];
      rows: string[][];
    };
  };
  
  /** Image configuration */
  media?: {
    url: string;
    alt?: string;
    caption?: string;
    position?: 'left' | 'right' | 'center' | 'background';
  };
  
  /** Speaker notes (editable in orchestrator) */
  speakerNotes: string;
  
  /** Metadata for system use */
  metadata: {
    originalIndex: number;
    isManuallyEdited: boolean;
    isContentEdited?: boolean;
    isLayoutEdited?: boolean;
    visualSearchTerm?: string;
  };
}
