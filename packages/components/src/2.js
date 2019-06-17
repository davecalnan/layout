import React from 'react'
import ReactMarkdown from 'react-markdown'

const Text = ({ markdown }) => (
  <ReactMarkdown className="font-light leading-normal text-lg mb-6" source={markdown} />
)

export default Text
