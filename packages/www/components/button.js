import classNames from 'classnames'

const Button = ({
  action,
  compact,
  icon,
  disabled,
  onClick,
  href,
  openInNewTab,
  className,
  children,
  ...props
}) => {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag
      {...props}
      onClick={disabled ? undefined : onClick}
      href={disabled ? undefined : href}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noreferrer noopener' : undefined}
      className={classNames(
        className,
        'inline-block rounded shadow text-center',
        action === 'primary'
          ? 'bg-blue-600 text-white'
          : 'bg-white text-black',
        compact
          ? 'text-base px-2'
          : icon
          ? 'text-base px-1'
          : 'text-lg px-4 py-1',
        disabled ? 'text-gray-700 bg-gray-400 cursor-not-allowed' : ''
     )}
    >
      {children}
    </Tag>
  )
}

export default Button
