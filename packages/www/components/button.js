const Button = ({
  action,
  compact,
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
      className={[
        className,
        'rounded shadow text-center',
        action === 'primary'
          ? 'bg-black text-white'
          : 'bg-white text-black',
        compact ? 'text-base px-2' : 'text-lg px-4 py-1',
        disabled ? 'text-gray-700 bg-gray-400 cursor-not-allowed' : ''
      ].join(' ')}
    >
      {children}
    </Tag>
  )
}

export default Button
