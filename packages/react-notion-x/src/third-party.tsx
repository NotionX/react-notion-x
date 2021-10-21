// import React from 'react'
// import { Page, Document } from 'react-pdf'
import Equation from '@matejmazur/react-katex'
import Modal from 'react-modal'

// TODO: PDF support via "react-pdf" package has numerous troubles building
// with next.js so I'm choosing to disable support for now.

// const Pdf = ({ file, children, ...rest }) => {
//   const [numPages, setNumPages] = React.useState(null)

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages)
//   }

//   return (
//     <Document file={file} onLoadSuccess={onDocumentLoadSuccess} {...rest}>
//       {Array.from(new Array(numPages), (_, index) => (
//         <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//       ))}
//     </Document>
//   )
// }

export { Equation, Modal }
