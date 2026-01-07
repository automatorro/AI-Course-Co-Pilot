import { SlideDesignJSON } from '../../services/presentationAiService'

export enum ContentClass {
  TextOnly = 'TextOnly',
  ImageText = 'ImageText',
  Quote = 'Quote',
  BigStat = 'BigStat',
  Timeline = 'Timeline',
  Comparison = 'Comparison'
}

export type Layout = SlideDesignJSON['layout']

type SlotSpec = {
  allowsBullets: boolean
  requiresImage: boolean
  allowsQuote: boolean
  allowsSteps: boolean
}

const LAYOUT_SPEC: Record<Layout, SlotSpec> = {
  DEFAULT: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
  HERO: { allowsBullets: false, requiresImage: false, allowsQuote: false, allowsSteps: false },
  SPLIT_LEFT: { allowsBullets: true, requiresImage: true, allowsQuote: false, allowsSteps: false },
  SPLIT_RIGHT: { allowsBullets: true, requiresImage: true, allowsQuote: false, allowsSteps: false },
  BIG_STAT: { allowsBullets: false, requiresImage: false, allowsQuote: false, allowsSteps: false },
  COMPARISON: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
  QUOTATION: { allowsBullets: false, requiresImage: false, allowsQuote: true, allowsSteps: false },
  TRIAD: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
  TIMELINE: { allowsBullets: false, requiresImage: false, allowsQuote: false, allowsSteps: true },
  FULL_IMAGE: { allowsBullets: false, requiresImage: true, allowsQuote: false, allowsSteps: false },
  GRID_CARDS: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
  IMAGE_CENTER: { allowsBullets: false, requiresImage: true, allowsQuote: false, allowsSteps: false },
  THREE_COLUMNS: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
  SECTION_HEADER: { allowsBullets: false, requiresImage: false, allowsQuote: false, allowsSteps: false },
  CHECKLIST: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
  DO_DONT: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
  PROCESS_STEPS: { allowsBullets: false, requiresImage: false, allowsQuote: false, allowsSteps: true },
  KEY_TAKEAWAYS: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
  DATA_POINTS: { allowsBullets: false, requiresImage: false, allowsQuote: false, allowsSteps: false },
  QUOTE_CENTER: { allowsBullets: false, requiresImage: false, allowsQuote: true, allowsSteps: false },
  TABLE_SIMPLE: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
  IMAGE_SIDEBAR: { allowsBullets: true, requiresImage: true, allowsQuote: false, allowsSteps: false },
  AGENDA_COMPACT: { allowsBullets: true, requiresImage: false, allowsQuote: false, allowsSteps: false },
}

const CLASS_LAYOUTS: Record<ContentClass, Layout[]> = {
  [ContentClass.TextOnly]: ['DEFAULT','TRIAD','THREE_COLUMNS','SECTION_HEADER','CHECKLIST','KEY_TAKEAWAYS','GRID_CARDS','AGENDA_COMPACT','TABLE_SIMPLE','COMPARISON','DATA_POINTS'],
  [ContentClass.ImageText]: ['SPLIT_LEFT','SPLIT_RIGHT','IMAGE_CENTER','IMAGE_SIDEBAR','FULL_IMAGE','HERO'],
  [ContentClass.Quote]: ['QUOTATION','QUOTE_CENTER'],
  [ContentClass.BigStat]: ['BIG_STAT','DATA_POINTS'],
  [ContentClass.Timeline]: ['TIMELINE','PROCESS_STEPS'],
  [ContentClass.Comparison]: ['COMPARISON','TABLE_SIMPLE']
}

export type SemanticValidation = {
  ok: boolean
  blocking: boolean
  errors: string[]
  contentClass: ContentClass
  compatibleLayouts: Layout[]
}

const seemsQuote = (d: SlideDesignJSON) => ['QUOTATION','QUOTE_CENTER'].includes(d.layout)
const seemsTimeline = (d: SlideDesignJSON) => ['TIMELINE','PROCESS_STEPS'].includes(d.layout)
const seemsBigStat = (d: SlideDesignJSON) => d.layout === 'BIG_STAT' || d.layout === 'DATA_POINTS'
const seemsComparison = (d: SlideDesignJSON) => d.layout === 'COMPARISON' || d.layout === 'TABLE_SIMPLE'
const seemsImageAnchor = (d: SlideDesignJSON) => ['HERO','FULL_IMAGE','IMAGE_CENTER'].includes(d.layout)

export const detectContentClass = (d: SlideDesignJSON, hasImage: boolean): ContentClass => {
  if (seemsQuote(d)) return ContentClass.Quote
  if (seemsTimeline(d)) return ContentClass.Timeline
  if (seemsBigStat(d)) return ContentClass.BigStat
  if (seemsComparison(d)) return ContentClass.Comparison
  const hasBullets = (d.content || []).length > 0
  if (hasBullets && hasImage) return ContentClass.ImageText
  if (hasBullets && !hasImage) return ContentClass.TextOnly
  if (seemsImageAnchor(d)) return ContentClass.ImageText
  return ContentClass.TextOnly
}

export const validateSemantic = (d: SlideDesignJSON, hasImage: boolean): SemanticValidation => {
  const errors: string[] = []
  const cls = detectContentClass(d, hasImage)
  const spec = LAYOUT_SPEC[d.layout]
  const bullets = (d.content || [])
  const hasBullets = bullets.length > 0

  if (spec.requiresImage && !hasImage) {
    errors.push('[WARN] Layoutul curent necesită imagine, dar nu există (se va folosi placeholder).')
  }
  if (!spec.allowsBullets && hasBullets) {
    errors.push('[WARN] Layoutul curent nu acceptă conținut textual/bullets (se va forța afișarea).')
  }
  if (spec.allowsSteps === false && (d.layout === 'TIMELINE' || d.layout === 'PROCESS_STEPS')) {
    // handled above, but keep consistency
  }
  const compatibleLayouts = CLASS_LAYOUTS[cls]
  const blocking = errors.some(e => e.startsWith('[BLOCK]'))
  const ok = errors.length === 0
  return { ok, blocking, errors, contentClass: cls, compatibleLayouts }
}

export const pickCompatibleLayout = (current: Layout, cls: ContentClass): Layout => {
  const allowed = CLASS_LAYOUTS[cls]
  if (allowed.includes(current)) return current
  return allowed[0]
}

