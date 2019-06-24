import React from 'react'
import { PropTypes } from '@layouthq/prop-types'
import ReactMarkdown from 'react-markdown'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Text = ({ markdown, theme, ...props }) => (
  <ReactMarkdown {...props} source={markdown} />
)

Text.propTypes = {
  markdown: PropTypes.text
}

export default styled(Text)`
${tw`font-light leading-normal text-lg mb-6`}
${({ theme }) => theme.typography.body}
color: ${({ theme }) => theme.colors.text.base};

  > * {
    ${tw`mb-4`}
  }

  strong {
    ${tw`font-bold`}
  }

  ul {
    ${tw`list-disc ml-6`}
  }
`
