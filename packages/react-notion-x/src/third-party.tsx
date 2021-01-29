import React from 'react'
import Tweet from 'react-tweet-embed'
import { Page, Document } from 'react-pdf'
import Equation from '@matejmazur/react-katex'
import Modal from 'react-modal'

const Pdf = ({ file, children, ...rest }) => (
  <Document file={file} {...rest}>
    <Page pageNumber={1} />
  </Document>
)

export { Tweet, Pdf, Equation, Modal }
