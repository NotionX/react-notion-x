export function Form({
  block,
  embeddedFormsBaseUrl
}: {
  block: any
  embeddedFormsBaseUrl: string
}) {
  const formId = block?.id?.replace(/-/g, '')
  return (
    <iframe
      className='notion-form-iframe'
      src={`${embeddedFormsBaseUrl}/ebd/${formId}?theme=light`}
      width='100%'
      height='600'
      allowFullScreen
      title={`Notion Form: ${block?.id}`}
    />
  )
}
