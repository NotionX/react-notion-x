/** Decode one explicitly requested layer of Notion equation escaping. */
export function decodeEquation(formula: string): string {
  return formula.replace(/\\(\\|n(?![a-zA-Z]))/g, (_, escape: string) =>
    escape === 'n' ? '\n' : '\\'
  )
}
