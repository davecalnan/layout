import styled from 'styled-components'
import tw from 'tailwind.macro'

const baseClasses = tw`bg-white rounded border border-gray-400 px-2 py-1`

export const Input = styled.input`${baseClasses} ${tw``}`
export const Select = styled.select`${baseClasses} ${tw`appearance-none`}`
export const Textarea = styled.textarea`${baseClasses} ${tw``}`
