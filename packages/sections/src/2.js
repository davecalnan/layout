import React from 'react'
import { PropTypes } from '@layouthq/prop-types'
import { buildContext, styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const { withTheme } = buildContext

const Spotlight = ({ imageSource, children, className }) => (
  <section className={className}>
    <div>
      <div>{children}</div>
    </div>
    <div style={{ backgroundImage: `url(${imageSource})` }}/>
  </section>
)

Spotlight.propTypes = {
  heading: PropTypes.string,
  text: PropTypes.text,
  buttonText: PropTypes.string,
  buttonPath: PropTypes.string,
  imageSource: PropTypes.string,
  imagePosition: PropTypes.list(['left', 'right'])
}

Spotlight.defaultProps = {
  imagePosition: 'left'
}

export default withTheme(styled(Spotlight)`
  ${tw`flex flex-col-reverse w-full border-b border-gray-200`}
  ${({ imagePosition }) =>
    imagePosition === 'left' ? tw`sm:flex-row-reverse` : tw`sm:flex-row`}
  background-color: ${({ theme }) => theme.colors.background.base};
  border-color: ${({ theme }) => theme.colors.border.base};

  & > div:first-child {
    ${tw`flex flex-col justify-center sm:w-2/3`}

    & > div {
      ${tw`p-8 sm:px-20 sm:pt-20 sm:pb-12`}
    }
  }

  & > div:last-child {
    ${tw`h-64 bg-cover bg-gray-300 sm:w-1/3 sm:h-auto`}
    min-width: '20rem';
  }
`)
