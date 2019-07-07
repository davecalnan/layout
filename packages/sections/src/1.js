import React from 'react'
import PropTypes from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Banner = ({ imageSource, children, id, className }) => (
  <section id={id} className={className}>
    <div>
      <div>{children}</div>
    </div>
    <div style={{ backgroundImage: `url(${imageSource})` }} />
  </section>
)

Banner.propTypes = {
  imageSource: PropTypes.string,
  imagePosition: PropTypes.oneOf(['left', 'right'])
}

Banner.defaultProps = {
  imagePosition: 'right'
}

export default styled(Banner)`
${tw`flex flex-col-reverse w-full border-b sm:min-h-screen sm:h-full`}
${({ imagePosition }) => imagePosition === 'left' && tw`sm:flex-row-reverse`}
${({ imagePosition }) => imagePosition === 'right' && tw`sm:flex-row`}
background-color: ${({ theme }) => theme.colors.background.base};
border-color: ${({ theme }) => theme.colors.border.base};

  & > div:first-child {
    ${tw`flex flex-col justify-center sm:w-1/2 sm:h-full`}

    & > div {
      ${tw`p-12`}
    }
  }

  & > div:last-child {
    ${tw`h-64 bg-cover bg-center bg-gray-300 sm:w-1/2 sm:h-auto`}
    min-width: '20rem';
  }
`
