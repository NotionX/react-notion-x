export function getNotionDateTime(
  date: string,
  time?: string,
  timeZone?: string
) {
  const dateParts = [date]
  if (time) dateParts.push(time)
  if (timeZone) dateParts.push(timeZone)
  return new Date(dateParts.join(' '))
}
