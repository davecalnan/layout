import React from 'react'
import { PropTypes } from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Footer = ({ copyrightText, className }) => (
  <footer className={className}>
    <p>{copyrightText}</p>
  </footer>
)

Footer.propTypes = {
  copyrightText: PropTypes.string
}

export default styled(Footer)`
  ${tw`text-center px-8 py-12`}
  background-color: ${({ theme }) => theme.colors.background.base};

  & > p {
    ${tw`font-light text-lg leading-normal`}
    ${({ theme }) => theme.typography.body}
  }

  a {
    ${tw`underline`}
  }
`
