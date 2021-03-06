import React from 'react'
import PropTypes from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Button = ({ text, link, className }) => {
  return (
    <a
      className={className}
      href={link}
    >
      {text}
    </a>
  )
}

Button.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary'])
}

export default styled(Button)`
${tw`inline-block text-xs border rounded-full uppercase tracking-wider px-12 py-4 mb-4 mr-2`}
${({ theme }) => theme.typography.body}
background-color: ${({ theme, type }) => theme.colors[type].base};
border-color: ${({ theme, type }) => type === 'primary' ? theme.colors.primary.base : theme.colors.border.base};
color: ${({ theme, type }) => theme.colors[type].text};

  &:hover {
    background-color: ${({ theme, type }) => theme.colors[type].hover};
    border-color: ${({ theme, type }) => type === 'primary' && theme.colors[type].hover};
  }

  &:focus {
    ${tw`outline-none shadow-outline`}
  }
`
