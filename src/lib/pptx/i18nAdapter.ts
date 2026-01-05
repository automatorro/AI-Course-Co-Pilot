export type ExportContext = {
  text: string
  isNotes?: boolean
}

export type ExportStyle = {
  fontFace: string
  rtl: boolean
  align: 'left' | 'right' | 'center'
  maxCharsPerLine: number
}

function detectScript(text: string): 'arabic' | 'hebrew' | 'cjk' | 'devanagari' | 'thai' | 'cyrillic' | 'latin' {
  if (/[؀-ۿ]/.test(text)) return 'arabic'
  if (/[\u0590-\u05FF]/.test(text)) return 'hebrew'
  if (/[\u4E00-\u9FFF]/.test(text)) return 'cjk'
  if (/[\u0900-\u097F]/.test(text)) return 'devanagari'
  if (/[\u0E00-\u0E7F]/.test(text)) return 'thai'
  if (/[\u0400-\u04FF]/.test(text)) return 'cyrillic'
  return 'latin'
}

const SCRIPT_STYLE: Record<string, ExportStyle> = {
  latin: { fontFace: 'Calibri', rtl: false, align: 'left', maxCharsPerLine: 90 },
  cyrillic: { fontFace: 'Calibri', rtl: false, align: 'left', maxCharsPerLine: 80 },
  cjk: { fontFace: 'MS Gothic', rtl: false, align: 'left', maxCharsPerLine: 45 },
  arabic: { fontFace: 'Arial', rtl: true, align: 'right', maxCharsPerLine: 55 },
  hebrew: { fontFace: 'Arial', rtl: true, align: 'right', maxCharsPerLine: 55 },
  thai: { fontFace: 'Tahoma', rtl: false, align: 'left', maxCharsPerLine: 60 },
  devanagari: { fontFace: 'Mangal', rtl: false, align: 'left', maxCharsPerLine: 65 }
}

function normalizeText(text: string) {
  return text
    .normalize('NFC')
    .replace(/\p{Extended_Pictographic}/gu, '')
}

function wrapText(text: string, max: number) {
  const words = text.split(' ')
  let line = ''
  const lines: string[] = []
  for (const w of words) {
    if ((line + w).length > max) {
      lines.push(line.trim())
      line = w + ' '
    } else {
      line += w + ' '
    }
  }
  if (line) lines.push(line.trim())
  return lines.join('\n')
}

export function adaptForPptx(ctx: ExportContext) {
  let text = normalizeText(ctx.text)
  const script = detectScript(text)
  const style = SCRIPT_STYLE[script]
  if (!ctx.isNotes) {
    text = wrapText(text, style.maxCharsPerLine)
  }
  return {
    text,
    fontFace: style.fontFace,
    rtl: style.rtl,
    align: style.align
  }
}

