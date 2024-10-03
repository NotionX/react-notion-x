export const normalizeTitle = (title?: string | null): string => {
  return (title || '')
    .replace(/ /g, '-')
    .replace(
      /[^a-zA-Z0-9-\u4e00-\u9fa5\uac00-\ud7af\u4e00-\u9fff\u3041-\u3096\u30a1-\u30fc\u3000-\u303f]/g,
      ''
    )
    .replace(/--/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '')
    .trim()
    .toLowerCase()
}
