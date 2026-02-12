
import { AudienceLevel, STYLE_BLOCKS } from "../prompts/style-blocks.ts";

export function getStyleBlockFixed(audienceDescription: string): string {
  const lowerDesc = audienceDescription.toLowerCase();

  // 1. Operational (Factory / Blue Collar) - EXPANDED KEYWORDS
  const operationalKeywords = [
    'blue collar', 'operator', 'factory', 'manual', 'worker',
    'muncitor', 'fabrică', 'nivel redus', 'fortem', 'bca', // Romanian & Specific
    'production', 'assembly', 'maintenance', 'driver'
  ];
  
  if (operationalKeywords.some(kw => lowerDesc.includes(kw))) {
    return STYLE_BLOCKS[AudienceLevel.LEVEL_1_OPERATIONAL];
  }

  // 3. Strategic (Executives)
  const strategicKeywords = [
    'executive', 'director', 'c-level', 'vp', 'strategy', 'board',
    'manager', 'leader', 'founder', 'owner'
  ];
  
  if (strategicKeywords.some(kw => lowerDesc.includes(kw))) {
    return STYLE_BLOCKS[AudienceLevel.LEVEL_3_STRATEGIC];
  }

  // 4. Commercial (Sales)
  const commercialKeywords = [
    'sales', 'customer', 'client', 'support', 'agent',
    'vanzari', 'clienti', 'relatii'
  ];

  if (commercialKeywords.some(kw => lowerDesc.includes(kw))) {
    return STYLE_BLOCKS[AudienceLevel.LEVEL_4_COMMERCIAL] || STYLE_BLOCKS[AudienceLevel.LEVEL_2_CLERICAL];
  }

  // 5. Technical (Engineers)
  const technicalKeywords = [
    'developer', 'engineer', 'architect', 'technical', 'it pro',
    'programator', 'inginer', 'tehnic'
  ];

  if (technicalKeywords.some(kw => lowerDesc.includes(kw))) {
    return STYLE_BLOCKS[AudienceLevel.LEVEL_5_TECHNICAL] || STYLE_BLOCKS[AudienceLevel.LEVEL_2_CLERICAL];
  }

  // Default to Level 2 (Clerical / General)
  return STYLE_BLOCKS[AudienceLevel.LEVEL_2_CLERICAL];
}
