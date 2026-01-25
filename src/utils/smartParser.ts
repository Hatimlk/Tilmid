// @ts-ignore
import mammoth from 'mammoth';
import { BlogPost } from '../types';

interface ParsedContent {
    title: string;
    excerpt: string;
    content?: string;
    sections: BlogPost['sections'];
}

export const smartParser = {
    /**
     * Parse a file (Word or Text) and extract structured content
     */
    parseFile: async (file: File): Promise<ParsedContent> => {
        let rawText = '';

        if (file.name.endsWith('.docx')) {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            rawText = result.value;
        } else {
            rawText = await file.text();
        }

        return smartParser.analyzeContent(rawText);
    },

    /**
     * Analyze text to extract Title, Summary, and Key Points
     */
    analyzeContent: (text: string): ParsedContent => {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        if (lines.length === 0) return { title: '', excerpt: '', sections: [] };

        // Heuristic 1: Title is likely the first line
        const title = lines[0];

        // Heuristic 2: Excerpt is the first substantial paragraph after title
        // Skip lines that look like headers (short, no punctuation)
        let excerptIndex = 1;
        while (excerptIndex < lines.length && (lines[excerptIndex].length < 20 || lines[excerptIndex].endsWith(':'))) {
            excerptIndex++;
        }
        const excerpt = lines[excerptIndex] || '';

        // Heuristic 3: Detect Sections and Lists
        // We look for patterns like "Introduction", "Summary", "Conclusion" or just spacing styles
        const sections: BlogPost['sections'] = [];
        let currentSection = { title: 'مقدمة', content: '', list: [] as any[] };

        // Process remaining lines
        for (let i = excerptIndex + 1; i < lines.length; i++) {
            const line = lines[i];

            // Detect likely header (short line, usually uppercase in English or distinct in formatting, assuming simple text)
            // Or specific keywords like "Resume", "Conclusion"
            const isHeader = line.length < 50 && !line.includes('.') && (i + 1 < lines.length);

            if (isHeader) {
                // Push old section
                if (currentSection.content || currentSection.list.length > 0) {
                    sections.push(currentSection);
                }
                // Start new section
                currentSection = { title: line, content: '', list: [] };
            } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
                // It's a list item
                currentSection.list.push({
                    t: 'نقطة مهمة',
                    d: line.replace(/^[-•*]\s*/, '')
                });
            } else {
                // Regular content
                currentSection.content += (currentSection.content ? '\n' : '') + line;
            }
        }

        // Push final section
        if (currentSection.content || currentSection.list.length > 0) {
            sections.push(currentSection);
        }

        return { title, excerpt, sections, content: text };
    }
};
