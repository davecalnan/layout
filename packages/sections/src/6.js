import React from 'react'
import PropTypes from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Hero = ({ imageSource, backgroundColor, children, id, className }) => (
  <section
    id={id}
    className={className}
    style={{ backgroundColor, backgroundImage: `url(${imageSource})` }}
  >
    <div className="container">
      <div>
        {React.Children.map(children, child =>
          React.cloneElement(child, { backgroundType: 'dark' })
        )}
      </div>
    </div>
  </section>
)

Hero.propTypes = {
  imageSource: PropTypes.string,
  backgroundColor: PropTypes.string,
  alignment: PropTypes.oneOf(['left', 'center', 'right'])
}

export default styled(Hero)`
background-size: cover;
background-blend-mode: multiply;

  > div {
    ${tw`flex flex-col mx-auto`}
    align-items: ${({ alignment }) => {
      switch (alignment) {
        case 'left':
          return 'flex-start'
        case 'center':
          return 'center'
        case 'right':
          return 'flex-end'
      }
    }};

    > div {
      ${tw`max-w-md mt-24 mb-20`}
    }
  }
`
