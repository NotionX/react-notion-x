export const normalizeTitle = (title?: string | null): string => {
  return (title || '')
    .replaceAll(' ', '-')
    .replaceAll(
      /[^\dA-Za-z\u3000-\u303F\u3041-\u3096\u30A1-\u30FC\u4E00-\u9FFF\uAC00-\uD7AF-]/g,
      ''
    )
    .replaceAll('--', '-')
    .replace(/-$/, '')
    .replace(/^-/, '')
    .trim()
    .toLowerCase()
}
