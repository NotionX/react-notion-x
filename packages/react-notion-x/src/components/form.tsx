export function Form({
  block,
  embeddedFormBaseUrl
}: {
  block: any
  embeddedFormBaseUrl: string
}) {
  const formId = block?.id?.replace(/-/g, '')
  return (
    <iframe
      className='notion-form-iframe'
      src={`${embeddedFormBaseUrl}/ebd/${formId}?theme=light`}
      width='100%'
      height='600'
      allowFullScreen
      title={`Notion Form: ${block?.id}`}
    />
  )
}
