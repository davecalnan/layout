import React from 'react'
import PropTypes from '@layouthq/prop-types'
import ReactMarkdown from 'react-markdown'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Text = ({ markdown, theme, ...props }) => (
  <ReactMarkdown {...props} source={markdown} />
)

Text.propTypes = {
  ...PropTypes.typography,
  markdown: PropTypes.text,
  inline: PropTypes.boolean
}

export default styled(Text)`
${tw`font-light leading-normal text-lg mb-6`}
${({ inline }) => inline && tw`inline-block mr-4`}
${({ theme }) => theme.typography.body}
color: ${({ theme, backgroundType }) =>
  theme.colors.text[backgroundType === 'dark' ? 'white' : 'base']};

  > * {
    ${tw`mb-4`}
  }

  strong {
    ${tw`font-bold`}
  }

  ul {
    ${tw`list-disc ml-6`}
  }

  a {
    ${tw`underline`}
  }
`
