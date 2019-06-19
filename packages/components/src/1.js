import React from 'react'
import { PropTypes } from '@layouthq/prop-types'
import { buildContext, styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const { withTheme } = buildContext

const Heading = ({ text, level, theme, ...props }) => {
  const Tag = `h${level}`
  return (
    <Tag
      {...props}
    >
      {text}
    </Tag>
  )
}

Heading.propTypes = {
  text: PropTypes.string,
  level: PropTypes.list([1, 2, 3, 4, 5, 6])
}

export default withTheme(styled(Heading)`
${tw`leading-none tracking-tight mb-6`}
${({ level }) => level === 1 && tw`text-5xl`}
${({ level }) => level === 2 && tw`text-4xl`}
${({ level }) => level === 3 && tw`text-3xl`}
${({ level }) => level === 4 && tw`text-2xl`}
${({ level }) => level === 5 && tw`text-xl`}
${({ level }) => level === 6 && tw`text-lg`}
${({ theme }) => theme.typography.headings}
color: ${({ theme }) => theme.colors.text.base};
`)
