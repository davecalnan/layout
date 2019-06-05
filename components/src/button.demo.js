import React from 'react'

const Button = ({ className, children, ...props }) => (
  <a
    className={`${className} inline-block text-xs border border-gray-400 rounded-full uppercase tracking-wider px-12 py-4`}
    {...props}
  >
    {children}
  </a>
)

export default Button
