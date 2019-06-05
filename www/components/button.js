const Button = ({ disabled, onClick, className, children, ...props }) => (
  <button
    {...props}
    onClick={disabled ? undefined : onClick}
    className={[
      className,
      'text-lg rounded shadow px-4 py-1',
      disabled ? 'text-gray-700 bg-gray-300 cursor-not-allowed' : 'text-black bg-white'
    ].join(' ')}
  >
    {children}
  </button>
)

export default Button
