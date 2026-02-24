
import { GoldenModuleData, GoldenSection } from '../types.ts';

// --------------------------------------------------------------------------------
// GOLDEN PARSER (THE "DUMB" RENDERER)
// --------------------------------------------------------------------------------
// Transforms the Golden JSON into specific file formats (Markdown, XML).
// NO AI LOGIC HERE. Just pure data mapping and string manipulation.
// --------------------------------------------------------------------------------

type RenderTarget = 'WORKBOOK' | 'MANUAL' | 'EXERCISES' | 'EXAMPLES' | 'VIDEO_SCRIPT';

/**
 * Main entry point for rendering markdown-based documents.
 */
export const renderToMarkdown = (data: GoldenModuleData, target: RenderTarget): string => {
  let output = '';

  // 1. Header Global
  const labels = data.localizedLabels || {
    duration: "Duration",
    format: "Format",
    section: "Section",
    theory: "Theory & Concepts",
    keyTakeaways: "Key Takeaways",
    actionPlan: "Action Plan",
    reflection: "Reflection",
    trainerInstructions: "Trainer Instructions",
    method: "Method",
    logistics: "Logistics",
    script: "Script",
    activity: "Activity",
    objective: "Objective",
    instructionsParticipant: "Participant Instructions",
    instructionsFacilitator: "Facilitator Instructions",
    debrief: "Debrief Questions",
    example: "Example",
    videoScript: "Video Script"
  };

  output += `# ${data.moduleTitle}\n`;
  output += `**${labels.duration}:** ${data.moduleDurationMinutes} min | **${labels.format}:** ${data.environment}\n\n`;

  if (target === 'EXAMPLES') {
      return renderExamplesLibrary(data, labels);
  }

  // 2. Iterate through sections
  data.sections.forEach((section, index) => {
    output += `---\n\n`; // Section separator
    output += `## ${labels.section} ${index + 1}: ${section.title} (${section.durationMinutes} min)\n\n`;

    switch (target) {
      case 'WORKBOOK':
        output += renderWorkbookSection(section, labels);
        break;
      case 'MANUAL':
        output += renderManualSection(section, data.narrativeContext.protagonistName, labels);
        break;
      case 'EXERCISES':
        if (section.exercisesDetailed) {
           output += renderExerciseSheet(section.exercisesDetailed, labels);
        } else {
            output += `*(No detailed exercises in this section)*\n\n`;
        }
        break;
       case 'VIDEO_SCRIPT':
         if (section.videoScript) {
             output += renderVideoScript(section.videoScript, labels);
         }
         break;
    }
    output += `\n\n`;
  });

  return cleanMarkdown(output);
};

/**
 * Renders the Workbook content (Participant facing).
 */
const renderWorkbookSection = (section: GoldenSection, labels: any): string => {
  const content = section.participantContent;
  let md = `### ${labels.theory}\n\n`;
  
  // Unwrap the markdown content
  md += `${content.theoryMarkdown}\n\n`;

  if (content.keyTakeaways && content.keyTakeaways.length > 0) {
    md += `### 🔑 ${labels.keyTakeaways}\n`;
    content.keyTakeaways.forEach(pt => md += `- ${pt}\n`);
    md += `\n`;
  }

  if (content.actionableSteps && content.actionableSteps.length > 0) {
    md += `### 🚀 ${labels.actionPlan}\n`;
    content.actionableSteps.forEach((step, i) => md += `${i + 1}. ${step}\n`);
    md += `\n`;
  }

  if (content.reflectionQuestions && content.reflectionQuestions.length > 0) {
    md += `### 🤔 ${labels.reflection}\n`;
    content.reflectionQuestions.forEach(q => md += `> **Question:** ${q}\n\n*(Write your answer here)*\n\n\n`);
  }

  return md;
};

/**
 * Renders the Trainer Manual (Instructor facing).
 */
const renderManualSection = (section: GoldenSection, protagonistName: string, labels: any): string => {
  const instr = section.trainerInstructions;
  let md = `### 👨‍🏫 ${labels.trainerInstructions}\n`;
  md += `**${labels.method}:** ${instr.deliveryMethod}\n\n`;

  // Logistics
  if (instr.logistics && instr.logistics.length > 0) {
      md += `**🛠️ ${labels.logistics}:** ${instr.logistics.join(', ')}\n\n`;
  }

  // Live vs Online Specifics
  if (instr.flipchartSketch) {
      md += `**🎨 FLIPCHART SKETCH:**\n`;
      md += `*Title:* ${instr.flipchartSketch.title}\n`;
      md += `*Draw:* ${instr.flipchartSketch.visualDescription}\n`;
      md += `*Write:* \n${instr.flipchartSketch.bulletPoints.map(b => `  - ${b}`).join('\n')}\n\n`;
  }

  if (instr.breakoutRoomConfig) {
      md += `**💻 BREAKOUT ROOMS:**\n`;
      md += `*Groups:* ${instr.breakoutRoomConfig.groupSize} pax | *Time:* ${instr.breakoutRoomConfig.duration} min\n`;
      md += `*Task:* ${instr.breakoutRoomConfig.taskDescription}\n\n`;
  }

  // The Script
  md += `#### 🗣️ ${labels.script} (Verbatim)\n`;
  md += `> ${instr.script.replace(/\n/g, '\n> ')}\n\n`;

  // Visual Reference (Thumbnail text)
  if (section.visuals && section.visuals.slidesSequence.length > 0) {
      md += `#### 🖼️ Visuals Cue\n`;
      section.visuals.slidesSequence.forEach(slide => {
          md += `- **[Slide ${slide.slideId}]:** ${slide.title} (Note: ${slide.speakerNotes.substring(0, 50)}...)\n`;
      });
  }

  return md;
};

/**
 * Renders the Exercises Sheet (Detailed).
 */
const renderExerciseSheet = (exercise: NonNullable<GoldenSection['exercisesDetailed']>, labels: any): string => {
    let md = `### 🏋️ ${labels.activity}: ${exercise.title}\n`;
    md += `**${labels.objective}:** ${exercise.objective}\n`;
    md += `**Time:** ${exercise.durationMinutes} min\n\n`;

    md += `#### ${labels.instructionsParticipant}\n${exercise.instructionsParticipant}\n\n`;
    md += `#### ${labels.instructionsFacilitator}\n${exercise.instructionsFacilitator}\n\n`;
    
    md += `#### ${labels.debrief}\n`;
    exercise.debriefingQuestions.forEach(q => md += `- ${q}\n`);
    
    if (exercise.adaptationNotes) {
        md += `\n**⚠️ Adaptation Note:** ${exercise.adaptationNotes}\n`;
    }

    return md;
};

/**
 * Renders the Examples Library (File 6).
 */
const renderExamplesLibrary = (data: GoldenModuleData, labels: any): string => {
    let md = `# Examples Library for ${data.moduleTitle}\n`;
    md += `*Context: ${data.narrativeContext.protagonistName} is in stage: "${data.narrativeContext.storyArcStage}"*\n\n`;
    
    data.narrativeContext.examplesLibrary.forEach(ex => {
        md += `## ${labels.example}: ${ex.title}\n`;
        md += `**When to use:** ${ex.applicationContext}\n\n`;
        md += `"${ex.storyContent}"\n\n`;
        md += `---\n\n`;
    });
    
    return md;
};

const renderVideoScript = (video: NonNullable<GoldenSection['videoScript']>, labels: any): string => {
    let md = `### 🎥 ${labels.videoScript}\n`;
    md += `**Scene:** ${video.sceneDescription}\n\n`;
    md += `**${labels.script}:**\n${video.scriptContent}\n\n`;
    
    if(video.visualOverlays && video.visualOverlays.length > 0) {
        md += `**Overlays:**\n`;
        video.visualOverlays.forEach(o => md += `- [${o.timestamp}] ${o.description}\n`);
    }
    return md;
}


/**
 * Renders the XML for the old PPTX parser.
 * Input: GoldenModuleData.visuals.slidesSequence
 * Output: String XML compatible with <SLIDE_BEGIN>...<SLIDE_END>
 */
export const renderToXml = (data: GoldenModuleData): string => {
  let xmlOutput = '';

  data.sections.forEach(section => {
    section.visuals.slidesSequence.forEach(slide => {
      xmlOutput += `<SLIDE_BEGIN id="${slide.slideId}">\n`;
      xmlOutput += `<TITLE>${escapeXml(slide.title)}</TITLE>\n`;
      
      // We map our layout enum to the old comments if needed, 
      // but for now we stick to the tag structure.
      xmlOutput += `<!-- slide-layout: ${slide.layout} -->\n`;
      
      xmlOutput += `<VISUAL>${escapeXml(slide.visualDescription)}</VISUAL>\n`;
      
      xmlOutput += `<CONTENT>\n`;
      slide.contentBullets.forEach(bullet => {
        xmlOutput += `- ${escapeXml(bullet)}\n`;
      });
      xmlOutput += `</CONTENT>\n`;
      
      xmlOutput += `<NOTES>${escapeXml(slide.speakerNotes)}</NOTES>\n`;
      xmlOutput += `<SLIDE_END id="${slide.slideId}">\n\n`;
    });
  });

  return xmlOutput;
};

// --- UTILS ---

/**
 * Ensures Markdown newlines are respected and artifacts removed.
 */
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\\n/g, '\n') // Fix JSON escaped newlines
    .replace(/\n\s*\n/g, '\n\n') // Normalize multiple newlines
    .trim();
};

/**
 * Escapes special characters for XML.
 */
const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};
