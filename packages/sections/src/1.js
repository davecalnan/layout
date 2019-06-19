import React from 'react'
import { PropTypes } from '@layouthq/prop-types'
import { buildContext, styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const { withTheme } = buildContext

const Banner = ({ imageSource, children, className }) => (
  <section className={className}>
    <div>
      <div>
        {children}
      </div>
    </div>
    <img src={imageSource} />
  </section>
)

Banner.propTypes = {
  imageSource: PropTypes.string,
  imagePosition: PropTypes.list(['left', 'right'])
}

Banner.defaultProps = {
  imagePosition: 'right'
}

export default withTheme(styled(Banner)`
${tw`flex flex-col-reverse w-full border-b border-gray-200 sm:h-screen`}
${({ imagePosition }) => imagePosition === 'left' ? tw`sm:flex-row-reverse` : tw`sm:flex-row`}
background-color: ${({ theme }) => theme.colors.background.base};

  & > div {
    ${tw`flex flex-col justify-center sm:w-1/2 sm:h-full`}

    & > div {
      ${tw`p-12`}
    }
  }

  & > img {
    ${tw`h-64 w-full object-cover bg-gray-300 sm:w-1/2 sm:h-full`}
  }
`)
