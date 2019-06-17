import React from 'react'
import { PropTypes } from '@layouthq/prop-types'

const Banner = ({
  imageSource,
  imagePosition,
  children
}) => (
  <section
    className={[
      'flex flex-col-reverse w-full border-b border-gray-200 sm:h-screen',
      imagePosition === 'left' ? 'sm:flex-row-reverse' : 'sm:flex-row'
    ].join(' ')}
  >
    <div className="flex flex-col justify-center sm:w-1/2 sm:h-full ">
      <div className="p-12">
        {children}
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
