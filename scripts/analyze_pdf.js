
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust the path to point to the docs folder
const pdfPath = "c:/Users/Utilizator/COURSECOPILOT/coursecopilot/docs/Vanzarea_B2B.pdf";

async function extractText() {
    console.log(`Reading PDF from: ${pdfPath}`);

    if (!fs.existsSync(pdfPath)) {
        console.error(`File not found: ${pdfPath}`);
        return;
    }

    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = new Uint8Array(dataBuffer);

        const loadingTask = pdfjsLib.getDocument({
            data: data,
            disableFontFace: true,
        });

        const pdfDocument = await loadingTask.promise;
        console.log(`PDF loaded. Pages: ${pdfDocument.numPages}`);

        let fullText = '';
        
        // Read all pages
        for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            
            fullText += `\n--- PAGE ${i} ---\n${pageText}\n`;
        }

        fs.writeFileSync('temp_pdf_content.txt', fullText);
        console.log('Text extracted to temp_pdf_content.txt');

    } catch (error) {
        console.error("Error extracting text:", error);
    }
}

extractText();
