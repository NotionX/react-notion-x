export const formatDate = (
  input: string | number,
  { month = 'short' }: { month?: 'long' | 'short' } = {}
) => {
  const date = new Date(input)
  const monthLocale = date.toLocaleString('en-US', { month })
  return `${monthLocale} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
}
