const baseHeadingClasses = 'font-light leading-none tracking-tight'

export const H1 = ({ children, className, props }) => (
  <h1
    className={[className, baseHeadingClasses, 'text-5xl'].join(' ')}
    {...props}
  >
    {children}
  </h1>
)

export const H2 = ({ children, className, props }) => (
  <h2
    className={[className, baseHeadingClasses, 'text-4xl'].join(' ')}
    {...props}
  >
    {children}
  </h2>
)

export const P = ({ children, className, props }) => (
  <p
    className={[className, 'font-light text-lg leading-normal'].join(' ')}
    {...props}
  >
    {children}
  </p>
)
