import React from 'react'
import PropTypes from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const EmailSignup = ({ name, action, label, placeholderText, className }) => (
  <form className={className} action={action} method="post">
    <input type="hidden" name="form-name" value={name} />
    {label && <label htmlFor="email">{label}</label>}
    <div>
      <input type="email" name="email" placeholder={placeholderText} required />
      <button type="submit">Submit</button>
    </div>
  </form>
)

EmailSignup.propTypes = {
  ...PropTypes.form,
  buttonText: PropTypes.string,
  buttonType: PropTypes.list(['primary', 'secondary']),
  label: PropTypes.string,
  placeholderText: PropTypes.string
}

export default styled(EmailSignup)`
${tw`inline-block max-w-full mb-6 mr-4`}
${({ theme }) => theme.typography.body}

  & > label {
    ${tw`block mb-2`}
  }

  & > div {
    ${tw`flex`}

    & > input {
      ${tw`flex-1 rounded-l-full border overflow-x-hidden py-3 px-4 sm:px-6`}
      border-color: ${({ theme, buttonType }) => theme.colors[buttonType].base};

      &:hover {
        background-color: ${({ theme }) => theme.colors.secondary.hover};
      }

      &:focus {
        ${tw`outline-none shadow-outline`}
      }
    }

    & > button {
      ${tw`text-xs rounded-r-full uppercase tracking-wider py-3 px-4 sm:px-6`}
      background-color: ${({ theme, buttonType }) =>
        theme.colors[buttonType].base};
      border-color: ${({ theme, buttonType }) => theme.colors[buttonType].base};
      color: ${({ theme, buttonType }) => theme.colors[buttonType].text};

      &:hover {
        background-color: ${({ theme, buttonType }) =>
          theme.colors[buttonType].hover};
      }

      &:focus {
        ${tw`outline-none shadow-outline`}
      }
    }
  }
`
