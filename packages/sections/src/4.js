import React from 'react'
import { PropTypes } from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const CallToAction = ({ children, id, className }) => (
  <section id={id} className={className}>
    <div>{children}</div>
  </section>
)

CallToAction.propTypes = {
  alignment: PropTypes.list(['left', 'center', 'right'])
}

CallToAction.defaultProps = {
  alignment: 'center'
}

export default styled(CallToAction)`
${tw`flex flex-col w-full border-b px-4 py-12 sm:px-8`}
background-color: ${({ theme }) => theme.colors.background.base};
border-color: ${({ theme }) => theme.colors.border.base};
align-items: ${({ alignment }) => {
  switch (alignment) {
    case 'left': return 'flex-start'
    case 'center': return 'center'
    case 'right': return 'flex-end'
  }
}};
`
