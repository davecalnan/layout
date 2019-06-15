import React from 'react'
import { PropTypes } from '@layouthq/prop-types'

import { H2, P } from '@layouthq/components/dist/typography'
import Button from '@layouthq/components/dist/button'

const Spotlight = ({
  heading,
  text,
  buttonText,
  buttonPath,
  imageSource,
  imagePosition = 'left'
}) => (
  <section
    className={[
      'w-full border-b border-gray-200 sm:flex',
      imagePosition === 'left' ? 'sm:flex-row-reverse' : 'sm:flex-row'
    ].join(' ')}
  >
    <div className="flex flex-col justify-center sm:w-2/3">
      <div className="p-8 sm:px-20 sm:pt-20 sm:pb-12 ">
        <H2>{heading}</H2>
        <P className="mt-6">{text}</P>
        <Button href={buttonPath} className="mt-6">
          {buttonText}
        </Button>
      </div>
    </div>
    {/* <div
      style={{
        backgroundImage: `url(${imageSource})`,
        minWidth: '20rem'
      }}
      className="w-1/3 h-auto bg-cover bg-center bg-gray-300"
    /> */}
    <div className="h-64 sm:w-1/3 sm:h-auto">
      <img
        src={imageSource}
        className="w-full h-full object-cover bg-gray-300"
      />
    </div>
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

export default Spotlight
