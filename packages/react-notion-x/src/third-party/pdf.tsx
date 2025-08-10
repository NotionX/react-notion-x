import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

// ensure pdfjs can find its worker script regardless of how react-notion-x is bundled
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`

export function Pdf({ file, ...rest }: { file: string }) {
  const [numPages, setNumPages] = React.useState<number>(0)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <Document file={file} onLoadSuccess={onDocumentLoadSuccess} {...rest}>
      {Array.from(Array.from({ length: numPages }), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  )
}
