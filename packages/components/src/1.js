import React from 'react'
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

export default withTheme(styled(Heading)`
${tw`font-light leading-none tracking-tight mb-6`}
${({ level }) => Number(level) === 1 && tw`text-5xl`}
${({ level }) => Number(level) === 2 && tw`text-4xl`}
${({ level }) => Number(level) === 3 && tw`text-3xl`}
${({ level }) => Number(level) === 4 && tw`text-2xl`}
${({ level }) => Number(level) === 5 && tw`text-xl`}
${({ level }) => Number(level) === 6 && tw`text-lg`}
${({ theme }) => theme.typography.headings}
color: ${({ theme }) => theme.colors.text.base};
`)
