export const normalizeTitle = (title?: string | null): string => {
  return (title || '')
    .replace(/ /g, '-')
    .replace(/[^a-zA-Z0-9-\u4e00-\u9fa5]/g, '')
    .replace(/--/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '')
    .trim()
    .toLowerCase()
}
