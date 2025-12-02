/**
 * Detects the language of a given text based on common patterns and keywords
 * Returns ISO 639-1 language code
 */
export function detectLanguage(text: string): string {
    const lowerText = text.toLowerCase();

    // Language patterns and common words
    const patterns = {
        es: [
            /\b(qué|cuál|cómo|dónde|cuándo|por qué|quién|hola|gracias|buenos días|buenas tardes)\b/,
            /\b(proyecto|habilidad|experiencia|trabajo|idioma)\b/,
            /ñ/,
        ],
        fr: [
            /\b(quoi|quel|comment|où|quand|pourquoi|qui|bonjour|merci|salut)\b/,
            /\b(projet|compétence|expérience|travail|langue)\b/,
            /[àâäæçéèêëïîôùûüÿœ]/,
        ],
        de: [
            /\b(was|welche|wie|wo|wann|warum|wer|hallo|danke|guten tag)\b/,
            /\b(projekt|fähigkeit|erfahrung|arbeit|sprache)\b/,
            /[äöüß]/,
        ],
        pt: [
            /\b(o que|qual|como|onde|quando|por que|quem|olá|obrigado|bom dia)\b/,
            /\b(projeto|habilidade|experiência|trabalho|idioma)\b/,
            /[ãáàâçéêíóôõú]/,
        ],
        zh: [
            /[\u4e00-\u9fff]/,
            /\b(什么|哪个|怎么|哪里|什么时候|为什么|谁|你好|谢谢)\b/,
        ],
        ja: [
            /[\u3040-\u309f\u30a0-\u30ff]/,
            /\b(何|どの|どう|どこ|いつ|なぜ|誰|こんにちは|ありがとう)\b/,
        ],
    };

    // Check each language pattern
    for (const [lang, regexes] of Object.entries(patterns)) {
        for (const regex of regexes) {
            if (regex.test(lowerText)) {
                return lang;
            }
        }
    }

    // Default to English
    return 'en';
}

/**
 * Gets the system prompt instruction for the AI based on the detected or selected language
 */
export function getLanguageSystemPrompt(languageCode: string): string {
    const instructions: Record<string, string> = {
        en: 'IMPORTANT: Always respond in English, regardless of the language of the question.',
        es: 'IMPORTANTE: Responde SIEMPRE en español, sin importar el idioma de la pregunta.',
        fr: 'IMPORTANT: Répondez TOUJOURS en français, quelle que soit la langue de la question.',
        de: 'WICHTIG: Antworten Sie IMMER auf Deutsch, unabhängig von der Sprache der Frage.',
        pt: 'IMPORTANTE: Responda SEMPRE em português, independentemente do idioma da pergunta.',
        zh: '重要：无论问题使用什么语言，始终用中文回答。',
        ja: '重要：質問の言語に関係なく、常に日本語で回答してください。',
    };

    return instructions[languageCode] || instructions.en;
}

/**
 * Maps language codes to full language names
 */
export const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    pt: 'Portuguese',
    zh: 'Chinese',
    ja: 'Japanese',
};
