import React from 'react'

const Heading = ({ text, level, className }) => {
  const Tag = `h${level}`
  return (
    <Tag
      className={[
        className,
        'font-light leading-none tracking-tight mb-6',
        Number(level) === 1 ? 'text-5xl' : '',
        Number(level) === 2 ? 'text-4xl' : '',
        Number(level) === 3 ? 'text-3xl' : '',
        Number(level) === 4 ? 'text-2xl' : '',
        Number(level) === 5 ? 'text-xl' : '',
        Number(level) === 6 ? 'text-lg' : ''
      ].join(' ')}
    >
      {text}
    </Tag>
  )
}

export default Heading
