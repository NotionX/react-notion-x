export const normalizeTitle = (title?: string | null): string => {
  return (title || '')
    .replace(/ /g, '-')
    .replace(/[^a-zA-Z0-9-\u4e00-\u9fa5\u3041-\u3096\u30A1-\u30FA]/g, '')
    .replace(/--/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '')
    .trim()
    .toLowerCase()
}
