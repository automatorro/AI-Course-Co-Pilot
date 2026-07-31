export type FeatureFlagKey =
  | 'localizedChat'
  | 'adaptiveGreeting'
  | 'languageDetector'
  | 'editorUiUnified'
  | 'validationStrictLocalization'
  | 'blueprintRefineEnabled'
  | 'newPptxExporter'
  | 'pptxEnhancedPipeline'
  | 'pptxTextOnlySafeMode'
  | 'visualOrchestrator'
  | 'contractPipeline';

export const FEATURE_FLAGS: Record<FeatureFlagKey, boolean> = {
  localizedChat: true,
  adaptiveGreeting: true,
  languageDetector: true,
  editorUiUnified: true,
  validationStrictLocalization: false,
  blueprintRefineEnabled: true,
  newPptxExporter: true,
  pptxEnhancedPipeline: true,
  pptxTextOnlySafeMode: false,
  visualOrchestrator: true, // Enable new Visual Orchestrator flow
  contractPipeline: false, // Enable the new contract-based generation workflow
};

export const FEATURE_DOCS: Record<FeatureFlagKey, string> = {
  localizedChat: 'Extinde chat-ul de onboarding pentru a afișa mesajele în limba cursului (ISO).',
  adaptiveGreeting: 'Evită redundanța: dacă există obiective în modal, chat-ul sare direct la următoarea clarificare.',
  languageDetector: 'Detector simplu: preferă course.language, apoi limba UI, apoi navigator.language.',
  editorUiUnified: 'Uniformizează clasele și stilurile editorului cu modalele premium (culori, raioane, umbre).',
  validationStrictLocalization: 'Dacă este activ, livrabilele cu fragmente nelocalizate vor bloca finalizarea generării.',
  blueprintRefineEnabled: 'Controlează afișarea butonului „Rafinează cu AI” în Review Blueprint.',
  newPptxExporter: 'Activează noul pipeline determinist pentru export PPTX cu arhetipuri.',
  pptxEnhancedPipeline: 'Activează îmbunătățirile PPTX (notes+i18n+auto-split) cu garduri.',
  pptxTextOnlySafeMode: 'Forțează layouturi text-only și dezactivează imaginile pentru livrare robustă.',
  visualOrchestrator: 'Activează noul flux hibrid: Editare Vizuală -> Export PPTX (fără scriere în TinyMCE).',
  contractPipeline: 'Activează noul flux de generare bazat pe contract și ascunde pașii legacy din modalul de progres.',
};

export const isEnabled = (key: FeatureFlagKey): boolean => FEATURE_FLAGS[key];
