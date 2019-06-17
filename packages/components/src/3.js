import React from 'react'

const Button = ({ text, link, type, children, className, ...props }) => (
  <a
    className={[
      className,
      'inline-block text-xs border rounded-full uppercase tracking-wider px-12 py-4 mr-4 mb-4',
      type === 'primary' ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-900 hover:border-gray-900' : '',
      type === 'secondary' ? 'bg-transparent text-black border-gray-400 hover:bg-gray-100' : ''
    ].join(' ')}
    href={link}
    {...props}
  >
    {text}
  </a>
)

export default Button
