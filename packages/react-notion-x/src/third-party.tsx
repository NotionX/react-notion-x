import React from 'react'
import { Page, Document, DocumentProps } from 'react-pdf'
import Equation from '@matejmazur/react-katex'
import Modal from 'react-modal'

const Pdf: React.FC<DocumentProps> = (props) => {
  const [numPages, setNumPages] = React.useState(null)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <Document {...props} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(new Array(numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  )
}

export { Pdf, Equation, Modal }
