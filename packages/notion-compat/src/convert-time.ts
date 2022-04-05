export function convertTime(time?: string): number | undefined {
  if (time) {
    try {
      return new Date(time).getTime()
    } catch {
      // ignore invalid time strings
    }
  }

  return undefined
}
