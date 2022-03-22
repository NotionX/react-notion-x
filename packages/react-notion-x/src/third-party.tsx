import React from 'react'
import { pdfjs, Page, Document } from 'react-pdf'
import Equation from '@matejmazur/react-katex'
import Modal from 'react-modal'

// ensure pdfjs can find its worker script regardless of how react-notion-x is bundled
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Pdf = ({ file, children, ...rest }) => {
  const [numPages, setNumPages] = React.useState(null)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <Document file={file} onLoadSuccess={onDocumentLoadSuccess} {...rest}>
      {Array.from(new Array(numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  )
}

export { Equation, Modal, Pdf }
