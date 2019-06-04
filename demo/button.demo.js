import styled from 'styled-components'
import tw from 'tailwind.macro'

const Button = ({ children, className, ...props }) => (
  <a
    className={`${className} inline-block text-xs border border-gray-400 rounded-full uppercase tracking-wider px-12 py-4`}
    {...props}
  >
    {children}
  </a>
)

export default Button
