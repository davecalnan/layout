import styled from 'styled-components'
import tw from 'tailwind.macro'

import { toSentenceCase } from '@layouthq/util'

const baseStyles = tw`bg-white rounded border border-gray-400 px-2 py-1`

export const Input = styled.input`${baseStyles} ${props => props.disabled && tw`text-gray-900 bg-gray-100 cursor-disabled`}`
export const Checkbox = styled.input`${baseStyles} ${tw``}`
export const Select = styled.select`${baseStyles} ${tw`appearance-none`}`
export const Textarea = styled.textarea`${baseStyles} ${tw``}`

export const makeInputComponent = (propType, props) => {
  switch (propType.type) {
    case 'boolean':
      return <Checkbox {...props} type="checkbox" />
    case 'string':
      return <Input {...props} />
    case 'text':
      return <Textarea {...props} rows={5} />
    case 'list':
      return (
        <Select {...props}>
          {propType.options.map((option, index) => (
            <option key={option} value={option}>
              {typeof option === 'string' ? toSentenceCase(option) : option}
            </option>
          ))}
        </Select>
      )
    default:
      return '¯\\_(ツ)_/¯'
  }
}
