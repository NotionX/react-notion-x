export const uuidToId = (uuid: string | undefined | null): string => {
  if (!uuid || typeof uuid !== 'string') {
    return ''
  }
  return uuid.replaceAll('-', '')
}
