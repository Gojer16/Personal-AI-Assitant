// Utility function to filter out unnecessary markdown-like characters
// ** and ## unless they are necessary for formatting
export function filterResponseContent(content: string): string {
  let filtered = content;

  // Aggressively remove all bold markers (**)
  filtered = filtered.replace(/\*\*/g, '');

  // Remove multiple asterisks like ***text*** (bold and italic) -> *text*
  filtered = filtered.replace(/\*\*\*/g, '*');

  // Remove headers like ##, ###, ####, etc. when they're not at the start of a line
  // We keep them at start of line as they might be useful for structure even in plain text,
  // or we could replace them with uppercase?
  // User didn't complain about headers, but let's keep it clean.
  // The original code removed them if NOT at start of line?
  // filtered = filtered.replace(/(?<!\n)#{2,6}\s*/g, '');

  // Let's just clean up the ** as requested.

  // Remove underscores used for emphasis _text_ -> text
  filtered = filtered.replace(/_([^_]+)_/g, '$1');

  // Additional cleanups
  filtered = filtered.replace(/\[(.+?)\]\(.+?\)/g, '$1'); // Remove markdown links but keep the text

  return filtered;
}