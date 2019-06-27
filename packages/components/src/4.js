import React from 'react'
import PropTypes from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const Image = ({ url, alt, className, maxWidth, maxHeight }) => (
  <img
    src={url}
    alt={alt}
    className={className}
    style={{
      maxWidth,
      maxHeight
    }}
  />
)

Image.propTypes = ({
  url: PropTypes.string,
  alt: PropTypes.string,
  maxWidth: PropTypes.string,
  maxHeight: PropTypes.string
})

export default styled(Image)`
${tw`mb-6`}
`
