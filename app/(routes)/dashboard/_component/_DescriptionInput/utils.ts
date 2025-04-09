// utils.ts
import { AiSuggestion, Template } from './types';

/**
 * Groups AI suggestions by their category
 * @param suggestions - Array of AI suggestions
 * @returns Object with categories as keys and arrays of suggestions as values
 */
export const groupSuggestionsByCategory = (suggestions: AiSuggestion[]): Record<string, AiSuggestion[]> => {
    return suggestions.reduce((acc: Record<string, AiSuggestion[]>, suggestion) => {
        if (!acc[suggestion.category]) {
            acc[suggestion.category] = [];
        }
        acc[suggestion.category].push(suggestion);
        return acc;
    }, {});
};

/**
 * Filters templates based on search query
 * @param templates - Array of template objects
 * @param query - Search query
 * @returns Filtered array of templates
 */
export const filterTemplatesBySearch = (templates: Template[], query: string): Template[] => {
    if (!query) return templates;

    return templates.filter(template =>
        template.title.toLowerCase().includes(query.toLowerCase()) ||
        template.content.toLowerCase().includes(query.toLowerCase())
    );
};

/**
 * Creates a downloadable file from text content
 * @param content - Text content for the file
 * @param mimeType - MIME type of the file
 * @param filename - Name of the file
 */
export const downloadAsFile = (content: string, mimeType: string, filename: string): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

interface ExportResult {
    content: string;
    mimeType: string;
    extension: string;
    filename: string;
}

/**
 * Formats description content based on export format
 * @param description - Description text
 * @param title - Title of the description
 * @param format - Export format ('txt', 'md', or 'json')
 * @returns Formatted content and related metadata
 */
export const formatExportContent = (description: string, title: string, format: 'txt' | 'md' | 'json'): ExportResult => {
    let content = description;
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'md') {
        content = `# ${title || 'Design Description'}\n\n${description}`;
        mimeType = 'text/markdown';
        extension = 'md';
    } else if (format === 'json') {
        content = JSON.stringify({
            title: title || 'Design Description',
            description: description,
            timestamp: new Date().toISOString()
        }, null, 2);
        mimeType = 'application/json';
        extension = 'json';
    }

    return {
        content,
        mimeType,
        extension,
        filename: `design-description.${extension}`
    };
};