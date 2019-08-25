import React from 'react'
import PropTypes from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Heading = ({ text, level, className }) => {
  const Tag = `h${level}`
  return <Tag className={className}>{text}</Tag>
}

Heading.propTypes = {
  ...PropTypes.typography,
  text: PropTypes.string,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6])
}

export default styled(Heading)`
${tw`leading-none tracking-tight mb-6`}
${({ level }) => level === 1 && tw`text-5xl`}
${({ level }) => level === 2 && tw`text-4xl`}
${({ level }) => level === 3 && tw`text-3xl`}
${({ level }) => level === 4 && tw`text-2xl`}
${({ level }) => level === 5 && tw`text-xl`}
${({ level }) => level === 6 && tw`text-lg`}
${({ theme }) => theme.typography.headings}
color: ${({ theme, backgroundType }) =>
  theme.colors.text[backgroundType === 'dark' ? 'white' : 'base']};
`
