// @ts-ignore
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { BlogPost } from '../types';

// Set worker source to local file using Vite's ?url import
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface ParsedContent {
    title: string;
    excerpt: string;
    content?: string;
    sections: BlogPost['sections'];
}

export const smartParser = {
    /**
     * Parse a file (Word, PDF, or Text) and extract structured content
     */
    parseFile: async (file: File): Promise<ParsedContent> => {
        let rawText = '';

        if (file.name.endsWith('.docx')) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            rawText = result.value;
        } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            rawText = await smartParser.extractPdfText(file);
        } else {
            rawText = await file.text();
        }

        return smartParser.analyzeContent(rawText);
    },

    /**
     * Extract text from PDF file
     */
    extractPdfText: async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
        }

        return fullText;
    },

    /**
     * Analyze text to extract Title, Summary, and Key Points
     */
    analyzeContent: (text: string): ParsedContent => {
        // Normalize text: remove excessive newlines/spaces
        const lines = text.split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0);

        if (lines.length === 0) return { title: '', excerpt: '', sections: [] };

        // Heuristic 1: Title is likely the first line (or first significant line)
        // Check if first line is very short or looks like page number/metadata
        let titleIndex = 0;
        while (titleIndex < Math.min(5, lines.length) && (lines[titleIndex].length < 3 || /^\d+$/.test(lines[titleIndex]))) {
            titleIndex++;
        }
        const title = lines[titleIndex] || "عنوان غير معنون";

        // Heuristic 2: Excerpt is the first substantial paragraph after title
        let excerptIndex = titleIndex + 1;
        while (excerptIndex < lines.length && (
            lines[excerptIndex].length < 30 ||
            lines[excerptIndex].endsWith(':') ||
            /^(By|Author|Page|Date)/i.test(lines[excerptIndex])
        )) {
            excerptIndex++;
        }
        const excerpt = lines[excerptIndex] || '';

        // Heuristic 3: Detect Sections and Lists
        const sections: BlogPost['sections'] = [];
        let currentSection = { title: 'مقدمة', content: '', list: [] as any[] };

        // Process remaining lines
        for (let i = excerptIndex + 1; i < lines.length; i++) {
            const line = lines[i];

            // Refined Header Detection:
            // 1. Explicit Headers: Start with ✓, numeric (1., I.), or Arabic ordering (أولاً)
            // 2. Question Headers: End with ? or ؟
            // 3. Short lines that don't look like sentences
            const cleanLine = line.replace(/^[✓\-\*•\s]+/, '').trim();
            const isExplicitHeader = /^([✓\d]+[\.\)]|[IVX]+\.?|أولاً|ثانياً|ثالثاً|خلاصة|مقدمة)/.test(line);
            const isQuestionHeader = line.endsWith('?') || line.endsWith('؟');
            const isShortNoPunct = line.length < 60 && !/[.,;]$/.test(line) && line.length > 3 && !/^[-•*]/.test(line);

            const isHeader = isExplicitHeader || isQuestionHeader || isShortNoPunct;

            if (isHeader) {
                // Push old section
                if (currentSection.content || currentSection.list.length > 0) {
                    sections.push(currentSection);
                }
                // Start new section
                currentSection = { title: cleanLine.replace(/[:]/g, ''), content: '', list: [] };
            } else if (/^[-•*]/.test(line) || /^\d+\./.test(line)) {
                // It's a list item
                currentSection.list.push({
                    t: 'نقطة مهمة',
                    d: line.replace(/^[-•*\d\.]+\s*/, '')
                });
            } else {
                // Regular content
                // Append with space if it seems to be a continuation (no period at end of prev line), else newline
                const prevEndsWithPeriod = currentSection.content.trim().endsWith('.');
                const separator = prevEndsWithPeriod ? '\n\n' : ' ';
                currentSection.content += (currentSection.content ? separator : '') + line;
            }
        }

        // Push final section
        if (currentSection.content || currentSection.list.length > 0) {
            sections.push(currentSection);
        }

        return { title, excerpt, sections, content: text };
    }
};
