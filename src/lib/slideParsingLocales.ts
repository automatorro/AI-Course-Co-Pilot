export interface SlideParsingKeywords {
  visual: string[];
  text: string[];
  notes: string[];
  title: string[];
  slideIdentifier: string[];
}

const COMMON_KEYWORDS: SlideParsingKeywords = {
  visual: ['Visual', 'Image', 'Visual cue', 'Prompt'],
  text: ['Text', 'Content'],
  notes: ['Speaker Notes', 'Notes'],
  title: ['Slide', 'Title'],
  slideIdentifier: ['Slide']
};

const KEYWORDS_BY_LANG: Record<string, Partial<SlideParsingKeywords>> = {
  'ro': {
    visual: ['Imagine Sugerată', 'Imagine', 'Vizual'],
    text: ['Conținut', 'Text'],
    notes: ['Note Vorbit', 'Note Trainer', 'Note'],
    title: ['Titlu', 'Subtitlu'],
    slideIdentifier: ['Diapozitiv', 'Slide', 'Pagina']
  },
  'es': {
    visual: ['Visual', 'Imagen', 'Gráfico'],
    text: ['Texto', 'Contenido'],
    notes: ['Notas del orador', 'Notas'],
    title: ['Título'],
    slideIdentifier: ['Diapositiva', 'Slide']
  },
  'fr': {
    visual: ['Visuel', 'Image'],
    text: ['Texte', 'Contenu'],
    notes: ['Notes de l\'intervenant', 'Notes', 'Commentaires'],
    title: ['Titre'],
    slideIdentifier: ['Diapositive', 'Slide']
  },
  'de': {
    visual: ['Bild', 'Visuell', 'Grafik'],
    text: ['Text', 'Inhalt'],
    notes: ['Sprechernotizen', 'Notizen'],
    title: ['Titel'],
    slideIdentifier: ['Folie', 'Slide']
  },
  'it': {
    visual: ['Immagine', 'Visuale'],
    text: ['Testo', 'Contenuto'],
    notes: ['Note del relatore', 'Note'],
    title: ['Titolo'],
    slideIdentifier: ['Diapositiva', 'Slide']
  }
};

export const getParsingKeywords = (langCode: string = 'en'): SlideParsingKeywords => {
  const code = langCode.split('-')[0].toLowerCase();
  const specific = KEYWORDS_BY_LANG[langCode] || KEYWORDS_BY_LANG[code] || {};
  
  return {
    visual: [...new Set([...(specific.visual || []), ...COMMON_KEYWORDS.visual])],
    text: [...new Set([...(specific.text || []), ...COMMON_KEYWORDS.text])],
    notes: [...new Set([...(specific.notes || []), ...COMMON_KEYWORDS.notes])],
    title: [...new Set([...(specific.title || []), ...COMMON_KEYWORDS.title])],
    slideIdentifier: [...new Set([...(specific.slideIdentifier || []), ...COMMON_KEYWORDS.slideIdentifier])]
  };
};
