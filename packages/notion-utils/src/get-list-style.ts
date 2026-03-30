export function getListStyle(level: number): string {
  const styles: string[] = ['decimal', 'lower-alpha', 'lower-roman']
  const index = ((level % styles.length) + styles.length) % styles.length
  return styles[index] as string
}
