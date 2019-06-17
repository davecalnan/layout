import React from 'react'
import { PropTypes } from '@layouthq/prop-types'

const Spotlight = ({
  children,
  imageSource,
  imagePosition = 'left'
}) => (
  <section
    className={[
      'flex flex-col-reverse w-full border-b border-gray-200',
      imagePosition === 'left' ? 'sm:flex-row-reverse' : 'sm:flex-row'
    ].join(' ')}
  >
    <div className="flex flex-col justify-center sm:w-2/3">
      <div className="p-8 sm:px-20 sm:pt-20 sm:pb-12">{children}</div>
    </div>
    <div
      style={{
        backgroundImage: `url(${imageSource})`,
        minWidth: '20rem'
      }}
      className="h-64 bg-cover bg-gray-300 sm:w-1/3 sm:h-auto"
    />
    {/* <div className="h-64 sm:w-1/3 sm:h-auto">
      <img
        src={imageSource}
        className="w-full h-full object-cover bg-gray-300"
      />
    </div> */}
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
