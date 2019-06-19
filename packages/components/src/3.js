import React from 'react'
import { PropTypes } from '@layouthq/prop-types'
import { buildContext, styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const { withTheme } = buildContext

const Button = ({ text, link, type, theme, ...props }) => {
  return (
    <a
      {...props}
      href={link}
    >
      {text}
    </a>
  )
}

Button.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
  type: PropTypes.list(['primary', 'secondary'])
}

export default withTheme(styled(Button)`
${tw`inline-block text-xs border rounded-full uppercase tracking-wider px-12 py-4 mr-4 mb-4`}
${({ theme }) => theme.typography.body}
background-color: ${({ theme, type }) => theme.colors[type].base};
border-color: ${({ theme, type }) => type === 'primary' ? theme.colors.primary.base : theme.colors.border.base};
color: ${({ theme, type }) => theme.colors[type].text};

  &:hover {
    background-color: ${({ theme, type }) => theme.colors[type].hover};
    border-color: ${({ theme, type }) => type === 'primary' && theme.colors[type].hover};
  }
`)
