import React from 'react'
import { PropTypes } from '@layouthq/prop-types'

import { H1, P } from '@layouthq/components/dist/typography'
import Button from '@layouthq/components/dist/button'

const Banner = ({
  heading,
  text,
  buttonText,
  buttonPath,
  imageSource,
  imagePosition
}) => (
  <section
    className={[
      'flex flex-col-reverse w-full border-b border-gray-200 sm:h-screen',
      imagePosition === 'left' ? 'sm:flex-row-reverse' : 'sm:flex-row'
    ].join(' ')}
  >
    <div className="flex flex-col justify-center sm:w-1/2 sm:h-full ">
      <div className="p-12">
        <H1>{heading}</H1>
        <P className="mt-6">{text}</P>
        <Button href={buttonPath} className="mt-6">
          {buttonText}
        </Button>
      </div>
    </div>
    <img
      src={imageSource}
      className="h-64 w-full object-cover bg-gray-300 sm:w-1/2 sm:h-full"
    />
  </section>
)

Banner.propTypes = {
  heading: PropTypes.string,
  text: PropTypes.text,
  buttonText: PropTypes.string,
  buttonPath: PropTypes.string,
  imageSource: PropTypes.string,
  imagePosition: PropTypes.list(['left', 'right'])
}

Banner.defaultProps = {
  imagePosition: 'right'
}

export default Banner
