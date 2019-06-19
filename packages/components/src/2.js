import React from 'react'
import { PropTypes } from '@layouthq/prop-types'
import ReactMarkdown from 'react-markdown'
import { buildContext, styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const { withTheme } = buildContext

const Text = ({ markdown, theme, ...props }) => (
  <ReactMarkdown {...props} source={markdown} />
)

Text.propTypes = {
  markdown: PropTypes.text
}

export default withTheme(styled(Text)`
${tw`font-light leading-normal text-lg mb-6`}
${({ theme }) => theme.typography.body}
color: ${({ theme }) => theme.colors.text.base};

  * {
    ${tw`mb-4`}
  }

  strong {
    ${tw`font-bold`}
  }
`)
