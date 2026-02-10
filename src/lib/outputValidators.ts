export type BlueprintModule = {
  id: string;
  title: string;
  sections: { id: string; title: string }[];
};

export const validateDurations = (structureHours: number, workbookHours: number) => {
  return {
    ok: structureHours === workbookHours,
    expected: structureHours,
    actual: workbookHours,
  };
};

export const validateModulesConsistency = (a: BlueprintModule[], b: BlueprintModule[]) => {
  const namesA = a.map(m => m.title.trim());
  const namesB = b.map(m => m.title.trim());
  const missingInB = namesA.filter(n => !namesB.includes(n));
  const extraInB = namesB.filter(n => !namesA.includes(n));
  return {
    ok: missingInB.length === 0 && extraInB.length === 0,
    missingInB,
    extraInB,
  };
};

export const detectNonLocalizedFragments = (text: string, languageCode: string) => {
  const englishHints = [
    /This section/,
    /I can, however/,
    /Generation Paused/,
    /Processing\.\.\./,
    /Welcome!/,
    /We\'re thrilled|We are thrilled/,
    /High[- ]level objectives|High level objectives/i
  ];
  const hits = englishHints.filter(r => r.test(text));
  return {
    ok: hits.length === 0,
    hints: hits.map(r => r.source),
    language: languageCode,
  };
};

export const extractModuleTitles = (text: string): string[] => {
  const lines = text.split(/\r?\n/);
  const titles: string[] = [];
  // Expanded regex to catch:
  // - Optional markdown bold/header (** or #)
  // - "Modul", "Module", "Section", "Sesiunea"
  // - Separators: :, ., -, –
  // - Captures the title content
  const modRegex = /^(?:(?:\*\*|#+\s*)?)(?:Modul(?:ul)?|Module|Section|Sesiunea)\s+(\d+)\s*[:.\-–\)]\s*(.+?)(?:\*\*|$)/i;
  
  for (const line of lines) {
    // Strip common markdown wrappers for cleaner matching
    const cleanLine = line.replace(/^\s*[-*]\s+/, '').trim(); 
    const m = cleanLine.match(modRegex);
    if (m) {
      titles.push(m[2].trim());
    }
  }
  return titles;
};

export const compareModuleTitlesText = (aText: string, bText: string) => {
  const aTitles = extractModuleTitles(aText);
  const bTitles = extractModuleTitles(bText);
  const missingInB = aTitles.filter(n => !bTitles.includes(n));
  const extraInB = bTitles.filter(n => !aTitles.includes(n));
  return { ok: missingInB.length === 0 && extraInB.length === 0, missingInB, extraInB };
};

export const extractModuleDurations = (text: string): number[] => {
  const lines = text.split(/\r?\n/);
  const durations: number[] = [];
  // More robust regex:
  // - Matches "(X oră)", "(X ore)"
  // - Matches "(X h)", "(X min)"
  // - Matches "Durata: X ore"
  const durRegex = /(?:\(|^|\s)(\d+)\s*(?:oră|ore|h|min|minute)(?:\)|$|\s)/i;

  for (const line of lines) {
    const m = line.match(durRegex);
    if (m) durations.push(parseInt(m[1], 10));
  }
  return durations;
};

export const validateDurationsArray = (structureDurations: number[], workbookDurations: number[]) => {
  const ok = structureDurations.length === workbookDurations.length && structureDurations.every((v, i) => v === workbookDurations[i]);
  return {
    ok,
    expected: structureDurations,
    actual: workbookDurations,
  };
};

export const alignWorkbookDurationsByStructure = (structureText: string, workbookText: string): string => {
  const structureTitles = extractModuleTitles(structureText);
  const structureDurations = extractModuleDurations(structureText);
  if (structureTitles.length === 0 || structureDurations.length === 0) return workbookText;

  const lines = workbookText.split(/\r?\n/);
  // Match same robust pattern as extractModuleTitles
  const modRegex = /^(?:(?:\*\*|#+\s*)?)(?:Modul(?:ul)?|Module|Section|Sesiunea)\s+(\d+)\s*[:.\-–\)]\s*(.+?)(?:\*\*|$)/i;
  const durRegex = /(?:\(|^|\s)(\d+)\s*(?:oră|ore|h|min|minute)(?:\)|$|\s)/i;

  const outLines = lines.map(line => {
    const cleanLine = line.replace(/^\s*[-*]\s+/, '').trim();
    const m = cleanLine.match(modRegex);
    if (!m) return line;
    const idx = parseInt(m[1], 10) - 1;
    const targetDuration = structureDurations[idx];
    if (!targetDuration || isNaN(targetDuration)) return line;
    
    // If line already has duration, replace it
    if (durRegex.test(line)) {
      const unit = targetDuration === 1 ? 'oră' : 'ore';
      return line.replace(durRegex, `(${targetDuration} ${unit})`);
    }
    // If not, maybe append it? (Optional, but let's stick to replacement for now)
    return line;
  });

  return outLines.join('\n');
};
