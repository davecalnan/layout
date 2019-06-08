import styled from 'styled-components'
import tw from 'tailwind.macro'

import { toSentenceCase } from '../../util'

const baseClasses = tw`bg-white rounded border border-gray-400 px-2 py-1`

export const Input = styled.input`${baseClasses} ${tw``}`
export const Select = styled.select`${baseClasses} ${tw`appearance-none`}`
export const Textarea = styled.textarea`${baseClasses} ${tw``}`

export const makeInputComponent = ({ propType, ...props }) => {
  switch (propType.type) {
    case 'string':
      return <Input {...props} />
    case 'text':
      return <Textarea {...props} rows={5} />
    case 'list':
      return (
        <Select {...props}>
          {propType.options.map((option, index) => (
            <option key={option} value={option}>
              {toSentenceCase(option)}
            </option>
          ))}
        </Select>
      )
    default:
      return '¯\\_(ツ)_/¯'
  }
}
