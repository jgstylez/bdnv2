/**
 * Utility functions for button formatting
 */

/**
 * Splits text with parentheses into main text and subtext
 * @param text - Text that may contain parentheses
 * @returns Object with mainText and subtext (if parentheses found)
 */
export function splitParentheticalText(text: string): { mainText: string; subtext?: string } {
  const match = text.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (match) {
    return {
      mainText: match[1].trim(),
      subtext: match[2].trim(),
    };
  }
  return { mainText: text };
}
