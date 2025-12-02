// Utility function to filter out unnecessary markdown-like characters
// ** and ## unless they are necessary for formatting
export function filterResponseContent(content: string): string {
  let filtered = content;

  // Remove bold formatting **text** but preserve the text inside
  filtered = filtered.replace(/\*\*([^*]+)\*\*/g, '$1');

  // Remove multiple asterisks like ***text*** (bold and italic)
  filtered = filtered.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');

  // Remove single asterisks that are not part of list items
  // Preserve * when used in list contexts (after newline and whitespace)
  filtered = filtered.replace(/(?<=[^*\n])\*([^\n*]+?)\*(?=[^*\n])/g, '$1');

  // Remove headers like ##, ###, ####, etc. when they're not at the start of a line
  filtered = filtered.replace(/(?<!\n)#{2,6}\s*/g, '');

  // Remove underscores used for emphasis _text_
  filtered = filtered.replace(/_([^_]+)_/g, '$1');

  // Additional cleanups
  filtered = filtered.replace(/\[(.+?)\]\(.+?\)/g, '$1'); // Remove markdown links but keep the text

  return filtered;
}