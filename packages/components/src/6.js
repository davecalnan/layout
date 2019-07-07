import React from 'react'
import PropTypes from '@layouthq/prop-types'
import { styled } from '@layouthq/renderer'
import tw from 'tailwind.macro'

const InputGroup = ({ name, type, label, placeholder, defaultValue, required }) => (
  <>
    {label && <label htmlFor={name}>{label}</label>}
    <input type={type} name={name} placeholder={placeholder} defaultValue={defaultValue} required={required} />
  </>
)

const Form = ({ name, action, afterSubmit, fields, className }) => (
  <form className={className} action={action} method="post">
    <input type="hidden" name="form-name" value={name} />
    <input
      type="hidden"
      name="after-submit"
      value={JSON.stringify(afterSubmit)}
    />
    {fields.map(
      ({ uuid, name, type, label, placeholder, defaultValue, required }) => (
        <InputGroup
          key={uuid}
          name={name}
          type={type}
          label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
        />
      )
    )}
    <button type="submit">Submit</button>
  </form>
)

Form.propTypes = {
  ...PropTypes.form,
  name: PropTypes.string,
  fields: PropTypes.array,
  redirectAfterSubmit: PropTypes.string
}

export default styled(Form)`
${tw`inline-block max-w-full mb-6 mr-4`}
${({ theme }) => theme.typography.body}

  & label {
    ${tw`block mb-2`}
  }

  & input {
    ${tw`flex-1 rounded-full border overflow-x-hidden py-3 px-4 sm:px-6 mb-4`}
    border-color: ${({ theme }) => theme.colors.primary.base};

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary.hover};
    }

    &:focus {
      ${tw`outline-none shadow-outline`}
    }

    &:last-of-type {
      ${tw`mb-6`}
    }
  }

  & button {
    ${tw`block text-xs rounded-full uppercase tracking-wider py-4 px-8`}
    background-color: ${({ theme }) =>
      theme.colors.primary.base};
    border-color: ${({ theme }) => theme.colors.primary.base};
    color: ${({ theme }) => theme.colors.primary.text};

    &:hover {
      background-color: ${({ theme }) =>
        theme.colors.primary.hover};
    }

    &:focus {
      ${tw`outline-none shadow-outline`}
    }
  }
`
