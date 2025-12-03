import DOMPurify from 'isomorphic-dompurify';

/**
 * Hook to safely render HTML content from AI responses
 * Sanitizes HTML to prevent XSS attacks while allowing safe formatting tags
 */
export function useHtmlRenderer() {
    const renderHtml = (htmlContent: string) => {
        // Configure DOMPurify to allow only safe HTML tags
        const clean = DOMPurify.sanitize(htmlContent, {
            ALLOWED_TAGS: ['p', 'br', 'ul', 'ol', 'li', 'h3', 'h4', 'strong', 'em', 'span', 'div'],
            ALLOWED_ATTR: ['class'],
        });

        return { __html: clean };
    };

    return { renderHtml };
}
