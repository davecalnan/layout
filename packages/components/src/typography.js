import React from 'react'

const baseHeadingClasses = 'font-light leading-none tracking-tight'

export const H1 = ({ className, children, props }) => (
  <h1
    className={[className, baseHeadingClasses, 'text-5xl'].join(' ')}
    {...props}
  >
    {children}
  </h1>
)

export const H2 = ({ className, children, props }) => (
  <h2
    className={[className, baseHeadingClasses, 'text-4xl'].join(' ')}
    {...props}
  >
    {children}
  </h2>
)

export const P = ({ className, children, props }) => (
  <p
    className={[className, 'font-light text-lg leading-normal'].join(' ')}
    {...props}
  >
    {children}
  </p>
)
