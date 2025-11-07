import PptxGenJS from 'pptxgenjs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Header } from 'docx';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { Course, CourseStep } from '../types';

// Helper to parse simple Markdown-like text into docx-js Paragraphs
const parseMarkdownToDocx = (content: string): Paragraph[] => {
    const paragraphs: Paragraph[] = [];
    const lines = content.split('\n');

    lines.forEach(line => {
        if (line.startsWith('# ')) {
            paragraphs.push(new Paragraph({ text: line.substring(2), heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }));
        } else if (line.startsWith('## ')) {
            paragraphs.push(new Paragraph({ text: line.substring(3), heading: HeadingLevel.HEADING_2 }));
        } else if (line.startsWith('### ')) {
            paragraphs.push(new Paragraph({ text: line.substring(4), heading: HeadingLevel.HEADING_3 }));
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            paragraphs.push(new Paragraph({ text: line.substring(2), bullet: { level: 0 } }));
        } else if (line.trim() === '') {
            paragraphs.push(new Paragraph({ text: '' })); // For empty lines/spacing
        } else {
            // Handle inline formatting like **bold**
            const runs: TextRun[] = [];
            const parts = line.split(/(\*\*.*?\*\*)/g); // Split by bold tags
            parts.forEach(part => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
                } else if(part) {
                    runs.push(new TextRun(part));
                }
            });
            paragraphs.push(new Paragraph({ children: runs }));
        }
    });

    return paragraphs;
};

// Generates a DOCX file from a course step's content
const createDocx = (step: CourseStep, courseTitle: string, stepTitle: string): Promise<Blob> => {
    const doc = new Document({
        sections: [{
            headers: {
                default: new Header({
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: `${courseTitle} - ${stepTitle}`, size: 18, color: "888888" }),
                            ],
                            alignment: AlignmentType.RIGHT,
                        }),
                    ]
                }),
            },
            children: parseMarkdownToDocx(step.content),
        }],
    });
    return Packer.toBlob(doc);
};


// Generates a PPTX file from a course step's content
const createPptx = (step: CourseStep, courseTitle: string): Promise<Blob> => {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    
    // Add a title slide
    const titleSlide = pptx.addSlide();
    titleSlide.addText(courseTitle, { 
        x: 0.5, y: 1.5, w: '90%', h: 1.5, 
        align: 'center', fontSize: 48, bold: true, color: '363636' 
    });
    titleSlide.addText('Slides', { 
        x: 0.5, y: 3.0, w: '90%', h: 1, 
        align: 'center', fontSize: 24, color: '808080' 
    });

    // Split content into slides based on '##' headers
    const slideContents = step.content.split(/\n(?=## )/);
    
    slideContents.forEach(slideContent => {
        const lines = slideContent.trim().split('\n');
        const title = lines.shift()?.replace('## ', '').trim() || '';
        const body = lines.join('\n').trim();

        if (!title && !body) return;

        const slide = pptx.addSlide();
        
        // Add Slide Title
        slide.addText(title, { 
            x: 0.5, y: 0.25, w: '90%', h: 1, 
            fontSize: 32, bold: true, color: '363636' 
        });

        // Add Slide Body Content
        if (body) {
            slide.addText(body, {
                x: 0.5, y: 1.5, w: '90%', h: '75%', 
                fontSize: 18, bullet: true, paraSpaceAfter: 10
            });
        }
    });

    // Generate binary data and wrap into a Blob compatible with ZIP
    return pptx.write().then((bufferOrUint8) => {
        const arrayBuffer: ArrayBuffer = bufferOrUint8 instanceof ArrayBuffer
          ? bufferOrUint8
          : (bufferOrUint8 as Uint8Array).buffer as ArrayBuffer;
        return new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    });
};

/**
 * Creates and downloads a zip file containing all course materials.
 * Slides are exported as PPTX, other steps as DOCX.
 */
export const exportCourseAsZip = async (course: Course, t: (key: string) => string): Promise<void> => {
    const zip = new JSZip();

    for (const step of course.steps || []) {
        const stepTitle = t(step.title_key).replace(/^\d+\.\s*/, ''); // Remove numbering like "1. "
        let blob: Blob;
        let fileName: string;

        if (step.title_key.includes('slides')) {
            blob = await createPptx(step, course.title);
            fileName = `${stepTitle}.pptx`;
        } else {
            blob = await createDocx(step, course.title, stepTitle);
            fileName = `${stepTitle}.docx`;
        }
        
        zip.file(fileName, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const safeCourseTitle = course.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    saveAs(zipBlob, `course_${safeCourseTitle}.zip`);
};