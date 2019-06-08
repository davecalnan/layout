const Button = ({
  compact,
  disabled,
  onClick,
  className,
  children,
  ...props
}) => (
  <button
    {...props}
    onClick={disabled ? undefined : onClick}
    className={[
      className,
      'rounded shadow text-center',
      compact
        ? 'text-base px-2'
        : 'text-lg px-4 py-1',
      disabled
        ? 'text-gray-700 bg-gray-400 cursor-not-allowed'
        : 'text-black bg-white'
    ].join(' ')}
  >
    {children}
  </button>
)

export default Button
